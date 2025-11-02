import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchRequest {
  fullName: string;
  idNumber?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fullName, idNumber }: SearchRequest = await req.json();
    
    if (!fullName) {
      return new Response(
        JSON.stringify({ error: 'Full name is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Searching for: ${fullName}, ID: ${idNumber || 'not provided'}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Split full name into parts for flexible matching
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const surname = nameParts.slice(-1)[0] || '';

    // Search for wanted persons
    console.log(`Checking wanted_persons table for: ${fullName}`);
    
    const { data: wantedPersons, error: wantedError } = await supabase
      .from('wanted_persons')
      .select('*')
      .eq('is_active', true)
      .or(`full_name.ilike.%${fullName}%,first_name.ilike.%${firstName}%,surname.ilike.%${surname}%`)
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
