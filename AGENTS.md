# 🤖 AGENTS.md — AI Agent Context & Repository Guidelines

> Single Source of Truth for AI Assistants (Antigravity, Cursor, Claude Code, Copilot) and Human Developers working on **FreshSaver**.

---

## 📌 Project Overview & Core Strategy

- **Project Name:** FreshSaver (ระบบจัดการวัตถุดิบ & เคลียร์ตู้เย็นลด Food Waste)
- **Core Architecture Strategy:** **Manual-First Approach**
  - Priority #1: Zero-Friction Manual CRUD & One-Tap Presets (Input speed target < 3–5 seconds per item).
  - Phase 1 Focus: Offline-ready client-side application using `localStorage`.
  - Phase 2 (Optional/Power Features): AI Recipe Matcher & Receipt OCR Scanner (On-Demand only).

---

## 🛠️ Tech Stack & Constraints

| Component | Technology | Rationale & Constraints |
| :--- | :--- | :--- |
| **Frontend Core** | Vanilla HTML5 & ES6+ JavaScript | Zero build steps, instant browser loading, lightweight |
| **Styling** | Vanilla CSS3 (Custom Properties) | Warm Gourmet & Friendly Foodie Theme with Dark/Light mode toggle |
| **State & Storage** | Web `localStorage` API | 100% offline, persistent data without backend setup |
| **Data Format** | JSON (`data/presets.json`) | Static culinary presets data |
| **Local Dev Server**| Python `http.server` or Node `http-server` | Standard static file serving |

> ⚠️ **Constraint for AI Agents:** Do NOT add heavy npm dependencies, bundlers (Webpack/Vite), or frontend frameworks (React/Vue/Angular) unless explicitly requested by the user. Keep it zero-build Vanilla JS.

---

## 📊 Data Schemas

### 1. Preset Definition (`data/presets.json`)
```json
{
  "categories": [
    {
      "id": "meat",
      "name": "เนื้อสัตว์ (Meat & Poultry)",
      "icon": "🥩",
      "defaultShelfLifeDays": 3,
      "storageType": "chilled"
    }
  ],
  "presets": [
    {
      "id": "preset_meat_01",
      "name": "หมูสับ",
      "categoryId": "meat",
      "defaultUnit": "แพ็ค",
      "defaultShelfLifeDays": 3,
      "storageType": "chilled",
      "icon": "🥩"
    }
  ]
}
```

### 2. LocalStorage Key: `freshsaver_inventory`
```json
[
  {
    "id": "inv_1690000000_abc",
    "name": "หมูสับ",
    "categoryId": "meat",
    "quantity": 1,
    "unit": "แพ็ค",
    "purchaseDate": "2026-07-22",
    "expiryDate": "2026-07-25",
    "storageLocation": "chilled",
    "status": "active",
    "icon": "🥩",
    "createdAt": "2026-07-22T15:30:00.000Z"
  }
]
```

### 3. LocalStorage Key: `freshsaver_settings`
```json
{
  "theme": "dark",
  "notificationTime": "17:00",
  "lastNotificationDate": "2026-07-22"
}
```

---

## 🎯 Domain Rules & Expiry Calculation Logic

Status colors and classifications are computed strictly in `js/expiry.js`:

- 🟢 **Fresh (`status-fresh`):** `daysLeft > 3`
- 🟡 **Warning (`status-warning`):** `1 <= daysLeft <= 3`
- 🔴 **Danger (`status-danger`):** `daysLeft === 0` (Expires today)
- ⚫ **Expired (`status-expired`):** `daysLeft < 0`

Item statuses:
- `'active'`: Currently inside the fridge
- `'consumed'`: Consumed by user (Food saved)
- `'wasted'`: Discarded (Food wasted)

---

## 📁 Code Structure & Responsibilities

```
Food Waste/
├── AGENTS.md                  # This file (AI instructions & project context)
├── README.md                  # User-facing documentation
├── index.html                 # Single-page application layout & modals
├── css/
│   └── style.css              # Warm Gourmet design tokens & component styles
├── js/
│   ├── utils.js               # Helper functions (ID generator, Date formatters, Debounce)
│   ├── storage.js             # LocalStorage API wrapper & error handling
│   ├── expiry.js              # Freshness progress & status calculation engine
│   ├── presets.js              # Presets fetcher & category search
│   ├── inventory.js           # Core Inventory CRUD & business logic
│   ├── notification.js        # In-App Toasts & Daily Alert Banner system
│   ├── ui.js                  # View controller & DOM component renderer
│   └── app.js                 # Main application entry point & event bindings
└── data/
    └── presets.json           # 30+ Thai culinary ingredient presets
```

---

## 🤖 Directives for AI Assistants

When extending or modifying this repository:

1. **Preserve Zero-Friction Flow:** Ensure any new feature preserves the One-Tap Add speed.
2. **Maintain Separation of Concerns:**
   - Put storage logic in `storage.js`
   - Put date/expiry logic in `expiry.js`
   - Put DOM rendering in `ui.js`
   - Put event handlers in `app.js`
3. **Language Guideline:** Use mixed Thai-English in the UI (English for headings/buttons, Thai for descriptions/placeholders).
4. **Theme Compatibility:** Ensure all new CSS classes use CSS custom properties (`var(--bg-primary)`, `var(--text-primary)`, etc.) to support Dark and Light themes.
5. **No AI/OCR Escalation:** Do NOT implement backend API integration or Gemini AI calls until Phase 2 is explicitly initiated by the user.
