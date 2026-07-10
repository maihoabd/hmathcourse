const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, 'src', 'components', 'layout', 'header.tsx'),
  path.join(__dirname, 'src', 'app', 'dashboard', 'page.tsx')
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf8');
    const lines = content.split('\n');
    console.log(`--- ${path.basename(f)} ---`);
    lines.forEach((line, idx) => {
      if (line.includes('avatar') || line.includes('Avatar')) {
        console.log(`${idx + 1}: ${line.trim()}`);
      }
    });
  }
});
