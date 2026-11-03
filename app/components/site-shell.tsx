"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "./language-provider";

const navItems = [
  ["Home", "/"],
  ["Payment Solutions", "/payment-solutions"],
  ["Cards & Wallets", "/cards-wallets"],
  ["iMoneyPay App", "/imoneypay-app"],
  ["About", "/about"],
  ["Contact", "/contact"],
] as const;

export function Brand({ inverse = false }: { readonly inverse?: boolean }) {
  const { t } = useLanguage();

  return (
    <Link className={`brand${inverse ? " brand-inverse" : ""}`} href="/" aria-label={t("iMoneyPay home")}>
      <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
      <span>iMoney<span className="brand-light">Pay</span></span>
    </Link>
  );
}

function SiteHeader() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function updateScrollState() {
      setScrolled(window.scrollY > 24);
    }

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">{t("Skip to content")}</a>
      <div className="utility-bar">
        <div className="container utility-inner">
          <p><span className="status-dot" /> {t("RBI-authorised Payment Aggregator & PPI Issuer")}</p>
          <div className="utility-actions">
            <div className="quick-links">
              <Link href="/contact">{t("Merchant login")} <span>↗</span></Link>
              <Link href="/imoneypay-app">{t("App login")} <span>↗</span></Link>
              <Link href="/cards-wallets">{t("Gift card login")} <span>↗</span></Link>
            </div>
            <fieldset className="language-switch">
              <legend>{t("Select language")}</legend>
              <button type="button" aria-label={t("Switch to English")} aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button>
              <button type="button" aria-label={t("Switch to Hindi")} aria-pressed={language === "hi"} onClick={() => setLanguage("hi")}>हिन्दी</button>
            </fieldset>
          </div>
        </div>
      </div>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`} id="top">
        <div className="container nav-inner">
          <Brand />
          <button className="menu-toggle" type="button" aria-label={t(menuOpen ? "Close navigation" : "Open navigation")} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span />
          </button>
          <nav className={`main-nav${menuOpen ? " is-open" : ""}`} aria-label={t("Main navigation")}>
            {navItems.map(([label, href]) => <Link className={pathname === href ? "is-current" : undefined} aria-current={pathname === href ? "page" : undefined} key={href} href={href} onClick={() => setMenuOpen(false)}>{t(label)}</Link>)}
            <Link className="button button-small button-dark nav-cta" href="/contact#merchant" onClick={() => setMenuOpen(false)}>{t("Become a merchant")} <span aria-hidden="true">↗</span></Link>
          </nav>
        </div>
      </header>
    </>
  );
}

function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand"><Brand inverse /><p>{t("Digital payment solutions for the businesses shaping Bharat.")}</p><span className="footer-authorisation"><i /> {t("RBI-authorised Payment Aggregator & PPI Issuer")}</span></div>
        <div className="footer-column"><span>{t("EXPLORE")}</span><Link href="/payment-solutions">{t("Payment solutions")}</Link><Link href="/cards-wallets">{t("Cards & wallets")}</Link><Link href="/imoneypay-app">{t("iMoneyPay app")}</Link><Link href="/about#industries">{t("Industries")}</Link></div>
        <div className="footer-column"><span>{t("RESOURCES")}</span><Link href="/payment-solutions#developer">{t("Developer integration")}</Link><Link href="/payment-solutions#pricing">{t("Pricing & charges")}</Link><Link href="/#faq">{t("Frequently asked questions")}</Link><Link href="/contact#merchant">{t("Become a merchant")}</Link></div>
        <div className="footer-column"><span>{t("GET IN TOUCH")}</span><a href="mailto:customercare@imoneypay.in">customercare@imoneypay.in</a><Link href="/contact">{t("Contact our team ↗")}</Link><Link href="/about#trust">{t("Trust & security")}</Link></div>
      </div>
      <div className="container footer-bottom"><span>© 2026 I Money Pay Private Limited. {t("All rights reserved.")}</span><div><Link href="/about#trust">{t("Privacy")}</Link><Link href="/about#trust">{t("Terms")}</Link><Link href="/about#grievance">{t("Grievance redressal")}</Link></div></div>
    </footer>
  );
}

export default function SiteShell({ children }: { readonly children: React.ReactNode }) {
  return <><SiteHeader />{children}<SiteFooter /></>;
}
