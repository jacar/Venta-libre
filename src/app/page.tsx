import Hero from "@/components/Hero";
import HomeHeroSlider from "@/components/HomeHeroSlider";
import AutoCarousel from "@/components/AutoCarousel";
import { getCachedCategories, getCachedProducts } from "@/lib/data";
import Link from "next/link";
import { ShoppingCart, Shirt, Baby, Home as HomeIcon, Smartphone, Sparkles, Dumbbell, Dog, Gem, Briefcase, Trees, Car, Package, ShieldCheck, Truck, Wallet, Wrench } from "lucide-react";
import React from "react";
import Image from "next/image";
import EmergencyBanner from "@/components/EmergencyBanner";
import { formatCOP } from "@/lib/formatPrice";

// Forzar revalidación cada 60 segundos para evitar saturar la API (Performance Guardian Skill)
export const revalidate = 60;

// Función para simular el "precio anterior" y mostrar un gran descuento visual
const generateFakeOriginalPrice = (price: string, id: number): number | null => {
  const current = parseFloat(price);
  if (isNaN(current)) return null;
  // Aumenta el precio original entre un 30% y un 70% usando el ID para pseudo-aleatoriedad consistente
  const multiplier = 1 + ((id % 40) / 100 + 0.3);
  return Math.round(current * multiplier);
};

// Función de ayuda para asignar Iconos Lucide a categorías (o Emojis si faltan)
const getCategoryIcon = (slug: string) => {
  const slugLower = slug.toLowerCase();
  
  if (slugLower.includes('mujer') || slugLower.includes('dama')) return <Shirt className="w-6 h-6 text-pink-500" />;
  if (slugLower.includes('hombre') || slugLower.includes('caballero')) return <Shirt className="w-6 h-6 text-blue-600" />;
  if (slugLower.includes('nino') || slugLower.includes('niño') || slugLower.includes('bebe')) return <Baby className="w-6 h-6 text-yellow-500" />;
  if (slugLower.includes('hogar') || slugLower.includes('casa')) return <HomeIcon className="w-6 h-6 text-orange-500" />;
  if (slugLower.includes('cocina')) return <span className="text-2xl">🍳</span>;
  if (slugLower.includes('electronica') || slugLower.includes('tecno')) return <Smartphone className="w-6 h-6 text-gray-700" />;
  if (slugLower.includes('belleza') || slugLower.includes('salud')) return <Sparkles className="w-6 h-6 text-rose-400" />;
  if (slugLower.includes('deporte') || slugLower.includes('fitness')) return <Dumbbell className="w-6 h-6 text-green-600" />;
  if (slugLower.includes('mascota') || slugLower.includes('perro') || slugLower.includes('gato')) return <Dog className="w-6 h-6 text-amber-700" />;
  if (slugLower.includes('joya') || slugLower.includes('reloj') || slugLower.includes('accesorio')) return <Gem className="w-6 h-6 text-teal-500" />;
  if (slugLower.includes('oficina') || slugLower.includes('trabajo')) return <Briefcase className="w-6 h-6 text-slate-600" />;
  if (slugLower.includes('jardin') || slugLower.includes('exterior')) return <Trees className="w-6 h-6 text-emerald-600" />;
  if (slugLower.includes('moto')) return <span className="text-2xl">🏍️</span>;
  if (slugLower.includes('auto') || slugLower.includes('vehiculo')) return <Car className="w-6 h-6 text-red-600" />;
  if (slugLower.includes('herramienta')) return <Wrench className="w-6 h-6 text-gray-500" />;
  
  // Emoji como fallback para los que faltan
  return <span className="text-2xl">📦</span>;
};

async function getProducts() {
  try {
    return await getCachedProducts({
      per_page: 20, // Traer más productos para el nuevo carrusel
      status: "publish"
    });
  } catch (error) {
    console.error("[Home] Error al obtener productos:", error);
    return [];
  }
}

// Nueva función para obtener todas las categorías y sus propios productos individualmente
async function getCategoriesData() {
  try {
    const allCategories = await getCachedCategories();
    
    // Obtener productos por cada categoría en paralelo (máximo 6 productos por sección)
    const categoriesWithProducts = await Promise.all(
      allCategories.map(async (cat: any) => {
        try {
          const products = await getCachedProducts({
            category: cat.id,
            per_page: 6,
            status: "publish"
          });
          return { ...cat, products };
        } catch (e) {
          return { ...cat, products: [] };
        }
      })
    );
    // Obtener productos para una categoría "virtual" de Herramientas
    let herramientasProducts = [];
    try {
      herramientasProducts = await getCachedProducts({
        search: "herramienta",
        per_page: 6,
        status: "publish"
      });
    } catch (e) {
      console.log("Error fetching herramientas", e);
    }

    // Solo retornar en secciones las categorías que realmente tengan productos publicados
    const filledCategories = categoriesWithProducts.filter((c: any) => c.products.length > 0);
    
    // Insertar "Herramientas" virtual después de "Para la Casa" u "Hogar"
    if (herramientasProducts.length > 0) {
      const herramientasCategory = {
        id: "virtual-herramientas",
        name: "Herramientas",
        slug: "herramientas",
        products: herramientasProducts
      };
      
      const hogarIndex = filledCategories.findIndex((c: any) => c.slug === "para-la-casa" || c.name.toLowerCase().includes("hogar"));
      
      if (hogarIndex !== -1) {
        filledCategories.splice(hogarIndex + 1, 0, herramientasCategory);
        allCategories.splice(hogarIndex + 1, 0, herramientasCategory);
      } else {
        filledCategories.push(herramientasCategory);
        allCategories.push(herramientasCategory);
      }
    }
    
    return { allCategories, categoriesWithProducts: filledCategories };
  } catch (error) {
    return { allCategories: [], categoriesWithProducts: [] };
  }
}

