import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      hero: {
        badge: "The New Era of High-Performance Luxury",
        title1: "FORGE YOUR",
        title_gradient: "ULTIMATE",
        title2: "PHYSIQUE",
        subtitle: "Step into the future of luxury athletic performance. High-performance bio-monitoring, custom physiological coaching, and world-class recovery chambers.",
        btn_primary: "Join Black Sheep Elite",
        btn_secondary: "Discover Story",
        scroll: "Scroll Down"
      }
    }
  },
  es: {
    translation: {
      hero: {
        badge: "La Nueva Era del Lujo de Alto Rendimiento",
        title1: "FORJA TU",
        title_gradient: "FÍSICO",
        title2: "DEFINITIVO",
        subtitle: "Adéntrate en el futuro del rendimiento atlético de lujo. Biomonitoreo de alto rendimiento, entrenamiento fisiológico personalizado y cámaras de recuperación de clase mundial.",
        btn_primary: "Únete a la Élite Black Sheep",
        btn_secondary: "Descubre la Historia",
        scroll: "Desplázate"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
