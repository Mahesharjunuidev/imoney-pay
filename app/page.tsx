"use client";

import { useState } from "react";
import SiteShell, { Brand } from "./components/site-shell";
import { useLanguage } from "./components/language-provider";

const solutionContent = {
  collect: {
    eyebrow: "GET PAID YOUR CUSTOMERS' WAY",
    title: "Make every payment feel easy.",
    description:
      "Give customers a convenient way to pay online, on their phone or at your counter. See your collections together in one merchant dashboard.",
    methods: ["UPI", "Cards", "Net banking", "Wallets"],
    channels: ["Website & app", "Payment links", "QR codes"],
    products: [
      ["01", "Payment Gateway", "A secure checkout for your website or application."],
      ["02", "Payment Links", "Collect remotely by sharing a link. No website needed."],
      ["03", "QR Payments", "Let customers scan and pay at your business counter."],
    ],
    cta: "Start accepting payments",
    note: "Payment solutions are offered under iMoneyPay's RBI Payment Aggregator authorisation.",
  },
  pay: {
    eyebrow: "SIMPLIFY BUSINESS TRANSFERS",
    title: "Send money without the busywork.",
    description:
      "Pay employees, vendors, customers and business partners through convenient digital channels. Manage individual or bulk transfers and keep track of every transaction.",
    methods: ["IMPS", "NEFT", "RTGS", "UPI"],
    channels: ["Merchant dashboard", "API integration"],
    products: [
      ["01", "Business Payments", "Transfer money to bank accounts and UPI IDs across India."],
      ["02", "Salary Payments", "Manage employee salary disbursements in bulk."],
      ["03", "Vendor Payments", "Pay suppliers, dealers and business partners."],
      ["04", "Refunds", "Manage customer refunds through digital transfers."],
    ],
    cta: "Explore payment solutions",
    note: "Payment solutions are offered under iMoneyPay's RBI Payment Aggregator authorisation.",
  },
  reward: {
    eyebrow: "RECOGNISE THE PEOPLE WHO MOVE YOU FORWARD",
    title: "Make every reward more meaningful.",
    description:
      "Recognise employees, appreciate partners and engage customers with digital gifting and prepaid payment options made for everyday spending.",
    methods: ["Gift cards", "Prepaid cards", "Digital wallets"],
    channels: ["Bulk gifting", "Reloadable cards", "Everyday payments"],
    products: [
      ["01", "Corporate Gift Cards", "iMoney Elite, Reward and Rocket for gifting and incentives."],
      ["02", "iMoney Prepaid Card", "A General Purpose Reloadable card for everyday spending."],
      ["03", "iMoney Wallet", "Add money, send funds, pay bills and manage transactions."],
    ],
    cta: "Explore cards & wallets",
    note: "Cards and wallets are issued under iMoneyPay's RBI Prepaid Payment Instrument authorisation.",
  },
} as const;

const industries = [
  ["Retail & local stores", "Accept in-store payments with QR codes and payment links.", "QR payments · Payment links"],
  ["E-commerce & D2C", "Collect online through a checkout built for digital commerce.", "Payment gateway · Integrations"],
  ["Education", "Make fee collection and institutional payments convenient.", "Payment links · Gateway · Payments"],
  ["Healthcare", "Make patient and service payments easier to complete.", "QR payments · Links · Gateway"],
  ["Food & restaurants", "Take digital payments at the counter and online.", "QR payments · Payment gateway"],
  ["Travel & hospitality", "Manage guest collections and business payments.", "Gateway · Links · Payments"],
  ["SaaS & technology", "Connect payment capabilities to your platforms.", "APIs · Payment gateway"],
  ["NBFCs & financial services", "Support payment collections and business transfers.", "Payment links · Payments"],
  ["Government & NGOs", "Facilitate digital collections across communities.", "Payment links · QR payments"],
  ["Distribution & logistics", "Manage disbursements and partner rewards.", "Payments · Gift cards"],
  ["Corporates & HR", "Simplify employee payments, incentives and gifting.", "Payments · Gift cards"],
  ["Freelancers & professionals", "Accept payments without building a website.", "Payment links · QR payments"],
] as const;

