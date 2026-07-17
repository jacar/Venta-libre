import { NextResponse } from 'next/server';
import { api } from '@/lib/woocommerce';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    
    // Only allow updating certain fields for now
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.regular_price !== undefined) updateData.regular_price = body.regular_price.toString();
    if (body.description !== undefined) updateData.description = body.description;
    if (body.status !== undefined) updateData.status = body.status;
    
    if (body.stock_quantity !== undefined && body.stock_quantity !== "") {
      updateData.manage_stock = true;
      updateData.stock_quantity = parseInt(body.stock_quantity);
    } else if (body.stock_quantity === "") {
      updateData.manage_stock = false;
    }

    if (body.image_url) {
      updateData.images = [{ src: body.image_url }];
    }

    const response = await api.put(`products/${id}`, updateData);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Error updating product:`, error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const response = await api.delete(`products/${id}`, { force: true });
    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    console.error(`Error deleting product:`, error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
