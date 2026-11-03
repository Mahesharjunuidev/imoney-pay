"use client";

import Link from "next/link";
import SiteShell from "../components/site-shell";
import { useLanguage } from "../components/language-provider";

const cardProducts = [
  [
    "01",
    "iMoney Elite Gift Card",
    "A premium gifting option for employee recognition, customer appreciation and business occasions.",
  ],
  [
    "02",
    "iMoney Reward Gift Card",
    "Recognise teams and partners with a digital reward they can use on their terms.",
  ],
  [
    "03",
    "iMoney Rocket Gift Card",
    "A flexible option for incentive programmes, festive gifting and bulk corporate rewards.",
  ],
] as const;

export default function CardsWalletsPage() {
  const { t } = useLanguage();

  return (
    <SiteShell>
      <main id="main">
        <section className="inner-hero inner-hero-lime">
          <div className="container inner-hero-layout">
            <div>
              <p className="eyebrow">
                <span className="eyebrow-line" /> {t("GIVE VALUE THAT TRAVELS")}
              </p>
              <h1>
                {t("Rewards for today.")}
                <br />
                <span>{t("Spend for tomorrow.")}</span>
              </h1>
              <p className="inner-hero-description">
                {t(
                  "From corporate gift cards to reloadable prepaid cards and everyday wallets, find more meaningful ways to reward and manage spending.",
                )}
              </p>
              <div className="hero-actions">
                <Link className="button button-dark" href="/contact">
                  {t("Explore gift cards")} <span>↗</span>
                </Link>
                <Link
                  className="button inner-button-outline"
                  href="#gift-cards"
                >
                  {t("See the range")} <span>↓</span>
                </Link>
              </div>
            </div>
            <div
              className="reward-art"
              aria-label={t("Illustration of iMoneyPay gift and prepaid cards")}
            >
              <div className="reward-disc" />
              <div className="reward-card reward-card-back">
                <span>iMoneyPay</span>
                <strong>
                  {t("REWARD")}
                  <br />
                  {t("SOMEONE.")}
                </strong>
                <i>✳</i>
              </div>
              <div className="reward-card reward-card-front">
                <span>
                  iMoneyPay <small>{t("GIFT")}</small>
                </span>
                <strong>
                  {t("Good things")}
                  <br />
                  {t("are on the way.")}
                </strong>
                <i>₹</i>
              </div>
              <span className="reward-spark reward-spark-one">✳</span>
              <span className="reward-spark reward-spark-two">✳</span>
            </div>
          </div>
        </section>
        <section className="inner-section section-pad" id="gift-cards">
          <div className="container inner-section-layout">
            <div className="inner-section-intro">
              <p className="eyebrow">
                <span className="eyebrow-line" /> {t("CORPORATE GIFT CARDS")}
              </p>
              <h2>{t("A good reward says a lot.")}</h2>
              <p>
                {t(
                  "Recognise employees, appreciate business partners and engage customers with digital gift cards for incentives, milestones and festive occasions.",
                )}
              </p>
              <div className="spec-block">
                <span>{t("MADE FOR")}</span>
                <p>
                  {t(
                    "Employee rewards · Incentives · Corporate gifting · Festive occasions",
                  )}
                </p>
              </div>
              <Link
                className="text-link"
                href="mailto:customercare@imoneypay.in?subject=Corporate%20gift%20cards"
              >
                {t("Enquire about bulk gifting")} <span>↗</span>
              </Link>
            </div>
            <div className="detail-list">
              {cardProducts.map(([number, title, description]) => (
                <article className="detail-row" key={number}>
                  <span>{number}</span>
                  <div>
                    <h3>{t(title)}</h3>
                    <p>{t(description)}</p>
                  </div>
                  <i aria-hidden="true">↗</i>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="product-feature-section" id="prepaid-card">
          <div className="container product-feature-layout">
            <div className="feature-card-visual">
              <div className="prepaid-card">
                <span>
                  iMoneyPay <small>{t("PREPAID")}</small>
                </span>
                <i className="chip-mark" />
                <strong>•••• &nbsp; •••• &nbsp; •••• &nbsp; 4286</strong>
                <div>
                  <span>{t("IMONEY PREPAID CARD")}</span>
                  <b>VISA</b>
                </div>
              </div>
              <span className="feature-caption">
                {t("Everyday spending, on your terms.")}
              </span>
            </div>
            <div className="product-feature-copy">
              <p className="eyebrow">
                <span className="eyebrow-line" /> {t("RELOADABLE PREPAID")}
              </p>
              <h2>{t("Your card. Your everyday.")}</h2>
              <p>
                {t(
                  "The iMoney Prepaid Card is a General Purpose Reloadable card for everyday online and in-store spending.",
                )}
              </p>
              <ul className="feature-bullets">
                <li>
                  {t("Manage your prepaid card through the iMoneyPay app.")}
                </li>
                <li>
                  {t("Use it for everyday online and in-store purchases.")}
                </li>
                <li>{t("Reloadable prepaid payment option.")}</li>
              </ul>
              <Link className="text-link" href="/imoneypay-app">
                {t("Explore the iMoneyPay app")} <span>↗</span>
              </Link>
            </div>
          </div>
        </section>
        <section
          className="inner-section inner-section-tint section-pad"
          id="wallet"
        >
          <div className="container inner-section-layout">
            <div className="inner-section-intro">
              <p className="eyebrow">
                <span className="eyebrow-line" /> {t("EVERYDAY WALLET")}
              </p>
              <h2>{t("Everyday money, together in one place.")}</h2>
              <p>
                {t(
                  "Add money, send funds, pay bills and manage everyday transactions through your iMoneyPay app.",
                )}
              </p>
              <div className="spec-block">
                <span>{t("IN THE APP")}</span>
                <p>
                  {t("Wallet · UPI · Prepaid card · Recharges · Bill payments")}
                </p>
              </div>
              <Link className="text-link" href="/imoneypay-app">
                {t("Discover the iMoneyPay app")} <span>↗</span>
              </Link>
            </div>
            <div className="wallet-quote">
              <span>“</span>
              <p>
                {t(
                  "A simpler way to manage everyday payments, right from your phone.",
                )}
              </p>
              <i>iMoneyPay Wallet</i>
            </div>
          </div>
          <div className="container regulatory-note">
            <span>ⓘ</span>{" "}
            {t(
              "Cards and wallets are issued under iMoneyPay's RBI Prepaid Payment Instrument authorisation.",
            )}
          </div>
        </section>
        <section className="inner-cta">
          <div className="container inner-cta-content">
            <p className="eyebrow eyebrow-light">
              <span className="eyebrow-line" />{" "}
              {t("REWARD PEOPLE THE WAY THEY LIKE")}
            </p>
            <h2>
              {t("Make your next reward")}
              <br />
              {t("a little more personal.")}
            </h2>
            <Link
              className="button button-lime"
              href="mailto:customercare@imoneypay.in?subject=Gift%20cards%20and%20prepaid%20cards"
            >
              {t("Talk to our team")} <span>↗</span>
            </Link>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
