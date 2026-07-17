import { NextResponse } from 'next/server';
import { api } from '@/lib/woocommerce';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const per_page = searchParams.get('per_page') || '10';
    const search = searchParams.get('search') || '';

    const params: any = { page, per_page };
    if (search) params.search = search;

    const response = await api.get('products', params);
    
    return NextResponse.json({
      products: response.data,
      totalPages: response.headers['x-wp-totalpages'] || 1,
      totalItems: response.headers['x-wp-total'] || 0
    });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const productData: any = {
      name: body.name,
      type: "simple",
      regular_price: body.regular_price.toString(),
      description: body.description || "",
      status: body.status || "publish",
    };

    if (body.stock_quantity) {
      productData.manage_stock = true;
      productData.stock_quantity = parseInt(body.stock_quantity);
    }

    if (body.image_url) {
      productData.images = [{ src: body.image_url }];
    }

    const response = await api.post('products', productData);
    
    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
