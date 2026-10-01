/**
 * Short Audit Summary & Spoken Nepali Voice Feature
 * Provides a crisp, high-level summary at the end of each bill audit:
 * - Flags discrepancies
 * - Calculates extra fee charged over allowable ceiling
 * - Compares % fee increase / decrease from previous month
 * - Includes a Voice Feature to read the summary aloud in Nepali language.
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  Radio,
} from 'lucide-react';
import { BillAuditReport, BillComparison } from '../types';
import { Language, formatMonthInLanguage } from '../utils/translations';

interface AudioAuditSummaryProps {
  report: BillAuditReport;
  billingMonth: string;
  comparison?: BillComparison | null;
  lang: Language;
}

export const AudioAuditSummary: React.FC<AudioAuditSummaryProps> = ({
  report,
  billingMonth,
  comparison,
  lang,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Calculate Summary Metrics
  const flaggedFees = report.auditedFees.filter(
    f => f.status === 'exceeds_limit' || f.status === 'potential_discrepancy'
  );

  const discrepancyCount = flaggedFees.length;

  const totalExtraCharged = flaggedFees.reduce((sum, f) => {
    if (f.difference && f.difference > 0) return sum + f.difference;
    if (f.status === 'potential_discrepancy') return sum + f.amount;
    return sum;
  }, 0);

  const hasComparison = Boolean(comparison);
  const percentageChange = comparison ? comparison.percentageChange : 0;
  const isIncrease = percentageChange > 0;
  const isDecrease = percentageChange < 0;

  // Format Nepali script specifically optimized for natural text-to-speech pronunciation
  const formattedMonthNp = formatMonthInLanguage(billingMonth, 'np');
  const extraAmountNpStr = totalExtraCharged > 0 ? `${totalExtraCharged.toLocaleString('ne-NP')}` : 'शून्य';
  const percentNpStr = Math.abs(percentageChange).toFixed(1);

  // 1. Spoken Nepali script for Text-to-Speech audio
  let spokenNepaliScript = '';
  if (discrepancyCount > 0) {
    spokenNepaliScript = `अडिट सारांश। ${formattedMonthNp} महिनाको बिलमा ${discrepancyCount} वटा शीर्षकमा कैफियत देखिएको छ। नियम भन्दा कुल रु. ${extraAmountNpStr} बढी शुल्क लिइएको छ।`;
  } else {
    spokenNepaliScript = `अडिट सारांश। ${formattedMonthNp} महिनाको बिलमा सबै शुल्क मापदण्ड भित्र छन्। कुनै बढी शुल्क फेला परेन।`;
  }

  if (hasComparison && comparison) {
    const prevMonthNp = formatMonthInLanguage(comparison.previousMonth, 'np');
    if (isIncrease) {
      spokenNepaliScript += ` अघिल्लो महिना ${prevMonthNp} भन्दा शुल्क ${percentNpStr} प्रतिशतले बढेको छ।`;
    } else if (isDecrease) {
      spokenNepaliScript += ` अघिल्लो महिना ${prevMonthNp} भन्दा शुल्क ${percentNpStr} प्रतिशतले घटेको छ।`;
    } else {
      spokenNepaliScript += ` अघिल्लो महिनासँग तुलना गर्दा शुल्कमा कुनै परिवर्तन छैन।`;
    }
  } else {
    spokenNepaliScript += ` यो पहिलो महिनाको बिल भएकाले अघिल्लो महिनाको तुलना उपलब्ध छैन।`;
  }

  // 2. Concise displayed Nepali Text
  const nepaliSummaryText = discrepancyCount > 0
    ? `अडिट सारांश: यो बिलमा ${discrepancyCount} वटा शीर्षकमा कैफियत फेला पर्यो। नियम विपरीत कुल रु. ${totalExtraCharged.toLocaleString('en-IN')} बढी शुल्क लिइएको छ। ${
        hasComparison
          ? isIncrease
            ? `अघिल्लो महिना भन्दा शुल्क ${Math.abs(percentageChange).toFixed(1)}% ले बढेको छ।`
            : isDecrease
            ? `अघिल्लो महिना भन्दा शुल्क ${Math.abs(percentageChange).toFixed(1)}% ले घटेको छ।`
            : 'अघिल्लो महिनासँग शुल्क बराबर रहेको छ।'
          : 'यो पहिलो महिनाको बिल हो।'
      }`
    : `अडिट सारांश: सबै शीर्षकहरू मापदण्ड भित्र छन् (रु. ० बढी शुल्क)। ${
        hasComparison
          ? isIncrease
            ? `अघिल्लो महिना भन्दा शुल्क ${Math.abs(percentageChange).toFixed(1)}% ले बढेको छ।`
            : isDecrease
            ? `अघिल्लो महिना भन्दा शुल्क ${Math.abs(percentageChange).toFixed(1)}% ले घटेको छ।`
            : 'अघिल्लो महिनासँग शुल्क बराबर रहेको छ।'
          : 'यो पहिलो महिनाको बिल हो।'
      }`;

  // 3. Concise displayed English Text
  const englishSummaryText = discrepancyCount > 0
    ? `Audit Summary: ${discrepancyCount} discrepancy item(s) flagged. Rs. ${totalExtraCharged.toLocaleString('en-IN')} total excess fee charged over ceiling. ${
        hasComparison
          ? isIncrease
            ? `Monthly fee increased by +${Math.abs(percentageChange).toFixed(1)}% from last month.`
            : isDecrease
            ? `Monthly fee decreased by -${Math.abs(percentageChange).toFixed(1)}% from last month.`
            : 'Monthly fee unchanged from last month.'
          : 'First month on record.'
      }`
    : `Audit Summary: All charges are within allowable municipal limits (Rs. 0 excess). ${
        hasComparison
          ? isIncrease
            ? `Monthly fee shifted by +${Math.abs(percentageChange).toFixed(1)}% from last month.`
            : isDecrease
            ? `Monthly fee decreased by -${Math.abs(percentageChange).toFixed(1)}% from last month.`
            : 'Monthly fee unchanged from last month.'
          : 'First month on record.'
      }`;

  // Check speech synthesis support on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setHasSpeechSupport(true);
    } else {
      setHasSpeechSupport(false);
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlayVoice = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(spokenNepaliScript);
    utteranceRef.current = utterance;

    // Pick best matching Nepali or Hindi fallback voice
    const voices = window.speechSynthesis.getVoices();
    const nepaliVoice = voices.find(v => v.lang.startsWith('ne') || v.lang.includes('NP'));
    const hindiVoice = voices.find(v => v.lang.startsWith('hi') || v.lang.includes('IN'));

    if (nepaliVoice) {
      utterance.voice = nepaliVoice;
      utterance.lang = 'ne-NP';
    } else if (hindiVoice) {
      utterance.voice = hindiVoice;
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'ne-NP';
    }

    utterance.rate = playbackSpeed;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePauseVoice = () => {
    if ('speechSynthesis' in window && isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStopVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const handleChangeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setTimeout(() => {
        handlePlayVoice();
      }, 50);
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-emerald-900 text-white border border-emerald-800 shadow-md space-y-5">
      {/* Top Header with Voice Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-800 text-emerald-300 flex items-center justify-center font-bold shadow-inner">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {lang === 'np' ? 'छोटो अडिट सारांश र स्वर' : 'Quick Audit Summary & Nepali Voice'}
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-800/90 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-700">
                {lang === 'np' ? 'नेपाली स्वर' : 'Nepali Audio'}
              </span>
            </div>
            <p className="text-xs text-emerald-300">
              {lang === 'np'
                ? 'कैफियत, बढी लिइएको रकम, र अघिल्लो महिनासँग शुल्क घटबढ प्रतिशत'
                : 'Discrepancies, extra fee charged, and month-over-month shift'}
            </p>
          </div>
        </div>

        {/* Voice Play / Pause / Controls */}
        {hasSpeechSupport && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {!isPlaying ? (
              <button
                type="button"
                onClick={handlePlayVoice}
                className="px-4 py-2 text-xs font-bold text-emerald-950 bg-emerald-300 hover:bg-emerald-200 rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-2 hover:scale-[1.02]"
              >
                <Volume2 className="w-4 h-4 text-emerald-900" />
                <span>{isPaused ? (lang === 'np' ? 'पुनः सुन्नुहोस्' : 'Resume Voice') : (lang === 'np' ? 'नेपालीमा सुन्नुहोस्' : 'Listen in Nepali')}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePauseVoice}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 border border-emerald-700"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>{lang === 'np' ? 'रोक्नुहोस्' : 'Pause'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleStopVoice}
                  className="p-2 text-emerald-300 hover:text-white hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer border border-emerald-700"
                  title="Stop Audio"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Speed Selector */}
            <div className="hidden sm:flex items-center gap-1 bg-emerald-950/80 px-2 py-1 rounded-xl border border-emerald-800 text-[11px] font-mono">
              {[0.9, 1.0, 1.2].map(speed => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => handleChangeSpeed(speed)}
                  className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                    playbackSpeed === speed
                      ? 'bg-emerald-700 text-white font-bold'
                      : 'text-emerald-400 hover:text-emerald-200'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3 Key Quick Metric Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Metric 1: Discrepancy Count */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-800/80 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
            {lang === 'np' ? '१. फेला परेका कैफियत' : '1. Discrepancies Flagged'}
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-extrabold font-mono tabular-nums ${discrepancyCount > 0 ? 'text-rose-400' : 'text-emerald-300'}`}>
              {discrepancyCount}
            </span>
            <span className="text-xs text-emerald-200">
              {discrepancyCount > 0
                ? (lang === 'np' ? 'वटा शीर्षकमा समस्या' : 'item(s) require review')
                : (lang === 'np' ? 'सबै मापदण्ड भित्र' : 'all within limits')}
            </span>
          </div>
        </div>

        {/* Metric 2: Extra Fee Charged */}
        <div className={`p-3.5 rounded-2xl border space-y-1 ${
          totalExtraCharged > 0
            ? 'bg-rose-950/50 border-rose-800/80 text-rose-200'
            : 'bg-emerald-950/70 border-emerald-800/80 text-emerald-200'
        }`}>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
            {lang === 'np' ? '२. बढी लिइएको रकम' : '2. Extra Fee Charged'}
          </span>
          <div className="text-2xl font-extrabold font-mono tabular-nums">
            {totalExtraCharged > 0 ? `+Rs. ${totalExtraCharged.toLocaleString('en-IN')}` : 'Rs. 0'}
          </div>
          <span className="text-[11px] text-emerald-300/80 block">
            {totalExtraCharged > 0
              ? (lang === 'np' ? 'तोकिएको सीमा भन्दा बढी' : 'exceeds municipal ceiling')
              : (lang === 'np' ? 'कुनै अतिरिक्त शुल्क छैन' : 'no overcharge detected')}
          </span>
        </div>

        {/* Metric 3: Month-over-Month Shift % */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-800/80 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
            {lang === 'np' ? '३. अघिल्लो महिना अन्तर (%)' : '3. Month Shift (%)'}
          </span>
          <div className="flex items-center gap-1.5">
            {hasComparison ? (
              <>
                {isIncrease && <TrendingUp className="w-5 h-5 text-amber-400" />}
                {isDecrease && <TrendingDown className="w-5 h-5 text-emerald-400" />}
                {!isIncrease && !isDecrease && <Minus className="w-4 h-4 text-emerald-400" />}
                <span className={`text-2xl font-extrabold font-mono tabular-nums ${isIncrease ? 'text-amber-300' : isDecrease ? 'text-emerald-300' : 'text-emerald-200'}`}>
                  {isIncrease ? `+${percentageChange.toFixed(1)}%` : `${percentageChange.toFixed(1)}%`}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold font-mono text-emerald-300">
                {lang === 'np' ? 'एकल महिना' : 'Baseline'}
              </span>
            )}
          </div>
          <span className="text-[11px] text-emerald-300/80 block">
            {hasComparison
              ? isIncrease
                ? (lang === 'np' ? 'अघिल्लो महिना भन्दा वृद्धि' : 'increase vs past month')
                : isDecrease
                ? (lang === 'np' ? 'अघिल्लो महिना भन्दा घटेको' : 'decrease vs past month')
                : (lang === 'np' ? 'कुनै परिवर्तन छैन' : 'unchanged vs past month')
              : (lang === 'np' ? 'अघिल्लो महिनाको रेकर्ड छैन' : 'no previous record')}
          </span>
        </div>
      </div>

      {/* Spoken Audio Equalizer Animation (When Playing) */}
      {isPlaying && (
        <div className="p-3 rounded-2xl bg-emerald-950/90 border border-emerald-700/80 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-400 animate-bounce" />
            <span className="font-semibold text-emerald-200">
              {lang === 'np' ? 'नेपाली स्वरमा सारांश वाचन हुँदैछ...' : 'Reading Nepali summary aloud...'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1 h-3.5 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="w-1 h-5 bg-emerald-300 rounded-full animate-bounce"></span>
            <span className="w-1 h-2.5 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="w-1 h-6 bg-emerald-200 rounded-full animate-bounce"></span>
            <span className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse"></span>
          </div>
        </div>
      )}

      {/* Short Summary Text Box */}
      <div className="p-4 rounded-2xl bg-white/10 border border-white/10 text-xs sm:text-sm text-emerald-100 leading-relaxed font-medium">
        <p>
          {lang === 'np' ? nepaliSummaryText : englishSummaryText}
        </p>
      </div>
    </div>
  );
};
