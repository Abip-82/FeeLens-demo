/**
 * Authentication Context for FeeLens
 * Basic login, registration, demo accounts, and persistent session state.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { getActiveUser, setActiveUser, getStoredUsers, saveStoredUser } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => { success: boolean; error?: string };
  register: (data: {
    name: string;
    email: string;
    password?: string;
    studentName?: string;
    schoolName?: string;
    grade?: string;
  }) => { success: boolean; error?: string };
  logout: () => void;
  loginAsDemoUser: (type: 'demo1' | 'demo2' | 'demo3') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = getActiveUser();
    if (saved) {
      setUser(saved);
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, _pass: string) => {
    if (!email || !email.trim()) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    const cleanEmail = email.trim().toLowerCase();
    const allUsers = getStoredUsers();
    let found = allUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      // Create account automatically if user is logging in with a new email
      const newAcc: User = {
        id: `user-${Date.now()}`,
        name: cleanEmail.split('@')[0].replace(/[._]/g, ' '),
        email: cleanEmail,
        createdAt: new Date().toISOString(),
      };
      saveStoredUser(newAcc);
      found = newAcc;
    }

    setUser(found);
    setActiveUser(found);
    return { success: true };
  };

  const register = (data: {
    name: string;
    email: string;
    password?: string;
    studentName?: string;
    schoolName?: string;
    grade?: string;
  }) => {
    if (!data.name.trim() || !data.email.trim()) {
      return { success: false, error: 'Full name and email are required.' };
    }
    const cleanEmail = data.email.trim().toLowerCase();
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      studentName: data.studentName?.trim() || undefined,
      schoolName: data.schoolName?.trim() || undefined,
      grade: data.grade?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    saveStoredUser(newUser);
    setUser(newUser);
    setActiveUser(newUser);
    return { success: true };
  };

  const loginAsDemoUser = (type: 'demo1' | 'demo2' | 'demo3') => {
    let demoUser: User;
    if (type === 'demo1') {
      demoUser = {
        id: 'demo-parent-aarav',
        name: 'Aarav\'s Guardian',
        email: 'parent.aarav@example.com',
        studentName: 'Aarav Shrestha',
        schoolName: 'Bharatpur Demo Academy C',
        grade: 'Grade 4',
        createdAt: new Date().toISOString(),
      };
    } else if (type === 'demo2') {
      demoUser = {
        id: 'demo-parent-prashant',
        name: 'Prashant\'s Parent',
        email: 'parent.prashant@example.com',
        studentName: 'Prashant Adhikari',
        schoolName: 'Bharatpur Demo Academy B',
        grade: 'Class 9',
        createdAt: new Date().toISOString(),
      };
    } else {
      demoUser = {
        id: 'demo-parent-suman',
        name: 'Suman\'s Guardian',
        email: 'parent.suman@example.com',
        studentName: 'Suman Thapa',
        schoolName: 'Bharatpur Demo Academy A',
        grade: 'Grade 7',
        createdAt: new Date().toISOString(),
      };
    }

    saveStoredUser(demoUser);
    setUser(demoUser);
    setActiveUser(demoUser);
  };

  const logout = () => {
    setUser(null);
    setActiveUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        loginAsDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
