const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\/\/antigravity\\brain\\171b6a11-c577-42cc-95c4-03fd493eaa92';
const PUBLIC_IMAGES_DIR = path.join(__dirname, 'public', 'images');

// 1. Copy generated avatars
try {
  if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
    fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
  }

  const files = fs.readdirSync(ARTIFACTS_DIR);
  
  const momAvatarFile = files.find(f => f.startsWith('vietnamese_mom_avatar') && f.endsWith('.jpg'));
  const studentAvatarFile = files.find(f => f.startsWith('vietnamese_student_avatar') && f.endsWith('.jpg'));

  if (momAvatarFile) {
    fs.copyFileSync(path.join(ARTIFACTS_DIR, momAvatarFile), path.join(PUBLIC_IMAGES_DIR, 'vietnamese_mom_avatar.jpg'));
    console.log('SUCCESS: Copied vietnamese_mom_avatar.jpg');
  }
  if (studentAvatarFile) {
    fs.copyFileSync(path.join(ARTIFACTS_DIR, studentAvatarFile), path.join(PUBLIC_IMAGES_DIR, 'vietnamese_student_avatar.jpg'));
    console.log('SUCCESS: Copied vietnamese_student_avatar.jpg');
  }
} catch (err) {
  console.error('Error during avatars copying:', err.message);
}

// 2. Patch E:\sale\src\app\courses\[slug]\page.tsx ("thực chiến" removal)
const slugPagePath = path.join(__dirname, 'src', 'app', 'courses', '[slug]', 'page.tsx');
if (fs.existsSync(slugPagePath)) {
  let content = fs.readFileSync(slugPagePath, 'utf8');
  content = content.replace(
    /<span>Số lượng:\s*<b>\{course\.lessonsCount\} bài giảng thực chiến<\/b><\/span>/g,
    '<span>Số lượng: <b>{course.lessonsCount} bài giảng</b></span>'
  );
  fs.writeFileSync(slugPagePath, content, 'utf8');
  console.log('SUCCESS: Patched slug page.tsx');
}

// 3. Patch E:\sale\src\app\page.tsx (Testimonial update score 9.2 -> 9.5 and update avatars)
const homePagePath = path.join(__dirname, 'src', 'app', 'page.tsx');
if (fs.existsSync(homePagePath)) {
  let content = fs.readFileSync(homePagePath, 'utf8');
  
  // Replace 9.2 with 9.5
  content = content.replace(/đạt 9\.2 điểm/g, 'đạt 9.5 điểm');

  // Replace avatars inside testimonials array
  content = content.replace(
    /avatar:\s*'https:\/\/images\.unsplash\.com\/photo-1544005313-94ddf0286df2\?w=150&auto=format&fit=crop&q=60'/g,
    "avatar: '/images/vietnamese_mom_avatar.jpg'"
  );
  content = content.replace(
    /avatar:\s*'https:\/\/images\.unsplash\.com\/photo-1539571696357-5a69c17a67c6\?w=150&auto=format&fit=crop&q=60'/g,
    "avatar: '/images/vietnamese_student_avatar.jpg'"
  );

  fs.writeFileSync(homePagePath, content, 'utf8');
  console.log('SUCCESS: Patched home page.tsx');
}

// 4. Patch E:\sale\src\components\layout\footer.tsx (Remove newsletter column and adjust grid layout)
const footerPath = path.join(__dirname, 'src', 'components', 'layout', 'footer.tsx');
if (fs.existsSync(footerPath)) {
  let content = fs.readFileSync(footerPath, 'utf8');
  
  // Replace grid-cols-1 md:grid-cols-4 with md:grid-cols-3
  content = content.replace(
    /grid grid-cols-1 md:grid-cols-4 gap-8/g,
    'grid grid-cols-1 md:grid-cols-3 gap-8'
  );

  // Remove the 4th column completely
  const targetColStart = content.indexOf('{/* Contact / Newsletter Col */}');
  const targetColEnd = content.indexOf('</div>', targetColStart);
  if (targetColStart !== -1 && targetColEnd !== -1) {
    const actualColBlock = content.substring(targetColStart, targetColEnd + 6);
    content = content.replace(actualColBlock, '');
    console.log('SUCCESS: Removed newsletter column from footer');
  }

  fs.writeFileSync(footerPath, content, 'utf8');
  console.log('SUCCESS: Patched footer.tsx');
}
