import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchRequest {
  searchType: 'person' | 'police_case' | 'protection_order' | 'court_case';
  // Person search fields
  firstName?: string;
  middleNames?: string;
  surname?: string;
  idNumber?: string;
  // Police case fields
  caseNumber?: string;
  policeStation?: string;
  relationship?: string;
  // Protection order fields
  protectionOrderNumber?: string;
  issuingCourt?: string;
  orderDate?: string;
  // Court case fields
  courtCaseNumber?: string;
  courtName?: string;
  caseType?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
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
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    } else if (searchType === 'police_case' && !requestBody.caseNumber) {
      return new Response(
        JSON.stringify({ error: 'Case number is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else if (searchType === 'protection_order' && !requestBody.protectionOrderNumber) {
      // Allow empty - will default to searching for "protection" keyword
    } else if (searchType === 'court_case' && !requestBody.courtCaseNumber) {
      // Allow empty - will default to searching for "court" keyword
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let wantedPersons: any[] = [];
    let searchQuery: any;
    let searchIdentifier = '';

    // Build search based on type
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
      
      // Prioritize ID number match
      if (idNumber) {
        searchConditions.push(`id_number.eq.${idNumber}`);
        searchIdentifier = `${fullName} (ID: ${idNumber})`;
      }
      
      searchQuery = supabase
        .from('wanted_persons')
        .select('*')
        .eq('is_active', true)
        .or(searchConditions.join(','));
        
    } else if (searchType === 'police_case') {
      const { caseNumber, policeStation } = requestBody;
      searchIdentifier = caseNumber!;
      
      console.log(`Police case search: ${caseNumber}, Station: ${policeStation || 'not provided'}`);
      
      searchQuery = supabase
        .from('wanted_persons')
        .select('*')
        .eq('is_active', true)
        .ilike('case_number', `%${caseNumber}%`);
        
      if (policeStation) {
        searchQuery = searchQuery.ilike('police_station', `%${policeStation}%`);
      }
      
    } else if (searchType === 'protection_order') {
      const { protectionOrderNumber, issuingCourt } = requestBody;
      // Search for "protection" keyword in charges field (e.g., "CONTRAVENTION OF PROTECTION ORDER")
      const searchKeyword = protectionOrderNumber?.trim() || 'protection';
      searchIdentifier = `Protection Order: ${searchKeyword}`;
      
      console.log(`Protection order search: keyword "${searchKeyword}", Court: ${issuingCourt || 'not provided'}`);
      
      searchQuery = supabase
        .from('wanted_persons')
        .select('*')
        .eq('is_active', true)
        .ilike('charges', `%${searchKeyword}%`);
        
    } else if (searchType === 'court_case') {
      const { courtCaseNumber, courtName } = requestBody;
      // Search for keyword in charges field (e.g., "FAILED TO COMPLY WITH A COURT ORDER")
      const searchKeyword = courtCaseNumber?.trim() || 'court';
      searchIdentifier = `Court Case: ${searchKeyword}`;
      
      console.log(`Court case search: keyword "${searchKeyword}", Court: ${courtName || 'not provided'}`);
      
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

    // Calculate risk level
    let riskLevel = 'GREEN';
    let riskScore = 0;

    if (isWanted) {
      riskLevel = 'RED';
      riskScore = 100;
    }

    // Generate search ID
    const searchId = `search-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Return search results
    const response = {
      success: true,
      searchId,
      searchType,
      searchIdentifier,
      idNumber: searchType === 'person' ? requestBody.idNumber : undefined,
      riskLevel,
      riskScore,
      isWanted,
      wantedPersonsCount: wantedPersons.length,
      wantedPersons,
      searchedAt: new Date().toISOString(),
    };

    console.log(`Search complete. Risk level: ${riskLevel}`);

    return new Response(
      JSON.stringify(response),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error in search-criminal-records function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
