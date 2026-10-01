/**
 * FeeLens Core Types
 * Controlled Prototype for Bharatpur Metropolitan City, Chitwan
 */

export type SchoolCategory = 'Ka' | 'Kha' | 'Ga' | 'Gha' | null;
export type GradeLevel = 'Primary' | 'Lower Secondary' | 'Secondary' | 'Unknown';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  studentName?: string;
  schoolName?: string;
  grade?: string;
  avatar?: string;
  createdAt: string;
}

export interface School {
  id: string;
  name: string;
  municipality: string;
  isPrivateOrInstitutional: boolean;
  category: SchoolCategory;
  sourceLabel: string;
  sourcePage: string;
  isDemo: boolean;
  address?: string;
}

export type FeeCategoryType =
  | 'monthly_tuition'
  | 'annual_fee'
  | 'admission_fee'
  | 'security_deposit'
  | 'examination_fee'
  | 'computer_fee'
  | 'transfer_certificate_fee'
  | 'special_training_fee'
  | 'hostel_accommodation_fee'
  | 'meal_fee'
  | 'transportation_fee'
  | 'educational_tour_fee'
  | 'inter_school_competitions_fee'
  | 'educational_materials_fee'
  | 'unrecognized_or_other';

export type FeeEvaluationStatus =
  | 'within_limit'
  | 'exceeds_limit'
  | 'potential_discrepancy'
  | 'recognized_heading'
  | 'no_numeric_rule'
  | 'unable_to_verify';

export interface ExtractedFee {
  id: string;
  originalLabel: string;
  normalizedFeeType: FeeCategoryType;
  normalizedTitle: string;
  amount: number;
  confidence: number;
  status: FeeEvaluationStatus;
  statusLabel: string;
  applicableLimit?: number | null;
  difference?: number | null;
  explanation: string;
  explanationNp?: string;
  ruleCitation?: string;
  isFlagged: boolean;
}

export interface Bill {
  id: string;
  userId?: string;
  createdAt: string;
  billingMonth: string;
  billingYear?: string;
  studentName?: string;
  schoolNameFromBill: string;
  matchedSchoolId: string | null;
  matchedSchoolName?: string;
  gradeRaw: string;
  gradeNumeric: number | null;
  gradeLevel: GradeLevel;
  schoolCategory: SchoolCategory;
  isContinuingStudent?: boolean;
  extractedFees: ExtractedFee[];
  totalAmount: number;
  confidence: number;
  notes?: string;
  isDemo?: boolean;
  imageReference?: string;
  dateAnalyzed?: string;
  municipality?: string;
  schoolType?: string;
  monthlyTuitionCeiling?: number | null;
  annualFeeCeiling?: number | null;
  monthlyCeilingFormula?: string;
  ruleMetadata?: {
    sourceLabel: string;
    sourcePage: string;
  };
  auditSummary?: {
    totalCharges: number;
    withinLimits: number;
    exceedsLimit: number;
    potentialDiscrepancies: number;
    recognizedNoThreshold: number;
    unableToVerify: number;
    discrepancyCount: number;
    status: 'clean' | 'has_discrepancy';
  };
  discrepancies?: {
    id: string;
    originalLabel: string;
    feeName: string;
    amount: number;
    difference?: number | null;
    status: FeeEvaluationStatus;
    issue: string;
    recommendation: string;
  }[];
}

export interface FeeHeadingDefinition {
  type: FeeCategoryType;
  nameEn: string;
  nameNp: string;
  generalMeaningEn: string;
  generalMeaningNp: string;
  ruleSummaryEn: string;
  hasNumericCeiling: boolean;
  synonyms: string[];
}

export interface BillComparison {
  previousBillId: string;
  previousMonth: string;
  previousTotal: number;
  currentTotal: number;
  difference: number;
  percentageChange: number;
  feeChanges: {
    feeType: FeeCategoryType;
    feeTitle: string;
    previousAmount: number;
    currentAmount: number;
    difference: number;
    percentageChange?: number;
    status: 'increased' | 'decreased' | 'unchanged' | 'new_fee' | 'removed_fee';
    changeText?: string;
  }[];
  largestIncreases?: {
    feeTitle: string;
    originalLabel?: string;
    previousAmount: number;
    currentAmount: number;
    difference: number;
    percentageChange?: number;
    displayLine: string;
  }[];
  headlineSummary?: string;
  changeDetectedLabel?: string;
}

export interface AuditedFeeItem {
  id: string;
  originalLabel: string;
  feeName: string;
  normalizedFeeType: FeeCategoryType;
  amount: number;
  status: FeeEvaluationStatus;
  statusLabel: string;
  applicableLimit?: number | null;
  difference?: number | null;
  shortExplanation: string;
  whyExplanation: {
    reasonHeadline: string;
    ruleExplanation: string;
    calculationText?: string;
    differenceText?: string;
    schoolCategoryText?: string;
    gradeText?: string;
    discrepancyAction?: string;
    sourceMetadata: {
      sourceLabel: string;
      sourcePage: string;
    };
    prototypeNotice?: string;
  };
  conditionalNote?: string;
}

export interface BillAuditReport {
  matchedSchool: School | null;
  schoolMatchStatus: 'matched' | 'not_found';
  schoolName: string;
  municipality: string;
  schoolType: 'Private / Institutional' | 'Public / Community' | 'Unknown';
  category: SchoolCategory;
  dataStatus: 'Demo dataset';
  rawGrade: string;
  gradeLevel: GradeLevel;
  numericGrade: number | null;
  monthlyTuitionCeiling: number | null;
  monthlyCeilingFormula: string;
  annualFeeCeiling: number | null;
  auditedFees: AuditedFeeItem[];
  totalBilled: number;
  totalRecognizedCharges: number;
  totalUnrecognizedCharges: number;
  discrepancyList: {
    id: string;
    originalLabel: string;
    feeName: string;
    amount: number;
    difference?: number | null;
    status: FeeEvaluationStatus;
    issue: string;
    recommendation: string;
  }[];
  counts: {
    totalCharges: number;
    withinLimits: number;
    potentialDiscrepancies: number;
    recognizedNoThreshold: number;
    unableToVerify: number;
    exceedsLimit: number;
  };
}
