# راهنمای استقرار STEELMETRICS

## 📦 محتویات بسته

```
steelmetrics/
├── start.bat          ← اجرای سرور توسعه (مرحله تست)
├── build.bat          ← ساخت نسخه production
├── install.bat        ← نصب اولیه و بررسی پیش‌نیازها
├── .env.example       ← نمونه تنظیمات محیطی
├── README.md          ← راهنمای کامل
└── ...
```

---

## 🖥️ مراحل اجرا روی سیستم محلی

### قدم ۱: نصب Node.js
اگر Node.js ندارید:
1. به https://nodejs.org بروید
2. نسخه LTS (20.x) را دانلود کنید
3. نصب کنید

### قدم ۲: اجرای install.bat
- دابل‌کلیک روی `install.bat`
- صبر کنید تا وابستگی‌ها نصب شوند

### قدم ۳: اجرای start.bat
- دابل‌کلیک روی `start.bat`
- مرورگر باز می‌شود روی http://localhost:3000

### قدم ۴: ورود به سامانه
- از کاربران آزمایشی استفاده کنید
- رمز عبور: هر چیزی وارد کنید

---

## 🌐 استقرار Production

### سرور پیشنهادی:
- **OS:** Ubuntu 22.04 LTS
- **RAM:** حداقل 4GB
- **CPU:** حداقل 2 هسته
- **Disk:** حداقل 50GB SSD

### نرم‌افزارهای موردنیاز:
1. **Nginx** — وب‌سرور و Reverse Proxy
2. **Node.js 20.x** — اجرای Backend
3. **PostgreSQL 16** — پایگاه داده
4. **Redis** — کش (اختیاری)
5. **Certbot** — SSL رایگان

### مراحل استقرار:

```bash
# 1. آپدیت سیستم
sudo apt update && sudo apt upgrade -y

# 2. نصب Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. نصب PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# 4. نصب Nginx
sudo apt install -y nginx

# 5. کپی فایل‌های Frontend
sudo mkdir -p /var/www/steelmetrics
sudo cp -r dist/* /var/www/steelmetrics/

# 6. تنظیم Nginx
sudo nano /etc/nginx/sites-available/steelmetrics
```

### نمونه تنظیم Nginx:

```nginx
server {
    listen 80;
    server_name steelmetrics.ir www.steelmetrics.ir;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name steelmetrics.ir www.steelmetrics.ir;

    ssl_certificate /etc/letsencrypt/live/steelmetrics.ir/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/steelmetrics.ir/privkey.pem;

    root /var/www/steelmetrics;
    index index.html;

    # Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Backend
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

### فعال‌سازی SSL:

```bash
sudo certbot --nginx -d steelmetrics.ir -d www.steelmetrics.ir
```

---

## 🔒 چک‌لیست امنیتی

- [ ] HTTPS فعال باشد
- [ ] رمزهای عبور با bcrypt هش شوند
- [ ] JWT Secret قوی تنظیم شود
- [ ] CORS فقط برای دامنه‌های مجاز
- [ ] Rate Limiting روی API
- [ ] Firewall فقط پورت‌های 80, 443 باز
- [ ] پشتیبان‌گیری خودکار روزانه
- [ ] مانیتورینگ سرور
- [ ] لاگ‌های امنیتی
- [ ] به‌روزرسانی منظم

---

## 📊 مانیتورینگ پیشنهادی

- **UptimeRobot** — مانیتورینگ آپتایم
- **Sentry** — ردیابی خطاها
- **Prometheus + Grafana** — مانیتورینگ عملکرد
- **Fail2Ban** — محافظت در برابر brute force

---

## 🆘 رفع مشکلات رایج

### مشکل: پورت 3000 اشغال است
```bash
# پیدا کردن پروسه اشغال‌کننده
netstat -ano | findstr :3000
# کشتن پروسه
taskkill /PID [PID] /F
```

### مشکل: خطای npm install
```bash
# پاک کردن cache
npm cache clean --force
# حذف node_modules و نصب مجدد
rmdir /s /q node_modules
del package-lock.json
npm install
```

### مشکل: مرورگر باز نمی‌شود
- آدرس http://localhost:3000 را دستی وارد کنید
- فایروال آنتی‌ویروس را چک کنید

---

## 📞 پشتیبانی

ایمیل: support@steelmetrics.ir
وب‌سایت: https://steelmetrics.ir
