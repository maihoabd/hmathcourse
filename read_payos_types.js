const fs = require('fs');
const path = require('path');

const typesPath = path.join(__dirname, 'node_modules', '@payos', 'node', 'dist', 'index.d.ts');
if (fs.existsSync(typesPath)) {
  console.log('Found index.d.ts in dist folder.');
  const content = fs.readFileSync(typesPath, 'utf8');
  // Search for paymentRequests or getPaymentLinkInformation
  const lines = content.split('\n');
  lines.forEach((l, idx) => {
    if (l.includes('paymentRequests') || l.includes('getPaymentLink') || l.includes('get(')) {
      console.log(`L${idx + 1}: ${l.trim()}`);
    }
  });
} else {
  // Search other locations in node_modules
  console.log('index.d.ts not found in dist. Searching package...');
}
