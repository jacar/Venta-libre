import { NextResponse } from 'next/server';
import { api } from '@/lib/woocommerce';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    
    // Utilize Next.js fetch cache by injecting it into the WooCommerce API wrapper if possible,
    // or wrap the result in a revalidation block. We set proper cache headers for Edge/CDN.
    const response = await api.get('products', params);
    
    return NextResponse.json(response.data, {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error: any) {
    console.error('Error fetching public products:', error?.message || error);
    if (error?.response) {
      console.error("WooCommerce API Error Response in Products:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    }
    return NextResponse.json({ error: 'Failed to fetch products', details: error?.message || String(error) }, { status: 500 });
  }
}
