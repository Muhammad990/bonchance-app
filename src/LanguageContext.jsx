import React, { createContext, useContext, useEffect, useState } from "react";
import { translate } from "./i18n";

const LanguageContext = createContext({
  lang: "English",
  setLang: () => {},
  t: (key, vars) => key,
});

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem("app_lang");
      if (saved) return saved;
    } catch (e) {
      // ignore
    }
    return "English";
  });

  useEffect(() => {
    try {
      localStorage.setItem("app_lang", lang);
    } catch (e) {
      // ignore
    }
    try {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "العربية" ? "rtl" : "ltr";
    } catch (e) {
      // ignore
    }
  }, [lang]);

  const t = (key, vars) => translate(lang, key, vars);
  const value = { lang, setLang, t };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Fallback if used outside provider
    return {
      lang: "English",
      setLang: () => {},
      t: (key, vars) => translate("English", key, vars),
    };
  }
  return ctx;
}