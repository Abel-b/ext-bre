"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, Phone, Clock, Navigation, Star, Compass } from "lucide-react";
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
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
      
      {/* 1. Salon Details Card (LHS) */}
      <div className="lg:col-span-5 flex flex-col justify-between p-5 sm:p-8 rounded-3xl border border-card-border bg-card-bg glow-gold space-y-6 sm:space-y-8 shadow-xl">
        <div className="space-y-5 sm:space-y-6">
          
          {/* Header */}
          <div>
            <span className="editorial-lead text-[9px] sm:text-[10px] text-primary font-bold tracking-[0.2em]">
              {t("map.tagline")}
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif mt-1 mb-1.5 font-light text-foreground uppercase tracking-wide">
              {t("map.title")}
            </h3>
            
            {/* Star Rating Info */}
            <div className="flex items-center space-x-2 mt-1.5">
              <div className="flex text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={11} fill="currentColor" />
                ))}
              </div>
              <span className="text-[10px] text-foreground/60 font-medium">
                {t("map.ratingText")}
              </span>
            </div>
          </div>

          <div className="h-[1px] w-full bg-card-border/60" />

          {/* Details list */}
          <div className="space-y-4 text-xs">
            {/* Address */}
            <div className="flex items-start space-x-3">
              <MapPin size={15} className="text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block uppercase tracking-wider text-[9px] text-foreground/50 mb-0.5">
                  {t("map.addressTitle")}
                </span>
                <span className="text-foreground/85 leading-relaxed font-medium">
                  {t("map.addressText")}
                </span>
              </div>
            </div>

            {/* Transit */}
            <div className="flex items-start space-x-3">
              <Compass size={15} className="text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block uppercase tracking-wider text-[9px] text-foreground/50 mb-0.5">
                  {t("map.parkingGuide")}
                </span>
                <span className="text-foreground/70 leading-relaxed whitespace-pre-line font-light">
                  {t("map.transitText")}
                </span>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start space-x-3">
              <Clock size={15} className="text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block uppercase tracking-wider text-[9px] text-foreground/50 mb-0.5">
                  {t("map.hoursTitle")}
                </span>
                <div className="text-foreground/70 leading-relaxed font-light space-y-1">
                  <div className="flex justify-between w-44">
                    <span>Di - Fr:</span> <span className="font-medium text-foreground">10:00 - 19:00</span>
                  </div>
                  <div className="flex justify-between w-44">
                    <span>Samstag:</span> <span className="font-medium text-foreground">09:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between w-44 text-primary uppercase text-[9px] tracking-wider font-semibold">
                    <span>So & Mo:</span> <span>Geschlossen</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-card-border/50">
          <a
            href="tel:+4942198765432"
            className="flex-1 flex items-center justify-center space-x-2 py-3.5 px-4 rounded-full border border-primary text-primary hover:bg-primary hover:text-background text-xs tracking-wider uppercase font-bold transition-all min-h-[46px]"
          >
            <Phone size={13} />
            <span>{t("map.btnCall")}</span>
          </a>
          
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Sagerstra%C3%9Fe+11,+28757+Bremen"
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center space-x-2 py-3.5 px-4 rounded-full bg-primary text-background text-xs tracking-wider uppercase font-bold hover:bg-primary-hover shadow-lg hover:shadow-primary/10 transition-all min-h-[46px]"
          >
            <Navigation size={13} />
            <span>{t("map.btnDirections")}</span>
          </a>
        </div>

      </div>

      {/* 2. Interactive Styled Map Frame (RHS) */}
      <div className="lg:col-span-7 relative border border-card-border rounded-3xl overflow-hidden bg-card-bg glow-gold min-h-[300px] sm:min-h-[400px] shadow-xl">
        
        {/* Loading Skeleton */}
        {loading && (
          <div className="absolute inset-0 bg-[#0e0e0e]/50 backdrop-blur-sm flex flex-col items-center justify-center z-20 space-y-3">
            <div className="w-9 h-9 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span className="editorial-lead text-[10px] text-primary font-bold tracking-widest animate-pulse">
              {t("map.loadingMsg")}
            </span>
          </div>
        )}

        {/* Error Fallback */}
        {error && (
          <div className="absolute inset-0 bg-[#0c0c0c] flex flex-col items-center justify-center z-20 p-6 text-center space-y-4">
            <MapPin size={36} className="text-primary animate-bounce" />
            <div className="space-y-1">
              <h4 className="text-base font-serif uppercase tracking-wider text-white">Extensions Bremen</h4>
              <p className="text-xs text-white/50 font-light max-w-sm">
                {t("map.errorMsg")}
              </p>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Sagerstra%C3%9Fe+11,+28757+Bremen"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2.5 rounded-full bg-primary text-background text-xs font-semibold uppercase tracking-wider shadow-lg"
            >
              Google Maps öffnen
            </a>
          </div>
        )}

        {/* Live Google Maps Iframe */}
        <iframe
          title="Extensions Bremen Location Map"
          src={mapUrl}
          onLoad={handleMapLoad}
          className={`w-full h-full min-h-[300px] sm:min-h-[400px] border-0 transition-opacity duration-700 ${
            loading ? "opacity-0" : "opacity-100"
          }`}
          style={{
            filter: theme === "dark" 
              ? "invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)"
              : "saturate(0.8) contrast(1.05)",
          }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Custom Gold Pin Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            <span className="absolute w-8 h-8 rounded-full bg-primary/30 animate-ping" />
            <div className="w-8 h-8 rounded-full bg-primary text-background border-2 border-background shadow-2xl flex items-center justify-center">
              <MapPin size={15} className="fill-current" />
            </div>
          </div>
          <div className="mt-1.5 px-2.5 py-0.5 rounded-full bg-background/90 backdrop-blur-md border border-card-border shadow-lg">
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-primary">
              Extensions Bremen
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
