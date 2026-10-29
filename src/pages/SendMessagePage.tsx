import React, { useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';

export default function SendMessagePage() {
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!message.trim()) {
      alert('لطفاً پیام را وارد کنید');
      return;
    }

    addNotification(message, user?.fullName || 'مدیر سایت');
    setMessage('');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-l from-purple-600 to-purple-700 text-white">
        <h2 className="text-2xl font-bold">📢 ارسال پیام به کاربران</h2>
        <p className="text-purple-100 mt-1">ارسال اعلان به تمام کاربران سامانه</p>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4">پیام جدید</h3>
        
        <div className="space-y-4">
          <div>
            <label className="label-field">متن پیام</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="input-field h-32 resize-none"
              placeholder="پیام خود را اینجا بنویسید..."
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSend}
              className="btn-primary"
              disabled={!message.trim()}
            >
              📤 ارسال پیام
            </button>
            
            {sent && (
              <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded-lg text-sm">
                ✅ پیام با موفقیت ارسال شد
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <h4 className="font-bold text-blue-800">درباره ارسال پیام</h4>
            <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
              <li>پیام شما به تمام کاربران نمایش داده می‌شود</li>
              <li>کاربران می‌توانند پیام‌ها را در زنگوله اعلان‌ها مشاهده کنند</li>
              <li>پیام‌های خوانده نشده با رنگ آبی ملایم مشخص می‌شوند</li>
              <li>کاربران می‌توانند پیام‌ها را حذف کنند</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
