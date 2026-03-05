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
 * Maps the numeric score to existing badge levels (RED/ORANGE/YELLOW/GREEN).
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
    if (/rape|sexual\s*offense|sexual\s*assault|child|molestation|indecent/.test(allText)) {
      score += 50;
      if (!factors.includes('Sexual offense or child-related crime')) {
        factors.push('Sexual offense or child-related crime');
      }
    }
    if (/murder|homicide|culpable/.test(allText)) {
      score += 45;
      if (!factors.includes('Violent crime against persons')) {
        factors.push('Violent crime against persons');
      }
    }
    if (/gbv|gender.based.violence/.test(allText) && /assault/.test(allText)) {
      score += 40;
      if (!factors.includes('Gender-based violence assault')) {
        factors.push('Gender-based violence assault');
      }
    }

    // ── HIGH RISK TRIGGERS (30-40 points) ──
    if (/assault|battery|gbh|bodily\s*harm/.test(allText) && !factors.includes('Assault or battery charges')) {
      score += yearsAgo < 5 ? 35 : 20;
      factors.push('Assault or battery charges');
    }
    if (/domestic|protection\s*order/.test(allText) && !factors.includes('Domestic violence or protection order')) {
      score += 35;
      factors.push('Domestic violence or protection order');
    }
    if (/stalk|harassment/.test(allText) && !factors.includes('Stalking or harassment')) {
      score += 30;
      factors.push('Stalking or harassment');
    }
    if (/kidnap|abduct|trafficking/.test(allText) && !factors.includes('Kidnapping or trafficking')) {
      score += 35;
      factors.push('Kidnapping or trafficking');
    }

    // ── MODERATE RISK (15-25 points) ──
    if (/fraud|forgery|embezzlement|money\s*laundering|corruption/.test(allText) && !factors.includes('Fraud or financial crime')) {
      score += yearsAgo < 3 ? 25 : 15;
      factors.push('Fraud or financial crime');
    }
    if (/theft|robbery|burglary|housebreaking|steal|larceny/.test(allText) && !factors.includes('Theft or robbery charges')) {
      score += yearsAgo < 3 ? 25 : 15;
      factors.push('Theft or robbery charges');
    }
    if (/drug.*deal|dealing|narcotic/.test(allText) && !factors.includes('Drug dealing charges')) {
      score += 20;
      factors.push('Drug dealing charges');
    }
    if (/arson|malicious\s*damage/.test(allText) && !factors.includes('Arson or malicious damage')) {
      score += 20;
      factors.push('Arson or malicious damage');
    }
    if (/firearm|weapon|gun|ammunition/.test(allText) && !factors.includes('Firearms or weapons offense')) {
      score += 20;
      factors.push('Firearms or weapons offense');
    }

    // ── LOW RISK (5-10 points) ──
    if (/dui|drunk\s*driv|driving\s*under/.test(allText) && !factors.includes('Drunk driving charges')) {
      score += yearsAgo < 2 ? 10 : 5;
      factors.push('Drunk driving charges');
    }
    if (/drug|dagga|cannabis/.test(allText) && !/deal/.test(allText) && !factors.includes('Drug possession')) {
      score += 8;
      factors.push('Drug possession');
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
