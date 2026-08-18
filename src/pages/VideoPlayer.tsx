import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, doc, getDoc } from '../firebase';
import { DEFAULT_COURSES } from '../data/coursesData';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PlayCircle, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X, 
  BookOpen, 
  MessageSquare, 
  FileText, 
  Star,
  Download,
  Maximize,
  Volume2,
  Settings,
  Share2,
  ExternalLink,
  FileCode,
  Circle
} from 'lucide-react';
import { toast } from 'sonner';

function getYouTubeEmbedUrl(url?: string) {
  if (!url) return '';
  if (url.includes('/embed/')) return url;
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
  }
  if (url.includes('watch?v=')) {
    const id = url.split('watch?v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
  }
  if (url.includes('playlist?list=')) {
    const listId = url.split('list=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/videoseries?list=${listId}`;
  }
  return url;
}

export default function VideoPlayer({ user, userData }: { user: any, userData: any }) {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeLecture, setActiveLecture] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [progress, setProgress] = useState<any>({ completedLectures: [], progressPercentage: 0 });

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;
      
      try {
        // Find in DEFAULT_COURSES as initial state
        const localCourse = DEFAULT_COURSES.find(c => 
          c.id === courseId || 
          courseId.includes(c.id) || 
          c.id.includes(courseId) ||
          c.title.toLowerCase().includes(courseId.toLowerCase())
        );

        let activeData = localCourse || null;

        // Fetch course content via API
        try {
          const response = await fetch(`/api/courses/${courseId}/content?userId=${user?.uid || 'guest'}`);
          if (response.ok) {
            const data = await response.json();
            activeData = { id: courseId, ...localCourse, ...data };
          }
        } catch (e) {
          console.warn("API course content fetch:", e);
        }

        if (!activeData && localCourse) {
          activeData = localCourse;
        }

        if (activeData) {
          setCourse(activeData);
          if (activeData.sections?.length > 0 && activeData.sections[0].lectures?.length > 0) {
            setActiveLecture(activeData.sections[0].lectures[0]);
          }
        }

        // Fetch progress via API
        if (user?.uid) {
          try {
            const progressResponse = await fetch(`/api/progress/${courseId}?userId=${user.uid}`);
            if (progressResponse.ok) {
              const progressData = await progressResponse.json();
              setProgress(progressData);
            }
          } catch (e) {
            console.warn("Progress fetch fallback:", e);
          }
        }
      } catch (error: any) {
        console.error("VideoPlayer fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId, user?.uid]);

  const handleMarkAsComplete = async (lectureId: string) => {
    if (!user?.uid || !courseId) return;

    try {
      const response = await fetch('/api/lecture/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, courseId, lectureId }),
      });

      if (response.ok) {
        const data = await response.json();
        setProgress({
          completedLectures: data.completedLectures,
          progressPercentage: data.progressPercentage
        });
        toast.success('Lecture marked as complete!');
        
        // Automatically move to next lecture
        handleNextLecture();
      }
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  const handleNextLecture = () => {
    if (!course || !activeLecture) return;
    
    let found = false;
    for (let s = 0; s < course.sections.length; s++) {
      const section = course.sections[s];
      for (let l = 0; l < section.lectures.length; l++) {
        if (found) {
          setActiveLecture(section.lectures[l]);
          return;
        }
        if (section.lectures[l].id === activeLecture.id) {
          found = true;
        }
      }
    }
    
    if (found) {
      toast.info('You have reached the end of the course!');
    }
  };

  const handlePrevLecture = () => {
    if (!course || !activeLecture) return;
    
    let prevLecture = null;
    for (let s = 0; s < course.sections.length; s++) {
      const section = course.sections[s];
      for (let l = 0; l < section.lectures.length; l++) {
        if (section.lectures[l].id === activeLecture.id) {
          if (prevLecture) {
            setActiveLecture(prevLecture);
            return;
          }
        }
        prevLecture = section.lectures[l];
      }
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-900"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  const isLectureCompleted = (lectureId: string) => progress.completedLectures?.includes(lectureId);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-900 overflow-hidden">
      {/* Top Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex justify-between items-center shrink-0 z-20">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-white font-bold text-sm truncate max-w-md">{course.title}</h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-4">
            <div className="w-48 bg-gray-700 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-green-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${progress.progressPercentage}%` }} 
              />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {Math.round(progress.progressPercentage)}% Complete
            </span>
          </div>
          <button className="text-gray-400 hover:text-white transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-grow overflow-hidden relative">
        {/* Content Area */}
        <div className="flex-grow flex flex-col bg-black relative overflow-hidden">
          <div className="flex-grow flex items-center justify-center relative group">
            {/* Background Placeholder */}
            <img 
              src={`https://picsum.photos/seed/${courseId}/1920/1080?blur=10`} 
              className="w-full h-full object-cover opacity-20 absolute inset-0" 
              alt="" 
            />
            
            <div className="relative z-10 text-center max-w-2xl px-6">
              <div className="bg-blue-600/20 backdrop-blur-xl p-8 rounded-full mb-8 inline-block border border-blue-500/30">
                {activeLecture?.type === 'pdf' ? (
                  <FileText className="w-20 h-20 text-blue-500" />
                ) : (
                  <PlayCircle className="w-20 h-20 text-blue-500" />
                )}
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">{activeLecture?.title}</h2>
              <p className="text-gray-400 mb-8">
                {activeLecture?.externalLink ? (
                  `This lecture is hosted externally. Click the button below to access the material.`
                ) : (
                  `Select a lecture from the sidebar to begin learning.`
                )}
              </p>
              
              {activeLecture?.externalLink && (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  {activeLecture.externalLink.includes('youtube.com') || activeLecture.externalLink.includes('youtu.be') ? (
                    <div className="w-full flex flex-col items-center">
                      <div className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                        <iframe 
                          src={getYouTubeEmbedUrl(activeLecture.externalLink)}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={activeLecture.title}
                        />
                      </div>
                      
                      <div className="w-full max-w-5xl flex flex-wrap items-center justify-between mt-6 px-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-semibold text-gray-300">Day Lecture:</span>
                          <span className="text-sm font-bold text-white bg-gray-800 px-3 py-1 rounded-lg border border-gray-700">{activeLecture.title}</span>
                        </div>

                        <div className="flex items-center space-x-4">
                          <a
                            href={activeLecture.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-gray-400 hover:text-white flex items-center bg-gray-800 hover:bg-gray-700 px-4 py-2.5 rounded-xl border border-gray-700 transition-colors"
                          >
                            Watch on YouTube <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                          </a>

                          {!isLectureCompleted(activeLecture.id) ? (
                            <button
                              onClick={() => handleMarkAsComplete(activeLecture.id)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center shadow-lg shadow-emerald-950/40 transition-all"
                            >
                              Mark as Completed <CheckCircle className="ml-1.5 w-4 h-4" />
                            </button>
                          ) : (
                            <span className="bg-emerald-900/40 text-emerald-400 border border-emerald-600/30 text-xs font-bold px-4 py-2 rounded-xl flex items-center">
                              Completed <CheckCircle className="ml-1.5 w-4 h-4" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center max-w-2xl px-6">
                      <div className="bg-blue-600/20 backdrop-blur-xl p-8 rounded-full mb-8 inline-block border border-blue-500/30">
                        {activeLecture?.type === 'pdf' ? (
                          <FileText className="w-20 h-20 text-blue-500" />
                        ) : (
                          <PlayCircle className="w-20 h-20 text-blue-500" />
                        )}
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-4">{activeLecture?.title}</h2>
                      <p className="text-gray-400 mb-8">
                        This material is hosted externally. Click the button below to access it.
                      </p>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a 
                          href={activeLecture.externalLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold flex items-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
                        >
                          Open Resource <ExternalLink className="ml-2 w-5 h-5" />
                        </a>
                        
                        {!isLectureCompleted(activeLecture.id) && (
                          <button 
                            onClick={() => handleMarkAsComplete(activeLecture.id)}
                            className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold flex items-center hover:bg-green-700 transition-all shadow-lg shadow-green-900/20"
                          >
                            Mark as Completed <CheckCircle className="ml-2 w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons - Always visible when a lecture is selected */}
              {activeLecture && (
                <div className="flex items-center justify-center space-x-6 mt-8 mb-12 relative z-10">
                  <button 
                    onClick={handlePrevLecture}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group"
                  >
                    <div className="bg-gray-800 p-3 rounded-full group-hover:bg-gray-700">
                      <ChevronLeft className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold">Previous</span>
                  </button>
                  
                  <button 
                    onClick={handleNextLecture}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group"
                  >
                    <span className="text-sm font-bold">Next</span>
                    <div className="bg-gray-800 p-3 rounded-full group-hover:bg-gray-700">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Simple Controls Overlay for visual effect */}
            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <PlayCircle className="w-8 h-8 text-white cursor-pointer" />
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-5 h-5 text-white" />
                    <div className="w-20 bg-white/20 h-1 rounded-full">
                      <div className="bg-white h-full w-3/4 rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <Settings className="w-5 h-5 text-white cursor-pointer" />
                  <Maximize className="w-5 h-5 text-white cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          {/* Lecture Info Tabs */}
          <div className="bg-gray-800 border-t border-gray-700 shrink-0">
            <div className="flex border-b border-gray-700">
              {['Overview', 'Resources', 'Notes'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${
                    activeTab === tab.toLowerCase() ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="p-8 h-48 overflow-y-auto text-gray-300">
              {activeTab === 'overview' && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">About this lecture</h3>
                  <p className="text-sm leading-relaxed">
                    {activeLecture?.description || `In this lecture, we will cover the fundamental concepts of ${activeLecture?.title}. We'll dive deep into the practical implementation and best practices.`}
                  </p>
                </div>
              )}
              {activeTab === 'resources' && (
                <div className="space-y-4">
                  {activeLecture?.externalLink && (
                    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-xl border border-gray-700">
                      <div className="flex items-center space-x-4">
                        <ExternalLink className="w-5 h-5 text-blue-500" />
                        <span className="text-sm">Lecture Resource: {activeLecture.title}</span>
                      </div>
                      <a 
                        href={activeLecture.externalLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-blue-500 hover:underline"
                      >
                        Visit Link
                      </a>
                    </div>
                  )}
                  {course.resources?.map((res: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-900 rounded-xl border border-gray-700">
                      <div className="flex items-center space-x-4">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <span className="text-sm">{res.title}</span>
                      </div>
                      <a 
                        href={res.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-blue-500 hover:underline"
                      >
                        Open
                      </a>
                    </div>
                  ))}
                  {(!activeLecture?.externalLink && (!course.resources || course.resources.length === 0)) && (
                    <p className="text-center text-gray-500 text-sm py-8 italic">No additional resources available for this lecture.</p>
                  )}
                </div>
              )}
              {activeTab === 'notes' && (
                <div className="flex flex-col h-full">
                  <textarea 
                    placeholder="Take a note..." 
                    className="flex-grow bg-gray-900 border border-gray-700 rounded-xl p-4 text-sm focus:ring-1 focus:ring-blue-500 outline-none resize-none mb-4"
                  />
                  <div className="flex justify-end">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all">Save Note</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Curriculum */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="w-96 bg-gray-800 border-l border-gray-700 flex flex-col shrink-0 z-10"
            >
              <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-white font-bold">Course Content</h2>
                <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-grow overflow-y-auto">
                {course.sections?.map((section: any, sIdx: number) => (
                  <div key={sIdx}>
                    <div className="bg-gray-900/50 px-6 py-4 border-b border-gray-700 flex flex-col">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest truncate mb-1">
                        Section {sIdx + 1}: {section.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-500">{section.lectures?.length} lectures</span>
                        <span className="text-[10px] text-gray-500">
                          {section.lectures?.filter((l: any) => isLectureCompleted(l.id)).length} / {section.lectures?.length} completed
                        </span>
                      </div>
                    </div>
                    <div>
                      {section.lectures?.map((lecture: any, lIdx: number) => (
                        <div
                          key={lecture.id || lIdx}
                          className={`w-full flex items-start space-x-4 px-6 py-4 hover:bg-gray-700/50 transition-colors border-b border-gray-700/50 text-left ${
                            activeLecture?.id === lecture.id ? 'bg-blue-600/10 border-l-4 border-l-blue-500' : ''
                          }`}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsComplete(lecture.id);
                            }}
                            title="Toggle completed"
                            className="mt-1 shrink-0 hover:scale-110 transition-transform"
                          >
                            {isLectureCompleted(lecture.id) ? (
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4 text-gray-500 hover:text-gray-300" />
                            )}
                          </button>
                          <button 
                            onClick={() => setActiveLecture(lecture)}
                            className="flex-grow min-w-0 text-left"
                          >
                            <p className={`text-sm font-medium line-clamp-2 ${activeLecture?.id === lecture.id ? 'text-blue-400 font-bold' : 'text-gray-300'}`}>
                              {lIdx + 1}. {lecture.title}
                            </p>
                            <div className="flex items-center space-x-3 mt-1">
                              <div className="flex items-center space-x-1">
                                {lecture.type === 'pdf' ? (
                                  <FileText className="w-3 h-3 text-gray-500" />
                                ) : (
                                  <PlayCircle className="w-3 h-3 text-gray-500" />
                                )}
                                <span className="text-[10px] text-gray-500 font-bold">
                                  {lecture.duration ? `${lecture.duration}m` : 'Link'}
                                </span>
                              </div>
                              {lecture.isPreview && (
                                <span className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter">Preview</span>
                              )}
                            </div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="absolute right-6 top-6 bg-blue-600 text-white p-3 rounded-full shadow-xl z-50 hover:bg-blue-700 transition-all"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}
