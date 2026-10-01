/**
 * Auth Gate & Login / Register Component
 * Guards the user dashboard with a clean, trustworthy authentication interface.
 * Localized for English & Nepali.
 */
import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User as UserIcon,
  GraduationCap,
  Building,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_SCHOOLS } from '../data/schools';
import { Language, TRANSLATIONS } from '../utils/translations';

interface AuthModalProps {
  lang?: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({ lang = 'en' }) => {
  const { login, register, loginAsDemoUser } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const t = TRANSLATIONS[lang];

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [schoolName, setSchoolName] = useState('Bharatpur Demo Academy C');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'login') {
      const res = login(email, password);
      if (!res.success) {
        setError(res.error || t.loginFailed);
      }
    } else {
      const res = register({
        name,
        email,
        password,
        studentName,
        schoolName,
      });
      if (!res.success) {
        setError(res.error || t.registerFailed);
      }
    }
  };

  return (
    <div className="max-w-md w-full mx-auto my-8 p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {mode === 'login' ? t.signInTitle : t.registerTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {mode === 'login' ? t.signInDesc : t.registerDesc}
          </p>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setError(null);
          }}
          className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
            mode === 'login'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.tabSignIn}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register');
            setError(null);
          }}
          className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
            mode === 'register'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.tabRegister}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              {t.lblParentName}
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Binod Shrestha"
                required
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            {t.lblEmail}
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            {t.lblPassword}
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required={mode === 'register'}
              className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {mode === 'register' && (
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {t.lblStudentSchoolDetails}
            </span>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t.lblStudentName}
              </label>
              <input
                type="text"
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                placeholder="e.g. Aarav Shrestha"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t.lblSchoolOptional}
              </label>
              <select
                value={schoolName}
                onChange={e => setSchoolName(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {DEMO_SCHOOLS.map(s => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 mt-2"
        >
          <span>{mode === 'login' ? t.btnEnterDashboard : t.btnRegisterAccount}</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </form>

      {/* Quick 1-Click Demo Login Section */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.demoParentSignIn}</span>
          </span>
          <span className="text-[10px] text-slate-400">{t.oneClickTest}</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <button
            type="button"
            onClick={() => loginAsDemoUser('demo3')}
            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-colors cursor-pointer flex items-center justify-between group text-xs"
          >
            <div>
              <div className="font-bold text-slate-900 group-hover:text-emerald-800">
                {t.demoUser3Title}
              </div>
              <div className="text-[11px] text-slate-500">
                {t.demoUser3Sub}
              </div>
            </div>
            <span className="text-emerald-700 font-semibold group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </button>

          <button
            type="button"
            onClick={() => loginAsDemoUser('demo1')}
            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-colors cursor-pointer flex items-center justify-between group text-xs"
          >
            <div>
              <div className="font-bold text-slate-900 group-hover:text-emerald-800">
                {t.demoUser1Title}
              </div>
              <div className="text-[11px] text-slate-500">
                {t.demoUser1Sub}
              </div>
            </div>
            <span className="text-emerald-700 font-semibold group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
