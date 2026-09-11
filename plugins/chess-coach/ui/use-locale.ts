import { useEffect, useRef, useState } from "react";
import { detectLocale, isLocale, translate, type Locale } from "./i18n";
import { loadLocale, saveLocale } from "./api";
const storageKey = "chess-coach-locale";
function initialLocale(): Locale {
  try {
    const stored = localStorage.getItem(storageKey);
    if (isLocale(stored)) return stored;
  } catch {
    /* Browser preferences still work when storage is unavailable. */
  }
  return detectLocale(navigator.languages ?? [navigator.language]);
}
function remember(locale: Locale) {
  try {
    localStorage.setItem(storageKey, locale);
  } catch {
    /* The server also persists the choice across port changes. */
  }
}
export function useLocale(onSaveError: () => void) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const changed = useRef(false);
  const saves = useRef<Promise<unknown>>(Promise.resolve());
  useEffect(() => {
    let mounted = true;
    void loadLocale()
      .then((preference) => {
        if (mounted && !changed.current && isLocale(preference.locale)) {
          setLocale(preference.locale);
          remember(preference.locale);
        }
      })
      .catch(() => {
        /* Keep the browser language until the service is available. */
      });
    return () => {
      mounted = false;
    };
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = translate(locale, "pageTitle");
  }, [locale]);
  function changeLocale(next: Locale) {
    changed.current = true;
    setLocale(next);
    remember(next);
    // Serialize rapid switches so the last explicit choice is the one persisted.
    saves.current = saves.current
      .catch(() => {})
      .then(() => saveLocale(next))
      .catch(onSaveError);
  }
  return { locale, changeLocale };
}
