const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    console.log('Updating durations in DB...');
    await prisma.lesson.update({ where: { id: 'c1-l1' }, data: { duration: '113 phút' } });
    await prisma.lesson.update({ where: { id: 'c1-l2' }, data: { duration: '107 phút' } });
    await prisma.lesson.update({ where: { id: 'c1-l3' }, data: { duration: '112 phút' } });
    await prisma.lesson.update({ where: { id: 'c1-l4' }, data: { duration: '102 phút' } });
    await prisma.lesson.update({ where: { id: 'c1-l5' }, data: { duration: '105 phút' } });
    console.log('SUCCESS! DB durations updated.');
  } catch (err) {
    console.error('Update Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
