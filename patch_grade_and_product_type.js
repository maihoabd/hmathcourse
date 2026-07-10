const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, 'prisma', 'seed.ts');
const coursesPath = path.join(__dirname, 'data', 'courses.ts');

function patchSeedFile() {
  if (!fs.existsSync(seedPath)) {
    console.warn(`File not found: ${seedPath}`);
    return;
  }
  let content = fs.readFileSync(seedPath, 'utf8');

  // Insert grade and productType in course 1 definition
  content = content.replace(
    /id:\s*'c1',.*?instructorBio:\s*['"][^'"]+['"],/gs,
    (match) => `${match}\n      grade: 'lop-7',\n      productType: 'video',`
  );

  // Insert grade and productType in course 2 definition
  content = content.replace(
    /id:\s*'c2',.*?instructorBio:\s*['"][^'"]+['"],/gs,
    (match) => `${match}\n      grade: 'lop-8',\n      productType: 'video',`
  );

  fs.writeFileSync(seedPath, content, 'utf8');
  console.log('SUCCESS: Patched prisma/seed.ts with grade and productType.');
}

function patchCoursesFile() {
  if (!fs.existsSync(coursesPath)) {
    console.warn(`File not found: ${coursesPath}`);
    return;
  }
  let content = fs.readFileSync(coursesPath, 'utf8');

  // Insert grade and productType for c1 in mockCourses
  content = content.replace(
    /id:\s*'c1',.*?isBestseller:\s*true,/gs,
    (match) => `${match}\n    grade: 'lop-7',\n    productType: 'video',`
  );

  // Insert grade and productType for c2 in mockCourses
  content = content.replace(
    /id:\s*'c2',.*?isBestseller:\s*false,/gs,
    (match) => `${match}\n    grade: 'lop-8',\n    productType: 'video',`
  );

  fs.writeFileSync(coursesPath, content, 'utf8');
  console.log('SUCCESS: Patched data/courses.ts with grade and productType.');
}

patchSeedFile();
patchCoursesFile();

// Database backfill using Prisma Client
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function backfillDB() {
  try {
    console.log('Backfilling DB courses with grade and productType values...');
    await prisma.course.update({
      where: { id: 'c1' },
      data: {
        grade: 'lop-7',
        productType: 'video'
      }
    });

    await prisma.course.update({
      where: { id: 'c2' },
      data: {
        grade: 'lop-8',
        productType: 'video'
      }
    });
    console.log('SUCCESS: DB backfill successfully completed.');
  } catch (err) {
    console.error('DB Backfill Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

backfillDB();
