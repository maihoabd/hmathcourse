'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/auth-context';
import { useCart } from '../../../context/cart-context';
import { Button } from '../../../components/ui/button';
import { Card, CardHeader, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { formatPrice, cn } from '../../../lib/utils';
import { Dialog } from '../../../components/ui/dialog';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart, isInCart } = useCart();
  const [course, setCourse] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'reviews'>('overview');
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  const slug = params?.slug as string;

  // Fetch live enrollment info if logged in
  useEffect(() => {
    if (user && course) {
      fetch(`/api/enrollments?userId=${user.id}`)
        .then((res) => {
          if (res.ok) return res.json();
        })
        .then((data) => {
          if (data && Array.isArray(data)) {
            const matched = data.find((e: any) => e.courseId === course.id);
            if (matched) {
              setEnrollment(matched);
            }
          }
        })
        .catch((err) => console.error('Fetch enrollment details error:', err));
    }
  }, [user, course]);

  // Fetch course details dynamically from Supabase API
  useEffect(() => {
    if (!slug) return;
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          setCourse(data);
          // Auto expand first chapter
          if (data.chapters && data.chapters.length > 0) {
            setExpandedChapters({ [data.chapters[0].id]: true });
          }
        }
      } catch (err) {
        console.error('Fetch course detail error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [slug]);

  // Check enrollment status of logged-in student (or admin access)
  const isEnrolled = useMemo(() => {
    if (!user || !course) return false;
    
    // Admins bypass enrollment and have full access to all courses
    if (user.role === 'admin') return true;

    return enrollment !== null;
  }, [user, course, enrollment]);

  const handleLessonClick = (lesson: any) => {
    if (!user) {
      if (confirm('Vui lòng đăng ký tài khoản miễn phí để xem video học thử.')) {
        router.push(`/register?redirect=${encodeURIComponent(window.location.pathname)}`);
      }
      return;
    }
    if (isEnrolled) {
      router.push(`/courses/${course.slug}/learn?lessonId=${lesson.id}`);
    } else if (lesson.isPreview) {
      setSelectedLesson(lesson);
      setIsLessonModalOpen(true);
    } else {
      alert('Vui lòng đăng ký hoặc mua khóa học này để xem nội dung bài học.');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-4 flex-1">
        <h2 className="text-2xl font-bold text-slate-800">Không tìm thấy khóa học</h2>
        <p className="text-slate-500 text-sm">Đường dẫn khóa học không tồn tại hoặc đã bị gỡ bỏ.</p>
        <Button onClick={() => router.push('/courses')}>Quay lại danh mục</Button>
      </div>
    );
  }

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  const handleEnrollClick = () => {
    if (!user) {
      // Redirect to login if guest
      router.push('/login?redirect=' + pathnameForRedirect());
      return;
    }

    if (user.role === 'admin') {
      alert('Tài khoản quản trị viên không thể mua khóa học.');
      return;
    }

    // Add to cart and redirect to checkout
    addToCart(course);
    router.push('/checkout');
  };

  const pathnameForRedirect = () => {
    return `/courses/${course.slug}`;
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Banner Top Header */}
      <section className="bg-slate-900 text-white py-12 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e1b4b,transparent)] opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-indigo-600 text-white border-0">
                {course.category}
              </Badge>
              <Badge variant="secondary" className="bg-slate-800 text-slate-300 border-0">
                {course.level === 'Beginner' ? 'Cơ bản' : course.level === 'Advanced' ? 'Nâng cao' : 'Trung cấp'}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              {course.title}
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-3xl">
              {course.shortDescription}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-0.5 text-amber-500 font-semibold text-sm">
                ★ {course.rating}
              </span>
              <span>({course.reviewsCount} đánh giá)</span>
              <span>•</span>
              <span><b>{course.studentsCount}</b> học viên đã đăng ký</span>
            </div>
            <div className="flex items-center gap-2.5 pt-2">
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="h-8 w-8 rounded-full border border-slate-700 object-cover"
              />
              <span className="text-xs text-slate-300">
                Giảng viên: <b>{course.instructor.name}</b>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Details Body */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column details & curriculum tabs */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Tab Selector */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-[2px] ${
                activeTab === 'overview'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Tổng quan
            </button>
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-[2px] ${
                activeTab === 'curriculum'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Nội dung học ({course.chapters.length} chương)
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-[2px] ${
                activeTab === 'reviews'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Đánh giá ({course.reviewsCount})
            </button>
          </div>

          {/* Tab Contents */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-bold text-lg text-slate-900">Mô tả khóa học</h3>
                  <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                    {course.description}
                  </p>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <h3 className="font-bold text-lg text-slate-900">Thông tin giảng viên</h3>
                  <div className="flex gap-4 items-start">
                    <img
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      className="h-14 w-14 rounded-xl border border-slate-200 object-cover shrink-0"
                    />
                    <div className="space-y-2">
                      <div>
                        <h4 className="font-bold text-base text-slate-900">{course.instructor.name}</h4>
                        <p className="text-xs text-indigo-600 font-semibold">{course.instructor.role}</p>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {course.instructor.bio}
                      </p>
                      <div className="flex gap-4 text-[10px] text-slate-400 font-medium">
                        <span>★ {course.instructor.rating} Xếp hạng</span>
                        <span>•</span>
                        <span>{course.instructor.coursesCount} Khóa học</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Curriculum Tab */}
            {activeTab === 'curriculum' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-xs text-slate-500">
                    Tổng số: <b>{course.chapters.length}</b> chương • <b>{course.lessonsCount}</b> bài giảng
                  </span>
                </div>

                <div className="space-y-3">
                  {course.chapters.map((chapter: any) => {
                    const isExpanded = expandedChapters[chapter.id];
                    return (
                      <div key={chapter.id} className="border border-slate-200 rounded-lg overflow-hidden">
                        {/* Chapter title bar */}
                        <button
                          onClick={() => toggleChapter(chapter.id)}
                          className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-slate-100/70 transition-colors text-left"
                        >
                          <span className="font-bold text-sm text-slate-800">{chapter.title}</span>
                          <span className="text-slate-500">
                            {isExpanded ? (
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                              </svg>
                            ) : (
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            )}
                          </span>
                        </button>

                        {/* Chapter lessons list */}
                        {isExpanded && (
                          <div className="divide-y divide-slate-100">
                            {chapter.lessons.map((lesson: any) => {
                              const isAccessible = isEnrolled || lesson.isPreview;
                              return (
                                <div
                                  key={lesson.id}
                                  onClick={() => handleLessonClick(lesson)}
                                  className={cn(
                                    "flex items-center justify-between px-5 py-3 hover:bg-slate-50/50 transition-colors select-none",
                                    isAccessible ? "cursor-pointer hover:bg-indigo-50/20" : "cursor-not-allowed opacity-80"
                                  )}
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    {isAccessible ? (
                                      <svg className="h-4 w-4 text-indigo-550 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    ) : (
                                      <svg className="h-4 w-4 text-slate-350 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                      </svg>
                                    )}
                                    <span className={cn("text-xs truncate", isAccessible ? "font-semibold text-slate-800" : "text-slate-450")}>
                                      {lesson.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3 shrink-0">
                                    <span className="text-xs text-slate-400">{lesson.duration}</span>
                                    {lesson.isPreview && !isEnrolled && (
                                      <Badge variant="success" className="text-[10px] px-1.5 py-0">Học thử</Badge>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/70 border border-slate-100">
                  <div className="text-center space-y-1 pr-6 border-r border-slate-200">
                    <p className="text-3xl font-extrabold text-slate-900">{course.rating}</p>
                    <p className="text-[10px] text-amber-500 font-bold">★★★★★</p>
                    <p className="text-[10px] text-slate-400 font-medium">{course.reviewsCount} Đánh giá</p>
                  </div>
                  <div className="flex-1 space-y-1.5 text-[11px] text-slate-500">
                    <p>Khóa học nhận được phản hồi vô cùng tích cực từ các phụ huynh và học sinh.</p>
                  </div>
                </div>

                <div className="divide-y divide-slate-100">
                  {(course.reviews || (course.id === 'c3' ? [
                    { id: 'rev1', userName: 'Nguyễn Văn Hải', rating: 5, comment: 'Đề thi dịch Tiếng Việt rất chuẩn xác, dễ đọc. Lời giải chi tiết từng bước giúp con tôi tự luyện đề AMC 8 ở nhà cực kỳ hiệu quả.', date: '2026-03-15' },
                    { id: 'rev2', userName: 'Trần Thị Mai', rating: 5, comment: 'Giao diện sách lật (flipbook) rất đẹp và mượt mà, cảm giác đọc như sách thật. Dấu chìm bảo mật thông tin giúp con học tập trung và nghiêm túc hơn.', date: '2026-05-24' },
                    { id: 'rev3', userName: 'Trần Văn Long', rating: 5, comment: 'Tuyển tập đề thi AMC 8 đầy đủ 15 năm chất lượng cao, các câu hỏi hình học và số học được vẽ hình và giải thích vô cùng trực quan.', date: '2026-07-01' }
                  ] : [
                    { id: 'rev1', userName: 'Nguyễn Văn Hải', rating: 5, comment: 'Bài học 30 buổi rất đầy đủ và chi tiết. Tài liệu và BTVN được đính kèm chuẩn bị sẵn, rất tiện cho việc tự học và ôn thi.', date: '2026-03-15' },
                    { id: 'rev2', userName: 'Trần Thị Mai', rating: 5, comment: 'Con tôi học bám sát chương trình Kết nối tri thức của HMath và tiến bộ rất nhanh. Giao diện xem video và tải PDF mượt mà.', date: '2026-05-24' },
                    { id: 'rev3', userName: 'Trần Văn Long', rating: 5, comment: 'Video bài giảng âm thanh và hình ảnh vô cùng sắc nét, giáo viên giảng bài tỉ mỉ và dễ tiếp thu.', date: '2026-07-01' }
                  ])).map((rev: any) => (
                    <div key={rev.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-slate-800">{rev.userName}</span>
                        <span className="text-[10px] text-slate-400">{rev.date}</span>
                      </div>
                      <div className="text-xs text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => '★')}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column purchase widget card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20 overflow-hidden border-slate-200 shadow-md">
            <div className="aspect-video w-full overflow-hidden bg-slate-100">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="h-full w-full object-cover"
              />
            </div>
            <CardContent className="p-6 space-y-5">
              {isEnrolled ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/10 text-center space-y-2">
                    <div className="h-8 w-8 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto text-sm font-bold shadow-xs">
                      ✓
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-xs">Bạn đã đăng ký khóa học này</p>
                      {enrollment && (
                        <p className="text-[10px] text-slate-500 font-medium pt-0.5">Tiến độ hiện tại: {enrollment.progress}%</p>
                      )}
                    </div>
                  </div>
                  {enrollment && (
                    <Progress value={enrollment.progress} className="h-1.5" />
                  )}
                  <Link href={`/courses/${course.slug}/learn`} className="block w-full">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-750 text-white shadow-md text-xs py-2">
                      {enrollment && enrollment.progress > 0 ? 'Tiếp tục học tập' : 'Vào lớp học ngay'}
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-slate-900">{formatPrice(course.price)}</span>
                      {course.originalPrice && (
                        <span className="text-sm text-slate-400 line-through font-medium">{formatPrice(course.originalPrice)}</span>
                      )}
                    </div>
                    {course.originalPrice && (
                      <p className="text-xs font-semibold text-emerald-600">
                        Tiết kiệm {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}%
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={handleEnrollClick}
                    className="w-full shadow-lg shadow-indigo-500/20"
                  >
                    {isInCart(course.id) ? 'Thanh toán ngay' : 'Đăng ký học ngay'}
                  </Button>
                </>
              )}

              {/* Highlights List */}
              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-655">
                <p className="font-bold text-slate-800">
                  {course.productType === 'tailieu' || course.productType === 'ebook' || course.productType === 'book' ? 'Tài liệu này bao gồm:' : 'Khóa học này bao gồm:'}
                </p>
                <div className="space-y-2">
                  {course.productType === 'tailieu' || course.productType === 'ebook' || course.productType === 'book' ? (
                    <>
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span>Quy mô tài liệu: <b>{course.duration}</b></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Giao diện đọc: <b>Sách lật Flipbook trực tuyến</b></span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Thời lượng video học: <b>{course.duration}</b></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Số lượng: <b>{course.lessonsCount} bài giảng</b></span>
                      </div>
                    </>
                  )}
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Truy cập trọn đời, ôn tập trực tuyến mọi lúc</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Hỗ trợ hỏi đáp 24/7 trực tiếp cùng giảng viên</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* Lesson Player Modal Dialog */}
      <Dialog
        isOpen={isLessonModalOpen}
        onClose={() => {
          setIsLessonModalOpen(false);
          setSelectedLesson(null);
        }}
        title={selectedLesson ? selectedLesson.title : ''}
        size="xl"
      >
        {selectedLesson && (
          <div className="space-y-6">
            {/* Video Player */}
            {selectedLesson.videoUrl ? (
              <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md bg-black relative border border-slate-200">
                <iframe
                  src={selectedLesson.videoUrl}
                  title={selectedLesson.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="aspect-video w-full rounded-xl flex items-center justify-center bg-slate-100 border border-dashed border-slate-300 text-slate-400 text-xs font-semibold">
                Không có video cho bài học này.
              </div>
            )}

          </div>
        )}
      </Dialog>
    </div>
  );
}
