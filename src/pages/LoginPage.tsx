import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const { login, resetUsers } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    setTimeout(() => {
      const success = login(username.trim(), password.trim());
      if (success) {
        navigate('/dashboard');
      } else {
        setError('نام کاربری یا رمز عبور اشتباه است');
      }
      setLoading(false);
    }, 300);
  };

  const handleReset = () => {
    if (confirm('آیا مطمئن هستید؟ تمام کاربران به حالت پیش‌فرض بازنشانی می‌شوند.')) {
      resetUsers();
      setError('');
      alert('کاربران بازنشانی شدند. اکنون می‌توانید با کاربران پیش‌فرض وارد شوید.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" dir="rtl" style={{
      background: 'linear-gradient(135deg, #1a0000 0%, #2d1810 30%, #1a0a00 60%, #0d0d0d 100%)',
    }}>
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20" style={{
          background: 'radial-gradient(circle, #ff6b00 0%, #ff4500 30%, transparent 70%)',
          animation: 'pulse 4s ease-in-out infinite',
        }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-15" style={{
          background: 'radial-gradient(circle, #ff8c00 0%, #ff6347 40%, transparent 70%)',
          animation: 'pulse 6s ease-in-out infinite reverse',
        }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full opacity-10" style={{
          background: 'radial-gradient(circle, #ffd700 0%, #ff8c00 50%, transparent 70%)',
          animation: 'pulse 5s ease-in-out infinite',
        }}></div>
        
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-orange-400 rounded-full opacity-60" style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `spark ${2 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}></div>
        ))}
      </div>

      <style>{`
        @keyframes spark {
          0%, 100% { opacity: 0; transform: translateY(0) scale(0.5); }
          50% { opacity: 1; transform: translateY(-20px) scale(1); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 107, 0, 0.3); }
          50% { box-shadow: 0 0 40px rgba(255, 107, 0, 0.6); }
        }
      `}</style>

      <div className="relative w-full max-w-md z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl mb-4 relative" style={{
            background: 'linear-gradient(135deg, #ff6b00, #ff4500, #dc2626)',
            boxShadow: '0 0 40px rgba(255, 107, 0, 0.4), 0 0 80px rgba(255, 69, 0, 0.2)',
            animation: 'glow 3s ease-in-out infinite',
          }}>
            <span className="text-4xl font-black text-white">SM</span>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
          </div>
          <h1 className="text-3xl font-black text-white mb-2" style={{ textShadow: '0 0 20px rgba(255, 107, 0, 0.5)' }}>
            STEELMETRICS
          </h1>
          <p className="text-orange-300 text-sm font-medium">سامانه مدیریت و تحلیل تولید فولاد</p>
          <p className="text-orange-400/50 text-xs mt-1">Steel Production Management & Analytics</p>
        </div>

        {/* Login Form */}
        <div className="rounded-2xl p-8 relative" style={{
          background: 'rgba(20, 10, 5, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 107, 0, 0.2)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 107, 0, 0.1)',
        }}>
          <h2 className="text-xl font-bold text-white mb-6 text-center">ورود به سامانه</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-orange-200 mb-2">نام کاربری</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 107, 0, 0.3)',
                }}
                placeholder="کد پرسنلی"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-orange-200 mb-2">رمز عبور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 107, 0, 0.3)',
                }}
                placeholder="رمز عبور"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-bold py-3 px-4 rounded-xl transition-all duration-200 text-white disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #ff6b00, #ff4500)',
                boxShadow: '0 4px 15px rgba(255, 107, 0, 0.4)',
              }}
            >
              {loading ? 'در حال ورود...' : '🔥 ورود به سامانه'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-orange-900/30 text-center">
            <p className="text-orange-300/60 text-xs">دفتر فنی و برنامه‌ریزی تولید</p>
          </div>

          {/* Debug Section */}
          <div className="mt-4 pt-4 border-t border-orange-900/20">
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="text-xs text-orange-400/40 hover:text-orange-400/80 transition-colors"
            >
              {showDebug ? '▼' : '▶'} راهنمای ورود
            </button>
            
            {showDebug && (
              <div className="mt-3 text-xs text-orange-300/70 space-y-2">
                <p className="font-bold text-orange-300">کاربران پیش‌فرض:</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-orange-400">مدیر سایت</p>
                    <p>کاربری: 19029</p>
                    <p>رمز: 19029</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-orange-400">کاربر EAF</p>
                    <p>کاربری: 19377</p>
                    <p>رمز: 19377</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-orange-400">کاربر LF</p>
                    <p>کاربری: 19513</p>
                    <p>رمز: 19513</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-orange-400">کاربر CCM</p>
                    <p>کاربری: 19616</p>
                    <p>رمز: 19616</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-orange-400">تحلیلگر</p>
                    <p>کاربری: 19452</p>
                    <p>رمز: 19452</p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="mt-3 w-full bg-red-900/30 hover:bg-red-900/50 text-red-300 text-xs py-2 px-3 rounded transition-colors"
                >
                  🔄 بازنشانی کاربران به حالت پیش‌فرض
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="text-center mt-6">
          <p className="text-orange-400/40 text-xs">steelmetrics.ir — نسخه ۱.۰</p>
        </div>
      </div>
    </div>
  );
}
