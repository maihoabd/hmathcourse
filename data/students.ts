import { Student } from './types';

export const mockStudents: Student[] = [
  {
    id: 's1',
    name: 'Nguyễn Văn Hải',
    email: 'student@lms.com', // Demo student account
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60',
    registeredAt: '2025-12-10T08:30:00Z',
    status: 'active',
    enrolledCourses: [
      {
        courseId: 'c1',
        progress: 25, // 8 out of 32 lessons completed (Ch 1)
        completedLessons: ['c1-l1', 'c1-l2', 'c1-l3', 'c1-l4', 'c1-l5', 'c1-l6', 'c1-l7', 'c1-l8'],
        lastAccessed: '2026-07-08T14:35:00Z'
      },
      {
        courseId: 'c2',
        progress: 10, // 3 out of 30 lessons (the 3 ready video lectures)
        completedLessons: ['c2-l1', 'c2-l2', 'c2-l3'],
        lastAccessed: '2026-07-05T09:12:00Z'
      }
    ]
  },
  {
    id: 's2',
    name: 'Trần Thị Mai',
    email: 'mai.tran@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60',
    registeredAt: '2026-01-15T10:45:00Z',
    status: 'active',
    enrolledCourses: [
      {
        courseId: 'c1',
        progress: 100, // Completed all 32 lessons
        completedLessons: [
          'c1-l1', 'c1-l2', 'c1-l3', 'c1-l4', 'c1-l5', 'c1-l6', 'c1-l7', 'c1-l8',
          'c1-l9', 'c1-l10', 'c1-l11', 'c1-l12', 'c1-l13', 'c1-l14', 'c1-l15', 'c1-l16',
          'c1-l17', 'c1-l18', 'c1-l19', 'c1-l20', 'c1-l21', 'c1-l22', 'c1-l23', 'c1-l24',
          'c1-l25', 'c1-l26', 'c1-l27', 'c1-l28', 'c1-l29', 'c1-l30', 'c1-l31', 'c1-l32'
        ],
        lastAccessed: '2026-06-30T16:20:00Z'
      }
    ]
  },
  {
    id: 's3',
    name: 'Lê Hoàng Long',
    email: 'long.le@yahoo.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60',
    registeredAt: '2026-02-20T14:15:00Z',
    status: 'active',
    enrolledCourses: [
      {
        courseId: 'c1',
        progress: 6, // 2 out of 32
        completedLessons: ['c1-l1', 'c1-l2'],
        lastAccessed: '2026-07-09T03:00:00Z'
      },
      {
        courseId: 'c2',
        progress: 3, // 1 out of 30
        completedLessons: ['c2-l1'],
        lastAccessed: '2026-07-07T11:45:00Z'
      }
    ]
  },
  {
    id: 's4',
    name: 'Phạm Thảo Vy',
    email: 'vy.pham@outlook.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=60',
    registeredAt: '2026-03-05T09:00:00Z',
    status: 'active',
    enrolledCourses: [
      {
        courseId: 'c2',
        progress: 6, // 2 out of 30
        completedLessons: ['c2-l1', 'c2-l2'],
        lastAccessed: '2026-07-08T15:10:00Z'
      }
    ]
  },
  {
    id: 's5',
    name: 'Đặng Tuấn Anh',
    email: 'tuananh.dang@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60',
    registeredAt: '2026-03-12T11:30:00Z',
    status: 'active',
    enrolledCourses: [
      {
        courseId: 'c1',
        progress: 3, // 1 out of 32
        completedLessons: ['c1-l1'],
        lastAccessed: '2026-05-20T08:00:00Z'
      }
    ]
  },
  {
    id: 's6',
    name: 'Vũ Quốc Bảo',
    email: 'bao.vu@hotmail.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=60',
    registeredAt: '2026-04-01T15:20:00Z',
    status: 'active',
    enrolledCourses: [
      {
        courseId: 'c1',
        progress: 50, // 16 out of 32
        completedLessons: [
          'c1-l1', 'c1-l2', 'c1-l3', 'c1-l4', 'c1-l5', 'c1-l6', 'c1-l7', 'c1-l8',
          'c1-l9', 'c1-l10', 'c1-l11', 'c1-l12', 'c1-l13', 'c1-l14', 'c1-l15', 'c1-l16'
        ],
        lastAccessed: '2026-07-09T09:30:00Z'
      }
    ]
  },
  {
    id: 's7',
    name: 'Hoàng Kim Chi',
    email: 'chi.hoang@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60',
    registeredAt: '2026-04-18T16:40:00Z',
    status: 'active',
    enrolledCourses: [
      {
        courseId: 'c2',
        progress: 10,
        completedLessons: ['c2-l1', 'c2-l2', 'c2-l3'],
        lastAccessed: '2026-06-25T10:15:00Z'
      }
    ]
  },
  {
    id: 's8',
    name: 'Đỗ Hùng Dũng',
    email: 'dung.do@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=60',
    registeredAt: '2026-05-02T13:10:00Z',
    status: 'active',
    enrolledCourses: [
      {
        courseId: 'c2',
        progress: 10,
        completedLessons: ['c2-l1', 'c2-l2', 'c2-l3'],
        lastAccessed: '2026-06-15T15:20:00Z'
      }
    ]
  },
  {
    id: 's9',
    name: 'Phan Huy Hoàng',
    email: 'hoang.phan@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=60',
    registeredAt: '2026-05-10T10:00:00Z',
    status: 'active',
    enrolledCourses: [
      {
        courseId: 'c1',
        progress: 25,
        completedLessons: ['c1-l1', 'c1-l2', 'c1-l3', 'c1-l4', 'c1-l5', 'c1-l6', 'c1-l7', 'c1-l8'],
        lastAccessed: '2026-07-06T17:15:00Z'
      }
    ]
  },
  {
    id: 's10',
    name: 'Bùi Tiến Dũng',
    email: 'dung.bui@yahoo.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=60',
    registeredAt: '2026-05-25T14:30:00Z',
    status: 'suspended',
    enrolledCourses: [
      {
        courseId: 'c1',
        progress: 0,
        completedLessons: [],
        lastAccessed: '2026-05-25T14:35:00Z'
      }
    ]
  },
  {
    id: 's11',
    name: 'Lê Hữu Nghĩa',
    email: 'nghia.le@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=60',
    registeredAt: '2026-06-01T08:15:00Z',
    status: 'active',
    enrolledCourses: [
      {
        courseId: 'c1',
        progress: 6,
        completedLessons: ['c1-l1', 'c1-l2'],
        lastAccessed: '2026-07-08T09:40:00Z'
      }
    ]
  },
  {
    id: 's12',
    name: 'Nguyễn Bích Ngọc',
    email: 'ngoc.nguyen@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60',
    registeredAt: '2026-06-15T09:50:00Z',
    status: 'active',
    enrolledCourses: [
      {
        courseId: 'c2',
        progress: 10,
        completedLessons: ['c2-l1', 'c2-l2', 'c2-l3'],
        lastAccessed: '2026-07-09T14:20:00Z'
      }
    ]
  }
];
