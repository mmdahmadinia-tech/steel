import React, { useState } from 'react';
import { defaultBackups } from '../data/mockData';

export default function BackupPage() {
  const [running, setRunning] = useState(false);
  const handleBackup = () => { setRunning(true); setTimeout(() => setRunning(false), 2000); };

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-l from-cyan-700 to-cyan-800 text-white">
        <h2 className="text-xl font-bold">💾 پشتیبان‌گیری و بازیابی</h2>
        <p className="text-cyan-100 text-sm mt-1">مدیریت نسخه‌های پشتیبان</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">✅</div><div><p className="text-sm text-gray-500">آخرین پشتیبان</p><p className="font-bold">1403/09/17 06:00</p><p className="text-xs text-green-600">موفق</p></div></div></div>
        <div className="card"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">📦</div><div><p className="text-sm text-gray-500">حجم</p><p className="font-bold">245 MB</p></div></div></div>
        <div className="card"><button onClick={handleBackup} disabled={running} className="btn-primary w-full disabled:opacity-50">{running ? 'در حال...' : '💾 پشتیبان‌گیری'}</button></div>
      </div>
      <div className="card overflow-hidden p-0">
        <div className="px-6 py-4 border-b"><h3 className="font-bold">سابقه پشتیبان‌گیری</h3></div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b"><tr>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">زمان</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">وضعیت</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">حجم</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">توضیحات</th>
          </tr></thead>
          <tbody className="divide-y">
            {defaultBackups.map(b => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-mono">{b.timestamp}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${b.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{b.status === 'success' ? '✓ موفق' : '✗ ناموفق'}</span></td>
                <td className="px-4 py-3 text-sm">{b.size}</td>
                <td className="px-4 py-3 text-sm">{b.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
