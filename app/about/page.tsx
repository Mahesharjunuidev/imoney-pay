"use client";

import Link from "next/link";
import SiteShell from "../components/site-shell";
import { useLanguage } from "../components/language-provider";

const trustPoints = [
  ["01", "RBI authorised", "I Money Pay Private Limited is authorised by the Reserve Bank of India as a Payment Aggregator and a Prepaid Payment Instrument issuer."],
  ["02", "Secure fund management", "Merchant funds are maintained in a bank escrow account, separate from the company's own funds."],
  ["03", "Payment security", "Payment transactions are supported by encryption and OTP-based verification mechanisms."],
  ["04", "Data protection", "Payment data is stored in India in accordance with applicable RBI requirements."],
  ["05", "Accessible support", "Customer support channels and dedicated account management for enterprise clients."],
  ["06", "Transparent grievance process", "A defined complaint resolution and escalation process for payment-related concerns."],
] as const;

const industries = ["Retail & local stores", "E-commerce & D2C", "Education", "Healthcare", "Food & restaurants", "Travel & hospitality", "SaaS & technology", "NBFCs & financial services", "Government & NGOs", "Distribution & logistics", "Corporates & HR", "Freelancers & professionals"] as const;

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <SiteShell>
      <main id="main">
        <section className="inner-hero about-hero"><div className="container inner-hero-layout"><div><p className="eyebrow eyebrow-light"><span className="eyebrow-line" /> {t("SERVING INDIAN BUSINESSES SINCE 2017")}</p><h1>{t("Payment solutions,")}<br /><span>{t("grounded in trust.")}</span></h1><p className="inner-hero-description">{t("iMoneyPay brings together regulated payment services and a commitment to responsible payment operations for businesses across India.")}</p><Link className="button button-lime" href="/payment-solutions">{t("Explore our solutions")} <span>↗</span></Link></div><div className="about-stat"><span>2017</span><i /> <p>{t("Supporting Indian businesses")}<br />{t("with digital payment services.")}</p></div></div></section>
        <section className="about-intro-section section-pad"><div className="container about-intro-layout"><p className="eyebrow"><span className="eyebrow-line" /> {t("WHAT WE DO")}</p><div><h2>{t("More ways to move money.")}<br /><span>{t("One trusted partner.")}</span></h2><p>{t("Businesses need convenient ways to collect from customers, pay employees and vendors, and reward the people who contribute to their growth. iMoneyPay brings these requirements together through payment solutions, business payouts, gift cards, prepaid cards and wallet services.")}</p><Link className="text-link" href="/contact">{t("Talk with our team")} <span>↗</span></Link></div></div></section>
        <section className="trust-section section-pad" id="trust"><div className="container trust-layout"><div className="trust-copy"><p className="eyebrow eyebrow-light"><span className="eyebrow-line" /> {t("PAYMENTS BACKED BY RESPONSIBILITY")}</p><h2>{t("Trust, security and")} <span>{t("transparency.")}</span></h2><p>{t("When it comes to managing payments, trust matters. We are committed to responsible payment operations and clear customer support.")}</p><Link className="trust-email" href="mailto:customercare@imoneypay.in">{t("Contact customer support")} <span>↗</span></Link></div><div className="trust-list">{trustPoints.map(([number, title, description]) => <article className="trust-row" key={number}><span>{number}</span><div><h3>{t(title)}</h3><p>{t(description)}</p></div><i aria-hidden="true">↗</i></article>)}</div></div></section>
        <section className="about-industries section-pad" id="industries"><div className="container"><div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> {t("ACROSS INDIA'S BUSINESS LANDSCAPE")}</p><h2>{t("Built for businesses")}<br />{t("across")} <span>{t("industries.")}</span></h2></div><p>{t("From a neighbourhood store to a growing enterprise, iMoneyPay supports businesses across industries, subject to applicable KYC and onboarding requirements.")}</p></div><div className="about-industry-list">{industries.map((industry, index) => <span key={industry}><i>{String(index + 1).padStart(2, "0")}</i>{t(industry)}</span>)}</div></div></section>
        <section className="grievance-section" id="grievance"><div className="container grievance-layout"><div><p className="eyebrow"><span className="eyebrow-line" /> {t("HERE TO HELP")}</p><h2>{t("Support should feel straightforward.")}</h2></div><div><p>{t("For payment-related questions, reach our customer support team. You can also access the defined complaint resolution and escalation process through our Contact page.")}</p><Link className="text-link" href="/contact">{t("Contact iMoneyPay")} <span>↗</span></Link></div></div></section>
      </main>
    </SiteShell>
  );
}
