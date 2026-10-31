# 🔐 راهنمای راه‌اندازی امن STEELMETRICS

## 🎯 تغییرات امنیتی اعمال شده

### ✅ حذف کامل حالت Demo
- ❌ هیچ کاربر پیش‌فرض با رمز ثابت وجود ندارد
- ❌ هیچ Fallback به localStorage وجود ندارد
- ❌ سیستم بدون Backend کار نمی‌کند

### ✅ سیستم Setup امن
- ✅ فعال‌سازی Admin فقط با توکن یک‌بارمصرف
- ✅ توکن دارای تاریخ انقضا (۲۴ ساعت)
- ✅ توکن پس از استفاده باطل می‌شود
- ✅ رمز عبور با bcrypt (salt rounds: 12) هش می‌شود

### ✅ مدیریت کاربران
- ✅ فقط Admin می‌تواند کاربر ایجاد کند
- ✅ Role-based Access Control (RBAC)
- ✅ Unit-based Access Control
- ✅ Audit Logging برای تمام عملیات‌ها

---

## 🚀 مراحل راه‌اندازی

### مرحله ۱: نصب و راه‌اندازی PostgreSQL

```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# ایجاد Database
sudo -u postgres psql
CREATE DATABASE steelmetrics;
\q
```

### مرحله ۲: راه‌اندازی Backend

```bash
cd server

# نصب وابستگی‌ها
npm install

# تنظیم Environment Variables
cp .env.example .env
nano .env
```

**تنظیمات مهم در `.env`:**
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=steelmetrics
DB_USER=postgres
DB_PASSWORD=your_secure_password

# JWT - حتماً تغییر دهید!
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3001
```

### مرحله ۳: اجرای Migration

```bash
# Migration اصلی (ایجاد جداول)
npm run migrate

# Migration Setup (ایجاد جدول setup_tokens)
npm run migrate:setup
```

### مرحله ۴: Seed اولیه

```bash
# ایجاد Admin اولیه (غیرفعال)
npm run seed
```

**خروجی:**
```
✅ Initial admin account created (inactive)
⚠️  Admin account needs to be activated via Setup process
```

### مرحله ۵: اجرای Backend

```bash
npm run dev
```

Backend روی `http://localhost:5000` اجرا می‌شود.

### مرحله ۶: راه‌اندازی Frontend

```bash
cd ..  # برگشت به ریشه پروژه

# نصب وابستگی‌ها
npm install

# تنظیم Environment Variables
cp .env.example .env
nano .env
```

**تنظیمات در `.env`:**
```env
VITE_API_URL=http://localhost:5000/api
```

```bash
# اجرای Frontend
npm run dev
```

Frontend روی `http://localhost:3001` اجرا می‌شود.

---

## 🔑 مرحله ۷: فعال‌سازی Admin

### ۷.۱. باز کردن صفحه Setup

مرورگر را باز کنید:
```
http://localhost:3001/setup
```

### ۷.۲. تولید توکن فعال‌سازی

1. روی دکمه **"تولید توکن فعال‌سازی"** کلیک کنید
2. توکن تولید شده را **در جای امنی ذخیره کنید**
3. توکن فقط **یک بار** قابل استفاده است
4. توکن تا **۲۴ ساعت** معتبر است

**مثال توکن:**
```
a1b2c3d4e5f6... (64 کاراکتر hex)
```

### ۷.۳. فعال‌سازی حساب Admin

1. توکن را در فیلد وارد کنید
2. روی **"ادامه"** کلیک کنید
3. رمز عبور قوی وارد کنید (حداقل ۸ کاراکتر)
4. رمز عبور را تکرار کنید
5. روی **"فعال‌سازی حساب مدیر"** کلیک کنید

### ۷.۴. ورود به سیستم

1. به صفحه ورود بروید: `http://localhost:3001/login`
2. نام کاربری: `admin`
3. رمز عبور: رمزی که در مرحله قبل تعیین کردید
4. وارد شوید

---

## 👥 مرحله ۸: ایجاد کاربران

پس از ورود به عنوان Admin:

### ۸.۱. رفتن به مدیریت کاربران

از منوی سمت راست، روی **"👥 مدیریت کاربران"** کلیک کنید.

### ۸.۲. ایجاد کاربر جدید

1. روی دکمه **"+ کاربر جدید"** کلیک کنید
2. اطلاعات را وارد کنید:
   - **نام کاربری**: کد پرسنلی (مثلاً: `19377`)
   - **رمز عبور**: رمز قوی
   - **نام کامل**: نام و نام خانوادگی
   - **نقش**: یکی از نقش‌های زیر
   - **دسترسی واحدها**: EAF, LF, CCM

### ۸.۳. نقش‌های موجود

| نقش | توضیحات | دسترسی |
|-----|---------|--------|
| **Super Admin** | مدیر اصلی | دسترسی کامل |
| **EAF Operator** | اپراتور کوره قوس | فقط EAF |
| **LF Operator** | اپراتور کوره پاتیلی | فقط LF |
| **CCM Operator** | اپراتور ریخته‌گری | فقط CCM |
| **Analytical Viewer** | تحلیلگر | مشاهده همه |

---

## 🔒 امنیت

### رمزنگاری رمز عبور
- الگوریتم: **bcrypt**
- Salt rounds: **12**
- هر رمز عبور به صورت یکتا هش می‌شود

### JWT Token
- الگوریتم: **HS256**
- مدت اعتبار: **24 ساعت** (قابل تنظیم)
- ذخیره در: **localStorage** (می‌تواند به HttpOnly Cookie تغییر کند)

