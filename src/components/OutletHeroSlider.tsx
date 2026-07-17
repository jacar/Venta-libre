"use client";

import React from 'react';
import Link from 'next/link';

interface OutletHeroSliderProps {
  backgroundImage?: string;
}

export default function OutletHeroSlider({ 
  backgroundImage = "https://admin.ventalibre.top/wp-content/uploads/2026/07/ChatGPT-Image-15-jul-2026-20_53_26.png" 
}: OutletHeroSliderProps) {
  return (
    <section className="relative w-full h-[70vh] md:h-[95vh] min-h-[600px] bg-white z-20 mb-20 md:mb-40">
      
      {/* Background Image overlapping the next section with fade effect to remove borders */}
      <div 
          className="absolute top-0 left-0 w-full h-[calc(100%+3rem)] md:h-[calc(100%+5rem)] bg-cover bg-[center_80%] bg-no-repeat pointer-events-none [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)] md:[mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)] -webkit-mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)" 
          style={{ 
              backgroundImage: `url("${backgroundImage}")`,
              WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)'
          }}
      ></div>
      {/* Gradient Overlay to blend the left side of the image into the white background and hide any vertical border */}
      <div className="absolute top-0 left-0 w-full md:w-[60%] h-full bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-10"></div>

      <div className="max-w-[1400px] mx-auto h-full relative z-10 px-6 sm:px-12 md:px-20 flex flex-col justify-center">
          <h1 className="text-5xl md:text-[72px] font-extrabold tracking-[-0.02em] text-black max-w-2xl leading-[1.05] mb-6 whitespace-pre-line drop-shadow-sm">
              NUEVA{'\n'}COLECCIÓN
          </h1>
          <p className="text-base md:text-lg text-black/80 max-w-md mb-10 font-light tracking-wide drop-shadow-sm leading-relaxed">
              Descubre las últimas tendencias en ropa y accesorios con descuentos de outlet.
          </p>
          <Link 
              href="/categoria/outlet" 
              className="bg-black text-white px-8 py-3.5 font-bold tracking-[0.15em] uppercase text-[11px] md:text-xs w-fit hover:bg-gray-800 transition-colors shadow-sm"
          >
              COMPRAR AHORA
          </Link>
      </div>

    </section>
  );
}
