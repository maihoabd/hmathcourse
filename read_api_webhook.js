const fs = require('fs');
const path = require('path');

const webhookPath = path.join(__dirname, 'src', 'app', 'api', 'payment', 'webhook', 'route.ts');
if (fs.existsSync(webhookPath)) {
  const content = fs.readFileSync(webhookPath, 'utf8');
  console.log('--- api/payment/webhook/route.ts ---');
  console.log(content);
} else {
  console.log('API webhook route not found.');
}
