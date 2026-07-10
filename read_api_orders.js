const fs = require('fs');
const path = require('path');

const ordersRoutePath = path.join(__dirname, 'src', 'app', 'api', 'orders', 'route.ts');
if (fs.existsSync(ordersRoutePath)) {
  const content = fs.readFileSync(ordersRoutePath, 'utf8');
  console.log('--- api/orders/route.ts ---');
  console.log(content);
} else {
  console.log('API orders route not found.');
}
