import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchParams {
  full_name?: string;
  sa_id_number?: string;
  date_of_birth?: string;
  province?: string;
  case_number?: string;
  police_station?: string;
  payment_id?: string;
}

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '');
}

function parseCaseNumber(input: string): { type: string; normalized: string } {
  const trimmed = input.trim();
  const policePattern = /^(CAS\s*)?(\d{1,4})\/(\d{1,2})\/(\d{4})(\/[A-Z]+)?$/i;
  if (policePattern.test(trimmed)) {
    const m = trimmed.match(policePattern)!;
    return { type: 'police', normalized: `${m[2]}/${m[3]}/${m[4]}` };
  }
  const courtPattern1 = /^[A-Z]+\d+\/\d{4}$/i;
  if (courtPattern1.test(trimmed)) {
    return { type: 'court', normalized: trimmed.toUpperCase() };
  }
  const courtPattern2 = /^\[\d{4}\]\s+[A-Z]+\s+\d+$/i;
  if (courtPattern2.test(trimmed)) {
    return { type: 'court', normalized: trimmed.toUpperCase() };
  }
  return { type: 'unknown', normalized: trimmed };
}

function getRecommendation(matches: any[]): string {
  if (matches.length === 0) {
    return "No records found. This person may have a clean record.";
  }
  if (matches.length === 1 && matches[0].confidence >= 80) {
    return "Strong match found. High confidence this is the correct person.";
  }
  if (matches.length === 1 && matches[0].confidence < 80) {
    return "Possible match found. Verify additional details before concluding.";
  }
  if (matches.length > 1 && matches[0].confidence >= 70) {
    return "Multiple matches found. Review all results carefully to identify the correct person.";
  }
  return "Multiple weak matches. Human verification strongly recommended.";
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const params: SearchParams = await req.json();
    const { full_name, sa_id_number, date_of_birth, province, case_number, police_station, payment_id } = params;

    // Validate: at least one parameter
    const hasAny = [full_name, sa_id_number, date_of_birth, case_number].some(v => v && v.length > 0);
    if (!hasAny) {
      return new Response(
        JSON.stringify({ error: 'Please provide at least one search parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Server-side credit deduction
    if (payment_id) {
      const { data: payment, error: fetchErr } = await supabase
        .from('manual_payments')
        .select('credits_used, search_credits, status')
        .eq('payment_id', payment_id)
        .single();

      if (fetchErr || !payment) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid payment ID' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (payment.credits_used >= payment.search_credits) {
        return new Response(
          JSON.stringify({ success: false, error: 'No credits remaining' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Deduct credit using service role (bypasses RLS)
      const { error: updateErr } = await supabase
        .from('manual_payments')
        .update({ credits_used: payment.credits_used + 1 })
        .eq('payment_id', payment_id);

      if (updateErr) {
        console.error('Credit deduction error:', updateErr);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to deduct credit' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    let matches: any[] = [];
    const searchStrategies: string[] = [];

    // Strategy 1: Case Number (Highest Confidence)
    if (case_number) {
      searchStrategies.push('case_number');
      const parsed = parseCaseNumber(case_number);

      if (parsed.type === 'police' || parsed.type === 'unknown') {
        const { data: sapsMatches } = await supabase
          .from('wanted_persons')
          .select('*')
          .eq('is_active', true)
          .contains('saps_case_numbers', [parsed.normalized]);

        if (sapsMatches && sapsMatches.length > 0) {
          matches.push(...sapsMatches.map(m => ({ ...m, match_type: 'case_number_exact', confidence: 95 })));
        }

        // Fallback: search legacy case_number field
        if (matches.length === 0) {
          const { data: legacyMatches } = await supabase
            .from('wanted_persons')
            .select('*')
            .eq('is_active', true)
            .ilike('case_number', `%${case_number}%`);

          if (legacyMatches && legacyMatches.length > 0) {
            matches.push(...legacyMatches.map(m => ({ ...m, match_type: 'case_number_legacy', confidence: 85 })));
          }
        }
      }

      if (parsed.type === 'court' || (parsed.type === 'unknown' && matches.length === 0)) {
        const { data: courtMatches } = await supabase
          .from('wanted_persons')
          .select('*')
          .eq('is_active', true)
          .contains('court_case_numbers', [parsed.normalized]);

        if (courtMatches && courtMatches.length > 0) {
          matches.push(...courtMatches.map(m => ({ ...m, match_type: 'court_case_exact', confidence: 93 })));
        }

        // Fallback: search legacy court_case_number field
        if (matches.length === 0) {
          const { data: legacyCourt } = await supabase
            .from('wanted_persons')
            .select('*')
            .eq('is_active', true)
            .ilike('court_case_number', `%${case_number}%`);

          if (legacyCourt && legacyCourt.length > 0) {
            matches.push(...legacyCourt.map(m => ({ ...m, match_type: 'court_case_legacy', confidence: 83 })));
          }
        }
      }
    }

    // Strategy 2: ID Number (High Confidence)
    if (sa_id_number && matches.length === 0) {
      searchStrategies.push('id_number');

      const { data: idMatches } = await supabase
        .from('wanted_persons')
        .select('*')
        .eq('is_active', true)
        .eq('id_number', sa_id_number);

      if (idMatches && idMatches.length > 0) {
        matches.push(...idMatches.map(m => ({ ...m, match_type: 'id_exact', confidence: 90 })));
      }

      // Partial ID (last 4 digits)
      if (matches.length === 0 && sa_id_number.length >= 4) {
        const last4 = sa_id_number.slice(-4);
        const { data: partialMatches } = await supabase
          .from('wanted_persons')
          .select('*')
          .eq('is_active', true)
          .eq('sa_id_partial', last4);

        if (partialMatches && partialMatches.length > 0) {
          matches.push(...partialMatches.map(m => ({ ...m, match_type: 'id_partial', confidence: 60 })));
        }
      }
    }

    // Strategy 3: Name + Filters (Medium Confidence)
    if (full_name && matches.length === 0) {
      searchStrategies.push('name_filtered');
      const normalized = normalizeName(full_name);

      let query = supabase
        .from('wanted_persons')
        .select('*')
        .eq('is_active', true)
        .eq('country', 'South Africa')
        .eq('name_normalized', normalized);

      if (province) {
        query = query.eq('province', province);
      }
      if (police_station) {
        query = query.ilike('police_station', `%${police_station}%`);
      }

      const { data: nameMatches } = await query;

      if (nameMatches && nameMatches.length > 0) {
        let confidence = 30;
        if (date_of_birth) confidence += 25;
        if (province) confidence += 15;
        if (police_station) confidence += 10;

        matches.push(...nameMatches.map(m => ({
          ...m,
          match_type: 'name_filtered',
          confidence: Math.min(confidence, 85),
        })));
      }
    }

    // Strategy 4: Fuzzy Name (Low Confidence)
    if (full_name && matches.length === 0) {
      searchStrategies.push('name_fuzzy');

      const nameParts = full_name.trim().split(/\s+/);
      const firstName = nameParts[0];
      const surname = nameParts[nameParts.length - 1];

      const { data: fuzzyMatches } = await supabase
        .from('wanted_persons')
        .select('*')
        .eq('is_active', true)
        .or(`full_name.ilike.%${full_name}%,full_name.ilike.%${firstName}%,full_name.ilike.%${surname}%`)
        .limit(10);

      if (fuzzyMatches && fuzzyMatches.length > 0) {
        matches.push(...fuzzyMatches.map(m => ({
          ...m,
          match_type: 'name_fuzzy',
          confidence: 25,
        })));
      }
    }

    // Deduplicate by ID
    const seen = new Set<string>();
    matches = matches.filter(m => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });

    // Sort by confidence descending
    matches.sort((a, b) => b.confidence - a.confidence);

    // Determine if human verification needed
    const needsHumanReview =
      matches.length > 3 ||
      (matches.length > 0 && matches[0].confidence < 70);

    // Track duplicate groups for analytics
    if (matches.length > 1 && full_name) {
      try {
        await supabase.from('duplicate_name_groups').insert({
          normalized_name: normalizeName(full_name),
          person_ids: matches.map(m => m.id),
          match_count: matches.length,
          flagged_for_review: needsHumanReview,
        });
      } catch (e) {
        console.error('Failed to log duplicate group:', e);
      }
    }

    const searchId = `search-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    console.log(`Multi-parameter search: strategies=${searchStrategies.join(',')}, matches=${matches.length}`);

    return new Response(
      JSON.stringify({
        success: true,
        searchId,
        matches_found: matches.length,
        search_strategies_used: searchStrategies,
        results: matches,
        needs_human_verification: needsHumanReview,
        recommendation: getRecommendation(matches),
        // Backward-compatible fields
        isWanted: matches.length > 0,
        riskLevel: matches.length > 0 ? 'RED' : 'GREEN',
        riskScore: matches.length > 0 ? 100 : 0,
        wantedPersonsCount: matches.length,
        wantedPersons: matches,
        hasMultipleMatches: matches.length > 1,
        searchIdentifier: full_name || case_number || sa_id_number || '',
        searchedAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in multi-parameter-search:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
