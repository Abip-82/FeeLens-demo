import React from 'react';
import {
  History as HistoryIcon,
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Sparkles,
  ArrowRight,
  FileCheck2,
  Building2,
} from 'lucide-react';
import { Bill } from '../types';
import { Language, TRANSLATIONS, formatMonthInLanguage } from '../utils/translations';
import { deleteBill, getBillsGroupedBySchool, saveBill } from '../utils/storage';
import { DEMO_BILL_1, DEMO_BILL_2, DEMO_BILL_3, DEMO_BILL_3_PREV } from '../data/demoBills';

interface HistoryViewProps {
  bills: Bill[];
  onSelectBill: (bill: Bill) => void;
  onRefreshHistory: () => void;
  onNavigateToCheck: () => void;
  lang: Language;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  bills,
  onSelectBill,
  onRefreshHistory,
  onNavigateToCheck,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteBill(id);
    onRefreshHistory();
  };

  const handleLoadDemoBills = () => {
    saveBill(DEMO_BILL_3);
    saveBill(DEMO_BILL_3_PREV);
    saveBill(DEMO_BILL_2);
    saveBill(DEMO_BILL_1);
    onRefreshHistory();
  };

  const schoolGroups = getBillsGroupedBySchool(bills);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t.historyTitle}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {t.historyDesc}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {bills.length === 0 && (
            <button
              onClick={handleLoadDemoBills}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.btnLoadDemoBills}</span>
            </button>
          )}
          <button
            onClick={onNavigateToCheck}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-colors cursor-pointer shadow-xs"
          >
            <FileCheck2 className="w-4 h-4 text-white" />
            <span>{t.uploadNewBill}</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {bills.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 sm:p-14 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <HistoryIcon className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              {t.noBillsSavedYet}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              {t.noBillsSavedDesc}
            </p>
          </div>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={onNavigateToCheck}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>{t.btnUploadBill}</span>
            </button>
            <button
              onClick={handleLoadDemoBills}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>{t.btnLoadDemoBills}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Bills Grouped by School */
        <div className="space-y-6">
          {schoolGroups.map(group => (
            <div
              key={group.schoolName}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4"
            >
              {/* School Group Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-700" />
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      {group.schoolName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{lang === 'np' ? 'भरतपुर महानगरपालिका' : (group.municipality || 'Bharatpur Metropolitan City')}</span>
                    {group.category && (
                      <>
                        <span>•</span>
                        <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {lang === 'np' ? `वर्ग ${group.category}` : `Category ${group.category}`}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-xs font-semibold text-slate-500 self-start sm:self-auto">
                  {group.bills.length} {group.bills.length === 1 ? t.billRecorded : t.billsRecorded}
                </div>
              </div>

              {/* List of bills under this school */}
              <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden">
                {group.bills.map(bill => {
                  const flaggedCount = bill.extractedFees.filter(f => f.isFlagged).length;
                  const dateStr = bill.dateAnalyzed || new Date(bill.createdAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'ne-NP', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <div
                      key={bill.id}
                      onClick={() => onSelectBill(bill)}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {formatMonthInLanguage(bill.billingMonth, lang)}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            ({t.recordedDate} {dateStr})
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1 font-medium text-slate-700">
                            <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                            {bill.gradeRaw}
                          </span>
                          {bill.studentName && (
                            <>
                              <span>•</span>
                              <span>{bill.studentName}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{bill.extractedFees.length} {t.itemizedFeeLines}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                        <div className="text-left sm:text-right">
                          <div className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                            Rs. {bill.totalAmount.toLocaleString('en-IN')}
                          </div>
                          <div>
                            {flaggedCount > 0 ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700">
                                <AlertTriangle className="w-3 h-3 text-rose-600" />
                                {flaggedCount} {t.statusNeedsAttention}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                {t.statusClean}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={e => handleDelete(e, bill.id)}
                            className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                            title="Delete this bill"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <span className="text-slate-300 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all">
                            <ArrowRight className="w-5 h-5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
