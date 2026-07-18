import { api } from "@/lib/woocommerce";
import Link from "next/link";
import { formatCOP } from "@/lib/formatPrice";
import { Truck, ShieldCheck, Lock, Headphones, Mail, Tag, Gift } from "lucide-react";
import React from "react";
import Image from "next/image";
import LooksDestacados from "@/components/LooksDestacados";
import AdsBanner from "@/components/AdsBanner";
import OutletHeroSlider from "@/components/OutletHeroSlider";
import SplitProductGallery from "@/components/SplitProductGallery";
import ElegantProductGrid from "@/components/ElegantProductGrid";
import SportsProductGrid from "@/components/SportsProductGrid";

export const revalidate = 60;

async function getOutletData() {
  try {
    const response = await api.get("products/categories", { hide_empty: false });
    const allCategories = Array.isArray(response.data) ? response.data : [];
    
    let outletParent = allCategories.find((c: any) => c.slug.toLowerCase() === "outlet");
    let targetCategories = [];

    if (outletParent) {
      const children = allCategories.filter((c: any) => c.parent === outletParent.id);
      if (children.length > 0) {
        targetCategories = children;
      } else {
        targetCategories = [outletParent];
      }
    } else {
      targetCategories = allCategories.filter((c: any) => 
        c.slug.toLowerCase().includes("outlet") || 
        c.name.toLowerCase().includes("outlet")
      );
    }

    // Categorías destacadas: Moda, Ropa y Accesorios (Llamadas directamente desde WordPress)
    const featuredCategories = allCategories.filter((c: any) => {
        const name = c.name.toLowerCase();
        const slug = c.slug.toLowerCase();
        return name.includes("moda") || name.includes("ropa") || name.includes("accesorio") || 
               slug.includes("moda") || slug.includes("ropa") || slug.includes("accesorio");
    }).slice(0, 6);

    // Set para evitar productos duplicados en toda la página
    const seenIds = new Set();

    // Get products for the featured category (Moda, ropa y accesorios)
    const featuredCatIds = featuredCategories.map((c: any) => c.id).join(",");
    let featuredProducts = [];
    if (featuredCatIds) {
        const featProdResponse = await api.get("products", {
            category: featuredCatIds,
            per_page: 50,
            status: "publish",
            orderby: "date",
            order: "desc"
        });
        featuredProducts = Array.isArray(featProdResponse.data) ? featProdResponse.data : [];
    }

    // Get products for "CALZADOS REPLICAS AAA"
    const calzadoCategories = allCategories.filter((c: any) => {
        const name = c.name.toLowerCase();
        const slug = c.slug.toLowerCase();
        return name.includes("calzado") || name.includes("tenis") || name.includes("zapato") || slug.includes("calzado") || slug.includes("tenis") || slug.includes("zapato");
    });
    
    const categoryIds = calzadoCategories.length > 0 ? calzadoCategories.map((c: any) => c.id).join(",") : targetCategories.map((c: any) => c.id).join(",");
    let allProducts = [];
    if (categoryIds) {
        const prodResponse = await api.get("products", {
            category: categoryIds,
            per_page: 100, // Fetch all possible footwear
            status: "publish",
            orderby: "date",
            order: "desc"
        });
        let fetchedProducts = Array.isArray(prodResponse.data) ? prodResponse.data : [];
        
        // Remove products that are already shown in the featured category to prevent duplicates
        featuredProducts.forEach((p: any) => seenIds.add(p.id));
        allProducts = fetchedProducts.filter((p: any) => {
            if (seenIds.has(p.id)) return false;
            // Ensure it's footwear if we had to fallback to targetCategories
            if (calzadoCategories.length === 0) {
                const name = p.name.toLowerCase();
                return name.includes("tenis") || name.includes("calzado") || name.includes("zapato") || name.includes("bota");
            }
            return true;
        });
    }

    // Get products for "Cat"
    let catProducts = [];
    const catCategories = allCategories.filter((c: any) => c.name.toLowerCase() === "cat" || c.name.toLowerCase() === "bota cat" || c.name.toLowerCase().includes("cat "));
    
    // First try by explicit category, otherwise fallback to text search
    if (catCategories.length > 0) {
        const catCatIds = catCategories.map((c: any) => c.id).join(",");
        const catResponse = await api.get("products", {
            category: catCatIds,
            per_page: 50,
            status: "publish",
            orderby: "date",
            order: "desc"
        });
        catProducts = Array.isArray(catResponse.data) ? catResponse.data : [];
    } else {
        const catResponse = await api.get("products", {
            search: "cat",
            per_page: 50,
            status: "publish"
        });
        catProducts = Array.isArray(catResponse.data) ? catResponse.data : [];
    }

    // Filtrar los que ya se mostraron en secciones destacadas (pero NO allProducts para no vaciar estas galerías)
    catProducts = catProducts.filter((p: any) => {
        if (seenIds.has(p.id)) return false;
        seenIds.add(p.id);
        return true;
    });

    // Get products for "Deportivos" y "Deportes"
    // IDs exactos de WooCommerce: 52=Deportes (11 products), 75=Deportivos (4 products)
    let deportivosProducts = [];
    try {
        const depResponse = await api.get("products", {
            category: "75", // Deportivos (ID 75) — calzado deportivo/atlético
            per_page: 12,
            status: "publish",
            orderby: "date",
            order: "desc"
        });
        let rawDeportivos = Array.isArray(depResponse.data) ? depResponse.data : [];
        deportivosProducts = rawDeportivos.filter((p: any) => {
            if (seenIds.has(p.id)) return false;
            seenIds.add(p.id);
            return true;
        });
    } catch (e) {
        console.error("Error fetching deportivos:", e);
    }

    // Get products for "Cool"
    let coolProducts = [];
    try {
        const coolCategories = allCategories.filter((c: any) => c.name.toLowerCase().includes("cool") || c.slug.toLowerCase().includes("cool"));
        
        if (coolCategories.length > 0) {
            const coolCatIds = coolCategories.map((c: any) => c.id).join(",");
            const coolResponse = await api.get("products", {
                category: coolCatIds,
                per_page: 20,
                status: "publish",
                orderby: "date",
                order: "desc"
            });
            let rawCool = Array.isArray(coolResponse.data) ? coolResponse.data : [];
            coolProducts = rawCool.filter((p: any) => {
                if (seenIds.has(p.id)) return false;
                seenIds.add(p.id);
                return true;
            });
        } else {
            const coolResponse = await api.get("products", {
                search: "cool",
                per_page: 20,
                status: "publish"
            });
            let rawCool = Array.isArray(coolResponse.data) ? coolResponse.data : [];
            coolProducts = rawCool.filter((p: any) => {
                if (seenIds.has(p.id)) return false;
                seenIds.add(p.id);
                return true;
            });
        }
    } catch (e) {
        console.error("Error fetching cool products:", e);
    }

    return { categories: featuredCategories, featuredProducts, products: allProducts, catProducts, deportivosProducts, coolProducts };
  } catch (error) {
    console.error("[Outlet] Error al obtener datos:", error);
    return { categories: [], featuredProducts: [], products: [], catProducts: [], deportivosProducts: [], coolProducts: [] };
  }
}

