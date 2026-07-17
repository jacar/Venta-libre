"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Zap } from "lucide-react";
import { formatCOP } from "@/lib/formatPrice";

export default function SportsProductGrid({ products }: { products: any[] }) {
  if (!products || products.length === 0) return null;

  const hero = products[0];
  const rest = products.slice(1, 7); // Máximo 6 en el grid derecho

  const getImg = (p: any) =>
    p.images?.[0]?.src ||
    "https://admin.ventalibre.top/wp-content/uploads/woocommerce-placeholder.png";

  const getDiscount = (p: any) => {
    const cur = parseFloat(p.price || "0");
    const reg = parseFloat(p.regular_price || "0");
    if (reg > 0 && reg > cur) return Math.round(((reg - cur) / reg) * 100);
    return 0;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* ── HERO CARD (izquierda) ── */}
      <Link
        href={`/product/${hero.id}`}
        className="relative lg:w-[38%] shrink-0 rounded-2xl overflow-hidden group block"
        style={{ minHeight: 480 }}
      >
        <Image
          src={getImg(hero)}
          alt={hero.name}
          fill
          sizes="(max-width:1024px) 100vw, 38vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Badge top */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#fb7701] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
          <Zap className="w-3 h-3" />
          Destacado
        </div>

        {getDiscount(hero) > 0 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow">
            -{getDiscount(hero)}%
          </div>
        )}

        {/* Info bottom */}
        <div className="absolute bottom-0 left-0 w-full p-6 text-white">
          <span className="text-[#fb7701] text-[10px] font-black uppercase tracking-widest mb-1 block">
            Alto Rendimiento
          </span>
          <h3 className="font-black text-2xl uppercase leading-tight mb-2 line-clamp-2">
            {hero.name}
          </h3>
          <p className="text-white/70 text-sm mb-5 leading-relaxed hidden sm:block">
            Diseñado para máxima comodidad, tracción y durabilidad en cada paso.
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-[#fb7701] font-black text-2xl">
                {formatCOP(hero.price)}
              </span>
              {hero.regular_price && hero.regular_price !== hero.price && (
                <span className="text-white/40 text-sm line-through">
                  {formatCOP(hero.regular_price)}
                </span>
              )}
            </div>
            <div className="bg-white text-black flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase hover:bg-[#fb7701] hover:text-white transition-colors shadow-lg">
              <ShoppingBag className="w-4 h-4" />
              Comprar
            </div>
          </div>
        </div>
      </Link>

      {/* ── GRID DERECHO (6 cards uniformes) ── */}
      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {rest.map((product: any) => {
          const discount = getDiscount(product);
          return (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="relative rounded-xl overflow-hidden group block bg-gray-50"
              style={{ minHeight: 200 }}
            >
              <Image
                src={getImg(product)}
                alt={product.name}
                fill
                sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 20vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* Overlay suave */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              {/* Badge descuento */}
              {discount > 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow">
                  -{discount}%
                </div>
              )}

              {/* Info */}
              <div className="absolute bottom-0 left-0 w-full p-3 text-white">
                <h4 className="font-bold text-xs uppercase leading-tight line-clamp-2 mb-1">
                  {product.name}
                </h4>
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-white">
                    {formatCOP(product.price)}
                  </span>
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 p-1.5 rounded-lg group-hover:bg-[#fb7701] group-hover:border-transparent transition-all">
                    <ShoppingBag className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
