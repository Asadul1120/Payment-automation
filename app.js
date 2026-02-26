const readCenters = require("./excelReader");
const validateSerialDifference = require("./validator");
const automateAll = require("./automation");

async function startApp() {
  console.log("=".repeat(50));
  console.log("🚀 WAFID Automation System");
  console.log("=".repeat(50));

  try {
    // Excel থেকে সেন্টার ডাটা পড়ুন
    const centers = await readCenters();

    if (!centers || centers.length === 0) {
      console.log("❌ No centers found! Please check Excel file.");
      return;
    }

    console.log(`\n📋 Processing ${centers.length} centers from Excel...`);

    // Serial difference ভ্যালিডেশন
    let validCenters = [centers[0]];
    let currentSerial = centers[0].serial;

    console.log(
      `\n📍 Starting from: ${centers[0].centerName} (Serial: ${currentSerial})`,
    );

    for (let i = 1; i < centers.length; i++) {
      const nextCenter = centers[i];

      console.log(
        `\n➡️ Checking: ${nextCenter.centerName} (Serial: ${nextCenter.serial})`,
      );

      const isValid = validateSerialDifference(
        currentSerial,
        nextCenter.serial,
      );

      if (!isValid) {
        console.log(`🛑 Stopping at: ${nextCenter.centerName}`);
        break;
      }

      validCenters.push(nextCenter);
      currentSerial = nextCenter.serial;
    }

    console.log(`\n✅ Valid centers to process: ${validCenters.length}`);

    // অটোমেশন শুরু করুন
    await automateAll(validCenters);
  } catch (error) {
    console.error("❌ Application error:", error.message);
  }
}

// প্রোগ্রাম চালান
startApp().catch(console.error);
