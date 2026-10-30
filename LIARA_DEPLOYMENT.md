# 🚀 راهنمای استقرار روی Liara

## 📋 پیش‌نیازها

1. **حساب Liara** - ثبت‌نام در [liara.ir](https://liara.ir)
2. **Liara CLI** - نصب ابزار خط فرمان Liara
3. **Domain** - دامنه steelmetrics.ir باید به Liara اشاره کند

---

## 🔧 مرحله 1: نصب Liara CLI

```bash
npm install -g @liara/cli
```

ورود به حساب Liara:
```bash
liara login
```

---

## 🗄️ مرحله 2: ایجاد سرویس PostgreSQL

1. وارد پنل Liara شوید
2. به بخش **Databases** بروید
3. روی **Create Database** کلیک کنید
4. **PostgreSQL** را انتخاب کنید
5. پلن مناسب را انتخاب کنید (حداقل 1GB RAM)
6. نام دیتابیس: `steelmetrics`
7. روی **Create** کلیک کنید
8. اطلاعات اتصال را یادداشت کنید:
   - Host
   - Port
   - Database Name
   - Username
   - Password

---

## 🖥️ مرحله 3: استقرار Backend

### 3.1. آماده‌سازی Backend

```bash
cd server

# ایجاد فایل .env
cat > .env << EOF
NODE_ENV=production
DB_HOST=your-liara-postgres-host.liara.run
DB_PORT=30412
DB_NAME=steelmetrics
DB_USER=your-liara-db-user
DB_PASSWORD=your-liara-db-password
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://steelmetrics.ir
PORT=80
LOG_LEVEL=info
EOF
```

### 3.2. استقرار Backend روی Liara

```bash
cd server

# ایجاد اپلیکیشن Liara
liara create --app steelmetrics-backend --platform node

# تنظیم environment variables
liara env:set -a steelmetrics-backend NODE_ENV=production
liara env:set -a steelmetrics-backend DB_HOST=your-liara-postgres-host.liara.run
liara env:set -a steelmetrics-backend DB_PORT=30412
liara env:set -a steelmetrics-backend DB_NAME=steelmetrics
liara env:set -a steelmetrics-backend DB_USER=your-liara-db-user
liara env:set -a steelmetrics-backend DB_PASSWORD=your-liara-db-password
liara env:set -a steelmetrics-backend JWT_SECRET=your-jwt-secret
liara env:set -a steelmetrics-backend JWT_EXPIRES_IN=24h
liara env:set -a steelmetrics-backend CORS_ORIGIN=https://steelmetrics.ir
liara env:set -a steelmetrics-backend PORT=80

# استقرار
liara deploy --app steelmetrics-backend --port 80
```

### 3.3. اجرای Migration

```bash
# اتصال به Backend
liara exec -a steelmetrics-backend -- npm run migrate

# Seed داده‌های اولیه
liara exec -a steelmetrics-backend -- npm run seed
```

---

## 🌐 مرحله 4: استقرار Frontend

### 4.1. آماده‌سازی Frontend

```bash
cd client

# ایجاد فایل .env.production
cat > .env.production << EOF
VITE_API_URL=https://api.steelmetrics.ir
EOF

# Build
npm run build
```

### 4.2. استقرار Frontend روی Liara

```bash
cd client

# ایجاد اپلیکیشن Liara
liara create --app steelmetrics-frontend --platform static

# استقرار
liara deploy --app steelmetrics-frontend --path dist
```

---

## 🌍 مرحله 5: تنظیم Domain

### 5.1. اضافه کردن Domain به Liara

1. وارد پنل Liara شوید
2. به بخش **Domains** بروید
3. روی **Add Domain** کلیک کنید
4. دامنه‌ها را اضافه کنید:
   - `steelmetrics.ir` → Frontend
   - `api.steelmetrics.ir` → Backend
   - `www.steelmetrics.ir` → Frontend

### 5.2. تنظیم DNS

در پنل مدیریت دامنه، رکوردهای زیر را اضافه کنید:

```
Type: A
Name: @
Value: [Liara IP]

Type: CNAME
Name: www
Value: [Liara Domain]

Type: CNAME
Name: api
Value: [Liara Domain]
```

### 5.3. فعال‌سازی SSL

Liara به صورت خودکار SSL را فعال می‌کند. منتظر بمانید تا SSL صادر شود.

---

## ✅ مرحله 6: تست استقرار

### 6.1. تست Backend

```bash
curl https://api.steelmetrics.ir/health
```

پاسخ مورد انتظار:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "version": "2.0.0"
}
```

### 6.2. تست Frontend

مرورگر را باز کنید:
```
https://steelmetrics.ir
```

### 6.3. تست Login

1. به https://steelmetrics.ir بروید
2. با کاربر پیش‌فرض وارد شوید:
   - Username: `19029`
   - Password: `19029`

---

## 🔒 مرحله 7: امنیت Production

### 7.1. تغییر رمزهای پیش‌فرض

```bash
# اتصال به Backend
liara exec -a steelmetrics-backend -- bash

