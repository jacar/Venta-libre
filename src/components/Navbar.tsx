"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Search, User, Menu, X, CheckCircle, ShieldCheck, MapPin } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useSession } from "next-auth/react";
import CartDrawer from "./CartDrawer";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { formatCOP } from "@/lib/formatPrice";

export default function Navbar({ categories = [] }: { categories?: any[] }) {
  const { toggleCart, items } = useCartStore();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close search dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length >= 3) {
        setIsSearching(true);
        fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
          .then(res => res.json())
          .then(data => {
            setSearchResults(data);
            setIsSearching(false);
          })
          .catch(() => {
            setSearchResults([]);
            setIsSearching(false);
          });
      } else {
        setSearchResults([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const excludedCategories = ['botas', 'zapatos aaa', 'cat'];
  const visibleCategories = categories.filter(cat => {
    const slug = cat.slug?.toLowerCase() || '';
    const name = cat.name?.toLowerCase() || '';
    return !excludedCategories.some(excluded => slug.includes(excluded) || name.includes(excluded));
  });

  return (
    <>
      {/* Top micro-bar (Temu style) - Hidden on Mobile */}
      <div className="hidden lg:flex bg-[#f5f5f5] border-b border-gray-200 text-gray-500 text-[11px] py-1.5 px-4 justify-between items-center overflow-hidden">
        <div className="flex items-center gap-4 max-w-7xl mx-auto w-full flex-wrap">
          <span className="flex items-center gap-1 font-bold text-black bg-[#fb7701]/20 px-2 py-0.5 rounded-sm"><ShieldCheck className="w-3 h-3 text-[#fb7701]"/> Calidad Garantizada: Réplicas AAA Premium</span>
          <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-[#fb7701]"/> Pago Contra Entrega Nacional</span>
          <span className="flex items-center gap-1 hover:text-[#fb7701] cursor-pointer ml-auto"><MapPin className="w-3 h-3"/> Enviar a Colombia</span>
        </div>
      </div>

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-4 py-5 flex flex-wrap lg:flex-nowrap justify-between items-center gap-4">
          
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden p-1 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
            <Link href="/" className="flex-shrink-0 flex items-center relative w-[160px] h-[40px]">
              <Image 
                src="https://admin.ventalibre.top/wp-content/uploads/2026/06/webcincodev-160-x-40-px.svg" 
                alt="Venta Libre" 
                fill
                className="object-contain"
              />
            </Link>
          </div>

          {/* Search Bar - Big Temu Style */}
          <div className="order-3 lg:order-2 w-full lg:w-auto lg:flex-1 max-w-3xl flex relative" ref={searchContainerRef}>
            <div className="flex w-full border-2 border-[#fb7701] rounded-full overflow-hidden bg-white hover:shadow-md transition-shadow relative">
              <input 
                type="text" 
                placeholder="Busca productos, marcas y más..." 
                className="w-full px-5 py-2.5 text-sm outline-none text-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-[#fb7701] text-white px-8 py-2.5 font-bold hover:bg-[#e06a01] transition-colors flex items-center gap-2">
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">Buscar</span>
              </button>
            </div>
            
            {/* Dropdown de Búsqueda */}
            {(searchQuery.length >= 3 && (isSearching || searchResults.length > 0)) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden z-50 flex flex-col max-h-[400px]">
                {isSearching ? (
                  <div className="p-6 text-center text-gray-500 flex flex-col items-center justify-center">
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-[#fb7701] rounded-full animate-spin mb-2"></div>
                    <span className="text-sm font-medium">Buscando productos...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="overflow-y-auto">
                    {searchResults.map((product) => (
                      <Link 
                        key={product.id} 
                        href={`/product/${product.id}`}
                        onClick={() => {
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                        className="flex items-center gap-4 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                      >
                        <div className="w-12 h-12 flex-shrink-0 rounded bg-gray-50 border border-gray-100 overflow-hidden relative">
                          {product.images && product.images[0] ? (
                            <Image 
                              src={product.images[0].src} 
                              alt={product.name} 
                              fill
                              sizes="48px"
                              className="object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ShoppingCart className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
                          <span className="text-xs font-bold text-[#e52e04]">{formatCOP(product.price || "0")}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500 text-sm">
                    No encontramos resultados para "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Icons: Account, Returns, Cart - Hidden on Mobile because they are in BottomNav */}
          <div className="order-2 lg:order-3 hidden lg:flex items-center gap-6 z-50">
            <Link href="/politicas" className="hidden md:flex flex-col items-center text-gray-700 hover:text-[#fb7701]">
              <span className="text-xs font-bold">Envíos y</span>
              <span className="text-[11px] leading-tight">Devoluciones</span>
            </Link>
            
            {session ? (
              <Link href="/perfil" className="hidden md:flex flex-col items-center text-gray-700 hover:text-[#fb7701]">
                <User className="w-6 h-6 mb-0.5 text-[#fb7701]" />
                <span className="text-[11px] font-bold">Mi Perfil</span>
              </Link>
            ) : (
              <Link href="/login" className="hidden md:flex flex-col items-center text-gray-700 hover:text-[#fb7701]">
                <User className="w-6 h-6 mb-0.5" />
                <span className="text-[11px] font-bold">Entrar</span>
              </Link>
            )}

            <button 
              onClick={toggleCart}
              className="relative flex flex-col items-center text-gray-700 hover:text-[#fb7701] transition-colors group"
            >
              <div className="relative">
                <ShoppingCart className="w-7 h-7" />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[11px] font-bold leading-none text-white bg-[#e52e04] rounded-full border-2 border-white group-hover:scale-110 transition-transform">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-bold mt-1">Carrito</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="hidden lg:flex bg-white border-t border-gray-100 shadow-sm text-sm">
          <div className="max-w-[1400px] mx-auto px-4 flex items-center gap-6 overflow-x-auto w-full py-2">
            <Link href="/" className="font-bold text-[#fb7701] flex-shrink-0 border-b-2 border-[#fb7701] pb-0.5">Mejores Ventas</Link>
            <Link href="/" className="font-bold text-gray-700 hover:text-[#fb7701] flex-shrink-0">Novedades</Link>
            <Link href="/outlet" className="font-black text-[#8B7355] hover:text-[#fb7701] flex-shrink-0">Outlet</Link>
            {visibleCategories.map(cat => (
              <Link 
                key={cat.id} 
                href={`/categoria/${cat.slug}`} 
                className="font-medium text-gray-600 hover:text-[#fb7701] flex-shrink-0"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-xl py-2 px-0 flex flex-col max-h-[80vh] overflow-y-auto">
             <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                <User className={session ? "w-8 h-8 text-[#fb7701]" : "w-8 h-8 text-gray-400"} />
                <div>
                  <p className="font-bold text-sm">
                    {session ? `Hola, ${session.user?.name?.split(' ')[0] || 'amigo'}` : 'Bienvenido a Venta Libre'}
                  </p>
                  {session ? (
                    <Link href="/perfil" onClick={() => setMobileMenuOpen(false)} className="text-xs text-blue-600 hover:underline">Ir a mi perfil</Link>
                  ) : (
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-xs text-blue-600 hover:underline">Inicia sesión / Regístrate</Link>
                  )}
                </div>
             </div>
            <Link onClick={() => setMobileMenuOpen(false)} href="/" className="px-4 py-3 text-sm font-bold text-[#fb7701] border-b border-gray-50 flex justify-between">Mejores Ventas <span>&rarr;</span></Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/" className="px-4 py-3 text-sm font-bold text-gray-800 border-b border-gray-50 flex justify-between">Novedades <span>&rarr;</span></Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/outlet" className="px-4 py-3 text-sm font-black text-[#8B7355] border-b border-gray-50 flex justify-between bg-[#FDFBF7]">Outlet <span>&rarr;</span></Link>
            <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mt-2">Categorías</div>
            {visibleCategories.map(cat => (
              <Link 
                key={cat.id} 
                onClick={() => setMobileMenuOpen(false)}
                href={`/categoria/${cat.slug}`} 
                className="px-4 py-3 text-sm font-medium text-gray-700 border-b border-gray-50"
              >
                {cat.name}
              </Link>
            ))}
            <div className="p-4 bg-gray-50 mt-4">
               <Link onClick={() => setMobileMenuOpen(false)} href="/politicas" className="text-sm text-gray-600 underline">Políticas y Envíos</Link>
            </div>
          </div>
        )}
      </nav>
      <CartDrawer />
    </>
  );
}
