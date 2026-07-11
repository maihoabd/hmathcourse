'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/auth-context';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';

function VerifyForm() {
  const { verifyEmail, resendCode } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams ? searchParams.get('email') || '' : '';

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!code || code.trim().length !== 6) {
      setError('Mã xác thực phải gồm đúng 6 chữ số.');
      return;
    }

    setLoading(true);
    const success = await verifyEmail(email, code.trim());
    setLoading(false);

    if (!success) {
      setError('Mã xác thực không chính xác hoặc đã hết hạn.');
    }
  };

  const handleResend = async () => {
    setError('');
    setMessage('');
    setResending(true);
    const success = await resendCode(email);
    setResending(false);

    if (success) {
      setMessage('Mã xác thực mới đã được gửi tới email của bạn. Vui lòng kiểm tra lại.');
    }
  };

  return (
    <Card className="w-full max-w-md border-slate-200 shadow-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-slate-900">Kích hoạt tài khoản</CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Nhập mã kích hoạt 6 chữ số được gửi tới địa chỉ email của bạn để bắt đầu học tập.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-4">
        <div className="text-center py-2 px-3 bg-indigo-50/50 rounded-lg border border-indigo-100 text-xs text-indigo-800">
          Mã xác nhận đã gửi đến: <strong className="font-semibold text-indigo-950 block mt-0.5">{email}</strong>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-semibold">
              {error}
            </div>
          )}
          {message && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold">
              {message}
            </div>
          )}

          <Input
            label="Mã xác thực (6 chữ số)"
            type="text"
            maxLength={6}
            placeholder="Ví dụ: 123456"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            disabled={loading}
            className="text-center tracking-[10px] text-lg font-bold"
            required
          />

          <Button type="submit" className="w-full" loading={loading}>
            Kích hoạt tài khoản
          </Button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || loading}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold hover:underline bg-transparent disabled:text-slate-400"
          >
            {resending ? 'Đang gửi lại mã...' : 'Gửi lại mã kích hoạt'}
          </button>
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 border-t border-slate-100 flex items-center justify-center bg-slate-50/50 text-xs">
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="text-slate-500 hover:text-slate-700 hover:underline bg-transparent"
        >
          Quay lại trang Đăng nhập
        </button>
      </CardFooter>
    </Card>
  );
}

export default function VerifyPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16 bg-slate-50">
      <Suspense fallback={
        <div className="h-40 w-full flex items-center justify-center">
          <svg className="animate-spin h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      }>
        <VerifyForm />
      </Suspense>
    </div>
  );
}
