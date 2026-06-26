"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserCircle, LogOut, Package, MapPin, Heart } from "lucide-react";

import MisPedidos from "@/components/profile/MisPedidos";
import Direcciones from "@/components/profile/Direcciones";
import DetallesCuenta from "@/components/profile/DetallesCuenta";
import ListaDeseos from "@/components/profile/ListaDeseos";

export default function PerfilPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("inicio");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#fb7701]"></div>
      </div>
    );
  }

  if (!session) return null;

  const renderContent = () => {
    switch (activeTab) {
      case "pedidos": return <MisPedidos />;
      case "direcciones": return <Direcciones />;
      case "detalles": return <DetallesCuenta />;
      case "deseos": return <ListaDeseos />;
      default: return null;
    }
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Mi Cuenta</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar / Info básica */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <UserCircle className="w-16 h-16 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">{session.user?.name || "Usuario"}</h2>
                <p className="text-sm text-gray-500 mb-6">{session.user?.email || "Sin correo"}</p>
                
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            </div>

            {/* Menú vertical en desktop */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hidden md:block">
              <button onClick={() => setActiveTab("inicio")} className={`w-full text-left px-4 py-3 font-medium text-sm border-b transition-colors ${activeTab === 'inicio' ? 'bg-gray-50 text-[#fb7701] border-l-4 border-l-[#fb7701]' : 'text-gray-700 hover:bg-gray-50 border-l-4 border-l-transparent'}`}>Panel de Control</button>
              <button onClick={() => setActiveTab("pedidos")} className={`w-full text-left px-4 py-3 font-medium text-sm border-b transition-colors ${activeTab === 'pedidos' ? 'bg-gray-50 text-[#fb7701] border-l-4 border-l-[#fb7701]' : 'text-gray-700 hover:bg-gray-50 border-l-4 border-l-transparent'}`}>Mis Pedidos</button>
              <button onClick={() => setActiveTab("direcciones")} className={`w-full text-left px-4 py-3 font-medium text-sm border-b transition-colors ${activeTab === 'direcciones' ? 'bg-gray-50 text-[#fb7701] border-l-4 border-l-[#fb7701]' : 'text-gray-700 hover:bg-gray-50 border-l-4 border-l-transparent'}`}>Direcciones</button>
              <button onClick={() => setActiveTab("detalles")} className={`w-full text-left px-4 py-3 font-medium text-sm border-b transition-colors ${activeTab === 'detalles' ? 'bg-gray-50 text-[#fb7701] border-l-4 border-l-[#fb7701]' : 'text-gray-700 hover:bg-gray-50 border-l-4 border-l-transparent'}`}>Detalles de cuenta</button>
              <button onClick={() => setActiveTab("deseos")} className={`w-full text-left px-4 py-3 font-medium text-sm transition-colors ${activeTab === 'deseos' ? 'bg-gray-50 text-[#fb7701] border-l-4 border-l-[#fb7701]' : 'text-gray-700 hover:bg-gray-50 border-l-4 border-l-transparent'}`}>Lista de Deseos</button>
            </div>
          </div>
          
          {/* Main Content / Opciones */}
          <div className="md:col-span-2 space-y-6">
            
            {activeTab === "inicio" ? (
              <>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Panel de Control</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div onClick={() => setActiveTab("pedidos")} className="p-4 border border-gray-100 rounded-xl hover:border-[#fb7701] hover:shadow-md transition-all cursor-pointer group">
                      <div className="bg-gray-50 group-hover:bg-[#fb7701]/10 w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors">
                        <Package className="w-5 h-5 text-gray-600 group-hover:text-[#fb7701]" />
                      </div>
                      <h4 className="font-bold text-gray-800">Mis Pedidos</h4>
                      <p className="text-xs text-gray-500 mt-1">Rastrea y administra tus compras.</p>
                    </div>
                    
                    <div onClick={() => setActiveTab("direcciones")} className="p-4 border border-gray-100 rounded-xl hover:border-[#fb7701] hover:shadow-md transition-all cursor-pointer group">
                      <div className="bg-gray-50 group-hover:bg-[#fb7701]/10 w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors">
                        <MapPin className="w-5 h-5 text-gray-600 group-hover:text-[#fb7701]" />
                      </div>
                      <h4 className="font-bold text-gray-800">Direcciones</h4>
                      <p className="text-xs text-gray-500 mt-1">Gestiona tus direcciones de envío.</p>
                    </div>
                    
                    <div onClick={() => setActiveTab("detalles")} className="p-4 border border-gray-100 rounded-xl hover:border-[#fb7701] hover:shadow-md transition-all cursor-pointer group">
                      <div className="bg-gray-50 group-hover:bg-[#fb7701]/10 w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors">
                        <UserCircle className="w-5 h-5 text-gray-600 group-hover:text-[#fb7701]" />
                      </div>
                      <h4 className="font-bold text-gray-800">Detalles de la cuenta</h4>
                      <p className="text-xs text-gray-500 mt-1">Actualiza tu información personal.</p>
                    </div>
                    
                    <div onClick={() => setActiveTab("deseos")} className="p-4 border border-gray-100 rounded-xl hover:border-[#fb7701] hover:shadow-md transition-all cursor-pointer group">
                      <div className="bg-gray-50 group-hover:bg-[#fb7701]/10 w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors">
                        <Heart className="w-5 h-5 text-gray-600 group-hover:text-[#fb7701]" />
                      </div>
                      <h4 className="font-bold text-gray-800">Lista de Deseos</h4>
                      <p className="text-xs text-gray-500 mt-1">Productos que te han gustado.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#fff3eb] p-6 rounded-2xl border border-[#fb7701]/20">
                  <h3 className="text-lg font-bold text-[#fb7701] mb-2">¡Hola, {session.user?.name?.split(' ')[0] || "amigo"}!</h3>
                  <p className="text-sm text-gray-700">
                    Desde el panel de control de tu cuenta puedes ver tus pedidos recientes, gestionar tus direcciones de envío y facturación, y editar tu información personal. Selecciona una opción para comenzar.
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <button onClick={() => setActiveTab("inicio")} className="text-[#fb7701] text-sm font-bold hover:underline mb-6 inline-block md:hidden">
                  &larr; Volver al Panel
                </button>
                {renderContent()}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
