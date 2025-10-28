import useSWR from 'swr';
import { useMemo } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
// types
import type { IFAQ, IFAQCategory } from 'types/faq';
import { FileData } from 'types/files';

const client = generateClient<Schema>({
  authMode: 'apiKey',
});

const authenticatedClient = generateClient<Schema>({
  authMode: 'userPool',
});

// ----------------------------------------------------------------------

export function useGetFAQCategories(
  status?: 'all' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
) {
  const cacheKey =
    status && status !== 'all' ? ['faq-categories', status] : 'faq-categories';

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    cacheKey,
    async () => {
      const filter =
        status && status !== 'all' ? { status: { eq: status } } : undefined;
      const result = await client.models.FAQCategory.list({
        filter,
        authMode: 'apiKey',
        selectionSet: [
          'id',
          'logoData.*',
          'status',
          'order',
          'translations.id',
          'translations.name',
          'translations.description',
          'translations.lang',
          'faqs.id',
          'faqs.categoryId',
          'faqs.status',
          'faqs.order',
          'faqs.tags',
          'faqs.translations.id',
          'faqs.translations.question',
          'faqs.translations.answer',
          'faqs.translations.lang',
        ],
      });
      return result.data;
    }
  );

  const memoizedValue = useMemo(
    () => ({
      categories: (data || []) as unknown as IFAQCategory[] as IFAQCategory[],
      categoriesLoading: isLoading,
      categoriesError: error,
      categoriesValidating: isValidating,
      categoriesEmpty: !isLoading && !data?.length,
      mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetFAQCategoryCounts() {
  const { data } = useSWR('faq-category-counts', async () => {
    const result = await client.models.FAQCategory.list({
      authMode: 'apiKey',
      selectionSet: ['status'],
    });
    return result.data;
  });

  const counts = useMemo(() => {
    const categories = data || [];
    return {
      all: categories.length,
      ACTIVE: categories.filter(cat => cat.status === 'ACTIVE').length,
      INACTIVE: categories.filter(cat => cat.status === 'INACTIVE').length,
      ARCHIVED: categories.filter(cat => cat.status === 'ARCHIVED').length,
    };
  }, [data]);

  return counts;
}

// ----------------------------------------------------------------------

export function useGetFAQCategory(id: string) {
  const { data, isLoading, error, isValidating } = useSWR(
    id ? ['faq-category', id] : null,
    async () => {
      if (!id) return null;
      const result = await client.models.FAQCategory.get(
        { id },
        {
          authMode: 'apiKey',
          selectionSet: [
            'id',
            'logoData.*',
            'status',
            'order',
            'translations.id',
            'translations.name',
            'translations.description',
            'translations.lang',
          ],
        }
      );
      return result.data;
    }
  );

  const memoizedValue = useMemo(
    () => ({
      category: data as IFAQCategory | undefined,
      categoryLoading: isLoading,
      categoryError: error,
      categoryValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetFAQs(categoryId?: string) {
  const cacheKey = categoryId ? ['faqs', categoryId] : 'faqs';

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    cacheKey,
    async () => {
      const filter = categoryId
        ? { categoryId: { eq: categoryId } }
        : undefined;
      const result = await client.models.FAQ.list({
        filter,
        authMode: 'apiKey',
        selectionSet: [
          'id',
          'categoryId',
          'tags',
          'status',
          'order',
          'translations.id',
          'translations.answer',
          'translations.question',
          'translations.lang',
        ],
      });
      return result.data;
    }
  );

  const memoizedValue = useMemo(
    () => ({
      faqs: (data || []) as IFAQ[],
      faqsLoading: isLoading,
      faqsError: error,
      faqsValidating: isValidating,
      faqsEmpty: !isLoading && !data?.length,
      mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetFAQ(id: string) {
  const { data, isLoading, error, isValidating } = useSWR(
    id ? ['faq', id] : null,
    async () => {
      if (!id) return null;
      const result = await client.models.FAQ.get(
        { id },
        {
          authMode: 'apiKey',
          selectionSet: [
            'id',
            'categoryId',
            'tags',
            'status',
            'translations.id',
            'translations.answer',
            'translations.question',
            'translations.lang',
          ],
        }
      );
      return result.data;
    }
  );

  const memoizedValue = useMemo(
    () => ({
      faq: data as IFAQ | undefined,
      faqLoading: isLoading,
      faqError: error,
      faqValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createFAQCategory(data: {
  logoData?: FileData;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  order?: number;
  translations: { lang: string; name: string; description?: string }[];
}) {
  try {
    // Get max order from existing categories to place new one at the end
    const { data: existingCategories } =
      await authenticatedClient.models.FAQCategory.list({
        authMode: 'userPool',
        selectionSet: ['order'],
      });

    const maxOrder = existingCategories.reduce((max, cat) => {
      return Math.max(max, cat.order ?? 0);
    }, -1);

    const newOrder = maxOrder + 1;

    // Create the main category with user authentication
    const category = await authenticatedClient.models.FAQCategory.create({
      logoData: data.logoData,
      status: data.status,
      order: newOrder,
    });

    // Create translations with user authentication
    // Ensure only ONE translation per language
    if (category.data?.id && category.data !== null) {
      const categoryId = category.data.id;

      // Remove duplicates from data.translations (keep only first occurrence of each language)
      const seenLangs = new Set<string>();
      const uniqueTranslations = data.translations.filter(t => {
        if (seenLangs.has(t.lang)) return false;
        seenLangs.add(t.lang);
        return true;
      });

      await Promise.all(
        uniqueTranslations.map(translation =>
          authenticatedClient.models.FAQCategoryI18n.create(
            {
              categoryId,
              lang: translation.lang as Schema['LanguageCode']['type'],
              name: translation.name,
              description: translation.description,
            },
            { authMode: 'userPool' }
          )
        )
      );
    }

    return { data: category.data, error: null };
  } catch (error) {
    console.error('Error creating FAQ category:', error);
    return { data: null, error };
  }
}

// ----------------------------------------------------------------------

export async function createFAQ(data: {
  categoryId: string;
  tags: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  order?: number;
  translations: { lang: string; question: string; answer: string }[];
}) {
  try {
    // Get max order from existing FAQs in the same category to place new one at the end
    const { data: existingFAQs } = await authenticatedClient.models.FAQ.list({
      filter: { categoryId: { eq: data.categoryId } },
      authMode: 'userPool',
      selectionSet: ['order'],
    });

    const maxOrder = existingFAQs.reduce((max, f) => {
      return Math.max(max, f.order ?? 0);
    }, -1);

    const newOrder = maxOrder + 1;

    // Create the main FAQ with user authentication
    const faq = await authenticatedClient.models.FAQ.create(
      {
        categoryId: data.categoryId,
        tags: data.tags,
        status: data.status,
        order: newOrder,
      },
      { authMode: 'userPool' }
    );

    // Create translations with user authentication
    // Ensure only ONE translation per language
    if (faq.data?.id && faq.data !== null) {
      const faqId = faq.data.id;

      // Remove duplicates from data.translations (keep only first occurrence of each language)
      const seenLangs = new Set<string>();
      const uniqueTranslations = data.translations.filter(t => {
        if (seenLangs.has(t.lang)) return false;
        seenLangs.add(t.lang);
        return true;
      });

      await Promise.all(
        uniqueTranslations.map(translation =>
          authenticatedClient.models.FAQI18n.create(
            {
              faqId,
              lang: translation.lang as Schema['LanguageCode']['type'],
              question: translation.question,
              answer: translation.answer,
            },
            { authMode: 'userPool' }
          )
        )
      );
    }

    return { data: faq.data, error: null };
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return { data: null, error };
  }
}

// ----------------------------------------------------------------------

export async function updateFAQ(
  id: string,
  data: {
    categoryId: string;
    tags: string[];
    status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
    order?: number;
    translations: { lang: string; question: string; answer: string }[];
  }
) {
  try {
    // Update the main FAQ (requires authenticated user)
    const faq = await authenticatedClient.models.FAQ.update(
      {
        id,
        categoryId: data.categoryId,
        tags: data.tags,
        status: data.status,
        order: data.order,
      },
      { authMode: 'userPool' }
    );

    // STEP 1 — Get existing translations
    const { data: existingTranslations = [] } =
      await authenticatedClient.models.FAQI18n.list({
        filter: { faqId: { eq: id } },
        authMode: 'userPool',
      });

    // STEP 2 — Normalize input (remove duplicates by language)
    const seenLangs = new Set<string>();
    const uniqueTranslations = data.translations.filter(t => {
      if (seenLangs.has(t.lang)) return false;
      seenLangs.add(t.lang);
      return true;
    });

    // STEP 3 — Get languages from form data
    const formLanguageCodes = new Set(uniqueTranslations.map(t => t.lang));

    // STEP 4 — UPSERT: Update or create translations (ONLY ONE per language)
    const upsertPromises = uniqueTranslations.map(async translation => {
      const existing = existingTranslations.find(
        t => t.lang === translation.lang
      );

      if (existing) {
        // Update existing translation
        return authenticatedClient.models.FAQI18n.update(
          {
            id: existing.id,
            question: translation.question,
            answer: translation.answer,
          },
          { authMode: 'userPool' }
        );
      } else {
        // Create new translation
        return authenticatedClient.models.FAQI18n.create(
          {
            faqId: id,
            lang: translation.lang as Schema['LanguageCode']['type'],
            question: translation.question,
            answer: translation.answer,
          },
          { authMode: 'userPool' }
        );
      }
    });

    await Promise.all(upsertPromises);

    // STEP 5 — DELETE: Remove translations that were deleted from the form
    // AND delete DUPLICATE translations (keep only ONE per language)
    const languageGroups: Record<string, typeof existingTranslations> = {};

    existingTranslations.forEach(t => {
      if (!languageGroups[t.lang]) {
        languageGroups[t.lang] = [];
      }
      languageGroups[t.lang].push(t);
    });

    const deletePromises: Promise<unknown>[] = [];

    // Keep track of which translations we want to keep (from form or first existing)
    const translationsToKeep = new Set(
      uniqueTranslations
        .map(t => {
          const existing = existingTranslations.find(e => e.lang === t.lang);
          return existing ? existing.id : null;
        })
        .filter(Boolean) as string[]
    );

    Object.entries(languageGroups).forEach(([lang, translations]) => {
      // Delete if language was removed from form (all translations of that language)
      if (!formLanguageCodes.has(lang)) {
        translations.forEach(t =>
          deletePromises.push(
            authenticatedClient.models.FAQI18n.delete(
              { id: t.id },
              { authMode: 'userPool' }
            )
          )
        );
      }
      // Keep only ONE translation per language (the first one or the one being updated)
      else {
        const toKeep = translations.find(
          t =>
            translationsToKeep.has(t.id) ||
            t.id === existingTranslations.find(e => e.lang === lang)?.id
        );

        // Delete all others
        translations.forEach(t => {
          if (t.id !== toKeep?.id) {
            deletePromises.push(
              authenticatedClient.models.FAQI18n.delete(
                { id: t.id },
                { authMode: 'userPool' }
              )
            );
          }
        });
      }
    });

    if (deletePromises.length > 0) {
      await Promise.all(deletePromises);
    }

    return { data: faq.data, error: null };
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return { data: null, error };
  }
}
// ----------------------------------------------------------------------

export async function updateFAQCategory(
  id: string,
  data: {
    logoData?: FileData;
    status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
    order?: number;
    translations: { lang: string; name: string; description?: string }[];
  }
) {
  try {
    // STEP 1 — Update main category
    const category = await authenticatedClient.models.FAQCategory.update(
      {
        id,
        status: data.status,
        ...(data.logoData && { logoData: data.logoData }),
      },
      { authMode: 'userPool' }
    );

    // STEP 2 — Load existing translations
    const { data: existingTranslations = [] } =
      await authenticatedClient.models.FAQCategoryI18n.list({
        filter: { categoryId: { eq: id } },
        authMode: 'userPool',
      });

    // STEP 3 — Normalize input (remove duplicates by language)
    const uniqueTranslations = Array.from(
      new Map(data.translations.map(t => [t.lang, t])).values()
    );

    // STEP 4 — Build lookup for existing translations by language
    const existingByLang = Object.fromEntries(
      existingTranslations.map(t => [t.lang, t])
    );

    // STEP 5 — Upsert (create or update)
    const upsertPromises = uniqueTranslations.map(
      async ({ lang, name, description }) => {
        const existing = existingByLang[lang];
        if (existing) {
          return authenticatedClient.models.FAQCategoryI18n.update(
            { id: existing.id, name, description },
            { authMode: 'userPool' }
          );
        }
        return authenticatedClient.models.FAQCategoryI18n.create(
          {
            categoryId: id,
            lang: lang as Schema['LanguageCode']['type'],
            name,
            description,
          },
          { authMode: 'userPool' }
        );
      }
    );

    await Promise.all(upsertPromises);

    // STEP 6 — Determine which translations should remain
    const keepLangs = new Set(uniqueTranslations.map(t => t.lang));

    // STEP 7 — Delete removed or duplicate translations
    const deletePromises = existingTranslations.flatMap(t => {
      const sameLangTranslations = existingTranslations.filter(
        e => e.lang === t.lang
      );
      const firstTranslation = sameLangTranslations[0];

      // Case 1: Language removed → delete all
      if (!keepLangs.has(t.lang)) {
        return authenticatedClient.models.FAQCategoryI18n.delete(
          { id: t.id },
          { authMode: 'userPool' }
        );
      }

      // Case 2: Duplicate translation → keep first, delete others
      if (t.id !== firstTranslation.id) {
        return authenticatedClient.models.FAQCategoryI18n.delete(
          { id: t.id },
          { authMode: 'userPool' }
        );
      }

      return [];
    });

    if (deletePromises.length > 0) {
      await Promise.all(deletePromises);
    }

    return { data: category.data, error: null };
  } catch (error) {
    console.error('Error updating FAQ category:', error);
    return { data: null, error };
  }
}

// ----------------------------------------------------------------------

export async function updateCategoryOrder(id: string, order: number) {
  const category = await authenticatedClient.models.FAQCategory.update(
    {
      id,
      order,
    },
    { authMode: 'userPool' }
  );

  if (!category.data) throw new Error('Failed to update category order');

  return { data: category.data, error: null };
}

// ----------------------------------------------------------------------

export async function updateFAQOrder(id: string, order: number) {
  const faq = await authenticatedClient.models.FAQ.update(
    {
      id,
      order,
    },
    { authMode: 'userPool' }
  );

  if (!faq.data) throw new Error('Failed to update FAQ order');

  return { data: faq.data, error: null };
}
