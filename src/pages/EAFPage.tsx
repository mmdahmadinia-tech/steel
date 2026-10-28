import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { STEEL_GRADES, SHIFTS, WORKING_GROUPS, PRE_START_STOP_REASONS } from '../data/mockData';
import { getToday, toFa, padFa } from '../components/JalaliDatePicker';
import TimeInput24h from '../components/TimeInput24h';

// Helper: calculate minutes between two HH:MM times
function calcMinutes(from: string, till: string): number {
  if (!from || !till) return 0;
  const [fh, fm] = from.split(':').map(Number);
  const [th, tm] = till.split(':').map(Number);
  const fromMin = fh * 60 + fm;
  let tillMin = th * 60 + tm;
  if (tillMin < fromMin) tillMin += 24 * 60;
  return tillMin - fromMin;
}

// Format today as Jalali
function getTodayJalali(): string {
  const t = getToday();
  return `${t.jy}/${padFa(t.jm).replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))}/${padFa(t.jd).replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))}`;
}

export default function EAFPage() {
  const { heats, addHeat, updateHeat, getNextHeatId } = useData();
  const { user } = useAuth();
  
  const [selectedHeatId, setSelectedHeatId] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // All form data in ONE state object to prevent data loss
  const [form, setForm] = useState<any>({
    date: getTodayJalali(),
    shift: 'A',
    steelGrade: '4402',
    heatStartTime: '', // شروع ذوب
    powerOn: 0,
    tappingStartTime: '',
    tappingEndTime: '',
    tappingWeight: 0,
    carbonPercent: 0,
    ppm: 0,
    // Refractory
    walls: 0, centerPiece: 0, bottom: 0, taphole: 0,
    // Materials (charge)
    dri: 0, briquet: 0,
    feMn: 0, feSiMn: 0, feSi: 0,
    lime: 0, carbon: 0,
    cpcMHU: 0, cpcInjection: 0,
    oxygen: 0, ch4: 0, dolomite: 0,
    // Tapping materials
    t_dri: 0, t_briquet: 0,
    t_feMn: 0, t_feSiMn: 0, t_feSi: 0,
    t_lime: 0, t_carbon: 0,
    t_cpcMHU: 0, t_cpcInjection: 0,
    t_oxygen: 0, t_ch4: 0, t_dolomite: 0,
    // Stoppages
    preStoppages: Array(7).fill(null).map(() => ({ from: '', till: '', minutes: 0, workingGroup: '', reason: '', customReason: '' })),
    duringStoppages: Array(7).fill(null).map(() => ({ from: '', till: '', minutes: 0, workingGroup: '', reason: '', customReason: '' })),
    // Ladle
    ladleNumber: '', requestTime: '', deliveryTime: '', slagCondition: '', wallCondition: '',
    // Consumables
    thermocouple: 0, sampler: 0, oxyProbe: 0, tapholeSand: 0,
    // Analysis
    sample1: { c: 0, si: 0, mn: 0, p: 0, s: 0 },
    sample2: { c: 0, si: 0, mn: 0, p: 0, s: 0 },
    sample3: { c: 0, si: 0, mn: 0, p: 0, s: 0 },
    // Scrap
    bucket1Number: '', bucket1Tonnage: 0,
    bucket2Number: '', bucket2Tonnage: 0,
    // Additives
    a_feMn: 0, a_feSiMn: 0, a_feSi: 0, a_lime: 0, a_graphite: 0, a_caAl: 0,
    // Electrode
    phase1: [] as string[], phase2: [] as string[], phase3: [] as string[],
    // Notes
    recordingOperator: '', shiftSupervisor: '', supervisorNotes: '',
  });

  // Load data when heat is selected
  useEffect(() => {
    if (selectedHeatId) {
      const heat = heats.find(h => h.heatId === selectedHeatId);
      if (heat && heat.eafData) {
        const d = heat.eafData as any;
        setForm({
          date: d.date || getTodayJalali(),
          shift: d.shift || 'A',
          steelGrade: d.steelGrade || '4402',
          heatStartTime: d.heatStartTime || '',
          powerOn: d.powerOn || 0,
          tappingStartTime: d.tappingStartTime || '',
          tappingEndTime: d.tappingEndTime || '',
          tappingWeight: d.tappingWeight || 0,
          carbonPercent: d.carbonPercent || 0,
          ppm: d.ppm || 0,
          walls: d.refractoryCounters?.walls ?? 0,
          centerPiece: d.refractoryCounters?.centerPiece ?? 0,
          bottom: d.refractoryCounters?.bottom ?? 0,
          taphole: d.refractoryCounters?.taphole ?? 0,
          dri: d.materials?.dri || 0,
          briquet: d.materials?.briquet || 0,
          feMn: d.materials?.feMn || 0,
          feSiMn: d.materials?.feSiMn || 0,
          feSi: d.materials?.feSi || 0,
          lime: d.materials?.lime || 0,
          carbon: d.materials?.carbon || 0,
          cpcMHU: d.materials?.cpcMHU || 0,
          cpcInjection: d.materials?.cpcInjection || 0,
          oxygen: d.materials?.oxygen || 0,
          ch4: d.materials?.ch4 || 0,
          dolomite: d.materials?.dolomite || 0,
          t_dri: d.tappingMaterials?.dri || 0,
          t_briquet: d.tappingMaterials?.briquet || 0,
          t_feMn: d.tappingMaterials?.feMn || 0,
          t_feSiMn: d.tappingMaterials?.feSiMn || 0,
          t_feSi: d.tappingMaterials?.feSi || 0,
          t_lime: d.tappingMaterials?.lime || 0,
          t_carbon: d.tappingMaterials?.carbon || 0,
          t_cpcMHU: d.tappingMaterials?.cpcMHU || 0,
          t_cpcInjection: d.tappingMaterials?.cpcInjection || 0,
          t_oxygen: d.tappingMaterials?.oxygen || 0,
          t_ch4: d.tappingMaterials?.ch4 || 0,
          t_dolomite: d.tappingMaterials?.dolomite || 0,
          preStoppages: d.preStoppages || Array(7).fill(null).map(() => ({ from: '', till: '', minutes: 0, workingGroup: '', reason: '', customReason: '' })),
          duringStoppages: d.duringStoppages || Array(7).fill(null).map(() => ({ from: '', till: '', minutes: 0, workingGroup: '', reason: '', customReason: '' })),
          ladleNumber: d.ladleInfo?.ladleNumber || '',
          requestTime: d.ladleInfo?.requestTime || '',
          deliveryTime: d.ladleInfo?.deliveryTime || '',
          slagCondition: d.ladleInfo?.slagCondition || '',
          wallCondition: d.ladleInfo?.wallCondition || '',
          thermocouple: d.consumables?.thermocouple || 0,
          sampler: d.consumables?.sampler || 0,
          oxyProbe: d.consumables?.oxyProbe || 0,
          tapholeSand: d.consumables?.tapholeSand || 0,
          sample1: d.chemicalAnalysis?.[0] || { c: 0, si: 0, mn: 0, p: 0, s: 0 },
          sample2: d.chemicalAnalysis?.[1] || { c: 0, si: 0, mn: 0, p: 0, s: 0 },
          sample3: d.chemicalAnalysis?.[2] || { c: 0, si: 0, mn: 0, p: 0, s: 0 },
          bucket1Number: d.scrapBuckets?.[0]?.bucketNumber || '',
          bucket1Tonnage: d.scrapBuckets?.[0]?.tonnage || 0,
          bucket2Number: d.scrapBuckets?.[1]?.bucketNumber || '',
          bucket2Tonnage: d.scrapBuckets?.[1]?.tonnage || 0,
          a_feMn: d.additives?.feMn || 0,
          a_feSiMn: d.additives?.feSiMn || 0,
          a_feSi: d.additives?.feSi || 0,
          a_lime: d.additives?.lime || 0,
          a_graphite: d.additives?.graphite || 0,
          a_caAl: d.additives?.caAl || 0,
          phase1: d.electrodeStatus?.phase1 || [],
          phase2: d.electrodeStatus?.phase2 || [],
          phase3: d.electrodeStatus?.phase3 || [],
          recordingOperator: d.recordingOperator || '',
          shiftSupervisor: d.shiftSupervisor || '',
          supervisorNotes: d.supervisorNotes || '',
        });
      }
    } else {
      // New heat - auto-increment refractory from previous heat
      const previousHeats = heats.filter(h => h.eafData).sort((a, b) => b.id.localeCompare(a.id));
      const prev = previousHeats[0];
      const prevRefractory = (prev?.eafData as any)?.refractoryCounters || { walls: 0, centerPiece: 0, bottom: 0, taphole: 0 };
      
      console.log('=== NEW HEAT - Auto-increment Refractory ===');
      console.log('Previous heat:', prev?.heatId);
      console.log('Previous refractory values:', prevRefractory);
      console.log('New values will be:', {
        walls: (prevRefractory.walls || 0) + 1,
        centerPiece: (prevRefractory.centerPiece || 0) + 1,
        bottom: (prevRefractory.bottom || 0) + 1,
        taphole: (prevRefractory.taphole || 0) + 1,
      });
      
      setForm({
        date: getTodayJalali(),
        shift: 'A',
        steelGrade: '4402',
        heatStartTime: '',
        powerOn: 0,
        tappingStartTime: '',
        tappingEndTime: '',
        tappingWeight: 0,
        carbonPercent: 0,
        ppm: 0,
        walls: (prevRefractory.walls || 0) + 1,
        centerPiece: (prevRefractory.centerPiece || 0) + 1,
        bottom: (prevRefractory.bottom || 0) + 1,
        taphole: (prevRefractory.taphole || 0) + 1,
        dri: 0, briquet: 0,
        feMn: 0, feSiMn: 0, feSi: 0,
        lime: 0, carbon: 0,
        cpcMHU: 0, cpcInjection: 0,
        oxygen: 0, ch4: 0, dolomite: 0,
        t_dri: 0, t_briquet: 0,
        t_feMn: 0, t_feSiMn: 0, t_feSi: 0,
        t_lime: 0, t_carbon: 0,
        t_cpcMHU: 0, t_cpcInjection: 0,
        t_oxygen: 0, t_ch4: 0, t_dolomite: 0,
        preStoppages: Array(7).fill(null).map(() => ({ from: '', till: '', minutes: 0, workingGroup: '', reason: '', customReason: '' })),
        duringStoppages: Array(7).fill(null).map(() => ({ from: '', till: '', minutes: 0, workingGroup: '', reason: '', customReason: '' })),
        ladleNumber: '', requestTime: '', deliveryTime: '', slagCondition: '', wallCondition: '',
        thermocouple: 0, sampler: 0, oxyProbe: 0, tapholeSand: 0,
        sample1: { c: 0, si: 0, mn: 0, p: 0, s: 0 },
        sample2: { c: 0, si: 0, mn: 0, p: 0, s: 0 },
        sample3: { c: 0, si: 0, mn: 0, p: 0, s: 0 },
        bucket1Number: '', bucket1Tonnage: 0,
        bucket2Number: '', bucket2Tonnage: 0,
        a_feMn: 0, a_feSiMn: 0, a_feSi: 0, a_lime: 0, a_graphite: 0, a_caAl: 0,
        phase1: [], phase2: [], phase3: [],
        recordingOperator: '', shiftSupervisor: '', supervisorNotes: '',
      });
    }
  }, [selectedHeatId, heats]);

  // Auto-calculate derived values
  const calculated = useMemo(() => {
    const tappingDuration = calcMinutes(form.tappingStartTime, form.tappingEndTime);
    const preStoppagesTotal = form.preStoppages.reduce((sum: number, s: any) => sum + (s.minutes || 0), 0);
    const duringStoppagesTotal = form.duringStoppages.reduce((sum: number, s: any) => sum + (s.minutes || 0), 0);
    const powerOff = preStoppagesTotal + duringStoppagesTotal + tappingDuration;
    const tapToTap = powerOff + (form.powerOn || 0);
    
    return { tappingDuration, powerOff, tapToTap };
  }, [form.tappingStartTime, form.tappingEndTime, form.preStoppages, form.duringStoppages, form.powerOn]);

  const updateStoppage = (field: 'preStoppages' | 'duringStoppages', index: number, key: string, value: any) => {
    const newStoppages = [...form[field]];
    newStoppages[index] = { ...newStoppages[index], [key]: value };
    if (key === 'from' || key === 'till') {
      newStoppages[index].minutes = calcMinutes(newStoppages[index].from, newStoppages[index].till);
    }
    setForm({ ...form, [field]: newStoppages });
  };

  const handleSave = () => {
    const eafData = {
      date: form.date,
      shift: form.shift,
      steelGrade: form.steelGrade,
      heatStartTime: form.heatStartTime,
      refractoryCounters: { walls: form.walls, centerPiece: form.centerPiece, bottom: form.bottom, taphole: form.taphole },
      powerOn: form.powerOn,
      powerOff: calculated.powerOff,
      tapToTap: calculated.tapToTap,
      tappingWeight: form.tappingWeight,
      tappingStartTime: form.tappingStartTime,
      tappingEndTime: form.tappingEndTime,
      tappingDuration: calculated.tappingDuration,
      carbonPercent: form.carbonPercent,
      ppm: form.ppm,
      materials: {
        dri: form.dri, briquet: form.briquet,
        feMn: form.feMn, feSiMn: form.feSiMn, feSi: form.feSi,
        lime: form.lime, carbon: form.carbon,
        cpcMHU: form.cpcMHU, cpcInjection: form.cpcInjection,
        oxygen: form.oxygen, ch4: form.ch4, dolomite: form.dolomite,
      },
      tappingMaterials: {
        dri: form.t_dri, briquet: form.t_briquet,
        feMn: form.t_feMn, feSiMn: form.t_feSiMn, feSi: form.t_feSi,
        lime: form.t_lime, carbon: form.t_carbon,
        cpcMHU: form.t_cpcMHU, cpcInjection: form.t_cpcInjection,
        oxygen: form.t_oxygen, ch4: form.t_ch4, dolomite: form.t_dolomite,
      },
      preStoppages: form.preStoppages,
      duringStoppages: form.duringStoppages,
      ladleInfo: {
        ladleNumber: form.ladleNumber,
        requestTime: form.requestTime,
        deliveryTime: form.deliveryTime,
        slagCondition: form.slagCondition,
        wallCondition: form.wallCondition,
      },
      consumables: {
        thermocouple: form.thermocouple,
        sampler: form.sampler,
        oxyProbe: form.oxyProbe,
        tapholeSand: form.tapholeSand,
      },
      chemicalAnalysis: [form.sample1, form.sample2, form.sample3],
      scrapBuckets: [
        { bucketNumber: form.bucket1Number, tonnage: form.bucket1Tonnage },
        { bucketNumber: form.bucket2Number, tonnage: form.bucket2Tonnage },
      ],
      additives: {
        feMn: form.a_feMn, feSiMn: form.a_feSiMn, feSi: form.a_feSi,
        lime: form.a_lime, graphite: form.a_graphite, caAl: form.a_caAl,
      },
      electrodeStatus: { phase1: form.phase1, phase2: form.phase2, phase3: form.phase3 },
      recordingOperator: form.recordingOperator,
      shiftSupervisor: form.shiftSupervisor,
      supervisorNotes: form.supervisorNotes,
    };

    if (!selectedHeatId) {
      const newHeatId = getNextHeatId();
      addHeat({
        id: Date.now().toString(),
        heatId: newHeatId,
        date: form.date,
        shift: form.shift,
        steelGrade: form.steelGrade,
        isSubHeat: false,
        eafStatus: 'completed',
        lfStatus: 'not_started',
        ccmStatus: 'not_started',
        eafData,
        warnings: [],
        createdAt: new Date().toLocaleString('fa-IR'),
        updatedAt: new Date().toLocaleString('fa-IR'),
      });
      setSelectedHeatId(newHeatId);
      setSaveMessage(`✅ ذوب ${newHeatId} با موفقیت ثبت شد`);
    } else {
      const heat = heats.find(h => h.heatId === selectedHeatId);
      if (heat) {
        updateHeat(heat.id, { eafData, eafStatus: 'completed', updatedAt: new Date().toLocaleString('fa-IR') });
        setSaveMessage(`✅ ذوب ${selectedHeatId} با موفقیت بروزرسانی شد`);
      }
    }
    setSaved(true);
    setTimeout(() => { setSaved(false); setSaveMessage(''); }, 3000);
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-l from-blue-600 to-blue-700 text-white">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold">⚡ کوره قوس الکتریکی (EAF)</h2>
            <p className="text-blue-100 text-sm mt-1">ثبت اطلاعات فرایندی</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <select value={selectedHeatId} onChange={e => setSelectedHeatId(e.target.value)} className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-sm text-white">
              <option value="" className="text-gray-800">ذوب جدید ({getNextHeatId()})</option>
              {heats.filter(h => !h.isSubHeat).map(h => <option key={h.id} value={h.heatId} className="text-gray-800">{h.heatId} - {h.date}</option>)}
            </select>
            <button onClick={handleSave} className="bg-white text-blue-700 font-bold px-4 py-2 rounded-lg hover:bg-blue-50 text-sm">💾 ذخیره</button>
          </div>
        </div>
        {saveMessage && <div className="mt-3 bg-green-500/20 border border-green-300/30 rounded-lg p-2 text-sm text-green-100">{saveMessage}</div>}
        
        {/* Auto-calculated values display */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="bg-white/10 rounded-lg p-2 text-center">
            <p className="text-xs text-blue-100">مدت تخلیه</p>
            <p className="font-bold">{calculated.tappingDuration} دقیقه</p>
          </div>
          <div className="bg-white/10 rounded-lg p-2 text-center">
            <p className="text-xs text-blue-100">POWER OFF</p>
            <p className="font-bold">{calculated.powerOff} دقیقه</p>
          </div>
          <div className="bg-white/10 rounded-lg p-2 text-center">
            <p className="text-xs text-blue-100">TAP TO TAP</p>
            <p className="font-bold">{calculated.tapToTap} دقیقه</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card p-0 overflow-hidden">
        <div className="flex overflow-x-auto border-b bg-gray-50">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="label-field">تاریخ (شمسی)</label>
                <input type="text" className="input-field" value={form.date} onChange={e => setForm({...form, date: e.target.value})} placeholder="1403/09/15" />
              </div>
              <div>
                <label className="label-field">شیفت</label>
                <select className="input-field" value={form.shift} onChange={e => setForm({...form, shift: e.target.value})}>
                  {SHIFTS.map(s => <option key={s} value={s}>شیفت {s}</option>)}
                </select>
              </div>
              <div>
                <label className="label-field">Heat ID</label>
                <input type="text" className="input-field bg-gray-100" value={selectedHeatId || getNextHeatId()} disabled />
              </div>
              <div>
                <label className="label-field">گرید فولاد</label>
                <select className="input-field" value={form.steelGrade} onChange={e => setForm({...form, steelGrade: e.target.value})}>
                  {STEEL_GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <TimeInput24h
                label="شروع ذوب"
                value={form.heatStartTime}
                onChange={(val) => setForm({...form, heatStartTime: val})}
              />
              <div>
                <label className="label-field">POWER ON (دقیقه)</label>
                <input type="number" className="input-field" value={form.powerOn} onChange={e => setForm({...form, powerOn: Number(e.target.value)})} />
              </div>
              <TimeInput24h
                label="شروع تخلیه"
                value={form.tappingStartTime}
                onChange={(val) => setForm({...form, tappingStartTime: val})}
              />
              <TimeInput24h
                label="پایان تخلیه"
                value={form.tappingEndTime}
                onChange={(val) => setForm({...form, tappingEndTime: val})}
              />
              <div>
                <label className="label-field">وزن تخلیه (تن)</label>
                <input type="number" className="input-field" value={form.tappingWeight} onChange={e => setForm({...form, tappingWeight: Number(e.target.value)})} step="0.1" />
              </div>
              <div>
                <label className="label-field">درصد کربن (سلوکس) %</label>
                <input type="number" className="input-field" value={form.carbonPercent} onChange={e => setForm({...form, carbonPercent: Number(e.target.value)})} step="0.01" />
              </div>
              <div>
                <label className="label-field">PPM</label>
                <input type="number" className="input-field" value={form.ppm} onChange={e => setForm({...form, ppm: Number(e.target.value)})} />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-600 font-medium">مدت تخلیه (محاسبه خودکار)</p>
                <p className="text-xl font-bold text-blue-800">{calculated.tappingDuration} دقیقه</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs text-green-600 font-medium">POWER OFF (محاسبه خودکار)</p>
                <p className="text-xl font-bold text-green-800">{calculated.powerOff} دقیقه</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-xs text-purple-600 font-medium">TAP TO TAP (محاسبه خودکار)</p>
                <p className="text-xl font-bold text-purple-800">{calculated.tapToTap} دقیقه</p>
              </div>
            </div>
          )}

          {/* Refractory Tab */}
          {activeTab === 'refractory' && (
            <div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-800">
                ⚠️ اعداد به‌صورت خودکار از ذوب قبلی +1 شده‌اند. در صورت تعویض، دکمه صفر کردن را بزنید.
                <br />
                <strong>مقدار قبلی:</strong> Walls: {form.walls - 1}, Center Piece: {form.centerPiece - 1}, Bottom: {form.bottom - 1}, Taphole: {form.taphole - 1}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { key: 'walls', label: 'Walls — دیواره‌ها' },
                  { key: 'centerPiece', label: 'CENTER PIECE - دلتا' },
                  { key: 'bottom', label: 'Bottom — کف' },
                  { key: 'taphole', label: 'Taphole — مجرای تخلیه' },
                ].map(item => (
                  <div key={item.key} className="border border-gray-200 rounded-lg p-4">
                    <label className="label-field">{item.label}</label>
                    <input type="number" className="input-field mb-2" value={(form as any)[item.key]} onChange={e => setForm({...form, [item.key]: Number(e.target.value)})} />
                    <button onClick={() => setForm({...form, [item.key]: 0})} className="text-xs text-red-600 hover:text-red-800 font-medium">🔄 صفر کردن</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pre-Start Stoppages */}
          {activeTab === 'preStoppages' && (
            <div>
              <h4 className="font-bold text-gray-700 mb-4">توقفات قبل از شروع</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50"><tr>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">ردیف</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">From (24h)</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Till (24h)</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Minute</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Working Group</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">علت توقف</th>
                  </tr></thead>
                  <tbody className="divide-y">
                    {form.preStoppages.map((s: any, i: number) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-2 py-2 text-gray-500">{i + 1}</td>
                        <td className="px-2 py-2">
                          <TimeInput24h value={s.from} onChange={(val) => updateStoppage('preStoppages', i, 'from', val)} />
                        </td>
                        <td className="px-2 py-2">
                          <TimeInput24h value={s.till} onChange={(val) => updateStoppage('preStoppages', i, 'till', val)} />
                        </td>
                        <td className="px-2 py-2"><input type="number" className="input-field w-20 bg-gray-100" value={s.minutes} readOnly /></td>
                        <td className="px-2 py-2">
                          <select className="input-field w-40" value={s.workingGroup} onChange={e => updateStoppage('preStoppages', i, 'workingGroup', e.target.value)}>
                            <option value="">انتخاب</option>
                            {WORKING_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                          </select>
                        </td>
                        <td className="px-2 py-2">
                          <select className="input-field w-40" value={s.reason} onChange={e => updateStoppage('preStoppages', i, 'reason', e.target.value)}>
                            <option value="">انتخاب یا تایپ کنید</option>
                            {PRE_START_STOP_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                            <option value="custom">سایر (تایپ کنید)</option>
                          </select>
                          {s.reason === 'custom' && (
                            <input type="text" className="input-field w-40 mt-1" placeholder="علت توقف" value={s.customReason} onChange={e => updateStoppage('preStoppages', i, 'customReason', e.target.value)} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Process Description */}
          {activeTab === 'process' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-700 mb-4">SAMPLE TIME</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <TimeInput24h label="Time" value="" onChange={() => {}} />
                  <div><label className="label-field">Tap</label><input type="number" className="input-field" /></div>
                  <div><label className="label-field">DRI (Ton)</label><input type="number" step="0.1" className="input-field" value={form.dri} onChange={e => setForm({...form, dri: Number(e.target.value)})} /></div>
                  <div><label className="label-field">Briquet (Ton)</label><input type="number" step="0.1" className="input-field" value={form.briquet} onChange={e => setForm({...form, briquet: Number(e.target.value)})} /></div>
                  <div><label className="label-field">Dolomite (Kg)</label><input type="number" className="input-field" value={form.dolomite} onChange={e => setForm({...form, dolomite: Number(e.target.value)})} /></div>
                  <div><label className="label-field">Lime MHU (Kg)</label><input type="number" className="input-field" value={form.lime} onChange={e => setForm({...form, lime: Number(e.target.value)})} /></div>
                  <div><label className="label-field">Carbon MHU (Kg)</label><input type="number" className="input-field" value={form.carbon} onChange={e => setForm({...form, carbon: Number(e.target.value)})} /></div>
                  <div><label className="label-field">CPC MHU (Kg)</label><input type="number" className="input-field" value={form.cpcMHU} onChange={e => setForm({...form, cpcMHU: Number(e.target.value)})} /></div>
                  <div><label className="label-field">CPC Injection (Kg)</label><input type="number" className="input-field" value={form.cpcInjection} onChange={e => setForm({...form, cpcInjection: Number(e.target.value)})} /></div>
                  <div><label className="label-field">CH4 (Nm³)</label><input type="number" className="input-field" value={form.ch4} onChange={e => setForm({...form, ch4: Number(e.target.value)})} /></div>
                  <div><label className="label-field">Oxygen (Nm³)</label><input type="number" className="input-field" value={form.oxygen} onChange={e => setForm({...form, oxygen: Number(e.target.value)})} /></div>
                </div>
              </div>
              <div className="border-t pt-6">
                <h4 className="font-bold text-gray-700 mb-4">Tapping Start</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <TimeInput24h label="Time" value={form.tappingStartTime} onChange={(val) => setForm({...form, tappingStartTime: val})} />
                  <div><label className="label-field">Tap</label><input type="number" className="input-field" /></div>
                  <div><label className="label-field">DRI (Ton)</label><input type="number" step="0.1" className="input-field" value={form.t_dri} onChange={e => setForm({...form, t_dri: Number(e.target.value)})} /></div>
                  <div><label className="label-field">Briquet (Ton)</label><input type="number" step="0.1" className="input-field" value={form.t_briquet} onChange={e => setForm({...form, t_briquet: Number(e.target.value)})} /></div>
                  <div><label className="label-field">Dolomite (Kg)</label><input type="number" className="input-field" value={form.t_dolomite} onChange={e => setForm({...form, t_dolomite: Number(e.target.value)})} /></div>
                  <div><label className="label-field">Lime MHU (Kg)</label><input type="number" className="input-field" value={form.t_lime} onChange={e => setForm({...form, t_lime: Number(e.target.value)})} /></div>
                  <div><label className="label-field">Carbon MHU (Kg)</label><input type="number" className="input-field" value={form.t_carbon} onChange={e => setForm({...form, t_carbon: Number(e.target.value)})} /></div>
                  <div><label className="label-field">CPC MHU (Kg)</label><input type="number" className="input-field" value={form.t_cpcMHU} onChange={e => setForm({...form, t_cpcMHU: Number(e.target.value)})} /></div>
                  <div><label className="label-field">CPC Injection (Kg)</label><input type="number" className="input-field" value={form.t_cpcInjection} onChange={e => setForm({...form, t_cpcInjection: Number(e.target.value)})} /></div>
                  <div><label className="label-field">CH4 (Nm³)</label><input type="number" className="input-field" value={form.t_ch4} onChange={e => setForm({...form, t_ch4: Number(e.target.value)})} /></div>
                  <div><label className="label-field">Oxygen (Nm³)</label><input type="number" className="input-field" value={form.t_oxygen} onChange={e => setForm({...form, t_oxygen: Number(e.target.value)})} /></div>
                </div>
              </div>
            </div>
          )}

          {/* During Stoppages */}
          {activeTab === 'stoppages' && (
            <div>
              <h4 className="font-bold text-gray-700 mb-4">توقفات حین کار</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50"><tr>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">ردیف</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">From (24h)</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Till (24h)</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Minute</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Working Group</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">علت توقف</th>
                  </tr></thead>
                  <tbody className="divide-y">
                    {form.duringStoppages.map((s: any, i: number) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-2 py-2 text-gray-500">{i + 1}</td>
                        <td className="px-2 py-2">
                          <TimeInput24h value={s.from} onChange={(val) => updateStoppage('duringStoppages', i, 'from', val)} />
                        </td>
                        <td className="px-2 py-2">
                          <TimeInput24h value={s.till} onChange={(val) => updateStoppage('duringStoppages', i, 'till', val)} />
                        </td>
                        <td className="px-2 py-2"><input type="number" className="input-field w-20 bg-gray-100" value={s.minutes} readOnly /></td>
                        <td className="px-2 py-2">
                          <select className="input-field w-40" value={s.workingGroup} onChange={e => updateStoppage('duringStoppages', i, 'workingGroup', e.target.value)}>
                            <option value="">انتخاب</option>
                            {WORKING_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                          </select>
                        </td>
                        <td className="px-2 py-2">
                          <input type="text" className="input-field w-48" placeholder="علت توقف" value={s.reason} onChange={e => updateStoppage('duringStoppages', i, 'reason', e.target.value)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Ladle */}
          {activeTab === 'ladle' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="label-field">Ladle Number</label>
                <select className="input-field" value={form.ladleNumber} onChange={e => setForm({...form, ladleNumber: e.target.value})}>
                  <option value="">انتخاب</option>
                  {['1','2','3','4','5','6','7','8','9'].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <TimeInput24h label="Request Time" value={form.requestTime} onChange={(val) => setForm({...form, requestTime: val})} />
              <TimeInput24h label="Delivery Time" value={form.deliveryTime} onChange={(val) => setForm({...form, deliveryTime: val})} />
              <div><label className="label-field">Slag Condition</label><input type="number" className="input-field" value={form.slagCondition} onChange={e => setForm({...form, slagCondition: e.target.value})} placeholder="عدد" /></div>
              <div><label className="label-field">Wall Condition</label><input type="number" className="input-field" value={form.wallCondition} onChange={e => setForm({...form, wallCondition: e.target.value})} placeholder="عدد" /></div>
            </div>
          )}

          {/* Electrode */}
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

          {/* Scrap */}
          {activeTab === 'scrap' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium mb-3">سبد {i}</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label-field">Bucket Number</label>
                      <input type="text" className="input-field" value={(form as any)[`bucket${i}Number`]} onChange={e => setForm({...form, [`bucket${i}Number`]: e.target.value})} />
                    </div>
                    <div>
                      <label className="label-field">Tonnage (Ton)</label>
                      <input type="number" step="0.1" className="input-field" value={(form as any)[`bucket${i}Tonnage`]} onChange={e => setForm({...form, [`bucket${i}Tonnage`]: Number(e.target.value)})} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Additives */}
          {activeTab === 'additives' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { key: 'a_feMn', label: 'FeMn' },
                { key: 'a_feSiMn', label: 'FeSiMn' },
                { key: 'a_feSi', label: 'FeSi' },
                { key: 'a_lime', label: 'Lime' },
                { key: 'a_graphite', label: 'Graphite (CPC)' },
                { key: 'a_caAl', label: 'Ca.Al / Al-CaC2' },
              ].map(a => (
                <div key={a.key}>
                  <label className="label-field">{a.label} (Kg)</label>
                  <input type="number" className="input-field" value={(form as any)[a.key]} onChange={e => setForm({...form, [a.key]: Number(e.target.value)})} />
                </div>
              ))}
            </div>
          )}

          {/* Analysis */}
          {activeTab === 'analysis' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">نمونه</th>
                  {['c', 'si', 'mn', 'p', 's'].map(e => <th key={e} className="px-3 py-2 text-center text-xs font-medium text-gray-500">{e.toUpperCase()}%</th>)}
                </tr></thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-3 py-2 font-medium">1st Sample</td>
                    {(['c', 'si', 'mn', 'p', 's'] as const).map(e => (
                      <td key={e} className="px-3 py-2">
                        <input type="number" step="0.001" className="input-field w-20 mx-auto text-center" 
                          value={form.sample1[e]} 
                          onChange={ev => setForm({...form, sample1: {...form.sample1, [e]: Number(ev.target.value)}})} />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium">2nd Sample</td>
                    {(['c', 'si', 'mn', 'p', 's'] as const).map(e => (
                      <td key={e} className="px-3 py-2">
                        <input type="number" step="0.001" className="input-field w-20 mx-auto text-center" 
                          value={form.sample2[e]} 
                          onChange={ev => setForm({...form, sample2: {...form.sample2, [e]: Number(ev.target.value)}})} />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium">3rd Sample</td>
                    {(['c', 'si', 'mn', 'p', 's'] as const).map(e => (
                      <td key={e} className="px-3 py-2">
                        <input type="number" step="0.001" className="input-field w-20 mx-auto text-center" 
                          value={form.sample3[e]} 
                          onChange={ev => setForm({...form, sample3: {...form.sample3, [e]: Number(ev.target.value)}})} />
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Consumables */}
          {activeTab === 'consumables' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: 'thermocouple', label: 'Thermocouple' },
                { key: 'sampler', label: 'Sampler' },
                { key: 'oxyProbe', label: 'Oxy. Probe' },
                { key: 'tapholeSand', label: 'Taphole Sand (Kg)' },
              ].map(item => (
                <div key={item.key}>
                  <label className="label-field">{item.label}</label>
                  <input type="number" className="input-field" value={(form as any)[item.key]} onChange={e => setForm({...form, [item.key]: Number(e.target.value)})} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
