"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCOP } from "@/lib/formatPrice";
import { Eye, ArrowUpRight } from "lucide-react";

export default function ParaEllasCarousel({ products }: { products: any[] }) {
  // Timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 15,
    hours: 23,
    minutes: 44,
    seconds: 56
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
            else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!products || products.length === 0) return null;

  return (
    <div className="w-full mb-16 relative">
      <div className="relative overflow-hidden flex flex-col lg:flex-row bg-[#fdf6f7]">
        
        {/* Background Split - Only visible cleanly on LG screens */}
        <div className="absolute inset-0 z-0 flex flex-col lg:flex-row">
          <div className="w-full lg:w-[65%] h-full bg-[#fdf6f7]"></div>
          <div className="w-full lg:w-[35%] h-full bg-[#c53659]"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full pt-8 pb-12 lg:pt-12 lg:pb-16 flex flex-col">
          
          {/* Header Row */}
          <div className="px-6 lg:px-10 flex flex-col lg:flex-row justify-between items-start lg:items-center w-full gap-8 lg:gap-0">
            
            {/* Left Header - Text & Timer */}
            <div className="flex flex-col lg:flex-row items-start lg:items-end gap-6 lg:gap-12 w-full lg:w-[65%]">
              <div>
                <span className="text-[#c53659] text-[10px] font-bold tracking-widest uppercase mb-2 block">
                  NUEVA COLECCIÓN
                </span>
                <h2 className="text-3xl lg:text-4xl font-black text-black tracking-tight" style={{ fontFamily: 'var(--font-groote), sans-serif' }}>
                  Venta relámpago de tendencia
                </h2>
              </div>

              {/* Timer Circles */}
              <div className="flex items-center gap-3">
                <div className="w-[50px] h-[50px] rounded-full bg-white flex flex-col items-center justify-center shadow-sm">
                  <span className="text-black font-bold text-sm leading-none">{timeLeft.days}</span>
                  <span className="text-gray-400 text-[9px]">Días</span>
                </div>
                <div className="w-[50px] h-[50px] rounded-full bg-white flex flex-col items-center justify-center shadow-sm">
                  <span className="text-black font-bold text-sm leading-none">{timeLeft.hours}</span>
                  <span className="text-gray-400 text-[9px]">Horas</span>
                </div>
                <div className="w-[50px] h-[50px] rounded-full bg-white flex flex-col items-center justify-center shadow-sm">
                  <span className="text-black font-bold text-sm leading-none">{timeLeft.minutes}</span>
                  <span className="text-gray-400 text-[9px]">Min</span>
                </div>
                <div className="w-[50px] h-[50px] rounded-full bg-white flex flex-col items-center justify-center shadow-sm">
                  <span className="text-black font-bold text-sm leading-none">{timeLeft.seconds}</span>
                  <span className="text-gray-400 text-[9px]">Segundo</span>
                </div>
              </div>
            </div>

            {/* Right Header - Button */}
            <div className="w-full lg:w-[35%] flex justify-start lg:justify-center lg:pl-10 relative">
               <Link href="/categoria/para-ellas" className="inline-flex items-center gap-2 border border-white/40 hover:border-white text-white px-6 py-2.5 rounded-full text-xs font-bold transition-colors">
                 VER TODA LA COLECCIÓN <ArrowUpRight className="w-4 h-4" />
               </Link>
            </div>
          </div>

          {/* Divider Line */}
          <div className="w-full h-[1px] mt-8 mb-8 relative flex">
            <div className="w-full lg:w-[65%] h-full bg-black/5"></div>
            <div className="w-full lg:w-[35%] h-full bg-white/20"></div>
          </div>

          {/* Carousel */}
          <div className="px-6 lg:px-10 w-full overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex gap-4 lg:gap-6 w-max">
              {products.map((product) => {
                const price = product.price || "0";
                
                return (
                  <div key={product.id} className="w-[280px] lg:w-[340px] bg-white rounded-2xl p-5 shrink-0 flex flex-col shadow-sm group overflow-hidden relative">
                    
                    {/* Card Header (Price & Badge) */}
                    <div className="flex justify-between items-center mb-5 z-10 relative">
                      <span className="font-bold text-black text-sm">{formatCOP(price)}</span>
                      <span className="bg-black text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        25% de descuento
                      </span>
                    </div>

                    {/* Image Container with Hover Overlay */}
                    <div className="relative aspect-square w-full mb-4 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0].src}
                          alt={product.name}
                          fill
                          sizes="240px"
                          className="object-contain p-2"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">Sin imagen</span>
                      )}

                      {/* Hover Dark Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Link href={`/product/${product.id}`} className="w-12 h-12 bg-[#c53659] rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 hover:bg-[#a62c4a]">
                          <Eye className="w-5 h-5 text-white" />
                        </Link>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="mt-auto relative z-10">
                      <Link href={`/product/${product.id}`} className="hover:underline">
                        <h3 className="font-bold text-black text-sm leading-tight line-clamp-1 mb-1">{product.name}</h3>
                      </Link>
                      <span className="text-[#c53659] text-[9px] font-bold tracking-wider uppercase">
                        EXCLUSIVO DE TEMPORADA
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
      
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
