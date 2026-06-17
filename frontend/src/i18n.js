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
  ta: {
    translation: {
      hero: {
        badge: "உயர்தர சொகுசின் புதிய யுகம்",
        title1: "உங்கள்",
        title_gradient: "உடலை",
        title2: "வடிவமைக்கவும்",
        subtitle: "சொகுசு விளையாட்டு செயல்திறனின் எதிர்காலத்தில் அடியெடுத்து வையுங்கள். உயர்தர உயிர் கண்காணிப்பு, தனிப்பயன் பயிற்சி மற்றும் உலர்தர மீட்பு அறைகள்.",
        btn_primary: "பிளாக் ஷீப் எலைட்டில் சேரவும்",
        btn_secondary: "கதையை கண்டறியவும்",
        scroll: "கீழே உருட்டவும்"
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
      escapeValue: false
    }
  });

export default i18n;
