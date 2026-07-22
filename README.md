# 🧊 FreshSaver — Smart Food Waste Reduction & Fridge Manager (Prototype)

> A zero-friction, high-speed fridge management web application built to eliminate household food waste through smart shelf-life tracking and fast manual entry.

---

## 📌 Background & Motivation

Food waste in households often occurs not because people don't care, but because tracking ingredients in the refrigerator requires too much effort and manual overhead. Traditional apps force users through tedious input forms with multi-step date pickers for every single item.

**FreshSaver** solves this friction with a **Manual-First, One-Tap Preset Strategy**. Designed to allow users to log ingredients in **under 3 to 5 seconds**, FreshSaver automatically calculates default shelf-life based on popular culinary categories, color-codes fresh vs. expiring items, and provides daily alerts before food goes bad.

This repository contains the **interactive client-side prototype** powered by Vanilla HTML5, CSS3, ES6+ JavaScript, and `localStorage`.

---

## ✨ Key Features

- **⚡ One-Tap Quick Presets:** Add pre-configured popular ingredients (e.g., Minced Pork, Chicken Breast, Eggs, Milk) with default shelf lives in a single click.
- **⏳ Automatic Expiry Calculation:** Smart auto-assigns expiry dates according to ingredient categories (e.g., fresh vegetables default to +4 days, poultry to +3 days).
- **🟢🟡🔴 Visual Freshness Level:** Color-coded status indicators and visual progress bars showing percentage of freshness remaining:
  - 🟢 **Fresh:** > 3 days remaining
  - 🟡 **Use Soon:** 1 – 3 days remaining
  - 🔴 **Expires Today:** 0 days remaining
  - ⚫ **Expired:** Past expiration date
- **🔔 Daily Expiry Summary Alert:** Automatic In-App banner notifying users of items requiring immediate consumption upon opening the app.
- **🎨 Warm Gourmet & Friendly Foodie Theme:** Designed with soft cream & deep pine aesthetics, extra-rounded cards, glassmorphic elements, and toggleable Dark/Light modes.
- **📝 Custom Item Manager:** Complete CRUD operations (Add, Edit, Consumed, Wasted, Restore, Delete) with interactive confirmation dialogs.
- **🔍 Instant Search & Filter:** Filter items by status (*In Fridge*, *Consumed*, *Wasted*) or category, with instant search query filtering.
- **💾 100% Offline LocalStorage Persistence:** Operates completely offline without requiring database setup or backend APIs.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core:** Vanilla HTML5, ES6 JavaScript (No heavy frameworks required)
- **Styling:** CSS3 Custom Properties, Modern Flexbox & Grid, Glassmorphic effects
- **State & Storage:** Web `localStorage` API
- **Design Pattern:** Modular Component Architecture (`utils.js`, `storage.js`, `expiry.js`, `presets.js`, `inventory.js`, `notification.js`, `ui.js`, `app.js`)

```
Food Waste/
├── index.html                 # Main Single Page Application shell
├── README.md                  # Project documentation & usage guide
├── .gitignore                 # Git ignore file
├── css/
│   └── style.css              # Warm Gourmet Design System & Theme CSS
├── js/
│   ├── app.js                 # Main Controller & Event Dispatcher
│   ├── storage.js             # LocalStorage API wrapper
│   ├── presets.js              # Preset data query engine
│   ├── inventory.js           # Core Inventory CRUD & business logic
│   ├── expiry.js              # Expiry status & freshness calculation engine
│   ├── notification.js        # In-App Toasts & Summary Alert system
│   ├── ui.js                  # View switcher & DOM renderer
│   └── utils.js               # Date helpers & String formatters
└── data/
    └── presets.json           # 30+ default Thai culinary ingredient presets
```

---

## 🚀 Getting Started

### Prerequisites
- Any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Apple Safari).
- (Optional) A simple HTTP server (Python, Node `http-server`, or Live Server extension).

### Installation & Running Locally

1. **Clone the Repository:**
   ```bash
   git clone <your-repository-url>
   cd "Food Waste"
   ```

2. **Run Locally:**

   - **Option A (Direct File Access):**
     Double-click `index.html` to open directly in your web browser.

   - **Option B (Python Local Server - Recommended):**
     ```bash
     python -m http.server 8080
     ```
     Navigate to `http://localhost:8080` in your browser.

   - **Option C (Node.js Live Server):**
     ```bash
     npx http-server . -p 8080
     ```

---

## 📖 How to Use

1. **Add Items via One-Tap Presets:**
   - Click **➕ Add Item** in the navigation bar.
   - Click any preset card (e.g., `🥩 หมูสับ` or `🥚 ไข่ไก่`). It will immediately populate into your fridge with auto-calculated shelf life.

2. **Add Custom Ingredients:**
   - Scroll down to **Custom Add Form**.
   - Enter item name, category, quantity, and storage location. The expiry date will auto-fill based on the selected category defaults.

3. **Managing Fridge Items:**
   - **✅ Consumed:** Mark food as eaten to keep track of food saved.
   - **🗑️ Wasted:** Mark food as discarded to monitor food waste.
   - **✏️ Edit / ❌ Delete:** Update quantity/expiry date or remove permanently.

4. **Toggle Theme:**
   - Click the 🌙 / ☀️ icon in the top right corner to switch between **Dark** and **Light** themes.

---

## 🗺️ Roadmap & Future Phases

- [x] **Phase 1 (Current):** High-Speed Manual Core, Presets, LocalStorage & Freshness Bar UI
- [ ] **Phase 2:** Optional Receipt OCR Scanner & AI Recipe Matcher ("What should I cook today?")
- [ ] **Phase 3:** LINE Mini App (LIFF) integration & Cloud Database synchronization (Supabase/PostgreSQL)
- [ ] **Phase 4:** Waste Analytics & Cost Savings Dashboard

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
