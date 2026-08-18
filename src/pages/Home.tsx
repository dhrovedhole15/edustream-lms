import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Search, 
  ChevronRight, 
  Star, 
  Users, 
  PlayCircle, 
  CheckCircle,
  ArrowRight,
  BookOpen,
  Award,
  Zap
} from 'lucide-react';
import { db, collection, query, where, getDocs, limit } from '../firebase';
import { DEFAULT_COURSES } from '../data/coursesData';

export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState<any[]>(DEFAULT_COURSES);
  const [devCourses, setDevCourses] = useState<any[]>(DEFAULT_COURSES.filter(c => c.category === 'development'));

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) {
            setFeaturedCourses(list);
            setDevCourses(list.filter((c: any) => (c.category || '').toLowerCase() === 'development'));
            return;
          }
        }
      } catch (err) {
        console.warn("Home API fetch fallback:", err);
      }

      try {
        // Featured courses fallback
        const qFeatured = query(collection(db, 'courses'), where('status', '==', 'published'), limit(12));
        const featuredSnapshot = await getDocs(qFeatured);
        if (!featuredSnapshot.empty) {
          const list = featuredSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setFeaturedCourses(list);
          setDevCourses(list.filter((c: any) => (c.category || '').toLowerCase() === 'development'));
        }
      } catch (e) {
        console.error("Home course fetch error:", e);
      }
    };
    fetchCourses();
  }, []);

  const stats = [
    { label: 'Active Students', value: '50K+', icon: Users },
    { label: 'Total Courses', value: '1.2K+', icon: BookOpen },
    { label: 'Expert Instructors', value: '450+', icon: Award },
    { label: 'Satisfaction Rate', value: '99%', icon: Star },
  ];

  const categories = [
    { name: 'Development', icon: '💻', count: '450+ Courses' },
    { name: 'Business', icon: '📈', count: '320+ Courses' },
    { name: 'Design', icon: '🎨', count: '280+ Courses' },
    { name: 'Marketing', icon: '🚀', count: '190+ Courses' },
    { name: 'Photography', icon: '📸', count: '120+ Courses' },
    { name: 'Music', icon: '🎵', count: '85+ Courses' },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-48">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                <Zap className="w-3 h-3" />
                <span>New: AI-Powered Learning Paths</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-8">
                Master New Skills with <span className="text-blue-600">Expert-Led</span> Courses.
              </h1>
              <p className="text-xl text-gray-500 leading-relaxed mb-10 max-w-lg">
                Join over 50,000 students learning from industry leaders. Get unlimited access to 1,200+ top-rated courses.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/courses" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center">
                  Explore Courses <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
                <Link to="/instructor" className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center">
                  Become Instructor
                </Link>
              </div>
              <div className="mt-12 flex items-center space-x-4">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <img 
                      key={i} 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} 
                      className="w-10 h-10 rounded-full border-2 border-white" 
                      alt="User"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  <span className="font-bold text-gray-900">4.9/5</span> from 10k+ reviews
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Students learning"
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                      <PlayCircle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold">Watch Preview</p>
                      <p className="text-white/70 text-sm">How EduStream works</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-8 -right-8 bg-white p-6 rounded-2xl shadow-xl z-20 hidden md:block border border-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Verified Certificates</p>
                    <p className="text-xs text-gray-500">Boost your career</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-sm mb-4">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Categories</h2>
              <p className="text-gray-500">Explore our most popular learning paths.</p>
            </div>
            <Link to="/courses" className="text-blue-600 font-bold flex items-center hover:text-blue-700 transition-colors">
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, i) => (
              <Link 
                key={i} 
                to={`/courses?category=${cat.name.toLowerCase()}`}
                className="group bg-white border border-gray-100 p-8 rounded-2xl text-center hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 transition-all"
              >
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">{cat.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{cat.name}</h3>
                <p className="text-xs text-gray-400">{cat.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Courses</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Hand-picked courses from our top instructors to help you reach your goals faster.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredCourses.length > 0 ? featuredCourses.map((course) => (
              <Link 
                key={course.id} 
                to={`/course/${course.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    {course.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">By {course.instructorName}</p>
                  <div className="flex items-center space-x-1 mb-4">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-bold text-gray-900">{course.rating || '4.8'}</span>
                    <span className="text-xs text-gray-400">({course.reviewsCount || '1.2k'})</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    {course.price === 0 ? (
                      <span className="text-lg font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">FREE</span>
                    ) : (
                      <span className="text-xl font-bold text-gray-900">${course.price}</span>
                    )}
                    <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform flex items-center">
                      Enroll Now <ChevronRight className="ml-1 w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            )) : (
              // Skeleton loaders
              [1,2,3,4].map(i => (
                <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Development Courses Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Development Courses</h2>
              <p className="text-gray-500">Master the latest technologies with our top-rated coding courses.</p>
            </div>
            <Link to="/courses?category=development" className="text-blue-600 font-bold flex items-center hover:text-blue-700 transition-colors">
              View All Development <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {devCourses.length > 0 ? devCourses.map((course) => (
              <Link 
                key={course.id} 
                to={`/course/${course.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    {course.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">By {course.instructorName}</p>
                  <div className="flex items-center space-x-1 mb-4">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-bold text-gray-900">{course.rating || '4.8'}</span>
                    <span className="text-xs text-gray-400">({course.reviewsCount || '1.2k'})</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    {course.price === 0 ? (
                      <span className="text-lg font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">FREE</span>
                    ) : (
                      <span className="text-xl font-bold text-gray-900">${course.price}</span>
                    )}
                    <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform flex items-center">
                      Enroll Now <ChevronRight className="ml-1 w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="col-span-4 text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-500 italic">No development courses available yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-[2rem] p-12 lg:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500/20 -skew-x-12 translate-x-1/4" />
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                  Start Learning Today and Shape Your Future.
                </h2>
                <p className="text-blue-100 text-lg mb-10">
                  Join millions of people who are already learning on EduStream. Get access to the best courses at the lowest prices.
                </p>
                <div className="flex space-x-4">
                  <Link to="/login" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg">
                    Get Started Now
                  </Link>
                  <Link to="/courses" className="bg-blue-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-800 transition-all">
                    Browse Courses
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                      <p className="text-3xl font-bold text-white mb-1">95%</p>
                      <p className="text-blue-100 text-sm">Completion Rate</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                      <p className="text-3xl font-bold text-white mb-1">24/7</p>
                      <p className="text-blue-100 text-sm">Expert Support</p>
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                      <p className="text-3xl font-bold text-white mb-1">Lifetime</p>
                      <p className="text-blue-100 text-sm">Course Access</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                      <p className="text-3xl font-bold text-white mb-1">100%</p>
                      <p className="text-blue-100 text-sm">Money Back</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
