const puppeteer = require("puppeteer");

async function automate(centers) {
  if (!centers || centers.length === 0) {
    console.log("❌ No centers to automate.");
    return;
  }

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
  });

  console.log("\n🚀 Smart Sequential Automation Started\n");

  let currentIndex = 0;

  while (currentIndex >= 0 && currentIndex < centers.length) {
    const center = centers[currentIndex];

    if (!center.paymentLink) {
      console.log(`⏭ Skipping ${center.centerName}`);
      break;
    }

    const page = await browser.newPage();
    const pages = await browser.pages();
    const tabNumber = pages.length;

    console.log("=".repeat(70));
    console.log(`📌 [Tab ${tabNumber}] Opening`);
    console.log(`🏥 Center: ${center.centerName}`);
    console.log(`🔗 Link: ${center.paymentLink}`);
    console.log(`⭐ Source: ${center.linkSource}`);

    await page.goto(center.paymentLink, {
      waitUntil: "networkidle2",
      timeout: 0,
    });

    center.opened = true;

    // ===== SCRAPE WITH AUTO RELOAD =====
    let scrapedName = "Not found";
    let retry = 0;
    const MAX_RETRY = 20;

    while (scrapedName === "Not found") {
      scrapedName = await page.evaluate(() => {
        const text = document.body.innerText;
        const match = text.match(
          /Medical center information\s*\n*\s*([^\n]+)/i,
        );
        return match ? match[1].trim() : "Not found";
      });

      console.log(`🏥 Scraped center name: "${scrapedName}"`);

      if (scrapedName === "Not found") {
        retry++;

        if (retry >= MAX_RETRY) {
          console.log("❌ Max reload reached. Skipping this center.");
          break;
        }

        console.log("🔄 Name not found → Reloading after 3 seconds...");
        await new Promise((r) => setTimeout(r, 3000));
        await page.reload({ waitUntil: "networkidle2" });
      }
    }

    if (scrapedName === "Not found") {
      console.log("⚠️ Could not scrape center name. Moving next.");
      break;
    }

    // ===== MATCHING LOGIC =====
    const matchedIndex = centers.findIndex(
      (c) =>
        c.centerName.toLowerCase().trim() === scrapedName.toLowerCase().trim(),
    );

    if (matchedIndex === -1) {
      console.log("⚠️ MISMATCH — Center not found in Excel");
      break;
    }

    console.log(`✅ Match found in Excel`);
    console.log(`📍 Excel Row: ${centers[matchedIndex].rowNumber}`);

    const nextIndex = matchedIndex + 1;

    if (nextIndex >= centers.length) {
      console.log("🏁 Last center reached.");
      break;
    }

    if (centers[nextIndex].opened) {
      console.log("⚠️ Next center already opened.");
      break;
    }

    console.log(`➡️ Next center: ${centers[nextIndex].centerName}`);
    console.log(`🔗 Next link: ${centers[nextIndex].paymentLink}`);

    currentIndex = nextIndex;

    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log("\n🔒 Browser will remain open.");
}

module.exports = automate;
