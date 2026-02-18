export interface ParsedCaseNumber {
  type: 'police' | 'court' | 'protection_order' | 'unknown';
  normalized: string;
  components: Record<string, string>;
}

export function parseCaseNumber(input: string): ParsedCaseNumber {
  const trimmed = input.trim();

  // Police case: CAS 246/08/2025 or 246/08/2025 or 246/08/2025/STATION
  const policePattern = /^(CAS\s*)?(\d{1,4})\/(\d{1,2})\/(\d{4})(\/[A-Z]+)?$/i;
  const policeMatch = trimmed.match(policePattern);

  if (policeMatch) {
    return {
      type: 'police',
      normalized: `${policeMatch[2]}/${policeMatch[3]}/${policeMatch[4]}`,
      components: {
        case_number: policeMatch[2],
        month: policeMatch[3],
        year: policeMatch[4],
        ...(policeMatch[5] ? { station: policeMatch[5].replace('/', '') } : {}),
      },
    };
  }

  // Court case pattern 1: A123/2025
  const courtPattern1 = /^([A-Z]+)(\d+)\/(\d{4})$/i;
  const courtMatch1 = trimmed.match(courtPattern1);
  if (courtMatch1) {
    return {
      type: 'court',
      normalized: trimmed.toUpperCase(),
      components: {
        prefix: courtMatch1[1],
        case_number: courtMatch1[2],
        year: courtMatch1[3],
      },
    };
  }

  // Court case pattern 2: [2025] ZAGPPHC 45
  const courtPattern2 = /^\[(\d{4})\]\s+([A-Z]+)\s+(\d+)$/i;
  const courtMatch2 = trimmed.match(courtPattern2);
  if (courtMatch2) {
    return {
      type: 'court',
      normalized: trimmed.toUpperCase(),
      components: {
        year: courtMatch2[1],
        court: courtMatch2[2],
        case_number: courtMatch2[3],
      },
    };
  }

  // Protection order pattern
  const protectionPattern = /^(PO|PROT|PROTECTION)\s*[-:]?\s*([A-Z0-9\-\/]+)/i;
  const protectionMatch = trimmed.match(protectionPattern);
  if (protectionMatch) {
    return {
      type: 'protection_order',
      normalized: protectionMatch[2].toUpperCase(),
      components: {
        order_number: protectionMatch[2],
      },
    };
  }

  return {
    type: 'unknown',
    normalized: trimmed,
    components: {},
  };
}
