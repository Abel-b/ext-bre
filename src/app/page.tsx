"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ChevronRight, Star, ArrowRight, Phone, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BeforeAfter from "@/components/features/BeforeAfter";
import SalonWalkthrough from "@/components/features/SalonWalkthrough";
import BookingSystem from "@/components/features/BookingSystem";
import AtelierMap from "@/components/features/AtelierMap";
import { useTranslation } from "@/lib/i18n";
import { getAssetPath } from "@/lib/assets";

interface Particle {
  x: number;
  y: number;
  size: number;
  delay: number;
}

export default function HomePage() {
  const { t } = useTranslation();
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generate floating gold dust particles (client side only)
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const items = Array.from({ length: isMobile ? 8 : 18 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
    }));
    setParticles(items);
  }, []);

  const reviews = [
    {
      name: "Katharina S.",
      text: t("reviews.r1"),
      rating: 5,
      date: t("reviews.r1Date"),
    },
    {
      name: "Julia M.",
      text: t("reviews.r2"),
      rating: 5,
      date: t("reviews.r2Date"),
    },
    {
      name: "Lena H.",
      text: t("reviews.r3"),
      rating: 5,
      date: t("reviews.r3Date"),
    },
  ];

  return (
    <>
      <Navbar />

      {/* 1. Cinematic Hero Section (Mobile First) */}
      <section className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-[#050505] text-white pt-20 pb-16 px-4 sm:px-6 md:px-12">
        
        {/* Parallax Hero Photo */}
        <div className="absolute inset-0 w-full h-full opacity-65 dark:opacity-75">
          <Image
            src={getAssetPath("/images/hero_model.jpg")}
            alt="Couture Hair Extensions Bremen"
            fill
            className="object-cover object-center scale-105"
            priority
            sizes="100vw"
          />
        </div>

        {/* Cinematic Soft Gold Lighting Radial Glows */}
        <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-black/85 via-black/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-1/3 w-72 sm:w-96 h-72 sm:h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none z-10 animate-pulse" />

        {/* Floating Gold Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {particles.map((p, idx) => (
            <motion.div
              key={idx}
              className="absolute bg-primary rounded-full opacity-40"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
              }}
              animate={{
                y: [0, -60, 0],
                opacity: [0.1, 0.5, 0.1],
              }}
              transition={{
                duration: 8 + Math.random() * 6,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Hero Narrative Overlay */}
        <div className="relative max-w-7xl mx-auto w-full z-20">
          <div className="max-w-2xl space-y-5 sm:space-y-7">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span className="editorial-lead text-[10px] sm:text-xs text-primary font-bold tracking-[0.25em] uppercase">
                  {t("hero.tagline")}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif font-light leading-[1.15] tracking-wide text-white">
                {t("hero.title").split(".")[0]}. <br className="hidden sm:inline" />
                <span className="italic font-normal text-primary">
                  {t("hero.title").split(".")[1]}
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-xs sm:text-sm md:text-base text-white/75 font-light leading-relaxed max-w-lg"
            >
              {t("hero.subtitle")}
            </motion.p>

            {/* Quick Proof Badges on Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="flex flex-wrap gap-2 text-[10px] text-white/80 font-medium"
            >
              <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 flex items-center gap-1.5 shadow-sm">
                <Star size={11} className="text-primary fill-primary" /> 4.8★ (33 Google Reviews)
              </span>
              <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                Sagerstraße 11 &bull; Vegesack
              </span>
              <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                100% Remy Echthaar
              </span>
            </motion.div>

            {/* Mobile First Full-Width Actions Stack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
            >
              <Link
                href="#booking"
                className="flex items-center justify-center space-x-2 px-8 py-4 rounded-full bg-primary text-background text-xs tracking-wider uppercase font-bold hover:bg-primary-hover shadow-lg hover:shadow-primary/20 transition-all min-h-[48px]"
              >
                <Calendar size={14} />
                <span>{t("hero.ctaBook")}</span>
              </Link>
              <Link
                href="/configurator"
                className="flex items-center justify-center space-x-2 px-8 py-4 rounded-full border border-white/25 hover:border-white text-xs tracking-wider uppercase font-semibold transition-colors bg-white/5 backdrop-blur-sm min-h-[48px]"
              >
                <span>{t("hero.ctaDesign")}</span>
                <ChevronRight size={14} />
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. Editorial Brand Narrative Section */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-background border-b border-card-border/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            <span className="editorial-lead text-xs text-primary font-bold">{t("brand.tagline")}</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground font-light leading-snug">
              {t("brand.title").split(".")[0]}. <br className="hidden sm:inline" />
              <span className="italic font-normal text-primary">
                {t("brand.title").split(".")[1]}
              </span>
            </h2>
            <div className="h-[1px] w-16 bg-primary" />
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-foreground/70 leading-relaxed font-light">
            <p>{t("brand.p1")}</p>
            <p>{t("brand.p2")}</p>
          </div>

        </div>
      </section>

      {/* 3. Before & After Interactive Showcase */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-background">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <span className="editorial-lead text-xs text-primary font-bold">{t("gallery.tagline")}</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif mt-1.5 mb-3">{t("gallery.title")}</h2>
            <p className="text-xs text-foreground/60 leading-relaxed font-light">
              {t("gallery.desc")}
            </p>
          </div>

          <BeforeAfter />
        </div>
      </section>

      {/* 4. Immersive Salon Walkthrough Section */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-background border-t border-b border-card-border/30 bg-accent-muted/10">
        <SalonWalkthrough />
      </section>

      {/* 5. Interactive Services Explorer */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-background">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-card-border/50 pb-4">
            <div>
              <span className="editorial-lead text-xs text-primary font-bold">{t("services.tagline")}</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif mt-1.5">{t("services.systems")}</h2>
            </div>
            <Link
              href="/services"
              className="flex items-center space-x-2 text-xs font-semibold tracking-wider uppercase text-primary hover:text-primary-hover transition-colors"
            >
              <span>{t("gallery.filterAll")}</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Responsive Touch Cards / Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                title: "Keratin Bondings",
                desc: "Individuell verschmolzene italienische Keratinbonds. Bietet maximale Stylingflexibilität und 4-5 Monate Haltbarkeit.",
                price: "Ab 650€",
                link: "/services",
              },
              {
                title: "Invisible Tape-Ins",
                desc: "Flache, ultraleichte Verbindungen. Ideal für feines Haar zur gezielten Verdichtung und Längenauffüllung.",
                price: "Ab 420€",
                link: "/services",
              },
              {
                title: "Invisible Genius Weft",
                desc: "Schonende Einarbeitung per Weft-Nähtechnik. Perfekt für maximales Volumen ohne Klebstoff oder Hitze.",
                price: "Ab 580€",
                link: "/services",
              },
            ].map((srv, idx) => (
              <div
                key={idx}
                className="border border-card-border rounded-2xl p-5 sm:p-6 bg-card-bg glow-gold flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="text-[10px] text-primary tracking-widest font-semibold uppercase block">System 0{idx + 1}</span>
                  <h3 className="text-base sm:text-lg font-serif font-semibold text-foreground uppercase tracking-wide">{srv.title}</h3>
                  <p className="text-xs text-foreground/60 leading-relaxed font-light">{srv.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-card-border/40 flex justify-between items-center text-xs">
                  <span className="font-semibold text-primary">{srv.price}</span>
                  <Link href={srv.link} className="font-semibold uppercase tracking-wider text-foreground hover:text-primary transition-colors flex items-center space-x-1">
                    <span>Details</span>
                    <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Premium Booking System Section */}
      <section id="booking" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-background border-t border-card-border/30 bg-accent-muted/10 scroll-mt-10">
        <div className="max-w-4xl mx-auto mb-8 sm:mb-12 text-center space-y-2">
          <span className="editorial-lead text-xs text-primary font-bold">{t("booking.tagline")}</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif">{t("booking.title")}</h2>
          <p className="text-xs text-foreground/60 leading-relaxed font-light max-w-md mx-auto">
            {t("booking.desc")}
          </p>
        </div>

        <React.Suspense fallback={
          <div className="flex items-center justify-center p-8 border border-card-border rounded-3xl bg-card-bg glow-gold min-h-[250px] w-full max-w-4xl mx-auto">
            <div className="text-center space-y-4">
              <span className="editorial-lead text-[10px] text-primary font-bold block animate-pulse">
                {t("booking.loading")}
              </span>
            </div>
          </div>
        }>
          <BookingSystem />
        </React.Suspense>
      </section>

      {/* 7. Luxury Reviews & Testimonials */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-background">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-16">
          <div className="text-center max-w-xl mx-auto">
            <span className="editorial-lead text-xs text-primary font-bold">{t("reviews.tagline")}</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif mt-1.5 mb-3">{t("reviews.title")}</h2>
            <p className="text-xs text-foreground/60 leading-relaxed font-light">
              {t("reviews.desc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev, idx) => (
              <div
                key={idx}
                className="border border-card-border rounded-2xl p-5 sm:p-6 bg-card-bg glow-gold space-y-4 relative flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex space-x-1 text-primary">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-xs text-foreground/75 leading-relaxed font-light italic">
                    "{rev.text}"
                  </p>
                </div>
                <div className="pt-4 border-t border-card-border/40 flex justify-between items-center text-[10px] text-foreground/45">
                  <span className="font-semibold uppercase tracking-wider text-foreground">{rev.name}</span>
                  <span>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Customized Map & Details Section */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-background border-t border-card-border/30 bg-accent-muted/10">
        <AtelierMap />
      </section>

      {/* Floating Bottom Quick Action Dock on Mobile */}
      <div className="md:hidden fixed bottom-3 inset-x-4 z-40">
        <div className="bg-background/95 backdrop-blur-2xl border border-card-border p-2 rounded-full shadow-2xl flex items-center justify-between gap-2 glow-gold">
          <a
            href="tel:01746571715"
            className="p-3 rounded-full border border-card-border text-foreground/80 hover:text-primary flex items-center justify-center shrink-0 min-w-[42px] min-h-[42px] bg-foreground/3"
            aria-label="Direct Call Atelier"
          >
            <Phone size={14} />
          </a>
          <Link
            href="/#booking"
            className="flex-1 py-3 px-4 rounded-full bg-primary text-background text-xs tracking-wider uppercase font-bold text-center flex items-center justify-center space-x-2 shadow-md min-h-[42px]"
          >
            <Calendar size={13} />
            <span>{t("nav.bookNow")}</span>
          </Link>
          <Link
            href="/configurator"
            className="p-3 rounded-full border border-card-border text-primary hover:text-primary-hover flex items-center justify-center shrink-0 min-w-[42px] min-h-[42px] bg-primary/5"
            aria-label="Hair Configurator"
          >
            <Sparkles size={14} />
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
