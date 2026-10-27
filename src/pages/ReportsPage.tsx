import React from 'react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-l from-indigo-600 to-indigo-700 text-white">
        <h2 className="text-xl font-bold">📈 گزارش‌ها و تحلیل‌ها</h2>
        <p className="text-indigo-100 text-sm mt-1">تحلیل عملکرد تولید</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: 'گزارش تولید', icon: '📊', desc: 'تعداد و وزن ذوب‌ها' },
          { title: 'گزارش مصرف انرژی', icon: '⚡', desc: 'مصرف KWH و تحلیل' },
          { title: 'گزارش مصرف مواد', icon: '🧱', desc: 'مواد مصرفی EAF و LF' },
          { title: 'گزارش توقفات', icon: '⏸️', desc: 'تحلیل توقفات' },
          { title: 'آنالیز شیمیایی', icon: '🧪', desc: 'نتایج آزمایش‌ها' },
          { title: 'مقایسه شیفت‌ها', icon: '🔄', desc: 'عملکرد شیفت‌ها' },
        ].map((report, i) => (
          <div key={i} className="card hover:shadow-md transition-shadow cursor-pointer">
            <span className="text-4xl mb-3 block">{report.icon}</span>
            <h3 className="font-bold text-gray-800">{report.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{report.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
