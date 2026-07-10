const fs = require('fs');
const path = require('path');

function listDir(dir, indent = '') {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      console.log(`${indent}📁 ${file}`);
      listDir(fullPath, indent + '  ');
    } else {
      if (file.endsWith('.ts') || file.endsWith('.js')) {
        console.log(`${indent}📄 ${file}`);
      }
    }
  }
}

listDir(path.join(__dirname, 'src', 'app', 'api'));
