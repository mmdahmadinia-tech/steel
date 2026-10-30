import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { SHIFTS, STEEL_GRADES } from '../data/mockData';
import JalaliDatePicker from '../components/JalaliDatePicker';

export default function AllCCMHeatsPage() {
  const { heats } = useData();
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');
  const [filterHeatId, setFilterHeatId] = useState('');
  const [filterShift, setFilterShift] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [selectedHeat, setSelectedHeat] = useState<any>(null);

  let filteredHeats = heats.filter(h => h.ccmStatus !== 'not_started' && h.ccmData);

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
    const ccm = h.ccmData as any;

    rows.push(['═══════════════════════════════════════════════════════════']);
    rows.push(['گزارش کامل ذوب CCM', h.heatId]);
    rows.push(['═══════════════════════════════════════════════════════════']);
    rows.push(['']);
    
    // اطلاعات عمومی
    rows.push(['┌─────────────────────────────────────────────────────────┐']);
    rows.push(['│ اطلاعات عمومی                                          │']);
    rows.push(['└─────────────────────────────────────────────────────────┘']);
    rows.push(['تاریخ', h.date]);
    rows.push(['شماره ذوب', h.heatId]);
    rows.push(['گرید', h.steelGrade]);
    rows.push(['Oil Type', ccm.oilType || ccm.oilTypeCustom || '']);
    rows.push(['Ladle Shroud', ccm.ladleShroud || '']);
    rows.push(['Avg Casting Speed (m/min)', ccm.avgCastingSpeed || 0]);
    rows.push(['Sequence Cut Reason', ccm.sequenceCutReason || '']);
    rows.push(['پایان سکوئنس', ccm.endOfSequence ? 'بله' : 'خیر']);
    rows.push(['']);
    
    // خطوط ریخته‌گری
    rows.push(['┌─────────────────────────────────────────────────────────┐']);
    rows.push(['│ خطوط ریخته‌گری (ردیفی)                                 │']);
    rows.push(['└─────────────────────────────────────────────────────────┘']);
    rows.push(['خط', 'شروع (24h)', 'حالت', 'سرعت (m/min)', 'قالب', 'پایان (24h)']);
    if (ccm.lines) {
      ccm.lines.forEach((line: any, i: number) => {
        if (line.castingStartTime || line.castingSpeed) {
          rows.push([`خط ${i + 1}`, line.castingStartTime || '', line.castingMode || '', line.castingSpeed || 0, line.moldNumber || '', line.castingEndTime || '']);
        }
      });
    }
    rows.push(['']);
    
    // دماها
    rows.push(['┌─────────────────────────────────────────────────────────┐']);
    rows.push(['│ دماها                                                  │']);
    rows.push(['└─────────────────────────────────────────────────────────┘']);
    rows.push(['Requested Temp from LF (°C)', ccm.temperatures?.requestedFromLF || 0]);
    rows.push(['Sent Temp from LF (°C)', ccm.temperatures?.sentFromLF || 0]);
    rows.push(['']);
    
    // دمای تاندیش
    rows.push(['┌─────────────────────────────────────────────────────────┐']);
    rows.push(['│ دمای مذاب تاندیش (ردیفی)                               │']);
    rows.push(['└─────────────────────────────────────────────────────────┘']);
    rows.push(['قرائت', 'Time (24h)', 'Temperature (°C)']);
    if (ccm.tundishTemperatures) {
      ccm.tundishTemperatures.forEach((t: any, i: number) => {
        if (t.time || t.temperature) {
          rows.push([`قرائت ${i + 1}`, t.time || '', t.temperature || 0]);
        }
      });
    }
    rows.push(['']);
    
    // زمان‌های اصلی
    rows.push(['┌─────────────────────────────────────────────────────────┐']);
    rows.push(['│ زمان‌های اصلی                                          │']);
    rows.push(['└─────────────────────────────────────────────────────────┘']);
    rows.push(['Next Heat Request Time', ccm.mainTimes?.nextHeatRequestTime || '']);
    rows.push(['Casting Start Time', ccm.mainTimes?.castingStartTime || '']);
    rows.push(['Casting End Time', ccm.mainTimes?.castingEndTime || '']);
    rows.push(['Heat Number in Sequence', ccm.mainTimes?.heatNumberInSequence || 0]);
    rows.push(['']);
    
    // عمر قالب
    rows.push(['┌─────────────────────────────────────────────────────────┐']);
    rows.push(['│ عمر تیوب قالب (ردیفی)                                  │']);
    rows.push(['└─────────────────────────────────────────────────────────┘']);
    rows.push(['قالب', 'عمر']);
    if (ccm.moldTubeLife) {
      ccm.moldTubeLife.forEach((life: number, i: number) => {
        if (life > 0) {
          rows.push([`قالب ${i + 1}`, life]);
        }
      });
    }
    rows.push(['']);
    
    // پارگی خط
    rows.push(['┌─────────────────────────────────────────────────────────┐']);
    rows.push(['│ پارگی خط (ردیفی)                                       │']);
    rows.push(['└─────────────────────────────────────────────────────────┘']);
    rows.push(['ردیف', 'Line Number', 'Break Time (24h)', 'Cause']);
    if (ccm.lineBreakReport) {
      ccm.lineBreakReport.forEach((b: any, i: number) => {
        if (b.lineNumber || b.breakTime) {
          rows.push([`پارگی ${i + 1}`, b.lineNumber || '', b.breakTime || '', b.cause || '']);
        }
      });
    }
    rows.push(['']);
    
    // تعویض قالب
    rows.push(['┌─────────────────────────────────────────────────────────┐']);
    rows.push(['│ تعویض قالب (ردیفی)                                     │']);
    rows.push(['└─────────────────────────────────────────────────────────┘']);
    rows.push(['ردیف', 'Line Number', 'Mold Number', 'Number of Heats', 'Cause']);
    if (ccm.moldChange) {
      ccm.moldChange.forEach((m: any, i: number) => {
        if (m.lineNumber || m.moldNumber) {
          rows.push([`تعویض ${i + 1}`, m.lineNumber || '', m.moldNumber || '', m.numberOfHeats || 0, m.cause || '']);
        }
      });
    }
    rows.push(['']);
    
    // گزارش پاتیل
    rows.push(['┌─────────────────────────────────────────────────────────┐']);
    rows.push(['│ گزارش پاتیل                                            │']);
    rows.push(['└─────────────────────────────────────────────────────────┘']);
    rows.push(['Ladle Number', ccm.ladleReport?.ladleNumber || '']);
    rows.push(['Time Placed on Turret', ccm.ladleReport?.timePlacedOnTurret || '']);
    rows.push(['Delivered Melt Weight (Ton)', ccm.ladleReport?.deliveredMeltWeight || 0]);
    rows.push(['Slide Gate Opening Time', ccm.ladleReport?.slideGateOpeningTime || '']);
    rows.push(['Number of Oxygen Lances', ccm.ladleReport?.numberOfOxygenLances || 0]);
    rows.push(['Returned Melt Weight (Ton)', ccm.ladleReport?.returnedMeltWeight || 0]);
    rows.push(['']);
    
    // گزارش تاندیش
    rows.push(['┌─────────────────────────────────────────────────────────┐']);
    rows.push(['│ گزارش تاندیش                                           │']);
    rows.push(['└─────────────────────────────────────────────────────────┘']);
    rows.push(['Tundish Car Number', ccm.tundishReport?.tundishCarNumber || '']);
    rows.push(['Tundish Number', ccm.tundishReport?.tundishNumber || '']);
    rows.push(['Sequential Heats Cast', ccm.tundishReport?.sequentialHeats || 0]);
    rows.push(['Residual Melt Weight (Ton)', ccm.tundishReport?.residualMeltWeight || 0]);
    rows.push(['']);
    
    // کنترل کیفیت
    rows.push(['┌─────────────────────────────────────────────────────────┐']);
    rows.push(['│ کنترل کیفیت (ردیفی)                                    │']);
    rows.push(['└─────────────────────────────────────────────────────────┘']);
    rows.push(['ردیف', 'Line', 'Time (24h)', 'Reporter', 'Defect', 'Action', 'Result']);
    if (ccm.qualityReports) {
      ccm.qualityReports.forEach((q: any, i: number) => {
        if (q.line || q.time) {
          rows.push([`ردیف ${i + 1}`, q.line || '', q.time || '', q.reporterName || '', q.defectReported || '', q.correctiveAction || '', q.result || '']);
        }
      });
    }
    rows.push(['']);
    
    // توقفات
    rows.push(['┌─────────────────────────────────────────────────────────┐']);
    rows.push(['│ توقفات (ردیفی)                                         │']);
    rows.push(['└─────────────────────────────────────────────────────────┘']);
    rows.push(['ردیف', 'Start (24h)', 'End (24h)', 'Duration (min)', 'Responsible', 'Description']);
    if (ccm.stoppages) {
      ccm.stoppages.forEach((s: any, i: number) => {
        if (s.start || s.end) {
          rows.push([`ردیف ${i + 1}`, s.start || '', s.end || '', s.duration || 0, s.responsibleUnit || '', s.description || '']);
        }
      });
    }
    rows.push(['']);
    
    rows.push(['═══════════════════════════════════════════════════════════']);
    rows.push(['End of Report']);
    rows.push(['═══════════════════════════════════════════════════════════']);

    const csv = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `heat_${h.heatId}_ccm_full_report.csv`;
    link.click();
  };

  const exportAllToExcel = () => {
    const rows: any[] = [];
    
    // Header
    rows.push([
      'تاریخ', 'شماره ذوب', 'گرید', 'Oil Type', 'Ladle Shroud', 'Avg Casting Speed',
      'Sequence Cut Reason',
      // 6 خطوط
      'خط 1 شروع', 'خط 1 حالت', 'خط 1 سرعت', 'خط 1 قالب', 'خط 1 پایان',
      'خط 2 شروع', 'خط 2 حالت', 'خط 2 سرعت', 'خط 2 قالب', 'خط 2 پایان',
      'خط 3 شروع', 'خط 3 حالت', 'خط 3 سرعت', 'خط 3 قالب', 'خط 3 پایان',
      'خط 4 شروع', 'خط 4 حالت', 'خط 4 سرعت', 'خط 4 قالب', 'خط 4 پایان',
      'خط 5 شروع', 'خط 5 حالت', 'خط 5 سرعت', 'خط 5 قالب', 'خط 5 پایان',
      'خط 6 شروع', 'خط 6 حالت', 'خط 6 سرعت', 'خط 6 قالب', 'خط 6 پایان',
      'Requested Temp', 'Sent Temp',
      'Tundish Temp 1 Time', 'Tundish Temp 1', 'Tundish Temp 2 Time', 'Tundish Temp 2', 'Tundish Temp 3 Time', 'Tundish Temp 3',
      'Next Heat Request', 'Casting Start', 'Casting End', 'Heat in Sequence',
      'پایان سکوئنس',
      // 16 قالب
      'قالب 1', 'قالب 2', 'قالب 3', 'قالب 4', 'قالب 5', 'قالب 6', 'قالب 7', 'قالب 8',
      'قالب 9', 'قالب 10', 'قالب 11', 'قالب 12', 'قالب 13', 'قالب 14', 'قالب 15', 'قالب 16',
      // پارگی خط 1 و 2
      'پارگی 1 خط', 'پارگی 1 زمان', 'پارگی 1 علت',
      'پارگی 2 خط', 'پارگی 2 زمان', 'پارگی 2 علت',
      // تعویض قالب 1 و 2
      'تعویض 1 خط', 'تعویض 1 قالب', 'تعویض 1 ذوب', 'تعویض 1 علت',
      'تعویض 2 خط', 'تعویض 2 قالب', 'تعویض 2 ذوب', 'تعویض 2 علت',
      // گزارش پاتیل
      'Ladle Number', 'Time on Turret', 'Delivered Weight', 'Slide Gate Time', 'Oxygen Lances', 'Returned Weight',
      // گزارش تاندیش
      'Tundish Car', 'Tundish Number', 'Sequential Heats', 'Residual Weight',
      // کنترل کیفیت 1 و 2 و 3
      'کیفیت 1 خط', 'کیفیت 1 زمان', 'کیفیت 1 گزارشگر', 'کیفیت 1 عیب', 'کیفیت 1 اقدام', 'کیفیت 1 نتیجه',
      'کیفیت 2 خط', 'کیفیت 2 زمان', 'کیفیت 2 گزارشگر', 'کیفیت 2 عیب', 'کیفیت 2 اقدام', 'کیفیت 2 نتیجه',
      'کیفیت 3 خط', 'کیفیت 3 زمان', 'کیفیت 3 گزارشگر', 'کیفیت 3 عیب', 'کیفیت 3 اقدام', 'کیفیت 3 نتیجه',
      // توقفات 1 و 2
      'توقف 1 شروع', 'توقف 1 پایان', 'توقف 1 مدت', 'توقف 1 مسئول', 'توقف 1 توضیح',
      'توقف 2 شروع', 'توقف 2 پایان', 'توقف 2 مدت', 'توقف 2 مسئول', 'توقف 2 توضیح',
    ]);

    filteredHeats.forEach(h => {
      const ccm = h.ccmData as any;
      if (!ccm) return;
      
      const lines = ccm.lines || [];
      const tundishTemps = ccm.tundishTemperatures || [];
      const moldLife = ccm.moldTubeLife || [];
      const breaks = ccm.lineBreakReport || [];
      const moldChanges = ccm.moldChange || [];
      const qualityReports = ccm.qualityReports || [];
      const stoppages = ccm.stoppages || [];
      
      rows.push([
        h.date,
        h.heatId,
        h.steelGrade,
        ccm.oilType || ccm.oilTypeCustom || '',
        ccm.ladleShroud || '',
        ccm.avgCastingSpeed || 0,
        ccm.sequenceCutReason || '',
        // 6 خطوط
        lines[0]?.castingStartTime || '', lines[0]?.castingMode || '', lines[0]?.castingSpeed || 0, lines[0]?.moldNumber || '', lines[0]?.castingEndTime || '',
        lines[1]?.castingStartTime || '', lines[1]?.castingMode || '', lines[1]?.castingSpeed || 0, lines[1]?.moldNumber || '', lines[1]?.castingEndTime || '',
        lines[2]?.castingStartTime || '', lines[2]?.castingMode || '', lines[2]?.castingSpeed || 0, lines[2]?.moldNumber || '', lines[2]?.castingEndTime || '',
        lines[3]?.castingStartTime || '', lines[3]?.castingMode || '', lines[3]?.castingSpeed || 0, lines[3]?.moldNumber || '', lines[3]?.castingEndTime || '',
        lines[4]?.castingStartTime || '', lines[4]?.castingMode || '', lines[4]?.castingSpeed || 0, lines[4]?.moldNumber || '', lines[4]?.castingEndTime || '',
        lines[5]?.castingStartTime || '', lines[5]?.castingMode || '', lines[5]?.castingSpeed || 0, lines[5]?.moldNumber || '', lines[5]?.castingEndTime || '',
        ccm.temperatures?.requestedFromLF || 0,
        ccm.temperatures?.sentFromLF || 0,
        tundishTemps[0]?.time || '', tundishTemps[0]?.temperature || 0,
        tundishTemps[1]?.time || '', tundishTemps[1]?.temperature || 0,
        tundishTemps[2]?.time || '', tundishTemps[2]?.temperature || 0,
        ccm.mainTimes?.nextHeatRequestTime || '',
        ccm.mainTimes?.castingStartTime || '',
        ccm.mainTimes?.castingEndTime || '',
        ccm.mainTimes?.heatNumberInSequence || 0,
        ccm.endOfSequence ? 'بله' : 'خیر',
        // 16 قالب
        ...Array(16).fill(0).map((_, i) => moldLife[i] || 0),
        // پارگی خط 1 و 2
        breaks[0]?.lineNumber || '', breaks[0]?.breakTime || '', breaks[0]?.cause || '',
        breaks[1]?.lineNumber || '', breaks[1]?.breakTime || '', breaks[1]?.cause || '',
        // تعویض قالب 1 و 2
        moldChanges[0]?.lineNumber || '', moldChanges[0]?.moldNumber || '', moldChanges[0]?.numberOfHeats || 0, moldChanges[0]?.cause || '',
        moldChanges[1]?.lineNumber || '', moldChanges[1]?.moldNumber || '', moldChanges[1]?.numberOfHeats || 0, moldChanges[1]?.cause || '',
        // گزارش پاتیل
        ccm.ladleReport?.ladleNumber || '',
        ccm.ladleReport?.timePlacedOnTurret || '',
        ccm.ladleReport?.deliveredMeltWeight || 0,
        ccm.ladleReport?.slideGateOpeningTime || '',
        ccm.ladleReport?.numberOfOxygenLances || 0,
        ccm.ladleReport?.returnedMeltWeight || 0,
        // گزارش تاندیش
        ccm.tundishReport?.tundishCarNumber || '',
        ccm.tundishReport?.tundishNumber || '',
        ccm.tundishReport?.sequentialHeats || 0,
        ccm.tundishReport?.residualMeltWeight || 0,
        // کنترل کیفیت 1 و 2 و 3
        qualityReports[0]?.line || '', qualityReports[0]?.time || '', qualityReports[0]?.reporterName || '', qualityReports[0]?.defectReported || '', qualityReports[0]?.correctiveAction || '', qualityReports[0]?.result || '',
        qualityReports[1]?.line || '', qualityReports[1]?.time || '', qualityReports[1]?.reporterName || '', qualityReports[1]?.defectReported || '', qualityReports[1]?.correctiveAction || '', qualityReports[1]?.result || '',
        qualityReports[2]?.line || '', qualityReports[2]?.time || '', qualityReports[2]?.reporterName || '', qualityReports[2]?.defectReported || '', qualityReports[2]?.correctiveAction || '', qualityReports[2]?.result || '',
        // توقفات 1 و 2
        stoppages[0]?.start || '', stoppages[0]?.end || '', stoppages[0]?.duration || 0, stoppages[0]?.responsibleUnit || '', stoppages[0]?.description || '',
        stoppages[1]?.start || '', stoppages[1]?.end || '', stoppages[1]?.duration || 0, stoppages[1]?.responsibleUnit || '', stoppages[1]?.description || '',
      ]);
    });

    const csv = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `all_ccm_heats_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-l from-purple-600 to-purple-700 text-white">
        <h2 className="text-2xl font-bold">📋 کلیه ذوب‌های ثبت شده ریخته‌گری مداوم (CCM)</h2>
        <p className="text-purple-100 mt-1">مشاهده و دانلود اطلاعات کامل تمام ذوب‌ها</p>
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
        <p className="text-sm text-gray-600"><span className="font-bold text-purple-600">{filteredHeats.length}</span> ذوب یافت شد</p>
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
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">سرعت</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">سکوئنس</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">پارگی</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredHeats.map(heat => (
                <tr key={heat.id} className="hover:bg-purple-50/50">
                  <td className="px-4 py-3 font-bold text-purple-600">{heat.heatId}</td>
                  <td className="px-4 py-3 text-sm">{heat.date}</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs bg-slate-100">{heat.shift}</span></td>
                  <td className="px-4 py-3 text-sm">{heat.steelGrade}</td>
                  <td className="px-4 py-3 text-sm">{(heat.ccmData as any)?.avgCastingSpeed || '-'} m/min</td>
                  <td className="px-4 py-3 text-sm">{(heat.ccmData as any)?.mainTimes?.heatNumberInSequence || '-'}</td>
                  <td className="px-4 py-3 text-sm">{(heat.ccmData as any)?.lineBreakReport?.length || 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedHeat(heat)} className="text-purple-600 hover:text-purple-800 text-sm font-medium">مشاهده</button>
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
              <h3 className="text-2xl font-bold text-gray-800">جزئیات کامل ذوب CCM {selectedHeat.heatId}</h3>
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
