const { scrapeOLXPakistanWeb } = require('./src/lib/scraper/olxScraper.ts');

async function test() {
  console.log('Testing scraper...');
  const results = await scrapeOLXPakistanWeb('iPhone');
  console.log('Results:', JSON.stringify(results, null, 2));
}

test().catch(console.error);
