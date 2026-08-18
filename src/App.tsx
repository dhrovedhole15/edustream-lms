import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { auth, db, onAuthStateChanged, signInWithPopup, googleProvider, doc, getDoc, setDoc } from './firebase';
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Search, 
  User, 
  LogOut, 
  LayoutDashboard, 
  PlusCircle, 
  Settings, 
  ShoppingCart, 
  Heart,
  Menu,
  X,
  ChevronRight,
  Star,
  PlayCircle,
  Clock,
  BarChart,
  DollarSign,
  Users,
  CheckCircle,
  ShieldCheck
} from 'lucide-react';

// --- Components ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// --- Pages ---
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import VideoPlayer from './pages/VideoPlayer';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          // Create new user profile if it doesn't exist
          const newData = {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            role: 'student',
            profilePic: currentUser.photoURL,
            enrolledCourses: [],
            wishlist: [],
            createdAt: new Date().toISOString()
          };
          await setDoc(doc(db, 'users', currentUser.uid), newData);
          setUserData(newData);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
        <Toaster position="top-center" richColors />
        <Navbar user={user} userData={userData} />
        
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course/:id" element={<CourseDetails user={user} userData={userData} />} />
              <Route path="/login" element={<Login user={user} />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute user={user}>
                  <StudentDashboard user={user} userData={userData} />
                </ProtectedRoute>
              } />
              
              <Route path="/instructor" element={
                <ProtectedRoute user={user} requiredRole="instructor">
                  <InstructorDashboard user={user} userData={userData} />
                </ProtectedRoute>
              } />
              
              <Route path="/admin" element={
                <ProtectedRoute user={user} requiredRole="admin">
                  <AdminDashboard user={user} userData={userData} />
                </ProtectedRoute>
              } />
              
              <Route path="/checkout/:courseId" element={
                <ProtectedRoute user={user}>
                  <Checkout user={user} userData={userData} />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute user={user}>
                  <Profile user={user} userData={userData} />
                </ProtectedRoute>
              } />
              
              <Route path="/learn/:courseId" element={
                <ProtectedRoute user={user}>
                  <VideoPlayer user={user} userData={userData} />
                </ProtectedRoute>
              } />
            </Routes>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
