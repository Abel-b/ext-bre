"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Coffee, Sun, Sparkles, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

interface Hotspot {
  id: number;
  x: number; // percentage from left
  y: number; // percentage from top
  titleKey: string;
  descKey: string;
  icon: React.ReactNode;
}

export default function SalonWalkthrough() {
  const { t } = useTranslation();
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  const hotspots: Hotspot[] = [
    {
      id: 1,
      x: 20,
      y: 40,
      titleKey: "The Champagne Bar",
      descKey: "Enjoy complementary Moët & Chandon or craft barista coffee during your session.",
      icon: <Coffee className="w-4 h-4 text-primary" />,
    },
    {
      id: 2,
      x: 65,
      y: 18,
      titleKey: "Optimal Studio Lighting",
      descKey: "Our custom LED vanity arrays replicate natural daylight, ensuring a flawless color blend matches in any environment.",
      icon: <Sun className="w-4 h-4 text-primary" />,
    },
    {
      id: 3,
      x: 82,
      y: 55,
      titleKey: "Ergonomic Wash Lounges",
      descKey: "Experience premium head massages in our full-reclining Italian leather basins.",
      icon: <Sparkles className="w-4 h-4 text-primary" />,
    },
    {
      id: 4,
      x: 46,
      y: 45,
      titleKey: "Couture Styling Stations",
      descKey: "Bespoke marble tables and comfortable plush seating for the ultimate styling session.",
      icon: <Heart className="w-4 h-4 text-primary" />,
    },
  ];

  // Localize hotspot descriptions
  const getLocalizedSpot = (spot: Hotspot) => {
    let title = spot.titleKey;
    let description = spot.descKey;

    if (spot.id === 1) {
      title = t("locale") === "de" ? "Die Champagner-Bar" : "The Champagne Bar";
      description = t("locale") === "de"
        ? "Genießen Sie während Ihrer Behandlung gekühlten Champagner, Prosecco oder Kaffeespezialitäten an unserer Bar."
        : "Enjoy complementary Moët & Chandon or craft barista coffee during your session.";
    } else if (spot.id === 2) {
      title = t("locale") === "de" ? "Tageslicht-Spiegel" : "Optimal Studio Lighting";
      description = t("locale") === "de"
        ? "Unsere LED-Spiegel simulieren natürliches Tageslicht, um eine perfekte Farbanpassung bei jedem Wetter zu garantieren."
        : "Our custom LED vanity arrays replicate natural daylight, ensuring a flawless color blend matches in any environment.";
    } else if (spot.id === 3) {
      title = t("locale") === "de" ? "Ergonomische Waschliegen" : "Ergonomic Wash Lounges";
      description = t("locale") === "de"
        ? "Entspannen Sie bei einer Kopfmassage in unseren voll elektrisch verstellbaren Liegen aus italienischem Leder."
        : "Experience premium head massages in our full-reclining Italian leather basins.";
    } else if (spot.id === 4) {
      title = t("locale") === "de" ? "Couture Styling-Plätze" : "Couture Styling Stations";
      description = t("locale") === "de"
        ? "Marmortische, edle Messing-Akzente und weiche Sessel sorgen für maximalen Komfort bei längeren Einarbeitungen."
        : "Bespoke marble tables and comfortable plush seating for the ultimate styling session.";
    }

    return { ...spot, title, description };
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
      {/* Intro */}
      <div className="text-center mb-8 max-w-xl px-4">
        <span className="editorial-lead text-xs text-primary font-semibold">
          {t("locale") === "de" ? "Virtuelle Tour" : "Virtual Tour"}
        </span>
        <h3 className="text-3xl font-serif mt-2 mb-4">
          {t("locale") === "de" ? "Im Inneren des Ateliers" : "Inside the Atelier"}
        </h3>
        <p className="text-xs text-foreground/60 leading-relaxed font-light">
          {t("locale") === "de"
            ? "Treten Sie ein in unser exklusives Atelier in Bremen. Jedes Detail wurde entworfen, um Ihnen eine Oase des Luxus zu bieten. Fahren Sie über die Markierungen, um den Raum zu erkunden."
            : "Step into our flagship studio in Bremen. Every detail is curated to provide an unmatched luxury hair care environment. Hover or tap the glowing circles to explore the space."}
        </p>
      </div>

      {/* Immersive Walkthrough Graphic */}
      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-card-border bg-card-bg glow-gold">
        <Image
          src="/images/salon_interior.jpg"
          alt="Luxury Salon Interior Bremen"
          fill
          className="object-cover pointer-events-none"
          sizes="(max-width: 1200px) 100vw, 1200px"
          priority
        />

        {/* Ambient Dark Overlay */}
        <div className="absolute inset-0 bg-background/10 dark:bg-black/20 transition-colors pointer-events-none" />

        {/* Hotspots */}
        {hotspots.map(getLocalizedSpot).map((spot) => {
          const isActive = activeHotspot?.id === spot.id;

          return (
            <div
              key={spot.id}
              className="absolute"
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            >
              {/* Pulse Marker */}
              <button
                onClick={() => setActiveHotspot(isActive ? null : spot)}
                onMouseEnter={() => setActiveHotspot(spot)}
                className={`relative flex items-center justify-center w-8 h-8 rounded-full border border-primary bg-background/90 text-primary shadow-2xl transition-all duration-300 z-20 cursor-pointer ${
                  isActive ? "scale-125 bg-primary text-background" : "hover:scale-115"
                }`}
                aria-label={`Show info about ${spot.title}`}
              >
                <span className="absolute inset-0 rounded-full border border-primary animate-ping opacity-60" />
                <span className="text-[10px] font-bold font-sans">
                  {spot.id}
                </span>
              </button>

              {/* Popup Card */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 md:w-80 bg-background/95 border border-card-border p-5 rounded-xl shadow-2xl z-30 glassmorphic"
                    onMouseLeave={() => setActiveHotspot(null)}
                  >
                    <div className="flex items-center space-x-2.5 mb-2 pb-2 border-b border-card-border/50">
                      {spot.icon}
                      <h4 className="text-xs tracking-wider uppercase font-semibold text-primary font-sans">
                        {spot.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-foreground/75 leading-relaxed font-light font-sans">
                      {spot.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
