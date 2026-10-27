import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';

export default function CCMPage() {
  const { heats } = useData();
  const [selectedHeat, setSelectedHeat] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'general', label: 'اطلاعات عمومی' },
    { id: 'lines', label: 'خطوط ریخته‌گری' },
    { id: 'temperatures', label: 'دماها' },
    { id: 'times', label: 'زمان‌های اصلی' },
    { id: 'moldLife', label: 'عمر تیوب قالب' },
    { id: 'breakReport', label: 'شکست خط' },
    { id: 'moldChange', label: 'تعویض قالب' },
    { id: 'ladleReport', label: 'گزارش پاتیل' },
    { id: 'tundish', label: 'گزارش تاندیش' },
    { id: 'returnHeat', label: 'ذوب برگشتی' },
    { id: 'quality', label: 'کنترل کیفیت' },
    { id: 'stoppages', label: 'توقفات' },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-l from-purple-600 to-purple-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>🏭</span>
              <span>Continuous Casting Machine — ریخته‌گری مداوم</span>
            </h2>
            <p className="text-purple-100 text-sm mt-1">ثبت و مدیریت اطلاعات فرایندی ریخته‌گری مداوم</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedHeat}
              onChange={(e) => setSelectedHeat(e.target.value)}
              className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="" className="text-gray-800">انتخاب ذوب...</option>
              {heats.map(h => (
                <option key={h.id} value={h.heatId} className="text-gray-800">{h.heatId} — {h.date}</option>
              ))}
            </select>
            <button onClick={handleSave} className="bg-white text-purple-700 font-medium px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors text-sm">
              💾 ذخیره
            </button>
          </div>
        </div>
        {saved && (
          <div className="mt-3 bg-purple-400/20 border border-purple-300/30 rounded-lg p-2 text-sm text-purple-100">
            ✅ اطلاعات با موفقیت ذخیره شد
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="card p-0 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'general' && <GeneralTab />}
          {activeTab === 'lines' && <LinesTab />}
          {activeTab === 'temperatures' && <TemperaturesTab />}
          {activeTab === 'times' && <TimesTab />}
          {activeTab === 'moldLife' && <MoldLifeTab />}
          {activeTab === 'breakReport' && <BreakReportTab />}
          {activeTab === 'moldChange' && <MoldChangeTab />}
          {activeTab === 'ladleReport' && <LadleReportTab />}
          {activeTab === 'tundish' && <TundishTab />}
          {activeTab === 'returnHeat' && <ReturnHeatTab />}
          {activeTab === 'quality' && <QualityTab />}
          {activeTab === 'stoppages' && <StoppagesTab />}
        </div>
      </div>
    </div>
  );
}

function GeneralTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label className="label-field">Date — تاریخ</label>
        <input type="text" className="input-field" defaultValue="1403/09/15" />
      </div>
      <div>
        <label className="label-field">Shift — شیفت</label>
        <select className="input-field" defaultValue="A">
          <option value="A">شیفت A</option>
          <option value="B">شیفت B</option>
          <option value="C">شیفت C</option>
        </select>
      </div>
      <div>
        <label className="label-field">Heat ID — شماره ذوب</label>
        <input type="text" className="input-field" defaultValue="1250" />
      </div>
      <div>
        <label className="label-field">Steel Grade — گرید فولاد</label>
        <select className="input-field" defaultValue="St37">
          <option>St37</option>
          <option>St44</option>
          <option>St52</option>
        </select>
      </div>
      <div>
        <label className="label-field">Oil Type — نوع روغن</label>
        <select className="input-field">
          <option>نوع A</option>
          <option>نوع B</option>
          <option>نوع C</option>
        </select>
      </div>
      <div>
        <label className="label-field">Ladle Shroud — بله/خیر</label>
        <select className="input-field" defaultValue="yes">
          <option value="yes">بله</option>
          <option value="no">خیر</option>
        </select>
      </div>
      <div>
        <label className="label-field">Average Casting Speed (m/min)</label>
        <input type="number" className="input-field" step="0.1" defaultValue="1.2" />
      </div>
      <div>
        <label className="label-field">Sequence Cut Reason</label>
        <input type="text" className="input-field" placeholder="علت قطع توالی" />
      </div>
    </div>
  );
}

