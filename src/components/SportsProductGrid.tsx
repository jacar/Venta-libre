"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Sparkles } from "lucide-react";
import { formatCOP } from "@/lib/formatPrice";

export default function SportsProductGrid({ products }: { products: any[] }) {
  if (!products || products.length === 0) return null;

  // Shuffle aleatorio en cada montaje del componente (cada recarga de página)
  const [displayProducts] = useState<any[]>(() =>
    [...products].sort(() => Math.random() - 0.5).slice(0, 5)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[320px] md:auto-rows-[360px]">
      {displayProducts.map((product: any, idx: number) => {
        const currentPrice = product.price || "0";
        const oldPrice = product.regular_price;
        let discount = 0;
        if (oldPrice && oldPrice !== currentPrice && parseFloat(oldPrice) > 0) {
          discount = Math.round(
            ((parseFloat(oldPrice) - parseFloat(currentPrice)) /
              parseFloat(oldPrice)) *
              100
          );
        }

        // El primer producto es gigante (ocupa 2 columnas y 2 filas)
        const isFeatured = idx === 0;

        return (
          <div
            key={product.id}
            className={`w-full h-full relative group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 bg-gray-50 border border-gray-100 ${
              isFeatured
                ? "md:col-span-2 md:row-span-2 auto-rows-[640px]"
                : "col-span-1 row-span-1"
            }`}
          >
            <Link
              href={`/product/${product.id}`}
              className="block w-full h-full relative"
            >
              {/* Imagen de fondo */}
              <div className="absolute inset-0 w-full h-full overflow-hidden bg-white">
                {product.images && product.images[0] ? (
                  <Image
                    src={
                      product.images[0].src ||
                      "https://admin.ventalibre.top/wp-content/uploads/woocommerce-placeholder.png"
                    }
                    alt={product.name}
                    fill
                    sizes={
                      isFeatured
                        ? "(max-width: 1024px) 100vw, 50vw"
                        : "(max-width: 1024px) 50vw, 25vw"
                    }
                    className="object-cover group-hover:scale-105 transition-transform duration-[1200ms] ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Sin imagen
                  </div>
                )}

                {/* Degradado oscuro */}
                {isFeatured ? (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10 opacity-80 group-hover:opacity-100 transition-opacity" />
                )}
              </div>

              {/* Botón de Lista de deseos */}
              <button
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-full text-black hover:bg-black hover:text-white transition-all duration-300 z-20 shadow-md"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <Heart className="w-4 h-4" strokeWidth={1.5} />
              </button>

              {/* Badges */}
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-[#e52e04] text-white text-[10px] uppercase tracking-[0.1em] font-black px-3 py-1.5 rounded-md z-20 shadow-md animate-pulse">
                  -{discount}% DTO.
                </div>
              )}

              {isFeatured && (
                <div className="absolute top-4 left-24 bg-black/80 text-white text-[10px] uppercase tracking-[0.1em] font-black px-3 py-1.5 rounded-md z-20 shadow-md border border-white/20 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  Destacado Deportivos
                </div>
              )}

              {/* Contenido superpuesto */}
              <div
                className={`absolute bottom-0 left-0 w-full p-6 sm:p-8 z-25 flex flex-col justify-end text-white`}
              >
                {isFeatured ? (
                  <>
                    <span className="text-yellow-300 text-xs font-black tracking-widest uppercase mb-1.5 block">
                      ALTO RENDIMIENTO
                    </span>
                    <h3 className="font-black text-2xl sm:text-3xl uppercase tracking-tight mb-3 leading-tight line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-white/80 text-sm font-medium mb-5 max-w-md hidden sm:block leading-relaxed">
                      Sube de nivel tu rutina de entrenamiento con el mejor
                      calzado diseñado para máxima comodidad, tracción y
                      durabilidad.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-3">
                        <span className="font-black text-xl sm:text-2xl text-yellow-300">
                          {formatCOP(currentPrice)}
                        </span>
                        {oldPrice && oldPrice !== currentPrice && (
                          <span className="text-white/50 text-xs sm:text-sm line-through font-light">
                            {formatCOP(oldPrice)}
                          </span>
                        )}
                      </div>
                      <div className="bg-white text-black p-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-yellow-300 transition-colors shadow-lg">
                        <ShoppingBag className="w-4 h-4" />
                        <span>COMPRAR AHORA</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="font-bold text-sm sm:text-base uppercase tracking-normal mb-1.5 line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="font-black text-base text-white">
                          {formatCOP(currentPrice)}
                        </span>
                        {oldPrice && oldPrice !== currentPrice && (
                          <span className="text-white/50 text-[10px] line-through font-light">
                            {formatCOP(oldPrice)}
                          </span>
                        )}
                      </div>
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg group-hover:bg-white group-hover:text-black transition-all">
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
