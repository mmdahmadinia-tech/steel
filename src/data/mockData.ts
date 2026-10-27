export interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'admin' | 'eaf_user' | 'lf_user' | 'ccm_user' | 'shift_supervisor' | 'production_manager' | 'analyst' | 'it_admin';
  isActive: boolean;
  permissions: string[];
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
  eafStatus: 'not_started' | 'in_progress' | 'completed' | 'needs_review';
  lfStatus: 'not_started' | 'in_progress' | 'completed' | 'needs_review';
  ccmStatus: 'not_started' | 'in_progress' | 'completed' | 'needs_review';
  eafData?: EAFRecord;
  lfData?: LFRecord;
  ccmData?: CCMRecord;
  warnings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EAFRecord {
  heatId: string;
  date: string;
  shift: string;
  steelGrade: string;
  refractoryStatus: {
    walls: string;
    centerPiece: string;
    bottom: string;
    taphole: string;
  };
  preStartStoppages: Stoppages[];
  timeStart: string;
  samples: EAFSample[];
  tapping: EAFTapping;
  tappingEndTime: string;
  duringStoppages: Stoppages[];
  ladleInfo: {
    ladleNumber: string;
    requestTime: string;
    deliveryTime: string;
    slagCondition: string;
    wallCondition: string;
  };
  electrodeStatus: {
    phase1: string[];
    phase2: string[];
    phase3: string[];
  };
  scrapBuckets: { bucketNumber: string; tonnage: number }[];
  ladleAdditives: {
    feMn: number;
    feSiMn: number;
    feSi: number;
    lime: number;
    graphiteCPC: number;
    caAl: number;
  };
  chemicalAnalysis: {
    sample1: { c: number; si: number; mn: number; p: number; s: number };
    sample2: { c: number; si: number; mn: number; p: number; s: number };
    sample3: { c: number; si: number; mn: number; p: number; s: number };
  };
  consumables: {
    thermocouple: number;
    sampler: number;
    oxyProbe: number;
    tapholeSand: number;
  };
  ppm: number;
  cOutput: number;
  workingTimes: {
    powerOn: string;
    powerOff: string;
    tapToTap: string;
  };
  tappingWeight: number;
  recordingOperator: string;
  shiftSupervisor: string;
  supervisorNotes: string;
}

export interface LFRecord {
  heatId: string;
  date: string;
  shift: string;
  steelGrade: string;
  ladleStatus: {
    ladleNumber: string;
    changeLadle: boolean;
    slagLineLife: number;
    ladleLife: number;
    transfercarNumber: string;
  };
  inputCondition: {
    inputTime: string;
    inputTemperature: number;
    ppm: number;
    slagThickness: number;
    freeBoard: number;
  };
  electrodeStatus: {
    phase1: string[];
    phase2: string[];
    phase3: string[];
  };
  stoppages: Stoppages[];
  processData: LFProcessRow[];
  additives: Record<string, number[]>;
  stringStatus: {
    line1: string;
    line2: string;
  };
  tapLanceTimes: [string, string];
  chemicalAnalysis: {
    sample1: { c: number; si: number; mn: number; p: number; s: number; al: number };
    sample2: { c: number; si: number; mn: number; p: number; s: number; al: number };
    sample3: { c: number; si: number; mn: number; p: number; s: number; al: number };
    sample4: { c: number; si: number; mn: number; p: number; s: number; al: number };
    sample5: { c: number; si: number; mn: number; p: number; s: number; al: number };
  };
  probeConsumption: {
    thermocouple: number;
    sampler: number;
    oxyProbe: number;
  };
  argonConsumption: {
    timeString: string;
    consumption: number;
  };
  deliveryTimeToCCM: string;
  recordingOperator: string;
  shiftSupervisor: string;
  supervisorNotes: string;
}

export interface CCMRecord {
  heatId: string;
  date: string;
  shift: string;
  steelGrade: string;
  oilType: string;
  ladleShroud: boolean;
  avgCastingSpeed: number;
  lines: CCMLine[];
  temperatures: {
    requestedFromLF: number;
    sentFromLF: number;
  };
  mainTimes: {
    nextHeatRequestTime: string;
    castingStartTime: string;
    castingEndTime: string;
    heatNumberInSequence: number;
  };
  moldTubeLife: number[];
  lineBreakReport: {
    lineNumber: number;
    breakTime: string;
    cause: string;
  } | null;
  moldChange: {
    lineNumber: number;
    moldNumber: string;
    numberOfHeats: number;
    cause: string;
  } | null;
  ladleReport: {
    ladleNumber: string;
    timePlacedOnTurret: string;
    deliveredMeltWeight: number;
    slideGateOpeningTime: string;
    numberOfOxygenLances: number;
    returnedMeltWeight: number;
  };
  tundishReport: {
    tundishCarNumber: string;
    tundishNumber: string;
    sequentialHeats: number;
    residualMeltWeight: number;
  };
  returnHeat: {
    returnTime: string;
    cause: string;
  } | null;
  tundishTemperatures: { time: string; temperature: number }[];
  qualityReports: {
    line: number;
    time: string;
    reporterName: string;
    defectReported: string;
    correctiveAction: string;
    result: string;
  }[];
  sequenceCutReason: string;
  stoppages: Stoppages[];
  recordingTechnician: string;
  shiftSupervisor: string;
  supervisorNotes: string;
}

