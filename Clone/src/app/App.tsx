import { useState } from "react";
import { Search, ShoppingCart, User, ChevronDown, Heart, Star, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, Menu, X, Bell, MapPin } from "lucide-react";

const categories = [
  { name: "Mujer", icon: "👗" },
  { name: "Hombre", icon: "👕" },
  { name: "Niños", icon: "🧸" },
  { name: "Hogar", icon: "🏠" },
  { name: "Electrónica", icon: "📱" },
  { name: "Belleza", icon: "💄" },
  { name: "Deporte", icon: "⚽" },
  { name: "Mascotas", icon: "🐶" },
  { name: "Joyería", icon: "💍" },
  { name: "Oficina", icon: "💼" },
  { name: "Jardín", icon: "🌱" },
  { name: "Autos", icon: "🚗" },
];

const flashDeals = [
  {
    id: 1,
    name: "Auriculares Bluetooth 5.3 con cancelación de ruido activa",
    price: 8.49,
    original: 42.99,
    discount: 80,
    rating: 4.7,
    reviews: 12847,
    sold: "50K+",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&auto=format",
    badge: "Flash",
  },
  {
    id: 2,
    name: "Vestido floral de verano manga larga talla S-3XL",
    price: 5.99,
    original: 29.99,
    discount: 80,
    rating: 4.5,
    reviews: 8321,
    sold: "30K+",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=300&fit=crop&auto=format",
    badge: "Flash",
  },
  {
    id: 3,
    name: "Set de sartenes antiadherentes 3 piezas inducción",
    price: 11.99,
    original: 59.99,
    discount: 80,
    rating: 4.6,
    reviews: 5634,
    sold: "20K+",
    img: "https://images.unsplash.com/photo-1584990347449-a4d2e72e17d3?w=300&h=300&fit=crop&auto=format",
    badge: "Flash",
  },
  {
    id: 4,
    name: "Lámpara LED escritorio recargable con control táctil",
    price: 6.49,
    original: 32.99,
    discount: 80,
    rating: 4.8,
    reviews: 9210,
    sold: "45K+",
    img: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=300&h=300&fit=crop&auto=format",
    badge: "Top",
  },
];

const products = [
  {
    id: 5,
    name: "Zapatillas running transpirables hombre mujer",
    price: 14.99,
    original: 59.99,
    discount: 75,
    rating: 4.4,
    reviews: 23410,
    sold: "100K+",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop&auto=format",
    freeShip: true,
  },
  {
    id: 6,
    name: "Reloj inteligente con monitor de frecuencia cardíaca GPS",
    price: 19.99,
    original: 89.99,
    discount: 78,
    rating: 4.6,
    reviews: 17823,
    sold: "80K+",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop&auto=format",
    freeShip: true,
  },
  {
    id: 7,
    name: "Mochila impermeable 40L con cargador USB",
    price: 9.99,
    original: 44.99,
    discount: 78,
    rating: 4.5,
    reviews: 11209,
    sold: "55K+",
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop&auto=format",
    freeShip: false,
  },
  {
    id: 8,
    name: "Cámara de seguridad WiFi 1080p visión nocturna",
    price: 12.49,
    original: 54.99,
    discount: 77,
    rating: 4.3,
    reviews: 6890,
    sold: "28K+",
    img: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=300&h=300&fit=crop&auto=format",
    freeShip: true,
  },
  {
    id: 9,
    name: "Plancha de pelo profesional cerámica 450°F",
    price: 7.99,
    original: 39.99,
    discount: 80,
    rating: 4.7,
    reviews: 14320,
    sold: "60K+",
    img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop&auto=format",
    freeShip: false,
  },
  {
    id: 10,
    name: "Soporte ajustable para laptop con ventilación",
    price: 5.49,
    original: 24.99,
    discount: 78,
    rating: 4.5,
    reviews: 8765,
    sold: "35K+",
    img: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=300&h=300&fit=crop&auto=format",
    freeShip: true,
  },
  {
    id: 11,
    name: "Juego de sábanas microfibra 4 piezas 1800 hilos",
    price: 8.99,
    original: 39.99,
    discount: 78,
    rating: 4.6,
    reviews: 21034,
    sold: "90K+",
    img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&h=300&fit=crop&auto=format",
    freeShip: true,
  },
  {
    id: 12,
    name: "Botella térmica acero inoxidable 500ml con filtro",
    price: 3.99,
    original: 18.99,
    discount: 79,
    rating: 4.8,
    reviews: 31240,
    sold: "120K+",
    img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop&auto=format",
    freeShip: false,
  },
  {
    id: 13,
    name: "Mini proyector portátil 4K 200 pulgadas WiFi",
    price: 29.99,
    original: 129.99,
    discount: 77,
    rating: 4.4,
    reviews: 4512,
    sold: "15K+",
    img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=300&fit=crop&auto=format",
    freeShip: true,
  },
  {
    id: 14,
    name: "Kit herramientas mecánicas 86 piezas profesional",
    price: 18.99,
    original: 79.99,
    discount: 76,
    rating: 4.5,
    reviews: 7823,
    sold: "32K+",
    img: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=300&h=300&fit=crop&auto=format",
    freeShip: false,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={10}
          className={s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
        />
      ))}
    </div>
  );
}

