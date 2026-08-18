import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { db, collection, getDocs } from '../firebase';
import { DEFAULT_COURSES } from '../data/coursesData';
import { motion } from 'motion/react';
import { 
  Search, 
  Star, 
  Clock, 
  BookOpen, 
  ChevronRight, 
  LayoutGrid, 
  List,
  Sparkles,
  Zap,
  PlayCircle,
  Filter,
  CheckCircle2
} from 'lucide-react';

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  
  const [allCourses, setAllCourses] = useState<any[]>(DEFAULT_COURSES);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>(initialCategory.toLowerCase());
  const [searchQuery, setSearchQuery] = useState('');
  const [minRating, setMinRating] = useState<number>(0);
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price_low' | 'price_high' | 'newest'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Keep state in sync with URL parameter if it changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setFilterCategory(cat.toLowerCase());
    }
  }, [searchParams]);

  // Fetch courses from API with Firestore fallback
  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        // Try backend API first
        const res = await fetch('/api/courses');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            // Merge with DEFAULT_COURSES so none are missing
            const mergedMap = new Map<string, any>();
            DEFAULT_COURSES.forEach(c => mergedMap.set(c.id, c));
            DEFAULT_COURSES.forEach(c => mergedMap.set(c.title.toLowerCase(), c));
            data.forEach((c: any) => {
              if (c.id) mergedMap.set(c.id, c);
              if (c.title) mergedMap.set(c.title.toLowerCase(), c);
            });
            const mergedList = Array.from(new Set(Array.from(mergedMap.values())));
            setAllCourses(mergedList);
            return;
          }
        }
      } catch (err) {
        console.warn("API /api/courses fetch failed, keeping default catalog:", err);
      }

      try {
        // Direct Firestore fallback
        const snapshot = await getDocs(collection(db, 'courses'));
        if (!snapshot.empty) {
          const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const mergedMap = new Map<string, any>();
          DEFAULT_COURSES.forEach(c => mergedMap.set(c.id, c));
          list.forEach((c: any) => mergedMap.set(c.id, c));
          setAllCourses(Array.from(mergedMap.values()));
        }
      } catch (fbErr) {
        console.error("Firestore courses fetch error:", fbErr);
      }
    };

    fetchCoursesData();
  }, []);

  const categories = [
    { id: 'all', label: 'All Courses' },
    { id: 'development', label: 'Development' },
    { id: 'business', label: 'Business' },
    { id: 'design', label: 'Design' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'photography', label: 'Photography' },
    { id: 'music', label: 'Music' },
  ];

  // Filtering and sorting
  const filteredCourses = allCourses.filter(course => {
    // 1. Category filter
    if (filterCategory !== 'all') {
      const courseCategory = (course.category || '').toLowerCase();
      if (courseCategory !== filterCategory.toLowerCase()) {
        return false;
      }
    }

    // 2. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = (course.title || '').toLowerCase().includes(q);
      const matchInstructor = (course.instructorName || '').toLowerCase().includes(q);
      const matchDesc = (course.description || '').toLowerCase().includes(q);
      const matchCategory = (course.category || '').toLowerCase().includes(q);
      if (!matchTitle && !matchInstructor && !matchDesc && !matchCategory) {
        return false;
      }
    }

    // 3. Min Rating filter
    if (minRating > 0) {
      const r = Number(course.rating) || 0;
      if (r < minRating) return false;
    }

    // 4. Price filter
    if (priceFilter === 'free' && Number(course.price) > 0) return false;
    if (priceFilter === 'paid' && Number(course.price) === 0) return false;

    return true;
  }).sort((a, b) => {
    if (sortBy === 'popular') {
      return (b.reviewsCount || 0) - (a.reviewsCount || 0);
    }
    if (sortBy === 'rating') {
      return (b.rating || 0) - (a.rating || 0);
    }
    if (sortBy === 'price_low') {
      return (a.price || 0) - (b.price || 0);
    }
    if (sortBy === 'price_high') {
      return (b.price || 0) - (a.price || 0);
    }
    if (sortBy === 'newest') {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
    return 0;
  });

  const handleCategorySelect = (catId: string) => {
    setFilterCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    setFilterCategory('all');
    setSearchQuery('');
    setMinRating(0);
    setPriceFilter('all');
    setSortBy('popular');
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1 rounded-full border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Course Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Explore All Masterclasses & Courses
          </h1>
          <p className="text-blue-200 text-sm sm:text-base leading-relaxed">
            Browse our complete collection of computer science, Java & DSA, web development, and tech career prep tracks.
          </p>
        </div>
      </div>

      {/* Main Catalog Section */}
      <div className="grid lg:grid-cols-4 gap-8 items-start">
        {/* Left Sidebar: Filters */}
        <div className="lg:col-span-1 space-y-6">
          {/* Search Box */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Search</h3>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search courses, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Categories Filter */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Categories</h3>
              {filterCategory !== 'all' && (
                <button 
                  onClick={() => handleCategorySelect('all')}
                  className="text-[11px] font-bold text-blue-600 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
            <div className="space-y-1.5">
              {categories.map((cat) => {
                const count = allCourses.filter(c => 
                  cat.id === 'all' ? true : (c.category || '').toLowerCase() === cat.id
                ).length;
                const isSelected = filterCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                      isSelected 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Filter */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Price</h3>
            <div className="grid grid-cols-3 gap-2 text-xs font-bold">
              <button
                onClick={() => setPriceFilter('all')}
                className={`py-2 rounded-xl transition-all ${
                  priceFilter === 'all' 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setPriceFilter('free')}
                className={`py-2 rounded-xl transition-all ${
                  priceFilter === 'free' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                Free ($0)
              </button>
              <button
                onClick={() => setPriceFilter('paid')}
                className={`py-2 rounded-xl transition-all ${
                  priceFilter === 'paid' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                Paid
              </button>
            </div>
          </div>

          {/* Ratings Filter */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Ratings</h3>
            <div className="space-y-2">
              {[4.5, 4.0, 3.5].map((rating) => (
                <label 
                  key={rating} 
                  onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="rating"
                      checked={minRating === rating} 
                      onChange={() => {}}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded border-gray-300" 
                    />
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-600">{rating} & up</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content: Results Toolbar & Course Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Toolbar */}
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500 font-medium">
              Showing <span className="font-extrabold text-gray-900">{filteredCourses.length}</span> courses
              {filterCategory !== 'all' && (
                <span className="ml-1 text-blue-600 font-bold capitalize">in {filterCategory}</span>
              )}
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Sort selector */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-gray-400">Sort:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              {/* View mode toggle */}
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Courses List / Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-3xl h-80 animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className={viewMode === 'grid' ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredCourses.map((course) => {
                const isFree = Number(course.price) === 0;
                const totalLectures = course.sections?.reduce(
                  (acc: number, s: any) => acc + (s.lectures?.length || 0), 
                  0
                ) || 12;

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={course.id}
                    className="group"
                  >
                    <div 
                      className={`bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between h-full ${
                        viewMode === 'list' ? 'sm:flex-row' : ''
                      }`}
                    >
                      {/* Thumbnail Container */}
                      <Link 
                        to={`/course/${course.id}`}
                        className={`relative overflow-hidden block bg-gray-900 shrink-0 ${
                          viewMode === 'list' ? 'sm:w-72 aspect-video sm:aspect-auto' : 'aspect-video'
                        }`}
                      >
                        <img 
                          src={course.thumbnail} 
                          alt={course.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                        
                        {/* Badges */}
                        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
                          <span className="bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider text-blue-700 shadow-sm">
                            {course.category}
                          </span>
                          {isFree && (
                            <span className="bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center">
                              <Zap className="w-3 h-3 mr-0.5" /> FREE
                            </span>
                          )}
                        </div>

                        {/* Play Icon on hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                            <PlayCircle className="w-6 h-6" />
                          </div>
                        </div>
                      </Link>

                      {/* Course Content Details */}
                      <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                              <span className="font-bold text-gray-900">{course.rating || '4.9'}</span>
                              <span className="text-gray-400">({course.reviewsCount || 450})</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                              <span>{totalLectures} lectures</span>
                            </div>
                          </div>

                          <Link to={`/course/${course.id}`} className="block">
                            <h3 className="font-bold text-gray-900 text-base line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {course.title}
                            </h3>
                          </Link>

                          <p className="text-xs text-gray-500 line-clamp-2">
                            {course.description}
                          </p>

                          <p className="text-[11px] font-semibold text-gray-400">
                            Instructor: <span className="text-gray-700">{course.instructorName}</span>
                          </p>
                        </div>

                        {/* Price & Action Bottom Row */}
                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div>
                            {isFree ? (
                              <div className="flex items-center space-x-1.5">
                                <span className="text-lg font-black text-emerald-600">FREE</span>
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">100% Off</span>
                              </div>
                            ) : (
                              <div className="flex items-baseline space-x-2">
                                <span className="text-xl font-extrabold text-gray-900">${course.price}</span>
                                <span className="text-xs text-gray-400 line-through">${(Number(course.price) * 1.6).toFixed(2)}</span>
                              </div>
                            )}
                          </div>

                          <Link
                            to={`/course/${course.id}`}
                            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center transition-all ${
                              isFree
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20'
                            }`}
                          >
                            {isFree ? 'Start Free' : 'View Course'}
                            <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 p-8 space-y-4">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-blue-600">
                <Search className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-gray-900">No courses match your filter</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  We couldn't find any courses matching "{filterCategory}" with the current search criteria.
                </p>
              </div>
              <button 
                onClick={handleClearFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-md"
              >
                Clear all filters & show all courses
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
