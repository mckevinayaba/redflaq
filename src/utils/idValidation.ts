/**
 * ═══════════════════════════════════════════════════════════════════
 * SOUTH AFRICAN ID NUMBER VALIDATION
 * ═══════════════════════════════════════════════════════════════════
 *
 * Validates a 13-digit South African Identity Number per the
 * Department of Home Affairs format: YYMMDD SSSS C A Z
 *
 * - YYMMDD: Date of birth
 * - SSSS: Gender sequence (0000-4999 female, 5000-9999 male)
 * - C: Citizenship (0 = SA citizen, 1 = permanent resident)
 * - A: Usually 8 (was used for race pre-1994, now deprecated)
 * - Z: Luhn check digit
 *
 * POPIA NOTE: ID numbers are classified as special personal
 * information under POPIA Section 26. We validate format only —
 * the full ID number is never stored; only partial (last 4) may
 * be used for identity confidence matching.
 * ═══════════════════════════════════════════════════════════════════
 */
export function validateSAIDNumber(idNumber: string): {
  isValid: boolean;
  errors: string[];
  dateOfBirth?: string;
} {
  const errors: string[] = [];

  if (idNumber.length !== 13) {
    errors.push("ID number must be 13 digits");
    return { isValid: false, errors };
  }

  if (!/^\d{13}$/.test(idNumber)) {
    errors.push("ID number must contain only numbers");
    return { isValid: false, errors };
  }

  // Validate date of birth (first 6 digits: YYMMDD)
  const year = parseInt(idNumber.substring(0, 2));
  const month = parseInt(idNumber.substring(2, 4));
  const day = parseInt(idNumber.substring(4, 6));

  if (month < 1 || month > 12) {
    errors.push("Invalid birth month in ID number");
  }
  if (day < 1 || day > 31) {
    errors.push("Invalid birth day in ID number");
  }

  // Luhn algorithm check (digit 13)
  let sum = 0;
  let isSecondDigit = false;

  for (let i = idNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(idNumber[i]);

    if (isSecondDigit) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isSecondDigit = !isSecondDigit;
  }

  if (sum % 10 !== 0) {
    errors.push("ID number failed validation check (invalid check digit)");
  }

  // Extract DOB for convenience
  const fullYear = year >= 0 && year <= 30 ? 2000 + year : 1900 + year;
  const dateOfBirth = errors.length === 0 ? `${fullYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}` : undefined;

  return {
    isValid: errors.length === 0,
    errors,
    dateOfBirth,
  };
}
