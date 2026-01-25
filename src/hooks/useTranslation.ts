import { useEffect, useState } from 'react';
import { locales } from '@/i18n/locales';

export type LocaleKey = keyof typeof locales;
const STORAGE_KEY = 'cf_locale';

export function useTranslation() {
  const [locale, setLocale] = useState<LocaleKey>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as LocaleKey | null;
      return stored ?? 'pt';
    } catch {
      return 'pt';
    }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, locale); } catch {}
  }, [locale]);

  const t = (path: string) => {
    const parts = path.split('.');
    let cur: any = (locales as any)[locale];
    for (const p of parts) {
      cur = cur?.[p];
      if (cur === undefined) return path;
    }
    return cur as string;
  };

  return { t, locale, setLocale } as const;
}
