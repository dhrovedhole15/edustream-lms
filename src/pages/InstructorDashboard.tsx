import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  LayoutDashboard, 
  BookOpen, 
  DollarSign, 
  Users, 
  BarChart, 
  MoreVertical, 
  Edit, 
  Trash2, 
  CheckCircle,
  Clock,
  ChevronRight,
  PlayCircle,
  FileText,
  Settings,
  X,
  Upload,
  Save,
  Star,
  PlusCircle,
  ExternalLink,
  Trash
} from 'lucide-react';
import { toast } from 'sonner';

export default function InstructorDashboard({ user, userData }: { user: any, userData: any }) {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    category: 'development',
    price: 0,
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    sections: [] as any[],
    resources: [] as any[]
  });

  useEffect(() => {
    const fetchInstructorCourses = async () => {
      try {
        const q = query(collection(db, 'courses'), where('instructorId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        setCourses(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorCourses();
  }, [user]);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const courseData = {
        ...newCourse,
        instructorId: user.uid,
        instructorName: userData.displayName,
        status: 'draft',
        rating: 0,
        reviewsCount: 0,
        createdAt: new Date().toISOString()
      };
      
      if (editingCourse) {
        await updateDoc(doc(db, 'courses', editingCourse.id), courseData);
        setCourses(courses.map(c => c.id === editingCourse.id ? { ...c, ...courseData } : c));
        toast.success('Course updated!');
      } else {
        const docRef = await addDoc(collection(db, 'courses'), courseData);
        setCourses([{ id: docRef.id, ...courseData }, ...courses]);
        toast.success('Course created as draft!');
      }
      
      setShowCreateModal(false);
      setEditingCourse(null);
      setNewCourse({
        title: '',
        description: '',
        category: 'development',
        price: 0,
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        sections: [],
        resources: []
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEditCourse = (course: any) => {
    setEditingCourse(course);
    setNewCourse({
      title: course.title,
      description: course.description,
      category: course.category,
      price: course.price,
      thumbnail: course.thumbnail,
      sections: course.sections || [],
      resources: course.resources || []
    });
    setShowCreateModal(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteDoc(doc(db, 'courses', courseId));
        setCourses(courses.filter(c => c.id !== courseId));
        toast.success('Course deleted');
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const addSection = () => {
    setNewCourse({
      ...newCourse,
      sections: [
        ...newCourse.sections,
        { id: Math.random().toString(36).substr(2, 9), title: '', description: '', lectures: [] }
      ]
    });
  };

  const updateSection = (sIdx: number, field: string, value: any) => {
    const updatedSections = [...newCourse.sections];
    updatedSections[sIdx] = { ...updatedSections[sIdx], [field]: value };
    setNewCourse({ ...newCourse, sections: updatedSections });
  };

  const addLecture = (sIdx: number) => {
    const updatedSections = [...newCourse.sections];
    updatedSections[sIdx].lectures.push({
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      externalLink: '',
      duration: 0,
      isPreview: false,
      type: 'video'
    });
    setNewCourse({ ...newCourse, sections: updatedSections });
  };

  const updateLecture = (sIdx: number, lIdx: number, field: string, value: any) => {
    const updatedSections = [...newCourse.sections];
    updatedSections[sIdx].lectures[lIdx] = { ...updatedSections[sIdx].lectures[lIdx], [field]: value };
    setNewCourse({ ...newCourse, sections: updatedSections });
  };

  const removeSection = (sIdx: number) => {
    const updatedSections = newCourse.sections.filter((_, i) => i !== sIdx);
    setNewCourse({ ...newCourse, sections: updatedSections });
  };

  const removeLecture = (sIdx: number, lIdx: number) => {
    const updatedSections = [...newCourse.sections];
    updatedSections[sIdx].lectures = updatedSections[sIdx].lectures.filter((_: any, i: number) => i !== lIdx);
    setNewCourse({ ...newCourse, sections: updatedSections });
  };

  const addResource = () => {
    setNewCourse({
      ...newCourse,
      resources: [...newCourse.resources, { title: '', url: '' }]
    });
  };

  const updateResource = (idx: number, field: string, value: string) => {
    const updatedResources = [...newCourse.resources];
    updatedResources[idx] = { ...updatedResources[idx], [field]: value };
    setNewCourse({ ...newCourse, resources: updatedResources });
  };

  const removeResource = (idx: number) => {
    setNewCourse({
      ...newCourse,
      resources: newCourse.resources.filter((_: any, i: number) => i !== idx)
    });
  };

  const stats = [
    { label: 'Total Revenue', value: '$12,450', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Students', value: '1,240', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Course Rating', value: '4.9', icon: BarChart, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const seedJavaCourse = async () => {
    try {
      const response = await fetch('/api/seed/java-dsa', { method: 'POST' });
      if (response.ok) {
        toast.success('Java DSA Course seeded successfully!');
        window.location.reload();
      } else {
        toast.error('Seeding failed');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Instructor Dashboard</h1>
          <p className="text-gray-500">Manage your courses, track earnings, and engage with your students.</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={seedJavaCourse}
            className="bg-green-50 text-green-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-green-100 transition-all border border-green-100 flex items-center"
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Seed Java Course
          </button>
          <button 
            onClick={() => {
              setEditingCourse(null);
              setNewCourse({
                title: '',
                description: '',
                category: 'development',
                price: 0,
                thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                sections: [],
                resources: []
              });
              setShowCreateModal(true);
            }}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center"
          >
            <PlusCircle className="w-5 h-5 mr-2" /> Create New Course
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-6">
            <div className={`${stat.bg} p-4 rounded-2xl`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Courses List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Your Courses</h2>
          <div className="flex bg-gray-50 p-1 rounded-lg">
            <button className="px-4 py-1.5 text-xs font-bold bg-white shadow-sm rounded-md text-blue-600">All</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4">Course</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Students</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-8 py-8"><div className="h-12 bg-gray-50 rounded-xl" /></td>
                  </tr>
                ))
              ) : courses.length > 0 ? courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <img src={course.thumbnail} className="w-16 h-10 rounded-lg object-cover" alt="" />
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{course.title}</p>
                        <p className="text-xs text-gray-400">{course.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      course.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-gray-900">124</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleEditCourse(course)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {course.status !== 'published' && (
                        <button 
                          onClick={async () => {
                            try {
                              await updateDoc(doc(db, 'courses', course.id), { status: 'published' });
                              setCourses(courses.map(c => c.id === course.id ? { ...c, status: 'published' } : c));
                              toast.success('Course published!');
                            } catch (error: any) {
                              toast.error(error.message);
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                          title="Publish"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <p className="text-gray-500 italic">You haven't created any courses yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Course Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 lg:p-12 overflow-y-auto">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl font-bold text-gray-900">{editingCourse ? 'Edit Course Content' : 'Create New Course'}</h2>
                  <button 
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <form onSubmit={handleCreateCourse} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Course Title</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Complete React Masterclass"
                          value={newCourse.title}
                          onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Category</label>
                          <select 
                            value={newCourse.category}
                            onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          >
                            <option value="development">Development</option>
                            <option value="business">Business</option>
                            <option value="design">Design</option>
                            <option value="marketing">Marketing</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Price ($)</label>
                          <input 
                            type="number" 
                            required
                            min="0"
                            value={newCourse.price}
                            onChange={(e) => setNewCourse({...newCourse, price: parseFloat(e.target.value)})}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Description</label>
                        <textarea 
                          required
                          rows={4}
                          placeholder="What will students learn in this course?"
                          value={newCourse.description}
                          onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                        />
                      </div>

                      {/* Course Resources */}
                      <div className="pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Course Resources (PDFs, Links)</label>
                          <button 
                            type="button"
                            onClick={addResource}
                            className="text-[10px] font-bold text-blue-600 flex items-center hover:underline"
                          >
                            <PlusCircle className="w-3 h-3 mr-1" /> Add Resource
                          </button>
                        </div>
                        <div className="space-y-3">
                          {newCourse.resources.map((res: any, idx: number) => (
                            <div key={idx} className="flex items-center space-x-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                              <input 
                                type="text"
                                placeholder="Resource Name"
                                value={res.title}
                                onChange={(e) => updateResource(idx, 'title', e.target.value)}
                                className="flex-grow bg-white border border-gray-100 rounded-lg py-1.5 px-3 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              <input 
                                type="text"
                                placeholder="URL"
                                value={res.url}
                                onChange={(e) => updateResource(idx, 'url', e.target.value)}
                                className="flex-grow bg-white border border-gray-100 rounded-lg py-1.5 px-3 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              <button 
                                type="button"
                                onClick={() => removeResource(idx)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Sections & Lectures Editor */}
                    <div className="space-y-6">
                      <div className="flex justify-between items-center mb-4">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Course Sections</label>
                        <button 
                          type="button"
                          onClick={addSection}
                          className="text-xs font-bold text-blue-600 flex items-center hover:underline"
                        >
                          <PlusCircle className="w-4 h-4 mr-1" /> Add Section
                        </button>
                      </div>

                      <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                        {newCourse.sections.map((section, sIdx) => (
                          <div key={section.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4 relative">
                            <button 
                              type="button"
                              onClick={() => removeSection(sIdx)}
                              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                            
                            <input 
                              type="text"
                              placeholder="Section Title"
                              value={section.title}
                              onChange={(e) => updateSection(sIdx, 'title', e.target.value)}
                              className="w-full bg-white border border-gray-100 rounded-lg py-2 px-3 text-sm font-bold outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            
                            <div className="space-y-3">
                              {section.lectures.map((lecture: any, lIdx: number) => (
                                <div key={lecture.id} className="bg-white p-4 rounded-xl border border-gray-100 space-y-3 relative group">
                                  <button 
                                    type="button"
                                    onClick={() => removeLecture(sIdx, lIdx)}
                                    className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                  
                                  <input 
                                    type="text"
                                    placeholder="Lecture Title"
                                    value={lecture.title}
                                    onChange={(e) => updateLecture(sIdx, lIdx, 'title', e.target.value)}
                                    className="w-full text-xs font-bold outline-none border-b border-transparent focus:border-blue-500 pb-1"
                                  />
                                  
                                  <div className="flex items-center space-x-2">
                                    <ExternalLink className="w-3 h-3 text-gray-400" />
                                    <input 
                                      type="text"
                                      placeholder="External Link (URL)"
                                      value={lecture.externalLink}
                                      onChange={(e) => updateLecture(sIdx, lIdx, 'externalLink', e.target.value)}
                                      className="flex-grow text-[10px] outline-none border-b border-transparent focus:border-blue-500"
                                    />
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <Clock className="w-3 h-3 text-gray-400" />
                                      <input 
                                        type="number"
                                        placeholder="Min"
                                        value={lecture.duration}
                                        onChange={(e) => updateLecture(sIdx, lIdx, 'duration', parseInt(e.target.value))}
                                        className="w-12 text-[10px] outline-none border-b border-transparent focus:border-blue-500"
                                      />
                                      <span className="text-[10px] text-gray-400">min</span>
                                    </div>
                                    <label className="flex items-center space-x-1 cursor-pointer">
                                      <input 
                                        type="checkbox"
                                        checked={lecture.isPreview}
                                        onChange={(e) => updateLecture(sIdx, lIdx, 'isPreview', e.target.checked)}
                                        className="w-3 h-3 rounded"
                                      />
                                      <span className="text-[10px] text-gray-500">Preview</span>
                                    </label>
                                  </div>
                                </div>
                              ))}
                              
                              <button 
                                type="button"
                                onClick={() => addLecture(sIdx)}
                                className="w-full py-2 border border-dashed border-gray-200 rounded-xl text-[10px] font-bold text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center justify-center"
                              >
                                <Plus className="w-3 h-3 mr-1" /> Add Lecture
                              </button>
                            </div>
                          </div>
                        ))}
                        
                        {newCourse.sections.length === 0 && (
                          <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-xs text-gray-400">No sections added yet.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button 
                      type="submit"
                      className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center"
                    >
                      <Save className="w-5 h-5 mr-2" /> {editingCourse ? 'Save Changes' : 'Create Draft Course'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
