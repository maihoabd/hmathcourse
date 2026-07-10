const fs = require('fs');
const path = require('path');

const registerPath = path.join(__dirname, 'src', 'app', 'api', 'auth', 'register', 'route.ts');
if (fs.existsSync(registerPath)) {
  const content = fs.readFileSync(registerPath, 'utf8');
  console.log('--- register/route.ts ---');
  console.log(content);
} else {
  console.log('Register route not found.');
}
