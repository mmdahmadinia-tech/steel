# 🔐 راهنمای ورود اولیه و تغییر رمز اجباری

## 🎯 خلاصه تغییرات

سیستم ورود اولیه STEELMETRICS ساده‌سازی شد:

- ✅ نام کاربری: `admin`
- ✅ رمز اولیه: `123456` (فقط برای development)
- ✅ تغییر رمز اجباری پس از اولین ورود
- ✅ مسدود شدن دسترسی تا تغییر رمز
- ✅ رمز جدید با bcrypt هش می‌شود
- ✅ رمز اولیه پس از تغییر کار نمی‌کند

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
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=steelmetrics
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3001
```

### مرحله ۳: اجرای Migration

```bash
# Migration اصلی
npm run migrate

# Migration برای Setup
npm run migrate:setup

# Migration برای تغییر رمز اجباری
npm run migrate:password
```

### مرحله ۴: Seed اولیه

```bash
# ایجاد Admin با رمز اولیه
npm run seed
```

**خروجی:**
```
✅ Admin account created with initial password: 123456
⚠️  Admin must change password on first login

📋 Login credentials:
   Username: admin
   Password: 123456
   ⚠️  Password change required on first login
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

## 🔑 اولین ورود و تغییر رمز

### مرحله ۱: ورود اولیه

1. مرورگر را باز کنید: `http://localhost:3001`
2. نام کاربری: `admin`
3. رمز عبور: `123456`
4. روی **"🔥 ورود به سامانه"** کلیک کنید

### مرحله ۲: تغییر رمز اجباری

پس از ورود موفق، به صورت خودکار به صفحه تغییر رمز هدایت می‌شوید:

```
http://localhost:3001/force-password-change
```

### مرحله ۳: تعیین رمز جدید

1. **رمز عبور فعلی**: `123456`
2. **رمز عبور جدید**: رمز قوی (حداقل ۸ کاراکتر)
3. **تکرار رمز عبور جدید**: تکرار رمز جدید

**نکات امنیتی:**
- ✅ رمز باید حداقل ۸ کاراکتر باشد
- ✅ از ترکیب حروف بزرگ، کوچک و اعداد استفاده کنید
- ❌ رمز جدید نباید با رمز اولیه (123456) یکسان باشد

### مرحله ۴: تأیید تغییر رمز

1. روی **"تغییر رمز عبور"** کلیک کنید
2. پیام موفقیت نمایش داده می‌شود
3. به صورت خودکار logout می‌شوید
4. به صفحه ورود هدایت می‌شوید

### مرحله ۵: ورود با رمز جدید

1. نام کاربری: `admin`
2. رمز عبور: رمز جدیدی که تعیین کردید
3. وارد شوید

**✅ اکنون به داشبورد دسترسی دارید!**

---

## 🧪 تست کامل

### تست ۱: ورود با رمز اولیه

```bash
# Backend را اجرا کنید
cd server && npm run dev

# Frontend را اجرا کنید
cd .. && npm run dev
```

1. باز کردن `http://localhost:3001`
2. ورود با `admin` / `123456`
3. ✅ باید به صفحه تغییر رمز هدایت شوید

### تست ۲: تغییر رمز

1. در صفحه تغییر رمز:
   - رمز فعلی: `123456`
   - رمز جدید: `NewPassword123`
   - تکرار رمز: `NewPassword123`
2. کلیک روی **"تغییر رمز عبور"**
3. ✅ باید پیام موفقیت نمایش داده شود
4. ✅ باید logout شوید

### تست ۳: ورود با رمز جدید

1. ورود با `admin` / `NewPassword123`
2. ✅ باید به داشبورد هدایت شوید

### تست ۴: ورود با رمز اولیه (باید شکست بخورد)

1. logout کنید
2. تلاش برای ورود با `admin` / `123456`
3. ❌ باید خطا نمایش داده شود: "نام کاربری یا رمز عبور اشتباه است"

### تست ۵: دسترسی بدون تغییر رمز

1. اگر somehow به داشبورد دسترسی پیدا کنید:
2. تمام API calls باید با خطای 403 مواجه شوند
3. ✅ باید به صفحه تغییر رمز redirect شوید

---

## 👥 ایجاد کاربران جدید

پس از ورود به عنوان Admin:

### مرحله ۱: رفتن به مدیریت کاربران

از منوی سمت راست، روی **"👥 مدیریت کاربران"** کلیک کنید.

### مرحله ۲: ایجاد کاربر جدید

1. روی دکمه **"+ کاربر جدید"** کلیک کنید
2. اطلاعات را وارد کنید:
   - **نام کاربری**: کد پرسنلی (مثلاً: `19377`)
   - **رمز عبور**: رمز قوی
   - **نام کامل**: نام و نام خانوادگی
   - **نقش**: یکی از نقش‌های زیر
   - **دسترسی واحدها**: EAF, LF, CCM

### مرحله ۳: نقش‌های موجود

