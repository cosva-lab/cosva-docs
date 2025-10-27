import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/**
 * Example of logo data:
 * {
 * "id": "logos/categories/help-center.png",
 * "storage": "s3",
 * "metadata": {
 *   "filename": "help-center.png",
 *   "mime_type": "image/png",
 *   "size": 20234,
 *   "width": 256,
 *   "height": 256
 * },
 * "urls": {
 *   "original": "https://cosvo-assets.s3.amazonaws.com/logos/categories/help-center.png",
 *   "thumb": "https://cosvo-assets.s3.amazonaws.com/logos/categories/help-center_thumb.png"
 * }
 * }
 */

const schema = a.schema({
  // ======================================================
  //  ENUMS
  // ======================================================

  LanguageCode: a.enum([
    'en', // English
    'es', // Español
    'fr', // Français
    'pt', // Português
    'de', // Deutsch
    'it', // Italiano
    'zh', // 中文
    'ja', // 日本語
    'ko', // 한국어
    'ar', // العربية
    'ru', // Русский
    'hi', // हिन्दी
  ]),
  StatusEnum: a.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']),

  // ======================================================
  //  MODELOS DE NEGOCIO
  // ======================================================

  // FAQ Category
  FAQCategory: a
    .model({
      logoData: a.json(), // 📦 datos estilo Shrine
      status: a.ref('StatusEnum'),
      faqs: a.hasMany('FAQ', 'categoryId'),
      translations: a.hasMany('FAQCategoryI18n', 'categoryId'),
    })
    .authorization(allow => [
      allow.publicApiKey().to(['read']),
      allow.authenticated().to(['read', 'create', 'update', 'delete']),
    ]),

  // FAQ Category Translations
  FAQCategoryI18n: a
    .model({
      categoryId: a.id().required(),
      category: a.belongsTo('FAQCategory', 'categoryId'),
      lang: a.ref('LanguageCode').required(),
      name: a.string().required(),
      description: a.string(),
    })
    .authorization(allow => [
      allow.publicApiKey().to(['read']),
      allow.authenticated().to(['read', 'create', 'update', 'delete']),
    ]),

  // FAQ
  FAQ: a
    .model({
      categoryId: a.id().required(),
      category: a.belongsTo('FAQCategory', 'categoryId'),
      tags: a.string().array(),
      status: a.ref('StatusEnum'),
      translations: a.hasMany('FAQI18n', 'faqId'),
    })
    .authorization(allow => [
      allow.publicApiKey().to(['read']),
      allow.authenticated().to(['read', 'create', 'update', 'delete']),
    ]),

  // FAQ Translations
  FAQI18n: a
    .model({
      faqId: a.id().required(),
      faq: a.belongsTo('FAQ', 'faqId'),
      lang: a.ref('LanguageCode').required(),
      question: a.string().required(),
      answer: a.string().required(),
    })
    .authorization(allow => [
      allow.publicApiKey().to(['read']),
      allow.authenticated().to(['read', 'create', 'update', 'delete']),
    ]),

  // Documentation Section
  DocumentationSection: a
    .model({
      logoData: a.json(), // 📦 datos estilo Shrine
      order: a.integer(),
      status: a.ref('StatusEnum'),
      articles: a.hasMany('DocumentationArticle', 'sectionId'),
      translations: a.hasMany('DocumentationSectionI18n', 'sectionId'),
    })
    .authorization(allow => [
      allow.publicApiKey().to(['read']),
      allow.authenticated().to(['read', 'create', 'update', 'delete']),
    ]),

  // Documentation Section Translations
  DocumentationSectionI18n: a
    .model({
      sectionId: a.id().required(),
      section: a.belongsTo('DocumentationSection', 'sectionId'),
      lang: a.ref('LanguageCode').required(),
      title: a.string().required(),
      description: a.string(),
    })
    .authorization(allow => [
      allow.publicApiKey().to(['read']),
      allow.authenticated().to(['read', 'create', 'update', 'delete']),
    ]),

  // Documentation Article
  DocumentationArticle: a
    .model({
      sectionId: a.id().required(),
      section: a.belongsTo('DocumentationSection', 'sectionId'),
      order: a.integer(),
      status: a.ref('StatusEnum'),
      translations: a.hasMany('DocumentationArticleI18n', 'articleId'),
    })
    .authorization(allow => [
      allow.publicApiKey().to(['read']),
      allow.authenticated().to(['read', 'create', 'update', 'delete']),
    ]),

  // Documentation Article Translations
  DocumentationArticleI18n: a
    .model({
      articleId: a.id().required(),
      article: a.belongsTo('DocumentationArticle', 'articleId'),
      lang: a.ref('LanguageCode').required(),
      title: a.string().required(),
      content: a.string().required(), // Markdown/HTML
    })
    .authorization(allow => [
      allow.publicApiKey().to(['read']),
      allow.authenticated().to(['read', 'create', 'update', 'delete']),
    ]),

  // ======================================================
  //  AUDITORÍAS (privadas, solo para usuarios autenticados)
  // ======================================================

  AuditLog: a
    .model({
      auditableId: a.string().required(),
      auditableType: a.string().required(),
      action: a.enum(['read', 'CREATE', 'UPDATE', 'DELETE']),
      userId: a.string(),
      userName: a.string(),
      remoteAddress: a.string(),
      oldValues: a.json(),
      newValues: a.json(),
      createdAt: a.datetime(),
    })
    .authorization(allow => [allow.authenticated()]), // Solo usuarios autenticados pueden acceder
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool', // Autenticación de usuarios por defecto
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
