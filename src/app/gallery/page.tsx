"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { db, GalleryItem } from "@/lib/db";
import Image from "next/image";
import BeforeAfter from "@/components/features/BeforeAfter";
import { X, Sliders } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { getAssetPath } from "@/lib/assets";

export default function GalleryPage() {
  const { t } = useTranslation();
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    setGallery(db.getGallery());
  }, []);

  const filteredItems = filter === "all"
    ? gallery
    : gallery.filter((item) => item.category === filter);

  // Localize dynamic gallery titles
  const getLocalizedTitle = (item: GalleryItem) => {
    if (item.id === "gal-1") {
      return t("locale") === "en" ? "Editorial 60cm Champagne Balayage" : "Editorial 60cm Champagner-Balayage";
    }
    if (item.id === "gal-2") {
      return t("locale") === "en" ? "50cm Keratin Bond Blend - Rich Espresso" : "50cm Keratinbonds - Rich Espresso";
    }
    if (item.id === "gal-3") {
      return t("locale") === "en" ? "Luxury Salon Ambience - Styling Bay 1" : "Luxuriöses Salon-Ambiente - Styling-Platz 1";
    }
    return item.title;
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-28 pb-16 px-6 md:px-12 bg-background">
        
        {/* Intro */}
        <div className="max-w-xl mx-auto mb-12 text-center">
          <span className="editorial-lead text-xs text-primary font-semibold">{t("gallery.tagline")}</span>
          <h1 className="text-4xl md:text-5xl font-serif mt-2 mb-4 font-light uppercase tracking-wider">
            {t("gallery.title")}
          </h1>
          <p className="text-sm text-foreground/60 font-light leading-relaxed">
            {t("gallery.desc")}
          </p>
        </div>

        {/* Filters Tabs */}
        <div className="flex justify-center flex-wrap gap-2.5 mb-12 max-w-2xl mx-auto border-b border-card-border/50 pb-6">
          {[
            { id: "all", label: t("gallery.filterAll") },
            { id: "blonde", label: t("gallery.filterBlonde") },
            { id: "brunette", label: t("gallery.filterBrunette") },
            { id: "volume", label: t("gallery.filterVolume") },
            { id: "length", label: t("gallery.filterLength") },
          ].map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`py-2 px-5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                  isActive
                    ? "bg-primary text-background shadow-md"
                    : "border border-card-border text-foreground/70 hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Portfolio Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {filteredItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group relative cursor-pointer border border-card-border rounded-2xl bg-card-bg overflow-hidden glow-gold"
            >
              <div className="relative aspect-[3/4] w-full bg-foreground/5 overflow-hidden">
                <Image
                  src={getAssetPath(item.imageUrl)}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                
                {/* Hover overlay with detail icon */}
                <div className="absolute inset-0 bg-background/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-background flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <Sliders size={18} />
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-card-border/50">
                <span className="text-[9px] tracking-wider uppercase font-semibold text-primary block mb-1.5">
                  {t(`gallery.filter${item.category.charAt(0).toUpperCase() + item.category.slice(1)}`)}
                </span>
                <span className="text-sm font-serif font-bold text-foreground leading-normal block">
                  {getLocalizedTitle(item)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Immersive Transformation Lightbox Modal */}
        <AnimatePresence>
          {activeItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg flex flex-col justify-between items-center p-6 overflow-y-auto"
            >
              {/* Close controls */}
              <div className="w-full max-w-6xl flex justify-between items-center py-4 border-b border-card-border/50">
                <span className="text-xs font-serif tracking-widest uppercase font-bold text-foreground">
                  {t("gallery.lightboxTitle")} {getLocalizedTitle(activeItem)}
                </span>
                <button
                  onClick={() => setActiveItem(null)}
                  className="p-2 border border-card-border rounded-full hover:border-primary text-foreground/60 hover:text-primary transition-colors"
                  aria-label="Close transformation details"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Slider container */}
              <div className="w-full flex-1 flex items-center justify-center my-6">
                <BeforeAfter
                  beforeImage={getAssetPath(activeItem.beforeUrl || "/images/before_model.jpg")}
                  afterImage={getAssetPath(activeItem.imageUrl)}
                  beforeLabel={t("gallery.before")}
                  afterLabel={t("gallery.after")}
                />
              </div>

              {/* Bottom detail card */}
              <div className="w-full max-w-3xl text-center pb-4 space-y-3">
                <span className="text-[9px] tracking-wider uppercase font-semibold text-primary">
                  {t(`gallery.filter${activeItem.category.charAt(0).toUpperCase() + activeItem.category.slice(1)}`)}
                </span>
                <p className="text-xs text-foreground/60 font-light max-w-md mx-auto leading-relaxed">
                  {t("gallery.footerText")}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
      <Footer />
    </>
  );
}
