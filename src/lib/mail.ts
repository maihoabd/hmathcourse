import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

export async function sendVerificationEmail(email: string, name: string, code: string) {
  const mailOptions = {
    from: process.env.SMTP_FROM || '"HMath Course" <no-reply@hmath.edu.vn>',
    to: email,
    subject: '[HMath Course] Mã xác thực kích hoạt tài khoản của bạn',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px 20px; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="display: inline-block; padding: 6px 16px; background-color: #4f46e5; color: white; font-weight: bold; border-radius: 8px; font-size: 18px; letter-spacing: 0.5px;">HMath</span>
        </div>
        <h2 style="color: #1e1b4b; text-align: center; margin-top: 0;">Kích hoạt tài khoản học tập</h2>
        <p style="color: #334155; font-size: 15px; line-height: 1.5;">Xin chào <strong>${name}</strong>,</p>
        <p style="color: #334155; font-size: 15px; line-height: 1.5;">Cảm ơn bạn đã đăng ký tài khoản trên nền tảng học Toán trực tuyến <strong>HMath Course</strong>.</p>
        <p style="color: #334155; font-size: 15px; line-height: 1.5;">Để kích hoạt tài khoản và bắt đầu học tập, vui lòng nhập mã xác nhận 6 chữ số dưới đây trên trang kích hoạt:</p>
        <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; padding: 20px; text-align: center; margin: 25px 0; border-radius: 8px;">
          <span style="font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #4f46e5;">${code}</span>
        </div>
        <p style="color: #64748b; font-size: 12px; line-height: 1.4;">* Mã xác thực này có hiệu lực trong vòng 15 phút. Vì sự an toàn của tài khoản, vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
        <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-bottom: 0;">© 2026 HMath Course. Đồng hành phát triển tư duy Toán THCS.</p>
      </div>
    `,
  };

  try {
    if (process.env.SMTP_USER) {
      await transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${email}`);
    } else {
      console.log('------------------------------------');
      console.log(`[SMTP SIMULATION] Email sent to: ${email}`);
      console.log(`Verification code for student "${name}": ${code}`);
      console.log('------------------------------------');
    }
  } catch (error) {
    console.error('Error sending verification email:', error);
    // Print fallback so testing/verification remains fully unblocked
    console.log(`[SMTP FALLBACK] Code for ${email}: ${code}`);
  }
}
