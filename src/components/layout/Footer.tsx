"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-background border-t border-card-border mt-auto pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Concept Prototype & GDPR Notice Card */}
        <div className="mb-14 p-5 sm:p-6 rounded-3xl border border-primary/20 bg-primary/5 text-foreground/80 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">
                {t("prototype.badge")}
              </span>
              <span className="text-[9px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-semibold">
                B2B Preview
              </span>
            </div>
            <p className="text-xs text-foreground/70 font-light leading-relaxed">
              {t("prototype.notice")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12 mb-14">
          
          {/* Brand Column */}
          <div className="flex flex-col space-y-5">
            <Link href="/" className="text-2xl font-serif tracking-[0.18em] uppercase font-bold text-foreground">
              Extensions
              <span className="block text-[9px] tracking-[0.45em] text-primary uppercase font-sans font-light -mt-0.5 ml-0.5">
                Bremen
              </span>
            </Link>
            <p className="text-xs text-foreground/60 leading-relaxed font-light">
              {t("brand.p1")}
            </p>
            <div className="flex space-x-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 border border-card-border rounded-full hover:border-primary hover:text-primary text-foreground/60 transition-colors flex items-center justify-center min-w-[38px] min-h-[38px]"
                aria-label="Instagram Link"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 border border-card-border rounded-full hover:border-primary hover:text-primary text-foreground/60 transition-colors flex items-center justify-center min-w-[38px] min-h-[38px]"
                aria-label="Facebook Link"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-5">Navigation</h4>
            <ul className="space-y-3 text-xs text-foreground/75 font-medium">
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
            <h4 className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-5">{t("map.hoursTitle")}</h4>
            <ul className="space-y-2.5 text-xs text-foreground/60 leading-relaxed font-light">
              <li className="flex justify-between border-b border-card-border/50 pb-1.5">
                <span>Di - Fr</span>
                <span className="font-medium text-foreground">10:00 - 19:00</span>
              </li>
              <li className="flex justify-between border-b border-card-border/50 pb-1.5">
                <span>Samstag</span>
                <span className="font-medium text-foreground">09:00 - 16:00</span>
              </li>
              <li className="flex justify-between pb-1">
                <span>So & Mo</span>
                <span className="font-medium text-primary uppercase text-[9px] tracking-wider">Geschlossen</span>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-5">{t("map.title")}</h4>
            <ul className="space-y-3 text-xs text-foreground/60 font-light">
              <li className="flex items-start space-x-2.5">
                <MapPin size={15} className="text-primary shrink-0 mt-0.5" />
                <span className="leading-snug">{t("map.addressText")}</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone size={14} className="text-primary shrink-0" />
                <a href="tel:+4942198765432" className="hover:text-primary transition-colors font-medium">
                  {t("map.phoneDemo")}
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail size={14} className="text-primary shrink-0" />
                <a href="mailto:atelier@extensions-bremen.de" className="hover:text-primary transition-colors">
                  atelier@extensions-bremen.de
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Subfooter */}
        <div className="border-t border-card-border/40 pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-foreground/50 font-light space-y-3 md:space-y-0">
          <div>
            &copy; {currentYear} Extensions Bremen &bull; Concept Prototype
          </div>
          <div className="flex space-x-5">
            <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
            <Link href="/configurator" className="hover:text-primary transition-colors">Konfigurator</Link>
            <Link href="/admin" className="hover:text-primary transition-colors">CRM Backend</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
