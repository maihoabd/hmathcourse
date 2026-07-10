const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updates = [
  {
    id: 'c1-l6',
    videoUrl: 'https://www.youtube.com/embed/Qye3u2dfI0g',
    documentUrl: 'https://drive.google.com/file/d/1KMwvxoW-7a3qLhju7Di8T4NgT_2mn-a2/preview',
    duration: '102 phút',
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
  {
    id: 'c1-l7',
    videoUrl: 'https://www.youtube.com/embed/EZ43xt22mrM',
    documentUrl: 'https://drive.google.com/file/d/1qDDmmQKVzmqwqb2fLT3H7hF6fyl3yahb/preview',
    duration: '103 phút',
    textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 7:</h4>
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
<p class="text-xs text-slate-500 leading-relaxed">Luyện tập sâu về chứng minh hai đường thẳng song song và tính số đo góc nâng cao.</p>`
  },
  {
    id: 'c1-l8',
    videoUrl: 'https://www.youtube.com/embed/s8qUWJOBbnc',
    documentUrl: 'https://drive.google.com/file/d/1hPkK5A2DRS7G_uamdQkeB4qzK_4gei6W/preview',
    duration: '101 phút',
    textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 8:</h4>
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
<p class="text-xs text-slate-500 leading-relaxed">Buổi học chuyên sâu về định lý góc có cạnh tương ứng song song và các dạng bài kiểm tra 1 tiết.</p>`
  },
  {
    id: 'c1-l9',
    videoUrl: 'https://www.youtube.com/embed/3UVcRT4SotA',
    documentUrl: 'https://drive.google.com/file/d/1u2DgkiOwyB-pCOoHygYA627m6DFyDHPb/preview',
    duration: '102 phút',
    textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 9:</h4>
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
<p class="text-xs text-slate-500 leading-relaxed">Bài giảng mở đầu về Số thực, khái niệm căn bậc hai số học và trục số thực.</p>`
  },
  {
    id: 'c1-l10',
    videoUrl: 'https://www.youtube.com/embed/zhYs8-gBjh4',
    documentUrl: 'https://drive.google.com/file/d/1n2XlNI4ZaWXlTCC4_Hy0E_RWPUg64n9-/preview',
    duration: '112 phút',
    textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 10:</h4>
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
<p class="text-xs text-slate-500 leading-relaxed">Các phương pháp giải bài toán chứa dấu giá trị tuyệt đối chuyên sâu (Phần 1).</p>`
  },
  {
    id: 'c1-l11',
    videoUrl: 'https://www.youtube.com/embed/rLXCMxhEla0',
    documentUrl: 'https://drive.google.com/file/d/1YeM-OkDZEqplY93f899xJ3e35a-1taH3/preview',
    duration: '108 phút',
    textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 11:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1YeM-OkDZEqplY93f899xJ3e35a-1taH3/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tải Tài liệu & BTVN Buổi 11 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Nâng cao kỹ năng giải bài toán tìm x và chứng minh chứa dấu giá trị tuyệt đối (Phần 2).</p>`
  },
  {
    id: 'c1-l12',
    videoUrl: 'https://www.youtube.com/embed/aV9TrY-pS_4',
    documentUrl: 'https://drive.google.com/file/d/1OJ8sd_cPlZznat7SuxfcH9VmSEiQbC0-/preview',
    duration: '105 phút',
    textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 12:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1OJ8sd_cPlZznat7SuxfcH9VmSEiQbC0-/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tải Tài liệu & BTVN Buổi 12 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Các bài toán nâng cao cuối chương số thực, ước lượng số học và chuẩn bị ôn thi học kỳ.</p>`
  },
  {
    id: 'c1-l13',
    videoUrl: 'https://www.youtube.com/embed/rkw998dFad4',
    documentUrl: 'https://drive.google.com/file/d/1Ejto2BN_HAv8YIfyeJ175YkMEf0d-bXY/preview',
    duration: '107 phút',
    textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 13:</h4>
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
<p class="text-xs text-slate-500 leading-relaxed">Khái niệm hai tam giác bằng nhau và trường hợp bằng nhau thứ nhất: Cạnh - Cạnh - Cạnh (c-c-c).</p>`
  },
  {
    id: 'c1-l14',
    videoUrl: 'https://www.youtube.com/embed/9YJoJWAgUKk',
    documentUrl: 'https://drive.google.com/file/d/1oiB0a-tql6WGiQD3P90xPJIxaFTVddHx/preview',
    duration: '113 phút',
    textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 14:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1oiB0a-tql6WGiQD3P90xPJIxaFTVddHx/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tải Tài liệu & BTVN Buổi 14 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Trường hợp bằng nhau thứ hai: Cạnh - Góc - Cạnh (c-g-c) và các định lý liên quan.</p>`
  },
  {
    id: 'c1-l15',
    videoUrl: 'https://www.youtube.com/embed/S9JXu7Mt-JQ',
    documentUrl: 'https://drive.google.com/file/d/1JtKwa8MANJuv7Dto6TGQBYW3RyBtDkzx/preview',
    duration: '110 phút',
    textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 15:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1JtKwa8MANJuv7Dto6TGQBYW3RyBtDkzx/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tải Tài liệu & BTVN Buổi 15 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Trường hợp bằng nhau thứ ba: Góc - Cạnh - Góc (g-c-g) và ứng dụng đo đạc khoảng cách thực tế.</p>`
  },
  {
    id: 'c1-l16',
    videoUrl: 'https://www.youtube.com/embed/qYk77fkHKsw',
    documentUrl: 'https://drive.google.com/file/d/177P1249e28gJitx5bLMPUmpwgqvFVLYH/preview',
    duration: '99 phút',
    textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 16:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/177P1249e28gJitx5bLMPUmpwgqvFVLYH/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tải Tài liệu & BTVN Buổi 16 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Hệ thống hóa các trường hợp bằng nhau đặc biệt của tam giác vuông (cạnh huyền - góc nhọn, cạnh huyền - cạnh góc vuông).</p>`
  },
  {
    id: 'c1-l17',
    videoUrl: 'https://www.youtube.com/embed/4OPvysM-1Ic',
    documentUrl: 'https://drive.google.com/file/d/1-d0H7Nnjby9exF7Iek5alkhLnXTLKmsQ/preview',
    duration: '103 phút',
    textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 17:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1-d0H7Nnjby9exF7Iek5alkhLnXTLKmsQ/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tải Tài liệu & BTVN Buổi 17 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Rèn luyện các chuyên đề chứng minh góc bằng nhau, chứng minh song song và thẳng hàng dựa vào tam giác bằng nhau.</p>`
  },
  {
    id: 'c1-l18',
    videoUrl: 'https://www.youtube.com/embed/wv7hhfpAavM',
    documentUrl: 'https://drive.google.com/file/d/1zn0_eXrXZLfz0Wk3dGmDHER7DcAd1D10/preview',
    duration: '91 phút',
    textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 18:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1zn0_eXrXZLfz0Wk3dGmDHER7DcAd1D10/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 18 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Lý thuyết tam giác cân, các định lý và cách chứng minh một tam giác là tam giác cân.</p>`
  },
  {
    id: 'c1-l19',
    videoUrl: 'https://www.youtube.com/embed/C4o5QqxL8xk',
    documentUrl: 'https://drive.google.com/file/d/1CX05V_1JyR50_1Q_5D7FsO2MWWMyFCaf/preview',
    duration: '102 phút',
    textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 19:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1CX05V_1JyR50_1Q_5D7FsO2MWWMyFCaf/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tải Tài liệu & BTVN Buổi 19 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Luyện tập tổng hợp các dạng toán hình học phẳng, cách dựng hình và kỹ năng vẽ hình phụ.</p>`
  }
];

async function run() {
  try {
    console.log('Starting bulk lessons update in DB...');
    for (const update of updates) {
      console.log(`Updating ${update.id}...`);
      await prisma.lesson.update({
        where: { id: update.id },
        data: {
          videoUrl: update.videoUrl,
          documentUrl: update.documentUrl,
          duration: update.duration,
          textContent: update.textContent
        }
      });
    }
    console.log('SUCCESS! All 14 lessons updated in DB.');
  } catch (err) {
    console.error('Update Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
