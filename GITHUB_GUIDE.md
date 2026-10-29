# 🚀 راهنمای کامل انتشار پروژه در GitHub

## 📋 مراحل گام به گام

### مرحله 1: نصب Git

اگر Git نصب نیست، از لینک زیر دانلود و نصب کنید:
- **ویندوز**: https://git-scm.com/download/win
- **مک**: https://git-scm.com/download/mac
- **لینوکس**: `sudo apt-get install git`

پس از نصب، ترمینال را باز کنید و دستور زیر را بزنید:
```bash
git --version
```

---

### مرحله 2: تنظیم Git

```bash
# تنظیم نام کاربری
git config --global user.name "نام شما"

# تنظیم ایمیل (همان ایمیلی که در GitHub ثبت کرده‌اید)
git config --global user.email "email@example.com"
```

---

### مرحله 3: ایجاد حساب GitHub

1. به https://github.com بروید
2. روی **Sign up** کلیک کنید
3. اطلاعات خود را وارد کنید
4. ایمیل خود را تأیید کنید

---

### مرحله 4: ایجاد Repository جدید در GitHub

1. وارد حساب GitHub شوید
2. روی دکمه **+** در بالا سمت راست کلیک کنید
3. **New repository** را انتخاب کنید
4. اطلاعات را وارد کنید:
   - **Repository name**: `steelmetrics` (یا نام دلخواه)
   - **Description**: `سامانه مدیریت و تحلیل تولید فولاد`
   - **Public** یا **Private** را انتخاب کنید
   - **Initialize this repository with**: تیک نزنید (چون ما از قبل فایل داریم)
5. روی **Create repository** کلیک کنید

---

### مرحله 5: آماده‌سازی پروژه محلی

در ترمینال (CMD یا PowerShell) به پوشه پروژه بروید:

```bash
cd "مسیر پوشه پروژه شما"
```

مثال:
```bash
cd E:\site\steel-steelmetrics
```

---

### مرحله 6: مقداردهی اولیه Git

```bash
# مقداردهی اولیه Git
git init

# اضافه کردن تمام فایل‌ها
git add .

# اولین commit
git commit -m "Initial commit: STEELMETRICS v1.0"
```

---

### مرحله 7: اتصال به GitHub

```bash
# تغییر نام branch به main
git branch -M main

# اضافه کردن remote (آدرس Repository شما)
git remote add origin https://github.com/USERNAME/REPOSITORY.git
```

**⚠️ مهم**: به جای `USERNAME` نام کاربری GitHub و به جای `REPOSITORY` نام Repository خود را وارد کنید.

مثال:
```bash
git remote add origin https://github.com/mohammadi/steelmetrics.git
```

---

### مرحله 8: Push کردن به GitHub

```bash
# ارسال کد به GitHub
git push -u origin main
```

اگر اولین بار است، از شما نام کاربری و رمز عبور GitHub خواسته می‌شود.

---

## 🔐 روش‌های احراز هویت

### روش 1: Personal Access Token (توصیه شده)

1. به https://github.com/settings/tokens بروید
2. روی **Generate new token** کلیک کنید
3. **Generate new token (classic)** را انتخاب کنید
4. اطلاعات را وارد کنید:
   - **Note**: `Git for Windows`
   - **Expiration**: 90 days (یا بیشتر)
   - **Select scopes**: تیک `repo` را بزنید
5. روی **Generate token** کلیک کنید
6. **Token را کپی کنید** (فقط یک بار نمایش داده می‌شود!)
7. هنگام push کردن، به جای رمز عبور، Token را وارد کنید

---

### روش 2: GitHub CLI

```bash
# نصب GitHub CLI
winget install --id GitHub.cli

# لاگین به GitHub
gh auth login

# انتخاب گزینه‌ها:
# - GitHub.com
# - HTTPS
# - Login with a web browser
```

---

## 🐛 رفع مشکلات رایج

### مشکل 1: `node_modules` خیلی بزرگ است

**راه حل**:
```bash
# حذف node_modules از Git
git rm -r --cached node_modules

# commit تغییرات
git commit -m "Remove node_modules"

# push مجدد
git push
```

---

### مشکل 2: خطای `Authentication failed`

**راه حل**:
```bash
# پاک کردن credentials قدیمی
git credential reject https://github.com

# استفاده از Token
git remote set-url origin https://USERNAME:TOKEN@github.com/USERNAME/REPOSITORY.git
```

