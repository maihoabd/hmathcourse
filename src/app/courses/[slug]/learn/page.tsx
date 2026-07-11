'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../context/auth-context';
import { Button } from '../../../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { Progress } from '../../../../components/ui/progress';
import { cn } from '../../../../lib/utils';

export default function StudentClassroomPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const slug = params?.slug as string;

  const [course, setCourse] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'documents' | 'summary'>('documents');
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});

  // 1. Fetch course details and student enrollment records in parallel
  useEffect(() => {
    if (!slug || !user) {
      if (!user && !loading) {
        router.push('/login?redirect=/courses/' + slug + '/learn');
      }
      return;
    }

    const loadData = async () => {
      try {
        // Fetch course details
        const courseRes = await fetch(`/api/courses?slug=${slug}`);
        if (!courseRes.ok) {
          throw new Error('Course not found');
        }
        const courseData = await courseRes.json();
        setCourse(courseData);

        // Fetch enrollment
        const enrollRes = await fetch(`/api/enrollments?userId=${user.id}`);
        if (enrollRes.ok) {
          const enrollmentsList = await enrollRes.json();
          const match = enrollmentsList.find((e: any) => e.courseId === courseData.id);
          
          if (match) {
            setEnrollment(match);
            setCompletedLessons(match.completedLessons || []);
          } else if (user.role !== 'admin') {
            // Guard: student is not enrolled in this course
            setEnrollment(null);
          }
        }

        // Expand the first chapter by default
        if (courseData.chapters && courseData.chapters.length > 0) {
          setExpandedChapters({ [courseData.chapters[0].id]: true });
          
          // Auto select first lesson
          if (courseData.chapters[0].lessons && courseData.chapters[0].lessons.length > 0) {
            setActiveLesson(courseData.chapters[0].lessons[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load classroom data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug, user]);

  // Guard checks
  const isAccessible = useMemo(() => {
    if (!user) return false;
    if (user.role === 'admin') return true; // Admins bypass enrollment checks
    return enrollment !== null;
  }, [user, enrollment]);

  // Total lessons count
  const totalLessons = useMemo(() => {
    if (!course?.chapters) return 0;
    return course.chapters.reduce((sum: number, ch: any) => sum + (ch.lessons?.length || 0), 0);
  }, [course]);

  // Progress percentage
  const progressPercentage = useMemo(() => {
    if (totalLessons === 0) return 0;
    return Math.round((completedLessons.length / totalLessons) * 100);
  }, [completedLessons, totalLessons]);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  // Toggle mark lesson as completed
  const handleToggleComplete = async () => {
    if (!user || !course || !activeLesson || updatingProgress) return;

    setUpdatingProgress(true);
    const isCompleted = completedLessons.includes(activeLesson.id);
    const nextCompletedState = !isCompleted;

    try {
      const res = await fetch('/api/enrollments/progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          courseId: course.id,
          lessonId: activeLesson.id,
          completed: nextCompletedState,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCompletedLessons(data.completedLessons || []);
        if (enrollment) {
          setEnrollment((prev: any) => ({
            ...prev,
            progress: data.progress,
            completedLessons: data.completedLessons,
          }));
        }
      } else {
        alert('Không thể cập nhật tiến trình học tập.');
      }
    } catch (err) {
      console.error('Error toggling complete status:', err);
    } finally {
      setUpdatingProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-32 bg-slate-50">
        <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  // If not enrolled and not admin, display access denied
  if (!isAccessible) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center space-y-6 flex-1">
        <div className="h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
          !
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">Truy cập bị từ chối</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Bạn chưa đăng ký hoặc mua khóa học này. Hãy đăng ký mua khóa học để bắt đầu học tập ngay nhé!
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-4">
          <Link href={`/courses/${slug}`}>
            <Button>Xem giới thiệu khóa học</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">Về Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      
      {/* Top Banner Navbar */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-slate-400 hover:text-slate-650 shrink-0">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-base md:text-lg font-bold text-slate-900 line-clamp-1">{course?.title}</h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{course?.category}</p>
          </div>
        </div>

        {/* Course progress statistics header */}
        <div className="flex items-center gap-4 shrink-0 min-w-[200px] md:min-w-[250px]">
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-[10px] text-slate-500 font-bold">
              <span>ĐÃ HOÀN THÀNH:</span>
              <span className="text-indigo-600">{progressPercentage}% ({completedLessons.length}/{totalLessons} bài)</span>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-slate-100" />
          </div>
          {user?.role === 'admin' && (
            <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px]">ADMIN VIEW</Badge>
          )}
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 overflow-hidden">
        
        {/* Left Column (3/4 width): Video and Lesson tabs */}
        <div className="lg:col-span-3 p-4 md:p-6 overflow-y-auto space-y-6">
          
          {activeLesson ? (
            <div className="space-y-6">
              {/* Video Player Card */}
              <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-lg aspect-video border border-slate-800 relative group">
                {activeLesson.videoUrl ? (
                  <iframe
                    src={activeLesson.videoUrl.includes('youtube.com/embed') 
                      ? activeLesson.videoUrl 
                      : `https://www.youtube.com/embed/${activeLesson.videoUrl.split('v=')[1] || activeLesson.videoUrl}`}
                    title={activeLesson.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                    <svg className="h-12 w-12 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">Video bài học đang được cập nhật</p>
                  </div>
                )}
              </div>

              {/* Lesson Title and Completion Action Panel */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="space-y-1">
                  <h2 className="text-base md:text-lg font-bold text-slate-900">{activeLesson.title}</h2>
                  <p className="text-xs text-slate-400">Thời lượng bài giảng: {activeLesson.duration}</p>
                </div>

                {user?.role !== 'admin' && (
                  <Button
                    onClick={handleToggleComplete}
                    variant={completedLessons.includes(activeLesson.id) ? 'outline' : 'primary'}
                    loading={updatingProgress}
                    className={cn(
                      "shadow-sm gap-2 whitespace-nowrap text-xs",
                      completedLessons.includes(activeLesson.id) && "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100/50"
                    )}
                    size="sm"
                  >
                    {completedLessons.includes(activeLesson.id) ? (
                      <>
                        <span className="text-white text-xs">✓</span> Đã học xong (Hủy đánh dấu)
                      </>
                    ) : (
                      'Đánh dấu đã học xong'
                    )}
                  </Button>
                )}
              </div>

              {/* Learning Tab Controller */}
              <div className="space-y-4">
                <div className="border-b border-slate-200 flex gap-2">
                  <button
                    onClick={() => setActiveTab('documents')}
                    className={cn(
                      "px-4 py-2.5 text-xs font-bold border-b-2 -mb-[2px] transition-colors",
                      activeTab === 'documents'
                        ? "border-indigo-600 text-indigo-600 font-extrabold"
                        : "border-transparent text-slate-400 hover:text-slate-650"
                    )}
                  >
                    📂 Tài liệu học tập
                  </button>
                  <button
                    onClick={() => setActiveTab('summary')}
                    className={cn(
                      "px-4 py-2.5 text-xs font-bold border-b-2 -mb-[2px] transition-colors",
                      activeTab === 'summary'
                        ? "border-indigo-600 text-indigo-600 font-extrabold"
                        : "border-transparent text-slate-400 hover:text-slate-650"
                    )}
                  >
                    📝 Lý thuyết & Tóm tắt
                  </button>
                </div>

                {/* Tab contents panel */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs min-h-[180px]">
                  
                  {activeTab === 'documents' && (
                    <div className="space-y-4">
                      <h3 className="font-bold text-xs text-slate-800">Tải về hoặc xem tài liệu trực tiếp:</h3>
                      {activeLesson.documentUrl ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <a
                            href={activeLesson.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3.5 rounded-lg border border-indigo-100 bg-indigo-50/10 hover:bg-indigo-50/30 transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-indigo-500 rounded text-white group-hover:scale-105 transition-transform text-sm font-bold">
                                PDF
                              </div>
                              <div className="text-left">
                                <p className="font-bold text-slate-800 text-xs">Tài liệu & Bài tập tự luyện</p>
                                <p className="text-[10px] text-slate-400 leading-normal">Xem tài liệu đi kèm với bài giảng</p>
                              </div>
                            </div>
                            <svg className="h-4 w-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </a>
                        </div>
                      ) : (
                        <p className="text-slate-450 italic text-xs">Không có tài liệu PDF đi kèm cho bài học này.</p>
                      )}
                    </div>
                  )}

                  {activeTab === 'summary' && (
                    <div className="space-y-3">
                      <h3 className="font-bold text-xs text-slate-800">Tóm tắt nội dung lý thuyết chính:</h3>
                      {activeLesson.textContent ? (
                        <p className="text-xs leading-relaxed text-slate-655 whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-150">
                          {activeLesson.textContent}
                        </p>
                      ) : (
                        <p className="text-slate-450 italic text-xs">Nội dung tóm tắt bài giảng đang được giáo viên cập nhật.</p>
                      )}
                    </div>
                  )}

                </div>
              </div>

            </div>
          ) : (
            // Select lesson fallback
            <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-3">
              <div className="p-4 bg-indigo-50 rounded-full text-indigo-500">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-bold text-base text-slate-800">Bắt đầu học tập</h3>
              <p className="text-xs text-slate-500 max-w-sm">Chọn một bài học bất kỳ từ thực đơn bên phải để bắt đầu theo dõi bài giảng.</p>
            </div>
          )}

        </div>

        {/* Right Column (1/4 width): Chapter / Lesson Syllabus list Navigation */}
        <div className="bg-white border-t lg:border-t-0 lg:border-l border-slate-200 overflow-y-auto max-h-[500px] lg:max-h-none flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 shrink-0">
            <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">Chương trình học tập</h3>
            <p className="text-[10px] text-slate-400 pt-0.5 font-medium">
              Chương: <b>{course?.chapters?.length || 0}</b> • Bài giảng: <b>{totalLessons}</b>
            </p>
          </div>

          <div className="flex-1 divide-y divide-slate-100">
            {course?.chapters?.map((chapter: any, index: number) => {
              const isExpanded = expandedChapters[chapter.id];
              return (
                <div key={chapter.id} className="flex flex-col">
                  {/* Chapter title header */}
                  <button
                    onClick={() => toggleChapter(chapter.id)}
                    className="w-full flex items-center justify-between px-4 py-3.5 bg-slate-50/40 hover:bg-slate-50 transition-colors text-left"
                  >
                    <span className="font-bold text-xs text-slate-800 line-clamp-2">
                      Chương {index + 1}: {chapter.title}
                    </span>
                    <span className="text-slate-400 shrink-0 ml-2">
                      {isExpanded ? (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </span>
                  </button>

                  {/* Chapter lessons list body */}
                  {isExpanded && (
                    <div className="bg-white divide-y divide-slate-50">
                      {chapter.lessons?.map((lesson: any) => {
                        const isCurrentActive = activeLesson?.id === lesson.id;
                        const isCompleted = completedLessons.includes(lesson.id);
                        
                        return (
                          <div
                            key={lesson.id}
                            onClick={() => setActiveLesson(lesson)}
                            className={cn(
                              "flex items-start gap-2.5 px-4 py-3 hover:bg-slate-50/60 transition-colors cursor-pointer select-none border-l-2",
                              isCurrentActive 
                                ? "border-indigo-600 bg-indigo-50/10 font-bold" 
                                : "border-transparent"
                            )}
                          >
                            {/* Complete icon checkbox */}
                            <div className="shrink-0 mt-0.5">
                              {isCompleted ? (
                                <div className="h-4 w-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold">
                                  ✓
                                </div>
                              ) : isCurrentActive ? (
                                <div className="h-4 w-4 rounded-full border border-indigo-600 text-indigo-600 flex items-center justify-center">
                                  <div className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                                </div>
                              ) : (
                                <div className="h-4 w-4 rounded-full border border-slate-300" />
                              )}
                            </div>

                            {/* Lesson text details */}
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                "text-xs leading-snug line-clamp-2",
                                isCurrentActive ? "text-indigo-600 font-bold" : "text-slate-700"
                              )}>
                                {lesson.title}
                              </p>
                              <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-400 font-semibold">
                                <span>⏱ {lesson.duration}</span>
                                {lesson.isPreview && (
                                  <>
                                    <span>•</span>
                                    <span className="text-emerald-600">Học thử</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
