import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/auth-context';
import { CartProvider } from '../context/cart-context';
import { Header } from '../components/layout/header';
import { Footer } from '../components/layout/footer';

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['vietnamese', 'latin'],
  display: 'swap',
  variable: '--font-be-vietnam-pro',
});

export const metadata: Metadata = {
  title: 'HMath - Học Toán cùng HMath',
  description: 'Nền tảng học Toán trực tuyến chất lượng cao dành cho học sinh THCS. Khóa học Toán lớp 7 nâng cao, Toán lớp 8 cơ bản bám sát bộ sách Kết Nối Tri Thức.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 font-sans text-slate-650">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