---

### مشکل 3: خطای `Updates were rejected`

**راه حل**:
```bash
# force push (با احتیاط!)
git push -f origin main
```

**⚠️ هشدار**: این کار تغییرات remote را بازنویسی می‌کند!

---

### مشکل 4: فایل‌های فارسی نمایش داده نمی‌شوند

**راه حل**:
```bash
# تنظیم encoding
git config --global core.quotepath false
```

---

### مشکل 5: خطای `fatal: not a git repository`

**راه حل**:
```bash
# مقداردهی مجدد Git
git init
git add .
git commit -m "Initial commit"
```

---

## 📝 دستورات مفید Git

```bash
# مشاهده وضعیت
git status

# مشاهده تاریخچه commits
git log

# مشاهده تغییرات
git diff

# اضافه کردن فایل‌های جدید
git add .

# commit کردن
git commit -m "پیام commit"

# push به GitHub
git push

# pull از GitHub
git pull

# ایجاد branch جدید
git branch feature-name

# تغییر branch
git checkout feature-name

# merge branch
git merge feature-name
```

---

## 🎯 نمونه کامل دستورات

```bash
# 1. رفتن به پوشه پروژه
cd E:\site\steel-steelmetrics

# 2. مقداردهی Git
git init

# 3. اضافه کردن فایل‌ها
git add .

# 4. اولین commit
git commit -m "Initial commit: STEELMETRICS v1.0"

# 5. تغییر نام branch
git branch -M main

# 6. اضافه کردن remote
git remote add origin https://github.com/mohammadi/steelmetrics.git

# 7. push به GitHub
git push -u origin main
```

---

## 📊 ساختار Repository در GitHub

پس از push، Repository شما شامل فایل‌های زیر خواهد بود:

```
steelmetrics/
├── src/                    # کد منبع
├── public/                 # فایل‌های عمومی
├── dist/                   # خروجی build (اگر commit شده باشد)
├── .gitignore              # فایل‌های نادیده
├── package.json            # وابستگی‌ها
├── README.md               # راهنما
├── start.bat               # اجرای پروژه
└── ...
```

---

## 🔄 به‌روزرسانی پروژه

برای به‌روزرسانی کد در GitHub:

```bash
# 1. تغییرات را انجام دهید

# 2. اضافه کردن تغییرات
git add .

# 3. commit کردن
git commit -m "Update: توضیح تغییرات"

# 4. push به GitHub
git push
```

---

## 🌐 دسترسی به پروژه

پس از publish، پروژه شما در آدرس زیر قابل دسترسی است:

```
https://github.com/USERNAME/REPOSITORY
```

مثال:
```
https://github.com/mohammadi/steelmetrics
```

---

## 📥 Clone کردن پروژه

برای دانلود پروژه در سیستم دیگر:

```bash
git clone https://github.com/USERNAME/REPOSITORY.git
```

سپس:
```bash
cd REPOSITORY
npm install
npm run build
npx serve dist -l 3001
```

---

## 🎓 منابع آموزشی

- **مستندات Git**: https://git-scm.com/doc
- **راهنمای GitHub**: https://docs.github.com
- **آموزش ویدیویی**: https://www.youtube.com/watch?v=RGOj5yH7evk

---

## 📞 پشتیبانی

اگر مشکل دارید:
1. خطای دقیق را کپی کنید
2. در Google جستجو کنید
3. یا از پشتیبانی GitHub استفاده کنید: https://support.github.com

---

**نسخه:** 1.0.0  
**تاریخ:** 1403/09/17  
**دامنه:** steelmetrics.ir

---

## ✨ خلاصه

### مراحل اصلی:
1. ✅ نصب Git
2. ✅ تنظیم Git
3. ✅ ایجاد حساب GitHub
4. ✅ ایجاد Repository
5. ✅ `git init`
6. ✅ `git add .`
7. ✅ `git commit`
8. ✅ `git remote add origin`
9. ✅ `git push`

### نکات مهم:
- 🔐 از Personal Access Token استفاده کنید
- 📁 فایل `.gitignore` را تنظیم کنید
- 🚫 `node_modules` را commit نکنید
- 💾 مرتباً commit و push کنید

موفق باشید! 🎉
