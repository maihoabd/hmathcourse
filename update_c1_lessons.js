const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    console.log('Updating lesson c1-l2 (Buổi 2)...');
    await prisma.lesson.update({
      where: { id: 'c1-l2' },
      data: {
        videoUrl: 'https://www.youtube.com/embed/z_3rm6Ldh78',
        documentUrl: 'https://drive.google.com/file/d/15iEAj6HW85USuSZVy319JNrjV7Nssx6X/preview',
        textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 2:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/15iEAj6HW85USuSZVy319JNrjV7Nssx6X/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 2 (PDF)
  </a>
  <a href="https://drive.google.com/file/d/1xFlMHUYFyaGv3gI_dG6aprVyogMVr2vE/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200 no-underline">
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
      }
    });

    console.log('Updating lesson c1-l3 (Buổi 3)...');
    await prisma.lesson.update({
      where: { id: 'c1-l3' },
      data: {
        videoUrl: 'https://www.youtube.com/embed/jZj8MmiyNC0',
        documentUrl: 'https://drive.google.com/file/d/1VogcqF5F5hQDpGgKi77972nZZb8DqlUl/preview',
        textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 3:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1VogcqF5F5hQDpGgKi77972nZZb8DqlUl/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 3 (PDF)
  </a>
  <a href="https://drive.google.com/file/d/1fXgqABceRCtGaKRrvMSbY5OQChA5ezVa/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-indigo-655 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200 no-underline">
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
      }
    });

    console.log('Updating lesson c1-l4 (Buổi 4)...');
    await prisma.lesson.update({
      where: { id: 'c1-l4' },
      data: {
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
      }
    });

    console.log('Updating lesson c1-l5 (Buổi 5)...');
    await prisma.lesson.update({
      where: { id: 'c1-l5' },
      data: {
        videoUrl: 'https://www.youtube.com/embed/ZggS8THMXyU',
        documentUrl: 'https://drive.google.com/file/d/1paKtZ4luIfQEmXIWfncR_MPXxULxE8UD/preview',
        textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 5:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1paKtZ4luIfQEmXIWfncR_MPXxULxE8UD/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 5 (PDF)
  </a>
  <a href="https://drive.google.com/file/d/12ZoKt6S4U7AiqzR0Btx66KoN2E7ISSum/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-indigo-755 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200 no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    Bài tập Buổi 5 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Lý thuyết hình học đầu tiên về góc kề bù, đối đỉnh và tia phân giác của một góc.</p>`
      }
    });

    console.log('Updating lesson c1-l6 (Buổi 6)...');
    await prisma.lesson.update({
      where: { id: 'c1-l6' },
      data: {
        documentUrl: 'https://drive.google.com/file/d/1KMwvxoW-7a3qLhju7Di8T4NgT_2mn-a2/preview',
        textContent: `<h4 class="font-bold text-slate-800 text-sm mb-2">Tài liệu & Bài tập Buổi 6:</h4>
<div class="flex flex-wrap gap-2.5 mt-2 mb-4">
  <a href="https://drive.google.com/file/d/1KMwvxoW-7a3qLhju7Di8T4NgT_2mn-a2/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
    Tài liệu Buổi 6 (PDF)
  </a>
  <a href="https://drive.google.com/file/d/1_iypn3KRPBmdCr2P2_d1AgYTe8tKFeOy/view?usp=sharing" target="_blank" class="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-indigo-755 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200 no-underline">
    <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    Bài tập Buổi 6 (PDF)
  </a>
</div>
<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung học:</h4>
<p class="text-xs text-slate-500 leading-relaxed">Bài học về hai đường thẳng song song và các góc đồng vị, so le trong nâng cao.</p>`
      }
    });

    console.log('SUCCESS! Database updated with new session details.');
  } catch (err) {
    console.error('Database Update Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
