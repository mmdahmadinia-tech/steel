# 🚀 راهنمای راه‌اندازی Backend

## ⚠️ مهم: Backend مورد نیاز است

سیستم STEELMETRICS اکنون **فقط با Backend** کار می‌کند. حالت Demo حذف شده است.

---

## 📋 پیش‌نیازها

1. **Node.js** نسخه 18 یا بالاتر
2. **PostgreSQL** نسخه 16 یا بالاتر
3. **npm** نسخه 9 یا بالاتر

---

## 🔧 مرحله 1: نصب PostgreSQL

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### macOS
```bash
brew install postgresql@16
brew services start postgresql@16
```

### Windows
1. دانلود از https://www.postgresql.org/download/windows/
2. نصب با تنظیمات پیش‌فرض
3. رمز عبور برای کاربر postgres تنظیم کنید

---

## 🗄️ مرحله 2: ایجاد Database

```bash
# ورود به PostgreSQL
psql -U postgres

# ایجاد database
CREATE DATABASE steelmetrics;

# ایجاد user (اختیاری - می‌توانید از postgres استفاده کنید)
CREATE USER steelmetrics_user WITH PASSWORD 'your_password';

# اعطای دسترسی
GRANT ALL PRIVILEGES ON DATABASE steelmetrics TO steelmetrics_user;

# خروج
\q
```

---

## 🔨 مرحله 3: راه‌اندازی Backend

### 3.1. نصب وابستگی‌ها
```bash
cd server
npm install
```

### 3.2. تنظیم Environment Variables
```bash
# کپی فایل نمونه
cp .env.example .env

# ویرایش فایل .env
nano .env  # یا با هر ویرایشگر دیگری
```

مقادیر را تنظیم کنید:
```env
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=steelmetrics
DB_USER=postgres  # یا steelmetrics_user
DB_PASSWORD=your_postgres_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3001
```

### 3.3. اجرای Migration
```bash
npm run migrate
```

این دستور جداول زیر را ایجاد می‌کند:
- users
- heats
- eaf_data
- lf_data
- ccm_data
- notifications
- audit_logs
- backups

### 3.4. Seed داده‌های اولیه
```bash
npm run seed
```

این دستور کاربران پیش‌فرض را ایجاد می‌کند:
- مدیر سایت: `19029` / `19029`
- کاربر EAF: `19377` / `19377`
- کاربر LF: `19513` / `19513`
- کاربر CCM: `19616` / `19616`
- تحلیلگر: `19452` / `19452`

### 3.5. اجرای سرور
```bash
npm run dev
```

Backend روی `http://localhost:5000` اجرا می‌شود.

---

## 🌐 مرحله 4: راه‌اندازی Frontend

### 4.1. نصب وابستگی‌ها
```bash
cd ..  # برگشت به ریشه پروژه
npm install
```

### 4.2. تنظیم Environment Variables
```bash
# کپی فایل نمونه
cp .env.example .env

# ویرایش فایل .env
nano .env
```

مقادیر را تنظیم کنید:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4.3. اجرای سرور توسعه
```bash
npm run dev
```

Frontend روی `http://localhost:3001` اجرا می‌شود.

---

## ✅ مرحله 5: تست سیستم

### 5.1. بررسی Backend
```bash
curl http://localhost:5000/health
```

پاسخ مورد انتظار:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "version": "2.0.0"
}
```

### 5.2. بررسی Frontend
مرورگر را باز کنید:
```
http://localhost:3001
```

### 5.3. ورود به سیستم
- نام کاربری: `19029`
- رمز عبور: `19029`

---

## 🐛 عیب‌یابی

### مشکل 1: "Connection refused" برای PostgreSQL

**راه‌حل:**
```bash
# بررسی وضعیت PostgreSQL
sudo systemctl status postgresql

# راه‌اندازی مجدد
sudo systemctl restart postgresql
```

### مشکل 2: "Database does not exist"

**راه‌حل:**
```bash
# ایجاد database
psql -U postgres -c "CREATE DATABASE steelmetrics;"
```

### مشکل 3: "Authentication failed"

**راه‌حل:**
- بررسی DB_USER و DB_PASSWORD در فایل .env
- اطمینان از وجود user در PostgreSQL

```bash
# بررسی کاربران
psql -U postgres -c "\du"
```

### مشکل 4: "Port 5000 already in use"

**راه‌حل:**
```bash
# تغییر PORT در فایل .env
PORT=5001

