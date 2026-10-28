import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { STEEL_GRADES, SHIFTS, WORKING_GROUPS, PRE_START_STOP_REASONS } from '../data/mockData';

export default function EAFPage() {
  const { heats, addHeat, updateHeat, getNextHeatId } = useData();
  const { user } = useAuth();
  const [selectedHeatId, setSelectedHeatId] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState<any>({
    date: new Date().toLocaleDateString('fa-IR'),
    powerOn: 0,
    powerOff: 0,
    tapToTap: 0,
  });
  const [refractoryCounters, setRefractoryCounters] = useState({ walls: 0, centerPiece: 0, bottom: 0, taphole: 0 });

  useEffect(() => {
    if (selectedHeatId) {
      const heat = heats.find(h => h.heatId === selectedHeatId);
      if (heat && heat.eafData) {
        setFormData(heat.eafData);
      }
    } else {
      setFormData({
        date: new Date().toLocaleDateString('fa-IR'),
        powerOn: 0,
        powerOff: 0,
        tapToTap: 0,
      });
    }
  }, [selectedHeatId, heats]);

  const tabs = [
    { id: 'general', label: 'اطلاعات ذوب' },
    { id: 'refractory', label: 'وضعیت نسوز' },
    { id: 'preStoppages', label: 'توقفات قبل از شروع' },
    { id: 'process', label: 'Process Description' },
    { id: 'stoppages', label: 'توقفات حین کار' },
    { id: 'ladle', label: 'اطلاعات پاتیل' },
    { id: 'electrode', label: 'الکترودها' },
    { id: 'scrap', label: 'سبدهای قراضه' },
    { id: 'additives', label: 'افزودنی‌ها' },
    { id: 'analysis', label: 'آنالیز شیمیایی' },
    { id: 'consumables', label: 'مصرفی‌ها' },
  ];

  const handleSave = () => {
    // Calculate POWER OFF = sum of stoppages + tapping time
    const preStoppagesTotal = (formData.preStoppages || []).reduce((sum: number, s: any) => sum + (s.minutes || 0), 0);
    const duringStoppagesTotal = (formData.stoppages || []).reduce((sum: number, s: any) => sum + (s.minutes || 0), 0);
    const tappingTime = formData.tappingDuration || 0;
    const powerOff = preStoppagesTotal + duringStoppagesTotal + tappingTime;
    
    // Calculate TAP TO TAP = POWER OFF + POWER ON
    const tapToTap = powerOff + (formData.powerOn || 0);

    const updatedData = { ...formData, powerOff, tapToTap };

    if (!selectedHeatId) {
      const newHeatId = getNextHeatId();
      const newHeat = {
        id: Date.now().toString(),
        heatId: newHeatId,
        date: formData.date,
        shift: formData.shift || 'A',
        steelGrade: formData.steelGrade || '4402',
        isSubHeat: false,
        eafStatus: 'completed' as const,
        lfStatus: 'not_started' as const,
        ccmStatus: 'not_started' as const,
        eafData: updatedData,
        warnings: [],
        createdAt: new Date().toLocaleString('fa-IR'),
        updatedAt: new Date().toLocaleString('fa-IR'),
      };
      addHeat(newHeat);
      setSelectedHeatId(newHeatId);
    } else {
      const heat = heats.find(h => h.heatId === selectedHeatId);
      if (heat) {
        updateHeat(heat.id, { eafData: updatedData, eafStatus: 'completed', updatedAt: new Date().toLocaleString('fa-IR') });
      }
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-l from-blue-600 to-blue-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">⚡ کوره قوس الکتریکی (EAF)</h2>
            <p className="text-blue-100 text-sm mt-1">ثبت اطلاعات فرایندی</p>
          </div>
          <div className="flex items-center gap-3">
            <select value={selectedHeatId} onChange={e => setSelectedHeatId(e.target.value)} className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-sm text-white">
              <option value="" className="text-gray-800">ذوب جدید ({getNextHeatId()})</option>
              {heats.filter(h => !h.isSubHeat).map(h => <option key={h.id} value={h.heatId} className="text-gray-800">{h.heatId}</option>)}
            </select>
            <button onClick={handleSave} className="bg-white text-blue-700 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 text-sm">💾 ذخیره</button>
          </div>
        </div>
        {saved && <div className="mt-3 bg-green-500/20 border border-green-300/30 rounded-lg p-2 text-sm text-green-100">✅ اطلاعات ذخیره شد</div>}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex overflow-x-auto border-b bg-gray-50">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div><label className="label-field">تاریخ</label><input type="text" className="input-field" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
              <div><label className="label-field">شیفت</label><select className="input-field" value={formData.shift || ''} onChange={e => setFormData({...formData, shift: e.target.value})}><option value="">انتخاب</option>{SHIFTS.map(s => <option key={s} value={s}>شیفت {s}</option>)}</select></div>
              <div><label className="label-field">Heat ID</label><input type="text" className="input-field" value={selectedHeatId || getNextHeatId()} disabled /></div>
              <div><label className="label-field">گرید فولاد</label><select className="input-field" value={formData.steelGrade || ''} onChange={e => setFormData({...formData, steelGrade: e.target.value})}><option value="">انتخاب</option>{STEEL_GRADES.map(g => <option key={g} value={g}>{g}</option>)}</select></div>
              <div><label className="label-field">POWER ON (دقیقه)</label><input type="number" className="input-field" value={formData.powerOn || 0} onChange={e => setFormData({...formData, powerOn: Number(e.target.value)})} /></div>
              <div><label className="label-field">POWER OFF (دقیقه)</label><input type="number" className="input-field" value={formData.powerOff || 0} readOnly /></div>
              <div><label className="label-field">TAP TO TAP (دقیقه)</label><input type="number" className="input-field" value={formData.tapToTap || 0} readOnly /></div>
              <div><label className="label-field">وزن تخلیه (تن)</label><input type="number" className="input-field" value={formData.tappingWeight || ''} onChange={e => setFormData({...formData, tappingWeight: Number(e.target.value)})} /></div>
              <div><label className="label-field">مدت تخلیه (دقیقه)</label><input type="number" className="input-field" value={formData.tappingDuration || 0} onChange={e => setFormData({...formData, tappingDuration: Number(e.target.value)})} /></div>
              <div><label className="label-field">En.Cou (MWh)</label><input type="number" className="input-field" step="0.1" value={formData.enCou || ''} onChange={e => setFormData({...formData, enCou: Number(e.target.value)})} /></div>
            </div>
          )}

          {activeTab === 'refractory' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { key: 'walls', label: 'Walls — دیواره‌ها' },
                { key: 'centerPiece', label: 'CENTER PIECE - دلتا' },
                { key: 'bottom', label: 'Bottom — کف' },
                { key: 'taphole', label: 'Taphole — مجرای تخلیه' },
              ].map(item => (
                <div key={item.key} className="border border-gray-200 rounded-lg p-4">
                  <label className="label-field">{item.label}</label>
                  <input type="number" className="input-field mb-2" value={(refractoryCounters as any)[item.key] || 0} onChange={e => setRefractoryCounters({...refractoryCounters, [item.key]: Number(e.target.value)})} />
                  <button onClick={() => setRefractoryCounters({...refractoryCounters, [item.key]: 0})} className="text-xs text-red-600 hover:text-red-800">🔄 صفر کردن</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'preStoppages' && <StoppagesTable title="توقفات قبل از شروع" formData={formData} setFormData={setFormData} field="preStoppages" isPreStart={true} />}
          
          {activeTab === 'process' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-700 mb-4">SAMPLE TIME</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div><label className="label-field">Time (HH:MM)</label><input type="time" className="input-field" /></div>
                  <div><label className="label-field">En.Cou (MWh)</label><input type="number" className="input-field" step="0.1" /></div>
                  <div><label className="label-field">Tap</label><input type="number" className="input-field" /></div>
                  <div><label className="label-field">DRI (Ton)</label><input type="number" className="input-field" step="0.1" /></div>
                  <div><label className="label-field">Briquet (Ton)</label><input type="number" className="input-field" step="0.1" /></div>
                  <div><label className="label-field">Dolomite (Kg)</label><input type="number" className="input-field" /></div>
                  <div><label className="label-field">Lime MHU (Kg)</label><input type="number" className="input-field" /></div>
                  <div><label className="label-field">Carbon MHU (Kg)</label><input type="number" className="input-field" /></div>
                  <div><label className="label-field">CPC MHU (Kg)</label><input type="number" className="input-field" /></div>
                  <div><label className="label-field">CPC Injection (Kg)</label><input type="number" className="input-field" /></div>
                  <div><label className="label-field">CH4 (Nm³)</label><input type="number" className="input-field" /></div>
                  <div><label className="label-field">Oxygen (Nm³)</label><input type="number" className="input-field" /></div>
                </div>
              </div>
              <div className="border-t pt-6">
                <h4 className="font-bold text-gray-700 mb-4">Tapping Start</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div><label className="label-field">Time (HH:MM)</label><input type="time" className="input-field" /></div>
                  <div><label className="label-field">En.Cou (MWh)</label><input type="number" className="input-field" step="0.1" /></div>
                  <div><label className="label-field">Tap</label><input type="number" className="input-field" /></div>
                  <div><label className="label-field">DRI (Ton)</label><input type="number" className="input-field" step="0.1" /></div>
                  <div><label className="label-field">Briquet (Ton)</label><input type="number" className="input-field" step="0.1" /></div>
                  <div><label className="label-field">Dolomite (Kg)</label><input type="number" className="input-field" /></div>
                  <div><label className="label-field">Lime MHU (Kg)</label><input type="number" className="input-field" /></div>
                  <div><label className="label-field">Carbon MHU (Kg)</label><input type="number" className="input-field" /></div>
                  <div><label className="label-field">CPC MHU (Kg)</label><input type="number" className="input-field" /></div>
                  <div><label className="label-field">CPC Injection (Kg)</label><input type="number" className="input-field" /></div>
                  <div><label className="label-field">CH4 (Nm³)</label><input type="number" className="input-field" /></div>
                  <div><label className="label-field">Oxygen (Nm³)</label><input type="number" className="input-field" /></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stoppages' && <StoppagesTable title="توقفات حین کار" formData={formData} setFormData={setFormData} field="stoppages" />}
          
          {activeTab === 'ladle' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div><label className="label-field">Ladle Number</label><select className="input-field"><option value="">انتخاب</option>{['1','2','3','4','5','6','7','8','9'].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
              <div><label className="label-field">Request Time</label><input type="time" className="input-field" /></div>
              <div><label className="label-field">Delivery Time</label><input type="time" className="input-field" /></div>
              <div><label className="label-field">Slag Condition</label><input type="number" className="input-field" placeholder="عدد" /></div>
              <div><label className="label-field">Wall Condition</label><input type="number" className="input-field" placeholder="عدد" /></div>
            </div>
          )}

          {activeTab === 'electrode' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['فاز ۱', 'فاز ۲', 'فاز ۳'].map(phase => (
                <div key={phase} className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium mb-3">{phase}</h5>
                  <div className="space-y-2">
                    {['Adjusting — تنظیم', 'Changing — تعویض', 'Breaking — شکستگی'].map(s => (
                      <label key={s} className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded" /><span>{s}</span></label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'scrap' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium mb-3">سبد {i}</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="label-field">Bucket Number</label><input type="text" className="input-field" /></div>
                    <div><label className="label-field">Tonnage (Ton)</label><input type="number" className="input-field" step="0.1" /></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'additives' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {['FeMn', 'FeSiMn', 'FeSi', 'Lime', 'Graphite (CPC)', 'Ca.Al / Al-CaC2'].map(a => (
                <div key={a}><label className="label-field">{a} (Kg)</label><input type="number" className="input-field" /></div>
              ))}
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr><th className="px-3 py-2 text-right text-xs font-medium text-gray-500">نمونه</th>{['C', 'Si', 'Mn', 'P', 'S'].map(e => <th key={e} className="px-3 py-2 text-center text-xs font-medium text-gray-500">{e}%</th>)}</tr></thead>
                <tbody className="divide-y">
                  {['1st', '2nd', '3rd'].map(s => (
                    <tr key={s}><td className="px-3 py-2 font-medium">{s} Sample</td>{['C', 'Si', 'Mn', 'P', 'S'].map(e => <td key={e} className="px-3 py-2"><input type="number" className="input-field w-20 mx-auto text-center" step="0.001" /></td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'consumables' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Thermocouple', 'Sampler', 'Oxy. Probe', 'Taphole Sand'].map(item => (
                <div key={item}><label className="label-field">{item}</label><input type="number" className="input-field" /></div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StoppagesTable({ title, formData, setFormData, field, isPreStart }: any) {
  const [stoppages, setStoppages] = useState<any[]>(Array(7).fill({ from: '', till: '', minutes: 0, workingGroup: '', description: '', reason: '' }));

  const calculateMinutes = (from: string, till: string): number => {
    if (!from || !till) return 0;
    const [fh, fm] = from.split(':').map(Number);
    const [th, tm] = till.split(':').map(Number);
    const fromMin = fh * 60 + fm;
    let tillMin = th * 60 + tm;
    if (tillMin < fromMin) tillMin += 24 * 60;
    return tillMin - fromMin;
  };

  const updateStoppage = (index: number, key: string, value: any) => {
    const newStoppages = [...stoppages];
    newStoppages[index] = { ...newStoppages[index], [key]: value };
    if (key === 'from' || key === 'till') {
      newStoppages[index].minutes = calculateMinutes(newStoppages[index].from, newStoppages[index].till);
    }
    setStoppages(newStoppages);
  };

  return (
    <div>
      <h4 className="font-bold text-gray-700 mb-4">{title}</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr>
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">ردیف</th>
            {isPreStart && <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">علت توقف</th>}
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">From (HH:MM)</th>
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Till (HH:MM)</th>
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Minute</th>
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Working Group</th>
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Description</th>
          </tr></thead>
          <tbody className="divide-y">
            {stoppages.map((s, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                {isPreStart && (
                  <td className="px-3 py-2">
                    <select className="input-field w-40" value={s.reason} onChange={e => updateStoppage(i, 'reason', e.target.value)}>
                      <option value="">انتخاب یا تایپ کنید</option>
                      {PRE_START_STOP_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                      <option value="custom">سایر (تایپ کنید)</option>
                    </select>
                    {s.reason === 'custom' && <input type="text" className="input-field w-40 mt-1" placeholder="علت توقف" />}
                  </td>
                )}
                <td className="px-3 py-2"><input type="time" className="input-field w-28" value={s.from} onChange={e => updateStoppage(i, 'from', e.target.value)} /></td>
                <td className="px-3 py-2"><input type="time" className="input-field w-28" value={s.till} onChange={e => updateStoppage(i, 'till', e.target.value)} /></td>
                <td className="px-3 py-2"><input type="number" className="input-field w-20" value={s.minutes} readOnly /></td>
                <td className="px-3 py-2"><select className="input-field w-40" value={s.workingGroup} onChange={e => updateStoppage(i, 'workingGroup', e.target.value)}><option value="">انتخاب</option>{WORKING_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}</select></td>
                <td className="px-3 py-2"><input type="text" className="input-field w-48" value={s.description} onChange={e => updateStoppage(i, 'description', e.target.value)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
