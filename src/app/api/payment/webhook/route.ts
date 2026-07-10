import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Payment Webhook Received:', JSON.stringify(body));

    let description = '';
    let amount = 0;

    // 1. Support Casso Webhook payload format
    if (body.requests && Array.isArray(body.requests) && body.requests.length > 0) {
      const transaction = body.requests[0];
      description = transaction.description || '';
      amount = transaction.amount || 0;
    } 
    // 2. Support Sepay Webhook payload format
    else if (body.transactionContent || body.code) {
      description = body.transactionContent || body.code || '';
      amount = body.amountIn || 0;
    }
    // 3. Fallback/Generic format
    else {
      description = body.description || body.memo || '';
      amount = body.amount || 0;
    }

    if (!description) {
      return NextResponse.json({ error: 'Nội dung chuyển khoản trống.' }, { status: 400 });
    }

    // Extract the order code matching "HM" followed by 6 digits (e.g. HM123456)
    const match = description.match(/(HM\d{6})/i);
    if (!match) {
      return NextResponse.json({ error: 'Không tìm thấy mã đơn hàng HMxxxxx trong nội dung chuyển khoản.' }, { status: 400 });
    }

    const orderCode = match[0].toUpperCase();

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
        message: `Không tìm thấy đơn hàng chờ thanh toán với mã ${orderCode}. Có thể đơn hàng đã được kích hoạt trước đó.` 
      }, { status: 200 });
    }

    // Update orders to completed
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
      message: `Đơn hàng ${orderCode} đã thanh toán thành công và kích hoạt khóa học.` 
    });
  } catch (error) {
    console.error('Payment Webhook Error:', error);
    return NextResponse.json({ error: 'Lỗi hệ thống khi xử lý webhook thanh toán.' }, { status: 500 });
  }
}
