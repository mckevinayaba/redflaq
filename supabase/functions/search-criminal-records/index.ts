import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchRequest {
  searchType: 'person' | 'police_case' | 'protection_order' | 'court_case' | 'active_warrant' | 'verification';
  firstName?: string;
  middleNames?: string;
  surname?: string;
  idNumber?: string;
  fullName?: string;
  dateOfBirth?: string;
  courtReference?: string;
  caseNumber?: string;
  policeStation?: string;
  relationship?: string;
  protectionOrderNumber?: string;
  issuingCourt?: string;
  orderDate?: string;
  courtCaseNumber?: string;
  courtName?: string;
  caseType?: string;
  province?: string;
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[-]/g, ' ');
}

function calculateConfidence(
  record: any,
  searchName: string,
  searchId?: string,
  searchDob?: string,
  searchProvince?: string
): number {
  let score = 0;
  const normalizedRecord = normalizeName(record.full_name);
  const normalizedSearch = normalizeName(searchName);

  if (normalizedRecord === normalizedSearch) {
    score += 20;
  } else if (normalizedRecord.includes(normalizedSearch) || normalizedSearch.includes(normalizedRecord)) {
    score += 10;
  }

  if (record.id_number && searchId) {
    if (record.id_number === searchId) {
      score += 30;
    } else if (record.id_number.slice(-4) === searchId.slice(-4)) {
      score += 25;
    }
  }

  if (record.date_wanted && searchDob && record.date_wanted === searchDob) {
    score += 30;
  }

  if (record.province && searchProvince) {
    if (record.province.toLowerCase() === searchProvince.toLowerCase()) {
      score += 15;
    }
  }

  if (record.photo_url) {
    score += 10;
  }

  return Math.min(score, 100);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody: SearchRequest = await req.json();
    const { searchType } = requestBody;
    
    // Validate based on search type
    if (searchType === 'person') {
      const { firstName, surname } = requestBody;
      if (!firstName || !surname) {
        return new Response(
          JSON.stringify({ error: 'First name and surname are required for person search' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else if (searchType === 'active_warrant') {
      const { firstName, surname, fullName } = requestBody;
      if (!fullName && (!firstName || !surname)) {
        return new Response(
          JSON.stringify({ error: 'Name is required for warrant search' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else if (searchType === 'police_case' && !requestBody.caseNumber) {
      return new Response(
        JSON.stringify({ error: 'Case number is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let wantedPersons: any[] = [];
    let searchQuery: any;
    let searchIdentifier = '';

    if (searchType === 'person') {
      const { firstName, middleNames, surname, idNumber } = requestBody;
      const fullName = [firstName, middleNames, surname].filter(Boolean).join(' ').trim();
      searchIdentifier = fullName;
      
      console.log(`Person search: ${fullName}, ID: ${idNumber || 'not provided'}`);

      const searchConditions = [
        `full_name.ilike.%${fullName}%`,
        `first_name.ilike.%${firstName}%`,
        `surname.ilike.%${surname}%`,
      ];
      
      if (middleNames) {
        searchConditions.push(`full_name.ilike.%${middleNames}%`);
      }
      if (idNumber) {
        searchConditions.push(`id_number.eq.${idNumber}`);
        searchIdentifier = `${fullName} (ID: ${idNumber})`;
      }
      
      searchQuery = supabase
        .from('wanted_persons')
        .select('*')
        .eq('is_active', true)
        .or(searchConditions.join(','));

    } else if (searchType === 'active_warrant') {
      const { firstName, surname, fullName, province, policeStation } = requestBody;
      
      let searchFirstName = firstName || '';
      let searchSurname = surname || '';
      
      if (fullName && !firstName && !surname) {
        const nameParts = fullName.trim().split(/\s+/);
        if (nameParts.length >= 2) {
          searchFirstName = nameParts[0];
          searchSurname = nameParts[nameParts.length - 1];
        } else if (nameParts.length === 1) {
          searchFirstName = nameParts[0];
          searchSurname = nameParts[0];
        }
      }
      
      searchIdentifier = fullName || `${searchFirstName} ${searchSurname}`;
      
      console.log(`Active warrant search: ${searchIdentifier}, Province: ${province || 'all'}`);

      searchQuery = supabase
        .from('wanted_persons')
        .select('*')
        .eq('is_active', true)
        .or(`full_name.ilike.%${searchFirstName}%,full_name.ilike.%${searchSurname}%`);
      
      if (province) {
        searchQuery = searchQuery.ilike('province', `%${province}%`);
      }
      if (policeStation) {
        searchQuery = searchQuery.ilike('police_station', `%${policeStation}%`);
      }
        
    } else if (searchType === 'police_case') {
      const { caseNumber, policeStation } = requestBody;
      searchIdentifier = caseNumber!;
      
      searchQuery = supabase
        .from('wanted_persons')
        .select('*')
        .eq('is_active', true)
        .ilike('case_number', `%${caseNumber}%`);
        
      if (policeStation) {
        searchQuery = searchQuery.ilike('police_station', `%${policeStation}%`);
      }
      
    } else if (searchType === 'protection_order') {
      const { protectionOrderNumber } = requestBody;
      const searchKeyword = protectionOrderNumber?.trim() || 'protection';
      searchIdentifier = `Protection Order: ${searchKeyword}`;
      
      searchQuery = supabase
        .from('wanted_persons')
        .select('*')
        .eq('is_active', true)
        .ilike('charges', `%${searchKeyword}%`);
        
    } else if (searchType === 'court_case') {
      const { courtCaseNumber } = requestBody;
      const searchKeyword = courtCaseNumber?.trim() || 'court';
      searchIdentifier = `Court Case: ${searchKeyword}`;
      
      searchQuery = supabase
        .from('wanted_persons')
        .select('*')
        .eq('is_active', true)
        .ilike('charges', `%${searchKeyword}%`);
    }

    const { data, error: wantedError } = await searchQuery.limit(10);

    if (wantedError) {
      console.error('Error searching wanted persons:', wantedError);
    }

    wantedPersons = data || [];
    const isWanted = wantedPersons.length > 0;
    console.log(`Found ${wantedPersons.length} wanted person matches`);

    // Calculate confidence for each match
    const searchName = searchIdentifier;
    const searchIdNum = requestBody.idNumber;
    const searchDob = requestBody.dateOfBirth;
    const searchProv = requestBody.province;

    const scoredPersons = wantedPersons.map(person => ({
      ...person,
      identity_confidence_score: calculateConfidence(person, searchName, searchIdNum, searchDob, searchProv),
      requires_human_verification: calculateConfidence(person, searchName, searchIdNum, searchDob, searchProv) < 40,
    }));

    // Sort by confidence descending
    scoredPersons.sort((a, b) => b.identity_confidence_score - a.identity_confidence_score);

    // Track duplicate name groups if multiple matches
    if (scoredPersons.length > 1) {
      const normalized = normalizeName(searchName);
      try {
        await supabase.from('duplicate_name_groups').insert({
          normalized_name: normalized,
          person_ids: scoredPersons.map(p => p.id),
          match_count: scoredPersons.length,
          flagged_for_review: scoredPersons.some(p => p.requires_human_verification),
        });
      } catch (e) {
        console.error('Failed to log duplicate name group:', e);
      }
    }

    // Calculate risk level
    let riskLevel = 'GREEN';
    let riskScore = 0;

    if (isWanted) {
      riskLevel = 'RED';
      riskScore = 100;
    }

    const searchId = `search-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const response = {
      success: true,
      searchId,
      searchType,
      searchIdentifier,
      idNumber: searchType === 'person' ? requestBody.idNumber : undefined,
      riskLevel,
      riskScore,
      isWanted,
      wantedPersonsCount: scoredPersons.length,
      wantedPersons: scoredPersons,
      hasMultipleMatches: scoredPersons.length > 1,
      searchedAt: new Date().toISOString(),
    };

    console.log(`Search complete. Risk level: ${riskLevel}, Matches: ${scoredPersons.length}`);

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in search-criminal-records function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
