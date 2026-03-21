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

// Words that should NEVER be a first name — they're surname prefixes, places, or generic words
const INVALID_FIRST_NAMES = new Set([
  'VAN', 'DE', 'DU', 'LE', 'LA', 'VON', 'TEN', 'TER', 'DER', 'DEN', 'EL',
  'ROAD', 'STREET', 'AVENUE', 'DRIVE', 'PLACE', 'COURT', 'PARK', 'FIRE',
  'THE', 'AND', 'FOR', 'NOT', 'WITH', 'FROM', 'THAT', 'THIS', 'HAVE',
  'CAPE', 'NORTH', 'SOUTH', 'EAST', 'WEST', 'TOWN', 'CITY',
  'CASE', 'STATE', 'MATTER', 'BETWEEN', 'APPEAL', 'ORDER', 'JUDGMENT',
  'REPUBLIC', 'MINISTER', 'DEPARTMENT', 'DIRECTOR', 'GENERAL', 'NATIONAL',
  'REPORTABLE', 'CRIMINAL', 'CIVIL', 'APPLICATION', 'REVIEW',
  'HIGH', 'SUPREME', 'MAGISTRATE', 'REGIONAL', 'BENCH', 'FULL', 'DIVISION',
  'WESTERN', 'EASTERN', 'NORTHERN', 'SOUTHERN', 'KWAZULU', 'NATAL',
  'GAUTENG', 'LIMPOPO', 'MPUMALANGA', 'FREE',
]);

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
 * Validate a first name — returns null if invalid
 */
function validateFirstName(name: string): string | null {
  if (!name || name.trim().length < 2) return null;
  const upper = name.trim().toUpperCase();
  if (INVALID_FIRST_NAMES.has(upper)) return null;
  // Check each part of multi-word first names
  const parts = upper.split(/\s+/);
  for (const part of parts) {
    if (INVALID_FIRST_NAMES.has(part)) return null;
    if (part.length < 2) return null;
  }
  // Reject if it's all numbers or special chars
  if (!/[A-Z]/.test(upper)) return null;
  return name.trim();
}

