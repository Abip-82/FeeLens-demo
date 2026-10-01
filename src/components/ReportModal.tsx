/**
 * Parent-Friendly FeeLens Audit Report & Complaint Generator
 * Full English & Nepali translation support for report memorandum and letter.
 */
import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Printer,
  AlertTriangle,
  Building2,
  Calendar,
  GraduationCap,
  Mail,
  FileText,
  Info,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { Bill, BillComparison } from '../types';
import { Language, TRANSLATIONS, formatMonthInLanguage, formatGradeInLanguage, getLocalizedWhyExplanation } from '../utils/translations';
import { calculateTuitionCeiling } from '../services/rulesEngine';

interface ReportModalProps {
  bill: Bill;
  comparison?: BillComparison | null;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  bill,
  comparison,
  isOpen,
  onClose,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'report' | 'email'>('report');
  const [copied, setCopied] = useState(false);
  const t = TRANSLATIONS[lang];

  if (!isOpen) return null;

  const flaggedFees = bill.extractedFees.filter(
    f => f.isFlagged || f.status === 'exceeds_limit' || f.status === 'potential_discrepancy'
  );

  const totalExcessAmount = flaggedFees.reduce((sum, f) => {
    if (f.difference && f.difference > 0) return sum + f.difference;
    if (f.status === 'potential_discrepancy') return sum + f.amount;
    return sum;
  }, 0);

  const totalRecognizedAmount = bill.totalAmount - totalExcessAmount;

  const tuitionCeiling = calculateTuitionCeiling(bill.schoolCategory, bill.gradeLevel);
  const formattedBillingMonth = formatMonthInLanguage(bill.billingMonth, lang);
  const formattedGrade = formatGradeInLanguage(bill.gradeRaw, bill.gradeLevel, lang);

