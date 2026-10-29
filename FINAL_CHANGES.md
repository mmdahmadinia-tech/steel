# 📋 راهنمای تغییرات نهایی - STEELMETRICS

## ✅ تمام مشکلات حل شدند

### ۱. اضافه شدن En.Cou (MWh) و Temp ✅

**تغییرات:**
- فیلد `En.Cou (MWh)` به هر دو کادر Sample Time و Tapping Start اضافه شد
- فیلد `Temp (°C)` به هر دو کادر Sample Time و Tapping Start اضافه شد
- ترتیب فیلدها در Process Description:
  1. Time (24h)
  2. Temp (°C) **[جدید]**
  3. Tap
  4. En.Cou (MWh) **[جدید]**
  5. DRI (Ton)
  6. Briquet (Ton)
  7. Dolomite (Kg)
  8. Lime MHU (Kg)
  9. Carbon MHU (Kg)
  10. CPC MHU (Kg)
  11. CPC Injection (Kg)
  12. CH4 (Nm³)
  13. Oxygen (Nm³)

### ۲. جابجایی Power On ✅

**تغییر:**
- فیلد `POWER ON (دقیقه)` بعد از `PPM` قرار گرفت
- ترتیب جدید در اطلاعات ذوب:
  1. تاریخ
  2. شیفت
  3. Heat ID
  4. گرید فولاد
  5. شروع ذوب
  6. شروع تخلیه
  7. پایان تخلیه
  8. وزن تخلیه
  9. درصد کربن
  10. PPM
  11. **POWER ON** **[جابجا شد]**
  12. مدت تخلیه (محاسبه خودکار)
  13. POWER OFF (محاسبه خودکار)
  14. TAP TO TAP (محاسبه خودکار)
  15. توضیحات سرشیفت **[جدید]**

### ۳. اصلاح افزودنی‌ها ✅

**تغییرات:**
- حذف کادر `Ca.Al / Al-CaC2 (Kg)`
- اضافه شدن سه کادر جداگانه:
  1. `Ca.Al (Kg)`
  2. `AL (Kg)`
  3. `CaC2 (Kg)`

### ۴. حل مشکل وضعیت نسوز ✅

**تغییرات:**
- اصلاح کد خواندن مقادیر نسوز از ذوب قبلی
- استفاده از `?? 0` به جای `|| 0` برای مقداردهی صحیح
- اضافه شدن console.log برای دیباگ
- **نحوه کار:**
  1. وقتی ذوب جدید ایجاد می‌شود، سیستم ذوب قبلی را پیدا می‌کند
  2. مقادیر نسوز ذوب قبلی خوانده می‌شوند
  3. به هر مقدار +1 اضافه می‌شود
  4. مقادیر جدید در فرم نمایش داده می‌شوند

**مثال:**
```
ذوب 1120:
- Walls: 10
- Center Piece: 11
- Bottom: 20
- Taphole: 14

ذوب 1121 (خودکار):
- Walls: 11
- Center Piece: 12
- Bottom: 21
- Taphole: 15
```

### ۵. اضافه شدن توضیحات سرشیفت ✅

**تغییر:**
- فیلد جدید `توضیحات سرشیفت` در اطلاعات ذوب اضافه شد
- textarea با ارتفاع مناسب
- ذخیره در `shiftSupervisorNotes`

### ۶. اصلاح خروجی اکسل ✅

**تغییرات:**
- اصلاح تابع `exportSingleToExcel` برای شامل کردن تمام اطلاعات
- ترتیب دقیق طبق درخواست کاربر:

**ترتیب ستون‌ها در اکسل:**
1. HEAT ID
2. تاریخ
3. گرید
4. شیفت
5. شروع ذوب
6. شروع تخلیه
7. پایان تخلیه
8. مدت تخلیه
9. DRI (Ton) - Tapping Start
10. Briquet (Ton) - Tapping Start
11. جمع Tonnage سبدهای قراضه
12. TAP - Sample Time
13. TAP - Tapping Start
14. Power On
15. Power Off
16. Tap to Tap
17. Walls
18. Center Piece
19. Bottom
20. Taphole
21. توقفات قبل از شروع (ردیفی)
22. En.Cou (MWh) - Tapping Start
23. FeMn (Kg)
24. FeSiMn (Kg)
25. FeSi (Kg)
26. Ca.Al (Kg)
27. AL (Kg)
28. CaC2 (Kg)
29. Dolomite (Kg) - Tapping Start
30. Lime MHU (Kg) - Tapping Start
31. Lime (Kg)
32. Carbon MHU (Kg) - Tapping Start
33. CPC Injection (Kg) - Tapping Start
34. CPC MHU (Kg) - Tapping Start
35. Graphite (CPC) (Kg)
36. CH4 (Nm³) - Tapping Start
37. Oxygen (Nm³) - Tapping Start
38. وزن تخلیه (تن)
39. آنالیز شیمیایی (ردیفی)
40. PPM
41. درصد کربن (سلوکس) %
42. Thermocouple
43. Sampler
44. Oxy. Probe
45. Taphole Sand (Kg)
46. الکترود فاز 1 تعویض
47. الکترود فاز 2 تعویض
48. الکترود فاز 3 تعویض
49. شکستن فاز 1
50. شکستن فاز 2
51. شکستن فاز 3
52. تنظیم فاز 1
53. تنظیم فاز 2
54. تنظیم فاز 3
55. Ladle Number
56. Slag Condition
57. Wall Condition
58. توضیحات سرشیفت

