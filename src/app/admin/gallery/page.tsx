"use client";

import React, { useState, useEffect } from "react";
import { db, GalleryItem } from "@/lib/db";
import { Plus, Trash, Check } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n";

export default function GalleryCMS() {
  const { t } = useTranslation();
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<GalleryItem["category"]>("blonde");
  const [imageUrl, setImageUrl] = useState("/images/hero_model.jpg");
  const [beforeUrl, setBeforeUrl] = useState("/images/before_model.jpg");
  const [hasBefore, setHasBefore] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setGallery(db.getGallery());
  }, []);

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) return;

    db.addGalleryItem({
      title,
      category,
      imageUrl,
      beforeUrl: hasBefore ? beforeUrl : undefined,
    });

    setGallery(db.getGallery());
    setTitle("");
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 1500);
  };

  const handleDeletePhoto = (id: string) => {
    db.deleteGalleryItem(id);
    setGallery(db.getGallery());
  };

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
    <div className="space-y-10">
      
      {/* Header */}
      <div>
        <span className="editorial-lead text-[10px] text-primary font-bold">Content Management</span>
        <h1 className="text-3xl font-serif mt-1 font-medium tracking-wide uppercase">{t("locale") === "de" ? "Galerie-CMS" : "Gallery CMS"}</h1>
        <p className="text-xs text-foreground/50 mt-1 font-light">
          {t("admin.desc")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Gallery masonry list */}
        <div className="lg:col-span-8 space-y-4">
          <span className="text-xs tracking-wider uppercase font-bold text-foreground block">{t("admin.activePortfolio")}</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {gallery.map((item) => (
              <div
                key={item.id}
                className="group relative border border-card-border rounded-xl bg-card-bg overflow-hidden flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] w-full bg-foreground/5">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                  
                  {/* Delete hovering indicator */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDeletePhoto(item.id)}
                      className="p-1.5 bg-rose-600/90 text-white rounded-lg hover:bg-rose-700 transition-colors shadow-md cursor-pointer"
                      aria-label="Delete image"
                    >
                      <Trash size={12} />
                    </button>
                  </div>
                </div>

                <div className="p-3.5">
                  <span className="text-[9px] tracking-wider uppercase font-semibold text-primary block mb-1">
                    {t(`gallery.filter${item.category.charAt(0).toUpperCase() + item.category.slice(1)}`)}
                  </span>
                  <span className="text-[10px] font-semibold text-foreground leading-normal block truncate">
                    {getLocalizedTitle(item)}
                  </span>
                  {item.beforeUrl && (
                    <span className="text-[8px] tracking-wide text-foreground/45 mt-1 block">
                      &bull; {t("locale") === "de" ? "Enthält Vorher-Vergleich" : "Contains Before comparison"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Form Panel (RHS) */}
        <div className="lg:col-span-4">
          <span className="text-xs tracking-wider uppercase font-bold text-foreground block mb-4 font-sans">{t("admin.newPortfolio")}</span>
          
          <form onSubmit={handleAddPhoto} className="border border-card-border p-6 rounded-2xl bg-card-bg glow-gold space-y-5">
            <div className="pb-3 border-b border-card-border/50">
              <span className="text-[9px] tracking-widest uppercase text-primary font-bold">New Portfolio Entry</span>
            </div>

            {/* Title */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="photo-title" className="text-[10px] uppercase tracking-wider text-foreground/50">{t("admin.imageTitle")}</label>
              <input
                type="text"
                id="photo-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="60cm Honey Balayage Waves"
                className="p-3 bg-background border border-card-border rounded-xl text-xs focus:border-primary outline-none transition-colors"
                required
              />
            </div>

            {/* Category */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="photo-cat" className="text-[10px] uppercase tracking-wider text-foreground/50">{t("admin.focus")}</label>
              <select
                id="photo-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value as GalleryItem["category"])}
                className="p-3 bg-background border border-card-border rounded-xl text-xs focus:border-primary outline-none transition-colors"
              >
                <option value="blonde">{t("gallery.filterBlonde")}</option>
                <option value="brunette">{t("gallery.filterBrunette")}</option>
                <option value="volume">{t("gallery.filterVolume")}</option>
                <option value="length">{t("gallery.filterLength")}</option>
              </select>
            </div>

            {/* Selection simulation image */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="photo-url" className="text-[10px] uppercase tracking-wider text-foreground/50">{t("admin.asset")}</label>
              <select
                id="photo-url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="p-3 bg-background border border-card-border rounded-xl text-xs focus:border-primary outline-none transition-colors"
              >
                <option value="/images/hero_model.jpg">Hero Banner Shot (Champagne)</option>
                <option value="/images/after_model.jpg">After Model Shot (Espresso)</option>
                <option value="/images/salon_interior.jpg">Salon Atelier interior</option>
              </select>
            </div>

            {/* Before toggling */}
            <div className="space-y-3.5">
              <label className="flex items-center space-x-2 cursor-pointer text-[10px] uppercase tracking-wider text-foreground/50 select-none">
                <input
                  type="checkbox"
                  checked={hasBefore}
                  onChange={(e) => setHasBefore(e.target.checked)}
                  className="rounded border-card-border text-primary focus:ring-0 focus:ring-offset-0"
                />
                <span>{t("admin.includeBefore")}</span>
              </label>

              {hasBefore && (
                <div className="flex flex-col space-y-1 pl-5">
                  <label htmlFor="before-url" className="text-[9px] uppercase tracking-wider text-foreground/45">{t("admin.beforeAsset")}</label>
                  <select
                    id="before-url"
                    value={beforeUrl}
                    onChange={(e) => setBeforeUrl(e.target.value)}
                    className="p-2.5 bg-background border border-card-border rounded-xl text-[11px] focus:border-primary outline-none transition-colors"
                  >
                    <option value="/images/before_model.jpg">Standard Before Asset (Fine hair)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={saveSuccess}
              className="w-full py-3.5 rounded-xl bg-primary text-background text-[10px] tracking-wider uppercase font-bold hover:bg-primary-hover transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              {saveSuccess ? (
                <>
                  <Check size={12} />
                  <span>{t("admin.btnPublished")}</span>
                </>
              ) : (
                <>
                  <Plus size={12} />
                  <span>{t("admin.btnPublishGallery")}</span>
                </>
              )}
            </button>

          </form>
        </div>

      </div>

    </div>
  );
}
