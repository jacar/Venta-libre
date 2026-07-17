import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ProductItem {
  id: number;
  name: string;
  price: number;
  image: string;
  note?: string; // Para guardar talla, color u otras especificaciones
}

export interface CartItem extends ProductItem {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addToCart: (product: ProductItem, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addToCart: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ items: [...currentItems, { ...product, quantity }] });
        }
      },

      removeFromCart: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),
      
      toggleCart: () => set({ isOpen: !get().isOpen }),
    }),
    {
      name: 'ventalibre-cart-storage',
    }
  )
);
