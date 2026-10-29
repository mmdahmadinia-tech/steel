import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { STEEL_GRADES, SHIFTS, WORKING_GROUPS } from '../data/mockData';
import { getToday, toFa, padFa } from '../components/JalaliDatePicker';
import TimeInput24h from '../components/TimeInput24h';

function calcMinutes(from: string, till: string): number {
  if (!from || !till) return 0;
  const [fh, fm] = from.split(':').map(Number);
  const [th, tm] = till.split(':').map(Number);
  const fromMin = fh * 60 + fm;
  let tillMin = th * 60 + tm;
  if (tillMin < fromMin) tillMin += 24 * 60;
  return tillMin - fromMin;
}

function getTodayJalali(): string {
  const t = getToday();
  return `${t.jy}/${padFa(t.jm).replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))}/${padFa(t.jd).replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))}`;
}

export default function LFPage() {
  const { heats, updateHeat } = useData();
  const { user } = useAuth();
  
  const [selectedHeatId, setSelectedHeatId] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [saveMessage, setSaveMessage] = useState('');

  // All form data in ONE state object to prevent data loss
  const [form, setForm] = useState<any>({
    date: getTodayJalali(),
    shift: 'A',
    steelGrade: '',
    // Ladle status
    ladleNumber: '', changeLadle: 'no', slagLineLife: 0, ladleLife: 0, transfercarNumber: '',
    // Input condition
    inputTime: '', inputTemperature: 0, ppm: 0, slagThickness: 0, freeBoard: 0,
    // Electrode
    phase1: [] as string[], phase2: [] as string[], phase3: [] as string[],
    // Stoppages
    stoppages: Array(3).fill(null).map(() => ({ from: '', till: '', minutes: 0, workingGroup: '', description: '' })),
    // Process data
    processData: Array(9).fill(null).map(() => ({ time: '', temp: 0, ppm: 0, enCou: 0, tap: 0, pOn: 0, description: '' })),
    // Additives
    additives: {
      feMn: [0, 0, 0, 0], feSiMn: [0, 0, 0, 0], feSi: [0, 0, 0, 0],
      lime: [0, 0, 0, 0], isoterm: [0, 0, 0, 0], graphite: [0, 0, 0, 0],
      caC2: [0, 0, 0, 0], caAl: [0, 0, 0, 0], graphiteWire: [0, 0, 0, 0],
      metallurgyCoke: [0, 0, 0, 0], caSiWire: [0, 0, 0, 0], caFeWire: [0, 0, 0, 0],
      boxite: [0, 0, 0, 0], alWire: [0, 0, 0, 0], deoxidizer: [0, 0, 0, 0],
    },
    // String status (now called دمش)
    line1: 'Normal Condition', line2: 'Normal Condition',
    // Tap lance
    tapLance1: '', tapLance2: '',
    // Chemical analysis
    sample1: { c: 0, si: 0, mn: 0, p: 0, s: 0, al: 0 },
    sample2: { c: 0, si: 0, mn: 0, p: 0, s: 0, al: 0 },
    sample3: { c: 0, si: 0, mn: 0, p: 0, s: 0, al: 0 },
    sample4: { c: 0, si: 0, mn: 0, p: 0, s: 0, al: 0 },
    sample5: { c: 0, si: 0, mn: 0, p: 0, s: 0, al: 0 },
    // Probe consumption
    thermocouple: 0, sampler: 0, oxyProbe: 0,
    // Argon
    timeString: 0, argonConsumption: 0,
    // Delivery to CCM
    deliveryTimeToCCM: '',
    // Notes
    recordingOperator: '', shiftSupervisor: '', supervisorNotes: '',
  });

  // Load data when heat is selected
  useEffect(() => {
    if (selectedHeatId) {
      const heat = heats.find(h => h.heatId === selectedHeatId);
      if (heat && heat.lfData) {
        const d = heat.lfData as any;
        setForm({
          date: d.date || getTodayJalali(),
          shift: d.shift || 'A',
          steelGrade: heat.steelGrade || '',
          ladleNumber: d.ladleStatus?.ladleNumber || '',
          changeLadle: d.ladleStatus?.changeLadle || 'no',
          slagLineLife: d.ladleStatus?.slagLineLife || 0,
          ladleLife: d.ladleStatus?.ladleLife || 0,
          transfercarNumber: d.ladleStatus?.transfercarNumber || '',
          inputTime: d.inputCondition?.inputTime || '',
          inputTemperature: d.inputCondition?.inputTemperature || 0,
          ppm: d.inputCondition?.ppm || 0,
          slagThickness: d.inputCondition?.slagThickness || 0,
          freeBoard: d.inputCondition?.freeBoard || 0,
          phase1: d.electrodeStatus?.phase1 || [],
          phase2: d.electrodeStatus?.phase2 || [],
          phase3: d.electrodeStatus?.phase3 || [],
          stoppages: d.stoppages || Array(3).fill(null).map(() => ({ from: '', till: '', minutes: 0, workingGroup: '', description: '' })),
          processData: d.processData || Array(9).fill(null).map(() => ({ time: '', temp: 0, ppm: 0, enCou: 0, tap: 0, pOn: 0, description: '' })),
          additives: d.additives || {
            feMn: [0, 0, 0, 0], feSiMn: [0, 0, 0, 0], feSi: [0, 0, 0, 0],
            lime: [0, 0, 0, 0], isoterm: [0, 0, 0, 0], graphite: [0, 0, 0, 0],
            caC2: [0, 0, 0, 0], caAl: [0, 0, 0, 0], graphiteWire: [0, 0, 0, 0],
            metallurgyCoke: [0, 0, 0, 0], caSiWire: [0, 0, 0, 0], caFeWire: [0, 0, 0, 0],
            boxite: [0, 0, 0, 0], alWire: [0, 0, 0, 0], deoxidizer: [0, 0, 0, 0],
          },
          line1: d.stringStatus?.line1 || 'Normal Condition',
          line2: d.stringStatus?.line2 || 'Normal Condition',
          tapLance1: d.tapLanceTimes?.[0] || '',
          tapLance2: d.tapLanceTimes?.[1] || '',
          sample1: d.chemicalAnalysis?.sample1 || { c: 0, si: 0, mn: 0, p: 0, s: 0, al: 0 },
          sample2: d.chemicalAnalysis?.sample2 || { c: 0, si: 0, mn: 0, p: 0, s: 0, al: 0 },
          sample3: d.chemicalAnalysis?.sample3 || { c: 0, si: 0, mn: 0, p: 0, s: 0, al: 0 },
          sample4: d.chemicalAnalysis?.sample4 || { c: 0, si: 0, mn: 0, p: 0, s: 0, al: 0 },
          sample5: d.chemicalAnalysis?.sample5 || { c: 0, si: 0, mn: 0, p: 0, s: 0, al: 0 },
          thermocouple: d.probeConsumption?.thermocouple || 0,
          sampler: d.probeConsumption?.sampler || 0,
          oxyProbe: d.probeConsumption?.oxyProbe || 0,
          timeString: d.argonConsumption?.timeString || 0,
          argonConsumption: d.argonConsumption?.consumption || 0,
          deliveryTimeToCCM: d.deliveryTimeToCCM || '',
          recordingOperator: d.recordingOperator || '',
          shiftSupervisor: d.shiftSupervisor || '',
          supervisorNotes: d.supervisorNotes || '',
        });
      }
    } else {
      // New heat - auto-fill date and grade from EAF
      setForm({
        date: getTodayJalali(),
        shift: 'A',
        steelGrade: '',
        ladleNumber: '', changeLadle: 'no', slagLineLife: 0, ladleLife: 0, transfercarNumber: '',
        inputTime: '', inputTemperature: 0, ppm: 0, slagThickness: 0, freeBoard: 0,
        phase1: [], phase2: [], phase3: [],
        stoppages: Array(3).fill(null).map(() => ({ from: '', till: '', minutes: 0, workingGroup: '', description: '' })),
        processData: Array(9).fill(null).map(() => ({ time: '', temp: 0, ppm: 0, enCou: 0, tap: 0, pOn: 0, description: '' })),
        additives: {
          feMn: [0, 0, 0, 0], feSiMn: [0, 0, 0, 0], feSi: [0, 0, 0, 0],
          lime: [0, 0, 0, 0], isoterm: [0, 0, 0, 0], graphite: [0, 0, 0, 0],
          caC2: [0, 0, 0, 0], caAl: [0, 0, 0, 0], graphiteWire: [0, 0, 0, 0],
          metallurgyCoke: [0, 0, 0, 0], caSiWire: [0, 0, 0, 0], caFeWire: [0, 0, 0, 0],
          boxite: [0, 0, 0, 0], alWire: [0, 0, 0, 0], deoxidizer: [0, 0, 0, 0],
        },
        line1: 'Normal Condition', line2: 'Normal Condition',
        tapLance1: '', tapLance2: '',
        sample1: { c: 0, si: 0, mn: 0, p: 0, s: 0, al: 0 },
        sample2: { c: 0, si: 0, mn: 0, p: 0, s: 0, al: 0 },
        sample3: { c: 0, si: 0, mn: 0, p: 0, s: 0, al: 0 },
        sample4: { c: 0, si: 0, mn: 0, p: 0, s: 0, al: 0 },
        sample5: { c: 0, si: 0, mn: 0, p: 0, s: 0, al: 0 },
        thermocouple: 0, sampler: 0, oxyProbe: 0,
        timeString: 0, argonConsumption: 0,
        deliveryTimeToCCM: '',
        recordingOperator: '', shiftSupervisor: '', supervisorNotes: '',
      });
    }
  }, [selectedHeatId, heats]);

  // Auto-fill grade when heat is selected
  useEffect(() => {
    if (selectedHeatId) {
      const heat = heats.find(h => h.heatId === selectedHeatId);
      if (heat && heat.steelGrade) {
        setForm((prev: any) => ({ ...prev, steelGrade: heat.steelGrade }));
      }
    }
  }, [selectedHeatId, heats]);

  // Calculate total additives
  const additivesTotal = useMemo(() => {
    const totals: any = {};
    Object.keys(form.additives).forEach(key => {
      totals[key] = form.additives[key].reduce((sum: number, val: number) => sum + val, 0);
    });
    return totals;
  }, [form.additives]);

  const updateStoppage = (index: number, key: string, value: any) => {
    const newStoppages = [...form.stoppages];
    newStoppages[index] = { ...newStoppages[index], [key]: value };
    if (key === 'from' || key === 'till') {
      newStoppages[index].minutes = calcMinutes(newStoppages[index].from, newStoppages[index].till);
    }
    setForm({ ...form, stoppages: newStoppages });
  };

  const updateProcessData = (index: number, key: string, value: any) => {
    const newProcessData = [...form.processData];
    newProcessData[index] = { ...newProcessData[index], [key]: value };
    setForm({ ...form, processData: newProcessData });
  };

  const updateAdditive = (material: string, index: number, value: number) => {
    const newAdditives = { ...form.additives };
    newAdditives[material] = [...newAdditives[material]];
    newAdditives[material][index] = value;
    setForm({ ...form, additives: newAdditives });
  };

  const handleSave = () => {
    const lfData = {
      date: form.date,
      shift: form.shift,
      steelGrade: form.steelGrade,
      ladleStatus: {
        ladleNumber: form.ladleNumber,
        changeLadle: form.changeLadle,
        slagLineLife: form.slagLineLife,
        ladleLife: form.ladleLife,
        transfercarNumber: form.transfercarNumber,
      },
      inputCondition: {
        inputTime: form.inputTime,
        inputTemperature: form.inputTemperature,
        ppm: form.ppm,
        slagThickness: form.slagThickness,
        freeBoard: form.freeBoard,
      },
      electrodeStatus: { phase1: form.phase1, phase2: form.phase2, phase3: form.phase3 },
      stoppages: form.stoppages,
      processData: form.processData,
      additives: form.additives,
      stringStatus: { line1: form.line1, line2: form.line2 },
      tapLanceTimes: [form.tapLance1, form.tapLance2],
      chemicalAnalysis: {
        sample1: form.sample1, sample2: form.sample2, sample3: form.sample3,
        sample4: form.sample4, sample5: form.sample5,
      },
      probeConsumption: {
        thermocouple: form.thermocouple,
        sampler: form.sampler,
        oxyProbe: form.oxyProbe,
      },
      argonConsumption: {
        timeString: form.timeString,
        consumption: form.argonConsumption,
      },
      deliveryTimeToCCM: form.deliveryTimeToCCM,
      recordingOperator: form.recordingOperator,
      shiftSupervisor: form.shiftSupervisor,
      supervisorNotes: form.supervisorNotes,
    };

    const heat = heats.find(h => h.heatId === selectedHeatId);
    if (heat) {
      updateHeat(heat.id, { lfData, lfStatus: 'completed', updatedAt: new Date().toLocaleString('fa-IR') });
      setSaveMessage(`✅ ذوب ${selectedHeatId} با موفقیت ذخیره شد`);
    } else {
      setSaveMessage('⚠️ لطفاً یک ذوب را انتخاب کنید');
    }
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const tabs = [
    { id: 'general', label: 'اطلاعات ذوب و شرایط ورود' },
    { id: 'ladle', label: 'وضعیت پاتیل' },
    { id: 'electrode', label: 'الکترودها' },
    { id: 'stoppages', label: 'توقفات' },
    { id: 'process', label: 'داده‌های فرایندی' },
    { id: 'additives', label: 'مواد افزودنی' },
    { id: 'strings', label: 'وضعیت دمش‌ها' },
    { id: 'analysis', label: 'آنالیز شیمیایی' },
    { id: 'argon', label: 'آرگون و پروب' },
    { id: 'delivery', label: 'تحویل به CCM' },
  ];

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-l from-green-600 to-green-700 text-white">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold">🔧 کوره پاتیلی (LF)</h2>
            <p className="text-green-100 text-sm mt-1">ثبت اطلاعات فرایندی</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <select value={selectedHeatId} onChange={e => setSelectedHeatId(e.target.value)} className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-sm text-white">
              <option value="" className="text-gray-800">انتخاب ذوب...</option>
              {heats.filter(h => !h.isSubHeat && h.eafStatus === 'completed').map(h => (
                <option key={h.id} value={h.heatId} className="text-gray-800">{h.heatId} - {h.date} - {h.steelGrade}</option>
              ))}
            </select>
            <button onClick={handleSave} className="bg-white text-green-700 font-bold px-4 py-2 rounded-lg hover:bg-green-50 text-sm">💾 ذخیره</button>
          </div>
        </div>
        {saveMessage && <div className="mt-3 bg-green-500/20 border border-green-300/30 rounded-lg p-2 text-sm text-green-100">{saveMessage}</div>}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex overflow-x-auto border-b bg-gray-50">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-white text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:bg-gray-100'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="label-field">تاریخ (شمسی)</label>
                  <input type="text" className="input-field" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                </div>
                <div>
                  <label className="label-field">شیفت</label>
                  <select className="input-field" value={form.shift} onChange={e => setForm({...form, shift: e.target.value})}>
                    {SHIFTS.map(s => <option key={s} value={s}>شیفت {s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-field">Heat ID</label>
                  <input type="text" className="input-field bg-gray-100" value={selectedHeatId || ''} disabled />
                </div>
                <div>
                  <label className="label-field">گرید فولاد</label>
                  <input type="text" className="input-field bg-gray-100" value={form.steelGrade} disabled placeholder="خودکار از EAF" />
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h4 className="font-bold text-gray-700 mb-4">شرایط مذاب هنگام ورود</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <TimeInput24h label="Input Time" value={form.inputTime} onChange={(val) => setForm({...form, inputTime: val})} />
                  <div>
                    <label className="label-field">Temperature (°C)</label>
                    <input type="number" className="input-field" value={form.inputTemperature} onChange={e => setForm({...form, inputTemperature: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="label-field">PPM (O₂)</label>
                    <input type="number" className="input-field" value={form.ppm} onChange={e => setForm({...form, ppm: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="label-field">Slag Thickness (mm)</label>
                    <input type="number" className="input-field" value={form.slagThickness} onChange={e => setForm({...form, slagThickness: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="label-field">Free Board (mm)</label>
                    <input type="number" className="input-field" value={form.freeBoard} onChange={e => setForm({...form, freeBoard: Number(e.target.value)})} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ladle' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="label-field">Ladle Number</label>
                <select className="input-field" value={form.ladleNumber} onChange={e => setForm({...form, ladleNumber: e.target.value})}>
                  <option value="">انتخاب</option>
                  {['1','2','3','4','5','6','7','8','9'].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="label-field">Change Ladle</label>
                <select className="input-field" value={form.changeLadle} onChange={e => setForm({...form, changeLadle: e.target.value})}>
                  <option value="no">خیر</option>
                  <option value="yes">بله</option>
                </select>
              </div>
              <div>
                <label className="label-field">Slag Line Life</label>
                <input type="number" className="input-field" value={form.slagLineLife} onChange={e => setForm({...form, slagLineLife: Number(e.target.value)})} />
              </div>
              <div>
                <label className="label-field">Ladle Life</label>
                <input type="number" className="input-field" value={form.ladleLife} onChange={e => setForm({...form, ladleLife: Number(e.target.value)})} />
              </div>
              <div>
                <label className="label-field">Transfercar Number</label>
                <input type="text" className="input-field" value={form.transfercarNumber} onChange={e => setForm({...form, transfercarNumber: e.target.value})} />
              </div>
            </div>
          )}

          {activeTab === 'electrode' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['phase1', 'phase2', 'phase3'] as const).map((phase, idx) => (
                <div key={phase} className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium mb-3">فاز {idx + 1}</h5>
                  <div className="space-y-2">
                    {['Adjusting — تنظیم', 'Changing — تعویض', 'Breaking — شکستگی'].map(s => (
                      <label key={s} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded" checked={(form as any)[phase].includes(s)} onChange={e => {
                          const arr = (form as any)[phase];
                          const newArr = e.target.checked ? [...arr, s] : arr.filter((x: string) => x !== s);
                          setForm({...form, [phase]: newArr});
                        }} />
                        <span>{s}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'stoppages' && (
            <div>
              <h4 className="font-bold text-gray-700 mb-4">توقفات LF</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50"><tr>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">ردیف</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">From (24h)</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Till (24h)</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Minute</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Working Group</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Description</th>
                  </tr></thead>
                  <tbody className="divide-y">
                    {form.stoppages.map((s: any, i: number) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                        <td className="px-3 py-2"><TimeInput24h value={s.from} onChange={(val) => updateStoppage(i, 'from', val)} /></td>
                        <td className="px-3 py-2"><TimeInput24h value={s.till} onChange={(val) => updateStoppage(i, 'till', val)} /></td>
                        <td className="px-3 py-2"><input type="number" className="input-field w-20 bg-gray-100" value={s.minutes} readOnly /></td>
                        <td className="px-3 py-2">
                          <select className="input-field w-40" value={s.workingGroup} onChange={e => updateStoppage(i, 'workingGroup', e.target.value)}>
                            <option value="">انتخاب</option>
                            {WORKING_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                          </select>
                        </td>
                        <td className="px-3 py-2"><input type="text" className="input-field w-48" value={s.description} onChange={e => updateStoppage(i, 'description', e.target.value)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'process' && (
            <div>
              <h4 className="font-bold text-gray-700 mb-4">داده‌های فرایندی</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50"><tr>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">ردیف</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Time (24h)</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Temp (°C)</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">PPM</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">En.Cou</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Tap</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">P.on</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Description</th>
                  </tr></thead>
                  <tbody className="divide-y">
                    {form.processData.map((p: any, i: number) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-2 py-2 text-gray-500">{i + 1}</td>
                        <td className="px-2 py-2"><TimeInput24h value={p.time} onChange={(val) => updateProcessData(i, 'time', val)} /></td>
                        <td className="px-2 py-2"><input type="number" className="input-field w-20" value={p.temp} onChange={e => updateProcessData(i, 'temp', Number(e.target.value))} /></td>
                        <td className="px-2 py-2"><input type="number" className="input-field w-20" value={p.ppm} onChange={e => updateProcessData(i, 'ppm', Number(e.target.value))} /></td>
                        <td className="px-2 py-2"><input type="number" step="0.1" className="input-field w-20" value={p.enCou} onChange={e => updateProcessData(i, 'enCou', Number(e.target.value))} /></td>
                        <td className="px-2 py-2"><input type="number" className="input-field w-16" value={p.tap} onChange={e => updateProcessData(i, 'tap', Number(e.target.value))} /></td>
                        <td className="px-2 py-2"><input type="number" className="input-field w-16" value={p.pOn} onChange={e => updateProcessData(i, 'pOn', Number(e.target.value))} /></td>
                        <td className="px-2 py-2"><input type="text" className="input-field w-36" value={p.description} onChange={e => updateProcessData(i, 'description', e.target.value)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'additives' && (
            <div>
              <h4 className="font-bold text-gray-700 mb-4">مواد افزودنی</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50"><tr>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">ماده</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">مقدار ۱ (Kg)</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">مقدار ۲ (Kg)</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">مقدار ۳ (Kg)</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">مقدار ۴ (Kg)</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 bg-green-50">جمع کل (Kg)</th>
                  </tr></thead>
                  <tbody className="divide-y">
                    {Object.entries({
                      feMn: 'FeMn', feSiMn: 'FeSiMn', feSi: 'FeSi', lime: 'Lime',
                      isoterm: 'Isoterm', graphite: 'Graphite (CPC)', caC2: 'CaC2',
                      caAl: 'Ca.Al', graphiteWire: 'Graphite Wire', metallurgyCoke: 'Metallurgy Coke',
                      caSiWire: 'CaSi Wire', caFeWire: 'CaFe Wire', boxite: 'Boxite',
                      alWire: 'Al Wire', deoxidizer: 'Deoxidizer',
                    }).map(([key, label]) => (
                      <tr key={key} className="hover:bg-gray-50">
                        <td className="px-3 py-2 font-medium">{label}</td>
                        {[0, 1, 2, 3].map(i => (
                          <td key={i} className="px-3 py-2">
                            <input type="number" className="input-field w-24" value={form.additives[key][i]} onChange={e => updateAdditive(key, i, Number(e.target.value))} />
                          </td>
                        ))}
                        <td className="px-3 py-2 bg-green-50 font-bold text-green-700">{additivesTotal[key]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'strings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['line1', 'line2'].map((line, idx) => (
                <div key={line} className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium mb-3">Line {idx + 1}</h5>
                  <div className="space-y-2">
                    {['Normal Condition', 'Weak String', 'No String'].map(c => (
                      <label key={c} className="flex items-center gap-2 text-sm">
                        <input type="radio" name={line} className="border-gray-300" checked={(form as any)[line] === c} onChange={() => setForm({...form, [line]: c})} />
                        <span>{c}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'analysis' && (
            <div>
              <h4 className="font-bold text-gray-700 mb-4">آنالیز شیمیایی</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50"><tr>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">نمونه</th>
                    {['c', 'si', 'mn', 'p', 's', 'al'].map(e => <th key={e} className="px-3 py-2 text-center text-xs font-medium text-gray-500">{e.toUpperCase()}%</th>)}
                  </tr></thead>
                  <tbody className="divide-y">
                    {(['sample1', 'sample2', 'sample3', 'sample4', 'sample5'] as const).map((s, idx) => (
                      <tr key={s}>
                        <td className="px-3 py-2 font-medium">نمونه {idx + 1}</td>
                        {(['c', 'si', 'mn', 'p', 's', 'al'] as const).map(e => (
                          <td key={e} className="px-3 py-2">
                            <input type="number" step="0.001" className="input-field w-20 mx-auto text-center" 
                              value={(form as any)[s][e]} 
                              onChange={ev => setForm({...form, [s]: {...(form as any)[s], [e]: Number(ev.target.value)}})} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'argon' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-700 mb-4">مصرف آرگون</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">Time String (دقیقه)</label>
                    <input type="number" className="input-field" value={form.timeString} onChange={e => setForm({...form, timeString: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="label-field">Argon Consumption (Nm³)</label>
                    <input type="number" className="input-field" value={form.argonConsumption} onChange={e => setForm({...form, argonConsumption: Number(e.target.value)})} />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-700 mb-4">مصرف پروب</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="label-field">Thermocouple</label>
                    <input type="number" className="input-field" value={form.thermocouple} onChange={e => setForm({...form, thermocouple: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="label-field">Sampler</label>
                    <input type="number" className="input-field" value={form.sampler} onChange={e => setForm({...form, sampler: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="label-field">Oxy. Probe</label>
                    <input type="number" className="input-field" value={form.oxyProbe} onChange={e => setForm({...form, oxyProbe: Number(e.target.value)})} />
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-bold text-gray-700 mb-4">Tap Lance</h4>
                <div className="grid grid-cols-2 gap-4">
                  <TimeInput24h label="زمان ۱" value={form.tapLance1} onChange={(val) => setForm({...form, tapLance1: val})} />
                  <TimeInput24h label="زمان ۲" value={form.tapLance2} onChange={(val) => setForm({...form, tapLance2: val})} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-700 mb-4">تحویل به CCM</h4>
                <div className="max-w-xs">
                  <TimeInput24h label="Delivery Time to CCM" value={form.deliveryTimeToCCM} onChange={(val) => setForm({...form, deliveryTimeToCCM: val})} />
                </div>
              </div>
              <div className="border-t pt-6">
                <h4 className="font-bold text-gray-700 mb-4">اطلاعات ثبت</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">Recording Operator</label>
                    <input type="text" className="input-field" value={form.recordingOperator} onChange={e => setForm({...form, recordingOperator: e.target.value})} />
                  </div>
                  <div>
                    <label className="label-field">Shift Supervisor</label>
                    <input type="text" className="input-field" value={form.shiftSupervisor} onChange={e => setForm({...form, shiftSupervisor: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label-field">Supervisor Notes</label>
                    <textarea className="input-field h-20" value={form.supervisorNotes} onChange={e => setForm({...form, supervisorNotes: e.target.value})}></textarea>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
