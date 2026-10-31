import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function SetupPage() {
  const [step, setStep] = useState<'check' | 'token' | 'password' | 'success'>('check');
  const [token, setToken] = useState('');
  const [generatedToken, setGeneratedToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // بررسی وضعیت Setup
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/setup/status`);
        const data = await response.json();
        
        if (data.isSetup) {
          navigate('/login');
        }
      } catch (err) {
        setError('خطا در اتصال به سرور');
      }
    };

    checkStatus();
  }, [navigate]);

  // تولید توکن
  const handleGenerateToken = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/setup/generate-token`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'خطا در تولید توکن');
      }

      setGeneratedToken(data.token);
      setStep('token');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در تولید توکن');
    } finally {
      setLoading(false);
    }
  };

  // فعال‌سازی Admin
  const handleActivate = async () => {
    if (password !== confirmPassword) {
      setError('رمز عبور و تکرار آن مطابقت ندارند');
      return;
    }

    if (password.length < 8) {
      setError('رمز عبور باید حداقل ۸ کاراکتر باشد');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/setup/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'خطا در فعال‌سازی');
      }

      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در فعال‌سازی');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" dir="rtl" style={{
      background: 'linear-gradient(135deg, #1a0000 0%, #2d1810 30%, #1a0a00 60%, #0d0d0d 100%)',
    }}>
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl mb-4" style={{
            background: 'linear-gradient(135deg, #ff6b00, #ff4500, #dc2626)',
            boxShadow: '0 0 40px rgba(255, 107, 0, 0.4)',
          }}>
            <span className="text-4xl font-black text-white">SM</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">STEELMETRICS</h1>
          <p className="text-orange-300 text-sm">راه‌اندازی اولیه سامانه</p>
        </div>

        {/* Setup Card */}
        <div className="rounded-2xl p-8" style={{
          background: 'rgba(20, 10, 5, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 107, 0, 0.2)',
        }}>
          {/* Step 1: Check Status */}
          {step === 'check' && (
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-4">بررسی وضعیت سامانه</h2>
              <p className="text-orange-200 mb-6">
                برای راه‌اندازی اولیه، باید حساب مدیر اصلی را فعال کنید.
              </p>
              <button
                onClick={handleGenerateToken}
                disabled={loading}
                className="w-full font-bold py-3 px-4 rounded-xl text-white disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #ff6b00, #ff4500)',
                }}
              >
                {loading ? 'در حال تولید توکن...' : 'تولید توکن فعال‌سازی'}
              </button>
            </div>
          )}

          {/* Step 2: Show Token */}
          {step === 'token' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">توکن فعال‌سازی</h2>
              <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4 mb-4">
                <p className="text-yellow-200 text-sm mb-2">
                  ⚠️ این توکن را در جای امنی ذخیره کنید. این توکن فقط یک بار قابل استفاده است و تا ۲۴ ساعت معتبر است.
                </p>
                <div className="bg-black/50 rounded p-3 font-mono text-sm text-green-400 break-all">
                  {generatedToken}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-orange-200 mb-2">
                    توکن فعال‌سازی را وارد کنید
                  </label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 107, 0, 0.3)',
                    }}
                    placeholder="توکن را اینجا وارد کنید"
                  />
                </div>
                <button
                  onClick={() => setStep('password')}
                  disabled={!token}
                  className="w-full font-bold py-3 px-4 rounded-xl text-white disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, #ff6b00, #ff4500)',
                  }}
                >
                  ادامه
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Set Password */}
          {step === 'password' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">تنظیم رمز عبور مدیر</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-orange-200 mb-2">
                    رمز عبور جدید (حداقل ۸ کاراکتر)
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 107, 0, 0.3)',
                    }}
                    placeholder="رمز عبور قوی وارد کنید"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-200 mb-2">
                    تکرار رمز عبور
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
                    placeholder="رمز عبور را تکرار کنید"
                  />
                </div>
                {error && (
                  <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}
                <button
                  onClick={handleActivate}
                  disabled={loading || !password || !confirmPassword}
                  className="w-full font-bold py-3 px-4 rounded-xl text-white disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, #ff6b00, #ff4500)',
                  }}
                >
                  {loading ? 'در حال فعال‌سازی...' : 'فعال‌سازی حساب مدیر'}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-4">فعال‌سازی موفق</h2>
              <p className="text-orange-200 mb-6">
                حساب مدیر با موفقیت فعال شد. اکنون می‌توانید وارد سامانه شوید.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full font-bold py-3 px-4 rounded-xl text-white"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                }}
              >
                ورود به سامانه
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-orange-400/40 text-xs">steelmetrics.ir — نسخه ۱.۰</p>
        </div>
      </div>
    </div>
  );
}