const faqs = [
  ["What is iMoneyPay?", "iMoneyPay provides digital payment services for businesses and individuals. Businesses can accept customer payments, manage payouts and issue gift cards, while individuals can access the iMoneyPay app, wallet, UPI and prepaid card services."],
  ["Is iMoneyPay authorised by the RBI?", "Yes. I Money Pay Private Limited is authorised by the Reserve Bank of India as a Payment Aggregator and a Prepaid Payment Instrument issuer."],
  ["Can small businesses use iMoneyPay?", "Yes. Businesses, including local retail stores and small establishments, can explore solutions such as QR Payments and Payment Links, subject to applicable KYC and onboarding requirements."],
  ["Which payment methods can customers use?", "Customers can pay through UPI, debit cards, credit cards, net banking and wallets, depending on the payment solution and supported configuration."],
  ["What is the iMoneyPay app used for?", "The iMoneyPay app lets users access their iMoney Wallet, use their @imoney UPI ID, manage their iMoney Prepaid Card, transfer money, and make recharges and bill payments."],
  ["Can I recharge my mobile and pay utility bills through iMoneyPay?", "Yes. The iMoneyPay app supports mobile recharges and selected bill payment services, including electricity, DTH and FASTag recharges."],
  ["Can businesses issue gift cards in bulk?", "Yes. Businesses can order iMoney Elite, Reward and Rocket Gift Cards for corporate gifting, employee rewards and incentive programmes."],
  ["How can I get started as a merchant?", "Apply online, share your business details, complete the required KYC process and configure your preferred payment integration."],
  ["How can I know the charges for iMoneyPay services?", "Payment solution charges depend on your business type and monthly transaction volume. Contact our team to request a customised quotation."],
  ["How can I contact iMoneyPay customer support?", "Reach the customer support team at customercare@imoneypay.in or use the contact details provided on the Contact page."],
] as const;

