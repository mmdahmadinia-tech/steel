import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { STEEL_GRADES, SHIFTS } from '../data/mockData';

export default function HeatsListPage() {
  const { heats } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterShift, setFilterShift] = useState('');
  const [filterGrade, setFilterGrade] = useState('');

  // Filter heats based on user role
  let filteredHeats = heats.filter(h => {
    if (user?.role === 'eaf_user') return h.eafStatus !== 'not_started';
    if (user?.role === 'lf_user') return h.lfStatus !== 'not_started';
    if (user?.role === 'ccm_user') return h.ccmStatus !== 'not_started';
    return true;
  });

  filteredHeats = filteredHeats.filter(h => {
    const matchSearch = h.heatId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchShift = !filterShift || h.shift === filterShift;
    const matchGrade = !filterGrade || h.steelGrade === filterGrade;
    return matchSearch && matchShift && matchGrade;
  });

  const exportToExcel = () => {
    const headers = ['Heat ID', 'Date', 'Shift', 'Grade', 'Status'];
    const rows = filteredHeats.map(h => [h.heatId, h.date, h.shift, h.steelGrade, h.eafStatus]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `heats_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div><label className="label-field">جست‌وجوی Heat ID</label><input type="text" className="input-field" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="شماره ذوب..." /></div>
          <div><label className="label-field">شیفت</label><select className="input-field" value={filterShift} onChange={e => setFilterShift(e.target.value)}><option value="">همه</option>{SHIFTS.map(s => <option key={s} value={s}>شیفت {s}</option>)}</select></div>
          <div><label className="label-field">گرید</label><select className="input-field" value={filterGrade} onChange={e => setFilterGrade(e.target.value)}><option value="">همه</option>{STEEL_GRADES.map(g => <option key={g} value={g}>{g}</option>)}</select></div>
          <div className="flex items-end"><button onClick={exportToExcel} className="btn-primary w-full">📥 دانلود اکسل</button></div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600"><span className="font-bold">{filteredHeats.length}</span> ذوب یافت شد</p>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Heat ID</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">تاریخ</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">شیفت</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">گرید</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">EAF</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">LF</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">CCM</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">عملیات</th>
            </tr></thead>
            <tbody className="divide-y">
              {filteredHeats.map(heat => (
                <tr key={heat.id} className="hover:bg-blue-50/50">
                  <td className="px-4 py-3 font-bold text-blue-600">{heat.heatId}</td>
                  <td className="px-4 py-3 text-sm">{heat.date}</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs bg-slate-100">{heat.shift}</span></td>
                  <td className="px-4 py-3 text-sm">{heat.steelGrade}</td>
                  <td className="px-4 py-3"><StatusBadge status={heat.eafStatus} /></td>
                  <td className="px-4 py-3"><StatusBadge status={heat.lfStatus} /></td>
                  <td className="px-4 py-3"><StatusBadge status={heat.ccmStatus} /></td>
                  <td className="px-4 py-3"><Link to={`/heats/${heat.id}`} className="text-blue-600 hover:text-blue-800 text-sm">مشاهده ←</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredHeats.length === 0 && <div className="card text-center py-12"><p className="text-gray-500">اطلاعاتی یافت نشد</p></div>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'تکمیل' },
    in_progress: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'در حال' },
    not_started: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'شروع‌نشده' },
  };
  const c = config[status] || config.not_started;
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>{c.label}</span>;
}
