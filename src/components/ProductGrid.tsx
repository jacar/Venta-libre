import { api } from "../lib/woocommerce";
import Link from "next/link";
import WishlistButton from "./WishlistButton";

async function getProducts() {
  try {
    const response = await api.get("products", {
      per_page: 10,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function ProductGrid() {
  const products = await getProducts();

  if (!products || products.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No se encontraron productos en la tienda o no se pudo conectar.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product: any) => (
        <div key={product.id} className="relative border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col bg-white">
          <WishlistButton product={{
            id: product.id,
            name: product.name,
            price: product.price || "0",
            image: product.images && product.images[0] ? product.images[0].src : "",
            slug: product.slug
          }} />
          <Link href={`/product/${product.id}`} className="block">
            {product.images && product.images[0] ? (
              <img 
                src={product.images[0].src} 
                alt={product.name} 
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400">
                Sin imagen
              </div>
            )}
          </Link>
          <div className="p-4 flex flex-col flex-grow">
            <Link href={`/product/${product.id}`} className="hover:text-blue-600 transition-colors">
              <h3 className="font-semibold text-lg mb-1 line-clamp-2">{product.name}</h3>
            </Link>
            <div className="mt-auto pt-4 flex items-center justify-between">
              <p className="text-gray-900 font-bold text-lg" dangerouslySetInnerHTML={{ __html: product.price_html }}></p>
              <Link 
                href={`/product/${product.id}`}
                className="bg-black text-white px-4 py-2 rounded font-medium hover:bg-gray-800 transition-colors text-sm"
              >
                Ver más
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
