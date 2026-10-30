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

export default function CCMPage() {
  const { heats, updateHeat } = useData();
  const { user } = useAuth();
  
  const [selectedHeatId, setSelectedHeatId] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [saveMessage, setSaveMessage] = useState('');

  const [form, setForm] = useState<any>({
    date: getTodayJalali(),
    shift: 'A',
    steelGrade: '',
    oilType: '',
    oilTypeCustom: '',
    ladleShroud: 'yes',
    endOfSequence: false,
    sequenceCutReason: '',
    // Lines
    lines: Array(6).fill(null).map(() => ({
      castingStartTime: '', castingMode: '', castingSpeed: 0,
      moldNumber: '', castingEndTime: ''
    })),
    // Temperatures
    requestedTempFromLF: 0,
    sentTempFromLF: 0,
    // Tundish temperatures
    tundishTemps: [
      { time: '', temperature: 0 },
      { time: '', temperature: 0 },
      { time: '', temperature: 0 },
    ],
    // Main times
    nextHeatRequestTime: '',
    castingStartTime: '',
    castingEndTime: '',
    heatNumberInSequence: 1,
    // Mold life
    moldLife: Array(16).fill(0),
    // Breaks
    breaks: [
      { lineNumber: '', breakTime: '', cause: '' },
      { lineNumber: '', breakTime: '', cause: '' },
    ],
    // Mold changes
    moldChanges: [
      { lineNumber: '', moldNumber: '', numberOfHeats: 0, cause: '' },
      { lineNumber: '', moldNumber: '', numberOfHeats: 0, cause: '' },
    ],
    // Ladle report
    ladleReport: {
      ladleNumber: '', timePlacedOnTurret: '',
      deliveredMeltWeight: 0, slideGateOpeningTime: '',
      numberOfOxygenLances: 0, returnedMeltWeight: 0,
    },
    // Tundish report
    tundishReport: {
      tundishCarNumber: '', tundishNumber: '',
      sequentialHeats: 0, residualMeltWeight: 0,
    },
    // Quality reports
    qualityReports: Array(3).fill(null).map(() => ({
      line: '', time: '', reporterName: '',
      defectReported: '', correctiveAction: '', result: ''
    })),
    // Stoppages
    stoppages: Array(2).fill(null).map(() => ({
      start: '', end: '', duration: 0,
      responsibleUnit: '', description: ''
    })),
    // Recording
    recordingTechnician: '',
    shiftSupervisor: '',
    supervisorNotes: '',
  });

  // Load data when heat is selected
  useEffect(() => {
    if (selectedHeatId) {
      const heat = heats.find(h => h.heatId === selectedHeatId);
      if (heat && heat.ccmData) {
        const d = heat.ccmData as any;
        setForm({
          date: d.date || getTodayJalali(),
          shift: d.shift || 'A',
          steelGrade: heat.steelGrade || '',
          oilType: d.oilType || '',
          oilTypeCustom: d.oilTypeCustom || '',
          ladleShroud: d.ladleShroud || 'yes',
          endOfSequence: d.endOfSequence || false,
          sequenceCutReason: d.sequenceCutReason || '',
          lines: d.lines || Array(6).fill(null).map(() => ({
            castingStartTime: '', castingMode: '', castingSpeed: 0,
            moldNumber: '', castingEndTime: ''
          })),
          requestedTempFromLF: d.temperatures?.requestedFromLF || 0,
          sentTempFromLF: d.temperatures?.sentFromLF || 0,
          tundishTemps: d.tundishTemperatures || [
            { time: '', temperature: 0 },
            { time: '', temperature: 0 },
            { time: '', temperature: 0 },
          ],
          nextHeatRequestTime: d.mainTimes?.nextHeatRequestTime || '',
          castingStartTime: d.mainTimes?.castingStartTime || '',
          castingEndTime: d.mainTimes?.castingEndTime || '',
          heatNumberInSequence: d.mainTimes?.heatNumberInSequence || 1,
          moldLife: d.moldTubeLife || Array(16).fill(0),
          breaks: d.lineBreakReport ? [d.lineBreakReport] : Array(2).fill(null).map(() => ({
            lineNumber: '', breakTime: '', cause: ''
          })),
          moldChanges: d.moldChange ? [d.moldChange] : Array(2).fill(null).map(() => ({
            lineNumber: '', moldNumber: '', numberOfHeats: 0, cause: ''
          })),
          ladleReport: d.ladleReport || {
            ladleNumber: '', timePlacedOnTurret: '',
            deliveredMeltWeight: 0, slideGateOpeningTime: '',
            numberOfOxygenLances: 0, returnedMeltWeight: 0,
          },
          tundishReport: d.tundishReport || {
            tundishCarNumber: '', tundishNumber: '',
            sequentialHeats: 0, residualMeltWeight: 0,
          },
          qualityReports: d.qualityReports || Array(3).fill(null).map(() => ({
            line: '', time: '', reporterName: '',
            defectReported: '', correctiveAction: '', result: ''
          })),
          stoppages: d.stoppages || Array(2).fill(null).map(() => ({
            start: '', end: '', duration: 0,
            responsibleUnit: '', description: ''
          })),
          recordingTechnician: d.recordingTechnician || '',
          shiftSupervisor: d.shiftSupervisor || '',
          supervisorNotes: d.supervisorNotes || '',
        });
      }
    } else {
      // New heat - auto-fill date and grade from last EAF heat
      const lastEAFHeat = heats.filter(h => h.eafData).sort((a, b) => b.id.localeCompare(a.id))[0];
      const lastCCMHeat = heats.filter(h => h.ccmData).sort((a, b) => b.id.localeCompare(a.id))[0];
      const lastSequence = lastCCMHeat?.ccmData?.mainTimes?.heatNumberInSequence || 0;
      const isEndOfSequence = lastCCMHeat?.ccmData?.endOfSequence || false;
      
      setForm({
        date: getTodayJalali(),
        shift: 'A',
        steelGrade: lastEAFHeat?.steelGrade || '',
        oilType: '',
        oilTypeCustom: '',
        ladleShroud: 'yes',
        endOfSequence: false,
        sequenceCutReason: '',
        lines: Array(6).fill(null).map(() => ({
          castingStartTime: '', castingMode: '', castingSpeed: 0,
          moldNumber: '', castingEndTime: ''
        })),
        requestedTempFromLF: 0,
        sentTempFromLF: 0,
        tundishTemps: [
          { time: '', temperature: 0 },
          { time: '', temperature: 0 },
          { time: '', temperature: 0 },
        ],
        nextHeatRequestTime: '',
        castingStartTime: '',
        castingEndTime: '',
        heatNumberInSequence: isEndOfSequence ? 1 : (lastSequence + 1),
        moldLife: Array(16).fill(0),
        breaks: Array(2).fill(null).map(() => ({
          lineNumber: '', breakTime: '', cause: ''
        })),
        moldChanges: Array(2).fill(null).map(() => ({
          lineNumber: '', moldNumber: '', numberOfHeats: 0, cause: ''
        })),
        ladleReport: {
          ladleNumber: '', timePlacedOnTurret: '',
          deliveredMeltWeight: 0, slideGateOpeningTime: '',
          numberOfOxygenLances: 0, returnedMeltWeight: 0,
        },
        tundishReport: {
          tundishCarNumber: '', tundishNumber: '',
          sequentialHeats: 0, residualMeltWeight: 0,
        },
        qualityReports: Array(3).fill(null).map(() => ({
          line: '', time: '', reporterName: '',
          defectReported: '', correctiveAction: '', result: ''
        })),
        stoppages: Array(2).fill(null).map(() => ({
          start: '', end: '', duration: 0,
          responsibleUnit: '', description: ''
        })),
        recordingTechnician: '',
        shiftSupervisor: '',
        supervisorNotes: '',
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

  // Calculate average casting speed
  const avgCastingSpeed = useMemo(() => {
    const speeds = form.lines
      .map((l: any) => l.castingSpeed)
      .filter((s: number) => s > 0);
    if (speeds.length === 0) return 0;
    return (speeds.reduce((sum: number, s: number) => sum + s, 0) / speeds.length).toFixed(2);
  }, [form.lines]);

  const updateLine = (index: number, key: string, value: any) => {
    const newLines = [...form.lines];
    newLines[index] = { ...newLines[index], [key]: value };
    setForm({ ...form, lines: newLines });
  };

  const updateBreak = (index: number, key: string, value: any) => {
    const newBreaks = [...form.breaks];
    newBreaks[index] = { ...newBreaks[index], [key]: value };
    setForm({ ...form, breaks: newBreaks });
  };

  const updateMoldChange = (index: number, key: string, value: any) => {
    const newMoldChanges = [...form.moldChanges];
    newMoldChanges[index] = { ...newMoldChanges[index], [key]: value };
    setForm({ ...form, moldChanges: newMoldChanges });
  };

  const updateStoppage = (index: number, key: string, value: any) => {
    const newStoppages = [...form.stoppages];
    newStoppages[index] = { ...newStoppages[index], [key]: value };
    if (key === 'start' || key === 'end') {
      newStoppages[index].duration = calcMinutes(newStoppages[index].start, newStoppages[index].end);
    }
    setForm({ ...form, stoppages: newStoppages });
  };

  const updateQualityReport = (index: number, key: string, value: any) => {
    const newReports = [...form.qualityReports];
    newReports[index] = { ...newReports[index], [key]: value };
    setForm({ ...form, qualityReports: newReports });
  };

  const updateTundishTemp = (index: number, key: string, value: any) => {
    const newTemps = [...form.tundishTemps];
    newTemps[index] = { ...newTemps[index], [key]: value };
    setForm({ ...form, tundishTemps: newTemps });
  };

  const handleSave = () => {
    const ccmData = {
      date: form.date,
      shift: form.shift,
      steelGrade: form.steelGrade,
      oilType: form.oilType,
      oilTypeCustom: form.oilTypeCustom,
      ladleShroud: form.ladleShroud,
      endOfSequence: form.endOfSequence,
      sequenceCutReason: form.sequenceCutReason,
      avgCastingSpeed: parseFloat(avgCastingSpeed as string) || 0,
      lines: form.lines,
      temperatures: {
        requestedFromLF: form.requestedTempFromLF,
        sentFromLF: form.sentTempFromLF,
      },
      tundishTemperatures: form.tundishTemps,
      mainTimes: {
        nextHeatRequestTime: form.nextHeatRequestTime,
        castingStartTime: form.castingStartTime,
        castingEndTime: form.castingEndTime,
        heatNumberInSequence: form.heatNumberInSequence,
      },
      moldTubeLife: form.moldLife,
      lineBreakReport: form.breaks.filter((b: any) => b.lineNumber || b.breakTime),
      moldChange: form.moldChanges.filter((m: any) => m.lineNumber || m.moldNumber),
      ladleReport: form.ladleReport,
      tundishReport: form.tundishReport,
      qualityReports: form.qualityReports.filter((q: any) => q.line || q.time),
      stoppages: form.stoppages,
      recordingTechnician: form.recordingTechnician,
      shiftSupervisor: form.shiftSupervisor,
      supervisorNotes: form.supervisorNotes,
    };

    const heat = heats.find(h => h.heatId === selectedHeatId);
    if (heat) {
      updateHeat(heat.id, { ccmData, ccmStatus: 'completed', updatedAt: new Date().toLocaleString('fa-IR') });
      setSaveMessage(`✅ ذوب ${selectedHeatId} با موفقیت ذخیره شد`);
    } else {
      setSaveMessage('⚠️ لطفاً یک ذوب را انتخاب کنید');
    }
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const tabs = [
    { id: 'general', label: 'اطلاعات ذوب' },
    { id: 'lines', label: 'خطوط ریخته‌گری' },
    { id: 'temperatures', label: 'دماها' },
    { id: 'times', label: 'زمان‌های اصلی' },
    { id: 'moldLife', label: 'عمر تیوب قالب' },
    { id: 'breaks', label: 'پارگی خط' },
    { id: 'moldChanges', label: 'تعویض قالب' },
    { id: 'ladleReport', label: 'گزارش پاتیل' },
    { id: 'tundish', label: 'گزارش تاندیش' },
    { id: 'quality', label: 'کنترل کیفیت' },
    { id: 'stoppages', label: 'توقفات' },
  ];

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-l from-purple-600 to-purple-700 text-white">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold">🏭 ریخته‌گری مداوم (CCM)</h2>
            <p className="text-purple-100 text-sm mt-1">ثبت اطلاعات فرایندی</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <select value={selectedHeatId} onChange={e => setSelectedHeatId(e.target.value)} className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-sm text-white">
              <option value="" className="text-gray-800">انتخاب ذوب...</option>
              {heats.map(h => (
                <option key={h.id} value={h.heatId} className="text-gray-800">{h.heatId} - {h.date} - {h.steelGrade}</option>
              ))}
            </select>
            <button onClick={handleSave} className="bg-white text-purple-700 font-bold px-4 py-2 rounded-lg hover:bg-purple-50 text-sm">💾 ذخیره</button>
          </div>
        </div>
        {saveMessage && <div className="mt-3 bg-green-500/20 border border-green-300/30 rounded-lg p-2 text-sm text-green-100">{saveMessage}</div>}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex overflow-x-auto border-b bg-gray-50">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-white text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:bg-gray-100'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
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
              <div>
                <label className="label-field">Oil Type</label>
                <select className="input-field" value={form.oilType} onChange={e => setForm({...form, oilType: e.target.value})}>
                  <option value="">انتخاب</option>
                  <option value="شیمی سبز">شیمی سبز</option>
                  <option value="لوبرانت">لوبرانت</option>
                  <option value="سایر">سایر (تایپ کنید)</option>
                </select>
              </div>
              {form.oilType === 'سایر' && (
                <div>
                  <label className="label-field">نام روغن</label>
                  <input type="text" className="input-field" value={form.oilTypeCustom} onChange={e => setForm({...form, oilTypeCustom: e.target.value})} placeholder="نام روغن را وارد کنید" />
                </div>
              )}
              <div>
                <label className="label-field">Ladle Shroud</label>
                <select className="input-field" value={form.ladleShroud} onChange={e => setForm({...form, ladleShroud: e.target.value})}>
                  <option value="yes">بله</option>
                  <option value="no">خیر</option>
                </select>
              </div>
              <div>
                <label className="label-field">Avg Casting Speed (m/min)</label>
                <input type="text" className="input-field bg-gray-100" value={avgCastingSpeed} disabled placeholder="محاسبه خودکار" />
              </div>
              <TimeInput24h label="Casting Start Time (24h)" value={form.castingStartTime} onChange={(val) => setForm({...form, castingStartTime: val})} />
              <div>
                <label className="label-field">Heat Number in Sequence</label>
                <input type="number" className="input-field" value={form.heatNumberInSequence} onChange={e => setForm({...form, heatNumberInSequence: Number(e.target.value)})} />
              </div>
              <div className="md:col-span-2 lg:col-span-4">
                <label className="label-field">Sequence Cut Reason</label>
                <input type="text" className="input-field" value={form.sequenceCutReason} onChange={e => setForm({...form, sequenceCutReason: e.target.value})} placeholder="علت قطع توالی" />
              </div>
              <div className="md:col-span-2 lg:col-span-4 flex items-center gap-2">
                <input type="checkbox" id="endOfSequence" checked={form.endOfSequence} onChange={e => setForm({...form, endOfSequence: e.target.checked})} className="w-4 h-4" />
                <label htmlFor="endOfSequence" className="text-sm font-medium text-gray-700">پایان سکوئنس (در ذوب بعد سکوئنس از 1 شروع می‌شود)</label>
              </div>
            </div>
          )}

          {activeTab === 'lines' && (
            <div>
              <h4 className="font-bold text-gray-700 mb-4">خطوط ریخته‌گری</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50"><tr>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">خط</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">شروع (24h)</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">حالت</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">سرعت (m/min)</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">قالب</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">پایان (24h)</th>
                  </tr></thead>
                  <tbody className="divide-y">
                    {form.lines.map((line: any, i: number) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-2 py-2 font-medium">خط {i + 1}</td>
                        <td className="px-2 py-2"><TimeInput24h value={line.castingStartTime} onChange={(val) => updateLine(i, 'castingStartTime', val)} /></td>
                        <td className="px-2 py-2">
                          <select className="input-field w-28" value={line.castingMode} onChange={e => updateLine(i, 'castingMode', e.target.value)}>
                            <option value="">—</option>
                            <option>Automatic</option>
                            <option>Manual</option>
                          </select>
                        </td>
                        <td className="px-2 py-2"><input type="number" step="0.01" className="input-field w-24" value={line.castingSpeed} onChange={e => updateLine(i, 'castingSpeed', Number(e.target.value))} /></td>
                        <td className="px-2 py-2"><input type="text" className="input-field w-20" value={line.moldNumber} onChange={e => updateLine(i, 'moldNumber', e.target.value)} /></td>
                        <td className="px-2 py-2"><TimeInput24h value={line.castingEndTime} onChange={(val) => updateLine(i, 'castingEndTime', val)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'temperatures' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-700 mb-4">دمای مذاب</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="label-field">Requested Temp from LF (°C)</label><input type="number" className="input-field" value={form.requestedTempFromLF} onChange={e => setForm({...form, requestedTempFromLF: Number(e.target.value)})} /></div>
                  <div><label className="label-field">Sent Temp from LF (°C)</label><input type="number" className="input-field" value={form.sentTempFromLF} onChange={e => setForm({...form, sentTempFromLF: Number(e.target.value)})} /></div>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-700 mb-4">دمای مذاب تاندیش</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {form.tundishTemps.map((t: any, i: number) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-600 mb-3">قرائت {i + 1}</h5>
                      <div className="grid grid-cols-2 gap-3">
                        <TimeInput24h label="Time" value={t.time} onChange={(val) => updateTundishTemp(i, 'time', val)} />
                        <div><label className="label-field">Temperature (°C)</label><input type="number" className="input-field" value={t.temperature} onChange={e => updateTundishTemp(i, 'temperature', Number(e.target.value))} /></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'times' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TimeInput24h label="Next Heat Request Time" value={form.nextHeatRequestTime} onChange={(val) => setForm({...form, nextHeatRequestTime: val})} />
              <TimeInput24h label="Casting End Time" value={form.castingEndTime} onChange={(val) => setForm({...form, castingEndTime: val})} />
            </div>
          )}

          {activeTab === 'moldLife' && (
            <div>
              <h4 className="font-bold text-gray-700 mb-4">عمر تیوب قالب‌ها</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                {form.moldLife.map((life: number, i: number) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">قالب {i + 1}</p>
                    <input type="number" className="input-field text-center w-full" value={life} onChange={e => {
                      const newMoldLife = [...form.moldLife];
                      newMoldLife[i] = Number(e.target.value);
                      setForm({...form, moldLife: newMoldLife});
                    }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'breaks' && (
            <div>
              <h4 className="font-bold text-gray-700 mb-4">پارگی خط</h4>
              <div className="space-y-4">
                {form.breaks.map((b: any, i: number) => (
                  <div key={i} className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <h5 className="font-medium text-red-700 mb-3">پارگی {i + 1}</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="label-field">Line Number</label>
                        <select className="input-field" value={b.lineNumber} onChange={e => updateBreak(i, 'lineNumber', e.target.value)}>
                          <option value="">انتخاب</option>
                          {[1,2,3,4,5,6].map(l => <option key={l} value={l}>خط {l}</option>)}
                        </select>
                      </div>
                      <TimeInput24h label="Break Time" value={b.breakTime} onChange={(val) => updateBreak(i, 'breakTime', val)} />
                      <div>
                        <label className="label-field">Cause</label>
                        <select className="input-field" value={b.cause} onChange={e => updateBreak(i, 'cause', e.target.value)}>
                          <option value="">انتخاب</option>
                          <option>شکست رشته</option>
                          <option>گیر کردن مذاب</option>
                          <option>مشکل قالب</option>
                          <option>سایر</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'moldChanges' && (
            <div>
              <h4 className="font-bold text-gray-700 mb-4">تعویض قالب</h4>
              <div className="space-y-4">
                {form.moldChanges.map((m: any, i: number) => (
                  <div key={i} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                    <h5 className="font-medium text-blue-700 mb-3">تعویض {i + 1}</h5>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="label-field">Line</label>
                        <select className="input-field" value={m.lineNumber} onChange={e => updateMoldChange(i, 'lineNumber', e.target.value)}>
                          <option value="">انتخاب</option>
                          {[1,2,3,4,5,6].map(l => <option key={l} value={l}>خط {l}</option>)}
                        </select>
                      </div>
                      <div><label className="label-field">Mold Number</label><input type="text" className="input-field" value={m.moldNumber} onChange={e => updateMoldChange(i, 'moldNumber', e.target.value)} /></div>
                      <div><label className="label-field">Number of Heats</label><input type="number" className="input-field" value={m.numberOfHeats} onChange={e => updateMoldChange(i, 'numberOfHeats', Number(e.target.value))} /></div>
                      <div>
                        <label className="label-field">Cause</label>
                        <select className="input-field" value={m.cause} onChange={e => updateMoldChange(i, 'cause', e.target.value)}>
                          <option value="">انتخاب</option>
                          <option>پایان عمر</option>
                          <option>آسیب</option>
                          <option>تعویض برنامه‌ای</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ladleReport' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div><label className="label-field">Ladle Number</label><input type="text" className="input-field" value={form.ladleReport.ladleNumber} onChange={e => setForm({...form, ladleReport: {...form.ladleReport, ladleNumber: e.target.value}})} /></div>
              <TimeInput24h label="Time Placed on Turret" value={form.ladleReport.timePlacedOnTurret} onChange={(val) => setForm({...form, ladleReport: {...form.ladleReport, timePlacedOnTurret: val}})} />
              <div><label className="label-field">Delivered Melt Weight (Ton)</label><input type="number" step="0.1" className="input-field" value={form.ladleReport.deliveredMeltWeight} onChange={e => setForm({...form, ladleReport: {...form.ladleReport, deliveredMeltWeight: Number(e.target.value)}})} /></div>
              <TimeInput24h label="Slide Gate Opening Time" value={form.ladleReport.slideGateOpeningTime} onChange={(val) => setForm({...form, ladleReport: {...form.ladleReport, slideGateOpeningTime: val}})} />
              <div><label className="label-field">Number of Oxygen Lances</label><input type="number" className="input-field" value={form.ladleReport.numberOfOxygenLances} onChange={e => setForm({...form, ladleReport: {...form.ladleReport, numberOfOxygenLances: Number(e.target.value)}})} /></div>
              <div><label className="label-field">Returned Melt Weight (Ton)</label><input type="number" step="0.1" className="input-field" value={form.ladleReport.returnedMeltWeight} onChange={e => setForm({...form, ladleReport: {...form.ladleReport, returnedMeltWeight: Number(e.target.value)}})} /></div>
            </div>
          )}

          {activeTab === 'tundish' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div><label className="label-field">Tundish Car Number</label><input type="text" className="input-field" value={form.tundishReport.tundishCarNumber} onChange={e => setForm({...form, tundishReport: {...form.tundishReport, tundishCarNumber: e.target.value}})} /></div>
              <div><label className="label-field">Tundish Number</label><input type="text" className="input-field" value={form.tundishReport.tundishNumber} onChange={e => setForm({...form, tundishReport: {...form.tundishReport, tundishNumber: e.target.value}})} /></div>
              <div><label className="label-field">Sequential Heats Cast</label><input type="number" className="input-field" value={form.tundishReport.sequentialHeats} onChange={e => setForm({...form, tundishReport: {...form.tundishReport, sequentialHeats: Number(e.target.value)}})} /></div>
              <div><label className="label-field">Residual Melt Weight (Ton)</label><input type="number" step="0.1" className="input-field" value={form.tundishReport.residualMeltWeight} onChange={e => setForm({...form, tundishReport: {...form.tundishReport, residualMeltWeight: Number(e.target.value)}})} /></div>
            </div>
          )}

          {activeTab === 'quality' && (
            <div>
              <h4 className="font-bold text-gray-700 mb-4">کنترل کیفیت</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50"><tr>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">ردیف</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Line</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Time (24h)</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Reporter</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Defect</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Action</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Result</th>
                  </tr></thead>
                  <tbody className="divide-y">
                    {form.qualityReports.map((q: any, i: number) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-2 py-2 text-gray-500">{i + 1}</td>
                        <td className="px-2 py-2"><select className="input-field w-16" value={q.line} onChange={e => updateQualityReport(i, 'line', e.target.value)}><option>—</option>{[1,2,3,4,5,6].map(l => <option key={l}>{l}</option>)}</select></td>
                        <td className="px-2 py-2"><TimeInput24h value={q.time} onChange={(val) => updateQualityReport(i, 'time', val)} /></td>
                        <td className="px-2 py-2"><input type="text" className="input-field w-28" value={q.reporterName} onChange={e => updateQualityReport(i, 'reporterName', e.target.value)} /></td>
                        <td className="px-2 py-2"><input type="text" className="input-field w-36" value={q.defectReported} onChange={e => updateQualityReport(i, 'defectReported', e.target.value)} /></td>
                        <td className="px-2 py-2"><input type="text" className="input-field w-36" value={q.correctiveAction} onChange={e => updateQualityReport(i, 'correctiveAction', e.target.value)} /></td>
                        <td className="px-2 py-2"><select className="input-field w-24" value={q.result} onChange={e => updateQualityReport(i, 'result', e.target.value)}><option>—</option><option>موفق</option><option>ناموفق</option><option>در بررسی</option></select></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'stoppages' && (
            <div>
              <h4 className="font-bold text-gray-700 mb-4">توقفات CCM</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50"><tr>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">ردیف</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Start (24h)</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">End (24h)</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Duration (min)</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Responsible</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Description</th>
                  </tr></thead>
                  <tbody className="divide-y">
                    {form.stoppages.map((s: any, i: number) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                        <td className="px-3 py-2"><TimeInput24h value={s.start} onChange={(val) => updateStoppage(i, 'start', val)} /></td>
                        <td className="px-3 py-2"><TimeInput24h value={s.end} onChange={(val) => updateStoppage(i, 'end', val)} /></td>
                        <td className="px-3 py-2"><input type="number" className="input-field w-20 bg-gray-100" value={s.duration} readOnly /></td>
                        <td className="px-3 py-2">
                          <select className="input-field w-40" value={s.responsibleUnit} onChange={e => updateStoppage(i, 'responsibleUnit', e.target.value)}>
                            <option>—</option>
                            {WORKING_GROUPS.slice(0, 8).map(g => <option key={g}>{g}</option>)}
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
        </div>
      </div>
    </div>
  );
}
