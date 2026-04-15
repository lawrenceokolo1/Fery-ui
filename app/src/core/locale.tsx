import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { IntlProvider } from 'react-intl';

type SupportedLocale = 'en-ca' | 'fr-ca';

type LocaleContextValue = {
  locale: SupportedLocale;
  setLocale: (next: SupportedLocale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function normalizeLocale(input: string | null | undefined): SupportedLocale {
  const raw = (input || '').toLowerCase();
  if (raw.startsWith('fr')) return 'fr-ca';
  return 'en-ca';
}

async function loadLocaleData(locale: SupportedLocale) {
  const response = await fetch(`/lang/${locale}.json`);
  if (!response.ok) return {};
  const messages: any = await response.json();
  for (const key of Object.keys(messages)) {
    if (typeof messages[key] !== 'string') {
      messages[key] = messages[key].defaultMessage;
    }
  }
  return messages;
}

const DEFAULT_LOCALE: SupportedLocale = 'fr-ca';

export function LocaleProvider(props: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    const stored = localStorage.getItem('ui-locale');
    if (stored) return normalizeLocale(stored);
    return DEFAULT_LOCALE;
  });
  const [messages, setMessages] = useState<any>({});

  useEffect(() => {
    document.documentElement.lang = locale === 'fr-ca' ? 'fr-CA' : 'en-CA';
  }, [locale]);

  useEffect(() => {
    let cancelled = false;
    loadLocaleData(locale)
      .then(m => {
        if (!cancelled) setMessages(m || {});
      })
      .catch(() => {
        if (!cancelled) setMessages({});
      });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const setLocale = useCallback((next: SupportedLocale) => {
    localStorage.setItem('ui-locale', next);
    setLocaleState(next);
  }, []);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return (
    <LocaleContext.Provider value={value}>
      <IntlProvider locale={locale} defaultLocale={DEFAULT_LOCALE} messages={messages}>
        {props.children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}

