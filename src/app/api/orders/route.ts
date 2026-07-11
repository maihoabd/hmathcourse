import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { payOS } from '../../../lib/payos';

// 1. Create a pending order (used by checkout page)
export async function POST(request: Request) {
  try {
    const { userId, items, amount, paymentMethod } = await request.json();

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Thông tin đơn hàng không hợp lệ.' }, { status: 400 });
    }

    // Generate a unique 6-digit numeric code for PayOS compliance (requires orderCode as a number)
    const numericCode = Math.floor(100000 + Math.random() * 900000);
    const orderCode = `HM${numericCode}`;

    // Create pending order entries in the database
    const orders = await Promise.all(
      items.map((item: any) => {
        return db.order.create({
          data: {
            id: `${orderCode}-${item.id}`,
            userId: userId,
            courseId: item.id,
            amount: Math.round(amount / items.length), // Split total amount across courses
            paymentMethod: 'payos',
            status: 'pending',
          },
        });
      })
    );

    // If PayOS credentials are set, generate the actual PayOS payment link
    const hasPayOS = process.env.PAYOS_CLIENT_ID && process.env.PAYOS_API_KEY && process.env.PAYOS_CHECKSUM_KEY;

    if (hasPayOS) {
      const origin = new URL(request.url).origin;
      try {
        const paymentData = {
          orderCode: numericCode,
          amount: amount,
          description: `HMATH ${numericCode}`,
          // Không tự gắn query params (status/code) ở đây nữa.
          // PayOS sẽ TỰ ĐỘNG gắn ?code=00&id=...&cancel=...&status=PAID/CANCELLED&orderCode=<numericCode>
          // khi redirect về. Nếu tự thêm status/code trước, dễ gây xung đột / URL bị lỗi.
          cancelUrl: `${origin}/checkout`,
          returnUrl: `${origin}/checkout`,
        };

        const paymentLink = await payOS.paymentRequests.create(paymentData);

        return NextResponse.json({
          orderCode,
          payos: true,
          checkoutUrl: paymentLink.checkoutUrl,
        });
      } catch (payosError) {
        console.error('PayOS Link Generation Error:', payosError);
      }
    }

    return NextResponse.json({ orderCode, payos: false });
  } catch (error) {
    console.error('Create Order Error:', error);
    return NextResponse.json({ error: 'Không thể tạo đơn hàng trong database.' }, { status: 500 });
  }
}

// 2. Fetch all orders (used by admin pages)
export async function GET(request: Request) {
  try {
    const orders = await db.order.findMany({
      include: {
        user: true,
        course: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    const mappedOrders = orders.map((o) => ({
      id: o.id,
      studentId: o.userId,
      studentName: o.user.name,
      studentEmail: o.user.email,
      courseId: o.courseId,
      courseTitle: o.course.title,
      amount: o.amount,
      paymentMethod: o.paymentMethod,
      status: o.status,
      date: o.date.toISOString(),
    }));

    return NextResponse.json(mappedOrders);
  } catch (error) {
    console.error('Fetch Orders API Error:', error);
    return NextResponse.json({ error: 'Lỗi tải danh sách đơn hàng.' }, { status: 500 });
  }
}

// 3. Update order status (used by admin to manually complete / fail orders)
export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Thiếu thông tin cập nhật.' }, { status: 400 });
    }

    // Find the existing order
    const order = await db.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json({ error: 'Không tìm thấy đơn hàng.' }, { status: 404 });
    }

    // Update the status in the database
    const updatedOrder = await db.order.update({
      where: { id },
      data: { status },
    });

    // If status is updated to 'completed', unlock the course by creating an Enrollment
    if (status === 'completed') {
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
      console.log(`Manually unlocked course ${order.courseId} for user ${order.userId}`);
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Update Order Status Error:', error);
    return NextResponse.json({ error: 'Lỗi cập nhật trạng thái đơn hàng.' }, { status: 500 });
  }
}
