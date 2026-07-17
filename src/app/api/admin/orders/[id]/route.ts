import { NextResponse } from 'next/server';
import { api } from '@/lib/woocommerce';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const response = await api.put(`orders/${id}`, { status });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Error updating order:`, error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
