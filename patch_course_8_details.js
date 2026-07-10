const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\171b6a11-c577-42cc-95c4-03fd493eaa92';
const PUBLIC_IMAGES_DIR = path.join(__dirname, 'public', 'images');

// 1. Copy generated math 8 thumbnail
try {
  if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
    fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
  }

  const files = fs.readdirSync(ARTIFACTS_DIR);
  const thumbnailFile = files.find(f => f.startsWith('math_8_thumbnail') && f.endsWith('.jpg'));

  if (thumbnailFile) {
    const srcPath = path.join(ARTIFACTS_DIR, thumbnailFile);
    const destPath = path.join(PUBLIC_IMAGES_DIR, 'math_8_thumbnail.jpg');
    fs.copyFileSync(srcPath, destPath);
    console.log(`Successfully copied ${thumbnailFile} to public/images/math_8_thumbnail.jpg`);
  } else {
    console.warn('Could not find generated math_8_thumbnail image in artifacts.');
  }
} catch (err) {
  console.error('Error during thumbnail copying:', err.message);
}

// 2. Define course 8 text properties
const c2ShortDescription = 'Chương trình Toán 8 bám sát sách giáo khoa Kết Nối Tri Thức. Tích hợp lộ trình 30 buổi học chất lượng cao, bài giảng chuyên sâu về Đa thức, Hằng đẳng thức, Phân thức và Hình học phẳng.';
const c2Description = `Khóa học Toán 8 Kết nối tri thức được xây dựng nhằm giúp các em học sinh lớp 8 nắm chắc toàn bộ kiến thức đại số và hình học theo chương trình mới của Bộ Giáo dục và Đào tạo. 

Lộ trình học bài bản gồm 30 buổi học chất lượng cao, chia thành 3 chương chuyên đề cốt lõi:
• Chương 1: Đa thức & Các phép toán đa thức (10 bài giảng)
• Chương 2: Hằng đẳng thức đáng nhớ & Phân thức đại số (10 bài giảng)
• Chương 3: Tứ giác & Hình học phẳng nâng cao (10 bài giảng)

Các bài học được tích hợp video bài giảng thực chiến, tài liệu học và bài tập về nhà chi tiết giúp học sinh dễ dàng tiếp thu bài học, ôn tập hiệu quả và tự tin chinh phục điểm số cao.`;

// 3. Define the updated lessons array matching the exact structure
const l1Data = {
  title: 'Buổi 1. Ôn tập Hình học 7 (1)',
  duration: '94 phút',
  videoUrl: 'https://www.youtube.com/embed/h3ZnQByE060',
  documentUrl: 'https://drive.google.com/file/d/131fp02BUZ7KREvlkQdQY58JJnvXy9D0L/preview',
  textContent: '<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung bài học:</h4><p class="text-xs text-slate-500 mb-2">Hệ thống hóa toàn bộ kiến thức hình học lớp 7 bao gồm các góc tạo bởi một đường thẳng cắt hai đường thẳng song song, tính chất hai đường thẳng song song và các trường hợp bằng nhau của tam giác làm tiền đề vững chắc cho toán học lớp 8.</p>'
};

const l2Data = {
  title: 'Buổi 2. Ôn tập Đại số 7',
  duration: '96 phút',
  videoUrl: 'https://www.youtube.com/embed/9DptLGAmEvA',
  documentUrl: 'https://drive.google.com/file/d/1MUd9HS1BUaNzyQhaIK0SPqueO-9No53d/preview',
  textContent: '<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung bài học:</h4><p class="text-xs text-slate-500 mb-2">Hệ thống hóa toàn bộ kiến thức đại số lớp 7 bao gồm số hữu tỉ, tỉ lệ thức, dãy tỉ số bằng nhau, số thực và các phép tính số thực cơ bản nâng cao.</p>'
};

