"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import ProductModal from "@/components/admin/ProductModal";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const fetchProducts = async (searchQuery = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products?search=${searchQuery}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(search);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error("Error al eliminar", error);
      }
    }
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleSave = async (formData: any) => {
    const method = selectedProduct ? "PUT" : "POST";
    const url = selectedProduct 
      ? `/api/admin/products/${selectedProduct.id}` 
      : "/api/admin/products";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      throw new Error("Failed to save product");
    }

    await fetchProducts(search); // refresh
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Productos</h1>
          <p className="text-gray-500 mt-2">Gestiona el inventario de tu tienda.</p>
        </div>
        <button onClick={handleCreate} className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          <span>Nuevo Producto</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <form onSubmit={handleSearch} className="flex relative max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
            />
          </form>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm font-medium border-b border-gray-200">
                <th className="p-4">Producto</th>
                <th className="p-4">Precio</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No se encontraron productos.</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 flex items-center space-x-3">
                      {product.images && product.images[0] && (
                        <div className="relative w-10 h-10 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                          <Image src={product.images[0].src || "https://admin.ventalibre.top/wp-content/uploads/woocommerce-placeholder.png"} alt={product.name} fill sizes="40px" className="object-cover" />
                        </div>
                      )}
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </td>
                    <td className="p-4 text-gray-600">${Number(product.price || 0).toLocaleString('es-CO')}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock_status === 'instock' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.stock_quantity || (product.stock_status === 'instock' ? 'Disponible' : 'Agotado')}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 capitalize">{product.status}</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleEdit(product)} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        product={selectedProduct}
      />
    </div>
  );
}
