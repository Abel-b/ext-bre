"use client";

import React, { useState, useRef, useEffect, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from "react";
import Image from "next/image";
import { Maximize2, Minimize2, ZoomIn, ZoomOut, Move, Sparkles } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useTheme } from "@/components/ui/theme-provider";
import { getAssetPath } from "@/lib/assets";

interface BeforeAfterProps {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfter({
  beforeImage = "/images/before_model.jpg",
  afterImage = "/images/after_model.jpg",
  beforeLabel,
  afterLabel,
}: BeforeAfterProps) {
  const { t } = useTranslation();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const finalBeforeLabel = beforeLabel || t("gallery.before");
  const finalAfterLabel = afterLabel || t("gallery.after");

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  const startDrag = (e: ReactMouseEvent | ReactTouchEvent) => {
    setIsDragging(true);
  };

  const toggleZoom = () => {
    setZoomScale((prev) => (prev === 1 ? 1.4 : 1));
  };

  return (
    <div className={`relative flex flex-col items-center w-full ${isFullscreen ? "fixed inset-0 z-50 bg-background/98 p-4 sm:p-8 md:p-12 glassmorphic flex items-center justify-center" : ""}`}>
      
      {/* Controls Header */}
      <div className="flex justify-between items-center w-full max-w-4xl mb-3 px-1">
        <div className="flex items-center space-x-2">
          <Sparkles size={13} className="text-primary" />
          <span className="text-[10px] sm:text-xs tracking-widest uppercase text-foreground/60 font-semibold">
            {t("gallery.lightboxTitle")}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleZoom}
            className="p-2.5 border border-card-border rounded-full hover:border-primary hover:text-primary transition-colors text-foreground/75 cursor-pointer bg-card-bg shadow-sm"
            aria-label="Toggle zoom details"
          >
            {zoomScale === 1 ? <ZoomIn size={14} /> : <ZoomOut size={14} />}
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2.5 border border-card-border rounded-full hover:border-primary hover:text-primary transition-colors text-foreground/75 cursor-pointer bg-card-bg shadow-sm"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Main Image Container (Mobile Portrait 4/5 Aspect Ratio) */}
      <div
        ref={containerRef}
        onClick={(e) => handleMove(e.clientX)}
        className={`relative select-none overflow-hidden rounded-2xl sm:rounded-3xl border border-card-border bg-card-bg glow-gold cursor-ew-resize transition-all duration-300 touch-none shadow-2xl ${
          isFullscreen ? "w-full max-w-5xl h-[75vh]" : "w-full max-w-4xl aspect-[4/5] sm:aspect-[4/3] md:aspect-[16/10]"
        }`}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
      >
        {/* Before Image (Background) */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ transform: `scale(${zoomScale})`, transformOrigin: "center", transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <Image
            src={getAssetPath(beforeImage)}
            alt={finalBeforeLabel}
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          {/* Label Before */}
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-background/85 backdrop-blur-md border border-card-border px-2.5 sm:px-3 py-1 rounded-md text-[9px] sm:text-[10px] tracking-widest uppercase font-semibold text-foreground z-10 shadow-sm">
            {finalBeforeLabel}
          </div>
        </div>

        {/* After Image (Foreground Slider overlay clipped) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
            transform: `scale(${zoomScale})`,
            transformOrigin: "center",
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <Image
            src={getAssetPath(afterImage)}
            alt={finalAfterLabel}
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          {/* Label After */}
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-primary text-background border border-primary/20 px-2.5 sm:px-3 py-1 rounded-md text-[9px] sm:text-[10px] tracking-widest uppercase font-semibold z-10 shadow-sm">
            {finalAfterLabel}
          </div>
        </div>

        {/* Drag Split Line & Thumb Handle */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-primary/90 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-primary text-background shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 border-2 border-background glow-gold">
            <Move size={16} />
          </div>
        </div>
      </div>

      {/* Quick Comparison Tap Pills on Mobile */}
      <div className="flex items-center justify-center space-x-2 mt-3 w-full max-w-sm">
        <button
          onClick={() => setSliderPosition(0)}
          className={`flex-1 py-1.5 px-2.5 rounded-full border text-[9px] font-semibold tracking-wider uppercase transition-all ${
            sliderPosition === 0 ? "border-primary bg-primary/10 text-primary" : "border-card-border text-foreground/60 bg-card-bg"
          }`}
        >
          {t("gallery.before")} (100%)
        </button>
        <button
          onClick={() => setSliderPosition(50)}
          className={`flex-1 py-1.5 px-2.5 rounded-full border text-[9px] font-semibold tracking-wider uppercase transition-all ${
            sliderPosition === 50 ? "border-primary bg-primary/10 text-primary" : "border-card-border text-foreground/60 bg-card-bg"
          }`}
        >
          Split (50%)
        </button>
        <button
          onClick={() => setSliderPosition(100)}
          className={`flex-1 py-1.5 px-2.5 rounded-full border text-[9px] font-semibold tracking-wider uppercase transition-all ${
            sliderPosition === 100 ? "border-primary bg-primary/10 text-primary" : "border-card-border text-foreground/60 bg-card-bg"
          }`}
        >
          {t("gallery.after")} (100%)
        </button>
      </div>

      <div className="mt-3 text-center px-4">
        <p className="text-[11px] sm:text-xs text-foreground/50 font-light max-w-md leading-relaxed">
          {t("locale") === "de"
            ? "Tippen oder wischen Sie über das Bild, um die nahtlose Einarbeitung der Extensions zu prüfen."
            : "Tap or drag across the image to inspect the seamless root blend and volume enhancement."}
        </p>
      </div>
    </div>
  );
}
