'use client';

import React, { useState, useEffect } from 'react';
import { mockCourses } from '../../../../data/courses';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input, TextArea } from '../../../components/ui/input';
import { Dialog } from '../../../components/ui/dialog';
import { Badge } from '../../../components/ui/badge';
import { formatPrice } from '../../../lib/utils';
import { Course } from '../../../../data/types';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'>('Beginner');
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [thumbnail, setThumbnail] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [lessonsCount, setLessonsCount] = useState(10);
  const [duration, setDuration] = useState('');

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('mock_admin_courses');
    if (stored) {
      try {
        setCourses(JSON.parse(stored));
      } catch (e) {
        setCourses(mockCourses);
      }
    } else {
      setCourses(mockCourses);
      localStorage.setItem('mock_admin_courses', JSON.stringify(mockCourses));
    }
  }, []);

  // Save to local storage
  const saveCourses = (newList: Course[]) => {
    setCourses(newList);
    localStorage.setItem('mock_admin_courses', JSON.stringify(newList));
  };

  const openAddDialog = () => {
    setEditingCourse(null);
    setTitle('');
    setCategory('Lập trình Web');
    setLevel('Beginner');
    setPrice(490000);
    setOriginalPrice(890000);
    setThumbnail('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60');
    setShortDescription('');
    setDescription('');
    setLessonsCount(10);
    setDuration('12 giờ 00 phút');
    setIsDialogOpen(true);
  };

  const openEditDialog = (course: Course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setCategory(course.category);
    setLevel(course.level);
    setPrice(course.price);
    setOriginalPrice(course.originalPrice || course.price);
    setThumbnail(course.thumbnail);
    setShortDescription(course.shortDescription);
    setDescription(course.description);
    setLessonsCount(course.lessonsCount);
    setDuration(course.duration);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !shortDescription || !description || !duration) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    if (editingCourse) {
      // Edit
      const updated = courses.map((c) => {
        if (c.id === editingCourse.id) {
          return {
            ...c,
            title,
            slug,
            category,
            level,
            price: Number(price),
            originalPrice: Number(originalPrice),
            thumbnail,
            shortDescription,
            description,
            lessonsCount: Number(lessonsCount),
            duration
          };
        }
        return c;
      });
      saveCourses(updated);
    } else {
      // Add
      const newCourse: Course = {
        id: `c-${Date.now()}`,
        slug,
        title,
        shortDescription,
        description,
        price: Number(price),
        originalPrice: Number(originalPrice),
        thumbnail,
        category,
        level,
        lessonsCount: Number(lessonsCount),
        duration,
        rating: 5.0,
        reviewsCount: 0,
        studentsCount: 0,
        chapters: [
          {
            id: `ch-${Date.now()}-1`,
            title: 'Chương 1: Giới thiệu và setup căn bản',
            lessons: [
              { id: `l-${Date.now()}-1`, title: '1. Giới thiệu tổng quan lộ trình học', duration: '10:00', isPreview: true },
              { id: `l-${Date.now()}-2`, title: '2. Cài đặt các công cụ cần thiết', duration: '15:30', isPreview: false }
            ]
          }
        ],
        reviews: [],
        instructor: {
          name: 'Quản trị viên LMS',
          role: 'Giảng viên chính thức',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=60',
          bio: 'Đại diện bộ phận giáo trình số hóa.',
          coursesCount: 1,
          rating: 5.0
        }
      };
      saveCourses([newCourse, ...courses]);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Bạn chắc chắn muốn xóa khóa học "${name}"?`)) {
      const updated = courses.filter((c) => c.id !== id);
      saveCourses(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Quản lý khóa học</h1>
          <p className="text-slate-500 text-sm">Xem danh sách, thêm, chỉnh sửa thông tin các khóa học trực tuyến.</p>
        </div>
        <Button onClick={openAddDialog} className="shadow-sm">
          Thêm khóa học mới
        </Button>
      </div>

      {/* Courses registry table inside card */}
      <Card className="border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Khóa học</TableHead>
                <TableHead>Chuyên mục</TableHead>
                <TableHead>Cấp độ</TableHead>
                <TableHead>Học phí</TableHead>
                <TableHead className="text-center">Số bài học</TableHead>
                <TableHead className="text-center">Học viên</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-slate-400">
                    Chưa có khóa học nào được đăng tải.
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-semibold text-slate-900 max-w-xs truncate">
                      <div className="flex items-center gap-3">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="h-9 w-14 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-xs truncate">{course.title}</p>
                          <p className="text-[10px] text-slate-400">Mã: {course.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{course.category}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px]">
                        {course.level === 'Beginner' ? 'Cơ bản' : course.level === 'Advanced' ? 'Nâng cao' : 'Trung cấp'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-slate-800">
                      {formatPrice(course.price)}
                    </TableCell>
                    <TableCell className="text-center text-xs">{course.lessonsCount}</TableCell>
                    <TableCell className="text-center text-xs font-medium text-slate-600">{course.studentsCount}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <button
                        onClick={() => openEditDialog(course)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-900 hover:underline bg-transparent"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(course.id, course.title)}
                        className="text-xs font-semibold text-red-500 hover:text-red-700 hover:underline bg-transparent"
                      >
                        Xóa
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Editor Modal Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={editingCourse ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSave}>Lưu thông tin</Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tên khóa học (bắt buộc)"
              placeholder="Ví dụ: Khóa học lập trình TypeScript"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Chuyên mục</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-750 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Lập trình Web">Lập trình Web</option>
                <option value="Design & UI/UX">Design & UI/UX</option>
                <option value="Lập trình Core">Lập trình Core</option>
                <option value="Marketing">Marketing</option>
                <option value="Business & Startup">Business & Startup</option>
                <option value="Lập trình Game">Lập trình Game</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Cấp độ</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-750 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Beginner">Cơ bản (Beginner)</option>
                <option value="Intermediate">Trung cấp (Intermediate)</option>
                <option value="Advanced">Nâng cao (Advanced)</option>
                <option value="All Levels">Mọi cấp độ (All Levels)</option>
              </select>
            </div>
            <Input
              label="Đường dẫn ảnh Thumbnail (URL)"
              placeholder="https://example.com/image.jpg"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
            />
            <Input
              label="Học phí (VND)"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            <Input
              label="Học phí gốc (VND)"
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(Number(e.target.value))}
            />
            <Input
              label="Số bài giảng"
              type="number"
              value={lessonsCount}
              onChange={(e) => setLessonsCount(Number(e.target.value))}
            />
            <Input
              label="Tổng thời lượng học (bắt buộc)"
              placeholder="Ví dụ: 12 giờ 30 phút"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>

          <Input
            label="Mô tả ngắn gọn (bắt buộc)"
            placeholder="Mô tả ngắn hiển thị trên thẻ khóa học..."
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            required
          />

          <TextArea
            label="Mô tả chi tiết nội dung (bắt buộc)"
            placeholder="Nội dung chương trình học, giá trị đem lại..."
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </form>
      </Dialog>
    </div>
  );
}
