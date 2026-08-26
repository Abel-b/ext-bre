import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { I18nProvider } from "@/lib/i18n";
import Script from "next/script";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Extensions Bremen | Premium Haarverlängerungen in Bremen",
    template: "%s | Extensions Bremen",
  },
  description:
    "Luxuriöse Haarverlängerungen, professionelle Beratung und individuelle Looks bei Extensions Bremen in Bremen-Vegesack. Besuchen Sie uns für exklusive Keratin-Bonds, Tapes und Wefts.",
  metadataBase: new URL("https://extensions-bremen.de"),
  alternates: {
    canonical: "/",
    languages: {
      "de": "/de",
      "en": "/en",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "Extensions Bremen | Luxury Hair Extensions",
    description: "Premium hair extensions, professional consultation, and personalized transformations in Bremen-Vegesack.",
    url: "https://extensions-bremen.de",
    siteName: "Extensions Bremen",
    locale: "de_DE",
    type: "website",
    images: [
      {
        url: "/images/hero_model.jpg",
        width: 1200,
        height: 675,
        alt: "Extensions Bremen Luxury Transformations",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Local Business Schema JSON-LD (Updated with Sagerstraße 11, Vegesack)
  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "name": "Extensions Bremen",
    "image": "https://extensions-bremen.de/images/hero_model.jpg",
    "@id": "https://extensions-bremen.de/#salon",
    "url": "https://extensions-bremen.de",
    "telephone": "+491746571715",
    "priceRange": "$$$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Sagerstraße 11",
      "addressLocality": "Bremen",
      "postalCode": "28757",
      "addressCountry": "DE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 53.170659,
      "longitude": 8.618683
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "10:00",
        "closes": "19:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "16:00"
      }
    ],
    "sameAs": [
      "https://www.instagram.com/extensions.bremen",
      "https://www.facebook.com/extensions.bremen"
    ]
  };

  return (
    <html
      lang="de"
      className={`${cormorantGaramond.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <I18nProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </I18nProvider>
        <Script
          id="schema-local-business"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
        />
      </body>
    </html>
  );
}
