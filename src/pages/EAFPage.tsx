import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';

export default function EAFPage() {
  const { heats } = useData();
  const [selectedHeat, setSelectedHeat] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'general', label: 'اطلاعات عمومی' },
    { id: 'refractory', label: 'وضعیت نسوز' },
    { id: 'preStoppages', label: 'توقفات قبل از شروع' },
    { id: 'samples', label: 'نمونه‌برداری' },
    { id: 'tapping', label: 'تخلیه' },
    { id: 'duringStoppages', label: 'توقفات حین کار' },
    { id: 'ladle', label: 'اطلاعات پاتیل' },
    { id: 'electrode', label: 'الکترودها' },
    { id: 'scrap', label: 'سبدهای قراضه' },
    { id: 'additives', label: 'افزودنی‌ها' },
    { id: 'analysis', label: 'آنالیز شیمیایی' },
    { id: 'consumables', label: 'مصرفی‌ها' },
    { id: 'times', label: 'زمان‌های کاری' },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-l from-blue-600 to-blue-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>⚡</span>
              <span>Electric Arc Furnace — کوره قوس الکتریکی</span>
            </h2>
            <p className="text-blue-100 text-sm mt-1">ثبت و مدیریت اطلاعات فرایندی کوره قوس الکتریکی</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedHeat}
              onChange={(e) => setSelectedHeat(e.target.value)}
              className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-sm text-white placeholder-white/60"
            >
              <option value="" className="text-gray-800">انتخاب ذوب...</option>
              {heats.filter(h => !h.isSubHeat).map(h => (
                <option key={h.id} value={h.heatId} className="text-gray-800">{h.heatId} — {h.date}</option>
              ))}
            </select>
            <button onClick={handleSave} className="bg-white text-blue-700 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm">
              💾 ذخیره اطلاعات
            </button>
          </div>
        </div>
        {saved && (
          <div className="mt-3 bg-green-500/20 border border-green-300/30 rounded-lg p-2 text-sm text-green-100">
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
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'general' && <GeneralTab />}
          {activeTab === 'refractory' && <RefractoryTab />}
          {activeTab === 'preStoppages' && <StoppagesTab title="توقفات قبل از شروع" rows={7} />}
          {activeTab === 'samples' && <SamplesTab />}
          {activeTab === 'tapping' && <TappingTab />}
          {activeTab === 'duringStoppages' && <StoppagesTab title="توقفات حین کار کوره" rows={7} />}
          {activeTab === 'ladle' && <LadleTab />}
          {activeTab === 'electrode' && <ElectrodeTab />}
          {activeTab === 'scrap' && <ScrapTab />}
          {activeTab === 'additives' && <AdditivesTab />}
          {activeTab === 'analysis' && <AnalysisTab />}
          {activeTab === 'consumables' && <ConsumablesTab />}
          {activeTab === 'times' && <TimesTab />}
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
        <input type="text" className="input-field" placeholder="1403/09/15" defaultValue="1403/09/15" />
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
        <input type="text" className="input-field" placeholder="شماره ذوب" defaultValue="1250" />
      </div>
      <div>
        <label className="label-field">Steel Grade — گرید فولاد</label>
        <select className="input-field" defaultValue="St37">
          <option value="St37">St37</option>
          <option value="St44">St44</option>
          <option value="St52">St52</option>
          <option value="StBl">StBl</option>
        </select>
      </div>
      <div>
        <label className="label-field">Time Start — زمان شروع</label>
        <input type="time" className="input-field" defaultValue="08:30" />
      </div>
      <div>
        <label className="label-field">Tapping End Time — زمان پایان تخلیه</label>
        <input type="time" className="input-field" defaultValue="11:45" />
      </div>
      <div>
        <label className="label-field">Tapping Weight — وزن تخلیه (Ton)</label>
        <input type="number" className="input-field" placeholder="تن" defaultValue="85" />
      </div>
      <div>
        <label className="label-field">PPM</label>
        <input type="number" className="input-field" placeholder="PPM" defaultValue="350" />
      </div>
      <div>
        <label className="label-field">C Output</label>
        <input type="number" className="input-field" placeholder="درصد" step="0.01" defaultValue="0.08" />
      </div>
      <div className="md:col-span-2 lg:col-span-4">
        <label className="label-field">Supervisor Notes — توضیحات سرپرست</label>
        <textarea className="input-field h-20 resize-none" placeholder="توضیحات تکمیلی..."></textarea>
      </div>
    </div>
  );
}