## 🎯 نحوه تست

### تست ۱: وضعیت نسوز

1. **ذوب 1120 را ثبت کنید:**
   - Walls: 10
   - Center Piece: 11
   - Bottom: 20
   - Taphole: 14
   - سایر فیلدها را پر کنید
   - ذخیره کنید

2. **ذوب 1121 را باز کنید:**
   - باید مقادیر نسوز به صورت خودکار +1 شده باشند
   - Walls: 11
   - Center Piece: 12
   - Bottom: 21
   - Taphole: 15

3. **در Console مرورگر (F12) بررسی کنید:**
   ```
   === NEW HEAT - Auto-increment Refractory ===
   Previous heat: 1120
   Previous refractory: {walls: 10, centerPiece: 11, bottom: 20, taphole: 14}
   New values: {walls: 11, centerPiece: 12, bottom: 21, taphole: 15}
   ```

### تست ۲: خروجی اکسل

1. **ذوب 1120 را با تمام اطلاعات ثبت کنید:**
   - تمام فیلدها را پر کنید
   - ذخیره کنید

2. **به صفحه "کلیه ذوب‌های EAF" بروید**

3. **روی دکمه "📥" کنار ذوب 1120 کلیک کنید**

4. **فایل اکسل را باز کنید**

5. **بررسی کنید:**
   - تمام 58 ستون وجود دارند
   - ترتیب ستون‌ها صحیح است
   - مقادیر صحیح هستند

### تست ۳: Process Description

1. **به تب "Process Description" بروید**

2. **بررسی کنید:**
   - در Sample Time: Time, Temp, Tap, En.Cou, DRI, Briquet, ...
   - در Tapping Start: Time, Temp, Tap, En.Cou, DRI, Briquet, ...

### تست ۴: افزودنی‌ها

1. **به تب "افزودنی‌ها" بروید**

2. **بررسی کنید:**
   - FeMn (Kg)
   - FeSiMn (Kg)
   - FeSi (Kg)
   - Lime (Kg)
   - Graphite (CPC) (Kg)
   - Ca.Al (Kg) **[جدید]**
   - AL (Kg) **[جدید]**
   - CaC2 (Kg) **[جدید]**

## 📊 ساختار داده جدید

### EAFData Interface:

```typescript
export interface EAFData {
  date: string;
  shift: string;
  steelGrade: string;
  heatStartTime?: string;
  refractoryCounters: { walls: number; centerPiece: number; bottom: number; taphole: number };
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
```

## 🎯 کاربران پیش‌فرض

| نقش | نام کاربری | رمز عبور |
|-----|-----------|----------|
| مدیر سایت | `19029` | `19029` |
| کاربر EAF | `19377` | `19377` |
| کاربر LF | `19513` | `19513` |
| کاربر CCM | `19616` | `19616` |
| تحلیلگر | `19452` | `19452` |

## 🚀 نحوه اجرا

```bash
# روی START.bat دابل‌کلیک کنید
# یا:
npm install
npm run build
npx serve dist -l 3001
```

سپس: `http://localhost:3001`

## 📝 نکات مهم

1. **وضعیت نسوز**: اکنون به درستی از ذوب قبلی +1 می‌شود
2. **En.Cou و Temp**: به هر دو کادر Sample Time و Tapping Start اضافه شدند
3. **Power On**: بعد از PPM قرار گرفت
4. **افزودنی‌ها**: سه کادر جداگانه Ca.Al، AL، CaC2
5. **توضیحات سرشیفت**: فیلد جدید اضافه شد
6. **خروجی اکسل**: تمام 58 ستون با ترتیب صحیح

## 🆘 رفع مشکلات

### مشکل: اعداد نسوز +1 نمی‌شوند

**راه حل:**
1. Console مرورگر را باز کنید (F12)
2. پیام‌های log را بررسی کنید
3. مطمئن شوید ذوب قبلی ذخیره شده است
4. صفحه را رفرش کنید
5. دوباره تلاش کنید

### مشکل: خروجی اکسل ناقص است

**راه حل:**
1. مطمئن شوید تمام اطلاعات را وارد کرده‌اید
2. ذوب را ذخیره کنید
3. صفحه را رفرش کنید
4. دوباره خروجی بگیرید

### مشکل: localStorage پر شده است

**راه حل:**
```javascript
// در Console مرورگر (F12):
localStorage.clear()
// سپس صفحه را رفرش کنید
```

## 📞 پشتیبانی

- Email: support@steelmetrics.ir
- Website: https://steelmetrics.ir

---

**نسخه:** 1.0.0  
**تاریخ:** 1403/09/17  
**دامنه:** steelmetrics.ir