  const formattedDate = bill.dateAnalyzed || new Date(bill.createdAt).toLocaleDateString(
    lang === 'en' ? 'en-US' : 'ne-NP',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  const schoolDisplayName = bill.matchedSchoolName || bill.schoolNameFromBill || (lang === 'en' ? 'Unknown School' : 'विद्यालय');
  const municipalityDisplayName = lang === 'np' ? 'भरतपुर महानगरपालिका' : (bill.municipality || 'Bharatpur Metropolitan City');
  const schoolCategoryDisplayName = bill.schoolCategory
    ? (lang === 'en' ? `Category ${bill.schoolCategory}` : `वर्ग ${bill.schoolCategory}`)
    : (lang === 'en' ? 'Public / Community' : 'सार्वजनिक / सामुदायिक');
  const parentName = bill.studentName
    ? (lang === 'en' ? `Guardian of ${bill.studentName}` : `${bill.studentName} का अभिभावक`)
    : (lang === 'en' ? 'Parent / Guardian' : 'अभिभावक');

  // Construct Email / Letter based on selected language
  const emailSubjectEn = `Inquiry Regarding School Fee Charge - ${schoolDisplayName} (${bill.billingMonth})`;
  const emailSubjectNp = `विद्यालय शुल्क विवरण सम्बन्धमा सोधपुछ तथा निवेदन - ${schoolDisplayName} (${formattedBillingMonth})`;
  const emailSubject = lang === 'en' ? emailSubjectEn : emailSubjectNp;

  const feeIssuesTextEn = flaggedFees.length > 0
    ? flaggedFees.map((f, i) => {
        let ruleContext = '';
        if (f.normalizedFeeType === 'monthly_tuition') {
          ruleContext = `Category ${bill.schoolCategory || 'Standard'} ceiling for ${bill.gradeLevel} is Rs. ${f.applicableLimit?.toLocaleString('en-IN')}/month. Charged amount of Rs. ${f.amount.toLocaleString('en-IN')} exceeds the ceiling by Rs. ${f.difference?.toLocaleString('en-IN')}.`;
        } else if (f.normalizedFeeType === 'annual_fee') {
          ruleContext = `Annual Fee is capped at 2 months' tuition ceiling (Rs. ${f.applicableLimit?.toLocaleString('en-IN')}). Charged amount of Rs. ${f.amount.toLocaleString('en-IN')} exceeds by Rs. ${f.difference?.toLocaleString('en-IN')}.`;
        } else if (f.normalizedFeeType === 'admission_fee') {
          ruleContext = `Re-admission fee charged to a continuing student. Under municipal regulations, admission is a one-time initial entry fee.`;
        } else {
          ruleContext = `Fee label "${f.originalLabel}" does not correspond to any of the 14 authorized municipal school fee categories.`;
        }
        return `Item ${i + 1}: ${f.originalLabel} (Rs. ${f.amount.toLocaleString('en-IN')})\n• Issue: ${ruleContext}\n• Rule reference: ${bill.ruleMetadata?.sourceLabel || 'BMC Prototype Fee Standard v1 (Chitwan)'}`;
      }).join('\n\n')
    : `General verification request:\n• Total billed: Rs. ${bill.totalAmount.toLocaleString('en-IN')}\n• Requesting confirmation of fee structure against Bharatpur municipal guidelines.`;

  const feeIssuesTextNp = flaggedFees.length > 0
    ? flaggedFees.map((f, i) => {
        let ruleContextNp = '';
        if (f.normalizedFeeType === 'monthly_tuition') {
          ruleContextNp = `कक्षा ${bill.gradeRaw} को लागि वर्ग ${bill.schoolCategory || ''} को अधिकतम मासिक सीमा रु. ${f.applicableLimit?.toLocaleString('en-IN')} तोकिएको छ। बिल गरिएको रु. ${f.amount.toLocaleString('en-IN')} ले सीमालाई रु. ${f.difference?.toLocaleString('en-IN')} ले नाघेको देखिन्छ।`;
        } else if (f.normalizedFeeType === 'annual_fee') {
          ruleContextNp = `वार्षिक शुल्क बढीमा २ महिनाको पढाइ शुल्क बराबर (रु. ${f.applicableLimit?.toLocaleString('en-IN')}) मात्र लिन पाइनेमा रु. ${f.difference?.toLocaleString('en-IN')} बढी बिल गरिएको छ।`;
        } else if (f.normalizedFeeType === 'admission_fee') {
          ruleContextNp = `निरन्तर अध्ययनरत विद्यार्थीसँग पुनः भर्ना शुल्क लिइएको छ। नियम अनुसार भर्ना शुल्क पहिलो पटक मात्र लागु हुन्छ।`;
        } else {
          ruleContextNp = `"${f.originalLabel}" शीर्षक नगरपालिकाका १४ मान्य शुल्क शीर्षकमा समावेश छैन।`;
        }
        return `बुँदा ${i + 1}: ${f.originalLabel} (रु. ${f.amount.toLocaleString('en-IN')})\n• कैफियत: ${ruleContextNp}`;
      }).join('\n\n')
    : `सामान्य प्रमाणीकरण अनुरोध:\n• कुल बिल रकम: रु. ${bill.totalAmount.toLocaleString('en-IN')}\n• नगरपालिकाको मापदण्ड अनुसार शुल्क रुजु गरिदिनुहुन।`;

  const emailBodyEn = `Subject: ${emailSubjectEn}

Respected Principal / Accounts Department,
${schoolDisplayName}, ${municipalityDisplayName}

I am writing as a parent to respectfully request clarification regarding the monthly fee receipt issued for ${bill.studentName ? bill.studentName + ', ' : ''}${bill.gradeRaw} for the month of ${bill.billingMonth}.

Upon reviewing the itemized bill against the Bharatpur Metropolitan City school fee guidelines:

${flaggedFees.length > 0 ? `The following line item(s) appear to require adjustment or clarification:\n\n${feeIssuesTextEn}` : `Total Billed: Rs. ${bill.totalAmount.toLocaleString('en-IN')}\nAll charges appear within standard recognized categories.`}

Summary Reference:
• School: ${schoolDisplayName} (${schoolCategoryDisplayName})
• Class / Grade: ${bill.gradeRaw} (${bill.gradeLevel})
• Billing Month: ${bill.billingMonth}
${tuitionCeiling.ceiling ? `• Approved Monthly Tuition Ceiling: Rs. ${tuitionCeiling.ceiling.toLocaleString('en-IN')}/month (Formula: ${tuitionCeiling.formula})` : ''}

Could you please verify these charges and provide an itemized clarification? If any charge was billed in error, kindly issue a revised invoice.

Thank you for your assistance.

Sincerely,
${parentName}
Contact: ________________________

[Generated using FeeLens School Fee Audit System - Bharatpur Prototype]`;

  const emailBodyNp = `विषय: ${emailSubjectNp}

श्री प्रधानाध्यापक / लेखा शाखा,
${schoolDisplayName}, ${municipalityDisplayName}।

म ${bill.studentName ? bill.studentName + ' (' + formattedGrade + ')' : formattedGrade} को अभिभावकको हैसियतले ${formattedBillingMonth} महिनाको विद्यालय शुल्क रसिद सम्बन्धमा केही बुँदाहरू प्रष्ट गरिदिनुहुन यो पत्र लेख्दैछु।

भरतपुर महानगरपालिकाको संस्थागत विद्यालय शुल्क मापदण्ड बमोजिम बिल विश्लेषण गर्दा निम्न विषयहरूमा स्पष्टीकरण तथा पुनरावलोकन आवश्यक देखिएको छ:

${flaggedFees.length > 0 ? `${feeIssuesTextNp}` : `कुल बिल रकम: रु. ${bill.totalAmount.toLocaleString('en-IN')}\nसबै शीर्षकहरू तोकिएको मापदण्ड भित्रै रहेको देखिन्छ।`}

विवरण सन्दर्भ:
• विद्यालय: ${schoolDisplayName} (${schoolCategoryDisplayName})
• कक्षा / तह: ${formattedGrade}
• बिलको महिना: ${formattedBillingMonth}
${tuitionCeiling.ceiling ? `• तोकिएको अधिकतम मासिक सीमा: रु. ${tuitionCeiling.ceiling.toLocaleString('en-IN')}/महिना` : ''}

माथि उल्लेखित शुल्क शीर्षकहरूको आधिकारिकता रुजु गरिदिनुहुन र कुनै प्राविधिक वा भूलवश बढी रकम परेको भए सच्याई संशोधित बिल उपलब्ध गराइदिनुहुन सादर अनुरोध गर्दछु।

धन्यवाद।

भवदीय,
${parentName}
सम्पर्क नं: ________________________

[फी लेन्स (FeeLens) विद्यालय शुल्क अडिट प्रणालीद्वारा तयार पारिएको]`;

  const emailBody = lang === 'en' ? emailBodyEn : emailBodyNp;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const mailtoLink = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static print:overflow-visible">
      <div className="relative bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl print:border-none print:shadow-none print:max-h-none print:overflow-visible print:w-full">
        {/* Modal Top Bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  {t.reportModalTitle}
                </h2>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {t.reportModalBadge}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {schoolDisplayName} • {formattedBillingMonth}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs & Actions */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 text-xs font-semibold shadow-2xs">
            <button
              onClick={() => setActiveTab('report')}
              className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'report'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{t.tabFullAuditReport}</span>
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'email'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>{t.tabComplaintLetter}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'email' ? (
              <>
                <button
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-colors cursor-pointer shadow-xs"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? t.copiedToClipboard : t.copyEntireLetter}</span>
                </button>
                <a
                  href={mailtoLink}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer shadow-xs"
                >
                  <ExternalLink className="w-4 h-4 text-slate-500" />
                  <span>{t.openInEmail}</span>
                </a>
              </>
            ) : (
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-black text-white transition-colors cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4 text-slate-300" />
                <span>{t.btnPrintPdf}</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-10 space-y-8">
          {activeTab === 'report' && (
            <div className="space-y-8 text-slate-900">
              {/* Report Header Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-900 pb-6">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 font-mono">
                    {t.memorandumHeader}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {t.memorandumTitle}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {t.memorandumSubtitle}
                  </p>
                </div>

                <div className="self-start sm:self-auto">
                  {flaggedFees.length > 0 ? (
                    <div className="px-4 py-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center gap-2 font-bold text-xs sm:text-sm shadow-2xs">
                      <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                      <span>{flaggedFees.length} {t.issuesRequireAttention}</span>
                    </div>
                  ) : (
                    <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2 font-bold text-xs sm:text-sm shadow-2xs">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>{t.allFeesWithinLimits}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Top Key Metadata Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    {t.school}
                  </span>
                  <span className="font-bold text-slate-900 text-sm block truncate" title={schoolDisplayName}>
                    {schoolDisplayName}
                  </span>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block font-mono">
                    {schoolCategoryDisplayName}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    {t.studentAndClass}
                  </span>
                  <span className="font-bold text-slate-900 text-sm block">
                    {bill.studentName || (lang === 'en' ? 'Student' : 'विद्यार्थी')}
                  </span>
                  <span className="text-xs text-slate-600 block">
                    {formattedGrade}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    {t.billingMonth}
                  </span>
                  <span className="font-bold text-slate-900 text-sm block">
                    {formattedBillingMonth}
                  </span>
                  <span className="text-xs text-slate-500 block">
                    {municipalityDisplayName}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    {t.dateEvaluated}
                  </span>
                  <span className="font-bold text-slate-900 text-sm block font-mono">
                    {formattedDate}
                  </span>
                  <span className="text-xs text-slate-500 block">
                    {t.deterministicAudit}
                  </span>
                </div>
              </div>

              {/* Big Financial Summary Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    {t.totalBilledAmount}
                  </span>
                  <div className="text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
                    Rs. {bill.totalAmount.toLocaleString('en-IN')}
                  </div>
                  <span className="text-xs text-slate-500 block pt-1">
                    {bill.extractedFees.length} {t.itemizedFeeLines}
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 shadow-2xs space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                    {t.standardCharges}
                  </span>
                  <div className="text-3xl font-extrabold font-mono text-emerald-800 tabular-nums">
                    Rs. {totalRecognizedAmount.toLocaleString('en-IN')}
                  </div>
                  <span className="text-xs text-emerald-700 block pt-1">
                    {t.standardChargesDesc}
                  </span>
                </div>

                <div className={`p-5 rounded-2xl border shadow-2xs space-y-1 ${
                  flaggedFees.length > 0
                    ? 'bg-rose-50/70 border-rose-200'
                    : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className={`text-xs font-bold uppercase tracking-wider block ${
                    flaggedFees.length > 0 ? 'text-rose-800' : 'text-slate-500'
                  }`}>
                    {t.excessSurcharge}
                  </span>
                  <div className={`text-3xl font-extrabold font-mono tabular-nums ${
                    flaggedFees.length > 0 ? 'text-rose-700' : 'text-slate-800'
                  }`}>
                    {flaggedFees.length > 0
                      ? `Rs. ${totalExcessAmount.toLocaleString('en-IN')}`
                      : 'Rs. 0'}
                  </div>
                  <span className={`text-xs block pt-1 ${
                    flaggedFees.length > 0 ? 'text-rose-600 font-semibold' : 'text-slate-500'
                  }`}>
                    {flaggedFees.length > 0
                      ? `${flaggedFees.length} ${t.discrepancyFlaggedInBill}`
                      : t.noIssuesFound}
                  </span>
                </div>
              </div>

              {/* FLAGGED ISSUES SECTION */}
              {flaggedFees.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-rose-200 pb-2">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    <h2 className="text-base sm:text-lg font-bold text-rose-900 uppercase tracking-wider">
                      {t.flaggedIssues} ({flaggedFees.length})
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {flaggedFees.map((fee, idx) => {
                      const localizedWhy = getLocalizedWhyExplanation(
                        {
                          ...fee,
                          feeName: fee.normalizedTitle || fee.originalLabel,
                          whyExplanation: {
                            reasonHeadline: '',
                            ruleExplanation: fee.explanation || '',
                            sourceMetadata: { sourceLabel: '', sourcePage: '' },
                          },
                        },
                        bill.schoolCategory,
                        bill.gradeLevel,
                        bill.gradeRaw,
                        lang
                      );

                      return (
                        <div
                          key={fee.id || idx}
                          className="p-5 sm:p-6 rounded-3xl bg-rose-50/40 border border-rose-200 space-y-4 shadow-xs"
                        >
                          {/* Title & Amount */}
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-rose-200/80 pb-3">
                            <div className="space-y-0.5">
                              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 font-mono">
                                {t.issueNumber}{idx + 1}
                              </span>
                              <h3 className="text-lg font-bold text-slate-900">
                                {fee.originalLabel}
                                {fee.normalizedTitle !== fee.originalLabel && (
                                  <span className="text-sm font-medium text-slate-500 ml-2">
                                    ({fee.normalizedTitle})
                                  </span>
                                )}
                              </h3>
                            </div>

                            <div className="text-left sm:text-right bg-white px-3.5 py-1.5 rounded-xl border border-rose-200">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">{t.billedAmount}</span>
                              <span className="text-lg font-bold font-mono text-rose-700">
                                Rs. {fee.amount.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>

                          {/* Plain Language Rule Explanation */}
                          <div className="space-y-1.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                              {t.whyThisIsFlagged}
                            </span>
                            <p className="text-sm text-slate-800 leading-relaxed font-medium bg-white p-3.5 rounded-xl border border-rose-200/70">
                              {localizedWhy.ruleExplanation}
                            </p>
                          </div>

                          {/* 2-Column Math & Allowable Ceiling Box */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="p-3 bg-white rounded-xl border border-rose-200/70 space-y-1">
                              <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] block">
                                {t.allowableMunicipalLimit}
                              </span>
                              <span className="text-base font-bold font-mono text-slate-900">
                                {fee.applicableLimit
                                  ? `Rs. ${fee.applicableLimit.toLocaleString('en-IN')}`
                                  : t.unmappedUnpermitted}
                              </span>
                            </div>

                            <div className="p-3 bg-white rounded-xl border border-rose-200/70 space-y-1">
                              <span className="font-bold text-rose-800 uppercase tracking-wider text-[11px] block">
                                {t.excessOverchargeAmount}
                              </span>
                              <span className="text-base font-bold font-mono text-rose-600">
                                {fee.difference && fee.difference > 0
                                  ? `+Rs. ${fee.difference.toLocaleString('en-IN')}`
                                  : `Rs. ${fee.amount.toLocaleString('en-IN')}`}
                              </span>
                            </div>
                          </div>

                          {/* Parent Action Guidance */}
                          {localizedWhy.discrepancyAction && (
                            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold block text-amber-900">
                                  {t.actionForParents}
                                </span>
                                <p className="leading-relaxed mt-0.5">
                                  {localizedWhy.discrepancyAction}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ITEMIZE FEE TABLE */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-wider">
                    {t.fullItemizedBreakdown}
                  </h2>
                  <span className="text-xs text-slate-500">
                    {bill.extractedFees.length} {t.itemizedFeeLines}
                  </span>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3.5 px-4">{t.feeHeading}</th>
                        <th className="py-3.5 px-4">{t.category}</th>
                        <th className="py-3.5 px-4 text-right">{t.billedAmount}</th>
                        <th className="py-3.5 px-4 text-right">{t.allowedCeiling}</th>
                        <th className="py-3.5 px-4 text-right">{t.variance}</th>
                        <th className="py-3.5 px-4">{t.status}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bill.extractedFees.map(fee => (
                        <tr
                          key={fee.id}
                          className={`transition-colors ${
                            fee.isFlagged ? 'bg-rose-50/30' : 'hover:bg-slate-50/50'
                          }`}
                        >
                          <td className="py-3.5 px-4 font-semibold text-slate-900">
                            {fee.originalLabel}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 text-xs">
                            {fee.normalizedTitle}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                            Rs. {fee.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-slate-600 text-xs">
                            {fee.applicableLimit
                              ? `Rs. ${fee.applicableLimit.toLocaleString('en-IN')}`
                              : t.noCap}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-semibold text-xs">
                            {fee.difference !== null && fee.difference !== undefined ? (
                              <span className={fee.difference > 0 ? 'text-rose-600 font-bold' : 'text-emerald-700'}>
                                {fee.difference > 0 ? '+' : ''}Rs. {fee.difference.toLocaleString('en-IN')}
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
                              fee.status === 'within_limit'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : fee.status === 'exceeds_limit'
                                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                                : fee.status === 'potential_discrepancy'
                                ? 'bg-amber-50 text-amber-900 border border-amber-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {lang === 'np'
                                ? fee.status === 'within_limit' ? t.statusWithinLimit
                                : fee.status === 'exceeds_limit' ? t.statusExceedsLimit
                                : fee.status === 'potential_discrepancy' ? t.statusPotentialDiscrepancy
                                : t.statusRecognizedHeading
                                : fee.statusLabel}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-200">
                      <tr>
                        <td colSpan={2} className="py-3.5 px-4 text-slate-900 uppercase text-xs">
                          {t.totalBilled}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-base text-slate-900">
                          Rs. {bill.totalAmount.toLocaleString('en-IN')}
                        </td>
                        <td colSpan={3}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* MONTH-OVER-MONTH COMPARISON */}
              {comparison && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <TrendingUp className="w-5 h-5 text-emerald-700" />
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-wider">
                      {t.historicalMonthAnalysis}
                    </h2>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                          {t.previousMonth} ({formatMonthInLanguage(comparison.previousMonth, lang)})
                        </span>
                        <span className="text-xl font-bold font-mono text-slate-800">
                          Rs. {comparison.previousTotal.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                          {t.currentMonth} ({formattedBillingMonth})
                        </span>
                        <span className="text-xl font-bold font-mono text-slate-900">
                          Rs. {comparison.currentTotal.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className={`p-3.5 rounded-xl border space-y-1 ${
                        comparison.difference > 0
                          ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                          : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      }`}>
                        <span className="text-xs font-bold uppercase tracking-wider block">
                          {t.netDifference}
                        </span>
                        <div className="text-xl font-bold font-mono">
                          {comparison.difference > 0 ? `+Rs. ${comparison.difference.toLocaleString('en-IN')}` : `Rs. ${comparison.difference.toLocaleString('en-IN')}`}
                          <span className="text-xs font-bold ml-1.5">
                            ({comparison.difference > 0 ? `+${comparison.percentageChange.toFixed(1)}%` : `${comparison.percentageChange.toFixed(1)}%`})
                          </span>
                        </div>
                      </div>
                    </div>

                    {comparison.largestIncreases && comparison.largestIncreases.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-200">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                          {t.keyFeeIncreases}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {comparison.largestIncreases.map((inc, i) => (
                            <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                              <span className="font-semibold text-slate-800">{inc.feeTitle}</span>
                              <span className="font-mono font-bold text-amber-700">+Rs. {inc.difference.toLocaleString('en-IN')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Official Disclaimer */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-1">
                <span className="font-bold uppercase tracking-wider text-[11px] text-slate-700 block">
                  {t.reportSourceNotice}
                </span>
                <p className="leading-relaxed">
                  {t.reportNoticeText}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: COMPLAINT EMAIL GENERATOR */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  {t.complaintDraftTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {t.complaintDraftSubtitle}
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{emailSubject}</span>
                  <button
                    onClick={handleCopyEmail}
                    className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? t.copiedToClipboard : t.btnCopyEmail}</span>
                  </button>
                </div>
                <div className="p-5 sm:p-6 bg-white">
                  <pre className="text-xs sm:text-sm font-sans text-slate-800 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[420px] overflow-y-auto font-mono">
                    {emailBody}
                  </pre>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <p className="text-xs text-slate-500">
                  {t.letterFooterNotice}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyEmail}
                    className="px-4 py-2.5 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? t.copiedToClipboard : t.copyEntireLetter}</span>
                  </button>
                  <a
                    href={mailtoLink}
                    className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-500" />
                    <span>{t.openInEmail}</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
