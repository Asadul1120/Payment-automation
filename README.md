# 🚀 WAFID Payment Automation System

This project is a **Node.js + Puppeteer automation tool** that automatically processes WAFID medical center payments using data from an Excel file.

The system:

* Reads medical centers from Excel
* Opens payment links automatically
* Fills card payment form
* Submits payment
* Waits for the final slip page
* Detects the assigned medical center
* Moves to the next center automatically

---

# 📦 Features

✅ Excel based center management
✅ Automatic payment form filling
✅ Smart modal detection
✅ Auto wait if center assignment is delayed
✅ Automatic page reload until center appears
✅ Sequential processing of centers
✅ Detailed console logging
✅ Browser remains open for review

---

# 🧠 How the Automation Works

The system processes each medical center step-by-step.

### 1️⃣ Load Excel Data

The script reads center data from:

```
FILE DEMO.xlsx
```

Two sheets are used:

#### Sheet: SELECTED LINK

| Column | Description             |
| ------ | ----------------------- |
| A      | Medical Center Name     |
| B      | Payment Link (optional) |

#### Sheet: NORMAL LINK

| Column | Description                        |
| ------ | ---------------------------------- |
| A      | Payment Link list (fallback links) |

Rules:

* If **SELECTED LINK** contains a payment link → use it
* If link is empty → take next link from **NORMAL LINK**

---

### 2️⃣ Open Payment Page

For each center:

```
Center → Payment Link → Browser Tab
```

The script launches Puppeteer with:

```
headless: false
browser maximized
```

---

### 3️⃣ Auto Fill Payment Form

Automation automatically fills:

* Name on Card
* Card Number
* Expiry Date
* CVV

Typing is simulated like a real user.

Example log:

```
💳 Filling Wafid payment form...
✅ Card entered
✅ Expiry entered
```

---

### 4️⃣ Submit Payment

The script automatically finds the **Pay button** and clicks it.

```
💰 Payment submitted
```

---

### 5️⃣ Wait for Payment Processing

After payment:

The system waits until the page shows:

```
Medical center information
```

This means the payment result page is ready.

---

### 6️⃣ Detect Medical Center Name

Two scenarios can occur:

#### Case 1 — Center Assigned Immediately

```
Medical center information
AL ALI DIAGNOSTIC CENTER
```

The automation immediately proceeds to the next center.

---

#### Case 2 — Center Assigned Later

Sometimes WAFID shows this message:

```
The medical center will be assigned shortly after receiving the payment.
```

In this case the system:

```
waits 3 seconds
reloads the page
checks again
```

This continues **until the real center name appears**.

Example log:

```
⏳ Center not assigned yet → reload after 3s
🔄 Reloading...
```

Once the real center appears:

```
✅ Real center detected
➡️ Preparing next center...
```

---

### 7️⃣ Move to Next Center

When a center name is detected:

```
Excel Match → Next Center → Open Payment Page
```

This process continues until all centers are completed.

---

# 🧾 Example Console Output

```
📌 [Center 1/5] Opening
🏥 Center: AL ALI DIAGNOSTIC CENTER

💳 Filling Wafid payment form...
💰 Payment submitted

⏳ Waiting for result modal...

🏥 Scraped center name: "AL ALI DIAGNOSTIC CENTER"

➡️ Preparing next center...
```

---

# 🛠 Installation

### 1️⃣ Clone the repository

```
git clone https://github.com/yourusername/wafid-automation.git
```

### 2️⃣ Install dependencies

```
npm install
```

### 3️⃣ Start the automation

```
npm start
```

---

# 📁 Project Structure

```
project/
│
├── app.js
├── automation.js
├── excelReader.js
├── validator.js
├── card.js
│
├── FILE DEMO.xlsx
│
└── package.json
```

---

# ⚠️ Important Notes

* This automation runs in **visible browser mode**
* The browser **will NOT close automatically**
* Payment form uses **test card data**
* The system waits until the medical center is assigned

---

# 👨‍💻 Author

Developed using:

* Node.js
* Puppeteer
* ExcelJS

---

# ⭐ Future Improvements

Possible upgrades:

* Faster modal detection
* Parallel processing
* Automatic screenshot logging
* Headless server mode
* Telegram notification integration

---

# 📜 License

This project is intended for **automation testing and educational purposes**.
