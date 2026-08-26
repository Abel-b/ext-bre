"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);

  useEffect(() => {
    const logged = sessionStorage.getItem("ext2_admin_logged");
    setIsAuthenticated(logged === "true");
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "bremen-couture") {
      sessionStorage.setItem("ext2_admin_logged", "true");
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#f9f6f0] flex items-center justify-center p-6 relative overflow-hidden">
        
        {/* Cinematic Backdrop Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md bg-[#0e0e0e] border border-primary/15 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10 space-y-8">
          <div className="text-center">
            <span className="editorial-lead text-[9px] text-primary font-bold tracking-[0.25em] uppercase">
              {t("admin.security")}
            </span>
            <h1 className="text-2xl font-serif mt-2 mb-1 tracking-wide uppercase text-white">Atelier Admin</h1>
            <p className="text-[11px] text-white/50 font-light">
              {t("admin.passcodeLabel")}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex flex-col space-y-1.5 relative">
              <label htmlFor="admin-passcode" className="text-[9px] uppercase tracking-wider text-white/40">
                {t("admin.security")}
              </label>
              <div className="relative">
                <input
                  type={showPasscode ? "text" : "password"}
                  id="admin-passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-3.5 pl-10 pr-10 bg-black/45 border border-primary/20 rounded-xl text-xs text-white focus:border-primary outline-none transition-colors"
                  required
                />
                <KeyRound size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary" />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  {showPasscode ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-[10px] text-rose-500 font-semibold tracking-wider uppercase text-center animate-pulse">
                Invalid passcode. Access denied.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-background text-xs tracking-wider uppercase font-bold shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer"
            >
              {t("admin.unlock")}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-white/5">
            <span className="text-[9px] text-white/35 font-light tracking-wide block">
              {t("admin.passcodeHint")} <span className="text-primary font-semibold select-all font-mono">bremen-couture</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background text-foreground transition-colors duration-500 pt-20 lg:pt-0">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
