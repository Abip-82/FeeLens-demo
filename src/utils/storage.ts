/**
 * Local Storage Persistence for FeeLens Bills & User Profile
 */
import { Bill, SchoolCategory, User } from '../types';
import { getBillChronologicalScore } from '../services/rulesEngine';

const STORAGE_KEY = 'feelens_saved_bills_v2';
const USERS_STORAGE_KEY = 'feelens_users_v1';
const CURRENT_USER_KEY = 'feelens_active_user_v1';

export function getSavedBills(userId?: string): Bill[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const allBills: Bill[] = JSON.parse(raw);
    const filtered = userId ? allBills.filter(b => !b.userId || b.userId === userId) : allBills;
    
    // Always sort newest / highest chronological billing month first
    filtered.sort((a, b) => {
      const scoreDiff = getBillChronologicalScore(b) - getBillChronologicalScore(a);
      if (scoreDiff !== 0) return scoreDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return filtered;
  } catch (err) {
    console.error('Failed to load bills from localStorage:', err);
    return [];
  }
}

export function saveBill(bill: Bill): void {
  try {
    const current = getSavedBills();
    const index = current.findIndex(b => b.id === bill.id);
    let updated: Bill[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = bill;
    } else {
      updated = [bill, ...current];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save bill to localStorage:', err);
  }
}

export function deleteBill(billId: string): void {
  try {
    const current = getSavedBills();
    const updated = current.filter(b => b.id !== billId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete bill from localStorage:', err);
  }
}

export interface SchoolBillGroup {
  schoolName: string;
  matchedSchoolId?: string | null;
  category?: SchoolCategory;
  municipality?: string;
  bills: Bill[];
}

export function getBillsGroupedBySchool(bills: Bill[]): SchoolBillGroup[] {
  const map = new Map<string, SchoolBillGroup>();
  for (const bill of bills) {
    const schoolKey = bill.matchedSchoolName || bill.schoolNameFromBill || 'Unknown School';
    if (!map.has(schoolKey)) {
      map.set(schoolKey, {
        schoolName: schoolKey,
        matchedSchoolId: bill.matchedSchoolId,
        category: bill.schoolCategory,
        municipality: bill.municipality || 'Bharatpur Metropolitan City',
        bills: [],
      });
    }
    map.get(schoolKey)!.bills.push(bill);
  }

  // Sort bills inside each school with newest analyzed first
  for (const group of map.values()) {
    group.bills.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return Array.from(map.values());
}

// User Authentication Persistence
export function getStoredUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

export function saveStoredUser(user: User): void {
  try {
    const users = getStoredUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save user:', err);
  }
}

export function getActiveUser(): User | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

export function setActiveUser(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (err) {
    console.error('Failed to set active user:', err);
  }
}
