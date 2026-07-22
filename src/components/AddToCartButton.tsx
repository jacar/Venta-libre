"use client";

import { useCartStore } from "@/store/useCartStore";
import { ShoppingCart, Minus, Plus, Truck } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    description?: string;
  };
  isFootwear?: boolean;
  images?: string[];
  attributes?: {
    id: number;
    name: string;
    options: string[];
  }[];
}

function extractSizesFromDescription(text?: string): string[] {
  if (!text) return [];
  // Strip HTML and convert to lowercase
  const plainText = text.replace(/<[^>]+>/g, ' ').toLowerCase();
  
  // Find the word "talla" or "tallas"
  const tallaIndex = plainText.indexOf('talla');
  if (tallaIndex === -1) return [];

  // Look at a substring after "talla"
  const afterTalla = plainText.slice(tallaIndex, tallaIndex + 150);

  // 1. Check for ranges: "35 al 40", "35 a 40", "35-40"
  const rangeMatch = afterTalla.match(/(\d{2})\s*(?:al|a|-|a la)\s*(\d{2})/);
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1]);
    const end = parseInt(rangeMatch[2]);
    if (start >= 30 && end <= 45 && start < end) {
      const sizes = [];
      for (let i = start; i <= end; i++) {
        sizes.push(i.toString());
      }
      return sizes;
    }
  }

  // 2. Check for comma or space separated lists
  const numbersMatch = afterTalla.match(/(?:\d{2}[,\sy]*)+/);
  if (numbersMatch) {
    const numbers = numbersMatch[0].match(/\d{2}/g);
    if (numbers) {
      const validSizes = numbers.filter(n => parseInt(n) >= 30 && parseInt(n) <= 45);
      if (validSizes.length > 0) {
        return Array.from(new Set(validSizes));
      }
    }
  }

  return [];
}

export default function AddToCartButton({ product, isFootwear = false, attributes = [] }: AddToCartButtonProps) {
  const { addToCart, toggleCart } = useCartStore();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Extraer tallas de la descripción o usar predeterminadas
  const extractedSizes = extractSizesFromDescription(product.description);
  const defaultSizes = extractedSizes.length > 0 ? extractedSizes : ["35", "36", "37", "38", "39", "40", "41", "42", "43"];

  // Fallback defaults si WooCommerce no tiene atributos configurados y ES calzado
  const defaultFootwearAttributes = isFootwear ? [
    {
      id: 998,
      name: "Talla",
      options: defaultSizes
    }
  ] : [];

  const finalAttributes = attributes && attributes.length > 0 ? attributes : defaultFootwearAttributes;

  // Initialize selected attributes
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    finalAttributes.forEach(attr => {
      if (attr.options && attr.options.length > 0) {
        init[attr.name] = attr.options[0]; // Default to first option
      }
    });
    return init;
  });

  const handleAttributeChange = (name: string, value: string) => {
    setSelectedAttributes(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    let finalNote = note;
    
    // Combine selected attributes into the note
    if (finalAttributes && finalAttributes.length > 0) {
      const attrStrings = Object.entries(selectedAttributes).map(([key, val]) => `${key}: ${val}`);
      finalNote = attrStrings.join(" | ") + (note ? ` | Nota: ${note}` : "");
    }

    addToCart({ ...product, note: finalNote }, quantity);
    setAdded(true);
    toggleCart(); 
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    let finalNote = note;
    
    // Combine selected attributes into the note
    if (finalAttributes && finalAttributes.length > 0) {
      const attrStrings = Object.entries(selectedAttributes).map(([key, val]) => `${key}: ${val}`);
      finalNote = attrStrings.join(" | ") + (note ? ` | Nota: ${note}` : "");
    }

    addToCart({ ...product, note: finalNote }, quantity);
    router.push("/checkout");
  };

  const hasAttributes = finalAttributes && finalAttributes.length > 0;
  const hasColorAttribute = finalAttributes.some(a => a.name.toLowerCase() === 'color' || a.name.toLowerCase() === 'colores');

  return (
    <div className="flex flex-col w-full">
      {/* Product Options (Sizes, etc.) */}
      {hasAttributes && (
        <div className="mb-6 flex flex-col gap-5 border border-gray-100 rounded-xl p-5 bg-gray-50/50">
          {finalAttributes.map((attr, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-800 uppercase tracking-wide">{attr.name}:</label>
              <div className="flex flex-wrap gap-2">
                {attr.options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => handleAttributeChange(attr.name, opt)}
                    className={`px-4 py-2 text-sm font-bold border rounded-lg transition-all ${
                      selectedAttributes[attr.name] === opt 
                        ? 'border-[#fb7701] bg-orange-50 text-[#fb7701] shadow-sm' 
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manual Input for Color/Notes */}
      <div className="mb-4 flex flex-col gap-1">
        <label className="text-sm font-bold text-gray-700">
          {!hasColorAttribute ? "Escribe el Color deseado y/o notas:" : "Notas adicionales (Opcional):"}
        </label>
        <input 
          type="text" 
          placeholder={!hasColorAttribute ? "Ej. Color Blanco, detalles..." : "Ej. Algún detalle específico..."}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#fb7701] outline-none text-sm"
        />
        {!hasColorAttribute && (
          <span className="text-xs text-orange-600 font-medium">Por favor especifica el color que deseas.</span>
        )}
      </div>

      {/* Quantity and Add to Cart */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center border-2 border-gray-200 rounded-xl bg-white shrink-0 h-[56px]">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-full flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-500 rounded-l-xl"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="w-10 text-center font-black text-lg select-none">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="w-12 h-full flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-500 rounded-r-xl"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex-grow bg-[#fb7701] text-white h-[56px] rounded-xl font-black text-lg hover:bg-[#e52e04] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-200/50"
          >
            <ShoppingCart className="w-6 h-6" />
            {added ? "¡Añadido!" : "Añadir al carrito"}
          </button>
        </div>

        <button
          onClick={handleBuyNow}
          className="w-full bg-green-500 text-white h-[56px] rounded-xl font-black text-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-200/50"
        >
          <Truck className="w-6 h-6" />
          Comprar con Pago Contra Entrega
        </button>
      </div>
    </div>
  );
}
