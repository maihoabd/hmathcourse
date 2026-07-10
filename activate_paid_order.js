const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const orderId = 'HM329055-c1';
  const userId = 'b0265a88-fa78-41d7-83a5-eece1a6a3b13';
  const courseId = 'c1';

  try {
    console.log(`Activating paid order ${orderId} in database...`);
    
    // Update order status to completed
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'completed' }
    });

    // Create student enrollment
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      },
      create: {
        userId,
        courseId,
        progress: 0,
        completedLessons: []
      },
      update: {
        lastAccessed: new Date()
      }
    });

    console.log('SUCCESS! Order activated and enrollment created in database.');
  } catch (err) {
    console.error('Activation Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
