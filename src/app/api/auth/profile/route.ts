import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function PUT(request: Request) {
  try {
    const { userId, phone } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Không tìm thấy thông tin tài khoản.' }, { status: 400 });
    }

    const updated = await db.user.update({
      where: { id: userId },
      data: { phone },
    });

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      phone: updated.phone || '',
      emailVerified: updated.emailVerified,
      avatar: updated.role === 'admin' 
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=60'
        : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60',
    });
  } catch (error) {
    console.error('Update Profile API Error:', error);
    return NextResponse.json({ error: 'Lỗi cập nhật số điện thoại.' }, { status: 500 });
  }
}
