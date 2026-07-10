const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\171b6a11-c577-42cc-95c4-03fd493eaa92';
const PUBLIC_IMAGES_DIR = path.join(__dirname, 'public', 'images');

// 1. Copy generated thumbnail to Next.js public directory
try {
  if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
    fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
    console.log(`Created directory: ${PUBLIC_IMAGES_DIR}`);
  }

  const files = fs.readdirSync(ARTIFACTS_DIR);
  const thumbnailFile = files.find(f => f.startsWith('math_7_thumbnail') && f.endsWith('.jpg'));

  if (thumbnailFile) {
    const srcPath = path.join(ARTIFACTS_DIR, thumbnailFile);
    const destPath = path.join(PUBLIC_IMAGES_DIR, 'math_7_thumbnail.jpg');
    fs.copyFileSync(srcPath, destPath);
    console.log(`Successfully copied ${thumbnailFile} to public/images/math_7_thumbnail.jpg`);
  } else {
    console.warn('Could not find generated math_7_thumbnail image in artifacts.');
  }
} catch (err) {
  console.error('Error during thumbnail copying:', err.message);
}

// 2. Define updates for prisma/seed.ts and data/courses.ts
const seedPath = path.join(__dirname, 'prisma', 'seed.ts');
const coursesPath = path.join(__dirname, 'data', 'courses.ts');
const landingPagePath = path.join(__dirname, 'src', 'app', 'page.tsx');
const slugPagePath = path.join(__dirname, 'src', 'app', 'courses', '[slug]', 'page.tsx');

const c1Title = 'Khóa học Toán 7 Kết nối tri thức';
const c2Title = 'Khóa học Toán 8 Kết nối tri thức';

const c1ShortDescription = 'Chương trình Toán 7 Kết nối tri thức toàn diện với 30 buổi học chất lượng cao, bao trọn chuyên đề Số hữu tỉ, Góc & Đường thẳng song song, Số thực, Tam giác bằng nhau, Đa thức và Xác suất.';

const c1Description = `Khóa học Toán 7 Kết nối tri thức được thiết kế chuẩn mực nhằm giúp các em học sinh lớp 7 nắm vững toàn bộ kiến thức trọng tâm theo chương trình mới của Bộ Giáo dục và Đào tạo. 

Lộ trình học bài bản gồm 30 buổi học chất lượng cao bám sát theo 5 chương chuyên đề hình học và đại số:
• Chương 1: Số hữu tỉ nâng cao (Buổi 1 - 4)
• Chương 2: Góc & Đường thẳng song song (Buổi 5 - 8)
• Chương 3: Số thực & Giá trị tuyệt đối (Buổi 9 - 12)
• Chương 4: Tam giác bằng nhau chuyên sâu (Buổi 13 - 20)
• Chương 5: Đa thức một biến, hình học & xác suất (Buổi 21 - 30)

Mỗi buổi học đi kèm video bài giảng chi tiết giải thích rõ bản chất, tài liệu học tập tóm tắt lý thuyết, bài tập về nhà chọn lọc cùng hướng dẫn giải PDF chi tiết để tự kiểm tra kết quả. Khóa học là bệ phóng giúp các em tự tin bứt phá điểm số 9, 10 trong các bài thi định kỳ.`;

const c2ShortDescription = 'Chương trình toán lớp 8 bám sát sách giáo khoa Kết Nối Tri Thức. Tích hợp các bài giảng hoàn chỉnh đầu tiên và cập nhật liên tục theo tiến độ học.';

const c2Description = 'Khóa học được xây dựng nhằm giúp các em học sinh lớp 8 nắm chắc kiến thức căn bản môn Toán. Chương trình bám sát bộ sách giáo khoa Kết Nối Tri Thức Với Cuộc Sống. Hệ thống liên tục cập nhật các bài giảng chất lượng cao kết hợp tài liệu tóm tắt và bài tập rèn luyện để học sinh học tập tự tin và hiệu quả.';

