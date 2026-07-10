'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { formatPrice } from '../lib/utils';

export default function LandingPage() {
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        if (res.ok) {
          const data = await res.json();
          setFeaturedCourses(data.slice(0, 2));
        }
      } catch (err) {
        console.error('Fetch landing page courses error:', err);
      }
    };
    fetchCourses();
  }, []);

  const valueProps = [
    {
      title: 'Bám sát Sách giáo khoa',
      desc: 'Giáo trình được biên soạn chuẩn theo chương trình Kết Nối Tri Thức, mở rộng chuyên đề nâng cao bồi dưỡng học sinh khá giỏi.',
      icon: (
        <svg className="h-6 w-6 text-indigo-655" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: 'Phát triển Tư duy bản chất',
      desc: 'Học Toán không học vẹt công thức. Thầy Hoàng giảng dạy đi sâu vào bản chất logic toán học để học sinh nhớ lâu, hiểu sâu.',
      icon: (
        <svg className="h-6 w-6 text-indigo-655" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: 'Học tập tương tác thông minh',
      desc: 'Tích hợp đầy đủ video bài giảng HD, tài liệu đính kèm dạng slide/PDF chất lượng cao và kho bài tập ôn luyện.',
      icon: (
        <svg className="h-6 w-6 text-indigo-655" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  const testimonials = [
    {
      name: 'Cô Nguyễn Bích Thủy',
      role: 'Phụ huynh bé Hoàng Lâm (Lớp 8)',
      comment: 'Bé nhà mình học Toán lớp 8 của HMath đã hiểu sâu bài hơn rất nhiều, kết quả thi giữa kỳ vừa rồi đạt 9.2 điểm. Rất cảm ơn thầy Hoàng.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60'
    },
    {
      name: 'Gia Bảo',
      role: 'Học sinh lớp 7 trường THCS Giảng Võ',
      comment: 'Các chuyên đề số hữu tỉ nâng cao và tam giác bằng nhau của thầy rất dễ nhớ. Video học thử mở trực tiếp coi bài giảng rất mượt.',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60'
    }
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e1b4b,transparent)] opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-8">
          
          <Badge variant="default" className="bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 px-3 py-1 text-xs">
            📚 Toán THCS 2026: Đầy đủ chương trình Toán 7 & Toán 8 mới
          </Badge>

          <h1 className="max-w-4xl font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.15]">
            Học Toán Bản chất cùng{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              HMath Course
            </span>
          </h1>

          <p className="max-w-2xl text-slate-400 text-base md:text-lg leading-relaxed">
            Nền tảng học Toán trực tuyến chất lượng cao dành cho học sinh THCS. Bài giảng chi tiết bám sát bộ sách Kết Nối Tri Thức giúp nâng cao tư duy điểm 9, 10.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/courses">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20">
                Xem Khóa học Toán
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-slate-700 hover:bg-slate-800 text-white">
                Học thử miễn phí
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Phương pháp giảng dạy độc quyền tại HMath
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base">
              HMath xây dựng cho học sinh lộ trình chinh phục môn Toán toàn diện bằng phương pháp dạy thông minh và dễ hiểu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valueProps.map((prop, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6 border border-slate-100 rounded-2xl bg-slate-55/60 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-indigo-50 mb-4">
                  {prop.icon}
                </div>
                <h3 className="font-bold text-lg text-slate-950 mb-2">{prop.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{prop.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-slate-55/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Khóa học Toán THCS bám sát SGK mới
              </h2>
              <p className="text-slate-500 text-sm md:text-base">
                Khám phá ngay các khóa học được thiết kế kỹ lưỡng dành riêng cho từng khối lớp.
              </p>
            </div>
            <Link href="/courses">
              <Button variant="outline" size="sm">Xem tất cả khóa học</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="flex flex-col h-full overflow-hidden hover:translate-y-[-4px] hover:shadow-lg">
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    {course.isBestseller && (
                      <Badge variant="default" className="bg-indigo-600 text-white border-0">
                        Nổi bật
                      </Badge>
                    )}
                    <Badge variant="secondary" className="bg-slate-900/70 text-slate-100 border-0 backdrop-blur-xs">
                      {course.level === 'Beginner' ? 'Cơ bản' : course.level === 'Advanced' ? 'Nâng cao' : 'Trung cấp'}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="p-5 pb-3">
                  <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                    {course.category}
                  </span>
                  <CardTitle className="text-base font-bold text-slate-900 line-clamp-1 mt-1">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {course.shortDescription}
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-5 pb-4 flex-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                      ★ {course.rating}
                    </span>
                    <span>({course.reviewsCount} đánh giá)</span>
                    <span className="ml-auto font-medium text-slate-700">{course.lessonsCount} bài học</span>
                  </div>
                </CardContent>

                <CardFooter className="px-5 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/45">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-slate-400 line-through">
                      {course.originalPrice && formatPrice(course.originalPrice)}
                    </span>
                    <span className="text-base font-bold text-indigo-600">
                      {formatPrice(course.price)}
                    </span>
                  </div>
                  <Link href={`/courses/${course.slug}`}>
                    <Button size="sm">Xem chi tiết</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Cảm nhận từ Phụ huynh & Học viên
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm">
              Chúng tôi tự hào khi nhận được sự đồng hành tin tưởng từ hàng trăm gia đình học sinh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((test, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-4 p-6 rounded-2xl border border-slate-100 bg-slate-50/50">
                <img
                  src={test.avatar}
                  alt={test.name}
                  className="h-14 w-14 rounded-full object-cover shrink-0 border border-slate-200"
                />
                <div className="space-y-2">
                  <p className="text-xs italic text-slate-655 leading-relaxed">
                    "{test.comment}"
                  </p>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{test.name}</h4>
                    <p className="text-[10px] text-slate-450 font-semibold">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-slate-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-655/10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Sẵn sàng đạt điểm cao môn Toán?
          </h2>
          <p className="text-slate-400 max-w-md mx-auto text-sm md:text-base">
            Đăng ký học thử ngay các bài giảng đầu tiên của HMath để trải nghiệm phương pháp dạy trực quan, dễ hiểu của thầy Hoàng.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500">
              Đăng ký Học thử Ngay
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
