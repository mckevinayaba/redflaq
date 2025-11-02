import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DOMParser, Element } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WantedPerson {
  surname: string;
  firstName: string;
  crime: string;
  photoUrl: string;
  detailUrl: string;
  bidId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting SAPS wanted persons scrape...');
    
    // Fetch the SAPS wanted persons list page with proper headers
    const response = await fetch('https://www.saps.gov.za/crimestop/wanted/list.php', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch SAPS page: ${response.status}`);
    }

    const html = await response.text();
    console.log('Successfully fetched SAPS page, parsing HTML...');

    // Parse HTML
    const doc = new DOMParser().parseFromString(html, 'text/html');
    
    if (!doc) {
      throw new Error('Failed to parse HTML');
    }

    const wantedPersons: WantedPerson[] = [];
    
    // Find all table rows with id="title" (these contain wanted persons)
    const rows = doc.querySelectorAll('tr[id="title"]');
    console.log(`Found ${rows.length} wanted persons`);

    for (const row of rows) {
      try {
        // Cast to Element to access querySelectorAll
        const rowElement = row as Element;
        const cells = rowElement.querySelectorAll('td, th');
        
        if (cells.length >= 4) {
          // Extract image
          const cell0 = cells[0] as Element;
          const img = cell0.querySelector('img');
          const photoUrl = img?.getAttribute('src') || '';
          
          // Extract surname (in 2nd cell)
          const cell1 = cells[1] as Element;
          const surnameLink = cell1.querySelector('a');
          const surname = surnameLink?.textContent?.trim() || 'Unknown';
          const detailUrl = surnameLink?.getAttribute('href') || '';
          
          // Extract bid from URL (e.g., detail.php?bid=21650)
          const bidMatch = detailUrl.match(/bid=(\d+)/);
          const bidId = bidMatch ? bidMatch[1] : '';
          
          // Extract first name (in 3rd cell)
          const cell2 = cells[2] as Element;
          const firstNameLink = cell2.querySelector('a');
          const firstName = firstNameLink?.textContent?.trim() || 'Unknown';
          
          // Extract crime (in 4th cell)
          const cell3 = cells[3] as Element;
          const crimeLink = cell3.querySelector('a');
          const crime = crimeLink?.textContent?.trim() || 'Unknown';
          
          // Only add if we have valid data
          if (surname !== 'Unknown' || firstName !== 'Unknown') {
            wantedPersons.push({
              surname,
              firstName,
              crime,
              photoUrl: photoUrl.startsWith('http') 
                ? photoUrl 
                : `https://www.saps.gov.za${photoUrl}`,
              detailUrl: detailUrl.startsWith('http')
                ? detailUrl
                : `https://www.saps.gov.za/crimestop/wanted/${detailUrl}`,
              bidId,
            });
          }
        }
      } catch (error) {
        console.error('Error parsing row:', error);
        // Continue to next row
      }
    }

    console.log(`Successfully parsed ${wantedPersons.length} wanted persons`);

    // Save to database
    console.log('Saving to database...');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let newRecords = 0;
    let updatedRecords = 0;
    const errors: string[] = [];

    for (const person of wantedPersons) {
      try {
        const fullName = `${person.firstName} ${person.surname}`.trim();
        
        // Check if person exists
        const { data: existing } = await supabase
          .from('wanted_persons')
          .select('id')
          .ilike('full_name', fullName)
          .maybeSingle();

        if (existing) {
          // Update existing record
          const { error } = await supabase
            .from('wanted_persons')
            .update({
              first_name: person.firstName,
              surname: person.surname,
              charges: person.crime,
              photo_url: person.photoUrl,
              detail_page_url: person.detailUrl,
              is_active: true,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);

          if (error) {
            console.error(`Error updating ${fullName}:`, error);
            errors.push(`Update error for ${fullName}: ${error.message}`);
          } else {
            updatedRecords++;
          }
        } else {
          // Insert new record
          const { error } = await supabase
            .from('wanted_persons')
            .insert({
              full_name: fullName,
              first_name: person.firstName,
              surname: person.surname,
              charges: person.crime,
              photo_url: person.photoUrl,
              detail_page_url: person.detailUrl,
              is_active: true,
            });

          if (error) {
            console.error(`Error inserting ${fullName}:`, error);
            errors.push(`Insert error for ${fullName}: ${error.message}`);
          } else {
            newRecords++;
          }
        }
      } catch (error) {
        console.error('Database error:', error);
        errors.push(`Exception: ${error instanceof Error ? error.message : 'Unknown'}`);
      }
    }

    // Mark persons as inactive if not updated in last 48 hours
    const fortyEightHoursAgo = new Date();
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

    const { data: deactivated, error: deactivateError } = await supabase
      .from('wanted_persons')
      .update({ is_active: false })
      .eq('is_active', true)
      .lt('updated_at', fortyEightHoursAgo.toISOString())
      .select();

    const deactivatedCount = deactivated?.length || 0;

    if (deactivateError) {
      console.error('Error deactivating old records:', deactivateError);
      errors.push(`Deactivation error: ${deactivateError.message}`);
    }

    console.log(`Database update complete: ${newRecords} new, ${updatedRecords} updated, ${deactivatedCount} deactivated`);

    return new Response(
      JSON.stringify({
        success: true,
        total_scraped: wantedPersons.length,
        new_records: newRecords,
        updated_records: updatedRecords,
        deactivated_records: deactivatedCount,
        errors: errors.length > 0 ? errors : undefined,
        scrapedAt: new Date().toISOString(),
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error in scrape-saps-wanted function:', error);
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
