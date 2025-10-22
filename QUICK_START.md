# ⚡ Quick Start Guide

## 🚀 Get Running in 5 Minutes

### 1️⃣ Copy Environment Template
```bash
cp .env.example .env.local
```

### 2️⃣ Get MongoDB Connection String

**Option A: Use MongoDB Atlas (Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free tier available)
3. Create a cluster
4. Create a database user
5. Get connection string from "Connect" button
6. Copy the string

**Option B: Use Local MongoDB**
```
MONGODB_URI=mongodb://localhost:27017/pricewize
```

### 3️⃣ Update .env.local
```env
# Replace with your actual MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pricewize?retryWrites=true&w=majority

# Generate a secret: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your-generated-secret-here

# Keep these as-is for local development
JWT_EXPIRY=7d
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SCRAPER_SECRET=dev-secret-key
CRON_SCHEDULE=0 0 * * *
LOG_LEVEL=info
```

### 4️⃣ Install & Run
```bash
npm install
npm run dev
```

### 5️⃣ Open Browser
```
http://localhost:3000
```

---

## ✅ What Should Work

- ✅ Home page loads
- ✅ "Browse Devices" button works
- ✅ `/devices` page loads
- ✅ Search functionality works
- ✅ Admin login at `/admin/login`
- ✅ Compare page at `/compare`

---

## 🔧 Common Issues & Fixes

### Issue: MongoDB Connection Error
```
Error: querySrv ENOTFOUND _mongodb._tcp.cluster.mongodb.net
```

**Fix:**
1. Check `.env.local` has `MONGODB_URI`
2. Verify connection string is correct
3. Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0)
4. Restart: `npm run dev`

### Issue: Routes Not Found
```
http://localhost:3000/devices not found
```

**Fix:**
1. Run: `npm run build`
2. Restart: `npm run dev`

### Issue: Environment Variables Not Loading
**Fix:**
1. Verify `.env.local` is in project root
2. Check syntax: `KEY=value` (no spaces)
3. Restart: `npm run dev`

---

## 📚 Full Documentation

- **ENV_SETUP.md** - Complete environment setup
- **FIXES_APPLIED.md** - What was fixed
- **README.md** - Project overview
- **SETUP_GUIDE.md** - Detailed setup

---

## 🚀 Deploy to Vercel

1. Push to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variables (same as .env.local)
5. Deploy!

See **ENV_SETUP.md** for detailed instructions.

---

## 💡 Tips

- Never commit `.env.local` to Git
- Use `.env.example` as a template
- Generate strong secrets: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Keep `.env.local` in `.gitignore`

---

**Ready to go!** 🎉


