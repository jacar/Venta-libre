import Link from "next/link";
import { api } from "@/lib/woocommerce";

export default async function Footer() {
  let categories: any[] = [];
  try {
    const response = await api.get("products/categories", { hide_empty: false });
    // Filtrar "sin-categorizar" y tomar las 3 primeras
    categories = response.data.filter((c: any) => c.slug !== "sin-categorizar" && c.slug !== "uncategorized").slice(0, 3);
  } catch (error) {
    console.error(error);
  }

  return (
    <footer className="bg-white border-t border-gray-200 mt-20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="md:col-span-1">
            <Link href="/" className="block mb-4">
              <img src="https://www.ventalibre.top/wp-content/uploads/2026/06/webcincodev-160-x-40-px.svg" alt="Venta Libre" className="h-10" />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Elevando tu estilo con la mejor selección de moda contemporánea. Calidad y diseño sin compromisos.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Tienda</h3>
            <ul className="space-y-3">
              <li><Link href="/#catalogo" className="text-gray-500 hover:text-[#fb7701] text-sm transition-colors">Novedades</Link></li>
              {categories.map((cat: any) => (
                <li key={cat.id}>
                  <Link href={`/categoria/${cat.slug}`} className="text-gray-500 hover:text-[#fb7701] text-sm transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Soporte</h3>
            <ul className="space-y-3">
              <li><Link href="/politicas" className="text-gray-500 hover:text-[#fb7701] text-sm transition-colors">FAQ</Link></li>
              <li><Link href="/politicas" className="text-gray-500 hover:text-[#fb7701] text-sm transition-colors">Envíos y Devoluciones</Link></li>
              <li><Link href="/politicas" className="text-gray-500 hover:text-[#fb7701] text-sm transition-colors">Guía de Tallas</Link></li>
              <li><Link href="/politicas" className="text-gray-500 hover:text-[#fb7701] text-sm transition-colors">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Newsletter</h3>
            <p className="text-gray-500 text-sm mb-4">Suscríbete para recibir un 10% de descuento en tu primera compra.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Tu email..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-l-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-sm"
              />
              <button className="bg-black text-white px-4 py-2 rounded-r-lg font-bold hover:bg-gray-800 transition-colors text-sm">
                Unirse
              </button>
            </form>
          </div>

        </div>
        
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Venta Libre. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6">
            <Link href="https://instagram.com" target="_blank" className="text-gray-400 hover:text-[#fb7701] transition-colors">Instagram</Link>
            <Link href="https://twitter.com" target="_blank" className="text-gray-400 hover:text-[#fb7701] transition-colors">Twitter</Link>
            <Link href="https://facebook.com" target="_blank" className="text-gray-400 hover:text-[#fb7701] transition-colors">Facebook</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
