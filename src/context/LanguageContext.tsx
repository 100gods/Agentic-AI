
'use client';

import React, { createContext, useState, ReactNode } from 'react';
import { translations, TranslationKey } from './translations';

export type Language = 'English' | 'Hindi' | 'Spanish' | 'Marathi';

export const languageOptions: { value: Language; label: string; code: string }[] = [
    { value: 'English', label: 'English', code: 'en-US' },
    { value: 'Hindi', label: 'हिन्दी', code: 'hi-IN' },
    { value: 'Spanish', label: 'Español', code: 'es-ES' },
    { value: 'Marathi', label: 'मराठी', code: 'mr-IN' },
];


interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  languageCode: string;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'English',
  setLanguage: () => {},
  t: (key) => key,
  languageCode: 'en-US',
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('English');

  const t = (key: TranslationKey, vars: Record<string, string | number> = {}) => {
    let text = translations[language][key] || translations['English'][key] || key;
    for (const [varKey, varValue] of Object.entries(vars)) {
        text = text.replace(`{{${varKey}}}`, String(varValue));
    }
    return text;
  };

  const languageCode = languageOptions.find(l => l.value === language)?.code || 'en-US';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languageCode }}>
      {children}
    </LanguageContext.Provider>
  );
};
