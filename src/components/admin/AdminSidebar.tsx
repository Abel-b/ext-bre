"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, Scissors, Eye, LogOut } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function AdminSidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();

  const handleLogout = () => {
    sessionStorage.removeItem("ext2_admin_logged");
    window.location.href = "/";
  };

  const links = [
    { name: t("admin.title"), href: "/admin", icon: <LayoutDashboard size={15} /> },
    { name: t("locale") === "de" ? "Buchungen (CRM)" : "Appointments CRM", href: "/admin/appointments", icon: <Calendar size={15} /> },
    { name: t("locale") === "de" ? "Services (CMS)" : "Services CMS", href: "/admin/services", icon: <Scissors size={15} /> },
    { name: t("locale") === "de" ? "Galerie (CMS)" : "Gallery CMS", href: "/admin/gallery", icon: <Eye size={15} /> },
  ];

  return (
    <aside className="w-full lg:w-64 bg-card-bg border-b lg:border-b-0 lg:border-r border-card-border p-6 flex flex-col justify-between shrink-0 glassmorphic">
      <div className="space-y-8">
        
        {/* Brand/Logo */}
        <div>
          <Link href="/" className="text-xl font-serif tracking-[0.2em] uppercase font-bold text-foreground">
            Extensions
            <span className="block text-[8px] tracking-[0.45em] text-primary uppercase font-sans font-light -mt-1 ml-0.5">
              Bremen &bull; Admin
            </span>
          </Link>
        </div>

        {/* Links */}
        <nav className="flex flex-row lg:flex-col lg:space-y-2 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 space-x-4 lg:space-x-0">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shrink-0 ${
                  isActive
                    ? "bg-primary text-background shadow-md"
                    : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="hidden lg:block pt-6 border-t border-card-border/60">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-all w-full text-left cursor-pointer"
        >
          <LogOut size={15} />
          <span>{t("admin.exit")}</span>
        </button>
      </div>
    </aside>
  );
}
