import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchRequest {
  firstName: string;
  middleNames?: string;
  surname: string;
  idNumber?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName, middleNames, surname, idNumber }: SearchRequest = await req.json();
    
    if (!firstName || !surname) {
      return new Response(
        JSON.stringify({ error: 'First name and surname are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Build full name for logging and response
    const fullName = [firstName, middleNames, surname].filter(Boolean).join(' ').trim();
    console.log(`Searching for: ${fullName}, ID: ${idNumber || 'not provided'}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Search for wanted persons with comprehensive name matching
    console.log(`Checking wanted_persons table for: ${fullName}`);
    
    // Build search conditions for better matching
    const searchConditions = [
      `full_name.ilike.%${fullName}%`,
      `first_name.ilike.%${firstName}%`,
      `surname.ilike.%${surname}%`,
    ];
    
    // Add middle names to search if provided
    if (middleNames) {
      searchConditions.push(`full_name.ilike.%${middleNames}%`);
    }
    
    // Add ID number search if provided
    if (idNumber) {
      searchConditions.push(`id_number.eq.${idNumber}`);
    }
    
    const { data: wantedPersons, error: wantedError } = await supabase
      .from('wanted_persons')
      .select('*')
      .eq('is_active', true)
      .or(searchConditions.join(','))
      .limit(10);

    if (wantedError) {
      console.error('Error searching wanted persons:', wantedError);
    }

    const isWanted = wantedPersons && wantedPersons.length > 0;
    console.log(`Found ${wantedPersons?.length || 0} wanted person matches`);

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
      fullName,
      idNumber,
      riskLevel,
      riskScore,
      isWanted,
      wantedPersonsCount: wantedPersons?.length || 0,
      wantedPersons: wantedPersons || [],
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
