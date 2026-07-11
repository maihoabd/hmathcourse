const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'app', 'api', 'admin', 'stats', 'route.ts');

if (fs.existsSync(targetPath)) {
  let content = fs.readFileSync(targetPath, 'utf8');

  // 1. Read query parameters in GET
  const queryParamTarget = "export async function GET(request: Request) {";
  const queryParamReplacement = `export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || 'month';`;

  if (content.includes(queryParamTarget)) {
    content = content.replace(queryParamTarget, queryParamReplacement);
    console.log('Added searchParams query reader.');
  }

  // 2. Replace the old hardcoded sales chart computation section with the dynamic database grouping
  const oldComputationTarget = `    // 5. Compute sales chart data (Jan - Jul)
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
    }));`;

  const newComputationReplacement = `    // 5. Compute sales chart data dynamically based on active PayOS completed orders (No demo values)
    const allCompletedOrders = await db.order.findMany({
      where: {
        status: 'completed',
        paymentMethod: 'payos' // Filter only completed PayOS payments
      }
    });

    let salesChartData: any[] = [];

    if (range === 'day') {
      // Daily revenue for the last 7 days
      const dayData = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStr = \`\${String(d.getDate()).padStart(2, '0')}/\${String(d.getMonth() + 1).padStart(2, '0')}\`;
        
        let sum = 0;
        allCompletedOrders.forEach((order) => {
          const oDate = new Date(order.date);
          if (
            oDate.getDate() === d.getDate() &&
            oDate.getMonth() === d.getMonth() &&
            oDate.getFullYear() === d.getFullYear()
          ) {
            sum += order.amount;
          }
        });
        dayData.push({ name: dayStr, value: sum });
      }
      salesChartData = dayData;
    } else if (range === 'quarter') {
      // Quarterly revenue for 2026 (Q1, Q2, Q3, Q4)
      const quarterValues = [0, 0, 0, 0];
      allCompletedOrders.forEach((order) => {
        const oDate = new Date(order.date);
        if (oDate.getFullYear() === 2026) {
          const month = oDate.getMonth();
          if (month >= 0 && month <= 2) quarterValues[0] += order.amount;
          else if (month >= 3 && month <= 5) quarterValues[1] += order.amount;
          else if (month >= 6 && month <= 8) quarterValues[2] += order.amount;
          else if (month >= 9 && month <= 11) quarterValues[3] += order.amount;
        }
      });
      salesChartData = [
        { name: 'Quý 1', value: quarterValues[0] },
        { name: 'Quý 2', value: quarterValues[1] },
        { name: 'Quý 3', value: quarterValues[2] },
        { name: 'Quý 4', value: quarterValues[3] }
      ];
    } else {
      // Monthly revenue for the 12 months of 2026
      const monthValues = new Array(12).fill(0);
      allCompletedOrders.forEach((order) => {
        const oDate = new Date(order.date);
        if (oDate.getFullYear() === 2026) {
          const month = oDate.getMonth();
          monthValues[month] += order.amount;
        }
      });
      const monthNames = [
        'Th 1', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6',
        'Th 7', 'Th 8', 'Th 9', 'Th 10', 'Th 11', 'Th 12'
      ];
      salesChartData = monthNames.map((m, idx) => ({
        name: m,
        value: monthValues[idx]
      }));
    }`;

  if (content.includes(oldComputationTarget)) {
    content = content.replace(oldComputationTarget, newComputationReplacement);
    console.log('SUCCESS: Swapped salesChartData computation logic.');
  } else {
    console.log('ERROR: Old computation target could not be found.');
  }

  fs.writeFileSync(targetPath, content, 'utf8');
}
