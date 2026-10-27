import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';

export default function LFPage() {
  const { heats } = useData();
  const [selectedHeat, setSelectedHeat] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'general', label: 'اطلاعات عمومی' },
    { id: 'ladle', label: 'وضعیت پاتیل' },
    { id: 'input', label: 'شرایط ورود مذاب' },
    { id: 'electrode', label: 'الکترودها' },
    { id: 'stoppages', label: 'توقفات' },
    { id: 'process', label: 'داده‌های فرایندی' },
    { id: 'additives', label: 'مواد افزودنی' },
    { id: 'strings', label: 'وضعیت رشته‌ها' },
    { id: 'analysis', label: 'آنالیز شیمیایی' },
    { id: 'argon', label: 'آرگون و پروب' },
    { id: 'delivery', label: 'تحویل به CCM' },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-l from-green-600 to-green-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>🔧</span>
              <span>Ladle Furnace — کوره پاتیلی</span>
            </h2>
            <p className="text-green-100 text-sm mt-1">ثبت و مدیریت اطلاعات فرایندی کوره پاتیلی</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedHeat}
              onChange={(e) => setSelectedHeat(e.target.value)}
              className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="" className="text-gray-800">انتخاب ذوب...</option>
              {heats.filter(h => !h.isSubHeat).map(h => (
                <option key={h.id} value={h.heatId} className="text-gray-800">{h.heatId} — {h.date}</option>
              ))}
            </select>
            <button onClick={handleSave} className="bg-white text-green-700 font-medium px-4 py-2 rounded-lg hover:bg-green-50 transition-colors text-sm">
              💾 ذخیره
            </button>
          </div>
        </div>
        {saved && (
          <div className="mt-3 bg-green-400/20 border border-green-300/30 rounded-lg p-2 text-sm text-green-100">
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
                  ? 'bg-white text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'general' && <GeneralTab />}
          {activeTab === 'ladle' && <LadleStatusTab />}
          {activeTab === 'input' && <InputConditionTab />}
          {activeTab === 'electrode' && <ElectrodeTab />}
          {activeTab === 'stoppages' && <StoppagesTab />}
          {activeTab === 'process' && <ProcessDataTab />}
          {activeTab === 'additives' && <AdditivesTab />}
          {activeTab === 'strings' && <StringsTab />}
          {activeTab === 'analysis' && <AnalysisTab />}
          {activeTab === 'argon' && <ArgonTab />}
          {activeTab === 'delivery' && <DeliveryTab />}
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
    </div>
  );
}

function LadleStatusTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <div>
        <label className="label-field">Ladle Number</label>
        <input type="text" className="input-field" defaultValue="L-12" />
      </div>
      <div>
        <label className="label-field">Change Ladle</label>
        <select className="input-field">
          <option value="no">خیر</option>
          <option value="yes">بله</option>
        </select>
      </div>
      <div>
        <label className="label-field">Slag Line Life</label>
        <input type="number" className="input-field" defaultValue="45" />
      </div>
      <div>
        <label className="label-field">Ladle Life</label>
        <input type="number" className="input-field" defaultValue="120" />
      </div>
      <div>
        <label className="label-field">Transfercar Number</label>
        <input type="text" className="input-field" defaultValue="TC-3" />
      </div>
    </div>
  );
}

function InputConditionTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <div>
        <label className="label-field">Input Time</label>
        <input type="time" className="input-field" defaultValue="12:00" />
      </div>
      <div>
        <label className="label-field">Input Temperature (°C)</label>
        <input type="number" className="input-field" defaultValue="1620" />
      </div>
      <div>
        <label className="label-field">PPM (O₂)</label>
        <input type="number" className="input-field" defaultValue="450" />
      </div>
      <div>
        <label className="label-field">Slag Thickness (mm)</label>
        <input type="number" className="input-field" defaultValue="80" />
      </div>
      <div>
        <label className="label-field">Free Board (mm)</label>
        <input type="number" className="input-field" defaultValue="250" />
      </div>
    </div>
  );
}

