import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Payment Webhook Received:', JSON.stringify(body));

    let description = '';
    let amount = 0;

    // 0. Support PayOS Webhook payload format
    if (body.data && typeof body.data.orderCode !== 'undefined') {
      const codeNum = body.data.orderCode;
      description = `HM${codeNum} ${body.data.description || ''}`;
      amount = body.data.amount || 0;
    }
    // 1. Support Casso Webhook payload format
    else if (body.requests && Array.isArray(body.requests) && body.requests.length > 0) {
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

    // Extract the order code matching "HM" (with optional "ATH" or space) followed by 6 digits (e.g. HM123456 or HMATH 123456)
    const match = description.match(/HM(?:ATH)?\s*(\d{6})/i);
    if (!match) {
      // If it doesn't match, return 200 with error: 0 to bypass PayOS webhook test ping verification
      console.log('No order code found in webhook description. Returning success to satisfy test ping.');
      return NextResponse.json({ error: 0, message: 'Webhook verified' }, { status: 200 });
    }

    const orderCode = 'HM' + match[1].toUpperCase();

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
      // Return 200 with error: 0 if order is already processed or doesn't exist
      return NextResponse.json({ 
        error: 0,
        message: `Không tìm thấy đơn hàng chờ thanh toán với mã ${orderCode}.` 
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
      error: 0,
      success: true, 
      message: `Đơn hàng ${orderCode} đã thanh toán thành công và kích hoạt khóa học.` 
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    // Return 200 with error: 1 to satisfy webhook response format during server errors
    return NextResponse.json({ error: 1, message: 'Internal Server Error' }, { status: 200 });
  }
}
