"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultLocale,
  en,
  localeCodes,
  messagesByLocale,
  type LocaleCode,
  type Messages,
} from "@/locales";
import { getMessage, interpolate } from "./translate";

const STORAGE_KEY = "xiangqi-locale";

function isLocaleCode(value: string): value is LocaleCode {
  return localeCodes.includes(value as LocaleCode);
}

type I18nContextValue = {
  locale: LocaleCode;
  setLocale: (next: LocaleCode) => void;
  t: (path: string, vars?: Record<string, string | number>) => string;
  messages: Messages;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readStoredLocale(): LocaleCode | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && isLocaleCode(raw)) return raw;
  } catch {
    /* ignore */
  }
  return null;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(defaultLocale);

  useEffect(() => {
    const stored = readStoredLocale();
    if (stored) setLocaleState(stored);
  }, []);

  const setLocale = useCallback((next: LocaleCode) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const messages = messagesByLocale[locale];

  const t = useCallback(
    (path: string, vars?: Record<string, string | number>) => {
      const raw =
        getMessage(messages, path) ?? getMessage(en, path) ?? path;
      return interpolate(raw, vars);
    },
    [messages],
  );

  useEffect(() => {
    const htmlLang =
      locale === "zh-CN" ? "zh-CN" : locale === "ms" ? "ms" : "en";
    document.documentElement.lang = htmlLang;
    document.title = getMessage(messages, "meta.title") ?? en.meta.title;
  }, [locale, messages]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t,
      messages,
    }),
    [locale, setLocale, t, messages],
  );

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
