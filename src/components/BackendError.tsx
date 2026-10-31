import React from 'react';

interface BackendErrorProps {
  error: string;
  onRetry?: () => void;
}

export default function BackendError({ error, onRetry }: BackendErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" dir="rtl" style={{
      background: 'linear-gradient(135deg, #1a0000 0%, #2d1810 30%, #1a0a00 60%, #0d0d0d 100%)',
    }}>
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl p-8 text-center" style={{
          background: 'rgba(20, 10, 5, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 107, 0, 0.2)',
        }}>
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl mb-6" style={{
            background: 'linear-gradient(135deg, #dc2626, #991b1b)',
            boxShadow: '0 0 40px rgba(220, 38, 38, 0.4)',
          }}>
            <span className="text-5xl">⚠️</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-black text-white mb-4">
            خطا در اتصال به Backend
          </h1>

          {/* Error Message */}
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-200 text-sm">
              {error}
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-6 mb-6 text-right">
            <h3 className="text-blue-200 font-bold mb-3">🔧 راه‌حل:</h3>
            <ol className="text-blue-100 text-sm space-y-2 list-decimal list-inside">
              <li>مطمئن شوید PostgreSQL در حال اجرا است</li>
              <li>فایل <code className="bg-black/30 px-2 py-1 rounded">Start-SteelMetrics.bat</code> را اجرا کنید</li>
              <li>صبر کنید تا Backend و Frontend آماده شوند</li>
              <li>مرورگر را رفرش کنید</li>
            </ol>
          </div>

          {/* Commands */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 mb-6 text-right">
            <h3 className="text-gray-200 font-bold mb-3">💻 دستورات لازم:</h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="bg-black/50 p-2 rounded">
                <span className="text-green-400"># اجرای Backend:</span>
                <br />
                <span className="text-blue-300">cd server</span>
                <br />
                <span className="text-blue-300">npm run dev</span>
              </div>
              <div className="bg-black/50 p-2 rounded">
                <span className="text-green-400"># اجرای Frontend:</span>
                <br />
                <span className="text-blue-300">npm run dev</span>
              </div>
            </div>
          </div>

          {/* Retry Button */}
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full font-bold py-3 px-4 rounded-xl text-white mb-4"
              style={{
                background: 'linear-gradient(135deg, #ff6b00, #ff4500)',
                boxShadow: '0 4px 15px rgba(255, 107, 0, 0.4)',
              }}
            >
              🔄 تلاش مجدد
            </button>
          )}

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-orange-400/40 text-xs">steelmetrics.ir — نسخه ۱.۰</p>
          </div>
        </div>
      </div>
    </div>
  );
}
