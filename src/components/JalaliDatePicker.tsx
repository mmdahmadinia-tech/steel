import { useState, useEffect, useRef } from 'react';

// Jalali calendar functions
function div(a: number, b: number) { return ~~(a / b); }
function mod(a: number, b: number) { return a - ~~(a / b) * b; }

function jalCal(jy: number) {
  const breaks = [-61,9,38,199,426,686,756,818,1111,1181,1210,1635,2060,2097,2192,2262,2324,2394,2456,3178];
  const bl = breaks.length;
  let gy = jy + 621, leapJ = -14, jp = breaks[0], jump = 0;
  for (let i = 1; i < bl; i++) {
    const jm = breaks[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }
  const n = jy - jp;
  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && (jump - n) === 4) leapJ += 1;
  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;
  return { leap: mod(mod(n + 1, 33) - 1, 4), gy, march };
}

function g2d(gy: number, gm: number, gd: number) {
  let d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4) + div(153 * mod(gm + 9, 12) + 2, 5) + gd - 34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

function d2g(jdn: number) {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}

function j2d(jy: number, jm: number, jd: number) {
  const r = jalCal(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

function d2j(jdn: number) {
  const gy = d2g(jdn).gy;
  let jy = gy - 621;
  const r = jalCal(jy);
  const jdn1f = g2d(gy, 3, r.march);
  let k = jdn - jdn1f;
  if (k >= 0) {
    if (k <= 185) {
      const jm = 1 + div(k, 31);
      const jd = mod(k, 31) + 1;
      return { jy, jm, jd };
    }
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }
  const jm = 7 + div(k, 30);
  const jd = mod(k, 30) + 1;
  return { jy, jm, jd };
}

export function toJalaali(gy: number, gm: number, gd: number) {
  return d2j(g2d(gy, gm, gd));
}

export function toGregorian(jy: number, jm: number, jd: number) {
  return d2g(j2d(jy, jm, jd));
}

export function isLeapJY(jy: number) {
  return jalCal(jy).leap === 0;
}

export function monthLen(jy: number, jm: number) {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isLeapJY(jy) ? 30 : 29;
}

export function jWeekday(jy: number, jm: number, jd: number) {
  const g = toGregorian(jy, jm, jd);
  return (new Date(g.gy, g.gm - 1, g.gd).getDay() + 1) % 7;
}

const MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
const WD_SHORT = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
const FA = '۰۱۲۳۴۵۶۷۸۹';

export function toFa(n: number | string) {
  return String(n).replace(/\d/g, (d) => FA[parseInt(d)]);
}

export function padFa(n: number) {
  return toFa((n < 10 ? '0' : '') + n);
}

export function getToday() {
  const now = new Date();
  return toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function parseDate(str: string) {
  if (!str) return null;
  const parts = str.replace(/[۰-۹]/g, (d) => String(FA.indexOf(d))).split('/');
  if (parts.length !== 3) return null;
  const jy = parseInt(parts[0]);
  const jm = parseInt(parts[1]);
  const jd = parseInt(parts[2]);
  if (isNaN(jy) || isNaN(jm) || isNaN(jd)) return null;
  if (jm < 1 || jm > 12 || jd < 1 || jd > monthLen(jy, jm)) return null;
  return { jy, jm, jd };
}

interface JalaliDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function JalaliDatePicker({ value, onChange, placeholder = 'انتخاب تاریخ…', label }: JalaliDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'days' | 'months' | 'years'>('days');
  const TODAY = getToday();
  const sel = parseDate(value);
  const [vy, setVy] = useState(sel?.jy || TODAY.jy);
  const [vm, setVm] = useState(sel?.jm || TODAY.jm);
  const [yearRangeStart, setYearRangeStart] = useState((sel?.jy || TODAY.jy) - 6);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderDays = () => {
    const len = monthLen(vy, vm);
    const first = jWeekday(vy, vm, 1);
    const days = [];
    
    for (let i = 0; i < first; i++) {
      days.push(<div key={`pad-${i}`} className="aspect-square"></div>);
    }
    
    for (let d = 1; d <= len; d++) {
      const col = (first + d - 1) % 7;
      const isFriday = col === 6;
      const isToday = d === TODAY.jd && vm === TODAY.jm && vy === TODAY.jy;
      const isSelected = sel && sel.jy === vy && sel.jm === vm && sel.jd === d;
      
      days.push(
        <button
          key={d}
          type="button"
          onClick={() => {
            const newValue = `${vy}/${vm < 10 ? '0' : ''}${vm}/${d < 10 ? '0' : ''}${d}`;
            onChange(newValue);
            setIsOpen(false);
          }}
          className={`aspect-square rounded-md text-xs font-semibold transition-all hover:scale-110 ${
            isFriday ? 'bg-red-700 text-white hover:bg-red-800' :
            isToday ? 'bg-blue-900 text-white hover:bg-blue-800' :
            isSelected ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-600' :
            'hover:bg-teal-50'
          }`}
        >
          {toFa(d)}
        </button>
      );
    }
    
    return days;
  };

  const renderMonths = () => {
    return MONTHS.map((month, i) => {
      const m = i + 1;
      const isCurrent = m === TODAY.jm && vy === TODAY.jy;
      const isSelected = m === vm;
      
      return (
        <button
          key={m}
          type="button"
          onClick={() => {
            setVm(m);
            setView('days');
          }}
          className={`rounded-lg text-xs font-semibold p-2 transition-all hover:scale-105 ${
            isCurrent ? 'bg-blue-900 text-white' :
            isSelected ? 'bg-yellow-500 text-gray-900' :
            'hover:bg-teal-50'
          }`}
        >
          {month}
        </button>
      );
    });
  };

  const renderYears = () => {
    const years = [];
    for (let y = yearRangeStart; y < yearRangeStart + 12; y++) {
      const isCurrent = y === TODAY.jy;
      const isSelected = y === vy;
      
      years.push(
        <button
          key={y}
          type="button"
          onClick={() => {
            setVy(y);
            setView('months');
          }}
          className={`rounded-lg text-sm font-bold p-2 transition-all hover:scale-105 ${
            isCurrent ? 'bg-blue-900 text-white' :
            isSelected ? 'bg-yellow-500 text-gray-900' :
            'hover:bg-teal-50'
          }`}
        >
          {toFa(y)}
        </button>
      );
    }
    return years;
  };

  return (
    <div ref={wrapperRef} className="relative">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="relative">
        <input
          type="text"
          readOnly
          value={value}
          onClick={() => {
            setView('days');
            setIsOpen(!isOpen);
          }}
          placeholder={placeholder}
          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm font-semibold text-center cursor-pointer hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-500 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <rect x="3.5" y="5" width="17" height="16" rx="3"></rect>
          <path d="M3.5 10h17M8 2.8v4M16 2.8v4M8 14.5h2M14 14.5h2M8 17.5h2M14 17.5h2"></path>
        </svg>
      </div>
      
      {isOpen && (
        <div className="absolute top-full mt-1 right-0 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-l from-blue-900 to-blue-800 text-white p-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (view === 'days') {
                  const newVm = vm - 1;
                  if (newVm < 1) { setVm(12); setVy(vy - 1); }
                  else setVm(newVm);
                } else if (view === 'months') {
                  setVy(vy - 1);
                } else {
                  setYearRangeStart(yearRangeStart - 12);
                }
              }}
              className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center"
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setView(view === 'months' ? 'days' : 'months')}
                className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-xs font-bold"
              >
                {MONTHS[vm - 1]}
              </button>
              <button
                type="button"
                onClick={() => setView(view === 'years' ? 'months' : 'years')}
                className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-xs font-bold"
              >
                {toFa(vy)}
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                if (view === 'days') {
                  const newVm = vm + 1;
                  if (newVm > 12) { setVm(1); setVy(vy + 1); }
                  else setVm(newVm);
                } else if (view === 'months') {
                  setVy(vy + 1);
                } else {
                  setYearRangeStart(yearRangeStart + 12);
                }
              }}
              className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center"
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M15 5l-7 7 7 7"></path>
              </svg>
            </button>
          </div>
          
          {/* Body */}
          <div className="p-2 min-h-[180px]">
            {view === 'days' && (
              <>
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {WD_SHORT.map((wd, i) => (
                    <span key={i} className={`text-center text-[9px] font-bold ${i === 6 ? 'text-red-700' : 'text-gray-500'}`}>
                      {wd}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {renderDays()}
                </div>
              </>
            )}
            {view === 'months' && (
              <div className="grid grid-cols-3 gap-1">
                {renderMonths()}
              </div>
            )}
            {view === 'years' && (
              <div className="grid grid-cols-3 gap-1">
                {renderYears()}
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="border-t border-dashed border-gray-300 bg-gray-50 p-2 flex items-center justify-between">
            <span className="text-[9px] text-gray-500">
              امروز: {toFa(TODAY.jy)}/{padFa(TODAY.jm)}/{padFa(TODAY.jd)}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setIsOpen(false);
                }}
                className="px-2 py-1 rounded-md text-[9px] font-bold text-red-700 border border-red-700/40 hover:bg-red-50"
              >
                پاک‌کردن
              </button>
              <button
                type="button"
                onClick={() => {
                  const today = getToday();
                  const newValue = `${today.jy}/${today.jm < 10 ? '0' : ''}${today.jm}/${today.jd < 10 ? '0' : ''}${today.jd}`;
                  onChange(newValue);
                  setVy(today.jy);
                  setVm(today.jm);
                  setIsOpen(false);
                }}
                className="px-2 py-1 rounded-md text-[9px] font-bold bg-teal-500 text-white hover:bg-teal-600"
              >
                امروز
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
