import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, HelpCircle, FileText } from 'lucide-react';
import { FeeEvaluationStatus } from '../types';
import { Language, TRANSLATIONS } from '../utils/translations';

interface StatusBadgeProps {
  status: FeeEvaluationStatus;
  lang?: Language;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, lang = 'en', size = 'md' }) => {
  const t = TRANSLATIONS[lang];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs gap-1' : 'px-2.5 py-1 text-xs gap-1.5 font-medium';

  switch (status) {
    case 'within_limit':
      return (
        <span className={`inline-flex items-center rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{t.statusWithinLimit}</span>
        </span>
      );
    case 'exceeds_limit':
      return (
        <span className={`inline-flex items-center rounded-md bg-rose-50 text-rose-800 border border-rose-200/80 ${sizeClasses}`}>
          <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>{t.statusExceedsLimit}</span>
        </span>
      );
    case 'potential_discrepancy':
      return (
        <span className={`inline-flex items-center rounded-md bg-amber-50 text-amber-900 border border-amber-200/80 ${sizeClasses}`}>
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>{t.statusPotentialDiscrepancy}</span>
        </span>
      );
    case 'recognized_heading':
      return (
        <span className={`inline-flex items-center rounded-md bg-sky-50 text-sky-800 border border-sky-200/80 ${sizeClasses}`}>
          <Info className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          <span>{t.statusRecognizedHeading}</span>
        </span>
      );
    case 'no_numeric_rule':
      return (
        <span className={`inline-flex items-center rounded-md bg-slate-100 text-slate-700 border border-slate-200/80 ${sizeClasses}`}>
          <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>{t.statusNoNumericRule}</span>
        </span>
      );
    case 'unable_to_verify':
    default:
      return (
        <span className={`inline-flex items-center rounded-md bg-slate-100 text-slate-600 border border-slate-200/80 ${sizeClasses}`}>
          <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>{t.statusUnableToVerify}</span>
        </span>
      );
  }
};
