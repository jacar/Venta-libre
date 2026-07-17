export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#f5f5f5] z-50 flex flex-col items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-[#fb7701] rounded-full animate-spin mb-4 shadow-sm"></div>
      <div className="text-xl font-black text-gray-900 tracking-tight animate-pulse flex items-center">
        VENTA<span className="text-[#fb7701]">LIBRE</span>
      </div>
      <p className="text-sm font-bold text-gray-500 mt-2">Cargando las mejores ofertas...</p>
    </div>
  );
}
