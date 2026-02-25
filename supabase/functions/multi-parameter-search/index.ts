import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface SearchParams {
  full_name?: string;
  sa_id_number?: string;
  date_of_birth?: string;
  province?: string;
  case_number?: string;
  police_station?: string;
  payment_id?: string;
  user_id?: string;
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

function categorizeOffense(charges: string): string[] {
  const categories: string[] = [];
  const lower = charges.toLowerCase();
  
  if (/murder|homicide|culpable/.test(lower)) categories.push('Murder / Homicide');
  if (/rape|sexual|indecent|molestation/.test(lower)) categories.push('Sexual Offense');
  if (/assault|gbh|bodily harm|violence|attack/.test(lower)) categories.push('Assault / Violence');
  if (/robbery|theft|steal|burglary|housebreaking|larceny/.test(lower)) categories.push('Robbery / Theft');
  if (/fraud|forgery|corruption|bribery|embezzlement|money laundering/.test(lower)) categories.push('Fraud / Financial Crime');
  if (/drug|narcotic|dagga|cannabis|cocaine|heroin|substance/.test(lower)) categories.push('Drug Offense');
  if (/kidnap|abduct|trafficking/.test(lower)) categories.push('Kidnapping / Trafficking');
  if (/arson|fire|malicious damage/.test(lower)) categories.push('Arson / Malicious Damage');
  if (/firearm|weapon|gun|ammunition/.test(lower)) categories.push('Firearms / Weapons');
  if (/domestic|protection order|gbv/.test(lower)) categories.push('Domestic / GBV');
  if (/sanction|terror|proliferation|fic/.test(lower)) categories.push('Sanctions / FIC');
  
  if (categories.length === 0) categories.push('Other Criminal Offense');
  return categories;
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

function getRiskLevel(matches: any[]): string {
  if (matches.length === 0) return 'GREEN';
  const hasViolent = matches.some((m: any) => 
    /murder|rape|sexual|assault|violence|attack|kidnap|firearm/i.test(m.charges || '')
  );
  if (hasViolent) return 'RED';
  if (matches.length > 1 || matches[0]?.confidence >= 70) return 'ORANGE';
  return 'YELLOW';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const params: SearchParams = await req.json();
    const { full_name, sa_id_number, date_of_birth, province, case_number, police_station, payment_id, user_id } = params;

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

    // ===== CREDIT VALIDATION (MANDATORY) =====
    // Either payment_id or user_id with available credits required
    let creditDeducted = false;

    if (payment_id) {
      // Legacy flow: deduct from specific payment
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

      if (payment.status !== 'verified') {
        return new Response(
          JSON.stringify({ success: false, error: 'Payment not yet verified' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (payment.credits_used >= payment.search_credits) {
        return new Response(
          JSON.stringify({ success: false, error: 'No credits remaining' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

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
      creditDeducted = true;
    } else if (user_id) {
      // Dashboard flow: find user's email and check for any available credits
      const { data: userData } = await supabase.auth.admin.getUserById(user_id);
      if (!userData?.user?.email) {
        return new Response(
          JSON.stringify({ success: false, error: 'User not found' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const userEmail = userData.user.email;

      // Check purchases table first
      const { data: purchases } = await supabase
        .from('purchases')
        .select('id, credits_remaining')
        .eq('email', userEmail)
        .eq('status', 'completed')
        .gt('credits_remaining', 0)
        .order('purchased_at', { ascending: true })
        .limit(1);

      if (purchases && purchases.length > 0) {
        const { error: updateErr } = await supabase
          .from('purchases')
          .update({ credits_remaining: purchases[0].credits_remaining - 1 })
          .eq('id', purchases[0].id);

        if (updateErr) {
          console.error('Purchase credit deduction error:', updateErr);
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to deduct credit' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        creditDeducted = true;
      }

      // Check manual_payments if no purchase credits
      if (!creditDeducted) {
        const { data: manualPayments } = await supabase
          .from('manual_payments')
          .select('id, credits_used, search_credits, payment_id')
          .eq('email', userEmail)
          .eq('status', 'verified')
          .order('created_at', { ascending: true });

        const availablePayment = manualPayments?.find(
          p => (p.search_credits || 0) - (p.credits_used || 0) > 0
        );

        if (availablePayment) {
          const { error: updateErr } = await supabase
            .from('manual_payments')
            .update({ credits_used: (availablePayment.credits_used || 0) + 1 })
            .eq('id', availablePayment.id);

          if (updateErr) {
            console.error('Manual payment credit deduction error:', updateErr);
            return new Response(
              JSON.stringify({ success: false, error: 'Failed to deduct credit' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          creditDeducted = true;
        }
      }

      if (!creditDeducted) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'No credits available. Please purchase a check first.',
            redirect: '/pricing'
          }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      // No payment_id and no user_id — reject
      return new Response(
        JSON.stringify({ success: false, error: 'Authentication required to perform searches' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let matches: any[] = [];
    const searchStrategies: string[] = [];

    // Strategy 1: Case Number
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

    // Strategy 2: ID Number
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

    // Strategy 3: Name + Filters
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

    // Strategy 4: Fuzzy Name
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

    // Strategy 5: SAFLII Court Judgments
    if (full_name) {
      searchStrategies.push('saflii_judgment');
      const normalizedSearch = normalizeName(full_name);
      const nameParts = full_name.trim().split(/\s+/);
      const searchSurname = nameParts[nameParts.length - 1].toLowerCase();

      let safliiQuery = supabase
        .from('saflii_judgments')
        .select('*')
        .eq('is_criminal', true)
        .or(`name_normalized.eq.${normalizedSearch},accused_surname.ilike.${searchSurname}`);

      if (province) {
        safliiQuery = safliiQuery.eq('province', province);
      }

      const { data: safliiMatches } = await safliiQuery.limit(10);

      if (safliiMatches && safliiMatches.length > 0) {
        for (const sj of safliiMatches) {
          // Avoid duplicates if same person already matched from wanted_persons
          if (!matches.some(m => m.full_name?.toLowerCase() === sj.accused_name?.toLowerCase())) {
            matches.push({
              id: sj.id,
              full_name: sj.accused_name,
              first_name: sj.accused_first_name,
              surname: sj.accused_surname,
              charges: (sj.charge_keywords || []).join(', ') || 'Criminal matter',
              court_name: sj.court_name,
              court_case_number: sj.case_number,
              province: sj.province,
              source_dataset: 'saflii',
              source_url: sj.saflii_url,
              detail_page_url: sj.saflii_url,
              match_type: 'saflii_judgment',
              confidence: 70,
              found_in_saflii: true,
              legal_status: 'court_judgment',
              offense_categories: sj.charge_keywords || [],
              year_of_birth: null,
              saflii_url: sj.saflii_url,
              saflii_year: sj.year,
              saflii_court_code: sj.court_code,
              saflii_case_title: sj.case_title,
            });
          }
        }
      }
    }

    // Strategy 6: Gazette Financial Court Orders
    if (full_name) {
      searchStrategies.push('gazette_records');
      const normalizedSearch = normalizeName(full_name);
      const nameParts = full_name.trim().split(/\s+/);
      const searchSurname = nameParts[nameParts.length - 1].toLowerCase();
      const searchFirstName = nameParts[0]?.toLowerCase() || '';

      let gazetteQuery = supabase
        .from('gazette_records')
        .select('*')
        .eq('is_active', true)
        .or(`name_normalized.eq.${normalizedSearch},surname.ilike.${searchSurname}`);

      if (province) {
        gazetteQuery = gazetteQuery.eq('province', province);
      }

      const { data: gazetteMatches } = await gazetteQuery.limit(10);

      if (gazetteMatches && gazetteMatches.length > 0) {
        for (const gr of gazetteMatches) {
          // Require both first name and surname to match for gazette records
          const grFirstLower = (gr.first_name || '').toLowerCase();
          const grSurnameLower = (gr.surname || '').toLowerCase();
          const firstNameMatch = searchFirstName && grFirstLower.includes(searchFirstName);
          const surnameMatch = grSurnameLower === searchSurname;
          
          if (!firstNameMatch || !surnameMatch) continue;

          if (!matches.some(m => m.full_name?.toLowerCase() === gr.full_name?.toLowerCase())) {
            matches.push({
              id: gr.id,
              full_name: gr.full_name,
              first_name: gr.first_name,
              surname: gr.surname,
              charges: gr.order_type || gr.record_type || 'Financial Court Order',
              court_name: gr.court_name,
              court_case_number: gr.case_number,
              province: gr.province,
              source_dataset: 'gazette',
              source_url: 'https://www.gpwonline.co.za/egazettes/',
              detail_page_url: null,
              match_type: 'gazette_record',
              confidence: 75,
              found_in_gazettes: true,
              legal_status: 'court_order',
              offense_categories: ['Fraud / Financial Crime'],
              year_of_birth: null,
              gazette_number: gr.gazette_number,
              gazette_date: gr.gazette_date,
            });
          }
        }
      }
    }

    // Deduplicate
    const seen = new Set<string>();
    matches = matches.filter(m => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });

    // Sort by confidence
    matches.sort((a, b) => b.confidence - a.confidence);

    // Enrich with offense categories
    matches = matches.map(m => ({
      ...m,
      offense_categories_derived: categorizeOffense(m.charges || ''),
    }));

    const needsHumanReview =
      matches.length > 3 ||
      (matches.length > 0 && matches[0].confidence < 70);

    // Log duplicate groups
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
    const riskLevel = getRiskLevel(matches);
    const recommendation = getRecommendation(matches);

    // Persist search results to database
    try {
      await supabase.from('searches').insert({
        search_id: searchId,
        user_id: user_id || null,
        payment_id: payment_id || null,
        search_name: full_name || null,
        search_id_number: sa_id_number || null,
        search_dob: date_of_birth || null,
        search_province: province || null,
        search_case_number: case_number || null,
        results: matches,
        matches_found: matches.length,
        risk_level: riskLevel,
        is_wanted: matches.length > 0,
        search_strategies: searchStrategies,
        recommendation,
        needs_human_verification: needsHumanReview,
        searched_at: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Failed to persist search:', e);
    }

    // Audit log
    try {
      await supabase.from('admin_events').insert({
        event_type: 'search_performed',
        performed_by: user_id || 'anonymous',
        details: {
          search_id: searchId,
          search_name: full_name || null,
          province: province || null,
          matches_found: matches.length,
          risk_level: riskLevel,
          strategies: searchStrategies,
        },
      });
    } catch (e) {
      console.error('Failed to log audit event:', e);
    }

    console.log(`Multi-parameter search: strategies=${searchStrategies.join(',')}, matches=${matches.length}`);

    return new Response(
      JSON.stringify({
        success: true,
        searchId,
        matches_found: matches.length,
        search_strategies_used: searchStrategies,
        results: matches,
        needs_human_verification: needsHumanReview,
        recommendation,
        isWanted: matches.length > 0,
        riskLevel,
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
