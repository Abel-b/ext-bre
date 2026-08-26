"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon, Menu, X, Calendar, Globe } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { useTranslation } from "@/lib/i18n";

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
  const isTransparent = !scrolled && pathname === "/";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isTransparent
          ? "py-6 bg-transparent"
          : "py-4 bg-background/80 border-b border-card-border glassmorphic"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link
          href="/"
          className={`relative group text-2xl font-serif tracking-[0.2em] uppercase font-bold transition-colors duration-300 ${
            isTransparent ? "text-white" : "text-foreground"
          }`}
          aria-label="Extensions Bremen Home"
        >
          <span className="relative z-10">Extensions</span>
          <span className="block text-[10px] tracking-[0.45em] text-primary uppercase font-sans font-light -mt-1 ml-0.5">
            Bremen
          </span>
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10" aria-label="Desktop menu">
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

        {/* Action Controls */}
        <div className="hidden md:flex items-center space-x-6">
          
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

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center space-x-4">
          
          {/* Language Toggle Mobile */}
          <button
            onClick={toggleLanguage}
            className={`px-2.5 py-1 rounded-full border text-[10px] tracking-wider uppercase font-bold cursor-pointer transition-colors duration-300 ${
              isTransparent ? "border-white/20 text-white hover:text-white" : "border-card-border text-foreground/80"
            }`}
            aria-label="Toggle language"
          >
            {locale === "de" ? "EN" : "DE"}
          </button>

          {/* Theme Toggle Mobile */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border cursor-pointer transition-colors duration-300 ${
              isTransparent ? "border-white/20 text-white hover:text-white" : "border-card-border text-foreground/80"
            }`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Burger menu Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 rounded-full border cursor-pointer transition-colors duration-300 ${
              isTransparent ? "border-white/20 text-white hover:text-white" : "border-card-border text-foreground"
            }`}
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 top-[72px] z-40 w-full bg-background border-t border-card-border flex flex-col justify-between p-8 md:hidden transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col space-y-6" aria-label="Mobile menu">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className={`text-lg font-serif tracking-widest uppercase transition-colors ${
                  isActive ? "text-primary font-medium" : "text-foreground/80 hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => {
              toggleLanguage();
              handleLinkClick();
            }}
            className="flex items-center justify-center space-x-2 w-full py-4 border border-card-border rounded-full text-foreground font-semibold text-xs tracking-wider uppercase cursor-pointer"
          >
            <Globe size={14} />
            <span>{locale === "de" ? "Switch to English" : "Auf Deutsch wechseln"}</span>
          </button>

          <Link
            href="/#booking"
            onClick={handleLinkClick}
            className="flex items-center justify-center space-x-2 w-full py-4 rounded-full bg-primary text-background text-sm tracking-[0.15em] uppercase font-semibold"
          >
            <Calendar size={16} />
            <span>{t("nav.bookNow")}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
