import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { SHIFTS, STEEL_GRADES } from '../data/mockData';
import JalaliDatePicker from '../components/JalaliDatePicker';

export default function AllEAFHeatsPage() {
  const { heats } = useData();
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');
  const [filterHeatId, setFilterHeatId] = useState('');
  const [filterShift, setFilterShift] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [selectedHeat, setSelectedHeat] = useState<any>(null);

  let filteredHeats = heats.filter(h => h.eafStatus !== 'not_started' && h.eafData);

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
    const eaf = h.eafData as any;

    // ترتیب دقیق طبق درخواست کاربر
    rows.push(['HEAT ID', h.heatId]);
    rows.push(['تاریخ', h.date]);
    rows.push(['گرید', h.steelGrade]);
    rows.push(['شیفت', h.shift]);
    rows.push(['شروع ذوب', eaf.heatStartTime || '']);
    rows.push(['شروع تخلیه', eaf.tappingStartTime || '']);
    rows.push(['پایان تخلیه', eaf.tappingEndTime || '']);
    rows.push(['مدت تخلیه', eaf.tappingDuration || 0]);
    rows.push(['DRI (Ton) - Tapping Start', eaf.tappingDri || 0]);
    rows.push(['Briquet (Ton) - Tapping Start', eaf.tappingBriquet || 0]);
    rows.push(['جمع Tonnage سبدهای قراضه', (eaf.scrapBuckets?.[0]?.tonnage || 0) + (eaf.scrapBuckets?.[1]?.tonnage || 0)]);
    rows.push(['TAP - Sample Time', eaf.sampleTap || 0]);
    rows.push(['TAP - Tapping Start', eaf.tappingTap || 0]);
    rows.push(['Power On', eaf.powerOn || 0]);
    rows.push(['Power Off', eaf.powerOff || 0]);
    rows.push(['Tap to Tap', eaf.tapToTap || 0]);
    rows.push(['Walls', eaf.refractoryCounters?.walls || 0]);
    rows.push(['Center Piece', eaf.refractoryCounters?.centerPiece || 0]);
    rows.push(['Bottom', eaf.refractoryCounters?.bottom || 0]);
    rows.push(['Taphole', eaf.refractoryCounters?.taphole || 0]);
    
    // توقفات قبل از شروع
    if (eaf.preStoppages && eaf.preStoppages.length > 0) {
      eaf.preStoppages.forEach((s: any, i: number) => {
        if (s.from || s.till) {
          rows.push([`توقف قبل از شروع ${i + 1}`, `از ${s.from} تا ${s.till} - ${s.minutes} دقیقه - ${s.workingGroup} - ${s.reason || s.customReason || ''}`]);
        }
      });
    }
    
    rows.push(['En.Cou (MWh) - Tapping Start', eaf.tappingEnCou || 0]);
    rows.push(['FeMn (Kg)', eaf.additives?.feMn || 0]);
    rows.push(['FeSiMn (Kg)', eaf.additives?.feSiMn || 0]);
    rows.push(['FeSi (Kg)', eaf.additives?.feSi || 0]);
    rows.push(['Ca.Al (Kg)', eaf.additives?.caAl || 0]);
    rows.push(['AL (Kg)', eaf.additives?.al || 0]);
    rows.push(['CaC2 (Kg)', eaf.additives?.cac2 || 0]);
    rows.push(['Dolomite (Kg) - Tapping Start', eaf.tappingDolomite || 0]);
    rows.push(['Lime MHU (Kg) - Tapping Start', eaf.tappingLimeMHU || 0]);
    rows.push(['Lime (Kg)', eaf.additives?.lime || 0]);
    rows.push(['Carbon MHU (Kg) - Tapping Start', eaf.tappingCarbonMHU || 0]);
    rows.push(['CPC Injection (Kg) - Tapping Start', eaf.tappingCpcInjection || 0]);
    rows.push(['CPC MHU (Kg) - Tapping Start', eaf.tappingCpcMHU || 0]);
    rows.push(['Graphite (CPC) (Kg)', eaf.additives?.graphite || 0]);
    rows.push(['CH4 (Nm³) - Tapping Start', eaf.tappingCh4 || 0]);
    rows.push(['Oxygen (Nm³) - Tapping Start', eaf.tappingOxygen || 0]);
    rows.push(['وزن تخلیه (تن)', eaf.tappingWeight || 0]);
    
    // آنالیز شیمیایی
    if (eaf.chemicalAnalysis && eaf.chemicalAnalysis.length > 0) {
      eaf.chemicalAnalysis.forEach((sample: any, i: number) => {
        rows.push([`آنالیز نمونه ${i + 1}`, `C: ${sample.c}, Si: ${sample.si}, Mn: ${sample.mn}, P: ${sample.p}, S: ${sample.s}`]);
      });
    }
    
    rows.push(['PPM', eaf.ppm || 0]);
    rows.push(['درصد کربن (سلوکس) %', eaf.carbonPercent || 0]);
    rows.push(['Thermocouple', eaf.consumables?.thermocouple || 0]);
    rows.push(['Sampler', eaf.consumables?.sampler || 0]);
    rows.push(['Oxy. Probe', eaf.consumables?.oxyProbe || 0]);
    rows.push(['Taphole Sand (Kg)', eaf.consumables?.tapholeSand || 0]);
    
    // الکترودها
    const phase1 = eaf.electrodeStatus?.phase1 || [];
    const phase2 = eaf.electrodeStatus?.phase2 || [];
    const phase3 = eaf.electrodeStatus?.phase3 || [];
    
    rows.push(['الکترود فاز 1 تعویض', phase1.includes('Changing — تعویض') ? 'بله' : 'خیر']);
    rows.push(['الکترود فاز 2 تعویض', phase2.includes('Changing — تعویض') ? 'بله' : 'خیر']);
    rows.push(['الکترود فاز 3 تعویض', phase3.includes('Changing — تعویض') ? 'بله' : 'خیر']);
    rows.push(['شکستن فاز 1', phase1.includes('Breaking — شکستگی') ? 'بله' : 'خیر']);
    rows.push(['شکستن فاز 2', phase2.includes('Breaking — شکستگی') ? 'بله' : 'خیر']);
    rows.push(['شکستن فاز 3', phase3.includes('Breaking — شکستگی') ? 'بله' : 'خیر']);
    rows.push(['تنظیم فاز 1', phase1.includes('Adjusting — تنظیم') ? 'بله' : 'خیر']);
    rows.push(['تنظیم فاز 2', phase2.includes('Adjusting — تنظیم') ? 'بله' : 'خیر']);
    rows.push(['تنظیم فاز 3', phase3.includes('Adjusting — تنظیم') ? 'بله' : 'خیر']);
    
    rows.push(['Ladle Number', eaf.ladleInfo?.ladleNumber || '']);
    rows.push(['Slag Condition', eaf.ladleInfo?.slagCondition || '']);
    rows.push(['Wall Condition', eaf.ladleInfo?.wallCondition || '']);
    rows.push(['توضیحات سرشیفت', eaf.shiftSupervisorNotes || '']);

    const csv = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `heat_${h.heatId}_full_report.csv`;
    link.click();
  };

  const exportAllToExcel = () => {
    const rows: any[] = [];
    
    // Header - 60 ستون کامل
    rows.push([
      'HEAT ID', 'تاریخ', 'گرید', 'شیفت', 'شروع ذوب', 'شروع تخلیه', 'پایان تخلیه', 'مدت تخلیه',
      'DRI (Ton)', 'Briquet (Ton)', 'جمع قراضه', 'TAP Sample', 'TAP Tapping',
      'Power On', 'Power Off', 'Tap to Tap',
      'Walls', 'Center Piece', 'Bottom', 'Taphole',
      'En.Cou (MWh)', 'FeMn', 'FeSiMn', 'FeSi', 'Ca.Al', 'AL', 'CaC2',
      'Dolomite', 'Lime MHU', 'Lime', 'Carbon MHU', 'CPC Injection', 'CPC MHU', 'Graphite',
      'CH4', 'Oxygen', 'وزن تخلیه',
      'آنالیز C', 'آنالیز Si', 'آنالیز Mn', 'آنالیز P', 'آنالیز S',
      'PPM', 'کربن %',
      'Thermocouple', 'Sampler', 'Oxy Probe', 'Taphole Sand',
      'الکترود فاز 1 تعویض', 'الکترود فاز 2 تعویض', 'الکترود فاز 3 تعویض',
      'شکستن فاز 1', 'شکستن فاز 2', 'شکستن فاز 3',
      'تنظیم فاز 1', 'تنظیم فاز 2', 'تنظیم فاز 3',
      'Ladle', 'Slag', 'Wall', 'توضیحات سرشیفت'
    ]);

    filteredHeats.forEach(h => {
      const eaf = h.eafData as any;
      if (!eaf) return;
      
      // الکترودها
      const phase1 = eaf.electrodeStatus?.phase1 || [];
      const phase2 = eaf.electrodeStatus?.phase2 || [];
      const phase3 = eaf.electrodeStatus?.phase3 || [];
      
      // آنالیز شیمیایی - نمونه اول
      const analysis = eaf.chemicalAnalysis?.[0] || {};
      
      rows.push([
        h.heatId,
        h.date,
        h.steelGrade,
        h.shift,
        eaf.heatStartTime || '',
        eaf.tappingStartTime || '',
        eaf.tappingEndTime || '',
        eaf.tappingDuration || 0,
        eaf.tappingDri || 0,
        eaf.tappingBriquet || 0,
        (eaf.scrapBuckets?.[0]?.tonnage || 0) + (eaf.scrapBuckets?.[1]?.tonnage || 0),
        eaf.sampleTap || 0,
        eaf.tappingTap || 0,
        eaf.powerOn || 0,
        eaf.powerOff || 0,
        eaf.tapToTap || 0,
        eaf.refractoryCounters?.walls || 0,
        eaf.refractoryCounters?.centerPiece || 0,
        eaf.refractoryCounters?.bottom || 0,
        eaf.refractoryCounters?.taphole || 0,
        eaf.tappingEnCou || 0,
        eaf.additives?.feMn || 0,
        eaf.additives?.feSiMn || 0,
        eaf.additives?.feSi || 0,
        eaf.additives?.caAl || 0,
        eaf.additives?.al || 0,
        eaf.additives?.cac2 || 0,
        eaf.tappingDolomite || 0,
        eaf.tappingLimeMHU || 0,
        eaf.additives?.lime || 0,
        eaf.tappingCarbonMHU || 0,
        eaf.tappingCpcInjection || 0,
        eaf.tappingCpcMHU || 0,
        eaf.additives?.graphite || 0,
        eaf.tappingCh4 || 0,
        eaf.tappingOxygen || 0,
        eaf.tappingWeight || 0,
        // آنالیز شیمیایی
        analysis.c || 0,
        analysis.si || 0,
        analysis.mn || 0,
        analysis.p || 0,
        analysis.s || 0,
        // بقیه
        eaf.ppm || 0,
        eaf.carbonPercent || 0,
        eaf.consumables?.thermocouple || 0,
        eaf.consumables?.sampler || 0,
        eaf.consumables?.oxyProbe || 0,
        eaf.consumables?.tapholeSand || 0,
        // الکترودها
        phase1.includes('Changing — تعویض') ? 'بله' : 'خیر',
        phase2.includes('Changing — تعویض') ? 'بله' : 'خیر',
        phase3.includes('Changing — تعویض') ? 'بله' : 'خیر',
        phase1.includes('Breaking — شکستگی') ? 'بله' : 'خیر',
        phase2.includes('Breaking — شکستگی') ? 'بله' : 'خیر',
        phase3.includes('Breaking — شکستگی') ? 'بله' : 'خیر',
        phase1.includes('Adjusting — تنظیم') ? 'بله' : 'خیر',
        phase2.includes('Adjusting — تنظیم') ? 'بله' : 'خیر',
        phase3.includes('Adjusting — تنظیم') ? 'بله' : 'خیر',
        // پاتیل و توضیحات
        eaf.ladleInfo?.ladleNumber || '',
        eaf.ladleInfo?.slagCondition || '',
        eaf.ladleInfo?.wallCondition || '',
        eaf.shiftSupervisorNotes || '',
      ]);
    });

    const csv = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `all_eaf_heats_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-l from-blue-600 to-blue-700 text-white">
        <h2 className="text-2xl font-bold">📋 کلیه ذوب‌های ثبت شده کوره قوس (EAF)</h2>
        <p className="text-blue-100 mt-1">مشاهده و دانلود اطلاعات کامل تمام ذوب‌ها</p>
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
        <p className="text-sm text-gray-600"><span className="font-bold text-blue-600">{filteredHeats.length}</span> ذوب یافت شد</p>
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
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">وزن (تن)</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Power On</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Power Off</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Tap to Tap</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">کربن %</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">PPM</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredHeats.map(heat => (
                <tr key={heat.id} className="hover:bg-blue-50/50">
                  <td className="px-4 py-3 font-bold text-blue-600">{heat.heatId}</td>
                  <td className="px-4 py-3 text-sm">{heat.date}</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs bg-slate-100">{heat.shift}</span></td>
                  <td className="px-4 py-3 text-sm">{heat.steelGrade}</td>
                  <td className="px-4 py-3 text-sm font-medium">{(heat.eafData as any)?.tappingWeight || '-'}</td>
                  <td className="px-4 py-3 text-sm">{(heat.eafData as any)?.powerOn || '-'}</td>
                  <td className="px-4 py-3 text-sm">{(heat.eafData as any)?.powerOff || '-'}</td>
                  <td className="px-4 py-3 text-sm">{(heat.eafData as any)?.tapToTap || '-'}</td>
                  <td className="px-4 py-3 text-sm">{(heat.eafData as any)?.carbonPercent || '-'}</td>
                  <td className="px-4 py-3 text-sm">{(heat.eafData as any)?.ppm || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedHeat(heat)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">مشاهده</button>
                      <button onClick={() => exportSingleToExcel(heat)} className="text-green-600 hover:text-green-800 text-sm font-medium">📥</button>
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
              <h3 className="text-2xl font-bold text-gray-800">جزئیات کامل ذوب {selectedHeat.heatId}</h3>
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
