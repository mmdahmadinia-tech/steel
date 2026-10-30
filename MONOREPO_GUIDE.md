# 🏗️ راهنمای کامل ساختار Monorepo - STEELMETRICS

## ✅ ساختار نهایی پروژه

```
steelmetrics/
│
├── 📁 client/                      # Frontend (React + Vite)
│   ├── 📁 src/
│   │   ├── 📁 components/          # کامپوننت‌ها
│   │   ├── 📁 contexts/            # Context ها
│   │   ├── 📁 hooks/               # Custom Hooks
│   │   ├── 📁 pages/               # صفحات
│   │   ├── 📁 utils/               # ابزارها
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── 📁 server/                      # Backend (Node.js + Express)
│   ├── 📁 src/
│   │   ├── 📁 config/              # تنظیمات
│   │   │   └── index.ts
│   │   ├── 📁 controllers/         # Controllers
│   │   │   ├── authController.ts
│   │   │   ├── heatsController.ts
│   │   │   ├── usersController.ts
│   │   │   └── notificationsController.ts
│   │   ├── 📁 database/            # Database
│   │   │   ├── pool.ts
│   │   │   ├── migrate.ts
│   │   │   └── seed.ts
│   │   ├── 📁 middleware/          # Middleware
│   │   │   ├── auth.ts
│   │   │   └── validate.ts
│   │   ├── 📁 routes/              # Routes
│   │   │   ├── auth.ts
│   │   │   ├── heats.ts
│   │   │   ├── users.ts
│   │   │   └── notifications.ts
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── .env.example
│
├── 📁 shared/                      # کدهای مشترک
│   ├── 📁 types/
│   │   └── index.ts
│   └── 📁 utils/
│       └── validation.ts
│
├── 📄 docker-compose.yml           # Docker Compose
├── 📄 Dockerfile                   # Frontend Dockerfile
├── 📄 nginx.conf                   # Nginx Config
├── 📄 .env.example                 # Environment Variables
├── 📄 package.json                 # Root package.json
└── 📄 README.md                    # مستندات اصلی
```

---

## 🚀 راه‌اندازی سریع

### روش 1: Development (محلی)

#### Backend

```bash
# رفتن به پوشه server
cd server

# نصب وابستگی‌ها
npm install

# کپی .env
cp .env.example .env

# ویرایش .env
nano .env

# ایجاد دیتابیس
createdb steelmetrics

# اجرای migration
npm run migrate

# seed داده‌ها
npm run seed

# اجرای سرور
npm run dev
```

Backend روی `http://localhost:5000` اجرا می‌شود.

#### Frontend

```bash
# رفتن به پوشه client
cd ../client

# نصب وابستگی‌ها
npm install

# کپی .env
cp .env.example .env

# ویرایش .env
nano .env

# اجرای سرور
npm run dev
```

Frontend روی `http://localhost:3000` اجرا می‌شود.

### روش 2: Docker (توصیه شده)

```bash
# ساخت و اجرای همه سرویس‌ها
docker-compose up -d

# مشاهده لاگ‌ها
docker-compose logs -f

# توقف
docker-compose down
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | ورود کاربر |
| POST | `/api/auth/change-password` | تغییر رمز |
| GET | `/api/auth/me` | اطلاعات کاربر فعلی |

### Heats

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/heats` | لیست ذوب‌ها |
| GET | `/api/heats/:id` | جزئیات ذوب |
| POST | `/api/heats` | ایجاد ذوب |
| PUT | `/api/heats/:id` | ویرایش ذوب |
| DELETE | `/api/heats/:id` | حذف ذوب |
| DELETE | `/api/heats` | حذف همه ذوب‌ها |
| GET | `/api/heats/next-id` | Heat ID بعدی |
| POST | `/api/heats/:heatId/eaf` | ذخیره EAF |
| POST | `/api/heats/:heatId/lf` | ذخیره LF |
| POST | `/api/heats/:heatId/ccm` | ذخیره CCM |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | لیست کاربران |
| POST | `/api/users` | ایجاد کاربر |
| PUT | `/api/users/:id` | ویرایش کاربر |
| DELETE | `/api/users/:id` | حذف کاربر |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | لیست اعلان‌ها |
| POST | `/api/notifications` | ارسال اعلان |
| PUT | `/api/notifications/:id/read` | خوانده شد |
| PUT | `/api/notifications/read-all` | همه خوانده شد |
| DELETE | `/api/notifications/:id` | حذف اعلان |

---

## 🗄️ Database Schema

### users

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  unit_access TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### heats

