import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// All SA High Courts + appellate courts
const COURTS = [
  { code: 'ZAGPJHC', name: 'South Gauteng High Court, Johannesburg', province: 'Gauteng' },
  { code: 'ZAGPPHC', name: 'North Gauteng High Court, Pretoria', province: 'Gauteng' },
  { code: 'ZAWCHC', name: 'Western Cape High Court', province: 'Western Cape' },
  { code: 'ZAKZDHC', name: 'KwaZulu-Natal High Court, Durban', province: 'KwaZulu-Natal' },
  { code: 'ZAKZPHC', name: 'KwaZulu-Natal High Court, Pietermaritzburg', province: 'KwaZulu-Natal' },
  { code: 'ZAECGHC', name: 'Eastern Cape High Court, Makhanda', province: 'Eastern Cape' },
  { code: 'ZAECMHC', name: 'Eastern Cape High Court, Mthatha', province: 'Eastern Cape' },
  { code: 'ZAFSHC', name: 'Free State High Court', province: 'Free State' },
  { code: 'ZANCHC', name: 'Northern Cape High Court', province: 'Northern Cape' },
  { code: 'ZALMPHC', name: 'Limpopo High Court', province: 'Limpopo' },
  { code: 'ZANWHC', name: 'North West High Court', province: 'North West' },
  { code: 'ZAMPHC', name: 'Mpumalanga High Court', province: 'Mpumalanga' },
  { code: 'ZASCA', name: 'Supreme Court of Appeal', province: null },
  { code: 'ZACC', name: 'Constitutional Court', province: null },
];

const CRIME_KEYWORDS = ['rape', 'murder', 'assault', 'robbery', 'fraud', 'theft', 'kidnap', 'arson', 'drug', 'firearm', 'weapon', 'sexual', 'violence', 'domestic', 'gbv', 'homicide', 'culpable', 'housebreaking', 'burglary', 'trafficking'];

function isCriminalCase(title: string): boolean {
  const lower = title.toLowerCase();
  // "S v Name" or "Name v S" patterns
  if (/\bs\s+v\s+/i.test(title) || /\bv\s+s\b/i.test(title) || /v\s+the\s+state/i.test(title)) {
    return true;
  }
  // Check for crime keywords in the title
  return CRIME_KEYWORDS.some(kw => lower.includes(kw));
}

function extractAccusedName(title: string): { fullName: string; surname: string; firstName: string } | null {
  let name = '';

  // Pattern: "S v Name ..."
  const svMatch = title.match(/\bS\s+v\s+([A-Z][a-zA-Zà-ÿ\-']+(?:\s+[A-Z][a-zA-Zà-ÿ\-']+)*)/);
  if (svMatch) {
    name = svMatch[1];
  } else {
    // Pattern: "Name v S" or "Name v The State"
    const vsMatch = title.match(/^([A-Z][a-zA-Zà-ÿ\-']+(?:\s+[A-Z][a-zA-Zà-ÿ\-']+)*)\s+v\s+(?:S|The\s+State)/);
    if (vsMatch) {
      name = vsMatch[1];
    }
  }

  if (!name) return null;

  // Strip "and Another", "and Others", case numbers in parens
  name = name.replace(/\s+and\s+(Another|Others?).*$/i, '');
  name = name.replace(/\s*\(.*\)\s*$/, '');
  name = name.trim();

  if (!name || name.length < 2) return null;

  const parts = name.split(/\s+/);
  const surname = parts[parts.length - 1];
  const firstName = parts.length > 1 ? parts[0] : '';

  return { fullName: name, surname, firstName };
}

function extractChargeKeywords(title: string): string[] {
  const lower = title.toLowerCase();
  return CRIME_KEYWORDS.filter(kw => lower.includes(kw));
}

