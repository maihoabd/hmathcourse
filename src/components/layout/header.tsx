'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/auth-context';
import { useCart } from '../../context/cart-context';
import { Button } from '../ui/button';
import { formatPrice } from '../../lib/utils';

export const Header: React.FC = () => {
  const { user, logout, login } = useAuth();
  const { cartItems, removeFromCart, cartTotal } = useCart();
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // If we are on admin routes, do not render this header (it has its own layout)
  if (pathname?.startsWith('/admin')) return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand/Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="h-9 px-2 flex items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-base shadow-md shadow-indigo-200">
              HM
            </span>
            <span className="text-xl font-bold tracking-tight text-slate-900 bg-gradient-to-r from-slate-900 to-indigo-600 bg-clip-text text-transparent">
              HMath Course
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/courses"
              className={`text-sm font-medium transition-colors hover:text-indigo-600 ${
                pathname === '/courses' ? 'text-indigo-600' : 'text-slate-600'
              }`}
            >
              Khóa học
            </Link>
            {user && user.role === 'student' && (
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-indigo-600 ${
                  pathname === '/dashboard' ? 'text-indigo-600' : 'text-slate-600'
                }`}
              >
                Học tập
              </Link>
            )}
            {user && user.role === 'admin' && (
              <Link
                href="/admin"
                className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
              >
                Quản trị viên
              </Link>
            )}
          </nav>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-4">
          {/* Quick role-switch tool for grading/testing convenience */}


          {/* Shopping Cart Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white transform translate-x-1 -translate-y-1 animate-pulse">
                  {cartItems.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Summary Dropdown */}
            {isCartOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-xl ring-1 ring-black/5 animate-fade-in z-50">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <h4 className="font-semibold text-slate-800">Giỏ hàng của bạn</h4>
                  <button onClick={() => setIsCartOpen(false)} className="text-xs text-slate-400 hover:text-slate-600">Đóng</button>
                </div>
                {cartItems.length === 0 ? (
                  <div className="py-6 text-center">
                    <p className="text-sm text-slate-400">Giỏ hàng đang trống.</p>
                  </div>
                ) : (
                  <>
                    <div className="max-h-48 overflow-y-auto space-y-2 mb-3">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-start justify-between gap-2 p-1.5 hover:bg-slate-50 rounded-lg transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate">{item.title}</p>
                            <p className="text-xs text-indigo-600 font-bold">{formatPrice(item.price)}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs text-red-500 hover:text-red-700 font-medium"
                          >
                            Xóa
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 pt-2.5 mb-3 flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-600">Tổng tiền:</span>
                      <span className="font-bold text-slate-900 text-base">{formatPrice(cartTotal)}</span>
                    </div>
                    <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
                      <Button className="w-full" size="sm">Thanh toán</Button>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* User Profile / Auth State */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
              >
                {user.avatar && !user.avatar.includes('unsplash.com') ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs border border-indigo-200">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'H'}
                  </div>
                )}
                <span className="hidden sm:inline text-sm font-semibold text-slate-700">{user.name}</span>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-fade-in z-50">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1.5">
                    <p className="text-xs font-semibold text-slate-800">{user.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  {user.role === 'student' ? (
                    <Link href="/dashboard" onClick={() => setIsProfileOpen(false)} className="block w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                      Bảng điều khiển
                    </Link>
                  ) : (
                    <Link href="/admin" onClick={() => setIsProfileOpen(false)} className="block w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                      Trang Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="block w-full text-left px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1 font-semibold"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Đăng nhập</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Đăng ký</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
