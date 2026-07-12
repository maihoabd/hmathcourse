import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      // Query single course details with chapters and lessons
      const course = await db.course.findUnique({
        where: { slug },
        include: {
          chapters: {
            include: {
              lessons: {
                orderBy: { id: 'asc' }
              }
            }
          }
        }
      });

      if (!course) {
        return NextResponse.json({ error: 'Không tìm thấy khóa học.' }, { status: 404 });
      }

      // Check enrollment to decide whether to strip locked lesson details
      const userId = searchParams.get('userId');
      let isEnrolled = false;

      if (userId) {
        const u = await db.user.findUnique({ where: { id: userId } });
        if (u) {
          if (u.role === 'admin') {
            isEnrolled = true;
          } else {
            const enroll = await db.enrollment.findFirst({
              where: { userId, courseId: course.id }
            });
            if (enroll) {
              isEnrolled = true;
            }
          }
        }
      }

      // Strip sensitive urls from locked lessons if user is not enrolled
      if (!isEnrolled && course.chapters) {
        course.chapters.forEach((chapter) => {
          if (chapter.lessons) {
            chapter.lessons.forEach((lesson) => {
              if (!lesson.isPreview) {
                lesson.videoUrl = null;
                lesson.documentUrl = null;
                lesson.textContent = null;
              }
            });
          }
        });
      }

      // Map DB Course to match the frontend signature structure (instructor info nesting)
      return NextResponse.json({
        ...course,
        instructor: {
          name: course.instructorName,
          role: course.instructorRole,
          avatar: course.instructorAvatar,
          bio: course.instructorBio,
          coursesCount: 2,
          rating: 4.9
        }
      });
    }

    // Query all courses
    const courses = await db.course.findMany({
      orderBy: { id: 'asc' }
    });

    // Map each course to include nested instructor details for frontend rendering compatibility
    const mappedCourses = courses.map((course) => ({
      ...course,
      instructor: {
        name: course.instructorName,
        role: course.instructorRole,
        avatar: course.instructorAvatar,
        bio: course.instructorBio,
        coursesCount: 2,
        rating: 4.9
      }
    }));

    return NextResponse.json(mappedCourses);
  } catch (error) {
    console.error('Fetch Courses API Error:', error);
    return NextResponse.json({ error: 'Lỗi tải dữ liệu khóa học từ cơ sở dữ liệu.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      slug,
      title,
      shortDescription,
      description,
      price,
      originalPrice,
      thumbnail,
      category,
      level,
      lessonsCount,
      duration,
      isBestseller,
      grade,
      productType,
      instructor
    } = body;

    if (!id || !slug || !title) {
      return NextResponse.json({ error: 'Thiếu các thông tin bắt buộc.' }, { status: 400 });
    }

    const newCourse = await db.course.create({
      data: {
        id,
        slug,
        title,
        shortDescription,
        description,
        price: Number(price),
        originalPrice: Number(originalPrice || price),
        thumbnail,
        category,
        level,
        lessonsCount: Number(lessonsCount || 0),
        duration,
        rating: 4.8,
        reviewsCount: 0,
        studentsCount: 0,
        isBestseller: Boolean(isBestseller),
        grade: grade || 'lop-7',
        productType: productType || 'video',
        instructorName: instructor?.name || 'Giáo viên HMath',
        instructorRole: instructor?.role || 'Thạc sĩ Sư phạm Toán học - Đại học Sư phạm Hà Nội',
        instructorAvatar: instructor?.avatar || 'https://i.postimg.cc/MGshM4ZC/favico.png',
        instructorBio: instructor?.bio || 'Hơn 10 năm kinh nghiệm bồi dưỡng học sinh giỏi Toán THCS.'
      }
    });

    return NextResponse.json({ success: true, course: newCourse });
  } catch (error) {
    console.error('Create Course API Error:', error);
    return NextResponse.json({ error: 'Lỗi tạo khóa học mới.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      slug,
      title,
      shortDescription,
      description,
      price,
      originalPrice,
      thumbnail,
      category,
      level,
      lessonsCount,
      duration,
      isBestseller,
      grade,
      productType,
      instructor
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID khóa học cần chỉnh sửa.' }, { status: 400 });
    }

    const updatedCourse = await db.course.update({
      where: { id },
      data: {
        slug,
        title,
        shortDescription,
        description,
        price: Number(price),
        originalPrice: Number(originalPrice || price),
        thumbnail,
        category,
        level,
        lessonsCount: Number(lessonsCount || 0),
        duration,
        isBestseller: Boolean(isBestseller),
        grade: grade || 'lop-7',
        productType: productType || 'video',
        instructorName: instructor?.name || 'Giáo viên HMath',
        instructorRole: instructor?.role || 'Thạc sĩ Sư phạm Toán học - Đại học Sư phạm Hà Nội',
        instructorAvatar: instructor?.avatar || 'https://i.postimg.cc/MGshM4ZC/favico.png',
        instructorBio: instructor?.bio || 'Hơn 10 năm kinh nghiệm bồi dưỡng học sinh giỏi Toán THCS.'
      }
    });

    return NextResponse.json({ success: true, course: updatedCourse });
  } catch (error) {
    console.error('Update Course API Error:', error);
    return NextResponse.json({ error: 'Lỗi cập nhật thông tin khóa học.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID khóa học cần xóa.' }, { status: 400 });
    }

    // Delete associated lessons and chapters inside a Prisma transaction
    await db.$transaction([
      db.lesson.deleteMany({
        where: {
          chapter: {
            courseId: id
          }
        }
      }),
      db.chapter.deleteMany({
        where: {
          courseId: id
        }
      }),
      db.course.delete({
        where: {
          id
        }
      })
    ]);

    return NextResponse.json({ success: true, message: 'Đã xóa khóa học thành công.' });
  } catch (error) {
    console.error('Delete Course API Error:', error);
    return NextResponse.json({ error: 'Lỗi xóa khóa học từ cơ sở dữ liệu.' }, { status: 500 });
  }
}
