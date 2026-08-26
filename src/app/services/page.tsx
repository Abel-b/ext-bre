"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { db, HairService } from "@/lib/db";
import { Scissors, Sparkles, Heart, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

export default function ServicesPage() {
  const { t } = useTranslation();
  const [services, setServices] = useState<HairService[]>([]);

  useEffect(() => {
    setServices(db.getServices());
  }, []);

  const extensions = services.filter((s) => s.category === "extensions");
  const care = services.filter((s) => s.category === "care");
  const styling = services.filter((s) => s.category === "styling");

  // Localized service titles/descriptions for static DB values
  const getLocalizedService = (srv: HairService) => {
    let name = srv.name;
    let description = srv.description;
    let details = srv.details;

    if (srv.id === "keratin-bonds") {
      name = t("configurator.volMax").includes("Couture") ? "Keratin Bond System" : "Keratin Bondings";
      description = t("locale") === "en"
        ? "Individually bonded premium keratin extensions. Provides maximum natural movement and styling flexibility."
        : "Individuell eingearbeitete Premium-Keratinbonds. Bietet maximale natürliche Bewegung und Styling-Flexibilität.";
      details = t("locale") === "en"
        ? "Lasts 4-6 months. Ideal for standard to thick hair seeking dramatic transformations. Utilizes Italian premium keratin bonds."
        : "Haltbarkeit 4-6 Monate. Ideal für normales bis dickes Haar für dramatische Längen. Einarbeitung mit italienischem Premium-Keratin.";
    } else if (srv.id === "tape-in") {
      name = t("locale") === "en" ? "Invisible Tape-Ins" : "Unsichtbare Tape-Ins";
      description = t("locale") === "en"
        ? "Sleek, lightweight, flat-laying tapes designed to blend perfectly with fine and normal hair textures."
        : "Flache, ultraleichte Tapes, die sich perfekt in feines und normales Haar einblenden.";
      details = t("locale") === "en"
        ? "Lasts 6-8 weeks. Quick installation, reusable hair panels. Ideal for subtle volume and moderate lengthening."
        : "Tragezeit 6-8 Wochen. Schnelle Einarbeitung, wiederverwendbare Haartressen. Ideal für Fülle und dezente Verlängerung.";
    } else if (srv.id === "invisible-weft") {
      name = t("locale") === "en" ? "Invisible Genius Weft" : "Unsichtbare Genius-Tressen";
      description = t("locale") === "en"
        ? "Sewn-in extensions with ultra-thin hand-tied tracks. Ideal for maximum volume and full density without glue."
        : "Eingenähte Haartressen mit extrem flachem Hand-Tied-Verlauf. Perfekt für Fülle ohne Hitze oder Kleber.";
      details = t("locale") === "en"
        ? "Requires adjustment every 6-8 weeks. No heat, solvents or adhesives applied. Maximum comfort for heavy hair volume."
        : "Hochsetzen alle 6-8 Wochen erforderlich. Einarbeitung ohne Hitze oder Lösungsmittel. Hoher Tragekomfort.";
    } else if (srv.id === "color-match-cut") {
      name = t("locale") === "en" ? "Bespoke Balayage & Blend" : "Balayage & Blending-Schnitt";
      description = t("locale") === "en"
        ? "Custom coloring, toner, and expert blending cut to integrate extensions seamlessly with your natural hair."
        : "Individuelle Färbung, Abmattierung und Blending-Haarschnitt zur nahtlosen Integration der Extensions.";
      details = t("locale") === "en"
        ? "Recommended with every new extension setup. Includes signature styling wave finish."
        : "Empfohlen bei jeder neuen Haarverlängerung. Inklusive Signature-Styling.";
    } else if (srv.id === "premium-treatment") {
      name = t("locale") === "en" ? "Olaplex & Caviar Deep Care" : "Olaplex & Kaviar-Tiefenpflege";
      description = t("locale") === "en"
        ? "An intensive molecular restructuring treatment to keep natural hair and extensions glossy and protected."
        : "Intensivpflege zur molekularen Haarstrukturierung. Schützt Naturhaar und Extensions für maximalen Glanz.";
      details = t("locale") === "en"
        ? "Ideal as a maintenance treatment between extension refits."
        : "Ideal zur Pflege zwischen den Refit-Terminen.";
    }

    return { ...srv, name, description, details };
  };

  const renderServiceSection = (title: string, subtitle: string, list: HairService[], icon: React.ReactNode) => {
    if (list.length === 0) return null;
    return (
      <div className="space-y-8 pt-10 border-t border-card-border/40 first:border-t-0 first:pt-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 border border-primary/25 rounded-full bg-primary/5 text-primary">
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold uppercase tracking-wider text-foreground">{title}</h2>
            <span className="text-[10px] text-foreground/45 uppercase tracking-widest">{subtitle}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {list.map(getLocalizedService).map((srv) => (
            <div
              key={srv.id}
              className="border border-card-border rounded-2xl p-6 bg-card-bg glow-gold flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-base font-serif font-semibold text-foreground uppercase tracking-wide">
                    {srv.name}
                  </h3>
                  <span className="text-base font-bold text-primary shrink-0 ml-4">
                    {srv.price} €
                  </span>
                </div>
                
                <p className="text-xs text-foreground/75 leading-relaxed font-light font-sans">
                  {srv.description}
                </p>

                <div className="flex items-center space-x-2 text-[10px] text-foreground/40 font-semibold tracking-wider uppercase border-t border-card-border/50 pt-3">
                  <Clock size={11} className="text-primary" />
                  <span>{t("services.duration")} {srv.duration}</span>
                </div>

                <p className="text-[10px] text-foreground/50 leading-relaxed font-light italic">
                  {srv.details}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-card-border/30">
                <Link
                  href={`/#booking?method=${encodeURIComponent(srv.name)}`}
                  className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl border border-primary hover:bg-primary hover:text-background text-primary text-xs tracking-wider uppercase font-semibold transition-all duration-300"
                >
                  <Calendar size={12} />
                  <span>{t("services.ctaBook")}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-28 pb-16 px-6 md:px-12 bg-background">
        
        {/* Intro */}
        <div className="max-w-xl mx-auto mb-16 text-center">
          <span className="editorial-lead text-xs text-primary font-semibold">{t("services.tagline")}</span>
          <h1 className="text-4xl md:text-5xl font-serif mt-2 mb-4 font-light uppercase tracking-wider">
            {t("services.title")}
          </h1>
          <p className="text-sm text-foreground/60 font-light leading-relaxed">
            {t("services.desc")}
          </p>
        </div>

        {/* Catalog Categories */}
        <div className="max-w-5xl mx-auto space-y-16">
          {renderServiceSection(t("services.systems"), t("services.systemsDesc"), extensions, <Sparkles size={16} />)}
          {renderServiceSection(t("services.styling"), t("services.stylingDesc"), styling, <Scissors size={16} />)}
          {renderServiceSection(t("services.care"), t("services.careDesc"), care, <Heart size={16} />)}
        </div>

      </main>
      <Footer />
    </>
  );
}
