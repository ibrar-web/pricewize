/**
 * Cron Job Configuration
 * Configure scheduled scraping jobs
 */

export const cronConfig = {
  // Scraper Schedule
  scraper: {
    // Cron expression: "0 0 * * *" = Daily at midnight UTC
    schedule: process.env.CRON_SCHEDULE || "0 0 * * *",
    enabled: true,
    timeout: 3600000, // 1 hour in milliseconds
    retryAttempts: 3,
    retryDelay: 5000, // 5 seconds
  },

  // Cleanup Schedule
  cleanup: {
    // Run cleanup daily at 2 AM UTC
    schedule: "0 2 * * *",
    enabled: true,
    // Delete listings older than 30 days
    daysOld: 30,
  },

  // Notification Settings
  notifications: {
    enabled: true,
    onSuccess: true,
    onFailure: true,
    email: process.env.SMTP_USER || "support@pricewize.com",
  },

  // Logging
  logging: {
    enabled: true,
    level: (process.env.LOG_LEVEL as "debug" | "info" | "warn" | "error") || "info",
    logFile: "./logs/cron.log",
  },

  // Platforms to Scrape
  platforms: {
    olx: {
      enabled: true,
      timeout: 30000,
      retryAttempts: 2,
    },
    cashify: {
      enabled: true,
      timeout: 30000,
      retryAttempts: 2,
    },
    ebay: {
      enabled: true,
      timeout: 30000,
      retryAttempts: 2,
    },
  },

  // Rate Limiting
  rateLimit: {
    enabled: true,
    requestsPerSecond: 1,
    delayBetweenRequests: 1000, // milliseconds
  },

  // Deployment Specific
  deployment: {
    // For Vercel Cron Jobs
    vercel: {
      enabled: process.env.VERCEL === "1",
      secret: process.env.SCRAPER_SECRET,
    },
    // For Google Cloud Scheduler
    gcp: {
      enabled: false,
      projectId: process.env.GCP_PROJECT_ID,
      topicName: "pricewize-scraper",
    },
  },
};

export default cronConfig;

