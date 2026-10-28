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

  // Filter EAF heats only
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
    const eaf = h.eafData;

    rows.push(['Heat ID', h.heatId]);
    rows.push(['Date', h.date]);
    rows.push(['Shift', h.shift]);
    rows.push(['Steel Grade', h.steelGrade]);
    rows.push(['']);
    rows.push(['=== EAF Data ===']);
    rows.push(['Power On (min)', eaf.powerOn]);
    rows.push(['Power Off (min)', eaf.powerOff]);
    rows.push(['Tap to Tap (min)', eaf.tapToTap]);
    rows.push(['Tapping Weight (Ton)', eaf.tappingWeight]);
    rows.push(['Tapping Start Time', eaf.tappingStartTime]);
    rows.push(['Tapping End Time', eaf.tappingEndTime]);
    rows.push(['Tapping Duration (min)', eaf.tappingDuration]);
    rows.push(['En.Cou (MWh)', eaf.enCou]);
    rows.push(['PPM', eaf.ppm]);
    rows.push(['']);
    
    if (eaf.refractoryCounters) {
      rows.push(['--- Refractory ---']);
      rows.push(['Walls', eaf.refractoryCounters.walls]);
      rows.push(['Center Piece - Delta', eaf.refractoryCounters.centerPiece]);
      rows.push(['Bottom', eaf.refractoryCounters.bottom]);
      rows.push(['Taphole', eaf.refractoryCounters.taphole]);
      rows.push(['']);
    }

    if (eaf.materials) {
      rows.push(['--- Charge Materials ---']);
      Object.entries(eaf.materials).forEach(([key, value]) => {
        rows.push([key, value]);
      });
      rows.push(['']);
    }

    if (eaf.tappingMaterials) {
      rows.push(['--- Tapping Materials ---']);
      Object.entries(eaf.tappingMaterials).forEach(([key, value]) => {
        rows.push([key, value]);
      });
      rows.push(['']);
    }

    if (eaf.preStoppages && eaf.preStoppages.length > 0) {
      rows.push(['--- Pre-Start Stoppages ---']);
      eaf.preStoppages.forEach((s: any, i: number) => {
        if (s.from || s.till) {
          rows.push([`Stoppage ${i + 1}`, `From: ${s.from}`, `Till: ${s.till}`, `Minutes: ${s.minutes}`, `Group: ${s.workingGroup}`, `Reason: ${s.reason || s.customReason || ''}`]);
        }
      });
      rows.push(['']);
    }

    if (eaf.duringStoppages && eaf.duringStoppages.length > 0) {
      rows.push(['--- During Stoppages ---']);
      eaf.duringStoppages.forEach((s: any, i: number) => {
        if (s.from || s.till) {
          rows.push([`Stoppage ${i + 1}`, `From: ${s.from}`, `Till: ${s.till}`, `Minutes: ${s.minutes}`, `Group: ${s.workingGroup}`, `Reason: ${s.reason || ''}`]);
        }
      });
      rows.push(['']);
    }

    if (eaf.ladleInfo) {
      rows.push(['--- Ladle Info ---']);
      rows.push(['Ladle Number', eaf.ladleInfo.ladleNumber]);
      rows.push(['Request Time', eaf.ladleInfo.requestTime]);
      rows.push(['Delivery Time', eaf.ladleInfo.deliveryTime]);
      rows.push(['Slag Condition', eaf.ladleInfo.slagCondition]);
      rows.push(['Wall Condition', eaf.ladleInfo.wallCondition]);
      rows.push(['']);
    }

    if (eaf.consumables) {
      rows.push(['--- Consumables ---']);
      Object.entries(eaf.consumables).forEach(([key, value]) => {
        rows.push([key, value]);
      });
      rows.push(['']);
    }

    if (eaf.chemicalAnalysis && eaf.chemicalAnalysis.length > 0) {
      rows.push(['--- Chemical Analysis ---']);
      eaf.chemicalAnalysis.forEach((sample: any, i: number) => {
        rows.push([`Sample ${i + 1}`, `C: ${sample.c}`, `Si: ${sample.si}`, `Mn: ${sample.mn}`, `P: ${sample.p}`, `S: ${sample.s}`]);
      });
      rows.push(['']);
    }

    if (eaf.scrapBuckets && eaf.scrapBuckets.length > 0) {
      rows.push(['--- Scrap Buckets ---']);
      eaf.scrapBuckets.forEach((bucket: any, i: number) => {
        rows.push([`Bucket ${i + 1}`, `Number: ${bucket.bucketNumber}`, `Tonnage: ${bucket.tonnage}`]);
      });
      rows.push(['']);
    }

    if (eaf.additives) {
      rows.push(['--- Additives ---']);
      Object.entries(eaf.additives).forEach(([key, value]) => {
        rows.push([key, value]);
      });
      rows.push(['']);
    }

    if (eaf.electrodeStatus) {
      rows.push(['--- Electrode Status ---']);
      rows.push(['Phase 1', eaf.electrodeStatus.phase1?.join(', ') || '']);
      rows.push(['Phase 2', eaf.electrodeStatus.phase2?.join(', ') || '']);
      rows.push(['Phase 3', eaf.electrodeStatus.phase3?.join(', ') || '']);
      rows.push(['']);
    }

    if (eaf.recordingOperator || eaf.shiftSupervisor || eaf.supervisorNotes) {
      rows.push(['--- Recording Info ---']);
      rows.push(['Recording Operator', eaf.recordingOperator || '']);
      rows.push(['Shift Supervisor', eaf.shiftSupervisor || '']);
      rows.push(['Supervisor Notes', eaf.supervisorNotes || '']);
    }

    const csv = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `heat_${h.heatId}_eaf_full.csv`;
    link.click();
  };

  const exportAllToExcel = () => {
    const rows: any[] = [];
    
    // Header
    rows.push(['Heat ID', 'Date', 'Shift', 'Grade', 'Power On', 'Power Off', 'Tap to Tap', 'Tapping Weight', 'Tapping Duration', 'En.Cou', 'PPM', 'Walls', 'Center Piece', 'Bottom', 'Taphole', 'DRI', 'Briquet', 'FeMn', 'FeSiMn', 'FeSi', 'Lime', 'Carbon', 'CPC MHU', 'CPC Injection', 'Oxygen', 'CH4', 'Dolomite']);

    filteredHeats.forEach(h => {
      const eaf = h.eafData;
      if (!eaf) return;
      rows.push([
        h.heatId,
        h.date,
        h.shift,
        h.steelGrade,
        eaf.powerOn || '',
        eaf.powerOff || '',
        eaf.tapToTap || '',
        eaf.tappingWeight || '',
        eaf.tappingDuration || '',
        eaf.enCou || '',
        eaf.ppm || '',
        eaf.refractoryCounters?.walls || '',
        eaf.refractoryCounters?.centerPiece || '',
        eaf.refractoryCounters?.bottom || '',
        eaf.refractoryCounters?.taphole || '',
        eaf.materials?.dri || '',
        eaf.materials?.briquet || '',
        eaf.materials?.feMn || '',
        eaf.materials?.feSiMn || '',
        eaf.materials?.feSi || '',
        eaf.materials?.lime || '',
        eaf.materials?.carbon || '',
        eaf.materials?.cpcMHU || '',
        eaf.materials?.cpcInjection || '',
        eaf.materials?.oxygen || '',
        eaf.materials?.ch4 || '',
        eaf.materials?.dolomite || '',
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

      {/* Filters */}
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

      {/* Summary */}
      <div className="card">
        <p className="text-sm text-gray-600"><span className="font-bold text-blue-600">{filteredHeats.length}</span> ذوب یافت شد</p>
      </div>

      {/* Table */}
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
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">En.Cou</th>
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
                  <td className="px-4 py-3 text-sm font-medium">{heat.eafData?.tappingWeight || '-'}</td>
                  <td className="px-4 py-3 text-sm">{heat.eafData?.powerOn || '-'}</td>
                  <td className="px-4 py-3 text-sm">{heat.eafData?.powerOff || '-'}</td>
                  <td className="px-4 py-3 text-sm">{heat.eafData?.tapToTap || '-'}</td>
                  <td className="px-4 py-3 text-sm">{heat.eafData?.enCou || '-'}</td>
                  <td className="px-4 py-3 text-sm">{heat.eafData?.ppm || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedHeat(heat)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">مشاهده</button>
                      <button onClick={() => exportSingleToExcel(heat)} className="text-green-600 hover:text-green-800 text-sm font-medium">📥 دانلود</button>
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

      {/* Detail Modal */}
      {selectedHeat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">جزئیات کامل ذوب {selectedHeat.heatId}</h3>
              <button onClick={() => setSelectedHeat(null)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>

            {/* General Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div><p className="text-sm text-gray-500">تاریخ</p><p className="font-bold">{selectedHeat.date}</p></div>
              <div><p className="text-sm text-gray-500">شیفت</p><p className="font-bold">{selectedHeat.shift}</p></div>
              <div><p className="text-sm text-gray-500">گرید</p><p className="font-bold">{selectedHeat.steelGrade}</p></div>
              <div><p className="text-sm text-gray-500">وزن تخلیه</p><p className="font-bold">{selectedHeat.eafData?.tappingWeight || '-'} تن</p></div>
            </div>

            {/* EAF Data */}
            {selectedHeat.eafData && (
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-blue-600">⚡ اطلاعات EAF</h4>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-blue-50 p-4 rounded-lg">
                  <div><p className="text-xs text-gray-600">Power On</p><p className="font-medium">{selectedHeat.eafData.powerOn || '-'} دقیقه</p></div>
                  <div><p className="text-xs text-gray-600">Power Off</p><p className="font-medium">{selectedHeat.eafData.powerOff || '-'} دقیقه</p></div>
                  <div><p className="text-xs text-gray-600">Tap to Tap</p><p className="font-medium">{selectedHeat.eafData.tapToTap || '-'} دقیقه</p></div>
                  <div><p className="text-xs text-gray-600">مدت تخلیه</p><p className="font-medium">{selectedHeat.eafData.tappingDuration || '-'} دقیقه</p></div>
                  <div><p className="text-xs text-gray-600">شروع تخلیه</p><p className="font-medium">{selectedHeat.eafData.tappingStartTime || '-'}</p></div>
                  <div><p className="text-xs text-gray-600">پایان تخلیه</p><p className="font-medium">{selectedHeat.eafData.tappingEndTime || '-'}</p></div>
                  <div><p className="text-xs text-gray-600">En.Cou</p><p className="font-medium">{selectedHeat.eafData.enCou || '-'} MWh</p></div>
                  <div><p className="text-xs text-gray-600">PPM</p><p className="font-medium">{selectedHeat.eafData.ppm || '-'}</p></div>
                </div>

                {/* Refractory */}
                {selectedHeat.eafData.refractoryCounters && (
                  <div>
                    <h5 className="font-bold text-gray-700 mb-2">وضعیت نسوز</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Object.entries(selectedHeat.eafData.refractoryCounters).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 p-2 rounded text-sm">
                          <p className="text-xs text-gray-500">{key}</p>
                          <p className="font-medium">{value as number}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Materials */}
                {selectedHeat.eafData.materials && (
                  <div>
                    <h5 className="font-bold text-gray-700 mb-2">مواد مصرفی (شارژ)</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Object.entries(selectedHeat.eafData.materials).map(([key, value]) => (
                        <div key={key} className="bg-blue-50 p-2 rounded text-sm">
                          <p className="text-xs text-gray-500">{key}</p>
                          <p className="font-medium">{(value as number).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tapping Materials */}
                {selectedHeat.eafData.tappingMaterials && (
                  <div>
                    <h5 className="font-bold text-gray-700 mb-2">مواد مصرفی (تخلیه)</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Object.entries(selectedHeat.eafData.tappingMaterials).map(([key, value]) => (
                        <div key={key} className="bg-green-50 p-2 rounded text-sm">
                          <p className="text-xs text-gray-500">{key}</p>
                          <p className="font-medium">{(value as number).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stoppages */}
                {selectedHeat.eafData.preStoppages && selectedHeat.eafData.preStoppages.filter((s: any) => s.from || s.till).length > 0 && (
                  <div>
                    <h5 className="font-bold text-gray-700 mb-2">توقفات قبل از شروع</h5>
                    <div className="space-y-2">
                      {selectedHeat.eafData.preStoppages.filter((s: any) => s.from || s.till).map((s: any, i: number) => (
                        <div key={i} className="bg-amber-50 p-3 rounded text-sm">
                          <span className="font-medium">از {s.from} تا {s.till}</span> - {s.minutes} دقیقه - {s.workingGroup} - {s.reason || s.customReason}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedHeat.eafData.duringStoppages && selectedHeat.eafData.duringStoppages.filter((s: any) => s.from || s.till).length > 0 && (
                  <div>
                    <h5 className="font-bold text-gray-700 mb-2">توقفات حین کار</h5>
                    <div className="space-y-2">
                      {selectedHeat.eafData.duringStoppages.filter((s: any) => s.from || s.till).map((s: any, i: number) => (
                        <div key={i} className="bg-red-50 p-3 rounded text-sm">
                          <span className="font-medium">از {s.from} تا {s.till}</span> - {s.minutes} دقیقه - {s.workingGroup} - {s.reason}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ladle Info */}
                {selectedHeat.eafData.ladleInfo && (
                  <div>
                    <h5 className="font-bold text-gray-700 mb-2">اطلاعات پاتیل</h5>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {Object.entries(selectedHeat.eafData.ladleInfo).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 p-2 rounded text-sm">
                          <p className="text-xs text-gray-500">{key}</p>
                          <p className="font-medium">{value as string || '-'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chemical Analysis */}
                {selectedHeat.eafData.chemicalAnalysis && selectedHeat.eafData.chemicalAnalysis.length > 0 && (
                  <div>
                    <h5 className="font-bold text-gray-700 mb-2">آنالیز شیمیایی</h5>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">نمونه</th>
                            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">C%</th>
                            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">Si%</th>
                            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">Mn%</th>
                            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">P%</th>
                            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">S%</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {selectedHeat.eafData.chemicalAnalysis.map((sample: any, i: number) => (
                            <tr key={i}>
                              <td className="px-3 py-2 font-medium">نمونه {i + 1}</td>
                              <td className="px-3 py-2 text-center">{sample.c}</td>
                              <td className="px-3 py-2 text-center">{sample.si}</td>
                              <td className="px-3 py-2 text-center">{sample.mn}</td>
                              <td className="px-3 py-2 text-center">{sample.p}</td>
                              <td className="px-3 py-2 text-center">{sample.s}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Additives */}
                {selectedHeat.eafData.additives && (
                  <div>
                    <h5 className="font-bold text-gray-700 mb-2">افزودنی‌ها</h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {Object.entries(selectedHeat.eafData.additives).map(([key, value]) => (
                        <div key={key} className="bg-purple-50 p-2 rounded text-sm">
                          <p className="text-xs text-gray-500">{key}</p>
                          <p className="font-medium">{(value as number).toLocaleString()} Kg</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Consumables */}
                {selectedHeat.eafData.consumables && (
                  <div>
                    <h5 className="font-bold text-gray-700 mb-2">مصرفی‌ها</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Object.entries(selectedHeat.eafData.consumables).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 p-2 rounded text-sm">
                          <p className="text-xs text-gray-500">{key}</p>
                          <p className="font-medium">{value as number}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Electrode Status */}
                {selectedHeat.eafData.electrodeStatus && (
                  <div>
                    <h5 className="font-bold text-gray-700 mb-2">وضعیت الکترودها</h5>
                    <div className="grid grid-cols-3 gap-2">
                      {['phase1', 'phase2', 'phase3'].map((phase, idx) => (
                        <div key={phase} className="bg-yellow-50 p-2 rounded text-sm">
                          <p className="text-xs text-gray-500">فاز {idx + 1}</p>
                          <p className="font-medium">{(selectedHeat.eafData.electrodeStatus as any)[phase]?.join(', ') || '-'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recording Info */}
                {(selectedHeat.eafData.recordingOperator || selectedHeat.eafData.shiftSupervisor || selectedHeat.eafData.supervisorNotes) && (
                  <div>
                    <h5 className="font-bold text-gray-700 mb-2">اطلاعات ثبت</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {selectedHeat.eafData.recordingOperator && (
                        <div className="bg-gray-50 p-2 rounded text-sm">
                          <p className="text-xs text-gray-500">اپراتور ثبت</p>
                          <p className="font-medium">{selectedHeat.eafData.recordingOperator}</p>
                        </div>
                      )}
                      {selectedHeat.eafData.shiftSupervisor && (
                        <div className="bg-gray-50 p-2 rounded text-sm">
                          <p className="text-xs text-gray-500">سرپرست شیفت</p>
                          <p className="font-medium">{selectedHeat.eafData.shiftSupervisor}</p>
                        </div>
                      )}
                      {selectedHeat.eafData.supervisorNotes && (
                        <div className="bg-gray-50 p-2 rounded text-sm md:col-span-3">
                          <p className="text-xs text-gray-500">یادداشت سرپرست</p>
                          <p className="font-medium">{selectedHeat.eafData.supervisorNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => exportSingleToExcel(selectedHeat)} className="btn-primary">📥 دانلود اکسل</button>
              <button onClick={() => setSelectedHeat(null)} className="btn-secondary">بستن</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
