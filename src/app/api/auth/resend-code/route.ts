import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { sendVerificationEmail } from '../../../../lib/mail';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Địa chỉ email không được để trống.' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Tài khoản không tồn tại trên hệ thống.' }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'Tài khoản này đã được kích hoạt thành công.' }, { status: 400 });
    }

    // Generate new 6-digit code
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();

    await db.user.update({
      where: { email },
      data: {
        verificationCode: newCode,
      },
    });

    // Send code email
    await sendVerificationEmail(user.email, user.name, newCode);

    return NextResponse.json({ success: true, message: 'Mã xác thực mới đã được gửi.' });
  } catch (error) {
    console.error('Resend Code API error:', error);
    return NextResponse.json({ error: 'Có lỗi xảy ra khi gửi lại mã.' }, { status: 500 });
  }
}
