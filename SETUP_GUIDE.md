# PriceWize Setup Guide 🚀

Complete setup instructions for the production-ready PriceWize platform.

## ✅ What's Been Set Up

### 1. **Project Structure** ✓
- Complete folder hierarchy with components, lib, scripts, types, and config
- Organized by feature (device, layout, scraper, seo)
- TypeScript support throughout

### 2. **Database** ✓
- MongoDB connection with Mongoose
- Device schema with all required fields
- Database operations (CRUD, comparison, cleanup)
- Connection pooling for production

### 3. **Scrapers** ✓
- OLX Scraper (`src/lib/scraper/olxScraper.ts`)
- Cashify Scraper (`src/lib/scraper/cashifyScraper.ts`)
- eBay Scraper (`src/lib/scraper/ebayScraper.ts`)
- Model normalization utility
- Parallel scraper orchestration

### 4. **SEO Optimization** ✓
- Dynamic metadata generation
- JSON-LD structured data (Product, Organization, Breadcrumb)
- Sitemap generation (auto-generated on build)
- robots.txt configuration
- Open Graph tags
- Canonical URLs

### 5. **API Routes** ✓
- `GET /api/devices` - List all devices (paginated)
- `GET /api/devices/[model]` - Get device comparison
- `POST /api/scraper` - Trigger scraping (secured)

### 6. **UI Components** ✓
- PriceCard - Individual listing display
- CompareTable - Price comparison table
- ModelSearch - Search with suggestions
- Header - Navigation
- Footer - Site footer

### 7. **Pages** ✓
- Home page with hero, features, and CTA
- Dynamic device comparison pages
- Breadcrumb navigation
- Structured data integration

### 8. **Configuration** ✓
- Environment variables template
- SEO configuration
- Cron job configuration
- Sitemap configuration

### 9. **Scripts** ✓
- Cron scraper script
- npm scripts for development and production

## 🔧 Next Steps

### 1. **Set Up MongoDB**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `.env.local`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pricewize
   ```

### 2. **Configure Environment Variables**

Copy and update `.env.local`:
```bash
cp src/config/env.example .env.local
```

Edit `.env.local`:
```env
# MongoDB
MONGODB_URI=your-mongodb-uri

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Scraper
SCRAPER_SECRET=your-secret-key-here

# Cron
CRON_SCHEDULE=0 0 * * *
```

### 3. **Run Development Server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 4. **Test Scrapers**

```bash
# Run all scrapers
npm run scrape

# Run specific scraper
npm run scrape:olx
npm run scrape:cashify
npm run scrape:ebay
```

### 5. **Build for Production**

```bash
npm run build
npm start
```

## 🌐 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables:
   - `MONGODB_URI`
   - `SCRAPER_SECRET`
   - `NEXT_PUBLIC_SITE_URL`
4. Deploy

### Set Up Cron Jobs

**Option A: Vercel Cron**

Create `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/scraper",
    "schedule": "0 0 * * *"
  }]
}
```

**Option B: Google Cloud Scheduler**

1. Create Cloud Scheduler job
2. Set frequency: `0 0 * * *`
3. HTTP target: `https://your-domain.com/api/scraper`
4. Add header: `x-scraper-secret: your-secret-key`

## 📊 Database Setup

The MongoDB schema is automatically created on first connection.

**Device Collection:**
```javascript
{
  model: "iPhone 13 Pro Max",
  price: 62000,
  condition: "Good",
  location: "Delhi",
  platform: "OLX",
  url: "https://olx.in/...",
  sellerName: "John Seller",
  description: "iPhone 13 Pro Max in good condition",
  images: ["url1", "url2"],
  createdAt: ISODate(),
  updatedAt: ISODate()
}
```

## 🔍 SEO Checklist

- ✅ Dynamic meta tags per page
- ✅ Structured data (JSON-LD)
- ✅ Sitemap generation
- ✅ robots.txt
- ✅ Open Graph tags
- ✅ Canonical URLs
- ✅ Image optimization
- ✅ Mobile responsive
- ✅ Fast page load (ISR)

## 🚀 Performance Optimization

- React Compiler enabled
- Tailwind CSS for minimal CSS
- Image optimization
- ISR for device pages
- Database indexing on model field
- Caching strategies

## 🔐 Security

- Scraper endpoint secured with `x-scraper-secret` header
- Environment variables for sensitive data
- MongoDB connection string in env
- CORS ready for API

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run scrape       # Run all scrapers
npm run scrape:olx   # Run OLX scraper
npm run scrape:cashify # Run Cashify scraper
npm run scrape:ebay  # Run eBay scraper
npm run sitemap      # Generate sitemap
```

## 🐛 Troubleshooting

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript: `npx tsc --noEmit`

### Database Connection Issues
- Verify MongoDB URI in `.env.local`
- Check IP whitelist in MongoDB Atlas
- Ensure database name is correct

### Scraper Issues
- Check internet connection
- Verify platform URLs are accessible
- Check scraper logs in console

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB Docs](https://docs.mongodb.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

## 🎯 Future Enhancements

- [ ] AI fair value prediction
- [ ] User accounts and saved searches
- [ ] Price alerts and notifications
- [ ] Advanced filtering
- [ ] Mobile app
- [ ] Real-time price updates
- [ ] Seller ratings
- [ ] Payment integration

## 📞 Support

For issues or questions:
1. Check the README.md
2. Review configuration files
3. Check console logs
4. Open an issue on GitHub

---

**Happy coding! 🚀**

