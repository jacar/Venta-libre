import { NextResponse } from 'next/server';
import { api } from '@/lib/woocommerce';

export async function GET() {
  try {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
    
    // Get sales report for the month
    const reportsRes = await api.get('reports/sales', { date_min: firstDay });
    const reportData = reportsRes.data[0];

    // Get total products count (just querying 1 to get headers x-wp-total)
    const productsRes = await api.get('products', { per_page: 1 });
    const totalProducts = productsRes.headers['x-wp-total'] || 0;

    // Get total customers count
    const customersRes = await api.get('customers', { per_page: 1 });
    const totalCustomers = customersRes.headers['x-wp-total'] || 0;

    return NextResponse.json({
      totalSales: reportData?.total_sales || 0,
      totalOrders: reportData?.total_orders || 0,
      totalProducts,
      totalCustomers
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to load dashboard data' }, { status: 500 });
  }
}
