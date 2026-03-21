import { supabase } from "@/integrations/supabase/client";

interface WantedPersonRecord {
  surname: string;
  first_name: string;
  full_name?: string;
  charges: string;
  detail_page_url?: string;
  is_active?: boolean;
}

export async function importWantedPersonsBatch(records: WantedPersonRecord[]) {
  try {
    const { data, error } = await supabase.functions.invoke('import-wanted-persons', {
      body: { records }
    });

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error importing wanted persons:', error);
    throw error;
  }
}

export function parseWantedPersonsData(rawData: string): WantedPersonRecord[] {
  const lines = rawData.trim().split('\n');
  const records: WantedPersonRecord[] = [];
  
  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = line.split(',');
    if (parts.length < 5) continue;
    
    const surname = parts[0].trim();
    const detailUrl = parts[2].trim();
    const firstName = parts[3].trim();
    const charges = parts[5].trim();
    
    if (!surname || !firstName || !charges || surname === 'Surname') continue;
    
    records.push({
      surname: surname.toUpperCase(),
      first_name: firstName.toUpperCase(),
      full_name: `${firstName.toUpperCase()} ${surname.toUpperCase()}`,
      charges: charges,
      detail_page_url: detailUrl || undefined,
      is_active: true
    });
  }
  
  return records;
}
