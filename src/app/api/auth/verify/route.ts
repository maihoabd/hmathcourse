import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Vui lòng cung cấp email và mã xác thực.' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Không tìm thấy thông tin tài khoản.' }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'Tài khoản này đã được kích hoạt từ trước.' }, { status: 400 });
    }

    if (!user.verificationCode || user.verificationCode !== code.trim()) {
      return NextResponse.json({ error: 'Mã xác thực không chính xác. Vui lòng thử lại.' }, { status: 400 });
    }

    // Set account as verified and clear code
    const verifiedUser = await db.user.update({
      where: { email },
      data: {
        emailVerified: true,
        verificationCode: null,
      },
    });

    return NextResponse.json({
      id: verifiedUser.id,
      name: verifiedUser.name,
      email: verifiedUser.email,
      role: verifiedUser.role,
      phone: verifiedUser.phone || '',
      emailVerified: true,
      avatar: verifiedUser.role === 'admin' 
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=60'
        : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60',
    });
  } catch (error) {
    console.error('Verify API error:', error);
    return NextResponse.json({ error: 'Lỗi hệ thống khi xác thực tài khoản.' }, { status: 500 });
  }
}
