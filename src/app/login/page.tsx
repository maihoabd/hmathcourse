'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/auth-context';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';

function LoginForm() {
  const { login, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectPath = searchParams ? searchParams.get('redirect') : null;

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        router.replace('/admin');
      } else {
        router.replace(redirectPath || '/dashboard');
      }
    }
  }, [user, router, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (!success) {
      setError('Email hoặc mật khẩu không chính xác.');
    }
  };

  const handleQuickLogin = async (role: 'student' | 'admin') => {
    setEmail(role === 'student' ? 'student@lms.com' : 'admin@lms.com');
    setPassword(role === 'student' ? 'student123' : 'admin123');
    setError('');
    
    setLoading(true);
    if (role === 'student') {
      await login('student@lms.com', 'student123');
    } else {
      await login('admin@lms.com', 'admin123');
    }
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md border-slate-200 shadow-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-slate-900">Đăng nhập tài khoản</CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Nhập email và mật khẩu của bạn để truy cập bài học.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-semibold">
              {error}
            </div>
          )}
          <Input
            label="Địa chỉ Email"
            type="email"
            placeholder="ten@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <Input
            label="Mật khẩu"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <Button type="submit" className="w-full" loading={loading}>
            Đăng nhập
          </Button>
        </form>


      </CardContent>
      <CardFooter className="px-6 py-4 border-t border-slate-100 flex items-center justify-center bg-slate-50/50 text-xs">
        <span className="text-slate-500 mr-1.5">Bạn chưa có tài khoản?</span>
        <Link href="/register" className="font-semibold text-indigo-600 hover:underline">
          Đăng ký
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
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
        <LoginForm />
      </Suspense>
    </div>
  );
}
