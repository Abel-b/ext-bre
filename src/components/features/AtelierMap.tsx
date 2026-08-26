"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, Phone, Clock, Navigation, Star, Info, Compass } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useTheme } from "@/components/ui/theme-provider";

export default function AtelierMap() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Fail-safe timeout: if iframe doesn't fire onLoad in 8 seconds, trigger fallback/error layout
    timeoutRef.current = setTimeout(() => {
      if (loading) {
        setError(true);
        setLoading(false);
      }
    }, 8000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [loading]);

  const handleMapLoad = () => {
    setLoading(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const mapUrl = "https://maps.google.com/maps?q=Sagerstra%C3%9Fe%2011,%2028757%20Bremen&t=&z=16&ie=UTF8&iwloc=&output=embed";

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch p-2">
      
      {/* 1. Salon Details Card (LHS) */}
      <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-3xl border border-card-border bg-card-bg glow-gold space-y-8">
        <div className="space-y-6">
          
          {/* Header */}
          <div>
            <span className="editorial-lead text-[10px] text-primary font-bold tracking-[0.2em]">
              {t("map.tagline")}
            </span>
            <h3 className="text-3xl font-serif mt-2 mb-2 font-light text-foreground uppercase tracking-wide">
              {t("map.title")}
            </h3>
            
            {/* Star Rating Info */}
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={11} fill="currentColor" />
                ))}
              </div>
              <span className="text-[10px] text-foreground/50 font-medium">
                {t("map.ratingText")}
              </span>
            </div>
          </div>

          <div className="h-[1px] w-full bg-card-border/60" />

          {/* Details list */}
          <div className="space-y-5 text-xs">
            {/* Address */}
            <div className="flex items-start space-x-3.5">
              <MapPin size={15} className="text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block uppercase tracking-wider text-[9px] text-foreground/50 mb-1">
                  {t("map.addressTitle")}
                </span>
                <span className="text-foreground/80 leading-relaxed">
                  {t("map.addressText")}
                </span>
              </div>
            </div>

            {/* Transit */}
            <div className="flex items-start space-x-3.5">
              <Compass size={15} className="text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block uppercase tracking-wider text-[9px] text-foreground/50 mb-1">
                  {t("map.parkingGuide")}
                </span>
                <span className="text-foreground/70 leading-relaxed whitespace-pre-line font-light">
                  {t("map.transitText")}
                </span>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start space-x-3.5">
              <Clock size={15} className="text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block uppercase tracking-wider text-[9px] text-foreground/50 mb-1">
                  {t("map.hoursTitle")}
                </span>
                <div className="text-foreground/70 leading-relaxed font-light space-y-1">
                  <div className="flex justify-between w-48">
                    <span>Di - Fr:</span> <span className="font-medium text-foreground">10:00 - 19:00</span>
                  </div>
                  <div className="flex justify-between w-48">
                    <span>Samstag:</span> <span className="font-medium text-foreground">09:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between w-48 text-primary uppercase text-[9px] tracking-wider font-semibold">
                    <span>So & Mo:</span> <span>Geschlossen</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-card-border/50">
          <a
            href="tel:01746571715"
            className="flex-1 flex items-center justify-center space-x-2 py-3 px-5 rounded-full border border-primary text-primary hover:bg-primary hover:text-background text-xs tracking-wider uppercase font-semibold transition-all duration-300"
          >
            <Phone size={13} />
            <span>{t("map.btnCall")}</span>
          </a>
          
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Sagerstra%C3%9Fe+11,+28757+Bremen"
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center space-x-2 py-3 px-5 rounded-full bg-primary text-background text-xs tracking-wider uppercase font-semibold hover:bg-primary-hover shadow-lg hover:shadow-primary/10 transition-all duration-300"
          >
            <Navigation size={13} />
            <span>{t("map.btnDirections")}</span>
          </a>
        </div>

      </div>

      {/* 2. Interactive Styled Map Frame (RHS) */}
      <div className="lg:col-span-7 relative border border-card-border rounded-3xl overflow-hidden bg-card-bg glow-gold min-h-[350px]">
        
        {/* Loading Skeleton */}
        {loading && (
          <div className="absolute inset-0 bg-[#0e0e0e]/50 backdrop-blur-sm flex flex-col items-center justify-center z-20 space-y-4">
            <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span className="editorial-lead text-[10px] text-primary font-bold tracking-widest animate-pulse">
              {t("map.loadingMsg")}
            </span>
          </div>
        )}

        {/* Error Fallback */}
        {error && (
          <div className="absolute inset-0 bg-[#0c0c0c] flex flex-col items-center justify-center z-20 p-8 text-center space-y-6">
            <MapPin size={40} className="text-primary animate-bounce" />
            <div className="space-y-2">
              <h4 className="text-base font-serif uppercase tracking-wider text-white">Extensions Bremen</h4>
              <p className="text-xs text-white/50 font-light max-w-sm">
                {t("map.errorMsg")}
              </p>
            </div>
            <a
              href="https://www.google.com/maps/place/Sagerstra%C3%9Fe+11,+28757+Bremen"
              target="_blank"
              rel="noreferrer"
              className="py-3 px-6 rounded-full bg-primary text-background text-xs tracking-wider uppercase font-semibold hover:bg-primary-hover transition-colors"
            >
              Google Maps
            </a>
          </div>
        )}

        {/* Map iframe with custom light/dark theme filters */}
        <iframe
          title="Atelier Bremen Map Location"
          src={mapUrl}
          width="100%"
          height="100%"
          style={{
            border: 0,
            filter: theme === "dark"
              ? "invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%) grayscale(20%) saturate(120%)"
              : "sepia(15%) saturate(110%) contrast(95%)",
          }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={handleMapLoad}
          className="w-full h-full min-h-[400px] lg:min-h-full transition-all duration-700"
        />

        {/* Gold overlay layout details */}
        <div className="absolute bottom-4 left-4 bg-background/90 border border-card-border p-3.5 rounded-xl max-w-xs shadow-lg glassmorphic pointer-events-none z-10 hidden sm:block">
          <span className="text-[10px] tracking-wider uppercase font-bold text-primary block">Extensions Bremen</span>
          <p className="text-[9px] text-foreground/60 font-light mt-1">
            Sagerstraße 11, 28757 Vegesack.
          </p>
        </div>

      </div>

    </div>
  );
}
