/**
 * FeeLens Fee Normalization Utilities
 * Maps common invoice labels to recognized fee categories while strictly preserving
 * the original label. If uncertain, marks as "Needs review". Never invents categories.
 */

export interface NormalizedFeeItem {
  originalLabel: string;
  amount: number;
  normalizedFeeType: string;
  confidence: number;
}

export function normalizeFeeLabel(original: string): {
  normalizedFeeType: string;
  confidence: number;
} {
  const clean = original.trim().toLowerCase();

  // 1. Tuition
  if (
    clean.includes('monthly tuition') ||
    clean.includes('tuition fee') ||
    clean.includes('tuition') ||
    clean.includes('monthly fee') ||
    clean.includes('padhai shulka') ||
    clean.includes('masik shulka') ||
    clean === 'monthly'
  ) {
    return {
      normalizedFeeType: 'Monthly Tuition Fee',
      confidence: 0.95,
    };
  }

  // 2. ECA / Extracurricular / Sports
  if (
    clean.includes('eca') ||
    clean.includes('extra curricular') ||
    clean.includes('extracurricular') ||
    clean.includes('sports fee') ||
    clean.includes('games fee')
  ) {
    return {
      normalizedFeeType: 'Annual Fee / extracurricular-related charge',
      confidence: 0.9,
    };
  }

  // 3. Annual Fee
  if (
    clean.includes('annual fee') ||
    clean.includes('yearly fee') ||
    clean.includes('session fee') ||
    clean.includes('varshik shulka') ||
    clean === 'annual'
  ) {
    return {
      normalizedFeeType: 'Annual Fee',
      confidence: 0.95,
    };
  }

  // 4. Examination
  if (
    clean.includes('exam') ||
    clean.includes('examination') ||
    clean.includes('terminal test') ||
    clean.includes('pariksha')
  ) {
    return {
      normalizedFeeType: 'Examination Fee',
      confidence: 0.95,
    };
  }

  // 5. Computer / IT
  if (
    clean.includes('computer') ||
    clean.includes('it fee') ||
    clean.includes('computer lab') ||
    clean.includes('cyber')
  ) {
    return {
      normalizedFeeType: 'Computer Fee',
      confidence: 0.95,
    };
  }

  // 6. Bus / Transportation
  if (
    clean.includes('bus') ||
    clean.includes('transport') ||
    clean.includes('transportation') ||
    clean.includes('van fee') ||
    clean.includes('vehicle')
  ) {
    return {
      normalizedFeeType: 'Transportation Fee',
      confidence: 0.95,
    };
  }

  // 7. Admission / Enrollment
  if (
    clean.includes('admission') ||
    clean.includes('enrollment') ||
    clean.includes('registration fee') ||
    clean.includes('bharna')
  ) {
    return {
      normalizedFeeType: 'Admission Fee',
      confidence: 0.9,
    };
  }

  // 8. Security Deposit
  if (
    clean.includes('security deposit') ||
    clean.includes('caution money') ||
    clean.includes('refundable deposit') ||
    clean.includes('dharauti')
  ) {
    return {
      normalizedFeeType: 'Security Deposit',
      confidence: 0.9,
    };
  }

  // 9. Educational Materials / Books
  if (
    clean.includes('materials') ||
    clean.includes('book') ||
    clean.includes('stationery') ||
    clean.includes('notebook') ||
    clean.includes('diary')
  ) {
    return {
      normalizedFeeType: 'Educational Materials Fee',
      confidence: 0.9,
    };
  }

  // 10. Meals / Canteen / Khaja
  if (
    clean.includes('meal') ||
    clean.includes('tiffin') ||
    clean.includes('khaja') ||
    clean.includes('canteen') ||
    clean.includes('lunch')
  ) {
    return {
      normalizedFeeType: 'Meal Fee',
      confidence: 0.9,
    };
  }

  // 11. Hostel / Boarding
  if (
    clean.includes('hostel') ||
    clean.includes('boarding') ||
    clean.includes('lodging')
  ) {
    return {
      normalizedFeeType: 'Hostel Accommodation Fee',
      confidence: 0.9,
    };
  }

  // 12. Special Training (Music, Martial Arts, Dance)
  if (
    clean.includes('music') ||
    clean.includes('karate') ||
    clean.includes('dance') ||
    clean.includes('taekwondo') ||
    clean.includes('martial arts') ||
    clean.includes('special training')
  ) {
    return {
      normalizedFeeType: 'Special Training Fee',
      confidence: 0.85,
    };
  }

  // 13. Educational Tour
  if (
    clean.includes('tour') ||
    clean.includes('excursion') ||
    clean.includes('field trip') ||
    clean.includes('picnic')
  ) {
    return {
      normalizedFeeType: 'Educational Tour Fee',
      confidence: 0.85,
    };
  }

  // 14. Inter-School Competitions
  if (
    clean.includes('competition') ||
    clean.includes('contest') ||
    clean.includes('inter-school')
  ) {
    return {
      normalizedFeeType: 'Inter-School Competitions Fee',
      confidence: 0.85,
    };
  }

  // 15. Transfer Certificate
  if (
    clean.includes('transfer certificate') ||
    clean.includes('tc fee') ||
    clean.includes('character certificate')
  ) {
    return {
      normalizedFeeType: 'Transfer Certificate Fee',
      confidence: 0.9,
    };
  }

  // Default: Uncertain / Unrecognized -> Mark "Needs review"
  return {
    normalizedFeeType: 'Needs review',
    confidence: 0.4,
  };
}
