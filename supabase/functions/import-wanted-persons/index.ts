import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://redflaq.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WantedPersonRecord {
  surname: string;
  first_name: string;
  full_name?: string;
  charges: string;
  id_number?: string;
  photo_url?: string;
  last_known_location?: string;
  police_station?: string;
  case_number?: string;
  date_wanted?: string;
  is_active?: boolean;
}

interface ImportResult {
  success: boolean;
  total: number;
  inserted: number;
  updated: number;
  errors: number;
  errorDetails: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { records } = await req.json() as { records: WantedPersonRecord[] };

    if (!Array.isArray(records) || records.length === 0) {
      throw new Error('No valid records provided');
    }

    console.log(`Processing ${records.length} records...`);

    const result: ImportResult = {
      success: true,
      total: records.length,
      inserted: 0,
      updated: 0,
      errors: 0,
      errorDetails: [],
    };

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      
      try {
        // Validate required fields
        if (!record.surname || !record.first_name || !record.charges) {
          throw new Error(`Missing required fields at row ${i + 1}`);
        }

        // Sanitize and prepare data
        const sanitizedRecord = {
          surname: record.surname.trim().toUpperCase(),
          first_name: record.first_name.trim().toUpperCase(),
          full_name: (record.full_name || `${record.first_name} ${record.surname}`).trim().toUpperCase(),
          charges: record.charges.trim(),
          id_number: record.id_number?.trim() || null,
          photo_url: record.photo_url?.trim() || null,
          last_known_location: record.last_known_location?.trim() || null,
          police_station: record.police_station?.trim() || null,
          case_number: record.case_number?.trim() || null,
          date_wanted: record.date_wanted || null,
          is_active: record.is_active !== false, // Default to true
          source_url: 'Manual Import',
        };

        // Check if person already exists
        const { data: existing } = await supabase
          .from('wanted_persons')
          .select('id')
          .eq('full_name', sanitizedRecord.full_name)
          .maybeSingle();

        if (existing) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('wanted_persons')
            .update({
              ...sanitizedRecord,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);

          if (updateError) throw updateError;
          result.updated++;
          console.log(`Updated: ${sanitizedRecord.full_name}`);
        } else {
          // Insert new record
          const { error: insertError } = await supabase
            .from('wanted_persons')
            .insert(sanitizedRecord);

          if (insertError) throw insertError;
          result.inserted++;
          console.log(`Inserted: ${sanitizedRecord.full_name}`);
        }
      } catch (error: any) {
        result.errors++;
        const errorMsg = `Row ${i + 1} (${record.full_name || record.surname}): ${error.message}`;
        result.errorDetails.push(errorMsg);
        console.error(errorMsg);
      }
    }

    console.log(`Import complete: ${result.inserted} inserted, ${result.updated} updated, ${result.errors} errors`);

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Import function error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
