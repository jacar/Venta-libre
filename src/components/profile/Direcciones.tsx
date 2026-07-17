"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function Direcciones() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  
  const [billing, setBilling] = useState({
    first_name: "", last_name: "", address_1: "", city: "", state: "", postcode: "", country: "CO", phone: ""
  });
  
  const [shipping, setShipping] = useState({
    first_name: "", last_name: "", address_1: "", city: "", state: "", postcode: "", country: "CO"
  });

  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          if (data.profile.billing) setBilling({ ...billing, ...data.profile.billing });
          if (data.profile.shipping) setShipping({ ...shipping, ...data.profile.shipping });
        }
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        body: JSON.stringify({ billing, shipping }),
      });
      if (res.ok) {
        setMessage("Direcciones actualizadas correctamente.");
      } else {
        setMessage("Error al actualizar direcciones.");
      }
    } catch {
      setMessage("Error de conexión.");
    }
    setSaving(false);
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => setBilling({ ...billing, [e.target.name]: e.target.value });
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => setShipping({ ...shipping, [e.target.name]: e.target.value });

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-[#fb7701]" /></div>;

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-6">Mis Direcciones</h3>
      {message && <div className="p-3 mb-4 bg-green-50 text-green-700 rounded-lg">{message}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Billing */}
        <div>
          <h4 className="font-bold text-gray-800 mb-4 pb-2 border-b">Dirección de Facturación</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="first_name" placeholder="Nombre" value={billing.first_name} onChange={handleBillingChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <input name="last_name" placeholder="Apellido" value={billing.last_name} onChange={handleBillingChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <input name="address_1" placeholder="Dirección (Calle, #)" value={billing.address_1} onChange={handleBillingChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:col-span-2" />
            <input name="city" placeholder="Ciudad" value={billing.city} onChange={handleBillingChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <input name="phone" placeholder="Teléfono" value={billing.phone} onChange={handleBillingChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
        </div>

        {/* Shipping */}
        <div>
          <h4 className="font-bold text-gray-800 mb-4 pb-2 border-b">Dirección de Envío</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="first_name" placeholder="Nombre" value={shipping.first_name} onChange={handleShippingChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <input name="last_name" placeholder="Apellido" value={shipping.last_name} onChange={handleShippingChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <input name="address_1" placeholder="Dirección de Envío" value={shipping.address_1} onChange={handleShippingChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:col-span-2" />
            <input name="city" placeholder="Ciudad" value={shipping.city} onChange={handleShippingChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto py-2 px-8 bg-black text-white font-bold rounded-lg hover:bg-[#fb7701] transition-colors disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar Direcciones"}
        </button>
      </form>
    </div>
  );
}
