import Link from "next/link";
import Image from "next/image";
import { Timer, Zap, ShoppingCart } from "lucide-react";
import { formatCOP } from "@/lib/formatPrice";


export default function Hero({ latestProducts = [] }: { latestProducts?: any[] }) {
  return (
    <div className="w-full bg-[#e52e04] py-8 lg:py-12 overflow-hidden relative">
      {/* Patrón de fondo estilo "Ofertas" animado */}
      <div className="absolute inset-0 opacity-10 animate-[pulse_4s_ease-in-out_infinite]" style={{ backgroundImage: 'radial-gradient(circle at 3px 3px, white 2px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      
      <div className="max-w-[1400px] mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
        
        {/* Izquierda: Textos promocionales fuertes con animaciones */}
        <div className="flex flex-col items-center md:items-start text-white w-full md:w-1/3">
          <div className="inline-flex items-center gap-1 bg-[#fb7701] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-3 shadow-lg animate-bounce">
            <Zap className="w-4 h-4 fill-white" /> ¡Solo por tiempo limitado!
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black italic tracking-tighter drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)] flex flex-wrap justify-center md:justify-start gap-x-2 leading-none hover:scale-105 transition-transform cursor-default">
            <span className="animate-[pulse_2s_ease-in-out_infinite]">SUPER</span> 
            <span className="text-yellow-300 animate-[pulse_2.5s_ease-in-out_infinite]">OFERTAS</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl font-bold mt-2 tracking-wide opacity-90 text-center md:text-left drop-shadow-md">
            HASTA 70% DTO. + ENVÍO GRATIS*
          </p>
          
          <div className="flex items-center gap-2 mt-6 bg-black/30 backdrop-blur-md p-3 rounded-xl border border-white/20 shadow-xl hover:-translate-y-1 transition-transform">
            <Timer className="w-5 h-5 animate-pulse text-yellow-300" />
            <div className="flex gap-1 text-base">
              <div className="bg-white text-[#e52e04] font-black w-8 h-8 flex items-center justify-center rounded shadow-inner">09</div>
              <span className="font-bold self-center">:</span>
              <div className="bg-white text-[#e52e04] font-black w-8 h-8 flex items-center justify-center rounded shadow-inner animate-[pulse_1s_ease-in-out_infinite]">45</div>
              <span className="font-bold self-center">:</span>
              <div className="bg-white text-[#e52e04] font-black w-8 h-8 flex items-center justify-center rounded shadow-inner">12</div>
            </div>
          </div>
        </div>

        {/* Derecha: Slider de últimos productos, tarjetas más grandes */}
        <div className="w-full md:w-2/3 mt-2 md:mt-0">
          <div className="flex overflow-x-auto gap-4 pb-4 pt-2 scrollbar-hide snap-x">
            {latestProducts.map((product) => (
              <div key={product.id} className="min-w-[160px] max-w-[160px] sm:min-w-[180px] sm:max-w-[180px] lg:min-w-[200px] lg:max-w-[200px] snap-center bg-white rounded-xl shadow-2xl p-2.5 flex flex-col relative group hover:-translate-y-2 hover:shadow-[0_20px_30px_-10px_rgba(0,0,0,0.5)] transition-all duration-300">
                <div className="absolute -top-2 -left-2 bg-yellow-400 text-black text-[10px] sm:text-xs font-black px-2 py-1 rounded-br-lg rounded-tl-xl shadow-md z-10 uppercase animate-bounce">
                  🔥 Nuevo
                </div>
                <Link href={`/product/${product.id}`} className="block relative aspect-square bg-gray-50 rounded-lg mb-3 overflow-hidden border border-gray-100">
                  {product.images && product.images[0] ? (
                    <Image 
                      src={product.images[0].src} 
                      alt={product.name} 
                      fill 
                      sizes="(max-width: 640px) 160px, (max-width: 1024px) 180px, 200px"
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">Sin foto</div>
                  )}
                </Link>
                <Link href={`/product/${product.id}`} className="text-gray-800 text-[11px] sm:text-xs font-bold leading-tight line-clamp-2 group-hover:text-[#e52e04] transition-colors mb-2">
                  {product.name}
                </Link>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-[#e52e04] font-black text-base lg:text-lg">{formatCOP(product.price || "0")}</span>
                  <Link href={`/product/${product.id}`} className="bg-black text-white p-1.5 rounded-full hover:bg-[#fb7701] hover:scale-110 active:scale-95 transition-all shadow-md">
                    <ShoppingCart className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
            
            {/* Tarjeta de "Ver más" */}
            <div className="min-w-[160px] sm:min-w-[180px] lg:min-w-[200px] snap-center bg-black/20 rounded-xl border border-white/40 backdrop-blur-md flex items-center justify-center hover:bg-black/30 hover:scale-105 transition-all cursor-pointer">
               <Link href="#catalogo" className="text-white font-black text-sm lg:text-base uppercase tracking-wider flex flex-col items-center gap-2 group">
                 <span className="text-3xl sm:text-4xl group-hover:translate-x-2 transition-transform">➔</span>
                 Ver todo
               </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
