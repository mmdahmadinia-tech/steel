# 🚀 راهنمای سریع شروع - STEELMETRICS

## 📦 فایل‌های BAT ایجاد شده:

### 1️⃣ `install.bat` - نصب اولیه
- بررسی Node.js و npm
- نصب خودکار وابستگی‌ها
- **اولین بار اجرا کنید**

### 2️⃣ `start.bat` - اجرای سرور توسعه
- راه‌اندازی سرور روی http://localhost:3000
- باز کردن خودکار مرورگر
- **برای تست و توسعه**

### 3️⃣ `build.bat` - ساخت نسخه Production
- ساخت فایل‌های بهینه‌شده در پوشه dist/
- **برای استقرار نهایی**

---

## 🎯 مراحل اجرا:

### قدم اول: نصب Node.js
اگر ندارید از https://nodejs.org نسخه LTS را دانلود و نصب کنید

### قدم دوم: اجرای install.bat
```
دابل‌کلیک روی install.bat
صبر کنید تا نصب تمام شود
```

### قدم سوم: اجرای start.bat
```
دابل‌کلیک روی start.bat
مرورگر خودکار باز می‌شود
```

### قدم چهارم: ورود به سامانه
```
نام کاربری: admin
رمز عبور: هر چیزی (demo mode)
```

---

## 👥 کاربران آزمایشی:

| نام کاربری | نقش |
|------------|-----|
| admin | مدیر سامانه (دسترسی کامل) |
| eaf_operator | کاربر کوره قوس الکتریکی |
| lf_operator | کاربر کوره پاتیلی |
| ccm_operator | کاربر ریخته‌گری مداوم |
| shift_sup | سرپرست شیفت |
| prod_manager | مدیر تولید |

**رمز عبور:** هر مقداری وارد کنید

---

## 📁 فایل‌های مستندات:

- **README.md** - راهنمای کامل پروژه
- **DEPLOYMENT.md** - راهنمای استقرار Production
- **.env.example** - نمونه تنظیمات محیطی

---

## 🌐 آدرس‌ها:

- **توسعه:** http://localhost:3000
- **Production:** https://steelmetrics.ir

---

## ⚠️ نکات مهم:

1. **حالت نمایشی:** این نسخه Frontend است و داده‌ها نمونه هستند
2. **Backend:** برای استفاده واقعی باید Backend پیاده‌سازی شود
3. **پایگاه داده:** PostgreSQL برای Production نیاز است
4. **امنیت:** HTTPS و تنظیمات امنیتی برای Production الزامی است

---

## 🆘 رفع مشکلات:

### پورت 3000 اشغال است:
```cmd
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

### خطای npm install:
```cmd
npm cache clean --force
rmdir /s /q node_modules
npm install
```

---

## 📞 پشتیبانی:

- ایمیل: support@steelmetrics.ir
- وب‌سایت: https://steelmetrics.ir

---

**نسخه:** 1.0.0  
**تاریخ:** 1403  
**دامنه:** steelmetrics.ir
