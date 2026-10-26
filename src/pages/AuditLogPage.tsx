import React from 'react';
import { useData } from '../contexts/DataContext';

export default function AuditLogPage() {
  const { auditLogs } = useData();

  const getActionIcon = (action: string) => {
    const icons: Record<string, string> = {
      create: '🆕',
      edit: '✏️',
      delete: '🗑️',
      login: '🔑',
      logout: '🚪',
      backup: '💾',
      restore: '🔄',
      approve: '✅',
    };
    return icons[action] || '📌';
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      create: 'bg-green-100 text-green-700',
      edit: 'bg-blue-100 text-blue-700',
      delete: 'bg-red-100 text-red-700',
      login: 'bg-purple-100 text-purple-700',
      logout: 'bg-gray-100 text-gray-700',
      backup: 'bg-amber-100 text-amber-700',
      restore: 'bg-cyan-100 text-cyan-700',
      approve: 'bg-emerald-100 text-emerald-700',
    };
    return colors[action] || 'bg-gray-100 text-gray-700';
  };

  const getActionName = (action: string) => {
    const names: Record<string, string> = {
      create: 'ایجاد',
      edit: 'ویرایش',
      delete: 'حذف',
      login: 'ورود',
      logout: 'خروج',
      backup: 'پشتیبان‌گیری',
      restore: 'بازیابی',
      approve: 'تأیید',
    };
    return names[action] || action;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-l from-slate-700 to-slate-800 text-white">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span>📋</span>
          <span>سوابق تغییرات (Audit Trail)</span>
        </h2>
        <p className="text-slate-300 text-sm mt-1">رهگیری تمام عملیات‌های مهم انجام‌شده در سامانه</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label-field">از تاریخ</label>
            <input type="text" className="input-field" placeholder="1403/09/01" defaultValue="1403/09/01" />
          </div>
          <div>
            <label className="label-field">تا تاریخ</label>
            <input type="text" className="input-field" placeholder="1403/09/16" defaultValue="1403/09/16" />
          </div>
          <div>
            <label className="label-field">نوع عملیات</label>
            <select className="input-field">
              <option value="">همه عملیات‌ها</option>
              <option value="create">ایجاد</option>
              <option value="edit">ویرایش</option>
              <option value="delete">حذف</option>
              <option value="approve">تأیید</option>
              <option value="backup">پشتیبان‌گیری</option>
            </select>
          </div>
          <div>
            <label className="label-field">کاربر</label>
            <select className="input-field">
              <option value="">همه کاربران</option>
              <option>مدیر سامانه</option>
              <option>احمد رضایی</option>
              <option>محمد حسینی</option>
              <option>علی محمدی</option>
              <option>رضا کریمی</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">زمان</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">کاربر</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">عملیات</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">نوع رکورد</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">شناسه</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">توضیحات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600 font-mono">{log.timestamp}</td>
                  <td className="px-4 py-3 text-sm font-medium">{log.userName}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                      <span>{getActionIcon(log.action)}</span>
                      <span>{getActionName(log.action)}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{log.recordType}</td>
                  <td className="px-4 py-3 text-sm font-mono text-blue-600">{log.recordId}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Timeline View */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4">نمای زمانی</h3>
        <div className="space-y-4">
          {auditLogs.slice(0, 8).map((log, i) => (
            <div key={log.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  i === 0 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {getActionIcon(log.action)}
                </div>
                {i < 7 && <div className="w-0.5 h-full bg-gray-200 mt-1"></div>}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-gray-800">{log.userName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getActionColor(log.action)}`}>
                    {getActionName(log.action)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                <p className="text-xs text-gray-400 mt-1">{log.timestamp} — {log.recordType} #{log.recordId}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="card bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <h4 className="font-bold text-blue-800">درباره سوابق تغییرات</h4>
            <p className="text-sm text-blue-700 mt-1">
              سوابق تغییرات به‌صورت خودکار و غیرقابل دست‌کاری ثبت می‌شوند. این سوابق برای رهگیری عملیات‌های مهم، 
              بررسی امنیت و حسابرسی استفاده می‌شوند. دسترسی به این بخش محدود به کاربران مجاز است.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
