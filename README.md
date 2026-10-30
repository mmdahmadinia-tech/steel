# 🏭 STEELMETRICS - سامانه مدیریت و تحلیل تولید فولاد

<div align="center">

**Steel Production Management & Analytics System**

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://steelmetrics.ir)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18.2-61dafb.svg)](https://reactjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6.svg)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)]()

</div>

---

## 📋 فهرست مطالب

- [معرفی](#-معرفی)
- [معماری](#-معماری)
- [تکنولوژی‌ها](#-تکنولوژی‌ها)
- [نصب و راه‌اندازی](#-نصب-و-راه‌اندازی)
- [ساختار پروژه](#-ساختار-پروژه)
- [API Documentation](#-api-documentation)
- [دیتابیس](#-دیتابیس)
- [امنیت](#-امنیت)
- [Deployment](#-deployment)
- [توسعه](#-توسعه)

---

## 🎯 معرفی

**STEELMETRICS** یک سامانه جامع تحت وب برای مدیریت و تحلیل فرایندهای تولید فولاد است که شامل سه بخش اصلی می‌باشد:

- ⚡ **EAF** - کوره قوس الکتریکی (Electric Arc Furnace)
- 🔧 **LF** - کوره پاتیلی (Ladle Furnace)
- 🏭 **CCM** - ریخته‌گری مداوم (Continuous Casting Machine)

این سامانه با معماری **Monorepo** طراحی شده و شامل Frontend و Backend جداگانه است.

---

## 🏗️ معماری

### Monorepo Structure

```
steelmetrics/
├── 📁 client/          # Frontend (React + Vite)
├── 📁 server/          # Backend (Node.js + Express)
├── 📁 shared/          # کدهای مشترک
├── 📄 docker-compose.yml
├── 📄 Dockerfile
└── 📄 README.md
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │  Components  │  │    Hooks     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Node.js + Express)               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Routes     │  │ Controllers  │  │  Middleware  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓ SQL
┌─────────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Users     │  │    Heats     │  │  Audit Logs  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 تکنولوژی‌ها

### Frontend

| تکنولوژی | نسخه | کاربرد |
|----------|------|--------|
| React | 18.2 | کتابخانه UI |
| TypeScript | 5.0 | زبان برنامه‌نویسی |
| Vite | 6.4 | Build Tool |
| Tailwind CSS | 4.0 | استایل‌دهی |
| React Router | 6.x | مدیریت مسیرها |
| Recharts | 2.x | نمودارها |

### Backend

| تکنولوژی | نسخه | کاربرد |
|----------|------|--------|
| Node.js | 18+ | Runtime |
| Express | 4.18 | Web Framework |
| TypeScript | 5.0 | زبان برنامه‌نویسی |
| PostgreSQL | 16 | دیتابیس |
| JWT | 9.x | احراز هویت |
| bcrypt | 2.4 | رمزگذاری رمز عبور |

### Infrastructure

| تکنولوژی | کاربرد |
|----------|--------|
| Docker | Containerization |
| Docker Compose | Orchestration |
| Nginx | Reverse Proxy |

---

## 🚀 نصب و راه‌اندازی

### پیش‌نیازها

- **Node.js** 18+ ([دانلود](https://nodejs.org))
- **PostgreSQL** 16+ ([دانلود](https://www.postgresql.org/download))
- **npm** 9+
- **Git**

### روش 1: نصب محلی (Development)

#### 1. Clone پروژه

```bash
git clone https://github.com/yourusername/steelmetrics.git
cd steelmetrics
```

#### 2. راه‌اندازی Backend

```bash
# رفتن به پوشه server
cd server

# نصب وابستگی‌ها
npm install

# کپی فایل .env
cp .env.example .env

# ویرایش .env با تنظیمات خودتان
nano .env

# ایجاد دیتابیس
createdb steelmetrics

# اجرای migration
npm run migrate

# seed داده‌های اولیه
npm run seed

# اجرای سرور
npm run dev
```

Backend روی `http://localhost:5000` اجرا می‌شود.

#### 3. راه‌اندازی Frontend

```bash
# برگشت به ریشه پروژه
cd ..

# نصب وابستگی‌ها
npm install

# کپی فایل .env
cp .env.example .env

# ویرایش .env
nano .env

# اجرای سرور توسعه
npm run dev
```

Frontend روی `http://localhost:3000` اجرا می‌شود.

### روش 2: Docker (توصیه شده)

#### 1. Clone پروژه

```bash
git clone https://github.com/yourusername/steelmetrics.git
cd steelmetrics
```

#### 2. راه‌اندازی با Docker Compose

```bash
# ساخت و اجرای همه سرویس‌ها
docker-compose up -d

# مشاهده لاگ‌ها
docker-compose logs -f

# توقف سرویس‌ها
docker-compose down
```

سرویس‌ها:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **PostgreSQL:** localhost:5432
- **Nginx:** http://localhost:80

---

## 📁 ساختار پروژه

```
steelmetrics/
│
├── 📁 client/                      # Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/          # کامپوننت‌های مشترک
│   │   ├── 📁 contexts/            # React Contexts
│   │   ├── 📁 hooks/               # Custom Hooks
│   │   ├── 📁 pages/               # صفحات
│   │   ├── 📁 utils/               # ابزارهای کمکی
│   │   ├── App.tsx                 # کامپوننت اصلی
│   │   └── main.tsx                # نقطه ورود
│   ├── package.json
│   └── vite.config.ts
│
├── 📁 server/                      # Backend
│   ├── 📁 src/
│   │   ├── 📁 config/              # تنظیمات
│   │   ├── 📁 controllers/         # Controllers
│   │   ├── 📁 database/            # Database
│   │   ├── 📁 middleware/          # Middleware
│   │   ├── 📁 routes/              # Routes
│   │   └── server.ts               # نقطه ورود
│   ├── package.json
│   └── tsconfig.json
│
├── 📁 shared/                      # کدهای مشترک
│   ├── types/                      # TypeScript Types
│   └── utils/                      # Utility Functions
│
├── 📄 docker-compose.yml           # Docker Compose
├── 📄 Dockerfile                   # Frontend Dockerfile
├── 📄 .env.example                 # نمونه فایل env
├── 📄 nginx.conf                   # تنظیمات Nginx
└── 📄 README.md                    # این فایل
```

---

## 📡 API Documentation

### Authentication

#### POST `/api/auth/login`

ورود کاربر و دریافت token.

**Request:**
```json
{
  "username": "19029",
  "password": "19029"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "19029",
    "fullName": "مدیر سایت",
    "role": "admin",
    "unitAccess": ["EAF", "LF", "CCM"]
  }
}
```

### Heats

#### GET `/api/heats`

دریافت لیست ذوب‌ها با pagination و فیلتر.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 50)
- `search` (Heat ID)
- `shift` (A, B, C, D)
- `grade` (Steel Grade)
- `dateStart` (YYYY/MM/DD)
- `dateEnd` (YYYY/MM/DD)

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1250,
    "totalPages": 25
  }
}
```

#### POST `/api/heats`

ایجاد ذوب جدید.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "heatId": "1250",
  "date": "1403/09/15",
  "shift": "A",
  "steelGrade": "4402"
}
```

#### POST `/api/heats/:heatId/eaf`

ذخیره داده‌های EAF.

**Request:**
```json
{
  "powerOn": 45,
  "tappingStartTime": "11:00",
  "tappingEndTime": "11:30",
  "tappingWeight": 85,
  "refractoryCounters": {
    "walls": 10,
    "centerPiece": 11,
    "bottom": 20,
    "taphole": 14
  },
  ...
}
```

### Users

#### GET `/api/users`

دریافت لیست کاربران (فقط admin).

#### POST `/api/users`

ایجاد کاربر جدید.

**Request:**
```json
{
  "username": "19999",
  "password": "19999",
  "fullName": "کاربر جدید",
  "role": "eaf_user",
  "unitAccess": ["EAF"]
}
```

### Notifications

#### GET `/api/notifications`

دریافت اعلان‌ها.

#### POST `/api/notifications`

ارسال اعلان (فقط admin).

**Request:**
```json
{
  "message": "تعمیراتscheduled برای فردا"
}
```

---

## 🗄️ دیتابیس

### Schema

#### users

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | شناسه |
| username | VARCHAR(50) | نام کاربری |
| password_hash | VARCHAR(255) | رمز عبور hash شده |
| full_name | VARCHAR(100) | نام کامل |
| role | VARCHAR(20) | نقش |
| is_active | BOOLEAN | وضعیت فعال |
| unit_access | TEXT[] | دسترسی به واحدها |

#### heats

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | شناسه |
| heat_id | VARCHAR(50) | شماره ذوب |
| date | VARCHAR(20) | تاریخ |
| shift | VARCHAR(10) | شیفت |
| steel_grade | VARCHAR(20) | گرید فولاد |
| eaf_status | VARCHAR(20) | وضعیت EAF |
| lf_status | VARCHAR(20) | وضعیت LF |
| ccm_status | VARCHAR(20) | وضعیت CCM |

#### eaf_data, lf_data, ccm_data

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | شناسه |
| heat_id | VARCHAR(50) | شماره ذوب (FK) |
| data | JSONB | داده‌ها به صورت JSON |

### Migration

```bash
# اجرای migration
npm run migrate

# seed داده‌های اولیه
npm run seed
```

---

## 🔐 امنیت

### Authentication

- **JWT Token** برای احراز هویت
- **bcrypt** برای hash کردن رمز عبور
- **Token Expiration** برای امنیت بیشتر

### Authorization

- **Role-based Access Control (RBAC)**
- **Unit-based Access Control**
- **Audit Logging** برای تمام عملیات‌ها

### Security Headers

- **Helmet** برای security headers
- **CORS** برای cross-origin requests
- **Rate Limiting** (قابل تنظیم)

### Best Practices

- ✅ رمزهای عبور hash شده
- ✅ JWT با expiration
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ CSRF protection
- ✅ HTTPS (در production)

---

## 🚢 Deployment

### Production Deployment

#### 1. Environment Variables

```bash
NODE_ENV=production
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=steelmetrics
DB_USER=your-db-user
DB_PASSWORD=your-secure-password
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=https://steelmetrics.ir
```

#### 2. Build

```bash
# Build Backend
cd server
npm run build

# Build Frontend
cd ../client
npm run build
```

#### 3. Deploy with Docker

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name steelmetrics.ir;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name steelmetrics.ir;

    ssl_certificate /etc/letsencrypt/live/steelmetrics.ir/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/steelmetrics.ir/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
    }
}
```

---

## 🛠️ توسعه

### Development Workflow

1. **Branch Strategy:**
   - `main` - production
   - `develop` - development
   - `feature/*` - ویژگی‌های جدید
   - `bugfix/*` - رفع باگ

2. **Commit Convention:**
   ```
   feat: اضافه کردن قابلیت جدید
   fix: رفع باگ
   docs: به‌روزرسانی مستندات
   style: تغییرات ظاهری
   refactor: بازنویسی کد
   test: اضافه کردن تست
   chore: تغییرات build
   ```

3. **Code Review:**
   - همه PR ها باید review شوند
   - حداقل 1 approval لازم است
   - CI باید pass شود

### Testing

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test

# E2E tests
npm run test:e2e
```

---

## 👥 کاربران پیش‌فرض

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
- **Documentation:** https://docs.steelmetrics.ir

---

## 📄 مجوز

این نرم‌افزار تحت مجوز اختصاصی منتشر شده است.  
استفاده تجاری بدون اجازه کتبی ممنوع است.

---

<div align="center">

**STEELMETRICS** — سامانه مدیریت و تحلیل تولید فولاد

نسخه 2.0.0 | 1403

</div>
