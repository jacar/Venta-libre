"use client";

import Link from "next/link";
import { Home, Search, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function MobileBottomNav() {
  const { toggleCart, items } = useCartStore();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-40 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-14 sm:h-16">
        <Link href="/" className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-black">
          <Home className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
          <span className="text-[10px] font-medium">Inicio</span>
        </Link>
        
        <button 
          onClick={() => {
            const searchInput = document.querySelector('input[placeholder="Busca productos, marcas y más..."]') as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-black"
        >
          <Search className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
          <span className="text-[10px] font-medium">Buscar</span>
        </button>

        <button 
          onClick={toggleCart}
          className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-black relative"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
            {mounted && itemCount > 0 && (
              <span className="absolute -top-1 -right-2 inline-flex items-center justify-center min-w-[16px] h-[16px] sm:min-w-[18px] sm:h-[18px] px-1 text-[9px] sm:text-[10px] font-bold leading-none text-white bg-red-600 rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Carrito</span>
        </button>

        <Link 
          href={session ? "/perfil" : "/login"} 
          className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-black"
        >
          <User className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
          <span className="text-[10px] font-medium">Perfil</span>
        </Link>
      </div>
    </div>
  );
}
