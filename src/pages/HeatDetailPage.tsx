import React from 'react';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';

export default function HeatDetailPage() {
  const { heats } = useData();
  const [id] = React.useState(window.location.hash.split('/').pop());
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
