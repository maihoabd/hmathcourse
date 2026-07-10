const fs = require('fs');
const path = require('path');

const orderStatusPath = path.join(__dirname, 'src', 'app', 'api', 'orders', 'status', 'route.ts');
if (fs.existsSync(orderStatusPath)) {
  const content = fs.readFileSync(orderStatusPath, 'utf8');
  console.log('--- api/orders/status/route.ts ---');
  console.log(content);
} else {
  console.log('API orders status route not found.');
}
