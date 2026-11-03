"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import english from "../messages/en.json";
import hindi from "../messages/hi.json";

export type Language = "en" | "hi";
type Messages = typeof english;
type LanguageContextValue = {
  readonly language: Language;
  readonly setLanguage: (language: Language) => void;
  readonly t: (sourceText: string) => string;
};

const messages: Record<Language, Messages> = { en: english, hi: hindi };
const LanguageContext = createContext<LanguageContextValue | null>(null);
const languageChangeEvent = "imoneypay-language-change";
const pageTitle = "Voice Form";
const pageDescription = "Create a request using voice entry or manual input.";

function subscribeToLanguageChanges(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(languageChangeEvent, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(languageChangeEvent, onChange);
  };
}

function getLanguageSnapshot(): Language {
  const savedLanguage = window.localStorage.getItem("imoneypay-language");
  return savedLanguage === "hi" ? "hi" : "en";
}

function getServerLanguageSnapshot(): Language {
  return "en";
}

export function LanguageProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const language = useSyncExternalStore(
    subscribeToLanguageChanges,
    getLanguageSnapshot,
    getServerLanguageSnapshot,
  );
  const dictionary = messages[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.title =
      dictionary[pageTitle as keyof Messages] ?? pageTitle;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        dictionary[pageDescription as keyof Messages] ?? pageDescription,
      );
  }, [dictionary, language]);

  const persistLanguage = useCallback((nextLanguage: Language) => {
    window.localStorage.setItem("imoneypay-language", nextLanguage);
    window.dispatchEvent(new Event(languageChangeEvent));
  }, []);

  const translate = useCallback(
    (sourceText: string) => {
      return dictionary[sourceText as keyof Messages] ?? sourceText;
    },
    [dictionary],
  );
  const contextValue = useMemo(
    () => ({ language, setLanguage: persistLanguage, t: translate }),
    [language, persistLanguage, translate],
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
