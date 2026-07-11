'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/auth-context';
import { useCart } from '../../context/cart-context';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { formatPrice } from '../../lib/utils';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart, removeFromCart } = useCart();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const discountAmount = 0;
  
  

  // Order state
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Pre-fill profile info if logged in
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || '');
    }
  }, [user]);

  

  const finalTotal = Math.max(0, cartTotal - discountAmount);

  // Poll for order status
  useEffect(() => {
    if (!orderCode || showSuccessModal) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/status?code=${orderCode}`);
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
  }, [orderCode, showSuccessModal]);

  // Handle redirect callback from PayOS
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const status = params.get('status');
      const code = params.get('code');
      if (status === 'success' && code) {
        setOrderCode(code);
        setShowSuccessModal(true);
      }
    }
  }, []);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/login?redirect=/checkout');
      return;
    }

    if (!name || !email || !phone) {
      alert('Vui lòng điền đầy đủ thông tin thanh toán.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          items: cartItems.map((item) => ({ id: item.id, price: item.price })),
          amount: finalTotal,
          paymentMethod: 'payos',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      setOrderCode(data.orderCode);

      if (data.payos && data.checkoutUrl) {
        // Redirect to PayOS Hosted Checkout URL
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      console.error(err);
      alert('Không thể khởi tạo đơn hàng. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    clearCart();
    router.push('/dashboard');
  };

  if (cartItems.length === 0 && !showSuccessModal) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-4 flex-1">
        <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Giỏ hàng trống</h2>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">Bạn chưa thêm khóa học nào vào giỏ hàng. Hãy khám phá ngay nhé!</p>
        <Link href="/courses">
          <Button>Khám phá Khóa học</Button>
        </Link>
      </div>
    );
  }

  // VietQR generation url parameters
  const bankId = 'MB'; // MB Bank
  const accountNo = '0385048315'; // Bank account
  const accountName = 'PHAM DANG HAI'; // Account holder name
  const qrUrl = orderCode 
    ? `https://img.vietqr.io/image/${bankId}-${accountNo}-compact.png?amount=${finalTotal}&addInfo=${orderCode}&accountName=${encodeURIComponent(accountName)}`
    : '';

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-6 flex-1">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Info & QR */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Step 1: Info */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg text-slate-800">1. Thông tin học viên</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Họ và Tên"
                placeholder="Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={orderCode !== null}
                required
              />
              <Input
                label="Địa chỉ Email"
                type="email"
                placeholder="ten@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={orderCode !== null}
                required
              />
              <Input
                label="Số điện thoại"
                type="tel"
                placeholder="0987654321"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={orderCode !== null}
                required
              />
            </CardContent>
          </Card>

          {/* Step 2: Payment Method */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg text-slate-800">2. Phương thức thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {!orderCode ? (
                // Order Placement
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/20 flex items-start gap-3">
                    <div className="p-2 bg-indigo-500 rounded-lg text-white">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-slate-800">Chuyển khoản Ngân hàng qua mã VietQR tự động</p>
                      <p className="text-slate-500">Hệ thống của chúng tôi sẽ tự động phát hiện chuyển khoản qua Casso/Sepay và kích hoạt khóa học ngay lập tức.</p>
                    </div>
                  </div>

                  {!user ? (
                    <Link href={`/login?redirect=/checkout`} className="block w-full">
                      <Button className="w-full">Đăng nhập để đặt hàng</Button>
                    </Link>
                  ) : (
                    <Button
                      onClick={handleCreateOrder}
                      className="w-full shadow-lg shadow-indigo-500/20"
                      loading={isSubmitting}
                    >
                      Xác nhận Đặt hàng ({formatPrice(finalTotal)})
                    </Button>
                  )}
                </div>
              ) : (
                // VietQR Payment Display
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <Badge variant="secondary" className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border-indigo-100 animate-pulse">
                      Đang chờ chuyển khoản...
                    </Badge>
                    <p className="text-xs text-slate-500">Mở ứng dụng Ngân hàng trên điện thoại và quét mã QR dưới đây:</p>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200">
                    {/* VietQR Code */}
                    <div className="bg-white p-3 rounded-xl shadow-md border border-slate-150 shrink-0">
                      <img
                        src={qrUrl}
                        alt="VietQR code"
                        className="h-48 w-48 object-contain"
                      />
                    </div>

                    {/* Transfer Details */}
                    <div className="flex-1 w-full text-xs space-y-2">
                      <p className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-1.5">Thông tin tài khoản nhận:</p>
                      <div className="grid grid-cols-3 gap-y-1.5 text-slate-600">
                        <span className="col-span-1">Ngân hàng:</span>
                        <span className="col-span-2 font-bold text-slate-800">MB Bank (Ngân hàng Quân Đội)</span>
                        
                        <span className="col-span-1">Số tài khoản:</span>
                        <span className="col-span-2 font-bold text-indigo-600 select-all">{accountNo}</span>
                        
                        <span className="col-span-1">Chủ tài khoản:</span>
                        <span className="col-span-2 font-bold text-slate-800">{accountName}</span>
                        
                        <span className="col-span-1">Số tiền:</span>
                        <span className="col-span-2 font-bold text-rose-600 text-sm">{formatPrice(finalTotal)}</span>
                        
                        <span className="col-span-1">Nội dung chuyển:</span>
                        <span className="col-span-2 font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded select-all w-fit">
                          {orderCode}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 italic pt-2 border-t border-slate-200 leading-normal">
                        * Bạn lưu ý nhập chính xác nội dung chuyển khoản <b>{orderCode}</b> để hệ thống tự động kích hoạt.
                      </p>
                    </div>
                  </div>

                  
                </div>
              )}

            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Summary */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-slate-900">Chi tiết đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Courses list */}
              <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto space-y-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 pt-2 first:pt-0">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-10 w-14 rounded-lg object-cover bg-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{item.title}</p>
                      <p className="text-[10px] text-slate-400 truncate">{item.category}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-indigo-600">{formatPrice(item.price)}</p>
                      {!orderCode && (
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[10px] text-red-500 hover:text-red-700 font-medium"
                        >
                          Gỡ bỏ
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div className="pt-4 border-t border-slate-100 text-xs space-y-2">
                <div className="flex justify-between text-slate-500">
                  <span>Giá bán:</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Giảm giá:</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-900 text-sm font-extrabold pt-2 border-t border-slate-100">
                  <span>Tổng cộng:</span>
                  <span className="text-indigo-600 text-base">{formatPrice(finalTotal)}</span>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>

      {/* Success Modal Overlay */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 text-center space-y-5 border border-slate-200 shadow-2xl animate-slide-up">
            <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
              ✓
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">Thanh toán thành công!</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Cảm ơn bạn đã tin tưởng chọn học cùng HMath Course. Giao dịch đã được hệ thống ghi nhận và kích hoạt tự động các khóa học của bạn.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-150 text-left text-xs leading-relaxed text-slate-655 space-y-1">
              <p className="font-bold text-slate-800">Thông tin biên lai:</p>
              <p>Mã chuyển khoản: <span className="font-mono font-semibold text-slate-900">{orderCode}</span></p>
              <p>Trạng thái: <span className="font-semibold text-emerald-600">Đã kích hoạt tự động</span></p>
              <p>Học viên: <span className="font-semibold text-slate-900">{name}</span> ({email})</p>
            </div>
            <Button onClick={handleSuccessClose} className="w-full">
              Bắt đầu Học tập ngay
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