export interface Stoppages {
  from: string;
  till: string;
  minutes: number;
  workingGroup: string;
  description: string;
}

export interface EAFTapping {
  timeTapping: string;
  enCou: number;
  tap: number;
  dri: number;
  briquet: number;
  dolomite: number;
  limeMHU: number;
  carbonMHU: number;
  cpcMHU: number;
  cpcInjection: number;
  ch4: number;
  oxygen: number;
}

export interface EAFSample {
  timeSample: string;
  enCou: number;
  tap: number;
  dri: number;
  briquet: number;
  dolomite: number;
  limeMHU: number;
  carbonMHU: number;
  cpcMHU: number;
  cpcInjection: number;
  ch4: number;
  oxygen: number;
}

export interface LFProcessRow {
  time: string;
  temp: number;
  ppm: number;
  enCou: number;
  tap: number;
  pOn: number;
  description: string;
}

export interface CCMLine {
  lineNumber: number;
  castingStartTime: string;
  castingMode: 'Automatic' | 'Manual' | '';
  castingSpeed: number;
  moldNumber: string;
  castingEndTime: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  action: 'create' | 'edit' | 'delete' | 'login' | 'logout' | 'backup' | 'restore' | 'approve';
  recordType: string;
  recordId: string;
  details: string;
  oldValue?: string;
  newValue?: string;
}

export interface BackupRecord {
  id: string;
  timestamp: string;
  type: 'full' | 'incremental';
  status: 'success' | 'failed';
  size: string;
  notes: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    fullName: 'مدیر سامانه',
    role: 'admin',
    isActive: true,
    permissions: ['view', 'create', 'edit', 'approve', 'manage_users', 'view_reports', 'view_audit', 'manage_backup'],
    unitAccess: ['EAF', 'LF', 'CCM']
  },
  {
    id: '2',
    username: 'eaf_operator',
    fullName: 'احمد رضایی',
    role: 'eaf_user',
    isActive: true,
    permissions: ['view', 'create', 'edit'],
    unitAccess: ['EAF']
  },
  {
    id: '3',
    username: 'lf_operator',
    fullName: 'محمد حسینی',
    role: 'lf_user',
    isActive: true,
    permissions: ['view', 'create', 'edit'],
    unitAccess: ['LF']
  },
  {
    id: '4',
    username: 'ccm_operator',
    fullName: 'علی محمدی',
    role: 'ccm_user',
    isActive: true,
    permissions: ['view', 'create', 'edit'],
    unitAccess: ['CCM']
  },
  {
    id: '5',
    username: 'shift_sup',
    fullName: 'رضا کریمی',
    role: 'shift_supervisor',
    isActive: true,
    permissions: ['view', 'create', 'edit', 'approve'],
    unitAccess: ['EAF', 'LF', 'CCM']
  },
  {
    id: '6',
    username: 'prod_manager',
    fullName: 'حسن احمدی',
    role: 'production_manager',
    isActive: true,
    permissions: ['view', 'view_reports'],
    unitAccess: ['EAF', 'LF', 'CCM']
  }
];

// Mock Heats
export const mockHeats: Heat[] = [
  {
    id: '1',
    heatId: '1250',
    date: '1403/09/15',
    shift: 'A',
    steelGrade: 'St37',
    isSubHeat: false,
    eafStatus: 'completed',
    lfStatus: 'completed',
    ccmStatus: 'completed',
    warnings: [],
    createdAt: '1403/09/15 08:30',
    updatedAt: '1403/09/15 14:45'
  },
  {
    id: '2',
    heatId: '1251',
    date: '1403/09/15',
    shift: 'A',
    steelGrade: 'St52',
    isSubHeat: false,
    eafStatus: 'completed',
    lfStatus: 'in_progress',
    ccmStatus: 'not_started',
    warnings: ['اطلاعات LF ناقص است'],
    createdAt: '1403/09/15 10:15',
    updatedAt: '1403/09/15 15:20'
  },
  {
    id: '3',
    heatId: '1252',
    date: '1403/09/15',
    shift: 'B',
    steelGrade: 'St37',
    isSubHeat: false,
    eafStatus: 'in_progress',
    lfStatus: 'not_started',
    ccmStatus: 'not_started',
    warnings: [],
    createdAt: '1403/09/15 16:00',
    updatedAt: '1403/09/15 17:30'
  },
  {
    id: '4',
    heatId: '1250-1',
    date: '1403/09/15',
    shift: 'A',
    steelGrade: 'St37',
    isSubHeat: true,
    parentHeatId: '1250',
    eafStatus: 'not_started',
    lfStatus: 'completed',
    ccmStatus: 'completed',
    warnings: [],
    createdAt: '1403/09/15 13:00',
    updatedAt: '1403/09/15 16:00'
  },
  {
    id: '5',
    heatId: '1253',
    date: '1403/09/16',
    shift: 'A',
    steelGrade: 'St44',
    isSubHeat: false,
    eafStatus: 'completed',
    lfStatus: 'completed',
    ccmStatus: 'in_progress',
    warnings: ['اختلاف زمانی بین تحویل LF و شروع CCM'],
    createdAt: '1403/09/16 08:00',
    updatedAt: '1403/09/16 13:00'
  },
  {
    id: '6',
    heatId: '1254',
    date: '1403/09/16',
    shift: 'B',
    steelGrade: 'St37',
    isSubHeat: false,
    eafStatus: 'completed',
    lfStatus: 'completed',
    ccmStatus: 'completed',
    warnings: [],
    createdAt: '1403/09/16 16:00',
    updatedAt: '1403/09/16 22:30'
  }
];

