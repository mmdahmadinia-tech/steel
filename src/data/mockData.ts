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
  eafData?: EAFData;
  lfData?: any;
  ccmData?: any;
  warnings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EAFData {
  date: string;
  shift: string;
  steelGrade: string;
  heatStartTime?: string;
  // Refractory
  refractoryCounters: { walls: number; centerPiece: number; bottom: number; taphole: number };
  // Times
  powerOn: number;
  powerOff: number;
  tapToTap: number;
  tappingWeight: number;
  tappingStartTime: string;
  tappingEndTime: string;
  tappingDuration: number;
  carbonPercent?: number;
  ppm: number;
  // Sample Time
  sampleTime?: string;
  sampleTemp?: number;
  sampleTap?: number;
  sampleEnCou?: number;
  sampleDri?: number;
  sampleBriquet?: number;
  sampleDolomite?: number;
  sampleLimeMHU?: number;
  sampleCarbonMHU?: number;
  sampleCpcMHU?: number;
  sampleCpcInjection?: number;
  sampleCh4?: number;
  sampleOxygen?: number;
  // Tapping Start
  tappingTime?: string;
  tappingTemp?: number;
  tappingTap?: number;
  tappingEnCou?: number;
  tappingDri?: number;
  tappingBriquet?: number;
  tappingDolomite?: number;
  tappingLimeMHU?: number;
  tappingCarbonMHU?: number;
  tappingCpcMHU?: number;
  tappingCpcInjection?: number;
  tappingCh4?: number;
  tappingOxygen?: number;
  // Stoppages
  preStoppages: any[];
  duringStoppages: any[];
  // Analysis
  chemicalAnalysis: any[];
  // Consumables
  consumables: any;
  // Ladle
  ladleInfo: any;
  // Electrode
  electrodeStatus: any;
  // Scrap
  scrapBuckets: any[];
  // Additives
  additives: any;
  // Recording info
  shiftSupervisorNotes?: string;
}

export const STEEL_GRADES = ['4402', '3203', '3401', '3204', '3302', '4501'];
export const SHIFTS = ['A', 'B', 'C', 'D'];

export const WORKING_GROUPS = [
  'کوره-تولید', 'کوره-برق', 'کوره-مکانیک',
  'ریخته‌گری-تولید', 'ریخته‌گری-مکانیک', 'ریخته‌گری-برق',
  'انرژی و سیالات', 'برنامه‌ریزی شده', 'نسوز',
  'گهرترابر', 'متریال و هندلینگ', 'فیوم', 'پست برق', 'سایر',
];

export const PRE_START_STOP_REASONS = [
  'SETUP TIME',
  'تعویض الکترود فاز 1',
  'تعویض الکترود فاز 2',
  'تعویض الکترود فاز 3',
  'تنظیم فاز 1',
  'تنظیم فاز 2',
  'تنظیم فاز 3',
  'تنظیم هرسه فاز',
];

export const LADLE_NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

// کاربران پیش‌فرض حذف شدند - فقط از Backend API دریافت می‌شوند
export const defaultUsers: User[] = [];

function createSampleHeat(id: string, heatId: string, date: string, shift: string, grade: string, weight: number, _enCou: number, ppm: number): Heat {
  return {
    id, heatId, date, shift, steelGrade: grade, isSubHeat: false,
    eafStatus: 'completed', lfStatus: 'completed', ccmStatus: 'completed',
    eafData: {
      date, shift, steelGrade: grade,
      refractoryCounters: { walls: 10, centerPiece: 5, bottom: 8, taphole: 3 },
      powerOn: 45, powerOff: 120, tapToTap: 165,
      tappingWeight: weight,
      tappingStartTime: '11:00', tappingEndTime: '11:30', tappingDuration: 30,
      ppm,
      sampleTime: '10:30', sampleTemp: 1600, sampleTap: 15, sampleEnCou: 42.5,
      sampleDri: 95, sampleBriquet: 5, sampleDolomite: 1200,
      sampleLimeMHU: 2500, sampleCarbonMHU: 800, sampleCpcMHU: 400,
      sampleCpcInjection: 300, sampleCh4: 1500, sampleOxygen: 4500,
      tappingTime: '11:00', tappingTemp: 1620, tappingTap: 15, tappingEnCou: 42.5,
      tappingDri: 95, tappingBriquet: 5, tappingDolomite: 1200,
      tappingLimeMHU: 2500, tappingCarbonMHU: 800, tappingCpcMHU: 400,
      tappingCpcInjection: 300, tappingCh4: 1500, tappingOxygen: 4500,
      preStoppages: [], duringStoppages: [],
      chemicalAnalysis: [], consumables: {}, ladleInfo: {}, electrodeStatus: {},
      additives: { feMn: 280, feSiMn: 150, feSi: 120, lime: 2500, graphite: 400, caAl: 100, al: 50, cac2: 150 },
      scrapBuckets: [],
    },
    lfData: {
      additives: { feMn: 120, feSiMn: 80, feSi: 60, lime: 800, graphite: 200, caC2: 150, caAl: 100 }
    },
    ccmData: { avgCastingSpeed: 1.2, lineBreaks: Math.floor(Math.random() * 3), sequenceHeats: 3 + Math.floor(Math.random() * 5) },
    warnings: [], createdAt: date + ' 08:30', updatedAt: date + ' 14:45'
  };
}

export const defaultHeats: Heat[] = [
  createSampleHeat('1', '1250', '1403/09/15', 'A', '4402', 85, 42.5, 350),
  createSampleHeat('2', '1251', '1403/09/15', 'A', '3203', 82, 44.2, 380),
  createSampleHeat('3', '1252', '1403/09/15', 'B', '3401', 88, 41.8, 320),
  createSampleHeat('4', '1253', '1403/09/16', 'A', '3204', 86, 43.1, 360),
  createSampleHeat('5', '1254', '1403/09/16', 'B', '3302', 84, 42.8, 340),
  createSampleHeat('6', '1255', '1403/09/16', 'C', '4501', 87, 43.5, 370),
  createSampleHeat('7', '1256', '1403/09/17', 'A', '4402', 83, 42.2, 330),
  createSampleHeat('8', '1257', '1403/09/17', 'D', '3203', 86, 43.8, 390),
];

export const defaultAuditLogs = [
  { id: '1', userId: '1', userName: 'مدیر سایت', timestamp: '1403/09/17 08:00', action: 'create', recordType: 'Heat', recordId: '1256', details: 'ایجاد ذوب جدید' },
  { id: '2', userId: '2', userName: 'کاربر EAF', timestamp: '1403/09/17 08:15', action: 'edit', recordType: 'EAF', recordId: '1256', details: 'ثبت اطلاعات EAF' },
];

export const defaultBackups = [
  { id: '1', timestamp: '1403/09/17 06:00', type: 'full', status: 'success', size: '245 MB', notes: 'پشتیبان‌گیری روزانه' },
  { id: '2', timestamp: '1403/09/16 06:00', type: 'full', status: 'success', size: '240 MB', notes: 'پشتیبان‌گیری روزانه' },
];
