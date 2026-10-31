# 🗄️ راهنمای نصب و راه‌اندازی PostgreSQL برای STEELMETRICS

## 📋 مراحل نصب

### مرحله ۱: دانلود PostgreSQL

1. به آدرس زیر بروید:
   ```
   https://www.postgresql.org/download/windows/
   ```

2. روی **"Download the installer"** کلیک کنید

3. نسخه **PostgreSQL 16** را دانلود کنید

---

### مرحله ۲: نصب PostgreSQL

1. فایل نصب را اجرا کنید

2. در مراحل نصب:
   - **Installation Directory**: پیش‌فرض را قبول کنید
   - **Select Components**: همه را انتخاب کنید
   - **Data Directory**: پیش‌فرض را قبول کنید
   - **Password**: یک رمز عبور قوی برای کاربر `postgres` تنظیم کنید
     - مثال: `postgres123`
     - **مهم**: این رمز را به خاطر بسپارید!
   - **Port**: `5432` (پیش‌فرض)
   - **Locale**: `Default locale`

3. نصب را تکمیل کنید

---

### مرحله ۳: بررسی نصب

```bash
# در CMD:
psql --version
```

**خروجی مورد انتظار:**
```
psql (PostgreSQL) 16.x
```

---

### مرحله ۴: ایجاد Database

```bash
# اتصال به PostgreSQL
psql -U postgres

# رمز عبور postgres را وارد کنید

# ایجاد Database
CREATE DATABASE steelmetrics;

# بررسی ایجاد Database
\l

# خروج از PostgreSQL
\q
```

---

### مرحله ۵: تنظیم فایل `.env`

فایل `server/.env` را ویرایش کنید:

```env
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=steelmetrics
DB_USER=postgres
DB_PASSWORD=postgres123  # رمز عبور PostgreSQL شما

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:3001
```

**مهم**: `DB_PASSWORD` را با رمز عبور PostgreSQL خود جایگزین کنید.

---

### مرحله ۶: تست اتصال

```bash
cd server

# تست اتصال به Database
npm run migrate
```

**اگر موفق بود:**
```
🚀 Starting database migration...
✅ Users table created
✅ Heats table created
...
🎉 Migration completed successfully!
```

**اگر خطا داد:**
- بررسی کنید PostgreSQL در حال اجرا است
- بررسی کنید رمز عبور در `.env` صحیح است
- بررسی کنید Database `steelmetrics` ایجاد شده است

---

### مرحله ۷: اجرای Migration و Seed

```bash
cd server

# اجرای Migration اصلی
npm run migrate

# اجرای Migration برای Setup
npm run migrate:setup

# اجرای Migration برای تغییر رمز
npm run migrate:password

# Seed داده‌های اولیه
npm run seed
```

**خروجی مورد انتظار:**
```
✅ Initial admin account created with initial password: 123456
⚠️  Admin must change password on first login
```

---

### مرحله ۸: اجرای Backend

```bash
npm run dev
```

**خروجی مورد انتظار:**
```
✅ Connected to PostgreSQL database
╔═══════════════════════════════════════════════════════════╗
║     STEELMETRICS Backend API v2.0.0                      ║
║        Server running on port 5000                       ║
╚═══════════════════════════════════════════════════════════╝
```

---

## 🐛 عیب‌یابی

### مشکل ۱: `ECONNREFUSED`

**علت**: PostgreSQL در حال اجرا نیست

**راه‌حل**:
```bash
# در CMD (با Administrator):
net start postgresql-x64-16
```

یا از **Services**:
1. `Win + R` → `services.msc`
2. پیدا کردن `postgresql-x64-16`
3. کلیک راست → `Start`

---

### مشکل ۲: `password authentication failed`

**علت**: رمز عبور در `.env` نادرست است

**راه‌حل**:
1. فایل `server/.env` را باز کنید
2. `DB_PASSWORD` را با رمز عبور PostgreSQL جایگزین کنید
3. Backend را ری‌استارت کنید

---

### مشکل ۳: `database "steelmetrics" does not exist`

**علت**: Database ایجاد نشده است

**راه‌حل**:
```bash
psql -U postgres
CREATE DATABASE steelmetrics;
\q
```

---

### مشکل ۴: `permission denied`

**علت**: کاربر `postgres` دسترسی ندارد

**راه‌حل**:
```bash
psql -U postgres

# اعطای دسترسی
GRANT ALL PRIVILEGES ON DATABASE steelmetrics TO postgres;

\q
```

---

## 📊 بررسی وضعیت PostgreSQL

### بررسی Service

```bash
# در CMD:
sc query postgresql-x64-16
```

**خروجی مورد انتظار:**
```
STATE              : 4  RUNNING
```

### بررسی Port

```bash
netstat -an | findstr 5432
```

**خروجی مورد انتظار:**
```
TCP    0.0.0.0:5432    0.0.0.0:0    LISTENING
TCP    [::]:5432       [::]:0       LISTENING
```

### بررسی Database

```bash
psql -U postgres -l
```

**خروجی مورد انتظار:**
```
List of databases
    Name      |  Owner   | Encoding
--------------+----------+----------
 postgres     | postgres | UTF8
 steelmetrics | postgres | UTF8
 template0    | postgres | UTF8
 template1    | postgres | UTF8
```

---

## 🔐 امنیت

### تغییر رمز عبور postgres

```bash
psql -U postgres

# تغییر رمز
ALTER USER postgres WITH PASSWORD 'new_secure_password';

\q
```

فراموش نکنید `server/.env` را به‌روزرسانی کنید.

### ایجاد کاربر جدید (اختیاری)

```bash
psql -U postgres

# ایجاد کاربر
CREATE USER steelmetrics_user WITH PASSWORD 'secure_password';

# اعطای دسترسی
GRANT ALL PRIVILEGES ON DATABASE steelmetrics TO steelmetrics_user;

\q
```

سپس در `server/.env`:
```env
DB_USER=steelmetrics_user
DB_PASSWORD=secure_password
```

---

## 📝 چک‌لیست نصب

- [ ] PostgreSQL 16 نصب شده
- [ ] رمز عبور `postgres` تنظیم شده
- [ ] Database `steelmetrics` ایجاد شده
- [ ] `server/.env` تنظیم شده
- [ ] PostgreSQL در حال اجرا است
- [ ] Migration اجرا شده
- [ ] Seed اجرا شده
- [ ] Backend اجرا شده
- [ ] اتصال موفق بود

---

## 🎯 خلاصه

### دستورات سریع

```bash
# 1. نصب PostgreSQL از سایت رسمی

# 2. ایجاد Database
psql -U postgres
CREATE DATABASE steelmetrics;
\q

# 3. تنظیم server/.env
nano server/.env

# 4. اجرای Migration
cd server
npm run migrate
npm run migrate:setup
npm run migrate:password
npm run seed

# 5. اجرای Backend
npm run dev
```

### اطلاعات اتصال پیش‌فرض

| مورد | مقدار |
|------|--------|
| Host | `localhost` |
| Port | `5432` |
| Database | `steelmetrics` |
| User | `postgres` |
| Password | `postgres123` (تغییر دهید) |

---

**نسخه:** 1.0.0  
**تاریخ:** 1403/09/17  
**دامنه:** steelmetrics.ir

---

## ✨ نتیجه

پس از نصب و راه‌اندازی PostgreSQL:
1. Database `steelmetrics` ایجاد شده
2. Migration‌ها اجرا شده‌اند
3. Backend به Database متصل است
4. سیستم آماده استفاده است

موفق باشید! 🎉
