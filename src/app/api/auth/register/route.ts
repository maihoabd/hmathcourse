import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '../../../../lib/mail';

export async function POST(request: Request) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Vui lòng cung cấp đầy đủ thông tin.' }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email này đã tồn tại trên hệ thống.' }, { status: 400 });
    }

    // Encrypt the password using bcrypt
    const passwordHash = bcrypt.hashSync(password, 10);

    // Generate 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await db.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        role: 'student',
        status: 'active',
        phone: phone || null,
        emailVerified: false,
        verificationCode: verificationCode,
      },
    });

    // Send verification email
    await sendVerificationEmail(email, name, verificationCode);

    return NextResponse.json({
      success: true,
      email: user.email,
      unverified: true,
      message: 'Mã kích hoạt đã được gửi tới email của bạn.'
    });
  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json({ error: 'Có lỗi hệ thống xảy ra.' }, { status: 500 });
  }
}
