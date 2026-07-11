import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function PUT(request: Request) {
  try {
    const { userId, courseId, lessonId, completed } = await request.json();

    if (!userId || !courseId || !lessonId) {
      return NextResponse.json({ error: 'Thiếu thông tin cập nhật tiến độ (userId, courseId, lessonId).' }, { status: 400 });
    }

    // Find current enrollment record
    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: 'Không tìm thấy thông tin đăng ký học của người dùng này.' }, { status: 404 });
    }

    let completedLessons = [...enrollment.completedLessons];
    const isAlreadyCompleted = completedLessons.includes(lessonId);

    if (completed && !isAlreadyCompleted) {
      completedLessons.push(lessonId);
    } else if (!completed && isAlreadyCompleted) {
      completedLessons = completedLessons.filter((id) => id !== lessonId);
    }

    // Retrieve course to count total lessons dynamically from DB chapters/lessons
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Không tìm thấy thông tin khóa học.' }, { status: 404 });
    }

    // Calculate total lessons in course
    const totalLessons = course.chapters.reduce((sum, chapter) => sum + chapter.lessons.length, 0);
    
    // Recalculate progress percentage
    const progress = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 100;

    // Update enrollment in database
    const updatedEnrollment = await db.enrollment.update({
      where: {
        id: enrollment.id,
      },
      data: {
        completedLessons,
        progress: Math.min(100, Math.max(0, progress)),
        lastAccessed: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      progress: updatedEnrollment.progress,
      completedLessons: updatedEnrollment.completedLessons,
    });
  } catch (error) {
    console.error('Update Enrollment Progress Error:', error);
    return NextResponse.json({ error: 'Lỗi hệ thống khi cập nhật tiến trình học tập.' }, { status: 500 });
  }
}
