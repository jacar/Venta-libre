"use client";

import { useWishlistStore, WishlistItem } from "@/store/useWishlistStore";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

export default function WishlistButton({ product }: { product: WishlistItem }) {
  const { isInWishlist, toggleItem } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-8 h-8"></div>;

  const isActive = isInWishlist(product.id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        toggleItem(product);
      }}
      className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow transition-colors z-10 ${isActive ? 'bg-red-50 text-red-500' : 'bg-white text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
      aria-label="Agregar a favoritos"
    >
      <Heart className={`w-4 h-4 ${isActive ? 'fill-current' : ''}`} />
    </button>
  );
}
