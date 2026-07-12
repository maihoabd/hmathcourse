'use client';

import React, { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(true);
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
  const [grade, setGrade] = useState('lop-7');
  const [productType, setProductType] = useState('video');

  // Load from API on mount
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (err) {
      console.error('Fetch admin courses error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openAddDialog = () => {
    setEditingCourse(null);
    setTitle('');
    setCategory('Toán lớp 7');
    setLevel('Beginner');
    setPrice(490000);
    setOriginalPrice(890000);
    setThumbnail('/images/math_7_thumbnail.jpg');
    setShortDescription('');
    setDescription('');
    setLessonsCount(30);
    setDuration('30 giờ 00 phút');
    setGrade('lop-7');
    setProductType('video');
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
    setGrade(course.grade || 'lop-7');
    setProductType(course.productType || 'video');
    setIsDialogOpen(true);
  };

  const handleGradeChange = (gradeValue: string, checked: boolean) => {
    let list = grade ? grade.split(',').filter(Boolean) : [];
    if (checked) {
      if (!list.includes(gradeValue)) {
        list.push(gradeValue);
      }
    } else {
      list = list.filter((g) => g !== gradeValue);
    }
    setGrade(list.join(','));
  };

  const handleSave = async (e: React.FormEvent) => {
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
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const courseData = {
      id: editingCourse ? editingCourse.id : 'c-' + Date.now(),
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
      isBestseller: editingCourse ? editingCourse.isBestseller : false,
      grade,
      productType,
      instructor: editingCourse ? editingCourse.instructor : {
        name: 'Giáo viên HMath',
        role: 'Thạc sĩ Sư phạm Toán học - Đại học Sư phạm Hà Nội',
        avatar: 'https://i.postimg.cc/MGshM4ZC/favico.png',
        bio: 'Hơn 10 năm kinh nghiệm bồi dưỡng học sinh giỏi Toán THCS.',
        coursesCount: 2,
        rating: 4.9
      }
    };

    try {
      const method = editingCourse ? 'PUT' : 'POST';
      const response = await fetch('/api/courses', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      if (response.ok) {
        await fetchCourses(); // Refresh courses list
        setIsDialogOpen(false);
      } else {
        const errorData = await response.json();
        alert('Lỗi: ' + (errorData.error || 'Không thể lưu khóa học.'));
      }
    } catch (err) {
      console.error('Save course error:', err);
      alert('Lỗi kết nối mạng hoặc lỗi máy chủ.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm('Bạn chắc chắn muốn xóa khóa học "' + name + '" cùng toàn bộ bài học đính kèm?')) {
      try {
        const response = await fetch('/api/courses?id=' + id, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchCourses();
        } else {
          const errorData = await response.json();
          alert('Lỗi: ' + (errorData.error || 'Không thể xóa khóa học.'));
        }
      } catch (err) {
        console.error('Delete course error:', err);
        alert('Lỗi kết nối mạng.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Quản lý Khóa học</h1>
          <p className="text-slate-500 text-sm">Xem danh sách, thêm, chỉnh sửa thông tin các khóa học trực tuyến.</p>
        </div>
        <Button onClick={openAddDialog} className="shadow-sm">
          Thêm khóa học mới
        </Button>
      </div>

      {/* Courses registry table inside card */}
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
                  <TableHead>Khóa học</TableHead>
                  <TableHead>Chuyên mục</TableHead>
                  <TableHead>Cấp độ</TableHead>
                  <TableHead>Học phí</TableHead>
                  <TableHead className="text-center">Số bài học</TableHead>
                  <TableHead className="text-center">Phân loại</TableHead>
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
                            <p className="text-[10px] text-slate-450">Mã: {course.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{course.category}</TableCell>
                      <TableCell>
                        <Badge variant={course.level === 'Beginner' ? 'success' : 'default'} className="text-[10px] border-0">
                          {course.level === 'Beginner' ? 'Cơ bản' : 'Nâng cao'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-bold text-slate-800">
                        {formatPrice(course.price)}
                      </TableCell>
                      <TableCell className="text-center text-xs">{course.lessonsCount}</TableCell>
                      <TableCell className="text-center text-xs">
                        <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                          {course.productType === 'video' ? 'Video' : course.productType === 'ebook' ? 'Ebook' : course.productType === 'tailieu' ? 'Tài liệu' : 'Combo'}
                        </Badge>
                      </TableCell>
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
          )}
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
              placeholder="Ví dụ: Khóa học Toán 8 Kết nối tri thức"
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
                <option value="Toán lớp 6">Toán lớp 6</option>
                <option value="Toán lớp 7">Toán lớp 7</option>
                <option value="Toán lớp 8">Toán lớp 8</option>
                <option value="Toán lớp 9">Toán lớp 9</option>
                <option value="Ôn thi lớp 6">Ôn thi lớp 6</option>
                <option value="Ôn thi lớp 10">Ôn thi lớp 10</option>
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
                <option value="Advanced">Nâng cao (Advanced)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Khối lớp áp dụng (Chọn nhiều)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                {[
                  { value: 'lop-6', label: 'Toán lớp 6' },
                  { value: 'lop-7', label: 'Toán lớp 7' },
                  { value: 'lop-8', label: 'Toán lớp 8' },
                  { value: 'lop-9', label: 'Toán lớp 9' },
                  { value: 'on-thi-lop-6', label: 'Ôn thi lớp 6' },
                  { value: 'on-thi-lop-10', label: 'Ôn thi lớp 10' }
                ].map((item) => (
                  <label key={item.value} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={grade.split(',').includes(item.value)}
                      onChange={(e) => handleGradeChange(item.value, e.target.checked)}
                      className="rounded text-indigo-650 focus:ring-indigo-500 h-4 w-4"
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Loại sản phẩm (Product Type)</label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-750 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="video">Khóa học Video (video)</option>
                <option value="tailieu">Tài liệu học tập (tailieu)</option>
              </select>
            </div>

            <Input
              label="Đường dẫn ảnh Thumbnail (URL)"
              placeholder="/images/math_7_thumbnail.jpg"
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
