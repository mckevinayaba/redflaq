import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DetailPageData {
  caseNumber?: string;
  policeStation?: string;
  protectionOrderNumber?: string;
  courtCaseNumber?: string;
  lastKnownLocation?: string;
  dateWanted?: string;
  idNumber?: string;
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
          waitFor: 10000, // 10 seconds wait for anti-bot
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

// Parse detail page HTML to extract case information
// Based on actual SAPS HTML structure: <td>Label:</td><td>Value</td>
function parseDetailPage(html: string): DetailPageData {
  const details: DetailPageData = {};
  
  // Helper to extract table cell value after a label
  const extractTableValue = (label: string): string | null => {
    // Pattern: <td...>Label:</td><td...>Value</td>
    const regex = new RegExp(
      `<td[^>]*>\\s*${label}\\s*:?\\s*</td>\\s*<td[^>]*>([^<]+)</td>`,
      'i'
    );
    const match = html.match(regex);
    if (match) {
      return match[1].trim().replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ');
    }
    return null;
  };
  
  // Case Number - try multiple patterns
  const caseNumber = extractTableValue('Case Number') || 
                     extractTableValue('CAS Number') ||
                     extractTableValue('Case No');
  if (caseNumber && caseNumber.length > 3) {
    details.caseNumber = caseNumber;
  }
  
  // Police Station
  const station = extractTableValue('Station') || 
                  extractTableValue('Police Station');
  if (station && station.length > 2) {
    details.policeStation = station;
  }
  
  // Protection Order Number
  const protectionOrder = extractTableValue('Protection Order') ||
                          extractTableValue('Protection Order Number');
  if (protectionOrder && protectionOrder.length > 2) {
    details.protectionOrderNumber = protectionOrder;
  }
  
  // Court Case Number - check for patterns like "A 123/2024"
  const courtCase = extractTableValue('Court Case') ||
                    extractTableValue('Court Case Number');
  if (courtCase && courtCase.length > 2) {
    details.courtCaseNumber = courtCase;
  }
  
  // Also check charges text for court warrant references
  const warrantsMatch = html.match(/warrant[^<]*([A-Z]\s*\d+\/\d{4})/i);
  if (warrantsMatch && !details.courtCaseNumber) {
    details.courtCaseNumber = warrantsMatch[1].trim();
  }
  
  // Last Known Location / Address
  const location = extractTableValue('Last Known Address') ||
                   extractTableValue('Address') ||
                   extractTableValue('Location');
  if (location && location.length > 3) {
    details.lastKnownLocation = location;
  }
  
  // Date Wanted
  const dateWanted = extractTableValue('Date Wanted') ||
                     extractTableValue('Wanted Since');
  if (dateWanted) {
    details.dateWanted = dateWanted;
  }
  
  // ID Number (13 digits)
  const idMatch = html.match(/(?:ID|Identity)[^>]*>?\s*:?\s*<\/?\w+[^>]*>?\s*(\d{13})/i);
  if (idMatch) {
    details.idNumber = idMatch[1];
  }
  
  return details;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting batch detail scrape...');
    
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlKey) {
      throw new Error('FIRECRAWL_API_KEY is not configured. Please connect Firecrawl in Settings.');
    }
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get records that need detail scraping (missing case_number but have detail URL)
    const { data: recordsNeedingDetails, error: fetchError } = await supabase
      .from('wanted_persons')
      .select('id, full_name, detail_page_url')
      .is('case_number', null)
      .not('detail_page_url', 'is', null)
      .eq('is_active', true)
      .limit(5);
    
    if (fetchError) {
      throw new Error(`Failed to fetch records: ${fetchError.message}`);
    }
    
    if (!recordsNeedingDetails || recordsNeedingDetails.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'All records have been processed',
          processed: 0,
          remaining: 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get total count of records needing details
    const { count: totalRemaining } = await supabase
      .from('wanted_persons')
      .select('*', { count: 'exact', head: true })
      .is('case_number', null)
      .not('detail_page_url', 'is', null)
      .eq('is_active', true);
    
    console.log(`Processing ${recordsNeedingDetails.length} records (${totalRemaining} total remaining)`);
    
    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];
    
    // Process each record sequentially to avoid overwhelming Firecrawl
    for (const record of recordsNeedingDetails) {
      try {
        console.log(`Fetching details for: ${record.full_name}`);
        
        const html = await fetchWithFirecrawl(record.detail_page_url);
        
        if (!html) {
          errors.push(`Failed to fetch page for ${record.full_name}`);
          failedCount++;
          continue;
        }
        
        const details = parseDetailPage(html);
        console.log(`Parsed details for ${record.full_name}:`, details);
        
        // Update record with extracted details
        const updateData: Record<string, unknown> = {
          updated_at: new Date().toISOString(),
        };
        
        if (details.caseNumber) updateData.case_number = details.caseNumber;
        if (details.policeStation) updateData.police_station = details.policeStation;
        if (details.protectionOrderNumber) updateData.protection_order_number = details.protectionOrderNumber;
        if (details.courtCaseNumber) updateData.court_case_number = details.courtCaseNumber;
        if (details.lastKnownLocation) updateData.last_known_location = details.lastKnownLocation;
        if (details.dateWanted) updateData.date_wanted = details.dateWanted;
        if (details.idNumber) updateData.id_number = details.idNumber;
        
        // Mark as processed even if no details found (to avoid infinite loops)
        // We use case_number = 'NOT_FOUND' to indicate we tried but found nothing
        if (!details.caseNumber) {
          updateData.case_number = 'NOT_FOUND';
        }
        
        const { error: updateError } = await supabase
          .from('wanted_persons')
          .update(updateData)
          .eq('id', record.id);
        
        if (updateError) {
          errors.push(`Failed to update ${record.full_name}: ${updateError.message}`);
          failedCount++;
        } else {
          successCount++;
          console.log(`Updated ${record.full_name} successfully`);
        }
        
        // Small delay between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error processing ${record.full_name}:`, error);
        errors.push(`Exception for ${record.full_name}: ${error instanceof Error ? error.message : 'Unknown'}`);
        failedCount++;
      }
    }
    
    // Calculate remaining after this batch
    const remaining = (totalRemaining || 0) - successCount - failedCount;
    
    return new Response(
      JSON.stringify({
        success: true,
        processed: successCount,
        failed: failedCount,
        remaining: Math.max(0, remaining),
        errors: errors.length > 0 ? errors : undefined,
        completedAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in scrape-saps-details function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
