import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';

export default function HeatDetailsPage() {
  const { heats } = useData();
  const [selectedHeatId, setSelectedHeatId] = useState('');
  const selectedHeat = heats.find(h => h.heatId === selectedHeatId);

  const exportToExcel = () => {
    if (!selectedHeat) return;

    const rows: any[] = [];
    const h = selectedHeat;

    // Header
    rows.push(['گزارش کامل ذوب', h.heatId]);
    rows.push(['']);
    
    // General Info
    rows.push(['=== اطلاعات عمومی ===']);
    rows.push(['تاریخ', h.date]);
    rows.push(['شیفت', h.shift]);
    rows.push(['گرید فولاد', h.steelGrade]);
    rows.push(['وضعیت EAF', h.eafStatus]);
    rows.push(['وضعیت LF', h.lfStatus]);
    rows.push(['وضعیت CCM', h.ccmStatus]);
    rows.push(['']);

    // EAF Data
    if (h.eafData) {
      rows.push(['=== اطلاعات کوره قوس الکتریکی (EAF) ===']);
      rows.push(['Power On (دقیقه)', h.eafData.powerOn]);
      rows.push(['Power Off (دقیقه)', h.eafData.powerOff]);
      rows.push(['TAP TO TAP (دقیقه)', h.eafData.tapToTap]);
      rows.push(['وزن تخلیه (تن)', h.eafData.tappingWeight]);
      rows.push(['زمان شروع تخلیه', h.eafData.tappingStartTime]);
      rows.push(['زمان پایان تخلیه', h.eafData.tappingEndTime]);
      rows.push(['مدت تخلیه (دقیقه)', h.eafData.tappingDuration]);
      rows.push(['En.Cou (MWh)', h.eafData.enCou]);
      rows.push(['PPM', h.eafData.ppm]);
      rows.push(['']);

      // Refractory
      if (h.eafData.refractoryCounters) {
        rows.push(['--- وضعیت نسوز ---']);
        rows.push(['Walls', h.eafData.refractoryCounters.walls]);
        rows.push(['CENTER PIECE - دلتا', h.eafData.refractoryCounters.centerPiece]);
        rows.push(['Bottom', h.eafData.refractoryCounters.bottom]);
        rows.push(['Taphole', h.eafData.refractoryCounters.taphole]);
        rows.push(['']);
      }

      // Materials
      if (h.eafData.materials) {
        rows.push(['--- مواد مصرفی (شارژ) ---']);
        rows.push(['DRI (تن)', h.eafData.materials.dri]);
        rows.push(['Briquet (تن)', h.eafData.materials.briquet]);
        rows.push(['FeMn (Kg)', h.eafData.materials.feMn]);
        rows.push(['FeSiMn (Kg)', h.eafData.materials.feSiMn]);
        rows.push(['FeSi (Kg)', h.eafData.materials.feSi]);
        rows.push(['Lime (Kg)', h.eafData.materials.lime]);
        rows.push(['Carbon (Kg)', h.eafData.materials.carbon]);
        rows.push(['CPC MHU (Kg)', h.eafData.materials.cpcMHU]);
        rows.push(['CPC Injection (Kg)', h.eafData.materials.cpcInjection]);
        rows.push(['Oxygen (Nm³)', h.eafData.materials.oxygen]);
        rows.push(['CH4 (Nm³)', h.eafData.materials.ch4]);
        rows.push(['Dolomite (Kg)', h.eafData.materials.dolomite]);
        rows.push(['']);
      }

      // Tapping Materials
      if (h.eafData.tappingMaterials) {
        rows.push(['--- مواد مصرفی (تخلیه) ---']);
        rows.push(['DRI (تن)', h.eafData.tappingMaterials.dri]);
        rows.push(['Briquet (تن)', h.eafData.tappingMaterials.briquet]);
        rows.push(['FeMn (Kg)', h.eafData.tappingMaterials.feMn]);
        rows.push(['FeSiMn (Kg)', h.eafData.tappingMaterials.feSiMn]);
        rows.push(['FeSi (Kg)', h.eafData.tappingMaterials.feSi]);
        rows.push(['Lime (Kg)', h.eafData.tappingMaterials.lime]);
        rows.push(['Carbon (Kg)', h.eafData.tappingMaterials.carbon]);
        rows.push(['CPC MHU (Kg)', h.eafData.tappingMaterials.cpcMHU]);
        rows.push(['CPC Injection (Kg)', h.eafData.tappingMaterials.cpcInjection]);
        rows.push(['Oxygen (Nm³)', h.eafData.tappingMaterials.oxygen]);
        rows.push(['CH4 (Nm³)', h.eafData.tappingMaterials.ch4]);
        rows.push(['Dolomite (Kg)', h.eafData.tappingMaterials.dolomite]);
        rows.push(['']);
      }

      // Pre-stoppages
      if (h.eafData.preStoppages && h.eafData.preStoppages.length > 0) {
        rows.push(['--- توقفات قبل از شروع ---']);
        h.eafData.preStoppages.forEach((s: any, i: number) => {
          if (s.from || s.till) {
            rows.push([`توقف ${i + 1}`, `از: ${s.from}`, `تا: ${s.till}`, `دقیقه: ${s.minutes}`, `واحد: ${s.workingGroup}`, `علت: ${s.reason || s.customReason || ''}`]);
          }
        });
        rows.push(['']);
      }

      // During-stoppages
      if (h.eafData.duringStoppages && h.eafData.duringStoppages.length > 0) {
        rows.push(['--- توقفات حین کار ---']);
        h.eafData.duringStoppages.forEach((s: any, i: number) => {
          if (s.from || s.till) {
            rows.push([`توقف ${i + 1}`, `از: ${s.from}`, `تا: ${s.till}`, `دقیقه: ${s.minutes}`, `واحد: ${s.workingGroup}`]);
          }
        });
        rows.push(['']);
      }
    }

    // LF Data
    if (h.lfData) {
      rows.push(['=== اطلاعات کوره پاتیلی (LF) ===']);
      if (h.lfData.additives) {
        rows.push(['--- مواد افزودنی ---']);
        Object.entries(h.lfData.additives).forEach(([key, value]) => {
          rows.push([key, value as number, 'Kg']);
        });
        rows.push(['']);
      }
    }

    // CCM Data
    if (h.ccmData) {
      rows.push(['=== اطلاعات ریخته‌گری مداوم (CCM) ===']);
      rows.push(['سرعت ریخته‌گری (m/min)', h.ccmData.avgCastingSpeed]);
      rows.push(['تعداد پارگی خطوط', h.ccmData.lineBreaks]);
      rows.push(['تعداد ذوب در سکوئنس', h.ccmData.sequenceHeats]);
      rows.push(['']);
    }

    // Footer
    rows.push(['========================================']);
    rows.push(['تاریخ ایجاد گزارش', new Date().toLocaleString('fa-IR')]);

    const csv = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `heat_${h.heatId}_full_report.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-l from-indigo-600 to-indigo-700 text-white">
        <h2 className="text-2xl font-bold">📋 جزئیات کامل ذوب</h2>
        <p className="text-indigo-100 mt-1">نمایش و دانلود اطلاعات کامل هر ذوب</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="label-field">انتخاب ذوب</label>
            <select
              value={selectedHeatId}
              onChange={e => setSelectedHeatId(e.target.value)}
              className="input-field"
            >
              <option value="">انتخاب کنید...</option>
              {heats.map(h => (
                <option key={h.id} value={h.heatId}>
                  {h.heatId} - {h.date} - شیفت {h.shift} - {h.steelGrade}
                </option>
              ))}
            </select>
          </div>
          {selectedHeat && (
            <button onClick={exportToExcel} className="btn-primary">
              📥 دانلود اکسل
            </button>
          )}
        </div>
      </div>

      {selectedHeat ? (
        <div className="space-y-4">
          {/* General Info */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">اطلاعات عمومی</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><p className="text-sm text-gray-500">Heat ID</p><p className="font-bold text-blue-600">{selectedHeat.heatId}</p></div>
              <div><p className="text-sm text-gray-500">تاریخ</p><p className="font-bold">{selectedHeat.date}</p></div>
              <div><p className="text-sm text-gray-500">شیفت</p><p className="font-bold">{selectedHeat.shift}</p></div>
              <div><p className="text-sm text-gray-500">گرید</p><p className="font-bold">{selectedHeat.steelGrade}</p></div>
            </div>
          </div>

          {/* EAF Data */}
          {selectedHeat.eafData && (
            <div className="card">
              <h3 className="text-lg font-bold text-blue-600 mb-4">⚡ اطلاعات کوره قوس الکتریکی (EAF)</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div><p className="text-sm text-gray-500">Power On</p><p className="font-bold">{selectedHeat.eafData.powerOn} دقیقه</p></div>
                <div><p className="text-sm text-gray-500">Power Off</p><p className="font-bold">{selectedHeat.eafData.powerOff} دقیقه</p></div>
                <div><p className="text-sm text-gray-500">TAP TO TAP</p><p className="font-bold">{selectedHeat.eafData.tapToTap} دقیقه</p></div>
                <div><p className="text-sm text-gray-500">وزن تخلیه</p><p className="font-bold">{selectedHeat.eafData.tappingWeight} تن</p></div>
                <div><p className="text-sm text-gray-500">شروع تخلیه</p><p className="font-bold">{selectedHeat.eafData.tappingStartTime}</p></div>
                <div><p className="text-sm text-gray-500">پایان تخلیه</p><p className="font-bold">{selectedHeat.eafData.tappingEndTime}</p></div>
                <div><p className="text-sm text-gray-500">مدت تخلیه</p><p className="font-bold">{selectedHeat.eafData.tappingDuration} دقیقه</p></div>
                <div><p className="text-sm text-gray-500">En.Cou</p><p className="font-bold">{selectedHeat.eafData.enCou} MWh</p></div>
                <div><p className="text-sm text-gray-500">PPM</p><p className="font-bold">{selectedHeat.eafData.ppm}</p></div>
              </div>

              {selectedHeat.eafData.refractoryCounters && (
                <div className="mb-4">
                  <h4 className="font-bold text-gray-700 mb-2">وضعیت نسوز</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-gray-50 p-3 rounded"><p className="text-xs text-gray-500">Walls</p><p className="font-bold">{selectedHeat.eafData.refractoryCounters.walls}</p></div>
                    <div className="bg-gray-50 p-3 rounded"><p className="text-xs text-gray-500">CENTER PIECE - دلتا</p><p className="font-bold">{selectedHeat.eafData.refractoryCounters.centerPiece}</p></div>
                    <div className="bg-gray-50 p-3 rounded"><p className="text-xs text-gray-500">Bottom</p><p className="font-bold">{selectedHeat.eafData.refractoryCounters.bottom}</p></div>
                    <div className="bg-gray-50 p-3 rounded"><p className="text-xs text-gray-500">Taphole</p><p className="font-bold">{selectedHeat.eafData.refractoryCounters.taphole}</p></div>
                  </div>
                </div>
              )}

              {selectedHeat.eafData.materials && (
                <div className="mb-4">
                  <h4 className="font-bold text-gray-700 mb-2">مواد مصرفی (شارژ)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(selectedHeat.eafData.materials).map(([key, value]) => (
                      <div key={key} className="bg-blue-50 p-3 rounded">
                        <p className="text-xs text-gray-500">{key}</p>
                        <p className="font-bold">{(value as number).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedHeat.eafData.tappingMaterials && (
                <div className="mb-4">
                  <h4 className="font-bold text-gray-700 mb-2">مواد مصرفی (تخلیه)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(selectedHeat.eafData.tappingMaterials).map(([key, value]) => (
                      <div key={key} className="bg-green-50 p-3 rounded">
                        <p className="text-xs text-gray-500">{key}</p>
                        <p className="font-bold">{(value as number).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedHeat.eafData.preStoppages && selectedHeat.eafData.preStoppages.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-bold text-gray-700 mb-2">توقفات قبل از شروع</h4>
                  <div className="space-y-2">
                    {selectedHeat.eafData.preStoppages.filter((s: any) => s.from || s.till).map((s: any, i: number) => (
                      <div key={i} className="bg-amber-50 p-3 rounded text-sm">
                        <span className="font-medium">از {s.from} تا {s.till}</span> - {s.minutes} دقیقه - {s.workingGroup} - {s.reason || s.customReason}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedHeat.eafData.duringStoppages && selectedHeat.eafData.duringStoppages.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-700 mb-2">توقفات حین کار</h4>
                  <div className="space-y-2">
                    {selectedHeat.eafData.duringStoppages.filter((s: any) => s.from || s.till).map((s: any, i: number) => (
                      <div key={i} className="bg-red-50 p-3 rounded text-sm">
                        <span className="font-medium">از {s.from} تا {s.till}</span> - {s.minutes} دقیقه - {s.workingGroup}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LF Data */}
          {selectedHeat.lfData && (
            <div className="card">
              <h3 className="text-lg font-bold text-green-600 mb-4">🔧 اطلاعات کوره پاتیلی (LF)</h3>
              {selectedHeat.lfData.additives && (
                <div>
                  <h4 className="font-bold text-gray-700 mb-2">مواد افزودنی</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(selectedHeat.lfData.additives).map(([key, value]) => (
                      <div key={key} className="bg-green-50 p-3 rounded">
                        <p className="text-xs text-gray-500">{key}</p>
                        <p className="font-bold">{(value as number).toLocaleString()} Kg</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CCM Data */}
          {selectedHeat.ccmData && (
            <div className="card">
              <h3 className="text-lg font-bold text-purple-600 mb-4">🏭 اطلاعات ریخته‌گری مداوم (CCM)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div><p className="text-sm text-gray-500">سرعت ریخته‌گری</p><p className="font-bold">{selectedHeat.ccmData.avgCastingSpeed} m/min</p></div>
                <div><p className="text-sm text-gray-500">پارگی خطوط</p><p className="font-bold text-red-600">{selectedHeat.ccmData.lineBreaks}</p></div>
                <div><p className="text-sm text-gray-500">ذوب در سکوئنس</p><p className="font-bold">{selectedHeat.ccmData.sequenceHeats}</p></div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-500">لطفاً یک ذوب را انتخاب کنید</p>
        </div>
      )}
    </div>
  );
}
