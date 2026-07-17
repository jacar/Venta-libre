"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => Promise<void>;
  product?: any; // If passed, it's edit mode
}

export default function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    regular_price: "",
    stock_quantity: "",
    description: "",
    status: "publish",
    image_url: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        regular_price: product.price || product.regular_price || "",
        stock_quantity: product.stock_quantity?.toString() || "",
        description: product.description?.replace(/<[^>]*>?/gm, '') || "", // Strip HTML
        status: product.status || "publish",
        image_url: product.images?.[0]?.src || "",
      });
    } else {
      setFormData({
        name: "",
        regular_price: "",
        stock_quantity: "",
        description: "",
        status: "publish",
        image_url: "",
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al guardar el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">
            {product ? "Editar Producto" : "Nuevo Producto"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Nombre del Producto *</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Precio (COP) *</label>
              <input 
                type="number" 
                required
                min="0"
                value={formData.regular_price}
                onChange={(e) => setFormData({...formData, regular_price: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Stock (Cantidad)</label>
              <input 
                type="number" 
                min="0"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
                placeholder="Dejar vacío si no se maneja stock"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none bg-white"
              >
                <option value="publish">Publicado</option>
                <option value="draft">Borrador</option>
                <option value="private">Privado</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">URL de Imagen Principal</label>
            <input 
              type="url" 
              value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            {formData.image_url && (
              <div className="mt-2 relative h-32 w-32 rounded-lg overflow-hidden border border-gray-200">
                <Image src={formData.image_url} alt="Preview" fill sizes="128px" className="object-cover" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Descripción Corta</label>
            <textarea 
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none resize-none"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100 mt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center"
            >
              {loading && <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
