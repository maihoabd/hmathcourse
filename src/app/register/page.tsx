'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/auth-context';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword || !phone) {
      setError('Vui lòng điền đầy đủ tất cả thông tin.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không trùng khớp.');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải chứa ít nhất 6 ký tự.');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password, phone);
    setLoading(false);

    if (result.success) {
      if (result.unverified) {
        router.push('/verify?email=' + encodeURIComponent(email));
      }
    } else {
      setError('Đăng ký thất bại. Địa chỉ email có thể đã được sử dụng.');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16 bg-slate-50">
      <Card className="w-full max-w-md border-slate-200 shadow-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-slate-900">Đăng ký thành viên</CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Tạo tài khoản học tập trên HMath chỉ trong 30 giây.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-semibold">
                {error}
              </div>
            )}
            <Input
              label="Họ và Tên (bắt buộc)"
              type="text"
              placeholder="Nguyễn Văn A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
            <Input
              label="Số điện thoại (bắt buộc)"
              type="tel"
              placeholder="Ví dụ: 0987654321"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
              required
            />
            <Input
              label="Địa chỉ Email (bắt buộc)"
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
              placeholder="Tối thiểu 6 ký tự"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
            <Input
              label="Nhập lại mật khẩu"
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
            />
            <Button type="submit" className="w-full" loading={loading}>
              Đăng ký tài khoản
            </Button>
          </form>
        </CardContent>
        <CardFooter className="px-6 py-4 border-t border-slate-100 flex items-center justify-center bg-slate-50/50 text-xs">
          <span className="text-slate-500 mr-1.5">Bạn đã có tài khoản?</span>
          <Link href="/login" className="font-semibold text-indigo-600 hover:underline">
            Đăng nhập
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
