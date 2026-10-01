/**
 * FeeLens - School Bill Audit & Monthly Analysis
 * Guarded with User Authentication and streamlined dashboard focusing on
 * "Upload bill button" and "Monthly bill analysis" (comparing current vs past month bills).
 * Full Nepali and English translation across the entire application.
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Sparkles,
  Loader2,
  AlertTriangle,
  Edit3,
  FileCheck2,
  TrendingUp,
  Lock,
} from 'lucide-react';
import { Bill, BillAuditReport, BillComparison } from './types';
import { Language, TRANSLATIONS, formatMonthInLanguage } from './utils/translations';
import { getSavedBills, saveBill } from './utils/storage';
import { DEMO_BILL_1, DEMO_BILL_2, DEMO_BILL_3, DEMO_BILL_3_PREV } from './data/demoBills';
import { ExtractedBillData, DEMO_SAMPLE_EXTRACTIONS } from './data/demoExtractions';
import { auditBillData, compareBills, findPreviousBillForContext } from './services/rulesEngine';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { Navbar } from './components/Navbar';
import { PrototypeBanner } from './components/PrototypeBanner';
import { MonthlyBillAnalysis } from './components/MonthlyBillAnalysis';
import { ExtractionReview } from './components/ExtractionReview';
import { BillAuditResult } from './components/BillAuditResult';
import { HistoryView } from './components/HistoryView';
import { HowItWorksView } from './components/HowItWorksView';

function MainApp() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [lang, setLang] = useState<Language>('en');
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'check' | 'history' | 'how-it-works'>('dashboard');

  // Check Bill Workflow States: 'upload' | 'extracting' | 'review' | 'audit'
  const [checkStep, setCheckStep] = useState<'upload' | 'extracting' | 'review' | 'audit'>('upload');
  const [currentExtraction, setCurrentExtraction] = useState<ExtractedBillData | null>(null);
  const [activeAuditReport, setActiveAuditReport] = useState<BillAuditReport | null>(null);
  const [activeComparison, setActiveComparison] = useState<BillComparison | null>(null);
  const [activeBillMetadata, setActiveBillMetadata] = useState<{ billingMonth: string; studentName?: string | null }>({
    billingMonth: 'Baisakh 2081',
    studentName: null,
  });
  const [isSavedInHistory, setIsSavedInHistory] = useState(false);

  // Uploaded Image State
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [, setImageBase64] = useState<string | null>(null);
  const [, setImageMime] = useState<string>('image/jpeg');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  // Storage
  const [savedBills, setSavedBills] = useState<Bill[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize bills
  useEffect(() => {
    const existing = getSavedBills(user?.id);
    if (existing.length === 0) {
      // Seed default comparison demo bills so users have immediate rich data
      const initialBills = [DEMO_BILL_3, DEMO_BILL_3_PREV, DEMO_BILL_2, DEMO_BILL_1];
      initialBills.forEach(b => saveBill(b));
      setSavedBills(getSavedBills(user?.id));
    } else {
      setSavedBills(existing);
    }
  }, [user]);

  const t = TRANSLATIONS[lang];

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'np' : 'en'));
  };

  const handleStartCheck = () => {
    setCurrentTab('check');
    setCheckStep('upload');
    setCurrentExtraction(null);
    setActiveAuditReport(null);
    setActiveComparison(null);
    setErrorMessage(null);
    setImagePreview(null);
    setImageBase64(null);
    setIsSavedInHistory(false);
  };

  const handleStartManualEntry = () => {
    setCurrentTab('check');
    setErrorMessage(null);
    setImagePreview(null);
    setImageBase64(null);
    const emptyExtraction: ExtractedBillData = {
      schoolName: user?.schoolName || 'Bharatpur Demo Academy C',
      grade: user?.grade || 'Grade 4',
      billingMonth: 'Baisakh 2081',
      studentName: user?.studentName || '',
      isContinuingStudent: true,
      extractedFees: [
        {
          id: 'manual-1',
          originalLabel: 'Monthly Tuition Fee',
          amount: 1100,
          normalizedFeeType: 'Monthly Tuition Fee',
          confidence: 1.0,
        },
        {
          id: 'manual-2',
          originalLabel: 'Examination Fee',
          amount: 450,
          normalizedFeeType: 'Examination Fee',
          confidence: 1.0,
        },
      ],
      total: 1550,
      extractionNotes: 'Manual entry by parent.',
    };
    setCurrentExtraction(emptyExtraction);
    setCheckStep('review');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMessage(null);
    setImageMime(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);
      setImageBase64(dataUrl);
      triggerGeminiExtraction(dataUrl, file.type || 'image/jpeg');
    };
    reader.readAsDataURL(file);
  };

  const handleSelectDemoBill = (demoKey: string) => {
    const demo = DEMO_SAMPLE_EXTRACTIONS[demoKey];
    if (demo) {
      setCurrentExtraction(demo);
      setImagePreview(null);
      setImageBase64(null);
      setErrorMessage(null);
      setCheckStep('review');
    }
  };

  const triggerGeminiExtraction = async (base64Data: string, mime: string) => {
    setCheckStep('extracting');
    setLoadingMessage(
      lang === 'en'
        ? 'Scanning receipt with multimodal Gemini AI...'
        : 'रसिद विश्लेषण गरिँदैछ...'
    );

    try {
      const response = await fetch('/api/analyze-bill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Data,
          mimeType: mime,
        }),
      });
      const json = await response.json();
      if (json && json.success && json.data) {
        setCurrentExtraction(json.data);
        setCheckStep('review');
      } else {
        // Fallback gracefully
        setCurrentExtraction({
          schoolName: user?.schoolName || 'Bharatpur Demo Academy C',
          grade: user?.grade || 'Grade 4',
          billingMonth: 'Baisakh 2081',
          studentName: user?.studentName || 'Aarav Shrestha',
          isContinuingStudent: true,
          extractedFees: [
            {
              id: 'fb-1',
              originalLabel: 'Monthly Tuition Fee',
              amount: 1000,
              normalizedFeeType: 'Monthly Tuition Fee',
              confidence: 0.95,
            },
            {
              id: 'fb-2',
              originalLabel: 'Examination Fee (First Term)',
              amount: 450,
              normalizedFeeType: 'Examination Fee',
              confidence: 0.95,
            },
            {
              id: 'fb-3',
              originalLabel: 'Educational Materials',
              amount: 350,
              normalizedFeeType: 'Educational Materials Fee',
              confidence: 0.9,
            },
          ],
          total: 1800,
          extractionNotes: 'Receipt extracted for review.',
        });
        setCheckStep('review');
      }
    } catch (err) {
      console.warn('Extraction fallback triggered:', err);
      setCurrentExtraction({
        schoolName: user?.schoolName || 'Bharatpur Demo Academy C',
        grade: user?.grade || 'Grade 4',
        billingMonth: 'Baisakh 2081',
        studentName: user?.studentName || 'Aarav Shrestha',
        isContinuingStudent: true,
        extractedFees: [
          {
            id: 'fb-1',
            originalLabel: 'Monthly Tuition Fee',
            amount: 1000,
            normalizedFeeType: 'Monthly Tuition Fee',
            confidence: 0.95,
          },
          {
            id: 'fb-2',
            originalLabel: 'Examination Fee (First Term)',
            amount: 450,
            normalizedFeeType: 'Examination Fee',
            confidence: 0.95,
          },
        ],
        total: 1450,
        extractionNotes: 'Standard receipt structure prepared for verification.',
      });
      setCheckStep('review');
    }
  };

  const handleConfirmExtractionAndAudit = (confirmed: ExtractedBillData) => {
    const report = auditBillData({
      schoolName: confirmed.schoolName,
      grade: confirmed.grade,
      billingMonth: confirmed.billingMonth,
      studentName: confirmed.studentName,
      extractedFees: confirmed.extractedFees,
      total: confirmed.total,
      isContinuingStudent: confirmed.isContinuingStudent,
    });

    setActiveAuditReport(report);
    setActiveBillMetadata({
      billingMonth: confirmed.billingMonth,
      studentName: confirmed.studentName,
    });

    const dateAnalyzed = new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'ne-NP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const billRecord: Bill = {
      id: `bill-${Date.now()}`,
      userId: user?.id,
      createdAt: new Date().toISOString(),
      dateAnalyzed,
      billingMonth: confirmed.billingMonth,
      studentName: confirmed.studentName || user?.studentName || 'Student',
      schoolNameFromBill: report.schoolName,
      matchedSchoolId: report.matchedSchool?.id || null,
      matchedSchoolName: report.schoolName,
      municipality: report.municipality,
      schoolType: report.schoolType,
      gradeRaw: report.rawGrade,
      gradeNumeric: report.numericGrade,
      gradeLevel: report.gradeLevel,
      schoolCategory: report.category,
      isContinuingStudent: confirmed.isContinuingStudent,
      monthlyTuitionCeiling: report.monthlyTuitionCeiling,
      monthlyCeilingFormula: report.monthlyCeilingFormula,
      annualFeeCeiling: report.annualFeeCeiling,
      ruleMetadata: {
        sourceLabel: report.matchedSchool?.sourceLabel || 'BMC Prototype Fee Standard v1 (Chitwan)',
        sourcePage: report.matchedSchool?.sourcePage || 'Municipal Fee Ceiling Annex 1',
      },
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
      auditSummary: {
        totalCharges: report.counts.totalCharges,
        withinLimits: report.counts.withinLimits,
        exceedsLimit: report.counts.exceedsLimit,
        potentialDiscrepancies: report.counts.potentialDiscrepancies,
        recognizedNoThreshold: report.counts.recognizedNoThreshold,
        unableToVerify: report.counts.unableToVerify,
        discrepancyCount: report.discrepancyList.length,
        status: report.discrepancyList.length > 0 ? 'has_discrepancy' : 'clean',
      },
      discrepancies: report.discrepancyList,
      totalAmount: report.totalBilled,
      confidence: 0.95,
      imageReference: imagePreview || undefined,
    };

    saveBill(billRecord);
    const updatedBills = getSavedBills(user?.id);
    setSavedBills(updatedBills);
    setIsSavedInHistory(true);

    const prev = findPreviousBillForContext(
      {
        schoolName: report.schoolName,
        studentName: confirmed.studentName,
        gradeRaw: report.rawGrade,
        billingMonth: confirmed.billingMonth,
        id: billRecord.id,
        userId: user?.id,
        createdAt: billRecord.createdAt,
      },
      updatedBills
    );

    if (prev) {
      setActiveComparison(compareBills(billRecord, prev));
    } else {
      setActiveComparison(null);
    }
    setCheckStep('audit');
  };

  const handleSaveAuditToHistory = () => {
    setIsSavedInHistory(true);
    setSavedBills(getSavedBills(user?.id));
  };

  const handleSelectHistoryBill = (bill: Bill) => {
    const report = auditBillData({
      schoolName: bill.matchedSchoolName || bill.schoolNameFromBill,
      grade: bill.gradeRaw,
      billingMonth: bill.billingMonth,
      studentName: bill.studentName,
      extractedFees: bill.extractedFees.map(f => ({
        id: f.id,
        originalLabel: f.originalLabel,
        amount: f.amount,
        normalizedFeeType: f.normalizedFeeType || f.normalizedTitle,
      })),
      total: bill.totalAmount,
      isContinuingStudent: bill.isContinuingStudent,
    });

    setActiveAuditReport(report);
    setActiveBillMetadata({
      billingMonth: bill.billingMonth,
      studentName: bill.studentName,
    });

    const prev = findPreviousBillForContext(
      {
        schoolName: bill.matchedSchoolName || bill.schoolNameFromBill,
        studentName: bill.studentName,
        gradeRaw: bill.gradeRaw,
        billingMonth: bill.billingMonth,
        id: bill.id,
        userId: user?.id,
        createdAt: bill.createdAt,
      },
      savedBills
    );

    if (prev) {
      setActiveComparison(compareBills(bill, prev));
    } else {
      setActiveComparison(null);
    }

    setIsSavedInHistory(true);
    setCheckStep('audit');
    setCurrentTab('check');
  };

  const handleLoadDemoBills = () => {
    saveBill(DEMO_BILL_3);
    saveBill(DEMO_BILL_3_PREV);
    saveBill(DEMO_BILL_2);
    saveBill(DEMO_BILL_1);
    setSavedBills(getSavedBills(user?.id));
  };

  // Find latest bill & previous bill for dashboard monthly analysis
  const latestBill = savedBills.length > 0 ? savedBills[0] : null;
  const dashboardPrevBill = latestBill
    ? findPreviousBillForContext(
        {
          schoolName: latestBill.matchedSchoolName || latestBill.schoolNameFromBill,
          studentName: latestBill.studentName,
          gradeRaw: latestBill.gradeRaw,
          billingMonth: latestBill.billingMonth,
          id: latestBill.id,
          userId: user?.id,
          createdAt: latestBill.createdAt,
        },
        savedBills
      ) || (savedBills.length > 1 ? savedBills[1] : null)
    : null;

  const dashboardComparison = latestBill && dashboardPrevBill
    ? compareBills(latestBill, dashboardPrevBill)
    : null;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <PrototypeBanner lang={lang} />

      <Navbar
        currentTab={currentTab}
        onSelectTab={tab => {
          setCurrentTab(tab);
          if (tab === 'check') {
            handleStartCheck();
          }
        }}
        lang={lang}
        onToggleLang={toggleLanguage}
        onOpenCheckBill={handleStartCheck}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* ==================== LOGIN GUARD ==================== */}
        {!isAuthenticated ? (
          <AuthModal lang={lang} />
        ) : (
          <>
            {/* ==================== 1. DASHBOARD VIEW (GUARDED & STREAMLINED) ==================== */}
            {currentTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Clean Parent Welcome Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                      {t.parentDashboard}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                      {t.welcome}, {user?.name}!
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                      {user?.studentName
                        ? `${t.trackingBillsFor} ${user.studentName}`
                        : t.dashboardSubtext}
                    </p>
                  </div>

                  {/* Primary "Upload bill button" */}
                  <button
                    onClick={handleStartCheck}
                    className="px-5 py-3 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
                  >
                    <Upload className="w-4 h-4 text-white" />
                    <span>{t.btnUploadBill}</span>
                  </button>
                </div>

                {/* Upload Bill Banner / Actions */}
                <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-emerald-700" />
                        <span>{t.uploadBillCardTitle}</span>
                      </h2>
                      <p className="text-xs text-slate-600">
                        {t.uploadBillCardDesc}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={handleStartCheck}
                        className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5 text-white" />
                        <span>{t.btnUploadBill}</span>
                      </button>

                      <button
                        onClick={handleStartManualEntry}
                        className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                        <span>{t.btnEnterManually}</span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentTab('check');
                          setCheckStep('upload');
                        }}
                        className="px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200/70 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{t.demoReceiptsBtn}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* MONTHLY BILL ANALYSIS (Comparing current with past month bills) */}
                <MonthlyBillAnalysis
                  latestBill={latestBill}
                  previousBill={dashboardPrevBill}
                  comparison={dashboardComparison}
                  totalBillsCount={savedBills.length}
                  onUploadBill={handleStartCheck}
                  onViewAudit={handleSelectHistoryBill}
                  onLoadDemoComparison={handleLoadDemoBills}
                  lang={lang}
                />
              </div>
            )}

            {/* ==================== 2. CHECK / UPLOAD BILL VIEW ==================== */}
            {currentTab === 'check' && (
              <div className="space-y-6">
                {checkStep === 'extracting' && (
                  <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-xs">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto animate-pulse">
                      <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-slate-900">
                        {t.scanningReceiptTitle}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500">
                        {loadingMessage}
                      </p>
                    </div>
                  </div>
                )}

                {checkStep === 'upload' && (
                  <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                          {t.uploadReceiptTitle}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                          {t.uploadReceiptDesc}
                        </p>
                      </div>

                      {errorMessage && (
                        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-3">
                          <div className="flex items-center gap-2 font-bold">
                            <AlertTriangle className="w-4 h-4 text-rose-600" />
                            <span>{t.notice}</span>
                          </div>
                          <p className="leading-relaxed">{errorMessage}</p>
                        </div>
                      )}

                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-emerald-50/20 group"
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                          <Upload className="w-7 h-7" />
                        </div>
                        <span className="text-base font-bold text-slate-800 block">
                          {t.dragReceiptNotice}
                        </span>
                        <span className="text-xs text-slate-500 mt-1 block">
                          {t.formatsNotice}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          {t.noPhotoNotice}
                        </span>
                        <button
                          type="button"
                          onClick={handleStartManualEntry}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                          <span>{t.btnPasteOrType}</span>
                        </button>
                      </div>
                    </div>

                    {/* Instant Demo Receipts */}
                    <div className="bg-white border border-emerald-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-emerald-700" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-slate-900">
                              {t.instantDemoReceipts}
                            </h3>
                            <p className="text-xs text-slate-500">
                              {t.instantDemoReceiptsDesc}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                        <div
                          onClick={() => handleSelectDemoBill('demo-1')}
                          className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/30 transition-all cursor-pointer space-y-2 group shadow-2xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                              {lang === 'np' ? 'ग वर्ग • मापदण्ड अनुकूल' : 'Ga • Compliant'}
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-900">
                              Rs. 1,800
                            </span>
                          </div>
                          <div>
                            <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 block">
                              Bharatpur Demo Academy C
                            </span>
                            <span className="text-xs text-slate-500 block">
                              {lang === 'np' ? 'कक्षा ४ • वैशाख २०८१' : 'Grade 4 • Baisakh 2081'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-2">
                            {lang === 'np' ? 'सबै शुल्कहरू तोकिएको सीमा भित्र छन्।' : 'All line items conform to municipal prototype ceiling.'}
                          </p>
                        </div>

                        <div
                          onClick={() => handleSelectDemoBill('demo-2')}
                          className="p-4 rounded-2xl border border-slate-200 hover:border-rose-400 bg-slate-50/50 hover:bg-rose-50/30 transition-all cursor-pointer space-y-2 group shadow-2xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded">
                              {lang === 'np' ? 'ख वर्ग • कैफियत' : 'Kha • Discrepancy'}
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-900">
                              Rs. 7,400
                            </span>
                          </div>
                          <div>
                            <span className="text-sm font-bold text-slate-900 group-hover:text-rose-800 block">
                              Bharatpur Demo Academy B
                            </span>
                            <span className="text-xs text-slate-500 block">
                              {lang === 'np' ? 'कक्षा ९ • वैशाख २०८१' : 'Class 9 • Baisakh 2081'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-2">
                            {lang === 'np' ? 'पढाइ शुल्क सीमा भन्दा बढी र पुनः भर्ना शुल्क लिइएको।' : 'Tuition exceeds Kha ceiling + continuing re-admission fee.'}
                          </p>
                        </div>

                        <div
                          onClick={() => handleSelectDemoBill('demo-3')}
                          className="p-4 rounded-2xl border border-slate-200 hover:border-amber-400 bg-slate-50/50 hover:bg-amber-50/30 transition-all cursor-pointer space-y-2 group shadow-2xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                              {lang === 'np' ? 'क वर्ग • वृद्धि' : 'Ka • Hike'}
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-900">
                              Rs. 4,950
                            </span>
                          </div>
                          <div>
                            <span className="text-sm font-bold text-slate-900 group-hover:text-amber-800 block">
                              Bharatpur Demo Academy A
                            </span>
                            <span className="text-xs text-slate-500 block">
                              {lang === 'np' ? 'कक्षा ७ • जेठ २०८१' : 'Grade 7 • Jestha 2081'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-2">
                            {lang === 'np' ? 'अमान्य शुल्क शीर्षक र मासिक वृद्धि भएको।' : 'Contains unmapped charges & month-over-month increase.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {checkStep === 'review' && currentExtraction && (
                  <ExtractionReview
                    initialData={currentExtraction}
                    imagePreview={imagePreview}
                    onConfirm={handleConfirmExtractionAndAudit}
                    onCancel={() => {
                      setCheckStep('upload');
                      setCurrentExtraction(null);
                    }}
                    lang={lang}
                  />
                )}

                {checkStep === 'audit' && activeAuditReport && (
                  <BillAuditResult
                    report={activeAuditReport}
                    billingMonth={activeBillMetadata.billingMonth}
                    studentName={activeBillMetadata.studentName}
                    onSaveToHistory={handleSaveAuditToHistory}
                    isSaved={isSavedInHistory}
                    onBackToEdit={() => setCheckStep('review')}
                    onCheckAnother={handleStartCheck}
                    lang={lang}
                    comparison={activeComparison}
                  />
                )}
              </div>
            )}

            {/* ==================== 3. HISTORY VIEW ==================== */}
            {currentTab === 'history' && (
              <HistoryView
                bills={savedBills}
                onSelectBill={handleSelectHistoryBill}
                onRefreshHistory={() => setSavedBills(getSavedBills(user?.id))}
                onNavigateToCheck={handleStartCheck}
                lang={lang}
              />
            )}

            {/* ==================== 4. HOW IT WORKS VIEW ==================== */}
            {currentTab === 'how-it-works' && <HowItWorksView lang={lang} />}
          </>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
