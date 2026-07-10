const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, 'prisma', 'seed.ts');
const coursesPath = path.join(__dirname, 'data', 'courses.ts');

function patchFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace duration of course c1
  // We look for c1 block and replace duration
  content = content.replace(
    /id:\s*'c1',.*?duration:\s*'22 giờ 30 phút'/gs,
    (match) => match.replace("duration: '22 giờ 30 phút'", "duration: '50 giờ 56 phút'")
  );

  // Fallback direct replaces
  content = content.replace(/duration:\s*'22 giờ 30 phút'/g, "duration: '50 giờ 56 phút'");

  // Replace instructor avatars
  content = content.replace(
    /https:\/\/images\.unsplash\.com\/photo-1506794778202-cad84cf45f1d\?w=150&auto=format&fit=crop&q=60/g,
    'https://i.postimg.cc/MGshM4ZC/favico.png'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`SUCCESS: Patched duration and avatar in ${path.basename(filePath)}`);
}

patchFile(seedPath);
patchFile(coursesPath);

// Database updates using Prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateDB() {
  try {
    console.log('Updating Supabase databases...');
    
    // Update c1 details
    await prisma.course.update({
      where: { id: 'c1' },
      data: {
        duration: '50 giờ 56 phút',
        instructorAvatar: 'https://i.postimg.cc/MGshM4ZC/favico.png'
      }
    });

    // Update c2 details
    await prisma.course.update({
      where: { id: 'c2' },
      data: {
        instructorAvatar: 'https://i.postimg.cc/MGshM4ZC/favico.png'
      }
    });

    console.log('SUCCESS: Supabase course duration and avatars updated.');
  } catch (err) {
    console.error('Prisma DB Update Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateDB();
