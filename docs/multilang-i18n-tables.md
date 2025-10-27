# Multiidioma con Tablas I18n - Guía de Uso

## 🎯 Arquitectura

Cada modelo tiene su tabla de traducciones separada:

```
FAQ → FAQI18n (traducciones)
FAQCategory → FAQCategoryI18n (traducciones)
DocumentationSection → DocumentationSectionI18n (traducciones)
DocumentationArticle → DocumentationArticleI18n (traducciones)
```

---

## 📝 Estructura

### FAQ Category
```typescript
// Tabla principal
FAQCategory {
  id: "123"
  logo: "..."
  status: "ACTIVE"
}

// Traducciones
FAQCategoryI18n [
  { categoryId: "123", lang: "en", name: "Getting Started", description: "..." }
  { categoryId: "123", lang: "es", name: "Primeros Pasos", description: "..." }
  { categoryId: "123", lang: "fr", name: "Pour commencer", description: "..." }
]
```

### FAQ
```typescript
// Tabla principal
FAQ {
  id: "456"
  categoryId: "123"
  tags: ["account"]
  status: "ACTIVE"
}

// Traducciones
FAQI18n [
  { faqId: "456", lang: "en", question: "How to...", answer: "You need to..." }
  { faqId: "456", lang: "es", question: "¿Cómo...?", answer: "Necesitas..." }
]
```

---

## 💻 Ejemplos de Uso

### 1. Crear FAQ con Traducciones

```typescript
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

// Crear FAQ principal
const faq = await client.models.FAQ.create({
  categoryId: "cat-123",
  tags: ["account", "signup"],
  status: "ACTIVE"
});

// Crear traducciones
await Promise.all([
  // Inglés
  client.models.FAQI18n.create({
    faqId: faq.id,
    lang: "en",
    question: "How to create an account?",
    answer: "Click the Sign Up button"
  }),
  
  // Español
  client.models.FAQI18n.create({
    faqId: faq.id,
    lang: "es",
    question: "¿Cómo crear una cuenta?",
    answer: "Haz clic en el botón Registrarse"
  }),
  
  // Francés
  client.models.FAQI18n.create({
    faqId: faq.id,
    lang: "fr",
    question: "Comment créer un compte?",
    answer: "Cliquez sur le bouton Inscription"
  })
]);
```

### 2. Leer FAQ en un Idioma

```typescript
const getFAQInLanguage = async (faqId: string, lang: string) => {
  // Obtener FAQ principal
  const faq = await client.models.FAQ.get({ id: faqId });
  
  if (!faq) return null;
  
  // Obtener traducción en el idioma solicitado
  const translations = await client.models.FAQI18n.list({
    filter: {
      faqId: { eq: faqId },
      lang: { eq: lang }
    }
  });
  
  const translation = translations.data[0];
  
  if (!translation) {
    // Fallback a inglés
    const enTranslation = await client.models.FAQI18n.list({
      filter: {
        faqId: { eq: faqId },
        lang: { eq: 'en' }
      }
    });
    return { ...faq, ...enTranslation.data[0] };
  }
  
  return {
    ...faq,
    question: translation.question,
    answer: translation.answer
  };
};

// Uso
const faqEs = await getFAQInLanguage('faq-123', 'es');
const faqEn = await getFAQInLanguage('faq-123', 'en');
```

### 3. Listar FAQs con Traducciones

```typescript
const listFAQsInLanguage = async (lang: string) => {
  const faqs = await client.models.FAQ.list();
  
  const faqsWithTranslations = await Promise.all(
    faqs.data.map(async faq => {
      // Obtener traducción
      const translations = await client.models.FAQI18n.list({
        filter: {
          faqId: { eq: faq.id },
          lang: { eq: lang }
        }
      });
      
      const translation = translations.data[0];
      
      // Si no existe, intentar inglés
      if (!translation) {
        const enTrans = await client.models.FAQI18n.list({
          filter: {
            faqId: { eq: faq.id },
            lang: { eq: 'en' }
          }
        });
        return { ...faq, ...enTrans.data[0] };
      }
      
      return {
        ...faq,
        question: translation.question,
        answer: translation.answer
      };
    })
  );
  
  return faqsWithTranslations;
};
```

### 4. Helper Function para Simplificar

