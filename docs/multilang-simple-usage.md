# Multiidioma - Arquitectura I18n Tables

## 📚 Documentación

Para la guía completa de uso con tablas I18n, ver:

👉 **[docs/multilang-i18n-tables.md](./multilang-i18n-tables.md)**

## 🎯 Resumen Rápido

### Arquitectura
```
FAQ → FAQI18n (traducciones)
FAQCategory → FAQCategoryI18n
DocumentationSection → DocumentationSectionI18n
DocumentationArticle → DocumentationArticleI18n
```

### Uso Básico

```typescript
// Crear FAQ
const faq = await client.models.FAQ.create({...});

// Crear traducciones
await client.models.FAQI18n.create({
  faqId: faq.id,
  lang: 'es',
  question: "¿Cómo...?",
  answer: "..."
});

// Leer
const translations = await client.models.FAQI18n.list({
  filter: { faqId: { eq: '123' }, lang: { eq: 'es' } }
});
```

### ⚠️ Nota

Este enfoque es más complejo que JSON pero más eficiente para muchos idiomas.
Para simplicidad máxima, considera usar JSON en un solo campo.

Ver documentación completa para más detalles.