
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

type Language = 'en' | 'et' | 'ru';

interface Translation {
  key: string;
  en: string;
  et: string | null;
  ru: string | null;
  category: string;
}

interface TranslationsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  loading: boolean;
}

const TranslationsContext = createContext<TranslationsContextType | undefined>(undefined);

export function TranslationsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [language, setLanguageState] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);

  // Load translations from database
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const { data, error } = await supabase
          .from('translations')
          .select('*');
        
        if (error) {
          console.error('Error loading translations:', error);
        } else {
          setTranslations(data || []);
        }
      } catch (error) {
        console.error('Error loading translations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, []);

  // Load user language preference
  useEffect(() => {
    if (user) {
      const loadUserLanguage = async () => {
        try {
          const { data, error } = await supabase
            .from('user_preferences')
            .select('language')
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (data && !error) {
            setLanguageState(data.language as Language);
          }
        } catch (error) {
          console.error('Error loading user language:', error);
        }
      };
      
      loadUserLanguage();
    } else {
      // Load from localStorage for non-authenticated users
      const savedLanguage = localStorage.getItem('app_language') as Language;
      if (savedLanguage && ['en', 'et', 'ru'].includes(savedLanguage)) {
        setLanguageState(savedLanguage);
      }
    }
  }, [user]);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    
    if (user) {
      // Save to database for authenticated users
      try {
        const { error } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            language: lang
          });
        
        if (error) {
          console.error('Error saving language preference:', error);
        }
      } catch (error) {
        console.error('Error saving language preference:', error);
      }
    } else {
      // Save to localStorage for non-authenticated users
      localStorage.setItem('app_language', lang);
    }
  };

  const t = (key: string, fallback?: string): string => {
    const translation = translations.find(t => t.key === key);
    
    if (!translation) {
      console.warn(`Translation not found for key: ${key}`);
      return fallback || key;
    }
    
    const text = translation[language] || translation.en;
    return text || fallback || key;
  };

  const value = {
    language,
    setLanguage,
    t,
    loading
  };

  return (
    <TranslationsContext.Provider value={value}>
      {children}
    </TranslationsContext.Provider>
  );
}

export function useTranslations() {
  const context = useContext(TranslationsContext);
  if (context === undefined) {
    throw new Error('useTranslations must be used within a TranslationsProvider');
  }
  return context;
}
