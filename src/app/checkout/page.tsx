"use client";

import { useCartStore } from "@/store/useCartStore";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatCOP } from "@/lib/formatPrice";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    firstName: "",
    lastName: "",
    documentNumber: "",
    tags: "",
    supplierNotes: "",
    internalNotes: "",
    pickupOffice: false,
    address: "",
    department: "",
    address2: "",
    paymentMethod: "cod"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type, value } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
      address_2: formData.address2,
      city: formData.department, // Para mantener compatibilidad
      state: formData.department,
      country: "CO",
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
            key: "Especificaciones",
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
          shipping: billingShipping,
          line_items: lineItems,
          documentNumber: formData.documentNumber,
          tags: formData.tags,
          supplierNotes: formData.supplierNotes,
          internalNotes: formData.internalNotes,
          pickupOffice: formData.pickupOffice,
          paymentMethod: formData.paymentMethod
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        setSuccess(true);
        setOrderId(data.orderId);
        
        // Desplegar mensaje de WhatsApp automáticamente (usando href para evitar bloqueador de ventanas emergentes)
        const phoneNumber = "573052891719";
        const textMessage = `¡Hola! Acabo de realizar un nuevo pedido.\n\n*Número de pedido:* #${data.orderId}\n*Nombre:* ${formData.firstName} ${formData.lastName}\n*Documento:* ${formData.documentNumber}\n*Total:* ${formatCOP(total)}\n\nQuedo atento(a).`;
        const encodedMessage = encodeURIComponent(textMessage);
        
        // Redirigir en la misma pestaña para que navegadores móviles y de PC no lo bloqueen
        window.location.href = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

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
    const phoneNumber = "573052891719";
    const textMessage = `¡Hola! Acabo de realizar un nuevo pedido.\n\n*Número de pedido:* #${orderId}\n*Nombre:* ${formData.firstName} ${formData.lastName}\n*Documento:* ${formData.documentNumber}\n*Total:* ${formatCOP(total)}\n\nQuedo atento(a).`;
    const waLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(textMessage)}`;

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-10 text-center transform transition-all hover:scale-105 duration-300">
          <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">¡Gracias por tu compra!</h1>
          <p className="text-lg text-gray-600 mb-8">Tu pedido #{orderId} ha sido registrado exitosamente.</p>
          
          <a 
            href={waLink}
            className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-600 transition-all duration-300 inline-block mb-6 w-full shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Confirmar pedido por WhatsApp
          </a>
          <br />
          <Link href="/" className="text-gray-500 hover:text-gray-900 font-bold transition-colors inline-block">
            Volver a la tienda
          </Link>
        </div>
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
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-black bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-black mb-8 text-gray-900">Nuevo Pedido</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Formulario de Checkout */}
        <div className="w-full lg:w-2/3">
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6 sm:p-8 rounded-xl shadow-sm">
            <h2 className="text-lg font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">Datos del cliente y dirección</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Teléfono</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    🇨🇴 +57
                  </span>
                  <input required type="text" name="phone" placeholder="Ingresa un teléfono" value={formData.phone} onChange={handleChange} className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-orange-500 focus:border-orange-500 sm:text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Correo</label>
                <input required type="email" name="email" placeholder="Ingresa el correo" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-orange-500 focus:border-orange-500 sm:text-sm outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre</label>
                <input required type="text" name="firstName" placeholder="Ingresa el nombre" value={formData.firstName} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-orange-500 focus:border-orange-500 sm:text-sm outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Apellido</label>
                <input required type="text" name="lastName" placeholder="Ingresa el apellido" value={formData.lastName} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-orange-500 focus:border-orange-500 sm:text-sm outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cédula o Documento</label>
                <input required type="text" name="documentNumber" placeholder="Ingresar el documento" value={formData.documentNumber} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-orange-500 focus:border-orange-500 sm:text-sm outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Etiqueta - (Sepáralas con una ',')</label>
                <input type="text" name="tags" placeholder="Ingresa una etiqueta" value={formData.tags} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-orange-500 focus:border-orange-500 sm:text-sm outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Notas para el proveedor</label>
                <input type="text" name="supplierNotes" placeholder="Ingresa una nota" value={formData.supplierNotes} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-orange-500 focus:border-orange-500 sm:text-sm outline-none" />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Notas internas</label>
              <textarea name="internalNotes" rows={3} placeholder="Ingresar notas" value={formData.internalNotes} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-orange-500 focus:border-orange-500 sm:text-sm outline-none"></textarea>
            </div>

            <div className="mb-4 flex items-center">
              <input type="checkbox" id="pickupOffice" name="pickupOffice" checked={formData.pickupOffice} onChange={handleChange} className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
              <label htmlFor="pickupOffice" className="ml-2 block text-sm text-gray-700 font-medium">Entregar en una oficina de la transportadora</label>
            </div>

            <div className="mb-4">
              <input required type="text" name="address" placeholder="Ej: Calle 1 # 32 - 21" value={formData.address} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-orange-500 focus:border-orange-500 sm:text-sm outline-none" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Departamento</label>
              <input required type="text" name="department" placeholder="Selecciona una opción o ingresa el nombre" value={formData.department} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-orange-500 focus:border-orange-500 sm:text-sm outline-none" />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Información adicional de la dirección</label>
              <input type="text" name="address2" placeholder="Barrio, Referencia, Nombre de Conjunto, Torre, Apto, etc..." value={formData.address2} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-orange-500 focus:border-orange-500 sm:text-sm outline-none" />
            </div>

            <h2 className="text-lg font-bold mb-4 text-gray-800 border-b border-gray-200 pb-3">Método de pago</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <label className={`border rounded-lg p-4 flex items-center cursor-pointer transition-colors ${formData.paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50/50' : 'border-gray-200'}`}>
                <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300" />
                <span className="ml-3 font-medium text-gray-900">Pago contra entrega</span>
              </label>
              <label className={`border rounded-lg p-4 flex items-center cursor-pointer transition-colors ${formData.paymentMethod === 'prepaid' ? 'border-orange-500 bg-orange-50/50' : 'border-gray-200'}`}>
                <input type="radio" name="paymentMethod" value="prepaid" checked={formData.paymentMethod === 'prepaid'} onChange={handleChange} className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300" />
                <span className="ml-3 font-medium text-gray-900">Pago anticipado</span>
              </label>
            </div>

            {error && <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-md mb-6 text-sm">{error}</div>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#eeeeee] hover:bg-gray-300 text-gray-800 py-3 rounded-md font-bold transition-colors focus:ring-2 focus:ring-gray-300 outline-none disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Procesando..." : "Crear Pedido"}
            </button>
          </form>
        </div>

        {/* Resumen de orden */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm sticky top-6">
            <h2 className="text-lg font-bold mb-4 text-gray-800 border-b border-gray-200 pb-3">Resumen del pedido</h2>
            
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">Productos</h3>
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-500">{item.quantity} Und</span>
                      <span className="font-medium text-gray-900">{formatCOP(item.price * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">Cliente y dirección</h3>
              <p className="text-sm text-gray-500 italic">
                {formData.firstName || formData.address ? `${formData.firstName} ${formData.lastName} - ${formData.address}` : 'Datos sin completar'}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">
                {formData.paymentMethod === 'cod' ? 'Pago contra entrega' : 'Pago anticipado'}
              </h3>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Precio de venta:</span>
                <span className="font-bold">{formatCOP(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Costo del Producto:</span>
                <span className="text-gray-500">{"$ 0"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Comisión de la plataforma:</span>
                <span className="text-gray-500">{"$ 0"}</span>
              </div>
              <div className="border-t border-dashed border-gray-300 pt-2 flex justify-between font-bold text-gray-900">
                <span>Subtotal:</span>
                <span>{formatCOP(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

