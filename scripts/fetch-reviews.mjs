import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appsPath = join(__dirname, "..", "src", "data", "apps.json");
const reviewsPath = join(__dirname, "..", "src", "data", "reviews.json");

async function main() {
  if (!existsSync(appsPath)) {
    console.error("apps.json not found at", appsPath);
    process.exit(1);
  }

  const apps = JSON.parse(readFileSync(appsPath, "utf-8"));
  const allReviews = [];
  let totalFetched = 0;

  for (const app of apps) {
    // Fetch Apple App Store reviews
    if (app.appleId) {
      try {
        const store = await import("app-store-scraper");
        const numericId = parseInt(app.appleId.replace("id", ""), 10);
        const reviews = await store.default.reviews({
          id: numericId,
          sort: store.default.sort.RECENT,
          page: 1,
        });

        for (const r of reviews.slice(0, 10)) {
          if (r.score >= 4) {
            allReviews.push({
              appName: app.name,
              store: "apple",
              author: r.userName || "Anonymous",
              rating: r.score,
              title: r.title || "",
              text: r.text || "",
              date: r.updated
                ? new Date(r.updated).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0],
            });
          }
        }

        totalFetched += reviews.length;
        console.log(`  Apple: fetched ${reviews.length} reviews for ${app.name}`);
      } catch (err) {
        console.warn(`  Apple: failed to fetch reviews for ${app.name}:`, err.message);
      }
    }

    // Fetch Google Play Store reviews
    if (app.googlePackage) {
      try {
        const gplay = await import("google-play-scraper");
        const reviews = await gplay.default.reviews({
          appId: app.googlePackage,
          sort: gplay.default.sort.NEWEST,
          num: 10,
        });

        const reviewData = reviews.data || reviews;
        for (const r of (Array.isArray(reviewData) ? reviewData : []).slice(0, 10)) {
          if (r.score >= 4) {
            allReviews.push({
              appName: app.name,
              store: "google",
              author: r.userName || "Anonymous",
              rating: r.score,
              title: r.title || "",
              text: r.text || "",
              date: r.date
                ? new Date(r.date).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0],
            });
          }
        }

        const count = Array.isArray(reviewData) ? reviewData.length : 0;
        totalFetched += count;
        console.log(`  Google: fetched ${count} reviews for ${app.name}`);
      } catch (err) {
        console.warn(`  Google: failed to fetch reviews for ${app.name}:`, err.message);
      }
    }
  }

  // Deduplicate by author + appName
  const seen = new Set();
  const deduplicated = allReviews.filter((r) => {
    const key = `${r.author}:${r.appName}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by date descending
  deduplicated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  writeFileSync(reviewsPath, JSON.stringify(deduplicated, null, 2) + "\n");
  console.log(`\nFetched ${totalFetched} reviews for ${apps.length} apps (${deduplicated.length} after filtering)`);
}

// Ensure reviews.json exists even if script fails
if (!existsSync(reviewsPath)) {
  writeFileSync(reviewsPath, "[]\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
