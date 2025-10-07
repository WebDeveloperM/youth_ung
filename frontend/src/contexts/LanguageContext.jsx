import React, { createContext, useState, useContext } from 'react';
import uzTranslations from '../translations/uz.json';
import ruTranslations from '../translations/ru.json';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('uz'); // По умолчанию узбекский

  const translations = {
    uz: uzTranslations,
    ru: ruTranslations
  };

  // Функция перевода с поддержкой вложенных ключей
  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value[k];
      if (!value) return key;
    }
    
    return value;
  };

  // Переключение языка
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'uz' ? 'ru' : 'uz');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

