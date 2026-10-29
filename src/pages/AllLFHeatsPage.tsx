import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { SHIFTS, STEEL_GRADES } from '../data/mockData';
import JalaliDatePicker from '../components/JalaliDatePicker';

export default function AllLFHeatsPage() {
  const { heats } = useData();
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');
  const [filterHeatId, setFilterHeatId] = useState('');
  const [filterShift, setFilterShift] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [selectedHeat, setSelectedHeat] = useState<any>(null);

  let filteredHeats = heats.filter(h => h.lfStatus !== 'not_started' && h.lfData);

  filteredHeats = filteredHeats.filter(h => {
    const matchHeatId = !filterHeatId || h.heatId.includes(filterHeatId);
    const matchShift = !filterShift || h.shift === filterShift;
    const matchGrade = !filterGrade || h.steelGrade === filterGrade;
    
    let matchDate = true;
    if (filterDateStart || filterDateEnd) {
      const heatDate = h.date.replace(/\//g, '').replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
      const startDate = filterDateStart ? filterDateStart.replace(/\//g, '').replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))) : '';
      const endDate = filterDateEnd ? filterDateEnd.replace(/\//g, '').replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))) : '';
      
      if (startDate && endDate) {
        matchDate = heatDate >= startDate && heatDate <= endDate;
      } else if (startDate) {
        matchDate = heatDate >= startDate;
      } else if (endDate) {
        matchDate = heatDate <= endDate;
      }
    }
    
    return matchHeatId && matchShift && matchGrade && matchDate;
  });

  const exportSingleToExcel = (heat: any) => {
    const rows: any[] = [];
    const h = heat;
    const lf = h.lfData as any;

    // Header
    rows.push(['═══════════════════════════════════════════════════════════']);
    rows.push(['گزارش کامل ذوب LF', h.heatId]);
    rows.push(['═══════════════════════════════════════════════════════════']);
    rows.push(['']);
    
    // اطلاعات عمومی
    rows.push(['┌─────────────────────────────────────────────────────────┐']);
    rows.push(['│ اطلاعات عمومی                                          │']);
    rows.push(['└─────────────────────────────────────────────────────────┘']);
    rows.push(['شماره ذوب', h.heatId]);
    rows.push(['تاریخ', h.date]);
    rows.push(['شیفت', h.shift]);
    rows.push(['گرید', h.steelGrade]);
    rows.push(['Input Time (24h)', lf.inputCondition?.inputTime || '']);
    rows.push(['Delivery Time to CCM (24h)', lf.deliveryTimeToCCM || '']);
    rows.push(['Temperature (°C)', lf.inputCondition?.inputTemperature || 0]);
    rows.push(['']);
    
    // مواد افزودنی
    rows.push(['┌─────────────────────────────────────────────────────────┐']);
    rows.push(['│ مواد افزودنی (جمع کل)                                   │']);
    rows.push(['└─────────────────────────────────────────────────────────┘']);
    
    const additives = lf.additives || {};
    const additiveTotals: any = {};
    Object.keys(additives).forEach(key => {
      if (Array.isArray(additives[key])) {
        additiveTotals[key] = additives[key].reduce((sum: number, val: number) => sum + val, 0);
      }
    });
    
    rows.push(['Total FeMn (kg)', additiveTotals.feMn || 0]);
    rows.push(['Total FeSiMn (kg)', additiveTotals.feSiMn || 0]);
    rows.push(['Total FeSi (kg)', additiveTotals.feSi || 0]);
    rows.push(['Total Lime (kg)', additiveTotals.lime || 0]);
    rows.push(['Total Isoterm (kg)', additiveTotals.isoterm || 0]);
    rows.push(['Total Graphite (CPC) (kg)', additiveTotals.graphite || 0]);
    rows.push(['Total CaC2 (kg)', additiveTotals.caC2 || 0]);
    rows.push(['Total Ca.Al (kg)', additiveTotals.caAl || 0]);
    rows.push(['Total Graphite Wire (kg)', additiveTotals.graphiteWire || 0]);
    rows.push(['Total Metallurgy Coke (kg)', additiveTotals.metallurgyCoke || 0]);
    rows.push(['Total CaSi Wire (kg)', additiveTotals.caSiWire || 0]);
    rows.push(['Total CaFe Wire (kg)', additiveTotals.caFeWire || 0]);
    rows.push(['Total Boxite (kg)', additiveTotals.boxite || 0]);
    rows.push(['Total Al Wire (kg)', additiveTotals.alWire || 0]);
    rows.push(['Total Deoxidizer (kg)', additiveTotals.deoxidizer || 0]);
    rows.push(['']);
    
    // آرگون و پروب
    rows.push(['┌─────────────────────────────────────────────────────────┐']);
    rows.push(['│ آرگون و پروب                                           │']);
    rows.push(['└─────────────────────────────────────────────────────────┘']);
    rows.push(['Time String (دقیقه)', lf.argonConsumption?.timeString || 0]);
    rows.push(['Argon Consumption (Nm³)', lf.argonConsumption?.consumption || 0]);
    rows.push(['Thermocouple', lf.probeConsumption?.thermocouple || 0]);
    rows.push(['Sampler', lf.probeConsumption?.sampler || 0]);
    rows.push(['Oxy. Probe', lf.probeConsumption?.oxyProbe || 0]);
    rows.push(['']);
    
    // داده‌های فرایندی - به صورت ردیفی
    if (lf.processData && lf.processData.length > 0) {
      rows.push(['']);
      rows.push(['┌─────────────────────────────────────────────────────────┐']);
      rows.push(['│ داده‌های فرایندی (ردیفی)                               │']);
      rows.push(['└─────────────────────────────────────────────────────────┘']);
      rows.push(['ردیف', 'Time (24h)', 'Temp (°C)', 'PPM', 'En.Cou', 'Tap', 'P.on', 'Description']);
      lf.processData.forEach((p: any, i: number) => {
        if (p.time || p.temp || p.ppm || p.enCou || p.tap || p.pOn || p.description) {
          rows.push([`ردیف ${i + 1}`, p.time || '', p.temp || 0, p.ppm || 0, p.enCou || 0, p.tap || 0, p.pOn || 0, p.description || '']);
        }
      });
      rows.push(['']);
    }
    
    // توقفات - به صورت ردیفی
    if (lf.stoppages && lf.stoppages.length > 0) {
      rows.push(['┌─────────────────────────────────────────────────────────┐']);
      rows.push(['│ توقفات (ردیفی)                                         │']);
      rows.push(['└─────────────────────────────────────────────────────────┘']);
      rows.push(['ردیف', 'From (24h)', 'Till (24h)', 'Minute', 'Working Group', 'Description']);
      lf.stoppages.forEach((s: any, i: number) => {
        if (s.from || s.till) {
          rows.push([`ردیف ${i + 1}`, s.from || '', s.till || '', s.minutes || 0, s.workingGroup || '', s.description || '']);
        }
      });
      rows.push(['']);
    }
    
    // شرایط ورود
    rows.push(['┌─────────────────────────────────────────────────────────┐']);
    rows.push(['│ شرایط ورود مذاب                                        │']);
    rows.push(['└─────────────────────────────────────────────────────────┘']);
    rows.push(['PPM (O₂)', lf.inputCondition?.ppm || 0]);
    rows.push(['Slag Thickness (mm)', lf.inputCondition?.slagThickness || 0]);
    rows.push(['Free Board (mm)', lf.inputCondition?.freeBoard || 0]);
    rows.push(['']);
    
    // اطلاعات پاتیل
    rows.push(['┌─────────────────────────────────────────────────────────┐']);
    rows.push(['│ اطلاعات پاتیل                                          │']);
    rows.push(['└─────────────────────────────────────────────────────────┘']);
    rows.push(['Ladle Number', lf.ladleStatus?.ladleNumber || '']);
    rows.push(['Change Ladle', lf.ladleStatus?.changeLadle || '']);
    rows.push(['Slag Line Life', lf.ladleStatus?.slagLineLife || 0]);
    rows.push(['Ladle Life', lf.ladleStatus?.ladleLife || 0]);
    rows.push(['Transfercar Number', lf.ladleStatus?.transfercarNumber || '']);
    rows.push(['']);
    
    // الکترودها - به صورت ردیفی
    if (lf.electrodeStatus) {
      rows.push(['┌─────────────────────────────────────────────────────────┐']);
      rows.push(['│ الکترودها (ردیفی)                                      │']);
      rows.push(['└─────────────────────────────────────────────────────────┘']);
      rows.push(['فاز', 'وضعیت']);
      const phase1 = lf.electrodeStatus.phase1 || [];
      const phase2 = lf.electrodeStatus.phase2 || [];
      const phase3 = lf.electrodeStatus.phase3 || [];
      rows.push(['فاز 1', phase1.length > 0 ? phase1.join(', ') : '-']);
      rows.push(['فاز 2', phase2.length > 0 ? phase2.join(', ') : '-']);
      rows.push(['فاز 3', phase3.length > 0 ? phase3.join(', ') : '-']);
      rows.push(['']);
    }
    
    // وضعیت دمش‌ها - به صورت ردیفی
    if (lf.stringStatus) {
      rows.push(['┌─────────────────────────────────────────────────────────┐']);
      rows.push(['│ وضعیت دمش‌ها (ردیفی)                                  │']);
      rows.push(['└─────────────────────────────────────────────────────────┘']);
      rows.push(['خط', 'وضعیت']);
      rows.push(['Line 1', lf.stringStatus.line1 || '-']);
      rows.push(['Line 2', lf.stringStatus.line2 || '-']);
      rows.push(['']);
    }
    
    // آنالیز شیمیایی - به صورت ردیفی
    if (lf.chemicalAnalysis) {
      rows.push(['┌─────────────────────────────────────────────────────────┐']);
      rows.push(['│ آنالیز شیمیایی (ردیفی)                                 │']);
      rows.push(['└─────────────────────────────────────────────────────────┘']);
      rows.push(['نمونه', 'C (%)', 'Si (%)', 'Mn (%)', 'P (%)', 'S (%)', 'Al (%)']);
      const samples = ['sample1', 'sample2', 'sample3', 'sample4', 'sample5'];
      samples.forEach((s, i) => {
        const sample = lf.chemicalAnalysis[s];
        if (sample && (sample.c || sample.si || sample.mn || sample.p || sample.s || sample.al)) {
          rows.push([`نمونه ${i + 1}`, sample.c || 0, sample.si || 0, sample.mn || 0, sample.p || 0, sample.s || 0, sample.al || 0]);
        }
      });
      rows.push(['']);
    }
    
    rows.push(['═══════════════════════════════════════════════════════════']);
    rows.push(['End of Report']);
    rows.push(['═══════════════════════════════════════════════════════════']);

    const csv = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `heat_${h.heatId}_lf_full_report.csv`;
    link.click();
  };

  const exportAllToExcel = () => {
    const rows: any[] = [];
    
    // Header
    rows.push([
      'شماره ذوب', 'تاریخ', 'شیفت', 'گرید',
      'Input Time', 'Delivery Time to CCM', 'Temperature (°C)',
      'Total FeMn', 'Total FeSiMn', 'Total FeSi', 'Total Lime', 'Total Isoterm',
      'Total Graphite', 'Total CaC2', 'Total Ca.Al', 'Total Graphite Wire',
      'Total Metallurgy Coke', 'Total CaSi Wire', 'Total CaFe Wire',
      'Total Boxite', 'Total Al Wire', 'Total Deoxidizer',
      'Time String', 'Argon Consumption', 'Thermocouple', 'Sampler', 'Oxy. Probe',
      'PPM', 'Slag Thickness', 'Free Board',
      'Ladle Number', 'Change Ladle', 'Slag Line Life', 'Ladle Life', 'Transfercar Number',
      'Line 1', 'Line 2',
      // الکترودها - 9 ستون
      'تعویض فاز 1', 'تعویض فاز 2', 'تعویض فاز 3',
      'تنظیم فاز 1', 'تنظیم فاز 2', 'تنظیم فاز 3',
      'شکست فاز 1', 'شکست فاز 2', 'شکست فاز 3',
      // آنالیز شیمیایی - 18 ستون
      'نمونه 1 (C)', 'نمونه 1 (Si)', 'نمونه 1 (Mn)', 'نمونه 1 (P)', 'نمونه 1 (S)', 'نمونه 1 (Al)',
      'نمونه 2 (C)', 'نمونه 2 (Si)', 'نمونه 2 (Mn)', 'نمونه 2 (P)', 'نمونه 2 (S)', 'نمونه 2 (Al)',
      'نمونه 3 (C)', 'نمونه 3 (Si)', 'نمونه 3 (Mn)', 'نمونه 3 (P)', 'نمونه 3 (S)', 'نمونه 3 (Al)',
      // داده‌های فرایندی - 27 ستون (9 ردیف × 3 ستون)
      'داده 1 (Time)', 'داده 1 (Temp)', 'داده 1 (PPM)',
      'داده 2 (Time)', 'داده 2 (Temp)', 'داده 2 (PPM)',
      'داده 3 (Time)', 'داده 3 (Temp)', 'داده 3 (PPM)',
      'داده 4 (Time)', 'داده 4 (Temp)', 'داده 4 (PPM)',
      'داده 5 (Time)', 'داده 5 (Temp)', 'داده 5 (PPM)',
      'داده 6 (Time)', 'داده 6 (Temp)', 'داده 6 (PPM)',
      'داده 7 (Time)', 'داده 7 (Temp)', 'داده 7 (PPM)',
      'داده 8 (Time)', 'داده 8 (Temp)', 'داده 8 (PPM)',
      'داده 9 (Time)', 'داده 9 (Temp)', 'داده 9 (PPM)',
      // توقفات - 9 ستون (3 ردیف × 3 ستون)
      'توقف 1 (From)', 'توقف 1 (Till)', 'توقف 1 (Minute)',
      'توقف 2 (From)', 'توقف 2 (Till)', 'توقف 2 (Minute)',
      'توقف 3 (From)', 'توقف 3 (Till)', 'توقف 3 (Minute)'
    ]);

    filteredHeats.forEach(h => {
      const lf = h.lfData as any;
      if (!lf) return;
      
      const additives = lf.additives || {};
      const additiveTotals: any = {};
      Object.keys(additives).forEach(key => {
        if (Array.isArray(additives[key])) {
          additiveTotals[key] = additives[key].reduce((sum: number, val: number) => sum + val, 0);
        }
      });
      
      // الکترودها - بررسی هر وضعیت
      const phase1 = lf.electrodeStatus?.phase1 || [];
      const phase2 = lf.electrodeStatus?.phase2 || [];
      const phase3 = lf.electrodeStatus?.phase3 || [];
      
      // آنالیز شیمیایی - 3 نمونه
      const sample1 = lf.chemicalAnalysis?.sample1 || {};
      const sample2 = lf.chemicalAnalysis?.sample2 || {};
      const sample3 = lf.chemicalAnalysis?.sample3 || {};
      
      // داده‌های فرایندی - تمام 9 ردیف
      const processData = lf.processData || [];
      
      // توقفات - تمام 3 ردیف
      const stoppages = lf.stoppages || [];
      
      rows.push([
        h.heatId,
        h.date,
        h.shift,
        h.steelGrade,
        lf.inputCondition?.inputTime || '',
        lf.deliveryTimeToCCM || '',
        lf.inputCondition?.inputTemperature || 0,
        additiveTotals.feMn || 0,
        additiveTotals.feSiMn || 0,
        additiveTotals.feSi || 0,
        additiveTotals.lime || 0,
        additiveTotals.isoterm || 0,
        additiveTotals.graphite || 0,
        additiveTotals.caC2 || 0,
        additiveTotals.caAl || 0,
        additiveTotals.graphiteWire || 0,
        additiveTotals.metallurgyCoke || 0,
        additiveTotals.caSiWire || 0,
        additiveTotals.caFeWire || 0,
        additiveTotals.boxite || 0,
        additiveTotals.alWire || 0,
        additiveTotals.deoxidizer || 0,
        lf.argonConsumption?.timeString || 0,
        lf.argonConsumption?.consumption || 0,
        lf.probeConsumption?.thermocouple || 0,
        lf.probeConsumption?.sampler || 0,
        lf.probeConsumption?.oxyProbe || 0,
        lf.inputCondition?.ppm || 0,
        lf.inputCondition?.slagThickness || 0,
        lf.inputCondition?.freeBoard || 0,
        lf.ladleStatus?.ladleNumber || '',
        lf.ladleStatus?.changeLadle || '',
        lf.ladleStatus?.slagLineLife || 0,
        lf.ladleStatus?.ladleLife || 0,
        lf.ladleStatus?.transfercarNumber || '',
        lf.stringStatus?.line1 || '',
        lf.stringStatus?.line2 || '',
        // الکترودها - 9 ستون (تعویض، تنظیم، شکست برای هر فاز)
        phase1.includes('Changing — تعویض') ? 'بله' : 'خیر',
        phase2.includes('Changing — تعویض') ? 'بله' : 'خیر',
        phase3.includes('Changing — تعویض') ? 'بله' : 'خیر',
        phase1.includes('Adjusting — تنظیم') ? 'بله' : 'خیر',
        phase2.includes('Adjusting — تنظیم') ? 'بله' : 'خیر',
        phase3.includes('Adjusting — تنظیم') ? 'بله' : 'خیر',
        phase1.includes('Breaking — شکستگی') ? 'بله' : 'خیر',
        phase2.includes('Breaking — شکستگی') ? 'بله' : 'خیر',
        phase3.includes('Breaking — شکستگی') ? 'بله' : 'خیر',
        // آنالیز نمونه 1
        sample1.c || 0, sample1.si || 0, sample1.mn || 0, sample1.p || 0, sample1.s || 0, sample1.al || 0,
        // آنالیز نمونه 2
        sample2.c || 0, sample2.si || 0, sample2.mn || 0, sample2.p || 0, sample2.s || 0, sample2.al || 0,
        // آنالیز نمونه 3
        sample3.c || 0, sample3.si || 0, sample3.mn || 0, sample3.p || 0, sample3.s || 0, sample3.al || 0,
        // داده‌های فرایندی - تمام 9 ردیف (Time, Temp, PPM)
        processData[0]?.time || '', processData[0]?.temp || 0, processData[0]?.ppm || 0,
        processData[1]?.time || '', processData[1]?.temp || 0, processData[1]?.ppm || 0,
        processData[2]?.time || '', processData[2]?.temp || 0, processData[2]?.ppm || 0,
        processData[3]?.time || '', processData[3]?.temp || 0, processData[3]?.ppm || 0,
        processData[4]?.time || '', processData[4]?.temp || 0, processData[4]?.ppm || 0,
        processData[5]?.time || '', processData[5]?.temp || 0, processData[5]?.ppm || 0,
        processData[6]?.time || '', processData[6]?.temp || 0, processData[6]?.ppm || 0,
        processData[7]?.time || '', processData[7]?.temp || 0, processData[7]?.ppm || 0,
        processData[8]?.time || '', processData[8]?.temp || 0, processData[8]?.ppm || 0,
        // توقفات - تمام 3 ردیف (From, Till, Minute)
        stoppages[0]?.from || '', stoppages[0]?.till || '', stoppages[0]?.minutes || 0,
        stoppages[1]?.from || '', stoppages[1]?.till || '', stoppages[1]?.minutes || 0,
        stoppages[2]?.from || '', stoppages[2]?.till || '', stoppages[2]?.minutes || 0,
      ]);
    });

    const csv = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `all_lf_heats_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-l from-green-600 to-green-700 text-white">
        <h2 className="text-2xl font-bold">📋 کلیه ذوب‌های ثبت شده کوره پاتیلی (LF)</h2>
        <p className="text-green-100 mt-1">مشاهده و دانلود اطلاعات کامل تمام ذوب‌ها</p>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4">🔍 فیلترها</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <JalaliDatePicker label="تاریخ شروع" value={filterDateStart} onChange={setFilterDateStart} />
          <JalaliDatePicker label="تاریخ پایان" value={filterDateEnd} onChange={setFilterDateEnd} />
          <div>
            <label className="label-field">Heat ID</label>
            <input type="text" className="input-field" value={filterHeatId} onChange={e => setFilterHeatId(e.target.value)} placeholder="شماره ذوب" />
          </div>
          <div>
            <label className="label-field">شیفت</label>
            <select className="input-field" value={filterShift} onChange={e => setFilterShift(e.target.value)}>
              <option value="">همه</option>
              {SHIFTS.map(s => <option key={s} value={s}>شیفت {s}</option>)}
            </select>
          </div>
          <div>
            <label className="label-field">گرید</label>
            <select className="input-field" value={filterGrade} onChange={e => setFilterGrade(e.target.value)}>
              <option value="">همه</option>
              {STEEL_GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button onClick={exportAllToExcel} className="btn-primary">📥 دانلود اکسل همه ذوب‌ها</button>
        </div>
      </div>

      <div className="card">
        <p className="text-sm text-gray-600"><span className="font-bold text-green-600">{filteredHeats.length}</span> ذوب یافت شد</p>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Heat ID</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">تاریخ</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">شیفت</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">گرید</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Input Time</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Delivery to CCM</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Temp (°C)</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">PPM</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredHeats.map(heat => (
                <tr key={heat.id} className="hover:bg-green-50/50">
                  <td className="px-4 py-3 font-bold text-green-600">{heat.heatId}</td>
                  <td className="px-4 py-3 text-sm">{heat.date}</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs bg-slate-100">{heat.shift}</span></td>
                  <td className="px-4 py-3 text-sm">{heat.steelGrade}</td>
                  <td className="px-4 py-3 text-sm">{(heat.lfData as any)?.inputCondition?.inputTime || '-'}</td>
                  <td className="px-4 py-3 text-sm">{(heat.lfData as any)?.deliveryTimeToCCM || '-'}</td>
                  <td className="px-4 py-3 text-sm">{(heat.lfData as any)?.inputCondition?.inputTemperature || '-'}</td>
                  <td className="px-4 py-3 text-sm">{(heat.lfData as any)?.inputCondition?.ppm || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedHeat(heat)} className="text-green-600 hover:text-green-800 text-sm font-medium">مشاهده</button>
                      <button onClick={() => exportSingleToExcel(heat)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">📥</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredHeats.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500">هیچ ذوبی یافت نشد</p>
        </div>
      )}

      {selectedHeat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">جزئیات کامل ذوب LF {selectedHeat.heatId}</h3>
              <button onClick={() => setSelectedHeat(null)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">برای مشاهده تمام اطلاعات، فایل اکسل را دانلود کنید.</p>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => exportSingleToExcel(selectedHeat)} className="btn-primary">📥 دانلود اکسل کامل</button>
              <button onClick={() => setSelectedHeat(null)} className="btn-secondary">بستن</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
