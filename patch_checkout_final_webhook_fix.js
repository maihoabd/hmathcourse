const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'app', 'checkout', 'page.tsx');

if (fs.existsSync(targetPath)) {
  let content = fs.readFileSync(targetPath, 'utf8');

  // 1. Replace the "qua Casso/Sepay" text
  const oldText = '<p className="text-slate-500">Hệ thống của chúng tôi sẽ tự động phát hiện chuyển khoản qua Casso/Sepay và kích hoạt khóa học ngay lập tức.</p>';
  const newText = '<p className="text-slate-500">Hệ thống của chúng tôi sẽ tự động phát hiện chuyển khoản và kích hoạt khóa học ngay lập tức.</p>';
  
  if (content.includes(oldText)) {
    content = content.replace(oldText, newText);
    console.log('Replaced Casso/Sepay text on checkout page.');
  }

  // 2. Modify direct redirect callback to NOT show modal immediately, but let polling trigger the database sync
  const oldCallback = `      if (isSuccess && finalOrderCode) {
        setOrderCode(finalOrderCode);
        setShowSuccessModal(true);
      }`;

  const newCallback = `      if (isSuccess && finalOrderCode) {
        setOrderCode(finalOrderCode);
        // Do not set showSuccessModal to true immediately.
        // Let the polling effect check and sync database first!
      }`;

  if (content.includes(oldCallback)) {
    content = content.replace(oldCallback, newCallback);
    console.log('Updated callback hook to defer modal showing to database sync.');
  }

  // 3. Update the polling useEffect to run immediately upon mount/trigger
  const oldPolling = `  // Poll for order status
  useEffect(() => {
    if (!orderCode || showSuccessModal) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(\`/api/orders/status?code=\${orderCode}\`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'completed') {
            clearInterval(interval);
            setShowSuccessModal(true);
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [orderCode, showSuccessModal]);`;

  const newPolling = `  // Poll for order status
  useEffect(() => {
    if (!orderCode || showSuccessModal) return;

    const checkStatus = async () => {
      try {
        const res = await fetch(\`/api/orders/status?code=\${orderCode}\`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'completed') {
            setShowSuccessModal(true);
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    };

    // Trigger check status immediately
    checkStatus();

    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, [orderCode, showSuccessModal]);`;

  if (content.includes(oldPolling)) {
    content = content.replace(oldPolling, newPolling);
    console.log('Updated polling hook to check status immediately.');
  }

  fs.writeFileSync(targetPath, content, 'utf8');
  console.log('SUCCESS: Patched checkout/page.tsx with Webhook & Casso/Sepay fixes.');
}