function extractCaseNumber(title: string): string | null {
  // e.g. (SS 063/2016) or (CC 12/2024) or (A104/2021)
  const match = title.match(/\(([^)]+)\)/);
  if (match) return match[1].trim();
  return null;
}

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '');
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Accept optional params to target specific court/year
    let targetCourtCode: string | null = null;
    let targetYear: number | null = null;

    try {
      const body = await req.json();
      targetCourtCode = body.court_code || null;
      targetYear = body.year || null;
    } catch {
      // No body = auto-pick next court/year
    }

    // If no specific target, pick the next court/year to process
    if (!targetCourtCode || !targetYear) {
      const currentYear = new Date().getFullYear();
      const years = Array.from({ length: currentYear - 2019 }, (_, i) => currentYear - i); // 2026 down to 2020

      // Find what we've already indexed
      const { data: indexed } = await supabase
        .from('saflii_judgments')
        .select('court_code, year')
        .order('created_at', { ascending: false })
        .limit(1);

      const lastCourt = indexed?.[0]?.court_code || null;
      const lastYear = indexed?.[0]?.year || null;

      // Cycle to next court/year
      let courtIdx = lastCourt ? COURTS.findIndex(c => c.code === lastCourt) : -1;
      let yearIdx = lastYear ? years.indexOf(lastYear) : -1;

      // Move to next year, or next court
      yearIdx++;
      if (yearIdx >= years.length) {
        yearIdx = 0;
        courtIdx++;
        if (courtIdx >= COURTS.length) courtIdx = 0;
      }

      targetCourtCode = COURTS[courtIdx >= 0 ? courtIdx : 0].code;
      targetYear = years[yearIdx >= 0 ? yearIdx : 0];
    }

    const court = COURTS.find(c => c.code === targetCourtCode);
    if (!court) {
      return new Response(
        JSON.stringify({ error: `Unknown court code: ${targetCourtCode}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Indexing SAFLII: ${court.code} / ${targetYear}`);

    const listingUrl = `https://www.saflii.org/za/cases/${court.code}/${targetYear}/`;
    
    let response: Response;
    try {
      response = await fetch(listingUrl, {
        headers: { 'User-Agent': 'RedFlaq-Indexer/1.0 (https://redflaq.com; respects crawl-delay)' },
      });
    } catch (fetchErr) {
      // Deno strict TLS may reject SAFLII's cert chain — use Firecrawl as fallback
      console.error('Fetch failed (likely TLS):', fetchErr);

      // Try via a simple proxy approach: use the Firecrawl API if available
      const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
      if (firecrawlKey) {
        console.log('Falling back to Firecrawl for HTML fetch');
        const fcResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${firecrawlKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: listingUrl, formats: ['rawHtml'], onlyMainContent: false }),
        });
        const fcData = await fcResponse.json();
        console.log('Firecrawl response keys:', JSON.stringify(Object.keys(fcData)), 'data keys:', fcData.data ? JSON.stringify(Object.keys(fcData.data)) : 'none');
        console.log('Firecrawl success:', fcData.success, 'status:', fcResponse.status);
        const htmlContent = fcData.data?.rawHtml || fcData.rawHtml || fcData.data?.html || fcData.html;
        if (fcData.success && htmlContent) {
          response = new Response(htmlContent, { status: 200 });
        } else {
          return new Response(
            JSON.stringify({ success: false, error: 'TLS issue and Firecrawl fallback failed' }),
            { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } else {
        return new Response(
          JSON.stringify({ success: false, error: 'TLS certificate issue with SAFLII. Configure Firecrawl for fallback.' }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    if (!response.ok) {
      console.log(`No listing for ${court.code}/${targetYear}: ${response.status}`);
      return new Response(
        JSON.stringify({ success: true, message: `No listing found for ${court.code}/${targetYear}`, indexed: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const html = await response.text();

    // Parse case links from the listing page
    // SAFLII listings use: <a href="https://www.saflii.org/za/cases/ZAGPJHC/2025/1.html" class="make-database">Case Title</a>
    // Also handle relative URLs: <a href="/za/cases/...">
    const linkRegex = /<a\s+href="((?:https?:\/\/www\.saflii\.org)?\/za\/cases\/[^"]+\.html)"[^>]*>([^<]+)<\/a>/gi;
    const cases: { url: string; title: string }[] = [];
    let match;

    while ((match = linkRegex.exec(html)) !== null) {
      let url = match[1];
      const title = match[2].trim();
      // Normalize to full URL
      if (url.startsWith('/')) {
        url = `https://www.saflii.org${url}`;
      }
      if (title && url.includes(court.code)) {
        cases.push({ url, title });
      }
    }

    console.log(`Found ${cases.length} total cases for ${court.code}/${targetYear}`);

    // Filter for criminal cases and extract data
    const criminalCases = cases.filter(c => isCriminalCase(c.title));
    console.log(`${criminalCases.length} criminal cases identified`);

    const records: any[] = [];

    for (const caseItem of criminalCases) {
      const accused = extractAccusedName(caseItem.title);
      if (!accused) continue;

      records.push({
        accused_name: accused.fullName,
        accused_surname: accused.surname,
        accused_first_name: accused.firstName || null,
        name_normalized: normalizeName(accused.fullName),
        charge_keywords: extractChargeKeywords(caseItem.title),
        court_code: court.code,
        court_name: court.name,
        province: court.province,
        year: targetYear,
        case_number: extractCaseNumber(caseItem.title),
        case_title: caseItem.title,
        saflii_url: caseItem.url,
        is_criminal: true,
      });
    }

    // Upsert in batches of 50
    let insertedCount = 0;
    for (let i = 0; i < records.length; i += 50) {
      const batch = records.slice(i, i + 50);
      const { error } = await supabase
        .from('saflii_judgments')
        .upsert(batch, { onConflict: 'saflii_url', ignoreDuplicates: true });

      if (error) {
        console.error(`Upsert error for batch ${i}:`, error);
      } else {
        insertedCount += batch.length;
      }
    }

    console.log(`Indexed ${insertedCount} criminal judgments for ${court.code}/${targetYear}`);

    return new Response(
      JSON.stringify({
        success: true,
        court: court.code,
        year: targetYear,
        total_cases: cases.length,
        criminal_cases: criminalCases.length,
        indexed: insertedCount,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in index-saflii:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
