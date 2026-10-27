import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { STEEL_GRADES, SHIFTS } from '../data/mockData';

const WORKING_GROUPS = [
  'کوره-تولید',
  'کوره-برق',
  'کوره-مکانیک',
  'ریخته‌گری-تولید',
  'ریخته‌گری-مکانیک',
  'ریخته‌گری-برق',
  'انرژی و سیالات',
  'برنامه‌ریزی شده',
  'نسوز',
  'گهرترابر',
  'متریال و هندلینگ',
  'فیوم',
  'پست برق',
  'سایر',
];

export default function LFPage() {
  const { heats, addHeat, updateHeat } = useData();
  const [selectedHeatId, setSelectedHeatId] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const tabs = [
    { id: 'general', label: 'اطلاعات ذوب و شرایط ورود' },
    { id: 'ladle', label: 'وضعیت پاتیل' },
    { id: 'electrode', label: 'الکترودها' },
    { id: 'stoppages', label: 'توقفات' },
    { id: 'process', label: 'داده‌های فرایندی' },
    { id: 'additives', label: 'مواد افزودنی' },
    { id: 'strings', label: 'وضعیت رشته‌ها' },
    { id: 'analysis', label: 'آنالیز شیمیایی' },
    { id: 'argon', label: 'آرگون و پروب' },
    { id: 'delivery', label: 'تحویل به CCM' },
  ];

  const handleSave = () => {
    const heat = heats.find(h => h.heatId === selectedHeatId);
    if (heat) {
      updateHeat(heat.id, { lfData: formData, lfStatus: 'completed', updatedAt: new Date().toLocaleString('fa-IR') });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const calculateMinutes = (from: string, till: string): number => {
    if (!from || !till) return 0;
    const [fh, fm] = from.split(':').map(Number);
    const [th, tm] = till.split(':').map(Number);
    const fromMin = fh * 60 + fm;
    let tillMin = th * 60 + tm;
    if (tillMin < fromMin) tillMin += 24 * 60;
    return tillMin - fromMin;
  };

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-l from-green-600 to-green-700 text-white">
        <div className="flex items-center justify-between">
          <div><h2 className="text-xl font-bold">🔧 کوره پاتیلی (LF)</h2><p className="text-green-100 text-sm mt-1">ثبت اطلاعات فرایندی</p></div>
          <div className="flex items-center gap-3">
            <select value={selectedHeatId} onChange={e => setSelectedHeatId(e.target.value)} className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-sm text-white">
              <option value="" className="text-gray-800">انتخاب ذوب...</option>
              {heats.filter(h => !h.isSubHeat).map(h => <option key={h.id} value={h.heatId} className="text-gray-800">{h.heatId}</option>)}
            </select>
            <button onClick={handleSave} className="bg-white text-green-700 font-medium px-4 py-2 rounded-lg hover:bg-green-50 text-sm">💾 ذخیره</button>
          </div>
        </div>
        {saved && <div className="mt-3 bg-green-500/20 border border-green-300/30 rounded-lg p-2 text-sm text-green-100">✅ اطلاعات ذخیره شد</div>}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex overflow-x-auto border-b bg-gray-50">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:bg-gray-100'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div><label className="label-field">تاریخ</label><input type="text" className="input-field" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
                <div><label className="label-field">شیفت</label><select className="input-field" value={formData.shift || ''} onChange={e => setFormData({...formData, shift: e.target.value})}><option value="">انتخاب</option>{SHIFTS.map(s => <option key={s} value={s}>شیفت {s}</option>)}</select></div>
                <div><label className="label-field">Heat ID</label><input type="text" className="input-field" value={selectedHeatId} disabled /></div>
                <div><label className="label-field">گرید فولاد</label><select className="input-field" value={formData.steelGrade || ''} onChange={e => setFormData({...formData, steelGrade: e.target.value})}><option value="">انتخاب</option>{STEEL_GRADES.map(g => <option key={g} value={g}>{g}</option>)}</select></div>
              </div>
              <div className="border-t pt-6">
                <h4 className="font-bold text-gray-700 mb-4">شرایط مذاب هنگام ورود</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div><label className="label-field">Input Time</label><input type="time" className="input-field" /></div>
                  <div><label className="label-field">Temperature (°C)</label><input type="number" className="input-field" /></div>
                  <div><label className="label-field">PPM (O₂)</label><input type="number" className="input-field" /></div>
                  <div><label className="label-field">Slag Thickness (mm)</label><input type="number" className="input-field" /></div>
                  <div><label className="label-field">Free Board (mm)</label><input type="number" className="input-field" /></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ladle' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div><label className="label-field">Ladle Number</label><select className="input-field"><option value="">انتخاب</option>{['1','2','3','4','5','6','7','8','9'].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
              <div><label className="label-field">Change Ladle</label><select className="input-field"><option value="no">خیر</option><option value="yes">بله</option></select></div>
              <div><label className="label-field">Slag Line Life</label><input type="number" className="input-field" /></div>
              <div><label className="label-field">Ladle Life</label><input type="number" className="input-field" /></div>
              <div><label className="label-field">Transfercar Number</label><input type="text" className="input-field" /></div>
            </div>
          )}

          {activeTab === 'electrode' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['فاز ۱', 'فاز ۲', 'فاز ۳'].map(phase => (
                <div key={phase} className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium mb-3">{phase}</h5>
                  <div className="space-y-2">
                    {['Adjusting', 'Changing', 'Breaking'].map(s => (
                      <label key={s} className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded" /><span>{s}</span></label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'stoppages' && (
            <div className="overflow-x-auto">
              <h4 className="font-bold text-gray-700 mb-4">توقفات LF</h4>
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">ردیف</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">From</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Till</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Minute</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Working Group</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Description</th>
                </tr></thead>
                <tbody className="divide-y">
                  {[1, 2, 3].map(i => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-500">{i}</td>
                      <td className="px-3 py-2"><input type="time" className="input-field w-28" /></td>
                      <td className="px-3 py-2"><input type="time" className="input-field w-28" /></td>
                      <td className="px-3 py-2"><input type="number" className="input-field w-20" readOnly /></td>
                      <td className="px-3 py-2"><select className="input-field w-40"><option value="">انتخاب</option>{WORKING_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}</select></td>
                      <td className="px-3 py-2"><input type="text" className="input-field w-48" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'process' && (
            <div className="overflow-x-auto">
              <h4 className="font-bold text-gray-700 mb-4">داده‌های فرایندی</h4>
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">ردیف</th>
                  <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Time</th>
                  <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Temp</th>
                  <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">PPM</th>
                  <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">En.Cou</th>
                  <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Tap</th>
                  <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">P.on</th>
                  <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Description</th>
                </tr></thead>
                <tbody className="divide-y">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-2 py-2 text-gray-500">{i + 1}</td>
                      <td className="px-2 py-2"><input type="time" className="input-field w-24" /></td>
                      {Array.from({ length: 6 }).map((_, j) => <td key={j} className="px-2 py-2"><input type="number" className="input-field w-20" /></td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'additives' && (
            <div className="overflow-x-auto">
              <h4 className="font-bold text-gray-700 mb-4">مواد افزودنی</h4>
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">ماده</th>
                  {['مقدار ۱', 'مقدار ۲', 'مقدار ۳', 'مقدار ۴'].map(h => <th key={h} className="px-3 py-2 text-right text-xs font-medium text-gray-500">{h} (Kg)</th>)}
                </tr></thead>
                <tbody className="divide-y">
                  {['FeMn', 'FeSiMn', 'FeSi', 'Lime', 'Isoterm', 'Graphite', 'CaC2', 'Ca.Al', 'Graphite Wire', 'Metallurgy Coke', 'CaSi Wire', 'CaFe Wire', 'Boxite', 'Al Wire', 'Deoxidizer'].map(m => (
                    <tr key={m} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium">{m}</td>
                      {[1, 2, 3, 4].map(i => <td key={i} className="px-3 py-2"><input type="number" className="input-field w-24" /></td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'strings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['Line 1', 'Line 2'].map(line => (
                <div key={line} className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium mb-3">{line}</h5>
                  <div className="space-y-2">
                    {['Normal Condition', 'Weak String', 'No String'].map(c => (
                      <label key={c} className="flex items-center gap-2 text-sm"><input type="radio" name={line} className="border-gray-300" /><span>{c}</span></label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="overflow-x-auto">
              <h4 className="font-bold text-gray-700 mb-4">آنالیز شیمیایی</h4>
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">نمونه</th>
                  {['C', 'Si', 'Mn', 'P', 'S', 'Al'].map(e => <th key={e} className="px-3 py-2 text-center text-xs font-medium text-gray-500">{e}%</th>)}
                </tr></thead>
                <tbody className="divide-y">
                  {['5th', '4th', '1st', '2nd', '3rd'].map(s => (
                    <tr key={s}><td className="px-3 py-2 font-medium">{s} Sample</td>{['C', 'Si', 'Mn', 'P', 'S', 'Al'].map(e => <td key={e} className="px-3 py-2"><input type="number" className="input-field w-20 mx-auto text-center" step="0.001" /></td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'argon' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-700 mb-4">مصرف آرگون</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="label-field">Time String</label><input type="time" className="input-field" /></div>
                  <div><label className="label-field">Consumption (Nm³)</label><input type="number" className="input-field" /></div>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-700 mb-4">مصرف پروب</h4>
                <div className="grid grid-cols-3 gap-4">
                  {['Thermocouple', 'Sampler', 'Oxy.Probe'].map(item => (
                    <div key={item}><label className="label-field">{item}</label><input type="number" className="input-field" /></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div><label className="label-field">Delivery Time to CCM</label><input type="time" className="input-field w-64" /></div>
          )}
        </div>
      </div>
    </div>
  );
}
