import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { SHIFTS } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import JalaliDatePicker from '../components/JalaliDatePicker';

export default function DashboardPage() {
  const { user } = useAuth();
  const { heats } = useData();

  if (!user) return null;

  if (user.role === 'eaf_user') return <EAFDashboard heats={heats} />;
  if (user.role === 'lf_user') return <LFDashboard heats={heats} />;
  if (user.role === 'ccm_user') return <CCMDashboard heats={heats} />;
  if (user.role === 'analyst') return <AnalystDashboard heats={heats} />;
  
  return <AdminDashboard heats={heats} />;
}

function EAFDashboard({ heats }: { heats: any[] }) {
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');
  const [filterHeatId, setFilterHeatId] = useState('');
  const [filterShift, setFilterShift] = useState('');

  const eafHeats = heats.filter(h => h.eafStatus === 'completed' && h.eafData);
  
  // Apply filters
  const filteredHeats = eafHeats.filter(h => {
    const matchHeatId = !filterHeatId || h.heatId.includes(filterHeatId);
    const matchShift = !filterShift || h.shift === filterShift;
    
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
    
    return matchDate && matchHeatId && matchShift;
  });

  const totalHeats = filteredHeats.length;
  const totalTonnage = filteredHeats.reduce((sum, h) => sum + (h.eafData?.tappingWeight || 0), 0);
  const totalKWH = filteredHeats.reduce((sum, h) => sum + (h.eafData?.enCou || 0), 0);
  const avgKWHPerTon = totalTonnage > 0 ? ((totalKWH / totalTonnage) * 1000).toFixed(2) : '0';
  const avgPowerOn = filteredHeats.length > 0 ? (filteredHeats.reduce((sum, h) => sum + (h.eafData?.powerOn || 0), 0) / filteredHeats.length).toFixed(1) : '0';
  const avgTapToTap = filteredHeats.length > 0 ? (filteredHeats.reduce((sum, h) => sum + (h.eafData?.tapToTap || 0), 0) / filteredHeats.length).toFixed(1) : '0';

  // Chart data
  const chartData = filteredHeats.map(h => ({
    name: h.heatId,
    tonnage: h.eafData?.tappingWeight || 0,
    kwhPerTon: h.eafData?.enCou ? ((h.eafData.enCou / (h.eafData.tappingWeight || 1)) * 1000).toFixed(2) : 0,
    powerOn: h.eafData?.powerOn || 0,
    tapToTap: h.eafData?.tapToTap || 0,
  }));

  // Material data
  const materials = filteredHeats.reduce((acc, h) => {
    const m = h.eafData?.materials || {};
    return {
      feMn: (acc.feMn || 0) + (m.feMn || 0),
      feSiMn: (acc.feSiMn || 0) + (m.feSiMn || 0),
      feSi: (acc.feSi || 0) + (m.feSi || 0),
      lime: (acc.lime || 0) + (m.lime || 0),
      carbon: (acc.carbon || 0) + (m.carbon || 0),
      cpcInjection: (acc.cpcInjection || 0) + (m.cpcInjection || 0),
      oxygen: (acc.oxygen || 0) + (m.oxygen || 0),
    };
  }, {} as any);

  const totalFerroAlloys = (materials.feMn || 0) + (materials.feSiMn || 0) + (materials.feSi || 0);

  const exportToExcel = () => {
    const headers = ['Heat ID', 'Date', 'Shift', 'Tonnage', 'KWH/T', 'Power On', 'Tap to Tap', 'FeMn', 'FeSiMn', 'FeSi', 'Lime', 'Carbon', 'CPC Injection', 'Oxygen'];
    const rows = filteredHeats.map(h => {
      const m = h.eafData?.materials || {};
      return [
        h.heatId,
        h.date,
        h.shift,
        h.eafData?.tappingWeight || 0,
        h.eafData?.enCou ? ((h.eafData.enCou / (h.eafData.tappingWeight || 1)) * 1000).toFixed(2) : 0,
        h.eafData?.powerOn || 0,
        h.eafData?.tapToTap || 0,
        m.feMn || 0,
        m.feSiMn || 0,
        m.feSi || 0,
        m.lime || 0,
        m.carbon || 0,
        m.cpcInjection || 0,
        m.oxygen || 0
      ];
    });
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `eaf_dashboard_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-l from-blue-600 to-blue-700 text-white">
        <h2 className="text-2xl font-bold">داشبورد کوره قوس الکتریکی (EAF)</h2>
        <p className="text-blue-100 mt-1">تحلیل عملکرد و مصرف مواد</p>
      </div>

      {/* Filters */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4">🔍 فیلترها</h3>
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
            <label className="label-field">شماره ذوب</label>
            <input type="text" className="input-field" value={filterHeatId} onChange={e => setFilterHeatId(e.target.value)} placeholder="Heat ID" />
          </div>
          <div>
            <label className="label-field">شیفت</label>
            <select className="input-field" value={filterShift} onChange={e => setFilterShift(e.target.value)}>
              <option value="">همه</option>
              {SHIFTS.map(s => <option key={s} value={s}>شیفت {s}</option>)}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button onClick={exportToExcel} className="btn-primary flex-1">📥 Excel</button>
            <button onClick={exportToPDF} className="btn-secondary flex-1">📄 PDF</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="تعداد ذوب‌ها" value={totalHeats.toString()} icon="🔥" color="blue" />
        <StatCard title="کل تناژ مذاب" value={`${totalTonnage} تن`} icon="⚖️" color="green" />
        <StatCard title="میانگین KWH/T" value={avgKWHPerTon} icon="⚡" color="yellow" />
        <StatCard title="میانگین Power On" value={`${avgPowerOn} دقیقه`} icon="🔌" color="purple" />
        <StatCard title="میانگین TAP TO TAP" value={`${avgTapToTap} دقیقه`} icon="⏱️" color="orange" />
        <StatCard title="جمع فروآلیاژها" value={`${totalFerroAlloys} Kg`} icon="🧱" color="red" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📊 نمودار تناژ و تعداد ذوب‌ها</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="tonnage" name="تناژ (تن)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">⚡ نمودار KWH/TON</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="kwhPerTon" name="KWH/T" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🔌 نمودار Power On</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="powerOn" name="Power On (دقیقه)" stroke="#8b5cf6" fill="#ede9fe" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">⏱️ نمودار TAP TO TAP</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="tapToTap" name="TAP TO TAP (دقیقه)" stroke="#10b981" fill="#d1fae5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Materials */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📊 پرتن مصرفی مواد</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MaterialCard name="FeMn" value={materials.feMn || 0} unit="Kg" />
          <MaterialCard name="FeSiMn" value={materials.feSiMn || 0} unit="Kg" />
          <MaterialCard name="FeSi" value={materials.feSi || 0} unit="Kg" />
          <MaterialCard name="Lime" value={materials.lime || 0} unit="Kg" />
          <MaterialCard name="Carbon" value={materials.carbon || 0} unit="Kg" />
          <MaterialCard name="CPC Injection" value={materials.cpcInjection || 0} unit="Kg" />
          <MaterialCard name="Oxygen" value={materials.oxygen || 0} unit="Nm³" />
        </div>
      </div>
    </div>
  );
}

function LFDashboard({ heats }: { heats: any[] }) {
  const lfHeats = heats.filter(h => h.lfStatus === 'completed' && h.lfData && h.eafData);
  const totalTonnage = lfHeats.reduce((sum, h) => sum + (h.eafData?.tappingWeight || 0), 0);
  
  const additives = lfHeats.reduce((acc, h) => {
    const a = h.lfData?.additives || {};
    return {
      feMn: (acc.feMn || 0) + (a.feMn || 0),
      feSiMn: (acc.feSiMn || 0) + (a.feSiMn || 0),
      feSi: (acc.feSi || 0) + (a.feSi || 0),
      lime: (acc.lime || 0) + (a.lime || 0),
      graphite: (acc.graphite || 0) + (a.graphite || 0),
      caC2: (acc.caC2 || 0) + (a.caC2 || 0),
      caAl: (acc.caAl || 0) + (a.caAl || 0),
    };
  }, {} as any);

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-l from-green-600 to-green-700 text-white">
        <h2 className="text-2xl font-bold">داشبورد کوره پاتیلی (LF)</h2>
        <p className="text-green-100 mt-1">تحلیل مصرف مواد افزودنی</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="تعداد ذوب‌ها" value={lfHeats.length.toString()} icon="🔥" color="green" />
        <StatCard title="کل تناژ مذاب" value={`${totalTonnage} تن`} icon="⚖️" color="blue" />
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📊 پرتن مواد مصرفی LF</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MaterialCard name="FeMn" value={additives.feMn || 0} unit="Kg" />
          <MaterialCard name="FeSiMn" value={additives.feSiMn || 0} unit="Kg" />
          <MaterialCard name="FeSi" value={additives.feSi || 0} unit="Kg" />
          <MaterialCard name="Lime" value={additives.lime || 0} unit="Kg" />
          <MaterialCard name="Graphite" value={additives.graphite || 0} unit="Kg" />
          <MaterialCard name="CaC2" value={additives.caC2 || 0} unit="Kg" />
          <MaterialCard name="Ca.Al" value={additives.caAl || 0} unit="Kg" />
        </div>
      </div>
    </div>
  );
}

function CCMDashboard({ heats }: { heats: any[] }) {
  const ccmHeats = heats.filter(h => h.ccmStatus === 'completed' && h.ccmData);
  const totalBreaks = ccmHeats.reduce((sum, h) => sum + (h.ccmData?.lineBreaks || 0), 0);
  const minSequence = ccmHeats.length > 0 ? Math.min(...ccmHeats.map(h => h.ccmData?.sequenceHeats || 0)) : 0;
  const maxSequence = ccmHeats.length > 0 ? Math.max(...ccmHeats.map(h => h.ccmData?.sequenceHeats || 0)) : 0;

  const breaksByShift = SHIFTS.map(shift => ({
    shift,
    breaks: ccmHeats.filter(h => h.shift === shift).reduce((sum, h) => sum + (h.ccmData?.lineBreaks || 0), 0),
  }));

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-l from-purple-600 to-purple-700 text-white">
        <h2 className="text-2xl font-bold">داشبورد ریخته‌گری مداوم (CCM)</h2>
        <p className="text-purple-100 mt-1">تحلیل عملکرد و پارگی خطوط</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="تعداد ذوب‌ها" value={ccmHeats.length.toString()} icon="🔥" color="purple" />
        <StatCard title="مجموع پارگی خطوط" value={totalBreaks.toString()} icon="⚠️" color="red" />
        <StatCard title="کمترین ذوب در سکوئنس" value={minSequence.toString()} icon="📉" color="blue" />
        <StatCard title="بیشترین ذوب در سکوئنس" value={maxSequence.toString()} icon="📈" color="green" />
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📊 پارگی خطوط به تفکیک شیفت</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {breaksByShift.map(b => (
            <div key={b.shift} className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">شیفت {b.shift}</p>
              <p className="text-2xl font-bold text-red-600 mt-2">{b.breaks}</p>
              <p className="text-xs text-gray-500 mt-1">پارگی</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalystDashboard({ heats }: { heats: any[] }) {
  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-l from-indigo-600 to-indigo-700 text-white">
        <h2 className="text-2xl font-bold">داشبورد تحلیل‌گر</h2>
        <p className="text-indigo-100 mt-1">نمای کلی از عملکرد تولید</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="کل ذوب‌ها" value={heats.length.toString()} icon="🔥" color="blue" />
        <StatCard title="EAF تکمیل‌شده" value={heats.filter(h => h.eafStatus === 'completed').length.toString()} icon="⚡" color="yellow" />
        <StatCard title="LF تکمیل‌شده" value={heats.filter(h => h.lfStatus === 'completed').length.toString()} icon="🔧" color="green" />
        <StatCard title="CCM تکمیل‌شده" value={heats.filter(h => h.ccmStatus === 'completed').length.toString()} icon="🏭" color="purple" />
      </div>
    </div>
  );
}

function AdminDashboard({ heats }: { heats: any[] }) {
  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-l from-slate-700 to-slate-800 text-white">
        <h2 className="text-2xl font-bold">داشبورد مدیر سایت</h2>
        <p className="text-slate-300 mt-1">نمای کلی سیستم</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="کل ذوب‌ها" value={heats.length.toString()} icon="🔥" color="blue" />
        <StatCard title="EAF" value={heats.filter(h => h.eafStatus === 'completed').length.toString()} icon="⚡" color="yellow" />
        <StatCard title="LF" value={heats.filter(h => h.lfStatus === 'completed').length.toString()} icon="🔧" color="green" />
        <StatCard title="CCM" value={heats.filter(h => h.ccmStatus === 'completed').length.toString()} icon="🏭" color="purple" />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: string; icon: string; color: string }) {
  const colors: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-amber-500 to-amber-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className="card relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-l ${colors[color]}`}></div>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}

function MaterialCard({ name, value, unit }: { name: string; value: number; unit: string }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <p className="text-sm text-gray-600">{name}</p>
      <p className="text-xl font-bold text-gray-800 mt-1">{value.toLocaleString()}</p>
      <p className="text-xs text-gray-500">{unit}</p>
    </div>
  );
}