# تغییر رمز کاربر admin
npm run seed -- --change-passwords
```

### 7.2. فعال‌سازی Rate Limiting

در فایل `server/src/server.ts`:

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 7.3. فعال‌سازی HTTPS Only

در Nginx config:
```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name steelmetrics.ir;
    return 301 https://$server_name$request_uri;
}
```

---

## 📊 مرحله 8: Monitoring

### 8.1. مشاهده لاگ‌ها

```bash
# Backend logs
liara logs -a steelmetrics-backend --follow

# Frontend logs
liara logs -a steelmetrics-frontend --follow
```

### 8.2. Backup دیتابیس

```bash
# Backup از PostgreSQL
liara exec -a steelmetrics-backend -- pg_dump -h $DB_HOST -U $DB_USER $DB_NAME > backup.sql

# Restore
liara exec -a steelmetrics-backend -- psql -h $DB_HOST -U $DB_USER $DB_NAME < backup.sql
```

---

## 🔄 مرحله 9: به‌روزرسانی

### 9.1. به‌روزرسانی Backend

```bash
cd server

# تغییرات را commit کنید
git add .
git commit -m "Update backend"

# استقرار مجدد
liara deploy --app steelmetrics-backend --port 80
```

### 9.2. به‌روزرسانی Frontend

```bash
cd client

# Build
npm run build

# استقرار مجدد
liara deploy --app steelmetrics-frontend --path dist
```

---

## 🐛 عیب‌یابی

### مشکل 1: Backend متصل نمی‌شود

```bash
# بررسی لاگ‌ها
liara logs -a steelmetrics-backend --tail 100

# بررسی environment variables
liara env:list -a steelmetrics-backend
```

### مشکل 2: Database connection failed

```bash
# تست اتصال به دیتابیس
liara exec -a steelmetrics-backend -- psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT 1"
```

### مشکل 3: CORS error

بررسی کنید که `CORS_ORIGIN` به درستی تنظیم شده باشد:
```bash
liara env:get -a steelmetrics-backend CORS_ORIGIN
```

---

## 📞 پشتیبانی Liara

- **Documentation:** https://docs.liara.ir
- **Support:** support@liara.ir
- **Status:** https://status.liara.ir

---

## 🎯 چک‌لیست نهایی

- [ ] PostgreSQL ایجاد شده
- [ ] Backend مستقر شده
- [ ] Migration اجرا شده
- [ ] Seed اجرا شده
- [ ] Frontend مستقر شده
- [ ] Domain تنظیم شده
- [ ] DNS配置 شده
- [ ] SSL فعال شده
- [ ] Backend تست شده
- [ ] Frontend تست شده
- [ ] Login تست شده
- [ ] رمزهای پیش‌فرض تغییر کرده
- [ ] Rate limiting فعال شده
- [ ] Monitoring تنظیم شده
- [ ] Backup strategy تعیین شده

---

**نسخه:** 2.0.0  
**تاریخ:** 1403/09/17  
**دامنه:** steelmetrics.ir
