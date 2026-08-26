"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { db, HairService, Appointment } from "@/lib/db";
import { Calendar as CalendarIcon, Clock, User, Phone, Mail, CheckCircle, Sparkles, AlertTriangle, RefreshCw, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

interface Specialist {
  id: string;
  name: string;
  roleKey: string;
}

const SPECIALISTS: Specialist[] = [
  { id: "any", name: "Erster freier Experte", roleKey: "Optimizes slot availability" },
  { id: "elena", name: "Elena Couture", roleKey: "Keratin & Bonding Specialist" },
  { id: "marina", name: "Marina V.", roleKey: "Invisible Tapes & Color Artistry" },
  { id: "sophie", name: "Sophie B.", roleKey: "Genius Wefts & Volume Extensions" },
];

const TIME_SLOTS = [
  "09:30", "11:00", "13:30", "15:00", "16:30", "18:00"
];

export default function BookingSystem() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [services, setServices] = useState<HairService[]>([]);
  const [step, setStep] = useState(1);

  // Form State
  const [selectedService, setSelectedService] = useState<HairService | null>(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist>(SPECIALISTS[0]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);
  const [notificationSent, setNotificationSent] = useState<"email" | "sms" | null>(null);

  // Pre-fill query parameters if navigated from Configurator or Services page
  useEffect(() => {
    const srvList = db.getServices();
    setServices(srvList);

    const methodQuery = searchParams.get("method");
    const serviceIdQuery = searchParams.get("serviceId");

    if (serviceIdQuery) {
      const match = srvList.find((s) => s.id === serviceIdQuery);
      if (match) setSelectedService(match);
    } else if (methodQuery) {
      if (methodQuery.toLowerCase().includes("keratin")) {
        const kMatch = srvList.find((s) => s.id === "keratin-bonds");
        if (kMatch) setSelectedService(kMatch);
      } else if (methodQuery.toLowerCase().includes("tape")) {
        const tMatch = srvList.find((s) => s.id === "tape-in");
        if (tMatch) setSelectedService(tMatch);
      } else if (methodQuery.toLowerCase().includes("weft") || methodQuery.toLowerCase().includes("tressen")) {
        const wMatch = srvList.find((s) => s.id === "invisible-weft");
        if (wMatch) setSelectedService(wMatch);
      }
    }
  }, [searchParams]);

  // Generate dynamic 14-day booking slots starting tomorrow
  const getNextDays = () => {
    const days: string[] = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      // Skip Sundays (0) and Mondays (1)
      if (d.getDay() !== 0 && d.getDay() !== 1) {
        days.push(d.toISOString().split("T")[0]);
      }
    }
    return days;
  };

  const availableDates = getNextDays();

  const handleNextStep = () => {
    if (step === 1 && selectedService) setStep(2);
    else if (step === 2 && selectedDate && selectedTime) setStep(3);
  };

  const handleBackStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const submitBooking = () => {
    if (!selectedService || !selectedDate || !selectedTime || !clientName || !clientEmail || !clientPhone) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newApt = db.addAppointment({
        clientName,
        clientEmail,
        clientPhone,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        date: selectedDate,
        time: selectedTime,
        status: "confirmed",
        notes: notes || undefined,
      });

      setConfirmedBooking(newApt);
      setIsSubmitting(false);
      setStep(4);
    }, 1200);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}.${m}.${y}`;
  };

  const getLocalizedRole = (roleKey: string) => {
    if (t("locale") === "de") {
      if (roleKey === "Optimizes slot availability") return "Optimiert Ihre Terminauswahl";
      if (roleKey === "Keratin & Bonding Specialist") return "Spezialistin für Keratinbonds";
      if (roleKey === "Invisible Tapes & Color Artistry") return "Expertin für Tapes & Balayage";
      if (roleKey === "Genius Wefts & Volume Extensions") return "Spezialistin für Genius-Tressen";
    }
    return roleKey;
  };

  const simulateNotification = (type: "email" | "sms") => {
    setNotificationSent(type === "email" ? "email" : "sms");
    setTimeout(() => {
      setNotificationSent(null);
    }, 3500);
  };

  // Localized service details inside booking
  const getLocalizedService = (srv: HairService | null) => {
    if (!srv) return null;
    let name = srv.name;
    if (srv.id === "keratin-bonds") {
      name = t("locale") === "de" ? "Keratin-Bondings" : "Keratin Bondings";
    } else if (srv.id === "tape-in") {
      name = t("locale") === "de" ? "Unsichtbare Tape-Ins" : "Invisible Tape-Ins";
    } else if (srv.id === "invisible-weft") {
      name = t("locale") === "de" ? "Genius-Tressen (Weft)" : "Invisible Genius Weft";
    } else if (srv.id === "color-match-cut") {
      name = t("locale") === "de" ? "Balayage & Blending-Schnitt" : "Bespoke Balayage & Blend";
    } else if (srv.id === "premium-treatment") {
      name = t("locale") === "de" ? "Olaplex & Kaviar-Tiefenpflege" : "Olaplex & Caviar Deep Care";
    }
    return { ...srv, name };
  };

  const finalService = getLocalizedService(selectedService);

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 p-4 sm:p-6 md:p-10 bg-card-bg border border-card-border rounded-3xl glow-gold shadow-xl">
      
      {/* Booking Summary Panel (LHS on Desktop, Top summary on Mobile) */}
      <div className="md:col-span-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-card-border pb-5 md:pb-0 md:pr-8">
        <div>
          <span className="editorial-lead text-[9px] text-primary font-bold">{t("booking.tagline")}</span>
          <h2 className="text-xl sm:text-2xl font-serif mt-0.5 mb-4 text-foreground uppercase tracking-wide">{t("booking.title")}</h2>
          
          <div className="space-y-4 text-xs">
            {finalService && (
              <div className="flex flex-col space-y-0.5 p-3 rounded-xl bg-background/50 border border-card-border/60">
                <span className="text-foreground/45 uppercase tracking-wider text-[8px] sm:text-[9px]">{t("booking.treatment")}</span>
                <span className="font-semibold text-foreground text-xs">{finalService.name}</span>
                <span className="text-[10px] text-primary font-bold">{finalService.price} € &bull; {finalService.duration}</span>
              </div>
            )}

            {selectedDate && (
              <div className="flex flex-col space-y-0.5 p-3 rounded-xl bg-background/50 border border-card-border/60">
                <span className="text-foreground/45 uppercase tracking-wider text-[8px] sm:text-[9px]">{t("booking.dateTime")}</span>
                <span className="font-semibold text-foreground text-xs">{formatDate(selectedDate)}</span>
                <span className="text-[10px] text-primary font-bold">{selectedTime} Uhr</span>
              </div>
            )}

            {selectedSpecialist && step >= 2 && (
              <div className="flex flex-col space-y-0.5 p-3 rounded-xl bg-background/50 border border-card-border/60">
                <span className="text-foreground/45 uppercase tracking-wider text-[8px] sm:text-[9px]">{t("booking.specialist")}</span>
                <span className="font-semibold text-foreground text-xs">{selectedSpecialist.name}</span>
                <span className="text-[10px] text-foreground/50 leading-relaxed font-light">{getLocalizedRole(selectedSpecialist.roleKey)}</span>
              </div>
            )}
          </div>
        </div>

        {step < 4 && finalService && (
          <div className="mt-6 border-t border-card-border/60 pt-3 text-[10px] text-foreground/50 leading-relaxed font-light">
            <span className="flex items-center space-x-1 text-primary uppercase font-bold text-[9px] mb-1">
              <AlertTriangle size={11} />
              <span>{t("booking.depositRequired")}</span>
            </span>
            {t("booking.depositDesc")}
          </div>
        )}
      </div>

      {/* Main Form Fields Panel (RHS) */}
      <div className="md:col-span-8 flex flex-col justify-between min-h-[380px]">
        <AnimatePresence mode="wait">
          
          {/* Step 1: Services Selection */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <h3 className="text-base sm:text-lg font-serif tracking-wider uppercase text-foreground">{t("booking.step1")}</h3>
              <div className="flex flex-col space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {services.map(getLocalizedService).map((srv) => {
                  if (!srv) return null;
                  const isSelected = selectedService?.id === srv.id;
                  return (
                    <button
                      key={srv.id}
                      onClick={() => setSelectedService(services.find(s => s.id === srv.id) || null)}
                      className={`flex justify-between items-start p-3.5 sm:p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-card-border bg-card-bg hover:border-foreground/25"
                      }`}
                    >
                      <div className="max-w-[75%] space-y-0.5">
                        <span className="text-xs font-semibold text-foreground uppercase tracking-wider block">{srv.name}</span>
                        <span className="text-[10px] text-foreground/55 font-light block leading-normal">
                          {t("locale") === "de"
                            ? (srv.id === "keratin-bonds" ? "Bonds aus bestem italienischem Keratin. Bietet maximalen Schwung." :
                               srv.id === "tape-in" ? "Hauchdünne Tapes, die extrem flach anliegen und feines Haar unbemerkt verdichten." :
                               srv.id === "invisible-weft" ? "Flache eingenähte Tressen für volles Volumen ohne Klebstoff oder Hitze." : srv.description)
                            : srv.description}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-primary block">{srv.price} €</span>
                        <span className="text-[9px] text-foreground/45 tracking-wider block mt-0.5">{srv.duration}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4 border-t border-card-border/50">
                <button
                  onClick={handleNextStep}
                  disabled={!selectedService}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary text-background text-xs tracking-wider uppercase font-bold hover:bg-primary-hover disabled:opacity-40 transition-all cursor-pointer shadow-md min-h-[46px]"
                >
                  {t("booking.btnNext")}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Date, Time & Stylist Choice */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-5"
            >
              <h3 className="text-base sm:text-lg font-serif tracking-wider uppercase text-foreground">{t("booking.step2")}</h3>
              
              {/* Specialist Selection */}
              <div>
                <span className="text-[10px] tracking-wider uppercase text-foreground/60 font-bold block mb-2">{t("booking.specialist")}</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SPECIALISTS.map((spec) => {
                    const isSelected = selectedSpecialist?.id === spec.id;
                    return (
                      <button
                        key={spec.id}
                        onClick={() => setSelectedSpecialist(spec)}
                        className={`p-2.5 border rounded-xl text-center cursor-pointer transition-all min-h-[42px] ${
                          isSelected ? "border-primary bg-primary/10 text-primary font-bold shadow-sm" : "border-card-border text-foreground/80 bg-card-bg hover:border-foreground/20"
                        }`}
                      >
                        <span className="text-[10px] block leading-tight">{spec.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date Selection (Touch Scrollable) */}
              <div>
                <span className="text-[10px] tracking-wider uppercase text-foreground/60 font-bold block mb-2">{t("booking.dateTime")}</span>
                <div className="flex space-x-2 overflow-x-auto pb-2 pr-1 no-scrollbar">
                  {availableDates.map((dateStr) => {
                    const isSelected = selectedDate === dateStr;
                    const parsed = new Date(dateStr);
                    const dayName = parsed.toLocaleDateString(t("locale") === "de" ? "de-DE" : "en-US", { weekday: "short" });
                    const dateNum = parsed.getDate();
                    return (
                      <button
                        key={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`flex flex-col items-center justify-center p-3 border rounded-xl shrink-0 min-w-[64px] min-h-[70px] cursor-pointer transition-all ${
                          isSelected ? "border-primary bg-primary/10 shadow-sm" : "border-card-border bg-card-bg hover:border-foreground/20"
                        }`}
                      >
                        <span className="text-[9px] uppercase tracking-wider text-foreground/45">{dayName}</span>
                        <span className="text-base font-serif font-bold text-foreground mt-0.5">{dateNum}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div>
                  <span className="text-[10px] tracking-wider uppercase text-foreground/60 font-bold block mb-2">Verfügbare Uhrzeiten</span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {TIME_SLOTS.map((timeStr) => {
                      const isSelected = selectedTime === timeStr;
                      return (
                        <button
                          key={timeStr}
                          onClick={() => setSelectedTime(timeStr)}
                          className={`py-2.5 px-2 border rounded-xl text-center text-xs tracking-wider font-semibold cursor-pointer transition-all min-h-[42px] ${
                            isSelected ? "border-primary bg-primary text-background shadow-md" : "border-card-border text-foreground/80 bg-card-bg hover:border-foreground/20"
                          }`}
                        >
                          {timeStr}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step Controls */}
              <div className="flex justify-between items-center pt-4 border-t border-card-border/50">
                <button
                  onClick={handleBackStep}
                  className="text-xs font-semibold uppercase tracking-wider text-foreground/50 hover:text-foreground cursor-pointer transition-colors py-2 px-3"
                >
                  {t("booking.btnBack")}
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!selectedDate || !selectedTime}
                  className="px-8 py-3.5 rounded-full bg-primary text-background text-xs tracking-wider uppercase font-bold hover:bg-primary-hover disabled:opacity-40 transition-all cursor-pointer shadow-md min-h-[46px]"
                >
                  {t("booking.btnNext")}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Contact & Client Information */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <h3 className="text-base sm:text-lg font-serif tracking-wider uppercase text-foreground">{t("booking.step3")}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col space-y-1">
                  <label htmlFor="client-name" className="text-[10px] uppercase tracking-wider text-foreground/50 font-bold">{t("booking.labelName")}</label>
                  <input
                    type="text"
                    id="client-name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Sophia Werner"
                    className="p-3.5 bg-background border border-card-border rounded-xl text-sm focus:border-primary outline-none transition-colors"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label htmlFor="client-email" className="text-[10px] uppercase tracking-wider text-foreground/50 font-bold">{t("booking.labelEmail")}</label>
                  <input
                    type="email"
                    id="client-email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="sophia@example.com"
                    className="p-3.5 bg-background border border-card-border rounded-xl text-sm focus:border-primary outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="flex flex-col space-y-1">
                  <label htmlFor="client-phone" className="text-[10px] uppercase tracking-wider text-foreground/50 font-bold">{t("booking.labelPhone")}</label>
                  <input
                    type="tel"
                    id="client-phone"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="0174 6571715"
                    className="p-3.5 bg-background border border-card-border rounded-xl text-sm focus:border-primary outline-none transition-colors"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label htmlFor="client-notes" className="text-[10px] uppercase tracking-wider text-foreground/50 font-bold">{t("booking.labelNotes")}</label>
                  <textarea
                    id="client-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t("locale") === "de" ? "Wünsche eintragen (z. B. Haargeschichte, Wunschfarben)..." : "Indicate preferences here (e.g. hair history, custom shades, tone blends)..."}
                    className="p-3.5 bg-background border border-card-border rounded-xl text-sm focus:border-primary outline-none transition-colors min-h-[85px] resize-none"
                  />
                </div>
              </div>

              {/* Step Controls */}
              <div className="flex justify-between items-center pt-4 border-t border-card-border/50">
                <button
                  onClick={handleBackStep}
                  className="text-xs font-semibold uppercase tracking-wider text-foreground/50 hover:text-foreground cursor-pointer transition-colors py-2 px-3"
                >
                  {t("booking.btnBack")}
                </button>
                <button
                  onClick={submitBooking}
                  disabled={isSubmitting || !clientName || !clientEmail || !clientPhone}
                  className="px-8 py-3.5 rounded-full bg-primary text-background text-xs tracking-wider uppercase font-bold hover:bg-primary-hover disabled:opacity-40 transition-all flex items-center space-x-2 cursor-pointer shadow-md min-h-[46px]"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>{t("booking.securing")}</span>
                    </>
                  ) : (
                    <span>{t("booking.btnConfirm")}</span>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Success & Confirmation */}
          {step === 4 && confirmedBooking && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-5 py-5"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto animate-pulse">
                <CheckCircle size={28} />
              </div>

              <div>
                <span className="editorial-lead text-[9px] text-primary font-bold block">{t("booking.step4")}</span>
                <h3 className="text-xl sm:text-2xl font-serif mt-1 text-foreground">{t("booking.successTitle")}</h3>
                <p className="text-xs text-foreground/50 font-light mt-1.5 max-w-sm mx-auto">
                  {t("booking.successDesc")}
                </p>
              </div>

              {/* Mock Notification Trigger Buttons */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-2.5 max-w-md mx-auto pt-2">
                <button
                  onClick={() => simulateNotification("email")}
                  className="w-full sm:w-auto px-4 py-3 border border-card-border rounded-xl text-[10px] tracking-wider uppercase font-semibold text-foreground/75 hover:border-primary flex items-center justify-center space-x-2 cursor-pointer bg-card-bg min-h-[42px]"
                >
                  <Mail size={12} />
                  <span>{t("booking.sendEmail")}</span>
                </button>
                <button
                  onClick={() => simulateNotification("sms")}
                  className="w-full sm:w-auto px-4 py-3 border border-card-border rounded-xl text-[10px] tracking-wider uppercase font-semibold text-foreground/75 hover:border-primary flex items-center justify-center space-x-2 cursor-pointer bg-card-bg min-h-[42px]"
                >
                  <Phone size={12} />
                  <span>{t("booking.sendSMS")}</span>
                </button>
              </div>

              {/* Action Feedbacks */}
              <AnimatePresence>
                {notificationSent && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-[10px] text-emerald-500 font-semibold tracking-wider uppercase font-sans mt-1"
                  >
                    {notificationSent === "email" ? t("booking.emailSent") : t("booking.smsSent")}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Reset to book again */}
              <div className="pt-5 border-t border-card-border/50 max-w-xs mx-auto">
                <button
                  onClick={() => {
                    setSelectedService(null);
                    setSelectedDate("");
                    setSelectedTime("");
                    setClientName("");
                    setClientEmail("");
                    setClientPhone("");
                    setNotes("");
                    setConfirmedBooking(null);
                    setStep(1);
                  }}
                  className="text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary-hover transition-colors cursor-pointer py-2"
                >
                  {t("booking.bookAnother")}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
