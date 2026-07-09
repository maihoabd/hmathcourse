'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { mockStudents } from '../../../../data/students';
import { mockCourses } from '../../../../data/courses';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('mock_admin_students');
    if (stored) {
      try {
        setStudents(JSON.parse(stored));
      } catch (e) {
        setStudents(mockStudents);
      }
    } else {
      localStorage.setItem('mock_admin_students', JSON.stringify(mockStudents));
    }
  }, []);

  const saveStudents = (newList: typeof mockStudents) => {
    setStudents(newList);
    localStorage.setItem('mock_admin_students', JSON.stringify(newList));
  };

  const handleToggleStatus = (studentId: string) => {
    const updated = students.map((s) => {
      if (s.id === studentId) {
        return {
          ...s,
          status: s.status === 'active' ? ('suspended' as const) : ('active' as const)
        };
      }
      return s;
    });
    saveStudents(updated);
  };

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus =
        statusFilter === 'All' || s.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [students, searchTerm, statusFilter]);

  // Helper to map course names
  const getCourseNames = (enrolledList: typeof mockStudents[0]['enrolledCourses']) => {
    if (enrolledList.length === 0) return 'Chưa đăng ký';
    
    return enrolledList
      .map((e) => {
        const course = mockCourses.find((c) => c.id === e.courseId);
        return course ? `${course.title} (${e.progress}%)` : `Khóa học ${e.courseId} (${e.progress}%)`;
      })
      .join(', ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Quản lý học viên</h1>
        <p className="text-slate-500 text-sm">Xem hồ sơ, tiến độ học tập và quản lý trạng thái tài khoản học viên.</p>
      </div>

      {/* Filter Options */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div className="sm:col-span-2">
          <Input
            placeholder="Tìm học viên theo tên hoặc địa chỉ email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-50"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">Trạng thái tài khoản</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">Tất cả trạng thái</option>
            <option value="active">Hoạt động (Active)</option>
            <option value="suspended">Bị khóa (Suspended)</option>
          </select>
        </div>
      </div>

      {/* Students list Table inside Card */}
      <Card className="border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Học viên</TableHead>
                <TableHead>Ngày đăng ký</TableHead>
                <TableHead>Khóa học tham gia & Tiến trình</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-slate-400">
                    Không tìm thấy học viên nào phù hợp.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((stud) => (
                  <TableRow key={stud.id}>
                    <TableCell className="max-w-xs truncate">
                      <div className="flex items-center gap-3">
                        <img
                          src={stud.avatar}
                          alt={stud.name}
                          className="h-8 w-8 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-xs truncate text-slate-900">{stud.name}</p>
                          <p className="text-[10px] text-slate-400">{stud.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      {new Date(stud.registeredAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell className="text-xs max-w-sm">
                      <p className="line-clamp-2 text-slate-600 font-medium">
                        {getCourseNames(stud.enrolledCourses)}
                      </p>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={stud.status === 'active' ? 'success' : 'danger'} className="text-[9px] px-2 py-0">
                        {stud.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() => handleToggleStatus(stud.id)}
                        className={`text-xs font-semibold hover:underline bg-transparent ${
                          stud.status === 'active' ? 'text-red-500 hover:text-red-750' : 'text-indigo-600 hover:text-indigo-850'
                        }`}
                      >
                        {stud.status === 'active' ? 'Khóa' : 'Kích hoạt'}
                      </button>
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
