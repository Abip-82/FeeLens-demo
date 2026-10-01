/**
 * FeeLens Deterministic Rules Engine
 * All arithmetic, ceiling comparisons, category multipliers, and status
 * classifications are executed deterministically here.
 */
import {
  GradeLevel,
  SchoolCategory,
  FeeCategoryType,
  ExtractedFee,
  Bill,
  BillComparison,
  School,
  FeeEvaluationStatus,
  BillAuditReport,
  AuditedFeeItem,
} from '../types';
import {
  BASELINE_GA_CEILINGS,
  CATEGORY_MULTIPLIERS,
  RECOGNIZED_FEE_HEADINGS,
} from '../data/feeRules';
import { DEMO_SCHOOLS, matchSchoolByName } from '../data/schools';

export function lookupSchool(identifier: string): School | null {
  if (!identifier) return null;
  const byId = DEMO_SCHOOLS.find(s => s.id === identifier);
  if (byId) return byId;
  return matchSchoolByName(identifier);
}

export function calculateAnnualFeeCeiling(monthlyTuitionCeiling: number | null): number | null {
  if (monthlyTuitionCeiling === null || monthlyTuitionCeiling <= 0) return null;
  return monthlyTuitionCeiling * 2;
}

export function determineGradeLevel(gradeInput: number | string | null | undefined): {
  gradeLevel: GradeLevel;
  numericGrade: number | null;
} {
  if (gradeInput === null || gradeInput === undefined) {
    return { gradeLevel: 'Unknown', numericGrade: null };
  }

  let num: number | null = null;
  if (typeof gradeInput === 'number') {
    num = gradeInput;
  } else {
    const match = gradeInput.match(/\b(10|[1-9])\b/);
    if (match) {
      num = parseInt(match[1], 10);
    } else {
      const lower = gradeInput.toLowerCase();
      if (lower.includes('one') || lower.includes('1st')) num = 1;
      else if (lower.includes('two') || lower.includes('2nd')) num = 2;
      else if (lower.includes('three') || lower.includes('3rd')) num = 3;
      else if (lower.includes('four') || lower.includes('4th')) num = 4;
      else if (lower.includes('five') || lower.includes('5th')) num = 5;
      else if (lower.includes('six') || lower.includes('6th')) num = 6;
      else if (lower.includes('seven') || lower.includes('7th')) num = 7;
      else if (lower.includes('eight') || lower.includes('8th')) num = 8;
      else if (lower.includes('nine') || lower.includes('9th')) num = 9;
      else if (lower.includes('ten') || lower.includes('10th')) num = 10;
    }
  }

  if (num === null) {
    return { gradeLevel: 'Unknown', numericGrade: null };
  }

  if (num >= 1 && num <= 5) {
    return { gradeLevel: 'Primary', numericGrade: num };
  }
  if (num >= 6 && num <= 8) {
    return { gradeLevel: 'Lower Secondary', numericGrade: num };
  }
  if (num >= 9 && num <= 10) {
    return { gradeLevel: 'Secondary', numericGrade: num };
  }

  return { gradeLevel: 'Unknown', numericGrade: num };
}

export interface CeilingCalculationResult {
  ceiling: number | null;
  baselineGaAmount: number | null;
  multiplier: number | null;
  formula: string;
  explanation: string;
}

export function calculateTuitionCeiling(
  category: SchoolCategory,
  gradeLevel: GradeLevel
): CeilingCalculationResult {
  if (gradeLevel === 'Unknown') {
    return {
      ceiling: null,
      baselineGaAmount: null,
      multiplier: null,
      formula: 'N/A',
      explanation: 'Grade level could not be determined from the bill.',
    };
  }

  const baselineConfig = BASELINE_GA_CEILINGS.find(b => b.gradeLevel === gradeLevel);
  if (!baselineConfig) {
    return {
      ceiling: null,
      baselineGaAmount: null,
      multiplier: null,
      formula: 'N/A',
      explanation: 'No baseline ceiling configured for this grade level in prototype.',
    };
  }

  const baselineGa = baselineConfig.baselineGaAmount;

  if (!category) {
    return {
      ceiling: null,
      baselineGaAmount: baselineGa,
      multiplier: null,
      formula: 'Public / Community / Uncategorized',
      explanation: 'School is not categorized under institutional tiers Ka/Kha/Ga/Gha in the prototype dataset.',
    };
  }

  const multiplierConfig = CATEGORY_MULTIPLIERS[category];
  if (!multiplierConfig) {
    return {
      ceiling: null,
      baselineGaAmount: baselineGa,
      multiplier: null,
      formula: 'N/A',
      explanation: `Category '${category}' is unrecognized in prototype dataset.`,
    };
  }

  const multiplier = multiplierConfig.multiplier;
  const ceiling = baselineGa * multiplier;

  return {
    ceiling,
    baselineGaAmount: baselineGa,
    multiplier,
    formula: `Rs. ${baselineGa.toLocaleString('en-IN')} (Ga Baseline) × ${multiplier.toFixed(2)} (${multiplierConfig.label}) = Rs. ${ceiling.toLocaleString('en-IN')}`,
    explanation: `For ${gradeLevel} (Grades ${baselineConfig.minGrade}-${baselineConfig.maxGrade}), Ga baseline is Rs. ${baselineGa}. Category ${category} multiplier is ${multiplier.toFixed(2)}, yielding a monthly ceiling of Rs. ${ceiling.toLocaleString('en-IN')}.`,
  };
}

export function normalizeFeeHeading(rawLabel: string): {
  type: FeeCategoryType;
  titleEn: string;
  titleNp: string;
  confidence: number;
  definition?: typeof RECOGNIZED_FEE_HEADINGS[number];
} {
  const clean = rawLabel.toLowerCase().trim();

  if (clean.includes('readmission') || clean.includes('re-admission') || clean.includes('re admission')) {
    const admissionDef = RECOGNIZED_FEE_HEADINGS.find(h => h.type === 'admission_fee');
    return {
      type: 'admission_fee',
      titleEn: 'Re-Admission Fee (Flagged)',
      titleNp: 'पुनः भर्ना शुल्क',
      confidence: 0.95,
      definition: admissionDef,
    };
  }

  for (const def of RECOGNIZED_FEE_HEADINGS) {
    for (const syn of def.synonyms) {
      if (clean.includes(syn) || syn.includes(clean)) {
        return {
          type: def.type,
          titleEn: def.nameEn,
          titleNp: def.nameNp,
          confidence: 0.9,
          definition: def,
        };
      }
    }
  }

  return {
    type: 'unrecognized_or_other',
    titleEn: rawLabel.trim() || 'Uncategorized Fee',
    titleNp: 'अन्य / असम्बन्धित शुल्क',
    confidence: 0.3,
  };
}

