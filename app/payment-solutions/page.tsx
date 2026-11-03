"use client";

import Link from "next/link";
import SiteShell from "../components/site-shell";
import { useLanguage } from "../components/language-provider";

const collectionProducts = [
  ["01", "Payment Gateway", "A secure checkout experience for your website or application, with multiple digital payment methods."],
  ["02", "Payment Links", "Collect remotely by sharing a link over SMS, email or messaging platforms. No website required."],
  ["03", "QR Payments", "Accept UPI payments at your counter through QR codes customers scan with their preferred UPI app."],
] as const;

const payoutProducts = [
  ["01", "Business payments", "Transfer money to bank accounts and UPI IDs across India."],
  ["02", "Salary payments", "Manage employee salary disbursements through bulk payment options."],
  ["03", "Vendor payments", "Simplify payments to suppliers, dealers and business partners."],
  ["04", "Refunds", "Manage customer refunds through convenient digital transfers."],
] as const;

function ProductRows({ items }: { readonly items: readonly (readonly [string, string, string])[] }) {
  const { t } = useLanguage();
  return <div className="detail-list">{items.map(([number, title, description]) => <article className="detail-row" key={number}><span>{number}</span><div><h3>{t(title)}</h3><p>{t(description)}</p></div><i aria-hidden="true">↗</i></article>)}</div>;
}

export default function PaymentSolutionsPage() {
  const { t } = useLanguage();

  return (
    <SiteShell>
      <main id="main">
        <section className="inner-hero">
          <div className="container inner-hero-layout">
            <div><p className="eyebrow eyebrow-light"><span className="eyebrow-line" /> {t("PAYMENT SOLUTIONS FOR BUSINESS")}</p><h1>{t("Collect with confidence.")}<br /><span>{t("Pay with clarity.")}</span></h1><p className="inner-hero-description">{t("Bring customer collections and business payouts together with digital payment solutions designed for the way Bharat businesses work.")}</p><div className="hero-actions"><Link className="button button-lime" href="/contact#merchant">{t("Become a merchant")} <span>↗</span></Link><Link className="button button-outline" href="#collect">{t("Explore solutions")} <span>↓</span></Link></div></div>
            <div className="inner-hero-aside"><span className="aside-number">01—02</span><p>{t("COLLECT")}<br /><span>{t("PAY")}</span></p><span className="aside-caption">{t("One merchant dashboard.")}<br />{t("Visibility at every step.")}</span></div>
          </div>
        </section>
        <section className="methods-section"><div className="container methods-inner"><div className="methods-heading"><p className="eyebrow">{t("PAY YOUR CUSTOMERS' WAY")}</p><h2>{t("Flexible payment methods, familiar to your customers.")}</h2></div><div className="method-cloud">{["UPI", "UPI QR", "RuPay", "Visa", "Mastercard", "Debit cards", "Credit cards", "Net banking", "Wallets", "Payment links", "IMPS", "NEFT", "RTGS"].map((method) => <span className="method-tag" key={method}>{t(method)}</span>)}</div></div></section>
        <section className="inner-section section-pad" id="collect"><div className="container inner-section-layout"><div className="inner-section-intro"><p className="eyebrow"><span className="eyebrow-line" /> {t("COLLECT")}</p><h2>{t("Get paid your customers' way.")}</h2><p>{t("Make it easier for customers to pay, whether they shop online, follow a payment link or visit your store. Manage collections through a centralised dashboard.")}</p><div className="spec-block"><span>{t("CHANNELS")}</span><p>{t("Website · Mobile application · Payment links · QR codes")}</p></div><div className="spec-block"><span>{t("TRACKING")}</span><p>{t("Monitor transactions through your merchant dashboard.")}</p></div><Link className="text-link" href="/contact#merchant">{t("Start accepting payments")} <span>↗</span></Link></div><ProductRows items={collectionProducts} /></div><div className="container regulatory-note"><span>ⓘ</span> {t("Payment solutions are offered under iMoneyPay's RBI Payment Aggregator authorisation.")}</div></section>
        <section className="inner-section inner-section-tint section-pad" id="payouts"><div className="container inner-section-layout"><div className="inner-section-intro"><p className="eyebrow"><span className="eyebrow-line" /> {t("PAY")}</p><h2>{t("Business payouts, without the busywork.")}</h2><p>{t("Send money to employees, vendors, customers and partners using convenient digital channels. Manage individual or bulk transfers with clear transaction records and UTR references.")}</p><div className="spec-block"><span>{t("PAYMENT METHODS")}</span><p>{t("IMPS · NEFT · RTGS · UPI")}</p></div><div className="spec-block"><span>{t("PAYMENT CHANNELS")}</span><p>{t("Merchant dashboard · API integration")}</p></div><Link className="text-link" href="/contact">{t("Explore payment solutions")} <span>↗</span></Link></div><ProductRows items={payoutProducts} /></div><div className="container regulatory-note"><span>ⓘ</span> {t("Payment solutions are offered under iMoneyPay's RBI Payment Aggregator authorisation.")}</div></section>
        <section className="developer-section section-pad" id="developer"><div className="container developer-grid"><article className="developer-block"><p className="eyebrow eyebrow-light"><span className="eyebrow-line" /> {t("FOR BUILDERS")}</p><div className="dev-visual" aria-hidden="true"><span className="dev-bracket">&lt;/&gt;</span><span className="dev-pill dev-pill-one">POST /payments</span><span className="dev-pill dev-pill-two">● 200 OK</span><span className="dev-line dev-line-one" /><span className="dev-line dev-line-two" /><span className="dev-line dev-line-three" /></div><h2>{t("Built for easy integration and business growth.")}</h2><p>{t("Connect payment capabilities with REST APIs, real-time webhooks, a test sandbox and supported platform integrations.")}</p><Link className="button button-lime" href="mailto:customercare@imoneypay.in?subject=Request%20API%20access">{t("Request API access")} <span>↗</span></Link></article><article className="pricing-block" id="pricing"><p className="eyebrow"><span className="eyebrow-line" /> {t("CLEAR, BUSINESS-LED PRICING")}</p><span className="pricing-mark" aria-hidden="true">₹</span><h2>{t("Pricing that fits your business.")}</h2><p>{t("Charges are based on your business type and monthly transaction volume. Share your business details to understand applicable options.")}</p><div className="pricing-actions"><Link className="button button-dark" href="mailto:customercare@imoneypay.in?subject=Request%20a%20quote">{t("Get a quote")} <span>↗</span></Link><Link className="text-link" href="/contact">{t("View charges")} <span>↗</span></Link></div></article></div></section>
      </main>
    </SiteShell>
  );
}