/**
 * Extract full party names from the judgment body HTML.
 * Looks for "In the matter between:" block and extracts
 * FIRSTNAME(S) SURNAME — ROLE patterns.
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
  const matterMatch = text.match(/[Ii]n\s+the\s+matter\s+between[:\s]*([\s\S]{0,3000}?)(?:JUDGMENT|INTRODUCTION|ORDER|REASONS|BACKGROUND|HEARD|DELIVERED)/);
  if (matterMatch) {
    partyBlock = matterMatch[1];
  } else {
    // Try broader: find "between" up to "and" section ending with JUDGMENT etc
    const altMatch = text.match(/between[:\s]*([\s\S]{0,3000}?)(?:JUDGMENT|INTRODUCTION|ORDER|REASONS|BACKGROUND)/i);
    if (altMatch) {
      partyBlock = altMatch[1];
    } else {
      const endMatch = text.search(/\b(?:JUDGMENT|INTRODUCTION|ORDER|REASONS|BACKGROUND)\b/);
      partyBlock = text.substring(0, endMatch > 0 ? endMatch : 3000);
    }
  }

  partyBlock = partyBlock.replace(/\s+/g, ' ');

  // Pattern 1: ALL-CAPS name followed by em-dash/dash + ordinal + role keyword
  const regex = /\b([A-Z][A-Z'-]+(?:\s+[A-Z][A-Z'-]+)+)\s*[—–-]?\s*(?:(?:FIRST|SECOND|THIRD|FOURTH|FIFTH|SIXTH|SEVENTH|EIGHTH|NINTH|TENTH|THE|1ST|2ND|3RD|[0-9]+TH)\s+)?(APPELLANT|ACCUSED|RESPONDENT|APPLICANT|DEFENDANT|COMPLAINANT)\b/g;

  let match;
  while ((match = regex.exec(partyBlock)) !== null) {
    const rawName = match[1].trim();
    const role = match[2].trim();
    // Filter out institutional/generic names
    if (/^(IN THE|THE STATE|THE MATTER|BETWEEN|AND|CASE|REPUBLIC|MINISTER|DEPARTMENT|COURT|HIGH|SUPREME|REPORTABLE|NOT|JUDGMENT|CRIMINAL|APPEAL|APPLICATION|WESTERN|EASTERN|NORTHERN|SOUTH|CAPE|DIVISION|FULL|BENCH|KWAZULU|DIRECTOR|GENERAL|NATIONAL)/i.test(rawName)) continue;
    if (rawName.length < 4) continue;
    const nameParts = rawName.split(/\s+/).filter(p => p.length >= 2);
    if (nameParts.length < 2) continue;
    if (!nameParts.every(p => p === p.toUpperCase())) continue;
    
    // Handle surname prefixes: "VAN DER" etc should be part of surname
    let firstNameParts: string[] = [];
    let lastNameParts: string[] = [];
    const SURNAME_PREFIXES = new Set(['VAN', 'DE', 'DU', 'LE', 'LA', 'VON', 'TEN', 'TER', 'DER', 'DEN', 'EL']);
    
    // Walk from the end to find where surname starts (including prefixes)
    let surnameStart = nameParts.length - 1;
    while (surnameStart > 0 && SURNAME_PREFIXES.has(nameParts[surnameStart - 1])) {
      surnameStart--;
    }
    
    firstNameParts = nameParts.slice(0, surnameStart);
    lastNameParts = nameParts.slice(surnameStart);
    
    if (firstNameParts.length === 0 || lastNameParts.length === 0) continue;
    
    const firstName = firstNameParts.join(' ');
    const lastName = lastNameParts.join(' ');
    
    // Validate first name
    const validatedFirst = validateFirstName(firstName);
    
    if (!parties.some(p => p.firstName === (validatedFirst || '') && p.lastName === lastName)) {
      parties.push({ 
        firstName: validatedFirst || '', 
        lastName, 
        role: role.toUpperCase() 
      });
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
    
    const SURNAME_PREFIXES = new Set(['VAN', 'DE', 'DU', 'LE', 'LA', 'VON', 'TEN', 'TER', 'DER', 'DEN', 'EL']);
    let surnameStart = nameParts.length - 1;
    while (surnameStart > 0 && SURNAME_PREFIXES.has(nameParts[surnameStart - 1])) {
      surnameStart--;
    }
    
    const firstNameParts = nameParts.slice(0, surnameStart);
    const lastNameParts = nameParts.slice(surnameStart);
    
    if (firstNameParts.length === 0 || lastNameParts.length === 0) continue;
    
    const firstName = firstNameParts.join(' ');
    const lastName = lastNameParts.join(' ');
    const validatedFirst = validateFirstName(firstName);
    
    if (!parties.some(p => p.firstName === (validatedFirst || '') && p.lastName === lastName)) {
      parties.push({ firstName: validatedFirst || '', lastName, role: 'ACCUSED' });
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
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'RedFlaq-Indexer/1.0 (https://redflaq.com; respects crawl-delay)' },
    });
    if (response.ok) return await response.text();
  } catch (e) {
    console.error('Direct fetch failed for', url);
  }

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
    let reindexMode = false;
    let testUrls: string[] = [];

    try {
      const body = await req.json();
      targetCourtCode = body.court_code || null;
      targetYear = body.year || null;
      reindexMode = body.reindex === true;
      testUrls = body.test_urls || [];
    } catch {
      // No body = auto-pick
    }

    // TEST MODE: fetch specific URLs and return extracted names
    if (testUrls.length > 0) {
      const testResults: any[] = [];
      for (const url of testUrls) {
        const html = await fetchWithFallback(url);
        if (html) {
          const parties = extractPartiesFromBody(html);
          testResults.push({ url, parties, partyCount: parties.length });
        } else {
          testResults.push({ url, error: 'Failed to fetch', parties: [], partyCount: 0 });
        }
      }
      return new Response(JSON.stringify({ success: true, test_results: testResults }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // RE-INDEX MODE: re-process existing records
    if (reindexMode) {
      // First, clear garbage first names
      const { data: allRecords } = await supabase
        .from('saflii_judgments')
        .select('id, saflii_url, accused_first_name, accused_surname, accused_name')
        .order('created_at', { ascending: true });

      if (!allRecords || allRecords.length === 0) {
        return new Response(JSON.stringify({ success: true, message: 'No records to re-index' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      let updatedCount = 0;
      let validFirstNames = 0;
      let nullFirstNames = 0;
      let bodiesFetched = 0;

      for (const record of allRecords) {
        if (!record.saflii_url) continue;

        // Check if current first name is garbage
        const currentFirst = record.accused_first_name;
        const isGarbage = currentFirst && !validateFirstName(currentFirst);
        
        if (isGarbage) {
          // Clear garbage first name immediately
          await supabase.from('saflii_judgments').update({ accused_first_name: null }).eq('id', record.id);
        }

        // Rate limit: max 50 bodies per re-index run
        if (bodiesFetched >= 50) {
          // Just count remaining
          if (record.accused_first_name && validateFirstName(record.accused_first_name)) {
            validFirstNames++;
          } else {
            nullFirstNames++;
          }
          continue;
        }

        try {
          await delay(600); // Respect crawl delay
          const html = await fetchWithFallback(record.saflii_url);
          bodiesFetched++;

          if (html) {
            const parties = extractPartiesFromBody(html);
            const accusedParties = parties.filter(p => /ACCUSED|APPELLANT|APPLICANT|DEFENDANT/i.test(p.role));

            if (accusedParties.length > 0) {
              const party = accusedParties[0];
              const validFirst = validateFirstName(party.firstName);
              const fullName = validFirst ? `${validFirst} ${party.lastName}` : party.lastName;

              await supabase.from('saflii_judgments').update({
                accused_first_name: validFirst || null,
                accused_surname: party.lastName,
                accused_name: fullName,
                name_normalized: normalizeName(fullName),
              }).eq('id', record.id);

              updatedCount++;
              if (validFirst) validFirstNames++;
              else nullFirstNames++;
              continue;
            }
          }
        } catch (e) {
          console.error(`Re-index failed for ${record.saflii_url}:`, e);
        }

        // Count as-is if we couldn't update
        const validatedCurrent = record.accused_first_name ? validateFirstName(record.accused_first_name) : null;
        if (validatedCurrent) validFirstNames++;
        else nullFirstNames++;
      }

      return new Response(JSON.stringify({
        success: true,
        reindex: true,
        total_records: allRecords.length,
        updated: updatedCount,
        valid_first_names: validFirstNames,
        null_first_names: nullFirstNames,
        bodies_fetched: bodiesFetched,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // NORMAL INDEX MODE
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

    const linkRegex = /<a\s+href="((?:https?:\/\/www\.saflii\.org)?\/za\/cases\/[^"]+\.html)"[^>]*>([^<]+)<\/a>/gi;
    const cases: { url: string; title: string }[] = [];
    let linkMatch;
    while ((linkMatch = linkRegex.exec(listingHtml)) !== null) {
      let url = linkMatch[1];
      const title = linkMatch[2].trim();
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
    const MAX_BODY_FETCHES = 30;

    for (const caseItem of criminalCases) {
      const titleAccused = extractAccusedNameFromTitle(caseItem.title);
      const caseNumber = extractCaseNumber(caseItem.title);
      const chargeKeywords = extractChargeKeywords(caseItem.title);

      if (bodiesFetched < MAX_BODY_FETCHES) {
        try {
          await delay(500);
          const judgmentHtml = await fetchWithFallback(caseItem.url);
          bodiesFetched++;

          if (judgmentHtml) {
            const parties = extractPartiesFromBody(judgmentHtml);
            
            const bodyLower = judgmentHtml.toLowerCase();
            const bodyCharges = CRIME_KEYWORDS.filter(kw => bodyLower.includes(kw));
            const allCharges = [...new Set([...chargeKeywords, ...bodyCharges])];

            if (parties.length > 0) {
              for (const party of parties) {
                const isAccused = /ACCUSED|APPELLANT|APPLICANT|DEFENDANT/i.test(party.role);
                if (!isAccused) continue;

                const validFirst = validateFirstName(party.firstName);
                const fullName = validFirst ? `${validFirst} ${party.lastName}` : party.lastName;
                
                records.push({
                  accused_name: fullName,
                  accused_surname: party.lastName,
                  accused_first_name: validFirst || null,
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
              continue;
            }
          }
        } catch (e) {
          console.error(`Failed to fetch judgment body: ${caseItem.url}`, e);
        }
      }

      // Fallback: title-only extraction
      if (titleAccused) {
        const validFirst = validateFirstName(titleAccused.firstName);
        records.push({
          accused_name: titleAccused.fullName,
          accused_surname: titleAccused.surname,
          accused_first_name: validFirst || null,
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

    // Upsert in batches of 50
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
