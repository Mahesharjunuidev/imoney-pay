"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "./language-provider";

function scrollToTop() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
}

export default function BackToTop() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function updateVisibility() {
      setVisible(window.scrollY > 360);
    }

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return (
    <button
      className={`back-to-top-button${visible ? " is-visible" : ""}`}
      type="button"
      aria-label={t("Back to top")}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={scrollToTop}
    >
      <span aria-hidden="true">↑</span>
    </button>
  );
}
