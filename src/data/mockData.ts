export interface User {
  id: string;
  username: string;
  password: string;
  fullName: string;
  role: 'admin' | 'eaf_user' | 'lf_user' | 'ccm_user' | 'analyst';
  isActive: boolean;
  unitAccess: ('EAF' | 'LF' | 'CCM')[];
}

export interface Heat {
  id: string;
  heatId: string;
  date: string;
  shift: string;
  steelGrade: string;
  isSubHeat: boolean;
  parentHeatId?: string;
  eafStatus: 'not_started' | 'in_progress' | 'completed';
  lfStatus: 'not_started' | 'in_progress' | 'completed';
  ccmStatus: 'not_started' | 'in_progress' | 'completed';
  eafData?: any;
  lfData?: any;
  ccmData?: any;
  warnings: string[];
  createdAt: string;
  updatedAt: string;
}

export const STEEL_GRADES = ['4402', '3203', '3401', '3204', '3302', '4501'];
export const SHIFTS = ['A', 'B', 'C', 'D'];

export const WORKING_GROUPS = [
  'Setup Time',
  'کوره-تولید',
  'کوره-برق',
  'کوره-مکانیک',
  'ریخته‌گری-تولید',
  'ریخته‌گری-مکانیک',
  'ریخته‌گری-برق',
  'انرژی و سیالات',
  'برنامه‌ریزی شده',
  'نسوز',
  'گهرترابر',
  'متریال و هندلینگ',
  'فیوم',
  'پست برق',
  'سایر',
];

export const LADLE_NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export const defaultUsers: User[] = [
  { id: '1', username: '19029', password: '19029', fullName: 'مدیر سایت', role: 'admin', isActive: true, unitAccess: ['EAF', 'LF', 'CCM'] },
  { id: '2', username: '19377', password: '19377', fullName: 'کاربر EAF', role: 'eaf_user', isActive: true, unitAccess: ['EAF'] },
  { id: '3', username: '19513', password: '19513', fullName: 'کاربر LF', role: 'lf_user', isActive: true, unitAccess: ['LF'] },
  { id: '4', username: '19616', password: '19616', fullName: 'کاربر CCM', role: 'ccm_user', isActive: true, unitAccess: ['CCM'] },
  { id: '5', username: '19452', password: '19452', fullName: 'کاربر تحلیل', role: 'analyst', isActive: true, unitAccess: ['EAF', 'LF', 'CCM'] },
];

