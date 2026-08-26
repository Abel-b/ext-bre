"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-background border-t border-card-border mt-auto pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Column */}
        <div className="flex flex-col space-y-6">
          <Link href="/" className="text-3xl font-serif tracking-[0.2em] uppercase font-bold text-foreground">
            Extensions
            <span className="block text-[10px] tracking-[0.45em] text-primary uppercase font-sans font-light -mt-1 ml-0.5">
              Bremen
            </span>
          </Link>
          <p className="text-xs text-foreground/60 leading-relaxed font-light">
            {t("brand.p1")}
          </p>
          <div className="flex space-x-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 border border-card-border rounded-full hover:border-primary hover:text-primary text-foreground/60 transition-colors flex items-center justify-center"
              aria-label="Instagram Link"
            >
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 border border-card-border rounded-full hover:border-primary hover:text-primary text-foreground/60 transition-colors flex items-center justify-center"
              aria-label="Facebook Link"
            >
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>
        </div>

        {/* Navigation Links Column */}
        <div>
          <h4 className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-6">Navigation</h4>
          <ul className="space-y-3.5 text-xs text-foreground/75 font-medium">
            <li>
              <Link href="/services" className="hover:text-primary transition-colors">{t("nav.services")}</Link>
            </li>
            <li>
              <Link href="/configurator" className="hover:text-primary transition-colors">{t("nav.configurator")}</Link>
            </li>
            <li>
              <Link href="/consultation" className="hover:text-primary transition-colors">{t("nav.consultation")}</Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-primary transition-colors">{t("nav.gallery")}</Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-primary transition-colors">{t("nav.admin")}</Link>
            </li>
          </ul>
        </div>

        {/* Hours Column */}
        <div>
          <h4 className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-6">{t("map.hoursTitle")}</h4>
          <ul className="space-y-3 text-xs text-foreground/60 leading-relaxed font-light">
            <li className="flex justify-between border-b border-card-border/50 pb-1.5">
              <span>Dienstag - Freitag</span>
              <span className="font-medium text-foreground">10:00 - 19:00</span>
            </li>
            <li className="flex justify-between border-b border-card-border/50 pb-1.5">
              <span>Samstag</span>
              <span className="font-medium text-foreground">09:00 - 16:00</span>
            </li>
            <li className="flex justify-between pb-1.5">
              <span>Sonntag & Montag</span>
              <span className="font-medium text-primary uppercase text-[10px] tracking-wider">Geschlossen</span>
            </li>
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h4 className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-6">{t("map.title")}</h4>
          <ul className="space-y-4 text-xs text-foreground/60 font-light">
            <li className="flex items-start space-x-3">
              <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
              <span>{t("map.addressText")}</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone size={14} className="text-primary shrink-0" />
              <a href="tel:01746571715" className="hover:text-primary transition-colors">0174 6571715</a>
            </li>
            <li className="flex items-center space-x-3">
              <Mail size={14} className="text-primary shrink-0" />
              <a href="mailto:info@extensions-bremen.de" className="hover:text-primary transition-colors">info@extensions-bremen.de</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 border-t border-card-border/40 pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-foreground/50 font-light space-y-4 md:space-y-0">
        <div>
          &copy; {currentYear} Extensions Bremen. All Rights Reserved.
        </div>
        <div className="flex space-x-6">
          <Link href="/impressum" className="hover:text-primary transition-colors">Impressum</Link>
          <Link href="/datenschutz" className="hover:text-primary transition-colors">Datenschutz</Link>
          <Link href="/cookie-settings" className="hover:text-primary transition-colors">Cookie-Einstellungen</Link>
        </div>
      </div>
    </footer>
  );
}