# یا پیدا کردن process اشغال‌کننده
lsof -i :5000
kill -9 <PID>
```

### مشکل 5: "CORS error" در Frontend

**راه‌حل:**
- بررسی CORS_ORIGIN در فایل .env Backend
- اطمینان از مطابقت با آدرس Frontend

```env
# در server/.env
CORS_ORIGIN=http://localhost:3001
```

### مشکل 6: "Migration failed"

**راه‌حل:**
```bash
# حذف و ایجاد مجدد database
psql -U postgres -c "DROP DATABASE steelmetrics;"
psql -U postgres -c "CREATE DATABASE steelmetrics;"

# اجرای مجدد migration
npm run migrate
```

---

## 📊 ساختار Database

### جداول اصلی

#### users
```sql
- id (SERIAL PRIMARY KEY)
- username (VARCHAR(50) UNIQUE)
- password_hash (VARCHAR(255))
- full_name (VARCHAR(100))
- role (VARCHAR(20))
- is_active (BOOLEAN)
- unit_access (TEXT[])
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### heats
```sql
- id (SERIAL PRIMARY KEY)
- heat_id (VARCHAR(50) UNIQUE)
- date (VARCHAR(20))
- shift (VARCHAR(10))
- steel_grade (VARCHAR(20))
- is_sub_heat (BOOLEAN)
- parent_heat_id (VARCHAR(50))
- eaf_status (VARCHAR(20))
- lf_status (VARCHAR(20))
- ccm_status (VARCHAR(20))
- warnings (TEXT[])
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### eaf_data, lf_data, ccm_data
```sql
- id (SERIAL PRIMARY KEY)
- heat_id (VARCHAR(50) REFERENCES heats)
- data (JSONB)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

## 🔐 امنیت

### تغییر JWT Secret
```bash
# تولید secret جدید
openssl rand -base64 32

# جایگزین در server/.env
JWT_SECRET=<generated_secret>
```

### تغییر رمز کاربران پیش‌فرض
1. وارد سیستم شوید
2. به پروفایل بروید
3. رمز عبور را تغییر دهید

### Production Deployment
- از HTTPS استفاده کنید
- JWT_SECRET قوی تنظیم کنید
- DB_PASSWORD قوی تنظیم کنید
- CORS_ORIGIN را محدود کنید
- Rate Limiting را فعال کنید

---

## 📝 اسکریپت‌های مفید

### Backup Database
```bash
pg_dump -U postgres steelmetrics > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
psql -U postgres steelmetrics < backup_20240117.sql
```

### Reset Database
```bash
psql -U postgres -c "DROP DATABASE steelmetrics;"
psql -U postgres -c "CREATE DATABASE steelmetrics;"
npm run migrate
npm run seed
```

### View Logs
```bash
# Backend logs
npm run dev  # لاگ‌ها در console نمایش داده می‌شوند

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

---

## 🎯 کاربران پیش‌فرض

| نقش | نام کاربری | رمز عبور |
|-----|-----------|----------|
| مدیر سایت | `19029` | `19029` |
| کاربر EAF | `19377` | `19377` |
| کاربر LF | `19513` | `19513` |
| کاربر CCM | `19616` | `19616` |
| تحلیلگر | `19452` | `19452` |

---

## 📞 پشتیبانی

- **Email:** support@steelmetrics.ir
- **Website:** https://steelmetrics.ir
- **Documentation:** 
  - `README.md` - راهنمای اصلی
  - `BACKEND_SETUP.md` - این فایل
  - `LIARA_DEPLOYMENT.md` - استقرار Liara

---

**نسخه:** 2.0.0  
**تاریخ:** 1403/09/17  
**دامنه:** steelmetrics.ir  
**وضعیت:** ✅ **Backend مورد نیاز است**

---

## ✨ خلاصه

⚠️ **حالت Demo حذف شده است**  
✅ **سیستم فقط با Backend کار می‌کند**  
✅ **داده‌ها در PostgreSQL ذخیره می‌شوند**  
✅ **احراز هویت با JWT**  

**مراحل راه‌اندازی:**
1. نصب PostgreSQL
2. ایجاد Database
3. راه‌اندازی Backend (`cd server && npm install && npm run migrate && npm run seed && npm run dev`)
4. راه‌اندازی Frontend (`npm install && npm run dev`)
5. ورود با `19029` / `19029`

موفق باشید! 🎉
