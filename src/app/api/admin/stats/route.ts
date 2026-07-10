import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET(request: Request) {
  try {
    // 1. Fetch completed orders and calculate total revenue
    const completedOrders = await db.order.findMany({
      where: { status: 'completed' }
    });
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.amount, 0);

    // 2. Fetch active students (users with role = student and status = active)
    const activeStudentsCount = await db.user.count({
      where: {
        role: 'student',
        status: 'active'
      }
    });

        // 3. Fetch total courses count
    const totalCoursesCount = await db.course.count();

    const bestsellerCoursesCount = await db.course.count({
      where: { isBestseller: true }
    });

    // 4. Fetch new orders count in the last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const newOrdersCount = await db.order.count({
      where: {
        date: {
          gte: weekAgo
        }
      }
    });

    // 5. Compute sales chart data (Jan - Jul)
    const months = ['Th 1', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];
    // Base pre-vercel startup seed metrics
    const revenueByMonth = [1200000, 2400000, 1800000, 3200000, 4500000, 5800000, 7200000];
    
    // Add real database completed orders
    const allCompletedOrders = await db.order.findMany({
      where: { status: 'completed' }
    });
    
    allCompletedOrders.forEach((order) => {
      const orderDate = new Date(order.date);
      const month = orderDate.getMonth();
      const year = orderDate.getFullYear();
      
      // Map to 2026 months
      if (year === 2026) {
        if (month >= 0 && month <= 6) {
          revenueByMonth[month] += order.amount;
        }
      }
    });

    const salesChartData = months.map((m, idx) => ({
      name: m,
      value: revenueByMonth[idx]
    }));

    // 6. Fetch 5 most recent orders with user and course details
    const recentOrdersDb = await db.order.findMany({
      take: 5,
      orderBy: {
        date: 'desc'
      },
      include: {
        user: true,
        course: true
      }
    });

    const recentOrders = recentOrdersDb.map(o => ({
      id: o.id,
      studentId: o.userId,
      studentName: o.user.name,
      studentEmail: o.user.email,
      courseId: o.courseId,
      courseTitle: o.course.title,
      amount: o.amount,
      paymentMethod: o.paymentMethod,
      status: o.status,
      date: o.date.toISOString()
    }));

    return NextResponse.json({
      totalRevenue,
      activeStudents: activeStudentsCount,
      totalCourses: totalCoursesCount,
      bestsellerCoursesCount,
      newOrdersCount,
      salesChartData,
      recentOrders
    });
  } catch (error) {
    console.error('Fetch Admin Stats Error:', error);
    return NextResponse.json({ error: 'Lỗi lấy thống kê báo cáo.' }, { status: 500 });
  }
}
