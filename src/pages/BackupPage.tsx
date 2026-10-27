import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';

export default function BackupPage() {
  const { backups } = useData();
  const [backupRunning, setBackupRunning] = useState(false);

  const handleBackup = () => {
    setBackupRunning(true);
    setTimeout(() => setBackupRunning(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-l from-cyan-700 to-cyan-800 text-white">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span>💾</span>
          <span>پشتیبان‌گیری و بازیابی</span>
        </h2>
        <p className="text-cyan-100 text-sm mt-1">مدیریت نسخه‌های پشتیبان پایگاه داده و تنظیمات سامانه</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
              ✅
            </div>
            <div>
              <p className="text-sm text-gray-500">آخرین پشتیبان</p>
              <p className="font-bold text-gray-800">1403/09/16 06:00</p>
              <p className="text-xs text-green-600">موفق</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
              📦
            </div>
            <div>
              <p className="text-sm text-gray-500">حجم آخرین نسخه</p>
              <p className="font-bold text-gray-800">245 MB</p>
              <p className="text-xs text-gray-500">پشتیبان کامل</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">
              📅
            </div>
            <div>
              <p className="text-sm text-gray-500">پشتیبان بعدی</p>
              <p className="font-bold text-gray-800">1403/09/17 06:00</p>
              <p className="text-xs text-gray-500">زمان‌بندی خودکار</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4">عملیات پشتیبان‌گیری</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">پشتیبان‌گیری کامل</h4>
            <p className="text-sm text-gray-500 mb-4">ایجاد نسخه پشتیبان کامل از تمام داده‌ها و تنظیمات</p>
            <button
              onClick={handleBackup}
              disabled={backupRunning}
              className="btn-primary w-full disabled:opacity-50"
            >
              {backupRunning ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  در حال پشتیبان‌گیری...
                </span>
              ) : '💾 شروع پشتیبان‌گیری'}
            </button>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">بازیابی اطلاعات</h4>
            <p className="text-sm text-gray-500 mb-4">بازیابی اطلاعات از نسخه پشتیبان (نیاز به مجوز ویژه)</p>
            <button className="btn-secondary w-full">
              🔄 بازیابی از نسخه پشتیبان
            </button>
          </div>
        </div>
      </div>

      {/* Backup History */}
      <div className="card overflow-hidden p-0">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">سابقه پشتیبان‌گیری</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">زمان</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">نوع</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">وضعیت</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">حجم</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">توضیحات</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {backups.map(backup => (
                <tr key={backup.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">{backup.timestamp}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      backup.type === 'full' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {backup.type === 'full' ? 'کامل' : 'تدریجی'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      backup.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {backup.status === 'success' ? '✓ موفق' : '✗ ناموفق'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{backup.size}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{backup.notes}</td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">دانلود</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Settings */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4">تنظیمات پشتیبان‌گیری</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label-field">تناوب پشتیبان‌گیری</label>
            <select className="input-field">
              <option>روزانه — ساعت 06:00</option>
              <option>هر ۱۲ ساعت</option>
              <option>هفتگی</option>
              <option>دستی</option>
            </select>
          </div>
          <div>
            <label className="label-field">مدت نگهداری نسخه‌ها</label>
            <select className="input-field">
              <option>۳۰ روز</option>
              <option>۶۰ روز</option>
              <option>۹۰ روز</option>
              <option>نامحدود</option>
            </select>
          </div>
          <div>
            <label className="label-field">محل ذخیره‌سازی</label>
            <input type="text" className="input-field" defaultValue="/backups/steelmetrics/" />
          </div>
          <div>
            <label className="label-field">رمزنگاری</label>
            <select className="input-field">
              <option>AES-256 (توصیه‌شده)</option>
              <option>بدون رمزنگاری</option>
            </select>
          </div>
        </div>
        <button className="btn-primary mt-4">ذخیره تنظیمات</button>
      </div>

      {/* Recovery Info */}
      <div className="card bg-amber-50 border border-amber-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h4 className="font-bold text-amber-800">نکات مهم درباره بازیابی</h4>
            <ul className="text-sm text-amber-700 mt-2 space-y-1 list-disc list-inside">
              <li>بازیابی اطلاعات، داده‌های فعلی را بازنویسی خواهد کرد</li>
              <li>قبل از بازیابی، یک نسخه پشتیبان از وضعیت فعلی تهیه شود</li>
              <li>عملیات بازیابی باید در محیط آزمایشی تست شود</li>
              <li>RPO و RTO باید توسط مدیریت تعیین و تصویب شوند</li>
              <li>دسترسی به بازیابی فقط برای کاربران دارای مجوز ویژه ممکن است</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
