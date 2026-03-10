import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DATASETS = [
  {
    name: 'za_wanted',
    url: 'https://data.opensanctions.org/datasets/latest/za_wanted/targets.simple.csv',
    defaultCountry: 'South Africa',
  },
  {
    name: 'za_fic_sanctions',
    url: 'https://data.opensanctions.org/datasets/latest/za_fic_sanctions/targets.simple.csv',
    defaultCountry: 'South Africa',
  },
];

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '');
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') { current += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else { current += ch; }
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (ch === ',') { fields.push(current.trim()); current = ''; }
      else { current += ch; }
    }
  }
  fields.push(current.trim());
  return fields;
}

function extractNames(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return { first_name: parts[0] || null, surname: null };
  return { first_name: parts[0], surname: parts[parts.length - 1] };
}

function mapOffenseCategory(sanctions: string, dataset: string): string[] {
  const cats: string[] = [];
  const s = (sanctions || '').toLowerCase();
  if (dataset === 'za_fic_sanctions') cats.push('sanctions');
  if (s.includes('terror')) cats.push('terrorism');
  if (s.includes('fraud') || s.includes('financial')) cats.push('fraud');
  if (s.includes('murder') || s.includes('homicide')) cats.push('murder');
  if (s.includes('assault') || s.includes('violence') || s.includes('gbv')) cats.push('GBV');
  if (s.includes('drug') || s.includes('narcotic')) cats.push('drugs');
  if (s.includes('theft') || s.includes('robbery')) cats.push('theft');
  if (s.includes('sexual') || s.includes('rape')) cats.push('sexual_offense');
  if (cats.length === 0) cats.push('other');
  return cats;
}

async function importDataset(
  supabase: any,
  dataset: { name: string; url: string; defaultCountry: string | null }
) {
  const stats = { inserted: 0, skipped: 0, errors: 0 };

  console.log(`Fetching ${dataset.name}...`);
  const res = await fetch(dataset.url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

  const csv = await res.text();
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return stats;

  const headers = parseCSVLine(lines[0]);
  const col: Record<string, number> = {};
  headers.forEach((h, i) => { col[h] = i; });

  // Delete existing for this dataset (idempotent)
  await supabase.from('wanted_persons').delete().eq('source_dataset', dataset.name);

  // Parse all rows
  const records: any[] = [];
  for (let i = 1; i < lines.length; i++) {
    try {
      const f = parseCSVLine(lines[i]);
      const entityId = f[col['id']] || '';
      const schema = f[col['schema']] || '';
      const name = f[col['name']] || '';
      if (!name || schema !== 'Person') { stats.skipped++; continue; }

      const aliasesRaw = f[col['aliases']] || '';
      const birthDate = f[col['birth_date']] || '';
      const countries = f[col['countries']] || '';
      const sanctions = f[col['sanctions']] || '';

      const { first_name, surname } = extractNames(name);
      const aliases = aliasesRaw ? aliasesRaw.split(';').map(a => a.trim()).filter(Boolean) : [];
      const country = countries ? countries.split(';')[0].trim() : (dataset.defaultCountry || 'Unknown');

      let yearOfBirth: number | null = null;
      if (birthDate) {
        const m = birthDate.match(/(\d{4})/);
        if (m) yearOfBirth = parseInt(m[1]);
      }

      // Use SAPS list page as fallback (individual SAPS detail pages can't be reliably derived from OpenSanctions IDs)
      const sapsListUrl = 'https://www.saps.gov.za/crimestop/wanted/list.php';
      const primaryUrl = sapsListUrl;
      const detailPageUrl: string | null = null;

      records.push({
        full_name: name.toUpperCase(),
        first_name: first_name?.toUpperCase() || null,
        surname: surname?.toUpperCase() || null,
        name_normalized: normalizeName(name),
        aliases,
        country: 'South Africa',
        source_dataset: dataset.name,
        source_urls: [primaryUrl, opensanctionsUrl],
        source_url: primaryUrl,
        detail_page_url: detailPageUrl,
        charges: sanctions || `Listed in ${dataset.name}`,
        offense_categories: mapOffenseCategory(sanctions, dataset.name),
        legal_status: dataset.name === 'za_fic_sanctions' ? 'sanctioned' : 'wanted',
        year_of_birth: yearOfBirth,
        is_active: true,
        found_in_saps: dataset.name === 'za_wanted',
        risk_level: dataset.name === 'za_fic_sanctions' ? 'high' : 'red',
      });
    } catch (e) {
      stats.errors++;
    }
  }

  // Bulk insert in batches of 100
  for (let i = 0; i < records.length; i += 100) {
    const batch = records.slice(i, i + 100);
    const { error } = await supabase.from('wanted_persons').insert(batch);
    if (error) {
      console.error(`Batch insert error at ${i}: ${error.message}`);
      stats.errors += batch.length;
    } else {
      stats.inserted += batch.length;
    }
  }

  console.log(`${dataset.name}: ${stats.inserted} inserted, ${stats.skipped} skipped, ${stats.errors} errors`);
  return stats;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let selectedDatasets = DATASETS;
    try {
      const body = await req.json();
      if (body.datasets && Array.isArray(body.datasets)) {
        selectedDatasets = DATASETS.filter(d => body.datasets.includes(d.name));
      }
    } catch { /* no body = all datasets */ }

    const results: Record<string, any> = {};
    for (const dataset of selectedDatasets) {
      try {
        const stats = await importDataset(supabase, dataset);
        results[dataset.name] = stats;
        await supabase.from('admin_events').insert({
          event_type: 'opensanctions_import',
          details: { dataset: dataset.name, ...stats },
          performed_by: 'system_cron',
        });
      } catch (e) {
        results[dataset.name] = { error: e instanceof Error ? e.message : String(e) };
        console.error(`${dataset.name} failed:`, e);
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Import error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
