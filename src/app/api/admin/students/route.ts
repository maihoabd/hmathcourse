import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET() {
  try {
    const students = await db.user.findMany({
      where: {
        role: 'student',
      },
      include: {
        enrolledCourses: {
          include: {
            course: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const mapped = students.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      phone: s.phone || '',
      avatar: '',
      registeredAt: s.createdAt.toISOString(),
      status: s.status,
      enrolledCourses: s.enrolledCourses.map((e) => ({
        courseId: e.courseId,
        courseTitle: e.course.title,
        progress: e.progress,
      })),
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error('Fetch Admin Students Error:', error);
    return NextResponse.json({ error: 'Lỗi tải danh sách học viên.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Thiếu thông tin cập nhật.' }, { status: 400 });
    }

    const updated = await db.user.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error('Update Student Status Error:', error);
    return NextResponse.json({ error: 'Lỗi cập nhật trạng thái học viên.' }, { status: 500 });
  }
}
