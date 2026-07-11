import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { payOS } from '../../../../lib/payos';

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
    let isCompleted = orders.every((order) => order.status === 'completed');

    // Fail-safe: If not completed in database, check PayOS API directly!
    if (!isCompleted) {
      const numericMatch = orderCode.match(/\d+/);
      const numericCode = numericMatch ? parseInt(numericMatch[0], 10) : null;
      
      const hasPayOS = process.env.PAYOS_CLIENT_ID && process.env.PAYOS_API_KEY && process.env.PAYOS_CHECKSUM_KEY;

      if (hasPayOS && numericCode) {
        try {
          const paymentInfo = await payOS.paymentRequests.get(numericCode);
          if (paymentInfo && paymentInfo.status === 'PAID') {
            console.log(`Direct PayOS API check found PAID status for order ${orderCode}. Syncing database...`);
            
            // 1. Update orders to completed
            await db.order.updateMany({
              where: {
                id: {
                  startsWith: orderCode.toUpperCase(),
                },
              },
              data: {
                status: 'completed',
              },
            });

            // 2. Create enrollments
            const pendingOrders = orders.filter((o) => o.status === 'pending');
            for (const order of pendingOrders) {
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

            isCompleted = true;
            // Update local objects status
            orders.forEach((o) => {
              o.status = 'completed';
            });
          }
        } catch (payosError: any) {
          console.error(`Direct PayOS API check failed for order ${orderCode}:`, payosError.message || payosError);
        }
      }
    }

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
