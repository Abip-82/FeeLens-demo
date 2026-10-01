/**
 * Demo School Registry for Bharatpur Metropolitan City, Chitwan
 * Prototype data for testing and demonstration.
 */
import { School } from '../types';

export const DEMO_SCHOOLS: School[] = [
  {
    id: 'bmc-demo-001',
    name: 'Bharatpur Demo Academy A',
    municipality: 'Bharatpur Metropolitan City',
    isPrivateOrInstitutional: true,
    category: 'Ka',
    sourceLabel: 'Prototype Demo Dataset v1 (BMC Chitwan)',
    sourcePage: 'Annex 1 - Institutional Category Ka Sample',
    isDemo: true,
    address: 'Ward No. 10, Lions Chowk, Bharatpur',
  },
  {
    id: 'bmc-demo-002',
    name: 'Bharatpur Demo Academy B',
    municipality: 'Bharatpur Metropolitan City',
    isPrivateOrInstitutional: true,
    category: 'Kha',
    sourceLabel: 'Prototype Demo Dataset v1 (BMC Chitwan)',
    sourcePage: 'Annex 1 - Institutional Category Kha Sample',
    isDemo: true,
    address: 'Ward No. 1, Ramnagar, Bharatpur',
  },
  {
    id: 'bmc-demo-003',
    name: 'Bharatpur Demo Academy C',
    municipality: 'Bharatpur Metropolitan City',
    isPrivateOrInstitutional: true,
    category: 'Ga',
    sourceLabel: 'Prototype Demo Dataset v1 (BMC Chitwan)',
    sourcePage: 'Annex 1 - Institutional Category Ga Baseline Sample',
    isDemo: true,
    address: 'Ward No. 11, Bhojad, Bharatpur',
  },
  {
    id: 'bmc-demo-004',
    name: 'Bharatpur Demo Academy D',
    municipality: 'Bharatpur Metropolitan City',
    isPrivateOrInstitutional: true,
    category: 'Gha',
    sourceLabel: 'Prototype Demo Dataset v1 (BMC Chitwan)',
    sourcePage: 'Annex 1 - Institutional Category Gha Sample',
    isDemo: true,
    address: 'Ward No. 15, Fulbari, Bharatpur',
  },
  {
    id: 'bmc-demo-005',
    name: 'Bharatpur Demo Community School',
    municipality: 'Bharatpur Metropolitan City',
    isPrivateOrInstitutional: false,
    category: null,
    sourceLabel: 'Prototype Demo Dataset v1 (BMC Chitwan)',
    sourcePage: 'Annex 2 - Public / Community School Sample',
    isDemo: true,
    address: 'Ward No. 2, Kshetrapur, Bharatpur',
  },
];

export function matchSchoolByName(query: string): School | null {
  if (!query || query.trim().length === 0) return null;
  const clean = query.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();

  // 1. Direct match
  for (const school of DEMO_SCHOOLS) {
    const sName = school.name.toLowerCase().replace(/[^a-z0-9]/g, ' ');
    if (sName.includes(clean) || clean.includes(sName)) {
      return school;
    }
  }

  // 2. Token overlap match
  const queryTokens = clean.split(/\s+/).filter(t => t.length > 2);
  let bestMatch: School | null = null;
  let maxScore = 0;

  for (const school of DEMO_SCHOOLS) {
    const sTokens = school.name.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    let score = 0;
    for (const qt of queryTokens) {
      if (sTokens.some(st => st.includes(qt) || qt.includes(st))) {
        score++;
      }
    }
    if (score > maxScore && score >= 2) {
      maxScore = score;
      bestMatch = school;
    }
  }

  return bestMatch;
}
