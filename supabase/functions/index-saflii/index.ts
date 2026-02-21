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
  if (/\bs\s+v\s+/i.test(title) || /\bv\s+s\b/i.test(title) || /v\s+the\s+state/i.test(title)) {
    return true;
  }
  return CRIME_KEYWORDS.some(kw => lower.includes(kw));
}

function extractAccusedNameFromTitle(title: string): { fullName: string; surname: string; firstName: string } | null {
  let name = '';
  const svMatch = title.match(/\bS\s+v\s+([A-Z][a-zA-Zà-ÿ\-']+(?:\s+[A-Z][a-zA-Zà-ÿ\-']+)*)/);
  if (svMatch) {
    name = svMatch[1];
  } else {
    const vsMatch = title.match(/^([A-Z][a-zA-Zà-ÿ\-']+(?:\s+[A-Z][a-zA-Zà-ÿ\-']+)*)\s+v\s+(?:S|The\s+State)/);
    if (vsMatch) name = vsMatch[1];
  }
  if (!name) return null;
  name = name.replace(/\s+and\s+(Another|Others?).*$/i, '');
  name = name.replace(/\s*\(.*\)\s*$/, '');
  name = name.trim();
  if (!name || name.length < 2) return null;
  const parts = name.split(/\s+/);
  const surname = parts[parts.length - 1];
  const firstName = parts.length > 1 ? parts[0] : '';
  return { fullName: name, surname, firstName };
}

/**
 * CRITICAL FIX: Extract full party names from the judgment body HTML.
 * Looks for patterns like:
 *   KELLY MALIZANA — FIRST APPELLANT
 *   THANDOWANI MBOTO — SECOND APPELLANT
 *   "In the matter between:" block
 */
function extractPartiesFromBody(html: string): Array<{
  firstName: string;
  lastName: string;
  role: string;
}> {
  const parties: Array<{ firstName: string; lastName: string; role: string }> = [];
  
  const text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(p|div|span|td|tr|li|h[1-6])[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');

  // Extract ONLY the header/parties block to avoid false matches in body text
  let partyBlock = '';
  const matterMatch = text.match(/[Ii]n\s+the\s+matter\s+between[:\s]*([\s\S]{0,2000}?)(?:JUDGMENT|INTRODUCTION|ORDER|REASONS|BACKGROUND|HEARD|DELIVERED)/);
  if (matterMatch) {
    partyBlock = matterMatch[1];
  } else {
    const endMatch = text.search(/\b(?:JUDGMENT|INTRODUCTION|ORDER|REASONS|BACKGROUND)\b/);
    partyBlock = text.substring(0, endMatch > 0 ? endMatch : 3000);
  }

  partyBlock = partyBlock.replace(/\s+/g, ' ');

  // Pattern 1: ALL-CAPS name followed by role keyword
  const regex = /\b([A-Z][A-Z'-]+(?:\s+[A-Z][A-Z'-]+)+)\s*[—–-]?\s*(?:(?:FIRST|SECOND|THIRD|FOURTH|FIFTH|SIXTH|SEVENTH|EIGHTH|NINTH|TENTH|THE)\s+)?(APPELLANT|ACCUSED|RESPONDENT|APPLICANT|DEFENDANT|COMPLAINANT)\b/g;

  let match;
  while ((match = regex.exec(partyBlock)) !== null) {
    const rawName = match[1].trim();
    const role = match[2].trim();
    if (/^(IN THE|THE STATE|THE MATTER|BETWEEN|AND|CASE|REPUBLIC|MINISTER|DEPARTMENT|COURT|HIGH|SUPREME|REPORTABLE|NOT|JUDGMENT|CRIMINAL|APPEAL|APPLICATION|WESTERN|EASTERN|NORTHERN|SOUTH|CAPE|DIVISION|FULL|BENCH|KWAZULU)/i.test(rawName)) continue;
    if (rawName.length < 4) continue;
    const nameParts = rawName.split(/\s+/).filter(p => p.length >= 2);
    if (nameParts.length < 2) continue;
    if (!nameParts.every(p => p === p.toUpperCase())) continue;
    const firstName = nameParts.slice(0, -1).join(' ');
    const lastName = nameParts[nameParts.length - 1];
    if (!parties.some(p => p.firstName === firstName && p.lastName === lastName)) {
      parties.push({ firstName, lastName, role: role.toUpperCase() });
    }
  }

  // Pattern 2: "THE STATE and NAME NAME"
  const stateAndRegex = /THE\s+STATE\s+and\s+([A-Z][A-Z'-]+(?:\s+[A-Z][A-Z'-]+)+)/g;
  let stateMatch;
  while ((stateMatch = stateAndRegex.exec(partyBlock)) !== null) {
    const rawName = stateMatch[1].trim();
    if (/^(ANOTHER|OTHERS)/i.test(rawName)) continue;
    const nameParts = rawName.split(/\s+/).filter(p => p.length >= 2 && p === p.toUpperCase());
    if (nameParts.length < 2) continue;
    const firstName = nameParts.slice(0, -1).join(' ');
    const lastName = nameParts[nameParts.length - 1];
    if (!parties.some(p => p.firstName === firstName && p.lastName === lastName)) {
      parties.push({ firstName, lastName, role: 'ACCUSED' });
    }
  }

  return parties;
}

