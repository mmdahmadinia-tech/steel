import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useData } from '../contexts/DataContext';
import { dashboardStats, productionChartData, energyChartData, shiftComparisonData } from '../data/mockData';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function DashboardPage() {
  const { heats } = useData();

  const statusPieData = [
    { name: 'تکمیل‌شده', value: heats.filter(h => h.eafStatus === 'completed' && h.lfStatus === 'completed' && h.ccmStatus === 'completed').length },
    { name: 'در حال تکمیل', value: heats.filter(h => h.eafStatus === 'in_progress' || h.lfStatus === 'in_progress' || h.ccmStatus === 'in_progress').length },
    { name: 'شروع‌نشده', value: heats.filter(h => h.eafStatus === 'not_started' && h.lfStatus === 'not_started' && h.ccmStatus === 'not_started').length },
  ];

  const recentHeats = heats.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="تعداد ذوب‌ها"
          value={dashboardStats.totalHeats.toString()}
          subtitle="در بازه انتخابی"
          icon="🔥"
          color="blue"
        />
        <StatCard
          title="تولید کل"
          value={`${dashboardStats.totalProduction} تن`}
          subtitle="مجموع وزن تخلیه"
          icon="⚖️"
          color="green"
        />
        <StatCard
          title="مصرف انرژی میانگین"
          value={`${dashboardStats.avgEnergyConsumption} kWh/t`}
          subtitle="میانگین مصرف ویژه"
          icon="⚡"
          color="yellow"
        />
        <StatCard
          title="توقفات"
          value={`${dashboardStats.totalStoppageMinutes} دقیقه`}
          subtitle={`${dashboardStats.totalStoppages} مورد توقف`}
          icon="⏸️"
          color="red"
        />
      </div>

      {/* Completion Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <CompletionCard title="EAF — کوره قوس الکتریکی" percentage={dashboardStats.eafCompletionRate} color="blue" />
        <CompletionCard title="LF — کوره پاتیلی" percentage={dashboardStats.lfCompletionRate} color="green" />
        <CompletionCard title="CCM — ریخته‌گری مداوم" percentage={dashboardStats.ccmCompletionRate} color="purple" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production Chart */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📊 نمودار تولید هفتگی</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={productionChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="production" name="تولید (تن)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" name="هدف (تن)" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Energy Chart */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">⚡ روند مصرف انرژی</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={energyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="consumption" name="مصرف (kWh/t)" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shift Comparison */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🔄 مقایسه شیفت‌ها</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={shiftComparisonData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={60} />
              <Tooltip />
              <Legend />
              <Bar dataKey="eaf" name="EAF" fill="#3b82f6" />
              <Bar dataKey="lf" name="LF" fill="#10b981" />
              <Bar dataKey="ccm" name="CCM" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Pie */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📋 وضعیت ذوب‌ها</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusPieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusPieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Heats */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🕐 آخرین ذوب‌ها</h3>
          <div className="space-y-3">
            {recentHeats.map(heat => (
              <Link
                key={heat.id}
                to={`/heats/${heat.id}`}
                className="flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <div>
                  <p className="font-bold text-sm text-gray-800">ذوب {heat.heatId}</p>
                  <p className="text-xs text-gray-500">{heat.date} — شیفت {heat.shift}</p>
                </div>
                <div className="flex gap-1">
                  <StatusDot status={heat.eafStatus} label="EAF" />
                  <StatusDot status={heat.lfStatus} label="LF" />
                  <StatusDot status={heat.ccmStatus} label="CCM" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Warnings */}
      {heats.some(h => h.warnings.length > 0) && (
        <div className="card border-r-4 border-r-amber-500">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>⚠️</span>
            <span>هشدارها و ناسازگاری‌ها</span>
          </h3>
          <div className="space-y-2">
            {heats.filter(h => h.warnings.length > 0).map(heat => (
              <div key={heat.id} className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                <span className="text-amber-500">⚠️</span>
                <div>
                  <span className="font-medium text-sm text-gray-800">ذوب {heat.heatId}:</span>
                  <span className="text-sm text-gray-600 mr-2">{heat.warnings.join('، ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, color }: { title: string; value: string; subtitle: string; icon: string; color: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-amber-500 to-amber-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <div className="card relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-l ${colorClasses[color]}`}></div>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}

function CompletionCard({ title, percentage, color }: { title: string; percentage: number; color: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="card">
      <h4 className="text-sm font-medium text-gray-700 mb-3">{title}</h4>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${colorClasses[color]} transition-all duration-500`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
        <span className="text-lg font-bold text-gray-800">{percentage}%</span>
      </div>
      <p className="text-xs text-gray-500 mt-2">نرخ تکمیل اطلاعات</p>
    </div>
  );
}

function StatusDot({ status, label }: { status: string; label: string }) {
  const colors: Record<string, string> = {
    completed: 'bg-green-500',
    in_progress: 'bg-amber-500',
    not_started: 'bg-gray-300',
    needs_review: 'bg-red-500',
  };

  return (
    <div className="flex flex-col items-center" title={`${label}: ${status}`}>
      <div className={`w-3 h-3 rounded-full ${colors[status] || 'bg-gray-300'}`}></div>
      <span className="text-[10px] text-gray-400 mt-0.5">{label}</span>
    </div>
  );
}
