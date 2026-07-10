import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Thiếu thông tin người dùng (userId).' }, { status: 400 });
    }

    // Retrieve enrollments from the database
    const enrollments = await db.enrollment.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        lastAccessed: 'desc',
      },
    });

    return NextResponse.json(enrollments);
  } catch (error) {
    console.error('Fetch Enrollments Error:', error);
    return NextResponse.json({ error: 'Lỗi hệ thống khi tải danh sách khóa học đăng ký.' }, { status: 500 });
  }
}