function ElectrodeTab() {
  const phases = ['فاز ۱', 'فاز ۲', 'فاز ۳'];
  const statuses = ['Adjusting — تنظیم', 'Changing — تعویض', 'Breaking — شکستگی'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {phases.map(phase => (
        <div key={phase} className="border border-gray-200 rounded-lg p-4">
          <h5 className="font-medium text-gray-800 mb-3">{phase}</h5>
          <div className="space-y-2">
            {statuses.map(s => (
              <label key={s} className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-gray-300" />
                <span>{s}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function StoppagesTab() {
  return (
    <div>
      <h4 className="font-bold text-gray-700 mb-4">توقفات LF</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">ردیف</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">From</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Till</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Minute</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Working Group</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[1, 2, 3].map(i => (
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

function ProcessDataTab() {
  return (
    <div>
      <h4 className="font-bold text-gray-700 mb-4">جدول داده‌های فرایندی</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">ردیف</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Time</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Temp (°C)</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">PPM</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">En. Cou.</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Tap</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">P.on</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Array.from({ length: 9 }).map((_, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-2 py-2 text-gray-500">{i + 1}</td>
                <td className="px-2 py-2"><input type="time" className="input-field w-24" /></td>
                <td className="px-2 py-2"><input type="number" className="input-field w-20" /></td>
                <td className="px-2 py-2"><input type="number" className="input-field w-20" /></td>
                <td className="px-2 py-2"><input type="number" className="input-field w-20" step="0.1" /></td>
                <td className="px-2 py-2"><input type="number" className="input-field w-16" /></td>
                <td className="px-2 py-2"><input type="number" className="input-field w-16" /></td>
                <td className="px-2 py-2"><input type="text" className="input-field w-36" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdditivesTab() {
  const materials = [
    'FeMn', 'FeSiMn', 'FeSi', 'Lime', 'Isoterm', 'Graphite (CPC)',
    'CaC2', 'Ca.Al', 'Graphite Wire', 'Metallurgy Coke', 'CaSi Wire',
    'CaFe Wire', 'Boxite', 'Al Wire', 'Deoxidizer'
  ];

  return (
    <div>
      <h4 className="font-bold text-gray-700 mb-4">مواد افزودنی</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">ماده</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">مقدار ۱ (Kg)</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">مقدار ۲ (Kg)</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">مقدار ۳ (Kg)</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">مقدار ۴ (Kg)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {materials.map(m => (
              <tr key={m} className="hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-700">{m}</td>
                {[1, 2, 3, 4].map(i => (
                  <td key={i} className="px-3 py-2">
                    <input type="number" className="input-field w-24" placeholder="0" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-amber-600 mt-3">⚠️ معنای چهار بخش مقدار مصرف باید با کارخانه هماهنگ شود</p>
    </div>
  );
}

function StringsTab() {
  const conditions = ['Normal Condition', 'Weak String', 'No String'];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="border border-gray-200 rounded-lg p-4">
        <h5 className="font-medium text-gray-800 mb-3">Line 1</h5>
        <div className="space-y-2">
          {conditions.map(c => (
            <label key={c} className="flex items-center gap-2 text-sm">
              <input type="radio" name="line1" className="border-gray-300" defaultChecked={c === 'Normal Condition'} />
              <span>{c}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg p-4">
        <h5 className="font-medium text-gray-800 mb-3">Line 2</h5>
        <div className="space-y-2">
          {conditions.map(c => (
            <label key={c} className="flex items-center gap-2 text-sm">
              <input type="radio" name="line2" className="border-gray-300" defaultChecked={c === 'Normal Condition'} />
              <span>{c}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalysisTab() {
  const elements = ['C', 'Si', 'Mn', 'P', 'S', 'Al'];
  const samples = ['5th Sample', '4th Sample', '1st Sample', '2nd Sample', '3rd Sample'];

  return (
    <div>
      <h4 className="font-bold text-gray-700 mb-4">آنالیز شیمیایی</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">نمونه</th>
              {elements.map(e => (
                <th key={e} className="px-3 py-2 text-center text-xs font-medium text-gray-500">{e} (%)</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {samples.map(s => (
              <tr key={s} className="hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-700">{s}</td>
                {elements.map(e => (
                  <td key={e} className="px-3 py-2">
                    <input type="number" className="input-field w-20 mx-auto text-center" step="0.001" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ArgonTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 className="font-bold text-gray-700 mb-4">مصرف آرگون</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">Time String</label>
            <input type="time" className="input-field" />
          </div>
          <div>
            <label className="label-field">Argon Consumption (Nm³)</label>
            <input type="number" className="input-field" defaultValue="250" />
          </div>
        </div>
      </div>
      <div>
        <h4 className="font-bold text-gray-700 mb-4">مصرف پروب</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label-field">Thermocouple</label>
            <input type="number" className="input-field" defaultValue="4" />
          </div>
          <div>
            <label className="label-field">Sampler</label>
            <input type="number" className="input-field" defaultValue="3" />
          </div>
          <div>
            <label className="label-field">Oxy. Probe</label>
            <input type="number" className="input-field" defaultValue="5" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DeliveryTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 className="font-bold text-gray-700 mb-4">تحویل به CCM</h4>
        <div>
          <label className="label-field">Delivery Time to CCM</label>
          <input type="time" className="input-field" defaultValue="13:30" />
        </div>
        <p className="text-xs text-amber-600 mt-2">⚠️ این زمان با اطلاعات دریافت CCM مقایسه خواهد شد</p>
      </div>
      <div>
        <h4 className="font-bold text-gray-700 mb-4">Tap Lance</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">زمان ۱</label>
            <input type="time" className="input-field" />
          </div>
          <div>
            <label className="label-field">زمان ۲</label>
            <input type="time" className="input-field" />
          </div>
        </div>
      </div>
    </div>
  );
}
