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
