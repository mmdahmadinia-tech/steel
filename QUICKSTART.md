# 🚀 Quick Start Guide - STEELMETRICS

## 📦 BAT Files Created:

### 1️⃣ `install.bat` - Initial Setup
- Checks Node.js and npm
- Installs dependencies automatically
- **Run this first**

### 2️⃣ `start.bat` - Development Server
- Starts server on http://localhost:3000
- Opens browser automatically
- Shows demo users
- **For testing and development**

### 3️⃣ `build.bat` - Production Build
- Builds optimized files in dist/ folder
- **For final deployment**

### 4️⃣ `test.bat` - Quick Test
- Opens the built version directly
- Uses preview server or opens HTML file
- **For quick testing without dev server**

---

## 🎯 How to Run on Your System:

### Step 1: Install Node.js
If you don't have it: https://nodejs.org (LTS version 20.x)

### Step 2: Run install.bat
```
Double-click install.bat
Wait for dependencies to install
```

### Step 3: Run start.bat
```
Double-click start.bat
Browser opens automatically
```

### Step 4: Login
```
Username: admin
Password: anything (demo mode)
```

---

## 👥 Demo Users:

| Username | Role |
|----------|------|
| admin | System Admin (full access) |
| eaf_operator | EAF User |
| lf_operator | LF User |
| ccm_operator | CCM User |
| shift_sup | Shift Supervisor |
| prod_manager | Production Manager |

**Password:** Enter anything (demo mode)

---

## 📁 Documentation Files:

- **README.md** - Complete project guide
- **QUICKSTART.md** - Quick start guide (this file)
- **DEPLOYMENT.md** - Production deployment guide
- **.env.example** - Environment configuration sample
- **.gitignore** - Git ignore file

---

## 🌐 URLs:

- **Development:** http://localhost:3000
- **Production:** https://steelmetrics.ir

---

## ⚠️ Important Notes:

1. **Demo Mode:** This is Frontend only with sample data
2. **Backend:** Real backend needs to be implemented
3. **Database:** PostgreSQL required for production
4. **Security:** HTTPS and security settings required for production

---

## 🆘 Troubleshooting:

### Port 3000 is busy:
```cmd
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

### npm install error:
```cmd
npm cache clean --force
rmdir /s /q node_modules
npm install
```

### Browser doesn't open:
- Manually open: http://localhost:3000
- Check antivirus firewall

### "npm not found" error:
- Make sure Node.js is installed
- Restart your computer after installing Node.js
- Run the bat file as Administrator if needed

---

## 📞 Support:

- Email: support@steelmetrics.ir
- Website: https://steelmetrics.ir

---

**Version:** 1.0.0  
**Date:** 1403  
**Domain:** steelmetrics.ir