// Mock Audit Logs
export const mockAuditLogs: AuditLog[] = [
  { id: '1', userId: '1', userName: 'مدیر سامانه', timestamp: '1403/09/16 08:00', action: 'create', recordType: 'Heat', recordId: '1253', details: 'ایجاد ذوب جدید' },
  { id: '2', userId: '2', userName: 'احمد رضایی', timestamp: '1403/09/16 08:15', action: 'edit', recordType: 'EAF', recordId: '1253', details: 'ثبت اطلاعات کوره قوس الکتریکی' },
  { id: '3', userId: '3', userName: 'محمد حسینی', timestamp: '1403/09/16 10:30', action: 'edit', recordType: 'LF', recordId: '1253', details: 'ثبت اطلاعات کوره پاتیلی' },
  { id: '4', userId: '4', userName: 'علی محمدی', timestamp: '1403/09/16 12:00', action: 'edit', recordType: 'CCM', recordId: '1253', details: 'ثبت اطلاعات ریخته‌گری مداوم' },
  { id: '5', userId: '1', userName: 'مدیر سامانه', timestamp: '1403/09/16 06:00', action: 'backup', recordType: 'System', recordId: '-', details: 'پشتیبان‌گیری کامل' },
  { id: '6', userId: '5', userName: 'رضا کریمی', timestamp: '1403/09/15 22:00', action: 'approve', recordType: 'Heat', recordId: '1250', details: 'تأیید اطلاعات ذوب' },
];

// Mock Backup Records
export const mockBackups: BackupRecord[] = [
  { id: '1', timestamp: '1403/09/16 06:00', type: 'full', status: 'success', size: '245 MB', notes: 'پشتیبان‌گیری روزانه' },
  { id: '2', timestamp: '1403/09/15 06:00', type: 'full', status: 'success', size: '240 MB', notes: 'پشتیبان‌گیری روزانه' },
  { id: '3', timestamp: '1403/09/14 06:00', type: 'full', status: 'success', size: '238 MB', notes: 'پشتیبان‌گیری روزانه' },
  { id: '4', timestamp: '1403/09/13 06:00', type: 'full', status: 'failed', size: '-', notes: 'خطا در فضای ذخیره‌سازی' },
];

// Dashboard Stats
export const dashboardStats = {
  totalHeats: 6,
  completedHeats: 3,
  inProgressHeats: 2,
  notStartedHeats: 1,
  totalProduction: 485, // tons
  avgEnergyConsumption: 520, // kWh/ton
  totalStoppages: 8,
  totalStoppageMinutes: 145,
  eafCompletionRate: 83,
  lfCompletionRate: 67,
  ccmCompletionRate: 50,
};

// Chart Data
export const productionChartData = [
  { name: 'شنبه', production: 78, target: 80 },
  { name: 'یکشنبه', production: 82, target: 80 },
  { name: 'دوشنبه', production: 75, target: 80 },
  { name: 'سه‌شنبه', production: 88, target: 80 },
  { name: 'چهارشنبه', production: 81, target: 80 },
  { name: 'پنجشنبه', production: 85, target: 80 },
];

export const energyChartData = [
  { name: 'شنبه', consumption: 510 },
  { name: 'یکشنبه', consumption: 525 },
  { name: 'دوشنبه', consumption: 498 },
  { name: 'سه‌شنبه', consumption: 540 },
  { name: 'چهارشنبه', consumption: 515 },
  { name: 'پنجشنبه', consumption: 530 },
];

export const shiftComparisonData = [
  { name: 'شیفت A', eaf: 45, lf: 38, ccm: 42 },
  { name: 'شیفت B', eaf: 42, lf: 40, ccm: 38 },
  { name: 'شیفت C', eaf: 40, lf: 35, ccm: 44 },
];
