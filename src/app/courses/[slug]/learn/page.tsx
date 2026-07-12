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
  // Helper to parse multiple document URLs from activeLesson.documentUrl
  const documentUrls = useMemo(() => {
    if (!activeLesson?.documentUrl) return [];
    // Extract all valid http/https URLs from the string
    return activeLesson.documentUrl.match(/https?:\/\/[^\s,;\|\n\r]+/g) || [activeLesson.documentUrl];
  }, [activeLesson]);
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
              {/* Widescreen Video Player Card / Flipbook Reader */}
              {(course?.productType === 'book' || course?.productType === 'ebook' || course?.productType === 'tailieu') ? (
                <FlipbookPlayer
                  bookId={course.id}
                  documentKey={activeLesson.documentUrl || 'amc8_2025'}
                  totalPages={160}
                  user={user}
                />
              ) : (
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
              )}

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

                            {/* Document files list directly */}
              {(course?.productType !== 'book' && course?.productType !== 'ebook' && course?.productType !== 'tailieu') && (
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="text-base">📂</span>
                    <h3 className="font-bold text-xs text-slate-800">Tài liệu học tập đi kèm bài giảng</h3>
                  </div>
                  {documentUrls.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {documentUrls.map((url: string, index: number) => (
                        <a
                          key={url + index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3.5 rounded-lg border border-indigo-100 bg-indigo-50/10 hover:bg-indigo-50/30 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500 rounded text-white group-hover:scale-105 transition-transform text-sm font-bold">
                              PDF
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-slate-800 text-xs">
                                Tài liệu học tập {documentUrls.length > 1 ? index + 1 : ''}
                              </p>
                              <p className="text-[10px] text-slate-400 leading-normal">Xem hoặc tải về tài liệu bài học</p>
                            </div>
                          </div>
                          <svg className="h-4 w-4 text-indigo-550" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic text-xs">Không có tài liệu PDF đi kèm cho bài học này.</p>
                  )}
                </div>
              </div>
              )}

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

interface FlipbookPlayerProps {
  bookId: string;
  documentKey: string;
  totalPages: number;
  user: any;
}

function FlipbookPlayer({ bookId, documentKey, totalPages, user }: FlipbookPlayerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfjsLoaded, setPdfjsLoaded] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [zoomScale, setZoomScale] = useState(1.5);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [jumpPageInput, setJumpPageInput] = useState('1');

  const leftCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const rightCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const readerContainerRef = React.useRef<HTMLDivElement | null>(null);

  // 1. Script injection for PDF.js CDN
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkPdfjs = () => {
      if ((window as any).pdfjsLib) {
        setPdfjsLoaded(true);
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        return true;
      }
      return false;
    };

    if (checkPdfjs()) return;

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.async = true;
    script.onload = () => {
      checkPdfjs();
    };
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  // 2. Block keyboard copy/save shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 's' || e.key === 'p' || e.key === 'u' || e.key === 'a')) ||
        e.key === 'F12'
      ) {
        e.preventDefault();
        alert('Tài liệu ebook đã được bảo mật bản quyền. Không được phép sao chép hoặc tải về.');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 3. Render page logic
  const renderPage = async (pageNo: number, canvas: HTMLCanvasElement) => {
    if (!canvas || !user) return;
    try {
      const res = await fetch(`/api/books/page?userId=${user.id}&bookId=${bookId}&pageIndex=${pageNo}`);
      if (!res.ok) {
        throw new Error('Failed to load page PDF');
      }
      const bytes = await res.arrayBuffer();
      const pdfjsLib = (window as any).pdfjsLib;
      if (!pdfjsLib) return;

      const loadingTask = pdfjsLib.getDocument({ data: bytes });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1); // Single page PDF has exactly 1 page

      const viewport = page.getViewport({ scale: zoomScale });
      const context = canvas.getContext('2d');
      if (!context) return;

      // Adjust high DPI screens
      const ratio = window.devicePixelRatio || 1;
      canvas.width = viewport.width * ratio;
      canvas.height = viewport.height * ratio;
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      context.scale(ratio, ratio);

      // Render onto canvas
      await page.render({
        canvasContext: context,
        viewport
      }).promise;

      // Draw custom tiled watermark text
      const watermarkText = `${user.name} - ${user.phone || 'HMath'} - ${user.email}`;
      context.save();
      context.font = 'bold 13px Arial, sans-serif';
      context.fillStyle = 'rgba(148, 163, 184, 0.16)';
      context.textAlign = 'center';
      context.translate(viewport.width / 2, viewport.height / 2);
      context.rotate(-Math.PI / 6); // -30 degrees rotation

      for (let y = -4; y <= 4; y++) {
        for (let x = -3; x <= 3; x++) {
          context.fillText(watermarkText, x * 260, y * 90);
        }
      }
      context.restore();
    } catch (err) {
      console.error(`Error rendering page ${pageNo}:`, err);
    }
  };

  // Trigger render when states change
  useEffect(() => {
    if (!pdfjsLoaded || !user) return;

    let active = true;

    const render = async () => {
      setPageLoading(true);
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const showDual = !isMobile && currentPage > 1;

      if (leftCanvasRef.current) {
        await renderPage(currentPage, leftCanvasRef.current);
      }

      if (rightCanvasRef.current) {
        const nextP = currentPage + 1;
        if (showDual && nextP <= totalPages) {
          await renderPage(nextP, rightCanvasRef.current);
        } else {
          // Clear right canvas
          const context = rightCanvasRef.current.getContext('2d');
          if (context) {
            context.clearRect(0, 0, rightCanvasRef.current.width, rightCanvasRef.current.height);
          }
          rightCanvasRef.current.width = 0;
          rightCanvasRef.current.height = 0;
          rightCanvasRef.current.style.width = '0px';
          rightCanvasRef.current.style.height = '0px';
        }
      }

      if (active) {
        setPageLoading(false);
      }
    };

    render();

    return () => {
      active = false;
    };
  }, [currentPage, zoomScale, pdfjsLoaded, user]);

  const handleNext = () => {
    const isMobile = window.innerWidth < 768;
    const step = isMobile ? 1 : (currentPage === 1 ? 1 : 2);
    const nextPage = currentPage + step;
    if (nextPage <= totalPages) {
      setCurrentPage(nextPage);
      setJumpPageInput(nextPage.toString());
    }
  };

  const handlePrev = () => {
    const isMobile = window.innerWidth < 768;
    if (currentPage === 1) return;
    
    let prevPage;
    if (isMobile) {
      prevPage = currentPage - 1;
    } else {
      prevPage = currentPage === 2 ? 1 : currentPage - 2;
    }
    
    if (prevPage >= 1) {
      setCurrentPage(prevPage);
      setJumpPageInput(prevPage.toString());
    }
  };

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(jumpPageInput);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      // Align to odd/even page boundary if dual page view is active
      const isMobile = window.innerWidth < 768;
      if (!isMobile && p > 1 && p % 2 !== 0) {
        setCurrentPage(p - 1);
        setJumpPageInput((p - 1).toString());
      } else {
        setCurrentPage(p);
      }
    }
  };

  const toggleFullscreen = () => {
    const container = readerContainerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isDualView = !isMobile && currentPage > 1;

  return (
    <div 
      ref={readerContainerRef}
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden min-h-[640px] shadow-2xl relative select-none w-full"
    >
      {/* Top control bar */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap justify-between items-center gap-3 z-35 text-white">
        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-650 text-white hover:bg-indigo-650 text-[10px] uppercase font-bold py-0.5 px-2 border-0">
            Ebook lật
          </Badge>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Tài liệu bảo mật cao chống sao chép
          </span>
        </div>

        {/* Page selector navigation */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrev}
            disabled={currentPage === 1 || pageLoading}
            className="h-8 text-xs border-slate-700 bg-slate-900 text-slate-350 hover:bg-slate-800 hover:text-white"
          >
            ◀ Trang trước
          </Button>

          <form onSubmit={handleJump} className="flex items-center gap-1">
            <input
              type="text"
              value={jumpPageInput}
              onChange={(e) => setJumpPageInput(e.target.value)}
              className="w-10 h-8 bg-slate-900 border border-slate-700 text-white rounded text-center text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
            />
            <span className="text-slate-400 text-xs font-semibold">/ {totalPages}</span>
          </form>

          <Button
            size="sm"
            variant="outline"
            onClick={handleNext}
            disabled={(isDualView ? currentPage + 1 >= totalPages : currentPage >= totalPages) || pageLoading}
            className="h-8 text-xs border-slate-700 bg-slate-900 text-slate-350 hover:bg-slate-800 hover:text-white"
          >
            Trang sau ▶
          </Button>
        </div>

        {/* Zoom & Fullscreen buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomScale((z) => Math.max(z - 0.25, 0.75))}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-350 hover:text-white text-xs font-bold w-8 h-8 flex items-center justify-center cursor-pointer"
            title="Thu nhỏ"
          >
            A-
          </button>
          <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">{Math.round(zoomScale * 100)}%</span>
          <button
            onClick={() => setZoomScale((z) => Math.min(z + 0.25, 2.5))}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-350 hover:text-white text-xs font-bold w-8 h-8 flex items-center justify-center cursor-pointer"
            title="Phóng to"
          >
            A+
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-350 hover:text-white text-xs w-8 h-8 flex items-center justify-center cursor-pointer"
            title="Toàn màn hình"
          >
            {isFullscreen ? '⏹' : '📺'}
          </button>
        </div>
      </div>

      {/* Book pages canvas canvas container */}
      <div className="flex-1 flex justify-center items-center p-6 bg-slate-950 relative overflow-auto min-h-[500px]">
        {pageLoading && (
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs flex justify-center items-center z-30">
            <div className="flex flex-col items-center gap-3">
              <div className="h-7 w-7 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-[11px] text-slate-450 font-bold animate-pulse">Đang tải trang sách bảo mật...</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 shadow-2xl relative select-none rounded-xl overflow-hidden bg-slate-900 max-w-full">
          {/* Left page Canvas */}
          <div className="relative bg-white border border-slate-800 shadow-lg min-w-0">
            <canvas ref={leftCanvasRef} className="block max-w-full h-auto" />
            <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none select-none bg-transparent z-15" />
          </div>

          {/* Realistic Center Book Divider Line (Only visible on dual view) */}
          {isDualView && (
            <div className="absolute top-0 bottom-0 left-1/2 w-[4px] -translate-x-1/2 bg-gradient-to-r from-black/45 via-black/15 to-black/45 shadow-inner z-25 pointer-events-none" />
          )}

          {/* Right page Canvas (Only visible on dual view) */}
          {isDualView && (
            <div className="relative bg-white border border-slate-800 shadow-lg min-w-0">
              <canvas ref={rightCanvasRef} className="block max-w-full h-auto" />
              <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none select-none bg-transparent z-15" />
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom status bar */}
      <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-bold z-20">
        <span>BẢN QUYỀN THUỘC HMATH COURSE</span>
        <span>TRANG {currentPage} {isDualView && ` - ${currentPage + 1}`} / {totalPages}</span>
      </div>
    </div>
  );
}