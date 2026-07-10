import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderCode = searchParams.get('code');

    if (!orderCode) {
      return NextResponse.json({ error: 'Thiếu mã đơn hàng.' }, { status: 400 });
    }

    // Retrieve all orders starting with the generated transfer code
    const orders = await db.order.findMany({
      where: {
        id: {
          startsWith: orderCode.toUpperCase(),
        },
      },
    });

    if (orders.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy đơn hàng tương ứng.' }, { status: 404 });
    }

    // Check if all items in this order are completed
    const isCompleted = orders.every((order) => order.status === 'completed');

    return NextResponse.json({
      status: isCompleted ? 'completed' : 'pending',
      orders: orders.map((o) => ({
        id: o.id,
        courseId: o.courseId,
        amount: o.amount,
        status: o.status,
      })),
    });
  } catch (error) {
    console.error('Check Order Status Error:', error);
    return NextResponse.json({ error: 'Có lỗi hệ thống khi kiểm tra trạng thái.' }, { status: 500 });
  }
}
