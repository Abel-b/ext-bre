"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, Info, Sparkles, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { getAssetPath } from "@/lib/assets";

interface HairColor {
  id: string;
  nameKey: string;
  code: string;
  imageUrl: string;
}

interface LengthOption {
  value: number; // in cm
  priceAddon: number;
}

interface VolumeOption {
  labelKey: string;
  weight: number; // in grams
  priceMultiplier: number;
}

interface MethodOption {
  id: string;
  nameKey: string;
  basePrice: number;
  maintenanceKey: string;
  descKey: string;
}

const COLORS: HairColor[] = [
  { id: "espresso", nameKey: "Rich Espresso", code: "#1a1310", imageUrl: "/images/after_model.jpg" },
  { id: "blonde", nameKey: "Champagne Blonde", code: "#d8c3a5", imageUrl: "/images/hero_model.jpg" },
  { id: "honey", nameKey: "Honey Balayage", code: "#bfa37a", imageUrl: "/images/hero_model.jpg" },
  { id: "jetblack", nameKey: "Obsidian Jet Black", code: "#090707", imageUrl: "/images/after_model.jpg" },
];

const LENGTHS: LengthOption[] = [
  { value: 40, priceAddon: 0 },
  { value: 50, priceAddon: 120 },
  { value: 60, priceAddon: 240 },
  { value: 70, priceAddon: 380 },
];

const VOLUMES: VolumeOption[] = [
  { labelKey: "volFine", weight: 100, priceMultiplier: 1.0 },
  { labelKey: "volMed", weight: 150, priceMultiplier: 1.35 },
  { labelKey: "volMax", weight: 200, priceMultiplier: 1.7 },
];

const METHODS: MethodOption[] = [
  {
    id: "keratin",
    nameKey: "Keratin Bond System",
    basePrice: 480,
    maintenanceKey: "Lasts 4 - 5 Months. Zero slippage.",
    descKey: "Individually hot-fused Italian keratin strands. Gives maximum natural rotation and styling versatility.",
  },
  {
    id: "tapes",
    nameKey: "Invisible Tape-Ins",
    basePrice: 380,
    maintenanceKey: "Lasts 6 - 8 Weeks. Hair is reusable.",
    descKey: "Sandwiched double-sided slim panels that lie perfectly flat, ideal for adding width and thickness.",
  },
  {
    id: "wefts",
    nameKey: "Invisible Genius Weft",
    basePrice: 420,
    maintenanceKey: "Adjustments every 6 - 8 Weeks.",
    descKey: "Sewn-in micro-track wefts. Best for maximum density without any adhesives or chemical solvents.",
  },
];

