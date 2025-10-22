# PriceWize - Complete File Index 📑

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| **README.md** | Full project documentation and features |
| **QUICKSTART.md** | 5-minute quick start guide |
| **SETUP_GUIDE.md** | Detailed setup and configuration |
| **PROJECT_SUMMARY.md** | Project overview and statistics |
| **DEPLOYMENT_CHECKLIST.md** | Pre-deployment verification checklist |
| **INDEX.md** | This file - complete file index |

## 🏗️ Application Files

### Pages & Routes

| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout with metadata |
| `src/app/page.tsx` | Home page with hero and search |
| `src/app/devices/[model]/page.tsx` | Dynamic device comparison page |
| `src/app/api/devices/route.ts` | GET all devices endpoint |
| `src/app/api/devices/[model]/route.ts` | GET device comparison endpoint |
| `src/app/api/scraper/route.ts` | POST scraper trigger endpoint |

### Components

| File | Purpose |
|------|---------|
| `src/components/device/PriceCard.tsx` | Individual listing card |
| `src/components/device/CompareTable.tsx` | Price comparison table |
| `src/components/device/ModelSearch.tsx` | Search input with suggestions |
| `src/components/layout/Header.tsx` | Navigation header |
| `src/components/layout/Footer.tsx` | Site footer |

### Core Libraries

| File | Purpose |
|------|---------|
| `src/lib/db.ts` | MongoDB connection and models |
| `src/lib/scraper/index.ts` | Scraper orchestration |
| `src/lib/scraper/olxScraper.ts` | OLX marketplace scraper |
| `src/lib/scraper/cashifyScraper.ts` | Cashify marketplace scraper |
| `src/lib/scraper/ebayScraper.ts` | eBay marketplace scraper |
| `src/lib/scraper/normalizeModel.ts` | Device model normalization |
| `src/lib/seo/generateMeta.ts` | Dynamic metadata generation |
| `src/lib/seo/sitemap.ts` | Sitemap generation utilities |
| `src/lib/seo/structuredData.ts` | JSON-LD structured data |

### Configuration

| File | Purpose |
|------|---------|
| `src/config/env.example` | Environment variables template |
| `src/config/seo.config.ts` | SEO configuration |
| `src/config/cron.config.ts` | Cron job configuration |

### Types

| File | Purpose |
|------|---------|
| `src/types/device.d.ts` | TypeScript type definitions |

### Scripts

| File | Purpose |
|------|---------|
| `src/scripts/cronScraper.ts` | Cron job script for scraping |

## ⚙️ Configuration Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js configuration |
| `tsconfig.json` | TypeScript configuration |
| `tailwind.config.ts` | Tailwind CSS configuration |
| `next-sitemap.config.js` | Sitemap generation config |
| `package.json` | Dependencies and scripts |
| `.env.local` | Environment variables (local) |
| `.env.example` | Environment variables template |

## 📦 Key Dependencies

### Production
- `next@16.0.0` - React framework
- `react@19.2.0` - UI library
- `typescript@5` - Type safety
- `mongoose@8.19.2` - MongoDB ODM
- `tailwindcss@4` - CSS framework
- `cheerio@1.1.2` - HTML parsing
- `playwright@1.56.1` - Browser automation
- `next-sitemap@4.2.3` - Sitemap generation
- `lucide-react` - Icon library

### Development
- `ts-node` - TypeScript execution
- `eslint@9` - Code linting
- `babel-plugin-react-compiler` - React optimization

## 🗂️ Directory Structure

```
pricewize/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   ├── devices/           # Device pages
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/            # React components
│   │   ├── device/
│   │   └── layout/
│   ├── lib/                   # Core logic
│   │   ├── scraper/
│   │   └── seo/
│   ├── scripts/               # Automation scripts
│   ├── types/                 # TypeScript types
│   ├── config/                # Configuration
│   └── styles/                # Global styles
├── public/                    # Static assets
├── .next/                     # Build output (generated)
├── node_modules/              # Dependencies (generated)
├── Documentation files        # README, guides, etc.
└── Configuration files        # next.config.ts, etc.
```

## 🚀 Quick Navigation

### Getting Started
1. Start here: **QUICKSTART.md**
2. Then read: **SETUP_GUIDE.md**
3. Reference: **README.md**

### Development
- Pages: `src/app/`
- Components: `src/components/`
- Logic: `src/lib/`
- Types: `src/types/device.d.ts`

### Deployment
- Checklist: **DEPLOYMENT_CHECKLIST.md**
- Config: `src/config/`
- Environment: `.env.local`

### API Reference
- Devices list: `src/app/api/devices/route.ts`
- Device detail: `src/app/api/devices/[model]/route.ts`
- Scraper: `src/app/api/scraper/route.ts`

### Scrapers
- Orchestration: `src/lib/scraper/index.ts`
- OLX: `src/lib/scraper/olxScraper.ts`
- Cashify: `src/lib/scraper/cashifyScraper.ts`
- eBay: `src/lib/scraper/ebayScraper.ts`

### SEO
- Metadata: `src/lib/seo/generateMeta.ts`
- Sitemap: `src/lib/seo/sitemap.ts`
- Structured Data: `src/lib/seo/structuredData.ts`

## 📊 File Statistics

- **Total Files**: 25+
- **TypeScript Files**: 24
- **Configuration Files**: 6
- **Documentation Files**: 6
- **Components**: 5
- **API Routes**: 3
- **Scrapers**: 3
- **Lines of Code**: 2000+

## 🔍 Finding Things

### By Feature
- **Home Page**: `src/app/page.tsx`
- **Device Pages**: `src/app/devices/[model]/page.tsx`
- **Search**: `src/components/device/ModelSearch.tsx`
- **Price Comparison**: `src/components/device/CompareTable.tsx`
- **Database**: `src/lib/db.ts`
- **Scrapers**: `src/lib/scraper/`
- **SEO**: `src/lib/seo/`

### By Type
- **Pages**: `src/app/`
- **Components**: `src/components/`
- **API**: `src/app/api/`
- **Logic**: `src/lib/`
- **Config**: `src/config/`
- **Types**: `src/types/`

## 📝 Common Tasks

| Task | File |
|------|------|
| Add new page | `src/app/[page]/page.tsx` |
| Add new component | `src/components/[category]/[name].tsx` |
| Add new API route | `src/app/api/[route]/route.ts` |
| Update database schema | `src/lib/db.ts` |
| Add new scraper | `src/lib/scraper/[name]Scraper.ts` |
| Update SEO | `src/lib/seo/generateMeta.ts` |
| Configure environment | `.env.local` |
| Update styles | `src/app/globals.css` |

## 🎯 Entry Points

- **Development**: `npm run dev` → `src/app/page.tsx`
- **Production**: `npm run build` → `.next/`
- **Scraping**: `npm run scrape` → `src/scripts/cronScraper.ts`
- **API**: `src/app/api/`

## 📚 Documentation Map

```
Documentation/
├── README.md                    # Start here
├── QUICKSTART.md               # 5-minute setup
├── SETUP_GUIDE.md              # Detailed setup
├── PROJECT_SUMMARY.md          # Overview
├── DEPLOYMENT_CHECKLIST.md     # Deployment
└── INDEX.md                    # This file
```

---

**Last Updated**: 2024
**Status**: ✅ Production Ready
**Version**: 1.0.0

