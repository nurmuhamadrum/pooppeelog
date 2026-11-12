import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppLanguage } from '@poop-pee-log/shared';

const STORAGE_KEY = 'ppl_lang';

interface LanguageContextValue {
  lang: AppLanguage;
  setLang: (lang: AppLanguage) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'id',
  setLang: () => {},
  toggleLang: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<AppLanguage>(() => {
    if (typeof window === 'undefined') return 'id';
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === 'id' || saved === 'en' ? saved : 'id';
  });

  const setLang = (next: AppLanguage) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  const toggleLang = () => setLang(lang === 'en' ? 'id' : 'en');

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

