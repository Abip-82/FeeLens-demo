/**
 * Deterministic Demo Extraction Data for Sample Bills
 */
export interface ExtractedBillData {
  schoolName: string;
  grade: string;
  billingMonth: string;
  studentName?: string | null;
  extractedFees: {
    id: string;
    originalLabel: string;
    amount: number;
    normalizedFeeType: string;
    confidence: number;
  }[];
  total?: number | null;
  extractionNotes?: string;
  imageThumbnail?: string;
  isContinuingStudent?: boolean;
}

export const DEMO_SAMPLE_EXTRACTIONS: Record<string, ExtractedBillData> = {
  'demo-1': {
    schoolName: 'Bharatpur Demo Academy C',
    grade: 'Grade 4',
    billingMonth: 'Baisakh 2081',
    studentName: 'Aarav Shrestha',
    isContinuingStudent: true,
    extractedFees: [
      {
        id: 'd1-1',
        originalLabel: 'Monthly Tuition Fee',
        amount: 1000,
        normalizedFeeType: 'Monthly Tuition Fee',
        confidence: 0.98,
      },
      {
        id: 'd1-2',
        originalLabel: 'Exam Fee (First Term)',
        amount: 450,
        normalizedFeeType: 'Examination Fee',
        confidence: 0.94,
      },
      {
        id: 'd1-3',
        originalLabel: 'Educational Materials (Notebooks & Diary)',
        amount: 350,
        normalizedFeeType: 'Educational Materials Fee',
        confidence: 0.92,
      },
    ],
    total: 1800,
    extractionNotes: 'Receipt clearly printed. 3 fee items identified with high confidence.',
  },
  'demo-2': {
    schoolName: 'Bharatpur Demo Academy B',
    grade: 'Grade 9',
    billingMonth: 'Baisakh 2081',
    studentName: 'Prashant Adhikari',
    isContinuingStudent: true,
    extractedFees: [
      {
        id: 'd2-1',
        originalLabel: 'Monthly Tuition',
        amount: 3200,
        normalizedFeeType: 'Monthly Tuition Fee',
        confidence: 0.96,
      },
      {
        id: 'd2-2',
        originalLabel: 'Annual Re-Admission & Registration Fee',
        amount: 2500,
        normalizedFeeType: 'Admission Fee',
        confidence: 0.93,
      },
      {
        id: 'd2-3',
        originalLabel: 'Computer Practical Lab',
        amount: 600,
        normalizedFeeType: 'Computer Fee',
        confidence: 0.95,
      },
      {
        id: 'd2-4',
        originalLabel: 'Bus Fare (Route 3)',
        amount: 1100,
        normalizedFeeType: 'Transportation Fee',
        confidence: 0.96,
      },
    ],
    total: 7400,
    extractionNotes: 'Standard printed receipt. 4 fee lines extracted.',
  },
  'demo-3': {
    schoolName: 'Bharatpur Demo Academy A',
    grade: 'Grade 7',
    billingMonth: 'Jestha 2081',
    studentName: 'Suman Thapa',
    isContinuingStudent: true,
    extractedFees: [
      {
        id: 'd3-1',
        originalLabel: 'Tuition Fee',
        amount: 1800,
        normalizedFeeType: 'Monthly Tuition Fee',
        confidence: 0.97,
      },
      {
        id: 'd3-2',
        originalLabel: 'Special Institutional Development Charge',
        amount: 1200,
        normalizedFeeType: 'Needs review',
        confidence: 0.45,
      },
      {
        id: 'd3-3',
        originalLabel: 'Teacher Welfare Overhead Support',
        amount: 750,
        normalizedFeeType: 'Needs review',
        confidence: 0.4,
      },
      {
        id: 'd3-4',
        originalLabel: 'Computer Lab Fee',
        amount: 700,
        normalizedFeeType: 'Computer Fee',
        confidence: 0.92,
      },
      {
        id: 'd3-5',
        originalLabel: 'Transport Charge',
        amount: 500,
        normalizedFeeType: 'Transportation Fee',
        confidence: 0.95,
      },
    ],
    total: 4950,
    extractionNotes: 'Notice: 2 items could not be mapped to standard fee categories and are marked "Needs review".',
  },
};
