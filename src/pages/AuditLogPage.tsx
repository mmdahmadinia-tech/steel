import React from 'react';
import { defaultAuditLogs } from '../data/mockData';

export default function AuditLogPage() {
  const logs = defaultAuditLogs;
  const getActionIcon = (a: string) => ({ create: '🆕', edit: '✏️', delete: '🗑️', approve: '✅' }[a] || '📌');
  const getActionColor = (a: string) => ({ create: 'bg-green-100 text-green-700', edit: 'bg-blue-100 text-blue-700', delete: 'bg-red-100 text-red-700', approve: 'bg-emerald-100 text-emerald-700' }[a] || 'bg-gray-100 text-gray-700');
  const getActionName = (a: string) => ({ create: 'ایجاد', edit: 'ویرایش', delete: 'حذف', approve: 'تأیید' }[a] || a);

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-l from-slate-700 to-slate-800 text-white">
        <h2 className="text-xl font-bold">📋 سوابق تغییرات</h2>
        <p className="text-slate-300 text-sm mt-1">رهگیری عملیات‌های مهم سامانه</p>
      </div>
      <div className="card overflow-hidden p-0">
        <table className="w-full">
          <thead className="bg-gray-50 border-b"><tr>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">زمان</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">کاربر</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">عملیات</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">رکورد</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">توضیحات</th>
          </tr></thead>
          <tbody className="divide-y">
            {logs.map((log: any) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-mono">{log.timestamp}</td>
                <td className="px-4 py-3 text-sm font-medium">{log.userName}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${getActionColor(log.action)}`}>{getActionIcon(log.action)} {getActionName(log.action)}</span></td>
                <td className="px-4 py-3 text-sm font-mono text-blue-600">{log.recordId}</td>
                <td className="px-4 py-3 text-sm">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
