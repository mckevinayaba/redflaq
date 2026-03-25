/**
 * ═══════════════════════════════════════════════════════════════════
 * IDENTITY CONFIDENCE SCORING
 * ═══════════════════════════════════════════════════════════════════
 *
 * When a safety check returns matches, this module calculates how
 * confident we are that a matched record belongs to the searched
 * person. Uses multiple signals: exact name match, partial ID,
 * province, date of birth, and cross-source corroboration.
 *
 * A low confidence score triggers the "Human Verification" flow
 * where an admin manually reviews the match before confirming.
 * ═══════════════════════════════════════════════════════════════════
 */

export interface PersonRecord {
  id: string;
  full_name: string;
  date_wanted?: string;
  id_number?: string;
  province?: string;
  police_station?: string;
  photo_url?: string;
  case_number?: string;
  court_case_number?: string;
  court_name?: string;
  charges?: string;
}

export interface SearchInput {
  search_name: string;
  search_dob?: string;
  search_id?: string;
  search_province?: string;
}

export function calculateIdentityConfidence(
  record: PersonRecord,
  searchInput: SearchInput
): number {
  let score = 0;

  // Name exact match (baseline)
  if (record.full_name.toLowerCase().trim() === searchInput.search_name.toLowerCase().trim()) {
    score += 20;
  } else if (record.full_name.toLowerCase().includes(searchInput.search_name.toLowerCase())) {
    score += 10;
  }

  // Date of birth match (high value)
  if (record.date_wanted && searchInput.search_dob) {
    if (record.date_wanted === searchInput.search_dob) {
      score += 30;
    }
  }

  // ID number partial match (high value)
  if (record.id_number && searchInput.search_id) {
    if (record.id_number === searchInput.search_id) {
      score += 30;
    } else {
      const recordLast4 = record.id_number.slice(-4);
      const searchLast4 = searchInput.search_id.slice(-4);
      if (recordLast4 === searchLast4) {
        score += 25;
      }
    }
  }

  // Province match (medium value)
  if (record.province && searchInput.search_province) {
    if (record.province.toLowerCase() === searchInput.search_province.toLowerCase()) {
      score += 15;
    }
  }

  // Photo available (low value, just verification aid)
  if (record.photo_url) {
    score += 10;
  }

  return Math.min(score, 100);
}

export type ConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export function getConfidenceLevel(score: number): ConfidenceLevel {
  if (score < 40) return 'LOW';
  if (score < 70) return 'MEDIUM';
  return 'HIGH';
}

export function getConfidenceWarning(score: number): string {
  if (score < 40) {
    return "⚠️ CRITICAL: This match is based on name only. South Africa has thousands of people with identical names. DO NOT assume this is correct without additional verification.";
  }
  if (score < 70) {
    return "⚠️ WARNING: Limited identifying information available. Verify date of birth and location before proceeding.";
  }
  return "✓ Strong identity match based on multiple data points. Always verify with the person if possible.";
}

export function getConfidenceStyles(level: ConfidenceLevel) {
  switch (level) {
    case 'HIGH':
      return { bg: '#ECFDF5', border: '#10B981', color: '#065F46', icon: '✓' };
    case 'MEDIUM':
      return { bg: '#FEF3C7', border: '#F59E0B', color: '#92400E', icon: '⚠️' };
    case 'LOW':
      return { bg: '#FEE2E2', border: '#EF4444', color: '#991B1B', icon: '❌' };
  }
}
