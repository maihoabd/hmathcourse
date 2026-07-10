const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const slug = 'khoa-hoc-toan-nang-cao-lop-7-bo-sach-ket-noi-tri-thuc';
  console.log(`Testing API resolver for slug: ${slug}`);
  try {
    const course = await prisma.course.findUnique({
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
      console.log('Error: Course not found in database!');
      return;
    }

    const mapped = {
      ...course,
      instructor: {
        name: course.instructorName,
        role: course.instructorRole,
        avatar: course.instructorAvatar,
        bio: course.instructorBio,
        coursesCount: 2,
        rating: 4.9
      }
    };

    console.log('SUCCESS! API output preview:');
    console.log(`ID: ${mapped.id}`);
    console.log(`Title: ${mapped.title}`);
    console.log(`Price: ${mapped.price}`);
    console.log(`Chapters Count: ${mapped.chapters.length}`);
    if (mapped.chapters.length > 0) {
      console.log('First Chapter lessons count:', mapped.chapters[0].lessons.length);
      console.log('First Lesson title:', mapped.chapters[0].lessons[0]?.title);
    }
  } catch (err) {
    console.error('API Simulation Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
