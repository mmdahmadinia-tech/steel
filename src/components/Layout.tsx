import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const menuItems = [
  { path: '/dashboard', label: 'داشبورد', icon: '📊', roles: ['admin', 'eaf_user', 'lf_user', 'ccm_user', 'shift_supervisor', 'production_manager', 'analyst', 'it_admin'] },
  { path: '/heats', label: 'فهرست ذوب‌ها', icon: '🔥', roles: ['admin', 'eaf_user', 'lf_user', 'ccm_user', 'shift_supervisor', 'production_manager', 'analyst'] },
  { path: '/eaf', label: 'کوره قوس الکتریکی (EAF)', icon: '⚡', roles: ['admin', 'eaf_user', 'shift_supervisor', 'production_manager', 'analyst'] },
  { path: '/lf', label: 'کوره پاتیلی (LF)', icon: '🔧', roles: ['admin', 'lf_user', 'shift_supervisor', 'production_manager', 'analyst'] },
  { path: '/ccm', label: 'ریخته‌گری مداوم (CCM)', icon: '🏭', roles: ['admin', 'ccm_user', 'shift_supervisor', 'production_manager', 'analyst'] },
  { path: '/reports', label: 'گزارش‌ها و تحلیل', icon: '📈', roles: ['admin', 'shift_supervisor', 'production_manager', 'analyst'] },
  { path: '/users', label: 'مدیریت کاربران', icon: '👥', roles: ['admin'] },
  { path: '/audit', label: 'سوابق تغییرات', icon: '📋', roles: ['admin', 'shift_supervisor', 'production_manager', 'it_admin'] },
  { path: '/backup', label: 'پشتیبان‌گیری', icon: '💾', roles: ['admin', 'it_admin'] },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gradient-to-b from-slate-800 to-slate-900 text-white transition-all duration-300 flex flex-col shadow-xl`}>
        {/* Logo */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-lg">
              SM
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-sm">STEELMETRICS</h1>
                <p className="text-xs text-slate-400">سامانه مدیریت فولاد</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {filteredMenuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User Info */}
        {sidebarOpen && user && (
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-xs">
                {user.fullName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium">{user.fullName}</p>
                <p className="text-xs text-slate-400">{getRoleName(user.role)}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-300 hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <span>🚪</span>
              <span>خروج از سامانه</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {filteredMenuItems.find(i => i.path === location.pathname)?.label || 'داشبورد'}
              </h2>
              <p className="text-xs text-gray-500">STEELMETRICS — سامانه ثبت، مدیریت و تحلیل اطلاعات تولید فولاد</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-left text-xs text-gray-500">
              <p>steelmetrics.ir</p>
              <p>نسخه ۱.۰</p>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-xs text-gray-600">آنلاین</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function getRoleName(role: string): string {
  const roles: Record<string, string> = {
    admin: 'مدیر سامانه',
    eaf_user: 'کاربر EAF',
    lf_user: 'کاربر LF',
    ccm_user: 'کاربر CCM',
    shift_supervisor: 'سرپرست شیفت',
    production_manager: 'مدیر تولید',
    analyst: 'تحلیلگر فرایند',
    it_admin: 'مسئول فناوری اطلاعات',
  };
  return roles[role] || role;
}
