import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import { getCachedCategories } from "@/lib/data";
import MobileBottomNav from "@/components/MobileBottomNav";
import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const grooteFont = localFont({
  src: '../../public/Groote-Regular.otf',
  variable: '--font-groote',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ventalibre.top"),
  title: {
    default: "Venta Libre | Moda y Estilo a tu Alcance",
    template: "%s | Venta Libre"
  },
  description: "Descubre la mejor selección de moda contemporánea en Venta Libre. Calidad, estilo y las últimas tendencias con envíos seguros y pago contra entrega en toda Colombia.",
  keywords: ["ropa", "moda", "venta libre", "tienda virtual", "pago contra entrega", "colombia", "estilo", "tendencias", "ropa premium", "outfits"],
  authors: [{ name: "Venta Libre" }],
  creator: "Venta Libre",
  publisher: "Venta Libre",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Venta Libre | Tu Estilo, Tu Regla",
    description: "Únete a la moda con Venta Libre. Envíos a todo el país con pago contra entrega. Renueva tu guardarropa hoy mismo.",
    url: "https://www.ventalibre.top",
    siteName: "Venta Libre",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Venta Libre - Tienda de Moda",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Venta Libre | Moda Exclusiva",
    description: "Moda premium y pago contra entrega. Descubre nuestra nueva colección.",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCachedCategories();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "name": "Venta Libre",
    "image": "https://www.ventalibre.top/opengraph-image.png",
    "description": "Tienda de moda contemporánea con envíos a toda Colombia y pago contra entrega.",
    "url": "https://www.ventalibre.top",
    "telephone": "+573052891719",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "CO"
    }
  };

  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} ${grooteFont.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="antialiased min-h-screen bg-gray-50 text-gray-900 flex flex-col">
        <Providers>
          <Navbar categories={categories} />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <MobileBottomNav />
        </Providers>
      </body>
    </html>
  );
}
