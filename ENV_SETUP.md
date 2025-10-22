# 🔐 Environment Configuration Guide

This guide explains how to properly set up environment variables for PriceWize without hardcoding sensitive information.

## ⚠️ IMPORTANT: Security Best Practices

**NEVER hardcode sensitive information in your code!**
- ❌ Don't commit `.env.local` to version control
- ❌ Don't hardcode API keys, passwords, or connection strings
- ❌ Don't share `.env.local` files with others
- ✅ Use `.env.local` for local development only
- ✅ Use environment variables in production (Vercel, Docker, etc.)

---

## 📋 Quick Setup

### 1. Copy the Example File
```bash
cp .env.example .env.local
```

### 2. Fill in Your Values
Edit `.env.local` and replace placeholder values with your actual credentials.

### 3. Verify It's Ignored
Make sure `.env.local` is in `.gitignore`:
```bash
cat .gitignore | grep env.local
```

---

## 🗄️ MongoDB Setup

### Get Your Connection String

1. **Create MongoDB Atlas Account**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Sign up for free (includes 512MB free tier)

2. **Create a Cluster**
   - Click "Create a Deployment"
   - Choose "Free" tier
   - Select your region
   - Click "Create Deployment"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Click "Add User"

4. **Get Connection String**
   - Go to "Databases"
   - Click "Connect" on your cluster
   - Choose "Drivers"
   - Copy the connection string
   - Replace `<username>` and `<password>` with your credentials

5. **Update .env.local**
```
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/pricewize?retryWrites=true&w=majority
```

### Example Connection String
```
mongodb+srv://ibrar:MyPassword123@pricewize.76r16dx.mongodb.net/pricewize?retryWrites=true&w=majority
```

---

## 🔑 JWT Secret Setup

### Generate a Strong Secret

**Option 1: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2: Using OpenSSL**
```bash
openssl rand -hex 32
```

**Option 3: Using Python**
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

### Update .env.local
```
JWT_SECRET=your-generated-secret-here
JWT_EXPIRY=7d
```

---

## 🌐 Site Configuration

### Local Development
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production (Vercel)
```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## 🤖 Scraper Configuration

### Generate Scraper Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Update .env.local
```
SCRAPER_SECRET=your-generated-secret-here
```

---

## ⏰ Cron Job Configuration

### Common Schedules

| Schedule | Meaning |
|----------|---------|
| `0 0 * * *` | Every day at midnight |
| `0 */6 * * *` | Every 6 hours |
| `0 9 * * 1-5` | Every weekday at 9 AM |
| `0 0 * * 0` | Every Sunday at midnight |
| `*/30 * * * *` | Every 30 minutes |

### Update .env.local
```
CRON_SCHEDULE=0 0 * * *
```

---

## 📝 Complete .env.local Example

```env
# MongoDB
MONGODB_URI=mongodb+srv://ibrar:MyPassword123@pricewize.76r16dx.mongodb.net/pricewize?retryWrites=true&w=majority

# JWT
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
JWT_EXPIRY=7d

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Scraper
SCRAPER_SECRET=x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6

# Cron
CRON_SCHEDULE=0 0 * * *

# Logging
LOG_LEVEL=info
```

---

## 🚀 Deployment to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Add PriceWize project"
git push origin main
```

### 2. Connect to Vercel
- Visit: https://vercel.com
- Click "New Project"
- Import your GitHub repository
- Click "Import"

### 3. Add Environment Variables
- Go to "Settings" → "Environment Variables"
- Add each variable from `.env.local`:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `JWT_EXPIRY`
  - `NEXT_PUBLIC_SITE_URL`
  - `SCRAPER_SECRET`
  - `CRON_SCHEDULE`
  - `LOG_LEVEL`

### 4. Deploy
- Click "Deploy"
- Wait for deployment to complete
- Your site is now live!

---

## 🐳 Docker Deployment

### Create .env File
```bash
cp .env.example .env
# Edit .env with production values
```

### Build and Run
```bash
docker build -t pricewize .
docker run -p 3000:3000 --env-file .env pricewize
```

---

## ✅ Verification Checklist

- [ ] `.env.local` is created and filled with values
- [ ] `.env.local` is in `.gitignore`
- [ ] MongoDB connection string is valid
- [ ] JWT secret is generated and strong
- [ ] Site URL is correct for your environment
- [ ] Scraper secret is generated
- [ ] Cron schedule is set
- [ ] No sensitive data is hardcoded in source files
- [ ] All environment variables are documented

---

## 🆘 Troubleshooting

### MongoDB Connection Error
```
Error: querySrv ENOTFOUND _mongodb._tcp.cluster.mongodb.net
```

**Solution:**
- Check your connection string is correct
- Verify username and password are URL-encoded
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for development)
- Ensure database user exists

### JWT Secret Not Set
```
Error: MONGODB_URI not defined in environment variables
```

**Solution:**
- Create `.env.local` file
- Add all required variables
- Restart development server: `npm run dev`

### Environment Variables Not Loading
**Solution:**
- Restart development server
- Check `.env.local` syntax (no spaces around `=`)
- Verify file is in project root directory

---

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**Last Updated:** 2025-10-22