function RefractoryTab() {
  const conditions = ['خوب', 'متوسط', 'ضعیف', 'نیاز به تعویض'];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label className="label-field">Walls — دیواره‌ها</label>
        <select className="input-field" defaultValue="خوب">
          {conditions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="label-field">Center Piece — قطعه مرکزی</label>
        <select className="input-field" defaultValue="خوب">
          {conditions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="label-field">Bottom — کف</label>
        <select className="input-field" defaultValue="متوسط">
          {conditions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="label-field">Taphole — مجرای تخلیه</label>
        <select className="input-field" defaultValue="خوب">
          {conditions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
    </div>
  );
}

function StoppagesTab({ title, rows }: { title: string; rows: number }) {
  return (
    <div>
      <h4 className="font-bold text-gray-700 mb-4">{title}</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">ردیف</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">From — از</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Till — تا</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Minute — دقیقه</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Working Group</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                <td className="px-3 py-2"><input type="time" className="input-field w-28" /></td>
                <td className="px-3 py-2"><input type="time" className="input-field w-28" /></td>
                <td className="px-3 py-2"><input type="number" className="input-field w-20" placeholder="دقیقه" /></td>
                <td className="px-3 py-2">
                  <select className="input-field w-32">
                    <option value="">—</option>
                    <option>مکانیک</option>
                    <option>برق</option>
                    <option>بهره‌برداری</option>
                    <option>سایر</option>
                  </select>
                </td>
                <td className="px-3 py-2"><input type="text" className="input-field w-48" placeholder="شرح توقف" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SamplesTab() {
  return (
    <div>
      <h4 className="font-bold text-gray-700 mb-4">جدول نمونه‌برداری</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Time</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">En.Cou (MWh)</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Tap</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">DRI (Ton)</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Briquet (Ton)</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Dolomite (Kg)</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Lime MHU (Kg)</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Carbon MHU (Kg)</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">CPC MHU (Kg)</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">CPC Inj (Kg)</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">CH4 (Nm³)</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">O2 (Nm³)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[1, 2, 3].map(row => (
              <tr key={row} className="hover:bg-gray-50">
                <td className="px-2 py-2"><input type="time" className="input-field w-24" /></td>
                {Array.from({ length: 11 }).map((_, i) => (
                  <td key={i} className="px-2 py-2">
                    <input type="number" className="input-field w-20" step="0.1" placeholder="—" />
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

function TappingTab() {
  return (
    <div>
      <h4 className="font-bold text-gray-700 mb-4">اطلاعات تخلیه</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div>
          <label className="label-field">Time Tapping</label>
          <input type="time" className="input-field" defaultValue="11:30" />
        </div>
        <div>
          <label className="label-field">En. Cou (MWh)</label>
          <input type="number" className="input-field" step="0.1" defaultValue="42.5" />
        </div>
        <div>
          <label className="label-field">Tap</label>
          <input type="number" className="input-field" defaultValue="15" />
        </div>
        <div>
          <label className="label-field">DRI (Ton)</label>
          <input type="number" className="input-field" step="0.1" defaultValue="95" />
        </div>
        <div>
          <label className="label-field">Briquet (Ton)</label>
          <input type="number" className="input-field" step="0.1" defaultValue="5" />
        </div>
        <div>
          <label className="label-field">Dolomite (Kg)</label>
          <input type="number" className="input-field" defaultValue="1200" />
        </div>
        <div>
          <label className="label-field">Lime MHU (Kg)</label>
          <input type="number" className="input-field" defaultValue="2500" />
        </div>
        <div>
          <label className="label-field">Carbon MHU (Kg)</label>
          <input type="number" className="input-field" defaultValue="800" />
        </div>
        <div>
          <label className="label-field">CPC MHU (Kg)</label>
          <input type="number" className="input-field" defaultValue="400" />
        </div>
        <div>
          <label className="label-field">CPC Injection (Kg)</label>
          <input type="number" className="input-field" defaultValue="300" />
        </div>
        <div>
          <label className="label-field">CH4 (Nm³)</label>
          <input type="number" className="input-field" defaultValue="1500" />
        </div>
        <div>
          <label className="label-field">Oxygen (Nm³)</label>
          <input type="number" className="input-field" defaultValue="4500" />
        </div>
      </div>
    </div>
  );
}

function LadleTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <div>
        <label className="label-field">Ladle Number</label>
        <input type="text" className="input-field" defaultValue="L-12" />
      </div>
      <div>
        <label className="label-field">Request Time</label>
        <input type="time" className="input-field" defaultValue="10:45" />
      </div>
      <div>
        <label className="label-field">Delivery Time</label>
        <input type="time" className="input-field" defaultValue="11:00" />
      </div>
      <div>
        <label className="label-field">Slag Condition</label>
        <select className="input-field">
          <option>خوب</option>
          <option>متوسط</option>
          <option>ضعیف</option>
        </select>
      </div>
      <div>
        <label className="label-field">Wall Condition</label>
        <select className="input-field">
          <option>خوب</option>
          <option>متوسط</option>
          <option>ضعیف</option>
        </select>
      </div>
    </div>
  );
}

function ElectrodeTab() {
  const phases = [
    { name: 'Phase 1', label: 'فاز ۱' },
    { name: 'Phase 2', label: 'فاز ۲' },
    { name: 'Phase 3', label: 'فاز ۳' },
  ];
  const statuses = ['Adjusting — تنظیم', 'Changing — تعویض', 'Breaking — شکستگی'];

  return (
    <div className="space-y-4">
      <h4 className="font-bold text-gray-700">وضعیت الکترود</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {phases.map(phase => (
          <div key={phase.name} className="border border-gray-200 rounded-lg p-4">
            <h5 className="font-medium text-gray-800 mb-3">{phase.label}</h5>
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
    </div>
  );
}

function ScrapTab() {
  return (
    <div>
      <h4 className="font-bold text-gray-700 mb-4">سبدهای قراضه</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map(i => (
          <div key={i} className="border border-gray-200 rounded-lg p-4">
            <h5 className="font-medium text-gray-800 mb-3">سبد {i}</h5>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-field">Bucket Number</label>
                <input type="text" className="input-field" defaultValue={`B-${i}`} />
              </div>
              <div>
                <label className="label-field">Tonnage (Ton)</label>
                <input type="number" className="input-field" step="0.1" defaultValue={i === 1 ? '45' : '40'} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdditivesTab() {
  const additives = [
    { name: 'FeMn', unit: 'Kg' },
    { name: 'FeSiMn', unit: 'Kg' },
    { name: 'FeSi', unit: 'Kg' },
    { name: 'Lime', unit: 'Kg' },
    { name: 'Graphite (CPC)', unit: 'Kg' },
    { name: 'Ca.Al / Al-CaC2', unit: 'Kg' },
  ];

  return (
    <div>
      <h4 className="font-bold text-gray-700 mb-4">افزودنی‌های پاتیل</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {additives.map(a => (
          <div key={a.name}>
            <label className="label-field">{a.name} ({a.unit})</label>
            <input type="number" className="input-field" placeholder="0" defaultValue="0" />
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalysisTab() {
  const elements = ['C', 'Si', 'Mn', 'P', 'S'];
  const samples = ['1st Sample', '2nd Sample', '3rd Sample'];

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
            {samples.map((s, si) => (
              <tr key={s} className="hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-700">{s}</td>
                {elements.map((e, ei) => (
                  <td key={e} className="px-3 py-2">
                    <input
                      type="number"
                      className="input-field w-20 mx-auto text-center"
                      step="0.001"
                      defaultValue={si === 0 ? ['0.08', '0.25', '0.55', '0.02', '0.015'][ei] : ''}
                    />
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

function ConsumablesTab() {
  const items = [
    { name: 'Thermocouple', unit: 'عدد' },
    { name: 'Sampler', unit: 'عدد' },
    { name: 'Oxy. Probe', unit: 'عدد' },
    { name: 'Taphole Sand', unit: 'Kg' },
  ];

  return (
    <div>
      <h4 className="font-bold text-gray-700 mb-4">مصرف تجهیزات نمونه‌برداری و پروب</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.name}>
            <label className="label-field">{item.name} ({item.unit})</label>
            <input type="number" className="input-field" defaultValue="0" />
          </div>
        ))}
      </div>
    </div>
  );
}

function TimesTab() {
  return (
    <div>
      <h4 className="font-bold text-gray-700 mb-4">زمان‌های کاری</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label-field">Power On</label>
          <input type="time" className="input-field" defaultValue="08:30" />
        </div>
        <div>
          <label className="label-field">Power Off</label>
          <input type="time" className="input-field" defaultValue="11:30" />
        </div>
        <div>
          <label className="label-field">Tap to Tap (دقیقه)</label>
          <input type="number" className="input-field" placeholder="محاسبه خودکار" defaultValue="75" />
          <p className="text-xs text-gray-400 mt-1">⚠️ فرمول باید توسط کارخانه تأیید شود</p>
        </div>
      </div>
    </div>
  );
}
