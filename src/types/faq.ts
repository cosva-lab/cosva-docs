import type { Schema } from '../../amplify/data/resource';
import { FileDataWithUrl } from './files';

// Type aliases for better readability
type FAQCategorySchema = Schema['FAQCategory']['type'];
type FAQCategoryI18nSchema = Schema['FAQCategoryI18n']['type'];
type FAQSchema = Schema['FAQ']['type'];
type FAQI18nSchema = Schema['FAQI18n']['type'];
type LanguageCode = Schema['LanguageCode']['type'];
export type StatusEnum = Schema['StatusEnum']['type'];

// ----------------------------------------------------------------------

export type IFAQCategory = Omit<FAQCategorySchema, 'logoData'> & {
  translations?: IFAQCategoryI18n[];
  logoData: FileDataWithUrl | null;
};

export type IFAQCategoryI18n = FAQCategoryI18nSchema;

export type IFAQCategoryFilterValue = string;

export type IFAQCategoryFilters = {
  status: StatusEnum | 'all';
};

// ----------------------------------------------------------------------

export type IFAQ = FAQSchema & {
  translations?: IFAQI18n[];
  category?: IFAQCategory;
};

export type IFAQI18n = FAQI18nSchema;

export type IFAQFilterValue = string;

export type IFAQFilters = {
  status: StatusEnum | 'all';
  category: string;
};

// ----------------------------------------------------------------------

export type IFAQSearchParams = {
  query?: string;
  lang?: LanguageCode;
  categoryId?: string;
};
