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
      title: 'Khóa học Toán Nâng cao lớp 7 - Bộ sách Kết Nối Tri Thức',
      shortDescription: 'Chương trình Toán 7 nâng cao bám sát bộ sách Kết Nối Tri Thức. Giúp học sinh đạt điểm 9, 10 trong các kỳ thi.',
      description: 'Khóa học thiết kế chuyên sâu dành cho học sinh lớp 7 muốn chinh phục các bài toán khó, nâng cao tư duy logic và đạt kết quả tốt nhất trong các kỳ thi Học sinh giỏi và kiểm tra định kỳ. Nội dung bám sát khung chương trình sách giáo khoa Kết Nối Tri Thức Với Cuộc Sống, mở rộng thêm các chuyên đề bồi dưỡng nâng cao phong phú như Số hữu tỉ nâng cao, dãy tỉ số bằng nhau, bất đẳng thức tam giác và các bài toán hình học chuyên sâu.',
      price: 590000,
      originalPrice: 990000,
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=60',
      category: 'Toán lớp 7',
      level: 'Advanced',
      lessonsCount: 30,
      duration: '22 giờ 30 phút',
      rating: 4.9,
      reviewsCount: 42,
      studentsCount: 320,
      isBestseller: true,
      instructorName: 'Thầy Hoàng HMath',
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
      title: 'Khóa học Toán lớp 8 cơ bản - Bộ sách Kết Nối Tri Thức',
      shortDescription: 'Toàn bộ chương trình toán lớp 8 cơ bản chuẩn chỉnh theo sách giáo khoa Kết Nối Tri Thức. Tích hợp 3 bài giảng đầu hoàn chỉnh.',
      description: 'Khóa học được xây dựng nhằm giúp các em học sinh lớp 8 nắm chắc kiến thức căn bản môn Toán. Chương trình bám sát bộ sách giáo khoa Kết Nối Tri Thức Với Cuộc Sống. Giai đoạn hiện tại hệ thống đã tải lên trước 3 video bài giảng chất lượng cao đầu tiên để học sinh tự học tại nhà, các bài giảng tiếp theo (tổng 30 bài) sẽ liên tục được cập nhật theo tiến độ năm học.',
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
      instructorName: 'Thầy Hoàng HMath',
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
      duration: '25:15',
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
    { id: 'c1-l2', chapterId: ch1_1.id, title: 'Buổi 2: Số hữu tỉ và các phép tính (2)', duration: '20:10', isPreview: false },
    { id: 'c1-l3', chapterId: ch1_1.id, title: 'Buổi 3: Số hữu tỉ và các phép tính (3)', duration: '22:45', isPreview: false },
    { id: 'c1-l4', chapterId: ch1_1.id, title: 'Buổi 4: Chữa bài tập tổng hợp Số hữu tỉ và các phép tính', duration: '24:30', isPreview: false },
    
    // Ch 2
    { id: 'c1-l5', chapterId: ch1_2.id, title: 'Buổi 5: Góc và đường thẳng song song (1)', duration: '21:15', isPreview: false },
    { id: 'c1-l6', chapterId: ch1_2.id, title: 'Buổi 6: Góc và đường thẳng song song (2)', duration: '18:50', isPreview: false },
    { id: 'c1-l7', chapterId: ch1_2.id, title: 'Buổi 7: Luyện tập về đường thẳng song song (3)', duration: '20:45', isPreview: false },
    { id: 'c1-l8', chapterId: ch1_2.id, title: 'Buổi 8: Góc và đường thẳng song song (4)', duration: '23:10', isPreview: false },

    // Ch 3
    { id: 'c1-l9', chapterId: ch1_3.id, title: 'Buổi 9: Số thực (1)', duration: '19:40', isPreview: false },
    { id: 'c1-l10', chapterId: ch1_3.id, title: 'Buổi 10: Số thực (2)', duration: '22:15', isPreview: false },
    { id: 'c1-l11', chapterId: ch1_3.id, title: 'Buổi 11: Số thực (3)', duration: '20:50', isPreview: false },
    { id: 'c1-l12', chapterId: ch1_3.id, title: 'Buổi 12: Số thực (4)', duration: '21:30', isPreview: false },

    // Ch 4
    { id: 'c1-l13', chapterId: ch1_4.id, title: 'Buổi 13: Tam giác bằng nhau (1)', duration: '23:45', isPreview: false },
    { id: 'c1-l14', chapterId: ch1_4.id, title: 'Buổi 14: Tam giác bằng nhau (2)', duration: '25:20', isPreview: false },
    { id: 'c1-l15', chapterId: ch1_4.id, title: 'Buổi 15: Tam giác bằng nhau (3)', duration: '24:10', isPreview: false },
    { id: 'c1-l16', chapterId: ch1_4.id, title: 'Buổi 16: Các trường hợp bằng nhau của tam giác vuông', duration: '26:15', isPreview: false },
    { id: 'c1-l17', chapterId: ch1_4.id, title: 'Buổi 17: Luyện tập tam giác bằng nhau', duration: '22:30', isPreview: false },
    { id: 'c1-l18', chapterId: ch1_4.id, title: 'Buổi 18: Tam giác cân', duration: '24:50', isPreview: false },
    { id: 'c1-l19', chapterId: ch1_4.id, title: 'Buổi 19: Luyện tập hình học', duration: '28:10', isPreview: false },
    { id: 'c1-l20', chapterId: ch1_4.id, title: 'Buổi 20: Luyện tập tổng hợp hình học', duration: '30:00', isPreview: false },

    // Ch 5
    { id: 'c1-l21', chapterId: ch1_5.id, title: 'Buổi 21: Luyện tập về tính chất dãy tỉ số bằng nhau', duration: '25:40', isPreview: false },
    { id: 'c1-l22', chapterId: ch1_5.id, title: 'Buổi 22: Bài tập về vẽ thêm đường thẳng phụ', duration: '28:15', isPreview: false },
    { id: 'c1-l23', chapterId: ch1_5.id, title: 'Buổi 23: Mối quan hệ giữa đường vuông góc và đường xiên', duration: '26:30', isPreview: false },
    { id: 'c1-l24', chapterId: ch1_5.id, title: 'Buổi 24: Mối quan hệ giữa ba cạnh của tam giác', duration: '24:50', isPreview: false },
    { id: 'c1-l25', chapterId: ch1_5.id, title: 'Buổi 25: Nhân, chia đa thức một biến', duration: '27:15', isPreview: false },
    { id: 'c1-l26', chapterId: ch1_5.id, title: 'Buổi 26: Tính chất đường trung tuyến trong tam giác', duration: '29:40', isPreview: false },
    { id: 'c1-l27', chapterId: ch1_5.id, title: 'Buổi 27: Tính chất đường phân giác trong tam giác', duration: '28:30', isPreview: false },
    { id: 'c1-l28', chapterId: ch1_5.id, title: 'Buổi 28: Xác suất của biến cố', duration: '22:15', isPreview: false },
    { id: 'c1-l29', chapterId: ch1_5.id, title: 'Buổi 29: Luyện đề hình học (1)', duration: '32:00', isPreview: false },
    { id: 'c1-l30', chapterId: ch1_5.id, title: 'Buổi 30: Luyện đề hình học (2)', duration: '35:00', isPreview: false }
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
