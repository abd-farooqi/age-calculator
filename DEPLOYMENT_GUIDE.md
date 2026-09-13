# 🚀 Agewise - Complete Deployment Guide

## 🔧 **FIXING LOCAL DEVELOPMENT ISSUES**

### **Problem 1: Windows Environment Variables** 
Your npm scripts don't work on Windows because they use Unix-style environment variables.

#### **Solution Options:**

**Option A: Use the Fixed Scripts (EASIEST)**
The cross-env package is already installed! Replace these lines in your `package.json`:

**FIND these lines:**
```json
"dev": "NODE_ENV=development tsx server/index.ts",
"start": "NODE_ENV=production node dist/index.js",
```

**REPLACE with:**
```json
"dev": "cross-env NODE_ENV=development tsx server/index.ts",
"start": "cross-env NODE_ENV=production node dist/index.js",
```

**Complete scripts section should look like:**
```json
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "cross-env NODE_ENV=production node dist/index.js",
    "check": "tsc",
    "db:push": "drizzle-kit push"
  }
}
```

**Option B: Windows-specific commands**
```bash
# For development (Windows PowerShell)
$env:NODE_ENV="development"; npx tsx server/index.ts

# For development (Windows CMD)
set NODE_ENV=development && npx tsx server/index.ts

# For production (Windows PowerShell)
$env:NODE_ENV="production"; node dist/index.js
```

### **Problem 2: Node.js Version**
You need **Node.js 20 or higher** for this project to work.

#### **Check your Node version:**
```bash
node --version
```

#### **If you have Node < 20, upgrade:**
- Download from: https://nodejs.org/ (LTS version)
- Or use nvm: `nvm install 20 && nvm use 20`

---

## 🏠 **RUNNING LOCALLY - STEP BY STEP**

### **1. Extract and Setup**
```bash
# Extract your ZIP file to a folder
cd your-age-calculator-folder

# Install dependencies
npm install
```

### **2. Development Mode**
```bash
# macOS/Linux:
npm run dev

# Windows PowerShell:
$env:NODE_ENV="development"; npx tsx server/index.ts

# Windows CMD:
set NODE_ENV=development && npx tsx server/index.ts
```

### **3. Production Mode (Test Build)**
```bash
# Build the project
npm run build

# Run production server
# macOS/Linux:
npm run start

# Windows PowerShell:
$env:NODE_ENV="production"; node dist/index.js
```

### **4. Open Your Browser**
Go to: `http://localhost:5000`

### **🚨 Common Issues & Fixes:**

**Port in Use Error:**
```bash
# macOS/Linux:
PORT=3000 npm run dev

# Windows PowerShell:
$env:PORT="3000"; npx tsx server/index.ts
```

**Permission Errors:**
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules
npm install
```

---

## 📱 **GITHUB UPLOAD & LIVE DEPLOYMENT**

### **Step 1: Prepare for GitHub**

**Create a GitHub repository:**
1. Go to GitHub.com
2. Click "New Repository"
3. Name it: `stylish-age-calculator`
4. Don't initialize with README (we already have files)

### **Step 2: Upload to GitHub**

In your project folder:
```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Stylish Age Calculator"

# Add your GitHub repository
git remote add origin https://github.com/yourusername/stylish-age-calculator.git

# Push to GitHub
git push -u origin main
```

### **Step 3: Deploy Live (Multiple Options)**

## 🌟 **OPTION 1: Render (Recommended - Free)**

1. **Go to [render.com](https://render.com)**
2. **Connect your GitHub account**
3. **Create "New Web Service"**
4. **Select your repository**
5. **Configure:**
   - **Name:** `stylish-age-calculator`
   - **Environment:** `Node`
   - **Build Command:** `npm ci && npm run build`
   - **Start Command:** `npm run start`
   - **Node Version:** Add Environment Variable:
     - `NODE_VERSION` = `20.11.1`

6. **Deploy!** Your app will be live in ~5 minutes

## 🚀 **OPTION 2: Railway**

1. **Go to [railway.app](https://railway.app)**
2. **Connect GitHub**
3. **Deploy from repo**
4. **Configure:**
   - **Build Command:** `npm ci && npm run build`
   - **Start Command:** `npm run start`
   - **Environment Variables:**
     - `NODE_VERSION` = `20.11.1`

## ⚡ **OPTION 3: Vercel (Frontend + Serverless)**

**Note:** Requires some configuration changes for the backend
1. **Go to [vercel.com](https://vercel.com)**
2. **Import from GitHub**
3. **Configure build settings**

---

## 🛠️ **TROUBLESHOOTING GUIDE**

### **Build Fails:**
```bash
# Clear everything and rebuild
rm -rf node_modules dist
npm cache clean --force
npm install
npm run build
```

### **App Won't Start:**
1. Check Node version: `node --version` (must be 20+)
2. Check port availability
3. Check environment variables

### **Styles Not Loading:**
The build process bundles everything correctly. If styles aren't loading in production:
```bash
# Rebuild
npm run build
npm run start
```

### **Live Deployment Issues:**
1. **Build Command:** `npm ci && npm run build`
2. **Start Command:** `npm run start`
3. **Node Version:** 20.11.1 or higher
4. **Check logs** in your hosting platform dashboard

---

## ✅ **VERIFICATION CHECKLIST**

**Local Development:**
- [ ] Node.js 20+ installed
- [ ] `npm install` completed successfully
- [ ] `npm run dev` starts without errors
- [ ] App loads at `http://localhost:5000`
- [ ] Age calculator works (enter birth date, see animations)

**Production Build:**
- [ ] `npm run build` completes successfully
- [ ] `npm run start` serves the app
- [ ] All features work in production mode

**Deployment:**
- [ ] Code pushed to GitHub
- [ ] Hosting platform configured correctly
- [ ] Live URL accessible
- [ ] All animations and features working online

---

## 🆘 **STILL HAVING ISSUES?**

**Common Environment-Specific Fixes:**

**Windows Users:**
- Use PowerShell (not CMD)
- Install Windows Build Tools: `npm install -g windows-build-tools`
- Try running as Administrator

**Mac Users:**
- Install Xcode Command Line Tools: `xcode-select --install`
- Use Homebrew for Node: `brew install node@20`

**Linux Users:**
- Install build essentials: `sudo apt-get install build-essential`
- Use NodeSource repository for latest Node

---

## 🎉 **SUCCESS!**

Once deployed, Agewise will be live with:
- ✨ Beautiful particle animations
- 🎂 Real-time age calculations  
- 📊 Life milestone progress bars
- 🎨 Responsive design
- ⚡ Lightning-fast performance

Your live URL will be something like:
- Render: `https://your-app-name.onrender.com`
- Railway: `https://your-app-name.up.railway.app`
- Vercel: `https://your-app-name.vercel.app`

**Happy coding! 🚀**
