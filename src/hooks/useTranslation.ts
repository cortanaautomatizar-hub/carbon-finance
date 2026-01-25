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
    try { localStorage.setItem(STORAGE_KEY, locale); } catch (e) { /* ignore storage errors */ }
  }, [locale]);

  const t = (path: string) => {
    const parts = path.split('.');
    let cur: unknown = (locales as Record<string, unknown>)[locale];
    for (const p of parts) {
      if (typeof cur === 'object' && cur !== null && p in (cur as Record<string, unknown>)) {
        cur = (cur as Record<string, unknown>)[p];
      } else {
        return path;
      }
    }
    return typeof cur === 'string' ? cur : path;
  };

  return { t, locale, setLocale } as const;
}
