"use client";

import { useCartStore } from "@/store/useCartStore";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { formatCOP } from "@/lib/formatPrice";

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeFromCart, updateQuantity } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={toggleCart}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2 text-black">
            <ShoppingCart className="w-5 h-5 text-black" /> 
            Tu Carrito
          </h2>
          <button 
            onClick={toggleCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-black"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
              <ShoppingCart className="w-12 h-12 text-gray-300" />
              <p className="text-black">Tu carrito está vacío</p>
              <button 
                onClick={toggleCart}
                className="text-orange-600 font-bold hover:underline"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b pb-4">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image 
                      src={item.image || "https://admin.ventalibre.top/wp-content/uploads/woocommerce-placeholder.png"} 
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-black line-clamp-2">{item.name}</h3>
                      {item.note && (
                        <p className="text-xs text-gray-600 mt-0.5 bg-gray-100 p-1 rounded inline-block">
                          Nota: {item.note}
                        </p>
                      )}
                      <p className="font-black text-[#e52e04] mt-1">{formatCOP(item.price)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded border-gray-300">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 disabled:opacity-50 text-black font-bold"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-bold text-sm text-black">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 text-black font-bold"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="font-black text-black text-lg">Total:</span>
              <span className="text-2xl font-black text-[#e52e04]">{formatCOP(total)}</span>
            </div>
            <Link 
              href="/checkout"
              onClick={toggleCart}
              className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors flex justify-center items-center"
            >
              Finalizar Compra
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
