export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isPreview: boolean;
  videoUrl?: string;
  documentUrl?: string;
  textContent?: string;
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Instructor {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  coursesCount: number;
  rating: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  instructor: Instructor;
  thumbnail: string;
  lessonsCount: number;
  duration: string;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  chapters: Chapter[];
  reviews: Review[];
  isBestseller?: boolean;
  grade: string;
  productType: string;
}

export interface EnrolledCourse {
  courseId: string;
  progress: number; // 0 to 100
  completedLessons: string[]; // lesson IDs
  lastAccessed: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  registeredAt: string;
  enrolledCourses: EnrolledCourse[];
  status: 'active' | 'suspended';
}

export interface Order {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  paymentMethod: 'credit_card' | 'bank_transfer' | 'paypal';
  status: 'completed' | 'pending' | 'failed';
  date: string;
}
