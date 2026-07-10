const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, 'prisma', 'seed.ts');
const coursesPath = path.join(__dirname, 'data', 'courses.ts');

const lessonUpdates = [
  {
    id: 'c1-l20',
    title: 'Buổi 20: Luyện tập tổng hợp hình học',
    videoUrl: 'https://www.youtube.com/embed/uMaBCnyn0tU',
    documentUrl: 'https://drive.google.com/file/d/12MIE3f_j0xR4jnJGTsXRjoZmQBKA_E8Y/preview',
    duration: '104 phút',
    textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 20:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/12MIE3f_j0xR4jnJGTsXRjoZmQBKA_E8Y/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 20 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Luyện tập tổng hợp các kiến thức hình học kỳ 1 lớp 7, chuẩn bị các chuyên đề nâng cao.</p>`
  },
  {
    id: 'c1-l21',
    title: 'Buổi 21: Luyện tập về tính chất dãy tỉ số bằng nhau',
    videoUrl: 'https://www.youtube.com/embed/a3-HTRu_Sv4',
    documentUrl: 'https://drive.google.com/file/d/1mIZ2Q-ZCtudl6NN0jWwSzT39boW15KUO/preview',
    duration: '79 phút',
    textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 21:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1mIZ2Q-ZCtudl6NN0jWwSzT39boW15KUO/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tải Tài liệu & BTVN Buổi 21 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Hệ thống lý thuyết và phương pháp giải bài toán tỉ lệ thức và dãy tỉ số bằng nhau nâng cao.</p>`
  },
  {
    id: 'c1-l22',
    title: 'Buổi 22: Bài tập về vẽ thêm đường thẳng phụ',
    videoUrl: 'https://www.youtube.com/embed/_FikRnE59SU',
    documentUrl: 'https://drive.google.com/file/d/1_aAvw8e-82neW2rVOBViiMcDTpE1kA4s/preview',
    duration: '90 phút',
    textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 22:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1_aAvw8e-82neW2rVOBViiMcDTpE1kA4s/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 22 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Phương pháp tư duy đột phá bằng cách vẽ thêm đường phụ trong chứng minh hình học phẳng.</p>`
  },
  {
    id: 'c1-l23',
    title: 'Buổi 23: Mối quan hệ giữa đường vuông góc và đường xiên',
    videoUrl: 'https://www.youtube.com/embed/QhzcV-Ekgao',
    documentUrl: 'https://drive.google.com/file/d/1DfHc4dA2DMDjyi2nFCMQdeV4WYB-k6iL/preview',
    duration: '96 phút',
    textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 23:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1DfHc4dA2DMDjyi2nFCMQdeV4WYB-k6iL/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 23 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Định lý về đường vuông góc, đường xiên, hình chiếu và các ứng dụng toán bất đẳng thức hình học.</p>`
  },
  {
    id: 'c1-l24',
    title: 'Buổi 24: Bất đẳng thức tam giác',
    videoUrl: 'https://www.youtube.com/embed/GaKAnMWK1Q0',
    documentUrl: 'https://drive.google.com/file/d/17hPhW7_BQWrwgjRNDE6zs0l-cj9MXBZ6/preview',
    duration: '95 phút',
    textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 24:</h4>
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
<p class="text-xs text-slate-500 leading-relaxed">Khái quát quan hệ giữa ba cạnh của một tam giác, định lý bất đẳng thức tam giác và điều kiện tồn tại tam giác.</p>`
  },
  {
    id: 'c1-l25',
    title: 'Buổi 25: Nhân, chia đa thức một biến',
    videoUrl: 'https://www.youtube.com/embed/SDDKBGzR7io',
    documentUrl: 'https://drive.google.com/file/d/1ISdCw1WCZAuIO80oO4XxJokalaNlZ4jn/preview',
    duration: '99 phút',
    textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 25:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1ISdCw1WCZAuIO80oO4XxJokalaNlZ4jn/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 25 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Các quy tắc nhân, chia đa thức một biến, phép chia hết và phép chia có dư nâng cao.</p>`
  },
  {
    id: 'c1-l26',
    title: 'Buổi 26: Tính chất đường trung tuyến trong tam giác',
    videoUrl: 'https://www.youtube.com/embed/L2ntGLV7ojE',
    documentUrl: 'https://drive.google.com/file/d/1enc6SJTOtNKq2bZ6TM4EkRHCRgXexXBz/preview',
    duration: '99 phút',
    textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 26:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1enc6SJTOtNKq2bZ6TM4EkRHCRgXexXBz/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 26 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Định lý về ba đường trung tuyến của tam giác, tính chất trọng tâm và các dạng toán chứng minh tỉ lệ độ dài liên quan.</p>`
  },
  {
    id: 'c1-l27',
    title: 'Buổi 27: Tính chất đường phân giác trong tam giác',
    videoUrl: 'https://www.youtube.com/embed/QOz9F1U1mzs',
    documentUrl: 'https://drive.google.com/file/d/1opdtPPC-YGnSsz5ivDsO9IlbrLD1q9m_/preview',
    duration: '101 phút',
    textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 27:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1opdtPPC-YGnSsz5ivDsO9IlbrLD1q9m_/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 27 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Tính chất đường phân giác của một góc, ba đường phân giác của tam giác đồng quy tại điểm cách đều ba cạnh.</p>`
  },
  {
    id: 'c1-l28',
    title: 'Buổi 28: Xác suất của biến cố',
    videoUrl: 'https://www.youtube.com/embed/eLvRgv8QJKQ',
    documentUrl: 'https://drive.google.com/file/d/1VAjfCzj6PBCBVsuSsN5FRgiIR782ohBN/preview',
    duration: '95 phút',
    textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 28:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1VAjfCzj6PBCBVsuSsN5FRgiIR782ohBN/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 28 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Lý thuyết xác suất thực nghiệm, định nghĩa biến cố ngẫu nhiên và cách tính xác suất của biến cố đơn giản.</p>`
  },
  {
    id: 'c1-l29',
    title: 'Buổi 29: Luyện đề hình học (1)',
    videoUrl: 'https://www.youtube.com/embed/ig5QB69G9h4',
    documentUrl: 'https://drive.google.com/file/d/1npfABKpKaY7MZNczIIv5yK9CaGGrddrx/preview',
    duration: '100 phút',
    textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 29:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1npfABKpKaY7MZNczIIv5yK9CaGGrddrx/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 29 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Luyện đề tổng hợp số 1 môn Hình học THCS lớp 7 nâng cao, rèn luyện cách trình bày bài tự luận.</p>`
  },
  {
    id: 'c1-l30',
    title: 'Buổi 30: Luyện đề hình học (2)',
    videoUrl: 'https://www.youtube.com/embed/C3El5e_3044',
    documentUrl: 'https://drive.google.com/file/d/1dtIcCPhXHncYkcZKjn6VXk-rp9N4O6Es/preview',
    duration: '101 phút',
    textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 30:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1dtIcCPhXHncYkcZKjn6VXk-rp9N4O6Es/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 30 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Luyện đề tổng hợp số 2 môn Hình học phẳng nâng cao, ôn tập chuẩn chỉnh toàn bộ chương trình cả năm.</p>`
  }
];

function patchFileContent(content, isSeedFile) {
  let patched = content;

  // Replace course titles
  if (isSeedFile) {
    patched = patched.replace(
      /title:\s*'Khóa học Toán Nâng cao lớp 7 - Bộ sách Kết Nối Tri Thức'/g,
      "title: 'Khóa học Toán 7 Kết nối tri thức'"
    );
    patched = patched.replace(
      /title:\s*'Khóa học Toán lớp 8 cơ bản - Bộ sách Kết Nối Tri Thức'/g,
      "title: 'Khóa học Toán 8 Kết nối tri thức'"
    );
  } else {
    patched = patched.replace(
      /title:\s*'Khóa học Toán Nâng cao lớp 7 - Bộ sách Kết Nối Tri Thức'/g,
      "title: 'Khóa học Toán 7 Kết nối tri thức'"
    );
    patched = patched.replace(
      /title:\s*'Khóa học Toán lớp 8 cơ bản - Bộ sách Kết Nối Tri Thức'/g,
      "title: 'Khóa học Toán 8 Kết nối tri thức'"
    );
  }

  // Replace each lesson details
  for (const item of lessonUpdates) {
    if (isSeedFile) {
      // Find: { id: 'c1-l20', chapterId: ch1_4.id, title: 'Buổi 20: Luyện tập tổng hợp hình học', duration: '30:00', isPreview: false },
      const regex = new RegExp(
        `(\\{\\s*id:\\s*'${item.id}',\\s*chapterId:\\s*ch1_\\d\\.id,\\s*title:\\s*['"][^'"]+['"],\\s*duration:\\s*['"])[^'"]+(['"],\\s*isPreview:\\s*\\w+)(\\s*\\})`,
        'g'
      );
      const replacement = `$1${item.duration}$2, videoUrl: '${item.videoUrl}', documentUrl: '${item.documentUrl}', textContent: \`${item.textContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`$3`;
      patched = patched.replace(regex, replacement);
    } else {
      // Find: { id: 'c1-l20', title: 'Buổi 20: Luyện tập tổng hợp hình học', duration: '30:00', isPreview: false },
      const regex = new RegExp(
        `(\\{\\s*id:\\s*'${item.id}',\\s*title:\\s*['"][^'"]+['"],\\s*duration:\\s*['"])[^'"]+(['"],\\s*isPreview:\\s*\\w+)(\\s*\\})`,
        'g'
      );
      const replacement = `$1${item.duration}$2, videoUrl: '${item.videoUrl}', documentUrl: '${item.documentUrl}', textContent: \`${item.textContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`$3`;
      patched = patched.replace(regex, replacement);
    }
  }

  return patched;
}

try {
  console.log('Patching prisma/seed.ts...');
  let seedContent = fs.readFileSync(seedPath, 'utf8');
  seedContent = patchFileContent(seedContent, true);
  
  // Also replace seed slug for c1 and c2 if we want, but titles are sufficient. Let's keep slug as is since user only asked to change titles.
  fs.writeFileSync(seedPath, seedContent, 'utf8');
  console.log('SUCCESS: prisma/seed.ts patched.');

  console.log('Patching data/courses.ts...');
  let coursesContent = fs.readFileSync(coursesPath, 'utf8');
  coursesContent = patchFileContent(coursesContent, false);
  fs.writeFileSync(coursesPath, coursesContent, 'utf8');
  console.log('SUCCESS: data/courses.ts patched.');
} catch (err) {
  console.error('Patching Error:', err);
}
