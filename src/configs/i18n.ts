import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en";
import es from "../locales/es";
import zhCN from "../locales/zh-cn";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    es: {
      translation: es,
    },
    "zh-cn": {
      translation: zhCN,
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
