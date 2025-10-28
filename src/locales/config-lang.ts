import merge from 'lodash/merge';
import { enUS as enUSAdapter, es as esESAdapter } from 'date-fns/locale';
// core
import { enUS as enUSCore, esES as esESCore } from '@mui/material/locale';
// date-pickers
import {
  enUS as enUSDate,
  esES as esESDate,
} from '@mui/x-date-pickers/locales';

export const allLangs = [
  {
    label: 'Español',
    value: 'es',
    systemValue: merge(esESDate, esESCore),
    adapterLocale: esESAdapter,
    icon: 'flagpack:es',
  },
  {
    label: 'English',
    value: 'en',
    systemValue: merge(enUSDate, enUSCore),
    adapterLocale: enUSAdapter,
    icon: 'flagpack:gb-nir',
  },
];

export const defaultLang = allLangs[0]; // spanish
