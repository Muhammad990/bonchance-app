import React, { createContext, useContext, useEffect, useState } from "react";
import { translate } from "./i18n";
import { API_URL } from "./api";

const LanguageContext = createContext({
  lang: "English",
  setLang: () => {},
  t: (key, vars) => key,
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const savedOverride = localStorage.getItem("app_lang_override");
      if (savedOverride) return savedOverride;
      const legacySaved = localStorage.getItem("app_lang");
      if (legacySaved) return legacySaved;
    } catch (e) {
      // ignore
    }
    return "English";
  });

  const setLang = (nextLang) => {
    setLangState(nextLang);
    try {
      localStorage.setItem("app_lang_override", nextLang);
      localStorage.setItem("app_lang", nextLang);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    let alive = true;
    try {
      if (localStorage.getItem("app_lang_override")) return undefined;
      if (localStorage.getItem("app_lang") === null) {
        // no legacy selection
      }
    } catch (e) {
      // ignore storage access errors
    }

    fetch(`${API_URL}/api/settings`)
      .then((res) => res.json())
      .then((json) => {
        if (!alive || !json?.success || !json.data?.defaultLanguage) return;
        const map = {
          uk: "Українська",
          en: "English",
          ru: "Русский",
          it: "Italien",
          fr: "Français",
          es: "Español",
          pt: "Português",
          ar: "العربية",
        };
        const defaultLanguage = map[json.data.defaultLanguage] || "English";
        setLangState(defaultLanguage);
        try {
          localStorage.setItem("app_lang", defaultLanguage);
        } catch (e) {
          // ignore
        }
      })
      .catch(() => {});

    return () => { alive = false; };
  }, []);

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