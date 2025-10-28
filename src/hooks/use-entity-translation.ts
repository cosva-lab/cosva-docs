import { useMemo } from 'react';
import { useLocales } from 'locales';
import { Schema } from '../../amplify/data/resource';

// ----------------------------------------------------------------------

/**
 * Generic translation interface that all translation objects must implement
 */
export interface TranslationWithLang {
  lang: Schema['LanguageCode']['type'];
}

/**
 * Generic hook to get the appropriate translation for any entity based on current language
 * Falls back to the first translation (index 0) if current language is not available
 * 
 * @template T - The translation type that extends TranslationWithLang
 */
export function useEntityTranslation<T extends TranslationWithLang>() {
  const { currentLang } = useLocales();

  const getTranslation = useMemo(
    () => (translations?: T[]) => {
      if (!translations || translations.length === 0) {
        return null;
      }

      // Try to find translation for current language
      const currentLangTranslation = translations.find(
        translation => translation.lang === currentLang.value
      );

      // Return current language translation or fallback to first translation
      return currentLangTranslation || translations[0];
    },
    [currentLang.value]
  );

  return {
    getTranslation,
    currentLang: currentLang.value,
  };
}
