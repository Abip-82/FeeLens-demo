import React, { useState } from 'react';
import {
  Building2,
  GraduationCap,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileQuestion,
  ChevronDown,
  ChevronUp,
  BookmarkCheck,
  ArrowLeft,
  FileText,
  Info,
} from 'lucide-react';
import { BillAuditReport, FeeEvaluationStatus, Bill, BillComparison } from '../types';
import { Language, TRANSLATIONS, formatMonthInLanguage, formatGradeInLanguage, getLocalizedWhyExplanation } from '../utils/translations';
import { ReportModal } from './ReportModal';
import { BillComparisonCard } from './BillComparisonCard';
import { AudioAuditSummary } from './AudioAuditSummary';

interface BillAuditResultProps {
  report: BillAuditReport;
  billingMonth: string;
  studentName?: string | null;
  onSaveToHistory: () => void;
  isSaved?: boolean;
  onBackToEdit: () => void;
  onCheckAnother: () => void;
  lang: Language;
  comparison?: BillComparison | null;
}

export const BillAuditResult: React.FC<BillAuditResultProps> = ({
  report,
  billingMonth,
  studentName,
  onSaveToHistory,
  isSaved = false,
  onBackToEdit,
  onCheckAnother,
  lang,
  comparison,
}) => {
  const [expandedFeeId, setExpandedFeeId] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const t = TRANSLATIONS[lang];

  const toggleWhy = (id: string) => {
    setExpandedFeeId(prev => (prev === id ? null : id));
  };

  const getStatusBadge = (status: FeeEvaluationStatus, label: string) => {
    switch (status) {
      case 'within_limit':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{t.statusWithinLimit}</span>
          </span>
        );
      case 'exceeds_limit':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>{t.statusExceedsLimit}</span>
          </span>
        );
      case 'potential_discrepancy':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{lang === 'np' ? t.statusPotentialDiscrepancy : (label || t.statusPotentialDiscrepancy)}</span>
          </span>
        );
      case 'no_numeric_rule':
      case 'recognized_heading':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-50 text-sky-800 border border-sky-200 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span>{t.statusRecognizedHeading}</span>
          </span>
        );
      case 'unable_to_verify':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold">
            <FileQuestion className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{t.statusUnableToVerify}</span>
          </span>
        );
    }
  };

  const billForReport: Bill = {
    id: `report-${Date.now()}`,
    createdAt: new Date().toISOString(),
    billingMonth,
    studentName: studentName || 'Student',
    schoolNameFromBill: report.schoolName,
    matchedSchoolId: report.matchedSchool?.id || null,
    matchedSchoolName: report.schoolName,
    gradeRaw: report.rawGrade,
    gradeNumeric: report.numericGrade,
    gradeLevel: report.gradeLevel,
    schoolCategory: report.category,
    extractedFees: report.auditedFees.map(f => ({
      id: f.id,
      originalLabel: f.originalLabel,
      normalizedFeeType: f.normalizedFeeType,
      normalizedTitle: f.feeName,
      amount: f.amount,
      confidence: 0.95,
      status: f.status,
      statusLabel: f.statusLabel,
      applicableLimit: f.applicableLimit,
      difference: f.difference,
      explanation: f.shortExplanation,
      isFlagged: f.status === 'exceeds_limit' || f.status === 'potential_discrepancy',
    })),
    totalAmount: report.totalBilled,
    confidence: 0.95,
  };

  const formattedBillingMonth = formatMonthInLanguage(billingMonth, lang);
  const formattedGrade = formatGradeInLanguage(report.rawGrade, report.gradeLevel, lang);

  return (
    <div className="space-y-6">
      {/* 1. Main Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              {t.auditComplete}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t.yourSchoolBillAudit}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {report.schoolName} • {formattedGrade} • {formattedBillingMonth}
              {studentName && ` • ${lang === 'en' ? `Student: ${studentName}` : `विद्यार्थी: ${studentName}`}`}
            </p>
          </div>
          <div className="text-left md:text-right bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-2xl border md:border-none border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              {t.totalBilledAmount}
            </span>
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 tabular-nums">
              Rs. {report.totalBilled.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* SUMMARY CARD */}
        <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200/80 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {t.auditSummaryCard}
              </h2>
              <p className="text-xs text-slate-500">
                {t.evaluatedAgainstPrototype}
              </p>
            </div>
            <div className="text-xs font-mono font-semibold text-slate-600">
              {report.counts.totalCharges} {t.chargesEvaluated}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                {t.totalBilled}
              </span>
              <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                Rs. {report.totalBilled.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-emerald-200 bg-emerald-50/20">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                {t.totalRecognizedCharges}
              </span>
              <span className="text-xl font-bold font-mono text-emerald-700 tabular-nums">
                Rs. {report.totalRecognizedCharges.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">
                {t.underApprovedHeadings}
              </span>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                {t.identifiedDiscrepancies}
              </span>
              <div className="flex items-baseline gap-2">
                <span className={`text-xl font-bold font-mono tabular-nums ${report.discrepancyList.length > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {report.discrepancyList.length}
                </span>
                <span className="text-xs text-slate-500">
                  {report.discrepancyList.length === 0 ? t.noneFlagged : t.statusNeedsAttention}
                </span>
              </div>
            </div>
          </div>

          {report.discrepancyList.length > 0 ? (
            <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-200/60 pb-2">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{t.identifiedDiscrepancies} ({report.discrepancyList.length})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(true)}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{t.btnGenerateReportShort}</span>
                </button>
              </div>
              <ul className="space-y-2 text-xs">
                {report.discrepancyList.map((disc, idx) => (
                  <li
                    key={disc.id || idx}
                    className="p-3 bg-white rounded-lg border border-rose-200/80 flex flex-col sm:flex-row sm:items-start justify-between gap-2 shadow-2xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{disc.feeName}</span>
                        {disc.originalLabel !== disc.feeName && (
                          <span className="text-slate-500 text-[11px]">("{disc.originalLabel}")</span>
                        )}
                      </div>
                      <p className="text-rose-700 font-medium">
                        {disc.issue}
                      </p>
                      <p className="text-slate-500 text-[11px]">
                        {t.parentNote}: {disc.recommendation}
                      </p>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <div className="font-mono font-bold text-slate-900">
                        {t.charged}: Rs. {disc.amount.toLocaleString('en-IN')}
                      </div>
                      {disc.difference !== null && disc.difference !== undefined && disc.difference > 0 && (
                        <div className="font-mono text-[11px] font-semibold text-rose-600">
                          {t.overCeiling}: +Rs. {disc.difference.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-900 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t.noDiscrepanciesIdentified}</span>
            </div>
          )}
        </div>

        {/* STEPS 1, 2, 3 TRANSPARENCY BREAKDOWN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* STEP 1: Match School */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 text-xs space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {t.step1MatchSchool}
            </span>
            <div className="space-y-1.5">
              <div className="font-bold text-slate-900 text-sm leading-snug">
                {report.schoolName}
              </div>
              <div className="text-slate-600 font-medium">
                {t.municipality}: <span className="text-slate-900 font-semibold">{lang === 'np' ? 'भरतपुर महानगरपालिका' : report.municipality}</span>
              </div>
              <div className="text-slate-600">
                {t.schoolType}: <span className="text-slate-900 font-semibold">
                  {lang === 'np'
                    ? (report.schoolType === 'Private / Institutional' ? 'संस्थागत / निजी विद्यालय' : 'सार्वजनिक / सामुदायिक')
                    : report.schoolType}
                </span>
              </div>
              <div className="pt-1">
                <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold font-mono">
                  {lang === 'np' ? `वर्ग: ${report.category ? `${report.category} वर्ग` : 'सामुदायिक'}` : `Category: ${report.category || 'Public'}`}
                </span>
              </div>
            </div>
          </div>

          {/* STEP 2: Grade Level */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 text-xs space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {t.step2GradeLevel}
            </span>
            <div className="font-bold text-slate-900 text-sm">
              {formattedGrade}
            </div>
            <div>
              <span className="text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-semibold inline-block">
                {t.level}: {lang === 'np'
                  ? report.gradeLevel === 'Primary' ? t.primary
                  : report.gradeLevel === 'Lower Secondary' ? t.lowerSecondary
                  : t.secondary
                  : report.gradeLevel}
              </span>
            </div>
            <div className="pt-1 text-[11px] text-slate-500 space-y-0.5 leading-relaxed">
              <div className={report.gradeLevel === 'Primary' ? 'font-bold text-emerald-800' : ''}>
                • {t.primary}
              </div>
              <div className={report.gradeLevel === 'Lower Secondary' ? 'font-bold text-emerald-800' : ''}>
                • {t.lowerSecondary}
              </div>
              <div className={report.gradeLevel === 'Secondary' ? 'font-bold text-emerald-800' : ''}>
                • {t.secondary}
              </div>
            </div>
          </div>

          {/* STEP 3: Tuition Ceiling */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 text-xs space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {t.step3TuitionCeiling}
            </span>
            <div className="font-extrabold text-slate-900 text-base font-mono">
              {report.monthlyTuitionCeiling !== null
                ? `Rs. ${report.monthlyTuitionCeiling.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/${lang === 'en' ? 'mo' : 'महिना'}`
                : t.statusUnableToVerify}
            </div>
            <p className="text-[11px] text-slate-600 font-mono leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-200">
              {report.monthlyCeilingFormula}
            </p>
          </div>
        </div>
      </div>

      {/* MONTH-TO-MONTH COMPARISON (IF PREVIOUS RECORD EXISTS) */}
      {comparison && (
        <BillComparisonCard
          comparison={comparison}
          currentMonthName={billingMonth}
          lang={lang}
        />
      )}

      {/* STEP 4: AUDIT FEE ITEMS */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {t.step4FeeItemAudit}
            </h3>
            <p className="text-xs text-slate-500">
              {t.step4Subtext}
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {t.step4ClickWhy}
          </span>
        </div>
        <div className="divide-y divide-slate-100">
          {report.auditedFees.map(fee => {
            const isExpanded = expandedFeeId === fee.id;
            const localizedWhy = getLocalizedWhyExplanation(
              fee,
              report.category,
              report.gradeLevel,
              report.rawGrade,
              lang
            );

            return (
              <div
                key={fee.id}
                className={`p-5 sm:p-6 transition-colors ${
                  fee.status === 'exceeds_limit'
                    ? 'bg-rose-50/20'
                    : fee.status === 'potential_discrepancy'
                    ? 'bg-amber-50/20'
                    : 'hover:bg-slate-50/50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900">
                        {fee.feeName}
                      </h4>
                      {fee.originalLabel !== fee.feeName && (
                        <span className="text-xs text-slate-500 font-normal">
                          ({t.invoiceLabel}: "{fee.originalLabel}")
                        </span>
                      )}
                    </div>
                    <div>
                      {getStatusBadge(fee.status, fee.statusLabel)}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {lang === 'np' ? localizedWhy.ruleExplanation : fee.shortExplanation}
                    </p>
                    {fee.conditionalNote && (
                      <div className="inline-block text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded mt-1">
                        {t.note}: {fee.conditionalNote}
                      </div>
                    )}
                  </div>

                  <div className="text-left sm:text-right shrink-0 space-y-1 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-none border-slate-200">
                    <div className="text-sm font-semibold text-slate-500">
                      {t.billedAmount}:{' '}
                      <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                        Rs. {fee.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    {fee.applicableLimit !== null && fee.applicableLimit !== undefined && (
                      <div className="text-xs font-mono text-slate-600">
                        {t.configuredCeiling}: Rs. {fee.applicableLimit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    )}
                    {fee.difference !== null && fee.difference !== undefined && fee.difference > 0 && (
                      <div className="text-xs font-mono font-bold text-rose-600">
                        {t.difference}: Rs. {fee.difference.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    )}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => toggleWhy(fee.id)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer p-1"
                      >
                        <span>{isExpanded ? t.btnHideWhy : t.btnWhy}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* WHY EXPANDABLE SECTION */}
                {isExpanded && (
                  <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-3.5">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                      <Info className="w-4 h-4 text-emerald-700" />
                      <span>{t.whyEvaluated}</span>
                    </div>

                    {/* 1. Reason Headline */}
                    {localizedWhy.reasonHeadline && (
                      <div className={`p-3 rounded-xl border text-xs font-semibold leading-relaxed ${
                        fee.status === 'exceeds_limit'
                          ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                          : fee.status === 'potential_discrepancy'
                          ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                          : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                      }`}>
                        {localizedWhy.reasonHeadline}
                      </div>
                    )}

                    {/* 2. Plain Language Rule Explanation */}
                    <div className="space-y-1.5 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
                        {t.municipalRuleBasis}
                      </span>
                      <p className="text-slate-700 text-xs">
                        {localizedWhy.ruleExplanation}
                      </p>
                    </div>

                    {/* 3. Arithmetic Formula / Calculation (if applicable) */}
                    {localizedWhy.calculationText && (
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                        <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
                          {t.calculationRuleCheck}
                        </span>
                        <p className="font-mono text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200">
                          {localizedWhy.calculationText}
                        </p>
                      </div>
                    )}

                    {/* 4. Margin / Difference (if applicable) */}
                    {localizedWhy.differenceText && (
                      <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
                        <span className="font-medium text-slate-600">{t.thresholdVariance}</span>
                        <span className={`font-mono font-bold ${
                          fee.status === 'exceeds_limit'
                            ? 'text-rose-600'
                            : fee.status === 'potential_discrepancy'
                            ? 'text-amber-700'
                            : 'text-emerald-700'
                        }`}>
                          {localizedWhy.differenceText}
                        </span>
                      </div>
                    )}

                    {/* 5. Actionable Advice for Parents (if flagged) */}
                    {localizedWhy.discrepancyAction && (
                      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-1">
                        <span className="font-bold block text-[11px] uppercase tracking-wider text-amber-900">
                          {t.parentActionStep}
                        </span>
                        <p className="leading-relaxed">
                          {localizedWhy.discrepancyAction}
                        </p>
                      </div>
                    )}

                    {/* 6. Context Metadata */}
                    <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                      <div className="flex flex-wrap items-center gap-x-3">
                        <span>{localizedWhy.schoolCategoryText}</span>
                        <span>•</span>
                        <span>{localizedWhy.gradeText}</span>
                      </div>
                      <span className="text-slate-400">
                        {localizedWhy.sourceMetadata?.sourceLabel}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SHORT SUMMARY & SPOKEN NEPALI VOICE FEATURE AT THE END OF AUDIT */}
      <AudioAuditSummary
        report={report}
        billingMonth={billingMonth}
        comparison={comparison}
        lang={lang}
      />

      {/* Bottom Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onBackToEdit}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.btnBackToEdit}</span>
          </button>
          <button
            type="button"
            onClick={onCheckAnother}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
          >
            {t.btnCheckAnother}
          </button>
          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="px-4 py-2.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>{t.btnGenerateReportShort}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onSaveToHistory}
          disabled={isSaved}
          className={`px-5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
            isSaved
              ? 'bg-slate-100 text-slate-500 border border-slate-200 cursor-default'
              : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
          }`}
        >
          <BookmarkCheck className="w-4 h-4" />
          <span>{isSaved ? t.btnSavedInHistory : t.btnSaveToHistory}</span>
        </button>
      </div>

      <ReportModal
        bill={billForReport}
        comparison={comparison}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        lang={lang}
      />
    </div>
  );
};
