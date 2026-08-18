import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, doc, getDoc, setDoc } from '../firebase';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  ChevronLeft, 
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

export default function Checkout({ user, userData }: { user: any, userData: any }) {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      const docRef = await getDoc(doc(db, 'courses', courseId));
      if (docRef.exists()) {
        setCourse({ id: docRef.id, ...docRef.data() });
      } else {
        toast.error('Course not found');
        navigate('/courses');
      }
      setLoading(false);
    };
    fetchCourse();
  }, [courseId, navigate]);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          courseTitle: course.title,
          price: course.price,
          userId: user.uid
        }),
      });

      const session = await response.json();
      if (session.id) {
        // In a real app, you'd redirect to Stripe Checkout
        // For this demo, we'll simulate a successful payment
        toast.success('Payment successful! (Simulated)');
        
        // Update user's enrolled courses in Firestore
        const userRef = doc(db, 'users', user.uid);
        const currentEnrolled = userData?.enrolledCourses || [];
        if (!currentEnrolled.includes(course.id)) {
          await setDoc(userRef, {
            ...userData,
            enrolledCourses: [...currentEnrolled, course.id]
          });
        }
        
        navigate(`/learn/${course.id}`);
      } else {
        throw new Error(session.error || 'Failed to create checkout session');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-sm font-bold text-gray-500 hover:text-blue-600 mb-12 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Course
      </button>

      <div className="grid lg:grid-cols-3 gap-12 items-start">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h2>
            
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-start space-x-4">
                <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-blue-900">Secure Checkout</p>
                  <p className="text-sm text-blue-700">Your payment information is encrypted and processed securely by Stripe.</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Payment Method</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center space-x-3 p-4 rounded-xl border-2 border-blue-600 bg-blue-50 text-blue-600 font-bold">
                    <CreditCard className="w-5 h-5" />
                    <span>Credit Card</span>
                  </button>
                  <button className="flex items-center justify-center space-x-3 p-4 rounded-xl border-2 border-gray-100 text-gray-400 font-bold hover:border-gray-200 transition-all">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 grayscale opacity-50" alt="GPay" />
                    <span>Google Pay</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Card Number</label>
                    <input type="text" placeholder="•••• •••• •••• ••••" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Expiry</label>
                      <input type="text" placeholder="MM/YY" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">CVC</label>
                      <input type="text" placeholder="•••" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Complete Purchase <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center">
                  <Lock className="w-3 h-3 mr-1" /> Encrypted & Secure Payment
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
            <div className="flex items-center space-x-4 mb-8">
              <img src={course.thumbnail} className="w-20 h-12 rounded-lg object-cover" alt="" />
              <div>
                <p className="text-sm font-bold text-gray-900 line-clamp-1">{course.title}</p>
                <p className="text-xs text-gray-500">By {course.instructorName}</p>
              </div>
            </div>

            <div className="space-y-4 border-t border-gray-50 pt-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Original Price</span>
                <span className="text-gray-900 font-medium">$199.99</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Discount</span>
                <span className="text-green-600 font-medium">-$180.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-50">
                <span className="text-gray-900">Total</span>
                <span className="text-blue-600">${course.price}</span>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <AlertCircle className="w-4 h-4 text-gray-400" />
                <p>By completing your purchase, you agree to these <span className="text-blue-600 font-bold hover:underline cursor-pointer">Terms of Service</span>.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Need Help?</h3>
            <p className="text-sm text-gray-500 mb-4">Contact our support team for any payment issues.</p>
            <button className="text-sm font-bold text-blue-600 hover:underline">Chat with Support</button>
          </div>
        </div>
      </div>
    </div>
  );
}
