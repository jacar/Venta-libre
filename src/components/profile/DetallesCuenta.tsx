"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function DetallesCuenta() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
  });

  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          setFormData({
            first_name: data.profile.first_name || "",
            last_name: data.profile.last_name || "",
          });
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
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setMessage("Cuenta actualizada correctamente.");
      } else {
        setMessage("Error al actualizar la cuenta.");
      }
    } catch {
      setMessage("Error de conexión.");
    }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-[#fb7701]" /></div>;

  return (
    <div className="max-w-md">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Detalles de la Cuenta</h3>
      {message && <div className="p-3 mb-4 bg-green-50 text-green-700 rounded-lg">{message}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            required
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fb7701]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
          <input
            type="text"
            required
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fb7701]"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full py-2 px-4 bg-black text-white font-bold rounded-lg hover:bg-[#fb7701] transition-colors disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
}
