'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { mockOrders } from '../../../../data/orders';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { formatPrice } from '../../../lib/utils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('mock_admin_orders');
    if (stored) {
      try {
        setOrders(JSON.parse(stored));
      } catch (e) {
        setOrders(mockOrders);
      }
    } else {
      localStorage.setItem('mock_admin_orders', JSON.stringify(mockOrders));
    }
  }, []);

  const saveOrders = (newList: typeof mockOrders) => {
    setOrders(newList);
    localStorage.setItem('mock_admin_orders', JSON.stringify(newList));
  };

  const handleApproveOrder = (orderId: string, studentId: string, courseId: string) => {
    // 1. Update order status to completed
    const updatedOrders = orders.map((o) => {
      if (o.id === orderId) {
        return { ...o, status: 'completed' as const };
      }
      return o;
    });
    saveOrders(updatedOrders);

    // 2. Add course to student's purchased library so they gain immediate access
    const storedPurchases = localStorage.getItem(`purchased_${studentId}`);
    let list: string[] = [];
    if (storedPurchases) {
      try {
        list = JSON.parse(storedPurchases);
      } catch (e) {}
    }
    if (!list.includes(courseId)) {
      list.push(courseId);
    }
    localStorage.setItem(`purchased_${studentId}`, JSON.stringify(list));

    alert('Đã phê duyệt đơn hàng thành công! Học viên đã nhận được quyền truy cập khóa học.');
  };

  const handleCancelOrder = (orderId: string) => {
    if (confirm('Bạn chắc chắn muốn hủy giao dịch này?')) {
      const updatedOrders = orders.map((o) => {
        if (o.id === orderId) {
          return { ...o, status: 'failed' as const };
        }
        return o;
      });
      saveOrders(updatedOrders);
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
            placeholder="Tìm kiếm theo mã đơn, tên học viên, email hoặc tên khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-50"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">Trạng thái thanh toán</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">Tất cả trạng thái</option>
            <option value="completed">Thành công (Completed)</option>
            <option value="pending">Chờ xử lý (Pending)</option>
            <option value="failed">Lỗi/Đã hủy (Failed)</option>
          </select>
        </div>
      </div>

      {/* Orders ledger Table inside Card */}
      <Card className="border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead>Học viên</TableHead>
                <TableHead>Khóa học mua</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Hình thức</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
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
                    <TableCell className="font-bold text-xs text-slate-900 select-all">
                      {ord.id}
                    </TableCell>
                    <TableCell className="text-xs max-w-[150px] truncate">
                      <p className="font-bold text-slate-900">{ord.studentName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{ord.studentEmail}</p>
                    </TableCell>
                    <TableCell className="text-xs max-w-xs truncate font-medium text-slate-655">
                      {ord.courseTitle}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-slate-800">
                      {formatPrice(ord.amount)}
                    </TableCell>
                    <TableCell className="text-xs capitalize">
                      {ord.paymentMethod === 'credit_card'
                        ? 'Thẻ tín dụng'
                        : ord.paymentMethod === 'bank_transfer'
                        ? 'Chuyển khoản'
                        : 'PayPal'}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={ord.status === 'completed' ? 'success' : ord.status === 'pending' ? 'warning' : 'danger'}
                        className="text-[9px] px-2 py-0"
                      >
                        {ord.status === 'completed' ? 'Thành công' : ord.status === 'pending' ? 'Chờ duyệt' : 'Đã hủy'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {ord.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleApproveOrder(ord.id, ord.studentId, ord.courseId)}
                            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline bg-transparent"
                          >
                            Duyệt
                          </button>
                          <button
                            onClick={() => handleCancelOrder(ord.id)}
                            className="text-xs font-bold text-red-500 hover:text-red-750 hover:underline bg-transparent"
                          >
                            Hủy
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">
                          {new Date(ord.date).toLocaleDateString('vi-VN')}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
