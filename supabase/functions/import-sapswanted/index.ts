const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, ' ').trim();
}

function categorizeOffense(crime: string): string[] {
  const c = crime.toLowerCase();
  const cats: string[] = [];
  if (c.includes('murder') || c.includes('homicide')) cats.push('Murder/Homicide');
  if (c.includes('rape') || c.includes('sexual')) cats.push('Sexual Offenses');
  if (c.includes('robbery') || c.includes('theft') || c.includes('burglary') || c.includes('housebreaking')) cats.push('Robbery/Theft');
  if (c.includes('fraud') || c.includes('forgery') || c.includes('corruption')) cats.push('Fraud/Financial Crime');
  if (c.includes('assault') || c.includes('gbh')) cats.push('Assault');
  if (c.includes('drug') || c.includes('dealing')) cats.push('Drug Offenses');
  if (c.includes('kidnap') || c.includes('abduction')) cats.push('Kidnapping');
  if (c.includes('arson') || c.includes('malicious damage')) cats.push('Arson/Property Damage');
  if (cats.length === 0) cats.push('Other');
  return cats;
}

interface ParsedPerson {
  name: string;
  crime: string;
  status: string;
  photoUrl: string | null;
  detailUrl: string | null;
}

function parsePersonCards(html: string): ParsedPerson[] {
  const persons: ParsedPerson[] = [];

  // Split by card wrappers
  const cardPattern = /wanted-people-card-wrapper/g;
  const cardSections: string[] = [];
  
  // Split HTML by card boundaries
  const parts = html.split('wanted-people-card-wrapper');
  
  for (let i = 1; i < parts.length; i++) {
    const card = parts[i];
    
    // Extract name from span-description after "Name:"
    const nameMatch = card.match(/Name:<\/span><span[^>]*class="span-description"[^>]*>([^<]+)<\/span>/);
    // Extract crime
    const crimeMatch = card.match(/Crime:<\/span><span[^>]*class="span-description"[^>]*>\(?([^<)]+)\)?<\/span>/);
    // Extract status
    const statusMatch = card.match(/Status:<\/span><span[^>]*class="span-description"[^>]*>([^<]+)<\/span>/);
    // Extract photo URL from img src
    const photoMatch = card.match(/src="([^"]*thumbnail\.php[^"]*)"/);
    // Extract detail URL
    const detailMatch = card.match(/href="([^"]*detail\.php[^"]*)"/);

    if (!nameMatch) continue;
    
    const name = nameMatch[1].trim();
    if (name === 'Unknown Unknown' || name.length < 3) continue;

    persons.push({
      name,
      crime: crimeMatch ? crimeMatch[1].trim() : 'Unknown',
      status: statusMatch ? statusMatch[1].trim() : 'Wanted',
      photoUrl: photoMatch ? photoMatch[1].trim() : null,
      detailUrl: detailMatch ? detailMatch[1].trim() : null,
    });
  }

  return persons;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlKey) {
      return new Response(JSON.stringify({ success: false, error: 'FIRECRAWL_API_KEY not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching sapswanted.netlify.app via Firecrawl...');

    const scrapeRes = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://sapswanted.netlify.app',
        formats: ['html'],
        waitFor: 5000,
      }),
    });

    const scrapeData = await scrapeRes.json();
    if (!scrapeRes.ok || !scrapeData.success) {
      console.error('Firecrawl error:', scrapeData);
      return new Response(JSON.stringify({ success: false, error: 'Failed to scrape sapswanted.netlify.app' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const html = scrapeData.data?.html || scrapeData.html || '';
    console.log(`Got HTML (${html.length} chars)`);

    const persons = parsePersonCards(html);
    console.log(`Parsed ${persons.length} persons`);

    if (persons.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        message: 'No persons parsed from HTML. The site structure may have changed.',
        enriched: 0, inserted: 0, skipped: 0,
        html_length: html.length,
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    let enriched = 0, inserted = 0, skipped = 0;
    const errors: string[] = [];

    for (const person of persons) {
      try {
        const normalized = normalizeName(person.name);
        const offenseCategories = categorizeOffense(person.crime);

        // Check for existing record
        const { data: existing } = await supabase
          .from('wanted_persons')
          .select('id, photo_url, detail_page_url, charges, alleged_offenses, offense_categories, legal_status, source_urls')
          .eq('name_normalized', normalized)
          .limit(1);

        if (existing && existing.length > 0) {
          const record = existing[0];
          const updates: Record<string, unknown> = {};

          // Enrich photo if missing
          if (!record.photo_url && person.photoUrl) {
            updates.photo_url = person.photoUrl;
            updates.photo_source = 'saps';
          }

          // Enrich detail URL if missing
          if (!record.detail_page_url && person.detailUrl) {
            updates.detail_page_url = person.detailUrl;
          }

          // Append offense if not already present
          const currentOffenses = record.alleged_offenses || [];
          if (!currentOffenses.includes(person.crime)) {
            updates.alleged_offenses = [...currentOffenses, person.crime];
          }

          // Merge offense categories
          const currentCats = record.offense_categories || [];
          const newCats = [...new Set([...currentCats, ...offenseCategories])];
          if (newCats.length > currentCats.length) {
            updates.offense_categories = newCats;
          }

          // Update legal status if different and more specific
          if (person.status.toLowerCase() !== (record.legal_status || '').toLowerCase()) {
            updates.legal_status = person.status.toLowerCase();
          }

          // Add source URL
          const currentUrls = record.source_urls || [];
          const sapsUrl = 'https://sapswanted.netlify.app';
          if (!currentUrls.includes(sapsUrl)) {
            updates.source_urls = [...currentUrls, sapsUrl];
          }

          if (Object.keys(updates).length > 0) {
            updates.found_in_saps = true;
            const { error } = await supabase
              .from('wanted_persons')
              .update(updates)
              .eq('id', record.id);
            if (error) throw error;
            enriched++;
          } else {
            skipped++;
          }
        } else {
          // Insert new record
          const nameParts = person.name.split(' ');
          const firstName = nameParts[0];
          const surname = nameParts.slice(1).join(' ');

          const { error } = await supabase.from('wanted_persons').insert({
            full_name: person.name,
            first_name: firstName,
            surname: surname || null,
            name_normalized: normalized,
            charges: person.crime,
            alleged_offenses: [person.crime],
            offense_categories: offenseCategories,
            legal_status: person.status.toLowerCase(),
            photo_url: person.photoUrl,
            photo_source: person.photoUrl ? 'saps' : null,
            detail_page_url: person.detailUrl,
            source_url: 'https://sapswanted.netlify.app',
            source_urls: ['https://sapswanted.netlify.app'],
            source_dataset: 'sapswanted_netlify',
            country: 'South Africa',
            found_in_saps: true,
            is_active: true,
            risk_level: 'red',
          });
          if (error) throw error;
          inserted++;
        }
      } catch (err) {
        console.error(`Error processing ${person.name}:`, err);
        errors.push(`${person.name}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    const result = { success: true, total_parsed: persons.length, enriched, inserted, skipped, errors };
    console.log('Import result:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Import error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
