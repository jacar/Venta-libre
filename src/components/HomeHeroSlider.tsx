"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  badge: string;
  image: string;
  themeColor: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "VISTE TU\nACTITUD",
    subtitle: "STREETWEAR & URBAN STYLE",
    description: "Lleva la moda de la calle al siguiente nivel. Diseños modernos con descuentos increíbles y la calidad que mereces.",
    buttonText: "EXPLORAR AHORA",
    buttonLink: "/categoria/ropa",
    badge: "🔥 NUEVO DROP",
    image: "https://admin.ventalibre.top/wp-content/uploads/2026/07/ChatGPT-Image-17-jul-2026-12_00_49.png",
    themeColor: "from-[#F3F2EE] to-[#E3DEC6]"
  },
  {
    id: 2,
    title: "PAGO 100%\nCONTRAENTREGA",
    subtitle: "COMPRA FÁCIL Y SEGURO",
    description: "No te preocupes por pagar antes. Pide online en segundos y paga en efectivo al recibir tu pedido en la puerta de tu casa.",
    buttonText: "VER CATÁLOGO",
    buttonLink: "#catalogo",
    badge: "🚚 ENVÍO GRATIS",
    image: "https://admin.ventalibre.top/wp-content/uploads/2026/07/ChatGPT-Image-15-jul-2026-21_15_19.png",
    themeColor: "from-[#F2ECE6] to-[#DEC6B5]"
  },
  {
    id: 3,
    title: "COLECCIÓN\nOUTLET",
    subtitle: "PRECIOS DE LOCURA",
    description: "Encuentra tus marcas favoritas con descuentos de liquidación de hasta el 70%. Stock sumamente limitado.",
    buttonText: "COMPRAR OUTLET",
    buttonLink: "/outlet",
    badge: "💎 PRECIOS DE OUTLET",
    image: "https://admin.ventalibre.top/wp-content/uploads/2026/07/ChatGPT-Image-17-jul-2026-12_28_31.png",
    themeColor: "from-[#ECEFF2] to-[#B5C2DE]"
  }
];

export default function HomeHeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <section className="relative w-full h-[65vh] md:h-[80vh] min-h-[500px] bg-[#FAF8F5] overflow-hidden z-20">
      
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-all duration-[1000ms] ease-in-out flex items-center ${
              idx === current ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-95 pointer-events-none'
            }`}
          >
            {/* Background color gradient for blending */}
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.themeColor} opacity-50`}></div>

            {/* Slide Background Image */}
            <div 
              className="absolute top-0 right-0 w-full md:w-[60%] h-full bg-cover bg-[center_35%] md:bg-center bg-no-repeat pointer-events-none [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)] md:[mask-image:linear-gradient(to_right,transparent_0%,black_35%)] -webkit-mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)"
              style={{ backgroundImage: `url("${slide.image}")` }}
            ></div>

            {/* Fade overlay so text is clean and legible on both mobile and desktop */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5] via-[#FAF8F5]/90 to-[#FAF8F5]/30 md:bg-gradient-to-r md:from-[#FAF8F5] md:via-[#FAF8F5]/95 md:to-transparent pointer-events-none z-10"></div>

            {/* Content Content Container */}
            <div className="max-w-[1400px] w-full mx-auto h-full relative z-20 px-6 sm:px-12 md:px-20 flex flex-col justify-center">
              <div className="max-w-2xl text-left">
                {/* Badge */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white text-[10px] font-bold tracking-widest uppercase mb-6 rounded-sm shadow-md">
                  <Sparkles className="w-3 h-3 text-[#fb7701]" />
                  {slide.badge}
                </span>

                {/* Subtitle */}
                <p className="text-xs md:text-sm font-extrabold tracking-[0.25em] text-[#fb7701] mb-3 uppercase">
                  {slide.subtitle}
                </p>

                {/* Title */}
                <h2 className="text-3xl sm:text-4xl md:text-[64px] font-black tracking-[-0.03em] text-gray-900 leading-[1.1] md:leading-[1.05] mb-6 whitespace-pre-line break-words">
                  {slide.title}
                </h2>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-700 max-w-md mb-8 leading-relaxed font-medium">
                  {slide.description}
                </p>

                {/* CTA Button */}
                <Link 
                  href={slide.buttonLink} 
                  className="inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 font-bold tracking-[0.15em] uppercase text-[11px] md:text-xs hover:bg-[#fb7701] hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg rounded-sm"
                >
                  {slide.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/80 hover:bg-black hover:text-white transition-all shadow-md group hidden sm:block"
        aria-label="Anterior diapositiva"
      >
        <ArrowLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/80 hover:bg-black hover:text-white transition-all shadow-md group hidden sm:block"
        aria-label="Siguiente diapositiva"
      >
        <ArrowRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>

      {/* Dots Navigation indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              idx === current ? 'bg-black w-8' : 'bg-black/30 hover:bg-black/50'
            }`}
            aria-label={`Ir a diapositiva ${idx + 1}`}
          />
        ))}
      </div>

      {/* Bottom Trust Icons Row */}
      <div className="absolute bottom-0 left-0 w-full bg-black/5 backdrop-blur-md border-t border-black/10 py-2.5 z-30 hidden lg:block">
        <div className="max-w-[1400px] mx-auto px-20 flex justify-between items-center text-xs font-bold text-gray-800">
          <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-[#fb7701]" /> Envío gratis a todo el país</span>
          <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#fb7701]" /> Pago 100% Seguro Contra Entrega</span>
          <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#fb7701]" /> Calidad Garantizada</span>
        </div>
      </div>

    </section>
  );
}
