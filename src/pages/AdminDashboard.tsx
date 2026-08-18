import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, query, where } from '../firebase';
import { motion } from 'motion/react';
import { 
  Users, 
  BookOpen, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  BarChart,
  DollarSign,
  Search,
  MoreVertical
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard({ user, userData }: { user: any, userData: any }) {
  const [pendingCourses, setPendingCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingCourses = async () => {
      try {
        const q = query(collection(db, 'courses'), where('status', '==', 'draft'));
        const querySnapshot = await getDocs(q);
        setPendingCourses(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingCourses();
  }, []);

  const stats = [
    { label: 'Total Revenue', value: '$145,200', icon: DollarSign, color: 'text-green-600' },
    { label: 'Total Users', value: '12,450', icon: Users, color: 'text-blue-600' },
    { label: 'Active Courses', value: '842', icon: BookOpen, color: 'text-purple-600' },
    { label: 'Pending Approval', value: pendingCourses.length.toString(), icon: AlertCircle, color: 'text-orange-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Control Center</h1>
        <p className="text-gray-500">Monitor platform performance and manage course quality.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-gray-50 p-3 rounded-2xl">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">+12%</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Pending Approvals */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Pending Approvals</h2>
              <button className="text-sm font-bold text-blue-600 hover:underline">View All</button>
            </div>
            <div className="divide-y divide-gray-50">
              {loading ? (
                <div className="p-8 space-y-4">
                  {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />)}
                </div>
              ) : pendingCourses.length > 0 ? pendingCourses.map((course) => (
                <div key={course.id} className="p-6 hover:bg-gray-50/50 transition-colors flex items-center justify-between group">
                  <div className="flex items-center space-x-4">
                    <img src={course.thumbnail} className="w-20 h-12 rounded-lg object-cover" alt="" />
                    <div>
                      <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{course.title}</p>
                      <p className="text-xs text-gray-500">By {course.instructorName} • {course.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all" title="Approve">
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Reject">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="p-20 text-center">
                  <CheckCircle className="w-12 h-12 text-green-200 mx-auto mb-4" />
                  <p className="text-gray-500">All caught up! No courses pending approval.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-8">Recent Activity</h2>
            <div className="space-y-8">
              {[1,2,3,4].map(i => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-900 font-medium">
                      <span className="font-bold">New Instructor</span> joined the platform
                    </p>
                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-3 border border-gray-100 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">
              View Activity Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
