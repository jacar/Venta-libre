import { NextResponse } from 'next/server';
import { api } from '@/lib/woocommerce';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const per_page = searchParams.get('per_page') || '10';

    const response = await api.get('orders', { page, per_page });
    
    return NextResponse.json({
      orders: response.data,
      totalPages: response.headers['x-wp-totalpages'] || 1,
      totalItems: response.headers['x-wp-total'] || 0
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json({ error: 'Failed to load orders' }, { status: 500 });
  }
}