function LinesTab() {
  return (
    <div>
      <h4 className="font-bold text-gray-700 mb-4">اطلاعات خطوط ریخته‌گری</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">خط</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">شروع (زمان)</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">حالت</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">سرعت (m/min)</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">شماره قالب</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">پایان (زمان)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-2 py-2 font-medium text-gray-700">خط {i + 1}</td>
                <td className="px-2 py-2"><input type="time" className="input-field w-24" /></td>
                <td className="px-2 py-2">
                  <select className="input-field w-28">
                    <option value="">—</option>
                    <option>Automatic</option>
                    <option>Manual</option>
                  </select>
                </td>
                <td className="px-2 py-2"><input type="number" className="input-field w-20" step="0.1" /></td>
                <td className="px-2 py-2"><input type="text" className="input-field w-20" /></td>
                <td className="px-2 py-2"><input type="time" className="input-field w-24" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TemperaturesTab() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-bold text-gray-700 mb-4">دمای مذاب</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-field">Requested Melt Temperature from LF (°C)</label>
            <input type="number" className="input-field" defaultValue="1580" />
          </div>
          <div>
            <label className="label-field">Sent Melt Temperature from LF (°C)</label>
            <input type="number" className="input-field" defaultValue="1575" />
          </div>
        </div>
      </div>
      <div>
        <h4 className="font-bold text-gray-700 mb-4">دمای مذاب تاندیش</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-medium text-gray-600 mb-3">قرائت {i}</h5>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-field">Time</label>
                  <input type="time" className="input-field" />
                </div>
                <div>
                  <label className="label-field">Temperature (°C)</label>
                  <input type="number" className="input-field" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TimesTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="label-field">Next Heat Request Time</label>
        <input type="time" className="input-field" />
      </div>
      <div>
        <label className="label-field">Casting Start Time — شروع ریخته‌گری خط اول</label>
        <input type="time" className="input-field" defaultValue="13:45" />
      </div>
      <div>
        <label className="label-field">Casting End Time — پایان ریخته‌گری خط آخر</label>
        <input type="time" className="input-field" defaultValue="15:30" />
      </div>
      <div>
        <label className="label-field">Heat Number in Sequence</label>
        <input type="number" className="input-field" defaultValue="3" />
      </div>
    </div>
  );
}

function MoldLifeTab() {
  return (
    <div>
      <h4 className="font-bold text-gray-700 mb-4">عمر تیوب قالب‌ها</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">قالب {i + 1}</p>
            <input type="number" className="input-field text-center w-full" placeholder="0" />
          </div>
        ))}
      </div>
    </div>
  );
}