export default async function OutletPage() {
  const { categories, featuredProducts, products, catProducts, deportivosProducts, coolProducts } = await getOutletData();

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 selection:bg-black selection:text-white">
      
      {/* 1. Hero Slider (Estilo VITA) */}
      <OutletHeroSlider backgroundImage="/sli.jpg" />

      {/* 1.5. Sección Elegante de Productos (Carrusel Interactivo) */}
      <LooksDestacados />

      {/* 2. Barra de Beneficios */}
      <section className="border-b border-gray-100">
          <div className="max-w-[1400px] mx-auto py-6 lg:py-10 px-4 lg:px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
                  <div className="flex items-center gap-4">
                      <Truck className="w-8 h-8 text-black shrink-0" strokeWidth={1.5} />
                      <div>
                          <h4 className="font-bold text-sm">Envíos rápidos</h4>
                          <p className="text-gray-500 text-sm">A todo el país</p>
                      </div>
                  </div>
                  <div className="flex items-center gap-4">
                      <ShieldCheck className="w-8 h-8 text-black shrink-0" strokeWidth={1.5} />
                      <div>
                          <h4 className="font-bold text-sm">Calidad garantizada</h4>
                          <p className="text-gray-500 text-sm">Productos 100% originales</p>
                      </div>
                  </div>
                  <div className="flex items-center gap-4">
                      <Lock className="w-8 h-8 text-black shrink-0" strokeWidth={1.5} />
                      <div>
                          <h4 className="font-bold text-sm">Pagos seguros</h4>
                          <p className="text-gray-500 text-sm">Protegemos tu información</p>
                      </div>
                  </div>
                  <div className="flex items-center gap-4">
                      <Headphones className="w-8 h-8 text-black shrink-0" strokeWidth={1.5} />
                      <div>
                          <h4 className="font-bold text-sm">Atención al cliente</h4>
                          <p className="text-gray-500 text-sm">24/7 para ayudarte</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 2.5 Banner de Publicidad (Ads) */}
      <AdsBanner />



      {/* 3.5. Productos de Moda, Ropa y Accesorios */}
      {featuredProducts.length > 0 && (
          <section className="py-8 lg:py-16 px-4 lg:px-6 max-w-[1400px] mx-auto border-t border-gray-100 mt-8">
              <h2 className="text-2xl font-bold text-center mb-12 tracking-wide uppercase">
                  {categories.length === 1 ? categories[0].name : "Moda, Ropa y Accesorios"}
              </h2>
              <SplitProductGallery products={featuredProducts} />
          </section>
      )}

      {/* 4. CALZADOS REPLICAS AAA */}
      {products.length > 0 && (
          <section id="productos" className="py-8 lg:py-16 px-4 lg:px-6 max-w-[1400px] mx-auto">
              <h2 className="text-2xl font-bold text-center mb-12 tracking-wide uppercase">CALZADOS REPLICAS AAA</h2>
              
              <SplitProductGallery products={products} />

              <div className="mt-12 flex justify-center">
                  <Link href="/categoria/outlet" className="bg-black text-white px-8 py-3.5 text-sm font-semibold tracking-wide uppercase hover:bg-gray-800 transition-colors rounded-sm">
                      VER TODOS LOS PRODUCTOS
                  </Link>
              </div>
          </section>
      )}

      {/* 4.5 LOS MÁS BUSCADOS (Banner Grid & Cat Products) */}
      <section className="py-8 lg:py-16 px-4 lg:px-6 max-w-[1400px] mx-auto border-t border-gray-100">
          <h2 className="text-3xl font-bold text-center mb-12 tracking-[0.1em] uppercase">LOS MÁS BUSCADOS</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
              {/* Left Large Banner */}
              <div className="lg:col-span-2 relative aspect-[4/3] lg:aspect-auto lg:h-[600px] rounded-3xl overflow-hidden group shadow-sm hover:shadow-xl transition-shadow duration-500">
                  <Image 
                      src="https://admin.ventalibre.top/wp-content/uploads/2026/07/7390aa4d-52e4-4da0-ae70-03bbc17c87cb.png" 
                      alt="Los Más Buscados" 
                      fill 
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-700"></div>
              </div>
              
              {/* Right Small Banners */}
              <div className="flex flex-col gap-6 lg:h-[600px]">
                  <div className="relative flex-1 rounded-3xl overflow-hidden group min-h-[300px] shadow-sm hover:shadow-xl transition-shadow duration-500">
                      <Image 
                          src="https://admin.ventalibre.top/wp-content/uploads/2026/07/ChatGPT-Image-16-jul-2026-17_59_45.png" 
                          alt="Outdoor Active" 
                          fill 
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          className="object-cover object-bottom group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                      />
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-700"></div>
                  </div>
                  <div className="relative flex-1 rounded-3xl overflow-hidden group min-h-[300px] shadow-sm hover:shadow-xl transition-shadow duration-500">
                      <Image 
                          src="https://admin.ventalibre.top/wp-content/uploads/2026/07/ChatGPT-Image-16-jul-2026-18_13_14.png" 
                          alt="Casual Comfort" 
                          fill 
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          className="object-cover object-bottom group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                      />
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-700"></div>
                  </div>
              </div>
          </div>

          {/* Categoría Cat Products */}
          {catProducts.length > 0 && (
              <div className="mt-8">
                  <h3 className="text-xl font-bold mb-8 uppercase tracking-wide text-gray-800">COLECCIÓN EXCLUSIVA</h3>
                  <ElegantProductGrid products={catProducts} />
              </div>
          )}
      </section>

      {/* NUEVA SECCIÓN: LO MÁS COOL */}
      {coolProducts.length > 0 && (
          <section className="py-12 lg:py-16 px-4 lg:px-6 max-w-[1400px] mx-auto border-t border-gray-100">
              {/* Banner Header Centrado */}
              <div className="relative w-full h-[250px] md:h-[350px] lg:h-[400px] rounded-3xl overflow-hidden mb-12 flex items-center justify-center group shadow-md bg-gray-900">
                  <Image 
                      src="/bannerVentalibre.png" 
                      alt="Lo Más Cool" 
                      fill 
                      sizes="100vw"
                      className="object-cover object-[center_30%] opacity-60 group-hover:scale-105 transition-transform duration-1000"
                  />
                  
                  <div className="relative z-10 text-center px-4 flex flex-col items-center">
                      <span className="text-white/90 text-xs md:text-sm font-bold tracking-[0.3em] uppercase block mb-3 backdrop-blur-sm bg-black/20 px-4 py-1.5 rounded-full border border-white/20">
                          Colección Premium
                      </span>
                      <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-widest uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                          Lo Más Cool
                      </h2>
                  </div>
              </div>
              
              {/* Grid Elegante */}
              <ElegantProductGrid products={coolProducts} />
          </section>
      )}

      {/* 4.7. COLECCIÓN DEPORTIVA (Asymmetric Grid) */}
      {deportivosProducts.length > 0 && (
          <section className="py-8 lg:py-16 px-4 lg:px-6 max-w-[1400px] mx-auto border-t border-gray-100 mt-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                  <div>
                      <span className="text-[#fb7701] text-xs font-black tracking-widest uppercase mb-2 block">Rendimiento y Estilo</span>
                      <h2 className="text-3xl font-black tracking-tight uppercase text-gray-900">Colección Deportiva</h2>
                  </div>
                  <Link href="/categoria/deportivos" className="text-sm font-bold text-[#fb7701] hover:text-black transition-colors mt-2 md:mt-0 flex items-center gap-1">
                      Ver toda la colección deportiva &rarr;
                  </Link>
              </div>
              <SportsProductGrid products={deportivosProducts} />
          </section>
      )}

      {/* 5. Barra de Suscripción (Newsletter) */}
      <section className="bg-[#F9F9F9] border-t border-gray-100 py-12 lg:py-16 px-4 lg:px-6 mt-10">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                  <h3 className="text-2xl font-bold tracking-wide mb-2 uppercase">SUSCRÍBETE Y OBTÉN 10% OFF</h3>
                  <p className="text-gray-600 text-sm mb-6">En tu primera compra</p>
                  
                  <form className="flex w-full max-w-md">
                      <input 
                          type="email" 
                          placeholder="Ingresa tu correo electrónico" 
                          className="flex-1 bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors rounded-l-sm"
                          required
                      />
                      <button 
                          type="submit" 
                          className="bg-black text-white px-6 py-3 text-sm font-bold tracking-wide uppercase hover:bg-gray-800 transition-colors rounded-r-sm"
                      >
                          SUSCRIBIRME
                      </button>
                  </form>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:border-l lg:border-gray-200 lg:pl-12">
                  <div className="flex items-start gap-3">
                      <Tag className="w-5 h-5 text-black shrink-0 mt-0.5" strokeWidth={1.5} />
                      <div>
                          <h4 className="font-bold text-xs uppercase mb-1">Ofertas exclusivas</h4>
                          <p className="text-gray-500 text-xs">Solo para suscriptores</p>
                      </div>
                  </div>
                  <div className="flex items-start gap-3">
                      <Gift className="w-5 h-5 text-black shrink-0 mt-0.5" strokeWidth={1.5} />
                      <div>
                          <h4 className="font-bold text-xs uppercase mb-1">Nuevas colecciones</h4>
                          <p className="text-gray-500 text-xs">Sé el primero en enterarte</p>
                      </div>
                  </div>
                  <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-black shrink-0 mt-0.5" strokeWidth={1.5} />
                      <div>
                          <h4 className="font-bold text-xs uppercase mb-1">Invitaciones especiales</h4>
                          <p className="text-gray-500 text-xs">Eventos y promociones</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

    </div>
  );
}
