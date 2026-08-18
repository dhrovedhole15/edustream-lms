import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db, doc, getDoc, collection, query, where, getDocs } from '../firebase';
import { DEFAULT_COURSES } from '../data/coursesData';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  Clock, 
  BookOpen, 
  ChevronRight, 
  PlayCircle, 
  CheckCircle, 
  Globe, 
  Award,
  Users,
  Calendar,
  Share2,
  Heart,
  ShieldCheck,
  Lock,
  ArrowRight,
  PlusCircle,
  ExternalLink,
  FileText,
  X
} from 'lucide-react';
import { toast } from 'sonner';

function getEmbedUrl(url?: string) {
  if (!url) return '';
  if (url.includes('/embed/')) return url;
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
  }
  if (url.includes('watch?v=')) {
    const id = url.split('watch?v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
  }
  if (url.includes('playlist?list=')) {
    const listId = url.split('list=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/videoseries?list=${listId}&autoplay=1`;
  }
  return url;
}

export default function CourseDetails({ user, userData }: { user: any, userData: any }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Initialize immediately from DEFAULT_COURSES if matching
  const initialMatch = DEFAULT_COURSES.find(c => 
    c.id === id || 
    c.id.toLowerCase() === (id || '').toLowerCase() ||
    c.title.toLowerCase().includes((id || '').toLowerCase())
  );
  
  const [course, setCourse] = useState<any>(initialMatch || null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(!initialMatch);
  const [activeTab, setActiveTab] = useState('overview');
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) return;
      
      try {
        // 1. Check local match first
        const found = DEFAULT_COURSES.find(c => 
          c.id === id || 
          c.id.toLowerCase() === id.toLowerCase() ||
          c.title.toLowerCase().includes(id.toLowerCase())
        );
        if (found) {
          setCourse(found);
          setLoading(false);
        }

        // 2. Fetch from API or Firestore in background
        try {
          const res = await fetch(`/api/courses/${id}`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.title) {
              setCourse((prev: any) => ({ ...(prev || {}), ...data }));
              setLoading(false);
            }
          }
        } catch (e) {
          // ignore background fetch error
        }

        // 3. Silently fetch reviews
        try {
          const reviewsQuery = query(collection(db, 'reviews'), where('courseId', '==', id));
          const reviewsSnapshot = await getDocs(reviewsQuery);
          if (!reviewsSnapshot.empty) {
            setReviews(reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          }
        } catch (e) {
          // Ignore review permission/network warning
        }

      } catch (error: any) {
        console.warn("Course detail load note:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  const isEnrolled = (userData?.enrolledCourses || []).includes(id) || 
                     (userData?.enrolledCourses || []).includes(course?.id);

  const handleFreeEnrollment = async () => {
    if (!user) {
      toast.info('Please log in with Google to enroll in this course');
      navigate('/login');
      return;
    }

    const targetCourseId = course?.id || id;

    try {
      const response = await fetch('/api/enroll/free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: targetCourseId, userId: user.uid })
      });

      if (response.ok) {
        toast.success('Successfully enrolled!');
        navigate(`/learn/${targetCourseId}`);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Enrollment failed');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const openPreview = (videoUrl?: string) => {
    const urlToUse = videoUrl || 
      course?.previewVideoUrl || 
      course?.playlistUrl || 
      (course?.sections?.[0]?.lectures?.[0]?.videoUrl) ||
      'https://www.youtube.com/watch?v=4Ib9amXl4gI';
    setPreviewVideoUrl(getEmbedUrl(urlToUse));
  };

  if (loading && !course) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
        <p className="text-gray-500 mb-6">The requested course could not be located.</p>
        <Link to="/courses" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold">
          Explore Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Header */}
      <div className="bg-gray-900 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 text-blue-400 text-sm font-bold uppercase tracking-wider mb-6">
                <Link to="/courses" className="hover:underline">Courses</Link>
                <ChevronRight className="w-4 h-4" />
                <span>{course.category}</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">{course.title}</h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">{course.description.substring(0, 200)}...</p>
              
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-lg font-bold">{course.rating || '4.8'}</span>
                  <span className="text-gray-400 text-sm">({course.reviewsCount || '1.2k'} ratings)</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Users className="w-5 h-5" />
                  <span className="text-sm">15,432 students</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Globe className="w-5 h-5" />
                  <span className="text-sm">English, Spanish</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <p className="text-sm text-gray-400">Created by <span className="text-blue-400 font-bold hover:underline cursor-pointer">{course.instructorName}</span></p>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Last updated 03/2026</span>
                </div>
              </div>
            </div>

            {/* Sidebar Card */}
            <div className="lg:col-span-1 sticky top-24">
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 text-gray-900">
                <div 
                  onClick={() => openPreview()}
                  className="relative group cursor-pointer"
                >
                  <img src={course.thumbnail} alt={course.title} className="w-full aspect-video object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-16 h-16 text-white drop-shadow-md" />
                  </div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-bold shadow-lg hover:bg-white transition-colors">
                    Preview this course
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    {course.price === 0 ? (
                      <div className="flex items-baseline space-x-2">
                        <span className="text-4xl font-extrabold text-emerald-600">FREE</span>
                        <span className="text-gray-400 text-sm font-medium">Full Access</span>
                      </div>
                    ) : (
                      <div className="flex items-baseline space-x-2">
                        <span className="text-4xl font-bold">${course.price}</span>
                        <span className="text-gray-400 line-through">$199.99</span>
                      </div>
                    )}
                    {course.price === 0 ? (
                      <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                        100% Free
                      </div>
                    ) : (
                      <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold">
                        85% OFF
                      </div>
                    )}
                  </div>

                  {isEnrolled ? (
                    <Link to={`/learn/${course.id}`} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center mb-4">
                      Go to Course <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  ) : course.price === 0 ? (
                    <button 
                      onClick={handleFreeEnrollment}
                      className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center mb-4"
                    >
                      Enroll for Free <PlusCircle className="ml-2 w-5 h-5" />
                    </button>
                  ) : (
                    <>
                      <Link to={`/checkout/${course.id}`} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center mb-4">
                        Enroll Now
                      </Link>
                      <button className="w-full bg-white text-gray-900 border border-gray-200 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center mb-6">
                        Add to Cart
                      </button>
                    </>
                  )}

                  <p className="text-center text-xs text-gray-400 mb-8">
                    {course.price === 0 ? 'Instant free enrollment • No credit card needed' : '30-Day Money-Back Guarantee'}
                  </p>

                  <div className="space-y-4">
                    <p className="text-sm font-bold text-gray-900">This course includes:</p>
                    <ul className="space-y-3">
                      <li className="flex items-center text-sm text-gray-600">
                        <PlayCircle className="w-4 h-4 mr-3 text-gray-400" /> Complete 30-Day Video Series
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <BookOpen className="w-4 h-4 mr-3 text-gray-400" /> Digital PDF Notes & Cheat Sheet
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <Lock className="w-4 h-4 mr-3 text-gray-400" /> Full lifetime access
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <Award className="w-4 h-4 mr-3 text-gray-400" /> Certificate of completion
                      </li>
                      {course.playlistUrl && (
                        <li className="flex items-center text-sm text-blue-600">
                          <ExternalLink className="w-4 h-4 mr-3 text-blue-500" />
                          <a href={course.playlistUrl} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium">
                            Official YouTube Playlist Source
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="flex items-center justify-center space-x-8 mt-8 pt-8 border-t border-gray-50">
                    <button className="flex items-center text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">
                      <Share2 className="w-4 h-4 mr-2" /> Share
                    </button>
                    <button className="flex items-center text-sm font-bold text-gray-600 hover:text-red-600 transition-colors">
                      <Heart className="w-4 h-4 mr-2" /> Wishlist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="lg:w-2/3">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 mb-12 overflow-x-auto">
            {['overview', 'curriculum', 'resources', 'instructor', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="bg-gray-50 p-8 rounded-3xl mb-12">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">What you'll learn</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600 leading-relaxed">Master the core concepts and advanced techniques of {course.category}.</span>
                      </div>
                    ))}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-6">Description</h3>
                <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed space-y-4">
                  <p>{course.description}</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'curriculum' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">Course Content</h3>
                  <p className="text-sm text-gray-500">
                    {course.sections?.length || course.syllabus?.length || 0} sections • 
                    {(course.sections || course.syllabus)?.reduce((acc: number, s: any) => acc + (s.lectures?.length || 0), 0) || 0} lectures
                  </p>
                </div>
                
                <div className="space-y-4">
                  {(course.sections || course.syllabus)?.map((section: any, idx: number) => (
                    <div key={idx} className="border border-gray-100 rounded-2xl overflow-hidden">
                      <div className="bg-gray-50 p-6 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <PlusCircle className="w-5 h-5 text-gray-400" />
                          <h4 className="font-bold text-gray-900">{section.title}</h4>
                        </div>
                        <span className="text-xs font-medium text-gray-500">{section.lectures?.length} lectures</span>
                      </div>
                      <div className="p-2 space-y-1">
                        {section.lectures?.map((lecture: any, lIdx: number) => (
                          <div key={lIdx} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                            <div className="flex items-center space-x-4">
                              {lecture.externalLink ? (
                                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                              ) : (
                                <PlayCircle className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                              )}
                              <span className="text-sm text-gray-600">{lecture.title}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                              {lecture.isPreview && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openPreview(lecture.videoUrl);
                                  }}
                                  className="text-xs font-bold text-blue-600 hover:underline px-2 py-1 bg-blue-50 rounded"
                                >
                                  Preview
                                </button>
                              )}
                              <span className="text-xs text-gray-400">{lecture.duration ? `${lecture.duration}m` : 'Link'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'resources' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Study Materials & Resources</h3>
                {course.resources && course.resources.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {course.resources.map((resource: any, idx: number) => (
                      <a 
                        key={idx}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-6 bg-white border border-gray-100 rounded-2xl hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50/50 transition-all group"
                      >
                        <div className="bg-blue-50 p-4 rounded-xl mr-6 group-hover:bg-blue-100 transition-colors">
                          <FileText className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">{resource.title}</h4>
                          <p className="text-xs text-gray-500">Click to open resource</p>
                        </div>
                        <ExternalLink className="w-5 h-5 text-gray-300 ml-auto group-hover:text-blue-600 transition-colors" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-500 italic">No resources available for this course yet.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'instructor' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-start space-x-8 mb-8">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructorId}`} 
                    alt={course.instructorName} 
                    className="w-32 h-32 rounded-3xl object-cover border-4 border-gray-50 shadow-lg"
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{course.instructorName}</h3>
                    <p className="text-blue-600 font-bold mb-4">Senior Software Engineer & Educator</p>
                    <div className="flex items-center space-x-6 text-sm font-medium text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-gray-900">4.9 Instructor Rating</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span className="text-gray-900">125,432 Students</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <PlayCircle className="w-4 h-4" />
                        <span className="text-gray-900">12 Courses</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  John is a passionate educator with over 15 years of experience in the software industry. He has worked at top tech companies and has helped thousands of students master complex technologies through his clear and concise teaching style.
                </p>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="grid md:grid-cols-3 gap-12 mb-16">
                  <div className="text-center md:text-left">
                    <p className="text-6xl font-bold text-gray-900 mb-2">{course.rating || '4.8'}</p>
                    <div className="flex justify-center md:justify-start items-center space-x-1 mb-2">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className={`w-5 h-5 ${i <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <p className="text-sm font-bold text-blue-600">Course Rating</p>
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    {[5,4,3,2,1].map(star => (
                      <div key={star} className="flex items-center space-x-4">
                        <div className="flex-grow bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-yellow-400 h-full rounded-full" style={{ width: `${star * 15}%` }} />
                        </div>
                        <div className="flex items-center space-x-2 w-24">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">{star * 15}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  {reviews.length > 0 ? reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-50 pb-8 last:border-0">
                      <div className="flex items-center space-x-4 mb-4">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.userId}`} className="w-12 h-12 rounded-full" alt={review.userName} />
                        <div>
                          <p className="font-bold text-gray-900">{review.userName}</p>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">2 weeks ago</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                    </div>
                  )) : (
                    <p className="text-gray-500 italic">No reviews yet for this course.</p>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Video Modal */}
      <AnimatePresence>
        {previewVideoUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl max-w-4xl w-full border border-gray-800 flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                <div className="flex items-center space-x-2">
                  <PlayCircle className="w-5 h-5 text-blue-400" />
                  <span className="font-bold text-white text-sm">Course Preview • {course.title}</span>
                </div>
                <button 
                  onClick={() => setPreviewVideoUrl(null)}
                  className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={previewVideoUrl}
                  title="Course Video Preview"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-6 bg-gray-900 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white">{course.title}</h4>
                  <p className="text-sm text-gray-400">By {course.instructorName}</p>
                </div>
                {isEnrolled ? (
                  <Link 
                    to={`/learn/${course.id || id}`}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm"
                  >
                    Go to Course
                  </Link>
                ) : course.price === 0 ? (
                  <button 
                    onClick={() => {
                      setPreviewVideoUrl(null);
                      handleFreeEnrollment();
                    }}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm"
                  >
                    Enroll for Free
                  </button>
                ) : (
                  <Link 
                    to={`/checkout/${course.id || id}`}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm"
                  >
                    Enroll Now (${course.price})
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
