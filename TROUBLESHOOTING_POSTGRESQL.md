# 🚨 حل مشکل اتصال به PostgreSQL

## ❌ خطای شما

```
Error: connect ECONNREFUSED ::1:5432
Error: connect ECONNREFUSED 127.0.0.1:5432
```

این خطا یعنی **PostgreSQL در حال اجرا نیست** یا **تنظیمات اتصال نادرست است**.

---

## ✅ راه‌حل سریع (3 مرحله)

### مرحله ۱: بررسی و شروع PostgreSQL

```bash
# در CMD (با Administrator):
net start postgresql-x64-16
```

**اگر خطا داد:**
1. `Win + R` → `services.msc`
2. پیدا کردن `postgresql-x64-16`
3. کلیک راست → `Start`

---

### مرحله ۲: ایجاد Database

```bash
psql -U postgres
```

رمز عبور `postgres` را وارد کنید، سپس:

```sql
CREATE DATABASE steelmetrics;
\q
```

---

### مرحله ۳: تنظیم server/.env

فایل `server/.env` را ویرایش کنید:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=steelmetrics
DB_USER=postgres
DB_PASSWORD=postgres123  # رمز عبور PostgreSQL شما
```

---

## 🔍 تست اتصال

```bash
cd server
npm run test-db
```

**اگر موفق بود:**
```
✅ Connected to PostgreSQL successfully!
   Server time: 2024-...
   Database: steelmetrics
   ✅ Table "users" exists
   Users count: 1
🎉 Database connection test passed!
```

**اگر خطا داد:**
- پیام خطا را بخوانید
- راه‌حل پیشنهادی را اجرا کنید

---

## 🐛 عیب‌یابی پیشرفته

### مشکل ۱: PostgreSQL نصب نیست

**راه‌حل:**
1. دانلود از: https://www.postgresql.org/download/windows/
2. نصب با تنظیمات پیش‌فرض
3. رمز عبور برای `postgres` تنظیم کنید

---

### مشکل ۲: PostgreSQL در حال اجرا نیست

**راه‌حل:**
```bash
# در CMD (با Administrator):
net start postgresql-x64-16
```

یا از **Services**:
1. `Win + R` → `services.msc`
2. `postgresql-x64-16` → `Start`

---

### مشکل ۳: Database وجود ندارد

**راه‌حل:**
```bash
psql -U postgres
CREATE DATABASE steelmetrics;
\q
```

---

### مشکل ۴: رمز عبور نادرست

**راه‌حل:**
1. فایل `server/.env` را باز کنید
2. `DB_PASSWORD` را با رمز عبور PostgreSQL جایگزین کنید
3. Backend را ری‌استارت کنید

---

### مشکل ۵: Port 5432 مسدود است

**راه‌حل:**
```bash
# بررسی Port
netstat -an | findstr 5432
```

**اگر خروجی نداشت:**
- PostgreSQL در حال اجرا نیست
- Firewall Port را مسدود کرده

**راه‌حل Firewall:**
1. Windows Defender Firewall
2. Advanced settings
3. Inbound Rules
4. New Rule → Port → TCP → 5432 → Allow

---

## 📊 بررسی وضعیت

### بررسی Service

```bash
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
```

### بررسی Database

```bash
psql -U postgres -l
```

**خروجی مورد انتظار:**
```
List of databases
    Name      |  Owner
--------------+----------
 steelmetrics | postgres
```

---

## 🎯 دستورات کامل

```bash
# 1. شروع PostgreSQL
net start postgresql-x64-16

# 2. ایجاد Database
psql -U postgres -c "CREATE DATABASE steelmetrics;"

# 3. تنظیم server/.env
notepad server/.env

# 4. تست اتصال
cd server
npm run test-db

# 5. اجرای Migration
npm run migrate
npm run migrate:setup
npm run migrate:password
npm run seed

# 6. اجرای Backend
npm run dev
```

---

## 📞 پشتیبانی

اگر مشکل حل نشد:
1. پیام خطا را کپی کنید
2. خروجی `npm run test-db` را ارسال کنید
3. فایل `server/.env` را بررسی کنید (بدون رمز عبور)

- **Email:** support@steelmetrics.ir
- **Documentation:** POSTGRESQL_SETUP_GUIDE.md

---

**نسخه:** 1.0.0  
**تاریخ:** 1403/09/17  
**دامنه:** steelmetrics.ir
