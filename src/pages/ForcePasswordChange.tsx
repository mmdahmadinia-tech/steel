import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ForcePasswordChange() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { changePassword, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // اعتبارسنجی
    if (newPassword.length < 8) {
      setError('رمز عبور جدید باید حداقل ۸ کاراکتر باشد');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('رمز عبور جدید و تکرار آن مطابقت ندارند');
      return;
    }

    if (newPassword === '123456') {
      setError('رمز عبور جدید نباید با رمز اولیه یکسان باشد');
      return;
    }

    setLoading(true);

    try {
      const success = await changePassword(currentPassword, newPassword);
      
      if (success) {
        alert('رمز عبور با موفقیت تغییر کرد. لطفاً مجدداً وارد شوید.');
        logout();
        navigate('/login');
      } else {
        setError('رمز عبور فعلی اشتباه است یا خطا در تغییر رمز');
      }
    } catch (err) {
      setError('خطا در تغییر رمز عبور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" dir="rtl" style={{
      background: 'linear-gradient(135deg, #1a0000 0%, #2d1810 30%, #1a0a00 60%, #0d0d0d 100%)',
    }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl mb-4" style={{
            background: 'linear-gradient(135deg, #ff6b00, #ff4500, #dc2626)',
            boxShadow: '0 0 40px rgba(255, 107, 0, 0.4)',
          }}>
            <span className="text-4xl font-black text-white">🔐</span>
          </div>
          <h1 className="text-2xl font-black text-white mb-2">تغییر رمز عبور اجباری</h1>
          <p className="text-orange-300 text-sm">
            برای ادامه استفاده از سامانه، باید رمز عبور خود را تغییر دهید
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl p-8" style={{
          background: 'rgba(20, 10, 5, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 107, 0, 0.2)',
        }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-orange-200 mb-2">
                رمز عبور فعلی
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 107, 0, 0.3)',
                }}
                placeholder="رمز عبور فعلی"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-orange-200 mb-2">
                رمز عبور جدید (حداقل ۸ کاراکتر)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 107, 0, 0.3)',
                }}
                placeholder="رمز عبور جدید"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-orange-200 mb-2">
                تکرار رمز عبور جدید
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 107, 0, 0.3)',
                }}
                placeholder="تکرار رمز عبور جدید"
                required
              />
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl text-sm">
                ⚠️ {error}
              </div>
            )}

            <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3 text-sm text-blue-200">
              <p className="font-bold mb-1">💡 نکات امنیتی:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>رمز عبور باید حداقل ۸ کاراکتر باشد</li>
                <li>از ترکیب حروف بزرگ، کوچک و اعداد استفاده کنید</li>
                <li>رمز عبور نباید با رمز اولیه (123456) یکسان باشد</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-bold py-3 px-4 rounded-xl text-white disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #ff6b00, #ff4500)',
                boxShadow: '0 4px 15px rgba(255, 107, 0, 0.4)',
              }}
            >
              {loading ? 'در حال تغییر رمز...' : 'تغییر رمز عبور'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-orange-400/40 text-xs">steelmetrics.ir — نسخه ۱.۰</p>
        </div>
      </div>
    </div>
  );
}
