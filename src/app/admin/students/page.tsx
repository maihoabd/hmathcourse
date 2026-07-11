'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Grant modal states
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
  const [updatingEnrollment, setUpdatingEnrollment] = useState<string | null>(null);

  // Load all courses on mount
  useEffect(() => {
    fetch('/api/courses')
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        if (data) setAllCourses(data);
      })
      .catch((err) => console.error('Fetch catalog courses error:', err));
  }, []);

  const handleOpenGrantModal = (student: any) => {
    setSelectedStudent(student);
    setIsGrantModalOpen(true);
  };

  const handleToggleEnrollment = async (courseId: string, isCurrentlyEnrolled: boolean) => {
    if (!selectedStudent || updatingEnrollment) return;

    setUpdatingEnrollment(courseId);
    try {
      const method = isCurrentlyEnrolled ? 'DELETE' : 'POST';
      const response = await fetch('/api/admin/enrollments', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: selectedStudent.id, courseId }),
      });

      if (response.ok) {
        // Update local list
        let updatedEnrolled = [...selectedStudent.enrolledCourses];
        if (isCurrentlyEnrolled) {
          updatedEnrolled = updatedEnrolled.filter((e: any) => e.courseId !== courseId);
        } else {
          const cDetails = allCourses.find((c) => c.id === courseId);
          updatedEnrolled.push({
            courseId,
            courseTitle: cDetails?.title || 'Khóa học',
            progress: 0,
          });
        }

        const updatedStudent = {
          ...selectedStudent,
          enrolledCourses: updatedEnrolled,
        };

        setSelectedStudent(updatedStudent);
        
        // Refresh local student record
        setStudents((prev) =>
          prev.map((s) => (s.id === selectedStudent.id ? updatedStudent : s))
        );
      } else {
        const errorData = await response.json();
        alert('Lỗi: ' + (errorData.error || 'Không thể cập nhật đăng ký khóa học.'));
      }
    } catch (err) {
      console.error('Toggle enrollment error:', err);
      alert('Lỗi kết nối mạng.');
    } finally {
      setUpdatingEnrollment(null);
    }
  };
  const [statusFilter, setStatusFilter] = useState('All');

  // Load from API on mount
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/students');
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (err) {
      console.error('Fetch admin students error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleToggleStatus = async (studentId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const response = await fetch('/api/admin/students', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: studentId, status: newStatus }),
      });

      if (response.ok) {
        await fetchStudents(); // Refresh list
      } else {
        const errorData = await response.json();
        alert('Lỗi: ' + (errorData.error || 'Không thể cập nhật trạng thái học viên.'));
      }
    } catch (err) {
      console.error('Toggle student status error:', err);
      alert('Lỗi kết nối mạng.');
    }
  };

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.phone && s.phone.includes(searchTerm));
      
      const matchesStatus =
        statusFilter === 'All' || s.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [students, searchTerm, statusFilter]);

  // Helper to map course names
  const getCourseNames = (enrolledList: any[]) => {
    if (!enrolledList || enrolledList.length === 0) return 'Chưa đăng ký';
    
    return enrolledList
      .map((e) => {
        return e.courseTitle + ' (' + e.progress + '%)';
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
            placeholder="Tìm học viên theo tên, email hoặc số điện thoại..."
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
            className="flex h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-750 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  <TableHead>Học viên</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Ngày đăng ký</TableHead>
                  <TableHead>Khóa học tham gia & Tiến trình</TableHead>
                  <TableHead className="text-center">Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-slate-400">
                      Không tìm thấy học viên nào phù hợp.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((stud) => (
                    <TableRow key={stud.id}>
                      <TableCell className="max-w-xs truncate">
                        <div className="flex items-center gap-3">
                          {stud.avatar ? (
                            <img
                              src={stud.avatar}
                              alt={stud.name}
                              className="h-8 w-8 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs border border-indigo-200 shrink-0">
                              {stud.name ? stud.name.charAt(0).toUpperCase() : 'H'}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-xs truncate text-slate-900">{stud.name}</p>
                            <p className="text-[10px] text-slate-450">{stud.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-700">
                        {stud.phone || 'Chưa cập nhật'}
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
                        <Badge variant={stud.status === 'active' ? 'success' : 'danger'} className="text-[9px] px-2 py-0 border-0">
                          {stud.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-3">
                        <button
                          onClick={() => handleOpenGrantModal(stud)}
                          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline bg-transparent"
                        >
                          🔑 Cấp khóa học
                        </button>
                        <button
                          onClick={() => handleToggleStatus(stud.id, stud.status)}
                          className={"text-xs font-semibold hover:underline bg-transparent " + (stud.status === 'active' ? 'text-red-500 hover:text-red-700' : 'text-indigo-600 hover:text-indigo-850')}
                        >
                          {stud.status === 'active' ? 'Khóa' : 'Kích hoạt'}
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Grant Course Modal Box */}
      {isGrantModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 space-y-5 border border-slate-200 shadow-2xl animate-slide-up">
            
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">Cấp quyền khóa học</h2>
              <p className="text-xs text-slate-500 leading-normal">
                Học viên: <span className="font-bold text-slate-800">{selectedStudent.name}</span> ({selectedStudent.email})
              </p>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/20">
              {allCourses.map((course) => {
                const isEnrolled = selectedStudent.enrolledCourses.some((e: any) => e.courseId === course.id);
                const isUpdating = updatingEnrollment === course.id;

                return (
                  <div key={course.id} className="flex items-center justify-between p-4 bg-white first:pt-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-9 w-12 rounded object-cover bg-slate-100"
                      />
                      <div className="text-left">
                        <p className="font-bold text-slate-850 text-xs line-clamp-1">{course.title}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">{course.category}</p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {isUpdating ? (
                        <div className="h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <input
                          type="checkbox"
                          checked={isEnrolled}
                          onChange={() => handleToggleEnrollment(course.id, isEnrolled)}
                          className="h-4.5 w-4.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <Button onClick={() => setIsGrantModalOpen(false)} className="w-full text-xs">
                Đóng hộp thoại
              </Button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
