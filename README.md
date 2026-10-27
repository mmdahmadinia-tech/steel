# 🏭 STEELMETRICS - سامانه مدیریت و تحلیل تولید فولاد

<div align="center">

**Steel Production Management & Analytics System**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://steelmetrics.ir)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)]()
[![React](https://img.shields.io/badge/React-18.2-61dafb.svg)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6.svg)](https://www.typescriptlang.org)

</div>

---

## 📋 درباره سامانه

**STEELMETRICS** یک سامانه تحت وب برای ثبت متمرکز اطلاعات تولید، مدیریت سوابق ذوب‌ها و تحلیل عملکرد فرایندهای اصلی فولادسازی است.

### واحدهای تحت پوشش:
- ⚡ **EAF** — کوره قوس الکتریکی (Electric Arc Furnace)
- 🔧 **LF** — کوره پاتیلی (Ladle Furnace)
- 🏭 **CCM** — ریخته‌گری مداوم (Continuous Casting Machine)

---

## 🚀 راه‌اندازی سریع

### پیش‌نیازها:
- **Node.js** نسخه 18 یا بالاتر ([دانلود](https://nodejs.org))
- **npm** نسخه 9 یا بالاتر (همراه Node.js نصب می‌شود)

### روش ۱: استفاده از فایل BAT (ویندوز)

1. فایل `start.bat` را اجرا کنید
2. مرورگر به‌صورت خودکار باز می‌شود
3. از یکی از کاربران آزمایشی استفاده کنید

### روش ۲: دستورات خط فرمان

```bash
# نصب وابستگی‌ها
npm install

# اجرای سرور توسعه
npm run dev

# ساخت نسخه production
npm run build
```

---

## 👥 کاربران آزمایشی

| نام کاربری | نقش | دسترسی |
|------------|-----|--------|
| `admin` | مدیر سامانه | دسترسی کامل |
| `eaf_operator` | کاربر EAF | کوره قوس الکتریکی |
| `lf_operator` | کاربر LF | کوره پاتیلی |
| `ccm_operator` | کاربر CCM | ریخته‌گری مداوم |
| `shift_sup` | سرپرست شیفت | نظارت بر همه واحدها |
| `prod_manager` | مدیر تولید | مشاهده و گزارش‌ها |

**رمز عبور:** هر مقداری وارد کنید (حالت نمایشی)

---

## 📁 ساختار پروژه

```
steelmetrics/
├── src/
│   ├── components/       # کامپوننت‌های مشترک
│   │   └── Layout.tsx    # قالب اصلی با سایدبار
│   ├── contexts/         # Contextهای React
│   │   ├── AuthContext.tsx    # مدیریت احراز هویت
│   │   └── DataContext.tsx    # مدیریت داده‌ها
│   ├── data/
│   │   └── mockData.ts   # داده‌های نمونه و تایپ‌ها
│   ├── pages/            # صفحات سامانه
│   │   ├── LoginPage.tsx      # صفحه ورود
│   │   ├── DashboardPage.tsx  # داشبورد اصلی
│   │   ├── HeatsListPage.tsx  # فهرست ذوب‌ها
│   │   ├── HeatDetailPage.tsx # جزئیات ذوب
│   │   ├── EAFPage.tsx        # فرم EAF
│   │   ├── LFPage.tsx         # فرم LF
│   │   ├── CCMPage.tsx        # فرم CCM
│   │   ├── ReportsPage.tsx    # گزارش‌ها
│   │   ├── UsersPage.tsx      # مدیریت کاربران
│   │   ├── AuditLogPage.tsx   # سوابق تغییرات
│   │   └── BackupPage.tsx     # پشتیبان‌گیری
│   ├── utils/
│   │   └── jalali.ts     # تبدیل تاریخ شمسی
│   ├── App.tsx           # روتینگ اصلی
│   ├── main.tsx          # نقطه ورود
│   └── index.css         # استایل‌های سراسری
├── public/               # فایل‌های عمومی
├── dist/                 # خروجی build
├── start.bat             # اجرای سرور توسعه
├── build.bat             # ساخت نسخه production
└── package.json
```

---

## 🎯 قابلیت‌های اصلی

### ✅ پیاده‌سازی شده (نسخه ۱.۰):

- [x] احراز هویت و مدیریت نقش‌ها
- [x] داشبورد تحلیلی با نمودارها
- [x] مدیریت ذوب‌ها با Heat ID
- [x] پشتیبانی از ذوب اصلی و فرعی
- [x] فرم کامل EAF (۱۳ بخش)
- [x] فرم کامل LF (۱۱ بخش)
- [x] فرم کامل CCM (۱۲ بخش)
- [x] جست‌وجو و فیلتر ذوب‌ها
- [x] رهگیری مسیر تولید
- [x] گزارش‌های مدیریتی (۱۰ گزارش)
- [x] مدیریت کاربران و ماتریس دسترسی
- [x] سوابق تغییرات (Audit Trail)
- [x] بخش پشتیبان‌گیری
- [x] رابط فارسی RTL
- [x] تقویم شمسی
- [x] طراحی واکنش‌گرا (Responsive)

### 🔜 توسعه‌های آینده:

- [ ] اتصال به Backend واقعی (Node.js/Python)
- [ ] پایگاه داده PostgreSQL
- [ ] اتصال به PLC و تجهیزات
- [ ] ورود داده از فایل Excel
- [ ] اپلیکیشن موبایل
- [ ] هوش مصنوعی برای پیش‌بینی
- [ ] پشتیبانی چند کارخانه‌ای

---

## 🛠️ تکنولوژی‌ها

| لایه | فناوری |
|------|--------|
| Frontend | React 18 + TypeScript |
| Routing | React Router v6 |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Build | Vite |
| Calendar | Jalali (شمسی) |

---

## 🔐 امنیت (توصیه‌ها برای استقرار)

1. **HTTPS** — حتماً از SSL/TLS استفاده کنید
2. **Backend** — API را با احراز هویت JWT پیاده‌سازی کنید
3. **پایگاه داده** — رمزهای عبور را با bcrypt هش کنید
4. **CORS** — فقط دامنه‌های مجاز را اجازه دهید
5. **Rate Limiting** — محدودیت تلاش ورود
6. **Audit Log** — تمام عملیات‌ها را ثبت کنید
7. **Backup** — پشتیبان‌گیری روزانه خودکار

---

## 📊 معماری پیشنهادی Backend

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend API   │────▶│   PostgreSQL    │
│   (React)       │◀────│   (Node.js)     │◀────│   Database      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                        │
        │                        ▼
        │                 ┌─────────────────┐
        └────────────────▶│   Redis Cache   │
                          └─────────────────┘
```

---

## 📝 مستندات PRD

سند کامل نیازمندی‌های محصول (PRD) شامل:
- معرفی محصول و ذی‌نفعان
- محدوده پروژه
- ساختار صفحات
- مدیریت ذوب و Heat ID
- نیازمندی‌های فرم‌ها (EAF, LF, CCM)
- قوانین اعتبارسنجی
- گزارش‌ها و داشبورد
- مدیریت کاربران و دسترسی
- امنیت و پشتیبان‌گیری
- معماری فنی
- معیارهای پذیرش

---

## 🌐 دامنه

**steelmetrics.ir** — دامنه اصلی سامانه

---

## 📞 پشتیبانی

برای گزارش مشکلات یا درخواست قابلیت‌های جدید:
- ایمیل: support@steelmetrics.ir
- وب‌سایت: https://steelmetrics.ir

---

## 📄 مجوز

این نرم‌افزار تحت مجوز اختصاصی منتشر شده است.
استفاده تجاری بدون اجازه کتبی ممنوع است.

---

<div align="center">

**STEELMETRICS** — سامانه مدیریت و تحلیل تولید فولاد

نسخه ۱.۰ | ۱۴۰۳

</div>
