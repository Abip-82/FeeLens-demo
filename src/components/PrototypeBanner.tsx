import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Language } from '../utils/translations';

interface PrototypeBannerProps {
  lang: Language;
}

export const PrototypeBanner: React.FC<PrototypeBannerProps> = ({ lang }) => {
  return (
    <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-1.5 text-xs text-amber-900 flex items-center justify-center gap-2 text-center font-medium">
      <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
      <span>
        {lang === 'en'
          ? 'Prototype demo data - Bharatpur Metropolitan City. Deterministic verification.'
          : 'प्रोटोटाइप डेमो डाटा - भरतपुर महानगरपालिका।'}
      </span>
    </div>
  );
};
