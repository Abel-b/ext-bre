"use client";

import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, User, Clipboard, CheckCircle, RefreshCw, Smartphone, Mail, AlertTriangle } from "lucide-react";
import { db, HairService, Appointment } from "@/lib/db";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n";

interface Specialist {
  id: string;
  name: string;
  roleKey: string;
}

const TIME_SLOTS = [
  "09:00", "10:30", "12:00", "13:30", "15:00", "16:30"
];

export default function BookingSystem() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  
  // Step navigation
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<HairService[]>([]);
  
  // Selections
  const [selectedService, setSelectedService] = useState<HairService | null>(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  
  // Client Details
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notes, setNotes] = useState("");
  
  // Actions
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);
  const [notificationSent, setNotificationSent] = useState<"email" | "sms" | "whatsapp" | null>(null);

  const SPECIALISTS: Specialist[] = [
    { id: "any", name: t("locale") === "de" ? "Beliebiger Meister" : "Any Available Master", roleKey: "Optimizes slot availability" },
    { id: "chloe", name: "Chloe Dupont", roleKey: "Keratin & Bonding Specialist" },
    { id: "elena", name: "Elena Rostova", roleKey: "Invisible Tapes & Color Artistry" },
    { id: "sarah", name: "Sarah Becker", roleKey: "Genius Wefts & Volume Extensions" },
  ];

  // Set default specialist once translations load
  useEffect(() => {
    if (!selectedSpecialist) {
      setSelectedSpecialist(SPECIALISTS[0]);
    }
  }, [SPECIALISTS, selectedSpecialist]);

  useEffect(() => {
    const srvs = db.getServices();
    setServices(srvs);

    // Pre-fill from URL parameters (e.g. from Configurator or Consultation)
    const methodParam = searchParams.get("method");
    if (methodParam) {
      const matched = srvs.find(s => s.name.toLowerCase().includes(methodParam.toLowerCase()));
      if (matched) {
        setSelectedService(matched);
        setStep(2); // Skip service choice
      }
    }
  }, [searchParams]);

  // Generate next 10 business days (excluding Sunday & Monday)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    let count = 0;
    let offset = 1;

    while (count < 10) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + offset);
      const day = nextDate.getDay(); // 0 = Sun, 1 = Mon
      if (day !== 0 && day !== 1) {
        const yyyy = nextDate.getFullYear();
        const mm = String(nextDate.getMonth() + 1).padStart(2, '0');
        const dd = String(nextDate.getDate()).padStart(2, '0');
        dates.push(`${yyyy}-${mm}-${dd}`);
        count++;
      }
      offset++;
    }
    return dates;
  };

  const availableDates = getAvailableDates();

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
    
    const lengthParam = searchParams.get("length");
    const colorParam = searchParams.get("color");
    
    const newBooking: Omit<Appointment, "id"> = {
      clientName,
      clientEmail,
      clientPhone,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      date: selectedDate,
      time: selectedTime,
      status: "confirmed",
      notes: notes + (lengthParam || colorParam ? ` | Specs: ${lengthParam ? lengthParam + 'cm' : ''} ${colorParam || ''}` : ""),
      hairConfig: lengthParam || colorParam ? {
        length: lengthParam ? `${lengthParam} cm` : "50 cm",
        color: colorParam || "Bespoke blend",
        texture: "Straight",
        volume: "Medium (150g)",
        method: selectedService.name,
        price: selectedService.price
      } : undefined
    };

    setTimeout(() => {
      const saved = db.addAppointment(newBooking);
      setConfirmedBooking(saved);
      setIsSubmitting(false);
      setStep(4);
    }, 1500);
  };

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(t("locale") === "de" ? "de-DE" : "en-US", options);
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
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-10 bg-card-bg border border-card-border rounded-3xl glow-gold">
      
      {/* Booking Summary Panel (LHS) */}
      <div className="md:col-span-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-card-border pb-6 md:pb-0 md:pr-8">
        <div>
          <span className="editorial-lead text-[9px] text-primary font-bold">{t("booking.tagline")}</span>
          <h2 className="text-2xl font-serif mt-1 mb-6 text-foreground uppercase tracking-wide">{t("booking.title")}</h2>
          
          <div className="space-y-5 text-xs">
            {finalService && (
              <div className="flex flex-col space-y-1">
                <span className="text-foreground/45 uppercase tracking-wider text-[9px]">{t("booking.treatment")}</span>
                <span className="font-semibold text-foreground">{finalService.name}</span>
                <span className="text-[10px] text-primary font-medium">{finalService.price} € &bull; {finalService.duration}</span>
              </div>
            )}

            {selectedDate && (
              <div className="flex flex-col space-y-1">
                <span className="text-foreground/45 uppercase tracking-wider text-[9px]">{t("booking.dateTime")}</span>
                <span className="font-semibold text-foreground">{formatDate(selectedDate)}</span>
                <span className="text-[10px] text-primary font-medium">{selectedTime} Uhr</span>
              </div>
            )}

            {selectedSpecialist && step >= 2 && (
              <div className="flex flex-col space-y-1">
                <span className="text-foreground/45 uppercase tracking-wider text-[9px]">{t("booking.specialist")}</span>
                <span className="font-semibold text-foreground">{selectedSpecialist.name}</span>
                <span className="text-[10px] text-foreground/45 leading-relaxed font-light">{getLocalizedRole(selectedSpecialist.roleKey)}</span>
              </div>
            )}
          </div>
        </div>

        {step < 4 && finalService && (
          <div className="mt-8 border-t border-card-border/60 pt-4 text-[10px] text-foreground/50 leading-relaxed font-light">
            <span className="flex items-center space-x-1.5 text-primary uppercase font-bold text-[9px] mb-1.5">
              <AlertTriangle size={11} />
              <span>{t("booking.depositRequired")}</span>
            </span>
            {t("booking.depositDesc")}
          </div>
        )}
      </div>

      {/* Main Form Fields Panel (RHS) */}
      <div className="md:col-span-8 flex flex-col justify-between min-h-[400px]">
        <AnimatePresence mode="wait">
          
          {/* Step 1: Services Selection */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-5"
            >
              <h3 className="text-lg font-serif tracking-wider uppercase text-foreground">{t("booking.step1")}</h3>
              <div className="flex flex-col space-y-3.5 max-h-[320px] overflow-y-auto pr-1">
                {services.map(getLocalizedService).map((srv) => {
                  if (!srv) return null;
                  const isSelected = selectedService?.id === srv.id;
                  return (
                    <button
                      key={srv.id}
                      onClick={() => setSelectedService(services.find(s => s.id === srv.id) || null)}
                      className={`flex justify-between items-start p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-card-border bg-transparent hover:border-foreground/20"
                      }`}
                    >
                      <div className="max-w-[75%]">
                        <span className="text-xs font-semibold text-foreground uppercase tracking-wider block">{srv.name}</span>
                        <span className="text-[10px] text-foreground/50 font-light block mt-1 leading-normal">
                          {t("locale") === "de"
                            ? (srv.id === "keratin-bonds" ? "Bonds aus bestem italienischem Keratin. Bietet maximalen Schwung." :
                               srv.id === "tape-in" ? "Hauchdünne Tapes, die extrem flach anliegen und feines Haar unbemerkt verdichten." :
                               srv.id === "invisible-weft" ? "Flache eingenähte Tressen für volles Volumen ohne Klebstoff oder Hitze." : srv.description)
                            : srv.description}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-primary block">{srv.price} €</span>
                        <span className="text-[9px] text-foreground/45 tracking-wider block mt-1">{srv.duration}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4 border-t border-card-border/50">
                <button
                  onClick={handleNextStep}
                  disabled={!selectedService}
                  className="px-8 py-3 rounded-full bg-primary text-background text-xs tracking-wider uppercase font-semibold hover:bg-primary-hover disabled:opacity-40 transition-colors cursor-pointer"
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
              className="space-y-6"
            >
              <h3 className="text-lg font-serif tracking-wider uppercase text-foreground">{t("booking.step2")}</h3>
              
              {/* Specialist Selection */}
              <div>
                <span className="text-[10px] tracking-wider uppercase text-foreground/55 font-bold block mb-2.5">{t("booking.specialist")}</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SPECIALISTS.map((spec) => {
                    const isSelected = selectedSpecialist?.id === spec.id;
                    return (
                      <button
                        key={spec.id}
                        onClick={() => setSelectedSpecialist(spec)}
                        className={`p-2.5 border rounded-lg text-center cursor-pointer transition-all ${
                          isSelected ? "border-primary bg-primary/5 text-primary" : "border-card-border text-foreground bg-transparent hover:border-foreground/20"
                        }`}
                      >
                        <span className="text-[10px] font-semibold block">{spec.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <span className="text-[10px] tracking-wider uppercase text-foreground/55 font-bold block mb-2.5">{t("booking.dateTime")}</span>
                <div className="flex space-x-2.5 overflow-x-auto pb-2 pr-1 scrollbar-thin">
                  {availableDates.map((dateStr) => {
                    const isSelected = selectedDate === dateStr;
                    const parsed = new Date(dateStr);
                    const dayName = parsed.toLocaleDateString(t("locale") === "de" ? "de-DE" : "en-US", { weekday: "short" });
                    const dateNum = parsed.getDate();
                    return (
                      <button
                        key={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`flex flex-col items-center p-3 border rounded-lg shrink-0 min-w-[70px] cursor-pointer transition-all ${
                          isSelected ? "border-primary bg-primary/5" : "border-card-border bg-transparent hover:border-foreground/20"
                        }`}
                      >
                        <span className="text-[9px] uppercase tracking-wider text-foreground/44">{dayName}</span>
                        <span className="text-base font-serif font-bold text-foreground mt-1">{dateNum}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div>
                  <span className="text-[10px] tracking-wider uppercase text-foreground/55 font-bold block mb-2.5">Zeitfenster</span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {TIME_SLOTS.map((timeStr) => {
                      const isSelected = selectedTime === timeStr;
                      return (
                        <button
                          key={timeStr}
                          onClick={() => setSelectedTime(timeStr)}
                          className={`p-2 border rounded-lg text-center text-xs tracking-wider cursor-pointer transition-all ${
                            isSelected ? "border-primary bg-primary/5 text-primary" : "border-card-border text-foreground/80 bg-transparent hover:border-foreground/20"
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
                  className="text-xs font-semibold uppercase tracking-wider text-foreground/50 hover:text-foreground cursor-pointer transition-colors"
                >
                  {t("booking.btnBack")}
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!selectedDate || !selectedTime}
                  className="px-8 py-3 rounded-full bg-primary text-background text-xs tracking-wider uppercase font-semibold hover:bg-primary-hover disabled:opacity-40 transition-colors cursor-pointer"
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
              className="space-y-5"
            >
              <h3 className="text-lg font-serif tracking-wider uppercase text-foreground">{t("booking.step3")}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label htmlFor="client-name" className="text-[10px] uppercase tracking-wider text-foreground/50">{t("booking.labelName")}</label>
                  <input
                    type="text"
                    id="client-name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Sophia Werner"
                    className="p-3 bg-background border border-card-border rounded-xl text-xs focus:border-primary outline-none transition-colors"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label htmlFor="client-email" className="text-[10px] uppercase tracking-wider text-foreground/50">{t("booking.labelEmail")}</label>
                  <input
                    type="email"
                    id="client-email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="sophia@example.com"
                    className="p-3 bg-background border border-card-border rounded-xl text-xs focus:border-primary outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col space-y-1">
                  <label htmlFor="client-phone" className="text-[10px] uppercase tracking-wider text-foreground/50">{t("booking.labelPhone")}</label>
                  <input
                    type="tel"
                    id="client-phone"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="0174 6571715"
                    className="p-3 bg-background border border-card-border rounded-xl text-xs focus:border-primary outline-none transition-colors"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label htmlFor="client-notes" className="text-[10px] uppercase tracking-wider text-foreground/50">{t("booking.labelNotes")}</label>
                  <textarea
                    id="client-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t("locale") === "de" ? "Wünsche eintragen (z. B. Haargeschichte, Wunschfarben)..." : "Indicate preferences here (e.g. hair history, custom shades, tone blends)..."}
                    className="p-3 bg-background border border-card-border rounded-xl text-xs focus:border-primary outline-none transition-colors min-h-[90px] resize-none"
                  />
                </div>
              </div>

              {/* Step Controls */}
              <div className="flex justify-between items-center pt-4 border-t border-card-border/50">
                <button
                  onClick={handleBackStep}
                  className="text-xs font-semibold uppercase tracking-wider text-foreground/50 hover:text-foreground cursor-pointer transition-colors"
                >
                  {t("booking.btnBack")}
                </button>
                <button
                  onClick={submitBooking}
                  disabled={isSubmitting || !clientName || !clientEmail || !clientPhone}
                  className="px-8 py-3.5 rounded-full bg-primary text-background text-xs tracking-wider uppercase font-semibold hover:bg-primary-hover disabled:opacity-40 transition-colors flex items-center space-x-2 cursor-pointer"
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
              className="text-center space-y-6 py-6"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto animate-pulse">
                <CheckCircle size={32} />
              </div>

              <div>
                <span className="editorial-lead text-[9px] text-primary font-bold block">{t("booking.step4")}</span>
                <h3 className="text-2xl font-serif mt-1 text-foreground">{t("booking.successTitle")}</h3>
                <p className="text-xs text-foreground/50 font-light mt-2 max-w-sm mx-auto">
                  {t("booking.successDesc")}
                </p>
              </div>

              {/* Mock Notification Trigger Buttons */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 max-w-md mx-auto pt-3">
                <button
                  onClick={() => simulateNotification("email")}
                  className="w-full sm:w-auto px-4 py-2.5 border border-card-border rounded-xl text-[10px] tracking-wider uppercase font-semibold text-foreground/75 hover:border-primary flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Mail size={12} />
                  <span>{t("booking.sendEmail")}</span>
                </button>
                <button
                  onClick={() => simulateNotification("sms")}
                  className="w-full sm:w-auto px-4 py-2.5 border border-card-border rounded-xl text-[10px] tracking-wider uppercase font-semibold text-foreground/75 hover:border-primary flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Smartphone size={12} />
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
                    className="text-[10px] text-emerald-500 font-semibold tracking-wider uppercase font-sans mt-2"
                  >
                    {notificationSent === "email" ? t("booking.emailSent") : t("booking.smsSent")}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Reset to book again */}
              <div className="pt-6 border-t border-card-border/50 max-w-xs mx-auto">
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
                  className="text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary-hover transition-colors cursor-pointer"
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
