import { useState, useCallback, useMemo } from 'react';
import type { LanguageCode } from 'components/language-selector';

// ----------------------------------------------------------------------

type Translation = {
  lang: LanguageCode;
  values: Record<string, string | undefined>;
};

export function useTranslations<T extends Record<string, string | undefined>>(
  fields: string[],
  initialLang: LanguageCode = 'es',
  existingTranslations?: T[]
) {
  // Initialize translations from existing data
  const [translations, setTranslations] = useState<Translation[]>(() => {
    if (existingTranslations && existingTranslations.length > 0) {
      return existingTranslations.map((t) => ({
        lang: (Object.keys(t)[0] as LanguageCode) || 'es',
        values: t,
      }));
    }
    // Default to Spanish
    return [
      {
        lang: initialLang,
        values: fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {} as T),
      },
    ];
  });

  const [selectedLang, setSelectedLang] = useState<LanguageCode>(initialLang);

  const updateTranslation = useCallback((lang: LanguageCode, field: string, value: string) => {
    setTranslations((prev) =>
      prev.map((t) =>
        t.lang === lang ? { ...t, values: { ...t.values, [field]: value } } : t
      )
    );
  }, []);

  const addLanguage = useCallback((lang: LanguageCode) => {
    setTranslations((prev) => {
      if (prev.find((t) => t.lang === lang)) return prev;
      return [
        ...prev,
        {
          lang,
          values: fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {} as T),
        },
      ];
    });
    setSelectedLang(lang);
  }, [fields]);

  const removeLanguage = useCallback((lang: LanguageCode) => {
    if (translations.length <= 1) return;
    setTranslations((prev) => prev.filter((t) => t.lang !== lang));
    if (selectedLang === lang) {
      const newLang = translations.find((t) => t.lang !== lang);
      if (newLang) setSelectedLang(newLang.lang);
    }
  }, [translations, selectedLang]);

  const getCurrentValues = useMemo(() => {
    return translations.find((t) => t.lang === selectedLang)?.values || {};
  }, [translations, selectedLang]);

  const getAllTranslations = useCallback(() => {
    return translations;
  }, [translations]);

  return {
    translations,
    selectedLang,
    setSelectedLang,
    updateTranslation,
    addLanguage,
    removeLanguage,
    getCurrentValues,
    getAllTranslations,
  };
}