function ProductCard({ product, showBadge }: { product: any; showBadge?: string }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="bg-card rounded-lg overflow-hidden cursor-pointer group hover:shadow-md transition-shadow duration-200 relative">
      <div className="relative overflow-hidden bg-gray-50">
        <img
          src={product.img}
          alt={product.name}
          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {(showBadge || product.badge) && (
          <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
            {showBadge || product.badge}
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart size={14} className={liked ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
        {product.freeShip && (
          <span className="absolute bottom-2 left-2 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">
            ENVÍO GRATIS
          </span>
        )}
      </div>
      <div className="p-2">
        <p className="text-xs text-foreground line-clamp-2 leading-tight mb-1.5 h-8">{product.name}</p>
        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="text-base font-bold text-primary">${product.price}</span>
          <span className="text-[10px] text-muted-foreground line-through">${product.original}</span>
          <span className="text-[10px] font-bold text-accent bg-orange-50 px-1 rounded">-{product.discount}%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <StarRating rating={product.rating} />
            <span className="text-[9px] text-muted-foreground">{product.reviews.toLocaleString()}</span>
          </div>
          <span className="text-[9px] text-muted-foreground">{product.sold} vendidos</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [cartCount, setCartCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Todos");

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>

      {/* Top promo bar */}
      <div className="bg-primary text-primary-foreground text-center py-1.5 text-xs font-semibold tracking-wide">
        🎉 ¡Hasta 90% OFF + Envío gratis en tu primer pedido! Usa código: <span className="bg-white text-primary px-1.5 rounded font-bold ml-1">NUEVO90</span>
      </div>

      {/* Header */}
      <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-2.5">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="flex items-center gap-1 shrink-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm" style={{ fontFamily: "'Nunito', sans-serif" }}>T</span>
              </div>
              <span className="text-primary font-black text-xl hidden sm:block" style={{ fontFamily: "'Nunito', sans-serif" }}>temu</span>
            </div>

            {/* Location */}
            <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground shrink-0 cursor-pointer hover:text-foreground">
              <MapPin size={12} />
              <span>Enviar a México</span>
              <ChevronDown size={10} />
            </div>

            {/* Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar en millones de artículos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-muted rounded-full pl-4 pr-10 py-2 text-sm border border-transparent focus:border-primary focus:outline-none focus:bg-white transition-colors"
              />
              <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary text-white rounded-full p-1.5 hover:bg-red-600 transition-colors">
                <Search size={14} />
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <button className="hidden sm:flex flex-col items-center gap-0.5 p-2 hover:bg-muted rounded-lg transition-colors text-foreground">
                <Bell size={18} />
                <span className="text-[9px] text-muted-foreground">Alertas</span>
              </button>
              <button className="flex flex-col items-center gap-0.5 p-2 hover:bg-muted rounded-lg transition-colors text-foreground">
                <User size={18} />
                <span className="text-[9px] text-muted-foreground hidden sm:block">Cuenta</span>
              </button>
              <button
                className="flex flex-col items-center gap-0.5 p-2 hover:bg-muted rounded-lg transition-colors text-foreground relative"
                onClick={() => setCartCount(c => c + 1)}
              >
                <ShoppingCart size={18} />
                <span className="text-[9px] text-muted-foreground hidden sm:block">Carrito</span>
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-primary text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Category Nav */}
        <div className="border-t border-border bg-white overflow-x-auto scrollbar-hide">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-0 py-0">
              {["Todos", "Flash Deals", "Novedades", "Más vendidos", "Solo hoy", "Ropa", "Hogar", "Electrónica", "Belleza", "Deportes"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-colors shrink-0 ${
                    activeCategory === cat
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4 space-y-5">

        {/* Hero Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative rounded-xl overflow-hidden bg-gradient-to-r from-red-600 to-orange-500 min-h-[180px] flex items-center cursor-pointer group">
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=300&fit=crop&auto=format"
              alt="Ofertas increíbles"
              className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
            />
            <div className="relative z-10 p-6 md:p-8">
              <div className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-2">
                ⚡ FLASH DEALS
              </div>
              <h1 className="text-white text-2xl md:text-3xl font-black leading-tight mb-1" style={{ fontFamily: "'Nunito', sans-serif" }}>
                Hasta 90% OFF
              </h1>
              <p className="text-white/90 text-sm mb-4">Millones de artículos. Precios increíbles.</p>
              <button className="bg-white text-primary font-bold text-sm px-5 py-2 rounded-full hover:bg-gray-50 transition-colors">
                Comprar ahora →
              </button>
            </div>
            {/* Countdown */}
            <div className="absolute right-6 bottom-6 hidden md:flex items-center gap-2">
              {["02", "14", "38"].map((n, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className="bg-white/90 backdrop-blur-sm text-primary font-black text-lg px-2.5 py-1 rounded-lg leading-none w-12 text-center">
                    {n}
                  </div>
                  {i < 2 && <span className="text-white font-black text-lg">:</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { title: "Ropa mujer", sub: "Desde $2.99", color: "from-pink-400 to-rose-500", img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200&h=200&fit=crop&auto=format" },
              { title: "Electrónica", sub: "Desde $4.99", color: "from-blue-400 to-indigo-500", img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop&auto=format" },
              { title: "Hogar", sub: "Desde $1.99", color: "from-emerald-400 to-teal-500", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop&auto=format" },
              { title: "Belleza", sub: "Desde $3.49", color: "from-purple-400 to-fuchsia-500", img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop&auto=format" },
            ].map((item) => (
              <div key={item.title} className={`relative rounded-xl overflow-hidden bg-gradient-to-br ${item.color} cursor-pointer group min-h-[80px]`}>
                <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-35 transition-opacity" />
                <div className="relative z-10 p-3">
                  <p className="text-white font-bold text-sm leading-tight">{item.title}</p>
                  <p className="text-white/80 text-[10px]">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-2 bg-white rounded-xl p-3 border border-border">
          {[
            { icon: Truck, label: "Envío gratis", sub: "En miles de artículos" },
            { icon: Shield, label: "Compra segura", sub: "Reembolso garantizado" },
            { icon: RotateCcw, label: "90 días", sub: "Para devoluciones" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="bg-orange-50 p-2 rounded-lg shrink-0">
                <Icon size={16} className="text-accent" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">{label}</p>
                <p className="text-[10px] text-muted-foreground">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Categories Icons */}
        <div className="bg-white rounded-xl p-4 border border-border">
          <h2 className="text-sm font-bold text-foreground mb-3" style={{ fontFamily: "'Nunito', sans-serif" }}>Explorar categorías</h2>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
            {categories.map((cat) => (
              <button key={cat.name} className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-red-50 transition-colors group">
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-[9px] text-muted-foreground group-hover:text-primary font-medium text-center leading-tight">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Flash Deals */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                ⚡ FLASH DEALS
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                Termina en:
                {["02", "14", "38"].map((n, i) => (
                  <span key={i} className="flex items-center gap-0.5">
                    <span className="bg-foreground text-background font-bold px-1.5 py-0.5 rounded text-xs">{n}</span>
                    {i < 2 && <span className="font-bold">:</span>}
                  </span>
                ))}
              </div>
            </div>
            <button className="text-xs text-primary font-semibold hover:underline flex items-center gap-0.5">
              Ver todo <ChevronRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {flashDeals.map((p) => (
              <ProductCard key={p.id} product={p} showBadge={p.badge} />
            ))}
          </div>
        </section>

        {/* Recommended Products */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-black text-foreground" style={{ fontFamily: "'Nunito', sans-serif" }}>
              🔥 Recomendados para ti
            </h2>
            <button className="text-xs text-primary font-semibold hover:underline flex items-center gap-0.5">
              Ver más <ChevronRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Bottom Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-black text-xl mb-1" style={{ fontFamily: "'Nunito', sans-serif" }}>
              Descarga la app — obtén $100 de cupones
            </p>
            <p className="text-white/80 text-sm">Ofertas exclusivas solo para usuarios de la app</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-gray-900 transition-colors flex items-center gap-2">
              <span className="text-lg">🍎</span> App Store
            </button>
            <button className="bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-gray-900 transition-colors flex items-center gap-2">
              <span className="text-lg">🤖</span> Google Play
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border mt-8">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            {[
              {
                title: "Ayuda y soporte",
                links: ["Centro de ayuda", "Contáctanos", "Cómo comprar", "Política de devoluciones", "Disputas y reembolsos"],
              },
              {
                title: "Sobre temu",
                links: ["Sobre nosotros", "Carreras", "Prensa", "Afiliados", "Responsabilidad social"],
              },
              {
                title: "Mis pedidos",
                links: ["Rastrear pedido", "Mis compras", "Lista de deseos", "Mi cuenta", "Cupones"],
              },
              {
                title: "Información legal",
                links: ["Términos de uso", "Privacidad", "Cookies", "Propiedad intelectual", "Accesibilidad"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-bold text-foreground mb-3 uppercase tracking-wide">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <span className="text-white font-black text-xs" style={{ fontFamily: "'Nunito', sans-serif" }}>T</span>
              </div>
              <span className="text-xs text-muted-foreground">© 2024 Temu. Todos los derechos reservados.</span>
            </div>
            <div className="flex items-center gap-3">
              {["Visa", "Mastercard", "PayPal", "OXXO"].map((pay) => (
                <span key={pay} className="text-[10px] bg-muted px-2 py-1 rounded font-medium text-muted-foreground">{pay}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border flex sm:hidden z-50">
        {[
          { icon: "🏠", label: "Inicio" },
          { icon: "🔥", label: "Deals" },
          { icon: "🔍", label: "Buscar" },
          { icon: "🛒", label: "Carrito" },
          { icon: "👤", label: "Yo" },
        ].map((item) => (
          <button key={item.label} className="flex-1 flex flex-col items-center gap-0.5 py-2.5 hover:bg-muted transition-colors">
            <span className="text-lg">{item.icon}</span>
            <span className="text-[9px] text-muted-foreground font-medium">{item.label}</span>
          </button>
        ))}
      </div>
      <div className="h-16 sm:hidden" />
    </div>
  );
}
