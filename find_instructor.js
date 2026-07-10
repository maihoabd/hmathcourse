const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        searchDir(fullPath);
      }
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.json') || file.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('Thầy Hoàng')) {
          console.log(`Found "Thầy Hoàng" in: ${fullPath}`);
        }
      }
    }
  }
}

searchDir(__dirname);
