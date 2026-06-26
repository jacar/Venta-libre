import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  id: number;
  name: string;
  price: string;
  image: string;
  slug: string;
}

interface WishlistStore {
  items: WishlistItem[];
  toggleItem: (item: WishlistItem) => void;
  isInWishlist: (id: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      toggleItem: (item) => {
        const currentItems = get().items;
        const exists = currentItems.some((i) => i.id === item.id);
        
        if (exists) {
          set({ items: currentItems.filter((i) => i.id !== item.id) });
        } else {
          set({ items: [...currentItems, item] });
        }
      },
      
      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id);
      },
      
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage', // name of the item in the storage (must be unique)
    }
  )
);
