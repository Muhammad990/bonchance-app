// i18n.js - User Panel translations (8 languages)
import en from "./locales/en";
import uk from "./locales/uk";
import ru from "./locales/ru";
import it from "./locales/it";
import fr from "./locales/fr";
import es from "./locales/es";
import pt from "./locales/pt";
import ar from "./locales/ar";

export const LANGUAGES = [
  "Українська",
  "English",
  "Русский",
  "Italien",
  "Français",
  "Español",
  "Português",
  "العربية",
];

const translations = {
  "Українська": uk,
  English: en,
  "Русский": ru,
  Italien: it,
  "Français": fr,
  Español: es,
  Português: pt,
  "العربية": ar,
};

function isPlainObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

// Deep merge: missing keys fall back to English
function deepMerge(base, override) {
  const out = { ...base };
  if (!isPlainObject(override)) return out;
  Object.keys(override).forEach((key) => {
    const b = base[key];
    const o = override[key];
    if (isPlainObject(b) && isPlainObject(o)) {
      out[key] = deepMerge(b, o);
    } else if (o !== undefined && o !== null && o !== "") {
      out[key] = o;
    }
  });
  return out;
}

const merged = {};
LANGUAGES.forEach((l) => {
  const dict = translations[l] || en;
  merged[l] = dict === en ? en : deepMerge(en, dict);
});

// Helper: interpolate {vars}
function interpolate(template, vars = {}) {
  if (typeof template !== "string") return template;
  return template.replace(/\{([^}]+)\}/g, (_, key) => {
    if (Object.prototype.hasOwnProperty.call(vars, key)) {
      const v = vars[key];
      return v === null || v === undefined ? "" : String(v);
    }
    return `{${key}}`;
  });
}

// Get nested value by dot path: "home.balance"
function getNested(obj, path) {
  if (!obj || !path) return undefined;
  return path
    .split(".")
    .reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
      obj
    );
}

export function translate(lang, key, vars = {}) {
  if (!lang) lang = "English";
  const dict = merged[lang] || merged.English;
  let val = getNested(dict, key);
  if (val === undefined) {
    val = getNested(merged.English, key);
  }
  if (val === undefined) return key; // fallback to key
  return interpolate(val, vars);
}

// Translate a status value coming from the API (e.g. "Approved" -> translated)
const STATUS_KEYS = {
  pending: "common.pending",
  approved: "common.approved",
  rejected: "common.rejected",
  success: "common.completed",
  completed: "common.completed",
  complete: "common.completed",
  failed: "common.failed",
  paid: "common.approved",
};

export function statusLabel(lang, raw) {
  if (raw === null || raw === undefined) return "";
  const text = String(raw);
  const key = STATUS_KEYS[text.trim().toLowerCase()];
  if (!key) return text;
  return translate(lang, key);
}
