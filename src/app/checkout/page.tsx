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
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'bank_transfer' | 'paypal'>('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Pre-fill profile info if logged in
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // If not logged in, redirect to login page
  useEffect(() => {
    // We let them browse the cart, but force login to complete checkout
  }, []);

  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    
    if (promoCode.trim().toUpperCase() === 'DISCOUNT10') {
      setDiscountAmount(cartTotal * 0.1);
      setPromoSuccess('Áp dụng mã giảm giá 10% thành công!');
    } else if (promoCode.trim().toUpperCase() === 'FREE') {
      setDiscountAmount(cartTotal);
      setPromoSuccess('Áp dụng mã miễn phí 100% thành công!');
    } else {
      setPromoError('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
      setDiscountAmount(0);
    }
  };

  const finalTotal = Math.max(0, cartTotal - discountAmount);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/login?redirect=/checkout');
      return;
    }

    if (!name || !email || !phone) {
      alert('Vui lòng điền đầy đủ thông tin thanh toán.');
      return;
    }

    if (paymentMethod === 'credit_card' && (!cardNumber || !cardExpiry || !cardCvv)) {
      alert('Vui lòng nhập đầy đủ thông tin thẻ tín dụng.');
      return;
    }

    setIsSubmitting(true);
    // Simulate transaction processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Save purchase records to local storage to persist access
    const storedPurchases = localStorage.getItem(`purchased_${user.id}`);
    let purchasedIds: string[] = [];
    if (storedPurchases) {
      try {
        purchasedIds = JSON.parse(storedPurchases);
      } catch (e) {}
    }

    // Add new course IDs
    cartItems.forEach((item) => {
      if (!purchasedIds.includes(item.id)) {
        purchasedIds.push(item.id);
      }
    });

    localStorage.setItem(`purchased_${user.id}`, JSON.stringify(purchasedIds));

    // Save transaction to admin orders mock registry
    const storedOrders = localStorage.getItem('mock_admin_orders');
    let ordersList = [];
    if (storedOrders) {
      try {
        ordersList = JSON.parse(storedOrders);
      } catch (e) {}
    }

    cartItems.forEach((item) => {
      ordersList.unshift({
        id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        studentId: user.id,
        studentName: user.name,
        studentEmail: user.email,
        courseId: item.id,
        courseTitle: item.title,
        amount: finalTotal / cartItems.length, // Split total if multiple
        paymentMethod: paymentMethod,
        status: 'completed',
        date: new Date().toISOString()
      });
    });

    localStorage.setItem('mock_admin_orders', JSON.stringify(ordersList));

    setIsSubmitting(false);
    setShowSuccessModal(true);
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-6 flex-1">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Form and Payment */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Step 1: Info */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">1. Thông tin liên hệ</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Họ và Tên"
                placeholder="Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Địa chỉ Email"
                type="email"
                placeholder="ten@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Số điện thoại"
                type="tel"
                placeholder="0987654321"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </CardContent>
          </Card>

          {/* Step 2: Payment Method */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">2. Phương thức thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Payment selector tabs */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center text-xs font-semibold gap-1.5 transition-colors focus:outline-none ${
                    paymentMethod === 'credit_card'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span>Thẻ tín dụng</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center text-xs font-semibold gap-1.5 transition-colors focus:outline-none ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span>Chuyển khoản</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center text-xs font-semibold gap-1.5 transition-colors focus:outline-none ${
                    paymentMethod === 'paypal'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>PayPal</span>
                </button>
              </div>

              {/* Form conditional rendering */}
              {paymentMethod === 'credit_card' && (
                <div className="space-y-4 pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-3">
                    <Input
                      label="Số thẻ tín dụng"
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  <Input
                    label="Ngày hết hạn"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                  />
                  <Input
                    label="Mã bảo mật CVV"
                    placeholder="123"
                    type="password"
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                  />
                </div>
              )}

              {paymentMethod === 'bank_transfer' && (
                <div className="p-4 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/30 space-y-3 text-xs leading-relaxed text-slate-655">
                  <p className="font-bold text-slate-800">Thông tin chuyển khoản ngân hàng:</p>
                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <span>Ngân hàng:</span>
                    <span className="font-bold text-slate-800">Vietcombank (VCB)</span>
                    <span>Số tài khoản:</span>
                    <span className="font-bold text-indigo-600 select-all">1023456789</span>
                    <span>Chủ tài khoản:</span>
                    <span className="font-bold text-slate-800">CONG TY TNHH GEMINI ACADEMY</span>
                    <span>Số tiền cần chuyển:</span>
                    <span className="font-bold text-rose-600">{formatPrice(finalTotal)}</span>
                    <span>Nội dung chuyển khoản:</span>
                    <span className="font-bold text-slate-800 select-all">GM {user ? user.id.slice(0, 5) : 'GUEST'}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 italic pt-1 border-t border-indigo-100">
                    * Đơn hàng sẽ được kích hoạt tự động sau 1-2 phút nhận được khoản thanh toán hợp lệ.
                  </p>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl">
                  <p className="text-xs text-slate-500 mb-2">Thanh toán nhanh chóng bằng ví PayPal toàn cầu.</p>
                  <Badge variant="secondary" className="px-3 py-1 font-bold text-slate-500">PayPal Mock integration active</Badge>
                </div>
              )}

              {/* Action purchase */}
              {!user ? (
                <Link href={`/login?redirect=/checkout`} className="block w-full">
                  <Button className="w-full">Đăng nhập để hoàn tất mua hàng</Button>
                </Link>
              ) : (
                <Button
                  onClick={handlePaymentSubmit}
                  className="w-full shadow-lg shadow-indigo-500/20"
                  loading={isSubmitting}
                >
                  Hoàn tất Thanh toán ({formatPrice(finalTotal)})
                </Button>
              )}

            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Summary & Promo code */}
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
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[10px] text-red-500 hover:text-red-700 font-medium"
                      >
                        Gỡ bỏ
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code input */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <label className="text-xs font-semibold text-slate-700">Mã giảm giá</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ví dụ: DISCOUNT10"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="h-9 text-xs"
                  />
                  <Button onClick={handleApplyPromo} size="sm" variant="outline" className="h-9">
                    Áp dụng
                  </Button>
                </div>
                {promoError && <p className="text-[10px] text-red-500 font-medium">{promoError}</p>}
                {promoSuccess && <p className="text-[10px] text-emerald-600 font-medium">{promoSuccess}</p>}
                <p className="text-[9px] text-slate-400 italic">
                  * Nhập mã: <b>DISCOUNT10</b> (giảm 10%) hoặc <b>FREE</b> (giảm 100%) để thử nghiệm.
                </p>
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
            <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">Đăng ký thành công!</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Cảm ơn bạn đã tin tưởng chọn học cùng Gemini Academy. Khóa học đã được kích hoạt trong tài khoản của bạn.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-150 text-left text-xs leading-relaxed text-slate-655 space-y-1">
              <p className="font-bold text-slate-800">Thông tin biên lai:</p>
              <p>Mã hóa đơn: <span className="font-semibold text-slate-900">INV-{(Date.now() + '').slice(-6)}</span></p>
              <p>Trạng thái: <span className="font-semibold text-emerald-600">Đã kích hoạt</span></p>
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
