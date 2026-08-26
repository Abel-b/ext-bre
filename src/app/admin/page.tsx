"use client";

import React, { useState, useEffect } from "react";
import { db, Appointment, HairService } from "@/lib/db";
import { DollarSign, Calendar, Scissors, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<HairService[]>([]);

  useEffect(() => {
    setAppointments(db.getAppointments());
    setServices(db.getServices());
  }, []);

  const totalBookings = appointments.length;
  const activeBookings = appointments.filter((a) => a.status === "confirmed" || a.status === "pending").length;
  
  // Estimate revenue from bookings
  const calculateRevenue = () => {
    let sum = 0;
    appointments.forEach((apt) => {
      if (apt.status !== "cancelled") {
        if (apt.hairConfig?.price) {
          sum += apt.hairConfig.price;
        } else {
          const service = services.find((s) => s.id === apt.serviceId);
          sum += service ? service.price : 0;
        }
      }
    });
    return sum;
  };

  const estimatedRevenue = calculateRevenue();
  const avgTicket = totalBookings > 0 ? Math.round(estimatedRevenue / totalBookings) : 0;

  // Group bookings by service name
  const getMethodPopularity = () => {
    const counts: Record<string, number> = {};
    appointments.forEach((apt) => {
      counts[apt.serviceName] = (counts[apt.serviceName] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  };

  const popularity = getMethodPopularity();

  const getLocalizedServiceName = (name: string) => {
    if (t("locale") === "de") {
      if (name.includes("Keratin")) return "Keratin-Bondings";
      if (name.includes("Tape")) return "Unsichtbare Tape-Ins";
      if (name.includes("Weft")) return "Genius-Tressen (Weft)";
      if (name.includes("Balayage")) return "Balayage & Blending-Schnitt";
      if (name.includes("Treatment")) return "Olaplex & Kaviar-Tiefenpflege";
    }
    return name;
  };

  return (
    <div className="space-y-10">
      
      {/* Header */}
      <div>
        <span className="editorial-lead text-[10px] text-primary font-bold">Atelier Backend</span>
        <h1 className="text-3xl font-serif mt-1 font-medium tracking-wide uppercase">{t("admin.title")}</h1>
        <p className="text-xs text-foreground/50 mt-1 font-light">
          {t("admin.desc")}
        </p>
      </div>

      {/* Grid Cards Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div className="border border-card-border p-5 rounded-2xl bg-card-bg glow-gold flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-wider uppercase text-foreground/45 font-semibold">{t("admin.totalRevenue")}</span>
            <div className="text-2xl font-serif text-primary font-bold mt-1.5">{estimatedRevenue} €</div>
            <span className="text-[9px] text-emerald-500 font-semibold block mt-1">+14.2% from last month</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <DollarSign size={16} />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="border border-card-border p-5 rounded-2xl bg-card-bg glow-gold flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-wider uppercase text-foreground/45 font-semibold">{t("admin.activeBookings")}</span>
            <div className="text-2xl font-serif text-foreground font-bold mt-1.5">{activeBookings}</div>
            <span className="text-[9px] text-foreground/40 font-light block mt-1">
              {t("locale") === "de" ? "Bestätigt & Ausstehend" : "Confirmed & pending"}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Calendar size={16} />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="border border-card-border p-5 rounded-2xl bg-card-bg glow-gold flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-wider uppercase text-foreground/45 font-semibold">{t("admin.avgTicket")}</span>
            <div className="text-2xl font-serif text-foreground font-bold mt-1.5">{avgTicket} €</div>
            <span className="text-[9px] text-foreground/40 font-light block mt-1">
              {t("locale") === "de" ? "Pro Einarbeitungsticket" : "Per appointment booking"}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <TrendingUp size={16} />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="border border-card-border p-5 rounded-2xl bg-card-bg glow-gold flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-wider uppercase text-foreground/45 font-semibold">{t("admin.cmsTreatments")}</span>
            <div className="text-2xl font-serif text-foreground font-bold mt-1.5">{services.length}</div>
            <span className="text-[9px] text-foreground/40 font-light block mt-1">
              {t("locale") === "de" ? "Aktive Salon-Services" : "Active salon services"}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Scissors size={16} />
          </div>
        </div>

      </div>

      {/* Dashboard Breakdown Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Appointments List (CRM Summary) */}
        <div className="lg:col-span-8 border border-card-border p-6 rounded-2xl bg-card-bg glow-gold flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs tracking-wider uppercase font-bold text-foreground">{t("admin.recentAppointments")}</span>
              <Link href="/admin/appointments" className="text-[10px] tracking-wider uppercase font-bold text-primary hover:text-primary-hover">
                {t("admin.viewCrm")}
              </Link>
            </div>

            <div className="space-y-4">
              {appointments.slice(0, 3).map((apt) => (
                <div key={apt.id} className="flex items-center justify-between border-b border-card-border/50 pb-3 last:border-0 last:pb-0">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-foreground block">{apt.clientName}</span>
                    <span className="text-[10px] text-foreground/50 block font-light">
                      {getLocalizedServiceName(apt.serviceName)} &bull; {apt.date} um {apt.time} Uhr
                    </span>
                  </div>
                  <div>
                    <span className={`text-[9px] tracking-wider uppercase font-bold px-2 py-1 rounded-md border ${
                      apt.status === "confirmed"
                        ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-500"
                        : "border-amber-500/20 bg-amber-500/5 text-amber-500"
                    }`}>
                      {t(`admin.${apt.status}`)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Methods Ratio */}
        <div className="lg:col-span-4 border border-card-border p-6 rounded-2xl bg-card-bg glow-gold">
          <span className="text-xs tracking-wider uppercase font-bold text-foreground block mb-6">{t("admin.popularity")}</span>
          <div className="space-y-5">
            {popularity.map(([name, count]) => {
              const percentage = Math.round((count / totalBookings) * 100);
              return (
                <div key={name} className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wider">
                    <span className="text-foreground/80 truncate max-w-[80%]">{getLocalizedServiceName(name)}</span>
                    <span className="text-primary">{count} {t("locale") === "de" ? "Buchungen" : "bookings"}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-card-border overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
