/**
 * Monthly Bill Analysis Component for Dashboard
 * Compares current bill with past month bills.
 * If there are no past month bills, displays a clear "None / No past month bills recorded" message.
 * Fully localized for English and Nepali.
 */
import React from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';
import { Bill, BillComparison } from '../types';
import { Language, TRANSLATIONS, formatMonthInLanguage, formatGradeInLanguage } from '../utils/translations';

interface MonthlyBillAnalysisProps {
  latestBill: Bill | null;
  previousBill: Bill | null;
  comparison: BillComparison | null;
  totalBillsCount: number;
  onUploadBill: () => void;
  onViewAudit: (bill: Bill) => void;
  onLoadDemoComparison?: () => void;
  lang: Language;
}

export const MonthlyBillAnalysis: React.FC<MonthlyBillAnalysisProps> = ({
  latestBill,
  previousBill,
  comparison,
  totalBillsCount,
  onUploadBill,
  onViewAudit,
  onLoadDemoComparison,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  // CASE 1: No bills at all
  if (!latestBill || totalBillsCount === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <TrendingUp className="w-5 h-5 text-emerald-700" />
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            {t.monthlyBillAnalysis}
          </h2>
        </div>
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              {t.noBillsUploadedYet}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              {t.noBillsDesc}
            </p>
          </div>
          {onLoadDemoComparison && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onLoadDemoComparison}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t.btnLoadDemoBills}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // CASE 2: Current bill exists, but NO past month bill to compare (Single bill)
  if (!previousBill || !comparison) {
    const formattedLatestMonth = formatMonthInLanguage(latestBill.billingMonth, lang);
    const formattedGrade = formatGradeInLanguage(latestBill.gradeRaw, latestBill.gradeLevel, lang);

    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-700" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {t.monthlyBillAnalysis}
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              {latestBill.matchedSchoolName || latestBill.schoolNameFromBill} • {formattedLatestMonth} ({formattedGrade})
            </p>
          </div>
          <button
            type="button"
            onClick={() => onViewAudit(latestBill)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>{t.btnViewBillAudit}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Current Month Active Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              {t.currentBill} ({formattedLatestMonth})
            </span>
            <div className="text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
              Rs. {latestBill.totalAmount.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-slate-500 block pt-0.5">
              {latestBill.extractedFees.length} {t.itemizedFeeLines}
            </span>
          </div>

          {/* Explicit "None" message for Past Month Comparison */}
          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-900">
                <Info className="w-4 h-4 text-amber-600" />
                <span>{t.pastMonthBillsNone}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {t.pastMonthNoneDesc}
              </p>
            </div>
            {onLoadDemoComparison && (
              <button
                type="button"
                onClick={onLoadDemoComparison}
                className="self-start inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-100/60 transition-colors cursor-pointer mt-2 shadow-2xs"
              >
                <Sparkles className="w-3 h-3 text-amber-700" />
                <span>{t.btnLoad2MonthDemo}</span>
              </button>
            )}
          </div>
        </div>

        {/* Current Month Status Summary */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            {latestBill.extractedFees.some(f => f.isFlagged) ? (
              <div className="flex items-center gap-2 text-rose-700 font-semibold">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  {latestBill.extractedFees.filter(f => f.isFlagged).length} {t.discrepancyFlaggedInBill}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.allChargesCurrentWithinLimits}</span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onUploadBill}
            className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
          >
            {t.btnUploadAnotherMonth}
          </button>
        </div>
      </div>
    );
  }

  // CASE 3: Both Current Month and Past Month Bill exist -> Full Month-over-Month Analysis!
  const isComparisonOrdered = comparison.currentTotal === latestBill.totalAmount;
  const current = isComparisonOrdered ? latestBill : previousBill;
  const past = isComparisonOrdered ? previousBill : latestBill;

  const isIncrease = comparison.difference > 0;
  const isDecrease = comparison.difference < 0;

  const formattedCurrentMonth = formatMonthInLanguage(current.billingMonth, lang);
  const formattedPastMonth = formatMonthInLanguage(past.billingMonth, lang);

  const headlineSummaryLocalized = lang === 'np'
    ? isIncrease
      ? `अघिल्लो महिना (${formattedPastMonth}) भन्दा रु. ${comparison.difference.toLocaleString('en-IN')} ले बढेको (+${comparison.percentageChange.toFixed(1)}%)`
      : isDecrease
      ? `अघिल्लो महिना (${formattedPastMonth}) भन्दा रु. ${Math.abs(comparison.difference).toLocaleString('en-IN')} ले घटेको (${comparison.percentageChange.toFixed(1)}%)`
      : `अघिल्लो महिना (${formattedPastMonth}) सँग कुल रकम बराबर रहेको छ`
    : comparison.headlineSummary;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-700" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {t.monthlyBillAnalysis}
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {comparison.difference !== 0 ? t.changeDetected : t.noChange}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {current.matchedSchoolName || current.schoolNameFromBill} • {t.comparingMonths}{' '}
            <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {formattedPastMonth} ({t.pastMonthTag})
            </span>{' '}
            vs{' '}
            <span className="font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {formattedCurrentMonth} ({t.currentMonthTag})
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => onViewAudit(current)}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <span>{t.btnViewAudit}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3-Column Comparative Overview: Current | Past Month | Net Difference */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Current Month */}
        <div className="p-5 rounded-2xl bg-white border-2 border-emerald-200/80 space-y-1 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
            {t.currentMonth} ({formattedCurrentMonth})
          </span>
          <div className="text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
            Rs. {current.totalAmount.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 block pt-0.5">
            {current.extractedFees.length} {t.feeLineItems}
          </span>
        </div>

        {/* Past Month */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            {t.pastMonth} ({formattedPastMonth})
          </span>
          <div className="text-3xl font-extrabold font-mono text-slate-700 tabular-nums">
            Rs. {past.totalAmount.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 block pt-0.5">
            {past.extractedFees.length} {t.feeLineItems}
          </span>
        </div>

        {/* Net Shift */}
        <div
          className={`p-5 rounded-2xl border space-y-1 ${
            isIncrease
              ? 'bg-amber-50/60 border-amber-200 text-amber-900'
              : isDecrease
              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
              : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-wider block">
            {t.netDifference}
          </span>
          <div className="text-3xl font-extrabold font-mono tabular-nums flex items-center gap-1">
            {isIncrease && <ArrowUpRight className="w-5 h-5 text-amber-700 shrink-0" />}
            {isDecrease && <ArrowDownRight className="w-5 h-5 text-emerald-700 shrink-0" />}
            {!isIncrease && !isDecrease && <Minus className="w-4 h-4 text-slate-400 shrink-0" />}
            {isIncrease ? `+Rs. ${comparison.difference.toLocaleString('en-IN')}` : isDecrease ? `-Rs. ${Math.abs(comparison.difference).toLocaleString('en-IN')}` : 'Rs. 0'}
            <span className="text-sm font-bold ml-1">
              ({isIncrease ? `+${comparison.percentageChange.toFixed(1)}%` : `${comparison.percentageChange.toFixed(1)}%`})
            </span>
          </div>
          <span className="text-xs font-semibold block pt-0.5">
            {headlineSummaryLocalized}
          </span>
        </div>
      </div>

      {/* Largest Increases & Changes Section */}
      {comparison.largestIncreases && comparison.largestIncreases.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <span>{t.keyFeeIncreases}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {comparison.largestIncreases.map((inc, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-white rounded-xl border border-slate-200/90 flex items-center justify-between text-xs shadow-2xs"
              >
                <div className="truncate pr-2">
                  <span className="font-bold text-slate-800 block truncate">
                    {inc.feeTitle}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {t.wasAmount} Rs. {inc.previousAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="font-mono font-bold text-amber-700 shrink-0">
                  +Rs. {inc.difference.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category-by-Category Shift List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          {t.lineByLineComparison}
        </h4>
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
          {comparison.feeChanges.map((change, idx) => {
            const isChangeIncrease = change.difference > 0;
            const isChangeDecrease = change.difference < 0;

            const changeTextLocalized = lang === 'np'
              ? isChangeIncrease
                ? `रु. ${change.difference.toLocaleString('en-IN')} ले वृद्धि भएको`
                : isChangeDecrease
                ? `रु. ${Math.abs(change.difference).toLocaleString('en-IN')} ले घटेको`
                : 'रकम स्थिर रहेको'
              : change.changeText;

            return (
              <div
                key={idx}
                className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50/60 transition-colors"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 text-sm block">
                    {change.feeTitle}
                  </span>
                  <p className="text-slate-600 font-medium text-xs">
                    {changeTextLocalized}
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0 font-mono">
                  <div className="text-xs text-slate-400">
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

      {/* Potential Discrepancies in Current Bill Callout */}
      {latestBill.extractedFees.some(f => f.isFlagged) ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/60 border border-rose-200 text-xs space-y-2.5">
          <div className="flex items-center gap-2 font-bold text-rose-900">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{t.currentFlaggedDiscrepancies}</span>
          </div>
          <ul className="space-y-1.5 text-slate-700">
            {latestBill.extractedFees.filter(f => f.isFlagged).map((f, i) => (
              <li key={i} className="p-2.5 bg-white rounded-xl border border-rose-200 flex items-center justify-between">
                <span className="font-semibold text-slate-900">
                  {f.originalLabel} ({f.normalizedTitle})
                </span>
                <span className="font-mono font-bold text-rose-600">
                  Rs. {f.amount.toLocaleString('en-IN')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs font-medium text-emerald-900">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t.allChargesWithinLimits}</span>
        </div>
      )}
    </div>
  );
};
