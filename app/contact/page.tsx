"use client";

import Link from "next/link";
import SiteShell from "../components/site-shell";
import { useLanguage } from "../components/language-provider";

const onboardingSteps = [
  ["01", "Apply online", "Share your basic business details through the merchant application process."],
  ["02", "Complete your KYC", "Submit the required business documents and complete bank account verification."],
  ["03", "Set up your solutions", "Integrate using APIs, plugins, payment links or QR. Test in the sandbox."],
  ["04", "Go live", "Start accepting customer payments and manage transactions in your dashboard."],
] as const;

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <SiteShell>
      <main id="main">
        <section className="inner-hero contact-hero"><div className="container inner-hero-layout"><div><p className="eyebrow eyebrow-light"><span className="eyebrow-line" /> {t("LET'S MOVE YOUR BUSINESS FORWARD")}</p><h1>{t("Start a conversation.")}<br /><span>{t("Find your next move.")}</span></h1><p className="inner-hero-description">{t("Talk to our team about payment solutions, merchant onboarding, pricing or support. We’ll help you find the right next step.")}</p><a className="button button-lime" href="mailto:customercare@imoneypay.in?subject=iMoneyPay%20business%20enquiry">{t("Email our team")} <span>↗</span></a></div><div className="contact-card"><span className="eyebrow">{t("CUSTOMER SUPPORT")}</span><a href="mailto:customercare@imoneypay.in">customercare@imoneypay.in <i>↗</i></a><p>{t("For customer support and payment-related questions.")}</p><span className="contact-card-rule" /><span className="eyebrow">{t("BUSINESS ENQUIRIES")}</span><a href="mailto:customercare@imoneypay.in?subject=Business%20enquiry">{t("Talk to our team")} <i>↗</i></a><p>{t("Merchant onboarding, pricing and solution enquiries.")}</p></div></div></section>
        <section className="contact-start-section section-pad" id="merchant"><div className="container"><div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> {t("BECOME A MERCHANT")}</p><h2>{t("Start accepting digital")}<br />{t("four steps.")}</h2></div><p>{t("Getting started is designed to be straightforward, with an online onboarding process.")}</p></div><div className="onboarding-grid">{onboardingSteps.map(([number, title, description]) => <article className="onboarding-step" key={number}><span className="onboarding-number">{number}</span><i className="onboarding-rule" /><h3>{t(title)}</h3><p>{t(description)}</p></article>)}</div><a className="button button-dark merchant-cta" href="mailto:customercare@imoneypay.in?subject=Become%20a%20merchant">{t("Begin a merchant enquiry")} <span>↗</span></a></div></section>
        <section className="contact-help-section"><div className="container contact-help-layout"><div><p className="eyebrow eyebrow-light"><span className="eyebrow-line" /> {t("NEED A HAND?")}</p><h2>{t("We’re here to help you keep things moving.")}</h2></div><div><p>{t("For payment-related concerns, iMoneyPay provides a defined complaint resolution and escalation process. Get in touch with our support team to understand the right channel for your query.")}</p><Link className="button button-lime" href="mailto:customercare@imoneypay.in?subject=Payment%20support">{t("Contact customer support")} <span>↗</span></Link><Link className="contact-secondary-link" href="/about#grievance">{t("About the grievance process")} <span>↗</span></Link></div></div></section>
      </main>
    </SiteShell>
  );
}
