"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Configurator from "@/components/features/Configurator";
import { useTranslation } from "@/lib/i18n";

export default function ConfiguratorPage() {
  const { t } = useTranslation();

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-28 pb-16 px-6 md:px-12 bg-background">
        <div className="max-w-6xl mx-auto mb-10 text-center">
          <span className="editorial-lead text-xs text-primary font-semibold">{t("configurator.tagline")}</span>
          <h1 className="text-4xl md:text-5xl font-serif mt-2 mb-4 font-light uppercase tracking-wider">
            {t("configurator.title")}
          </h1>
          <p className="text-sm text-foreground/60 max-w-lg mx-auto font-light leading-relaxed">
            {t("configurator.desc")}
          </p>
        </div>
        <Configurator />
      </main>
      <Footer />
    </>
  );
}
