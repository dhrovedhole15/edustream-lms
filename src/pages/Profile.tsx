import React, { useState } from 'react';
import { db, doc, updateDoc } from '../firebase';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Camera, 
  Shield, 
  Bell, 
  CreditCard, 
  LogOut,
  Save,
  ChevronRight,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

export default function Profile({ user, userData }: { user: any, userData: any }) {
  const [formData, setFormData] = useState({
    displayName: userData?.displayName || '',
    bio: userData?.bio || '',
    role: userData?.role || 'student'
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), formData);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Public Profile', icon: User },
    { id: 'account', name: 'Account Settings', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'billing', name: 'Billing & Payments', icon: CreditCard },
  ];

  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-8">
            <div className="text-center mb-10">
              <div className="relative inline-block group">
                <img 
                  src={userData?.profilePic || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-[2rem] border-4 border-gray-50 shadow-lg object-cover"
                />
                <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mt-6">{userData?.displayName}</h2>
              <p className="text-sm text-gray-500 capitalize">{userData?.role}</p>
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-4" />
                  {tab.name}
                </button>
              ))}
              <div className="pt-4 mt-4 border-t border-gray-50">
                <button className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all">
                  <LogOut className="w-5 h-5 mr-4" /> Logout
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:w-3/4">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 lg:p-12"
          >
            {activeTab === 'profile' && (
              <form onSubmit={handleSave} className="space-y-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Public Profile</h2>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Display Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="text" 
                        value={formData.displayName}
                        onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="email" 
                        disabled
                        value={userData?.email}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 pl-12 pr-4 text-gray-400 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Bio</label>
                  <textarea 
                    rows={6}
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Tell us about yourself..."
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                  />
                  <p className="text-[10px] text-gray-400 mt-2 ml-1">Brief description for your profile. URLs are allowed.</p>
                </div>

                <div className="pt-8 border-t border-gray-50">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Account Type</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, role: 'student'})}
                      className={`p-6 rounded-2xl border-2 text-left transition-all ${
                        formData.role === 'student' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <p className={`font-bold mb-1 ${formData.role === 'student' ? 'text-blue-900' : 'text-gray-900'}`}>Student</p>
                      <p className="text-xs text-gray-500">I want to learn new skills and advance my career.</p>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, role: 'instructor'})}
                      className={`p-6 rounded-2xl border-2 text-left transition-all ${
                        formData.role === 'instructor' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <p className={`font-bold mb-1 ${formData.role === 'instructor' ? 'text-blue-900' : 'text-gray-900'}`}>Instructor</p>
                      <p className="text-xs text-gray-500">I want to share my knowledge and earn revenue.</p>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {activeTab !== 'profile' && (
              <div className="text-center py-20">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Settings className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{tabs.find(t => t.id === activeTab)?.name}</h3>
                <p className="text-gray-500">This section is coming soon in the next update.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
