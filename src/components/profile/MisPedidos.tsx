"use client";

import { useEffect, useState } from "react";
import { Loader2, PackageOpen } from "lucide-react";

export default function MisPedidos() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/user/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setOrders(data.orders || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Error de conexión");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-[#fb7701]" /></div>;
  
  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>;

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
        <PackageOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-900">Aún no tienes pedidos</h3>
        <p className="text-sm text-gray-500">Cuando realices una compra, aparecerá aquí.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Historial de Pedidos</h3>
      {orders.map((order) => (
        <div key={order.id} className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pedido #{order.id}</span>
            <p className="font-medium text-gray-900 mt-1">{new Date(order.date_created).toLocaleDateString()}</p>
            <p className="text-sm text-gray-600 mt-1">{order.line_items?.length || 0} artículo(s)</p>
          </div>
          <div className="flex flex-col sm:items-end gap-2">
            <span className="font-bold text-[#e52e04]">${order.total}</span>
            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
              order.status === 'completed' ? 'bg-green-100 text-green-700' :
              order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {order.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
