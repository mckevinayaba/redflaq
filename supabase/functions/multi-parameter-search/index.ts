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
  discreet_mode?: boolean;
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

function calculateRiskScore(records: any[]): { score: number; factors: string[]; badgeLevel: string } {
  if (!records || records.length === 0) {
    return { score: 0, factors: ['No public records found'], badgeLevel: 'GREEN' };
  }

  let score = 0;
  const factors: string[] = [];

  records.forEach((record: any) => {
    const charges = (record.charges || record.offense || record.type || '').toLowerCase();
    const offCats = (record.offense_categories_derived || record.offense_categories || []).map((c: string) => c.toLowerCase());
    const allText = [charges, ...offCats].join(' ');

    const dateStr = record.date_wanted || record.gazette_date;
    let yearsAgo = 999;
    if (dateStr) {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) yearsAgo = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24 * 365);
    }

    // CRITICAL
    if (/rape|sexual\s*offense|sexual\s*assault|child|molestation|indecent/.test(allText)) {
      score += 50;
      if (!factors.includes('Sexual offense or child-related crime')) factors.push('Sexual offense or child-related crime');
    }
    if (/murder|homicide|culpable/.test(allText)) {
      score += 45;
      if (!factors.includes('Violent crime against persons')) factors.push('Violent crime against persons');
    }
    if (/gbv|gender.based.violence/.test(allText) && /assault/.test(allText)) {
      score += 40;
      if (!factors.includes('Gender-based violence assault')) factors.push('Gender-based violence assault');
    }

    // HIGH
    if (/assault|battery|gbh|bodily\s*harm/.test(allText) && !factors.includes('Assault or battery charges')) {
      score += yearsAgo < 5 ? 35 : 20;
      factors.push('Assault or battery charges');
    }
    if (/domestic|protection\s*order/.test(allText) && !factors.includes('Domestic violence or protection order')) {
      score += 35;
      factors.push('Domestic violence or protection order');
    }
    if (/stalk|harassment/.test(allText) && !factors.includes('Stalking or harassment')) {
      score += 30;
      factors.push('Stalking or harassment');
    }
    if (/kidnap|abduct|trafficking/.test(allText) && !factors.includes('Kidnapping or trafficking')) {
      score += 35;
      factors.push('Kidnapping or trafficking');
    }

    // MODERATE
    if (/fraud|forgery|embezzlement|money\s*laundering|corruption/.test(allText) && !factors.includes('Fraud or financial crime')) {
      score += yearsAgo < 3 ? 25 : 15;
      factors.push('Fraud or financial crime');
    }
    if (/theft|robbery|burglary|housebreaking|steal|larceny/.test(allText) && !factors.includes('Theft or robbery charges')) {
      score += yearsAgo < 3 ? 25 : 15;
      factors.push('Theft or robbery charges');
    }
    if (/drug.*deal|dealing|narcotic/.test(allText) && !factors.includes('Drug dealing charges')) {
      score += 20;
      factors.push('Drug dealing charges');
    }
    if (/arson|malicious\s*damage/.test(allText) && !factors.includes('Arson or malicious damage')) {
      score += 20;
      factors.push('Arson or malicious damage');
    }
    if (/firearm|weapon|gun|ammunition/.test(allText) && !factors.includes('Firearms or weapons offense')) {
      score += 20;
      factors.push('Firearms or weapons offense');
    }

    // LOW
    if (/dui|drunk\s*driv|driving\s*under/.test(allText) && !factors.includes('Drunk driving charges')) {
      score += yearsAgo < 2 ? 10 : 5;
      factors.push('Drunk driving charges');
    }
    if (/drug|dagga|cannabis/.test(allText) && !/deal/.test(allText) && !factors.includes('Drug possession')) {
      score += 8;
      factors.push('Drug possession');
    }

    // Recency
    if (yearsAgo < 1 && !factors.includes('Very recent offense (within 12 months)')) {
      score *= 1.3;
      factors.push('Very recent offense (within 12 months)');
    } else if (yearsAgo < 3 && !factors.includes('Recent offense (within 3 years)')) {
      score *= 1.15;
      factors.push('Recent offense (within 3 years)');
    }
  });

  if (records.length >= 3 && !factors.includes('Pattern of multiple offenses')) {
    score += 15;
    factors.push('Pattern of multiple offenses');
  } else if (records.length === 2 && !factors.includes('Multiple records found')) {
    score += 8;
    factors.push('Multiple records found');
  }

  score = Math.min(Math.round(score), 100);

  let badgeLevel: string;
  if (score >= 50) badgeLevel = 'RED';
  else if (score >= 25) badgeLevel = 'ORANGE';
  else if (score > 0) badgeLevel = 'YELLOW';
  else badgeLevel = 'GREEN';

  return { score, factors, badgeLevel };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const params: SearchParams = await req.json();
    const { full_name, sa_id_number, date_of_birth, province, case_number, police_station, payment_id, user_id, discreet_mode } = params;

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

    // ===== STAFF BYPASS: Admin/Owner skip credit checks =====
    let isStaff = false;
    if (user_id) {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user_id)
        .in('role', ['admin', 'owner'])
        .maybeSingle();
      isStaff = !!roleData;
    }

    // ===== CREDIT VALIDATION (MANDATORY for non-staff) =====
    let creditDeducted = false;

    if (isStaff) {
      // Staff bypass — virtual credit, no deduction
      console.log('Staff bypass: skipping credit check for user', user_id);
      creditDeducted = true;
    } else if (payment_id) {
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
    const riskResult = calculateRiskScore(matches);
    const riskLevel = riskResult.badgeLevel;
    const riskScore = riskResult.score;
    const riskFactors = riskResult.factors;
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
        risk_score: riskScore,
        risk_factors: riskFactors,
        is_wanted: matches.length > 0,
        search_strategies: searchStrategies,
        recommendation,
        needs_human_verification: needsHumanReview,
        searched_at: new Date().toISOString(),
        hidden_from_dashboard: discreet_mode ? true : false,
      });
    } catch (e) {
      console.error('Failed to persist search:', e);
    }

    // Generate secure report link for discreet mode
    let secureToken: string | null = null;
    if (discreet_mode && user_id) {
      try {
        secureToken = crypto.randomUUID();
        await supabase.from('secure_report_links').insert({
          token: secureToken,
          search_id: searchId,
          user_id: user_id,
        });
      } catch (e) {
        console.error('Failed to create secure report link:', e);
      }
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

    // No "processing" email — results are instant, sent below

    // Send search completion email
    try {
      let recipientEmail: string | null = null;
      if (user_id) {
        const { data: userData } = await supabase.auth.admin.getUserById(user_id);
        recipientEmail = userData?.user?.email || null;
      } else if (payment_id) {
        const { data: paymentData } = await supabase
          .from('manual_payments')
          .select('email')
          .eq('payment_id', payment_id)
          .single();
        recipientEmail = paymentData?.email || null;
      }

      if (recipientEmail) {
        const adminPassword = Deno.env.get('ADMIN_PASSWORD');
        const resultsUrl = secureToken
          ? `https://redflaq.com/reports/view/${secureToken}`
          : `https://redflaq.com/results?search_id=${searchId}`;
        const riskColor = riskLevel === 'RED' ? '#DC2626' : riskLevel === 'ORANGE' ? '#EA580C' : riskLevel === 'YELLOW' ? '#CA8A04' : '#16A34A';
        const riskLabel = riskLevel === 'RED' ? 'High Risk' : riskLevel === 'ORANGE' ? 'Moderate Risk' : riskLevel === 'YELLOW' ? 'Low Risk' : 'Clear';

        // Generate initials for discreet subject line
        const nameInitials = full_name
          ? full_name.trim().split(/\s+/).map((w: string) => w[0]?.toUpperCase()).filter(Boolean).join('.')
          : '';

        // Discreet Mode: neutral subject with initials, preview text, no PDF, secure link
        const emailSubject = discreet_mode
          ? `Your RedFlaq report is ready${nameInitials ? ` (${nameInitials}.)` : ''}`
          : `RedFlaq Results Ready — ${full_name || 'Your Search'}`;

        const discreetPreviewText = 'Your RedFlaq report is ready to view when you&#39;re in a safe place.';

        const emailHtml = discreet_mode
          ? `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
                ${discreetPreviewText}${'&#847; &zwnj; &nbsp; '.repeat(30)}
              </div>

               <div style="text-align: center; margin-bottom: 32px;">
                  <img src="https://redflaq.com/redflaq-icon.png" alt="RedFlaq" width="48" height="48" style="display: inline-block; margin-bottom: 12px; border-radius: 10px;" />
                  <h1 style="font-size: 26px; color: #3B0764; margin: 0; font-family: 'Segoe UI', Arial, sans-serif;">RedFla<span style="color: #DC2626;">q</span></h1>
                  <p style="color: #666; font-size: 13px; margin-top: 4px;">Background Verification Service</p>
                </div>

              <p style="color: #333; font-size: 15px; line-height: 1.8;">
                Hi there,<br/><br/>
                Your RedFlaq safety check report is ready. Open it when you're ready and in a safe place to do so.
              </p>

              <div style="text-align: center; margin: 32px 0;">
                <a href="${resultsUrl}" style="display: inline-block; background: #7C3AED; color: white; padding: 16px 40px; text-decoration: none; font-size: 16px; font-weight: 700; border-radius: 8px;">View Your Report Securely →</a>
              </div>

              <p style="color: #999; font-size: 12px; text-align: center; line-height: 1.6;">
                This link works for 7 days and can only be viewed by you.<br/>
                You must be logged in to your RedFlaq account to view it.
              </p>

              <div style="background: #FEF3C7; border-left: 4px solid #CA8A04; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
                <p style="color: #92400E; font-size: 13px; margin: 0; font-weight: 600;">⚠️ Keep this link private</p>
                <p style="color: #92400E; font-size: 13px; margin: 4px 0 0;">This report contains sensitive information. Do not share it publicly.</p>
              </div>

              <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 32px 0;" />
              <p style="color: #666; font-size: 13px; text-align: center; line-height: 1.7;">
                🆘 If you need support right now, call GBV Command Centre:<br/>
                <strong><a href="tel:0800428428" style="color: #333; text-decoration: none;">0800 428 428</a></strong> — Free · 24/7 · Confidential
              </p>
              <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
              <p style="color: #999; font-size: 11px; text-align: center;">
                RedFlaq · South African Background Checks · <a href="https://redflaq.com/privacy" style="color: #999;">Privacy Policy</a> · <a href="https://redflaq.com/terms" style="color: #999;">Terms</a>
              </p>
            </div>
          `
          : `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
               <div style="text-align: center; margin-bottom: 32px;">
                  <img src="https://redflaq.com/redflaq-icon.png" alt="RedFlaq" width="48" height="48" style="display: inline-block; margin-bottom: 12px; border-radius: 10px;" />
                  <h1 style="font-size: 26px; color: #3B0764; margin: 0; font-family: 'Segoe UI', Arial, sans-serif;">RedFla<span style="color: #DC2626;">q</span></h1>
                  <p style="color: #666; font-size: 13px; margin-top: 4px;">Background Verification Service</p>
                </div>

              <div style="background: #F9FAFB; border: 2px solid ${riskColor}; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h2 style="color: ${riskColor}; font-size: 20px; margin: 0 0 8px;">Result: ${riskLabel}</h2>
                <p style="color: #333; font-size: 15px; margin: 0;">${matches.length} record${matches.length !== 1 ? 's' : ''} found for <strong>${full_name || 'your search'}</strong></p>
              </div>

              <p style="color: #333; font-size: 15px; line-height: 1.6;">Your background check is complete. View the full report below:</p>

              <div style="text-align: center; margin: 32px 0;">
                <a href="${resultsUrl}" style="display: inline-block; background: #7C3AED; color: white; padding: 16px 40px; text-decoration: none; font-size: 16px; font-weight: 700; border-radius: 8px;">View Full Report →</a>
              </div>

              <div style="background: #FEF3C7; border-left: 4px solid #CA8A04; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
                <p style="color: #92400E; font-size: 13px; margin: 0; font-weight: 600;">⚠️ Keep this link private</p>
                <p style="color: #92400E; font-size: 13px; margin: 4px 0 0;">This report contains sensitive information. Do not share it publicly.</p>
              </div>

              <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 32px 0;" />
              <p style="color: #999; font-size: 11px; text-align: center;">
                RedFlaq · South African Background Checks · <a href="https://redflaq.com/privacy" style="color: #999;">Privacy Policy</a> · <a href="https://redflaq.com/terms" style="color: #999;">Terms</a>
              </p>
            </div>
          `;

        await supabase.functions.invoke('send-email', {
          body: {
            admin_password: adminPassword,
            to: recipientEmail,
            subject: emailSubject,
            html: emailHtml,
          },
        });
      }
    } catch (emailErr) {
      console.error('Search completion email failed (non-blocking):', emailErr);
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
        riskScore,
        riskFactors,
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
