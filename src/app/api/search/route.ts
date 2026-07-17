import { NextResponse } from "next/server";
import { api } from "@/lib/woocommerce";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q || q.length < 3) {
    return NextResponse.json([]);
  }

  try {
    const response = await api.get("products", {
      search: q,
      per_page: 5,
      status: "publish"
    });
    const data = Array.isArray(response.data) ? response.data : [];
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en búsqueda:", error);
    return NextResponse.json([], { status: 500 });
  }
}
