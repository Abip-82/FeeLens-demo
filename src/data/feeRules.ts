/**
 * Fee Rules and Category Multipliers for Bharatpur Metropolitan City Prototype
 */
import { GradeLevel, SchoolCategory, FeeCategoryType, FeeHeadingDefinition } from '../types';

export interface BaselineMonthlyCeiling {
  gradeLevel: GradeLevel;
  minGrade: number;
  maxGrade: number;
  baselineGaAmount: number; // Ga (Tier C) baseline in Rs.
  sourceLabel: string;
}

export const BASELINE_GA_CEILINGS: BaselineMonthlyCeiling[] = [
  {
    gradeLevel: 'Primary',
    minGrade: 1,
    maxGrade: 5,
    baselineGaAmount: 1100,
    sourceLabel: 'BMC Prototype Fee Standard - Primary (Grades 1-5)',
  },
  {
    gradeLevel: 'Lower Secondary',
    minGrade: 6,
    maxGrade: 8,
    baselineGaAmount: 1250,
    sourceLabel: 'BMC Prototype Fee Standard - Lower Secondary (Grades 6-8)',
  },
  {
    gradeLevel: 'Secondary',
    minGrade: 9,
    maxGrade: 10,
    baselineGaAmount: 1700,
    sourceLabel: 'BMC Prototype Fee Standard - Secondary (Grades 9-10)',
  },
];

export const CATEGORY_MULTIPLIERS: Record<NonNullable<SchoolCategory>, { multiplier: number; label: string; formula: string }> = {
  Ka: {
    multiplier: 1.50,
    label: 'Category Ka (+50% over Ga ceiling)',
    formula: 'Ga Baseline × 1.50',
  },
  Kha: {
    multiplier: 1.25,
    label: 'Category Kha (+25% over Ga ceiling)',
    formula: 'Ga Baseline × 1.25',
  },
  Ga: {
    multiplier: 1.00,
    label: 'Category Ga (Baseline reference)',
    formula: 'Ga Baseline × 1.00',
  },
  Gha: {
    multiplier: 0.75,
    label: 'Category Gha (-25% under Ga ceiling)',
    formula: 'Ga Baseline × 0.75',
  },
};