function extractChargeKeywords(title: string): string[] {
  const lower = title.toLowerCase();
  return CRIME_KEYWORDS.filter(kw => lower.includes(kw));
}

function extractCaseNumber(title: string): string | null {
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

async function fetchWithFallback(url: string): Promise<string | null> {
  // Try direct fetch first
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'RedFlaq-Indexer/1.0 (https://redflaq.com; respects crawl-delay)' },
    });
    if (response.ok) return await response.text();
  } catch (e) {
    console.error('Direct fetch failed for', url);
  }

  // Fallback to Firecrawl
  const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
  if (!firecrawlKey) return null;

  try {
    const fcResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, formats: ['rawHtml'], onlyMainContent: false }),
    });
    const fcData = await fcResponse.json();
    const htmlContent = fcData.data?.rawHtml || fcData.rawHtml || fcData.data?.html || fcData.html;
    if (fcData.success && htmlContent) return htmlContent;
  } catch (e) {
    console.error('Firecrawl fallback also failed for', url);
  }

  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let targetCourtCode: string | null = null;
    let targetYear: number | null = null;

    try {
      const body = await req.json();
      targetCourtCode = body.court_code || null;
      targetYear = body.year || null;
    } catch {
      // No body = auto-pick
    }

    if (!targetCourtCode || !targetYear) {
      const currentYear = new Date().getFullYear();
      const years = Array.from({ length: currentYear - 2019 }, (_, i) => currentYear - i);
      const { data: indexed } = await supabase
        .from('saflii_judgments')
        .select('court_code, year')
        .order('created_at', { ascending: false })
        .limit(1);

      const lastCourt = indexed?.[0]?.court_code || null;
      const lastYear = indexed?.[0]?.year || null;
      let courtIdx = lastCourt ? COURTS.findIndex(c => c.code === lastCourt) : -1;
      let yearIdx = lastYear ? years.indexOf(lastYear) : -1;
      yearIdx++;
      if (yearIdx >= years.length) { yearIdx = 0; courtIdx++; if (courtIdx >= COURTS.length) courtIdx = 0; }
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
    const listingHtml = await fetchWithFallback(listingUrl);
    
    if (!listingHtml) {
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to fetch listing page (TLS + Firecrawl both failed)' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse case links
    const linkRegex = /<a\s+href="((?:https?:\/\/www\.saflii\.org)?\/za\/cases\/[^"]+\.html)"[^>]*>([^<]+)<\/a>/gi;
    const cases: { url: string; title: string }[] = [];
    let match;
    while ((match = linkRegex.exec(listingHtml)) !== null) {
      let url = match[1];
      const title = match[2].trim();
      if (url.startsWith('/')) url = `https://www.saflii.org${url}`;
      if (title && url.includes(court.code)) {
        cases.push({ url, title });
      }
    }

    console.log(`Found ${cases.length} total cases for ${court.code}/${targetYear}`);
    const criminalCases = cases.filter(c => isCriminalCase(c.title));
    console.log(`${criminalCases.length} criminal cases identified`);

    const records: any[] = [];
    let bodiesFetched = 0;
    const MAX_BODY_FETCHES = 30; // Rate limit: max 30 judgment bodies per run

    for (const caseItem of criminalCases) {
      const titleAccused = extractAccusedNameFromTitle(caseItem.title);
      const caseNumber = extractCaseNumber(caseItem.title);
      const chargeKeywords = extractChargeKeywords(caseItem.title);

      // CRITICAL FIX: Fetch the judgment body to extract full party names
      if (bodiesFetched < MAX_BODY_FETCHES) {
        try {
          await delay(500); // Respect crawl delay
          const judgmentHtml = await fetchWithFallback(caseItem.url);
          bodiesFetched++;

          if (judgmentHtml) {
            const parties = extractPartiesFromBody(judgmentHtml);
            
            // Also try to extract charge context from judgment body
            const bodyLower = judgmentHtml.toLowerCase();
            const bodyCharges = CRIME_KEYWORDS.filter(kw => bodyLower.includes(kw));
            const allCharges = [...new Set([...chargeKeywords, ...bodyCharges])];

            if (parties.length > 0) {
              // Use the full names from the judgment body
              for (const party of parties) {
                // Only include accused/appellant parties (not the state/respondent in criminal cases)
                const isAccused = /ACCUSED|APPELLANT|APPLICANT|DEFENDANT/i.test(party.role);
                if (!isAccused) continue;

                const fullName = `${party.firstName} ${party.lastName}`;
                records.push({
                  accused_name: fullName,
                  accused_surname: party.lastName,
                  accused_first_name: party.firstName,
                  name_normalized: normalizeName(fullName),
                  charge_keywords: allCharges.length > 0 ? allCharges : chargeKeywords,
                  court_code: court.code,
                  court_name: court.name,
                  province: court.province,
                  year: targetYear,
                  case_number: caseNumber,
                  case_title: caseItem.title,
                  saflii_url: caseItem.url,
                  is_criminal: true,
                });
              }
              continue; // Skip fallback to title extraction
            }
          }
        } catch (e) {
          console.error(`Failed to fetch judgment body: ${caseItem.url}`, e);
        }
      }

      // Fallback: use title-only extraction (surname only)
      if (titleAccused) {
        records.push({
          accused_name: titleAccused.fullName,
          accused_surname: titleAccused.surname,
          accused_first_name: titleAccused.firstName || null,
          name_normalized: normalizeName(titleAccused.fullName),
          charge_keywords: chargeKeywords,
          court_code: court.code,
          court_name: court.name,
          province: court.province,
          year: targetYear,
          case_number: caseNumber,
          case_title: caseItem.title,
          saflii_url: caseItem.url,
          is_criminal: true,
        });
      }
    }

    // Upsert in batches of 50 — update in place (no delete)
    let insertedCount = 0;
    for (let i = 0; i < records.length; i += 50) {
      const batch = records.slice(i, i + 50);
      const { error } = await supabase
        .from('saflii_judgments')
        .upsert(batch, { onConflict: 'saflii_url', ignoreDuplicates: false });
      if (error) {
        console.error(`Upsert error for batch ${i}:`, error);
      } else {
        insertedCount += batch.length;
      }
    }

    console.log(`Indexed ${insertedCount} records (${bodiesFetched} judgment bodies fetched) for ${court.code}/${targetYear}`);

    return new Response(
      JSON.stringify({
        success: true,
        court: court.code,
        year: targetYear,
        total_cases: cases.length,
        criminal_cases: criminalCases.length,
        indexed: insertedCount,
        bodies_fetched: bodiesFetched,
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
