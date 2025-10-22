# PriceWize 🔥

**Find the Smartest Deals on Used Devices**

PriceWize is a production-ready SEO-optimized platform that aggregates and compares used device prices from multiple marketplaces (OLX, Cashify, eBay, etc.) using Next.js 15, TypeScript, Tailwind CSS, and MongoDB.

## 🎯 Features

✅ **SEO Optimized** - Dynamic meta tags, structured data, sitemap generation
✅ **Price Comparison** - Compare prices across OLX, Cashify, eBay
✅ **Real-time Data** - Daily automated scraping with cron jobs
✅ **MongoDB Integration** - Scalable database for device listings
✅ **API Routes** - RESTful endpoints for device data and scraping
✅ **Responsive UI** - Beautiful components with Tailwind CSS
✅ **React Compiler** - Optimized performance with React 19
✅ **Production Ready** - Deployment-ready for Vercel + cron servers

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express (via Next.js API routes)
- **Database**: MongoDB Atlas
- **Scrapers**: Playwright, Cheerio
- **Deployment**: Vercel, Google Cloud Scheduler
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── devices/
│   │   └── [model]/page.tsx    # Dynamic device comparison page
│   └── api/
│       ├── devices/            # Device listing endpoints
│       └── scraper/            # Scraper trigger endpoint
├── components/
│   ├── device/                 # Device-specific components
│   │   ├── PriceCard.tsx
│   │   ├── CompareTable.tsx
│   │   └── ModelSearch.tsx
│   └── layout/                 # Layout components
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/
│   ├── db.ts                   # MongoDB connection & models
│   ├── scraper/                # Scraper modules
│   │   ├── index.ts
│   │   ├── olxScraper.ts
│   │   ├── cashifyScraper.ts
│   │   ├── ebayScraper.ts
│   │   └── normalizeModel.ts
│   └── seo/                    # SEO utilities
│       ├── generateMeta.ts
│       ├── sitemap.ts
│       └── structuredData.ts
├── scripts/
│   └── cronScraper.ts          # Cron job script
├── types/
│   └── device.d.ts             # TypeScript types
└── config/
    ├── env.example
    ├── seo.config.ts
    └── cron.config.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd pricewize
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp src/config/env.example .env.local
   ```

   Edit `.env.local` and add your MongoDB URI:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pricewize
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   SCRAPER_SECRET=your-secret-key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Development

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Scraping

```bash
# Run all scrapers
npm run scrape

# Run specific scraper
npm run scrape:olx
npm run scrape:cashify
npm run scrape:ebay
```

### SEO

```bash
# Generate sitemap and robots.txt
npm run sitemap
```

## 🔌 API Endpoints

### Get All Devices
```
GET /api/devices?page=1&limit=20
```

### Get Device Comparison
```
GET /api/devices/[model]
```

### Trigger Scraper
```
POST /api/scraper
Headers: x-scraper-secret: your-secret-key
Body: { "platform": "all" | "olx" | "cashify" | "ebay" }
```

## 🌐 Deployment

### Vercel

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Cron Jobs

**Option 1: Vercel Cron**
```json
// vercel.json
{
  "crons": [{
    "path": "/api/scraper",
    "schedule": "0 0 * * *"
  }]
}
```

**Option 2: Google Cloud Scheduler**
- Create a Cloud Scheduler job
- Set frequency: `0 0 * * *` (daily at midnight)
- HTTP target: `https://your-domain.com/api/scraper`
- Add header: `x-scraper-secret: your-secret-key`

## 📊 Database Schema

### Device Listing
```typescript
{
  _id: ObjectId
  model: string
  price: number
  condition: "Excellent" | "Good" | "Fair" | "Poor"
  location: string
  platform: "OLX" | "Cashify" | "eBay" | "Other"
  url: string
  sellerName?: string
  description?: string
  images?: string[]
  createdAt: Date
  updatedAt: Date
}
```

## 🔍 SEO Features

- ✅ Dynamic meta tags per device page
- ✅ JSON-LD structured data (Product, Organization, BreadcrumbList)
- ✅ Auto-generated sitemap.xml
- ✅ robots.txt configuration
- ✅ Open Graph tags for social sharing
- ✅ Canonical URLs
- ✅ Image optimization
- ✅ ISR (Incremental Static Regeneration)

## 🤖 Future AI Features

Placeholder structure for AI-driven features:
```
src/lib/ai/
├── fairValueModel.ts      # Predict fair market price
└── suggestBestDeal.ts     # AI deal recommendations
```

## 🛠️ Configuration Files

- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `next-sitemap.config.js` - Sitemap generation
- `src/config/seo.config.ts` - SEO settings
- `src/config/cron.config.ts` - Cron job settings

## 📝 Environment Variables

See `src/config/env.example` for all available options.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

For issues and questions, please open an issue on GitHub or contact support@pricewize.com

---

**Built with ❤️ using Next.js 15, TypeScript, and Tailwind CSS**
# pricewize
# pricewize
