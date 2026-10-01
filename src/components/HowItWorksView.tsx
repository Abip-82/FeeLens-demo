import React from 'react';
import {
  HelpCircle,
  Calculator,
  BookOpen,
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';
import { RECOGNIZED_FEE_HEADINGS } from '../data/feeRules';

interface HowItWorksViewProps {
  lang: Language;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-emerald-700" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {t.howItWorksTitle}
          </h2>
        </div>
        <p className="text-sm text-slate-600 mt-1">
          {t.howItWorksDesc}
        </p>
      </div>

      {/* 4-Step Explanation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold mb-3 border border-emerald-200 text-sm">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {t.step1Title}
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {t.step1Desc}
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold mb-3 border border-emerald-200 text-sm">
              2
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {t.step2Title}
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {t.step2Desc}
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold mb-3 border border-emerald-200 text-sm">
              3
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {t.step3Title}
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {t.step3Desc}
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold mb-3 border border-emerald-200 text-sm">
              4
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {t.step4Title}
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {t.step4Desc}
            </p>
          </div>
        </div>
      </div>

      {/* Baseline Ceilings */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-700" />
          <h3 className="text-base font-bold text-slate-900">
            {t.baselineTuitionTitle}
          </h3>
        </div>
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 text-left">{t.tableGradeClassification}</th>
                <th className="py-2.5 px-3 text-left">{t.tableGradesCovered}</th>
                <th className="py-2.5 px-3 text-right">{t.tableGaBaseline}</th>
                <th className="py-2.5 px-3 text-right">{t.tableKa}</th>
                <th className="py-2.5 px-3 text-right">{t.tableKha}</th>
                <th className="py-2.5 px-3 text-right">{t.tableGha}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-900 font-sans">{t.primary}</td>
                <td className="py-2.5 px-3 text-slate-600 font-sans">{lang === 'np' ? 'कक्षा १ - ५' : 'Grades 1 - 5'}</td>
                <td className="py-2.5 px-3 text-right font-bold text-slate-900">Rs. 1,100</td>
                <td className="py-2.5 px-3 text-right text-emerald-700">Rs. 1,650</td>
                <td className="py-2.5 px-3 text-right text-emerald-700">Rs. 1,375</td>
                <td className="py-2.5 px-3 text-right text-emerald-700">Rs. 825</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-900 font-sans">{t.lowerSecondary}</td>
                <td className="py-2.5 px-3 text-slate-600 font-sans">{lang === 'np' ? 'कक्षा ६ - ८' : 'Grades 6 - 8'}</td>
                <td className="py-2.5 px-3 text-right font-bold text-slate-900">Rs. 1,250</td>
                <td className="py-2.5 px-3 text-right text-emerald-700">Rs. 1,875</td>
                <td className="py-2.5 px-3 text-right text-emerald-700">Rs. 1,562.50</td>
                <td className="py-2.5 px-3 text-right text-emerald-700">Rs. 937.50</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-900 font-sans">{t.secondary}</td>
                <td className="py-2.5 px-3 text-slate-600 font-sans">{lang === 'np' ? 'कक्षा ९ - १०' : 'Grades 9 - 10'}</td>
                <td className="py-2.5 px-3 text-right font-bold text-slate-900">Rs. 1,700</td>
                <td className="py-2.5 px-3 text-right text-emerald-700">Rs. 2,550</td>
                <td className="py-2.5 px-3 text-right text-emerald-700">Rs. 2,125</td>
                <td className="py-2.5 px-3 text-right text-emerald-700">Rs. 1,275</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 14 Recognized Categories */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-700" />
          <h3 className="text-base font-bold text-slate-900">
            {t.fourteenCategoriesTitle}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {RECOGNIZED_FEE_HEADINGS.map((h, i) => (
            <div key={h.type} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">
                  {i + 1}. {lang === 'np' ? h.nameNp : h.nameEn}
                </span>
                {h.hasNumericCeiling ? (
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {t.ceilingConfigured}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {t.noNumericCap}
                  </span>
                )}
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {lang === 'np' ? h.generalMeaningNp : h.generalMeaningEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
