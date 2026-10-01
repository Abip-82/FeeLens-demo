import React from 'react';
import {
  Eye,
  Languages,
  FileCheck2,
  History,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  Sparkles,
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentTab: 'dashboard' | 'check' | 'history' | 'how-it-works';
  onSelectTab: (tab: 'dashboard' | 'check' | 'history' | 'how-it-works') => void;
  lang: Language;
  onToggleLang: () => void;
  onOpenCheckBill: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  lang,
  onToggleLang,
  onOpenCheckBill,
}) => {
  const t = TRANSLATIONS[lang];
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-2 text-left group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold tracking-wider shadow-sm">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
              {t.appName}
            </span>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-0.5">
              {t.appTagline}
            </span>
          </div>
        </button>

        {/* Navigation (Only shown or enabled if authenticated) */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'dashboard'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-slate-500" />
              <span>{t.navDashboard}</span>
            </button>
            <button
              onClick={() => onSelectTab('check')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'check'
                  ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <span>{t.navCheckBill}</span>
            </button>
            <button
              onClick={() => onSelectTab('history')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'history'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <History className="w-4 h-4 text-slate-500" />
              <span>{t.navHistory}</span>
            </button>
            <button
              onClick={() => onSelectTab('how-it-works')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'how-it-works'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>{t.navHowItWorks}</span>
            </button>
          </nav>
        )}

        {/* Right Action Area */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Toggle Button */}
          <button
            onClick={onToggleLang}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer border shadow-2xs ${
              lang === 'np'
                ? 'bg-emerald-700 text-white border-emerald-800 hover:bg-emerald-800'
                : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
            }`}
            title={lang === 'en' ? 'नेपालीमा हेर्नुहोस् (Translate to Nepali)' : 'Switch to English'}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'नेपाली (Nepali)' : 'English'}</span>
          </button>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[11px]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-slate-800 leading-tight truncate max-w-[110px]">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-500 leading-none">
                    {user.studentName ? user.studentName : t.parentBadge}
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                title={t.logout}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-slate-200"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              {t.guardedAccess}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};
