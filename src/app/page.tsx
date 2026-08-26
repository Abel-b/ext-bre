"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ChevronRight, Star, Clock, MapPin, Compass, ArrowRight } from "lucide-react";
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
    const generated = Array.from({ length: 15 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
    }));
    setParticles(generated);
  }, []);

  const reviews = [
    {
      name: "Katharina S.",
      text: "Extensions Bremen hat mein Selbstvertrauen komplett verändert. Die Keratinbonds verschmelzen so perfekt mit meinem Haar, dass selbst mein Mann nicht sagen konnte, wo sie befestigt sind. Absolute Luxusbehandlung!",
      rating: 5,
      date: "vor 2 Wochen",
    },
    {
      name: "Julia M.",
      text: "Unglaublicher Service! Die Beratung ist extrem professionell, sie nehmen sich Zeit, um die richtigen Töne abzustimmen. Der Champagner war exzellent, und meine Tapes sehen absolut traumhaft aus.",
      rating: 5,
      date: "vor 1 Monat",
    },
    {
      name: "Lena H.",
      text: "Die Genius-Tressen sind fantastisch. Komplett ohne Kleber, flach am Kopf, extrem leicht. Der beste Salon in Bremen, ohne Zweifel.",
      rating: 5,
      date: "vor 2 Monaten",
    },
  ];

  return (
    <>
      <Navbar />

      {/* 1. Cinematic Hero Section */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505] text-white">
        
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none z-10 animate-pulse" />

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
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 w-full z-20 pt-20">
          <div className="max-w-2xl space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <span className="editorial-lead text-xs text-primary font-bold tracking-[0.25em] uppercase">
                {t("hero.tagline")}
              </span>
              <h1 className="text-5xl md:text-7xl font-serif mt-3 font-light leading-[1.1] tracking-wide text-white">
                {t("hero.title").split(".")[0]}. <br />
                <span className="italic font-normal text-primary">
                  {t("hero.title").split(".")[1]}
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="text-sm md:text-base text-white/70 font-light leading-relaxed max-w-lg"
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
            >
              <Link
                href="#booking"
                className="flex items-center justify-center space-x-2 px-8 py-4 rounded-full bg-primary text-background text-xs tracking-wider uppercase font-semibold hover:bg-primary-hover shadow-lg hover:shadow-primary/20 transition-all duration-300"
              >
                <Calendar size={13} />
                <span>{t("hero.ctaBook")}</span>
              </Link>
              <Link
                href="/configurator"
                className="flex items-center justify-center space-x-2 px-8 py-4 rounded-full border border-white/20 hover:border-white text-xs tracking-wider uppercase font-semibold transition-colors"
              >
                <span>{t("hero.ctaDesign")}</span>
                <ChevronRight size={13} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Editorial Brand Narrative Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-background border-b border-card-border/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="editorial-lead text-xs text-primary font-bold">{t("brand.tagline")}</span>
            <h2 className="text-4xl font-serif text-foreground font-light leading-snug">
              {t("brand.title").split(".")[0]}. <br />
              <span className="italic font-normal text-primary">
                {t("brand.title").split(".")[1]}
              </span>
            </h2>
            <div className="h-[1px] w-20 bg-primary" />
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-foreground/60 leading-relaxed font-light">
            <p>{t("brand.p1")}</p>
            <p>{t("brand.p2")}</p>
          </div>

        </div>
      </section>

      {/* 3. Before & After Interactive Showcase */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-background">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <span className="editorial-lead text-xs text-primary font-bold">{t("gallery.tagline")}</span>
            <h2 className="text-3xl md:text-4xl font-serif mt-2 mb-4">{t("gallery.title")}</h2>
            <p className="text-xs text-foreground/60 leading-relaxed font-light">
              {t("gallery.desc")}
            </p>
          </div>

          <BeforeAfter />
        </div>
      </section>

      {/* 4. Immersive Salon Walkthrough Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-background border-t border-b border-card-border/30 bg-accent-muted/10">
        <SalonWalkthrough />
      </section>

      {/* 5. Interactive Services Explorer */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-background">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-card-border/50 pb-6">
            <div>
              <span className="editorial-lead text-xs text-primary font-bold">{t("services.tagline")}</span>
              <h2 className="text-3xl md:text-4xl font-serif mt-2">{t("services.systems")}</h2>
            </div>
            <Link
              href="/services"
              className="flex items-center space-x-2 text-xs font-semibold tracking-wider uppercase text-primary hover:text-primary-hover transition-colors"
            >
              <span>{t("gallery.filterAll")}</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                className="border border-card-border rounded-2xl p-6 bg-card-bg glow-gold flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <span className="text-[10px] text-primary tracking-widest font-semibold uppercase block">System 0{idx + 1}</span>
                  <h3 className="text-lg font-serif font-semibold text-foreground uppercase tracking-wide">{srv.title}</h3>
                  <p className="text-xs text-foreground/60 leading-relaxed font-light">{srv.desc}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-card-border/40 flex justify-between items-center text-xs">
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
      <section id="booking" className="py-24 md:py-32 px-6 md:px-12 bg-background border-t border-card-border/30 bg-accent-muted/10 scroll-mt-10">
        <div className="max-w-4xl mx-auto mb-12 text-center space-y-3">
          <span className="editorial-lead text-xs text-primary font-bold">{t("booking.tagline")}</span>
          <h2 className="text-3xl md:text-4xl font-serif">{t("booking.title")}</h2>
          <p className="text-xs text-foreground/60 leading-relaxed font-light max-w-md mx-auto">
            {t("booking.desc")}
          </p>
        </div>

        <React.Suspense fallback={
          <div className="flex items-center justify-center p-12 border border-card-border rounded-3xl bg-card-bg glow-gold min-h-[300px] w-full max-w-4xl mx-auto">
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
      <section className="py-24 md:py-32 px-6 md:px-12 bg-background">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-xl mx-auto">
            <span className="editorial-lead text-xs text-primary font-bold">{t("reviews.tagline")}</span>
            <h2 className="text-3xl md:text-4xl font-serif mt-2 mb-4">{t("reviews.title")}</h2>
            <p className="text-xs text-foreground/60 leading-relaxed font-light">
              {t("reviews.desc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev, idx) => (
              <div
                key={idx}
                className="border border-card-border rounded-2xl p-6 bg-card-bg glow-gold space-y-4 relative flex flex-col justify-between"
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
      <section className="py-24 md:py-32 px-6 md:px-12 bg-background border-t border-card-border/30 bg-accent-muted/10">
        <AtelierMap />
      </section>

      <Footer />
    </>
  );
}
