'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/auth-context';
import { mockCourses } from '../../../data/courses';
import { mockStudents } from '../../../data/students';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { formatPrice } from '../../lib/utils';

interface UserEnrolledMerge {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  category: string;
  lessonsCount: number;
  progress: number;
  completedCount: number;
  lastAccessed: string;
}

export default function StudentDashboardPage() {
  const { user, loading, updateUserSession } = useAuth();
  const router = useRouter();
  const [coursesMerged, setCoursesMerged] = useState<UserEnrolledMerge[]>([]);
  const [mounted, setMounted] = useState(false);

    const [profileName, setProfileName] = useState(user?.name || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      alert('Họ tên không được để trống.');
      return;
    }
    if (newPassword && newPassword.length < 6) {
      alert('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert('Mật khẩu nhập lại không trùng khớp.');
      return;
    }

    setUpdatingProfile(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          name: profileName.trim(),
          password: newPassword || undefined,
        }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        updateUserSession(updatedUser);
        setNewPassword('');
        setConfirmNewPassword('');
        alert('Cập nhật thông tin thành công.');
      } else {
        const errData = await res.json();
        alert('Lỗi: ' + (errData.error || 'Không thể cập nhật thông tin.'));
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối máy chủ.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Guard routing
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login?redirect=/dashboard');
    }
  }, [user, loading, router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch course list from Supabase and sync local cache
  useEffect(() => {
    if (!mounted || !user) return;

    const syncEnrollments = async () => {
      try {
        const res = await fetch(`/api/enrollments?userId=${user.id}`);
        if (res.ok) {
          const enrollments = await res.json();
          // Extract enrolled course IDs
          const dbCourseIds = enrollments.map((e: any) => e.courseId);
          
          // Sync with local storage so that other pages (like course detail) update instantly
          localStorage.setItem(`purchased_${user.id}`, JSON.stringify(dbCourseIds));

          // Map details from live database course registry, with fallback to mockCourses
          const mergedList: UserEnrolledMerge[] = enrollments.map((e: any) => {
            const details = mockCourses.find((c: any) => c.id === e.courseId);
            return {
              id: e.courseId,
              title: e.course?.title || details?.title || 'Khóa học',
              slug: e.course?.slug || details?.slug || '',
              thumbnail: e.course?.thumbnail || details?.thumbnail || '',
              category: e.course?.category || details?.category || '',
              lessonsCount: e.course?.lessonsCount || details?.lessonsCount || 0,
              progress: e.progress,
              completedCount: e.completedLessons?.length || 0,
              lastAccessed: e.lastAccessed || new Date().toISOString(),
            };
          });

          // Sort by last accessed
          mergedList.sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime());
          setCoursesMerged(mergedList);
        }
      } catch (err) {
        console.error('Sync enrollments error:', err);
      }
    };

    syncEnrollments();
  }, [user, mounted]);

  if (loading || !mounted) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-10 sm:px-6 lg:px-8 space-y-8 flex-1">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-900 text-white rounded-2xl gap-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-850 to-indigo-900 opacity-90" />
        <div className="relative flex items-center gap-4">
          {user.avatar && !user.avatar.includes('unsplash.com') ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-16 w-16 rounded-full object-cover border-2 border-indigo-400"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl border-2 border-indigo-400">
              {user.name ? user.name.charAt(0).toUpperCase() : 'H'}
            </div>
          )}
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Chào mừng quay lại, {user.name}!</h1>
            <p className="text-xs text-slate-400">Tài khoản học viên của bạn đang hoạt động bình thường.</p>
          </div>
        </div>
        <div className="relative shrink-0 flex gap-2">
          <Link href="/courses">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 shadow-md">
              Học thêm khóa mới
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Profile Card column */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-slate-200">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-base">Thông tin học tập</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Khóa học đã đăng ký:</span>
                <span className="font-bold text-slate-900">{coursesMerged.length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Khóa học hoàn thành:</span>
                <span className="font-bold text-slate-900">
                  {coursesMerged.filter((c) => c.progress === 100).length}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-500">Số điện thoại:</span>
                <span className="font-bold text-slate-900">{user?.phone || 'Chưa cập nhật'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Personal Info Profile settings card */}
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-800">Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <form onSubmit={handleUpdateProfile} className="space-y-3">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Họ và Tên</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Địa chỉ Email (Không được đổi)</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-slate-100 text-slate-400 border border-slate-200 rounded px-2.5 py-1 text-xs cursor-not-allowed font-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Số điện thoại (Không được đổi)</label>
                  <input
                    type="tel"
                    value={user?.phone || 'Chưa cập nhật'}
                    disabled
                    className="w-full bg-slate-100 text-slate-400 border border-slate-200 rounded px-2.5 py-1 text-xs cursor-not-allowed font-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Mật khẩu mới (Để trống nếu không đổi)</label>
                  <input
                    type="password"
                    placeholder="Tối thiểu 6 ký tự"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                  />
                </div>
                {newPassword && (
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Nhập lại mật khẩu mới</label>
                    <input
                      type="password"
                      placeholder="Xác nhận mật khẩu mới"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                      required
                    />
                  </div>
                )}
                <Button type="submit" size="sm" className="w-full bg-indigo-600 hover:bg-indigo-750 text-xs" loading={updatingProfile}>
                  Cập nhật tài khoản
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Registered Courses list Grid */}
        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Khóa học của tôi</h2>

          {coursesMerged.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-xl space-y-4 max-w-lg mx-auto">
              <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-800">Chưa đăng ký khóa học nào</h3>
                <p className="text-xs text-slate-400">Đăng ký một khóa học bất kỳ để bắt đầu bài giảng của bạn.</p>
              </div>
              <Link href="/courses">
                <Button size="sm">Xem danh mục khóa học</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {coursesMerged.map((item) => (
                <Card key={item.id} className="overflow-hidden border-slate-200 hover:shadow-md transition-shadow">
                  <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="bg-slate-900/80 text-white backdrop-blur-xs border-0 text-[10px]">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-bold text-slate-900 line-clamp-1">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-4">
                    {/* Progress tracking */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                        <span>Tiến độ học tập:</span>
                        <span className="text-indigo-600">{item.progress}%</span>
                      </div>
                      <Progress value={item.progress} />
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>Đã học: <b>{item.completedCount}</b>/{item.lessonsCount} bài</span>
                        {item.progress === 100 ? (
                          <span className="text-emerald-600 font-bold">Hoàn thành</span>
                        ) : (
                          <span>Đang học</span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        Truy cập cuối: {new Date(item.lastAccessed).toLocaleDateString('vi-VN')}
                      </span>
                      <Link href={`/courses/${item.slug}/learn`}>
                        <Button size="sm" variant={item.progress === 100 ? 'outline' : 'primary'}>
                          {item.progress === 0 ? 'Bắt đầu học' : 'Học tiếp'}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
