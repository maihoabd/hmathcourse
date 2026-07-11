import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '../../../../lib/mail';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Vui lòng cung cấp email và mật khẩu.' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Email hoặc mật khẩu không chính xác.' }, { status: 400 });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Email hoặc mật khẩu không chính xác.' }, { status: 400 });
    }

    if (user.status === 'suspended') {
      return NextResponse.json({ error: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ support.' }, { status: 403 });
    }

    // Require email verification (exclude admin from mandatory email verification verification check if desired, but seeding admin has emailVerified: true)
    if (!user.emailVerified) {
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      await db.user.update({
        where: { email },
        data: { verificationCode },
      });
      await sendVerificationEmail(user.email, user.name, verificationCode);

      return NextResponse.json({
        error: 'Tài khoản chưa kích hoạt. Mã xác thực mới đã được gửi tới email của bạn.',
        unverified: true,
        email: user.email
      }, { status: 403 });
    }

    // Return session variables (exclude hash password)
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      emailVerified: true,
      avatar: user.role === 'admin' 
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=60'
        : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60',
    });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'Có lỗi hệ thống xảy ra.' }, { status: 500 });
  }
}
