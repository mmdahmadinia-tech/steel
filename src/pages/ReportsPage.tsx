import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState('production');

  const reports = [
    { id: 'production', label: '📊 گزارش تولید', icon: '📊' },
    { id: 'energy', label: '⚡ گزارش مصرف انرژی', icon: '⚡' },
    { id: 'materials', label: '🧱 گزارش مصرف مواد', icon: '🧱' },
    { id: 'stoppages', label: '⏸️ گزارش توقفات', icon: '⏸️' },
    { id: 'processTimes', label: '⏱️ زمان‌های فرایندی', icon: '⏱️' },
    { id: 'analysis', label: '🧪 آنالیز شیمیایی', icon: '🧪' },
    { id: 'ccm', label: '🏭 عملکرد CCM', icon: '🏭' },
    { id: 'quality', label: '✅ کیفیت و اقدامات', icon: '✅' },
    { id: 'shifts', label: '🔄 مقایسه شیفت‌ها', icon: '🔄' },
    { id: 'trace', label: '🔗 رهگیری ذوب', icon: '🔗' },
  ];

  return (
    <div className="space-y-6">
      {/* Report Selector */}
      <div className="card">
        <div className="flex flex-wrap gap-2">
          {reports.map(r => (
            <button
              key={r.id}
              onClick={() => setActiveReport(r.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeReport === r.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <div>
            <label className="label-field">از تاریخ</label>
            <input type="text" className="input-field" placeholder="1403/09/01" defaultValue="1403/09/01" />
          </div>
          <div>
            <label className="label-field">تا تاریخ</label>
            <input type="text" className="input-field" placeholder="1403/09/16" defaultValue="1403/09/16" />
          </div>
          <div>
            <label className="label-field">شیفت</label>
            <select className="input-field">
              <option value="">همه</option>
              <option>A</option>
              <option>B</option>
              <option>C</option>
            </select>
          </div>
          <div>
            <label className="label-field">گرید</label>
            <select className="input-field">
              <option value="">همه</option>
              <option>St37</option>
              <option>St44</option>
              <option>St52</option>
            </select>
          </div>
          <div>
            <label className="label-field">واحد</label>
            <select className="input-field">
              <option value="">همه واحدها</option>
              <option>EAF</option>
              <option>LF</option>
              <option>CCM</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="btn-primary w-full">اعمال فیلتر</button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="card">
        {activeReport === 'production' && <ProductionReport />}
        {activeReport === 'energy' && <EnergyReport />}
        {activeReport === 'materials' && <MaterialsReport />}
        {activeReport === 'stoppages' && <StoppagesReport />}
        {activeReport === 'processTimes' && <ProcessTimesReport />}
        {activeReport === 'analysis' && <AnalysisReport />}
        {activeReport === 'ccm' && <CCMReport />}
        {activeReport === 'quality' && <QualityReport />}
        {activeReport === 'shifts' && <ShiftsReport />}
        {activeReport === 'trace' && <TraceReport />}
      </div>
    </div>
  );
}

function ProductionReport() {
  const data = [
    { date: '09/10', heats: 4, weight: 340 },
    { date: '09/11', heats: 5, weight: 425 },
    { date: '09/12', heats: 3, weight: 255 },
    { date: '09/13', heats: 6, weight: 510 },
    { date: '09/14', heats: 5, weight: 420 },
    { date: '09/15', heats: 4, weight: 340 },
    { date: '09/16', heats: 5, weight: 430 },
  ];

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">📊 گزارش تولید</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <MiniStat label="تعداد ذوب‌ها" value="32" />
        <MiniStat label="وزن تولیدی" value="2,720 تن" />
        <MiniStat label="میانگین روزانه" value="5.4 ذوب" />
        <MiniStat label="بیشترین تولید" value="510 تن" />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="heats" name="تعداد ذوب" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="weight" name="وزن (تن)" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function EnergyReport() {
  const data = [
    { date: '09/10', consumption: 510 },
    { date: '09/11', consumption: 525 },
    { date: '09/12', consumption: 498 },
    { date: '09/13', consumption: 540 },
    { date: '09/14', consumption: 515 },
    { date: '09/15', consumption: 530 },
    { date: '09/16', consumption: 520 },
  ];

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">⚡ گزارش مصرف انرژی</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <MiniStat label="مصرف کل" value="14,160 MWh" />
        <MiniStat label="میانگین مصرف ویژه" value="520 kWh/t" />
        <MiniStat label="بیشترین مصرف" value="540 kWh/t" />
        <MiniStat label="کمترین مصرف" value="498 kWh/t" />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Area type="monotone" dataKey="consumption" name="مصرف (kWh/t)" stroke="#f59e0b" fill="#fef3c7" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function MaterialsReport() {
  const data = [
    { material: 'DRI', amount: 2850 },
    { material: 'Lime', amount: 1800 },
    { material: 'Dolomite', amount: 950 },
    { material: 'Carbon', amount: 620 },
    { material: 'FeMn', amount: 280 },
    { material: 'FeSi', amount: 150 },
  ];

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">🧱 گزارش مصرف مواد</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">ماده</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">مصرف کل (Kg)</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">مصرف ویژه (Kg/t)</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">روند</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map(d => (
              <tr key={d.material} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{d.material}</td>
                <td className="px-4 py-3">{d.amount.toLocaleString()}</td>
                <td className="px-4 py-3">{(d.amount / 2.72).toFixed(1)}</td>
                <td className="px-4 py-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(d.amount / 2850) * 100}%` }}></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StoppagesReport() {
  const data = [
    { cause: 'مکانیک', count: 5, minutes: 65 },
    { cause: 'برق', count: 3, minutes: 35 },
    { cause: 'بهره‌برداری', count: 4, minutes: 45 },
    { cause: 'ریخته‌گری', count: 2, minutes: 25 },
  ];

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">⏸️ گزارش توقفات</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <MiniStat label="تعداد توقفات" value="14" />
        <MiniStat label="مجموع مدت" value="170 دقیقه" />
        <MiniStat label="میانگین مدت" value="12 دقیقه" />
        <MiniStat label="بیشترین علت" value="مکانیک" />
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="cause" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" name="تعداد" fill="#ef4444" radius={[4, 4, 0, 0]} />
          <Bar dataKey="minutes" name="دقیقه" fill="#f97316" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ProcessTimesReport() {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">⏱️ گزارش زمان‌های فرایندی</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Heat ID</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Power On</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Power Off</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Tap to Tap (min)</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">LF Duration (min)</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">CCM Duration (min)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { id: '1250', on: '08:30', off: '11:30', ttt: 75, lf: 90, ccm: 105 },
              { id: '1251', on: '10:15', off: '13:00', ttt: 80, lf: 85, ccm: '-' },
              { id: '1253', on: '08:00', off: '11:00', ttt: 72, lf: 95, ccm: 110 },
              { id: '1254', on: '16:00', off: '19:15', ttt: 78, lf: 88, ccm: 100 },
            ].map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-bold text-blue-600">{row.id}</td>
                <td className="px-4 py-3">{row.on}</td>
                <td className="px-4 py-3">{row.off}</td>
                <td className="px-4 py-3">{row.ttt}</td>
                <td className="px-4 py-3">{row.lf}</td>
                <td className="px-4 py-3">{row.ccm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnalysisReport() {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">🧪 گزارش آنالیز شیمیایی</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Heat ID</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Grade</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">C%</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">Si%</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">Mn%</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">P%</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">S%</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">Al%</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">وضعیت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { id: '1250', grade: 'St37', c: 0.08, si: 0.25, mn: 0.55, p: 0.02, s: 0.015, al: 0.035, ok: true },
              { id: '1251', grade: 'St52', c: 0.12, si: 0.35, mn: 1.45, p: 0.015, s: 0.010, al: 0.040, ok: true },
              { id: '1253', grade: 'St44', c: 0.10, si: 0.30, mn: 0.80, p: 0.018, s: 0.012, al: 0.030, ok: true },
              { id: '1254', grade: 'St37', c: 0.09, si: 0.22, mn: 0.50, p: 0.025, s: 0.018, al: 0.032, ok: false },
            ].map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 font-bold text-blue-600">{row.id}</td>
                <td className="px-3 py-2">{row.grade}</td>
                <td className="px-3 py-2 text-center">{row.c}</td>
                <td className="px-3 py-2 text-center">{row.si}</td>
                <td className="px-3 py-2 text-center">{row.mn}</td>
                <td className="px-3 py-2 text-center">{row.p}</td>
                <td className="px-3 py-2 text-center">{row.s}</td>
                <td className="px-3 py-2 text-center">{row.al}</td>
                <td className="px-3 py-2">
                  {row.ok ? (
                    <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded-full">✓ منطبق</span>
                  ) : (
                    <span className="text-red-600 text-xs bg-red-100 px-2 py-1 rounded-full">⚠ بررسی</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CCMReport() {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">🏭 گزارش عملکرد CCM</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <MiniStat label="میانگین سرعت" value="1.2 m/min" />
        <MiniStat label="تعداد ذوب‌ها" value="28" />
        <MiniStat label="توقفات" value="4 مورد" />
        <MiniStat label="عیوب گزارش‌شده" value="3 مورد" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">خط</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">سرعت میانگین</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">تعداد ذوب</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">توقفات</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">وضعیت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[1, 2, 3, 4, 5, 6].map(l => (
              <tr key={l} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">خط {l}</td>
                <td className="px-4 py-3">{(1.0 + Math.random() * 0.5).toFixed(2)} m/min</td>
                <td className="px-4 py-3">{Math.floor(3 + Math.random() * 5)}</td>
                <td className="px-4 py-3">{Math.floor(Math.random() * 3)}</td>
                <td className="px-4 py-3">
                  <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded-full">فعال</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function QualityReport() {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">✅ گزارش کیفیت و اقدامات اصلاحی</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Heat ID</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">خط</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">زمان</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">عیب</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">اقدام اصلاحی</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">نتیجه</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { id: '1250', line: 2, time: '14:30', defect: 'ترک سطحی', action: 'تنظیم سرعت', result: 'موفق' },
              { id: '1253', line: 4, time: '12:15', defect: 'ناهمواری', action: 'تعویض تیوب', result: 'موفق' },
              { id: '1254', line: 1, time: '18:00', defect: 'حباب گاز', action: 'بررسی آرگون', result: 'در بررسی' },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-bold text-blue-600">{row.id}</td>
                <td className="px-4 py-3">خط {row.line}</td>
                <td className="px-4 py-3">{row.time}</td>
                <td className="px-4 py-3">{row.defect}</td>
                <td className="px-4 py-3">{row.action}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    row.result === 'موفق' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>{row.result}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ShiftsReport() {
  const data = [
    { metric: 'تعداد ذوب', shiftA: 12, shiftB: 10, shiftC: 10 },
    { metric: 'وزن تولید (تن)', shiftA: 1020, shiftB: 850, shiftC: 850 },
    { metric: 'مصرف انرژی (kWh/t)', shiftA: 515, shiftB: 528, shiftC: 522 },
    { metric: 'توقفات (دقیقه)', shiftA: 45, shiftB: 60, shiftC: 50 },
  ];

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">🔄 گزارش مقایسه شیفت‌ها</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">شاخص</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">شیفت A</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">شیفت B</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">شیفت C</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map(row => (
              <tr key={row.metric} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{row.metric}</td>
                <td className="px-4 py-3 text-center font-bold text-blue-600">{row.shiftA}</td>
                <td className="px-4 py-3 text-center font-bold text-green-600">{row.shiftB}</td>
                <td className="px-4 py-3 text-center font-bold text-purple-600">{row.shiftC}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TraceReport() {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">🔗 گزارش رهگیری کامل ذوب</h3>
      <div className="mb-4">
        <input type="text" className="input-field w-64" placeholder="Heat ID را وارد کنید..." defaultValue="1250" />
      </div>
      <div className="space-y-4">
        <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
          <h4 className="font-bold text-blue-800 mb-2">⚡ EAF — کوره قوس الکتریکی</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div><span className="text-gray-500">شروع:</span> 08:30</div>
            <div><span className="text-gray-500">پایان:</span> 11:30</div>
            <div><span className="text-gray-500">وزن تخلیه:</span> 85 تن</div>
            <div><span className="text-gray-500">انرژی:</span> 42.5 MWh</div>
          </div>
          <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✓ تکمیل‌شده</span>
        </div>
        <div className="border border-green-200 rounded-lg p-4 bg-green-50">
          <h4 className="font-bold text-green-800 mb-2">🔧 LF — کوره پاتیلی</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div><span className="text-gray-500">ورود:</span> 12:00</div>
            <div><span className="text-gray-500">دما ورود:</span> 1620°C</div>
            <div><span className="text-gray-500">تحویل:</span> 13:30</div>
            <div><span className="text-gray-500">مدت:</span> 90 دقیقه</div>
          </div>
          <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✓ تکمیل‌شده</span>
        </div>
        <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
          <h4 className="font-bold text-purple-800 mb-2">🏭 CCM — ریخته‌گری مداوم</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div><span className="text-gray-500">شروع:</span> 13:45</div>
            <div><span className="text-gray-500">پایان:</span> 15:30</div>
            <div><span className="text-gray-500">سرعت:</span> 1.2 m/min</div>
            <div><span className="text-gray-500">توالی:</span> ذوب 3</div>
          </div>
          <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✓ تکمیل‌شده</span>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-bold text-gray-800">{value}</p>
    </div>
  );
}
