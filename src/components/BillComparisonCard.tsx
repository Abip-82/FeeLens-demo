import React from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Calendar,
  Sparkles,
  TrendingUp,
  Info,
  Layers,
} from 'lucide-react';
import { BillComparison } from '../types';
import { Language, TRANSLATIONS, formatMonthInLanguage } from '../utils/translations';

interface BillComparisonCardProps {
  comparison: BillComparison;
  currentMonthName?: string;
  lang: Language;
}

export const BillComparisonCard: React.FC<BillComparisonCardProps> = ({
  comparison,
  currentMonthName,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const isIncrease = comparison.difference > 0;
  const isDecrease = comparison.difference < 0;

  const formattedPrevMonth = formatMonthInLanguage(comparison.previousMonth, lang);
  const formattedCurrMonth = currentMonthName ? formatMonthInLanguage(currentMonthName, lang) : '';

  const headlineSummaryLocalized = lang === 'np'
    ? isIncrease
      ? `अघिल्लो महिना (${formattedPrevMonth}) भन्दा रु. ${comparison.difference.toLocaleString('en-IN')} ले बढेको (+${comparison.percentageChange.toFixed(1)}%)`
      : isDecrease
      ? `अघिल्लो महिना (${formattedPrevMonth}) भन्दा रु. ${Math.abs(comparison.difference).toLocaleString('en-IN')} ले घटेको (${comparison.percentageChange.toFixed(1)}%)`
      : `अघिल्लो महिना (${formattedPrevMonth}) सँग कुल रकम बराबर रहेको छ`
    : comparison.headlineSummary;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t.monthToMonthComparison}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {comparison.difference !== 0 ? t.changeDetected : t.noChange}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            {t.comparingWith} {formattedPrevMonth}
          </h3>
          <p className="text-xs text-slate-500">
            {t.lineByLineComparisonSub} ({formattedPrevMonth})
          </p>
        </div>

        {/* Change Highlight */}
        <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-none border-slate-200">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {t.totalShift}
          </span>
          <div
            className={`text-xl sm:text-2xl font-extrabold font-mono tabular-nums flex items-center sm:justify-end gap-1 ${
              isIncrease ? 'text-amber-700' : isDecrease ? 'text-emerald-700' : 'text-slate-800'
            }`}
          >
            {isIncrease && <ArrowUpRight className="w-5 h-5 text-amber-600 shrink-0" />}
            {isDecrease && <ArrowDownRight className="w-5 h-5 text-emerald-600 shrink-0" />}
            {!isIncrease && !isDecrease && <Minus className="w-4 h-4 text-slate-400 shrink-0" />}
            {isIncrease ? '+' : ''}Rs. {comparison.difference.toLocaleString('en-IN')}
            <span className="text-xs font-bold ml-1">
              ({isIncrease ? '+' : ''}{comparison.percentageChange.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Summary: Previous | Current | Net Change */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
            {t.previousMonth} ({formattedPrevMonth})
          </span>
          <span className="text-2xl font-extrabold font-mono text-slate-800 tabular-nums">
            Rs. {comparison.previousTotal.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
            {t.currentMonth} {formattedCurrMonth ? `(${formattedCurrMonth})` : ''}
          </span>
          <span className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
            Rs. {comparison.currentTotal.toLocaleString('en-IN')}
          </span>
        </div>
        <div
          className={`p-4 rounded-2xl border ${
            isIncrease
              ? 'bg-amber-50/60 border-amber-200 text-amber-900'
              : isDecrease
              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
              : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-wider block mb-1">
            {t.netChange}
          </span>
          <div className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums">
            {isIncrease ? `+Rs. ${comparison.difference.toLocaleString('en-IN')}` : isDecrease ? `-Rs. ${Math.abs(comparison.difference).toLocaleString('en-IN')}` : 'Rs. 0'}
          </div>
          <span className="text-xs font-semibold block mt-0.5">
            {headlineSummaryLocalized || `${t.netChange}: ${comparison.percentageChange.toFixed(1)}%`}
          </span>
        </div>
      </div>

      {/* Largest Contributors to the Increase */}
      {comparison.largestIncreases && comparison.largestIncreases.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
            <TrendingUp className="w-4 h-4 text-amber-700" />
            <span>{t.largestChanges}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {comparison.largestIncreases.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-white rounded-xl border border-amber-200/80 flex items-center justify-between text-xs shadow-2xs"
              >
                <span className="font-semibold text-slate-800 truncate pr-2">
                  {item.feeTitle}
                </span>
                <span className="font-mono font-bold text-amber-800 shrink-0">
                  +Rs. {item.difference.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 pt-1">
            {t.neutralIncreaseNotice}
          </p>
        </div>
      )}

      {/* Line-by-Line Category Changes */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          {t.categoryByShift}
        </h4>
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
          {comparison.feeChanges.map((change, idx) => {
            const isChangeIncrease = change.difference > 0;
            const isChangeDecrease = change.difference < 0;

            const changeTextLocalized = lang === 'np'
              ? isChangeIncrease
                ? `रु. ${change.difference.toLocaleString('en-IN')} ले वृद्धि`
                : isChangeDecrease
                ? `रु. ${Math.abs(change.difference).toLocaleString('en-IN')} ले घटेको`
                : 'स्थिर'
              : change.changeText;

            return (
              <div
                key={idx}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50/60 transition-colors"
              >
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 text-sm block">
                    {change.feeTitle}
                  </span>
                  <p className="text-slate-600 font-medium">
                    {changeTextLocalized}
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0 font-mono">
                  <div className="text-xs text-slate-500">
                    Rs. {change.previousAmount.toLocaleString('en-IN')} → Rs. {change.currentAmount.toLocaleString('en-IN')}
                  </div>
                  <div
                    className={`text-sm font-bold mt-0.5 ${
                      isChangeIncrease
                        ? 'text-amber-700'
                        : isChangeDecrease
                        ? 'text-emerald-700'
                        : 'text-slate-500'
                    }`}
                  >
                    {isChangeIncrease
                      ? `+Rs. ${change.difference.toLocaleString('en-IN')}`
                      : isChangeDecrease
                      ? `-Rs. ${Math.abs(change.difference).toLocaleString('en-IN')}`
                      : t.unchanged}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