export function evaluateFee(
  rawFee: {
    id?: string;
    originalLabel: string;
    amount: number;
    normalizedFeeType?: FeeCategoryType;
  },
  school: School | null,
  gradeLevel: GradeLevel,
  isContinuingStudent: boolean = true
): ExtractedFee {
  const norm = normalizeFeeHeading(rawFee.originalLabel);
  const feeType = rawFee.normalizedFeeType || norm.type;
  const def = norm.definition || RECOGNIZED_FEE_HEADINGS.find(h => h.type === feeType);

  let status: FeeEvaluationStatus = 'recognized_heading';
  let statusLabel = 'Recognized fee heading';
  let applicableLimit: number | null = null;
  let difference: number | null = null;
  let explanation = '';
  let explanationNp = '';
  let ruleCitation = '';
  let isFlagged = false;

  const schoolCategory = school ? school.category : null;
  const tuitionCeilingInfo = calculateTuitionCeiling(schoolCategory, gradeLevel);

  if (feeType === 'monthly_tuition') {
    if (tuitionCeilingInfo.ceiling !== null) {
      applicableLimit = tuitionCeilingInfo.ceiling;
      difference = rawFee.amount - applicableLimit;
      if (rawFee.amount <= applicableLimit) {
        status = 'within_limit';
        statusLabel = 'Within published/prototype limit';
        explanation = `Billed Rs. ${rawFee.amount.toLocaleString('en-IN')}, which is within the prototype monthly ceiling of Rs. ${applicableLimit.toLocaleString('en-IN')} for ${school?.category ? `Category ${school.category}` : ''} (${gradeLevel}).`;
        explanationNp = `बिल रकम रु. ${rawFee.amount.toLocaleString('en-IN')}, तोकिएको अधिकतम सीमा रु. ${applicableLimit.toLocaleString('en-IN')} भित्रै छ।`;
      } else {
        status = 'exceeds_limit';
        statusLabel = 'Exceeds configured limit';
        isFlagged = true;
        explanation = `Billed Rs. ${rawFee.amount.toLocaleString('en-IN')} exceeds the configured monthly ceiling of Rs. ${applicableLimit.toLocaleString('en-IN')} by Rs. ${difference.toLocaleString('en-IN')} (+${((difference / applicableLimit) * 100).toFixed(1)}%).`;
        explanationNp = `बिल रकम रु. ${rawFee.amount.toLocaleString('en-IN')} ले तोकिएको अधिकतम सीमा रु. ${applicableLimit.toLocaleString('en-IN')} लाई रु. ${difference.toLocaleString('en-IN')} ले नाघेको छ।`;
      }
      ruleCitation = `${tuitionCeilingInfo.formula} (Ref: ${tuitionCeilingInfo.explanation})`;
    } else {
      status = 'unable_to_verify';
      statusLabel = 'Unable to verify';
      explanation = `Cannot verify numeric limit: ${tuitionCeilingInfo.explanation}`;
      explanationNp = `संख्यात्मक सीमा प्रमाणीकरण गर्न सकिएन।`;
    }
  } else if (feeType === 'annual_fee') {
    if (tuitionCeilingInfo.ceiling !== null) {
      applicableLimit = tuitionCeilingInfo.ceiling * 2;
      difference = rawFee.amount - applicableLimit;
      if (rawFee.amount <= applicableLimit) {
        status = 'within_limit';
        statusLabel = 'Within published/prototype limit';
        explanation = `Billed Rs. ${rawFee.amount.toLocaleString('en-IN')}. In prototype rules, Annual Fee is capped at 2 months' tuition ceiling (2 × Rs. ${tuitionCeilingInfo.ceiling.toLocaleString('en-IN')} = Rs. ${applicableLimit.toLocaleString('en-IN')}).`;
        explanationNp = `वार्षिक शुल्क रु. ${rawFee.amount.toLocaleString('en-IN')} दुई महिनाको मासिक सीमा (रु. ${applicableLimit.toLocaleString('en-IN')}) भित्रै छ।`;
      } else {
        status = 'exceeds_limit';
        statusLabel = 'Exceeds configured limit';
        isFlagged = true;
        explanation = `Billed Rs. ${rawFee.amount.toLocaleString('en-IN')} exceeds the annual fee ceiling (2 × monthly ceiling = Rs. ${applicableLimit.toLocaleString('en-IN')}) by Rs. ${difference.toLocaleString('en-IN')}.`;
        explanationNp = `वार्षिक शुल्कले अधिकतम सीमा (रु. ${applicableLimit.toLocaleString('en-IN')}) लाई रु. ${difference.toLocaleString('en-IN')} ले नाघेको छ।`;
      }
      ruleCitation = `Annual Fee Cap: 2 × Monthly Tuition Ceiling (2 × Rs. ${tuitionCeilingInfo.ceiling.toLocaleString('en-IN')})`;
    } else {
      status = 'no_numeric_rule';
      statusLabel = 'No numeric threshold configured';
      explanation = `Annual fee is recognized, but no base tuition ceiling could be computed to establish the 2× threshold.`;
      explanationNp = `वार्षिक शुल्क शीर्षक मान्य छ, तर आधार मासिक सीमा उपलब्ध छैन।`;
    }
  } else if (feeType === 'admission_fee') {
    const isReAdmission = rawFee.originalLabel.toLowerCase().includes('re-admission') ||
                          rawFee.originalLabel.toLowerCase().includes('readmission') ||
                          (isContinuingStudent && rawFee.originalLabel.toLowerCase().includes('admission'));
    if (isReAdmission) {
      status = 'potential_discrepancy';
      statusLabel = 'Potential discrepancy';
      isFlagged = true;
      explanation = `Flagged: Billed for admission/re-admission for a continuing student. Under the prototype rules, admission fee is only collected once when first entering the institution.`;
      explanationNp = `निरन्तर अध्ययनरत विद्यार्थीसँग पुनः भर्ना शुल्क लिन नपाइने नियम अनुसार यो शुल्क शंकास्पद छ।`;
      ruleCitation = `Admission Fee Rule: One-time fee upon initial entry only. Re-admission fees for continuing students are flagged.`;
    } else {
      status = 'no_numeric_rule';
      statusLabel = 'No numeric threshold configured';
      explanation = def ? def.generalMeaningEn : 'One-time admission fee. No numeric threshold configured in this prototype.';
      explanationNp = def ? def.generalMeaningNp : 'नयाँ विद्यार्थीको पहिलो पटकको भर्ना शुल्क।';
      ruleCitation = `Recognized heading. No numeric threshold configured.`;
    }
  } else if (feeType === 'unrecognized_or_other') {
    status = 'potential_discrepancy';
    statusLabel = 'Potential discrepancy';
    isFlagged = true;
    explanation = `The fee heading "${rawFee.originalLabel}" does not correspond to any of the 14 standard recognized fee categories in the prototype rules. Please request clarification from the school.`;
    explanationNp = `यो शीर्षक "${rawFee.originalLabel}" तोकिएका १४ मान्य शुल्क शीर्षकमा पर्दैन। विद्यालयसँग स्पष्टीकरण माग्नुहोस्।`;
    ruleCitation = `Unmapped heading: does not match recognized municipal prototype categories.`;
  } else {
    status = 'no_numeric_rule';
    statusLabel = 'No numeric threshold configured';
    explanation = def
      ? `${def.generalMeaningEn} (No numeric threshold configured in this prototype).`
      : 'Recognized fee heading. No numeric threshold configured in this prototype.';
    explanationNp = def
      ? `${def.generalMeaningNp} (संख्यात्मक सीमा तोकिएको छैन)`
      : 'मान्य शीर्षक।';
    ruleCitation = `Recognized Fee Heading: ${def?.nameEn || feeType}. General municipal category recognized without specific numeric cap in prototype.`;
  }

  return {
    id: rawFee.id || `fee-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    originalLabel: rawFee.originalLabel,
    normalizedFeeType: feeType,
    normalizedTitle: def ? def.nameEn : norm.titleEn,
    amount: rawFee.amount,
    confidence: norm.confidence,
    status,
    statusLabel,
    applicableLimit,
    difference,
    explanation,
    explanationNp,
    ruleCitation,
    isFlagged,
  };
}

export function parseBillingMonthAndYear(monthStr: string, createdAt?: string): { year: number; month: number; score: number } {
  const clean = (monthStr || '').toLowerCase().trim();
  
  // Extract 4 digit year if present (e.g. 2081, 2080, 2024)
  const yearMatch = clean.match(/\b(20[0-9]{2})\b/);
  let year = yearMatch ? parseInt(yearMatch[1], 10) : 2081;

  let monthIndex = 1;
  // Bikram Sambat months
  if (clean.includes('baisakh') || clean.includes('baishakh') || clean.includes('बैशाख')) monthIndex = 1;
  else if (clean.includes('jestha') || clean.includes('jeth') || clean.includes('जेठ') || clean.includes('जेष्ठ')) monthIndex = 2;
  else if (clean.includes('ashadh') || clean.includes('asad') || clean.includes('asar') || clean.includes('असार') || clean.includes('आषाढ')) monthIndex = 3;
  else if (clean.includes('shrawan') || clean.includes('saun') || clean.includes('sawan') || clean.includes('साउन') || clean.includes('श्रावण')) monthIndex = 4;
  else if (clean.includes('bhadra') || clean.includes('bhadau') || clean.includes('भदौ') || clean.includes('भाद्र')) monthIndex = 5;
  else if (clean.includes('ashwin') || clean.includes('asoj') || clean.includes('aswin') || clean.includes('असोज') || clean.includes('आश्विन')) monthIndex = 6;
  else if (clean.includes('kartik') || clean.includes('katik') || clean.includes('कार्तिक')) monthIndex = 7;
  else if (clean.includes('mangsir') || clean.includes('mangsir') || clean.includes('मंसिर') || clean.includes('मार्ग')) monthIndex = 8;
  else if (clean.includes('poush') || clean.includes('paush') || clean.includes('pus') || clean.includes('पुस') || clean.includes('पौष')) monthIndex = 9;
  else if (clean.includes('magh') || clean.includes('माघ')) monthIndex = 10;
  else if (clean.includes('falgun') || clean.includes('phagun') || clean.includes('फागुन') || clean.includes('फाल्गुन')) monthIndex = 11;
  else if (clean.includes('chaitra') || clean.includes('chait') || clean.includes('चैत') || clean.includes('चैत्र')) monthIndex = 12;
  // Gregorian months
  else if (clean.includes('jan')) monthIndex = 1;
  else if (clean.includes('feb')) monthIndex = 2;
  else if (clean.includes('mar')) monthIndex = 3;
  else if (clean.includes('apr')) monthIndex = 4;
  else if (clean.includes('may')) monthIndex = 5;
  else if (clean.includes('jun')) monthIndex = 6;
  else if (clean.includes('jul')) monthIndex = 7;
  else if (clean.includes('aug')) monthIndex = 8;
  else if (clean.includes('sep')) monthIndex = 9;
  else if (clean.includes('oct')) monthIndex = 10;
  else if (clean.includes('nov')) monthIndex = 11;
  else if (clean.includes('dec')) monthIndex = 12;
  else if (createdAt) {
    const d = new Date(createdAt);
    if (!isNaN(d.getTime())) {
      year = d.getFullYear();
      monthIndex = d.getMonth() + 1;
    }
  }

  const score = year * 100 + monthIndex;
  return { year, month: monthIndex, score };
}

export function getBillChronologicalScore(bill: { billingMonth: string; createdAt?: string }): number {
  return parseBillingMonthAndYear(bill.billingMonth, bill.createdAt).score;
}

export function findPreviousBillForContext(
  current: {
    schoolName: string;
    studentName?: string | null;
    gradeRaw?: string;
    billingMonth: string;
    id?: string;
    userId?: string;
    createdAt?: string;
  },
  savedBills: Bill[]
): Bill | null {
  if (!savedBills || savedBills.length === 0) return null;

  // Filter out current bill itself
  let candidates = savedBills.filter(b => b.id !== current.id);
  if (current.userId) {
    const userCandidates = candidates.filter(b => !b.userId || b.userId === current.userId);
    if (userCandidates.length > 0) {
      candidates = userCandidates;
    }
  }
  if (candidates.length === 0) return null;

  const currentScore = getBillChronologicalScore(current);
  const currentSchoolNorm = current.schoolName.trim().toLowerCase();

  // Sort candidate bills by chronological score descending
  candidates.sort((a, b) => getBillChronologicalScore(b) - getBillChronologicalScore(a));

  // Match same school (and student if specified)
  const schoolCandidates = candidates.filter(b => {
    const bSchool = (b.matchedSchoolName || b.schoolNameFromBill || '').trim().toLowerCase();
    const schoolMatches = bSchool.includes(currentSchoolNorm) || currentSchoolNorm.includes(bSchool);
    const monthDiffers = b.billingMonth.trim().toLowerCase() !== current.billingMonth.trim().toLowerCase();
    return schoolMatches && monthDiffers;
  });

  if (schoolCandidates.length > 0) {
    // 1. Look for immediately prior month (score < currentScore)
    const priorBills = schoolCandidates.filter(b => getBillChronologicalScore(b) < currentScore);
    if (priorBills.length > 0) {
      return priorBills[0]; // Most recent prior month
    }
    // 2. If no earlier bill exists, pick the other available month
    return schoolCandidates[0];
  }

  // Fallback: any other bill with a different month
  const differentMonthBills = candidates.filter(
    b => b.billingMonth.trim().toLowerCase() !== current.billingMonth.trim().toLowerCase()
  );
  if (differentMonthBills.length > 0) {
    const prior = differentMonthBills.filter(b => getBillChronologicalScore(b) < currentScore);
    return prior.length > 0 ? prior[0] : differentMonthBills[0];
  }

  return candidates[0] || null;
}

export function compareBills(billA: Bill, billB: Bill): BillComparison {
  // Determine strictly which bill is chronologically the newer (current) and older (previous)
  const scoreA = getBillChronologicalScore(billA);
  const scoreB = getBillChronologicalScore(billB);

  let currentBill: Bill;
  let previousBill: Bill;

  if (scoreA >= scoreB) {
    currentBill = billA;
    previousBill = billB;
  } else {
    // billB is newer than billA -> auto-swap so current is always newer month!
    currentBill = billB;
    previousBill = billA;
  }

  const difference = currentBill.totalAmount - previousBill.totalAmount;
  const percentageChange = previousBill.totalAmount > 0
    ? (difference / previousBill.totalAmount) * 100
    : 0;

  const feeChanges: BillComparison['feeChanges'] = [];
  const currentMap = new Map<string, ExtractedFee>();
  for (const f of currentBill.extractedFees) {
    currentMap.set(f.normalizedFeeType, f);
  }

  const prevMap = new Map<string, ExtractedFee>();
  for (const f of previousBill.extractedFees) {
    prevMap.set(f.normalizedFeeType, f);
  }

  for (const [type, currFee] of currentMap.entries()) {
    const prevFee = prevMap.get(type);
    if (!prevFee) {
      feeChanges.push({
        feeType: currFee.normalizedFeeType,
        feeTitle: currFee.normalizedTitle,
        previousAmount: 0,
        currentAmount: currFee.amount,
        difference: currFee.amount,
        percentageChange: 100,
        status: 'new_fee',
        changeText: `New fee: ${currFee.normalizedTitle} (+Rs. ${currFee.amount.toLocaleString('en-IN')})`,
      });
    } else {
      const diff = currFee.amount - prevFee.amount;
      const pct = prevFee.amount > 0 ? (diff / prevFee.amount) * 100 : 0;
      let status: 'increased' | 'decreased' | 'unchanged' = 'unchanged';
      let changeText = '';
      if (diff > 0) {
        status = 'increased';
        changeText = `${currFee.normalizedTitle} increased by Rs. ${diff.toLocaleString('en-IN')} (+${pct.toFixed(0)}%).`;
      } else if (diff < 0) {
        status = 'decreased';
        changeText = `${currFee.normalizedTitle} decreased by Rs. ${Math.abs(diff).toLocaleString('en-IN')} (${pct.toFixed(0)}%).`;
      } else {
        changeText = `${currFee.normalizedTitle} unchanged at Rs. ${currFee.amount.toLocaleString('en-IN')}.`;
      }

      feeChanges.push({
        feeType: currFee.normalizedFeeType,
        feeTitle: currFee.normalizedTitle,
        previousAmount: prevFee.amount,
        currentAmount: currFee.amount,
        difference: diff,
        percentageChange: pct,
        status,
        changeText,
      });
    }
  }

  for (const [type, prevFee] of prevMap.entries()) {
    if (!currentMap.has(type)) {
      feeChanges.push({
        feeType: prevFee.normalizedFeeType,
        feeTitle: prevFee.normalizedTitle,
        previousAmount: prevFee.amount,
        currentAmount: 0,
        difference: -prevFee.amount,
        percentageChange: -100,
        status: 'removed_fee',
        changeText: `${prevFee.normalizedTitle} was Rs. ${prevFee.amount.toLocaleString('en-IN')} last month (not billed this month).`,
      });
    }
  }

  const increases = feeChanges
    .filter(f => f.difference > 0)
    .sort((a, b) => b.difference - a.difference);

  const largestIncreases = increases.map(item => ({
    feeTitle: item.feeTitle,
    previousAmount: item.previousAmount,
    currentAmount: item.currentAmount,
    difference: item.difference,
    percentageChange: item.percentageChange,
    displayLine: `${item.feeTitle} +Rs. ${item.difference.toLocaleString('en-IN')}`,
  }));

  let headlineSummary = '';
  if (difference > 0) {
    headlineSummary = `Total bill increased by +Rs. ${difference.toLocaleString('en-IN')} (+${percentageChange.toFixed(1)}%).`;
  } else if (difference < 0) {
    headlineSummary = `Total bill decreased by -Rs. ${Math.abs(difference).toLocaleString('en-IN')} (-${Math.abs(percentageChange).toFixed(1)}%).`;
  } else {
    headlineSummary = 'Total bill remained unchanged compared to previous month.';
  }

  return {
    previousBillId: previousBill.id,
    previousMonth: previousBill.billingMonth,
    previousTotal: previousBill.totalAmount,
    currentTotal: currentBill.totalAmount,
    difference,
    percentageChange,
    feeChanges,
    largestIncreases,
    headlineSummary,
    changeDetectedLabel: difference !== 0 ? 'Change detected' : 'No change',
  };
}

export function auditBillData(input: {
  schoolName: string;
  grade: string;
  billingMonth: string;
  studentName?: string | null;
  extractedFees: {
    id?: string;
    originalLabel: string;
    amount: number;
    normalizedFeeType?: string;
  }[];
  total?: number | null;
  isContinuingStudent?: boolean;
}): BillAuditReport {
  const matchedSchool = lookupSchool(input.schoolName);
  const schoolMatchStatus = matchedSchool ? 'matched' : 'not_found';
  const schoolName = matchedSchool ? matchedSchool.name : input.schoolName;
  const municipality = 'Bharatpur Metropolitan City';
  const schoolType = matchedSchool
    ? (matchedSchool.isPrivateOrInstitutional ? 'Private / Institutional' : 'Public / Community')
    : 'Unknown';
  const category = matchedSchool ? matchedSchool.category : null;

  const gradeInfo = determineGradeLevel(input.grade);
  const rawGrade = input.grade;
  const gradeLevel = gradeInfo.gradeLevel;
  const numericGrade = gradeInfo.numericGrade;

  const ceilingResult = calculateTuitionCeiling(category, gradeLevel);
  const monthlyTuitionCeiling = ceilingResult.ceiling;
  const monthlyCeilingFormula = ceilingResult.formula;
  const annualFeeCeiling = calculateAnnualFeeCeiling(monthlyTuitionCeiling);

  const defaultSourceMetadata = {
    sourceLabel: matchedSchool?.sourceLabel || 'BMC Prototype Fee Standard v1 (Chitwan)',
    sourcePage: matchedSchool?.sourcePage || 'Municipal Fee Ceiling Annex 1',
  };

  const isContinuing = input.isContinuingStudent !== false;

  const auditedFees: AuditedFeeItem[] = input.extractedFees.map((fee, idx) => {
    const rawLabel = fee.originalLabel;
    const amount = Number(fee.amount) || 0;
    const norm = normalizeFeeHeading(rawLabel);
    const feeType = (fee.normalizedFeeType && fee.normalizedFeeType !== 'Needs review'
      ? norm.type
      : norm.type);
    const def = norm.definition || RECOGNIZED_FEE_HEADINGS.find(h => h.type === feeType);
    const feeId = fee.id || `audited-fee-${idx + 1}-${Date.now()}`;
    const feeName = def ? def.nameEn : (fee.normalizedFeeType || norm.titleEn);

    let status: FeeEvaluationStatus = 'no_numeric_rule';
    let statusLabel = 'Recognized - no numeric threshold configured in this prototype.';
    let applicableLimit: number | null = null;
    let difference: number | null = null;
    let shortExplanation = '';
    let conditionalNote: string | undefined = undefined;

    let whyExplanation = {
      reasonHeadline: '',
      ruleExplanation: '',
      calculationText: undefined as string | undefined,
      differenceText: undefined as string | undefined,
      schoolCategoryText: matchedSchool && category
        ? `School Category: Category ${category} (in Bharatpur prototype dataset)`
        : 'School category is unassigned/community in prototype dataset',
      gradeText: `Grade Classification: ${gradeLevel} (${rawGrade})`,
      discrepancyAction: undefined as string | undefined,
      sourceMetadata: defaultSourceMetadata,
      prototypeNotice: 'Based on Bharatpur Metropolitan prototype fee standard guidelines.',
    };

    if (feeType === 'monthly_tuition') {
      if (monthlyTuitionCeiling !== null) {
        applicableLimit = monthlyTuitionCeiling;
        difference = amount - monthlyTuitionCeiling;
        const baselineGa = ceilingResult.baselineGaAmount || 1100;
        const multiplier = ceilingResult.multiplier || 1.0;

        if (amount <= monthlyTuitionCeiling) {
          status = 'within_limit';
          statusLabel = 'Within configured limit';
          shortExplanation = `Charged Rs. ${amount.toLocaleString('en-IN')}, which is within the configured ceiling of Rs. ${monthlyTuitionCeiling.toLocaleString('en-IN')}.`;
          whyExplanation.reasonHeadline = `Within Category ${category} monthly tuition ceiling for ${gradeLevel}.`;
          whyExplanation.ruleExplanation = `Under municipal fee standards, Category ${category} institutions have a maximum tuition ceiling of Rs. ${monthlyTuitionCeiling.toLocaleString('en-IN')}/month for ${gradeLevel} (${rawGrade}). Your billed amount of Rs. ${amount.toLocaleString('en-IN')} complies with this limit.`;
          whyExplanation.calculationText = `Ceiling Formula: Rs. ${baselineGa.toLocaleString('en-IN')} (Ga Baseline) × ${multiplier.toFixed(2)} (${category} Multiplier) = Rs. ${monthlyTuitionCeiling.toLocaleString('en-IN')}/mo`;
          whyExplanation.differenceText = `Margin: Rs. ${Math.abs(difference).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} under allowable ceiling`;
        } else {
          status = 'exceeds_limit';
          statusLabel = 'Exceeds configured limit';
          shortExplanation = `Charged Rs. ${amount.toLocaleString('en-IN')}, exceeding the configured ceiling of Rs. ${monthlyTuitionCeiling.toLocaleString('en-IN')} by Rs. ${difference.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`;
          const excessPct = ((difference / monthlyTuitionCeiling) * 100).toFixed(1);
          whyExplanation.reasonHeadline = `Tuition fee exceeds the Category ${category} ceiling of Rs. ${monthlyTuitionCeiling.toLocaleString('en-IN')} by Rs. ${difference.toLocaleString('en-IN')} (+${excessPct}%).`;
          whyExplanation.ruleExplanation = `Municipal fee regulations set the maximum allowable tuition for Category ${category} ${gradeLevel} at Rs. ${monthlyTuitionCeiling.toLocaleString('en-IN')}/month. The school has charged Rs. ${amount.toLocaleString('en-IN')}, resulting in an unauthorized surcharge of Rs. ${difference.toLocaleString('en-IN')}.`;
          whyExplanation.calculationText = `Ceiling Formula: Rs. ${baselineGa.toLocaleString('en-IN')} (Ga Baseline) × ${multiplier.toFixed(2)} (${category} Multiplier) = Rs. ${monthlyTuitionCeiling.toLocaleString('en-IN')}/mo. (Billed: Rs. ${amount.toLocaleString('en-IN')})`;
          whyExplanation.differenceText = `Excess Surcharge: +Rs. ${difference.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          whyExplanation.discrepancyAction = `Request school administration to adjust monthly tuition to the approved Category ${category} ceiling of Rs. ${monthlyTuitionCeiling.toLocaleString('en-IN')}/month.`;
        }
      } else {
        status = 'unable_to_verify';
        statusLabel = 'Unable to verify';
        shortExplanation = matchedSchool
          ? 'School is a community school without institutional tier ceilings in this prototype dataset.'
          : 'School was not found in the prototype registry, so numeric limits cannot be verified.';
        whyExplanation.reasonHeadline = 'Unable to verify numeric ceiling for this institution.';
        whyExplanation.ruleExplanation = matchedSchool
          ? 'Public/Community schools operate under government funding and do not use private institutional tier multipliers (Ka/Kha/Ga/Gha).'
          : 'This school name is not yet cataloged in the Bharatpur prototype dataset. Numeric limit calculation is not possible.';
      }
    } else if (feeType === 'annual_fee') {
      if (annualFeeCeiling !== null && monthlyTuitionCeiling !== null) {
        applicableLimit = annualFeeCeiling;
        difference = amount - annualFeeCeiling;
        if (amount <= annualFeeCeiling) {
          status = 'within_limit';
          statusLabel = 'Within configured limit';
          shortExplanation = `Annual fee charged Rs. ${amount.toLocaleString('en-IN')}, within the 2-month tuition ceiling limit (Rs. ${annualFeeCeiling.toLocaleString('en-IN')}).`;
          whyExplanation.reasonHeadline = `Annual Fee is within the 2-month tuition ceiling limit.`;
          whyExplanation.ruleExplanation = `Under municipal fee regulations, the total annual charges (sports, maintenance, ECA) are legally capped at a maximum of 2 months of the applicable tuition ceiling (2 × Rs. ${monthlyTuitionCeiling.toLocaleString('en-IN')} = Rs. ${annualFeeCeiling.toLocaleString('en-IN')}). It must be charged as an annual fee, not monthly.`;
          whyExplanation.calculationText = `Annual Fee Cap = 2 × Monthly Tuition Ceiling (2 × Rs. ${monthlyTuitionCeiling.toLocaleString('en-IN')} = Rs. ${annualFeeCeiling.toLocaleString('en-IN')}). Billed: Rs. ${amount.toLocaleString('en-IN')}.`;
          whyExplanation.differenceText = `Margin: Rs. ${Math.abs(difference).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} under annual cap`;
        } else {
          status = 'exceeds_limit';
          statusLabel = 'Exceeds configured limit';
          shortExplanation = `Annual fee charged Rs. ${amount.toLocaleString('en-IN')}, exceeding the annual ceiling (2 × monthly ceiling = Rs. ${annualFeeCeiling.toLocaleString('en-IN')}) by Rs. ${difference.toLocaleString('en-IN')}.`;
          whyExplanation.reasonHeadline = `Annual fee exceeds the statutory 2-month tuition cap by Rs. ${difference.toLocaleString('en-IN')}.`;
          whyExplanation.ruleExplanation = `Schools are legally prohibited from collecting more than 2 months of the applicable monthly tuition ceiling as Annual Fee. The statutory cap is Rs. ${annualFeeCeiling.toLocaleString('en-IN')}, but Rs. ${amount.toLocaleString('en-IN')} was billed.`;
          whyExplanation.calculationText = `Annual Cap = 2 × Monthly Ceiling (2 × Rs. ${monthlyTuitionCeiling.toLocaleString('en-IN')} = Rs. ${annualFeeCeiling.toLocaleString('en-IN')}). Billed: Rs. ${amount.toLocaleString('en-IN')}.`;
          whyExplanation.differenceText = `Excess over Annual Cap: +Rs. ${difference.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          whyExplanation.discrepancyAction = `Request school accounts to reduce the annual fee to the maximum statutory limit of Rs. ${annualFeeCeiling.toLocaleString('en-IN')}.`;
        }
      } else {
        status = 'no_numeric_rule';
        statusLabel = 'Recognized - no numeric threshold configured in this prototype.';
        shortExplanation = 'Annual Fee is a recognized heading. A base monthly ceiling was not available to compute the 2× threshold.';
        whyExplanation.reasonHeadline = 'Recognized standard fee heading (Annual Fee).';
        whyExplanation.ruleExplanation = 'Annual fee covers whole-year sports, extracurricular activities, and school building upkeep. Capped at 2 months tuition when tuition ceiling is verifiable.';
      }
    } else if (feeType === 'admission_fee') {
      const lower = rawLabel.toLowerCase();
      const isReAdmission = lower.includes('re-admission') || lower.includes('readmission') || (isContinuing && lower.includes('re admission')) || (isContinuing && lower.includes('admission'));
      if (isReAdmission) {
        status = 'potential_discrepancy';
        statusLabel = 'Potential discrepancy';
        shortExplanation = 'Flagged: Re-admission charge for a continuing student. Under prototype rules, admission fee is only applicable once upon initial enrollment.';
        whyExplanation.reasonHeadline = `Recurring Re-Admission / Registration fee charged to a continuing student is prohibited.`;
        whyExplanation.ruleExplanation = `Under Supreme Court directives and municipal education regulations in Nepal, institutional schools may ONLY collect an admission fee once when a student is first enrolled. Charging re-admission, session renewal, or annual re-registration fees to continuing students moving to the next grade is unlawful.`;
        whyExplanation.calculationText = `Standard Rule: Allowable re-admission for continuing students = Rs. 0. Billed: Rs. ${amount.toLocaleString('en-IN')}.`;
        whyExplanation.differenceText = `Flagged unauthorized charge: Rs. ${amount.toLocaleString('en-IN')}`;
        whyExplanation.discrepancyAction = `Request school administration to remove the Rs. ${amount.toLocaleString('en-IN')} re-admission fee since the student is continuing their studies at the same school.`;
      } else {
        status = 'no_numeric_rule';
        statusLabel = 'Recognized - no numeric threshold configured in this prototype.';
        shortExplanation = 'First-time admission fee is a recognized category. No numeric threshold configured in this prototype.';
        whyExplanation.reasonHeadline = `First-time Admission Fee for initial institutional enrollment.`;
        whyExplanation.ruleExplanation = `Approved one-time charge collected strictly upon initial entry to the school. (No specific numeric ceiling configured in this prototype dataset).`;
      }
    } else if (feeType === 'computer_fee') {
      status = 'recognized_heading';
      statusLabel = 'Recognized fee heading';
      shortExplanation = 'Computer Fee is a recognized municipal heading covering practical lab sessions and IT facilities.';
      whyExplanation.reasonHeadline = `Approved standard heading for computer practical classes and lab upkeep.`;
      whyExplanation.ruleExplanation = `Computer fee is an authorized heading under the 14 recognized municipal categories. It covers computer lab hardware maintenance, software licenses, internet bandwidth, and practical instruction. No specific numeric ceiling is fixed in this prototype.`;
    } else if (feeType === 'examination_fee') {
      status = 'recognized_heading';
      statusLabel = 'Recognized fee heading';
      shortExplanation = 'Examination Fee is a recognized municipal heading covering terminal tests and report cards.';
      whyExplanation.reasonHeadline = `Approved standard heading for examination administration and evaluation.`;
      whyExplanation.ruleExplanation = `Examination fee is an authorized municipal heading covering question paper preparation, exam stationery, answer sheet evaluation, terminal tests, and report cards. No specific numeric cap is fixed in this prototype.`;
    } else if (feeType === 'transportation_fee') {
      status = 'no_numeric_rule';
      statusLabel = 'Recognized - no numeric threshold configured in this prototype.';
      shortExplanation = 'Transportation Fee is an approved optional auxiliary service charge.';
      conditionalNote = 'Only relevant if student uses the school bus.';
      whyExplanation.reasonHeadline = `Approved auxiliary service heading for school bus transit.`;
      whyExplanation.ruleExplanation = `Transportation fee is an authorized heading for students opting for designated school bus or van transit. It should reflect route distance and fuel/operating costs.`;
    } else if (feeType === 'meal_fee') {
      status = 'no_numeric_rule';
      statusLabel = 'Recognized - no numeric threshold configured in this prototype.';
      shortExplanation = 'Meal Fee is an approved optional auxiliary charge.';
      conditionalNote = 'Only relevant if canteen / tiffin service is used.';
      whyExplanation.reasonHeadline = `Approved auxiliary service heading for school meals or daytime tiffin.`;
      whyExplanation.ruleExplanation = `Meal fee is an authorized heading for canteen or daytime snacks/tiffin provided to students who opt into the service.`;
    } else if (feeType === 'hostel_accommodation_fee') {
      status = 'no_numeric_rule';
      statusLabel = 'Recognized - no numeric threshold configured in this prototype.';
      shortExplanation = 'Hostel Fee is an approved charge strictly for residential boarding students.';
      conditionalNote = 'Only relevant if student is boarding.';
      whyExplanation.reasonHeadline = `Approved residential fee for student boarding and lodging.`;
      whyExplanation.ruleExplanation = `Hostel accommodation is an authorized heading applicable strictly for residential students residing on campus.`;
    } else if (feeType === 'educational_materials_fee') {
      status = 'no_numeric_rule';
      statusLabel = 'Recognized - no numeric threshold configured in this prototype.';
      shortExplanation = 'Educational Materials Fee is an approved heading for distributed books, diaries, and stationery.';
      whyExplanation.reasonHeadline = `Approved heading for school-distributed educational learning materials.`;
      whyExplanation.ruleExplanation = `Covers actual costs of textbooks, homework diaries, school notebooks, or logbooks directly distributed by the school to the student.`;
    } else if (feeType === 'special_training_fee') {
      status = 'no_numeric_rule';
      statusLabel = 'Recognized - no numeric threshold configured in this prototype.';
      shortExplanation = 'Special Training Fee is an approved heading for optional training like karate, music, or dance.';
      whyExplanation.reasonHeadline = `Approved heading for optional specialized extracurricular training.`;
      whyExplanation.ruleExplanation = `Covers optional extracurricular programs such as martial arts (Karate/Taekwondo), music, dance, or specialized sports training.`;
    } else if (feeType === 'educational_tour_fee') {
      status = 'no_numeric_rule';
      statusLabel = 'Recognized - no numeric threshold configured in this prototype.';
      shortExplanation = 'Educational Tour Fee is an approved heading for excursions and study field visits.';
      whyExplanation.reasonHeadline = `Approved heading for educational field excursions and site visits.`;
      whyExplanation.ruleExplanation = `Covers actual transportation, entry, and logistical costs for organized botanical, museum, or study field visits outside the school.`;
    } else if (feeType === 'inter_school_competitions_fee') {
      status = 'no_numeric_rule';
      statusLabel = 'Recognized - no numeric threshold configured in this prototype.';
      shortExplanation = 'Inter-School Competitions Fee is an approved heading for participating in external events.';
      whyExplanation.reasonHeadline = `Approved heading for external competition participation.`;
      whyExplanation.ruleExplanation = `Covers registration and logistics for students representing the school in municipal, district, or regional sports and academic events.`;
    } else if (feeType === 'security_deposit') {
      status = 'no_numeric_rule';
      statusLabel = 'Recognized - no numeric threshold configured in this prototype.';
      shortExplanation = 'Security Deposit is a refundable caution amount collected upon enrollment.';
      whyExplanation.reasonHeadline = `Approved refundable caution deposit collected upon initial admission.`;
      whyExplanation.ruleExplanation = `Refundable security deposit collected during initial enrollment. Under regulations, this amount must be fully refunded when the student leaves or graduates.`;
    } else if (feeType === 'transfer_certificate_fee') {
      status = 'no_numeric_rule';
      statusLabel = 'Recognized - no numeric threshold configured in this prototype.';
      shortExplanation = 'Transfer Certificate Fee is an approved administrative fee upon student departure.';
      whyExplanation.reasonHeadline = `Approved one-time administrative fee for transfer/character certificate.`;
      whyExplanation.ruleExplanation = `Administrative processing fee for issuing student character, migration, or transfer certificate upon graduation or school change.`;
    } else if (feeType === 'unrecognized_or_other' || fee.normalizedFeeType === 'Needs review') {
      status = 'potential_discrepancy';
      statusLabel = 'Potential discrepancy / unrecognized fee heading';
      shortExplanation = `This fee heading is not in the recognized fee list under prototype rules. Please request clarification from the school.`;
      whyExplanation.reasonHeadline = `Unrecognized fee label "${rawLabel}" is not an authorized municipal fee category.`;
      whyExplanation.ruleExplanation = `Municipal education bylaws define 14 exclusive approved school fee headings. Arbitrary labels (such as "Institutional Development Charge", "Teacher Welfare Support", or unmapped miscellaneous fees) are not permitted without explicit municipal approval.`;
      whyExplanation.calculationText = `Rule: Only 14 standard fee categories are permitted. "${rawLabel}" does not match any approved category.`;
      whyExplanation.differenceText = `Unmapped charge amount: Rs. ${amount.toLocaleString('en-IN')}`;
      whyExplanation.discrepancyAction = `Request school accounts to explain what "${rawLabel}" covers and provide the municipal authorization permitting this extra charge.`;
    } else {
      status = 'recognized_heading';
      statusLabel = 'Recognized fee heading';
      shortExplanation = `${def?.nameEn || rawLabel} is a recognized school fee heading under prototype rules. No numeric threshold configured in this prototype.`;
      whyExplanation.reasonHeadline = `Recognized municipal fee heading: ${def?.nameEn || rawLabel}.`;
      whyExplanation.ruleExplanation = def?.generalMeaningEn || 'Recognized category without specific numeric cap configured in prototype.';
    }

    return {
      id: feeId,
      originalLabel: rawLabel,
      feeName,
      normalizedFeeType: feeType,
      amount,
      status,
      statusLabel,
      applicableLimit,
      difference,
      shortExplanation,
      whyExplanation,
      conditionalNote,
    };
  });

  const totalBilled = input.total || auditedFees.reduce((sum, f) => sum + f.amount, 0);
  const totalRecognizedCharges = auditedFees
    .filter(f => f.normalizedFeeType !== 'unrecognized_or_other')
    .reduce((sum, f) => sum + f.amount, 0);
  const totalUnrecognizedCharges = auditedFees
    .filter(f => f.normalizedFeeType === 'unrecognized_or_other')
    .reduce((sum, f) => sum + f.amount, 0);

  const discrepancyList = auditedFees
    .filter(f => f.status === 'exceeds_limit' || f.status === 'potential_discrepancy')
    .map(f => {
      let issue = '';
      let recommendation = '';
      if (f.status === 'exceeds_limit') {
        issue = `Exceeds configured limit of Rs. ${f.applicableLimit?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} by Rs. ${f.difference?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        recommendation = 'Request explanation regarding surcharge above the municipal category ceiling.';
      } else if (f.normalizedFeeType === 'unrecognized_or_other') {
        issue = 'This fee heading is not in the recognized fee list under prototype rules';
        recommendation = 'Request written itemization and justification from school administration.';
      } else if (f.normalizedFeeType === 'admission_fee') {
        issue = 'Re-admission charged for continuing student';
        recommendation = 'Clarify admission vs regular tuition charge with school accounts.';
      } else {
        issue = 'Potential fee discrepancy';
        recommendation = 'Verify with school administration.';
      }
      return {
        id: f.id,
        originalLabel: f.originalLabel,
        feeName: f.feeName,
        amount: f.amount,
        difference: f.difference,
        status: f.status,
        issue,
        recommendation,
      };
    });

  const withinLimits = auditedFees.filter(f => f.status === 'within_limit').length;
  const exceedsLimit = auditedFees.filter(f => f.status === 'exceeds_limit').length;
  const potentialDiscrepancies = auditedFees.filter(f => f.status === 'potential_discrepancy').length;
  const recognizedNoThreshold = auditedFees.filter(f => f.status === 'no_numeric_rule' || f.status === 'recognized_heading').length;
  const unableToVerify = auditedFees.filter(f => f.status === 'unable_to_verify').length;

  return {
    matchedSchool,
    schoolMatchStatus,
    schoolName,
    municipality,
    schoolType,
    category,
    dataStatus: 'Demo dataset',
    rawGrade,
    gradeLevel,
    numericGrade,
    monthlyTuitionCeiling,
    monthlyCeilingFormula,
    annualFeeCeiling,
    auditedFees,
    totalBilled,
    totalRecognizedCharges,
    totalUnrecognizedCharges,
    discrepancyList,
    counts: {
      totalCharges: auditedFees.length,
      withinLimits,
      exceedsLimit,
      potentialDiscrepancies,
      recognizedNoThreshold,
      unableToVerify,
    },
  };
}
