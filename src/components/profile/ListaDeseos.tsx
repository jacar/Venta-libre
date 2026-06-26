"use client";

import { useWishlistStore } from "@/store/useWishlistStore";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";

export default function ListaDeseos() {
  const { items, toggleItem } = useWishlistStore();

  if (items.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
        <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-900">Tu lista está vacía</h3>
        <p className="text-sm text-gray-500">Agrega productos que te gusten para guardarlos aquí.</p>
        <Link href="/#catalogo" className="inline-block mt-4 text-[#fb7701] font-bold hover:underline">Ir de compras</Link>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Mi Lista de Deseos ({items.length})</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden group">
            <div className="relative aspect-square">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              <button 
                onClick={() => toggleItem(item)}
                className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-red-50 text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3">
              <Link href={`/product/${item.id}`} className="block">
                <h4 className="font-medium text-sm text-gray-900 line-clamp-1 hover:text-[#fb7701]">{item.name}</h4>
              </Link>
              <p className="font-bold text-[#e52e04] mt-1">${item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