| نقش | توضیحات | دسترسی |
|-----|---------|--------|
| **Super Admin** | مدیر اصلی | دسترسی کامل |
| **EAF Operator** | اپراتور کوره قوس | فقط EAF |
| **LF Operator** | اپراتور کوره پاتیلی | فقط LF |
| **CCM Operator** | اپراتور ریخته‌گری | فقط CCM |
| **Analytical Viewer** | تحلیلگر | مشاهده همه |

---

## 🔒 امنیت

### رمزنگاری
- **الگوریتم**: bcrypt
- **Salt rounds**: 12
- **قدرت**: 2^12 = 4096 iterations

### JWT Token
- **الگوریتم**: HS256
- **مدت اعتبار**: 24 ساعت
- **شامل**: id, username, role, fullName, mustChangePassword

### کنترل دسترسی
- **must_change_password**: اگر true باشد، دسترسی به APIهای عملیاتی مسدود می‌شود
- **پس از تغییر رمز**: به false تغییر می‌کند
- **رمز اولیه**: دیگر کار نمی‌کند

### Audit Logging
تمام عملیات‌های مهم ثبت می‌شوند:
- ✅ ورود/خروج کاربران
- ✅ تغییر رمز عبور
- ✅ ایجاد/ویرایش/حذف ذوب‌ها
- ✅ ایجاد/ویرایش کاربران

---

## 📊 ساختار Database

### جدول users
```sql
- id (SERIAL PRIMARY KEY)
- username (VARCHAR(50) UNIQUE)
- password_hash (VARCHAR(255))  -- bcrypt hash
- full_name (VARCHAR(100))
- role (VARCHAR(20))
- is_active (BOOLEAN)
- must_change_password (BOOLEAN)  -- جدید
- unit_access (TEXT[])
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

## 🐛 عیب‌یابی

### مشکل: "نام کاربری یا رمز عبور اشتباه است"

**علت**: رمز اولیه تغییر نکرده است

**راه‌حل**:
1. Backend را متوقف کنید
2. Database را reset کنید:
   ```bash
   psql -U postgres -c "DROP DATABASE steelmetrics;"
   psql -U postgres -c "CREATE DATABASE steelmetrics;"
   ```
3. Migration و Seed را دوباره اجرا کنید:
   ```bash
   npm run migrate
   npm run migrate:setup
   npm run migrate:password
   npm run seed
   ```
4. Backend را دوباره اجرا کنید

### مشکل: دسترسی به داشبورد مسدود است

**علت**: must_change_password هنوز true است

**راه‌حل**:
1. به صفحه تغییر رمز بروید: `http://localhost:3001/force-password-change`
2. رمز را تغییر دهید
3. مجدداً وارد شوید

### مشکل: رمز اولیه هنوز کار می‌کند

**علت**: تغییر رمز انجام نشده است

**راه‌حل**:
1. مطمئن شوید که رمز جدید حداقل ۸ کاراکتر است
2. مطمئن شوید که رمز جدید با رمز اولیه (123456) یکسان نیست
3. تغییر رمز را دوباره انجام دهید

---

## 📝 API Endpoints

### POST /api/auth/login
ورود کاربر

**Request:**
```json
{
  "username": "admin",
  "password": "123456"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "mustChangePassword": true,
  "user": {
    "id": 1,
    "username": "admin",
    "fullName": "Super Admin",
    "role": "admin",
    "unitAccess": ["EAF", "LF", "CCM"]
  }
}
```

### POST /api/auth/change-password
تغییر رمز عبور

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "currentPassword": "123456",
  "newPassword": "NewPassword123"
}
```

**Response:**
```json
{
  "message": "رمز عبور با موفقیت تغییر کرد"
}
```

---

## 🎯 کاربران پیش‌فرض

| نقش | نام کاربری | رمز اولیه | وضعیت |
|-----|-----------|-----------|--------|
| مدیر سایت | `admin` | `123456` | ⚠️ نیاز به تغییر رمز |

**⚠️ مهم:**
- رمز اولیه فقط برای development است
- پس از اولین ورود، باید تغییر کند
- رمز اولیه پس از تغییر کار نمی‌کند

---

## 📞 پشتیبانی

- **Email:** support@steelmetrics.ir
- **Website:** https://steelmetrics.ir

---

**نسخه:** 2.2.0  
**تاریخ:** 1403/09/17  
**دامنه:** steelmetrics.ir  
**وضعیت:** ✅ **Production-ready**

---

## ✨ خلاصه

✅ **ورود ساده‌سازی شده**  
✅ **رمز اولیه: 123456**  
✅ **تغییر رمز اجباری**  
✅ **مسدود شدن دسترسی تا تغییر رمز**  
✅ **bcrypt با salt rounds: 12**  
✅ **JWT Authentication**  
✅ **Audit Logging**  

**مراحل راه‌اندازی:**
1. نصب PostgreSQL
2. راه‌اندازی Backend
3. اجرای Migration و Seed
4. راه‌اندازی Frontend
5. ورود با `admin` / `123456`
6. تغییر رمز اجباری
7. ورود با رمز جدید

**ورود اولیه:**
- نام کاربری: `admin`
- رمز عبور: `123456`
- ⚠️ تغییر رمز اجباری

موفق باشید! 🎉
