'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { formatPrice } from '../../lib/utils';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<{ idx: number; cx: number; cy: number; name: string; value: number } | null>(null);
  const [range, setRange] = useState<'day' | 'month' | 'quarter'>('month');

  // Fetch real-time overview statistics from Database
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/admin/stats?range=${range}`);
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
  }, [range]);

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
  const maxChartValue = Math.max(...salesChartData.map((d: any) => d.value), 100000);

  // Dynamic point coordinates plot calculations
  const points = salesChartData.map((d: any, idx: number) => {
    const cx = 50 + idx * (600 / (salesChartData.length - 1 || 1));
    const cy = 180 - (d.value / maxChartValue) * 140;
    return { cx, cy, name: d.name, value: d.value };
  });

  const linePath = points.map((p: any, idx: number) => `${idx === 0 ? 'M' : 'L'} ${p.cx},${p.cy}`).join(' ');
  const areaPath = points.length > 0 ? `${linePath} L ${points[points.length - 1].cx},200 L ${points[0].cx},200 Z` : '';

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
        <Card className="lg:col-span-2 border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardHeader className="pb-2 border-b border-slate-150 bg-slate-50/20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-sm font-bold text-slate-800">Biểu đồ phân tích doanh thu (2026)</CardTitle>
                <p className="text-[10px] text-slate-400">Doanh thu tích lũy trực tiếp qua cổng thanh toán tự động</p>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button 
                  onClick={() => setRange('day')}
                  className={"px-2 py-1 text-[9px] font-bold rounded-md transition-colors " + (range === 'day' ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-700")}
                >
                  Ngày (7 ngày)
                </button>
                <button 
                  onClick={() => setRange('month')}
                  className={"px-2 py-1 text-[9px] font-bold rounded-md transition-colors " + (range === 'month' ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-700")}
                >
                  Tháng
                </button>
                <button 
                  onClick={() => setRange('quarter')}
                  className={"px-2 py-1 text-[9px] font-bold rounded-md transition-colors " + (range === 'quarter' ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-700")}
                >
                  Quý
                </button>
              </div>
            </div>
          </CardHeader>
          
          {/* Revenue Insights Summary */}
          <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/5 text-center">
            <div className="p-3">
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                {range === 'day' ? 'Cao nhất (Ngày)' : range === 'quarter' ? 'Cao nhất (Quý)' : 'Cao nhất (Tháng)'}
              </p>
              <p className="text-xs font-extrabold text-slate-850 pt-0.5">
                {formatPrice(Math.max(...salesChartData.map((d: any) => d.value), 0))}
              </p>
            </div>
            <div className="p-3">
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                {range === 'day' ? 'Trung bình ngày' : range === 'quarter' ? 'Trung bình quý' : 'Trung bình tháng'}
              </p>
              <p className="text-xs font-extrabold text-indigo-650 pt-0.5">
                {formatPrice(salesChartData.length > 0 ? Math.round(salesChartData.reduce((sum: number, d: any) => sum + d.value, 0) / salesChartData.length) : 0)}
              </p>
            </div>
            <div className="p-3">
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Phương thức</p>
              <p className="text-[10px] font-bold text-emerald-600 pt-1 flex items-center justify-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                PayOS / VietQR
              </p>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="w-full flex flex-col justify-between">
              <div className="relative w-full bg-slate-50/60 rounded-xl border border-slate-150 p-4 min-h-[220px]">
                
                {/* Custom Tooltip Overlay */}
                {hoveredPoint && (
                  <div
                    className="absolute bg-slate-900 text-white px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold shadow-xl border border-slate-850 transition-all duration-150 pointer-events-none z-10 flex flex-col items-center gap-0.5"
                    style={{
                      left: `${(hoveredPoint.cx / 700) * 100}%`,
                      top: `${(hoveredPoint.cy / 200) * 100 - 15}%`,
                      transform: 'translate(-50%, -100%)',
                    }}
                  >
                    <span className="text-slate-400 font-normal text-[9px]">{hoveredPoint.name}</span>
                    <span>{formatPrice(hoveredPoint.value)}</span>
                    <div className="absolute w-2 h-2 bg-slate-900 rotate-45 bottom-[-4px] left-1/2 -translate-x-1/2 border-r border-b border-slate-850"></div>
                  </div>
                )}

                {/* SVG Drawing Canvas */}
                <svg className="w-full h-44 overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
                  {/* Grid Horizontal Lines */}
                  <line x1="0" y1="50" x2="700" y2="50" stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" />
                  <line x1="0" y1="100" x2="700" y2="100" stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" />
                  <line x1="0" y1="150" x2="700" y2="150" stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" />

                  {/* Vertical Hover Guideline */}
                  {hoveredPoint && (
                    <line
                      x1={hoveredPoint.cx}
                      y1="0"
                      x2={hoveredPoint.cx}
                      y2="200"
                      stroke="#818cf8"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      className="transition-all"
                    />
                  )}

                  {/* Gradient Area Definition */}
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Dynamic Area fill */}
                  {areaPath && (
                    <path
                      d={areaPath}
                      fill="url(#chartGradient)"
                      className="transition-all duration-300"
                    />
                  )}

                  {/* Dynamic Main Line stroke */}
                  {linePath && (
                    <path
                      d={linePath}
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-all duration-300"
                    />
                  )}

                  {/* Data Points */}
                  {points.map((p: any, idx: number) => {
                    const isHovered = hoveredPoint?.idx === idx;

                    return (
                      <g key={idx}>
                        {/* Outer Glow Circle on hover */}
                        {isHovered && (
                          <circle
                            cx={p.cx}
                            cy={p.cy}
                            r="10"
                            className="fill-indigo-500/20 stroke-none animate-ping"
                          />
                        )}
                        <circle
                          cx={p.cx}
                          cy={p.cy}
                          r={isHovered ? "6" : "4.5"}
                          onMouseEnter={() => setHoveredPoint({ idx, cx: p.cx, cy: p.cy, name: p.name, value: p.value })}
                          onMouseLeave={() => setHoveredPoint(null)}
                          className={`cursor-pointer transition-all duration-150 ${
                            isHovered 
                              ? 'fill-white stroke-indigo-600 stroke-[3]' 
                              : 'fill-indigo-600 stroke-white stroke-[2]'
                          }`}
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* X Axis labels */}
              <div className="flex justify-between items-center px-6 pt-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {points.map((p: any, idx: number) => (
                  <span key={idx} className={hoveredPoint?.idx === idx ? "text-indigo-600 font-extrabold" : ""}>
                    {p.name}
                  </span>
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
