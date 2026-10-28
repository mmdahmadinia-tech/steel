import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { STEEL_GRADES, SHIFTS } from '../data/mockData';
import JalaliDatePicker from '../components/JalaliDatePicker';

export default function HeatsListPage() {
  const { heats } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterShift, setFilterShift] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');
  const [selectedHeat, setSelectedHeat] = useState<any>(null);

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
    
    let matchDate = true;
    if (filterDateStart || filterDateEnd) {
      const heatDate = h.date.replace(/\//g, '');
      const startDate = filterDateStart ? filterDateStart.replace(/\//g, '') : '';
      const endDate = filterDateEnd ? filterDateEnd.replace(/\//g, '') : '';
      
      if (startDate && endDate) {
        matchDate = heatDate >= startDate && heatDate <= endDate;
      } else if (startDate) {
        matchDate = heatDate >= startDate;
      } else if (endDate) {
        matchDate = heatDate <= endDate;
      }
    }
    
    return matchSearch && matchShift && matchGrade && matchDate;
  });

  const exportToExcel = () => {
    const rows: any[] = [];
    
    filteredHeats.forEach(h => {
      // General Info
      rows.push(['Heat ID', h.heatId, '', '', '', '']);
      rows.push(['Date', h.date, '', '', '', '']);
      rows.push(['Shift', h.shift, '', '', '', '']);
      rows.push(['Steel Grade', h.steelGrade, '', '', '', '']);
      rows.push(['', '', '', '', '', '']);
      
      // EAF Data
      if (h.eafData) {
        rows.push(['=== EAF Data ===', '', '', '', '', '']);
        rows.push(['Power On (min)', h.eafData.powerOn || '', 'Power Off (min)', h.eafData.powerOff || '', 'Tap to Tap (min)', h.eafData.tapToTap || '']);
        rows.push(['Tapping Weight (Ton)', h.eafData.tappingWeight || '', 'En.Cou (MWh)', h.eafData.enCou || '', 'Tapping Duration (min)', h.eafData.tappingDuration || '']);
        
        if (h.eafData.materials) {
          rows.push(['', '', '', '', '', '']);
          rows.push(['--- Materials ---', '', '', '', '', '']);
          rows.push(['FeMn (Kg)', h.eafData.materials.feMn || '', 'FeSiMn (Kg)', h.eafData.materials.feSiMn || '', 'FeSi (Kg)', h.eafData.materials.feSi || '']);
          rows.push(['Lime (Kg)', h.eafData.materials.lime || '', 'Carbon (Kg)', h.eafData.materials.carbon || '', 'CPC Injection (Kg)', h.eafData.materials.cpcInjection || '']);
          rows.push(['Oxygen (Nm³)', h.eafData.materials.oxygen || '', '', '', '', '']);
        }
        
        if (h.eafData.preStoppages && h.eafData.preStoppages.length > 0) {
          rows.push(['', '', '', '', '', '']);
          rows.push(['--- Pre-Start Stoppages ---', '', '', '', '', '']);
          h.eafData.preStoppages.forEach((s: any, i: number) => {
            if (s.from || s.till) {
              rows.push([`Stoppage ${i + 1}`, `From: ${s.from}`, `Till: ${s.till}`, `Minutes: ${s.minutes}`, `Group: ${s.workingGroup}`, `Reason: ${s.reason || s.customReason || ''}`]);
            }
          });
        }
      }
      
      rows.push(['', '', '', '', '', '']);
      
      // LF Data
      if (h.lfData) {
        rows.push(['=== LF Data ===', '', '', '', '', '']);
        if (h.lfData.additives) {
          rows.push(['--- Additives ---', '', '', '', '', '']);
          Object.entries(h.lfData.additives).forEach(([key, value]) => {
            rows.push([key, value as number, '', '', '', '']);
          });
        }
      }
      
      rows.push(['', '', '', '', '', '']);
      
      // CCM Data
      if (h.ccmData) {
        rows.push(['=== CCM Data ===', '', '', '', '', '']);
        rows.push(['Avg Casting Speed (m/min)', h.ccmData.avgCastingSpeed || '', 'Line Breaks', h.ccmData.lineBreaks || '', 'Sequence Heats', h.ccmData.sequenceHeats || '']);
      }
      
      rows.push(['', '', '', '', '', '']);
      rows.push(['========================================', '', '', '', '', '']);
      rows.push(['', '', '', '', '', '']);
    });
    
    const csv = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `heats_full_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
            <label className="label-field">Heat ID</label>
            <input type="text" className="input-field" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="شماره ذوب..." />
          </div>
          <div>
            <label className="label-field">شیفت</label>
            <select className="input-field" value={filterShift} onChange={e => setFilterShift(e.target.value)}>
              <option value="">همه</option>
              {SHIFTS.map(s => <option key={s} value={s}>شیفت {s}</option>)}
            </select>
          </div>
          <div>
            <label className="label-field">گرید</label>
            <select className="input-field" value={filterGrade} onChange={e => setFilterGrade(e.target.value)}>
              <option value="">همه</option>
              {STEEL_GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={exportToExcel} className="btn-primary">📥 دانلود اکسل (گزارش کامل)</button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600"><span className="font-bold">{filteredHeats.length}</span> ذوب یافت شد</p>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
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
              {filteredHeats.map(heat => (
                <tr key={heat.id} className="hover:bg-blue-50/50">
                  <td className="px-4 py-3 font-bold text-blue-600">{heat.heatId}</td>
                  <td className="px-4 py-3 text-sm">{heat.date}</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs bg-slate-100">{heat.shift}</span></td>
                  <td className="px-4 py-3 text-sm">{heat.steelGrade}</td>
                  <td className="px-4 py-3"><StatusBadge status={heat.eafStatus} /></td>
                  <td className="px-4 py-3"><StatusBadge status={heat.lfStatus} /></td>
                  <td className="px-4 py-3"><StatusBadge status={heat.ccmStatus} /></td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelectedHeat(heat)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      مشاهده ←
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredHeats.length === 0 && <div className="card text-center py-12"><p className="text-gray-500">اطلاعاتی یافت نشد</p></div>}

      {/* Heat Detail Modal */}
      {selectedHeat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">ذوب {selectedHeat.heatId}</h3>
              <button onClick={() => setSelectedHeat(null)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div><p className="text-sm text-gray-500">تاریخ</p><p className="font-bold">{selectedHeat.date}</p></div>
              <div><p className="text-sm text-gray-500">شیفت</p><p className="font-bold">{selectedHeat.shift}</p></div>
              <div><p className="text-sm text-gray-500">گرید</p><p className="font-bold">{selectedHeat.steelGrade}</p></div>
              <div><p className="text-sm text-gray-500">وزن تخلیه</p><p className="font-bold">{selectedHeat.eafData?.tappingWeight || '-'} تن</p></div>
            </div>

            {selectedHeat.eafData && (
              <div className="mb-6">
                <h4 className="text-lg font-bold text-blue-600 mb-3">⚡ اطلاعات EAF</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-blue-50 p-4 rounded-lg">
                  <div><p className="text-xs text-gray-600">Power On</p><p className="font-medium">{selectedHeat.eafData.powerOn || '-'} دقیقه</p></div>
                  <div><p className="text-xs text-gray-600">Power Off</p><p className="font-medium">{selectedHeat.eafData.powerOff || '-'} دقیقه</p></div>
                  <div><p className="text-xs text-gray-600">Tap to Tap</p><p className="font-medium">{selectedHeat.eafData.tapToTap || '-'} دقیقه</p></div>
                  <div><p className="text-xs text-gray-600">En.Cou</p><p className="font-medium">{selectedHeat.eafData.enCou || '-'} MWh</p></div>
                </div>
                {selectedHeat.eafData.materials && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">مواد مصرفی:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      {Object.entries(selectedHeat.eafData.materials).map(([key, value]) => (
                        <div key={key} className="bg-white p-2 rounded border">
                          <p className="text-xs text-gray-500">{key}</p>
                          <p className="font-medium">{(value as number).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedHeat.lfData && (
              <div className="mb-6">
                <h4 className="text-lg font-bold text-green-600 mb-3">🔧 اطلاعات LF</h4>
                <div className="bg-green-50 p-4 rounded-lg">
                  {selectedHeat.lfData.additives && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">مواد افزودنی:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        {Object.entries(selectedHeat.lfData.additives).map(([key, value]) => (
                          <div key={key} className="bg-white p-2 rounded border">
                            <p className="text-xs text-gray-500">{key}</p>
                            <p className="font-medium">{(value as number).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedHeat.ccmData && (
              <div>
                <h4 className="text-lg font-bold text-purple-600 mb-3">🏭 اطلاعات CCM</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-purple-50 p-4 rounded-lg">
                  <div><p className="text-xs text-gray-600">سرعت ریخته‌گری</p><p className="font-medium">{selectedHeat.ccmData.avgCastingSpeed || '-'} m/min</p></div>
                  <div><p className="text-xs text-gray-600">پارگی خطوط</p><p className="font-medium">{selectedHeat.ccmData.lineBreaks || 0}</p></div>
                  <div><p className="text-xs text-gray-600">ذوب در سکوئنس</p><p className="font-medium">{selectedHeat.ccmData.sequenceHeats || '-'}</p></div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelectedHeat(null)} className="btn-secondary">بستن</button>
            </div>
          </div>
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
