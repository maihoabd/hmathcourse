import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const bookId = searchParams.get('bookId');
    const pageIndexStr = searchParams.get('pageIndex'); // 1-indexed (1 to 160)

    if (!userId || !bookId || !pageIndexStr) {
      return NextResponse.json({ error: 'Thiếu thông tin yêu cầu (userId, bookId, pageIndex).' }, { status: 400 });
    }

    const pageIndex = parseInt(pageIndexStr);
    if (isNaN(pageIndex) || pageIndex < 1) {
      return NextResponse.json({ error: 'Số trang không hợp lệ.' }, { status: 400 });
    }

    // 1. Authenticate user
    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'Không tìm thấy tài khoản người dùng.' }, { status: 404 });
    }

    const isAdmin = user.role === 'admin';

    // 2. Verify student has purchased/enrolled in this book product
    if (!isAdmin) {
      const enrollment = await db.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: bookId
          }
        }
      });

      if (!enrollment) {
        return NextResponse.json({ error: 'Bạn chưa mua hoặc không có quyền truy cập cuốn sách này.' }, { status: 403 });
      }
    }

    // 3. Locate secure PDF file
    // We only support amc8_2025 book currently (ID: c3)
    let fileName = 'amc8_2025.pdf';
    if (bookId !== 'c3') {
      return NextResponse.json({ error: 'Không tìm thấy tài liệu yêu cầu.' }, { status: 404 });
    }

    const pdfPath = path.join(process.cwd(), 'private_documents', fileName);
    if (!fs.existsSync(pdfPath)) {
      return NextResponse.json({ error: 'Tài liệu gốc chưa được tải lên máy chủ.' }, { status: 404 });
    }

    // 4. Load PDF using pdf-lib and extract single page
    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const zeroPageIndex = pageIndex - 1; // pdf-lib uses 0-based index
    if (zeroPageIndex < 0 || zeroPageIndex >= pdfDoc.getPageCount()) {
      return NextResponse.json({ error: `Số trang vượt quá giới hạn (tổng cộng ${pdfDoc.getPageCount()} trang).` }, { status: 400 });
    }

    // Create a new single-page PDF document
    const subPdfDoc = await PDFDocument.create();
    const [copiedPage] = await subPdfDoc.copyPages(pdfDoc, [zeroPageIndex]);
    subPdfDoc.addPage(copiedPage);

    // Save PDF
    const pdfBytes = await subPdfDoc.save();

    // 5. Return the single page PDF bytes
    return new Response(pdfBytes as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': pdfBytes.length.toString(),
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
    });

  } catch (error: any) {
    console.error('Fetch secure page PDF error:', error);
    return NextResponse.json({ error: 'Lỗi hệ thống khi tải trang tài liệu.' }, { status: 550 });
  }
}
