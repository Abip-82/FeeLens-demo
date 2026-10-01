/**
 * Synthetic Demo Bills for FeeLens Prototype
 */
import { Bill } from '../types';
import { evaluateFee, determineGradeLevel } from '../services/rulesEngine';
import { DEMO_SCHOOLS } from './schools';

const schoolC = DEMO_SCHOOLS.find(s => s.id === 'bmc-demo-003')!; // Ga
const schoolB = DEMO_SCHOOLS.find(s => s.id === 'bmc-demo-002')!; // Kha
const schoolA = DEMO_SCHOOLS.find(s => s.id === 'bmc-demo-001')!; // Ka

// DEMO 1: Compliant
export const DEMO_BILL_1: Bill = (() => {
  const gradeInfo = determineGradeLevel(4);
  const rawFees = [
    { originalLabel: 'Monthly Tuition Fee', amount: 1000 },
    { originalLabel: 'Examination Fee (First Term)', amount: 450 },
    { originalLabel: 'Educational Materials (Notebooks & Diary)', amount: 350 },
  ];
  const evaluated = rawFees.map(f => evaluateFee(f, schoolC, gradeInfo.gradeLevel, true));
  const total = evaluated.reduce((sum, f) => sum + f.amount, 0);

  return {
    id: 'demo-bill-001-compliant',
    createdAt: '2026-04-15T09:30:00Z',
    billingMonth: 'Baisakh 2081',
    billingYear: '2081',
    studentName: 'Aarav Shrestha',
    schoolNameFromBill: 'Bharatpur Demo Academy C',
    matchedSchoolId: schoolC.id,
    matchedSchoolName: schoolC.name,
    gradeRaw: 'Grade 4',
    gradeNumeric: 4,
    gradeLevel: gradeInfo.gradeLevel,
    schoolCategory: schoolC.category,
    isContinuingStudent: true,
    extractedFees: evaluated,
    totalAmount: total,
    confidence: 0.98,
    notes: 'Demonstration bill: All fee lines comply with the Ga baseline ceiling and recognized headings.',
    isDemo: true,
  };
})();

// DEMO 2: Exceeds tuition threshold + illegal re-admission charge
export const DEMO_BILL_2: Bill = (() => {
  const gradeInfo = determineGradeLevel(9);
  const rawFees = [
    { originalLabel: 'Monthly Tuition Fee', amount: 3200 }, // Ceiling for Kha Grade 9 is 1700 * 1.25 = 2125
    { originalLabel: 'Annual Re-Admission & Registration Fee', amount: 2500 }, // Discrepancy for continuing student
    { originalLabel: 'Computer Practical Lab Fee', amount: 600 },
    { originalLabel: 'Bus Fare (Route 3)', amount: 1100 },
  ];
  const evaluated = rawFees.map(f => evaluateFee(f, schoolB, gradeInfo.gradeLevel, true));
  const total = evaluated.reduce((sum, f) => sum + f.amount, 0);

  return {
    id: 'demo-bill-002-exceeds-limit',
    createdAt: '2026-04-18T11:00:00Z',
    billingMonth: 'Baisakh 2081',
    billingYear: '2081',
    studentName: 'Prashant Adhikari',
    schoolNameFromBill: 'Bharatpur Demo Academy B',
    matchedSchoolId: schoolB.id,
    matchedSchoolName: schoolB.name,
    gradeRaw: 'Class 9',
    gradeNumeric: 9,
    gradeLevel: gradeInfo.gradeLevel,
    schoolCategory: schoolB.category,
    isContinuingStudent: true,
    extractedFees: evaluated,
    totalAmount: total,
    confidence: 0.96,
    notes: 'Demonstration bill: Monthly tuition exceeds Category Kha ceiling by Rs. 1,075, and re-admission is charged to a continuing student.',
    isDemo: true,
  };
})();

// DEMO 3A: Previous month baseline for Demo 3 (Baisakh)
export const DEMO_BILL_3_PREV: Bill = (() => {
  const gradeInfo = determineGradeLevel(7);
  const rawFees = [
    { originalLabel: 'Monthly Tuition Fee', amount: 1800 },
    { originalLabel: 'Computer Lab Fee', amount: 450 },
    { originalLabel: 'Transportation Fee', amount: 500 },
    { originalLabel: 'Educational Materials', amount: 400 },
  ];
  const evaluated = rawFees.map(f => evaluateFee(f, schoolA, gradeInfo.gradeLevel, true));
  const total = evaluated.reduce((sum, f) => sum + f.amount, 0);

  return {
    id: 'demo-bill-003-prev-baisakh',
    createdAt: '2026-04-10T08:00:00Z',
    billingMonth: 'Baisakh 2081',
    billingYear: '2081',
    studentName: 'Suman Thapa',
    schoolNameFromBill: 'Bharatpur Demo Academy A',
    matchedSchoolId: schoolA.id,
    matchedSchoolName: schoolA.name,
    gradeRaw: 'Grade 7',
    gradeNumeric: 7,
    gradeLevel: gradeInfo.gradeLevel,
    schoolCategory: schoolA.category,
    isContinuingStudent: true,
    extractedFees: evaluated,
    totalAmount: total, // 3,150
    confidence: 0.95,
    notes: 'Demonstration bill (baseline month): Used for month-over-month comparison.',
    isDemo: true,
  };
})();

// DEMO 3B: Confusing fee labels and month-over-month increase (Jestha)
export const DEMO_BILL_3: Bill = (() => {
  const gradeInfo = determineGradeLevel(7);
  const rawFees = [
    { originalLabel: 'Monthly Tuition Fee', amount: 1800 },
    { originalLabel: 'Special Institutional Development Charge', amount: 1200 },
    { originalLabel: 'Teacher Welfare Overhead Support', amount: 750 },
    { originalLabel: 'Computer Lab Fee', amount: 700 },
    { originalLabel: 'Transportation Fee', amount: 500 },
  ];
  const evaluated = rawFees.map(f => evaluateFee(f, schoolA, gradeInfo.gradeLevel, true));
  const total = evaluated.reduce((sum, f) => sum + f.amount, 0);

  return {
    id: 'demo-bill-003-unrecognized-increase',
    createdAt: '2026-05-12T14:20:00Z',
    billingMonth: 'Jestha 2081',
    billingYear: '2081',
    studentName: 'Suman Thapa',
    schoolNameFromBill: 'Bharatpur Demo Academy A',
    matchedSchoolId: schoolA.id,
    matchedSchoolName: schoolA.name,
    gradeRaw: 'Grade 7',
    gradeNumeric: 7,
    gradeLevel: gradeInfo.gradeLevel,
    schoolCategory: schoolA.category,
    isContinuingStudent: true,
    extractedFees: evaluated,
    totalAmount: total, // 4,950 (+ Rs. 1,800 vs previous month)
    confidence: 0.94,
    notes: 'Demonstration bill: Contains 2 unrecognized fee labels and a sharp 57% increase compared to Baisakh.',
    isDemo: true,
  };
})();

export const DEMO_BILLS: Bill[] = [
  DEMO_BILL_1,
  DEMO_BILL_2,
  DEMO_BILL_3_PREV,
  DEMO_BILL_3,
];
