const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    console.log('Updating course c1 meta...');
    await prisma.course.update({
      where: { id: 'c1' },
      data: {
        lessonsCount: 30,
        duration: '22 giờ 30 phút'
      }
    });

    console.log('Clearing old chapters and lessons for c1...');
    // onDelete: Cascade will delete lessons too
    await prisma.chapter.deleteMany({
      where: { courseId: 'c1' }
    });

    console.log('Creating new chapters...');
    const ch1 = await prisma.chapter.create({ data: { courseId: 'c1', title: 'Chương 1: Số hữu tỉ nâng cao (4 bài học)' } });
    const ch2 = await prisma.chapter.create({ data: { courseId: 'c1', title: 'Chương 2: Góc & Đường thẳng song song (4 bài học)' } });
    const ch3 = await prisma.chapter.create({ data: { courseId: 'c1', title: 'Chương 3: Số thực & Căn bậc hai (4 bài học)' } });
    const ch4 = await prisma.chapter.create({ data: { courseId: 'c1', title: 'Chương 4: Tam giác bằng nhau chuyên sâu (8 bài học)' } });
    const ch5 = await prisma.chapter.create({ data: { courseId: 'c1', title: 'Chương 5: Chuyên đề nâng cao & Luyện đề (10 bài học)' } });

    console.log('Creating new 30 lessons...');
    const lessonsData = [
      // Chapter 1
      {
        id: 'c1-l1',
        chapterId: ch1.id,
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
      { id: 'c1-l2', chapterId: ch1.id, title: 'Buổi 2: Số hữu tỉ và các phép tính (2)', duration: '20:10', isPreview: false },
      { id: 'c1-l3', chapterId: ch1.id, title: 'Buổi 3: Số hữu tỉ và các phép tính (3)', duration: '22:45', isPreview: false },
      { id: 'c1-l4', chapterId: ch1.id, title: 'Buổi 4: Chữa bài tập tổng hợp Số hữu tỉ và các phép tính', duration: '24:30', isPreview: false },

      // Chapter 2
      { id: 'c1-l5', chapterId: ch2.id, title: 'Buổi 5: Góc và đường thẳng song song (1)', duration: '21:15', isPreview: false },
      { id: 'c1-l6', chapterId: ch2.id, title: 'Buổi 6: Góc và đường thẳng song song (2)', duration: '18:50', isPreview: false },
      { id: 'c1-l7', chapterId: ch2.id, title: 'Buổi 7: Luyện tập về đường thẳng song song (3)', duration: '20:45', isPreview: false },
      { id: 'c1-l8', chapterId: ch2.id, title: 'Buổi 8: Góc và đường thẳng song song (4)', duration: '23:10', isPreview: false },

      // Chapter 3
      { id: 'c1-l9', chapterId: ch3.id, title: 'Buổi 9: Số thực (1)', duration: '19:40', isPreview: false },
      { id: 'c1-l10', chapterId: ch3.id, title: 'Buổi 10: Số thực (2)', duration: '22:15', isPreview: false },
      { id: 'c1-l11', chapterId: ch3.id, title: 'Buổi 11: Số thực (3)', duration: '20:50', isPreview: false },
      { id: 'c1-l12', chapterId: ch3.id, title: 'Buổi 12: Số thực (4)', duration: '21:30', isPreview: false },

      // Chapter 4
      { id: 'c1-l13', chapterId: ch4.id, title: 'Buổi 13: Tam giác bằng nhau (1)', duration: '23:45', isPreview: false },
      { id: 'c1-l14', chapterId: ch4.id, title: 'Buổi 14: Tam giác bằng nhau (2)', duration: '25:20', isPreview: false },
      { id: 'c1-l15', chapterId: ch4.id, title: 'Buổi 15: Tam giác bằng nhau (3)', duration: '24:10', isPreview: false },
      { id: 'c1-l16', chapterId: ch4.id, title: 'Buổi 16: Các trường hợp bằng nhau của tam giác vuông', duration: '26:15', isPreview: false },
      { id: 'c1-l17', chapterId: ch4.id, title: 'Buổi 17: Luyện tập tam giác bằng nhau', duration: '22:30', isPreview: false },
      { id: 'c1-l18', chapterId: ch4.id, title: 'Buổi 18: Tam giác cân', duration: '24:50', isPreview: false },
      { id: 'c1-l19', chapterId: ch4.id, title: 'Buổi 19: Luyện tập hình học', duration: '28:10', isPreview: false },
      { id: 'c1-l20', chapterId: ch4.id, title: 'Buổi 20: Luyện tập tổng hợp hình học', duration: '30:00', isPreview: false },

      // Chapter 5
      { id: 'c1-l21', chapterId: ch5.id, title: 'Buổi 21: Luyện tập về tính chất dãy tỉ số bằng nhau', duration: '25:40', isPreview: false },
      { id: 'c1-l22', chapterId: ch5.id, title: 'Buổi 22: Bài tập về vẽ thêm đường thẳng phụ', duration: '28:15', isPreview: false },
      { id: 'c1-l23', chapterId: ch5.id, title: 'Buổi 23: Mối quan hệ giữa đường vuông góc và đường xiên', duration: '26:30', isPreview: false },
      { id: 'c1-l24', chapterId: ch5.id, title: 'Buổi 24: Mối quan hệ giữa ba cạnh của tam giác', duration: '24:50', isPreview: false },
      { id: 'c1-l25', chapterId: ch5.id, title: 'Buổi 25: Nhân, chia đa thức một biến', duration: '27:15', isPreview: false },
      { id: 'c1-l26', chapterId: ch5.id, title: 'Buổi 26: Tính chất đường trung tuyến trong tam giác', duration: '29:40', isPreview: false },
      { id: 'c1-l27', chapterId: ch5.id, title: 'Buổi 27: Tính chất đường phân giác trong tam giác', duration: '28:30', isPreview: false },
      { id: 'c1-l28', chapterId: ch5.id, title: 'Buổi 28: Xác suất của biến cố', duration: '22:15', isPreview: false },
      { id: 'c1-l29', chapterId: ch5.id, title: 'Buổi 29: Luyện đề hình học (1)', duration: '32:00', isPreview: false },
      { id: 'c1-l30', chapterId: ch5.id, title: 'Buổi 30: Luyện đề hình học (2)', duration: '35:00', isPreview: false }
    ];

    for (const lesson of lessonsData) {
      await prisma.lesson.create({
        data: {
          id: lesson.id,
          chapterId: lesson.chapterId,
          title: lesson.title,
          duration: lesson.duration,
          isPreview: lesson.isPreview,
          videoUrl: lesson.videoUrl || null,
          documentUrl: lesson.documentUrl || null,
          textContent: lesson.textContent || null
        }
      });
    }

    console.log('SUCCESS! Course curriculum updated in DB.');
  } catch (err) {
    console.error('Database Update Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