const l3Data = {
  title: 'Buổi 3. Ôn tập Hình học 7 (2)',
  duration: '99 phút',
  videoUrl: 'https://www.youtube.com/embed/MgNxO78fI4c',
  documentUrl: 'https://drive.google.com/file/d/1hFnGlRNrqaAuqllscEghohPkfO_j390y/preview',
  textContent: '<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt nội dung bài học:</h4><p class="text-xs text-slate-500 mb-2">Nâng cao tư duy hình học thông qua các bài toán chứng minh tam giác bằng nhau, tam giác cân, các đường đồng quy trong tam giác và kỹ thuật kẻ thêm đường phụ.</p>'
};

// 4. Patch files
const seedPath = path.join(__dirname, 'prisma', 'seed.ts');
const coursesPath = path.join(__dirname, 'data', 'courses.ts');

function patchSeedFile() {
  if (!fs.existsSync(seedPath)) return;
  let content = fs.readFileSync(seedPath, 'utf8');

  // Replace course 2 thumbnail, shortDescription, description, duration
  content = content.replace(
    /id:\s*'c2',.*?shortDescription:\s*'[^']+',.*?description:\s*`[^`]+`,.*?thumbnail:\s*'[^']+',/gs,
    (match) => {
      let replaced = match.replace(/shortDescription:\s*'[^']+',/g, `shortDescription: '${c2ShortDescription}',`);
      replaced = replaced.replace(/description:\s*\`[^`]+\`,/g, `description: \`${c2Description}\`,`);
      replaced = replaced.replace(/thumbnail:\s*'[^']+',/g, `thumbnail: '/images/math_8_thumbnail.jpg',`);
      return replaced;
    }
  );

  // Replace course 2 duration in seed
  content = content.replace(
    /id:\s*'c2',.*?duration:\s*'[^']+',/gs,
    (match) => match.replace(/duration:\s*'[^']+',/g, `duration: '15 giờ 17 phút',`)
  );

  // Replace course 2 lessons 1, 2, 3 definition details
  content = content.replace(
    /\{\s*id:\s*'c2-l1'.*?\}/s,
    `{ id: 'c2-l1', chapterId: ch2_1.id, title: '${l1Data.title}', duration: '${l1Data.duration}', isPreview: true, videoUrl: '${l1Data.videoUrl}', documentUrl: '${l1Data.documentUrl}', textContent: '${l1Data.textContent}' }`
  );
  content = content.replace(
    /\{\s*id:\s*'c2-l2'.*?\}/s,
    `{ id: 'c2-l2', chapterId: ch2_1.id, title: '${l2Data.title}', duration: '${l2Data.duration}', isPreview: true, videoUrl: '${l2Data.videoUrl}', documentUrl: '${l2Data.documentUrl}', textContent: '${l2Data.textContent}' }`
  );
  content = content.replace(
    /\{\s*id:\s*'c2-l3'.*?\}/s,
    `{ id: 'c2-l3', chapterId: ch2_1.id, title: '${l3Data.title}', duration: '${l3Data.duration}', isPreview: true, videoUrl: '${l3Data.videoUrl}', documentUrl: '${l3Data.documentUrl}', textContent: '${l3Data.textContent}' }`
  );

  fs.writeFileSync(seedPath, content, 'utf8');
  console.log('SUCCESS: Patched prisma/seed.ts for course 8.');
}

