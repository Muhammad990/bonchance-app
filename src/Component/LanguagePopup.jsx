import React from "react";
import "./LanguagePopup.css";
import { LANGUAGES } from "../i18n";
import { useLanguage } from "../LanguageContext";

export default function LanguagePopup({ open, onClose, lang, setLang }) {
  const { t } = useLanguage();
  if (!open) return null;
  return (
    <div className="lang_modal_overlay" onClick={onClose}>
      <div className="lang_modal_content" onClick={(e) => e.stopPropagation()}>
        <div className="lang_modal_header">
          <span>{t("common.select_language")}</span>
          <button className="lang_modal_close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="lang_modal_list">
          {LANGUAGES.map((l) => (
            <div
              key={l}
              className={`lang_item ${lang === l ? "active" : ""}`}
              onClick={() => {
                setLang(l);
                onClose();
              }}
            >
              <span className="lang_name">{l}</span>
              {lang === l && <span className="lang_check">✓</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}