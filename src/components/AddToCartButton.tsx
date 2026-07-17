"use client";

import { useCartStore } from "@/store/useCartStore";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

interface AddToCartButtonProps {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
  requireNote?: boolean;
}

export default function AddToCartButton({ product, requireNote = false }: AddToCartButtonProps) {
  const { addToCart, toggleCart } = useCartStore();
  const [added, setAdded] = useState(false);
  const [note, setNote] = useState("");

  const handleAdd = () => {
    // Si requiere nota pero está vacía, podríamos lanzar advertencia, pero permitiremos añadirla
    addToCart({ ...product, note }, 1);
    setAdded(true);
    toggleCart(); // Opcional: abre el carrito al añadir
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col w-full">
      {requireNote && (
        <div className="mb-4 flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-700">Especificaciones requeridas:</label>
          <input 
            type="text" 
            placeholder="Ej. Talla M, Color Rojo, etc." 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#fb7701] outline-none text-sm"
          />
          <span className="text-xs text-gray-500">Por favor indica la talla o color deseado para tu pedido.</span>
        </div>
      )}
      <button
        onClick={handleAdd}
        className="w-full bg-[#fb7701] text-white py-4 rounded-xl font-black text-lg hover:bg-[#e52e04] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
      >
        <ShoppingCart className="w-5 h-5" />
        {added ? "¡Añadido!" : "Añadir al carrito"}
      </button>
    </div>
  );
}