export default function Configurator() {
  const { t } = useTranslation();
  const [selectedColor, setSelectedColor] = useState<HairColor>(COLORS[0]);
  const [selectedLength, setSelectedLength] = useState<LengthOption>(LENGTHS[1]); // 50cm
  const [selectedVolume, setSelectedVolume] = useState<VolumeOption>(VOLUMES[1]); // 150g
  const [selectedMethod, setSelectedMethod] = useState<MethodOption>(METHODS[0]); // Keratin
  const [selectedTexture, setSelectedTexture] = useState<string>("Body Wave");
  const [price, setPrice] = useState(0);

  // Recalculate price in real time
  useEffect(() => {
    const base = selectedMethod.basePrice;
    const lengthAdd = selectedLength.priceAddon;
    const subtotal = (base + lengthAdd) * selectedVolume.priceMultiplier;
    setPrice(Math.round(subtotal));
  }, [selectedColor, selectedLength, selectedVolume, selectedMethod, selectedTexture]);

  // Translate helpers
  const getLocalizedColorName = (color: HairColor) => {
    if (color.id === "espresso") return t("locale") === "de" ? "Dunkles Espresso" : "Rich Espresso";
    if (color.id === "blonde") return t("locale") === "de" ? "Champagner-Blond" : "Champagne Blonde";
    if (color.id === "honey") return t("locale") === "de" ? "Honig-Balayage" : "Honey Balayage";
    if (color.id === "jetblack") return t("locale") === "de" ? "Tiefschwarz" : "Obsidian Jet Black";
    return color.nameKey;
  };

  const getLocalizedMethod = (m: MethodOption) => {
    let name = m.nameKey;
    let description = m.descKey;
    let maintenance = m.maintenanceKey;

    if (m.id === "keratin") {
      name = t("locale") === "de" ? "Keratin-Bondings" : "Keratin Bondings";
      description = t("locale") === "de"
        ? "Einzeln eingearbeitete italienische Keratinstrukturen. Maximale Stylingfreiheit und Flexibilität."
        : "Individually hot-fused Italian keratin strands. Gives maximum natural rotation and styling versatility.";
      maintenance = t("locale") === "de" ? "Haltbarkeit 4 - 5 Monate. Kein Verrutschen." : "Lasts 4 - 5 Months. Zero slippage.";
    } else if (m.id === "tapes") {
      name = t("locale") === "de" ? "Unsichtbare Tape-Ins" : "Invisible Tape-Ins";
      description = t("locale") === "de"
        ? "Flach aufliegende, doppelseitige Klebepaneele. Ideal für gezieltes Volumen und Breite."
        : "Sandwiched double-sided slim panels that lie perfectly flat, ideal for adding width and thickness.";
      maintenance = t("locale") === "de" ? "Tragezeit 6 - 8 Wochen. Wiederverwendbar." : "Lasts 6 - 8 Weeks. Hair is reusable.";
    } else if (m.id === "wefts") {
      name = t("locale") === "de" ? "Genius-Tressen (Wefts)" : "Invisible Genius Weft";
      description = t("locale") === "de"
        ? "Schonend eingenähte Haartressen für maximale Dichte ganz ohne Hitze oder Klebstoffe."
        : "Sewn-in micro-track wefts. Best for maximum density without any adhesives or chemical solvents.";
      maintenance = t("locale") === "de" ? "Hochsetzen alle 6 - 8 Wochen." : "Adjustments every 6 - 8 Weeks.";
    }

    return { ...m, name, description, maintenance };
  };

  const getLocalizedTexture = (tex: string) => {
    if (t("locale") === "de") {
      if (tex === "Straight") return "Glatt";
      if (tex === "Body Wave") return "Leichte Welle";
      if (tex === "Deep Curly") return "Lockig";
    }
    return tex;
  };

  const bookingHref = `/#booking?method=${encodeURIComponent(getLocalizedMethod(selectedMethod).name)}&length=${selectedLength.value}&color=${encodeURIComponent(getLocalizedColorName(selectedColor))}`;

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 p-4 sm:p-6 md:p-12 bg-card-bg border border-card-border rounded-3xl glow-gold pb-28 lg:pb-12">
      
      {/* Visual Preview Panel (Top on mobile, Sticky on desktop) */}
      <div className="lg:col-span-5 flex flex-col justify-between space-y-5 lg:sticky lg:top-28 lg:h-[calc(100vh-180px)]">
        <div>
          <div className="flex items-center justify-between">
            <span className="editorial-lead text-[10px] text-primary font-bold">{t("configurator.previewTitle")}</span>
            <span className="lg:hidden text-lg font-serif font-bold text-primary">{price} €</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif mt-1 font-medium text-foreground">{t("configurator.previewTitle")}</h2>
          
          <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-card-border mt-3 group shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedColor.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={getAssetPath(selectedColor.imageUrl)}
                  alt={getLocalizedColorName(selectedColor)}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 450px"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />

            {/* Spec highlights on image */}
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5 pointer-events-none">
              <span className="bg-background/85 backdrop-blur-md border border-card-border text-[9px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded-md text-foreground">
                {selectedLength.value} cm
              </span>
              <span className="bg-background/85 backdrop-blur-md border border-card-border text-[9px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded-md text-foreground">
                {selectedVolume.weight}g
              </span>
              <span className="bg-background/85 backdrop-blur-md border border-card-border text-[9px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded-md text-foreground">
                {getLocalizedTexture(selectedTexture)}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Summary Card (Desktop) */}
        <div className="hidden lg:block border border-card-border p-5 rounded-2xl bg-background/50">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="text-[10px] tracking-widest uppercase text-foreground/45">{t("configurator.estPrice")}</span>
              <div className="text-3xl font-serif text-primary mt-1 font-semibold">
                {price} €
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] tracking-widest uppercase text-foreground/45 block">{t("configurator.maintInterval")}</span>
              <span className="text-xs font-semibold text-foreground/80 mt-1 block">
                {selectedMethod.id === "keratin" ? (t("locale") === "de" ? "16 - 20 Wochen" : "16 - 20 Weeks") : (t("locale") === "de" ? "6 - 8 Wochen" : "6 - 8 Weeks")}
              </span>
            </div>
          </div>

          <div className="text-[10px] text-foreground/50 border-t border-card-border/60 pt-3 font-light leading-relaxed">
            {t("configurator.maintNote")}
          </div>

          <Link
            href={bookingHref}
            className="flex items-center justify-center space-x-2 w-full mt-5 py-3.5 rounded-xl bg-primary text-background text-xs tracking-wider uppercase font-semibold hover:bg-primary-hover shadow-lg hover:shadow-primary/10 transition-all duration-300"
          >
            <Calendar size={13} />
            <span>{t("configurator.ctaBook")}</span>
          </Link>
        </div>
      </div>

      {/* Selectors Configuration Panel */}
      <div className="lg:col-span-7 space-y-7 sm:space-y-9">
        
        {/* Color Choice */}
        <div>
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-xs tracking-wider uppercase font-bold text-foreground">{t("configurator.step1")}</span>
            <span className="text-xs text-primary font-semibold">{getLocalizedColorName(selectedColor)}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {COLORS.map((color) => {
              const isSelected = selectedColor.id === color.id;
              return (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color)}
                  className={`flex items-center space-x-2.5 p-3 border rounded-xl text-left cursor-pointer transition-all min-h-[46px] ${
                    isSelected ? "border-primary bg-primary/10 shadow-sm" : "border-card-border bg-card-bg hover:border-foreground/20"
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full border border-card-border/60 shrink-0 shadow-inner"
                    style={{ backgroundColor: color.code }}
                  />
                  <span className="text-[10px] sm:text-[11px] font-semibold text-foreground tracking-wide leading-tight truncate">
                    {getLocalizedColorName(color)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hair Length Choice */}
        <div>
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-xs tracking-wider uppercase font-bold text-foreground">{t("configurator.step2")}</span>
            <span className="text-xs text-primary font-semibold">{selectedLength.value} cm</span>
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            {LENGTHS.map((len) => {
              const isSelected = selectedLength.value === len.value;
              return (
                <button
                  key={len.value}
                  onClick={() => setSelectedLength(len)}
                  className={`flex flex-col items-center justify-center p-3 sm:p-4 border rounded-xl text-center cursor-pointer transition-all min-h-[64px] ${
                    isSelected ? "border-primary bg-primary/10 shadow-sm" : "border-card-border bg-card-bg hover:border-foreground/20"
                  }`}
                >
                  <span className="text-base sm:text-lg font-serif font-bold text-foreground">{len.value}</span>
                  <span className="text-[9px] tracking-wider uppercase text-foreground/45">cm</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Volume Density Choice */}
        <div>
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-xs tracking-wider uppercase font-bold text-foreground">{t("configurator.step3")}</span>
            <span className="text-xs text-primary font-semibold">{selectedVolume.weight}g</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {VOLUMES.map((vol) => {
              const isSelected = selectedVolume.weight === vol.weight;
              return (
                <button
                  key={vol.weight}
                  onClick={() => setSelectedVolume(vol)}
                  className={`flex flex-col items-start p-3.5 sm:p-4 border rounded-xl text-left cursor-pointer transition-all ${
                    isSelected ? "border-primary bg-primary/10 shadow-sm" : "border-card-border bg-card-bg hover:border-foreground/20"
                  }`}
                >
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    {t(`configurator.${vol.labelKey}`)}
                  </span>
                  <span className="text-[10px] text-foreground/50 font-light mt-0.5">{vol.weight}g Package</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Method Choice */}
        <div>
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-xs tracking-wider uppercase font-bold text-foreground">{t("configurator.step4")}</span>
            <span className="text-xs text-primary font-semibold">{getLocalizedMethod(selectedMethod).name}</span>
          </div>
          <div className="flex flex-col space-y-2.5">
            {METHODS.map(getLocalizedMethod).map((m) => {
              const isSelected = selectedMethod.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMethod(METHODS.find(f => f.id === m.id) || METHODS[0])}
                  className={`flex flex-col items-start p-4 sm:p-5 border rounded-xl text-left cursor-pointer transition-all ${
                    isSelected ? "border-primary bg-primary/10 shadow-sm" : "border-card-border bg-card-bg hover:border-foreground/20"
                  }`}
                >
                  <div className="flex justify-between w-full">
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wider">{m.name}</span>
                    <span className="text-xs font-semibold text-primary">Ab {m.basePrice}€</span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-foreground/60 font-light mt-1 leading-relaxed">
                    {m.description}
                  </p>
                  <div className="flex items-center space-x-1.5 text-[9px] tracking-wider uppercase font-bold text-primary mt-2">
                    <Info size={10} />
                    <span>{m.maintenance}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hair Texture Selection */}
        <div>
          <span className="text-xs tracking-wider uppercase font-bold text-foreground block mb-2.5">{t("configurator.step5")}</span>
          <div className="grid grid-cols-3 gap-2.5">
            {["Straight", "Body Wave", "Deep Curly"].map((tex) => {
              const isSelected = selectedTexture === tex;
              return (
                <button
                  key={tex}
                  onClick={() => setSelectedTexture(tex)}
                  className={`py-3 px-2.5 border rounded-xl text-center text-xs tracking-wide font-semibold cursor-pointer transition-all min-h-[44px] ${
                    isSelected ? "border-primary bg-primary/10 text-primary shadow-sm" : "border-card-border text-foreground/75 bg-card-bg hover:border-foreground/20"
                  }`}
                >
                  {getLocalizedTexture(tex)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Bottom Action Bar on Mobile */}
      <div className="lg:hidden fixed bottom-3 inset-x-4 z-40">
        <div className="bg-background/95 backdrop-blur-2xl border border-card-border p-2.5 sm:p-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3 glow-gold">
          <div className="pl-2">
            <span className="text-[8px] uppercase tracking-wider text-foreground/50 block leading-tight">Geschätzter Preis</span>
            <div className="text-lg font-serif font-bold text-primary leading-tight">{price} €</div>
          </div>
          <Link
            href={bookingHref}
            className="flex-1 py-3 px-4 rounded-xl bg-primary text-background text-xs tracking-wider uppercase font-bold text-center flex items-center justify-center space-x-1.5 shadow-md min-h-[44px]"
          >
            <Calendar size={13} />
            <span>{t("configurator.ctaBook")}</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
