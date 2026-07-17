import { NextResponse } from "next/server";
import { getCachedCategories } from "@/lib/data";

export async function GET() {
  try {
    const categories = await getCachedCategories();
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error("Error al obtener categorías de WooCommerce:", error?.message || error);
    if (error?.response) {
      console.error("WooCommerce API Error Response:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    }
    return NextResponse.json({ error: "Failed to fetch categories", details: error?.message || String(error) }, { status: 500 });
  }
}
