const fs = require('fs');
const path = require('path');

const statsRoutePath = path.join(__dirname, 'src', 'app', 'api', 'admin', 'stats', 'route.ts');
const adminPagePath = path.join(__dirname, 'src', 'app', 'admin', 'page.tsx');

// 1. Update stats API to include bestsellerCoursesCount
if (fs.existsSync(statsRoutePath)) {
  let content = fs.readFileSync(statsRoutePath, 'utf8');

  // Insert bestsellerCoursesCount query logic
  const queryInsert = `    // 3. Fetch total courses count
    const totalCoursesCount = await db.course.count();

    const bestsellerCoursesCount = await db.course.count({
      where: { isBestseller: true }
    });`;

  content = content.replace(
    /\/\/ 3\. Fetch total courses count.*?const totalCoursesCount = await db\.course\.count\(\);/s,
    queryInsert
  );

  // Return bestsellerCoursesCount in JSON
  content = content.replace(
    /totalCourses: totalCoursesCount,/g,
    'totalCourses: totalCoursesCount,\n      bestsellerCoursesCount,'
  );

  fs.writeFileSync(statsRoutePath, content, 'utf8');
  console.log('SUCCESS: Updated admin stats API with bestsellerCoursesCount.');
}

// 2. Update E:\sale\src\app\admin\page.tsx
if (fs.existsSync(adminPagePath)) {
  const newAdminPageContent = `'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { formatPrice } from '../../lib/utils';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch real-time overview statistics from Database
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Fetch admin stats error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center py-20 flex-1">
        <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  const { salesChartData, recentOrders } = stats;
  const maxChartValue = Math.max(...salesChartData.map((d: any) => d.value), 1000000);

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Tổng quan báo cáo</h1>
          <p className="text-slate-500 text-sm">Xem tình hình tăng trưởng học viên, doanh thu và thống kê khóa học.</p>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Tổng doanh thu</span>
              <svg className="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900">{formatPrice(stats.totalRevenue)}</h3>
              <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                <span>↑ 18.2%</span> <span className="text-slate-400 font-normal">so với tháng trước</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Active Students */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Học viên hoạt động</span>
              <svg className="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900">{stats.activeStudents}</h3>
              <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                <span>↑ 8.4%</span> <span className="text-slate-400 font-normal">học viên mới tuần này</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Total Courses */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Khóa học đăng tải</span>
              <svg className="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900">{stats.totalCourses}</h3>
              <p className="text-[10px] text-slate-450 font-medium">
                Gồm {stats.bestsellerCoursesCount} khóa bán chạy nổi bật
              </p>
            </div>
          </CardContent>
        </Card>

        {/* New Orders */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Đơn hàng mới</span>
              <svg className="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900">{stats.newOrdersCount}</h3>
              <p className="text-[10px] text-slate-450 font-medium">
                Giao dịch phát sinh trong 7 ngày qua
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Chart & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Chart (Left 2 Cols) */}
        <Card className="lg:col-span-2 border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">Biểu đồ doanh thu năm 2026</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {/* Custom SVG Line Area Chart for 100% build compatibility and beauty */}
            <div className="w-full h-64 flex flex-col justify-between">
              <div className="relative flex-1 w-full bg-slate-50 rounded-xl border border-slate-100 p-4">
                {/* SVG Drawing */}
                <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="50" x2="700" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="100" x2="700" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="150" x2="700" y2="150" stroke="#f1f5f9" strokeWidth="1" />

                  {/* Gradient Area Definition */}
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Dynamic Path Calculation */}
                  <path
                    d={\`
                      M 50,200
                      L 50,\${180 - (salesChartData[0].value / maxChartValue) * 140}
                      L 150,\${180 - (salesChartData[1].value / maxChartValue) * 140}
                      L 250,\${180 - (salesChartData[2].value / maxChartValue) * 140}
                      L 350,\${180 - (salesChartData[3].value / maxChartValue) * 140}
                      L 450,\${180 - (salesChartData[4].value / maxChartValue) * 140}
                      L 550,\${180 - (salesChartData[5].value / maxChartValue) * 140}
                      L 650,\${180 - (salesChartData[6].value / maxChartValue) * 140}
                      L 650,200 Z
                    \`}
                    fill="url(#chartGradient)"
                  />

                  {/* Main Line Stroke */}
                  <path
                    d={\`
                      M 50,\${180 - (salesChartData[0].value / maxChartValue) * 140}
                      L 150,\${180 - (salesChartData[1].value / maxChartValue) * 140}
                      L 250,\${180 - (salesChartData[2].value / maxChartValue) * 140}
                      L 350,\${180 - (salesChartData[3].value / maxChartValue) * 140}
                      L 450,\${180 - (salesChartData[4].value / maxChartValue) * 140}
                      L 550,\${180 - (salesChartData[5].value / maxChartValue) * 140}
                      L 650,\${180 - (salesChartData[6].value / maxChartValue) * 140}
                    \`}
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Data Points */}
                  {salesChartData.map((d: any, idx: number) => {
                    const cx = 50 + idx * 100;
                    const cy = 180 - (d.value / maxChartValue) * 140;
                    return (
                      <g key={idx}>
                        <circle
                          cx={cx}
                          cy={cy}
                          r="5"
                          className="fill-indigo-600 stroke-white cursor-pointer hover:r-7 transition-all"
                          strokeWidth="2"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* X Axis labels */}
              <div className="flex justify-between items-center px-8 pt-2 text-[11px] font-bold text-slate-400">
                {salesChartData.map((d: any, idx: number) => (
                  <span key={idx}>{d.name}</span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders log ledger (Right 1 Col) */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-900">Đơn hàng gần đây</CardTitle>
            <Link href="/admin/orders" className="text-[11px] font-semibold text-indigo-600 hover:underline">
              Xem tất cả
            </Link>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            <div className="divide-y divide-slate-100 space-y-3">
              {recentOrders.map((ord: any) => (
                <div key={ord.id} className="flex items-start justify-between gap-3 pt-3 first:pt-0">
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{ord.studentName}</p>
                    <p className="text-[10px] text-slate-450 truncate">{ord.courseTitle}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-slate-900">{formatPrice(ord.amount)}</p>
                    <Badge
                      variant={ord.status === 'completed' ? 'success' : ord.status === 'pending' ? 'warning' : 'danger'}
                      className="text-[9px] px-1 py-0"
                    >
                      {ord.status === 'completed' ? 'Thành công' : ord.status === 'pending' ? 'Chờ duyệt' : 'Lỗi'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
`;
  fs.writeFileSync(adminPagePath, newAdminPageContent, 'utf8');
  console.log('SUCCESS: Rewired src/app/admin/page.tsx to stats API.');
}
