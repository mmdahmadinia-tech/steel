import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { STEEL_GRADES, SHIFTS, WORKING_GROUPS, PRE_START_STOP_REASONS } from '../data/mockData';
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

export default function EAFPage() {
  const { heats, addHeat, updateHeat, getNextHeatId } = useData();
  const { user } = useAuth();
  
  const [selectedHeatId, setSelectedHeatId] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [saveMessage, setSaveMessage] = useState('');

  const [form, setForm] = useState<any>({
    date: getTodayJalali(),
    shift: 'A',
    steelGrade: '4402',
    heatStartTime: '',
    tappingStartTime: '',
    tappingEndTime: '',
    tappingWeight: 0,
    carbonPercent: 0,
    ppm: 0,
    powerOn: 0,
    // Refractory
    walls: 0, centerPiece: 0, bottom: 0, taphole: 0,
    // Sample Time
    sampleTime: '', sampleTemp: 0, sampleTap: 0, sampleEnCou: 0,
    sampleDri: 0, sampleBriquet: 0, sampleDolomite: 0,
    sampleLimeMHU: 0, sampleCarbonMHU: 0, sampleCpcMHU: 0,
    sampleCpcInjection: 0, sampleCh4: 0, sampleOxygen: 0,
    // Tapping Start
    tappingTime: '', tappingTemp: 0, tappingTap: 0, tappingEnCou: 0,
    tappingDri: 0, tappingBriquet: 0, tappingDolomite: 0,
    tappingLimeMHU: 0, tappingCarbonMHU: 0, tappingCpcMHU: 0,
    tappingCpcInjection: 0, tappingCh4: 0, tappingOxygen: 0,
    // Stoppages
    preStoppages: Array(7).fill(null).map(() => ({ from: '', till: '', minutes: 0, workingGroup: '', reason: '', customReason: '' })),
    duringStoppages: Array(7).fill(null).map(() => ({ from: '', till: '', minutes: 0, workingGroup: '', reason: '', customReason: '' })),
    // Ladle
    ladleNumber: '', slagCondition: '', wallCondition: '',
    // Consumables
    thermocouple: 0, sampler: 0, oxyProbe: 0, tapholeSand: 0,
    // Analysis
    sample1: { c: 0, si: 0, mn: 0, p: 0, s: 0 },
    sample2: { c: 0, si: 0, mn: 0, p: 0, s: 0 },
    sample3: { c: 0, si: 0, mn: 0, p: 0, s: 0 },
    // Scrap
    bucket1Number: '', bucket1Tonnage: 0,
    bucket2Number: '', bucket2Tonnage: 0,
    // Additives - سه کادر جداگانه
    a_feMn: 0, a_feSiMn: 0, a_feSi: 0, a_lime: 0, a_graphite: 0,
    a_caAl: 0, a_al: 0, a_cac2: 0,
    // Electrode
    phase1: [] as string[], phase2: [] as string[], phase3: [] as string[],
    // Notes
    shiftSupervisorNotes: '',
  });

  // Calculate refractory values based on previous heat
  const getPreviousRefractory = () => {
    const previousHeats = heats.filter(h => h.eafData).sort((a, b) => b.id.localeCompare(a.id));
    const prev = previousHeats[0];
    const prevRefractory = (prev?.eafData as any)?.refractoryCounters;
    console.log('getPreviousRefractory - Previous heat:', prev?.heatId);
    console.log('getPreviousRefractory - Previous refractory:', prevRefractory);
    return {
      walls: prevRefractory ? (prevRefractory.walls || 0) + 1 : 0,
      centerPiece: prevRefractory ? (prevRefractory.centerPiece || 0) + 1 : 0,
      bottom: prevRefractory ? (prevRefractory.bottom || 0) + 1 : 0,
      taphole: prevRefractory ? (prevRefractory.taphole || 0) + 1 : 0,
    };
  };

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
          tappingStartTime: d.tappingStartTime || '',
          tappingEndTime: d.tappingEndTime || '',
          tappingWeight: d.tappingWeight || 0,
          carbonPercent: d.carbonPercent || 0,
          ppm: d.ppm || 0,
          powerOn: d.powerOn || 0,
          walls: d.refractoryCounters?.walls ?? 0,
          centerPiece: d.refractoryCounters?.centerPiece ?? 0,
          bottom: d.refractoryCounters?.bottom ?? 0,
          taphole: d.refractoryCounters?.taphole ?? 0,
          sampleTime: d.sampleTime || '',
          sampleTemp: d.sampleTemp || 0,
          sampleTap: d.sampleTap || 0,
          sampleEnCou: d.sampleEnCou || 0,
          sampleDri: d.sampleDri || 0,
          sampleBriquet: d.sampleBriquet || 0,
          sampleDolomite: d.sampleDolomite || 0,
          sampleLimeMHU: d.sampleLimeMHU || 0,
          sampleCarbonMHU: d.sampleCarbonMHU || 0,
          sampleCpcMHU: d.sampleCpcMHU || 0,
          sampleCpcInjection: d.sampleCpcInjection || 0,
          sampleCh4: d.sampleCh4 || 0,
          sampleOxygen: d.sampleOxygen || 0,
          tappingTime: d.tappingTime || '',
          tappingTemp: d.tappingTemp || 0,
          tappingTap: d.tappingTap || 0,
          tappingEnCou: d.tappingEnCou || 0,
          tappingDri: d.tappingDri || 0,
          tappingBriquet: d.tappingBriquet || 0,
          tappingDolomite: d.tappingDolomite || 0,
          tappingLimeMHU: d.tappingLimeMHU || 0,
          tappingCarbonMHU: d.tappingCarbonMHU || 0,
          tappingCpcMHU: d.tappingCpcMHU || 0,
          tappingCpcInjection: d.tappingCpcInjection || 0,
          tappingCh4: d.tappingCh4 || 0,
          tappingOxygen: d.tappingOxygen || 0,
          preStoppages: d.preStoppages || Array(7).fill(null).map(() => ({ from: '', till: '', minutes: 0, workingGroup: '', reason: '', customReason: '' })),
          duringStoppages: d.duringStoppages || Array(7).fill(null).map(() => ({ from: '', till: '', minutes: 0, workingGroup: '', reason: '', customReason: '' })),
          ladleNumber: d.ladleInfo?.ladleNumber || '',
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
          a_al: d.additives?.al || 0,
          a_cac2: d.additives?.cac2 || 0,
          phase1: d.electrodeStatus?.phase1 || [],
          phase2: d.electrodeStatus?.phase2 || [],
          phase3: d.electrodeStatus?.phase3 || [],
          shiftSupervisorNotes: d.shiftSupervisorNotes || '',
        });
      }
    } else {
      // New heat - use calculated refractory values
      const prevRefractory = getPreviousRefractory();
      console.log('=== NEW HEAT - Using calculated refractory ===');
      console.log('Previous refractory + 1:', prevRefractory);
      
      setForm({
        date: getTodayJalali(),
        shift: 'A',
        steelGrade: '4402',
        heatStartTime: '',
        tappingStartTime: '',
        tappingEndTime: '',
        tappingWeight: 0,
        carbonPercent: 0,
        ppm: 0,
        powerOn: 0,
        walls: prevRefractory.walls,
        centerPiece: prevRefractory.centerPiece,
        bottom: prevRefractory.bottom,
        taphole: prevRefractory.taphole,
        sampleTime: '', sampleTemp: 0, sampleTap: 0, sampleEnCou: 0,
        sampleDri: 0, sampleBriquet: 0, sampleDolomite: 0,
        sampleLimeMHU: 0, sampleCarbonMHU: 0, sampleCpcMHU: 0,
        sampleCpcInjection: 0, sampleCh4: 0, sampleOxygen: 0,
        tappingTime: '', tappingTemp: 0, tappingTap: 0, tappingEnCou: 0,
        tappingDri: 0, tappingBriquet: 0, tappingDolomite: 0,
        tappingLimeMHU: 0, tappingCarbonMHU: 0, tappingCpcMHU: 0,
        tappingCpcInjection: 0, tappingCh4: 0, tappingOxygen: 0,
        preStoppages: Array(7).fill(null).map(() => ({ from: '', till: '', minutes: 0, workingGroup: '', reason: '', customReason: '' })),
        duringStoppages: Array(7).fill(null).map(() => ({ from: '', till: '', minutes: 0, workingGroup: '', reason: '', customReason: '' })),
        ladleNumber: '', slagCondition: '', wallCondition: '',
        thermocouple: 0, sampler: 0, oxyProbe: 0, tapholeSand: 0,
        sample1: { c: 0, si: 0, mn: 0, p: 0, s: 0 },
        sample2: { c: 0, si: 0, mn: 0, p: 0, s: 0 },
        sample3: { c: 0, si: 0, mn: 0, p: 0, s: 0 },
        bucket1Number: '', bucket1Tonnage: 0,
        bucket2Number: '', bucket2Tonnage: 0,
        a_feMn: 0, a_feSiMn: 0, a_feSi: 0, a_lime: 0, a_graphite: 0,
        a_caAl: 0, a_al: 0, a_cac2: 0,
        phase1: [], phase2: [], phase3: [],
        shiftSupervisorNotes: '',
      });
    }
  }, [selectedHeatId, heats]);

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
      sampleTime: form.sampleTime,
      sampleTemp: form.sampleTemp,
      sampleTap: form.sampleTap,
      sampleEnCou: form.sampleEnCou,
      sampleDri: form.sampleDri,
      sampleBriquet: form.sampleBriquet,
      sampleDolomite: form.sampleDolomite,
      sampleLimeMHU: form.sampleLimeMHU,
      sampleCarbonMHU: form.sampleCarbonMHU,
      sampleCpcMHU: form.sampleCpcMHU,
      sampleCpcInjection: form.sampleCpcInjection,
      sampleCh4: form.sampleCh4,
      sampleOxygen: form.sampleOxygen,
      tappingTime: form.tappingTime,
      tappingTemp: form.tappingTemp,
      tappingTap: form.tappingTap,
      tappingEnCou: form.tappingEnCou,
      tappingDri: form.tappingDri,
      tappingBriquet: form.tappingBriquet,
      tappingDolomite: form.tappingDolomite,
      tappingLimeMHU: form.tappingLimeMHU,
      tappingCarbonMHU: form.tappingCarbonMHU,
      tappingCpcMHU: form.tappingCpcMHU,
      tappingCpcInjection: form.tappingCpcInjection,
      tappingCh4: form.tappingCh4,
      tappingOxygen: form.tappingOxygen,
      preStoppages: form.preStoppages,
      duringStoppages: form.duringStoppages,
      ladleInfo: {
        ladleNumber: form.ladleNumber,
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
        feMn: form.a_feMn,
        feSiMn: form.a_feSiMn,
        feSi: form.a_feSi,
        lime: form.a_lime,
        graphite: form.a_graphite,
        caAl: form.a_caAl,
        al: form.a_al,
        cac2: form.a_cac2,
      },
      electrodeStatus: { phase1: form.phase1, phase2: form.phase2, phase3: form.phase3 },
      shiftSupervisorNotes: form.shiftSupervisorNotes,
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
      
      setSaveMessage(`✅ ذوب ${newHeatId} با موفقیت ثبت شد`);
      
      // Reset form for next heat with auto-incremented refractory
      // Calculate new refractory values based on the heat we just saved
      const newRefractory = {
        walls: (eafData.refractoryCounters.walls || 0) + 1,
        centerPiece: (eafData.refractoryCounters.centerPiece || 0) + 1,
        bottom: (eafData.refractoryCounters.bottom || 0) + 1,
        taphole: (eafData.refractoryCounters.taphole || 0) + 1,
      };
      
      console.log('=== SAVED NEW HEAT ===');
      console.log('Saved refractory:', eafData.refractoryCounters);
      console.log('Next heat refractory will be:', newRefractory);
      
      // Reset form with new refractory values
      setTimeout(() => {
        setForm({
          date: getTodayJalali(),
          shift: 'A',
          steelGrade: '4402',
          heatStartTime: '',
          tappingStartTime: '',
          tappingEndTime: '',
          tappingWeight: 0,
          carbonPercent: 0,
          ppm: 0,
          powerOn: 0,
          walls: newRefractory.walls,
          centerPiece: newRefractory.centerPiece,
          bottom: newRefractory.bottom,
          taphole: newRefractory.taphole,
          sampleTime: '', sampleTemp: 0, sampleTap: 0, sampleEnCou: 0,
          sampleDri: 0, sampleBriquet: 0, sampleDolomite: 0,
          sampleLimeMHU: 0, sampleCarbonMHU: 0, sampleCpcMHU: 0,
          sampleCpcInjection: 0, sampleCh4: 0, sampleOxygen: 0,
          tappingTime: '', tappingTemp: 0, tappingTap: 0, tappingEnCou: 0,
          tappingDri: 0, tappingBriquet: 0, tappingDolomite: 0,
          tappingLimeMHU: 0, tappingCarbonMHU: 0, tappingCpcMHU: 0,
          tappingCpcInjection: 0, tappingCh4: 0, tappingOxygen: 0,
          preStoppages: Array(7).fill(null).map(() => ({ from: '', till: '', minutes: 0, workingGroup: '', reason: '', customReason: '' })),
          duringStoppages: Array(7).fill(null).map(() => ({ from: '', till: '', minutes: 0, workingGroup: '', reason: '', customReason: '' })),
          ladleNumber: '', slagCondition: '', wallCondition: '',
          thermocouple: 0, sampler: 0, oxyProbe: 0, tapholeSand: 0,
          sample1: { c: 0, si: 0, mn: 0, p: 0, s: 0 },
          sample2: { c: 0, si: 0, mn: 0, p: 0, s: 0 },
          sample3: { c: 0, si: 0, mn: 0, p: 0, s: 0 },
          bucket1Number: '', bucket1Tonnage: 0,
          bucket2Number: '', bucket2Tonnage: 0,
          a_feMn: 0, a_feSiMn: 0, a_feSi: 0, a_lime: 0, a_graphite: 0,
          a_caAl: 0, a_al: 0, a_cac2: 0,
          phase1: [], phase2: [], phase3: [],
          shiftSupervisorNotes: '',
        });
        setSelectedHeatId('');
      }, 100);
    } else {
      const heat = heats.find(h => h.heatId === selectedHeatId);
      if (heat) {
        updateHeat(heat.id, { eafData, eafStatus: 'completed', updatedAt: new Date().toLocaleString('fa-IR') });
        setSaveMessage(`✅ ذوب ${selectedHeatId} با موفقیت بروزرسانی شد`);
      }
    }
    setTimeout(() => setSaveMessage(''), 3000);
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

      <div className="card p-0 overflow-hidden">
        <div className="flex overflow-x-auto border-b bg-gray-50">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
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
                <input type="text" className="input-field bg-gray-100" value={selectedHeatId || getNextHeatId()} disabled />
              </div>
              <div>
                <label className="label-field">گرید فولاد</label>
                <select className="input-field" value={form.steelGrade} onChange={e => setForm({...form, steelGrade: e.target.value})}>
                  {STEEL_GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <TimeInput24h label="شروع ذوب" value={form.heatStartTime} onChange={(val) => setForm({...form, heatStartTime: val})} />
              <TimeInput24h label="شروع تخلیه" value={form.tappingStartTime} onChange={(val) => setForm({...form, tappingStartTime: val})} />
              <TimeInput24h label="پایان تخلیه" value={form.tappingEndTime} onChange={(val) => setForm({...form, tappingEndTime: val})} />
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
              <div>
                <label className="label-field">POWER ON (دقیقه)</label>
                <input type="number" className="input-field" value={form.powerOn} onChange={e => setForm({...form, powerOn: Number(e.target.value)})} />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-600 font-medium">مدت تخلیه</p>
                <p className="text-xl font-bold text-blue-800">{calculated.tappingDuration} دقیقه</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs text-green-600 font-medium">POWER OFF</p>
                <p className="text-xl font-bold text-green-800">{calculated.powerOff} دقیقه</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-xs text-purple-600 font-medium">TAP TO TAP</p>
                <p className="text-xl font-bold text-purple-800">{calculated.tapToTap} دقیقه</p>
              </div>
              <div className="md:col-span-2 lg:col-span-4">
                <label className="label-field">توضیحات سرشیفت</label>
                <textarea className="input-field h-20" value={form.shiftSupervisorNotes} onChange={e => setForm({...form, shiftSupervisorNotes: e.target.value})} placeholder="توضیحات سرشیفت..."></textarea>
              </div>
            </div>
          )}

          {activeTab === 'refractory' && (
            <div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-800">
                ⚠️ اعداد به‌صورت خودکار از ذوب قبلی +1 شده‌اند.
                <br />
                <strong>مقادیر فعلی:</strong> Walls: {form.walls}, Center Piece: {form.centerPiece}, Bottom: {form.bottom}, Taphole: {form.taphole}
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
                        <td className="px-2 py-2"><TimeInput24h value={s.from} onChange={(val) => updateStoppage('preStoppages', i, 'from', val)} /></td>
                        <td className="px-2 py-2"><TimeInput24h value={s.till} onChange={(val) => updateStoppage('preStoppages', i, 'till', val)} /></td>
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

          {activeTab === 'process' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-700 mb-4">SAMPLE TIME</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <TimeInput24h label="Time" value={form.sampleTime} onChange={(val) => setForm({...form, sampleTime: val})} />
                  <div><label className="label-field">Temp (°C)</label><input type="number" className="input-field" value={form.sampleTemp} onChange={e => setForm({...form, sampleTemp: Number(e.target.value)})} /></div>
                  <div><label className="label-field">Tap</label><input type="number" className="input-field" value={form.sampleTap} onChange={e => setForm({...form, sampleTap: Number(e.target.value)})} /></div>
                  <div><label className="label-field">En.Cou (MWh)</label><input type="number" step="0.1" className="input-field" value={form.sampleEnCou} onChange={e => setForm({...form, sampleEnCou: Number(e.target.value)})} /></div>
                  <div><label className="label-field">DRI (Ton)</label><input type="number" step="0.1" className="input-field" value={form.sampleDri} onChange={e => setForm({...form, sampleDri: Number(e.target.value)})} /></div>
                  <div><label className="label-field">Briquet (Ton)</label><input type="number" step="0.1" className="input-field" value={form.sampleBriquet} onChange={e => setForm({...form, sampleBriquet: Number(e.target.value)})} /></div>
                  <div><label className="label-field">Dolomite (Kg)</label><input type="number" className="input-field" value={form.sampleDolomite} onChange={e => setForm({...form, sampleDolomite: Number(e.target.value)})} /></div>
                  <div><label className="label-field">Lime MHU (Kg)</label><input type="number" className="input-field" value={form.sampleLimeMHU} onChange={e => setForm({...form, sampleLimeMHU: Number(e.target.value)})} /></div>
                  <div><label className="label-field">Carbon MHU (Kg)</label><input type="number" className="input-field" value={form.sampleCarbonMHU} onChange={e => setForm({...form, sampleCarbonMHU: Number(e.target.value)})} /></div>
                  <div><label className="label-field">CPC MHU (Kg)</label><input type="number" className="input-field" value={form.sampleCpcMHU} onChange={e => setForm({...form, sampleCpcMHU: Number(e.target.value)})} /></div>
                  <div><label className="label-field">CPC Injection (Kg)</label><input type="number" className="input-field" value={form.sampleCpcInjection} onChange={e => setForm({...form, sampleCpcInjection: Number(e.target.value)})} /></div>
                  <div><label className="label-field">CH4 (Nm³)</label><input type="number" className="input-field" value={form.sampleCh4} onChange={e => setForm({...form, sampleCh4: Number(e.target.value)})} /></div>
                  <div><label className="label-field">Oxygen (Nm³)</label><input type="number" className="input-field" value={form.sampleOxygen} onChange={e => setForm({...form, sampleOxygen: Number(e.target.value)})} /></div>
                </div>
              </div>
              <div className="border-t pt-6">
                <h4 className="font-bold text-gray-700 mb-4">Tapping Start</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <TimeInput24h label="Time" value={form.tappingTime} onChange={(val) => setForm({...form, tappingTime: val})} />
                  <div><label className="label-field">Temp (°C)</label><input type="number" className="input-field" value={form.tappingTemp} onChange={e => setForm({...form, tappingTemp: Number(e.target.value)})} /></div>
                  <div><label className="label-field">Tap</label><input type="number" className="input-field" value={form.tappingTap} onChange={e => setForm({...form, tappingTap: Number(e.target.value)})} /></div>
                  <div><label className="label-field">En.Cou (MWh)</label><input type="number" step="0.1" className="input-field" value={form.tappingEnCou} onChange={e => setForm({...form, tappingEnCou: Number(e.target.value)})} /></div>
                  <div><label className="label-field">DRI (Ton)</label><input type="number" step="0.1" className="input-field" value={form.tappingDri} onChange={e => setForm({...form, tappingDri: Number(e.target.value)})} /></div>
                  <div><label className="label-field">Briquet (Ton)</label><input type="number" step="0.1" className="input-field" value={form.tappingBriquet} onChange={e => setForm({...form, tappingBriquet: Number(e.target.value)})} /></div>
                  <div><label className="label-field">Dolomite (Kg)</label><input type="number" className="input-field" value={form.tappingDolomite} onChange={e => setForm({...form, tappingDolomite: Number(e.target.value)})} /></div>
                  <div><label className="label-field">Lime MHU (Kg)</label><input type="number" className="input-field" value={form.tappingLimeMHU} onChange={e => setForm({...form, tappingLimeMHU: Number(e.target.value)})} /></div>
                  <div><label className="label-field">Carbon MHU (Kg)</label><input type="number" className="input-field" value={form.tappingCarbonMHU} onChange={e => setForm({...form, tappingCarbonMHU: Number(e.target.value)})} /></div>
                  <div><label className="label-field">CPC MHU (Kg)</label><input type="number" className="input-field" value={form.tappingCpcMHU} onChange={e => setForm({...form, tappingCpcMHU: Number(e.target.value)})} /></div>
                  <div><label className="label-field">CPC Injection (Kg)</label><input type="number" className="input-field" value={form.tappingCpcInjection} onChange={e => setForm({...form, tappingCpcInjection: Number(e.target.value)})} /></div>
                  <div><label className="label-field">CH4 (Nm³)</label><input type="number" className="input-field" value={form.tappingCh4} onChange={e => setForm({...form, tappingCh4: Number(e.target.value)})} /></div>
                  <div><label className="label-field">Oxygen (Nm³)</label><input type="number" className="input-field" value={form.tappingOxygen} onChange={e => setForm({...form, tappingOxygen: Number(e.target.value)})} /></div>
                </div>
              </div>
            </div>
          )}

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
                        <td className="px-2 py-2"><TimeInput24h value={s.from} onChange={(val) => updateStoppage('duringStoppages', i, 'from', val)} /></td>
                        <td className="px-2 py-2"><TimeInput24h value={s.till} onChange={(val) => updateStoppage('duringStoppages', i, 'till', val)} /></td>
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

          {activeTab === 'ladle' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label-field">Ladle Number</label>
                <select className="input-field" value={form.ladleNumber} onChange={e => setForm({...form, ladleNumber: e.target.value})}>
                  <option value="">انتخاب</option>
                  {['1','2','3','4','5','6','7','8','9'].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div><label className="label-field">Slag Condition</label><input type="number" className="input-field" value={form.slagCondition} onChange={e => setForm({...form, slagCondition: e.target.value})} /></div>
              <div><label className="label-field">Wall Condition</label><input type="number" className="input-field" value={form.wallCondition} onChange={e => setForm({...form, wallCondition: e.target.value})} /></div>
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

          {activeTab === 'additives' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div><label className="label-field">FeMn (Kg)</label><input type="number" className="input-field" value={form.a_feMn} onChange={e => setForm({...form, a_feMn: Number(e.target.value)})} /></div>
              <div><label className="label-field">FeSiMn (Kg)</label><input type="number" className="input-field" value={form.a_feSiMn} onChange={e => setForm({...form, a_feSiMn: Number(e.target.value)})} /></div>
              <div><label className="label-field">FeSi (Kg)</label><input type="number" className="input-field" value={form.a_feSi} onChange={e => setForm({...form, a_feSi: Number(e.target.value)})} /></div>
              <div><label className="label-field">Lime (Kg)</label><input type="number" className="input-field" value={form.a_lime} onChange={e => setForm({...form, a_lime: Number(e.target.value)})} /></div>
              <div><label className="label-field">Graphite (CPC) (Kg)</label><input type="number" className="input-field" value={form.a_graphite} onChange={e => setForm({...form, a_graphite: Number(e.target.value)})} /></div>
              <div><label className="label-field">Ca.Al (Kg)</label><input type="number" className="input-field" value={form.a_caAl} onChange={e => setForm({...form, a_caAl: Number(e.target.value)})} /></div>
              <div><label className="label-field">AL (Kg)</label><input type="number" className="input-field" value={form.a_al} onChange={e => setForm({...form, a_al: Number(e.target.value)})} /></div>
              <div><label className="label-field">CaC2 (Kg)</label><input type="number" className="input-field" value={form.a_cac2} onChange={e => setForm({...form, a_cac2: Number(e.target.value)})} /></div>
            </div>
          )}

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
                        <input type="number" step="0.001" className="input-field w-20 mx-auto text-center" value={form.sample1[e]} onChange={ev => setForm({...form, sample1: {...form.sample1, [e]: Number(ev.target.value)}})} />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium">2nd Sample</td>
                    {(['c', 'si', 'mn', 'p', 's'] as const).map(e => (
                      <td key={e} className="px-3 py-2">
                        <input type="number" step="0.001" className="input-field w-20 mx-auto text-center" value={form.sample2[e]} onChange={ev => setForm({...form, sample2: {...form.sample2, [e]: Number(ev.target.value)}})} />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium">3rd Sample</td>
                    {(['c', 'si', 'mn', 'p', 's'] as const).map(e => (
                      <td key={e} className="px-3 py-2">
                        <input type="number" step="0.001" className="input-field w-20 mx-auto text-center" value={form.sample3[e]} onChange={ev => setForm({...form, sample3: {...form.sample3, [e]: Number(ev.target.value)}})} />
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'consumables' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><label className="label-field">Thermocouple</label><input type="number" className="input-field" value={form.thermocouple} onChange={e => setForm({...form, thermocouple: Number(e.target.value)})} /></div>
              <div><label className="label-field">Sampler</label><input type="number" className="input-field" value={form.sampler} onChange={e => setForm({...form, sampler: Number(e.target.value)})} /></div>
              <div><label className="label-field">Oxy. Probe</label><input type="number" className="input-field" value={form.oxyProbe} onChange={e => setForm({...form, oxyProbe: Number(e.target.value)})} /></div>
              <div><label className="label-field">Taphole Sand (Kg)</label><input type="number" className="input-field" value={form.tapholeSand} onChange={e => setForm({...form, tapholeSand: Number(e.target.value)})} /></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
