import { Course } from './types';

export const mockCourses: Course[] = [
  {
    id: 'c1',
    slug: 'khoa-hoc-toan-nang-cao-lop-7-bo-sach-ket-noi-tri-thuc',
    title: 'Khóa học Toán Nâng cao lớp 7 - Bộ sách Kết Nối Tri Thức',
    shortDescription: 'Chương trình Toán 7 nâng cao bám sát bộ sách Kết Nối Tri Thức. Giúp học sinh đạt điểm 9, 10 trong các kỳ thi.',
    description: 'Khóa học thiết kế chuyên sâu dành cho học sinh lớp 7 muốn chinh phục các bài toán khó, nâng cao tư duy logic và đạt kết quả tốt nhất trong các kỳ thi Học sinh giỏi và kiểm tra định kỳ. Nội dung bám sát khung chương trình sách giáo khoa Kết Nối Tri Thức Với Cuộc Sống, mở rộng thêm các chuyên đề bồi dưỡng nâng cao phong phú như Số hữu tỉ nâng cao, dãy tỉ số bằng nhau, bất đẳng thức tam giác và các bài toán hình học chuyên sâu.',
    price: 590000,
    originalPrice: 990000,
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=60',
    category: 'Toán lớp 7',
    level: 'Advanced',
    lessonsCount: 32,
    duration: '24 giờ 15 phút',
    rating: 4.9,
    reviewsCount: 42,
    studentsCount: 320,
    isBestseller: true,
    instructor: {
      name: 'Thầy Hoàng HMath',
      role: 'Thạc sĩ Sư phạm Toán học - Đại học Sư phạm Hà Nội',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=60',
      bio: 'Hơn 10 năm kinh nghiệm bồi dưỡng học sinh giỏi Toán THCS, có phương pháp dạy dễ hiểu, cuốn hút.',
      coursesCount: 2,
      rating: 4.9
    },
    chapters: [
      {
        id: 'c1-ch1',
        title: 'Chương 1: Số hữu tỉ nâng cao (8 bài giảng)',
        lessons: [
          {
            id: 'c1-l1',
            title: '1. Khái niệm và biểu diễn số hữu tỉ nâng cao',
            duration: '15:20',
            isPreview: true,
            videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY',
            documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            textContent: '<h4 class="font-bold text-slate-800 text-sm mb-2">Tóm tắt lý thuyết bài 1:</h4><p class="text-xs text-slate-500 mb-2">Số hữu tỉ là số viết được dưới dạng phân số a/b với a, b thuộc Z, b khác 0. Trong bài học này, chúng ta sẽ mở rộng các phương pháp so sánh số hữu tỉ nâng cao bằng phương pháp chọn số trung gian hoặc đánh giá phần bù.</p>'
          },
          { id: 'c1-l2', title: '2. Cộng, trừ, nhân, chia số hữu tỉ nâng cao', duration: '18:15', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' },
          { id: 'c1-l3', title: '3. Giá trị tuyệt đối của một số hữu tỉ', duration: '22:40', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' },
          { id: 'c1-l4', title: '4. Luyện tập phép tính số hữu tỉ (Dạng toán tính nhanh)', duration: '20:10', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' },
          { id: 'c1-l5', title: '5. Lũy thừa của một số hữu tỉ (Phần 1)', duration: '19:40', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' },
          { id: 'c1-l6', title: '6. Lũy thừa của một số hữu tỉ (Phần 2 nâng cao)', duration: '21:10', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' },
          { id: 'c1-l7', title: '7. Tỉ lệ thức và các tính chất cơ bản', duration: '25:15', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' },
          { id: 'c1-l8', title: '8. Chuyên đề Dãy tỉ số bằng nhau chuyên sâu', duration: '30:05', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' }
        ]
      },
      {
        id: 'c1-ch2',
        title: 'Chương 2: Số thực & Căn bậc hai (8 bài giảng)',
        lessons: [
          { id: 'c1-l9', title: '9. Số thập phân vô hạn và số vô tỉ', duration: '18:50', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' },
          { id: 'c1-l10', title: '10. Khái niệm căn bậc hai số học', duration: '21:15', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' },
          { id: 'c1-l11', title: '11. Số thực và trục số thực', duration: '19:30', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' },
          { id: 'c1-l12', title: '12. Làm tròn số và ước lượng kết quả', duration: '17:20', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' },
          { id: 'c1-l13', title: '13. Chuyên đề Đại lượng tỉ lệ thuận nâng cao', duration: '24:10', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' },
          { id: 'c1-l14', title: '14. Chuyên đề Đại lượng tỉ lệ nghịch nâng cao', duration: '22:45', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' },
          { id: 'c1-l15', title: '15. Khái niệm hàm số và đồ thị y = ax', duration: '26:10', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' },
          { id: 'c1-l16', title: '16. Luyện tập tổng hợp chương số thực', duration: '25:00', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' }
        ]
      },
      {
        id: 'c1-ch3',
        title: 'Chương 3: Góc và Đường thẳng song song (8 bài giảng)',
        lessons: [
          { id: 'c1-l17', title: '17. Góc ở vị trí đặc biệt (kề bù, đối đỉnh)', duration: '19:15', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' },
          { id: 'c1-l18', title: '18. Tia phân giác của một góc', duration: '18:40', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' },
          { id: 'c1-l19', title: '19. Hai đường thẳng song song và dấu hiệu nhận biết', duration: '22:10', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' },
          { id: 'c1-l20', title: '20. Tiên đề Euclid về đường thẳng song song', duration: '24:35', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' },
          { id: 'c1-l21', title: '21. Định lí và chứng minh một định lí hình học', duration: '25:20', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' },
          { id: 'c1-l22', title: '22. Phương pháp chứng minh hai đường thẳng vuông góc', duration: '23:10', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' },
          { id: 'c1-l23', title: '23. Tổng các góc trong một tam giác', duration: '28:15', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' },
          { id: 'c1-l24', title: '24. Luyện tập chứng minh hình học chương 3', duration: '30:00', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' }
        ]
      },
      {
        id: 'c1-ch4',
        title: 'Chương 4: Tam giác bằng nhau chuyên sâu (8 bài giảng)',
        lessons: [
          { id: 'c1-l25', title: '25. Hai tam giác bằng nhau và trường hợp c-c-c', duration: '24:15', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' },
          { id: 'c1-l26', title: '26. Trường hợp bằng nhau c-g-c của tam giác', duration: '25:30', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' },
          { id: 'c1-l27', title: '27. Trường hợp bằng nhau g-c-g của tam giác', duration: '26:50', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' },
          { id: 'c1-l28', title: '28. Các trường hợp bằng nhau của tam giác vuông', duration: '28:10', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' },
          { id: 'c1-l29', title: '29. Tam giác cân, tam giác đều và tính chất', duration: '27:40', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' },
          { id: 'c1-l30', title: '30. Đường trung trực của đoạn thẳng', duration: '22:15', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' },
          { id: 'c1-l31', title: '31. Chuyên đề Bất đẳng thức tam giác nâng cao', duration: '32:00', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' },
          { id: 'c1-l32', title: '32. Ôn tập hình học học kỳ 1 tổng hợp', duration: '35:00', isPreview: false, videoUrl: 'https://www.youtube.com/embed/Sklc_fSGryY' }
        ]
      }
    ],
    reviews: [
      { id: 'rev1', userName: 'Nguyễn Tiến Đạt', rating: 5, comment: 'Bài giảng dãy tỉ số bằng nhau của thầy Hoàng cực hay, có nhiều bài tập độc lạ giúp mình đạt điểm 10.', date: '2026-06-15' },
      { id: 'rev2', userName: 'Trần Bích Thủy', rating: 5, comment: 'Học hình học của thầy Hoàng rất dễ vẽ hình và hiểu bản chất chứng minh tam giác.', date: '2026-07-02' }
    ]
  },
  {
    id: 'c2',
    slug: 'khoa-hoc-toan-lop-8-co-ban-bo-sach-ket-noi-tri-thuc',
    title: 'Khóa học Toán lớp 8 cơ bản - Bộ sách Kết Nối Tri Thức',
    shortDescription: 'Toàn bộ chương trình toán lớp 8 cơ bản chuẩn chỉnh theo sách giáo khoa Kết Nối Tri Thức. Tích hợp 3 bài giảng đầu hoàn chỉnh.',
    description: 'Khóa học được xây dựng nhằm giúp các em học sinh lớp 8 nắm chắc kiến thức căn bản môn Toán. Chương trình bám sát bộ sách giáo khoa Kết Nối Tri Thức Với Cuộc Sống. Giai đoạn hiện tại hệ thống đã tải lên trước 3 video bài giảng chất lượng cao đầu tiên để học sinh tự học tại nhà, các bài giảng tiếp theo (tổng 30 bài) sẽ liên tục được cập nhật theo tiến độ năm học.',
    price: 490000,
    originalPrice: 850000,
    thumbnail: 'https://images.unsplash.com/photo-1453733190148-c44698c26588?w=800&auto=format&fit=crop&q=60',
    category: 'Toán lớp 8',
    level: 'Beginner',
    lessonsCount: 30,
    duration: '20 giờ 30 phút',
    rating: 4.8,
    reviewsCount: 28,
    studentsCount: 210,
    isBestseller: false,
    instructor: {
      name: 'Thầy Hoàng HMath',
      role: 'Thạc sĩ Sư phạm Toán học - Đại học Sư phạm Hà Nội',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=60',
      bio: 'Hơn 10 năm kinh nghiệm bồi dưỡng học sinh giỏi Toán THCS, có phương pháp dạy dễ hiểu, cuốn hút.',
      coursesCount: 2,
      rating: 4.9
    },
    chapters: [
      {
        id: 'c2-ch1',
        title: 'Chương 1: Đa thức và Các phép toán đa thức (10 bài giảng)',
        lessons: [
          {
            id: 'c2-l1',
            title: '1. Đơn thức và đa thức nhiều biến',
            duration: '15:20',
            isPreview: true,
            videoUrl: 'https://www.youtube.com/embed/c9Wg6A_eLXY',
            documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            textContent: '<h4 class="font-bold text-slate-800 text-sm mb-2">Nội dung bài học 1:</h4><p class="text-xs text-slate-500 mb-2">Đơn thức là biểu thức đại số chỉ gồm một số, hoặc một biến, hoặc một tích giữa các số và các biến. Đa thức là một tổng của những đơn thức. Mỗi đơn thức trong tổng đó gọi là một hạng tử của đa thức.</p>'
          },
          {
            id: 'c2-l2',
            title: '2. Các phép toán cộng và trừ đa thức',
            duration: '18:10',
            isPreview: true,
            videoUrl: 'https://www.youtube.com/embed/c9Wg6A_eLXY',
            documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            textContent: '<h4 class="font-bold text-slate-800 text-sm mb-2">Nội dung bài học 2:</h4><p class="text-xs text-slate-500 mb-2">Để cộng hay trừ hai đa thức, ta thực hiện theo các bước: 1. Viết phép tính cộng/trừ giữa hai đa thức đặt trong ngoặc. 2. Phá ngoặc (lưu ý đổi dấu nếu trước ngoặc có dấu trừ). 3. Nhóm các đơn thức đồng dạng và thu gọn.</p>'
          },
          {
            id: 'c2-l3',
            title: '3. Nhân đơn thức và đa thức',
            duration: '20:15',
            isPreview: true,
            videoUrl: 'https://www.youtube.com/embed/c9Wg6A_eLXY',
            documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            textContent: '<h4 class="font-bold text-slate-800 text-sm mb-2">Nội dung bài học 3:</h4><p class="text-xs text-slate-500 mb-2">Quy tắc nhân đơn thức với đa thức: Muốn nhân một đơn thức với một đa thức, ta nhân đơn thức với từng hạng tử của đa thức rồi cộng các tích với nhau: A(B + C) = AB + AC.</p>'
          },
          // Rest of lessons are placeholder placeholders (no video details - locked for students in frontend)
          { id: 'c2-l4', title: '4. Phép chia đa thức cho đơn thức', duration: '19:40', isPreview: false },
          { id: 'c2-l5', title: '5. Luyện tập tổng hợp Chương 1', duration: '22:15', isPreview: false },
          { id: 'c2-l6', title: '6. Phân tích đa thức thành nhân tử (Bằng đặt nhân tử chung)', duration: '21:30', isPreview: false },
          { id: 'c2-l7', title: '7. Phân tích đa thức bằng phương pháp dùng hằng đẳng thức', duration: '23:45', isPreview: false },
          { id: 'c2-l8', title: '8. Phân tích đa thức bằng nhóm hạng tử', duration: '20:50', isPreview: false },
          { id: 'c2-l9', title: '9. Phân tích đa thức phối hợp nhiều phương pháp', duration: '24:10', isPreview: false },
          { id: 'c2-l10', title: '10. Bài tập nâng cao phân tích đa thức thành nhân tử', duration: '25:00', isPreview: false }
        ]
      },
      {
        id: 'c2-ch2',
        title: 'Chương 2: Hằng đẳng thức đáng nhớ (10 bài giảng)',
        lessons: [
          { id: 'c2-l11', title: '11. Bình phương của một tổng và một hiệu', duration: '18:20', isPreview: false },
          { id: 'c2-l12', title: '12. Hiệu hai bình phương', duration: '17:15', isPreview: false },
          { id: 'c2-l13', title: '13. Lập phương của một tổng và một hiệu', duration: '22:10', isPreview: false },
          { id: 'c2-l14', title: '14. Tổng và hiệu hai lập phương', duration: '21:40', isPreview: false },
          { id: 'c2-l15', title: '15. Luyện tập ứng dụng hằng đẳng thức tính nhanh', duration: '19:50', isPreview: false },
          { id: 'c2-l16', title: '16. Phân thức đại số và tính chất cơ bản', duration: '22:15', isPreview: false },
          { id: 'c2-l17', title: '17. Rút gọn phân thức đại số', duration: '24:30', isPreview: false },
          { id: 'c2-l18', title: '18. Cộng và trừ phân thức đại số', duration: '26:10', isPreview: false },
          { id: 'c2-l19', title: '19. Nhân và chia phân thức đại số', duration: '25:40', isPreview: false },
          { id: 'c2-l20', title: '20. Ôn tập chương hằng đẳng thức & phân thức', duration: '28:00', isPreview: false }
        ]
      },
      {
        id: 'c2-ch3',
        title: 'Chương 3: Tứ giác & Hình học phẳng (10 bài giảng)',
        lessons: [
          { id: 'c2-l21', title: '21. Khái niệm Tứ giác lồi và định lí tổng các góc', duration: '20:15', isPreview: false },
          { id: 'c2-l22', title: '22. Hình thang, hình thang cân và tính chất', duration: '22:45', isPreview: false },
          { id: 'c2-l23', title: '23. Hình bình hành và dấu hiệu nhận biết', duration: '25:30', isPreview: false },
          { id: 'c2-l24', title: '24. Hình chữ nhật và ứng dụng đường trung tuyến', duration: '24:10', isPreview: false },
          { id: 'c2-l25', title: '25. Hình thoi và tính chất đối xứng đường chéo', duration: '23:15', isPreview: false },
          { id: 'c2-l26', title: '26. Hình vuông và mối quan hệ giữa các tứ giác', duration: '26:50', isPreview: false },
          { id: 'c2-l27', title: '27. Định lí Thalès trong tam giác', duration: '28:10', isPreview: false },
          { id: 'c2-l28', title: '28. Đường trung bình của tam giác', duration: '22:30', isPreview: false },
          { id: 'c2-l29', title: '29. Luyện tập chứng minh hình học tứ giác', duration: '30:00', isPreview: false },
          { id: 'c2-l30', title: '30. Ôn tập học kỳ 1 môn Toán lớp 8', duration: '32:00', isPreview: false }
        ]
      }
    ],
    reviews: [
      { id: 'rev3', userName: 'Trần Văn Long', rating: 4, comment: 'Video bài giảng âm thanh rất rõ ràng. Đợi thầy cập nhật tiếp các bài học tiếp theo.', date: '2026-07-01' }
    ]
  }
];
