/**
 * Test script to verify scrapers are working
 * Run with: node test-scrapers.js
 */

async function testScrapers() {
  console.log("🧪 Testing PriceWize Scrapers\n");

  try {
    // Test API endpoint
    const baseUrl = "http://localhost:3000";

    console.log("📝 Testing OLX Scraper via API...");
    const olxResponse = await fetch(`${baseUrl}/api/scraper/trigger`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform: "olx",
        query: "samsung",
      }),
    });

    if (olxResponse.ok) {
      const olxData = await olxResponse.json();
      console.log("✅ OLX Scraper Response:", {
        success: olxData.success,
        itemsScraped: olxData.stats?.itemsScraped,
        itemsAdded: olxData.stats?.itemsAdded,
      });
    } else {
      console.error("❌ OLX Scraper failed:", olxResponse.status);
    }

    console.log("\n📝 Testing PriceOye Scraper via API...");
    const priceoyeResponse = await fetch(`${baseUrl}/api/scraper/trigger`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform: "priceoye",
        query: "samsung",
      }),
    });

    if (priceoyeResponse.ok) {
      const priceoyeData = await priceoyeResponse.json();
      console.log("✅ PriceOye Scraper Response:", {
        success: priceoyeData.success,
        itemsScraped: priceoyeData.stats?.itemsScraped,
        itemsAdded: priceoyeData.stats?.itemsAdded,
      });
    } else {
      console.error("❌ PriceOye Scraper failed:", priceoyeResponse.status);
    }

    console.log("\n📝 Testing All Scrapers via API...");
    const allResponse = await fetch(`${baseUrl}/api/scraper/trigger`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform: "all",
        query: "oneplus",
      }),
    });

    if (allResponse.ok) {
      const allData = await allResponse.json();
      console.log("✅ All Scrapers Response:", {
        success: allData.success,
        itemsScraped: allData.stats?.itemsScraped,
        itemsAdded: allData.stats?.itemsAdded,
      });
    } else {
      console.error("❌ All Scrapers failed:", allResponse.status);
    }

    console.log("\n✅ All tests completed!");
  } catch (error) {
    console.error("❌ Test error:", error.message);
  }
}

testScrapers();

