"use client";

import React, { useState, useEffect } from "react";
import { db, HairService } from "@/lib/db";
import { Check, Edit } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function ServicesCMS() {
  const { t } = useTranslation();
  const [services, setServices] = useState<HairService[]>([]);
  const [editingSrv, setEditingSrv] = useState<HairService | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setServices(db.getServices());
  }, []);

  const handleEditClick = (srv: HairService) => {
    setEditingSrv({ ...srv });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingSrv) return;
    const { name, value } = e.target;
    setEditingSrv((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: name === "price" ? Number(value) : value,
      };
    });
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSrv) return;

    db.updateService(editingSrv);
    setServices(db.getServices());
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setEditingSrv(null);
    }, 1500);
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

  return (
    <div className="space-y-10">
      
      {/* Header */}
      <div>
        <span className="editorial-lead text-[10px] text-primary font-bold">Content Management</span>
        <h1 className="text-3xl font-serif mt-1 font-medium tracking-wide uppercase">{t("locale") === "de" ? "Dienstleistungen-CMS" : "Services CMS"}</h1>
        <p className="text-xs text-foreground/50 mt-1 font-light">
          {t("locale") === "de" ? "Bearbeiten Sie die Einarbeitungsmethoden, Beschreibungen und aktiven Salonpreise." : "Modify the active catalog, pricing configurations, and styling descriptions."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Services List (LHS) */}
        <div className="lg:col-span-6 space-y-4">
          <span className="text-xs tracking-wider uppercase font-bold text-foreground block">{t("locale") === "de" ? "Aktive Dienstleistungen" : "Active Treatments"}</span>
          
          <div className="space-y-3.5">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="flex items-start justify-between p-5 border border-card-border rounded-xl bg-card-bg hover:border-foreground/20 transition-all"
              >
                <div className="max-w-[70%]">
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wider block">{getLocalizedServiceName(srv.name)}</span>
                  <span className="text-[10px] text-foreground/45 block mt-1.5">{srv.duration} &bull; {srv.category}</span>
                  <span className="text-[11px] text-foreground/70 font-light block mt-2 leading-relaxed truncate">{srv.description}</span>
                </div>

                <div className="text-right flex flex-col items-end space-y-3 shrink-0">
                  <span className="text-xs font-bold text-primary">{srv.price} €</span>
                  <button
                    onClick={() => handleEditClick(srv)}
                    className="p-2 border border-card-border hover:border-primary rounded-lg text-foreground/60 hover:text-primary transition-colors flex items-center space-x-1 cursor-pointer"
                    aria-label={`Edit ${srv.name}`}
                  >
                    <Edit size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CMS Editor Workspace (RHS) */}
        <div className="lg:col-span-6">
          <span className="text-xs tracking-wider uppercase font-bold text-foreground block mb-4">{t("admin.workspace")}</span>
          
          {editingSrv ? (
            <form onSubmit={handleSaveChanges} className="border border-card-border p-6 rounded-2xl bg-card-bg glow-gold space-y-5">
              <div className="pb-3 border-b border-card-border/50">
                <span className="text-[9px] tracking-widest uppercase text-primary font-bold">Modifying Item</span>
                <h3 className="text-lg font-serif text-foreground font-semibold mt-0.5">{getLocalizedServiceName(editingSrv.name)}</h3>
              </div>

              {/* Service Title */}
              <div className="flex flex-col space-y-1">
                <label htmlFor="service-name" className="text-[10px] uppercase tracking-wider text-foreground/50">{t("admin.serviceTitle")}</label>
                <input
                  type="text"
                  id="service-name"
                  name="name"
                  value={editingSrv.name}
                  onChange={handleInputChange}
                  className="p-3 bg-background border border-card-border rounded-xl text-xs focus:border-primary outline-none transition-colors"
                  required
                />
              </div>

              {/* Price & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label htmlFor="service-price" className="text-[10px] uppercase tracking-wider text-foreground/50">{t("admin.basePrice")}</label>
                  <input
                    type="number"
                    id="service-price"
                    name="price"
                    value={editingSrv.price}
                    onChange={handleInputChange}
                    className="p-3 bg-background border border-card-border rounded-xl text-xs focus:border-primary outline-none transition-colors"
                    min="0"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label htmlFor="service-duration" className="text-[10px] uppercase tracking-wider text-foreground/50">{t("admin.duration")}</label>
                  <input
                    type="text"
                    id="service-duration"
                    name="duration"
                    value={editingSrv.duration}
                    onChange={handleInputChange}
                    className="p-3 bg-background border border-card-border rounded-xl text-xs focus:border-primary outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col space-y-1">
                <label htmlFor="service-desc" className="text-[10px] uppercase tracking-wider text-foreground/50">{t("admin.description")}</label>
                <textarea
                  id="service-desc"
                  name="description"
                  value={editingSrv.description}
                  onChange={handleInputChange}
                  className="p-3 bg-background border border-card-border rounded-xl text-xs focus:border-primary outline-none transition-colors min-h-[70px] resize-none"
                  required
                />
              </div>

              {/* Detailed Breakdown */}
              <div className="flex flex-col space-y-1">
                <label htmlFor="service-details" className="text-[10px] uppercase tracking-wider text-foreground/50">{t("admin.specs")}</label>
                <textarea
                  id="service-details"
                  name="details"
                  value={editingSrv.details}
                  onChange={handleInputChange}
                  className="p-3 bg-background border border-card-border rounded-xl text-xs focus:border-primary outline-none transition-colors min-h-[90px] resize-none"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-3 border-t border-card-border/50">
                <button
                  type="button"
                  onClick={() => setEditingSrv(null)}
                  className="flex-1 py-3 px-4 border border-card-border rounded-xl text-[10px] tracking-wider uppercase font-semibold text-foreground/60 hover:border-foreground/30 transition-colors cursor-pointer"
                >
                  {t("admin.btnDiscard")}
                </button>
                <button
                  type="submit"
                  disabled={saveSuccess}
                  className="flex-1 py-3 px-4 rounded-xl bg-primary text-background text-[10px] tracking-wider uppercase font-bold hover:bg-primary-hover transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  {saveSuccess ? (
                    <>
                      <Check size={12} />
                      <span>{t("admin.btnSaved")}</span>
                    </>
                  ) : (
                    <span>{t("admin.btnPublish")}</span>
                  )}
                </button>
              </div>

            </form>
          ) : (
            <div className="border border-dashed border-card-border p-12 rounded-2xl text-center text-xs text-foreground/45 font-light font-sans">
              {t("locale") === "de" ? "Wählen Sie eine Dienstleistung aus der aktiven Liste aus, um Preise und Inhalte anzupassen." : "Select a service card from the active treatments list to modify prices and styling logs."}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
