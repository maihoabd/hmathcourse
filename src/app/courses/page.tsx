'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { formatPrice } from '../../lib/utils';

function CoursesContent() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category');
  
  const [selectedCategory, setSelectedCategory] = useState(urlCategory ?? 'All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedProductType, setSelectedProductType] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [visibleCount, setVisibleCount] = useState(6);

  // Sync category state with search parameter changes
  useEffect(() => {
    setSelectedCategory(urlCategory ?? 'All');
  }, [urlCategory]);

  // Fetch course listings from Supabase Database
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        }
      } catch (err) {
        console.error('Fetch catalog courses error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Derive categories list dynamically from category column (fallback to existing category UI flow)
  const categories = useMemo(() => {
    const list = new Set(courses.map((c) => c.category));
    return ['All', ...Array.from(list)];
  }, [courses]);

  // Filter & sort logic
  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // Search filter
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (c) => c.title.toLowerCase().includes(q) || c.shortDescription.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((c) => c.category === selectedCategory);
    }

    // Level filter
    if (selectedLevel !== 'All') {
      result = result.filter((c) => c.level === selectedLevel);
    }

    // Grade filter
    if (selectedGrade !== 'All') {
      result = result.filter((c) => c.grade === selectedGrade);
    }

    // Product Type filter
    if (selectedProductType !== 'All') {
      result = result.filter((c) => c.productType === selectedProductType);
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // Default: popularity
      result.sort((a, b) => b.studentsCount - a.studentsCount);
    }

    return result;
  }, [courses, searchTerm, selectedCategory, selectedLevel, selectedGrade, selectedProductType, sortBy]);

  const displayedCourses = filteredCourses.slice(0, visibleCount);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedLevel('All');
    setSelectedGrade('All');
    setSelectedProductType('All');
    setSortBy('popular');
    setVisibleCount(6);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8 flex-1">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Danh mục Khóa học
        </h1>
        <p className="text-slate-500 text-sm max-w-xl">
          Học Toán thông minh, phát triển tư duy bản chất và bứt phá điểm số cùng các khóa học, sách điện tử và tài liệu ôn tập chất lượng cao từ HMath.
        </p>
      </div>

      {/* Filters Dashboard Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Search box */}
          <div className="lg:col-span-2 col-span-1">
            <Input
              placeholder="Tìm kiếm khóa học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-50"
            />
          </div>

          {/* Level Filter */}
          <div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="All">Tất cả cấp độ</option>
              <option value="Beginner">Cơ bản</option>
              
              <option value="Advanced">Nâng cao</option>
            </select>
          </div>

          {/* Product Type Filter */}
          <div>
            <select
              value={selectedProductType}
              onChange={(e) => setSelectedProductType(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="All">Tất cả loại sản phẩm</option>
              <option value="video">Khóa học Video</option>
              <option value="ebook">Sách điện tử Ebook</option>
              <option value="tailieu">Tài liệu học tập</option>
              <option value="combo">Combo học tập</option>
            </select>
          </div>

          {/* Grade / Exam Prep Filter */}
          <div>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="All">Tất cả lớp học / ôn thi</option>
              <option value="lop-6">Toán lớp 6</option>
              <option value="lop-7">Toán lớp 7</option>
              <option value="lop-8">Toán lớp 8</option>
              <option value="lop-9">Toán lớp 9</option>
              <option value="on-thi-lop-6">Ôn thi vào lớp 6</option>
              <option value="on-thi-lop-10">Ôn thi vào lớp 10</option>
            </select>
          </div>

          {/* Sorting */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="popular">Bán chạy nhất</option>
              <option value="rating">Đánh giá cao nhất</option>
              <option value="price-low">Giá: Thấp đến Cao</option>
              <option value="price-high">Giá: Cao đến Thấp</option>
            </select>
          </div>
        </div>


      </div>

      {/* Course count and status */}
      <div className="flex justify-between items-center text-xs text-slate-500">
        <span>Tìm thấy <b>{filteredCourses.length}</b> khóa học phù hợp</span>
        {(selectedCategory !== 'All' || selectedLevel !== 'All' || selectedGrade !== 'All' || selectedProductType !== 'All' || searchTerm !== '' || sortBy !== 'popular') && (
          <button onClick={resetFilters} className="text-indigo-600 font-semibold hover:underline">
            Đặt lại bộ lọc
          </button>
        )}
      </div>

      {/* Loading state, Empty State, or Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20 flex-1">
          <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300 max-w-xl mx-auto space-y-4">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800">Không tìm thấy khóa học nào</h3>
            <p className="text-xs text-slate-400">Vui lòng thử tìm kiếm từ khóa khác hoặc xóa bớt bộ lọc.</p>
          </div>
          <Button onClick={resetFilters} size="sm">Xem tất cả khóa học</Button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Courses grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedCourses.map((course) => (
              <Card key={course.id} className="flex flex-col h-full overflow-hidden hover:translate-y-[-4px] hover:shadow-md transition-all">
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    {course.isBestseller && (
                      <Badge variant="default" className="bg-indigo-600 text-white border-0">
                        Bán chạy
                      </Badge>
                    )}
                    {course.level === 'Beginner' ? (
                      <Badge variant="success" className="text-[10px] font-bold border-0 px-2 py-0.5 shadow-sm">
                        Cơ bản
                      </Badge>
                    ) : (
                      <Badge variant="default" className="bg-indigo-600 text-white text-[10px] font-bold border-0 px-2 py-0.5 shadow-sm">
                        Nâng cao
                      </Badge>
                    )}
                  </div>
                </div>

                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                      {course.category}
                    </span>
                    <Badge variant="secondary" className="text-[10px] py-0 bg-slate-50 text-slate-600">
                      {course.productType === 'video' ? 'Video' : course.productType === 'ebook' ? 'Ebook' : course.productType === 'tailieu' ? 'Tài liệu' : 'Combo'}
                    </Badge>
                  </div>
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
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                    <img
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                    <span className="text-xs text-slate-500">{course.instructor.name}</span>
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

          {/* Load More Button */}
          {filteredCourses.length > visibleCount && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                onClick={() => setVisibleCount((prev) => prev + 3)}
              >
                Xem thêm khóa học
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center py-20">
        <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    }>
      <CoursesContent />
    </Suspense>
  );
}
