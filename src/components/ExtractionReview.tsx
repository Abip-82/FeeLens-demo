import React, { useState } from 'react';
import {
  FileCheck2,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Building,
  GraduationCap,
  Calendar,
} from 'lucide-react';
import { ExtractedBillData } from '../data/demoExtractions';
import { DEMO_SCHOOLS } from '../data/schools';
import { Language, TRANSLATIONS } from '../utils/translations';
import { normalizeFeeLabel } from '../utils/feeNormalization';

interface ExtractionReviewProps {
  initialData: ExtractedBillData;
  imagePreview?: string | null;
  onConfirm: (confirmedData: ExtractedBillData) => void;
  onCancel: () => void;
  lang: Language;
}

export const ExtractionReview: React.FC<ExtractionReviewProps> = ({
  initialData,
  imagePreview,
  onConfirm,
  onCancel,
  lang,
}) => {
  const [schoolName, setSchoolName] = useState(initialData.schoolName || 'Bharatpur Demo Academy C');
  const [grade, setGrade] = useState(initialData.grade || 'Grade 4');
  const [billingMonth, setBillingMonth] = useState(initialData.billingMonth || 'Baisakh 2081');
  const [studentName, setStudentName] = useState(initialData.studentName || '');
  const [fees, setFees] = useState(
    initialData.extractedFees.map(f => ({ ...f }))
  );
  const [isContinuingStudent, setIsContinuingStudent] = useState(
    initialData.isContinuingStudent !== undefined ? initialData.isContinuingStudent : true
  );

  const t = TRANSLATIONS[lang];
  const computedTotal = fees.reduce((sum, f) => sum + (Number(f.amount) || 0), 0);

  const handleFeeChange = (id: string, field: 'originalLabel' | 'amount' | 'normalizedFeeType', value: any) => {
    setFees(prev =>
      prev.map(f => {
        if (f.id !== id) return f;
        if (field === 'originalLabel') {
          const norm = normalizeFeeLabel(value);
          return {
            ...f,
            originalLabel: value,
            normalizedFeeType: norm.normalizedFeeType,
            confidence: norm.confidence,
          };
        }
        return { ...f, [field]: value };
      })
    );
  };

  const handleAddFee = () => {
    const newId = `fee-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setFees(prev => [
      ...prev,
      {
        id: newId,
        originalLabel: '',
        amount: 0,
        normalizedFeeType: 'Needs review',
        confidence: 0.5,
      },
    ]);
  };

  const handleRemoveFee = (id: string) => {
    setFees(prev => prev.filter(f => f.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const confirmed: ExtractedBillData = {
      schoolName: schoolName.trim() || 'Bharatpur Demo Academy C',
      grade: grade.trim() || 'Grade 4',
      billingMonth: billingMonth.trim() || 'Baisakh 2081',
      studentName: studentName.trim() || null,
      isContinuingStudent,
      extractedFees: fees
        .filter(f => f.originalLabel.trim() && f.amount >= 0)
        .map(f => ({
          ...f,
          amount: Number(f.amount) || 0,
        })),
      total: computedTotal,
      extractionNotes: initialData.extractionNotes || 'Confirmed by parent.',
      imageThumbnail: imagePreview || undefined,
    };
    onConfirm(confirmed);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t.extractionComplete}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          {t.reviewExtractedTitle}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          {t.reviewExtractedDesc}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
          {/* School Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.school}</span>
            </label>
            <input
              type="text"
              list="school-options"
              value={schoolName}
              onChange={e => setSchoolName(e.target.value)}
              placeholder="e.g. Bharatpur Demo Academy C"
              required
              className="w-full text-xs font-semibold p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <datalist id="school-options">
              {DEMO_SCHOOLS.map(s => (
                <option key={s.id} value={s.name} />
              ))}
            </datalist>
          </div>

          {/* Grade / Class */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.grade}</span>
            </label>
            <select
              value={grade}
              onChange={e => setGrade(e.target.value)}
              className="w-full text-xs font-semibold p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Grade 1">{lang === 'np' ? 'कक्षा १ (प्राथमिक तह)' : 'Grade 1 (Primary)'}</option>
              <option value="Grade 2">{lang === 'np' ? 'कक्षा २ (प्राथमिक तह)' : 'Grade 2 (Primary)'}</option>
              <option value="Grade 3">{lang === 'np' ? 'कक्षा ३ (प्राथमिक तह)' : 'Grade 3 (Primary)'}</option>
              <option value="Grade 4">{lang === 'np' ? 'कक्षा ४ (प्राथमिक तह)' : 'Grade 4 (Primary)'}</option>
              <option value="Grade 5">{lang === 'np' ? 'कक्षा ५ (प्राथमिक तह)' : 'Grade 5 (Primary)'}</option>
              <option value="Grade 6">{lang === 'np' ? 'कक्षा ६ (निम्न माध्यमिक तह)' : 'Grade 6 (Lower Sec)'}</option>
              <option value="Grade 7">{lang === 'np' ? 'कक्षा ७ (निम्न माध्यमिक तह)' : 'Grade 7 (Lower Sec)'}</option>
              <option value="Grade 8">{lang === 'np' ? 'कक्षा ८ (निम्न माध्यमिक तह)' : 'Grade 8 (Lower Sec)'}</option>
              <option value="Grade 9">{lang === 'np' ? 'कक्षा ९ (माध्यमिक तह)' : 'Grade 9 (Secondary)'}</option>
              <option value="Grade 10">{lang === 'np' ? 'कक्षा १० (माध्यमिक तह)' : 'Grade 10 (Secondary)'}</option>
            </select>
          </div>

          {/* Month */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.billingMonth}</span>
            </label>
            <input
              type="text"
              value={billingMonth}
              onChange={e => setBillingMonth(e.target.value)}
              placeholder="e.g. Baisakh 2081"
              required
              className="w-full text-xs font-semibold p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Student Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              <span>{t.lblStudentNameOptional}</span>
            </label>
            <input
              type="text"
              value={studentName}
              onChange={e => setStudentName(e.target.value)}
              placeholder="e.g. Aarav Shrestha"
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Continuing student checkbox */}
          <div className="sm:col-span-2 flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="continuing-student"
              checked={isContinuingStudent}
              onChange={e => setIsContinuingStudent(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-500 border-slate-300"
            />
            <label htmlFor="continuing-student" className="text-xs font-medium text-slate-700 cursor-pointer">
              {t.continuingStudentCheckbox}
            </label>
          </div>
        </div>

        {/* Fee Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                {t.extractedFeeLineItems}
              </h3>
            </div>
            <button
              type="button"
              onClick={handleAddFee}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.btnAddItem}</span>
            </button>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
            {fees.map((fee, idx) => (
              <div
                key={fee.id}
                className="p-4 bg-white hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {lang === 'en' ? `Item ${idx + 1}: ${t.invoiceLabelPrinted}` : `शीर्षक ${idx + 1}: ${t.invoiceLabelPrinted}`}
                  </label>
                  <input
                    type="text"
                    value={fee.originalLabel}
                    onChange={e => handleFeeChange(fee.id, 'originalLabel', e.target.value)}
                    placeholder="e.g. Monthly Tuition Fee"
                    required
                    className="w-full font-semibold text-slate-900 p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>

                <div className="w-full md:w-64 space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {t.recognizedCategory}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium block truncate flex-1 ${
                        fee.normalizedFeeType === 'Needs review'
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      }`}
                      title={fee.normalizedFeeType}
                    >
                      {fee.normalizedFeeType === 'Needs review' && lang === 'np' ? 'रुजु गर्नुपर्ने' : fee.normalizedFeeType}
                    </span>
                  </div>
                </div>

                <div className="w-full md:w-36 space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {t.amountRs}
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-slate-400 font-mono text-xs">
                      Rs.
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={fee.amount === 0 ? '' : fee.amount}
                      onChange={e => handleFeeChange(fee.id, 'amount', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      required
                      className="w-full pl-9 pr-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                  </div>
                </div>

                <div className="self-end md:self-center pt-2 md:pt-4">
                  {fees.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFee(fee.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove fee line"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="p-4 bg-slate-50 flex items-center justify-between border-t-2 border-slate-200">
              <span className="font-bold text-slate-800 text-xs sm:text-sm uppercase tracking-wider">
                {t.totalBillAmount}
              </span>
              <span className="text-lg sm:text-xl font-extrabold font-mono text-slate-900 tabular-nums">
                Rs. {computedTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
          >
            {t.btnReupload}
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>{t.btnAuditAndCheck}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
