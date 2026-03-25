/**
 * ═══════════════════════════════════════════════════════════════════
 * CRYPTOGRAPHIC EVIDENCE INTEGRITY — SHA-256 FILE HASHING
 * ═══════════════════════════════════════════════════════════════════
 *
 * Statement hashing (journal entries) was moved to the server.
 * The lock_journal_entry_statement(entry_id) PostgreSQL function reads
 * entry fields directly from the database and computes SHA-256 using
 * pgcrypto — the client never supplies or influences the hash value.
 * See migration 20260325000001_server_side_journal_hash.sql.
 *
 * This module retains client-side file hashing only, which is a
 * legitimate client-side operation: the file bytes exist only in the
 * browser before upload, so the hash must be computed here before the
 * file is sent to storage. The file hash is a content fingerprint; it
 * does not claim a server-verified timestamp.
 * ═══════════════════════════════════════════════════════════════════
 */

/**
 * Generate SHA-256 hash of an uploaded evidence file.
 * Used to verify that photos, videos, audio recordings, and documents
 * have not been modified after upload. The hash is stored in the
 * journal_evidence table alongside the file metadata.
 */
export async function generateFileHash(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
