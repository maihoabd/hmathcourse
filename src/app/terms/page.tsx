import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="flex-1 bg-slate-50 py-12 md:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Trang chủ</Link>
          <span>/</span>
          <span className="text-slate-600">Điều khoản dịch vụ</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-10 space-y-8">
          <div className="border-b border-slate-100 pb-6 text-center sm:text-left">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Điều khoản Dịch vụ</h1>
            <p className="text-xs text-slate-450 mt-2">Cập nhật lần cuối: Ngày 09 tháng 07 năm 2026</p>
          </div>

          {/* Section 1 */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900">1. Chấp nhận các điều khoản</h3>
            <p className="text-xs text-slate-655 leading-relaxed">
              Chào mừng bạn đến với <b>HMath Course</b>. Bằng việc truy cập, đăng ký tài khoản và mua các khóa học trên hệ thống của chúng tôi, bạn đã đồng ý tuân thủ toàn bộ các điều khoản dịch vụ dưới đây. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng ngừng sử dụng dịch vụ.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900">2. Quyền sở hữu trí tuệ</h3>
            <p className="text-xs text-slate-655 leading-relaxed">
              Toàn bộ bài giảng video, hình ảnh minh họa, sơ đồ tư duy, đề thi thử, tài liệu PDF đính kèm và các đoạn mã nguồn hiển thị trên hệ thống HMath đều thuộc sở hữu trí tuệ độc quyền của HMath. Học viên đăng ký học chỉ được cấp quyền truy cập cá nhân không độc quyền để xem bài giảng trực tuyến.
            </p>
            <p className="text-xs text-slate-655 leading-relaxed font-semibold text-red-600">
              Nghiêm cấm tuyệt đối mọi hành vi tải xuống trái phép, ghi hình màn hình bài giảng, sao chép tài liệu học tập để đăng tải lại lên các nền tảng mạng xã hội hoặc thương mại hóa dưới bất kỳ hình thức nào.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900">3. Quy định tài khoản học viên</h3>
            <ul className="list-disc list-inside text-xs text-slate-655 space-y-2">
              <li>Mỗi tài khoản học viên đăng ký chỉ được sử dụng bởi 01 học viên duy nhất.</li>
              <li>Học viên có trách nhiệm bảo mật mật khẩu tài khoản của mình.</li>
              <li>Không được chia sẻ thông tin tài khoản cho người khác dùng chung nhằm mục đích chia sẻ chi phí khóa học.</li>
              <li>Nếu phát hiện tài khoản đăng nhập đồng thời trên nhiều địa chỉ IP lạ bất thường, hệ thống của chúng tôi có quyền tạm khóa tài khoản để xác minh.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900">4. Chính sách học phí và thanh toán</h3>
            <p className="text-xs text-slate-655 leading-relaxed">
              Các khóa học trên HMath được kích hoạt trọn đời sau khi học viên hoàn tất thanh toán học phí qua các cổng thanh toán được hỗ trợ (Thẻ ngân hàng, Chuyển khoản, Ví điện tử). Sau khi đơn hàng đã được kích hoạt thành công (Học viên bắt đầu vào học), HMath không áp dụng chính sách hoàn trả lại học phí trừ trường hợp có lỗi kỹ thuật từ hệ thống của chúng tôi khiến học viên hoàn toàn không thể xem được bài giảng.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900">5. Thay đổi điều khoản dịch vụ</h3>
            <p className="text-xs text-slate-655 leading-relaxed">
              HMath giữ quyền cập nhật, chỉnh sửa và thay đổi các điều khoản dịch vụ này bất kỳ lúc nào để phù hợp với quy định pháp luật và nâng cao chất lượng dịch vụ. Các cập nhật mới nhất sẽ được hiển thị công khai trên website này.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-center text-xs text-slate-450">
            Mọi thắc mắc vui lòng liên hệ bộ phận hỗ trợ học viên: <b>contact.hmath@gmail.com</b>
          </div>
        </div>

      </div>
    </div>
  );
}
