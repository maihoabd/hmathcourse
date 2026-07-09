import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

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

    const user = await db.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        role: 'student',
        status: 'active',
      },
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60',
    });
  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json({ error: 'Có lỗi hệ thống xảy ra.' }, { status: 500 });
  }
}
