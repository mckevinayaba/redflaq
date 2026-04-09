/**
 * ═══════════════════════════════════════════════════════════════════
 * RISK SCORING ENGINE
 * ═══════════════════════════════════════════════════════════════════
 *
 * Calculates a 0-100 risk score from publicly available records
 * matched against a search subject. The algorithm weighs:
 *
 * - Offense severity (Schedule 1-8 Criminal Procedure Act classifications)
 * - Recency of records
 * - Number of independent source matches (SAPS, SAFLII, Gazette)
 * - Gender-based violence indicators
 * - Protection order presence
 *
 * South Africa-specific: includes Afrikaans legal terms, SA court
 * reference formats, and Government Gazette notice patterns.
 *
 * IMPORTANT: This score is advisory only. RedFlaq does not make
 * guilt/innocence determinations. All data comes from public records.
 * ═══════════════════════════════════════════════════════════════════
 */

export type RiskLevel = 'CLEAR' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface RiskAssessment {
  level: RiskLevel;
  score: number; // 0-100
  factors: string[];
  explanation: string;
  badgeLevel: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
}

/**
 * Calculate a 0-100 risk score from matched records.
 * Includes Afrikaans terms, SA schedule codes, court references, and gazette formats.
 */
export function calculateRiskScore(records: any[]): RiskAssessment {
  if (!records || records.length === 0) {
    return {
      level: 'CLEAR',
      score: 0,
      factors: ['No public records found'],
      explanation: 'No criminal records, warrants, or court cases found in South African public records.',
      badgeLevel: 'GREEN',
    };
  }

  let score = 0;
  const factors: string[] = [];

  records.forEach(record => {
    const charges = (record.charges || record.offense || record.type || '').toLowerCase();
    const offenseCategories = (record.offense_categories_derived || record.offense_categories || []).map((c: string) => c.toLowerCase());
    const allText = [charges, ...offenseCategories].join(' ');

    // Estimate recency from available date fields
    const dateStr = record.date_wanted || record.gazette_date || record.searched_at;
    let yearsAgo = 999;
    if (dateStr) {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        yearsAgo = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24 * 365);
      }
    }

    // ── CRITICAL TRIGGERS (automatic 80+ territory) ──
    // Includes Afrikaans: verkragting (rape), ontug (indecency), kindermolestering (child molestation)
    // Schedule 1 / S1 offenses are serious
    if (/rape|sexual\s*offense|sexual\s*assault|child|molestation|indecent|verkragting|ontug|kindermolestering|seksuele|schedule\s*1\b|(?:^|\s)s1(?:\s|$)/i.test(allText)) {
      score += 50;
      if (!factors.includes('Sexual offense or child-related crime')) {
        factors.push('Sexual offense or child-related crime');
      }
    }
    // Afrikaans: moord (murder), strafbare manslag (culpable homicide)
    if (/murder|homicide|culpable|moord|strafbare\s*manslag|doodslag/i.test(allText)) {
      score += 45;
      if (!factors.includes('Violent crime against persons')) {
        factors.push('Violent crime against persons');
      }
    }
    // GBV / huishoudelike geweld (domestic violence)
    if (/gbv|gender.based.violence|huishoudelike\s*geweld|geslagsgeweld/i.test(allText) && /assault|aanranding/i.test(allText)) {
      score += 40;
      if (!factors.includes('Gender-based violence assault')) {
        factors.push('Gender-based violence assault');
      }
    }

    // ── HIGH RISK TRIGGERS (30-40 points) ──
    // Afrikaans: aanranding (assault), GBH = ernstige liggaamlike leed
    if (/assault|battery|gbh|bodily\s*harm|aanranding|ernstige\s*liggaamlike\s*leed|s&sb/i.test(allText) && !factors.includes('Assault or battery charges')) {
      score += yearsAgo < 5 ? 35 : 20;
      factors.push('Assault or battery charges');
    }
    // Afrikaans: beskermingsbevel (protection order), huishoudelike geweld
    // Also catches Protection Order Act 116 of 1998 references
    if (/domestic|protection\s*order|beskermingsbevel|huishoudelike\s*geweld|act\s*116\s*of\s*1998|wet\s*116\s*van\s*1998/i.test(allText) && !factors.includes('Domestic violence or protection order')) {
      score += 35;
      factors.push('Domestic violence or protection order');
    }
    // Afrikaans: teistering (harassment), agtervolging (stalking)
    if (/stalk|harassment|teistering|agtervolging|intimidasie/i.test(allText) && !factors.includes('Stalking or harassment')) {
      score += 30;
      factors.push('Stalking or harassment');
    }
    // Afrikaans: ontvoering (kidnapping), mensehandel (trafficking)
    if (/kidnap|abduct|trafficking|ontvoering|mensehandel/i.test(allText) && !factors.includes('Kidnapping or trafficking')) {
      score += 35;
      factors.push('Kidnapping or trafficking');
    }

    // ── MODERATE RISK (15-25 points) ──
    // Afrikaans: bedrog (fraud), vervalsing (forgery), korrupsie (corruption), geldwassery (money laundering)
    if (/fraud|forgery|embezzlement|money\s*laundering|corruption|bedrog|vervalsing|korrupsie|geldwassery|verduistering/i.test(allText) && !factors.includes('Fraud or financial crime')) {
      score += yearsAgo < 3 ? 25 : 15;
      factors.push('Fraud or financial crime');
    }
    // Afrikaans: diefstal (theft), roof (robbery), inbraak (burglary/housebreaking)
    if (/theft|robbery|burglary|housebreaking|steal|larceny|diefstal|roof|inbraak|saakroof/i.test(allText) && !factors.includes('Theft or robbery charges')) {
      score += yearsAgo < 3 ? 25 : 15;
      factors.push('Theft or robbery charges');
    }
    // Afrikaans: dwelmhandel (drug dealing)
    if (/drug.*deal|dealing|narcotic|dwelmhandel/i.test(allText) && !factors.includes('Drug dealing charges')) {
      score += 20;
      factors.push('Drug dealing charges');
    }
    // Afrikaans: brandstichting (arson), kwaadwillige saakbeskadiging (malicious damage)
    if (/arson|malicious\s*damage|brandstichting|kwaadwillige\s*saakbeskadiging/i.test(allText) && !factors.includes('Arson or malicious damage')) {
      score += 20;
      factors.push('Arson or malicious damage');
    }
    // Afrikaans: vuurwapen (firearm), wapen (weapon), ammunisie (ammunition)
    if (/firearm|weapon|gun|ammunition|vuurwapen|wapen|ammunisie/i.test(allText) && !factors.includes('Firearms or weapons offense')) {
      score += 20;
      factors.push('Firearms or weapons offense');
    }

    // ── LOW RISK (5-10 points) ──
    // Afrikaans: dronkbestuur (drunk driving), bestuur onder invloed
    if (/dui|drunk\s*driv|driving\s*under|dronkbestuur|bestuur\s*onder\s*invloed/i.test(allText) && !factors.includes('Drunk driving charges')) {
      score += yearsAgo < 2 ? 10 : 5;
      factors.push('Drunk driving charges');
    }
    // Afrikaans: dwelms (drugs), dagga
    if (/drug|dagga|cannabis|dwelms/i.test(allText) && !/deal|handel/i.test(allText) && !factors.includes('Drug possession')) {
      score += 8;
      factors.push('Drug possession');
    }

    // ── Gazette-specific: insolvency / sequestration / financial court orders ──
    if (/insolvency|insolvensie|sequestration|sekwestrasie|liquidation|likwidasie|rehabilitation|rehabilitasie/i.test(allText) && !factors.includes('Financial court order (Gazette)')) {
      score += 10;
      factors.push('Financial court order (Gazette)');
    }

    // ── Recency multiplier ──
    if (yearsAgo < 1 && !factors.includes('Very recent offense (within 12 months)')) {
      score *= 1.3;
      factors.push('Very recent offense (within 12 months)');
    } else if (yearsAgo < 3 && !factors.includes('Recent offense (within 3 years)')) {
      score *= 1.15;
      factors.push('Recent offense (within 3 years)');
    }
  });

  // Pattern multiplier
  if (records.length >= 3 && !factors.includes('Pattern of multiple offenses')) {
    score += 15;
    factors.push('Pattern of multiple offenses');
  } else if (records.length === 2 && !factors.includes('Multiple records found')) {
    score += 8;
    factors.push('Multiple records found');
  }

  // Cap at 100
  score = Math.min(Math.round(score), 100);

  // ═══ WANTED-STATUS BASELINE SCORING ═══
  if (records.length > 0) {
    let statusBaseline = 0;

    records.forEach(record => {
      const legalStatus = (record.legal_status || '').toLowerCase();
      const sourceDataset = (record.source_dataset || '').toLowerCase();
      const foundInSaps = record.found_in_saps === true;

      if (legalStatus === 'wanted' || sourceDataset === 'za_wanted') {
        statusBaseline = Math.max(statusBaseline, 50);
        if (!factors.includes('Listed on SAPS Wanted Persons database')) {
          factors.push('Listed on SAPS Wanted Persons database');
        }
      }
      if (sourceDataset === 'za_fic_sanctions' || legalStatus === 'sanctioned') {
        statusBaseline = Math.max(statusBaseline, 50);
        if (!factors.includes('Listed on FIC Sanctions list')) {
          factors.push('Listed on FIC Sanctions list');
        }
      }
      if (foundInSaps && statusBaseline < 40) {
        statusBaseline = Math.max(statusBaseline, 40);
        if (!factors.includes('Found in SAPS records')) {
          factors.push('Found in SAPS records');
        }
      }
    });

    if (score < statusBaseline) {
      score = statusBaseline;
    }

    // Any record in wanted_persons → minimum ORANGE (35)
    if (score < 35) {
      score = 35;
      if (!factors.includes('Public record found in criminal database')) {
        factors.push('Public record found in criminal database');
      }
    }
  }

  score = Math.min(score, 100);

  // ── Map score to risk level and existing badge ──
  let level: RiskLevel;
  let explanation: string;
  let badgeLevel: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';

  if (score >= 80) {
    level = 'CRITICAL';
    badgeLevel = 'RED';
    explanation = 'CRITICAL SAFETY CONCERN: Records show serious violent or sexual offenses. Immediate caution advised.';
  } else if (score >= 50) {
    level = 'HIGH';
    badgeLevel = 'RED';
    explanation = 'HIGH RISK: Records show concerning patterns of violence, domestic abuse, or serious crimes.';
  } else if (score >= 25) {
    level = 'MODERATE';
    badgeLevel = 'ORANGE';
    explanation = 'MODERATE CONCERN: Records show charges that warrant caution and further investigation.';
  } else if (score > 0) {
    level = 'LOW';
    badgeLevel = 'YELLOW';
    explanation = 'LOW RISK: Minor or older offenses found. Use your judgment.';
  } else {
    level = 'CLEAR';
    badgeLevel = 'GREEN';
    explanation = 'No public records found in South African criminal databases.';
  }

  return { level, score, factors, explanation, badgeLevel };
}

/**
 * Map a numeric score to the existing badge level string used by the UI.
 */
export function scoreToBadgeLevel(score: number): 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED' {
  if (score >= 50) return 'RED';
  if (score >= 25) return 'ORANGE';
  if (score > 0) return 'YELLOW';
  return 'GREEN';
}
