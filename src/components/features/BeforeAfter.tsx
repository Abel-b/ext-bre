"use client";

import React, { useState, useRef, useEffect, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from "react";
import Image from "next/image";
import { Maximize2, Minimize2, ZoomIn, ZoomOut, Move } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useTheme } from "@/components/ui/theme-provider";

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
    e.preventDefault();
    setIsDragging(true);
  };

  const toggleZoom = () => {
    setZoomScale((prev) => (prev === 1 ? 1.5 : 1));
  };

  return (
    <div className={`relative flex flex-col items-center w-full ${isFullscreen ? "fixed inset-0 z-50 bg-background/95 p-6 md:p-12 glassmorphic flex items-center justify-center" : ""}`}>
      {/* Controls Header */}
      <div className="flex justify-between w-full max-w-4xl mb-4 px-2">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] tracking-widest uppercase text-foreground/50">{t("gallery.lightboxTitle")}</span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleZoom}
            className="p-2 border border-card-border rounded-full hover:border-primary hover:text-primary transition-colors text-foreground/75 cursor-pointer"
            aria-label="Toggle zoom details"
          >
            {zoomScale === 1 ? <ZoomIn size={14} /> : <ZoomOut size={14} />}
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 border border-card-border rounded-full hover:border-primary hover:text-primary transition-colors text-foreground/75 cursor-pointer"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Main Image Container */}
      <div
        ref={containerRef}
        className={`relative select-none overflow-hidden rounded-2xl border border-card-border bg-card-bg glow-gold cursor-ew-resize transition-all duration-300 ${
          isFullscreen ? "w-full max-w-5xl h-[70vh]" : "w-full max-w-4xl aspect-[4/3] md:aspect-[16/10]"
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
            src={beforeImage}
            alt={finalBeforeLabel}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          {/* Label Before */}
          <div className="absolute bottom-4 left-4 bg-background/70 backdrop-blur-md border border-card-border px-3 py-1.5 rounded-md text-[10px] tracking-widest uppercase font-semibold text-foreground z-10">
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
            src={afterImage}
            alt={finalAfterLabel}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          {/* Label After */}
          <div className="absolute bottom-4 right-4 bg-primary text-background border border-primary/20 px-3 py-1.5 rounded-md text-[10px] tracking-widest uppercase font-semibold z-10">
            {finalAfterLabel}
          </div>
        </div>

        {/* Drag Split Bar */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-primary/80 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary text-background shadow-lg hover:scale-110 flex items-center justify-center transition-transform cursor-grab active:cursor-grabbing">
            <Move size={16} />
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-foreground/50 font-light max-w-lg leading-relaxed">
          {t("locale") === "de"
            ? "Ziehen Sie den mittleren Schieberegler nach links und rechts, um die nahtlose Einarbeitung, die Integration an den Ansätzen und das natürliche Fülle-Ergebnis unserer Extensions zu prüfen."
            : "Drag the central slider handle left and right to inspect the seamless blend, root integration, and natural volume enhancement of our custom installation."}
        </p>
      </div>
    </div>
  );
}
