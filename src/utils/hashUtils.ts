/**
 * ═══════════════════════════════════════════════════════════════════
 * CRYPTOGRAPHIC EVIDENCE INTEGRITY — SHA-256 HASHING
 * ═══════════════════════════════════════════════════════════════════
 *
 * This module provides tamper-proof integrity verification for
 * the My Safety Journal feature. Once a user "verifies" their
 * journal entry, a SHA-256 hash is computed from the immutable
 * statement fields and stored alongside the entry.
 *
 * PURPOSE:
 * - Creates a cryptographic fingerprint of the original statement
 * - Any modification to the locked fields would produce a different hash
 * - Courts and legal professionals can verify the entry has not been altered
 * - Builds trust in the evidentiary chain for protection order applications
 *
 * POPIA COMPLIANCE:
 * - Hash is a one-way function — the original text cannot be derived from it
 * - Only the user who created the entry can access the underlying data
 * - Hash verification does not expose personal information
 *
 * LEGAL CONTEXT (South Africa):
 * - Electronic Communications and Transactions Act (ECTA) Section 15
 *   recognises data messages as admissible evidence
 * - SHA-256 hash provides integrity assurance per ECTA requirements
 * ═══════════════════════════════════════════════════════════════════
 */

/**
 * Generate SHA-256 hash of journal entry core statement fields.
 * These fields become immutable once the entry is verified/locked.
 *
 * Hash input format: "description|date|time|user_id|created_at"
 * This ensures uniqueness even if two entries share identical descriptions.
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
