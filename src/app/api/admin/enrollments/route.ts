import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

// 1. POST: Grant a course manually to a student
export async function POST(request: Request) {
  try {
    const { userId, courseId } = await request.json();

    if (!userId || !courseId) {
      return NextResponse.json({ error: 'Thiếu thông tin cấp khóa học (userId, courseId).' }, { status: 400 });
    }

    // Verify user exists and is a student
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'Không tìm thấy tài khoản người dùng.' }, { status: 404 });
    }

    // Verify course exists
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: 'Không tìm thấy khóa học.' }, { status: 404 });
    }

    // Create a manual completed order for logging purposes
    const orderCode = `MANUAL-${Math.floor(100000 + Math.random() * 900000)}`;
    await db.order.create({
      data: {
        id: `${orderCode}-${courseId}`,
        userId,
        courseId,
        amount: 0,
        paymentMethod: 'manual',
        status: 'completed',
      },
    });

    // Create or update the enrollment
    const enrollment = await db.enrollment.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      create: {
        userId,
        courseId,
        progress: 0,
        completedLessons: [],
      },
      update: {
        lastAccessed: new Date(),
      },
    });

    return NextResponse.json({ success: true, enrollment });
  } catch (error) {
    console.error('Admin Grant Course Error:', error);
    return NextResponse.json({ error: 'Lỗi hệ thống khi cấp khóa học thủ công.' }, { status: 550 });
  }
}

// 2. DELETE: Revoke a course enrollment manually
export async function DELETE(request: Request) {
  try {
    const { userId, courseId } = await request.json();

    if (!userId || !courseId) {
      return NextResponse.json({ error: 'Thiếu thông tin thu hồi khóa học (userId, courseId).' }, { status: 400 });
    }

    // Delete enrollment
    await db.enrollment.deleteMany({
      where: {
        userId,
        courseId,
      },
    });

    // Delete manual logging orders associated with this grant
    await db.order.deleteMany({
      where: {
        userId,
        courseId,
        paymentMethod: 'manual',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin Revoke Course Error:', error);
    return NextResponse.json({ error: 'Lỗi hệ thống khi thu hồi khóa học.' }, { status: 550 });
  }
}
