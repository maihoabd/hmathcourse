const fs = require('fs');
const path = require('path');

const adminOrdersPath = path.join(__dirname, 'src', 'app', 'admin', 'orders', 'page.tsx');

if (fs.existsSync(adminOrdersPath)) {
  const newContent = `'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { formatPrice } from '../../../lib/utils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Load from API on mount
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Fetch admin orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleApproveOrder = async (orderId: string) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: orderId, status: 'completed' }),
      });

      if (response.ok) {
        await fetchOrders(); // Refresh table
        alert('Đã phê duyệt đơn hàng thành công! Học viên đã nhận được quyền truy cập khóa học.');
      } else {
        const errorData = await response.json();
        alert('Lỗi: ' + (errorData.error || 'Không thể phê duyệt đơn hàng.'));
      }
    } catch (err) {
      console.error('Approve order error:', err);
      alert('Lỗi kết nối mạng.');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (confirm('Bạn chắc chắn muốn hủy giao dịch này?')) {
      try {
        const response = await fetch('/api/orders', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: orderId, status: 'failed' }),
        });

        if (response.ok) {
          await fetchOrders(); // Refresh table
        } else {
          const errorData = await response.json();
          alert('Lỗi: ' + (errorData.error || 'Không thể hủy đơn hàng.'));
        }
      } catch (err) {
        console.error('Cancel order error:', err);
        alert('Lỗi kết nối mạng.');
      }
    }
  };

  // Filter orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' || o.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Quản lý đơn hàng</h1>
        <p className="text-slate-500 text-sm">Xem lịch sử giao dịch mua khóa học, phê duyệt hoặc từ chối các khoản thanh toán.</p>
      </div>

      {/* Filters Board Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div className="sm:col-span-2">
          <Input
            label="Tìm kiếm giao dịch"
            placeholder="Tìm theo mã đơn hàng, tên học viên, email hoặc tên khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Trạng thái thanh toán</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-750 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">Tất cả trạng thái</option>
            <option value="completed">Thành công (Completed)</option>
            <option value="pending">Chờ duyệt (Pending)</option>
            <option value="failed">Lỗi / Hủy (Failed)</option>
          </select>
        </div>
      </div>

      {/* Orders log table inside card */}
      <Card className="border-slate-200">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn hàng</TableHead>
                  <TableHead>Học viên</TableHead>
                  <TableHead>Khóa học</TableHead>
                  <TableHead>Học phí</TableHead>
                  <TableHead>Ngày giao dịch</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Phê duyệt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-slate-400">
                      Không tìm thấy giao dịch nào phù hợp.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((ord) => (
                    <TableRow key={ord.id}>
                      <TableCell className="font-mono text-xs font-bold text-slate-800">{ord.id}</TableCell>
                      <TableCell>
                        <div className="text-xs font-bold text-slate-900">{ord.studentName}</div>
                        <div className="text-[10px] text-slate-450">{ord.studentEmail}</div>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-800 max-w-xs truncate">{ord.courseTitle}</TableCell>
                      <TableCell className="text-xs font-bold text-slate-900">{formatPrice(ord.amount)}</TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {new Date(ord.date).toLocaleDateString('vi-VN')} {new Date(ord.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={ord.status === 'completed' ? 'success' : ord.status === 'pending' ? 'warning' : 'danger'}
                          className="text-[10px] px-2 py-0.5"
                        >
                          {ord.status === 'completed' ? 'Thành công' : ord.status === 'pending' ? 'Chờ duyệt' : 'Lỗi / Hủy'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {ord.status === 'pending' && (
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => handleApproveOrder(ord.id)}
                              className="text-xs font-bold text-emerald-600 hover:text-emerald-800 hover:underline bg-transparent"
                            >
                              Duyệt
                            </button>
                            <button
                              onClick={() => handleCancelOrder(ord.id)}
                              className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline bg-transparent"
                            >
                              Hủy
                            </button>
                          </div>
                        )}
                        {ord.status === 'completed' && (
                          <span className="text-xs text-slate-400 italic">Đã kích hoạt</span>
                        )}
                        {ord.status === 'failed' && (
                          <span className="text-xs text-slate-400 italic">Đã từ chối</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
`;
  fs.writeFileSync(adminOrdersPath, newContent, 'utf8');
  console.log('SUCCESS: Patched src/app/admin/orders/page.tsx with database CRUD.');
}
