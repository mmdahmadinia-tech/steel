import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { SHIFTS } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area, ScatterChart, Scatter } from 'recharts';
import JalaliDatePicker from '../components/JalaliDatePicker';

export default function DashboardPage() {
  const { user } = useAuth();
  const { heats } = useData();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('fa-IR'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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
  const chartData = filteredHeats.map(h => {
    const eaf = h.eafData || {};
    const materials = eaf.materials || {};
    const tappingMaterials = eaf.tappingMaterials || {};
    
    // Sponge charge (DRI + Briquet)
    const spongeCharge = (materials.dri || 0) + (materials.briquet || 0);
    
    // KWH per ton
    const kwhPerTon = eaf.enCou ? ((eaf.enCou / (eaf.tappingWeight || 1)) * 1000) : 0;
    
    // KWH per metallic charge
    const metallicCharge = spongeCharge + (materials.feMn || 0) + (materials.feSiMn || 0) + (materials.feSi || 0);
    const kwhPerMetallic = eaf.enCou && metallicCharge > 0 ? ((eaf.enCou / metallicCharge) * 1000) : 0;
    
    // Ferroalloys waste (FeMn + FeSiMn + FeSi) / tonnage
    const ferroAlloysTotal = (materials.feMn || 0) + (materials.feSiMn || 0) + (materials.feSi || 0) +
                             (tappingMaterials.feMn || 0) + (tappingMaterials.feSiMn || 0) + (tappingMaterials.feSi || 0);
    const ferroAlloysWaste = eaf.tappingWeight > 0 ? (ferroAlloysTotal / eaf.tappingWeight) : 0;
    
    // Lime waste (lime in furnace + lime in tapping) / tonnage
    const limeTotal = (materials.lime || 0) + (tappingMaterials.lime || 0);
    const limeWaste = eaf.tappingWeight > 0 ? (limeTotal / eaf.tappingWeight) : 0;
    
    // Oxygen waste
    const oxygenTotal = (materials.oxygen || 0) + (tappingMaterials.oxygen || 0);
    const oxygenWaste = eaf.tappingWeight > 0 ? (oxygenTotal / eaf.tappingWeight) : 0;
    
    // PPM
    const ppm = eaf.ppm || 0;
    
    return {
      name: h.heatId,
      spongeCharge,
      kwhPerTon: parseFloat(kwhPerTon.toFixed(2)),
      kwhPerMetallic: parseFloat(kwhPerMetallic.toFixed(2)),
      ferroAlloysWaste: parseFloat(ferroAlloysWaste.toFixed(2)),
      limeWaste: parseFloat(limeWaste.toFixed(2)),
      oxygenWaste: parseFloat(oxygenWaste.toFixed(2)),
      ppm,
      tonnage: eaf.tappingWeight || 0,
    };
  });

  // Material totals
  const materials = filteredHeats.reduce((acc, h) => {
    const m = h.eafData?.materials || {};
    const t = h.eafData?.tappingMaterials || {};
    return {
      dri: (acc.dri || 0) + (m.dri || 0),
      briquet: (acc.briquet || 0) + (m.briquet || 0),
      feMn: (acc.feMn || 0) + (m.feMn || 0) + (t.feMn || 0),
      feSiMn: (acc.feSiMn || 0) + (m.feSiMn || 0) + (t.feSiMn || 0),
      feSi: (acc.feSi || 0) + (m.feSi || 0) + (t.feSi || 0),
      lime: (acc.lime || 0) + (m.lime || 0) + (t.lime || 0),
      carbon: (acc.carbon || 0) + (m.carbon || 0) + (t.carbon || 0),
      cpcInjection: (acc.cpcInjection || 0) + (m.cpcInjection || 0) + (t.cpcInjection || 0),
      oxygen: (acc.oxygen || 0) + (m.oxygen || 0) + (t.oxygen || 0),
    };
  }, {} as any);

  const totalFerroAlloys = (materials.feMn || 0) + (materials.feSiMn || 0) + (materials.feSi || 0);
  const avgFerroAlloys = totalHeats > 0 ? (totalFerroAlloys / totalHeats).toFixed(0) : '0';
  const ferroAlloysWaste = totalTonnage > 0 ? ((totalFerroAlloys / totalTonnage) * 1000).toFixed(2) : '0';

  const exportToExcel = () => {
    const headers = ['Heat ID', 'Date', 'Shift', 'Tonnage', 'KWH/T', 'Power On', 'Tap to Tap', 'Sponge Charge', 'KWH/Metallic', 'Ferro Alloys Waste', 'Lime Waste', 'Oxygen Waste', 'PPM'];
    const rows = chartData.map(d => [
      d.name, filteredHeats.find(h => h.heatId === d.name)?.date, filteredHeats.find(h => h.heatId === d.name)?.shift,
      d.tonnage, d.kwhPerTon, filteredHeats.find(h => h.heatId === d.name)?.eafData?.powerOn,
      filteredHeats.find(h => h.heatId === d.name)?.eafData?.tapToTap, d.spongeCharge, d.kwhPerMetallic,
      d.ferroAlloysWaste, d.limeWaste, d.oxygenWaste, d.ppm
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `eaf_dashboard_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <title>گزارش داشبورد EAF</title>
        <style>
          body { font-family: Tahoma, sans-serif; padding: 20px; direction: rtl; }
          h1 { color: #1e40af; text-align: center; }
          .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0; }
          .stat { border: 2px solid #3b82f6; padding: 15px; border-radius: 8px; text-align: center; }
          .stat-title { font-size: 12px; color: #666; }
          .stat-value { font-size: 24px; font-weight: bold; color: #1e40af; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
          th { background: #3b82f6; color: white; }
          tr:nth-child(even) { background: #f9f9f9; }
        </style>
      </head>
      <body>
        <h1>گزارش داشبورد کوره قوس الکتریکی (EAF)</h1>
        <p style="text-align: center; color: #666;">تاریخ گزارش: ${new Date().toLocaleDateString('fa-IR')}</p>
        <div class="stats">
          <div class="stat"><div class="stat-title">تعداد ذوب‌ها</div><div class="stat-value">${totalHeats}</div></div>
          <div class="stat"><div class="stat-title">کل تناژ</div><div class="stat-value">${totalTonnage} تن</div></div>
          <div class="stat"><div class="stat-title">میانگین KWH/T</div><div class="stat-value">${avgKWHPerTon}</div></div>
          <div class="stat"><div class="stat-title">میانگین Power On</div><div class="stat-value">${avgPowerOn} دقیقه</div></div>
          <div class="stat"><div class="stat-title">میانگین TAP TO TAP</div><div class="stat-value">${avgTapToTap} دقیقه</div></div>
          <div class="stat"><div class="stat-title">جمع فروآلیاژها</div><div class="stat-value">${totalFerroAlloys} Kg</div></div>
        </div>
        <h2>جزئیات ذوب‌ها</h2>
        <table>
          <thead>
            <tr>
              <th>Heat ID</th><th>تناژ</th><th>KWH/T</th><th>شارژ اسفنجی</th>
              <th>KWH/Metallic</th><th>پرتن فروآلیاژ</th><th>پرتن Lime</th><th>پرتن اکسیژن</th><th>PPM</th>
            </tr>
          </thead>
          <tbody>
            ${chartData.map(d => `
              <tr>
                <td>${d.name}</td><td>${d.tonnage}</td><td>${d.kwhPerTon}</td><td>${d.spongeCharge}</td>
                <td>${d.kwhPerMetallic}</td><td>${d.ferroAlloysWaste}</td><td>${d.limeWaste}</td>
                <td>${d.oxygenWaste}</td><td>${d.ppm}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
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
          <JalaliDatePicker label="تاریخ شروع" value={filterDateStart} onChange={setFilterDateStart} />
          <JalaliDatePicker label="تاریخ پایان" value={filterDateEnd} onChange={setFilterDateEnd} />
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
          <h3 className="text-lg font-bold text-gray-800 mb-4">📊 نمودار شارژ اسفنجی</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="spongeCharge" name="شارژ اسفنجی (تن)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">⚡ مصرف انرژی KWH/مذاب تخلیه</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="kwhPerTon" name="KWH/T" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">⚡ مصرف انرژی/متالیک شارژ</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="kwhPerMetallic" name="KWH/Metallic" stroke="#8b5cf6" fill="#ede9fe" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🧱 پرتن فروآلیاژ (نقطه‌ای)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" name="ذوب" tick={{ fontSize: 12 }} />
              <YAxis dataKey="ferroAlloysWaste" name="Kg/T" tick={{ fontSize: 12 }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="پرتن فروآلیاژ" data={chartData} fill="#ef4444" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🧱 پرتن LIME</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="limeWaste" name="پرتن LIME (Kg/T)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">💨 پرتن اکسیژن</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="oxygenWaste" name="پرتن اکسیژن (Nm³/T)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🔬 PPM تخلیه</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="ppm" name="PPM" stroke="#ec4899" strokeWidth={2} dot={{ fill: '#ec4899', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Materials with Total + Average + Waste */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📊 پرتن مصرفی مواد (جمع کل + میانگین + پرتن)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MaterialCardAdvanced name="FeMn" total={materials.feMn || 0} avg={totalHeats > 0 ? ((materials.feMn || 0) / totalHeats).toFixed(0) : '0'} waste={totalTonnage > 0 ? (((materials.feMn || 0) / totalTonnage) * 1000).toFixed(2) : '0'} unit="Kg" />
          <MaterialCardAdvanced name="FeSiMn" total={materials.feSiMn || 0} avg={totalHeats > 0 ? ((materials.feSiMn || 0) / totalHeats).toFixed(0) : '0'} waste={totalTonnage > 0 ? (((materials.feSiMn || 0) / totalTonnage) * 1000).toFixed(2) : '0'} unit="Kg" />
          <MaterialCardAdvanced name="FeSi" total={materials.feSi || 0} avg={totalHeats > 0 ? ((materials.feSi || 0) / totalHeats).toFixed(0) : '0'} waste={totalTonnage > 0 ? (((materials.feSi || 0) / totalTonnage) * 1000).toFixed(2) : '0'} unit="Kg" />
          <MaterialCardAdvanced name="Lime" total={materials.lime || 0} avg={totalHeats > 0 ? ((materials.lime || 0) / totalHeats).toFixed(0) : '0'} waste={totalTonnage > 0 ? (((materials.lime || 0) / totalTonnage) * 1000).toFixed(2) : '0'} unit="Kg" />
          <MaterialCardAdvanced name="Carbon" total={materials.carbon || 0} avg={totalHeats > 0 ? ((materials.carbon || 0) / totalHeats).toFixed(0) : '0'} waste={totalTonnage > 0 ? (((materials.carbon || 0) / totalTonnage) * 1000).toFixed(2) : '0'} unit="Kg" />
          <MaterialCardAdvanced name="CPC Injection" total={materials.cpcInjection || 0} avg={totalHeats > 0 ? ((materials.cpcInjection || 0) / totalHeats).toFixed(0) : '0'} waste={totalTonnage > 0 ? (((materials.cpcInjection || 0) / totalTonnage) * 1000).toFixed(2) : '0'} unit="Kg" />
          <MaterialCardAdvanced name="Oxygen" total={materials.oxygen || 0} avg={totalHeats > 0 ? ((materials.oxygen || 0) / totalHeats).toFixed(0) : '0'} waste={totalTonnage > 0 ? (((materials.oxygen || 0) / totalTonnage) * 1000).toFixed(2) : '0'} unit="Nm³" />
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
    blue: 'from-blue-500 to-blue-600', green: 'from-green-500 to-green-600',
    yellow: 'from-amber-500 to-amber-600', red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600', orange: 'from-orange-500 to-orange-600',
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

function MaterialCardAdvanced({ name, total, avg, waste, unit }: { name: string; total: number; avg: string; waste: string; unit: string }) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-4">
      <p className="text-sm font-bold text-gray-700 mb-2">{name}</p>
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">جمع کل:</span>
          <span className="font-bold text-blue-600">{total.toLocaleString()} {unit}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">میانگین:</span>
          <span className="font-bold text-green-600">{Number(avg).toLocaleString()} {unit}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">پرتن:</span>
          <span className="font-bold text-red-600">{waste} {unit}/T</span>
        </div>
      </div>
    </div>
  );
}
