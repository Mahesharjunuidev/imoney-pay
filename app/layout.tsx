import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import BackToTop from "./components/back-to-top";
import { LanguageProvider } from "./components/language-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "iMoneyPay | Digital Payments for Bharat Businesses",
  description:
    "Accept customer payments, manage business payouts and reward the people who move you forward with iMoneyPay.",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <BackToTop />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}