export const defaultHeats: Heat[] = [
  { id: '1', heatId: '1250', date: '1403/09/15', shift: 'A', steelGrade: '4402', isSubHeat: false, eafStatus: 'completed', lfStatus: 'completed', ccmStatus: 'completed', warnings: [], createdAt: '1403/09/15 08:30', updatedAt: '1403/09/15 14:45',
    eafData: { tappingWeight: 85, powerOn: '08:30', powerOff: '11:30', tapToTap: 75, enCou: 42.5, materials: { feMn: 280, feSiMn: 150, feSi: 120, lime: 2500, carbon: 800, cpcInjection: 300, oxygen: 4500 } },
    lfData: { additives: { feMn: 120, feSiMn: 80, feSi: 60, lime: 800, graphite: 200, caC2: 150, caAl: 100, isoterm: 50, caSiWire: 30, caFeWire: 25, alWire: 40, deoxidizer: 60 } },
    ccmData: { avgCastingSpeed: 1.2, lineBreaks: 1, sequenceHeats: 4 }
  },
  { id: '2', heatId: '1251', date: '1403/09/15', shift: 'A', steelGrade: '3203', isSubHeat: false, eafStatus: 'completed', lfStatus: 'in_progress', ccmStatus: 'not_started', warnings: ['اطلاعات LF ناقص'], createdAt: '1403/09/15 10:15', updatedAt: '1403/09/15 15:20',
    eafData: { tappingWeight: 82, powerOn: '10:15', powerOff: '13:00', tapToTap: 80, enCou: 44.2, materials: { feMn: 300, feSiMn: 160, feSi: 130, lime: 2600, carbon: 820, cpcInjection: 310, oxygen: 4600 } },
  },
  { id: '3', heatId: '1252', date: '1403/09/15', shift: 'B', steelGrade: '3401', isSubHeat: false, eafStatus: 'in_progress', lfStatus: 'not_started', ccmStatus: 'not_started', warnings: [], createdAt: '1403/09/15 16:00', updatedAt: '1403/09/15 17:30',
    eafData: { tappingWeight: 88, powerOn: '16:00', powerOff: '19:00', tapToTap: 72, enCou: 41.8 },
  },
  { id: '4', heatId: '1253', date: '1403/09/16', shift: 'A', steelGrade: '3204', isSubHeat: false, eafStatus: 'completed', lfStatus: 'completed', ccmStatus: 'in_progress', warnings: [], createdAt: '1403/09/16 08:00', updatedAt: '1403/09/16 13:00',
    eafData: { tappingWeight: 86, powerOn: '08:00', powerOff: '11:00', tapToTap: 78, enCou: 43.1, materials: { feMn: 290, feSiMn: 155, feSi: 125, lime: 2550, carbon: 810, cpcInjection: 305, oxygen: 4550 } },
    lfData: { additives: { feMn: 130, feSiMn: 85, feSi: 65, lime: 820, graphite: 210, caC2: 155, caAl: 105, isoterm: 55, caSiWire: 32, caFeWire: 27, alWire: 42, deoxidizer: 65 } },
    ccmData: { avgCastingSpeed: 1.15, lineBreaks: 0, sequenceHeats: 5 }
  },
  { id: '5', heatId: '1254', date: '1403/09/16', shift: 'B', steelGrade: '3302', isSubHeat: false, eafStatus: 'completed', lfStatus: 'completed', ccmStatus: 'completed', warnings: [], createdAt: '1403/09/16 16:00', updatedAt: '1403/09/16 22:30',
    eafData: { tappingWeight: 84, powerOn: '16:00', powerOff: '19:15', tapToTap: 76, enCou: 42.8, materials: { feMn: 275, feSiMn: 148, feSi: 118, lime: 2480, carbon: 790, cpcInjection: 295, oxygen: 4480 } },
    lfData: { additives: { feMn: 125, feSiMn: 82, feSi: 62, lime: 810, graphite: 205, caC2: 152, caAl: 102, isoterm: 52, caSiWire: 31, caFeWire: 26, alWire: 41, deoxidizer: 62 } },
    ccmData: { avgCastingSpeed: 1.25, lineBreaks: 2, sequenceHeats: 3 }
  },
  { id: '6', heatId: '1255', date: '1403/09/16', shift: 'C', steelGrade: '4501', isSubHeat: false, eafStatus: 'completed', lfStatus: 'completed', ccmStatus: 'completed', warnings: [], createdAt: '1403/09/16 00:00', updatedAt: '1403/09/16 06:30',
    eafData: { tappingWeight: 87, powerOn: '00:00', powerOff: '03:00', tapToTap: 74, enCou: 43.5, materials: { feMn: 295, feSiMn: 158, feSi: 128, lime: 2580, carbon: 815, cpcInjection: 308, oxygen: 4580 } },
    lfData: { additives: { feMn: 135, feSiMn: 88, feSi: 68, lime: 830, graphite: 215, caC2: 158, caAl: 108, isoterm: 58, caSiWire: 34, caFeWire: 28, alWire: 44, deoxidizer: 68 } },
    ccmData: { avgCastingSpeed: 1.18, lineBreaks: 1, sequenceHeats: 6 }
  },
  { id: '7', heatId: '1256', date: '1403/09/17', shift: 'A', steelGrade: '4402', isSubHeat: false, eafStatus: 'completed', lfStatus: 'completed', ccmStatus: 'completed', warnings: [], createdAt: '1403/09/17 08:00', updatedAt: '1403/09/17 14:00',
    eafData: { tappingWeight: 83, powerOn: '08:00', powerOff: '11:10', tapToTap: 77, enCou: 42.2, materials: { feMn: 270, feSiMn: 145, feSi: 115, lime: 2450, carbon: 780, cpcInjection: 290, oxygen: 4450 } },
    lfData: { additives: { feMn: 118, feSiMn: 78, feSi: 58, lime: 790, graphite: 195, caC2: 145, caAl: 95, isoterm: 48, caSiWire: 28, caFeWire: 24, alWire: 38, deoxidizer: 58 } },
    ccmData: { avgCastingSpeed: 1.22, lineBreaks: 0, sequenceHeats: 4 }
  },
  { id: '8', heatId: '1257', date: '1403/09/17', shift: 'D', steelGrade: '3203', isSubHeat: false, eafStatus: 'completed', lfStatus: 'completed', ccmStatus: 'completed', warnings: [], createdAt: '1403/09/17 20:00', updatedAt: '1403/09/18 02:00',
    eafData: { tappingWeight: 86, powerOn: '20:00', powerOff: '23:00', tapToTap: 73, enCou: 43.8, materials: { feMn: 285, feSiMn: 152, feSi: 122, lime: 2520, carbon: 805, cpcInjection: 302, oxygen: 4520 } },
    lfData: { additives: { feMn: 128, feSiMn: 84, feSi: 64, lime: 815, graphite: 208, caC2: 154, caAl: 104, isoterm: 54, caSiWire: 33, caFeWire: 27, alWire: 43, deoxidizer: 64 } },
    ccmData: { avgCastingSpeed: 1.3, lineBreaks: 1, sequenceHeats: 7 }
  },
];

export const defaultAuditLogs = [
  { id: '1', userId: '1', userName: 'مدیر سایت', timestamp: '1403/09/17 08:00', action: 'create', recordType: 'Heat', recordId: '1256', details: 'ایجاد ذوب جدید' },
  { id: '2', userId: '2', userName: 'کاربر EAF', timestamp: '1403/09/17 08:15', action: 'edit', recordType: 'EAF', recordId: '1256', details: 'ثبت اطلاعات EAF' },
  { id: '3', userId: '3', userName: 'کاربر LF', timestamp: '1403/09/17 10:30', action: 'edit', recordType: 'LF', recordId: '1256', details: 'ثبت اطلاعات LF' },
  { id: '4', userId: '4', userName: 'کاربر CCM', timestamp: '1403/09/17 12:00', action: 'edit', recordType: 'CCM', recordId: '1256', details: 'ثبت اطلاعات CCM' },
];

export const defaultBackups = [
  { id: '1', timestamp: '1403/09/17 06:00', type: 'full', status: 'success', size: '245 MB', notes: 'پشتیبان‌گیری روزانه' },
  { id: '2', timestamp: '1403/09/16 06:00', type: 'full', status: 'success', size: '240 MB', notes: 'پشتیبان‌گیری روزانه' },
  { id: '3', timestamp: '1403/09/15 06:00', type: 'full', status: 'success', size: '238 MB', notes: 'پشتیبان‌گیری روزانه' },
];