export const RECOGNIZED_FEE_HEADINGS: FeeHeadingDefinition[] = [
  {
    type: 'monthly_tuition',
    nameEn: 'Monthly Tuition Fee',
    nameNp: 'मासिक पढाइ शुल्क',
    generalMeaningEn: 'Covers core classroom teaching, learning activities, academic materials, and teacher/staff salaries. Billed for a maximum of 12 months per academic year.',
    generalMeaningNp: 'नियमित कक्षा अध्यापन, शिक्षक पारिश्रमिक तथा शैक्षिक क्रियाकलापको शुल्क।',
    ruleSummaryEn: 'Subject to category and grade-level monthly ceiling configured in prototype.',
    hasNumericCeiling: true,
    synonyms: [
      'monthly tuition', 'tuition fee', 'monthly fee', 'tuition', 'monthly charge',
      'padhai shulka', 'masik shulka', 'class fee', 'instruction fee'
    ],
  },
  {
    type: 'annual_fee',
    nameEn: 'Annual Fee',
    nameNp: 'वार्षिक शुल्क',
    generalMeaningEn: 'Covers whole-year sports, extracurricular items, health checkups, and general school building maintenance. Charged once per academic year.',
    generalMeaningNp: 'वर्षभरिका खेलकुद, अतिरिक्त क्रियाकलाप र विद्यालय व्यवस्थापन शुल्क। वर्षमा १ पटक मात्र।',
    ruleSummaryEn: 'Capped at maximum of two (2) months applicable tuition fee ceiling. Charged annually, not monthly.',
    hasNumericCeiling: true,
    synonyms: [
      'annual fee', 'yearly fee', 'annual charges', 'session fee', 'varshik shulka', 'annual maintenance', 'eca fee', 'sports fee'
    ],
  },
  {
    type: 'admission_fee',
    nameEn: 'Admission Fee',
    nameNp: 'भर्ना शुल्क',
    generalMeaningEn: 'One-time initial enrollment fee when a new student enters the institution for the first time. Re-admission fees for continuing students are not permitted in prototype rules.',
    generalMeaningNp: 'नयाँ विद्यार्थीको पहिलो पटकको भर्ना शुल्क। निरन्तर विद्यार्थीसँग पुनः भर्ना शुल्क लिन पाइँदैन।',
    ruleSummaryEn: 'One-time upon new admission only. Continuing student re-admission fee is flagged as discrepancy.',
    hasNumericCeiling: false,
    synonyms: [
      'admission fee', 'enrollment fee', 'registration fee', 're-admission', 'readmission fee', 'bharna shulka'
    ],
  },
  {
    type: 'security_deposit',
    nameEn: 'Security Deposit',
    nameNp: 'धरौटी रकम',
    generalMeaningEn: 'Refundable security amount collected during initial school enrollment, returned upon graduation or school leaving.',
    generalMeaningNp: 'विद्यार्थी भर्ना हुँदा राखिने फिर्ता हुने धरौटी।',
    ruleSummaryEn: 'Refundable upon departure. No numeric threshold configured in this prototype.',
    hasNumericCeiling: false,
    synonyms: [
      'security deposit', 'caution money', 'refundable deposit', 'dharauti'
    ],
  },
  {
    type: 'examination_fee',
    nameEn: 'Examination Fee',
    nameNp: 'परीक्षा शुल्क',
    generalMeaningEn: 'Covers terminal tests, annual exams, answer sheet printing, and official report cards.',
    generalMeaningNp: 'त्रैमासिक/वार्षिक परीक्षा, प्रश्नपत्र छपाइ र नतिजा तयारी शुल्क।',
    ruleSummaryEn: 'Recognized fee heading. No numeric threshold configured in this prototype.',
    hasNumericCeiling: false,
    synonyms: [
      'examination fee', 'exam fee', 'test fee', 'terminal exam fee', 'pariksha shulka'
    ],
  },
  {
    type: 'computer_fee',
    nameEn: 'Computer Fee',
    nameNp: 'कम्प्युटर शुल्क',
    generalMeaningEn: 'Covers practical computer classes, software licenses, internet connectivity, and hardware lab maintenance.',
    generalMeaningNp: 'कम्प्युटर ल्याब, इन्टरनेट तथा प्रयोगात्मक अभ्यास शुल्क।',
    ruleSummaryEn: 'Recognized fee heading. No numeric threshold configured in this prototype.',
    hasNumericCeiling: false,
    synonyms: [
      'computer fee', 'computer lab', 'it fee', 'computer practical', 'lab charge'
    ],
  },
  {
    type: 'transfer_certificate_fee',
    nameEn: 'Transfer Certificate Fee',
    nameNp: 'स्थानान्तरण प्रमाणपत्र शुल्क',
    generalMeaningEn: 'One-time administrative processing fee for issuing student character or transfer certificate upon departure.',
    generalMeaningNp: 'स्थानान्तरण तथा चारित्रिक प्रमाणपत्र जारी दस्तुर।',
    ruleSummaryEn: 'Recognized fee heading. No numeric threshold configured in this prototype.',
    hasNumericCeiling: false,
    synonyms: [
      'transfer certificate', 'tc fee', 'character certificate', 'migration fee'
    ],
  },
  {
    type: 'special_training_fee',
    nameEn: 'Special Training Fee',
    nameNp: 'विशेष प्रशिक्षण शुल्क',
    generalMeaningEn: 'Optional specialized training programs such as martial arts (Taekwondo/Karate), music, dance, art, or specialized sports.',
    generalMeaningNp: 'ऐच्छिक मार्सल आर्ट, संगीत, नृत्य वा विशेष खेलकुद प्रशिक्षण शुल्क।',
    ruleSummaryEn: 'Must be for optional extracurricular training. No numeric threshold configured in this prototype.',
    hasNumericCeiling: false,
    synonyms: [
      'special training', 'music fee', 'dance fee', 'karate fee', 'taekwondo fee', 'art fee', 'training fee'
    ],
  },
  {
    type: 'hostel_accommodation_fee',
    nameEn: 'Hostel Accommodation Fee',
    nameNp: 'छात्रावास शुल्क',
    generalMeaningEn: 'Room and lodging charges strictly for residential boarding students.',
    generalMeaningNp: 'छात्रावासमा बस्ने आवासीय विद्यार्थीका लागि मात्र लागु हुने शुल्क।',
    ruleSummaryEn: 'Applicable strictly to residential/boarding students. No numeric threshold configured.',
    hasNumericCeiling: false,
    synonyms: [
      'hostel fee', 'hostel accommodation', 'boarding fee', 'room charge', 'dormitory'
    ],
  },
  {
    type: 'meal_fee',
    nameEn: 'Meal Fee',
    nameNp: 'खाजा / खाना शुल्क',
    generalMeaningEn: 'Optional canteen, daytime snacks (tiffin), or hostel dining service provided by the institution.',
    generalMeaningNp: 'ऐच्छिक दिवा खाजा तथा क्यान्टिन भोजन शुल्क।',
    ruleSummaryEn: 'Optional food/mess service. No numeric threshold configured in this prototype.',
    hasNumericCeiling: false,
    synonyms: [
      'meal fee', 'tiffin fee', 'snack fee', 'lunch fee', 'canteen fee', 'khaja shulka'
    ],
  },
  {
    type: 'transportation_fee',
    nameEn: 'Transportation Fee',
    nameNp: 'यातायात शुल्क',
    generalMeaningEn: 'Designated school bus or van transit service for students opting for institutional transportation.',
    generalMeaningNp: 'विद्यालयको बस वा भ्यान सेवा प्रयोग गर्ने विद्यार्थीका लागि यातायात शुल्क।',
    ruleSummaryEn: 'School bus transit service only. No numeric threshold configured in this prototype.',
    hasNumericCeiling: false,
    synonyms: [
      'transportation fee', 'bus fee', 'van fee', 'transport charge', 'bus fare'
    ],
  },
  {
    type: 'educational_tour_fee',
    nameEn: 'Educational Tour Fee',
    nameNp: 'शैक्षिक भ्रमण शुल्क',
    generalMeaningEn: 'Costs for specific educational field excursions, botanical/museum visits, or study tours outside the campus.',
    generalMeaningNp: 'शैक्षिक भ्रमण, अवलोकन तथा अध्ययन भ्रमणको वास्तविक लागत।',
    ruleSummaryEn: 'Site visits and exposure programs. No numeric threshold configured in this prototype.',
    hasNumericCeiling: false,
    synonyms: [
      'tour fee', 'educational tour', 'field trip', 'picnic fee', 'excursion'
    ],
  },
  {
    type: 'inter_school_competitions_fee',
    nameEn: 'Inter-School Competitions Fee',
    nameNp: 'अन्तर-विद्यालय प्रतियोगिता शुल्क',
    generalMeaningEn: 'Participation and registration costs for students competing in external municipal, district, or regional sports and academic events.',
    generalMeaningNp: 'नगरस्तरीय वा जिल्लास्तरीय बाह्य प्रतियोगिता सहभागिता शुल्क।',
    ruleSummaryEn: 'External competitions. No numeric threshold configured in this prototype.',
    hasNumericCeiling: false,
    synonyms: [
      'competition fee', 'inter-school', 'sports competition', 'quiz fee', 'contest fee'
    ],
  },
  {
    type: 'educational_materials_fee',
    nameEn: 'Educational Materials Fee',
    nameNp: 'शैक्षिक सामग्री शुल्क',
    generalMeaningEn: 'Actual cost of textbooks, homework diaries, school notebooks, or logbooks directly distributed by the school.',
    generalMeaningNp: 'पाठ्यपुस्तक, डायरी, उत्तरपुस्तिका आदि शैक्षिक सामग्रीको लागत।',
    ruleSummaryEn: 'Distributed learning materials. No numeric threshold configured in this prototype.',
    hasNumericCeiling: false,
    synonyms: [
      'materials fee', 'book fee', 'notebooks', 'stationery', 'diary fee', 'educational materials'
    ],
  },
];
