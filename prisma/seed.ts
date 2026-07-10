import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing old data...');
  await prisma.order.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.chapter.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding initial users...');
  // Hashed passwords
  const adminPasswordHash = bcrypt.hashSync('10101988Hn@!xy', 10);
  const studentPasswordHash = bcrypt.hashSync('student123', 10);

  // 1. Create Admin
  const adminUser = await prisma.user.create({
    data: {
      name: 'Quản trị viên HMath',
      email: 'maihoabd3@gmail.com',
      password: adminPasswordHash,
      role: 'admin',
      status: 'active',
    },
  });

  // 2. Create Demo Student (s1)
  const studentUser = await prisma.user.create({
    data: {
      id: 's1',
      name: 'Nguyễn Văn Hải',
      email: 'student@lms.com',
      password: studentPasswordHash,
      role: 'student',
      status: 'active',
    },
  });

  // 3. Create Other Mock Students
  const otherStudents = [
    { id: 's2', name: 'Trần Thị Mai', email: 'mai.tran@gmail.com', status: 'active' },
    { id: 's3', name: 'Lê Hoàng Long', email: 'long.le@yahoo.com', status: 'active' },
    { id: 's4', name: 'Phạm Thảo Vy', email: 'vy.pham@outlook.com', status: 'active' },
    { id: 's5', name: 'Đặng Tuấn Anh', email: 'tuananh.dang@gmail.com', status: 'active' },
    { id: 's6', name: 'Vũ Quốc Bảo', email: 'bao.vu@hotmail.com', status: 'active' },
    { id: 's7', name: 'Hoàng Kim Chi', email: 'chi.hoang@gmail.com', status: 'active' },
    { id: 's8', name: 'Đỗ Hùng Dũng', email: 'dung.do@gmail.com', status: 'active' },
    { id: 's9', name: 'Phan Huy Hoàng', email: 'hoang.phan@gmail.com', status: 'active' },
    { id: 's10', name: 'Bùi Tiến Dũng', email: 'dung.bui@yahoo.com', status: 'suspended' },
    { id: 's11', name: 'Lê Hữu Nghĩa', email: 'nghia.le@gmail.com', status: 'active' },
    { id: 's12', name: 'Nguyễn Bích Ngọc', email: 'ngoc.nguyen@gmail.com', status: 'active' },
  ];

  for (const student of otherStudents) {
    await prisma.user.create({
      data: {
        id: student.id,
        name: student.name,
        email: student.email,
        password: studentPasswordHash,
        role: 'student',
        status: student.status,
      },
    });
  }

  console.log('Seeding courses...');
  // Math Course 1
  const c1 = await prisma.course.create({
    data: {
      id: 'c1',
      slug: 'khoa-hoc-toan-nang-cao-lop-7-bo-sach-ket-noi-tri-thuc',
      title: 'Khóa học Toán 7 Kết nối tri thức',
      shortDescription: 'Chương trình Toán 7 Kết nối tri thức toàn diện với 30 buổi học chất lượng cao, bao trọn chuyên đề Số hữu tỉ, Góc & Đường thẳng song song, Số thực, Tam giác bằng nhau, Đa thức và Xác suất.',
      description: `Khóa học Toán 7 Kết nối tri thức được thiết kế chuẩn mực nhằm giúp các em học sinh lớp 7 nắm vững toàn bộ kiến thức trọng tâm theo chương trình mới của Bộ Giáo dục và Đào tạo. 

Lộ trình học bài bản gồm 30 buổi học chất lượng cao bám sát theo 5 chương chuyên đề hình học và đại số:
• Chương 1: Số hữu tỉ nâng cao (Buổi 1 - 4)
• Chương 2: Góc & Đường thẳng song song (Buổi 5 - 8)
• Chương 3: Số thực & Giá trị tuyệt đối (Buổi 9 - 12)
• Chương 4: Tam giác bằng nhau chuyên sâu (Buổi 13 - 20)
• Chương 5: Đa thức một biến, hình học & xác suất (Buổi 21 - 30)

Mỗi buổi học đi kèm video bài giảng chi tiết giải thích rõ bản chất, tài liệu học tập tóm tắt lý thuyết, bài tập về nhà chọn lọc cùng hướng dẫn giải PDF chi tiết để tự kiểm tra kết quả. Khóa học là bệ phóng giúp các em tự tin bứt phá điểm số 9, 10 trong các bài thi định kỳ.`,
      price: 590000,
      originalPrice: 990000,
      thumbnail: '/images/math_7_thumbnail.jpg',
      category: 'Toán lớp 7',
      level: 'Advanced',
      lessonsCount: 30,
      duration: '22 giờ 30 phút',
      rating: 4.9,
      reviewsCount: 42,
      studentsCount: 320,
      isBestseller: true,
      instructorName: 'Giáo viên HMath',
      instructorRole: 'Thạc sĩ Sư phạm Toán học - Đại học Sư phạm Hà Nội',
      instructorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=60',
      instructorBio: 'Hơn 10 năm kinh nghiệm bồi dưỡng học sinh giỏi Toán THCS, có phương pháp dạy dễ hiểu, cuốn hút.',
    },
  });

  // Math Course 2
  const c2 = await prisma.course.create({
    data: {
      id: 'c2',
      slug: 'khoa-hoc-toan-lop-8-co-ban-bo-sach-ket-noi-tri-thuc',
      title: 'Khóa học Toán 8 Kết nối tri thức',
      shortDescription: 'Chương trình toán lớp 8 bám sát sách giáo khoa Kết Nối Tri Thức. Tích hợp các bài giảng hoàn chỉnh đầu tiên và cập nhật liên tục theo tiến độ học.',
      description: `Khóa học được xây dựng nhằm giúp các em học sinh lớp 8 nắm chắc kiến thức căn bản môn Toán. Chương trình bám sát bộ sách giáo khoa Kết Nối Tri Thức Với Cuộc Sống. Hệ thống liên tục cập nhật các bài giảng chất lượng cao kết hợp tài liệu tóm tắt và bài tập rèn luyện để học sinh học tập tự tin và hiệu quả.`,
      price: 490000,
      originalPrice: 850000,
      thumbnail: 'https://images.unsplash.com/photo-1453733190148-c44698c26588?w=800&auto=format&fit=crop&q=60',
      category: 'Toán lớp 8',
      level: 'Beginner',
      lessonsCount: 30,
      duration: '20 giờ 30 phút',
      rating: 4.8,
      reviewsCount: 28,
      studentsCount: 210,
      isBestseller: false,
      instructorName: 'Giáo viên HMath',
      instructorRole: 'Thạc sĩ Sư phạm Toán học - Đại học Sư phạm Hà Nội',
      instructorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=60',
      instructorBio: 'Hơn 10 năm kinh nghiệm bồi dưỡng học sinh giỏi Toán THCS, có phương pháp dạy dễ hiểu, cuốn hút.',
    },
  });

  console.log('Seeding Course 1 chapters and lessons...');
  // Chapters for Course 1
  const ch1_1 = await prisma.chapter.create({ data: { courseId: 'c1', title: 'Chương 1: Số hữu tỉ nâng cao (4 bài học)' } });
  const ch1_2 = await prisma.chapter.create({ data: { courseId: 'c1', title: 'Chương 2: Góc & Đường thẳng song song (4 bài học)' } });
  const ch1_3 = await prisma.chapter.create({ data: { courseId: 'c1', title: 'Chương 3: Số thực & Căn bậc hai (4 bài học)' } });
  const ch1_4 = await prisma.chapter.create({ data: { courseId: 'c1', title: 'Chương 4: Tam giác bằng nhau chuyên sâu (8 bài học)' } });
  const ch1_5 = await prisma.chapter.create({ data: { courseId: 'c1', title: 'Chương 5: Chuyên đề nâng cao & Luyện đề (10 bài học)' } });

  // Lessons for Course 1
  const c1Lessons = [
    // Ch 1
    {
      id: 'c1-l1',
      chapterId: ch1_1.id,
      title: 'Buổi 1: Phép tính số hữu tỉ',
      duration: '113 phút',
      isPreview: true,
      videoUrl: 'https://www.youtube.com/embed/I9v8kjCGQtQ',
      documentUrl: 'https://drive.google.com/file/d/1n2HYFnYaPP95yWCsHukFRWmV103C0d2j/preview',
      textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 1:</h4>
<div class="flex flex-col sm:flex-row gap-3 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1n2HYFnYaPP95yWCsHukFRWmV103C0d2j/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tải Tài liệu Buổi 1 (PDF)
  </a>
  <a href="https://drive.google.com/file/d/1nuGFlfIS1SfxWCIZOsxrXvYatUX2uWGS/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200 no-underline">
    <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    Tải Bài tập Về nhà (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-555 leading-relaxed">Trong buổi học này, chúng ta sẽ làm quen với các khái niệm căn bản và nâng cao của phép tính số hữu tỉ. Thầy sẽ hướng dẫn các phương pháp tính nhanh, tính thuận tiện và cách tránh các bẫy thường gặp trong các đề kiểm tra học kỳ và thi học sinh giỏi toán lớp 7.</p>`
    },
    {
      id: 'c1-l2',
      chapterId: ch1_1.id,
      title: 'Buổi 2: Số hữu tỉ và các phép tính (2)',
      duration: '107 phút',
      isPreview: false,
      videoUrl: 'https://www.youtube.com/embed/z_3rm6Ldh78',
      documentUrl: 'https://drive.google.com/file/d/15iEAj6HW85USuSZVy319JNrjV7Nssx6X/preview',
      textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 2:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/15iEAj6HW85USuSZVy319JNrjV7Nssx6X/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 2 (PDF)
  </a>
  <a href="https://drive.google.com/file/d/1xFlMHUYFyaGv3gI_dG6aprVyogMVr2vE/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200 no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    Bài tập Buổi 2 (PDF)
  </a>
  <a href="https://drive.google.com/file/d/1lH_MVwZlIW32ehjsvoIUUx4HZyTdXgSu/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200 no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    HD Giải BTVN Buổi 1 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Tiếp tục chủ đề số hữu tỉ và các phép tính. Buổi học này đi sâu vào kỹ năng nhân chia số hữu tỉ nâng cao và các bài toán tìm x phức tạp.</p>`
    },
    {
      id: 'c1-l3',
      chapterId: ch1_1.id,
      title: 'Buổi 3: Số hữu tỉ và các phép tính (3)',
      duration: '112 phút',
      isPreview: false,
      videoUrl: 'https://www.youtube.com/embed/jZj8MmiyNC0',
      documentUrl: 'https://drive.google.com/file/d/1VogcqF5F5hQDpGgKi77972nZZb8DqlUl/preview',
      textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 3:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1VogcqF5F5hQDpGgKi77972nZZb8DqlUl/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 3 (PDF)
  </a>
  <a href="https://drive.google.com/file/d/1fXgqABceRCtGaKRrvMSbY5OQChA5ezVa/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200 no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    Bài tập Buổi 3 (PDF)
  </a>
  <a href="https://drive.google.com/file/d/1Vbz3BTz1bcM28A5tLK-i1KVgGTMfxVJi/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200 no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    HD Giải BTVN Buổi 2 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Nâng cao tư duy với các bài toán lũy thừa số hữu tỉ, quy tắc dấu ngoặc và thứ tự thực hiện phép tính nâng cao.</p>`
    },
    {
      id: 'c1-l4',
      chapterId: ch1_1.id,
      title: 'Buổi 4: Chữa bài tập tổng hợp Số hữu tỉ và các phép tính',
      duration: '102 phút',
      isPreview: false,
      videoUrl: 'https://www.youtube.com/embed/ND5xkVGOmgo',
      documentUrl: 'https://drive.google.com/file/d/1XsWBBRaqY9SoH2G6Qa1vOZ6R0H-1yuK7/preview',
      textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Đáp án Buổi 4:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1XsWBBRaqY9SoH2G6Qa1vOZ6R0H-1yuK7/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Đáp án & BT Bổ sung Buổi 3 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Buổi học chữa toàn bộ bài tập lớn tổng hợp của Chương 1 giúp học sinh hệ thống hóa kiến thức và cách giải bài toán số hữu tỉ nhanh.</p>`
    },
    
    // Ch 2
    {
      id: 'c1-l5',
      chapterId: ch1_2.id,
      title: 'Buổi 5: Góc và đường thẳng song song (1)',
      duration: '105 phút',
      isPreview: false,
      videoUrl: 'https://www.youtube.com/embed/ZggS8THMXyU',
      documentUrl: 'https://drive.google.com/file/d/1paKtZ4luIfQEmXIWfncR_MPXxULxE8UD/preview',
      textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 5:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1paKtZ4luIfQEmXIWfncR_MPXxULxE8UD/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 5 (PDF)
  </a>
  <a href="https://drive.google.com/file/d/12ZoKt6S4U7AiqzR0Btx66KoN2E7ISSum/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200 no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    Bài tập Buổi 5 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Lý thuyết hình học đầu tiên về góc kề bù, đối đỉnh và tia phân giác của một góc.</p>`
    },
    {
      id: 'c1-l6',
      chapterId: ch1_2.id,
      title: 'Buổi 6: Góc và đường thẳng song song (2)',
      duration: '18:50',
      isPreview: false,
      documentUrl: 'https://drive.google.com/file/d/1KMwvxoW-7a3qLhju7Di8T4NgT_2mn-a2/preview',
      textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 6:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1KMwvxoW-7a3qLhju7Di8T4NgT_2mn-a2/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 6 (PDF)
  </a>
  <a href="https://drive.google.com/file/d/1_iypn3KRPBmdCr2P2_d1AgYTe8tKFeOy/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200 no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    Bài tập Buổi 6 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Bài học về hai đường thẳng song song và các góc đồng vị, so le trong nâng cao.</p>`
    },
    { id: 'c1-l7', chapterId: ch1_2.id, title: 'Buổi 7: Luyện tập về đường thẳng song song (3)', duration: '103 phút', isPreview: false, videoUrl: 'https://www.youtube.com/embed/EZ43xt22mrM', documentUrl: 'https://drive.google.com/file/d/1qDDmmQKVzmqwqb2fLT3H7hF6fyl3yahb/preview', textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 7:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1qDDmmQKVzmqwqb2fLT3H7hF6fyl3yahb/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 7 (PDF)
  </a>
  <a href="https://drive.google.com/file/d/1lwSJfesaIare5XWjspSywBVVl020DXUY/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200 no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    Bài tập Buổi 7 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Luyện tập sâu về chứng minh hai đường thẳng song song và tính số đo góc nâng cao.</p>` },
    { id: 'c1-l8', chapterId: ch1_2.id, title: 'Buổi 8: Góc và đường thẳng song song (4)', duration: '101 phút', isPreview: false, videoUrl: 'https://www.youtube.com/embed/s8qUWJOBbnc', documentUrl: 'https://drive.google.com/file/d/1hPkK5A2DRS7G_uamdQkeB4qzK_4gei6W/preview', textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 8:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1hPkK5A2DRS7G_uamdQkeB4qzK_4gei6W/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 8 (PDF)
  </a>
  <a href="https://drive.google.com/file/d/18BNv-TDyRvpIUOI3-wtFteG-ag-2Ueif/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200 no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    Bài tập Buổi 8 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Buổi học chuyên sâu về định lý góc có cạnh tương ứng song song và các dạng bài kiểm tra 1 tiết.</p>` },

    // Ch 3
    { id: 'c1-l9', chapterId: ch1_3.id, title: 'Buổi 9: Số thực (1)', duration: '102 phút', isPreview: false, videoUrl: 'https://www.youtube.com/embed/3UVcRT4SotA', documentUrl: 'https://drive.google.com/file/d/1u2DgkiOwyB-pCOoHygYA627m6DFyDHPb/preview', textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 9:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1u2DgkiOwyB-pCOoHygYA627m6DFyDHPb/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 9 (PDF)
  </a>
  <a href="https://drive.google.com/file/d/19hul3UEHwcGC8o9ZieByyq7RNUtZLYl2/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200 no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    Bài tập Buổi 9 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Bài giảng mở đầu về Số thực, khái niệm căn bậc hai số học và trục số thực.</p>` },
    { id: 'c1-l10', chapterId: ch1_3.id, title: 'Buổi 10: Số thực (2)', duration: '112 phút', isPreview: false, videoUrl: 'https://www.youtube.com/embed/zhYs8-gBjh4', documentUrl: 'https://drive.google.com/file/d/1n2XlNI4ZaWXlTCC4_Hy0E_RWPUg64n9-/preview', textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 10:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1n2XlNI4ZaWXlTCC4_Hy0E_RWPUg64n9-/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 10 (PDF)
  </a>
  <a href="https://drive.google.com/file/d/12_skSdOWqkNuk50jpHuvRBtEgO01ej7G/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200 no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    Bài tập Buổi 10 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Các phương pháp giải bài toán chứa dấu giá trị tuyệt đối chuyên sâu (Phần 1).</p>` },
    { id: 'c1-l11', chapterId: ch1_3.id, title: 'Buổi 11: Số thực (3)', duration: '108 phút', isPreview: false, videoUrl: 'https://www.youtube.com/embed/rLXCMxhEla0', documentUrl: 'https://drive.google.com/file/d/1YeM-OkDZEqplY93f899xJ3e35a-1taH3/preview', textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 11:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1YeM-OkDZEqplY93f899xJ3e35a-1taH3/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tải Tài liệu & BTVN Buổi 11 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Nâng cao kỹ năng giải bài toán tìm x và chứng minh chứa dấu giá trị tuyệt đối (Phần 2).</p>` },
    { id: 'c1-l12', chapterId: ch1_3.id, title: 'Buổi 12: Số thực (4)', duration: '105 phút', isPreview: false, videoUrl: 'https://www.youtube.com/embed/aV9TrY-pS_4', documentUrl: 'https://drive.google.com/file/d/1OJ8sd_cPlZznat7SuxfcH9VmSEiQbC0-/preview', textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 12:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1OJ8sd_cPlZznat7SuxfcH9VmSEiQbC0-/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tải Tài liệu & BTVN Buổi 12 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Các bài toán nâng cao cuối chương số thực, ước lượng số học và chuẩn bị ôn thi học kỳ.</p>` },

    // Ch 4
    { id: 'c1-l13', chapterId: ch1_4.id, title: 'Buổi 13: Tam giác bằng nhau (1)', duration: '107 phút', isPreview: false, videoUrl: 'https://www.youtube.com/embed/rkw998dFad4', documentUrl: 'https://drive.google.com/file/d/1Ejto2BN_HAv8YIfyeJ175YkMEf0d-bXY/preview', textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 13:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1Ejto2BN_HAv8YIfyeJ175YkMEf0d-bXY/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 13 (PDF)
  </a>
  <a href="https://drive.google.com/file/d/1r2_yIaqEeri0USA63UOP276FU-3zi0by/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200 no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    Bài tập Buổi 13 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Khái niệm hai tam giác bằng nhau và trường hợp bằng nhau thứ nhất: Cạnh - Cạnh - Cạnh (c-c-c).</p>` },
    { id: 'c1-l14', chapterId: ch1_4.id, title: 'Buổi 14: Tam giác bằng nhau (2)', duration: '113 phút', isPreview: false, videoUrl: 'https://www.youtube.com/embed/9YJoJWAgUKk', documentUrl: 'https://drive.google.com/file/d/1oiB0a-tql6WGiQD3P90xPJIxaFTVddHx/preview', textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 14:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1oiB0a-tql6WGiQD3P90xPJIxaFTVddHx/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tải Tài liệu & BTVN Buổi 14 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Trường hợp bằng nhau thứ hai: Cạnh - Góc - Cạnh (c-g-c) và các định lý liên quan.</p>` },
    { id: 'c1-l15', chapterId: ch1_4.id, title: 'Buổi 15: Tam giác bằng nhau (3)', duration: '110 phút', isPreview: false, videoUrl: 'https://www.youtube.com/embed/S9JXu7Mt-JQ', documentUrl: 'https://drive.google.com/file/d/1JtKwa8MANJuv7Dto6TGQBYW3RyBtDkzx/preview', textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 15:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1JtKwa8MANJuv7Dto6TGQBYW3RyBtDkzx/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tải Tài liệu & BTVN Buổi 15 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Trường hợp bằng nhau thứ ba: Góc - Cạnh - Góc (g-c-g) và ứng dụng đo đạc khoảng cách thực tế.</p>` },
    { id: 'c1-l16', chapterId: ch1_4.id, title: 'Buổi 16: Các trường hợp bằng nhau của tam giác vuông', duration: '99 phút', isPreview: false, videoUrl: 'https://www.youtube.com/embed/qYk77fkHKsw', documentUrl: 'https://drive.google.com/file/d/177P1249e28gJitx5bLMPUmpwgqvFVLYH/preview', textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 16:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/177P1249e28gJitx5bLMPUmpwgqvFVLYH/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tải Tài liệu & BTVN Buổi 16 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Hệ thống hóa các trường hợp bằng nhau đặc biệt của tam giác vuông (cạnh huyền - góc nhọn, cạnh huyền - cạnh góc vuông).</p>` },
    { id: 'c1-l17', chapterId: ch1_4.id, title: 'Buổi 17: Luyện tập tam giác bằng nhau', duration: '103 phút', isPreview: false, videoUrl: 'https://www.youtube.com/embed/4OPvysM-1Ic', documentUrl: 'https://drive.google.com/file/d/1-d0H7Nnjby9exF7Iek5alkhLnXTLKmsQ/preview', textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 17:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1-d0H7Nnjby9exF7Iek5alkhLnXTLKmsQ/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tải Tài liệu & BTVN Buổi 17 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Rèn luyện các chuyên đề chứng minh góc bằng nhau, chứng minh song song và thẳng hàng dựa vào tam giác bằng nhau.</p>` },
    { id: 'c1-l18', chapterId: ch1_4.id, title: 'Buổi 18: Tam giác cân', duration: '91 phút', isPreview: false, videoUrl: 'https://www.youtube.com/embed/wv7hhfpAavM', documentUrl: 'https://drive.google.com/file/d/1zn0_eXrXZLfz0Wk3dGmDHER7DcAd1D10/preview', textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 18:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1zn0_eXrXZLfz0Wk3dGmDHER7DcAd1D10/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 18 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Lý thuyết tam giác cân, các định lý và cách chứng minh một tam giác là tam giác cân.</p>` },
    { id: 'c1-l19', chapterId: ch1_4.id, title: 'Buổi 19: Luyện tập hình học', duration: '102 phút', isPreview: false, videoUrl: 'https://www.youtube.com/embed/C4o5QqxL8xk', documentUrl: 'https://drive.google.com/file/d/1CX05V_1JyR50_1Q_5D7FsO2MWWMyFCaf/preview', textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 19:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1CX05V_1JyR50_1Q_5D7FsO2MWWMyFCaf/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tải Tài liệu & BTVN Buổi 19 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Luyện tập tổng hợp các dạng toán hình học phẳng, cách dựng hình và kỹ năng vẽ hình phụ.</p>` },
    { id: 'c1-l20', chapterId: ch1_4.id, title: 'Buổi 20: Luyện tập tổng hợp hình học', duration: '104 phút', isPreview: false, videoUrl: 'https://www.youtube.com/embed/uMaBCnyn0tU', documentUrl: 'https://drive.google.com/file/d/12MIE3f_j0xR4jnJGTsXRjoZmQBKA_E8Y/preview', textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 20:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/12MIE3f_j0xR4jnJGTsXRjoZmQBKA_E8Y/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 20 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Luyện tập tổng hợp các kiến thức hình học kỳ 1 lớp 7, chuẩn bị các chuyên đề nâng cao.</p>` },

    // Ch 5
    { id: 'c1-l21', chapterId: ch1_5.id, title: 'Buổi 21: Luyện tập về tính chất dãy tỉ số bằng nhau', duration: '79 phút', isPreview: false, videoUrl: 'https://www.youtube.com/embed/a3-HTRu_Sv4', documentUrl: 'https://drive.google.com/file/d/1mIZ2Q-ZCtudl6NN0jWwSzT39boW15KUO/preview', textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 21:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1mIZ2Q-ZCtudl6NN0jWwSzT39boW15KUO/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tải Tài liệu & BTVN Buổi 21 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Hệ thống lý thuyết và phương pháp giải bài toán tỉ lệ thức và dãy tỉ số bằng nhau nâng cao.</p>` },
    { id: 'c1-l22', chapterId: ch1_5.id, title: 'Buổi 22: Bài tập về vẽ thêm đường thẳng phụ', duration: '90 phút', isPreview: false, videoUrl: 'https://www.youtube.com/embed/_FikRnE59SU', documentUrl: 'https://drive.google.com/file/d/1_aAvw8e-82neW2rVOBViiMcDTpE1kA4s/preview', textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 22:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1_aAvw8e-82neW2rVOBViiMcDTpE1kA4s/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 22 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Phương pháp tư duy đột phá bằng cách vẽ thêm đường phụ trong chứng minh hình học phẳng.</p>` },
    { id: 'c1-l23', chapterId: ch1_5.id, title: 'Buổi 23: Mối quan hệ giữa đường vuông góc và đường xiên', duration: '96 phút', isPreview: false, videoUrl: 'https://www.youtube.com/embed/QhzcV-Ekgao', documentUrl: 'https://drive.google.com/file/d/1DfHc4dA2DMDjyi2nFCMQdeV4WYB-k6iL/preview', textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 23:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1DfHc4dA2DMDjyi2nFCMQdeV4WYB-k6iL/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 23 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Định lý về đường vuông góc, đường xiên, hình chiếu và các ứng dụng toán bất đẳng thức hình học.</p>` },
    { id: 'c1-l24', chapterId: ch1_5.id, title: 'Buổi 24: Mối quan hệ giữa ba cạnh của tam giác', duration: '95 phút', isPreview: false, videoUrl: 'https://www.youtube.com/embed/GaKAnMWK1Q0', documentUrl: 'https://drive.google.com/file/d/17hPhW7_BQWrwgjRNDE6zs0l-cj9MXBZ6/preview', textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 24:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/17hPhW7_BQWrwgjRNDE6zs0l-cj9MXBZ6/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 24 (PDF)
  </a>
  <a href="https://drive.google.com/file/d/1KXezL49rA2WMMJWFmCM9ixaD9sBltcJB/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200 no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    Bài tập Nâng cao (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Khái quát quan hệ giữa ba cạnh của một tam giác, định lý bất đẳng thức tam giác và điều kiện tồn tại tam giác.</p>` },
    { id: 'c1-l25', chapterId: ch1_5.id, title: 'Buổi 25: Nhân, chia đa thức một biến', duration: '99 phút', isPreview: false, videoUrl: 'https://www.youtube.com/embed/SDDKBGzR7io', documentUrl: 'https://drive.google.com/file/d/1ISdCw1WCZAuIO80oO4XxJokalaNlZ4jn/preview', textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 25:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1ISdCw1WCZAuIO80oO4XxJokalaNlZ4jn/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 25 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Các quy tắc nhân, chia đa thức một biến, phép chia hết và phép chia có dư nâng cao.</p>` },
    { id: 'c1-l26', chapterId: ch1_5.id, title: 'Buổi 26: Tính chất đường trung tuyến trong tam giác', duration: '99 phút', isPreview: false, videoUrl: 'https://www.youtube.com/embed/L2ntGLV7ojE', documentUrl: 'https://drive.google.com/file/d/1enc6SJTOtNKq2bZ6TM4EkRHCRgXexXBz/preview', textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 26:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1enc6SJTOtNKq2bZ6TM4EkRHCRgXexXBz/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 26 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Định lý về ba đường trung tuyến của tam giác, tính chất trọng tâm và các dạng toán chứng minh tỉ lệ độ dài liên quan.</p>` },
    { id: 'c1-l27', chapterId: ch1_5.id, title: 'Buổi 27: Tính chất đường phân giác trong tam giác', duration: '101 phút', isPreview: false, videoUrl: 'https://www.youtube.com/embed/QOz9F1U1mzs', documentUrl: 'https://drive.google.com/file/d/1opdtPPC-YGnSsz5ivDsO9IlbrLD1q9m_/preview', textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 27:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1opdtPPC-YGnSsz5ivDsO9IlbrLD1q9m_/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 27 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Tính chất đường phân giác của một góc, ba đường phân giác của tam giác đồng quy tại điểm cách đều ba cạnh.</p>` },
    { id: 'c1-l28', chapterId: ch1_5.id, title: 'Buổi 28: Xác suất của biến cố', duration: '95 phút', isPreview: false, videoUrl: 'https://www.youtube.com/embed/eLvRgv8QJKQ', documentUrl: 'https://drive.google.com/file/d/1VAjfCzj6PBCBVsuSsN5FRgiIR782ohBN/preview', textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 28:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1VAjfCzj6PBCBVsuSsN5FRgiIR782ohBN/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 28 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Lý thuyết xác suất thực nghiệm, định nghĩa biến cố ngẫu nhiên và cách tính xác suất của biến cố đơn giản.</p>` },
    { id: 'c1-l29', chapterId: ch1_5.id, title: 'Buổi 29: Luyện đề hình học (1)', duration: '100 phút', isPreview: false, videoUrl: 'https://www.youtube.com/embed/ig5QB69G9h4', documentUrl: 'https://drive.google.com/file/d/1npfABKpKaY7MZNczIIv5yK9CaGGrddrx/preview', textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 29:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1npfABKpKaY7MZNczIIv5yK9CaGGrddrx/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 29 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Luyện đề tổng hợp số 1 môn Hình học THCS lớp 7 nâng cao, rèn luyện cách trình bày bài tự luận.</p>` },
    { id: 'c1-l30', chapterId: ch1_5.id, title: 'Buổi 30: Luyện đề hình học (2)', duration: '101 phút', isPreview: false, videoUrl: 'https://www.youtube.com/embed/C3El5e_3044', documentUrl: 'https://drive.google.com/file/d/1dtIcCPhXHncYkcZKjn6VXk-rp9N4O6Es/preview', textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 30:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1dtIcCPhXHncYkcZKjn6VXk-rp9N4O6Es/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 30 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Luyện đề tổng hợp số 2 môn Hình học phẳng nâng cao, ôn tập chuẩn chỉnh toàn bộ chương trình cả năm.</p>` }
  ];

  for (const lesson of c1Lessons) {
    await prisma.lesson.create({ data: lesson });
  }

  console.log('Seeding Course 2 chapters and lessons...');
  // Chapters for Course 2
  const ch2_1 = await prisma.chapter.create({ data: { courseId: 'c2', title: 'Chương 1: Đa thức và Các phép toán đa thức (10 bài giảng)' } });
  const ch2_2 = await prisma.chapter.create({ data: { courseId: 'c2', title: 'Chương 2: Hằng đẳng thức đáng nhớ (10 bài giảng)' } });
  const ch2_3 = await prisma.chapter.create({ data: { courseId: 'c2', title: 'Chương 3: Tứ giác & Hình học phẳng (10 bài giảng)' } });

  // Lessons for Course 2 (first 3 populated, remaining 27 placeholder locks)
  const c2Lessons = [
    // Ch 1 (First 3 populated)
    { id: 'c2-l1', chapterId: ch2_1.id, title: '1. Đơn thức và đa thức nhiều biến', duration: '15:20', isPreview: true, videoUrl: 'https://www.youtube.com/embed/c9Wg6A_eLXY', documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', textContent: '<h4 class="font-bold text-slate-800 text-sm mb-2">Nội dung bài học 1:</h4><p class="text-xs text-slate-500 mb-2">Đơn thức là biểu thức đại số chỉ gồm một số, hoặc một biến, hoặc một tích giữa các số và các biến. Đa thức là một tổng của những đơn thức. Mỗi đơn thức trong tổng đó gọi là một hạng tử của đa thức.</p>' },
    { id: 'c2-l2', chapterId: ch2_1.id, title: '2. Các phép toán cộng và trừ đa thức', duration: '18:10', isPreview: true, videoUrl: 'https://www.youtube.com/embed/c9Wg6A_eLXY', documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', textContent: '<h4 class="font-bold text-slate-800 text-sm mb-2">Nội dung bài học 2:</h4><p class="text-xs text-slate-500 mb-2">Để cộng hay trừ hai đa thức, ta thực hiện theo các bước: 1. Viết phép tính cộng/trừ giữa hai đa thức đặt trong ngoặc. 2. Phá ngoặc (lưu ý đổi dấu nếu trước ngoặc có dấu trừ). 3. Nhóm các đơn thức đồng dạng và thu gọn.</p>' },
    { id: 'c2-l3', chapterId: ch2_1.id, title: '3. Nhân đơn thức và đa thức', duration: '20:15', isPreview: true, videoUrl: 'https://www.youtube.com/embed/c9Wg6A_eLXY', documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', textContent: '<h4 class="font-bold text-slate-800 text-sm mb-2">Nội dung bài học 3:</h4><p class="text-xs text-slate-500 mb-2">Quy tắc nhân đơn thức với đa thức: Muốn nhân một đơn thức với một đa thức, ta nhân đơn thức với từng hạng tử của đa thức rồi cộng các tích với nhau: A(B + C) = AB + AC.</p>' },
    
    // Ch 1 placeholders
    { id: 'c2-l4', chapterId: ch2_1.id, title: '4. Phép chia đa thức cho đơn thức', duration: '19:40', isPreview: false },
    { id: 'c2-l5', chapterId: ch2_1.id, title: '5. Luyện tập tổng hợp Chương 1', duration: '22:15', isPreview: false },
    { id: 'c2-l6', chapterId: ch2_1.id, title: '6. Phân tích đa thức thành nhân tử (Bằng đặt nhân tử chung)', duration: '21:30', isPreview: false },
    { id: 'c2-l7', chapterId: ch2_1.id, title: '7. Phân tích đa thức bằng phương pháp dùng hằng đẳng thức', duration: '23:45', isPreview: false },
    { id: 'c2-l8', chapterId: ch2_1.id, title: '8. Phân tích đa thức bằng nhóm hạng tử', duration: '20:50', isPreview: false },
    { id: 'c2-l9', chapterId: ch2_1.id, title: '9. Phân tích đa thức phối hợp nhiều phương pháp', duration: '24:10', isPreview: false },
    { id: 'c2-l10', chapterId: ch2_1.id, title: '10. Bài tập nâng cao phân tích đa thức thành nhân tử', duration: '25:00', isPreview: false },

    // Ch 2
    { id: 'c2-l11', chapterId: ch2_2.id, title: '11. Bình phương của một tổng và một hiệu', duration: '18:20', isPreview: false },
    { id: 'c2-l12', chapterId: ch2_2.id, title: '12. Hiệu hai bình phương', duration: '17:15', isPreview: false },
    { id: 'c2-l13', chapterId: ch2_2.id, title: '13. Lập phương của một tổng và một hiệu', duration: '22:10', isPreview: false },
    { id: 'c2-l14', chapterId: ch2_2.id, title: '14. Tổng và hiệu hai lập phương', duration: '21:40', isPreview: false },
    { id: 'c2-l15', chapterId: ch2_2.id, title: '15. Luyện tập ứng dụng hằng đẳng thức tính nhanh', duration: '19:50', isPreview: false },
    { id: 'c2-l16', chapterId: ch2_2.id, title: '16. Phân thức đại số và tính chất cơ bản', duration: '22:15', isPreview: false },
    { id: 'c2-l17', chapterId: ch2_2.id, title: '17. Rút gọn phân thức đại số', duration: '24:30', isPreview: false },
    { id: 'c2-l18', chapterId: ch2_2.id, title: '18. Cộng và trừ phân thức đại số', duration: '26:10', isPreview: false },
    { id: 'c2-l19', chapterId: ch2_2.id, title: '19. Nhân và chia phân thức đại số', duration: '25:40', isPreview: false },
    { id: 'c2-l20', chapterId: ch2_2.id, title: '20. Ôn tập chương hằng đẳng thức & phân thức', duration: '28:00', isPreview: false },

    // Ch 3
    { id: 'c2-l21', chapterId: ch2_3.id, title: '21. Khái niệm Tứ giác lồi và định lí tổng các góc', duration: '20:15', isPreview: false },
    { id: 'c2-l22', chapterId: ch2_3.id, title: '22. Hình thang, hình thang cân và tính chất', duration: '22:45', isPreview: false },
    { id: 'c2-l23', chapterId: ch2_3.id, title: '23. Hình bình hành và dấu hiệu nhận biết', duration: '25:30', isPreview: false },
    { id: 'c2-l24', chapterId: ch2_3.id, title: '24. Hình chữ nhật và ứng dụng đường trung tuyến', duration: '24:10', isPreview: false },
    { id: 'c2-l25', chapterId: ch2_3.id, title: '25. Hình thoi và tính chất đối xứng đường chéo', duration: '23:15', isPreview: false },
    { id: 'c2-l26', chapterId: ch2_3.id, title: '26. Hình vuông và mối quan hệ giữa các tứ giác', duration: '26:50', isPreview: false },
    { id: 'c2-l27', chapterId: ch2_3.id, title: '27. Định lí Thalès trong tam giác', duration: '28:10', isPreview: false },
    { id: 'c2-l28', chapterId: ch2_3.id, title: '28. Đường trung bình của tam giác', duration: '22:30', isPreview: false },
    { id: 'c2-l29', chapterId: ch2_3.id, title: '29. Luyện tập chứng minh hình học tứ giác', duration: '30:00', isPreview: false },
    { id: 'c2-l30', chapterId: ch2_3.id, title: '30. Ôn tập học kỳ 1 môn Toán lớp 8', duration: '32:00', isPreview: false },
  ];

  for (const lesson of c2Lessons) {
    await prisma.lesson.create({ data: lesson });
  }

  console.log('Seeding student enrollment records...');
  // s1 (Demo Student) Enrollments
  await prisma.enrollment.create({
    data: {
      userId: 's1',
      courseId: 'c1',
      progress: 25,
      completedLessons: ['c1-l1', 'c1-l2', 'c1-l3', 'c1-l4', 'c1-l5', 'c1-l6', 'c1-l7', 'c1-l8'],
    },
  });
  await prisma.enrollment.create({
    data: {
      userId: 's1',
      courseId: 'c2',
      progress: 10,
      completedLessons: ['c2-l1', 'c2-l2', 'c2-l3'],
    },
  });

  // s2 Complete Enrollment
  await prisma.enrollment.create({
    data: {
      userId: 's2',
      courseId: 'c1',
      progress: 100,
      completedLessons: c1Lessons.map((l) => l.id),
    },
  });

  // s3 Enrollment
  await prisma.enrollment.create({
    data: { userId: 's3', courseId: 'c1', progress: 6, completedLessons: ['c1-l1', 'c1-l2'] },
  });
  await prisma.enrollment.create({
    data: { userId: 's3', courseId: 'c2', progress: 3, completedLessons: ['c2-l1'] },
  });

  // s4 Enrollment
  await prisma.enrollment.create({
    data: { userId: 's4', courseId: 'c2', progress: 6, completedLessons: ['c2-l1', 'c2-l2'] },
  });

  // s5 Enrollment
  await prisma.enrollment.create({
    data: { userId: 's5', courseId: 'c1', progress: 3, completedLessons: ['c1-l1'] },
  });

  // s6 Enrollment
  await prisma.enrollment.create({
    data: {
      userId: 's6',
      courseId: 'c1',
      progress: 50,
      completedLessons: c1Lessons.slice(0, 16).map((l) => l.id),
    },
  });

  // s7 Enrollment
  await prisma.enrollment.create({
    data: { userId: 's7', courseId: 'c2', progress: 10, completedLessons: ['c2-l1', 'c2-l2', 'c2-l3'] },
  });

  // s8 Enrollment
  await prisma.enrollment.create({
    data: { userId: 's8', courseId: 'c2', progress: 10, completedLessons: ['c2-l1', 'c2-l2', 'c2-l3'] },
  });

  // s9 Enrollment
  await prisma.enrollment.create({
    data: { userId: 's9', courseId: 'c1', progress: 25, completedLessons: ['c1-l1', 'c1-l2', 'c1-l3', 'c1-l4', 'c1-l5', 'c1-l6', 'c1-l7', 'c1-l8'] },
  });

  // s11 Enrollment
  await prisma.enrollment.create({
    data: { userId: 's11', courseId: 'c1', progress: 6, completedLessons: ['c1-l1', 'c1-l2'] },
  });

  // s12 Enrollment
  await prisma.enrollment.create({
    data: { userId: 's12', courseId: 'c2', progress: 10, completedLessons: ['c2-l1', 'c2-l2', 'c2-l3'] },
  });

  console.log('Seeding transaction orders...');
  const orders = [
    { id: 'ord1', studentId: 's1', courseId: 'c1', courseTitle: 'Khóa học Toán Nâng cao lớp 7 - Bộ sách Kết Nối Tri Thức', amount: 590000, method: 'credit_card', status: 'completed', date: '2026-06-10T08:35:00Z' },
    { id: 'ord2', studentId: 's1', courseId: 'c2', courseTitle: 'Khóa học Toán lớp 8 cơ bản - Bộ sách Kết Nối Tri Thức', amount: 490000, method: 'bank_transfer', status: 'completed', date: '2026-06-12T14:20:00Z' },
    { id: 'ord3', studentId: 's2', courseId: 'c1', courseTitle: 'Khóa học Toán Nâng cao lớp 7 - Bộ sách Kết Nối Tri Thức', amount: 590000, method: 'paypal', status: 'completed', date: '2026-06-15T11:00:00Z' },
    { id: 'ord4', studentId: 's3', courseId: 'c1', courseTitle: 'Khóa học Toán Nâng cao lớp 7 - Bộ sách Kết Nối Tri Thức', amount: 590000, method: 'credit_card', status: 'completed', date: '2026-06-18T09:45:00Z' },
    { id: 'ord5', studentId: 's3', courseId: 'c2', courseTitle: 'Khóa học Toán lớp 8 cơ bản - Bộ sách Kết Nối Tri Thức', amount: 490000, method: 'bank_transfer', status: 'completed', date: '2026-06-20T16:30:00Z' },
    { id: 'ord6', studentId: 's4', courseId: 'c2', courseTitle: 'Khóa học Toán lớp 8 cơ bản - Bộ sách Kết Nối Tri Thức', amount: 490000, method: 'credit_card', status: 'completed', date: '2026-06-22T10:15:00Z' },
    { id: 'ord7', studentId: 's5', courseId: 'c1', courseTitle: 'Khóa học Toán Nâng cao lớp 7 - Bộ sách Kết Nối Tri Thức', amount: 590000, method: 'bank_transfer', status: 'completed', date: '2026-06-24T08:12:00Z' },
    { id: 'ord8', studentId: 's6', courseId: 'c1', courseTitle: 'Khóa học Toán Nâng cao lớp 7 - Bộ sách Kết Nối Tri Thức', amount: 590000, method: 'credit_card', status: 'completed', date: '2026-06-26T13:50:00Z' },
    { id: 'ord9', studentId: 's7', courseId: 'c2', courseTitle: 'Khóa học Toán lớp 8 cơ bản - Bộ sách Kết Nối Tri Thức', amount: 490000, method: 'paypal', status: 'completed', date: '2026-06-29T10:30:00Z' },
    { id: 'ord10', studentId: 's8', courseId: 'c2', courseTitle: 'Khóa học Toán lớp 8 cơ bản - Bộ sách Kết Nối Tri Thức', amount: 490000, method: 'credit_card', status: 'completed', date: '2026-07-01T11:20:00Z' },
    { id: 'ord11', studentId: 's9', courseId: 'c1', courseTitle: 'Khóa học Toán Nâng cao lớp 7 - Bộ sách Kết Nối Tri Thức', amount: 590000, method: 'bank_transfer', status: 'completed', date: '2026-07-02T15:45:00Z' },
    { id: 'ord12', studentId: 's10', courseId: 'c1', courseTitle: 'Khóa học Toán Nâng cao lớp 7 - Bộ sách Kết Nối Tri Thức', amount: 590000, method: 'paypal', status: 'completed', date: '2026-07-03T09:00:00Z' },
    { id: 'ord13', studentId: 's12', courseId: 'c2', courseTitle: 'Khóa học Toán lớp 8 cơ bản - Bộ sách Kết Nối Tri Thức', amount: 490000, method: 'bank_transfer', status: 'completed', date: '2026-07-07T16:20:00Z' },
    { id: 'ord14', studentId: 's1', courseId: 'c2', courseTitle: 'Khóa học Toán lớp 8 cơ bản - Bộ sách Kết Nối Tri Thức', amount: 490000, method: 'credit_card', status: 'pending', date: '2026-07-09T08:15:00Z' }
  ];

  for (const o of orders) {
    await prisma.order.create({
      data: {
        id: o.id,
        userId: o.studentId,
        courseId: o.courseId,
        amount: o.amount,
        paymentMethod: o.method,
        status: o.status,
        date: new Date(o.date),
      },
    });
  }

  console.log('Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
