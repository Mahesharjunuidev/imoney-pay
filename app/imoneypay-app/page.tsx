"use client";

import Link from "next/link";
import SiteShell from "../components/site-shell";
import { useLanguage } from "../components/language-provider";

const appFeatures = [
  [
    "01",
    "Your own @imoney UPI ID",
    "A personal UPI ID for everyday digital payments.",
  ],
  [
    "02",
    "iMoney Wallet",
    "Add money, send funds and manage everyday transactions.",
  ],
  [
    "03",
    "iMoney Prepaid Card",
    "Access and manage your reloadable prepaid payment option.",
  ],
  [
    "04",
    "Recharges & bill payments",
    "Take care of mobile recharges and selected utility bills.",
  ],
  ["05", "Scan and pay", "Pay at participating businesses using UPI QR."],
] as const;

export default function ImoneyPayAppPage() {
  const { t } = useLanguage();

  return (
    <SiteShell>
      <main id="main">
        <section className="inner-hero app-page-hero">
          <div className="container inner-hero-layout">
            <div>
              <p className="eyebrow eyebrow-light">
                <span className="eyebrow-line" />{" "}
                {t("SIMPLIFYING YOUR PAYMENT JOURNEY")}
              </p>
              <h1>
                {t("Your everyday payments,")}
                <br />
                <span>{t("all in one app.")}</span>
              </h1>
              <p className="inner-hero-description">
                {t(
                  "Manage your iMoney Wallet, use your own @imoney UPI ID, access your prepaid card and take care of recharges and bills from your smartphone.",
                )}
              </p>
              <div className="hero-actions" id="download">
                <Link
                  className="button button-lime"
                  href="mailto:customercare@imoneypay.in?subject=iMoneyPay%20app%20download"
                >
                  {t("Download for Android")} <span>↗</span>
                </Link>
                <Link
                  className="button button-outline"
                  href="mailto:customercare@imoneypay.in?subject=iMoneyPay%20app%20download"
                >
                  {t("Download for iOS")} <span>↗</span>
                </Link>
              </div>
              <p className="app-disclaimer">
                {t(
                  "Mobile app features are subject to applicable terms and eligibility.",
                )}
              </p>
            </div>
            <div
              className="app-page-art"
              aria-label={t("iMoneyPay app home screen preview")}
            >
              <div className="app-page-orbit" />
              <div className="app-page-phone">
                <div className="app-page-notch" />
                <div className="app-page-status">
                  <span>9:41</span>
                  <span>●●● ▰</span>
                </div>
                <div className="app-page-brand">
                  <span className="brand-mark" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <strong>
                    iMoney<span>Pay</span>
                  </strong>
                  <i>A</i>
                </div>
                <p>{t("Good morning,")}</p>
                <h2>Aarav 👋</h2>
                <div className="app-wallet-panel">
                  <span>{t("iMoney Wallet balance")}</span>
                  <strong>
                    ₹ 12,450<span>.00</span>
                  </strong>
                  <small>
                    ●●●● 2856 <b>↗ {t("Add money")}</b>
                  </small>
                </div>
                <div className="app-action-grid">
                  <span>
                    <i>↗</i>
                    {t("Send")}
                  </span>
                  <span>
                    <i>▦</i>
                    {t("Scan & pay")}
                  </span>
                  <span>
                    <i>＋</i>
                    {t("Recharge")}
                  </span>
                  <span>
                    <i>⋯</i>
                    {t("More")}
                  </span>
                </div>
                <div className="app-upi-panel">
                  <small>{t("YOUR UPI ID")}</small>
                  <strong>
                    aarav@imoney <i>⧉</i>
                  </strong>
                </div>
                <div className="app-activity">
                  <span>↙</span>
                  <div>
                    <strong>{t("Mobile recharge")}</strong>
                    <small>{t("Today, 9:32 am")}</small>
                  </div>
                  <b>− ₹399</b>
                </div>
              </div>
              <span className="app-page-float">
                {t("UPI ID")}
                <br />
                <strong>@imoney</strong>
              </span>
            </div>
          </div>
        </section>
        <section className="methods-section">
          <div className="container methods-inner">
            <div className="methods-heading">
              <p className="eyebrow">{t("PAYMENTS FOR EVERY DAY")}</p>
              <h2>
                {t("One app for the little things and the important ones.")}
              </h2>
            </div>
            <p className="app-method-copy">
              {t(
                "Send money, pay bills, recharge your mobile or scan a QR. iMoneyPay helps bring your everyday digital payments into one convenient place.",
              )}
            </p>
          </div>
        </section>
        <section className="inner-section section-pad">
          <div className="container app-feature-layout">
            <div className="inner-section-intro">
              <p className="eyebrow">
                <span className="eyebrow-line" /> {t("MADE FOR YOUR EVERYDAY")}
              </p>
              <h2>{t("Your payment essentials, in one place.")}</h2>
              <p>
                {t(
                  "From your UPI ID to your prepaid card, the iMoneyPay app brings together convenient ways to move and manage money.",
                )}
              </p>
              <Link className="text-link" href="#download">
                {t("Get the app")} <span>↗</span>
              </Link>
            </div>
            <div className="detail-list">
              {appFeatures.map(([number, title, description]) => (
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
        <section className="app-steps-section">
          <div className="container app-steps-layout">
            <div>
              <p className="eyebrow">
                <span className="eyebrow-line" /> {t("GET STARTED")}
              </p>
              <h2>
                {t("Simple to start.")}
                <br />
                <span>{t("Easy to keep close.")}</span>
              </h2>
            </div>
            <div className="app-steps">
              <article>
                <span>01</span>
                <p>{t("Download the iMoneyPay app on your smartphone.")}</p>
              </article>
              <article>
                <span>02</span>
                <p>
                  {t(
                    "Register and complete the applicable verification steps.",
                  )}
                </p>
              </article>
              <article>
                <span>03</span>
                <p>
                  {t(
                    "Set up your wallet, UPI ID and preferred payment options.",
                  )}
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
