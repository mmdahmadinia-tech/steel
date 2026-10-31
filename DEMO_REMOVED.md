# ✅ حالت Demo حذف شد - سیستم فقط با Backend کار می‌کند

## 🎯 تغییرات اعمال شده

### 1. AuthContext.tsx
- ❌ حذف حالت Demo
- ✅ فقط از Backend API استفاده می‌کند
- ✅ JWT Authentication واقعی
- ✅ پیام خطا در صورت عدم دسترسی به Backend

### 2. DataContext.tsx
- ❌ حذف localStorage fallback
- ✅ فقط از Backend API استفاده می‌کند
- ✅ مدیریت خطای کامل
- ✅ پیام خطا در صورت عدم دسترسی به Backend

### 3. LoginPage.tsx
- ✅ نمایش پیام "Backend مورد نیاز است"
- ✅ نمایش خطاهای اتصال
- ✅ راهنمایی برای راه‌اندازی Backend

---

## 🚀 راه‌اندازی سیستم

### مرحله 1: نصب PostgreSQL

```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql@16

# Windows
# دانلود از https://www.postgresql.org/download/windows/
```

### مرحله 2: ایجاد Database

```bash
psql -U postgres
CREATE DATABASE steelmetrics;
\q
```

### مرحله 3: راه‌اندازی Backend

```bash
cd server

# نصب وابستگی‌ها
npm install

# تنظیم Environment Variables
cp .env.example .env
nano .env  # تنظیمات Database و JWT

# اجرای Migration
npm run migrate

# Seed داده‌های اولیه
npm run seed

# اجرای سرور
npm run dev
```

Backend روی `http://localhost:5000` اجرا می‌شود.

### مرحله 4: راه‌اندازی Frontend

```bash
cd ..  # برگشت به ریشه پروژه

# نصب وابستگی‌ها
npm install

# تنظیم Environment Variables
cp .env.example .env
nano .env  # تنظیم VITE_API_URL

# اجرای سرور
npm run dev
```

Frontend روی `http://localhost:3001` اجرا می‌شود.

---

## 🔐 ورود به سیستم

| نقش | نام کاربری | رمز عبور |
|-----|-----------|----------|
| مدیر سایت | `19029` | `19029` |
| کاربر EAF | `19377` | `19377` |
| کاربر LF | `19513` | `19513` |
| کاربر CCM | `19616` | `19616` |
| تحلیلگر | `19452` | `19452` |

---

## 📁 فایل‌های راهنما

- **BACKEND_SETUP.md** - راهنمای کامل راه‌اندازی Backend
- **README.md** - راهنمای اصلی پروژه
- **LIARA_DEPLOYMENT.md** - راهنمای استقرار روی Liara
- **AUDIT_REPORT.md** - گزارش ممیزی کامل

---

## ⚠️ نکات مهم

### 1. Backend مورد نیاز است
سیستم بدون Backend کار نمی‌کند. حتماً Backend را راه‌اندازی کنید.

### 2. PostgreSQL مورد نیاز است
داده‌ها در PostgreSQL ذخیره می‌شوند. حتماً PostgreSQL را نصب و راه‌اندازی کنید.

### 3. JWT Secret را تغییر دهید
در Production، حتماً JWT_SECRET را تغییر دهید:
```bash
openssl rand -base64 32
```

### 4. رمز کاربران پیش‌فرض را تغییر دهید
پس از اولین ورود، رمز کاربران پیش‌فرض را تغییر دهید.

---

## 🐛 عیب‌یابی

### مشکل: "Backend not available"

**راه‌حل:**
1. Backend را راه‌اندازی کنید: `cd server && npm run dev`
2. بررسی کنید Backend روی `http://localhost:5000` اجرا می‌شود
3. VITE_API_URL را در `.env` Frontend بررسی کنید

### مشکل: "Database connection failed"

**راه‌حل:**
1. PostgreSQL را راه‌اندازی کنید
2. Database `steelmetrics` را ایجاد کنید
3. تنظیمات Database در `server/.env` را بررسی کنید

### مشکل: "Migration failed"

**راه‌حل:**
```bash
# حذف و ایجاد مجدد database
psql -U postgres -c "DROP DATABASE steelmetrics;"
psql -U postgres -c "CREATE DATABASE steelmetrics;"

# اجرای مجدد migration
cd server
npm run migrate
npm run seed
```

---

## 📊 ساختار سیستم

```
مرورگر ←→ Frontend (React) ←→ Backend (Node.js) ←→ PostgreSQL
         ↓                    ↓                      ↓
    JWT Token           REST API              Database Tables
```

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL
- JWT Authentication
- bcrypt

### Database
- PostgreSQL 16
- JSONB برای داده‌های پیچیده
- Index‌گذاری برای سرعت
- Foreign Keys برای یکپارچگی

---

## 🎯 ویژگی‌های سیستم

### Frontend
- ✅ 15 صفحه کامل
- ✅ 20+ کامپوننت
- ✅ Responsive Design
- ✅ Dark/Light Mode
- ✅ RTL Support
- ✅ Jalali Calendar

### Backend
- ✅ RESTful API
- ✅ JWT Authentication
- ✅ Role-based Access Control
- ✅ Unit-based Access Control
- ✅ Audit Logging
- ✅ Input Validation

### Database
- ✅ PostgreSQL 16
- ✅ JSONB برای داده‌های پیچیده
- ✅ Foreign Keys
- ✅ Index‌ها
- ✅ Transactions

---

## 📞 پشتیبانی

- **Email:** support@steelmetrics.ir
- **Website:** https://steelmetrics.ir
- **Documentation:** BACKEND_SETUP.md

---

**نسخه:** 2.0.0  
**تاریخ:** 1403/09/17  
**دامنه:** steelmetrics.ir  
**وضعیت:** ✅ **Backend مورد نیاز است**

---

## ✨ خلاصه

✅ **حالت Demo حذف شد**  
✅ **سیستم فقط با Backend کار می‌کند**  
✅ **داده‌ها در PostgreSQL ذخیره می‌شوند**  
✅ **احراز هویت با JWT**  
✅ **امنیت بهبود یافته**  

**مراحل راه‌اندازی:**
1. نصب PostgreSQL
2. ایجاد Database
3. راه‌اندازی Backend
4. راه‌اندازی Frontend
5. ورود با `19029` / `19029`

**فایل راهنما:** `BACKEND_SETUP.md`

موفق باشید! 🎉
