import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { file_path, gazette_number, gazette_date } = await req.json();

    if (!file_path) {
      return new Response(
        JSON.stringify({ success: false, error: 'file_path is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Download the PDF from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('gazette-pdfs')
      .download(file_path);

    if (downloadError || !fileData) {
      return new Response(
        JSON.stringify({ success: false, error: `Failed to download file: ${downloadError?.message}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Convert PDF to text using AI
    // First, convert the blob to base64
    const arrayBuffer = await fileData.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    if (!lovableApiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'AI gateway not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use AI to extract names from the gazette PDF
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a legal document parser specializing in South African Government Gazette Legal Notices (Gazette A & B).

Extract ALL individuals mentioned in insolvency, sequestration, rehabilitation, and court order sections. For each person found, return a JSON array with objects containing:
- full_name: The person's full name
- first_name: First name(s) only
- surname: Surname only
- id_number: South African ID number if mentioned (13 digits)
- record_type: One of "insolvency", "sequestration", "rehabilitation", "fraud_order", "court_order", "liquidation"
- order_type: Specific order type (e.g., "Final Sequestration Order", "Rehabilitation of Insolvent")
- court_name: Which court granted the order
- case_number: Case number if available
- province: Province if determinable
- details: Brief description of the order

ONLY include entries where a court order has been GRANTED — not pending applications.
Return ONLY a valid JSON array, no other text.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Parse this South African Government Gazette PDF (${gazette_number || 'unknown number'}, dated ${gazette_date || 'unknown date'}). Extract all individuals with granted court orders related to insolvency, sequestration, rehabilitation, or fraud.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:application/pdf;base64,${base64}`
                }
              }
            ]
          }
        ],
        max_tokens: 8000,
        temperature: 0.1,
      }),
    });

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || '[]';

    // Parse AI response
    let extractedRecords: any[] = [];
    try {
      // Handle markdown code blocks
      const cleaned = aiContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      extractedRecords = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('Failed to parse AI response:', aiContent);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to parse AI extraction results',
          raw_response: aiContent.substring(0, 500),
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Normalize and insert records
    const normalizeName = (name: string) => name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '');
    
    const dbRecords = extractedRecords
      .filter((r: any) => r.full_name && r.full_name.length > 2)
      .map((r: any) => ({
        full_name: r.full_name,
        first_name: r.first_name || null,
        surname: r.surname || null,
        id_number: r.id_number || null,
        name_normalized: normalizeName(r.full_name),
        record_type: r.record_type || 'court_order',
        gazette_number: gazette_number || null,
        gazette_date: gazette_date || null,
        court_name: r.court_name || null,
        province: r.province || null,
        case_number: r.case_number || null,
        order_type: r.order_type || null,
        details: r.details || null,
        source_pdf_url: file_path,
        is_active: true,
      }));

    let insertedCount = 0;
    if (dbRecords.length > 0) {
      for (let i = 0; i < dbRecords.length; i += 50) {
        const batch = dbRecords.slice(i, i + 50);
        const { error } = await supabase
          .from('gazette_records')
          .insert(batch);
        if (error) {
          console.error('Insert error:', error);
        } else {
          insertedCount += batch.length;
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        extracted: extractedRecords.length,
        inserted: insertedCount,
        gazette_number,
        gazette_date,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in extract-gazette:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
