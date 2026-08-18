import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Twitter, Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">EduStream</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Empowering learners worldwide with high-quality courses from industry experts. Start your journey today.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><Github className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Platform</h3>
            <ul className="space-y-4">
              <li><Link to="/courses" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Browse Courses</Link></li>
              <li><Link to="/instructor" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Become Instructor</Link></li>
              <li><Link to="/dashboard" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">My Learning</Link></li>
              <li><Link to="/courses?category=all" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Categories</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Support</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Newsletter</h3>
            <p className="text-gray-500 text-sm mb-4">Get the latest updates and course offers.</p>
            <form className="flex space-x-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all">
                Join
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-50 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-xs mb-4 md:mb-0">
            © 2026 EduStream LMS. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-600 text-xs transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-gray-600 text-xs transition-colors">Terms</a>
            <a href="#" className="text-gray-400 hover:text-gray-600 text-xs transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
