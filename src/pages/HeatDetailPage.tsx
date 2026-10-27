import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

export default function HeatDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { heats } = useData();
  const heat = heats.find(h => h.id === id);

  if (!heat) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500 text-lg">ذوب مورد نظر یافت نشد</p>
        <Link to="/heats" className="btn-primary mt-4 inline-block">بازگشت</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/heats" className="hover:text-blue-600">فهرست ذوب‌ها</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">ذوب {heat.heatId}</span>
      </div>

      <div className="card">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">ذوب {heat.heatId}</h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>📅 {heat.date}</span>
              <span>🔄 شیفت {heat.shift}</span>
              <span>🏷️ {heat.steelGrade}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`card border ${heat.eafStatus === 'completed' ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="font-bold text-gray-800">EAF</p>
              <p className={`text-sm ${heat.eafStatus === 'completed' ? 'text-green-700' : 'text-gray-500'}`}>
                {heat.eafStatus === 'completed' ? 'تکمیل‌شده' : heat.eafStatus === 'in_progress' ? 'در حال' : 'شروع‌نشده'}
              </p>
            </div>
          </div>
        </div>
        <div className={`card border ${heat.lfStatus === 'completed' ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔧</span>
            <div>
              <p className="font-bold text-gray-800">LF</p>
              <p className={`text-sm ${heat.lfStatus === 'completed' ? 'text-green-700' : 'text-gray-500'}`}>
                {heat.lfStatus === 'completed' ? 'تکمیل‌شده' : heat.lfStatus === 'in_progress' ? 'در حال' : 'شروع‌نشده'}
              </p>
            </div>
          </div>
        </div>
        <div className={`card border ${heat.ccmStatus === 'completed' ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏭</span>
            <div>
              <p className="font-bold text-gray-800">CCM</p>
              <p className={`text-sm ${heat.ccmStatus === 'completed' ? 'text-green-700' : 'text-gray-500'}`}>
                {heat.ccmStatus === 'completed' ? 'تکمیل‌شده' : heat.ccmStatus === 'in_progress' ? 'در حال' : 'شروع‌نشده'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* EAF Data */}
      {heat.eafData && (
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">⚡ اطلاعات EAF</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><p className="text-sm text-gray-500">تاریخ</p><p className="font-bold">{heat.date}</p></div>
            <div><p className="text-sm text-gray-500">شیفت</p><p className="font-bold">{heat.shift}</p></div>
            <div><p className="text-sm text-gray-500">گرید</p><p className="font-bold">{heat.steelGrade}</p></div>
            <div><p className="text-sm text-gray-500">وزن تخلیه</p><p className="font-bold">{heat.eafData.tappingWeight || '-'} تن</p></div>
            <div><p className="text-sm text-gray-500">Power On</p><p className="font-bold">{heat.eafData.powerOn || '-'} دقیقه</p></div>
            <div><p className="text-sm text-gray-500">Power Off</p><p className="font-bold">{heat.eafData.powerOff || '-'} دقیقه</p></div>
            <div><p className="text-sm text-gray-500">TAP TO TAP</p><p className="font-bold">{heat.eafData.tapToTap || '-'} دقیقه</p></div>
            <div><p className="text-sm text-gray-500">En.Cou</p><p className="font-bold">{heat.eafData.enCou || '-'} MWh</p></div>
          </div>
          {heat.eafData.materials && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-bold text-gray-700 mb-2">مواد مصرفی</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>FeMn: {heat.eafData.materials.feMn || 0} Kg</div>
                <div>FeSiMn: {heat.eafData.materials.feSiMn || 0} Kg</div>
                <div>FeSi: {heat.eafData.materials.feSi || 0} Kg</div>
                <div>Lime: {heat.eafData.materials.lime || 0} Kg</div>
                <div>Carbon: {heat.eafData.materials.carbon || 0} Kg</div>
                <div>CPC Injection: {heat.eafData.materials.cpcInjection || 0} Kg</div>
                <div>Oxygen: {heat.eafData.materials.oxygen || 0} Nm³</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* LF Data */}
      {heat.lfData && (
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🔧 اطلاعات LF</h3>
          {heat.lfData.additives && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>FeMn: {heat.lfData.additives.feMn || 0} Kg</div>
              <div>FeSiMn: {heat.lfData.additives.feSiMn || 0} Kg</div>
              <div>FeSi: {heat.lfData.additives.feSi || 0} Kg</div>
              <div>Lime: {heat.lfData.additives.lime || 0} Kg</div>
              <div>Graphite: {heat.lfData.additives.graphite || 0} Kg</div>
              <div>CaC2: {heat.lfData.additives.caC2 || 0} Kg</div>
              <div>Ca.Al: {heat.lfData.additives.caAl || 0} Kg</div>
            </div>
          )}
        </div>
      )}

      {/* CCM Data */}
      {heat.ccmData && (
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🏭 اطلاعات CCM</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><p className="text-sm text-gray-500">سرعت ریخته‌گری</p><p className="font-bold">{heat.ccmData.avgCastingSpeed || '-'} m/min</p></div>
            <div><p className="text-sm text-gray-500">پارگی خطوط</p><p className="font-bold">{heat.ccmData.lineBreaks || 0}</p></div>
            <div><p className="text-sm text-gray-500">ذوب در سکوئنس</p><p className="font-bold">{heat.ccmData.sequenceHeats || '-'}</p></div>
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4">🔗 مسیر تولید</h3>
        <div className="flex items-center justify-center gap-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold ${heat.eafStatus === 'completed' ? 'bg-green-500' : heat.eafStatus === 'in_progress' ? 'bg-amber-500' : 'bg-gray-300'}`}>EAF</div>
          <div className="w-12 h-1 bg-gray-300"></div>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold ${heat.lfStatus === 'completed' ? 'bg-green-500' : heat.lfStatus === 'in_progress' ? 'bg-amber-500' : 'bg-gray-300'}`}>LF</div>
          <div className="w-12 h-1 bg-gray-300"></div>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold ${heat.ccmStatus === 'completed' ? 'bg-green-500' : heat.ccmStatus === 'in_progress' ? 'bg-amber-500' : 'bg-gray-300'}`}>CCM</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/eaf" className="card hover:shadow-md text-center">
          <span className="text-4xl mb-3 block">⚡</span>
          <h4 className="font-bold">اطلاعات EAF</h4>
          <p className="text-sm text-gray-500 mt-1">مشاهده و ویرایش</p>
        </Link>
        <Link to="/lf" className="card hover:shadow-md text-center">
          <span className="text-4xl mb-3 block">🔧</span>
          <h4 className="font-bold">اطلاعات LF</h4>
          <p className="text-sm text-gray-500 mt-1">مشاهده و ویرایش</p>
        </Link>
        <Link to="/ccm" className="card hover:shadow-md text-center">
          <span className="text-4xl mb-3 block">🏭</span>
          <h4 className="font-bold">اطلاعات CCM</h4>
          <p className="text-sm text-gray-500 mt-1">مشاهده و ویرایش</p>
        </Link>
      </div>
    </div>
  );
}
