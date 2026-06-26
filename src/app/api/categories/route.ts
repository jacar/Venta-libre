import { NextResponse } from "next/server";
import { api } from "@/lib/woocommerce";

export async function GET() {
  try {
    const response = await api.get("products/categories", {
      hide_empty: false,
    });
    const categories = response.data.filter(
      (c: any) => c.slug !== "sin-categorizar" && c.slug !== "uncategorized"
    );
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
