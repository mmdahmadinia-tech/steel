import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';

export default function HeatDetailsPage() {
  const { heats } = useData();
  const [selectedHeatId, setSelectedHeatId] = useState('');
  
  const selectedHeat = heats.find(h => h.id === selectedHeatId);
  const eaf = selectedHeat?.eafData as any;

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-l from-indigo-600 to-indigo-700 text-white">
        <h2 className="text-2xl font-bold">📋 جزئیات ذوب</h2>
        <p className="text-indigo-100 mt-1">مشاهده اطلاعات کامل هر ذوب</p>
      </div>

      <div className="card">
        <label className="label-field">انتخاب ذوب</label>
        <select
          value={selectedHeatId}
          onChange={e => setSelectedHeatId(e.target.value)}
          className="input-field"
        >
          <option value="">-- یک ذوب را انتخاب کنید --</option>
          {heats.map(h => (
            <option key={h.id} value={h.id}>
              ذوب {h.heatId} - {h.date} - شیفت {h.shift} - {h.steelGrade}
            </option>
          ))}
        </select>
      </div>

      {selectedHeat ? (
        <div className="space-y-4">
          {/* General Info */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">اطلاعات عمومی</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Heat ID</p>
                <p className="font-bold text-blue-600">{selectedHeat.heatId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">تاریخ</p>
                <p className="font-bold">{selectedHeat.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">شیفت</p>
                <p className="font-bold">{selectedHeat.shift}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">گرید</p>
                <p className="font-bold">{selectedHeat.steelGrade}</p>
              </div>
            </div>
          </div>

          {/* EAF Data */}
          {eaf && (
            <>
              <div className="card">
                <h3 className="text-lg font-bold text-blue-600 mb-4">⚡ اطلاعات کوره قوس الکتریکی (EAF)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">شروع ذوب</p>
                    <p className="font-bold">{eaf.heatStartTime || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">شروع تخلیه</p>
                    <p className="font-bold">{eaf.tappingStartTime || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">پایان تخلیه</p>
                    <p className="font-bold">{eaf.tappingEndTime || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">مدت تخلیه</p>
                    <p className="font-bold">{eaf.tappingDuration || 0} دقیقه</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Power On</p>
                    <p className="font-bold">{eaf.powerOn || 0} دقیقه</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Power Off</p>
                    <p className="font-bold">{eaf.powerOff || 0} دقیقه</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tap to Tap</p>
                    <p className="font-bold">{eaf.tapToTap || 0} دقیقه</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">وزن تخلیه</p>
                    <p className="font-bold">{eaf.tappingWeight || 0} تن</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">درصد کربن</p>
                    <p className="font-bold">{eaf.carbonPercent || 0}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">PPM</p>
                    <p className="font-bold">{eaf.ppm || 0}</p>
                  </div>
                </div>
              </div>

              {/* Refractory */}
              {eaf.refractoryCounters && (
                <div className="card">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">وضعیت نسوز</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Walls</p>
                      <p className="font-bold">{eaf.refractoryCounters.walls || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Center Piece</p>
                      <p className="font-bold">{eaf.refractoryCounters.centerPiece || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bottom</p>
                      <p className="font-bold">{eaf.refractoryCounters.bottom || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Taphole</p>
                      <p className="font-bold">{eaf.refractoryCounters.taphole || 0}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Chemical Analysis */}
              {eaf.chemicalAnalysis && eaf.chemicalAnalysis.length > 0 && (
                <div className="card">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">آنالیز شیمیایی</h3>
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
                        {eaf.chemicalAnalysis.map((sample: any, i: number) => (
                          <tr key={i}>
                            <td className="px-3 py-2 font-medium">نمونه {i + 1}</td>
                            <td className="px-3 py-2 text-center">{sample.c || 0}</td>
                            <td className="px-3 py-2 text-center">{sample.si || 0}</td>
                            <td className="px-3 py-2 text-center">{sample.mn || 0}</td>
                            <td className="px-3 py-2 text-center">{sample.p || 0}</td>
                            <td className="px-3 py-2 text-center">{sample.s || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Electrode Status */}
              {eaf.electrodeStatus && (
                <div className="card">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">وضعیت الکترودها</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['phase1', 'phase2', 'phase3'].map((phase, idx) => (
                      <div key={phase} className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium mb-3">فاز {idx + 1}</h5>
                        <div className="space-y-2">
                          {eaf.electrodeStatus[phase]?.map((status: string, i: number) => (
                            <div key={i} className="text-sm text-gray-700">
                              ✓ {status}
                            </div>
                          ))}
                          {(!eaf.electrodeStatus[phase] || eaf.electrodeStatus[phase].length === 0) && (
                            <div className="text-sm text-gray-400">بدون وضعیت</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Status */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">وضعیت‌ها</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg ${selectedHeat.eafStatus === 'completed' ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                <p className="text-sm text-gray-500">EAF</p>
                <p className="font-bold">{selectedHeat.eafStatus === 'completed' ? 'تکمیل شده' : selectedHeat.eafStatus === 'in_progress' ? 'در حال انجام' : 'شروع نشده'}</p>
              </div>
              <div className={`p-4 rounded-lg ${selectedHeat.lfStatus === 'completed' ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                <p className="text-sm text-gray-500">LF</p>
                <p className="font-bold">{selectedHeat.lfStatus === 'completed' ? 'تکمیل شده' : selectedHeat.lfStatus === 'in_progress' ? 'در حال انجام' : 'شروع نشده'}</p>
              </div>
              <div className={`p-4 rounded-lg ${selectedHeat.ccmStatus === 'completed' ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                <p className="text-sm text-gray-500">CCM</p>
                <p className="font-bold">{selectedHeat.ccmStatus === 'completed' ? 'تکمیل شده' : selectedHeat.ccmStatus === 'in_progress' ? 'در حال انجام' : 'شروع نشده'}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-500">لطفاً یک ذوب را انتخاب کنید</p>
        </div>
      )}
    </div>
  );
}
