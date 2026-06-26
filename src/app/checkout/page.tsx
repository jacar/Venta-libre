"use client";

import { useCartStore } from "@/store/useCartStore";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    postcode: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const billingShipping = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      address_1: formData.address,
      city: formData.city,
      state: formData.state,
      postcode: formData.postcode,
      country: "CO", // Ejemplo: Colombia, puedes cambiarlo
      email: formData.email,
      phone: formData.phone,
    };

    const lineItems = items.map(item => {
      const lineItem: any = {
        product_id: item.id,
        quantity: item.quantity
      };
      
      if (item.note) {
        lineItem.meta_data = [
          {
            key: "Especificaciones (Talla, Color, etc.)",
            value: item.note
          }
        ];
      }
      
      return lineItem;
    });

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billing: billingShipping,
          shipping: billingShipping, // Asumimos misma dirección
          line_items: lineItems
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        setSuccess(true);
        setOrderId(data.orderId);
        clearCart();
      } else {
        setError(data.message || "Hubo un error al procesar el pedido.");
      }
    } catch (err) {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-4">¡Gracias por tu compra!</h1>
        <p className="text-lg text-gray-600 mb-8">Tu pedido #{orderId} ha sido registrado exitosamente.</p>
        <Link href="/" className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
        <Link href="/" className="text-blue-600 hover:underline">Ir a comprar</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Finalizar Compra</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Formulario de Checkout */}
        <div className="w-full lg:w-2/3">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6">Datos de Envío y Facturación</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado/Provincia</label>
                <input required type="text" name="state" value={formData.state} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                <input required type="text" name="postcode" value={formData.postcode} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Procesando..." : "Confirmar Pedido"}
            </button>
          </form>
        </div>

        {/* Resumen de orden */}
        <div className="w-full lg:w-1/3">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Resumen de Compra</h2>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex flex-col text-sm border-b pb-3 mb-2 last:border-0">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium line-clamp-2">{item.quantity}x {item.name}</span>
                    <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  {item.note && (
                    <span className="text-xs text-gray-500 mt-1">Nota: {item.note}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-xl font-bold mb-4">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3">
                <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                <div>
                  <h3 className="font-bold">Pago Contra Entrega</h3>
                  <p className="text-sm mt-1">Pagas en efectivo o con tarjeta al recibir tu pedido en la puerta de tu casa.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
