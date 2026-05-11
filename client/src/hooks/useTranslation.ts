import { useLanguageStore } from '@/stores/languageStore';
import translations from '@/lib/translations.json';

type TranslationKeys = keyof typeof translations.th;

export const useTranslation = () => {
  const { language } = useLanguageStore();
  
  const t = (path: string, variables?: Record<string, string | number>) => {
    const keys = path.split('.');
    let result: any = translations[language];
    
    for (const key of keys) {
      if (result && result[key]) {
        result = result[key];
      } else {
        return path;
      }
    }
    
    if (typeof result === 'string' && variables) {
      Object.entries(variables).forEach(([key, value]) => {
        result = result.replace(`{${key}}`, value.toString());
      });
    }
    
    return result;
  };
  
  return { t, language };
};
