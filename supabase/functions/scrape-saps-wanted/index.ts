import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
  // Additional fields from detail page
  caseNumber?: string;
  policeStation?: string;
  protectionOrderNumber?: string;
  courtCaseNumber?: string;
  lastKnownLocation?: string;
  dateWanted?: string;
  idNumber?: string;
}

interface FirecrawlResponse {
  success: boolean;
  data?: {
    markdown?: string;
    html?: string;
    metadata?: Record<string, unknown>;
  };
  error?: string;
}

// Fetch page using Firecrawl API with retry logic
async function fetchWithFirecrawl(url: string, retries = 3): Promise<string | null> {
  const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
  if (!apiKey) {
    console.error('FIRECRAWL_API_KEY not configured');
    return null;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Fetching ${url} (attempt ${attempt}/${retries})`);
      
      const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          formats: ['html'],
          onlyMainContent: false,
          waitFor: 10000, // Increased from 2000ms to 10000ms
        }),
      });

      if (!response.ok) {
        console.error(`Firecrawl error for ${url}: ${response.status}`);
        if (attempt < retries) {
          // Exponential backoff: 2s, 4s, 8s
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        return null;
      }

      const data = await response.json();
      if (data.success && data.data?.html) {
        console.log(`Successfully fetched ${url}`);
        return data.data.html;
      }
      
      console.error(`Firecrawl no content for ${url}:`, data.error);
      if (attempt < retries) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      return null;
    } catch (error) {
      console.error(`Firecrawl fetch failed for ${url}:`, error);
      if (attempt < retries) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      return null;
    }
  }
  
  return null;
}

// Parse list page HTML to extract basic info and bid IDs
function parseListPage(html: string): WantedPerson[] {
  const wantedPersons: WantedPerson[] = [];
  
  // Match table rows with id="title"
  const rowRegex = /<tr[^>]*id\s*=\s*["']title["'][^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch;
  
  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const rowHtml = rowMatch[1];
    
    try {
      // Extract cells
      const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
      const cells: string[] = [];
      let cellMatch;
      
      while ((cellMatch = cellRegex.exec(rowHtml)) !== null) {
        cells.push(cellMatch[1]);
      }
      
      if (cells.length >= 4) {
        // Extract image URL
        const imgMatch = cells[0].match(/<img[^>]*src\s*=\s*["']([^"']+)["']/i);
        const photoUrl = imgMatch ? imgMatch[1] : '';
        
        // Extract surname and detail URL
        const surnameMatch = cells[1].match(/<a[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([^<]+)<\/a>/i);
        const detailUrl = surnameMatch ? surnameMatch[1] : '';
        const surname = surnameMatch ? surnameMatch[2].trim() : 'Unknown';
        
        // Extract bid from URL
        const bidMatch = detailUrl.match(/bid=(\d+)/);
        const bidId = bidMatch ? bidMatch[1] : '';
        
        // Extract first name
        const firstNameMatch = cells[2].match(/<a[^>]*>([^<]+)<\/a>/i);
        const firstName = firstNameMatch ? firstNameMatch[1].trim() : 'Unknown';
        
        // Extract crime
        const crimeMatch = cells[3].match(/<a[^>]*>([^<]+)<\/a>/i);
        const crime = crimeMatch ? crimeMatch[1].trim() : 'Unknown';
        
        if (surname !== 'Unknown' || firstName !== 'Unknown') {
          wantedPersons.push({
            surname,
            firstName,
            crime,
            photoUrl: photoUrl.startsWith('http') 
              ? photoUrl 
              : `https://www.saps.gov.za${photoUrl.startsWith('/') ? '' : '/'}${photoUrl}`,
            detailUrl: detailUrl.startsWith('http')
              ? detailUrl
              : `https://www.saps.gov.za/crimestop/wanted/${detailUrl}`,
            bidId,
          });
        }
      }
    } catch (error) {
      console.error('Error parsing row:', error);
    }
  }
  
  return wantedPersons;
}