```typescript
// utils/i18n-helpers.ts
export class I18nHelper {
  // Obtener traducción de FAQ
  static async getFAQTranslation(client: any, faqId: string, lang: string) {
    const translation = await client.models.FAQI18n.list({
      filter: {
        faqId: { eq: faqId },
        lang: { eq: lang }
      }
    });
    
    if (translation.data[0]) return translation.data[0];
    
    // Fallback a inglés
    const enTrans = await client.models.FAQI18n.list({
      filter: {
        faqId: { eq: faqId },
        lang: { eq: 'en' }
      }
    });
    
    return enTrans.data[0];
  }
  
  // Obtener todas las traducciones de un FAQ
  static async getAllFAQTranslations(client: any, faqId: string) {
    const translations = await client.models.FAQI18n.list({
      filter: {
        faqId: { eq: faqId }
      }
    });
    
    const map = {};
    translations.data.forEach(t => {
      map[t.lang] = t;
    });
    
    return map;
  }
  
  // Obtener idiomas disponibles
  static async getAvailableLanguages(client: any, faqId: string): Promise<string[]> {
    const translations = await client.models.FAQI18n.list({
      filter: {
        faqId: { eq: faqId }
      }
    });
    
    return translations.data.map(t => t.lang);
  }
}
```

### 5. Hook React

```typescript
// hooks/useFAQi18n.ts
import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

export function useFAQi18n(faqId: string, lang: string) {
  const [translation, setTranslation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadTranslation = async () => {
      const client = generateClient<Schema>();
      
      // Cargar traducción
      const translations = await client.models.FAQI18n.list({
        filter: {
          faqId: { eq: faqId },
          lang: { eq: lang }
        }
      });
      
      if (translations.data[0]) {
        setTranslation(translations.data[0]);
      } else {
        // Fallback a inglés
        const enTrans = await client.models.FAQI18n.list({
          filter: {
            faqId: { eq: faqId },
            lang: { eq: 'en' }
          }
        });
        setTranslation(enTrans.data[0]);
      }
      
      setLoading(false);
    };
    
    loadTranslation();
  }, [faqId, lang]);
  
  return { translation, loading };
}

// Uso en componente
function FAQCard({ faq }: { faq: any }) {
  const [lang, setLang] = useState('en');
  const { translation, loading } = useFAQi18n(faq.id, lang);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <select value={lang} onChange={e => setLang(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
      </select>
      
      <h3>{translation?.question}</h3>
      <p>{translation?.answer}</p>
    </div>
  );
}
```

---

## ⚠️ Consideraciones

### ✅ Ventajas
- **Búsqueda eficiente** por idioma
- **Indexación** optimizada
- **Escalable** para muchos idiomas
- **Estructura normalizada** de BD

### ❌ Desventajas
- **Más complejo**: Múltiples queries necesarias
- **Más código**: Hay que manejar las traducciones
- **Más tablas**: Más mantenimiento
- **Performance**: Necesitas cargar traducciones aparte

---

## 🚀 Casos de Uso Recomendados

### Usa este enfoque si:
- Tienes **muchos idiomas** (10+)
- Necesitas **búsqueda eficiente** por idioma
- Necesitas **rendimiento máximo**
- Prefieres **estructura normalizada** de BD

### No uses este enfoque si:
- Tienes **pocos idiomas** (2-5)
- Prefieres **simplicidad**
- No necesitas búsqueda por idioma
- Quieres **rápido desarrollo**

---

## 💡 Tips

1. **Siempre incluye inglés** como idioma base
2. **Cache las traducciones** en el cliente
3. **Usa helpers** para evitar código repetido
4. **Considera carga lazy** de traducciones
5. **Validación**: Asegura que existe traducción antes de mostrar

---

## 📊 Comparación

### Tablas I18n (Actual)
```typescript
// Múltiples queries necesarias
const faq = await client.models.FAQ.get({ id });
const trans = await client.models.FAQI18n.list({ filter });
// ❌ 2 queries
```

### JSON Simple (Alternativa)
```typescript
// Una sola query
const faq = await client.models.FAQ.get({ id });
const text = faq.question[lang];
// ✅ 1 query
```

---

## 🎯 Conclusión

Esta arquitectura es **más profesional** pero **más compleja**. Úsala si:
1. Tienes muchos idiomas
2. Necesitas búsqueda eficiente
3. Priorizas rendimiento sobre simplicidad

Si prefieres simplicidad, considera el enfoque JSON simple que te mostré antes.
