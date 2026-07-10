import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function POST(request: Request) {
  try {
    const { userId, items, amount, paymentMethod } = await request.json();

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Thông tin đơn hàng không hợp lệ.' }, { status: 400 });
    }

    // Generate a unique 6-digit transaction code prefix
    const orderCode = 'HM' + Math.floor(100000 + Math.random() * 900000);

    // Create pending order entries for each course in the cart
    const orders = await Promise.all(
      items.map((item: any) => {
        return db.order.create({
          data: {
            id: `${orderCode}-${item.id}`,
            userId: userId,
            courseId: item.id,
            amount: Math.round(amount / items.length), // Split total amount across courses
            paymentMethod: paymentMethod,
            status: 'pending',
          },
        });
      })
    );

    return NextResponse.json({ orderCode, orders });
  } catch (error) {
    console.error('Create Order Error:', error);
    return NextResponse.json({ error: 'Không thể tạo đơn hàng trong database.' }, { status: 500 });
  }
}
