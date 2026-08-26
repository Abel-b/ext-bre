"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon, Menu, X, Calendar, Globe, Phone, MapPin, Sparkles } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { useTranslation } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navLinks = [
    { name: t("nav.services"), href: "/services" },
    { name: t("nav.configurator"), href: "/configurator" },
    { name: t("nav.consultation"), href: "/consultation" },
    { name: t("nav.gallery"), href: "/gallery" },
    { name: t("nav.admin"), href: "/admin" },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const toggleLanguage = () => {
    setLocale(locale === "de" ? "en" : "de");
  };

  // Enforce white text when unscrolled on homepage hero, and theme-adaptive colors elsewhere
  const isTransparent = !scrolled && pathname === "/" && !isOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "py-4 md:py-6 bg-transparent"
          : "py-3 md:py-4 bg-background/90 border-b border-card-border glassmorphic shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={handleLinkClick}
          className={`relative group font-serif tracking-[0.18em] uppercase font-bold transition-colors duration-300 ${
            isTransparent ? "text-white" : "text-foreground"
          }`}
          aria-label="Extensions Bremen Home"
        >
          <span className="text-lg sm:text-xl md:text-2xl font-normal block leading-tight">Extensions</span>
          <span className="block text-[8px] sm:text-[9px] tracking-[0.45em] text-primary uppercase font-sans font-light -mt-0.5">
            Bremen
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 lg:space-x-10" aria-label="Desktop menu">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-xs tracking-[0.15em] uppercase font-medium transition-colors duration-300 ${
                  isActive
                    ? "text-primary font-semibold"
                    : isTransparent
                    ? "text-white/80 hover:text-white"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls Desktop */}
        <div className="hidden md:flex items-center space-x-5 lg:space-x-6">
          
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-full border transition-all duration-300 cursor-pointer text-[10px] tracking-wider uppercase font-bold ${
              isTransparent
                ? "border-white/20 text-white/80 hover:text-white"
                : "border-card-border hover:border-primary text-foreground/80 hover:text-primary"
            }`}
            aria-label={`Switch language to ${locale === "de" ? "English" : "German"}`}
          >
            <Globe size={11} />
            <span>{locale === "de" ? "EN" : "DE"}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-full border transition-all duration-300 cursor-pointer ${
              isTransparent
                ? "border-white/20 text-white/80 hover:text-white"
                : "border-card-border hover:border-primary text-foreground/80 hover:text-primary"
            }`}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Booking CTA */}
          <Link
            href="/#booking"
            className="flex items-center space-x-2 px-6 py-3 rounded-full bg-primary text-background text-xs tracking-[0.15em] uppercase font-semibold hover:bg-primary-hover shadow-lg hover:shadow-primary/20 transition-all duration-300"
          >
            <Calendar size={13} />
            <span>{t("nav.bookNow")}</span>
          </Link>
        </div>

        {/* Mobile Touch Controls */}
        <div className="flex md:hidden items-center space-x-2">
          
          {/* Language Toggle Mobile */}
          <button
            onClick={toggleLanguage}
            className={`px-3 py-1.5 rounded-full border text-[10px] tracking-wider uppercase font-bold cursor-pointer transition-colors duration-300 min-h-[38px] flex items-center justify-center ${
              isTransparent ? "border-white/20 text-white hover:text-white bg-black/20" : "border-card-border text-foreground/80 bg-foreground/5"
            }`}
            aria-label="Toggle language"
          >
            {locale === "de" ? "EN" : "DE"}
          </button>

          {/* Theme Toggle Mobile */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border cursor-pointer transition-colors duration-300 min-w-[38px] min-h-[38px] flex items-center justify-center ${
              isTransparent ? "border-white/20 text-white hover:text-white bg-black/20" : "border-card-border text-foreground/80 bg-foreground/5"
            }`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Burger menu Mobile Trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 rounded-full border cursor-pointer transition-colors duration-300 min-w-[42px] min-h-[42px] flex items-center justify-center ${
              isOpen
                ? "border-primary bg-primary text-background"
                : isTransparent
                ? "border-white/20 text-white hover:text-white bg-black/20"
                : "border-card-border text-foreground bg-foreground/5"
            }`}
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Full-Screen Luxury Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-x-0 top-[60px] bottom-0 z-40 bg-background/98 backdrop-blur-2xl border-t border-card-border flex flex-col justify-between p-6 overflow-y-auto md:hidden"
          >
            {/* Top Navigation Links */}
            <div className="space-y-6 pt-4">
              <span className="editorial-lead text-[9px] text-primary font-bold block tracking-[0.25em]">
                {t("locale") === "de" ? "NAVIGATION & ATELIER" : "NAVIGATION & ATELIER"}
              </span>

              <nav className="flex flex-col space-y-3" aria-label="Mobile menu links">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={handleLinkClick}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                        isActive
                          ? "border-primary/40 bg-primary/10 text-primary font-semibold shadow-sm"
                          : "border-card-border/50 text-foreground/80 hover:text-foreground bg-foreground/2"
                      }`}
                    >
                      <span className="text-base font-serif tracking-wider uppercase font-medium">
                        {link.name}
                      </span>
                      {isActive && <Sparkles size={14} className="text-primary shrink-0" />}
                    </Link>
                  );
                })}
              </nav>

              {/* Quick Contact & Address Card on Mobile */}
              <div className="p-4 rounded-2xl border border-card-border/60 bg-foreground/3 space-y-2.5 text-xs">
                <div className="flex items-center space-x-2 text-foreground/80">
                  <MapPin size={13} className="text-primary shrink-0" />
                  <span className="truncate">Sagerstraße 11, 28757 Bremen-Vegesack</span>
                </div>
                <div className="flex items-center space-x-2 text-foreground/80">
                  <Phone size={13} className="text-primary shrink-0" />
                  <a href="tel:+4942198765432" className="font-semibold text-primary">{t("map.phoneDemo")}</a>
                  <span className="text-[10px] text-foreground/45">(Hotline • Demo)</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions (Thumb friendly & fixed above home bar) */}
            <div className="flex flex-col space-y-3 pt-6 pb-safe border-t border-card-border/60">
              <Link
                href="/#booking"
                onClick={handleLinkClick}
                className="flex items-center justify-center space-x-2 w-full py-4 rounded-full bg-primary text-background text-xs tracking-[0.18em] uppercase font-bold shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all min-h-[50px]"
              >
                <Calendar size={15} />
                <span>{t("nav.bookNow")}</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
