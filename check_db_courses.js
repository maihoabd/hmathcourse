const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    console.log('Connecting to database...');
    const courses = await prisma.course.findMany({
      include: {
        chapters: {
          include: {
            lessons: true
          }
        }
      }
    });

    console.log(`Found ${courses.length} courses:`);
    for (const c of courses) {
      console.log(`- Course ID: ${c.id}`);
      console.log(`  Title: ${c.title}`);
      console.log(`  Slug: ${c.slug}`);
      console.log(`  Chapters Count: ${c.chapters.length}`);
      for (const ch of c.chapters) {
        console.log(`    * Chapter: ${ch.title} (${ch.lessons.length} lessons)`);
      }
    }
  } catch (err) {
    console.error('Error querying database:', err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
