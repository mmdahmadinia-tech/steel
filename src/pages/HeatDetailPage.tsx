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
        <Link to="/heats" className="btn-primary mt-4 inline-block">بازگشت به فهرست</Link>
      </div>
    );
  }

  const relatedHeats = heats.filter(h => h.parentHeatId === heat.heatId || h.heatId === heat.parentHeatId);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/heats" className="hover:text-blue-600">فهرست ذوب‌ها</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">ذوب {heat.heatId}</span>
      </div>

      {/* Header */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">ذوب {heat.heatId}</h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>📅 {heat.date}</span>
              <span>🔄 شیفت {heat.shift}</span>
              <span>🏷️ {heat.steelGrade}</span>
              {heat.isSubHeat && <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs">ذوب فرعی</span>}
            </div>
          </div>
          <div className="text-left text-xs text-gray-400">
            <p>ایجاد: {heat.createdAt}</p>
            <p>آخرین ویرایش: {heat.updatedAt}</p>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UnitStatusCard unit="EAF" status={heat.eafStatus} title="کوره قوس الکتریکی" icon="⚡" />
        <UnitStatusCard unit="LF" status={heat.lfStatus} title="کوره پاتیلی" icon="🔧" />
        <UnitStatusCard unit="CCM" status={heat.ccmStatus} title="ریخته‌گری مداوم" icon="🏭" />
      </div>

      {/* Warnings */}
      {heat.warnings.length > 0 && (
        <div className="card border-r-4 border-r-amber-500 bg-amber-50">
          <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
            <span>⚠️</span>
            <span>هشدارهای ناسازگاری</span>
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {heat.warnings.map((w, i) => (
              <li key={i} className="text-sm text-amber-700">{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Process Flow */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4">🔗 مسیر تولید ذوب</h3>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <ProcessStep label="EAF" status={heat.eafStatus} active={true} />
          <div className="w-8 h-0.5 bg-gray-300"></div>
          <ProcessStep label="LF" status={heat.lfStatus} active={true} />
          <div className="w-8 h-0.5 bg-gray-300"></div>
          <ProcessStep label="CCM" status={heat.ccmStatus} active={true} />
        </div>
      </div>

      {/* Related Heats */}
      {relatedHeats.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🔗 ذوب‌های مرتبط</h3>
          <div className="space-y-2">
            {relatedHeats.map(rh => (
              <Link
                key={rh.id}
                to={`/heats/${rh.id}`}
                className="flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-blue-600">{rh.heatId}</span>
                  <span className="text-sm text-gray-500">{rh.isSubHeat ? 'ذوب فرعی' : 'ذوب اصلی'}</span>
                </div>
                <div className="flex gap-2">
                  <StatusDot status={rh.eafStatus} />
                  <StatusDot status={rh.lfStatus} />
                  <StatusDot status={rh.ccmStatus} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Data Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/eaf" className="card hover:shadow-md transition-shadow text-center">
          <span className="text-4xl mb-3 block">⚡</span>
          <h4 className="font-bold text-gray-800">اطلاعات EAF</h4>
          <p className="text-sm text-gray-500 mt-1">مشاهده و ویرایش اطلاعات کوره قوس الکتریکی</p>
          <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
            heat.eafStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {heat.eafStatus === 'completed' ? 'تکمیل‌شده' : heat.eafStatus === 'in_progress' ? 'در حال تکمیل' : 'شروع‌نشده'}
          </span>
        </Link>
        <Link to="/lf" className="card hover:shadow-md transition-shadow text-center">
          <span className="text-4xl mb-3 block">🔧</span>
          <h4 className="font-bold text-gray-800">اطلاعات LF</h4>
          <p className="text-sm text-gray-500 mt-1">مشاهده و ویرایش اطلاعات کوره پاتیلی</p>
          <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
            heat.lfStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {heat.lfStatus === 'completed' ? 'تکمیل‌شده' : heat.lfStatus === 'in_progress' ? 'در حال تکمیل' : 'شروع‌نشده'}
          </span>
        </Link>
        <Link to="/ccm" className="card hover:shadow-md transition-shadow text-center">
          <span className="text-4xl mb-3 block">🏭</span>
          <h4 className="font-bold text-gray-800">اطلاعات CCM</h4>
          <p className="text-sm text-gray-500 mt-1">مشاهده و ویرایش اطلاعات ریخته‌گری مداوم</p>
          <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
            heat.ccmStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {heat.ccmStatus === 'completed' ? 'تکمیل‌شده' : heat.ccmStatus === 'in_progress' ? 'در حال تکمیل' : 'شروع‌نشده'}
          </span>
        </Link>
      </div>

      {/* Audit Trail for this Heat */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📋 سوابق تغییرات این ذوب</h3>
        <div className="space-y-3">
          {[
            { time: '1403/09/15 08:30', user: 'احمد رضایی', action: 'ایجاد رکورد EAF' },
            { time: '1403/09/15 10:15', user: 'محمد حسینی', action: 'ایجاد رکورد LF' },
            { time: '1403/09/15 12:00', user: 'علی محمدی', action: 'ایجاد رکورد CCM' },
            { time: '1403/09/15 14:45', user: 'رضا کریمی', action: 'تأیید اطلاعات ذوب' },
          ].map((log, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-500 w-32">{log.time}</span>
              <span className="text-sm font-medium text-gray-700">{log.user}</span>
              <span className="text-sm text-gray-500">{log.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UnitStatusCard({ unit, status, title, icon }: { unit: string; status: string; title: string; icon: string }) {
  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    completed: { bg: 'bg-green-50 border-green-200', text: 'text-green-700', label: 'تکمیل‌شده' },
    in_progress: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', label: 'در حال تکمیل' },
    not_started: { bg: 'bg-gray-50 border-gray-200', text: 'text-gray-500', label: 'شروع‌نشده' },
    needs_review: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', label: 'نیازمند بررسی' },
  };
  const c = statusConfig[status] || statusConfig.not_started;

  return (
    <div className={`card border ${c.bg}`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="font-bold text-gray-800">{unit} — {title}</p>
          <p className={`text-sm ${c.text}`}>{c.label}</p>
        </div>
      </div>
    </div>
  );
}

function ProcessStep({ label, status, active }: { label: string; status: string; active: boolean }) {
  const colors: Record<string, string> = {
    completed: 'bg-green-500',
    in_progress: 'bg-amber-500 animate-pulse',
    not_started: 'bg-gray-300',
    needs_review: 'bg-red-500',
  };

  return (
    <div className={`flex flex-col items-center ${active ? '' : 'opacity-50'}`}>
      <div className={`w-12 h-12 rounded-full ${colors[status]} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
        {label}
      </div>
      <span className="text-xs text-gray-500 mt-1">
        {status === 'completed' ? '✓' : status === 'in_progress' ? '...' : '○'}
      </span>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    completed: 'bg-green-500',
    in_progress: 'bg-amber-500',
    not_started: 'bg-gray-300',
    needs_review: 'bg-red-500',
  };
  return <div className={`w-3 h-3 rounded-full ${colors[status] || 'bg-gray-300'}`}></div>;
}
