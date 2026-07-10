import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Thiếu mã chuyển khoản.' }, { status: 400 });
    }

    const orderCode = code.toUpperCase();

    // Query pending orders associated with this transfer code
    const orders = await db.order.findMany({
      where: {
        id: {
          startsWith: orderCode,
        },
        status: 'pending',
      },
    });

    if (orders.length === 0) {
      return NextResponse.json({ 
        error: `Không tìm thấy đơn hàng chờ thanh toán với mã ${orderCode} hoặc đã được kích hoạt trước đó.` 
      }, { status: 404 });
    }

    // Update order status to completed
    await db.order.updateMany({
      where: {
        id: {
          startsWith: orderCode,
        },
      },
      data: {
        status: 'completed',
      },
    });

    // Create student enrollments in parallel
    for (const order of orders) {
      await db.enrollment.upsert({
        where: {
          userId_courseId: {
            userId: order.userId,
            courseId: order.courseId,
          },
        },
        create: {
          userId: order.userId,
          courseId: order.courseId,
          progress: 0,
          completedLessons: [],
        },
        update: {
          lastAccessed: new Date(),
        },
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Giả lập thanh toán thành công! Đơn hàng ${orderCode} đã được kích hoạt trên hệ thống.` 
    });
  } catch (error) {
    console.error('Simulate Payment Error:', error);
    return NextResponse.json({ error: 'Lỗi hệ thống khi giả lập thanh toán.' }, { status: 500 });
  }
}
