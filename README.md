# Gemini Academy - Nền tảng học khóa học trực tuyến

Dự án website bán khóa học trực tuyến hoàn chỉnh được xây dựng trên nền tảng **Next.js 14+ (App Router)**, **TypeScript** và **Tailwind CSS**.

---

## 🛠️ Stack công nghệ sử dụng
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (Bật `"strict": true` trong `tsconfig.json`)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Dữ liệu**: Quản lý bộ nhớ client thông qua Local Storage kết hợp tệp dữ liệu mẫu để duy trì CRUD.

---

## 🔑 Tài khoản thử nghiệm (Demo)
Bạn có thể sử dụng các tài khoản demo sau để đăng nhập kiểm thử các vai trò:

| Vai trò | Email đăng nhập | Mật khẩu | Chức năng chính |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@lms.com` | `admin123` | Quản lý doanh thu, CRUD khóa học, kích hoạt đơn hàng, quản lý học viên |
| **Student** | `student@lms.com` | `student123` | Xem danh sách khóa học, mua khóa học, theo dõi tiến độ học tập |

*Mẹo: Trên trang Đăng nhập có sẵn các nút tự động điền nhanh (Quick Login) cho cả 2 vai trò trên để thuận tiện kiểm thử.*

---

## 📂 Cấu trúc thư mục dự án
```
sale/
├── data/
│   ├── types.ts          # Định nghĩa TypeScript interfaces (Course, Student, Order...)
│   ├── courses.ts        # 8 khóa học mẫu đầy đủ chương trình, giảng viên, review
│   ├── students.ts       # 12 tài khoản học viên mẫu kèm dữ liệu tiến độ học tập
│   └── orders.ts         # 18 lịch sử giao dịch thanh toán đơn hàng mẫu
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Layout gốc, tích hợp context, font và layout toàn cục
│   │   ├── page.tsx           # Landing Page giới thiệu, testimonial, khóa học nổi bật
│   │   ├── login/             # Trang Đăng nhập tài khoản
│   │   ├── register/          # Trang Đăng ký tài khoản
│   │   ├── courses/           # Trang danh sách khóa học kèm bộ lọc và tìm kiếm nâng cao
│   │   │   └── [slug]/        # Trang chi tiết khóa học, xem mục lục chương trình & review
│   │   ├── checkout/          # Trang thanh toán giỏ hàng, nhập mã giảm giá & cổng thanh toán mock
│   │   ├── dashboard/         # Trang bảng điều khiển học viên, tiến độ hoàn thành bài học
│   │   └── admin/             # Phân hệ quản trị (Kiểm tra role admin tự động redirect)
│   │       ├── layout.tsx     # Layout quản trị với Sidebar thu gọn riêng biệt
│   │       ├── page.tsx       # Báo cáo tổng quan, chỉ số KPI và biểu đồ doanh thu SVG
│   │       ├── courses/       # Giao diện CRUD khóa học (Thêm, Sửa, Xóa lưu Local Storage)
│   │       ├── students/      # Bảng danh sách học viên và quản lý đóng/mở tài khoản
│   │       └── orders/        # Bảng quản lý hóa đơn giao dịch, phê duyệt thanh toán
│   ├── components/
│   │   ├── ui/                # Các thành phần giao diện tái sử dụng (Button, Card, Badge...)
│   │   ├── layout/            # Layout thành phần (Header, Footer, AdminSidebar)
│   │   └── features/          # Các thành phần nghiệp vụ nâng cao
│   ├── context/
│   │   ├── auth-context.tsx   # Context giả lập phân quyền tài khoản (Student, Admin, Guest)
│   │   └── cart-context.tsx   # Context quản lý giỏ hàng mua khóa học
│   └── lib/
│       └── utils.ts           # Hàm ghép class Tailwind và định dạng tiền tệ VND
```

---

## 🚀 Hướng dẫn cài đặt và khởi chạy

Do dự án sử dụng bộ cài Node.js Portable, vui lòng thực hiện các lệnh sau để cài đặt và chạy trên máy của bạn:

### 1. Cài đặt các gói phụ thuộc (Dependencies)
```bash
npm install
```

### 2. Chạy ứng dụng ở chế độ phát triển (Development Mode)
```bash
npm run dev
```
Sau khi chạy, truy cập vào đường dẫn [http://localhost:3000](http://localhost:3000) trên trình duyệt.

### 3. Kiểm tra tính hợp lệ và Build sản phẩm (Production Mode)
```bash
npm run build
```
Dự án sẽ được biên dịch và tối ưu hóa mà không có bất kỳ lỗi TypeScript hay ESLint nào.

---

## 📝 Cách thêm khóa học mới vào Mock Data
Để thêm khóa học mặc định mới trực tiếp vào hệ thống trước khi khởi chạy, bạn có thể thực hiện theo các bước sau:

1. Mở tệp `data/courses.ts`.
2. Định nghĩa một đối tượng khóa học mới tuân thủ interface `Course` (từ `data/types.ts`). Ví dụ:
   ```typescript
   {
     id: 'c9',
     slug: 'khoa-hoc-typescript-nang-cao',
     title: 'Khóa học TypeScript chuyên sâu',
     shortDescription: 'Làm chủ Generics, Decorators và kiến trúc phần mềm hướng đối tượng.',
     description: 'Mô tả chi tiết khóa học...',
     price: 690000,
     originalPrice: 1200000,
     thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
     category: 'Lập trình Web',
     level: 'Advanced',
     lessonsCount: 12,
     duration: '14 giờ 30 phút',
     rating: 4.9,
     reviewsCount: 15,
     studentsCount: 180,
     chapters: [
       {
         id: 'c9-ch1',
         title: 'Chương 1: Generics nâng cao',
         lessons: [
           { id: 'c9-l1', title: '1. Khái niệm và ứng dụng thực tiễn', duration: '15:00', isPreview: true }
         ]
       }
     ],
     reviews: [],
     instructor: {
       name: 'Nguyễn Văn A',
       role: 'Senior Fullstack Engineer',
       avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
       bio: 'Thông tin tóm tắt tiểu sử giảng viên...',
       coursesCount: 5,
       rating: 4.9
     }
   }
   ```
3. Lưu tệp. Dữ liệu mới sẽ lập tức được nạp vào trang danh sách và trang quản trị khi tải lại trang.
