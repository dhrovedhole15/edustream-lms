import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db, collection, query, where, getDocs } from '../firebase';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Clock, 
  PlayCircle, 
  Award, 
  ChevronRight, 
  Star, 
  Sparkles,
  ExternalLink,
  PlusCircle,
  FileText,
  Flame,
  Zap,
  TrendingUp,
  CheckCircle2,
  Settings,
  Bell
} from 'lucide-react';
import { toast } from 'sonner';

export default function StudentDashboard({ user, userData }: { user: any, userData: any }) {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [allAvailableCourses, setAllAvailableCourses] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [filterTab, setFilterTab] = useState<'all' | 'in_progress' | 'completed'>('all');

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch all published courses from Firestore
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const allCourses = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllAvailableCourses(allCourses);

      // 2. Identify enrolled courses
      const enrolledIds: string[] = userData?.enrolledCourses || [];
      const userEnrolled = allCourses.filter(c => enrolledIds.includes(c.id));
      setEnrolledCourses(userEnrolled);

      // 3. Fetch progress for enrolled courses
      if (user?.uid && enrolledIds.length > 0) {
        const progressMap: Record<string, any> = {};
        for (const courseId of enrolledIds) {
          try {
            const response = await fetch(`/api/progress/${courseId}?userId=${user.uid}`);
            if (response.ok) {
              progressMap[courseId] = await response.json();
            }
          } catch (e) {
            console.error("Failed to load progress for course", courseId, e);
          }
        }
        setProgressData(progressMap);
      }
    } catch (error) {
      console.error("Dashboard data load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [userData, user?.uid]);

  const handleQuickFreeEnroll = async (courseId: string) => {
    if (!user?.uid) {
      navigate('/login');
      return;
    }
    setEnrollingId(courseId);
    try {
      const response = await fetch('/api/enroll/free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, userId: user.uid }),
      });
      if (response.ok) {
        toast.success("Successfully enrolled for free!");
        await fetchDashboardData();
        navigate(`/learn/${courseId}`);
      } else {
        const data = await response.json();
        toast.error(data.error || "Enrollment failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to enroll");
    } finally {
      setEnrollingId(null);
    }
  };

  const calculateOverallProgress = () => {
    const progressValues = Object.values(progressData);
    if (progressValues.length === 0) return 0;
    const total = progressValues.reduce((acc, p) => acc + (p.progressPercentage || 0), 0);
    return Math.round(total / progressValues.length);
  };

  const totalLecturesCompleted = Object.values(progressData).reduce(
    (acc, p) => acc + (p.completedLectures?.length || 0), 
    0
  );

  const completedCoursesCount = Object.values(progressData).filter(
    p => Math.round(p.progressPercentage || 0) >= 100
  ).length;

  const filteredEnrolledCourses = enrolledCourses.filter(course => {
    const p = progressData[course.id]?.progressPercentage || 0;
    if (filterTab === 'in_progress') return p < 100;
    if (filterTab === 'completed') return p >= 100;
    return true;
  });

  // Highlighted free tracks
  const javaDsaCourse = allAvailableCourses.find(c => 
    c.title?.toLowerCase().includes('java to dsa') || c.title?.toLowerCase().includes('dsa in 30 days')
  );
  const javaInterviewCourse = allAvailableCourses.find(c => 
    c.title?.toLowerCase().includes('most asked java') || c.title?.toLowerCase().includes('java interview questions')
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1 rounded-full border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack Learning & Placement Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {userData?.displayName || 'Developer'}! 👋
            </h1>
            <p className="text-blue-200 text-sm sm:text-base max-w-2xl">
              Track your daily progress across Java, DSA in 30 Days, and top interview questions. Ready to crack top tech roles?
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              to="/courses"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 rounded-2xl font-bold text-sm transition-all backdrop-blur"
            >
              Explore All Courses
            </Link>
            <Link 
              to="/profile"
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-900/40 transition-all flex items-center"
            >
              <Settings className="w-4 h-4 mr-2" /> Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="bg-blue-50 p-3.5 rounded-2xl shrink-0 text-blue-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900">{enrolledCourses.length}</p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Enrolled Courses</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="bg-emerald-50 p-3.5 rounded-2xl shrink-0 text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900">{totalLecturesCompleted}</p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Lectures Done</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="bg-amber-50 p-3.5 rounded-2xl shrink-0 text-amber-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900">{calculateOverallProgress()}%</p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg Progress</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="bg-purple-50 p-3.5 rounded-2xl shrink-0 text-purple-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900">{completedCoursesCount}</p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Certificates</p>
          </div>
        </div>
      </div>

      {/* Featured Free Learning Tracks Spotlight */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Learning Tracks (100% Free)</h2>
            <p className="text-sm text-gray-500">Curated masterclasses with YouTube video lectures, study resources, and progress tracking.</p>
          </div>
          <span className="hidden sm:inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            <Zap className="w-3.5 h-3.5 mr-1" /> Instant Free Access
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Java to DSA in 30 days Spotlight Card */}
          {javaDsaCourse ? (
            <div className="bg-white rounded-3xl border border-blue-100 p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-bl-2xl">
                30 Days Challenge
              </div>
              <div className="flex gap-4 items-start mb-4">
                <div className="w-28 h-20 rounded-2xl overflow-hidden shrink-0 border border-gray-100 bg-gray-900">
                  <img 
                    src={javaDsaCourse.thumbnail} 
                    alt={javaDsaCourse.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md">FREE COURSE</span>
                  <h3 className="font-bold text-gray-900 text-lg line-clamp-1 mt-1">{javaDsaCourse.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">{javaDsaCourse.description}</p>
                </div>
              </div>

              {/* Progress bar if enrolled */}
              {userData?.enrolledCourses?.includes(javaDsaCourse.id) ? (
                <div className="mt-auto space-y-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-600">Your Progress:</span>
                    <span className="font-bold text-blue-600">
                      {Math.round(progressData[javaDsaCourse.id]?.progressPercentage || 0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressData[javaDsaCourse.id]?.progressPercentage || 0}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-gray-500">
                      {progressData[javaDsaCourse.id]?.completedLectures?.length || 0} of 30 lectures completed
                    </span>
                    <Link
                      to={`/learn/${javaDsaCourse.id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center transition-colors"
                    >
                      Resume Learning <PlayCircle className="w-3.5 h-3.5 ml-1.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500 flex items-center space-x-3">
                    <span className="flex items-center"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 mr-1" /> 4.95</span>
                    <span>30 Lectures</span>
                  </div>
                  <button
                    onClick={() => handleQuickFreeEnroll(javaDsaCourse.id)}
                    disabled={enrollingId === javaDsaCourse.id}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
                  >
                    {enrollingId === javaDsaCourse.id ? "Enrolling..." : "Enroll for Free"} <PlusCircle className="w-3.5 h-3.5 ml-1.5" />
                  </button>
                </div>
              )}
            </div>
          ) : null}

          {/* Most Asked Java Interview Questions Spotlight Card */}
          {javaInterviewCourse ? (
            <div className="bg-white rounded-3xl border border-indigo-100 p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-bl-2xl">
                Interview Prep
              </div>
              <div className="flex gap-4 items-start mb-4">
                <div className="w-28 h-20 rounded-2xl overflow-hidden shrink-0 border border-gray-100 bg-gray-900">
                  <img 
                    src={javaInterviewCourse.thumbnail} 
                    alt={javaInterviewCourse.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md">FREE COURSE</span>
                  <h3 className="font-bold text-gray-900 text-lg line-clamp-1 mt-1">{javaInterviewCourse.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">{javaInterviewCourse.description}</p>
                </div>
              </div>

              {/* Progress bar if enrolled */}
              {userData?.enrolledCourses?.includes(javaInterviewCourse.id) ? (
                <div className="mt-auto space-y-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-600">Your Progress:</span>
                    <span className="font-bold text-indigo-600">
                      {Math.round(progressData[javaInterviewCourse.id]?.progressPercentage || 0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressData[javaInterviewCourse.id]?.progressPercentage || 0}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-gray-500">
                      {progressData[javaInterviewCourse.id]?.completedLectures?.length || 0} of 20 interview sections done
                    </span>
                    <Link
                      to={`/learn/${javaInterviewCourse.id}`}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center transition-colors"
                    >
                      Resume Learning <PlayCircle className="w-3.5 h-3.5 ml-1.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500 flex items-center space-x-3">
                    <span className="flex items-center"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 mr-1" /> 4.92</span>
                    <span>100+ Questions</span>
                  </div>
                  <button
                    onClick={() => handleQuickFreeEnroll(javaInterviewCourse.id)}
                    disabled={enrollingId === javaInterviewCourse.id}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
                  >
                    {enrollingId === javaInterviewCourse.id ? "Enrolling..." : "Enroll for Free"} <PlusCircle className="w-3.5 h-3.5 ml-1.5" />
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Main Learning Hub Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Enrolled Courses List with Progress Tracker */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-900">My Learning Courses</h2>
            
            {/* Filter Tabs */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-bold text-gray-600">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${filterTab === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'hover:text-gray-900'}`}
              >
                All ({enrolledCourses.length})
              </button>
              <button
                onClick={() => setFilterTab('in_progress')}
                className={`px-3 py-1.5 rounded-lg transition-all ${filterTab === 'in_progress' ? 'bg-white text-gray-900 shadow-sm' : 'hover:text-gray-900'}`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilterTab('completed')}
                className={`px-3 py-1.5 rounded-lg transition-all ${filterTab === 'completed' ? 'bg-white text-gray-900 shadow-sm' : 'hover:text-gray-900'}`}
              >
                Completed
              </button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white h-36 rounded-3xl animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : filteredEnrolledCourses.length > 0 ? (
            <div className="space-y-4">
              {filteredEnrolledCourses.map((course) => {
                const progress = progressData[course.id] || { progressPercentage: 0, completedLectures: [] };
                const pct = Math.round(progress.progressPercentage || 0);
                const totalCourseLectures = course.sections?.reduce(
                  (acc: number, s: any) => acc + (s.lectures?.length || 0), 
                  0
                ) || 0;

                return (
                  <div
                    key={course.id}
                    className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center gap-5"
                  >
                    <div className="w-full sm:w-36 h-24 rounded-2xl overflow-hidden shrink-0 bg-gray-100 relative group">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <PlayCircle className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                          {course.category || 'Development'}
                        </span>
                        <span className="text-xs font-bold text-gray-500">
                          {pct}% Complete
                        </span>
                      </div>

                      <h3 className="font-bold text-gray-900 text-base line-clamp-1">
                        {course.title}
                      </h3>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                          style={{ width: `${pct}%` }} 
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          {progress.completedLectures?.length || 0} of {totalCourseLectures || 'Total'} lectures finished
                        </span>
                        {pct === 100 && (
                          <span className="text-emerald-600 font-bold flex items-center">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Certificate Ready
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                      <Link
                        to={`/learn/${course.id}`}
                        className={`w-full sm:w-auto px-5 py-3 rounded-2xl text-xs font-bold flex items-center justify-center transition-all ${
                          pct === 100 
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20'
                        }`}
                      >
                        {pct === 100 ? "Review Course" : "Continue Learning"}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">No courses in this view</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {filterTab === 'completed' 
                    ? "Complete your enrolled lectures to earn certificates here." 
                    : "You haven't enrolled in courses yet. Start with our featured free tracks above!"}
                </p>
              </div>
              <Link
                to="/courses"
                className="inline-flex items-center bg-blue-600 text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md"
              >
                Browse All Courses <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          )}
        </div>

        {/* Right Sidebar: Resources & Study Tools */}
        <div className="space-y-6">
          {/* Quick Study Resources */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 text-blue-600 mr-2" /> Study Downloads & Cheatsheets
            </h3>
            
            <div className="space-y-3">
              <a
                href="https://mrcet.com/pdf/Lab%20Manuals/IT/JAVA%20PROGRAMMING.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-gray-50 hover:bg-blue-50/60 border border-gray-100 hover:border-blue-200 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="bg-blue-100/60 text-blue-600 p-2 rounded-xl">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">Java Programming PDF Notes</h4>
                    <p className="text-[10px] text-gray-500">Core Java Reference Manual</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 shrink-0 ml-2" />
              </a>

              <a
                href="https://whimsical.com/dsa-roadmap-by-love-babbar-896vYvJvYvJvYvJvYvJvYv"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-gray-50 hover:bg-blue-50/60 border border-gray-100 hover:border-blue-200 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="bg-indigo-100/60 text-indigo-600 p-2 rounded-xl">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">30-Day DSA Roadmap</h4>
                    <p className="text-[10px] text-gray-500">Visual Curriculum Map</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 shrink-0 ml-2" />
              </a>

              <a
                href="https://www.youtube.com/playlist?list=PLfqMhTWNBTe3LtFWcvwpqTkUSlB32kJop"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-gray-50 hover:bg-blue-50/60 border border-gray-100 hover:border-blue-200 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="bg-red-100/60 text-red-600 p-2 rounded-xl">
                    <PlayCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">Official YouTube Playlist</h4>
                    <p className="text-[10px] text-gray-500">Direct Video Lectures Stream</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 shrink-0 ml-2" />
              </a>
            </div>
          </div>

          {/* Daily Streak & Placement Tip */}
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-200/50 rounded-3xl p-6 space-y-3">
            <div className="flex items-center space-x-2 text-amber-700 font-extrabold text-sm">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>Daily Interview Tip</span>
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed font-medium">
              "For FAANG interviews, practice explaining the Time & Space Complexity (Big-O) before writing code, and always clarify edge cases like empty inputs, null pointers, and duplicate elements."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
