import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function HeatDetailsPage() {
  const { heats, deleteHeat, deleteAllHeats } = useData();
  const { user } = useAuth();
  const [selectedHeatId, setSelectedHeatId] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  
  const selectedHeat = heats.find(h => h.id === selectedHeatId);
  const eaf = selectedHeat?.eafData as any;
  const lf = selectedHeat?.lfData as any;
  const ccm = selectedHeat?.ccmData as any;

  const handleDeleteHeat = () => {
    if (selectedHeatId) {
      deleteHeat(selectedHeatId);
      setSelectedHeatId('');
      setShowDeleteConfirm(false);
      alert('ذوب با موفقیت حذف شد');
    }
  };

  const handleDeleteAllHeats = () => {
    deleteAllHeats();
    setSelectedHeatId('');
    setShowDeleteAllConfirm(false);
    alert('تمام ذوب‌ها با موفقیت حذف شدند');
  };

  const exportToPDF = () => {
    if (!selectedHeat) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('لطفاً پاپ‌آپ را مجاز کنید');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <title>جزئیات ذوب ${selectedHeat.heatId}</title>
        <style>
          body { font-family: Tahoma, sans-serif; padding: 20px; direction: rtl; }
          h1 { color: #1e40af; text-align: center; margin-bottom: 10px; }
          h2 { color: #3b82f6; margin-top: 30px; border-bottom: 2px solid #3b82f6; padding-bottom: 5px; }
          h3 { color: #059669; margin-top: 20px; }
          .info { background: #f0f9ff; padding: 10px; border-radius: 5px; margin: 10px 0; }
          .info-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
          .info-item { background: white; padding: 8px; border-radius: 3px; }
          .info-label { font-size: 10px; color: #666; }
          .info-value { font-size: 14px; font-weight: bold; color: #1e40af; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { border: 1px solid #ddd; padding: 6px; text-align: center; }
          th { background: #3b82f6; color: white; }
          tr:nth-child(even) { background: #f9f9f9; }
          .materials { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; }
          .material-item { background: #f0fdf4; padding: 5px; border-radius: 3px; }
          .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
          .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <h1>گزارش کامل ذوب ${selectedHeat.heatId}</h1>
        <p style="text-align: center; color: #666;">تاریخ گزارش: ${new Date().toLocaleDateString('fa-IR')}</p>
        
        <div class="info">
          <div class="info-grid">
            <div class="info-item"><div class="info-label">Heat ID</div><div class="info-value">${selectedHeat.heatId}</div></div>
            <div class="info-item"><div class="info-label">تاریخ</div><div class="info-value">${selectedHeat.date}</div></div>
            <div class="info-item"><div class="info-label">شیفت</div><div class="info-value">${selectedHeat.shift}</div></div>
            <div class="info-item"><div class="info-label">گرید</div><div class="info-value">${selectedHeat.steelGrade}</div></div>
          </div>
        </div>

        ${eaf ? `
          <h2>⚡ اطلاعات کوره قوس الکتریکی (EAF)</h2>
          <div class="info">
            <div class="info-grid">
              <div class="info-item"><div class="info-label">شروع ذوب</div><div class="info-value">${eaf.heatStartTime || '-'}</div></div>
              <div class="info-item"><div class="info-label">شروع تخلیه</div><div class="info-value">${eaf.tappingStartTime || '-'}</div></div>
              <div class="info-item"><div class="info-label">پایان تخلیه</div><div class="info-value">${eaf.tappingEndTime || '-'}</div></div>
              <div class="info-item"><div class="info-label">مدت تخلیه</div><div class="info-value">${eaf.tappingDuration || 0} دقیقه</div></div>
              <div class="info-item"><div class="info-label">Power On</div><div class="info-value">${eaf.powerOn || 0} دقیقه</div></div>
              <div class="info-item"><div class="info-label">Power Off</div><div class="info-value">${eaf.powerOff || 0} دقیقه</div></div>
              <div class="info-item"><div class="info-label">Tap to Tap</div><div class="info-value">${eaf.tapToTap || 0} دقیقه</div></div>
              <div class="info-item"><div class="info-label">وزن تخلیه</div><div class="info-value">${eaf.tappingWeight || 0} تن</div></div>
              <div class="info-item"><div class="info-label">درصد کربن</div><div class="info-value">${eaf.carbonPercent || 0}%</div></div>
              <div class="info-item"><div class="info-label">PPM</div><div class="info-value">${eaf.ppm || 0}</div></div>
            </div>
          </div>

          ${eaf.refractoryCounters ? `
            <h3>وضعیت نسوز</h3>
            <table>
              <tr><th>Walls</th><th>Center Piece</th><th>Bottom</th><th>Taphole</th></tr>
              <tr><td>${eaf.refractoryCounters.walls || 0}</td><td>${eaf.refractoryCounters.centerPiece || 0}</td><td>${eaf.refractoryCounters.bottom || 0}</td><td>${eaf.refractoryCounters.taphole || 0}</td></tr>
            </table>
          ` : ''}

          ${eaf.chemicalAnalysis && eaf.chemicalAnalysis.length > 0 ? `
            <h3>آنالیز شیمیایی</h3>
            <table>
              <tr><th>نمونه</th><th>C%</th><th>Si%</th><th>Mn%</th><th>P%</th><th>S%</th></tr>
              ${eaf.chemicalAnalysis.map((sample: any, i: number) => `
                <tr><td>نمونه ${i + 1}</td><td>${sample.c || 0}</td><td>${sample.si || 0}</td><td>${sample.mn || 0}</td><td>${sample.p || 0}</td><td>${sample.s || 0}</td></tr>
              `).join('')}
            </table>
          ` : ''}
        ` : ''}

        ${lf ? `
          <h2>🔧 اطلاعات کوره پاتیلی (LF)</h2>
          <div class="info">
            <div class="info-grid">
              <div class="info-item"><div class="info-label">Input Time</div><div class="info-value">${lf.inputCondition?.inputTime || '-'}</div></div>
              <div class="info-item"><div class="info-label">Temperature</div><div class="info-value">${lf.inputCondition?.inputTemperature || 0}°C</div></div>
              <div class="info-item"><div class="info-label">PPM (O₂)</div><div class="info-value">${lf.inputCondition?.ppm || 0}</div></div>
              <div class="info-item"><div class="info-label">Delivery to CCM</div><div class="info-value">${lf.deliveryTimeToCCM || '-'}</div></div>
            </div>
          </div>

          ${lf.chemicalAnalysis ? `
            <h3>آنالیز شیمیایی</h3>
            <table>
              <tr><th>نمونه</th><th>C%</th><th>Si%</th><th>Mn%</th><th>P%</th><th>S%</th><th>Al%</th></tr>
              ${['sample1', 'sample2', 'sample3', 'sample4', 'sample5'].map((s, i) => {
                const sample = lf.chemicalAnalysis[s];
                if (sample && (sample.c || sample.si || sample.mn)) {
                  return `<tr><td>نمونه ${i + 1}</td><td>${sample.c || 0}</td><td>${sample.si || 0}</td><td>${sample.mn || 0}</td><td>${sample.p || 0}</td><td>${sample.s || 0}</td><td>${sample.al || 0}</td></tr>`;
                }
                return '';
              }).join('')}
            </table>
          ` : ''}
        ` : ''}

        ${ccm ? `
          <h2>🏭 اطلاعات ریخته‌گری مداوم (CCM)</h2>
          <div class="info">
            <div class="info-grid">
              <div class="info-item"><div class="info-label">سرعت ریخته‌گری</div><div class="info-value">${ccm.avgCastingSpeed || 0} m/min</div></div>
              <div class="info-item"><div class="info-label">پارگی خطوط</div><div class="info-value">${ccm.lineBreaks || 0}</div></div>
              <div class="info-item"><div class="info-label">ذوب در سکوئنس</div><div class="info-value">${ccm.sequenceHeats || 0}</div></div>
            </div>
          </div>
        ` : ''}

        <div style="margin-top: 50px; text-align: center; color: #999; font-size: 12px;">
          <p>گزارش تولید شده توسط سامانه STEELMETRICS</p>
          <p>steelmetrics.ir</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-l from-indigo-600 to-indigo-700 text-white">
        <h2 className="text-2xl font-bold">📋 جزئیات ذوب</h2>
        <p className="text-indigo-100 mt-1">مشاهده اطلاعات کامل هر ذوب به تفکیک واحد</p>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <label className="label-field mb-0">انتخاب ذوب</label>
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowDeleteAllConfirm(true)}
              className="btn-danger text-sm"
            >
              🗑️ حذف تمام ذوب‌ها
            </button>
          )}
        </div>
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
        
        {selectedHeat && (
          <div className="flex items-center gap-3 mt-4">
            {user?.role === 'admin' && (
              <>
                <Link to={`/eaf?edit=${selectedHeatId}`} className="btn-primary text-sm">
                  ✏️ ویرایش ذوب
                </Link>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn-danger text-sm"
                >
                  🗑️ حذف ذوب
                </button>
              </>
            )}
            <button
              onClick={exportToPDF}
              className="btn-secondary text-sm"
            >
              📄 دانلود PDF
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">⚠️ تأیید حذف</h3>
            <p className="text-gray-600 mb-6">
              آیا مطمئن هستید که می‌خواهید ذوب <strong>{selectedHeat?.heatId}</strong> را حذف کنید؟
              <br />
              <span className="text-red-600 text-sm">این عملیات قابل بازگشت نیست!</span>
            </p>
            <div className="flex gap-3">
              <button onClick={handleDeleteHeat} className="btn-danger flex-1">
                بله، حذف شود
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary flex-1">
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Confirmation Modal */}
      {showDeleteAllConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">⚠️ تأیید حذف تمام ذوب‌ها</h3>
            <p className="text-gray-600 mb-6">
              آیا مطمئن هستید که می‌خواهید <strong>تمام {heats.length} ذوب</strong> را حذف کنید؟
              <br />
              <span className="text-red-600 text-sm">این عملیات قابل بازگشت نیست و تمام داده‌ها از بین می‌روند!</span>
            </p>
            <div className="flex gap-3">
              <button onClick={handleDeleteAllHeats} className="btn-danger flex-1">
                بله، حذف شوند
              </button>
              <button onClick={() => setShowDeleteAllConfirm(false)} className="btn-secondary flex-1">
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedHeat ? (
        <div className="space-y-6">
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

          {/* Status Overview */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">وضعیت واحدها</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg ${selectedHeat.eafStatus === 'completed' ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                <p className="text-sm text-gray-500">⚡ EAF</p>
                <p className="font-bold text-lg">{selectedHeat.eafStatus === 'completed' ? '✅ تکمیل شده' : selectedHeat.eafStatus === 'in_progress' ? '⏳ در حال انجام' : '⭕ شروع نشده'}</p>
              </div>
              <div className={`p-4 rounded-lg ${selectedHeat.lfStatus === 'completed' ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                <p className="text-sm text-gray-500">🔧 LF</p>
                <p className="font-bold text-lg">{selectedHeat.lfStatus === 'completed' ? '✅ تکمیل شده' : selectedHeat.lfStatus === 'in_progress' ? '⏳ در حال انجام' : '⭕ شروع نشده'}</p>
              </div>
              <div className={`p-4 rounded-lg ${selectedHeat.ccmStatus === 'completed' ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                <p className="text-sm text-gray-500">🏭 CCM</p>
                <p className="font-bold text-lg">{selectedHeat.ccmStatus === 'completed' ? '✅ تکمیل شده' : selectedHeat.ccmStatus === 'in_progress' ? '⏳ در حال انجام' : '⭕ شروع نشده'}</p>
              </div>
            </div>
          </div>

          {/* EAF Data */}
          {eaf && (
            <>
              <div className="card border-l-4 border-l-blue-500">
                <h3 className="text-xl font-bold text-blue-600 mb-4">⚡ اطلاعات کوره قوس الکتریکی (EAF)</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
                  <h4 className="text-lg font-bold text-gray-800 mb-4">وضعیت نسوز</h4>
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
                  <h4 className="text-lg font-bold text-gray-800 mb-4">آنالیز شیمیایی</h4>
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
                  <h4 className="text-lg font-bold text-gray-800 mb-4">وضعیت الکترودها</h4>
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

          {/* LF Data */}
          {lf && (
            <>
              <div className="card border-l-4 border-l-green-500">
                <h3 className="text-xl font-bold text-green-600 mb-4">🔧 اطلاعات کوره پاتیلی (LF)</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Input Time</p>
                    <p className="font-bold">{lf.inputCondition?.inputTime || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Temperature</p>
                    <p className="font-bold">{lf.inputCondition?.inputTemperature || 0}°C</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">PPM (O₂)</p>
                    <p className="font-bold">{lf.inputCondition?.ppm || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Delivery to CCM</p>
                    <p className="font-bold">{lf.deliveryTimeToCCM || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Slag Thickness</p>
                    <p className="font-bold">{lf.inputCondition?.slagThickness || 0} mm</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Free Board</p>
                    <p className="font-bold">{lf.inputCondition?.freeBoard || 0} mm</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time String</p>
                    <p className="font-bold">{lf.argonConsumption?.timeString || 0} دقیقه</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Argon Consumption</p>
                    <p className="font-bold">{lf.argonConsumption?.consumption || 0} Nm³</p>
                  </div>
                </div>
              </div>

              {/* Ladle Status */}
              {lf.ladleStatus && (
                <div className="card">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">وضعیت پاتیل</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Ladle Number</p>
                      <p className="font-bold">{lf.ladleStatus.ladleNumber || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Change Ladle</p>
                      <p className="font-bold">{lf.ladleStatus.changeLadle || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Slag Line Life</p>
                      <p className="font-bold">{lf.ladleStatus.slagLineLife || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ladle Life</p>
                      <p className="font-bold">{lf.ladleStatus.ladleLife || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Transfercar</p>
                      <p className="font-bold">{lf.ladleStatus.transfercarNumber || '-'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Additives */}
              {lf.additives && (
                <div className="card">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">مواد افزودنی (جمع کل)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(lf.additives).map(([key, values]) => {
                      if (Array.isArray(values)) {
                        const total = values.reduce((sum: number, val: number) => sum + val, 0);
                        return (
                          <div key={key} className="bg-green-50 p-3 rounded">
                            <p className="text-xs text-gray-500">{key}</p>
                            <p className="font-bold">{total} Kg</p>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}

              {/* Chemical Analysis */}
              {lf.chemicalAnalysis && (
                <div className="card">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">آنالیز شیمیایی</h4>
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
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">Al%</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {['sample1', 'sample2', 'sample3', 'sample4', 'sample5'].map((s, i) => {
                          const sample = lf.chemicalAnalysis[s];
                          if (sample && (sample.c || sample.si || sample.mn)) {
                            return (
                              <tr key={s}>
                                <td className="px-3 py-2 font-medium">نمونه {i + 1}</td>
                                <td className="px-3 py-2 text-center">{sample.c || 0}</td>
                                <td className="px-3 py-2 text-center">{sample.si || 0}</td>
                                <td className="px-3 py-2 text-center">{sample.mn || 0}</td>
                                <td className="px-3 py-2 text-center">{sample.p || 0}</td>
                                <td className="px-3 py-2 text-center">{sample.s || 0}</td>
                                <td className="px-3 py-2 text-center">{sample.al || 0}</td>
                              </tr>
                            );
                          }
                          return null;
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Electrode Status */}
              {lf.electrodeStatus && (
                <div className="card">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">وضعیت الکترودها</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['phase1', 'phase2', 'phase3'].map((phase, idx) => (
                      <div key={phase} className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium mb-3">فاز {idx + 1}</h5>
                        <div className="space-y-2">
                          {lf.electrodeStatus[phase]?.map((status: string, i: number) => (
                            <div key={i} className="text-sm text-gray-700">
                              ✓ {status}
                            </div>
                          ))}
                          {(!lf.electrodeStatus[phase] || lf.electrodeStatus[phase].length === 0) && (
                            <div className="text-sm text-gray-400">بدون وضعیت</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* String Status */}
              {lf.stringStatus && (
                <div className="card">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">وضعیت دمش‌ها</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded">
                      <p className="text-sm text-gray-500">Line 1</p>
                      <p className="font-bold">{lf.stringStatus.line1 || '-'}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded">
                      <p className="text-sm text-gray-500">Line 2</p>
                      <p className="font-bold">{lf.stringStatus.line2 || '-'}</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* CCM Data */}
          {ccm && (
            <>
              <div className="card border-l-4 border-l-purple-500">
                <h3 className="text-xl font-bold text-purple-600 mb-4">🏭 اطلاعات ریخته‌گری مداوم (CCM)</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">سرعت ریخته‌گری</p>
                    <p className="font-bold">{ccm.avgCastingSpeed || 0} m/min</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">پارگی خطوط</p>
                    <p className="font-bold text-red-600">{ccm.lineBreaks || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ذوب در سکوئنس</p>
                    <p className="font-bold">{ccm.sequenceHeats || 0}</p>
                  </div>
                </div>
              </div>
            </>
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
