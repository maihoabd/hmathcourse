import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-8 px-1.5 flex items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm shadow-md">
                HM
              </span>
              <span className="text-lg font-bold text-white tracking-tight">
                HMath Course
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Nền tảng học Toán trực tuyến chất lượng cao dành cho học sinh THCS. Đồng hành cùng các em học sinh phát triển tư duy toán học bản chất, tự tin đạt điểm cao.
            </p>
            <div className="text-[11px] text-slate-500 space-y-1">
              <p>✉️ Email: contact.hmath@gmail.com</p>
            </div>
          </div>

          {/* Links Cols */}
          <div>
            <h4 className="text-xs font-semibold text-white tracking-wider uppercase mb-4">Khóa học nổi bật</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/courses?category=Toán+lớp+7" className="hover:text-white transition-colors">
                  Toán nâng cao lớp 7
                </Link>
              </li>
              <li>
                <Link href="/courses?category=Toán+lớp+8" className="hover:text-white transition-colors">
                  Toán cơ bản lớp 8
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white tracking-wider uppercase mb-4">Học viện</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/courses" className="hover:text-white transition-colors">
                  Tất cả khóa học
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Đăng nhập học viên
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Đăng ký tài khoản
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-850 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500">
          <p>© 2026 HMath Course. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/terms" className="hover:text-slate-400 transition-colors">
              Điều khoản dịch vụ
            </Link>
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">
              Chính sách bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
