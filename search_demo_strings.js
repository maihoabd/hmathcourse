const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchDir(fullPath);
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.toLowerCase().includes('demo')) {
          // Find matching lines
          const lines = content.split('\n');
          lines.forEach((line, idx) => {
            if (line.toLowerCase().includes('demo')) {
              console.log(`${fullPath}:${idx + 1}: ${line.trim()}`);
            }
          });
        }
      }
    }
  }
}

searchDir(path.join(__dirname, 'src'));
