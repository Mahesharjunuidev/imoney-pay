"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { usePathname } from "next/navigation";
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
const titleByRoute: Record<string, string> = {
  "/": "iMoneyPay | Digital Payments for Bharat Businesses",
  "/payment-solutions": "Payment solutions for businesses | iMoneyPay",
  "/cards-wallets": "Gift Cards, Prepaid Cards & Wallet | iMoneyPay",
  "/imoneypay-app": "iMoneyPay App | Wallet, UPI & Everyday Payments",
  "/about": "About iMoneyPay | Digital Payments Since 2017",
  "/contact": "Contact iMoneyPay | Merchant Enquiries & Support",
};
const descriptionByRoute: Record<string, string> = {
  "/": "Accept customer payments, manage business payouts and reward the people who move you forward with iMoneyPay.",
  "/payment-solutions":
    "Collect customer payments and manage business payouts with iMoneyPay payment solutions.",
  "/cards-wallets":
    "Explore iMoneyPay corporate gift cards, reloadable prepaid cards and everyday wallet services.",
  "/imoneypay-app":
    "Manage your iMoney Wallet, @imoney UPI ID, prepaid card, money transfers and bill payments in one app.",
  "/about":
    "Learn about iMoneyPay's regulated payment services, security commitments and support for businesses across India.",
  "/contact":
    "Contact iMoneyPay about merchant onboarding, pricing, payment solutions or customer support.",
};

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
  const pathname = usePathname();
  const language = useSyncExternalStore(
    subscribeToLanguageChanges,
    getLanguageSnapshot,
    getServerLanguageSnapshot,
  );
  const dictionary = messages[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.title =
      dictionary[titleByRoute[pathname] as keyof Messages] ??
      dictionary[titleByRoute["/"] as keyof Messages];
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        dictionary[descriptionByRoute[pathname] as keyof Messages] ??
          dictionary[descriptionByRoute["/"] as keyof Messages],
      );
  }, [dictionary, language, pathname]);

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
