"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/admin/StatCard";
import { DollarSign, ShoppingBag, Package, Users } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">Resumen general de tu tienda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Ventas Totales (Mes)" 
          value={`$${Number(stats?.totalSales || 0).toLocaleString('es-CO')}`} 
          icon={<DollarSign className="w-6 h-6" />} 
        />
        <StatCard 
          title="Pedidos" 
          value={stats?.totalOrders || 0} 
          icon={<ShoppingBag className="w-6 h-6" />} 
        />
        <StatCard 
          title="Productos" 
          value={stats?.totalProducts || 0} 
          icon={<Package className="w-6 h-6" />} 
        />
        <StatCard 
          title="Clientes" 
          value={stats?.totalCustomers || 0} 
          icon={<Users className="w-6 h-6" />} 
        />
      </div>
    </div>
  );
}
