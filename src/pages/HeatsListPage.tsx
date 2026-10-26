import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

export default function HeatsListPage() {
  const { heats } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterShift, setFilterShift] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredHeats = heats.filter(heat => {
    const matchSearch = heat.heatId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchShift = !filterShift || heat.shift === filterShift;
    const matchGrade = !filterGrade || heat.steelGrade === filterGrade;
    const matchStatus = !filterStatus || getOverallStatus(heat) === filterStatus;
    return matchSearch && matchShift && matchGrade && matchStatus;
  });

  const grades = [...new Set(heats.map(h => h.steelGrade))];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label-field">جست‌وجوی Heat ID</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              placeholder="شماره ذوب را وارد کنید..."
            />
          </div>
          <div>
            <label className="label-field">شیفت</label>
            <select
              value={filterShift}
              onChange={(e) => setFilterShift(e.target.value)}
              className="input-field"
            >
              <option value="">همه شیفت‌ها</option>
              <option value="A">شیفت A</option>
              <option value="B">شیفت B</option>
              <option value="C">شیفت C</option>
            </select>
          </div>
          <div>
            <label className="label-field">گرید فولاد</label>
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="input-field"
            >
              <option value="">همه گریدها</option>
              {grades.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="label-field">وضعیت</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="">همه وضعیت‌ها</option>
              <option value="completed">تکمیل‌شده</option>
              <option value="in_progress">در حال تکمیل</option>
              <option value="not_started">شروع‌نشده</option>
              <option value="needs_review">نیازمند بررسی</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          <span className="font-bold">{filteredHeats.length}</span> ذوب یافت شد
        </p>
        <Link to="/eaf" className="btn-primary text-sm">
          + ثبت ذوب جدید
        </Link>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Heat ID</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">تاریخ</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">شیفت</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">گرید</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">نوع</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">EAF</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">LF</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">CCM</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">هشدار</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredHeats.map(heat => (
                <tr key={heat.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-bold text-blue-600">{heat.heatId}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{heat.date}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {heat.shift}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{heat.steelGrade}</td>
                  <td className="px-4 py-3">
                    {heat.isSubHeat ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        فرعی
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        اصلی
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={heat.eafStatus} /></td>
                  <td className="px-4 py-3"><StatusBadge status={heat.lfStatus} /></td>
                  <td className="px-4 py-3"><StatusBadge status={heat.ccmStatus} /></td>
                  <td className="px-4 py-3">
                    {heat.warnings.length > 0 ? (
                      <span className="text-amber-500" title={heat.warnings.join(', ')}>⚠️</span>
                    ) : (
                      <span className="text-green-500">✓</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/heats/${heat.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      مشاهده ←
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredHeats.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">اطلاعاتی برای نمایش یافت نشد</p>
          <p className="text-gray-400 text-sm mt-2">فیلترهای جست‌وجو را تغییر دهید</p>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'تکمیل' },
    in_progress: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'در حال تکمیل' },
    not_started: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'شروع‌نشده' },
    needs_review: { bg: 'bg-red-100', text: 'text-red-700', label: 'نیازمند بررسی' },
  };
  const c = config[status] || config.not_started;
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

function getOverallStatus(heat: { eafStatus: string; lfStatus: string; ccmStatus: string }): string {
  if (heat.eafStatus === 'completed' && heat.lfStatus === 'completed' && heat.ccmStatus === 'completed') return 'completed';
  if (heat.eafStatus === 'not_started' && heat.lfStatus === 'not_started' && heat.ccmStatus === 'not_started') return 'not_started';
  if (heat.eafStatus === 'needs_review' || heat.lfStatus === 'needs_review' || heat.ccmStatus === 'needs_review') return 'needs_review';
  return 'in_progress';
}
