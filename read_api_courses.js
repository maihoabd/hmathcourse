const fs = require('fs');
const path = require('path');

const coursesRoutePath = path.join(__dirname, 'src', 'app', 'api', 'courses', 'route.ts');
if (fs.existsSync(coursesRoutePath)) {
  const content = fs.readFileSync(coursesRoutePath, 'utf8');
  console.log('--- api/courses/route.ts ---');
  console.log(content);
} else {
  console.log('API courses route not found.');
}
