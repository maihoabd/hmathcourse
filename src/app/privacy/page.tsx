import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="flex-1 bg-slate-50 py-12 md:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Trang chủ</Link>
          <span>/</span>
          <span className="text-slate-600">Chính sách bảo mật</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-10 space-y-8">
          <div className="border-b border-slate-100 pb-6 text-center sm:text-left">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Chính sách Bảo mật</h1>
            <p className="text-xs text-slate-450 mt-2">Cập nhật lần cuối: Ngày 09 tháng 07 năm 2026</p>
          </div>

          <p className="text-xs text-slate-655 leading-relaxed">
            HMath cam kết bảo vệ thông tin riêng tư và bảo mật dữ liệu cá nhân của các em học sinh cũng như các bậc phụ huynh trong suốt quá trình đăng ký và trải nghiệm học tập trên nền tảng của chúng tôi. Chính sách dưới đây nêu rõ phương thức thu thập, sử dụng và bảo mật dữ liệu của bạn.
          </p>

          {/* Section 1 */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900">1. Thông tin cá nhân thu thập</h3>
            <p className="text-xs text-slate-655 leading-relaxed">
              Khi bạn đăng ký tài khoản học tập hoặc thực hiện giao dịch thanh toán trên HMath, chúng tôi thu thập các thông tin cần thiết sau:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-655 space-y-1">
              <li>Họ tên đầy đủ của học viên / phụ huynh.</li>
              <li>Địa chỉ Email dùng để đăng nhập và nhận thông tin học tập.</li>
              <li>Số điện thoại liên lạc để tư vấn khóa học và hỗ trợ kỹ thuật.</li>
              <li>Dữ liệu tiến trình học tập (các bài giảng đã học, kết quả trắc nghiệm và lịch sử truy cập bài giảng).</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900">2. Mục đích sử dụng thông tin</h3>
            <p className="text-xs text-slate-655 leading-relaxed">
              Chúng tôi chỉ sử dụng thông tin cá nhân thu thập được cho các mục đích hợp pháp sau:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-655 space-y-1">
              <li>Kích hoạt tài khoản và mở khóa các bài giảng tương ứng với khóa học đã đăng ký.</li>
              <li>Theo dõi và hiển thị tiến trình học tập cá nhân hóa trên bảng điều khiển của học viên.</li>
              <li>Liên hệ xác nhận thanh toán đơn hàng chuyển khoản và xử lý yêu cầu trợ giúp.</li>
              <li>Gửi tài liệu bổ trợ ôn thi định kỳ môn Toán cho học sinh qua hòm thư điện tử.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900">3. Bảo mật thông tin học viên</h3>
            <p className="text-xs text-slate-655 leading-relaxed">
              HMath áp dụng các tiêu chuẩn mã hóa dữ liệu cao cấp để bảo vệ thông tin học viên. Chúng tôi cam kết <b>không bao giờ bán, cho thuê, trao đổi hoặc tiết lộ</b> thông tin cá nhân của phụ huynh và học sinh cho bất kỳ bên thứ ba nào ngoài mục đích hỗ trợ vận hành và bảo trì máy chủ trực tiếp.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900">4. Sử dụng Cookies</h3>
            <p className="text-xs text-slate-655 leading-relaxed">
              Hệ thống sử dụng các cookie lưu trữ ngắn trên trình duyệt web để giúp duy trì trạng thái đăng nhập tự động của học viên, lưu trữ giỏ hàng tạm thời và ghi nhớ bài học cuối cùng mà học viên đang xem dở dang.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900">5. Quyền kiểm soát của học viên</h3>
            <p className="text-xs text-slate-655 leading-relaxed">
              Bạn có quyền yêu cầu xem lại thông tin cá nhân, cập nhật lại thông tin sai lệch hoặc gửi văn bản yêu cầu đóng/xóa bỏ vĩnh viễn tài khoản học tập trên hệ thống của chúng tôi. Yêu cầu của bạn sẽ được xử lý trong vòng 48 giờ làm việc.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-center text-xs text-slate-450">
            Mọi thắc mắc về bảo mật thông tin vui lòng liên hệ: <b>contact.hmath@gmail.com</b>
          </div>
        </div>

      </div>
    </div>
  );
}
