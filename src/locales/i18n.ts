import { createInstance } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import ChainedBackend from 'i18next-chained-backend';

import { localStorageGetItem } from 'utils/storage-available';
import { defaultLang } from './config-lang';
import translationEn from './langs/en.json';
import translationEs from './langs/es.json';

const i18n = createInstance();

const lng = localStorageGetItem('i18nextLng', defaultLang.value);

i18n
  .use(ChainedBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng,
    fallbackLng: lng,
    debug: false,
    defaultNS: 'translations',
    ns: ['translations', 'faq'],
    backend: {
      backends: [
        resourcesToBackend(
          async (lang: string, ns: string) =>
            import(`./langs/${lang}/${ns}.json`)
        ),
        resourcesToBackend({
          en: { translations: translationEn },
          es: { translations: translationEs },
        }),
      ],
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
      useRawValueToEscape: true,
      skipOnVariables: false,
    },
  });

i18n.on('languageChanged', lang => {
  document.documentElement.lang = lang;
  document.documentElement.dir = i18n.dir(lang);
  console.log('languageChanged', lang);
});

export default i18n;
