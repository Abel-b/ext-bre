"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import deTranslations from "@/locales/de.json";
import enTranslations from "@/locales/en.json";

export type Locale = "de" | "en";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const dictionaries: Record<Locale, any> = {
  de: deTranslations,
  en: enTranslations,
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("de");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLocale = localStorage.getItem("ext2-locale") as Locale;
    if (savedLocale && (savedLocale === "de" || savedLocale === "en")) {
      setLocaleState(savedLocale);
    } else {
      // Detect browser language
      const browserLang = navigator.language.slice(0, 2);
      setLocaleState(browserLang === "de" ? "de" : "en");
    }
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("ext2-locale", newLocale);
      document.documentElement.lang = newLocale;
    }
  };

  // Helper to resolve dot-notation strings, e.g., "nav.services"
  const t = (key: string): string => {
    const dict = dictionaries[locale] || dictionaries.de;
    const parts = key.split(".");
    let current = dict;

    for (const part of parts) {
      if (current && typeof current === "object" && part in current) {
        current = current[part];
      } else {
        return key; // Fallback: return the key itself if path is unresolved
      }
    }

    return typeof current === "string" ? current : key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
}
