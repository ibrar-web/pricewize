# 🗄️ MongoDB Setup Guide - Step by Step

## ⚠️ Current Issue

Your `.env.local` has placeholder values. The app can't connect to MongoDB because:
- `MONGODB_URI` is not set to a real connection string
- MongoDB is trying to connect to `_mongodb._tcp.cluster.mongodb.net` (placeholder)

## ✅ Solution: Get Real MongoDB Credentials

### Option 1: MongoDB Atlas (Cloud - Recommended) ⭐

**Step 1: Create MongoDB Atlas Account**
1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with email/Google/GitHub
4. Verify email

**Step 2: Create a Cluster**
1. Click "Create a Deployment"
2. Choose "Free" tier (M0 - 512MB)
3. Select your region (closest to you)
4. Click "Create Deployment"
5. Wait 2-3 minutes for cluster to be ready

**Step 3: Create Database User**
1. Go to "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter username: `pricewize_user`
5. Enter password: Create a strong password (save it!)
6. Click "Add User"

**Step 4: Get Connection String**
1. Go to "Databases" (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Drivers"
4. Copy the connection string
5. It will look like:
   ```
   mongodb+srv://pricewize_user:PASSWORD@cluster0.mongodb.net/?retryWrites=true&w=majority
   ```

**Step 5: Replace Placeholders**
Replace `PASSWORD` with your actual password:
```
mongodb+srv://pricewize_user:your-actual-password@cluster0.mongodb.net/pricewize?retryWrites=true&w=majority
```

**Step 6: Update .env.local**
```env
MONGODB_URI=mongodb+srv://pricewize_user:your-actual-password@cluster0.mongodb.net/pricewize?retryWrites=true&w=majority
```

**Step 7: Allow Network Access**
1. Go to "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

---

### Option 2: Local MongoDB (Docker)

**Step 1: Install Docker**
- Download from: https://www.docker.com/products/docker-desktop

**Step 2: Run MongoDB Container**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Step 3: Update .env.local**
```env
MONGODB_URI=mongodb://localhost:27017/pricewize
```

**Step 4: Verify Connection**
```bash
docker ps | grep mongodb
```

---

### Option 3: MongoDB Community (Local Installation)

**Step 1: Install MongoDB**
- macOS: `brew install mongodb-community`
- Windows: Download from https://www.mongodb.com/try/download/community
- Linux: `sudo apt-get install mongodb`

**Step 2: Start MongoDB**
```bash
# macOS/Linux
mongod

# Windows
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
```

**Step 3: Update .env.local**
```env
MONGODB_URI=mongodb://localhost:27017/pricewize
```

---

## 🔧 Update .env.local

### Current (Broken)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pricewize?retryWrites=true&w=majority
```

### Fixed (MongoDB Atlas Example)
```env
MONGODB_URI=mongodb+srv://pricewize_user:MyPassword123@cluster0.mongodb.net/pricewize?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-change-this-in-production-12345
JWT_EXPIRY=7d
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SCRAPER_SECRET=dev-secret-key-change-in-production-min-32-chars-12345678901234567890
CRON_SCHEDULE=0 0 * * *
LOG_LEVEL=info
```

### Fixed (Local MongoDB Example)
```env
MONGODB_URI=mongodb://localhost:27017/pricewize
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-change-this-in-production-12345
JWT_EXPIRY=7d
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SCRAPER_SECRET=dev-secret-key-change-in-production-min-32-chars-12345678901234567890
CRON_SCHEDULE=0 0 * * *
LOG_LEVEL=info
```

---

## ✅ Verify Connection

### Step 1: Update .env.local
Edit `.env.local` with your real MongoDB connection string

### Step 2: Restart Dev Server
```bash
# Stop current server (Ctrl+C)
# Then restart
npm run dev
```

### Step 3: Check Logs
Look for:
```
✅ MongoDB connected successfully
```

NOT:
```
❌ MongoDB connection error
```

### Step 4: Test in Browser
1. Go to http://localhost:3000
2. Click "Browse Devices"
3. Should load without errors

---

## 🐛 Troubleshooting

### Error: querySrv ENOTFOUND
```
Error: querySrv ENOTFOUND _mongodb._tcp.cluster.mongodb.net
```

**Causes:**
- `.env.local` has placeholder values
- Connection string is incorrect
- MongoDB Atlas cluster not ready
- Network access not allowed

**Solutions:**
1. Check `.env.local` has real connection string
2. Verify connection string format
3. Wait for MongoDB Atlas cluster to be ready
4. Allow network access in MongoDB Atlas

### Error: Authentication Failed
```
Error: authentication failed
```

**Causes:**
- Wrong username/password
- User doesn't exist
- Special characters not URL-encoded

**Solutions:**
1. Verify username and password
2. Check user exists in MongoDB Atlas
3. URL-encode special characters (e.g., `@` → `%40`)

### Error: Connection Timeout
```
Error: connect ETIMEDOUT
```

**Causes:**
- MongoDB not running (local)
- Network access not allowed (Atlas)
- Firewall blocking connection

**Solutions:**
1. Start MongoDB: `mongod` or `docker run -d -p 27017:27017 mongo`
2. Allow network access in MongoDB Atlas
3. Check firewall settings

---

## 📝 Connection String Format

### MongoDB Atlas
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### Local MongoDB
```
mongodb://localhost:27017/database
```

### With Authentication
```
mongodb://username:password@localhost:27017/database
```

---

## 🔐 Security Tips

✅ **DO:**
- Use strong passwords (12+ characters)
- URL-encode special characters
- Use different credentials per environment
- Rotate credentials regularly
- Use IP whitelist in MongoDB Atlas

❌ **DON'T:**
- Use simple passwords
- Hardcode credentials in code
- Share connection strings
- Use same credentials for all environments
- Allow access from 0.0.0.0/0 in production

---

## 📚 Next Steps

1. ✅ Choose MongoDB option (Atlas/Docker/Local)
2. ✅ Get connection string
3. ✅ Update `.env.local`
4. ✅ Restart dev server: `npm run dev`
5. ✅ Test in browser: http://localhost:3000

---

**Need Help?**
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- MongoDB Connection Strings: https://docs.mongodb.com/manual/reference/connection-string/
- Docker MongoDB: https://hub.docker.com/_/mongo


