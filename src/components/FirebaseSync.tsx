"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function FirebaseSync() {
  const { data: session, status } = useSession();
  const { items, setWishlistItems } = useWishlistStore();
  const isInitialLoad = useRef(true);

  // Sync from Firebase on login
  useEffect(() => {
    const email = session?.user?.email;
    if (status === "authenticated" && email) {
      const fetchWishlist = async () => {
        if (!db) return;
        try {
          const docRef = doc(db, "wishlists", email);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const remoteItems = docSnap.data().items || [];
            
            // Merge local and remote items (remove duplicates by ID)
            const localItems = useWishlistStore.getState().items;
            const mergedMap = new Map();
            localItems.forEach(item => mergedMap.set(item.id, item));
            remoteItems.forEach((item: any) => mergedMap.set(item.id, item));
            
            const finalItems = Array.from(mergedMap.values());
            useWishlistStore.getState().setWishlistItems(finalItems);
          }
        } catch (error: any) {
          // Si el error es por falta de conexión o adblockers, lo ignoramos para no ensuciar la consola
          if (error?.message && error.message.includes('offline')) {
            console.warn("Firebase offline: Sincronizando wishlist solo localmente.");
          } else {
            console.error("Error fetching wishlist from Firebase:", error);
          }
        } finally {
          isInitialLoad.current = false;
        }
      };
      
      fetchWishlist();
    } else if (status === "unauthenticated") {
      isInitialLoad.current = true;
    }
  }, [status, session]);

  // Sync to Firebase on changes
  useEffect(() => {
    const email = session?.user?.email;
    if (status === "authenticated" && email && !isInitialLoad.current) {
      const syncToFirebase = async () => {
        if (!db) return;
        try {
          const docRef = doc(db, "wishlists", email);
          await setDoc(docRef, { items }, { merge: true });
        } catch (error) {
          console.error("Error syncing wishlist to Firebase:", error);
        }
      };
      
      syncToFirebase();
    }
  }, [items, status, session]);

  return null;
}
