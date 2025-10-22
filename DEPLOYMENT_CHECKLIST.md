# PriceWize Deployment Checklist ✅

Complete checklist for deploying PriceWize to production.

## Pre-Deployment

### Code Quality
- [ ] Run `npm run lint` - no errors
- [ ] Run `npm run build` - successful build
- [ ] Test all pages locally
- [ ] Test all API endpoints
- [ ] Test scrapers: `npm run scrape`
- [ ] Check console for warnings
- [ ] Review TypeScript types: `npx tsc --noEmit`

### Environment Setup
- [ ] Create `.env.local` with all variables
- [ ] Verify MongoDB URI is correct
- [ ] Set unique `SCRAPER_SECRET`
- [ ] Set correct `NEXT_PUBLIC_SITE_URL`
- [ ] Test database connection
- [ ] Verify all env vars are set

### Database
- [ ] MongoDB Atlas account created
- [ ] Cluster created and running
- [ ] IP whitelist configured
- [ ] Database user created
- [ ] Connection string verified
- [ ] Test connection from local machine

### Git
- [ ] All changes committed
- [ ] No uncommitted files
- [ ] Branch is up to date
- [ ] Ready to push to main

## Vercel Deployment

### Setup
- [ ] GitHub account connected
- [ ] Repository pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported to Vercel

### Configuration
- [ ] Environment variables added:
  - [ ] `MONGODB_URI`
  - [ ] `SCRAPER_SECRET`
  - [ ] `NEXT_PUBLIC_SITE_URL`
- [ ] Build settings verified
- [ ] Node version set to 18+
- [ ] Install command: `npm install`
- [ ] Build command: `npm run build`
- [ ] Output directory: `.next`

### Deployment
- [ ] Initial deployment successful
- [ ] No build errors
- [ ] No runtime errors
- [ ] All pages accessible
- [ ] API endpoints working
- [ ] Sitemap generated
- [ ] robots.txt accessible

### Post-Deployment
- [ ] Test home page
- [ ] Test device search
- [ ] Test API endpoints
- [ ] Check SEO meta tags
- [ ] Verify sitemap.xml
- [ ] Check robots.txt
- [ ] Test on mobile

## Cron Jobs Setup

### Option A: Vercel Cron

- [ ] Create `vercel.json` in root:
```json
{
  "crons": [{
    "path": "/api/scraper",
    "schedule": "0 0 * * *"
  }]
}
```
- [ ] Commit and push
- [ ] Verify cron job in Vercel dashboard
- [ ] Test cron job manually

### Option B: Google Cloud Scheduler

- [ ] GCP account created
- [ ] Project created
- [ ] Cloud Scheduler API enabled
- [ ] Service account created
- [ ] Create HTTP job:
  - [ ] Frequency: `0 0 * * *`
  - [ ] Timezone: UTC
  - [ ] URL: `https://your-domain.com/api/scraper`
  - [ ] HTTP method: POST
  - [ ] Headers: `x-scraper-secret: your-secret-key`
- [ ] Test job manually
- [ ] Verify execution logs

## Domain & DNS

- [ ] Domain registered
- [ ] DNS records configured
- [ ] SSL certificate installed
- [ ] HTTPS working
- [ ] Redirect HTTP to HTTPS
- [ ] Update `NEXT_PUBLIC_SITE_URL`

## Monitoring & Analytics

- [ ] Google Analytics setup (optional)
- [ ] Vercel Analytics enabled
- [ ] Error tracking configured
- [ ] Uptime monitoring setup
- [ ] Database monitoring enabled
- [ ] Logs accessible

## SEO & Indexing

- [ ] Sitemap submitted to Google Search Console
- [ ] Sitemap submitted to Bing Webmaster Tools
- [ ] robots.txt verified
- [ ] Meta tags verified
- [ ] Structured data tested
- [ ] Mobile-friendly test passed
- [ ] Page speed optimized

## Security

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] API endpoints secured
- [ ] Scraper secret is strong
- [ ] No secrets in code
- [ ] Environment variables secured
- [ ] MongoDB IP whitelist set

## Performance

- [ ] Page load time < 3s
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals optimized
- [ ] Images optimized
- [ ] CSS minified
- [ ] JavaScript minified
- [ ] Caching configured

## Backup & Recovery

- [ ] Database backups enabled
- [ ] Backup schedule set
- [ ] Recovery procedure documented
- [ ] Test restore process
- [ ] Disaster recovery plan

## Documentation

- [ ] README.md updated
- [ ] SETUP_GUIDE.md reviewed
- [ ] QUICKSTART.md reviewed
- [ ] API documentation complete
- [ ] Deployment notes documented
- [ ] Troubleshooting guide updated

## Final Checks

- [ ] All tests passing
- [ ] No console errors
- [ ] No console warnings
- [ ] Performance acceptable
- [ ] Mobile responsive
- [ ] Accessibility checked
- [ ] Cross-browser tested
- [ ] Ready for production

## Post-Launch

- [ ] Monitor error logs
- [ ] Check database growth
- [ ] Verify cron jobs running
- [ ] Monitor API performance
- [ ] Check user feedback
- [ ] Plan next features
- [ ] Schedule maintenance window

## Rollback Plan

- [ ] Previous version tagged
- [ ] Rollback procedure documented
- [ ] Database backup available
- [ ] Quick rollback tested
- [ ] Team notified of procedure

## Success Criteria

✅ All items checked
✅ No critical issues
✅ Performance acceptable
✅ SEO optimized
✅ Security verified
✅ Monitoring active
✅ Team trained
✅ Documentation complete

---

**Deployment Status: Ready for Production** 🚀

**Last Updated:** [Date]
**Deployed By:** [Name]
**Deployment Time:** [Time]

