import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DOMParser, Element } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

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
    
    // Fetch the SAPS wanted persons list page
    const response = await fetch('https://www.saps.gov.za/crimestop/wanted/list.php');
    
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

    return new Response(
      JSON.stringify({
        success: true,
        count: wantedPersons.length,
        data: wantedPersons,
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