// Parse detail page to extract additional information
function parseDetailPage(html: string): Partial<WantedPerson> {
  const details: Partial<WantedPerson> = {};
  
  // Common patterns for extracting data from SAPS detail pages
  // Look for table cells with labels and values
  
  // Case Number / CAS Number
  const caseMatch = html.match(/(?:case\s*(?:number|no\.?)|cas\s*(?:number|no\.?))[:\s]*<\/?\w+[^>]*>?\s*([A-Z0-9\-\/]+)/i) ||
                   html.match(/<td[^>]*>\s*(?:case\s*(?:number|no\.?)|cas)[:\s]*<\/td>\s*<td[^>]*>\s*([^<]+)/i) ||
                   html.match(/(\d{2,4}\/\d{2,4}\/\d{4})/); // Format: XXX/DD/YYYY
  if (caseMatch) {
    details.caseNumber = caseMatch[1].trim();
  }
  
  // Police Station
  const stationMatch = html.match(/(?:police\s*station|station)[:\s]*<\/?\w+[^>]*>?\s*([^<]+)/i) ||
                       html.match(/<td[^>]*>\s*(?:police\s*)?station[:\s]*<\/td>\s*<td[^>]*>\s*([^<]+)/i);
  if (stationMatch) {
    details.policeStation = stationMatch[1].trim().replace(/&amp;/g, '&');
  }
  
  // Protection Order Number
  const protectionMatch = html.match(/(?:protection\s*order)[:\s]*<\/?\w+[^>]*>?\s*([A-Z0-9\-\/]+)/i) ||
                         html.match(/<td[^>]*>\s*protection\s*order[:\s]*<\/td>\s*<td[^>]*>\s*([^<]+)/i);
  if (protectionMatch) {
    details.protectionOrderNumber = protectionMatch[1].trim();
  }
  
  // Court Case Number
  const courtMatch = html.match(/(?:court\s*case)[:\s]*<\/?\w+[^>]*>?\s*([A-Z]\s*[A-Z0-9\-\/]+)/i) ||
                    html.match(/<td[^>]*>\s*court\s*case[:\s]*<\/td>\s*<td[^>]*>\s*([^<]+)/i) ||
                    html.match(/([A-Z]\s+\d+\/\d{4})/); // Format: A XXX/2024
  if (courtMatch) {
    details.courtCaseNumber = courtMatch[1].trim();
  }
  
  // Last Known Location / Address
  const locationMatch = html.match(/(?:last\s*known\s*(?:location|address)|address|location)[:\s]*<\/?\w+[^>]*>?\s*([^<]+)/i) ||
                       html.match(/<td[^>]*>\s*(?:last\s*known\s*)?(?:location|address)[:\s]*<\/td>\s*<td[^>]*>\s*([^<]+)/i);
  if (locationMatch) {
    details.lastKnownLocation = locationMatch[1].trim().replace(/&amp;/g, '&');
  }
  
  // Date Wanted
  const dateMatch = html.match(/(?:date\s*wanted|wanted\s*since)[:\s]*<\/?\w+[^>]*>?\s*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|\d{4}[-\/]\d{1,2}[-\/]\d{1,2})/i) ||
                   html.match(/<td[^>]*>\s*date\s*wanted[:\s]*<\/td>\s*<td[^>]*>\s*([^<]+)/i);
  if (dateMatch) {
    details.dateWanted = dateMatch[1].trim();
  }
  
  // ID Number
  const idMatch = html.match(/(?:id\s*(?:number|no\.?)|identity)[:\s]*<\/?\w+[^>]*>?\s*(\d{13})/i) ||
                 html.match(/<td[^>]*>\s*id[:\s]*<\/td>\s*<td[^>]*>\s*(\d{13})/i);
  if (idMatch) {
    details.idNumber = idMatch[1].trim();
  }
  
  return details;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting SAPS wanted persons scrape with Firecrawl...');
    
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlKey) {
      throw new Error('FIRECRAWL_API_KEY is not configured. Please connect Firecrawl in Settings.');
    }
    
    // Step 1: Fetch the main list page
    console.log('Fetching SAPS list page...');
    const listHtml = await fetchWithFirecrawl('https://www.saps.gov.za/crimestop/wanted/list.php');
    
    if (!listHtml) {
      throw new Error('Failed to fetch SAPS list page. The website may be blocking requests.');
    }
    
    console.log('Successfully fetched list page, parsing...');
    const wantedPersons = parseListPage(listHtml);
    console.log(`Found ${wantedPersons.length} wanted persons on list page`);
    
    // Step 2: Fetch detail pages (reduced batch size to avoid timeouts)
    const batchSize = 3; // Reduced from 10 to 3
    const delayMs = 3000; // Increased from 1000ms to 3000ms
    let detailsFetched = 0;
    
    for (let i = 0; i < wantedPersons.length; i += batchSize) {
      const batch = wantedPersons.slice(i, i + batchSize);
      
      console.log(`Fetching detail pages ${i + 1}-${Math.min(i + batchSize, wantedPersons.length)}...`);
      
      const detailPromises = batch.map(async (person) => {
        if (!person.detailUrl || !person.bidId) return;
        
        const detailHtml = await fetchWithFirecrawl(person.detailUrl);
        if (detailHtml) {
          const details = parseDetailPage(detailHtml);
          Object.assign(person, details);
          detailsFetched++;
        }
      });
      
      await Promise.all(detailPromises);
      
      // Rate limiting delay between batches
      if (i + batchSize < wantedPersons.length) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    
    console.log(`Fetched details for ${detailsFetched} persons`);

    // Step 3: Save to database
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

        const recordData = {
          first_name: person.firstName,
          surname: person.surname,
          charges: person.crime,
          photo_url: person.photoUrl,
          detail_page_url: person.detailUrl,
          case_number: person.caseNumber || null,
          police_station: person.policeStation || null,
          protection_order_number: person.protectionOrderNumber || null,
          court_case_number: person.courtCaseNumber || null,
          last_known_location: person.lastKnownLocation || null,
          id_number: person.idNumber || null,
          date_wanted: person.dateWanted || null,
          is_active: true,
          updated_at: new Date().toISOString(),
        };

        if (existing) {
          const { error } = await supabase
            .from('wanted_persons')
            .update(recordData)
            .eq('id', existing.id);

          if (error) {
            console.error(`Error updating ${fullName}:`, error);
            errors.push(`Update error for ${fullName}: ${error.message}`);
          } else {
            updatedRecords++;
          }
        } else {
          const { error } = await supabase
            .from('wanted_persons')
            .insert({
              full_name: fullName,
              ...recordData,
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

    // Mark old persons as inactive
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
        details_fetched: detailsFetched,
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