function patchCoursesFile() {
  if (!fs.existsSync(coursesPath)) return;
  let content = fs.readFileSync(coursesPath, 'utf8');

  // Replace course 2 details in mockCourses
  content = content.replace(
    /id:\s*'c2',.*?shortDescription:\s*'[^']+',.*?description:\s*'[^']+',.*?thumbnail:\s*'[^']+',/gs,
    (match) => {
      let replaced = match.replace(/shortDescription:\s*'[^']+',/g, `shortDescription: '${c2ShortDescription}',`);
      replaced = replaced.replace(/description:\s*'[^']+',/g, `description: \`${c2Description}\`,`);
      replaced = replaced.replace(/thumbnail:\s*'[^']+',/g, `thumbnail: '/images/math_8_thumbnail.jpg',`);
      return replaced;
    }
  );

  // Replace duration of course c2 in mockCourses
  content = content.replace(
    /id:\s*'c2',.*?duration:\s*'[^']+',/gs,
    (match) => match.replace(/duration:\s*'[^']+',/g, `duration: '15 giờ 17 phút',`)
  );

  // Replace lessons 1, 2, 3 in mockCourses
  // Let's replace the c2Lessons lessons array inside courses.ts.
  // Wait, let's look at how c2Lessons are constructed in courses.ts.
  // Since we run database queries or sync, updating it dynamically in seed.ts and writing it to DB is paramount.
  // Let's see: we should make sure that mockCourses in courses.ts has the updated lessons 1, 2, 3.
  // Wait, let's write code to find mockCourse 2 lessons inside courses.ts and patch them.
  // Let's check how mockCourses is defined in courses.ts. It usually imports them or has static mock.
  // Since we already have dynamic API, the API fetches from DB so updating the DB is the most critical part!
  // But let's also update courses.ts for code coherence.
  content = content.replace(
    /\{\s*id:\s*'c2-l1'.*?\}/s,
    `{ id: 'c2-l1', title: '${l1Data.title}', duration: '${l1Data.duration}', isPreview: true, videoUrl: '${l1Data.videoUrl}', documentUrl: '${l1Data.documentUrl}', textContent: '${l1Data.textContent}' }`
  );
  content = content.replace(
    /\{\s*id:\s*'c2-l2'.*?\}/s,
    `{ id: 'c2-l2', title: '${l2Data.title}', duration: '${l2Data.duration}', isPreview: true, videoUrl: '${l2Data.videoUrl}', documentUrl: '${l2Data.documentUrl}', textContent: '${l2Data.textContent}' }`
  );
  content = content.replace(
    /\{\s*id:\s*'c2-l3'.*?\}/s,
    `{ id: 'c2-l3', title: '${l3Data.title}', duration: '${l3Data.duration}', isPreview: true, videoUrl: '${l3Data.videoUrl}', documentUrl: '${l3Data.documentUrl}', textContent: '${l3Data.textContent}' }`
  );

  fs.writeFileSync(coursesPath, content, 'utf8');
  console.log('SUCCESS: Patched data/courses.ts for course 8.');
}

patchSeedFile();
patchCoursesFile();

// 5. Update DB using Prisma Client
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateDB() {
  try {
    console.log('Updating Supabase databases with Course 8 details...');
    
    // Update c2 course details
    await prisma.course.update({
      where: { id: 'c2' },
      data: {
        shortDescription: c2ShortDescription,
        description: c2Description,
        thumbnail: '/images/math_8_thumbnail.jpg',
        duration: '15 giờ 17 phút'
      }
    });

    // Update lesson 1
    await prisma.lesson.update({
      where: { id: 'c2-l1' },
      data: {
        title: l1Data.title,
        duration: l1Data.duration,
        videoUrl: l1Data.videoUrl,
        documentUrl: l1Data.documentUrl,
        textContent: l1Data.textContent,
        isPreview: true
      }
    });

    // Update lesson 2
    await prisma.lesson.update({
      where: { id: 'c2-l2' },
      data: {
        title: l2Data.title,
        duration: l2Data.duration,
        videoUrl: l2Data.videoUrl,
        documentUrl: l2Data.documentUrl,
        textContent: l2Data.textContent,
        isPreview: true
      }
    });

    // Update lesson 3
    await prisma.lesson.update({
      where: { id: 'c2-l3' },
      data: {
        title: l3Data.title,
        duration: l3Data.duration,
        videoUrl: l3Data.videoUrl,
        documentUrl: l3Data.documentUrl,
        textContent: l3Data.textContent,
        isPreview: true
      }
    });

    console.log('SUCCESS: Course 8 details and lesson videos updated in database.');
  } catch (err) {
    console.error('DB Update Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateDB();
