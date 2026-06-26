import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Venta Libre | Moda y Estilo a tu Alcance",
  description: "Descubre la mejor selección de moda contemporánea en Venta Libre. Calidad, estilo y las últimas tendencias con envíos seguros y pago contra entrega en toda Colombia.",
  keywords: "ropa, moda, venta libre, tienda virtual, pago contra entrega, colombia, estilo, tendencias",
  openGraph: {
    title: "Venta Libre | Tu Estilo, Tu Regla",
    description: "Únete a la moda con Venta Libre. Envíos a todo el país con pago contra entrega.",
    url: "https://www.ventalibre.top",
    siteName: "Venta Libre",
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Venta Libre | Moda Exclusiva",
    description: "Moda premium y pago contra entrega.",
  }
};

import Providers from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased min-h-screen bg-gray-50 text-gray-900 flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
