const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, 'prisma', 'seed.ts');
const content = fs.readFileSync(seedPath, 'utf8');
const lines = content.split('\n');

lines.forEach((line, index) => {
  if (line.includes("courseId: 'c2'") || line.includes("c2") || line.includes("ch2_")) {
    console.log(`${index + 1}: ${line.trim()}`);
  }
});