```sql
CREATE TABLE heats (
  id SERIAL PRIMARY KEY,
  heat_id VARCHAR(50) UNIQUE NOT NULL,
  date VARCHAR(20) NOT NULL,
  shift VARCHAR(10) NOT NULL,
  steel_grade VARCHAR(20) NOT NULL,
  is_sub_heat BOOLEAN DEFAULT FALSE,
  parent_heat_id VARCHAR(50),
  eaf_status VARCHAR(20) DEFAULT 'not_started',
  lf_status VARCHAR(20) DEFAULT 'not_started',
  ccm_status VARCHAR(20) DEFAULT 'not_started',
  warnings TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### eaf_data, lf_data, ccm_data

```sql
CREATE TABLE eaf_data (
  id SERIAL PRIMARY KEY,
  heat_id VARCHAR(50) REFERENCES heats(heat_id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(heat_id)
);
```

---

## 🔐 Authentication Flow

```
1. User → POST /api/auth/login
   { username, password }

2. Server → Verify credentials
   - Find user in DB
   - Compare password hash

3. Server → Generate JWT
   - Sign with secret
   - Set expiration

4. Server → Response
   { token, user }

5. Client → Store token
   - localStorage
   - Add to headers

6. Client → API requests
   Headers: { Authorization: Bearer <token> }

7. Server → Verify token
   - Decode JWT
   - Check expiration
   - Extract user info
```

---

## 🛡️ Security Features

### 1. Password Hashing

```typescript
// bcrypt with salt rounds
const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password, salt);
```

### 2. JWT Authentication

```typescript
// Sign token
const token = jwt.sign(
  { id, username, role },
  secret,
  { expiresIn: '24h' }
);

// Verify token
const decoded = jwt.verify(token, secret);
```

### 3. Input Validation

```typescript
// express-validator
body('username')
  .notEmpty()
  .isLength({ min: 3 })
  .withMessage('Username must be at least 3 characters')
```

### 4. SQL Injection Prevention

```typescript
// Parameterized queries
const result = await query(
  'SELECT * FROM users WHERE username = $1',
  [username]
);
```

### 5. CORS

```typescript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### 6. Security Headers

```typescript
app.use(helmet());
```

---

## 📊 Performance Optimization

### Backend

1. **Connection Pooling**
   ```typescript
   const pool = new Pool({ max: 20 });
   ```

2. **Query Optimization**
   - Index‌گذاری
   - Pagination
   - Selective fields

3. **Caching**
   - Redis (قابل اضافه کردن)
   - In-memory cache

### Frontend

1. **Code Splitting**
   ```typescript
   const Dashboard = lazy(() => import('./pages/Dashboard'));
   ```

2. **Memoization**
   ```typescript
   const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
   ```

3. **Debouncing**
   ```typescript
   const debouncedSearch = useDebounce(searchTerm, 300);
   ```

---

## 🧪 Testing

### Backend Tests

```bash
cd server
npm test
```

### Frontend Tests

```bash
cd client
npm test
```

### E2E Tests

```bash
npm run test:e2e
```

---

## 📦 Deployment

### Production Build

```bash
# Backend
cd server
npm run build

# Frontend
cd client
npm run build
```

### Docker Deployment

```bash
# Build images
docker-compose build

# Run containers
docker-compose up -d

# Check status
docker-compose ps
```

### Environment Variables

```bash
NODE_ENV=production
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=steelmetrics
DB_USER=your-user
DB_PASSWORD=your-password
JWT_SECRET=your-secret-key
CORS_ORIGIN=https://steelmetrics.ir
```

---

## 🔄 Migration Guide

### From Frontend-only to Full Stack

1. **Move Frontend to client/**
   ```bash
   mkdir client
   mv * client/ 2>/dev/null || true
   mv .* client/ 2>/dev/null || true
   ```

2. **Create Server**
   ```bash
   mkdir server
   cd server
   npm init -y
   npm install express typescript ...
   ```

3. **Setup Database**
   ```bash
   createdb steelmetrics
   npm run migrate
   npm run seed
   ```

4. **Update Frontend API calls**
   ```typescript
   // Before: localStorage
   const heats = JSON.parse(localStorage.getItem('heats'));
   
   // After: API
   const response = await fetch('/api/heats');
   const heats = await response.json();
   ```

---

## 📝 Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/new-feature
```

### 2. Make Changes

- Backend: `server/src/`
- Frontend: `client/src/`
- Shared: `shared/`

### 3. Test

```bash
# Backend
cd server && npm test

# Frontend
cd client && npm test
```

### 4. Commit

```bash
git add .
git commit -m "feat: add new feature"
```

### 5. Push & PR

```bash
git push origin feature/new-feature
```

---

## 🎯 Next Steps

### Phase 1: Backend Setup ✅

- [x] Express server
- [x] PostgreSQL connection
- [x] Authentication
- [x] CRUD operations
- [x] API endpoints

### Phase 2: Frontend Integration

- [ ] Update API calls
- [ ] Remove localStorage
- [ ] Add loading states
- [ ] Error handling

### Phase 3: Advanced Features

- [ ] File uploads
- [ ] Real-time updates (WebSocket)
- [ ] Advanced reporting
- [ ] Data export

### Phase 4: Production

- [ ] SSL certificate
- [ ] Monitoring
- [ ] Backup strategy
- [ ] Load testing

---

## 📞 Support

- **Email:** support@steelmetrics.ir
- **Website:** https://steelmetrics.ir
- **Docs:** https://docs.steelmetrics.ir

---

**نسخه:** 2.0.0  
**تاریخ:** 1403/09/17  
**دامنه:** steelmetrics.ir
