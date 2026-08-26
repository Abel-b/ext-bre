"use client";

import React, { useState, useEffect } from "react";
import { db, Appointment } from "@/lib/db";
import { Mail, Phone, Calendar, Clock, Check, X, RefreshCw } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function AppointmentsCRM() {
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);

  useEffect(() => {
    setAppointments(db.getAppointments());
  }, []);

  const refreshList = () => {
    setAppointments(db.getAppointments());
    if (selectedApt) {
      const refreshed = db.getAppointments().find(a => a.id === selectedApt.id);
      setSelectedApt(refreshed || null);
    }
  };

  const handleUpdateStatus = (id: string, status: Appointment["status"]) => {
    db.updateAppointmentStatus(id, status);
    refreshList();
  };

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

  const getLocalizedColor = (col: string) => {
    if (t("locale") === "de") {
      if (col === "Rich Espresso") return "Dunkles Espresso";
      if (col === "Champagne Blonde") return "Champagner-Blond";
      if (col === "Honey Balayage") return "Honig-Balayage";
      if (col === "Obsidian Jet Black") return "Tiefschwarz";
    }
    return col;
  };

  const getLocalizedVolume = (vol: string) => {
    if (t("locale") === "de") {
      if (vol.includes("Fine")) return "Feines Haar / Akzent (100g)";
      if (vol.includes("Medium")) return "Normales Haar / Volumen (150g)";
      if (vol.includes("Couture") || vol.includes("Maximum")) return "Maximales Couture-Volumen (200g)";
    }
    return vol;
  };

  return (
    <div className="space-y-10">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <span className="editorial-lead text-[10px] text-primary font-bold">Client Relations</span>
          <h1 className="text-3xl font-serif mt-1 font-medium tracking-wide uppercase">{t("locale") === "de" ? "Buchungs-CRM" : "Appointments CRM"}</h1>
          <p className="text-xs text-foreground/50 mt-1 font-light">
            {t("locale") === "de" ? "Kundenakten einsehen, Status verwalten und Haar-Spezifikationen einsehen." : "Monitor client records, update status, and view custom hair configurations."}
          </p>
        </div>
        <button
          onClick={refreshList}
          className="p-2 border border-card-border rounded-full hover:border-primary text-foreground/60 hover:text-primary transition-colors cursor-pointer"
          aria-label="Refresh list"
        >
          <RefreshCw size={13} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Appointments List (LHS) */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-xs tracking-wider uppercase font-bold text-foreground block">{t("admin.queue")}</span>
          
          <div className="space-y-3.5">
            {appointments.map((apt) => {
              const isSelected = selectedApt?.id === apt.id;
              return (
                <div
                  key={apt.id}
                  onClick={() => setSelectedApt(apt)}
                  className={`p-5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-card-border bg-card-bg hover:border-foreground/20"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">{apt.clientName}</h4>
                      <div className="text-[10px] text-foreground/50 font-light mt-1 flex items-center space-x-1">
                        <Calendar size={11} className="text-primary" />
                        <span>{apt.date}</span>
                        <span className="px-1">&bull;</span>
                        <Clock size={11} className="text-primary" />
                        <span>{apt.time} Uhr</span>
                      </div>
                      <p className="text-[11px] text-foreground/80 font-medium mt-2">{getLocalizedServiceName(apt.serviceName)}</p>
                    </div>

                    <div className="flex flex-col items-end space-y-3">
                      <span className={`text-[9px] tracking-wider uppercase font-bold px-2 py-1 rounded-md border ${
                        apt.status === "confirmed"
                          ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-500"
                          : apt.status === "cancelled"
                          ? "border-rose-500/25 bg-rose-500/5 text-rose-500"
                          : "border-amber-500/20 bg-amber-500/5 text-amber-500"
                      }`}>
                        {t(`admin.${apt.status}`)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Client Sheet (RHS) */}
        <div className="lg:col-span-5">
          <span className="text-xs tracking-wider uppercase font-bold text-foreground block mb-4">{t("admin.clientSheet")}</span>
          
          {selectedApt ? (
            <div className="border border-card-border p-6 rounded-2xl bg-card-bg glow-gold space-y-6">
              
              {/* Header Details */}
              <div className="pb-4 border-b border-card-border/50">
                <span className="text-[10px] tracking-widest uppercase text-foreground/45">{t("admin.profile")}</span>
                <h3 className="text-xl font-serif text-foreground font-semibold mt-1">{selectedApt.clientName}</h3>
                <span className="text-[10px] text-primary tracking-wide block mt-1">ID: {selectedApt.id}</span>
              </div>

              {/* Contacts */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center space-x-2.5 text-foreground/75">
                  <Mail size={13} className="text-primary shrink-0" />
                  <a href={`mailto:${selectedApt.clientEmail}`} className="hover:text-primary transition-colors">{selectedApt.clientEmail}</a>
                </div>
                <div className="flex items-center space-x-2.5 text-foreground/75">
                  <Phone size={13} className="text-primary shrink-0" />
                  <a href={`tel:${selectedApt.clientPhone}`} className="hover:text-primary transition-colors">{selectedApt.clientPhone}</a>
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="space-y-2 border-t border-b border-card-border/50 py-4">
                <span className="text-[10px] tracking-wider uppercase text-foreground/45 font-bold block mb-2.5">{t("admin.updateStatus")}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedApt.id, "confirmed")}
                    disabled={selectedApt.status === "confirmed"}
                    className="flex-1 py-2 px-3 border border-card-border rounded-lg text-[10px] tracking-wider uppercase font-bold text-foreground/80 hover:border-emerald-500 hover:text-emerald-500 transition-colors disabled:opacity-40 disabled:hover:border-card-border disabled:hover:text-foreground/80 flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Check size={11} />
                    <span>{t("admin.btnConfirm")}</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedApt.id, "cancelled")}
                    disabled={selectedApt.status === "cancelled"}
                    className="flex-1 py-2 px-3 border border-card-border rounded-lg text-[10px] tracking-wider uppercase font-bold text-foreground/80 hover:border-rose-500 hover:text-rose-500 transition-colors disabled:opacity-40 disabled:hover:border-card-border disabled:hover:text-foreground/80 flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <X size={11} />
                    <span>{t("admin.btnCancel")}</span>
                  </button>
                </div>
              </div>

              {/* Custom Hair Specifications if present */}
              {selectedApt.hairConfig ? (
                <div className="space-y-3.5 border-b border-card-border/50 pb-4">
                  <span className="text-[10px] tracking-wider uppercase text-primary font-bold block">{t("admin.configSpecs")}</span>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-foreground/40 block text-[9px] uppercase tracking-wider">{t("configurator.step2").split(".")[1].trim()}</span>
                      <span className="font-semibold text-foreground">{selectedApt.hairConfig.length}</span>
                    </div>
                    <div>
                      <span className="text-foreground/40 block text-[9px] uppercase tracking-wider">{t("configurator.step1").split(".")[1].trim()}</span>
                      <span className="font-semibold text-foreground">{getLocalizedColor(selectedApt.hairConfig.color)}</span>
                    </div>
                    <div>
                      <span className="text-foreground/40 block text-[9px] uppercase tracking-wider">{t("configurator.step5").split(".")[1].trim()}</span>
                      <span className="font-semibold text-foreground">{selectedApt.hairConfig.texture === "Straight" && t("locale") === "de" ? "Glatt" : selectedApt.hairConfig.texture}</span>
                    </div>
                    <div>
                      <span className="text-foreground/40 block text-[9px] uppercase tracking-wider">{t("configurator.step3").split(".")[1].trim()}</span>
                      <span className="font-semibold text-foreground">{getLocalizedVolume(selectedApt.hairConfig.volume)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-[10px] text-foreground/40 font-light border-b border-card-border/50 pb-4">
                  {t("admin.noSpecs")}
                </div>
              )}

              {/* Notes */}
              <div>
                <span className="text-[10px] tracking-wider uppercase text-foreground/45 font-bold block mb-2">{t("admin.notes")}</span>
                <p className="text-xs text-foreground/75 leading-relaxed font-light p-3 border border-card-border rounded-xl bg-background/50 min-h-[60px]">
                  {selectedApt.notes || t("admin.noNotes")}
                </p>
              </div>

            </div>
          ) : (
            <div className="border border-dashed border-card-border p-12 rounded-2xl text-center text-xs text-foreground/45 font-light font-sans">
              {t("locale") === "de" ? "Wählen Sie eine Buchung aus der aktiven Liste aus, um das Kundendatenblatt anzuzeigen." : "Select an appointment card from the active queue to view detailed client worksheets."}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