// Patch files helper
function patchFile(filePath, isSeed = false, isCourses = false, isLanding = false, isSlug = false) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace instructor name on entire website
  content = content.replace(/Thầy Hoàng HMath/g, 'Giáo viên HMath');
  content = content.replace(/thầy Hoàng HMath/g, 'giáo viên HMath');
  content = content.replace(/Thầy Hoàng/g, 'Giáo viên HMath');
  content = content.replace(/thầy Hoàng/g, 'giáo viên HMath');
  content = content.replace(/instructorName:\s*'Thầy Hoàng HMath'/g, "instructorName: 'Giáo viên HMath'");

  if (isSeed) {
    // Replace course 1 title, descriptions, thumbnail
    content = content.replace(
      /title:\s*'Khóa học Toán Nâng cao lớp 7 - Bộ sách Kết Nối Tri Thức',/g,
      `title: '${c1Title}',`
    );
    content = content.replace(
      /shortDescription:\s*'Chương trình Toán 7 nâng cao bám sát bộ sách Kết Nối Tri Thức\. Giúp học sinh đạt điểm 9, 10 trong các kỳ thi\.',/g,
      `shortDescription: '${c1ShortDescription}',`
    );
    content = content.replace(
      /description:\s*'Khóa học thiết kế chuyên sâu dành cho học sinh lớp 7 muốn chinh phục các bài toán khó, nâng cao tư duy logic và đạt kết quả tốt nhất trong các kỳ thi Học sinh giỏi và kiểm tra định kỳ\..*?bài toán hình học chuyên sâu\.',/gs,
      `description: \`${c1Description}\`,`
    );
    content = content.replace(
      /thumbnail:\s*'https:\/\/images\.unsplash\.com\/photo-1509228468518-180dd4864904\?w=800&auto=format&fit=crop&q=60',/g,
      `thumbnail: '/images/math_7_thumbnail.jpg',`
    );

    // Replace course 2 title, description
    content = content.replace(
      /title:\s*'Khóa học Toán lớp 8 cơ bản - Bộ sách Kết Nối Tri Thức',/g,
      `title: '${c2Title}',`
    );
    content = content.replace(
      /shortDescription:\s*'Toàn bộ chương trình toán lớp 8 cơ bản chuẩn chỉnh theo sách giáo khoa Kết Nối Tri Thức\. Tích hợp 3 bài giảng đầu hoàn chỉnh\.',/g,
      `shortDescription: '${c2ShortDescription}',`
    );
    content = content.replace(
      /description:\s*'Khóa học được xây dựng nhằm giúp các em học sinh lớp 8 nắm chắc kiến thức căn bản môn Toán\..*?tiến độ năm học\.',/gs,
      `description: \`${c2Description}\`,`
    );
  }

  if (isCourses) {
    // Replace course 1 static title, descriptions, thumbnail
    content = content.replace(
      /title:\s*'Khóa học Toán Nâng cao lớp 7 - Bộ sách Kết Nối Tri Thức',/g,
      `title: '${c1Title}',`
    );
    content = content.replace(
      /shortDescription:\s*'Chương trình Toán 7 nâng cao bám sát bộ sách Kết Nối Tri Thức\. Giúp học sinh đạt điểm 9, 10 trong các kỳ thi\.',/g,
      `shortDescription: '${c1ShortDescription}',`
    );
    content = content.replace(
      /description:\s*'Khóa học thiết kế chuyên sâu dành cho học sinh lớp 7 muốn chinh phục các bài toán khó, nâng cao tư duy logic và đạt kết quả tốt nhất trong các kỳ thi Học sinh giỏi và kiểm tra định kỳ\..*?bài toán hình học chuyên sâu\.',/gs,
      `description: \`${c1Description}\`,`
    );
    content = content.replace(
      /thumbnail:\s*'https:\/\/images\.unsplash\.com\/photo-1509228468518-180dd4864904\?w=800&auto=format&fit=crop&q=60',/g,
      `thumbnail: '/images/math_7_thumbnail.jpg',`
    );

    // Replace course 2 title, description
    content = content.replace(
      /title:\s*'Khóa học Toán lớp 8 cơ bản - Bộ sách Kết Nối Tri Thức',/g,
      `title: '${c2Title}',`
    );
    content = content.replace(
      /shortDescription:\s*'Toàn bộ chương trình toán lớp 8 cơ bản chuẩn chỉnh theo sách giáo khoa Kết Nối Tri Thức\. Tích hợp 3 bài giảng đầu hoàn chỉnh\.',/g,
      `shortDescription: '${c2ShortDescription}',`
    );
    content = content.replace(
      /description:\s*'Khóa học được xây dựng nhằm giúp các em học sinh lớp 8 nắm chắc kiến thức căn bản môn Toán\..*?tiến độ năm học\.',/gs,
      `description: \`${c2Description}\`,`
    );
  }

  if (isSlug) {
    // Replace course detail reviews inside [slug]/page.tsx
    const reviewsRegex = /\{\s*id:\s*'rev1',\s*userName:\s*'Nguyễn Văn Hải'.*?\}\s*\]/gs;
    const newReviews = `{ id: 'rev1', userName: 'Nguyễn Văn Hải', rating: 5, comment: 'Bài học 30 buổi rất đầy đủ và chi tiết. Tài liệu và BTVN được đính kèm chuẩn bị sẵn, rất tiện cho việc tự học và ôn thi.', date: '2026-03-15' },
                    { id: 'rev2', userName: 'Trần Thị Mai', rating: 5, comment: 'Con tôi học bám sát chương trình Kết nối tri thức của HMath và tiến bộ rất nhanh. Giao diện xem video và tải PDF mượt mà.', date: '2026-05-24' },
                    { id: 'rev3', userName: 'Trần Văn Long', rating: 5, comment: 'Video bài giảng âm thanh và hình ảnh vô cùng sắc nét, giáo viên giảng bài tỉ mỉ và dễ tiếp thu.', date: '2026-07-01' }
                  ]`;
    content = content.replace(reviewsRegex, newReviews);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`SUCCESS: Patched ${path.basename(filePath)}`);
}

// Execute patches
patchFile(seedPath, true, false, false, false);
patchFile(coursesPath, false, true, false, false);
patchFile(landingPagePath, false, false, true, false);
patchFile(slugPagePath, false, false, false, true);

// 3. Database direct update using Prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateDB() {
  try {
    console.log('Updating databases (Supabase)...');
    
    // Update c1 details
    await prisma.course.update({
      where: { id: 'c1' },
      data: {
        title: c1Title,
        shortDescription: c1ShortDescription,
        description: c1Description,
        thumbnail: '/images/math_7_thumbnail.jpg',
        instructorName: 'Giáo viên HMath'
      }
    });
    console.log('SUCCESS: Supabase Course c1 details updated.');

    // Update c2 details
    await prisma.course.update({
      where: { id: 'c2' },
      data: {
        title: c2Title,
        shortDescription: c2ShortDescription,
        description: c2Description,
        instructorName: 'Giáo viên HMath'
      }
    });
    console.log('SUCCESS: Supabase Course c2 details updated.');

    console.log('Prisma DB updates successfully completed.');
  } catch (err) {
    console.error('Prisma DB Update Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateDB();