export default function Home() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<keyof typeof solutionContent>("collect");
  const activeSolution = solutionContent[activeTab];

  return (
    <SiteShell>
      <main id="main">
        <section className="hero-section">
          <div className="hero-grid" aria-hidden="true" />
          <div className="container hero-layout">
            <div className="hero-copy reveal-up">
              <p className="eyebrow eyebrow-light"><span className="eyebrow-line" /> {t("BUILT FOR THE WAY BHARAT DOES BUSINESS")}</p>
              <h1>{t("Payments made simpler for every Bharat business.")}</h1>
              <p className="hero-description">{t("From accepting customer payments to managing vendor payouts and rewarding your people, iMoneyPay brings essential digital payment services together.")}</p>
              <div className="hero-actions">
                <a className="button button-lime" href="#merchant">{t("Become a merchant")} <span aria-hidden="true">↗</span></a>
                <a className="button button-outline" href="#solutions">{t("Explore our solutions")} <span aria-hidden="true">↓</span></a>
              </div>
              <p className="hero-footnote"><span className="since-dot" /> {t("Serving Indian businesses since 2017")}</p>
            </div>
            <div className="hero-art" aria-label={t("Illustration of a business payments dashboard")}>
              <div className="hero-orbit orbit-one" />
              <div className="hero-orbit orbit-two" />
              <div className="dashboard-window">
                <div className="dashboard-top"><span className="window-dots"><i /><i /><i /></span><span>{t("merchant dashboard")}</span><span className="dashboard-avatar">A</span></div>
                <div className="dashboard-content">
                  <div className="dashboard-greeting"><div><span className="mini-label">{t("MONDAY, 3 NOVEMBER")}</span><strong>{t("Good morning, Asha")}</strong></div><span className="dashboard-more">•••</span></div>
                  <div className="balance-panel"><div><span className="mini-label">{t("TOTAL COLLECTIONS")}</span><strong>₹ 2,84,650<span>.00</span></strong></div><span className="balance-change">↗ 12.8%</span><div className="chart-line"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="chart-labels">{["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => <span key={day}>{t(day)}</span>)}</div></div>
                  <div className="dashboard-row-title"><span>{t("Recent payments")}</span><span>{t("View all ↗")}</span></div>
                  <div className="payment-row"><span className="payment-icon payment-icon-lime">U</span><span className="payment-person"><strong>{t("UPI payment")}</strong><small>{t("Today, 10:42 am")}</small></span><strong className="payment-amount">+ ₹2,450</strong></div>
                  <div className="payment-row"><span className="payment-icon payment-icon-peach">↗</span><span className="payment-person"><strong>{t("Payment link")}</strong><small>{t("Today, 10:18 am")}</small></span><strong className="payment-amount">+ ₹8,200</strong></div>
                  <div className="payment-row"><span className="payment-icon payment-icon-mint">▤</span><span className="payment-person"><strong>{t("Card payment")}</strong><small>{t("Today, 09:56 am")}</small></span><strong className="payment-amount">+ ₹1,750</strong></div>
                </div>
              </div>
              <div className="floating-note"><span className="float-check">✓</span><span><strong>{t("Payment received")}</strong><small>{t("₹2,450.00 · just now")}</small></span></div>
              <div className="hero-stamp"><strong>{t("MADE FOR BHARAT")}</strong><i>✳</i></div>
            </div>
          </div>
          <div className="hero-bottom container"><span>{t("COLLECT")}</span><i /><span>{t("PAY")}</span><i /><span>{t("REWARD")}</span><span className="hero-bottom-note">{t("One platform. More ways to move money.")}</span></div>
        </section>

        <section className="methods-section" aria-labelledby="methods-title">
          <div className="container methods-inner">
            <div className="methods-heading"><p className="eyebrow">{t("A BETTER WAY TO PAY")}</p><h2 id="methods-title">{t("Payments that work the way your customers prefer.")}</h2></div>
            <div className="method-cloud">{["UPI", "UPI QR", "RuPay", "Visa", "Mastercard", "Debit cards", "Credit cards", "Net banking", "Wallets", "Payment links", "IMPS", "NEFT", "RTGS"].map((method, index) => <span className={`method-tag${index === 0 || index === 4 || index === 9 ? " method-tag-featured" : ""}`} key={method}>{t(method)}</span>)}</div>
          </div>
        </section>

        <section className="app-section" id="app">
          <div className="container app-layout">
            <div className="phone-stage" aria-label={t("iMoneyPay app screen preview")}>
              <div className="phone-shadow" />
              <div className="phone-frame"><div className="phone-island" /><div className="phone-screen"><div className="phone-status"><span>9:41</span><span>●●● ▰</span></div><div className="phone-brand"><Brand /><span className="phone-avatar">A</span></div><p className="phone-greeting">{t("Good morning,")}</p><strong className="phone-name">Aarav 👋</strong><div className="wallet-panel"><span>{t("iMoney Wallet balance")}</span><strong>₹ 12,450<span>.00</span></strong><div className="wallet-meta"><span>●●●●  2856</span><span>↗ {t("Add money")}</span></div></div><div className="phone-actions"><div><span>↗</span><small>{t("Send")}</small></div><div><span>▦</span><small>{t("Scan & pay")}</small></div><div><span>＋</span><small>{t("Recharge")}</small></div><div><span>⋯</span><small>{t("More")}</small></div></div><div className="upi-card"><span className="upi-card-mark">UPI</span><span>{t("Your UPI ID")}</span><strong>aarav@imoney <i>⧉</i></strong></div><div className="phone-recent"><span>{t("Recent activity")}</span><span>{t("See all ↗")}</span></div><div className="phone-activity"><span className="activity-icon">↙</span><span><strong>{t("Mobile recharge")}</strong><small>{t("Today, 9:32 am")}</small></span><b>− ₹399</b></div></div></div>
              <div className="phone-float phone-float-one"><span>↗</span><span><strong>{t("UPI ID")}</strong><small>@imoney</small></span></div>
              <div className="phone-float phone-float-two"><span className="float-rupee">₹</span><span><strong>{t("Pay bills")}</strong><small>{t("All in one place")}</small></span></div>
              <div className="phone-star" aria-hidden="true">✳</div>
            </div>
            <div className="app-copy">
              <p className="eyebrow"><span className="eyebrow-line" /> {t("SIMPLIFYING YOUR PAYMENT JOURNEY")}</p>
              <h2>{t("Your everyday payments,")} <span>{t("all in one app.")}</span></h2>
              <p>{t("Meet the iMoneyPay app, your companion for everyday digital payments. Manage your wallet, use your own @imoney UPI ID, access your prepaid card and take care of recharges and bills from your smartphone.")}</p>
              <div className="app-feature-list"><span><i>✓</i> {t("Your own @imoney UPI ID")}</span><span><i>✓</i> {t("Wallet and prepaid card")}</span><span><i>✓</i> {t("Recharges and utility bills")}</span><span><i>✓</i> {t("Scan and pay with UPI QR")}</span></div>
              <div className="app-downloads"><a className="store-button" href="#app"><span className="store-icon">▶</span><span><small>{t("GET IT ON")}</small><strong>Google Play</strong></span><span className="store-arrow">↗</span></a><a className="store-button" href="#app"><span className="store-icon store-apple">●</span><span><small>{t("DOWNLOAD ON THE")}</small><strong>App Store</strong></span><span className="store-arrow">↗</span></a></div>
              <p className="app-disclaimer">{t("Mobile app features are subject to applicable terms and eligibility.")}</p>
            </div>
          </div>
        </section>

        <section className="solutions-section section-pad" id="solutions">
          <div className="container">
            <div className="section-heading solutions-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> {t("ONE PLATFORM, THREE WAYS TO GROW")}</p><h2>{t("Collect. Pay. Reward.")}<br /><span>{t("Move business forward.")}</span></h2></div><p>{t("Businesses need more than a way to accept payments. Bring customer collections, business payouts and meaningful rewards together with solutions designed for your operations.")}</p></div>
            <div className="solution-tabs" role="tablist" aria-label={t("Explore iMoneyPay business solutions")}>
              {(["collect", "pay", "reward"] as const).map((tab, index) => <button key={tab} type="button" role="tab" id={`tab-${tab}`} aria-selected={activeTab === tab} aria-controls="solution-panel" className={`solution-tab${activeTab === tab ? " is-active" : ""}`} onClick={() => setActiveTab(tab)}><span>0{index + 1}</span>{t(tab)}<i aria-hidden="true">↗</i></button>)}
            </div>
            <div className="solution-panel" role="tabpanel" id="solution-panel" aria-labelledby={`tab-${activeTab}`}>
              <div className="solution-intro"><p className="eyebrow">{t(activeSolution.eyebrow)}</p><h3>{t(activeSolution.title)}</h3><p className="solution-description">{t(activeSolution.description)}</p><div className="solution-specs"><div><span>{t("PAYMENT METHODS")}</span><p>{activeSolution.methods.map((method, index) => <span key={method}>{t(method)}{index < activeSolution.methods.length - 1 ? " · " : ""}</span>)}</p></div><div><span>{t("PAYMENT CHANNELS")}</span><p>{activeSolution.channels.map((channel, index) => <span key={channel}>{t(channel)}{index < activeSolution.channels.length - 1 ? " · " : ""}</span>)}</p></div><div><span>{t("TRACKING")}</span><p>{t("Transaction visibility from your merchant dashboard.")}</p></div></div><a className="text-link" href="#merchant">{t(activeSolution.cta)} <span>↗</span></a></div>
              <div className="product-list">{activeSolution.products.map(([number, name, description]) => <article className="product-row" key={number}><span className="product-number">{number}</span><div><h4>{t(name)}</h4><p>{t(description)}</p></div><span className="product-arrow" aria-hidden="true">↗</span></article>)}</div>
            </div>
            <p className="regulatory-note"><span>ⓘ</span> {t(activeSolution.note)}</p>
          </div>
        </section>

        <section className="industries-section section-pad" id="industries">
          <div className="container">
            <div className="section-heading industries-heading"><div><p className="eyebrow eyebrow-light"><span className="eyebrow-line" /> {t("MADE FOR MANY MILESTONES")}</p><h2>{t("Built for businesses")}<br />{t("across")} <span>{t("India.")}</span></h2></div><p>{t("Whether you collect payments or make payouts, iMoneyPay supports businesses across industries, subject to applicable KYC and onboarding requirements.")}</p></div>
            <div className="industry-grid">{industries.map(([name, description, products], index) => <article className="industry-item" key={name}><span className="industry-index">{String(index + 1).padStart(2, "0")}</span><h3>{t(name)}</h3><p>{t(description)}</p><span className="industry-products">{t(products)}</span></article>)}</div>
            <div className="industry-footer"><p>{t("Don't see your business here?")} <span>{t("We work with businesses across industries.")}</span></p><a className="button button-lime" href="#contact">{t("Talk to our team")} <span aria-hidden="true">↗</span></a></div>
          </div>
        </section>

        <section className="settlement-section section-pad">
          <div className="container">
            <div className="section-heading settlement-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> {t("CLEAR FROM START TO SETTLEMENT")}</p><h2>{t("From customer payment")}<br />{t("to bank settlement,")} <span>{t("made simple.")}</span></h2></div><p>{t("Manage your collection journey with visibility at every important stage.")}</p></div>
            <div className="journey-line" aria-label={t("Four payment settlement steps")}>{[["01", "Your customer pays", "Customers pay using UPI, cards, net banking or wallets through your website, app or business QR."], ["02", "See it in real time", "Payment information appears on your merchant dashboard, with webhook notifications to your systems."], ["03", "Funds are held securely", "Merchant funds are maintained in a bank escrow account, separate from iMoneyPay's own funds."], ["04", "Receive settlement", "Collected funds are settled to your registered bank account as per the applicable schedule."]].map(([step, title, description]) => <article className="journey-step" key={step}><span className="journey-marker"><i /></span><span className="journey-number">{step} / 04</span><h3>{t(title)}</h3><p>{t(description)}</p></article>)}</div>
          </div>
        </section>

        <section className="trust-section section-pad" id="trust">
          <div className="container trust-layout">
            <div className="trust-copy"><p className="eyebrow eyebrow-light"><span className="eyebrow-line" /> {t("BUILT ON RESPONSIBLE PAYMENTS")}</p><h2>{t("Payments backed by trust, security and transparency.")}</h2><p>{t("When it comes to managing payments, trust matters. iMoneyPay brings together regulated payment services and a commitment to responsible payment operations.")}</p><a className="trust-email" href="mailto:customercare@imoneypay.in">{t("Questions? Talk to our team")} <span>↗</span></a></div>
            <div className="trust-list">{[["01", "RBI authorised", "I Money Pay Private Limited is authorised by the Reserve Bank of India as a Payment Aggregator and a Prepaid Payment Instrument issuer."], ["02", "Secure fund management", "Merchant funds are maintained in a bank escrow account, separate from the company's own funds."], ["03", "Payment security", "Payment transactions are supported by encryption and OTP-based verification mechanisms."], ["04", "Data protection", "Payment data is stored in India in accordance with applicable RBI requirements."], ["05", "Accessible support", "Get assistance through customer support channels, with dedicated account management for enterprise clients."], ["06", "Transparent grievance process", "Access a defined complaint resolution and escalation process for payment-related concerns."]].map(([number, title, description]) => <article className="trust-row" key={number}><span>{number}</span><div><h3>{t(title)}</h3><p>{t(description)}</p></div><i aria-hidden="true">↗</i></article>)}</div>
          </div>
        </section>

        <section className="merchant-section section-pad" id="merchant">
          <div className="container">
            <div className="section-heading merchant-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> {t("YOUR BUSINESS, READY FOR WHAT'S NEXT")}</p><h2>{t("Start accepting digital")}<br />{t("four steps.")}</h2></div><p>{t("Getting started is designed to be straightforward, with an online onboarding process.")}</p></div>
            <div className="onboarding-grid">{[["01", "Apply online", "Share your basic business details through the merchant application process."], ["02", "Complete your KYC", "Submit the required business documents and complete bank account verification."], ["03", "Set up your solutions", "Integrate with APIs, plugins, payment links or QR. Test in the sandbox."], ["04", "Go live", "Start accepting customer payments and manage transactions in your dashboard."]].map(([number, title, description]) => <article className="onboarding-step" key={number}><span className="onboarding-number">{number}</span><i className="onboarding-rule" /><h3>{t(title)}</h3><p>{t(description)}</p></article>)}</div>
            <a className="button button-dark merchant-cta" href="mailto:customercare@imoneypay.in?subject=Become%20a%20merchant">{t("Become a merchant")} <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section className="developer-section section-pad" id="developer">
          <div className="container developer-grid">
            <article className="developer-block"><p className="eyebrow eyebrow-light"><span className="eyebrow-line" /> {t("FOR BUILDERS")}</p><div className="dev-visual" aria-hidden="true"><span className="dev-bracket">&lt;/&gt;</span><span className="dev-pill dev-pill-one">POST /payments</span><span className="dev-pill dev-pill-two">● 200 OK</span><span className="dev-line dev-line-one" /><span className="dev-line dev-line-two" /><span className="dev-line dev-line-three" /></div><h2>{t("Built for easy integration and business growth.")}</h2><p>{t("Connect payment capabilities to your applications with REST APIs, real-time webhooks, a test sandbox and supported platform integrations.")}</p><a className="button button-lime" href="mailto:customercare@imoneypay.in?subject=Request%20API%20access">{t("Request API access")} <span aria-hidden="true">↗</span></a></article>
            <article className="pricing-block" id="pricing"><p className="eyebrow"><span className="eyebrow-line" /> {t("CLEAR, BUSINESS-LED PRICING")}</p><span className="pricing-mark" aria-hidden="true">₹</span><h2>{t("Pricing that fits your business.")}</h2><p>{t("Every business has different payment requirements. Our pricing is based on your business type and monthly transaction volume.")}</p><p>{t("Share your business details with our team to understand applicable transaction charges and available options.")}</p><div className="pricing-actions"><a className="button button-dark" href="mailto:customercare@imoneypay.in?subject=Request%20a%20quote">{t("Get a quote")} <span aria-hidden="true">↗</span></a><a className="text-link" href="#contact">{t("View charges")} <span>↗</span></a></div></article>
          </div>
        </section>

        <section className="faq-section section-pad" id="faq">
          <div className="container faq-layout"><div className="faq-heading"><p className="eyebrow"><span className="eyebrow-line" /> {t("A FEW GOOD QUESTIONS")}</p><h2>{t("Everything you need to know about iMoneyPay.")}</h2><p>{t("Still have a question? Our team is happy to help.")}</p><a className="text-link" href="mailto:customercare@imoneypay.in">{t("Contact customer support")} <span>↗</span></a></div><div className="faq-list">{faqs.map(([question, answer], index) => <details className="faq-item" key={question}><summary><span className="faq-number">{String(index + 1).padStart(2, "0")}</span><span>{t(question)}</span><i aria-hidden="true" /></summary><p>{t(answer)}</p></details>)}</div></div>
        </section>

        <section className="closing-section" id="contact"><div className="closing-pattern" aria-hidden="true" /><div className="container closing-content"><p className="eyebrow eyebrow-light"><span className="eyebrow-line" /> {t("YOUR NEXT MOVE STARTS HERE")}</p><h2>{t("Ready to collect, pay and reward with iMoneyPay?")}</h2><p>{t("Bring your business payment requirements together with digital solutions designed for the evolving needs of Bharat businesses.")}</p><div className="closing-actions"><a className="button button-lime" href="#merchant">{t("Become a merchant")} <span aria-hidden="true">↗</span></a><a className="button button-outline" href="mailto:customercare@imoneypay.in?subject=Talk%20to%20iMoneyPay">{t("Talk to our team")} <span aria-hidden="true">↗</span></a></div><span className="closing-star" aria-hidden="true">✳</span></div></section>
      </main>

    </SiteShell>
  );
}
