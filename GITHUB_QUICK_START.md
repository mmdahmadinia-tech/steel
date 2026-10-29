# 🚀 راهنمای سریع انتشار در GitHub

## 📋 مراحل سریع (5 مرحله)

### 1️⃣ ایجاد Repository در GitHub

1. به https://github.com/new بروید
2. نام Repository را وارد کنید: `steelmetrics`
3. **Public** یا **Private** را انتخاب کنید
4. ❌ تیک "Add a README file" را **نزنید**
5. روی **Create repository** کلیک کنید
6. **آدرس Repository را کپی کنید** (مثال: `https://github.com/username/steelmetrics.git`)

---

### 2️⃣ اجرای publish.bat

1. در پوشه پروژه، روی `publish.bat` دابل‌کلیک کنید
2. آدرس Repository را وارد کنید
3. منتظر بمانید تا عملیات تمام شود

---

### 3️⃣ احراز هویت

وقتی از شما نام کاربری و رمز عبور خواسته شد:

**نام کاربری**: نام کاربری GitHub شما

**رمز عبور**: از **Personal Access Token** استفاده کنید (نه رمز عبور!)

---

### 4️⃣ ایجاد Personal Access Token

1. به https://github.com/settings/tokens بروید
2. روی **Generate new token (classic)** کلیک کنید
3. اطلاعات را وارد کنید:
   - **Note**: `Git for Windows`
   - **Expiration**: 90 days
   - **Select scopes**: ✅ `repo`
4. روی **Generate token** کلیک کنید
5. **Token را کپی کنید** (فقط یک بار نمایش داده می‌شود!)
6. هنگام push کردن، Token را به جای رمز عبور وارد کنید

---

### 5️⃣ تمام!

پروژه شما در GitHub منتشر شد! 🎉

---

## 🐛 رفع مشکلات

### مشکل: `Authentication failed`

**راه حل**:
```bash
# پاک کردن credentials قدیمی
git credential reject https://github.com

# استفاده از Token در URL
git remote set-url origin https://USERNAME:TOKEN@github.com/USERNAME/REPOSITORY.git
```

---

### مشکل: `node_modules` خیلی بزرگ است

**راه حل**:
```bash
# حذف node_modules از Git
git rm -r --cached node_modules
git commit -m "Remove node_modules"
git push
```

---

### مشکل: `Updates were rejected`

**راه حل**:
```bash
# force push (با احتیاط!)
git push -f origin main
```

---

## 📝 دستورات دستی

اگر `publish.bat` کار نکرد، از دستورات زیر استفاده کنید:

```bash
# 1. مقداردهی Git
git init

# 2. اضافه کردن فایل‌ها
git add .

# 3. اولین commit
git commit -m "Initial commit"

# 4. تغییر نام branch
git branch -M main

# 5. اضافه کردن remote
git remote add origin https://github.com/USERNAME/REPOSITORY.git

# 6. push به GitHub
git push -u origin main
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

- **مستندات Git**: https://git-scm.com/doc
- **راهنمای GitHub**: https://docs.github.com
- **پشتیبانی GitHub**: https://support.github.com

---

**نسخه:** 1.0.0  
**تاریخ:** 1403/09/17  
**دامنه:** steelmetrics.ir

---

## ✨ خلاصه

### مراحل اصلی:
1. ✅ ایجاد Repository در GitHub
2. ✅ اجرای `publish.bat`
3. ✅ ایجاد Personal Access Token
4. ✅ وارد کردن Token به جای رمز عبور
5. ✅ تمام!

### نکات مهم:
- 🔐 از Personal Access Token استفاده کنید
- 📁 فایل `.gitignore` تنظیم شده است
- 🚫 `node_modules` commit نمی‌شود
- 💾 مرتباً commit و push کنید

موفق باشید! 🎉
