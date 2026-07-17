"use client";

import { useEffect, useState } from "react";
import { Eye, Edit, CheckCircle } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
      }
    } catch (error) {
      console.error("Error al actualizar pedido", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'on-hold': return 'bg-amber-100 text-amber-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusTranslation = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'processing': return 'Procesando';
      case 'on-hold': return 'En espera';
      case 'cancelled': return 'Cancelado';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Pedidos</h1>
        <p className="text-gray-500 mt-2">Revisa y administra las compras de tus clientes.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm font-medium border-b border-gray-200">
                <th className="p-4">Pedido ID</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Fecha</th>
                <th className="p-4">Total</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No hay pedidos recientes.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">#{order.id}</td>
                    <td className="p-4">
                      <div className="text-gray-900">{order.billing.first_name} {order.billing.last_name}</div>
                      <div className="text-sm text-gray-500">{order.billing.email}</div>
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(order.date_created).toLocaleDateString('es-ES')}
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      ${Number(order.total).toLocaleString('es-CO')}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                        {getStatusTranslation(order.status)}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <select 
                        className="text-sm border border-gray-300 rounded-md py-1 px-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      >
                        <option value="pending">Pendiente</option>
                        <option value="processing">Procesando</option>
                        <option value="on-hold">En Espera</option>
                        <option value="completed">Completado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