export default async function Home() {
  // Obtener los productos más recientes (hasta 20)
  const latestProducts = await getProducts();
  const heroProducts = latestProducts.slice(0, 5);
  
  // Datos completos de categorías
  const { allCategories, categoriesWithProducts } = await getCategoriesData();
  
  const hasCategories = categoriesWithProducts.length > 0;

  // Producto destacado aleatorio
  const randomFeaturedProduct = latestProducts.length > 0 
    ? latestProducts[Math.floor(Math.random() * latestProducts.length)] 
    : null;

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-20">
      <EmergencyBanner />
      <HomeHeroSlider />
      <Hero latestProducts={heroProducts} />
      
      {/* BANNER DE CONFIANZA: PAGO CONTRA ENTREGA */}
      <div className="w-full bg-[#f5f5f5] pt-6 pb-2">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gray-900 border border-gray-800">
            {/* Imagen de fondo generada */}
            <div className="absolute inset-0 opacity-40 mix-blend-overlay">
              <Image 
                src="/trust-banner.png" 
                alt="Pago Contra Entrega Seguro" 
                fill
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
            {/* Contenido */}
            <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-[#fb7701] text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase mb-4 shadow-lg">
                  <ShieldCheck className="w-4 h-4" />
                  Compra 100% Segura
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                  No pierdas dinero. <br className="hidden md:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fb7701] to-yellow-400">Pagas cuando recibes.</span>
                </h2>
                <p className="text-gray-300 text-base md:text-lg max-w-xl leading-relaxed">
                  Disfruta de la tranquilidad de inspeccionar tu pedido en la puerta de tu casa antes de pagarlo. Sin tarjetas, sin riesgos, solo satisfacción garantizada.
                </p>
              </div>
              <div className="w-full md:w-auto">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col gap-5 text-white shadow-2xl">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#fb7701] p-3 rounded-xl shadow-inner">
                      <Truck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg leading-tight">Envío Rápido</h4>
                      <p className="text-sm text-gray-300">A todo el país</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-[#fb7701] p-3 rounded-xl shadow-inner">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg leading-tight">Pago en Casa</h4>
                      <p className="text-sm text-gray-300">Efectivo al recibir</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Categorías con Iconos */}
      <div className="bg-white py-4 mt-2 mb-2 border-y border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4">
          <h2 className="text-gray-800 font-bold mb-3">Explorar categorías</h2>
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-hide snap-x">
            {allCategories.map((cat: any) => (
              <Link 
                key={cat.id} 
                href={`/categoria/${cat.slug}`}
                className="flex flex-col items-center gap-2 min-w-[70px] snap-center hover:opacity-80 transition-opacity"
              >
                <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center shadow-sm border border-gray-100 hover:border-[#fb7701] hover:bg-[#fff3eb] transition-all">
                  {getCategoryIcon(cat.slug)}
                </div>
                <span className="text-[11px] text-gray-700 font-medium text-center line-clamp-2 leading-tight">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Carrusel de Súper Ofertas (Todos los productos) Autoplay */}
      {latestProducts.length > 0 && <AutoCarousel products={latestProducts} />}

      {/* SECCIÓN DE PRODUCTO DESTACADO */}
      {randomFeaturedProduct && (
        <div className="max-w-[1400px] mx-auto px-4 my-8">
          <div className="bg-gradient-to-r from-gray-900 to-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row items-center border border-gray-800">
            <div className="w-full md:w-1/2 relative aspect-[4/3] md:aspect-auto md:h-[400px] bg-white">
              {randomFeaturedProduct.images?.[0] ? (
                <Image 
                  src={randomFeaturedProduct.images[0].src || "https://admin.ventalibre.top/wp-content/uploads/woocommerce-placeholder.png"} 
                  alt={randomFeaturedProduct.name} 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover mix-blend-multiply p-8 hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
              )}
              {/* Etiqueta flotante */}
              <div className="absolute top-4 left-4 bg-[#fb7701] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Producto Estrella
              </div>
            </div>
            
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                {randomFeaturedProduct.name}
              </h2>
              <div className="flex items-end gap-3 mb-6">
                <span className="text-4xl md:text-5xl font-black text-[#fb7701]">
                  {formatCOP(randomFeaturedProduct.price)}
                </span>
                {randomFeaturedProduct.regular_price && randomFeaturedProduct.regular_price !== randomFeaturedProduct.price && (
                  <span className="text-xl text-gray-400 line-through mb-1">
                    {formatCOP(randomFeaturedProduct.regular_price)}
                  </span>
                )}
              </div>
              <div className="text-gray-300 mb-8 line-clamp-3 text-sm md:text-base leading-relaxed" 
                 dangerouslySetInnerHTML={{ __html: randomFeaturedProduct.short_description || 'No te pierdas nuestra recomendación estrella del día. Calidad premium al mejor precio.' }}>
              </div>
              
              <Link 
                href={`/product/${randomFeaturedProduct.id}`}
                className="inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-[#fb7701] hover:text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 w-full sm:w-auto shadow-lg hover:shadow-[0_0_20px_rgba(251,119,1,0.4)]"
              >
                Comprar Ahora
                <ShoppingCart className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <div id="catalogo" className="max-w-[1400px] mx-auto px-2 sm:px-4">
        
        {!hasCategories && latestProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Actualizando Catálogo</h2>
            <p className="text-gray-500 max-w-md mb-8">
              Estamos sincronizando nuestros últimos productos. Si ves este mensaje por error, por favor recarga la página.
            </p>
            <a 
              href="/" 
              className="bg-[#fb7701] text-white px-8 py-3 rounded-full font-bold hover:bg-[#e52e04] transition-colors shadow-lg"
            >
              Recargar Página
            </a>
          </div>
        ) : hasCategories ? (
          categoriesWithProducts.map((cat: any) => (
            <div key={cat.id} className="mb-8">
              <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between rounded-t-lg shadow-sm">
                <h2 className="text-gray-900 font-black text-xl tracking-tighter flex items-center gap-2 uppercase">
                   {cat.name}
                </h2>
                <Link href={`/categoria/${cat.slug}`} className="text-xs text-[#fb7701] font-bold hover:underline">
                  Ver todo
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 bg-white p-2 sm:p-3 shadow-sm rounded-b-lg">
                {cat.products.slice(0, 6).map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="mb-8">
            <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between rounded-t-lg shadow-sm">
              <h2 className="text-[#e52e04] font-black text-xl italic tracking-tighter flex items-center gap-2">
                 RECOMENDADOS PARA TI
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 bg-white p-2 sm:p-3 shadow-sm rounded-b-lg">
              {latestProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Subcomponente para reutilizar la tarjeta
function ProductCard({ product }: { product: any }) {
  const currentPrice = product.price || "0";
  const oldPrice = product.regular_price || generateFakeOriginalPrice(currentPrice, product.id);
  
  return (
    <div className="group flex flex-col bg-white hover:shadow-[0_0_10px_rgba(0,0,0,0.15)] transition-shadow border border-transparent hover:border-gray-200 relative overflow-hidden rounded">
      
      {/* Etiqueta de escasez/venta */}
      <div className="absolute top-0 left-0 bg-[#e52e04] text-white text-[10px] font-bold px-2 py-0.5 z-10 rounded-br-lg">
        Top Ventas
      </div>

      <Link href={`/product/${product.id}`} className="block relative overflow-hidden bg-gray-50 aspect-square">
        {product.images && product.images[0] ? (
          <Image 
            src={product.images[0].src || "https://admin.ventalibre.top/wp-content/uploads/woocommerce-placeholder.png"} 
            alt={product.name} 
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            Sin foto
          </div>
        )}
      </Link>
      
      <div className="p-2 sm:p-3 flex flex-col flex-grow">
        <Link href={`/product/${product.id}`} className="hover:underline">
          <h3 className="text-gray-800 text-[11px] sm:text-xs leading-tight line-clamp-2 mb-1">{product.name}</h3>
        </Link>
        
        <div className="mt-auto pt-1">
          <div className="flex items-baseline gap-1 flex-wrap">
            <span className="font-black text-[#e52e04] text-lg sm:text-xl leading-none">
              {formatCOP(currentPrice)}
            </span>
            {oldPrice && oldPrice !== currentPrice && (
              <span className="text-gray-400 text-[10px] sm:text-[11px] line-through">
                {formatCOP(oldPrice)}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[10px] text-gray-500 font-medium">+10K vendidos</span>
            
            <Link 
              href={`/product/${product.id}`} 
              className="bg-black text-white p-1.5 rounded-full hover:bg-[#fb7701] transition-colors"
              title="Ver y comprar"
            >
              <ShoppingCart className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
