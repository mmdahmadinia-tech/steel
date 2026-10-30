# 🔐 راهنمای ورود به STEELMETRICS

## ✅ مشکل حل شد!

سیستم اکنون در **حالت Demo** کار می‌کند و نیازی به Backend ندارد.

---

## 👥 کاربران پیش‌فرض

| نقش | نام کاربری | رمز عبور |
|-----|-----------|----------|
| **مدیر سایت** | `19029` | `19029` |
| **کاربر EAF** | `19377` | `19377` |
| **کاربر LF** | `19513` | `19513` |
| **کاربر CCM** | `19616` | `19616` |
| **تحلیلگر** | `19452` | `19452` |

---

## 🚀 نحوه ورود

1. **سرور را اجرا کنید:**
   ```bash
   # روی START.bat دابل‌کلیک کنید
   # یا:
   npm run dev
   ```

2. **مرورگر را باز کنید:**
   ```
   http://localhost:3001
   ```

3. **وارد شوید:**
   - نام کاربری: `19029`
   - رمز عبور: `19029`
   - روی دکمه "🔥 ورود به سامانه" کلیک کنید

---

## 🎯 حالت‌های کاری

### حالت 1: Demo Mode (بدون Backend)
- ✅ داده‌ها در localStorage ذخیره می‌شوند
- ✅ نیازی به راه‌اندازی Backend نیست
- ✅ مناسب برای تست و توسعه
- ⚠️ داده‌ها فقط در مرورگر شما ذخیره می‌شوند

### حالت 2: Production Mode (با Backend)
- ✅ داده‌ها در PostgreSQL ذخیره می‌شوند
- ✅ نیاز به راه‌اندازی Backend و Database
- ✅ مناسب برای استفاده واقعی
- ✅ پشتیبانی از چند کاربر همزمان

---

## 🔧 راه‌اندازی Backend (اختیاری)

اگر می‌خواهید از Backend واقعی استفاده کنید:

### 1. نصب PostgreSQL
```bash
# Ubuntu/Debian
sudo apt install postgresql

# macOS
brew install postgresql

# Windows
# دانلود از https://www.postgresql.org/download/windows/
```

### 2. ایجاد Database
```bash
createdb steelmetrics
```

### 3. راه‌اندازی Backend
```bash
cd server
npm install
cp .env.example .env
nano .env  # تنظیمات Database

# اجرای Migration
npm run migrate

# Seed داده‌های اولیه
npm run seed

# اجرای سرور
npm run dev
```

### 4. تنظیم Frontend
```bash
cd client
cp .env.example .env
nano .env
# VITE_API_URL=http://localhost:5000/api

npm run dev
```

---

## 📊 ساختار داده‌ها

### Demo Mode:
```
localStorage
├── steelmetrics_heats     # اطلاعات ذوب‌ها
├── steelmetrics_current_user  # کاربر فعلی
└── steelmetrics_users     # لیست کاربران
```

### Production Mode:
```
PostgreSQL Database
├── users                  # کاربران
├── heats                  # ذوب‌ها
├── eaf_data              # داده‌های EAF
├── lf_data               # داده‌های LF
├── ccm_data              # داده‌های CCM
├── notifications         # اعلان‌ها
└── audit_logs           # سوابق تغییرات
```

---

## 🐛 عیب‌یابی

### مشکل: "رمز عبور اشتباه است"

**راه‌حل 1:** پاک کردن localStorage
```javascript
// در Console مرورگر (F12):
localStorage.clear()
// سپس صفحه را رفرش کنید (F5)
```

**راه‌حل 2:** استفاده از مرورگر ناشناس
- یک پنجره Incognito/Private باز کنید
- به `http://localhost:3001` بروید

**راه‌حل 3:** بررسی کاربران
```javascript
// در Console مرورگر (F12):
console.log(JSON.parse(localStorage.getItem('steelmetrics_users')))
```

---

### مشکل: "Backend not available"

این یک پیام طبیعی است و نشان می‌دهد سیستم در حالت Demo کار می‌کند.

اگر می‌خواهید Backend را فعال کنید:
1. Backend را راه‌اندازی کنید (مراحل بالا)
2. Frontend را رفرش کنید
3. سیستم به صورت خودکار Backend را شناسایی می‌کند

---

## 📝 نکات مهم

1. **در حالت Demo:**
   - داده‌ها فقط در مرورگر شما ذخیره می‌شوند
   - با پاک کردن cache، داده‌ها از بین می‌روند
   - مناسب برای تست و نمایش

2. **در حالت Production:**
   - داده‌ها در Database ذخیره می‌شوند
   - چند کاربر می‌توانند همزمان کار کنند
   - مناسب برای استفاده واقعی

3. **تغییر بین حالت‌ها:**
   - سیستم به صورت خودکار Backend را شناسایی می‌کند
   - اگر Backend موجود باشد، از آن استفاده می‌کند
   - اگر Backend موجود نباشد، از localStorage استفاده می‌کند

---

## 🎯 کاربران پیش‌فرض

### مدیر سایت (19029)
- دسترسی کامل به همه بخش‌ها
- مدیریت کاربران
- مشاهده و ویرایش همه ذوب‌ها
- ارسال اعلان

### کاربر EAF (19377)
- دسترسی به کوره قوس الکتریکی
- ثبت و ویرایش اطلاعات EAF
- مشاهده ذوب‌های EAF

### کاربر LF (19513)
- دسترسی به کوره پاتیلی
- ثبت و ویرایش اطلاعات LF
- مشاهده ذوب‌های LF

### کاربر CCM (19616)
- دسترسی به ریخته‌گری مداوم
- ثبت و ویرایش اطلاعات CCM
- مشاهده ذوب‌های CCM

### تحلیلگر (19452)
- دسترسی مشاهده به همه بخش‌ها
- دانلود گزارش‌ها
- مشاهده نمودارها

---

## 📞 پشتیبانی

- **Email:** support@steelmetrics.ir
- **Website:** https://steelmetrics.ir

---

**نسخه:** 2.0.0  
**تاریخ:** 1403/09/17  
**دامنه:** steelmetrics.ir

---

## ✨ خلاصه

✅ مشکل ورود حل شد  
✅ سیستم در حالت Demo کار می‌کند  
✅ نیازی به Backend نیست  
✅ کاربران پیش‌فرض آماده هستند  

**ورود:**
- نام کاربری: `19029`
- رمز عبور: `19029`

موفق باشید! 🎉
