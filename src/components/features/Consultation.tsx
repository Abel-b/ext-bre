"use client";

import React, { useState } from "react";
import { ArrowRight, ArrowLeft, Upload, Check, Sparkles, Calendar, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

interface Option {
  value: string;
  labelKey: string;
  descKey: string;
}

interface Step {
  id: number;
  questionKey: string;
  descriptionKey: string;
  key: "currentLength" | "density" | "goal" | "lifestyle";
  options: Option[];
}

export default function Consultation() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    currentLength: "",
    density: "",
    goal: "",
    lifestyle: "",
  });
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState<any | null>(null);

  const steps: Step[] = [
    {
      id: 1,
      questionKey: "consultation.q1",
      descriptionKey: "consultation.q1Desc",
      key: "currentLength",
      options: [
        { value: "short", labelKey: "Short/Bob", descKey: "Short hair above the shoulders" },
        { value: "medium", labelKey: "Shoulder Length", descKey: "Resting around your collarbone" },
        { value: "long", labelKey: "Midback Length", descKey: "Past your shoulders" },
      ],
    },
    {
      id: 2,
      questionKey: "consultation.q2",
      descriptionKey: "consultation.q2Desc",
      key: "density",
      options: [
        { value: "fine", labelKey: "Fine / Thin", descKey: "Scalp is slightly visible, hair is very soft" },
        { value: "medium", labelKey: "Medium / Normal", descKey: "Balanced density, holds curls easily" },
        { value: "thick", labelKey: "Thick / Dense", descKey: "High volume, feels heavy to tie up" },
      ],
    },
    {
      id: 3,
      questionKey: "consultation.q3",
      descriptionKey: "consultation.q3Desc",
      key: "goal",
      options: [
        { value: "length", labelKey: "Dramatic Length", descKey: "Adding substantial length (50-70cm)" },
        { value: "volume", labelKey: "Fuller Volume", descKey: "Same length but rich, dense body" },
        { value: "both", labelKey: "Ultimate Length & Volume", descKey: "Complete runway-grade transformation" },
      ],
    },
    {
      id: 4,
      questionKey: "consultation.q4",
      descriptionKey: "consultation.q4Desc",
      key: "lifestyle",
      options: [
        { value: "active", labelKey: "High Activity", descKey: "Frequent sports, swimming, or high ponytails" },
        { value: "moderate", labelKey: "Moderate Maintenance", descKey: "Weekly styling, blowouts, standard lifestyle" },
        { value: "minimal", labelKey: "Low Styling", descKey: "Prefers wash-and-go, minimal heating tools" },
      ],
    },
  ];

  const handleSelectOption = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0].name);
    }
  };

  const calculateRecommendation = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      let method = "Keratin Bond System";
      let length = "50 cm";
      let priceRange = "550€ - 750€";
      let duration = "3.5 Hours";
      let details = "Based on your active lifestyle and medium density, Keratin Bonds offer the highest durability and look completely invisible in high updos.";

      if (t("locale") === "de") {
        method = "Keratin-Bondings";
        duration = "3,5 Stunden";
        details = "Aufgrund Ihres aktiven Lebensstils und Ihrer normalen Haardichte bieten Keratinbonds die beste Haltbarkeit. Sie sind selbst bei hohen Frisuren absolut unsichtbar.";
      }

      if (answers.density === "fine" && answers.lifestyle !== "active") {
        method = t("locale") === "de" ? "Unsichtbare Tape-Ins" : "Invisible Tape-Ins";
        priceRange = "420€ - 580€";
        duration = t("locale") === "de" ? "2 Stunden" : "2 Hours";
        details = t("locale") === "de"
          ? "Für feines Haar und materialschonenden Halt verteilen Tape-Ins das Gewicht flach und gleichmäßig, um empfindliche Wurzeln zu schützen."
          : "For fine hair density and minimal heat usage, invisible tapes distribute weight flatly and gently, shielding fragile natural strands.";
      } else if (answers.density === "thick" || answers.goal === "both") {
        method = t("locale") === "de" ? "Genius-Tressen (Weft)" : "Invisible Genius Weft";
        priceRange = "680€ - 950€";
        duration = t("locale") === "de" ? "2,5 Stunden" : "2.5 Hours";
        details = t("locale") === "de"
          ? "Eine schonende Weft-Nähechnik kreiert gleichmäßiges, volles Volumen für dichtes Haar – komplett ohne Chemie oder Hitze."
          : "A full-bodied genius weft sewing application creates massive, uniform volume across high density hair without chemicals or heat.";
      }

      if (answers.currentLength === "short") {
        length = t("locale") === "de" ? "40 cm (empfohlene Grenze)" : "40 cm (recommended max)";
      } else if (answers.goal === "length" || answers.goal === "both") {
        length = "60 cm";
      }

      setRecommendation({ method, length, priceRange, duration, details });
      setIsAnalyzing(false);
      setStep(6);
    }, 2000);
  };

  const resetConsultation = () => {
    setAnswers({ currentLength: "", density: "", goal: "", lifestyle: "" });
    setUploadedFile(null);
    setRecommendation(null);
    setStep(1);
  };

  const getLocalizedOptionLabel = (stepKey: string, optVal: string) => {
    if (t("locale") === "de") {
      if (stepKey === "currentLength") {
        if (optVal === "short") return "Kurzhaar / Bob";
        if (optVal === "medium") return "Schulterlänge";
        if (optVal === "long") return "Mittellang (über Schulter)";
      }
      if (stepKey === "density") {
        if (optVal === "fine") return "Feines / Dünnes Haar";
        if (optVal === "medium") return "Normales / Ausgeglichenes Haar";
        if (optVal === "thick") return "Dichtes / Dickes Haar";
      }
      if (stepKey === "goal") {
        if (optVal === "length") return "Erheblich mehr Länge";
        if (optVal === "volume") return "Mehr Fülle & Dichte";
        if (optVal === "both") return "Länge & maximales Volumen";
      }
      if (stepKey === "lifestyle") {
        if (optVal === "active") return "Sehr aktiv / Sportlich";
        if (optVal === "moderate") return "Normal / Wöchentliches Styling";
        if (optVal === "minimal") return "Minimaler Aufwand / Wash & Go";
      }
    } else {
      if (stepKey === "currentLength") {
        if (optVal === "short") return "Pixie or Bob";
        if (optVal === "medium") return "Shoulder Length";
        if (optVal === "long") return "Midback Length";
      }
      if (stepKey === "density") {
        if (optVal === "fine") return "Fine / Thin";
        if (optVal === "medium") return "Medium / Normal";
        if (optVal === "thick") return "Thick / Dense";
      }
      if (stepKey === "goal") {
        if (optVal === "length") return "Dramatic Length";
        if (optVal === "volume") return "Fuller Volume";
        if (optVal === "both") return "Ultimate Length & Volume";
      }
      if (stepKey === "lifestyle") {
        if (optVal === "active") return "High Activity";
        if (optVal === "moderate") return "Moderate Maintenance";
        if (optVal === "minimal") return "Low Styling";
      }
    }
    return optVal;
  };

  const getLocalizedOptionDesc = (stepKey: string, optVal: string) => {
    if (t("locale") === "de") {
      if (stepKey === "currentLength") {
        if (optVal === "short") return "Haarlänge liegt über der Schulterlinie";
        if (optVal === "medium") return "Haar berührt das Schlüsselbein";
        if (optVal === "long") return "Haar reicht deutlich über die Schultern";
      }
      if (stepKey === "density") {
        if (optVal === "fine") return "Kopfhaut schimmert leicht durch, Haar ist sehr weich";
        if (optVal === "medium") return "Ausgewogene Dichte, lockt sich gut";
        if (optVal === "thick") return "Hohe Dichte, Haare fühlen sich schwer an";
      }
      if (stepKey === "goal") {
        if (optVal === "length") return "Erhebliche Längenerweiterung (50-70cm)";
        if (optVal === "volume") return "Gleiche Länge, aber deutlich mehr Volumen";
        if (optVal === "both") return "Kompletter, prachtvoller Transformations-Look";
      }
      if (stepKey === "lifestyle") {
        if (optVal === "active") return "Häufiger Sport, Schwimmen, Zopf-Frisuren";
        if (optVal === "moderate") return "Föhnen, Hitzestyling, normaler Alltag";
        if (optVal === "minimal") return "Sehr pflegeleicht, wenig Hitzeeinsatz";
      }
    } else {
      if (stepKey === "currentLength") {
        if (optVal === "short") return "Short hair above the shoulders";
        if (optVal === "medium") return "Resting around your collarbone";
        if (optVal === "long") return "Past your shoulders";
      }
      if (stepKey === "density") {
        if (optVal === "fine") return "Scalp is slightly visible, hair is very soft";
        if (optVal === "medium") return "Balanced density, holds curls easily";
        if (optVal === "thick") return "High volume, feels heavy to tie up";
      }
      if (stepKey === "goal") {
        if (optVal === "length") return "Adding substantial length (50-70cm)";
        if (optVal === "volume") return "Same length but rich, dense body";
        if (optVal === "both") return "Complete runway-grade transformation";
      }
      if (stepKey === "lifestyle") {
        if (optVal === "active") return "Frequent sports, swimming, or high ponytails";
        if (optVal === "moderate") return "Weekly styling, blowouts, standard lifestyle";
        if (optVal === "minimal") return "Prefers wash-and-go, minimal heating tools";
      }
    }
    return "";
  };

  const currentStepData = steps[step - 1];
  const isCurrentStepAnswered = currentStepData ? answers[currentStepData.key] !== "" : true;

  return (
    <div className="w-full max-w-2xl mx-auto bg-card-bg border border-card-border rounded-2xl overflow-hidden glow-gold p-8 md:p-12">
      <AnimatePresence mode="wait">
        {step <= 4 && (
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {/* Step indicator */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-primary">
                {t("locale") === "de" ? `Frage ${step} von 5` : `Question ${step} of 5`}
              </span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className={`w-4 h-1 rounded-full transition-colors duration-300 ${
                      s <= step ? "bg-primary" : "bg-card-border"
                    }`}
                  />
                ))}
              </div>
            </div>

            <h3 className="text-2xl font-serif mb-2">{t(currentStepData.questionKey)}</h3>
            <p className="text-xs text-foreground/60 mb-8 font-light">{t(currentStepData.descriptionKey)}</p>

            <div className="flex flex-col space-y-4">
              {currentStepData.options.map((opt) => {
                const isSelected = answers[currentStepData.key] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelectOption(currentStepData.key, opt.value)}
                    className={`flex flex-col items-start w-full p-5 rounded-xl border text-left cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-md"
                        : "border-card-border hover:border-foreground/45 bg-transparent"
                    }`}
                  >
                    <span className={`text-xs font-semibold uppercase tracking-wider ${isSelected ? "text-primary" : "text-foreground"}`}>
                      {getLocalizedOptionLabel(currentStepData.key, opt.value)}
                    </span>
                    <span className="text-[11px] text-foreground/50 font-light mt-1.5 leading-relaxed">
                      {getLocalizedOptionDesc(currentStepData.key, opt.value)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Nav controls */}
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-card-border/50">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className="flex items-center space-x-2 text-xs font-semibold tracking-wider uppercase text-foreground/50 hover:text-foreground disabled:opacity-30 transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>{t("consultation.back")}</span>
              </button>
              <button
                onClick={handleNext}
                disabled={!isCurrentStepAnswered}
                className="flex items-center space-x-2 px-6 py-3 rounded-full bg-primary text-background text-xs tracking-wider uppercase font-semibold hover:bg-primary-hover disabled:opacity-40 transition-colors cursor-pointer"
              >
                <span>{t("consultation.continue")}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 5: Photo Upload simulation */}
        {step === 5 && (
          <motion.div
            key="step-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-primary">
                {t("locale") === "de" ? "Frage 5 von 5" : "Question 5 of 5"}
              </span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className="w-4 h-1 rounded-full bg-primary"
                  />
                ))}
              </div>
            </div>

            <h3 className="text-2xl font-serif mb-2">{t("consultation.q5")}</h3>
            <p className="text-xs text-foreground/60 mb-8 font-light">
              {t("consultation.q5Desc")}
            </p>

            <div className="relative group border-2 border-dashed border-card-border hover:border-primary/80 transition-colors rounded-xl flex flex-col items-center justify-center p-12 text-center bg-transparent">
              <input
                type="file"
                id="hair-photo"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {uploadedFile ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 border border-emerald-500/20">
                    <Check size={20} />
                  </div>
                  <span className="text-xs font-semibold text-foreground/80">{uploadedFile}</span>
                  <span className="text-[10px] text-foreground/40 mt-1 font-light">{t("consultation.uploadReplace")}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 border border-primary/20">
                    <Upload size={18} />
                  </div>
                  <span className="text-xs font-semibold text-foreground/80">{t("consultation.uploadSelect")}</span>
                  <span className="text-[10px] text-foreground/40 mt-1 font-light">{t("consultation.uploadFormats")}</span>
                </div>
              )}
            </div>

            {/* Nav controls */}
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-card-border/50">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-xs font-semibold tracking-wider uppercase text-foreground/50 hover:text-foreground transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>{t("consultation.back")}</span>
              </button>
              <button
                onClick={calculateRecommendation}
                disabled={isAnalyzing}
                className="flex items-center space-x-2 px-8 py-3.5 rounded-full bg-primary text-background text-xs tracking-wider uppercase font-semibold hover:bg-primary-hover disabled:opacity-40 transition-colors cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>{t("consultation.analyzing")}</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>{t("consultation.viewRec")}</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 6: Results / Recommendations */}
        {step === 6 && recommendation && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col text-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6 border border-primary/25 animate-bounce">
              <Sparkles size={24} />
            </div>

            <span className="editorial-lead text-[10px] text-primary font-bold">
              {t("locale") === "de" ? "IHR PERSÖNLICHES ERGEBNIS" : "YOUR CUSTOM RECIPE"}
            </span>
            <h3 className="text-3xl font-serif mt-2 mb-3">{t("consultation.resultsTitle")}</h3>
            <p className="text-xs text-foreground/60 font-light max-w-md mx-auto mb-10">
              {t("consultation.resultsDesc")}
            </p>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left mb-10">
              <div className="border border-card-border p-5 rounded-xl bg-background/50">
                <span className="text-[10px] tracking-wider uppercase text-foreground/44 font-semibold">
                  {t("consultation.recMethod")}
                </span>
                <p className="text-base font-serif font-semibold text-primary mt-1.5">{recommendation.method}</p>
              </div>
              <div className="border border-card-border p-5 rounded-xl bg-background/50">
                <span className="text-[10px] tracking-wider uppercase text-foreground/44 font-semibold">
                  {t("consultation.recLength")}
                </span>
                <p className="text-base font-serif font-semibold text-primary mt-1.5">{recommendation.length}</p>
              </div>
              <div className="border border-card-border p-5 rounded-xl bg-background/50">
                <span className="text-[10px] tracking-wider uppercase text-foreground/44 font-semibold">
                  {t("consultation.recPrice")}
                </span>
                <p className="text-base font-serif font-semibold text-primary mt-1.5">{recommendation.priceRange}</p>
              </div>
              <div className="border border-card-border p-5 rounded-xl bg-background/50">
                <span className="text-[10px] tracking-wider uppercase text-foreground/44 font-semibold">
                  {t("consultation.recDuration")}
                </span>
                <p className="text-base font-serif font-semibold text-primary mt-1.5">{recommendation.duration}</p>
              </div>
            </div>

            <div className="text-left border border-card-border p-5 rounded-xl bg-background/50 mb-10">
              <span className="text-[10px] tracking-wider uppercase text-foreground/44 font-semibold">
                {t("consultation.recReason")}
              </span>
              <p className="text-xs text-foreground/75 leading-relaxed font-light mt-2">
                {recommendation.details}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={resetConsultation}
                className="flex items-center space-x-2 text-xs font-semibold tracking-wider uppercase text-foreground/50 hover:text-foreground transition-colors py-3 px-6 border border-card-border rounded-full hover:border-foreground/30 w-full sm:w-auto justify-center cursor-pointer"
              >
                <RefreshCw size={12} />
                <span>{t("consultation.btnReset")}</span>
              </button>
              <Link
                href={`/#booking?method=${encodeURIComponent(recommendation.method)}`}
                className="flex items-center space-x-2 px-8 py-3.5 rounded-full bg-primary text-background text-xs tracking-wider uppercase font-semibold hover:bg-primary-hover shadow-lg hover:shadow-primary/20 transition-all duration-300 w-full sm:w-auto justify-center"
              >
                <Calendar size={13} />
                <span>{t("consultation.btnBook")}</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
