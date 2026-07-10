const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function dump() {
  try {
    console.log('Connecting to database...');
    
    // Fetch last 10 orders
    const orders = await prisma.order.findMany({
      orderBy: { date: 'desc' },
      take: 10
    });
    
    console.log('\n--- RECENT ORDERS ---');
    if (orders.length === 0) {
      console.log('No orders found.');
    }
    for (const o of orders) {
      console.log(`Order ID: ${o.id}`);
      console.log(`User ID: ${o.userId}`);
      console.log(`Course ID: ${o.courseId}`);
      console.log(`Amount: ${o.amount}`);
      console.log(`Status: ${o.status}`);
      console.log(`Created At: ${o.createdAt}`);
      console.log('------------------------');
    }
    
    // Fetch last 10 enrollments
    const enrollments = await prisma.enrollment.findMany({
      orderBy: { lastAccessed: 'desc' },
      take: 10
    });
    
    console.log('\n--- RECENT ENROLLMENTS ---');
    if (enrollments.length === 0) {
      console.log('No enrollments found.');
    }
    for (const e of enrollments) {
      console.log(`Enrollment ID: ${e.id}`);
      console.log(`User ID: ${e.userId}`);
      console.log(`Course ID: ${e.courseId}`);
      console.log(`Progress: ${e.progress}%`);
      console.log(`Last Accessed: ${e.lastAccessed}`);
      console.log('------------------------');
    }

  } catch (err) {
    console.error('Error querying database:', err);
  } finally {
    await prisma.$disconnect();
  }
}

dump();
