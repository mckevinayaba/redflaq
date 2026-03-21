/**
 * Generate SHA-256 hash of journal entry core statement fields.
 * These fields are immutable once verified.
 */
export async function generateStatementHash(entry: {
  incident_description: string;
  entry_date: string;
  entry_time: string;
  user_id: string;
  created_at: string;
}): Promise<string> {
  const hashInput = `${entry.incident_description}|${entry.entry_date}|${entry.entry_time}|${entry.user_id}|${entry.created_at}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(hashInput);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate SHA-256 hash of a file for evidence verification.
 */
export async function generateFileHash(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
