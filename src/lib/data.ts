import { unstable_cache } from "next/cache";
import { api } from "@/lib/woocommerce";

export const getCachedCategories = unstable_cache(
  async () => {
    try {
      const response = await api.get("products/categories", {
        hide_empty: false,
        per_page: 100,
      });
      const rawData = Array.isArray(response.data) ? response.data : [];
      return rawData.filter(
        (c: any) =>
          c.slug !== "sin-categorizar" &&
          c.slug !== "uncategorized" &&
          !c.slug.toLowerCase().includes("outlet")
      );
    } catch (error) {
      console.error("[Cache] Error fetching categories:", error);
      return [];
    }
  },
  ["woocommerce-all-categories"],
  { revalidate: 3600, tags: ["categories"] }
);

export async function getCachedProducts(params: any = {}) {
  const fetcher = unstable_cache(
    async () => {
      try {
        const response = await api.get("products", {
          status: "publish",
          ...params,
        });
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error("[Cache] Error fetching products with params", params, error);
        return [];
      }
    },
    [`woocommerce-products-${JSON.stringify(params)}`],
    { revalidate: 3600, tags: ["products"] }
  );
  
  return fetcher();
}
