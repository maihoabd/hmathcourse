import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { payOS } from '../../../lib/payos';

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
          cancelUrl: `${origin}/checkout?status=cancel&code=${orderCode}`,
          returnUrl: `${origin}/checkout?status=success&code=${orderCode}`,
        };

        const paymentLink = await payOS.paymentRequests.create(paymentData);

        return NextResponse.json({
          orderCode,
          payos: true,
          checkoutUrl: paymentLink.checkoutUrl,
        });
      } catch (payosError) {
        console.error('PayOS Link Generation Error:', payosError);
        // Fall back to manual QR display if PayOS throws an error
      }
    }

    return NextResponse.json({ orderCode, payos: false });
  } catch (error) {
    console.error('Create Order Error:', error);
    return NextResponse.json({ error: 'Không thể tạo đơn hàng trong database.' }, { status: 500 });
  }
}
