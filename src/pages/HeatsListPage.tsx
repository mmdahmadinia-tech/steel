import React, { useState, useMemo, useCallback } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { usePagination, useDebounce } from '../hooks/usePagination';
import { STEEL_GRADES, SHIFTS } from '../data/mockData';
import JalaliDatePicker from '../components/JalaliDatePicker';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';

export default function HeatsListPage() {
  const { heats } = useData();
  const { user } = useAuth();
  
  // فیلترها
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterShift, setFilterShift] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  
  // Debounce برای جستجو
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // فیلتر کردن داده‌ها بر اساس نقش کاربر
  const userFilteredHeats = useMemo(() => {
    return heats.filter(h => {
      if (user?.role === 'eaf_user') return h.eafStatus !== 'not_started';
      if (user?.role === 'lf_user') return h.lfStatus !== 'not_started';
      if (user?.role === 'ccm_user') return h.ccmStatus !== 'not_started';
      return true;
    });
  }, [heats, user?.role]);

  // استفاده از pagination hook
  const {
    data: paginatedHeats,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    goToPage,
    setSearchQuery,
  } = usePagination({
    data: userFilteredHeats,
    pageSize: 50,
    filters: {
      heatId: debouncedSearchTerm,
      shift: filterShift,
      steelGrade: filterGrade,
    },
    sortBy: 'id' as any,
    sortOrder: 'desc',
  });

  // فیلتر تاریخ
  const finalHeats = useMemo(() => {
    if (!filterDateStart && !filterDateEnd) return paginatedHeats;

    return paginatedHeats.filter(h => {
      const heatDate = h.date.replace(/\//g, '').replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
      const startDate = filterDateStart ? filterDateStart.replace(/\//g, '').replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))) : '';
      const endDate = filterDateEnd ? filterDateEnd.replace(/\//g, '').replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))) : '';
      
      if (startDate && endDate) {
        return heatDate >= startDate && heatDate <= endDate;
      } else if (startDate) {
        return heatDate >= startDate;
      } else if (endDate) {
        return heatDate <= endDate;
      }
      return true;
    });
  }, [paginatedHeats, filterDateStart, filterDateEnd]);

  // به‌روزرسانی search query
  React.useEffect(() => {
    setSearchQuery(debouncedSearchTerm);
  }, [debouncedSearchTerm, setSearchQuery]);

  // دانلود اکسل
  const exportToExcel = useCallback(() => {
    const headers = ['Heat ID', 'Date', 'Shift', 'Grade', 'EAF', 'LF', 'CCM'];
    const rows = finalHeats.map(h => [
      h.heatId,
      h.date,
      h.shift,
      h.steelGrade,
      h.eafStatus,
      h.lfStatus,
      h.ccmStatus
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `heats_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }, [finalHeats]);

  return (
    <div className="space-y-6">
      {/* فیلترها */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4">🔍 فیلترها و جستجو</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <JalaliDatePicker 
            label="تاریخ شروع" 
            value={filterDateStart} 
            onChange={setFilterDateStart} 
          />
          <JalaliDatePicker 
            label="تاریخ پایان" 
            value={filterDateEnd} 
            onChange={setFilterDateEnd} 
          />
          <div>
            <label className="label-field">جستجوی Heat ID</label>
            <input 
              type="text" 
              className="input-field" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              placeholder="شماره ذوب..." 
            />
          </div>
          <div>
            <label className="label-field">شیفت</label>
            <select 
              className="input-field" 
              value={filterShift} 
              onChange={e => setFilterShift(e.target.value)}
            >
              <option value="">همه</option>
              {SHIFTS.map(s => <option key={s} value={s}>شیفت {s}</option>)}
            </select>
          </div>
          <div>
            <label className="label-field">گرید</label>
            <select 
              className="input-field" 
              value={filterGrade} 
              onChange={e => setFilterGrade(e.target.value)}
            >
              <option value="">همه</option>
              {STEEL_GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* آمار */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-gray-600">
          <span className="font-bold text-blue-600">{totalItems}</span> ذوب یافت شد
          {totalPages > 1 && (
            <span className="text-gray-400 mr-2">
              (صفحه {currentPage} از {totalPages})
            </span>
          )}
        </p>
        <button onClick={exportToExcel} className="btn-primary text-sm">
          📥 دانلود اکسل
        </button>
      </div>

      {/* جدول - Responsive */}
      <div className="card overflow-hidden p-0">
        {/* نسخه دسکتاپ */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Heat ID</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">تاریخ</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">شیفت</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">گرید</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">EAF</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">LF</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">CCM</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {finalHeats.map(heat => (
                <tr key={heat.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-4 py-3 font-bold text-blue-600">{heat.heatId}</td>
                  <td className="px-4 py-3 text-sm">{heat.date}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-slate-100">{heat.shift}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">{heat.steelGrade}</td>
                  <td className="px-4 py-3"><StatusBadge status={heat.eafStatus} /></td>
                  <td className="px-4 py-3"><StatusBadge status={heat.lfStatus} /></td>
                  <td className="px-4 py-3"><StatusBadge status={heat.ccmStatus} /></td>
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

        {/* نسخه موبایل */}
        <div className="md:hidden divide-y">
          {finalHeats.map(heat => (
            <div key={heat.id} className="p-4 hover:bg-blue-50/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-blue-600 text-lg">{heat.heatId}</span>
                <Link 
                  to={`/heats/${heat.id}`} 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  مشاهده ←
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">تاریخ:</span>
                  <span className="mr-1 font-medium">{heat.date}</span>
                </div>
                <div>
                  <span className="text-gray-500">شیفت:</span>
                  <span className="mr-1 font-medium">{heat.shift}</span>
                </div>
                <div>
                  <span className="text-gray-500">گرید:</span>
                  <span className="mr-1 font-medium">{heat.steelGrade}</span>
                </div>
                <div className="flex gap-2">
                  <StatusBadge status={heat.eafStatus} />
                  <StatusBadge status={heat.lfStatus} />
                  <StatusBadge status={heat.ccmStatus} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={goToPage}
      />

      {finalHeats.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500">اطلاعاتی یافت نشد</p>
        </div>
      )}
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
