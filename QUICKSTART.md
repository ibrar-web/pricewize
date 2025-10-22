# PriceWize Quick Start ⚡

Get PriceWize running in 5 minutes!

## 1️⃣ Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier available)
- Git

## 2️⃣ Clone & Install

```bash
# Clone repository
git clone <repo-url>
cd pricewize

# Install dependencies
npm install
```

## 3️⃣ Set Up MongoDB

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster
4. Get connection string
5. Copy to `.env.local`

## 4️⃣ Configure Environment

```bash
# Copy example env
cp src/config/env.example .env.local

# Edit .env.local and add:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pricewize
# NEXT_PUBLIC_SITE_URL=http://localhost:3000
# SCRAPER_SECRET=dev-secret-key
```

## 5️⃣ Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 🧪 Test Features

### Test Home Page
- Visit http://localhost:3000
- See hero section with search

### Test Search
- Search for "iPhone 13 Pro Max"
- Should redirect to device page

### Test API
```bash
# Get all devices
curl http://localhost:3000/api/devices

# Get specific device
curl http://localhost:3000/api/devices/iphone-13-pro-max
```

### Test Scraper
```bash
# Run scrapers (populates database)
npm run scrape

# Trigger via API
curl -X POST http://localhost:3000/api/scraper \
  -H "x-scraper-secret: dev-secret-key" \
  -H "Content-Type: application/json" \
  -d '{"platform":"all"}'
```

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🚀 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add environment variables in Vercel dashboard.

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Home page |
| `src/app/devices/[model]/page.tsx` | Device comparison page |
| `src/app/api/devices/route.ts` | List devices API |
| `src/app/api/devices/[model]/route.ts` | Device detail API |
| `src/app/api/scraper/route.ts` | Scraper trigger API |
| `src/lib/db.ts` | MongoDB connection |
| `src/lib/scraper/index.ts` | Scraper orchestration |
| `src/components/device/PriceCard.tsx` | Price card component |
| `src/components/device/CompareTable.tsx` | Comparison table |
| `.env.local` | Environment variables |

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Scraping
npm run scrape           # Run all scrapers
npm run scrape:olx       # Run OLX scraper
npm run scrape:cashify   # Run Cashify scraper
npm run scrape:ebay      # Run eBay scraper

# SEO
npm run sitemap          # Generate sitemap

# Linting
npm run lint             # Run ESLint
```

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### MongoDB connection error
- Check `.env.local` has correct URI
- Verify IP whitelist in MongoDB Atlas
- Ensure database name is "pricewize"

### Build fails
```bash
rm -rf .next node_modules
npm install
npm run build
```

## 📚 Learn More

- [README.md](./README.md) - Full documentation
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Detailed setup
- [Next.js Docs](https://nextjs.org/docs)

## 🎯 Next Steps

1. ✅ Run development server
2. ✅ Test home page
3. ✅ Run scrapers to populate data
4. ✅ Test device comparison pages
5. ✅ Deploy to Vercel
6. ✅ Set up cron jobs

## 💡 Tips

- Use `npm run scrape` to populate database with test data
- Check browser console for errors
- Use MongoDB Atlas UI to view data
- Enable React DevTools for debugging

---

**Ready to go! 🚀**

Questions? Check [README.md](./README.md) or [SETUP_GUIDE.md](./SETUP_GUIDE.md)

