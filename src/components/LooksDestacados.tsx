"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const LOOK_IMAGES = [
  "https://admin.ventalibre.top/wp-content/uploads/2026/07/88cfe8e7-2e23-4770-aa21-4e74679546c5.jpeg",
  "https://admin.ventalibre.top/wp-content/uploads/2026/07/8c227723-71cf-462a-b2c8-33df7ece0941.jpeg",
  "https://admin.ventalibre.top/wp-content/uploads/2026/07/eebd83b2-a66f-41a5-aba2-8251531464f1.jpeg",
  "https://admin.ventalibre.top/wp-content/uploads/2026/07/ecd0eb87-aee4-4231-8d43-6a14513b2d1d.jpeg"
];

export default function LooksDestacados() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openModal = (index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
  };

  const closeModal = () => {
    setSelectedIndex(null);
    document.body.style.overflow = "auto";
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % LOOK_IMAGES.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + LOOK_IMAGES.length) % LOOK_IMAGES.length);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "ArrowRight") setSelectedIndex((selectedIndex + 1) % LOOK_IMAGES.length);
      if (e.key === "ArrowLeft") setSelectedIndex((selectedIndex - 1 + LOOK_IMAGES.length) % LOOK_IMAGES.length);
      if (e.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col items-center justify-center mb-16 text-center">
          <span className="text-xs font-bold tracking-[0.3em] text-gray-400 mb-4 uppercase">Inspiración</span>
          <h2 className="text-3xl sm:text-4xl font-light tracking-[0.15em] uppercase text-gray-900 mb-6">Looks Destacados</h2>
          <div className="w-12 h-[1px] bg-black mb-6"></div>
          <a href="#productos" className="text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors font-medium relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-black hover:after:w-full after:transition-all after:duration-300">
            Descubrir la colección
          </a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
          {LOOK_IMAGES.map((src, index) => (
            <div key={index} className="group relative aspect-[2/3] lg:aspect-[9/16] overflow-hidden bg-gray-100 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-700" onClick={() => openModal(index)}>
              <Image 
                src={src} 
                alt={`Colección destacada ${index + 1}`} 
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-700"></div>
              
              {/* Elegant overlay content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                <div className="flex gap-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(index);
                    }}
                    className="bg-white/90 backdrop-blur-sm text-black px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300"
                  >
                    Ver detalle
                  </button>
                  <a 
                    href="/product/1105"
                    onClick={(e) => e.stopPropagation()} 
                    className="bg-transparent border border-white/90 backdrop-blur-sm text-white px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300"
                  >
                    Comprar
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Popup Carrusel */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={closeModal}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50 p-2"
            onClick={closeModal}
          >
            <X className="w-8 h-8" />
          </button>

          {/* Left Arrow */}
          <button 
            className="absolute left-4 md:left-12 text-white/70 hover:text-white transition-colors p-2 z-50"
            onClick={prevImage}
          >
            <ChevronLeft className="w-12 h-12" />
          </button>

          {/* Image Container */}
          <div 
            className="relative w-full max-w-4xl max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking image
          >
            <div className="relative w-full h-[70vh] mb-6">
              <Image 
                src={LOOK_IMAGES[selectedIndex]} 
                alt={`Look ${selectedIndex + 1}`} 
                fill
                className="object-contain rounded-sm shadow-2xl"
              />
            </div>
            
            <a 
              href="/product/1105" 
              className="bg-white text-black px-10 py-3 text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors shadow-lg"
            >
              COMPRAR AHORA
            </a>
            
            {/* Dots Pagination inside Modal */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
              {LOOK_IMAGES.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${idx === selectedIndex ? "bg-white scale-125" : "bg-white/40 hover:bg-white/70"}`}
                />
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button 
            className="absolute right-4 md:right-12 text-white/70 hover:text-white transition-colors p-2 z-50"
            onClick={nextImage}
          >
            <ChevronRight className="w-12 h-12" />
          </button>
        </div>
      )}
    </section>
  );
}
