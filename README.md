# Extensions Bremen — Luxury Digital Flagship

An award-winning, editorial web experience for **Extensions Bremen**, a premier luxury hair extensions atelier in Germany. Built from scratch with a high-fashion, minimalist visual language akin to Dior Beauty, Dyson, and Balmain Hair.

---

## ✨ Core Features

- **Adaptive Theme System**: Seamlessly toggle between **Luxury Obsidian** (Dark Mode) and **Ivory Cream** (Light Mode) with premium font parings (*Cormorant Garamond* for headings, *Montserrat* for body text).
- **Interactive Before/After Slider**: Responsive split-view comparisons with drag actions, fullscreen toggle, and touch support.
- **Product Configurator**: Customizer tool to design hair setups (length, shade, method, volume), detailing breakdowns and live pricing.
- **Virtual consultation**: Step-by-step diagnostic questionnaire offering custom method recommendations.
- **Atelier Hotspots tour**: Interactive map walk of the salon interior layout.
- **Online Booking System**: Calendar slots reserve flow with automated receipt mocks.
- **Admin CRM & CMS Dashboards**: Metrics hub, appointment manager, catalog pricing adjusters, and image gallery publisher.
- **Local Persistence**: State actions (bookings, services, photo filters) are saved to `localStorage`.

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router, Turbopack)
- **Styling**: Tailwind CSS v4 & custom variables
- **Language**: TypeScript
- **Animations**: Framer Motion
- **Icons**: Lucide React & custom inline SVGs
- **SEO & Accessibility**: Local Business Schema.org JSON-LD, fully responsive structures, WCAG AA contrast.

---

## 🚀 Getting Started

### 1. Installation

Install project dependencies:
```bash
npm install
```

### 2. Running the Development Server

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) inside your web browser.

### 3. Production Build

Compile the optimized static output:
```bash
npm run build
```

Verify build output and local routing maps.

---

## 🗺️ Workspace Structure

- `src/app/` — App Router routes (`/services`, `/gallery`, `/configurator`, `/consultation`, `/admin`).
  - `globals.css` — Global CSS variables, scrollbars, and Tailwind v4 themes.
  - `layout.tsx` — Google fonts loader, page metadata, local business Schema, and theme context.
- `src/components/`
  - `ui/` — Theme toggles and context providers.
  - `layout/` — Floating glassmorphic Navigation bar and editorial Footer.
  - `features/` — BeforeAfter slider, Consultation quiz, Configurator, Booking panels, and Walkthrough hotspots.
  - `admin/` — Administrative sidebar backend menus.
- `src/lib/db.ts` — Mock DB store with localStorage persistence adapters.
- `public/images/` — Custom generated high-resolution editorial portrait photography.
