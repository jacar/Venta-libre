"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, X, ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "https://admin.ventalibre.top/wp-content/uploads/2026/06/855dee11-1fa1-4ac4-a210-c53e385bc614-1.jpeg",
  "https://admin.ventalibre.top/wp-content/uploads/2026/06/545f5a21-bdd0-4231-974e-d6240580b54a.jpeg",
  "https://admin.ventalibre.top/wp-content/uploads/2026/06/9a441a47-9656-47bb-979f-8aa5dc8373ee.jpeg",
  "https://admin.ventalibre.top/wp-content/uploads/2026/06/855dee11-1fa1-4ac4-a210-c53e385bc614-1.jpeg",
  "https://admin.ventalibre.top/wp-content/uploads/2026/06/545f5a21-bdd0-4231-974e-d6240580b54a.jpeg"
];

export default function AdsBanner() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const openModal = (idx: number) => {
    setActiveIdx(idx);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <section className="py-12 md:py-20 w-full overflow-visible mt-10">
      <div className="relative overflow-visible bg-[#F5F2ED] group shadow-xl">
        {/* The banner layout */}
        <div className="flex flex-col md:flex-row items-stretch pb-16 md:pb-24">
          {/* Image side (Main Image Pop-out) */}
          <div className="w-full md:w-1/2 relative min-h-[400px] md:min-h-[500px] md:h-auto overflow-visible z-20">
            <div className="absolute inset-x-0 bottom-[-50px] top-[-30px] md:bottom-[-80px] md:top-[-40px] md:-left-[20px] z-20">
              <Image 
                src="https://admin.ventalibre.top/wp-content/uploads/2026/07/ChatGPT-Image-15-jul-2026-21_15_19.png" 
                alt="Colección Exclusiva" 
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-bottom md:object-center drop-shadow-2xl transition-transform duration-[1500ms] ease-out group-hover:scale-105"
              />
            </div>
          </div>
          
          {/* Text side */}
          <div className="w-full md:w-1/2 p-10 pt-20 md:p-20 flex flex-col justify-center items-start bg-gradient-to-br from-[#F5F2ED] to-[#e8e2d5] relative overflow-hidden">
            
            {/* Elemento decorativo de fondo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-bold tracking-widest uppercase mb-6 rounded-sm animate-bounce shadow-lg">
                <Sparkles className="w-3 h-3 text-[#fb7701]" />
                <span>NUEVO DROP 🔥</span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-[1.1] tracking-tighter">
                STREET STYLE<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-[#fb7701] relative inline-block after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-[#fb7701] after:bottom-0 after:left-0 after:origin-bottom-right after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-700 after:ease-out group-hover:after:origin-bottom-left">
                  QUE ROMPE REGLAS
                </span>
              </h2>
              
              <p className="text-gray-700 mb-10 max-w-md leading-relaxed text-sm md:text-base font-medium">
                Eleva tu flow sin vaciar tu cartera. Descubre las piezas más hypeadas y los cortes más fresh de la temporada. Una declaración de intenciones hecha moda urbana.
              </p>
              
              <Link 
                href="/product/752"  
                className="group/btn relative inline-flex items-center justify-center bg-black text-white px-8 py-4 font-bold text-xs md:text-sm tracking-widest uppercase overflow-hidden rounded-sm transition-all hover:shadow-[0_10px_40px_-10px_rgba(251,119,1,0.5)]"
              >
                <div className="absolute inset-0 w-0 bg-gradient-to-r from-[#fb7701] to-[#ff9838] transition-all duration-500 ease-out group-hover/btn:w-full"></div>
                <span className="relative flex items-center gap-3">
                  ATRAPA EL ESTILO
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover/btn:translate-x-1 transition-transform">
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Galería de Producto (Carrusel grande que abarca toda la sección) */}
        <div className="w-full bg-[#F5F2ED] py-10 px-6 md:px-12 border-t border-black/5 z-10 relative flex flex-col items-center">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-800 mb-6 border-b border-gray-300 pb-2 w-fit text-center">Visto en la imagen</h4>
          
          <div className="w-full max-w-[1600px] flex justify-center">
            <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-max max-w-full">
              {images.map((src, idx) => (
                <div 
                  key={idx}
                  onClick={() => openModal(idx)}
                  className="relative shrink-0 w-[220px] md:w-[280px] aspect-[3/4] bg-white shadow-md overflow-hidden rounded-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer group/item snap-start"
                >
                  <Image 
                    src={src} 
                    alt={`Zapatillas Detalle ${idx + 1}`} 
                    fill
                    sizes="(max-width: 768px) 220px, 280px"
                    className="object-cover object-center group-hover/item:scale-110 transition-transform duration-700 ease-out"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popup / Modal del Carrusel */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center backdrop-blur-sm p-4 md:p-8">
          <button 
            onClick={closeModal}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 flex items-center justify-center rounded-full text-white transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative w-full max-w-5xl aspect-[4/5] md:aspect-video flex items-center justify-center">
            <button 
              onClick={prevSlide}
              className="absolute left-0 md:-left-12 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-white/10 hover:bg-white/30 backdrop-blur-md flex items-center justify-center rounded-full text-white transition-colors z-50"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            
            <div className="relative w-full h-full">
              <Image 
                src={images[activeIdx]} 
                alt={`Imagen Ampliada ${activeIdx + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
            
            <button 
              onClick={nextSlide}
              className="absolute right-0 md:-right-12 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-white/10 hover:bg-white/30 backdrop-blur-md flex items-center justify-center rounded-full text-white transition-colors z-50"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
          
          {/* Puntos Modal */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-50">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`h-2 rounded-full transition-all ${idx === activeIdx ? 'bg-white w-8' : 'bg-white/40 w-2 hover:bg-white/70'}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
