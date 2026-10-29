import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

export default function HeatDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { heats } = useData();
  
  const heat = heats.find(h => h.id === id);

  if (!heat) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500 text-lg mb-4">ذوب مورد نظر یافت نشد</p>
        <button onClick={() => navigate('/heats')} className="btn-primary">
          بازگشت به فهرست ذوب‌ها
        </button>
      </div>
    );
  }

  const eaf = heat.eafData as any;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">جزئیات ذوب {heat.heatId}</h2>
        <button onClick={() => navigate('/heats')} className="btn-secondary">
          بازگشت
        </button>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4">اطلاعات عمومی</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Heat ID</p>
            <p className="font-bold text-blue-600">{heat.heatId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">تاریخ</p>
            <p className="font-bold">{heat.date}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">شیفت</p>
            <p className="font-bold">{heat.shift}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">گرید</p>
            <p className="font-bold">{heat.steelGrade}</p>
          </div>
        </div>
      </div>

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

      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4">وضعیت‌ها</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${heat.eafStatus === 'completed' ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
            <p className="text-sm text-gray-500">EAF</p>
            <p className="font-bold">{heat.eafStatus === 'completed' ? 'تکمیل شده' : heat.eafStatus === 'in_progress' ? 'در حال انجام' : 'شروع نشده'}</p>
          </div>
          <div className={`p-4 rounded-lg ${heat.lfStatus === 'completed' ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
            <p className="text-sm text-gray-500">LF</p>
            <p className="font-bold">{heat.lfStatus === 'completed' ? 'تکمیل شده' : heat.lfStatus === 'in_progress' ? 'در حال انجام' : 'شروع نشده'}</p>
          </div>
          <div className={`p-4 rounded-lg ${heat.ccmStatus === 'completed' ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
            <p className="text-sm text-gray-500">CCM</p>
            <p className="font-bold">{heat.ccmStatus === 'completed' ? 'تکمیل شده' : heat.ccmStatus === 'in_progress' ? 'در حال انجام' : 'شروع نشده'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
