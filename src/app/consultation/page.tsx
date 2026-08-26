"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Consultation from "@/components/features/Consultation";
import { useTranslation } from "@/lib/i18n";

export default function ConsultationPage() {
  const { t } = useTranslation();

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-28 pb-16 px-6 md:px-12 bg-background">
        <div className="max-w-xl mx-auto mb-10 text-center">
          <span className="editorial-lead text-xs text-primary font-semibold">{t("consultation.tagline")}</span>
          <h1 className="text-4xl md:text-5xl font-serif mt-2 mb-4 font-light uppercase tracking-wider">
            {t("consultation.title")}
          </h1>
          <p className="text-sm text-foreground/60 font-light leading-relaxed">
            {t("consultation.desc")}
          </p>
        </div>
        <Consultation />
      </main>
      <Footer />
    </>
  );
}
