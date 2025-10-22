# 🚀 GET STARTED NOW - 3 Options

## ⚡ Option 1: Run NOW with Mock Data (2 minutes)

Your app is ready to run RIGHT NOW with demo data! No MongoDB setup needed yet.

### Step 1: Start Dev Server
```bash
npm run dev
```

### Step 2: Open Browser
```
http://localhost:3000
```

### Step 3: Explore the App
- ✅ Home page loads
- ✅ Click "Browse Devices" → See 8 demo devices
- ✅ Search for devices
- ✅ Click on device to see details
- ✅ Try admin login at `/admin/login`
- ✅ Try compare page at `/compare`

**Demo Credentials:**
- Email: `admin@pricewize.com`
- Password: `Admin@123`

---

## 🔧 Option 2: Add Real MongoDB (10 minutes)

### Step 1: Get MongoDB Connection String

**Choose ONE:**

**A) MongoDB Atlas (Cloud - Recommended)**
1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up (free)
3. Create cluster
4. Create user
5. Get connection string
6. Copy it

**B) Local MongoDB (Docker)**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```
Connection string: `mongodb://localhost:27017/pricewize`

**C) Local MongoDB (Installed)**
```bash
mongod
```
Connection string: `mongodb://localhost:27017/pricewize`

### Step 2: Update .env.local

Edit `.env.local` and replace:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pricewize?retryWrites=true&w=majority
```

With your actual connection string:
```env
MONGODB_URI=mongodb+srv://pricewize_user:MyPassword123@cluster0.mongodb.net/pricewize?retryWrites=true&w=majority
```

### Step 3: Restart Dev Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Step 4: Verify Connection
Look for in terminal:
```
✅ MongoDB connected successfully
```

---

## 📚 Option 3: Full Setup Guide

See **MONGODB_SETUP_GUIDE.md** for detailed step-by-step instructions.

---

## 🎯 What Works Now

### With Mock Data (No MongoDB)
✅ Home page
✅ Browse devices page
✅ Device search
✅ Device details page
✅ Admin login page
✅ Compare page
✅ All UI components

### With Real MongoDB
✅ Everything above +
✅ Real device data
✅ Real price data
✅ Admin dashboard
✅ Analytics
✅ Price tracking

---

## 🚀 Quick Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Check for errors
npm run lint
```

---

## 📋 Current Status

| Feature | Status | Notes |
|---------|--------|-------|
| Home Page | ✅ Working | Shows demo devices |
| Browse Devices | ✅ Working | 8 demo devices available |
| Search | ✅ Working | Search demo devices |
| Device Details | ✅ Working | Shows device info |
| Admin Login | ✅ Working | Demo credentials available |
| Compare | ✅ Working | Compare demo devices |
| MongoDB | ⚠️ Optional | Works with mock data, use real DB for production |

---

## 🔐 Demo Credentials

**Admin Login:**
- Email: `admin@pricewize.com`
- Password: `Admin@123`

---

## 📁 Important Files

- **MONGODB_SETUP_GUIDE.md** - Detailed MongoDB setup
- **ENV_SETUP.md** - Environment variables guide
- **QUICK_START.md** - Quick reference
- **.env.local** - Your configuration (don't commit!)
- **.env.example** - Template (safe to commit)

---

## ✅ Verification Checklist

### Before Running
- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Dependencies installed (`npm install`)

### After Starting Dev Server
- [ ] Terminal shows "ready - started server on 0.0.0.0:3000"
- [ ] No error messages
- [ ] Browser opens to http://localhost:3000

### In Browser
- [ ] Home page loads
- [ ] "Browse Devices" button works
- [ ] Devices page shows 8 devices
- [ ] Search works
- [ ] No console errors (F12 → Console)

---

## 🐛 Troubleshooting

### Issue: "Cannot find module"
```bash
npm install
npm run dev
```

### Issue: Port 3000 already in use
```bash
# Use different port
npm run dev -- -p 3001
```

### Issue: MongoDB connection error (but want to use mock data)
- This is OK! App uses mock data automatically
- To use real MongoDB, see MONGODB_SETUP_GUIDE.md

### Issue: Blank page or no devices showing
1. Check browser console (F12)
2. Check terminal for errors
3. Restart dev server: `npm run dev`

---

## 🎉 Next Steps

1. **Right Now:** Run `npm run dev` and explore the app
2. **Soon:** Add real MongoDB (see MONGODB_SETUP_GUIDE.md)
3. **Later:** Deploy to Vercel (see ENV_SETUP.md)

---

## 📞 Need Help?

1. Check **MONGODB_SETUP_GUIDE.md** for MongoDB issues
2. Check **ENV_SETUP.md** for environment issues
3. Check **QUICK_START.md** for quick reference
4. Check terminal output for error messages

---

**Status:** ✅ Ready to run NOW!

Start with: `npm run dev`


