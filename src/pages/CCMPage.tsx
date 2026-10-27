import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { STEEL_GRADES, SHIFTS, WORKING_GROUPS } from '../data/mockData';

export default function CCMPage() {
  const { heats, updateHeat } = useData();
  const [selectedHeatId, setSelectedHeatId] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const tabs = [
    { id: 'general', label: 'اطلاعات ذوب' },
    { id: 'lines', label: 'خطوط ریخته‌گری' },
    { id: 'temperatures', label: 'دماها' },
    { id: 'times', label: 'زمان‌های اصلی' },
    { id: 'moldLife', label: 'عمر تیوب قالب' },
    { id: 'breakReport', label: 'شکست خط' },
    { id: 'moldChange', label: 'تعویض قالب' },
    { id: 'ladleReport', label: 'گزارش پاتیل' },
    { id: 'tundish', label: 'گزارش تاندیش' },
    { id: 'quality', label: 'کنترل کیفیت' },
    { id: 'stoppages', label: 'توقفات' },
  ];

  const handleSave = () => {
    const heat = heats.find(h => h.heatId === selectedHeatId);
    if (heat) {
      updateHeat(heat.id, { ccmData: formData, ccmStatus: 'completed', updatedAt: new Date().toLocaleString('fa-IR') });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-l from-purple-600 to-purple-700 text-white">
        <div className="flex items-center justify-between">
          <div><h2 className="text-xl font-bold">🏭 ریخته‌گری مداوم (CCM)</h2><p className="text-purple-100 text-sm mt-1">ثبت اطلاعات فرایندی</p></div>
          <div className="flex items-center gap-3">
            <select value={selectedHeatId} onChange={e => setSelectedHeatId(e.target.value)} className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-sm text-white">
              <option value="" className="text-gray-800">انتخاب ذوب...</option>
              {heats.map(h => <option key={h.id} value={h.heatId} className="text-gray-800">{h.heatId}</option>)}
            </select>
            <button onClick={handleSave} className="bg-white text-purple-700 font-medium px-4 py-2 rounded-lg hover:bg-purple-50 text-sm">💾 ذخیره</button>
          </div>
        </div>
        {saved && <div className="mt-3 bg-purple-500/20 border border-purple-300/30 rounded-lg p-2 text-sm text-purple-100">✅ اطلاعات ذخیره شد</div>}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex overflow-x-auto border-b bg-gray-50">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:bg-gray-100'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div><label className="label-field">تاریخ</label><input type="text" className="input-field" /></div>
              <div><label className="label-field">شیفت</label><select className="input-field"><option value="">انتخاب</option>{SHIFTS.map(s => <option key={s} value={s}>شیفت {s}</option>)}</select></div>
              <div><label className="label-field">Heat ID</label><input type="text" className="input-field" value={selectedHeatId} disabled /></div>
              <div><label className="label-field">گرید فولاد</label><select className="input-field"><option value="">انتخاب</option>{STEEL_GRADES.map(g => <option key={g} value={g}>{g}</option>)}</select></div>
              <div><label className="label-field">Oil Type</label><select className="input-field"><option>نوع A</option><option>نوع B</option></select></div>
              <div><label className="label-field">Ladle Shroud</label><select className="input-field"><option value="yes">بله</option><option value="no">خیر</option></select></div>
              <div><label className="label-field">Avg Casting Speed (m/min)</label><input type="number" className="input-field" step="0.1" /></div>
              <div><label className="label-field">Sequence Cut Reason</label><input type="text" className="input-field" /></div>
            </div>
          )}

          {activeTab === 'lines' && (
            <div className="overflow-x-auto">
              <h4 className="font-bold text-gray-700 mb-4">خطوط ریخته‌گری</h4>
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">خط</th>
                  <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">شروع</th>
                  <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">حالت</th>
                  <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">سرعت</th>
                  <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">قالب</th>
                  <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">پایان</th>
                </tr></thead>
                <tbody className="divide-y">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-2 py-2 font-medium">خط {i + 1}</td>
                      <td className="px-2 py-2"><input type="time" className="input-field w-24" /></td>
                      <td className="px-2 py-2"><select className="input-field w-28"><option value="">—</option><option>Automatic</option><option>Manual</option></select></td>
                      <td className="px-2 py-2"><input type="number" className="input-field w-20" step="0.1" /></td>
                      <td className="px-2 py-2"><input type="text" className="input-field w-20" /></td>
                      <td className="px-2 py-2"><input type="time" className="input-field w-24" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'temperatures' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="label-field">Requested Temp from LF (°C)</label><input type="number" className="input-field" /></div>
                <div><label className="label-field">Sent Temp from LF (°C)</label><input type="number" className="input-field" /></div>
              </div>
              <div>
                <h4 className="font-bold text-gray-700 mb-4">دمای تاندیش</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-600 mb-3">قرائت {i}</h5>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="label-field">Time</label><input type="time" className="input-field" /></div>
                        <div><label className="label-field">Temp (°C)</label><input type="number" className="input-field" /></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'times' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="label-field">Next Heat Request Time</label><input type="time" className="input-field" /></div>
              <div><label className="label-field">Casting Start Time</label><input type="time" className="input-field" /></div>
              <div><label className="label-field">Casting End Time</label><input type="time" className="input-field" /></div>
              <div><label className="label-field">Heat Number in Sequence</label><input type="number" className="input-field" /></div>
            </div>
          )}

          {activeTab === 'moldLife' && (
            <div>
              <h4 className="font-bold text-gray-700 mb-4">عمر تیوب قالب‌ها</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">قالب {i + 1}</p>
                    <input type="number" className="input-field text-center w-full" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'breakReport' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="label-field">Line Number</label><select className="input-field"><option value="">انتخاب</option>{[1,2,3,4,5,6].map(i => <option key={i} value={i}>خط {i}</option>)}</select></div>
              <div><label className="label-field">Break Time</label><input type="time" className="input-field" /></div>
              <div><label className="label-field">Cause</label><select className="input-field"><option value="">انتخاب</option><option>شکست رشته</option><option>گیر کردن مذاب</option><option>مشکل قالب</option></select></div>
            </div>
          )}

          {activeTab === 'moldChange' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div><label className="label-field">Line</label><select className="input-field"><option value="">انتخاب</option>{[1,2,3,4,5,6].map(i => <option key={i} value={i}>خط {i}</option>)}</select></div>
              <div><label className="label-field">Mold Number</label><input type="text" className="input-field" /></div>
              <div><label className="label-field">Number of Heats</label><input type="number" className="input-field" /></div>
              <div><label className="label-field">Cause</label><select className="input-field"><option value="">انتخاب</option><option>پایان عمر</option><option>آسیب</option></select></div>
            </div>
          )}

          {activeTab === 'ladleReport' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div><label className="label-field">Ladle Number</label><input type="text" className="input-field" /></div>
              <div><label className="label-field">Time on Turret</label><input type="time" className="input-field" /></div>
              <div><label className="label-field">Delivered Weight (Ton)</label><input type="number" className="input-field" step="0.1" /></div>
              <div><label className="label-field">Slide Gate Opening</label><input type="time" className="input-field" /></div>
              <div><label className="label-field">Oxygen Lances</label><input type="number" className="input-field" /></div>
              <div><label className="label-field">Returned Weight (Ton)</label><input type="number" className="input-field" step="0.1" /></div>
            </div>
          )}

          {activeTab === 'tundish' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div><label className="label-field">Tundish Car</label><input type="text" className="input-field" /></div>
              <div><label className="label-field">Tundish Number</label><input type="text" className="input-field" /></div>
              <div><label className="label-field">Sequential Heats</label><input type="number" className="input-field" /></div>
              <div><label className="label-field">Residual Weight (Ton)</label><input type="number" className="input-field" step="0.1" /></div>
            </div>
          )}

          {activeTab === 'quality' && (
            <div className="overflow-x-auto">
              <h4 className="font-bold text-gray-700 mb-4">کنترل کیفیت</h4>
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">ردیف</th>
                  <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Line</th>
                  <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Time</th>
                  <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Reporter</th>
                  <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Defect</th>
                  <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Action</th>
                  <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Result</th>
                </tr></thead>
                <tbody className="divide-y">
                  {[1, 2, 3].map(i => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-2 py-2 text-gray-500">{i}</td>
                      <td className="px-2 py-2"><select className="input-field w-16"><option>—</option>{[1,2,3,4,5,6].map(l => <option key={l}>{l}</option>)}</select></td>
                      <td className="px-2 py-2"><input type="time" className="input-field w-24" /></td>
                      <td className="px-2 py-2"><input type="text" className="input-field w-28" /></td>
                      <td className="px-2 py-2"><input type="text" className="input-field w-36" /></td>
                      <td className="px-2 py-2"><input type="text" className="input-field w-36" /></td>
                      <td className="px-2 py-2"><select className="input-field w-24"><option>—</option><option>موفق</option><option>ناموفق</option></select></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'stoppages' && (
            <div className="overflow-x-auto">
              <h4 className="font-bold text-gray-700 mb-4">توقفات CCM</h4>
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">ردیف</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Start</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">End</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Duration</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Responsible</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Description</th>
                </tr></thead>
                <tbody className="divide-y">
                  {[1, 2].map(i => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-500">{i}</td>
                      <td className="px-3 py-2"><input type="time" className="input-field w-28" /></td>
                      <td className="px-3 py-2"><input type="time" className="input-field w-28" /></td>
                      <td className="px-3 py-2"><input type="number" className="input-field w-20" /></td>
                      <td className="px-3 py-2"><select className="input-field w-32"><option>—</option>{WORKING_GROUPS.slice(0, 8).map(g => <option key={g}>{g}</option>)}</select></td>
                      <td className="px-3 py-2"><input type="text" className="input-field w-48" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