function BreakReportTab() {
  return (
    <div>
      <h4 className="font-bold text-gray-700 mb-4">گزارش شکست خط</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label-field">Line Number</label>
          <select className="input-field">
            <option value="">انتخاب خط</option>
            {[1, 2, 3, 4, 5, 6].map(i => <option key={i} value={i}>خط {i}</option>)}
          </select>
        </div>
        <div>
          <label className="label-field">Break Time</label>
          <input type="time" className="input-field" />
        </div>
        <div>
          <label className="label-field">Cause — علت</label>
          <select className="input-field">
            <option value="">انتخاب علت</option>
            <option>شکست رشته</option>
            <option>گیر کردن مذاب</option>
            <option>مشکل قالب</option>
            <option>سایر</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function MoldChangeTab() {
  return (
    <div>
      <h4 className="font-bold text-gray-700 mb-4">تعویض قالب</h4>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="label-field">Line Number</label>
          <select className="input-field">
            <option value="">انتخاب خط</option>
            {[1, 2, 3, 4, 5, 6].map(i => <option key={i} value={i}>خط {i}</option>)}
          </select>
        </div>
        <div>
          <label className="label-field">Mold Number</label>
          <input type="text" className="input-field" placeholder="شماره قالب" />
        </div>
        <div>
          <label className="label-field">Number of Heats</label>
          <input type="number" className="input-field" placeholder="تعداد ذوب" />
        </div>
        <div>
          <label className="label-field">Cause — علت</label>
          <select className="input-field">
            <option value="">انتخاب علت</option>
            <option>پایان عمر</option>
            <option>آسیب</option>
            <option>تعویض برنامه‌ای</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function LadleReportTab() {
  return (
    <div>
      <h4 className="font-bold text-gray-700 mb-4">گزارش پاتیل</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="label-field">Ladle Number</label>
          <input type="text" className="input-field" defaultValue="L-12" />
        </div>
        <div>
          <label className="label-field">Time Placed on Ladle Turret</label>
          <input type="time" className="input-field" defaultValue="13:35" />
        </div>
        <div>
          <label className="label-field">Delivered Melt Weight (Ton)</label>
          <input type="number" className="input-field" step="0.1" defaultValue="85.5" />
        </div>
        <div>
          <label className="label-field">Slide Gate Opening Time</label>
          <input type="time" className="input-field" defaultValue="13:40" />
        </div>
        <div>
          <label className="label-field">Number of Oxygen Lances</label>
          <input type="number" className="input-field" defaultValue="2" />
        </div>
        <div>
          <label className="label-field">Returned Melt Weight (Ton)</label>
          <input type="number" className="input-field" step="0.1" defaultValue="2.3" />
        </div>
      </div>
    </div>
  );
}

function TundishTab() {
  return (
    <div>
      <h4 className="font-bold text-gray-700 mb-4">گزارش تاندیش</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="label-field">Tundish Car Number</label>
          <input type="text" className="input-field" defaultValue="TC-2" />
        </div>
        <div>
          <label className="label-field">Tundish Number</label>
          <input type="text" className="input-field" defaultValue="TD-5" />
        </div>
        <div>
          <label className="label-field">Sequential Heats Cast</label>
          <input type="number" className="input-field" defaultValue="4" />
        </div>
        <div>
          <label className="label-field">Residual Melt Weight (Ton)</label>
          <input type="number" className="input-field" step="0.1" defaultValue="1.5" />
        </div>
      </div>
    </div>
  );
}

function ReturnHeatTab() {
  return (
    <div>
      <h4 className="font-bold text-gray-700 mb-4">ذوب برگشتی</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label-field">Return Time</label>
          <input type="time" className="input-field" />
        </div>
        <div>
          <label className="label-field">Cause — علت برگشت</label>
          <select className="input-field">
            <option value="">انتخاب علت</option>
            <option>عدم انطباق آنالیز</option>
            <option>دمای نامناسب</option>
            <option>مشکل کیفیت</option>
            <option>سایر</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function QualityTab() {
  return (
    <div>
      <h4 className="font-bold text-gray-700 mb-4">گزارش کنترل کیفیت</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">ردیف</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Line</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Time</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Reporter</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Defect</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Corrective Action</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[1, 2, 3].map(i => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-2 py-2 text-gray-500">{i}</td>
                <td className="px-2 py-2">
                  <select className="input-field w-16">
                    <option>—</option>
                    {[1, 2, 3, 4, 5, 6].map(l => <option key={l}>{l}</option>)}
                  </select>
                </td>
                <td className="px-2 py-2"><input type="time" className="input-field w-24" /></td>
                <td className="px-2 py-2"><input type="text" className="input-field w-28" /></td>
                <td className="px-2 py-2"><input type="text" className="input-field w-36" placeholder="عیب گزارش‌شده" /></td>
                <td className="px-2 py-2"><input type="text" className="input-field w-36" placeholder="اقدام اصلاحی" /></td>
                <td className="px-2 py-2">
                  <select className="input-field w-24">
                    <option>—</option>
                    <option>موفق</option>
                    <option>ناموفق</option>
                    <option>در حال بررسی</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StoppagesTab() {
  return (
    <div>
      <h4 className="font-bold text-gray-700 mb-4">توقفات CCM</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">ردیف</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Start</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">End</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Duration (min)</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Responsible Unit</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[1, 2].map(i => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-500">{i}</td>
                <td className="px-3 py-2"><input type="time" className="input-field w-28" /></td>
                <td className="px-3 py-2"><input type="time" className="input-field w-28" /></td>
                <td className="px-3 py-2"><input type="number" className="input-field w-20" /></td>
                <td className="px-3 py-2">
                  <select className="input-field w-32">
                    <option>—</option>
                    <option>مکانیک</option>
                    <option>برق</option>
                    <option>بهره‌برداری</option>
                    <option>ریخته‌گری</option>
                  </select>
                </td>
                <td className="px-3 py-2"><input type="text" className="input-field w-48" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