### توکن فعال‌سازی
- طول: **64 کاراکتر hex** (256 bit)
- مدت اعتبار: **24 ساعت**
- یک‌بار مصرف: **بله**
- ذخیره در: **PostgreSQL**

### Audit Logging
تمام عملیات‌های مهم ثبت می‌شوند:
- ورود/خروج کاربران
- ایجاد/ویرایش/حذف ذوب‌ها
- تغییر رمز عبور
- ایجاد/ویرایش کاربران
- عملیات Setup

---

## 🐛 عیب‌یابی

### مشکل: "System requires initial setup"

**علت:** Admin فعال نشده است

**راه‌حل:**
1. به `http://localhost:3001/setup` بروید
2. مراحل Setup را کامل کنید

### مشکل: "Invalid or expired token"

**علت:** توکن منقضی شده یا قبلاً استفاده شده

**راه‌حل:**
1. یک توکن جدید تولید کنید
2. بلافاصله از آن استفاده کنید

### مشکل: "Admin account already activated"

**علت:** Admin قبلاً فعال شده است

**راه‌حل:**
- مستقیماً به صفحه ورود بروید
- با `admin` و رمز تعیین شده وارد شوید

### مشکل: فراموشی رمز Admin

**راه‌حل:**
1. Backend را متوقف کنید
2. به PostgreSQL متصل شوید:
   ```bash
   psql -U postgres -d steelmetrics
   ```
3. Admin را غیرفعال کنید:
   ```sql
   UPDATE users SET is_active = false WHERE username = 'admin';
   ```
4. Backend را دوباره اجرا کنید
5. مراحل Setup را از ابتدا انجام دهید

---

## 📊 ساختار Database

### جدول users
```sql
- id (SERIAL PRIMARY KEY)
- username (VARCHAR(50) UNIQUE)
- password_hash (VARCHAR(255))  -- bcrypt hash
- full_name (VARCHAR(100))
- role (VARCHAR(20))  -- admin, eaf_user, lf_user, ccm_user, analyst
- is_active (BOOLEAN)  -- false تا زمان Setup
- unit_access (TEXT[])  -- ['EAF', 'LF', 'CCM']
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### جدول setup_tokens
```sql
- id (SERIAL PRIMARY KEY)
- token (VARCHAR(255) UNIQUE)  -- 64 char hex
- expires_at (TIMESTAMP)  -- 24 hours from creation
- used (BOOLEAN)  -- false تا زمان استفاده
- created_at (TIMESTAMP)
```

---

## 🎯 API Endpoints برای Setup

### POST /api/setup/generate-token
تولید توکن فعال‌سازی

**Response:**
```json
{
  "message": "Setup token generated successfully",
  "token": "a1b2c3d4e5f6...",
  "expiresAt": "2024-01-18T12:00:00.000Z",
  "instructions": "Use this token to activate the admin account..."
}
```

### POST /api/setup/activate
فعال‌سازی Admin

**Request:**
```json
{
  "token": "a1b2c3d4e5f6...",
  "password": "your_secure_password"
}
```

**Response:**
```json
{
  "message": "Admin account activated successfully",
  "instructions": "You can now login with username: admin"
}
```

### GET /api/setup/status
بررسی وضعیت Setup

**Response:**
```json
{
  "isSetup": false,
  "message": "System needs initial setup..."
}
```

---

## 📝 چک‌لیست نصب

- [ ] PostgreSQL نصب و راه‌اندازی شده
- [ ] Database `steelmetrics` ایجاد شده
- [ ] Backend نصب شده (`npm install`)
- [ ] Environment Variables تنظیم شده
- [ ] Migration اجرا شده (`npm run migrate`)
- [ ] Migration Setup اجرا شده (`npm run migrate:setup`)
- [ ] Seed اجرا شده (`npm run seed`)
- [ ] Backend در حال اجرا (`npm run dev`)
- [ ] Frontend نصب شده (`npm install`)
- [ ] Frontend در حال اجرا (`npm run dev`)
- [ ] صفحه Setup باز شده (`http://localhost:3001/setup`)
- [ ] توکن فعال‌سازی تولید شده
- [ ] توکن در جای امن ذخیره شده
- [ ] Admin فعال شده با رمز قوی
- [ ] ورود موفق با `admin`
- [ ] کاربران کارخانه ایجاد شده
- [ ] رمز کاربران پیش‌فرض تغییر کرده

---

## 📞 پشتیبانی

- **Email:** support@steelmetrics.ir
- **Website:** https://steelmetrics.ir

---

**نسخه:** 2.1.0  
**تاریخ:** 1403/09/17  
**دامنه:** steelmetrics.ir  
**وضعیت:** ✅ **امن و آماده Production**

---

## ✨ خلاصه

✅ **حالت Demo حذف شد**  
✅ **سیستم فقط با Backend کار می‌کند**  
✅ **Setup امن با توکن یک‌بارمصرف**  
✅ **رمز عبور با bcrypt هش می‌شود**  
✅ **Audit Logging کامل**  
✅ **RBAC و Unit-based Access Control**  

**مراحل راه‌اندازی:**
1. نصب PostgreSQL
2. راه‌اندازی Backend
3. اجرای Migration و Seed
4. راه‌اندازی Frontend
5. فعال‌سازی Admin با توکن
6. ایجاد کاربران کارخانه

**ورود اولیه:**
- نام کاربری: `admin`
- رمز عبور: رمزی که در Setup تعیین کردید

موفق باشید! 🎉
