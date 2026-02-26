const ExcelJS = require("exceljs");

async function readCenters() {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile("FILE DEMO.xlsx");

    const selectedSheet = workbook.getWorksheet("SELECTED LINK");
    const normalSheet = workbook.getWorksheet("NORMAL LINK");

    if (!selectedSheet || !normalSheet) {
      throw new Error("Required worksheets not found!");
    }

    const centers = [];
    const normalLinks = [];

    const clean = (v) => v?.toString().replace(/\s+/g, " ").trim();

    // ===== NORMAL LINKS সংগ্রহ =====
    normalSheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      let val = row.getCell(1).value;
      if (typeof val === "object" && val?.hyperlink) {
        val = val.hyperlink;
      }

      val = clean(val);
      if (val) normalLinks.push(val);
    });

    console.log(`📊 Total normal links available: ${normalLinks.length}`);

    let normalIndex = 0;

    // ===== SELECTED LINK প্রসেস =====
    selectedSheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      const centerName = clean(row.getCell(1).value);
      if (!centerName) return;

      let selectedLink = row.getCell(2).value;
      if (typeof selectedLink === "object" && selectedLink?.hyperlink) {
        selectedLink = selectedLink.hyperlink;
      }

      selectedLink = clean(selectedLink);

      let finalLink;
      let linkSource;

      if (selectedLink) {
        finalLink = selectedLink;
        linkSource = "SELECTED";
        console.log(`✅ ${centerName}: Using SELECTED link`);
      } else {
        if (normalIndex < normalLinks.length) {
          finalLink = normalLinks[normalIndex++];
          linkSource = "NORMAL";
          console.log(`🔄 ${centerName}: Using NORMAL link`);
        } else {
          console.log(`❌ ${centerName}: No link available`);
          return;
        }
      }

      centers.push({
        serial: centers.length + 1,
        rowNumber,
        centerName,
        paymentLink: finalLink,
        linkSource,
        opened: false,
      });
    });

    console.log(`\n📌 Total centers ready: ${centers.length}\n`);

    return centers;
  } catch (error) {
    console.error("❌ Excel read error:", error.message);
    return [];
  }
}

module.exports = readCenters;
