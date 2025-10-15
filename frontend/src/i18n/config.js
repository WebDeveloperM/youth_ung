import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import en from './locales/en/translation.json'
import ru from './locales/ru/translation.json'
import uz from './locales/uz/translation.json'
const savedLang = localStorage.getItem('lang') || 'uz'

const resources = {
	en: { translation: en },
	uz: { translation: uz },
	ru: { translation: ru },
}

// 🔧 i18n config
i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: 'en',
		lng: savedLang,
		interpolation: {
			escapeValue: false,
		},
		backend: {
			loadPath: '/locales/{{lng}}/translation.json',
		},
	})

export default i18n
