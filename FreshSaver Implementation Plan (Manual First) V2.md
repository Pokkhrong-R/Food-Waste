# **📋 แผนการดำเนินงานโปรเจกต์: ระบบจัดการวัตถุดิบ & เคลียร์ตู้เย็นลด Food Waste (Manual-First Architecture)**

## **EXECUTIVE SUMMARY**

โครงการ **FreshSaver (ระบบจัดการวัตถุดิบ & เคลียร์ตู้เย็น)** ปรับปรุงโครงสร้างระบบตามกลยุทธ์ **Manual-First Approach** โดยให้ความสำคัญสูงสุดกับการบันทึกและจัดการข้อมูลด้วยตนเองที่สะดวกรวดเร็วที่สุด (Zero-Friction Manual CRUD) มุ่งเน้นให้ผู้ใช้สามารถเพิ่ม ลบ หรืออัปเดตวัตถุดิบได้ภายใน 3–5 วินาที เพื่อให้เกิดพฤติกรรมใช้งานต่อเนื่องระยะยาว  
ขณะที่ฟีเจอร์ฝั่ง AI และ OCR สแกนใบเสร็จ จะถูกถอยไปอยู่ในฐานะ **Optional / Power Features** สำหรับอำนวยความสะดวกเสริมเมื่อบันทึกของจำนวนมากหรือเมื่อต้องการไอเดียทำอาหาร เพื่อลดความเสี่ยงด้านความหน่วง ค่าใช้จ่าย API และความคลาดเคลื่อนของเทคโนโลยีในระยะแรก

## **1\. PROJECT SCOPE & KEY FEATURES**

### **1.1 Core Features (MVP \- Phase 1: Manual First)**

> * **Ultra-Fast Manual Entry (ระบบบันทึกด้วยตนเองแบบรวดเร็ว):**  
  * **One-Tap Quick Presets:** ปุ่มทางด่วนเลือกวัตถุดิบยอดฮิต (เช่น \[+ หมูสับ\], \[+ ไข่ไก่\], \[+ นมสด\]) บันทึกเข้าตู้เย็นด้วยการกดเพียงครั้งเดียว  
  * **Auto-Default Expiry Date:** คำนวณวันหมดอายุอัตโนมัติจากหมวดหมู่สินค้า (เช่น เลือกหมวดผักสด \-\> ตั้งวันหมดอายุให้อีก 3 วันทันที โดยไม่ต้องเลือกปฏิทิน)  
  * **Smart Category & Storage Selector:** จัดหมวดหมู่ (ช่องแช่เย็น, ช่องแช่แข็ง, อุณหภูมิห้อง) อัตโนมัติ  
> * **Virtual Fridge & Quick Actions (จัดการตู้เย็นและสถานะ):**  
  * **Status Visual Indicator:** แบ่งสถานะด้วยสีชัดเจน (🟢 สดใหม่, 🟡 ควรใช้เร็วๆ นี้, 🔴 ใกล้หมดอายุ/หมดอายุ)  
  * **One-Swipe Status Updates:** ปัดขวาเพื่อเปลี่ยนสถานะเป็น "กินแล้ว" (Consumed) หรือปัดซ้ายเป็น "ทิ้ง/เน่า" (Wasted)  
> * **Notification Engine (ระบบแจ้งเตือนเชิงรุก):**  
  * แจ้งเตือนสรุปวัตถุดิบใกล้หมดอายุประจำวันผ่าน LINE Push Notification / App Alert ตามเวลาที่ผู้ใช้กำหนด

### **1.2 Optional & Power Features (Phase 2: AI Enhancements)**

> * **Optional Receipt OCR Scanner (ระบบสแกนใบเสร็จทางเลือก):** สำหรับผู้ใช้ที่ซื้อของจำนวนมากจากซูเปอร์มาร์เก็ต สแกนแล้วแปลงเป็นรายการให้กดยืนยันก่อนบันทึก  
> * **Optional Smart Recipe Matcher (AI แนะนำเมนูเมื่อร้องขอ):** ปุ่ม "วันนี้กินอะไรดี?" ส่งรายการวัตถุดิบที่ใกล้หมดอายุไปให้ AI ช่วยคิดเมนูอาหารไทยแบบรวดเร็ว  
> * **Cost Savings Dashboard:** สรุปมูลค่าเงินที่ประหยัดได้จากการกินวัตถุดิบได้ทันเวลา

## **2\. SYSTEM ARCHITECTURE & TECH STACK**

### **2.1 Architecture Overview**

`+-----------------------------------------------------------------+`  
`|                       Frontend Client                           |`  
`|   LINE Mini App (LIFF) / React Native Mobile App                |`  
`+-----------------------------------------------------------------+`  
                                `|`  
                                `v`  
`+-----------------------------------------------------------------+`  
`|                         API Gateway                             |`  
`|                    FastAPI (Python) / Node.js                   |`  
`+-----------------------------------------------------------------+`  
        `|                                           | (Optional)`  
        `v                                           v`  
`+-------------------------------+       +-------------------------+`  
`| Core CRUD & Inventory Engine  |       | AI / OCR Services       |`  
`| (Fast Presets & Expiry Logic) |       | (Gemini API / Vision)   |`  
`+-------------------------------+       +-------------------------+`  
        `|`  
        `v`  
`+-----------------------------------------------------------------+`  
`|                        Database & Cache                         |`  
`|           PostgreSQL (Relational) + Redis (Cache/Jobs)          |`  
`+-----------------------------------------------------------------+`

### **2.2 Tech Stack Selection**

| ส่วนงาน (Module) | เทคโนโลยีที่เลือกใช้ (Tech Stack) | เหตุผลประกอบ (Rationals)   |
| :---- | :---- | :---- |
| **Frontend** | LINE Mini App (LIFF) \+ React / Tailwind CSS | เข้าถึงง่ายที่สุด ไม่ต้องโหลดแอปใหม่ ลด Friction ในการเริ่มใช้งาน |
| **Backend** | Python (FastAPI) | ประสิทธิภาพสูง ตอบสนองต่อ CRUD API ได้รวดเร็ว รองรับการเชื่อมต่อ AI ได้ง่ายในอนาคต |
| **Database** | PostgreSQL (Supabase / Managed SQL) | รองรับ Relational Data, มี Indexing ที่รวดเร็วสำหรับค้นหาวัตถุดิบตามวันหมดอายุ |
| **Caching & Queue** | Redis \+ Celery | ใช้ทำ Scheduled Jobs สำหรับส่ง Notification และ Caching รายการ Preset วัตถุดิบ |
| **AI Services (Option)** | Gemini 1.5 Flash API | เรียกใช้เฉพาะเมื่อผู้ใช้กดปุ่มขอสูตรอาหาร หรือเลือกสแกนใบเสร็จ |

## **3\. DATABASE SCHEMA DESIGN**

`-- 1. Users Table`  
`CREATE TABLE users (`  
    `user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `line_user_id VARCHAR(255) UNIQUE,`  
    `display_name VARCHAR(100),`  
    `notification_time TIME DEFAULT '17:00:00',`  
    `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`  
`);`

`-- 2. Categories & Presets Table`  
`CREATE TABLE categories (`  
    `category_id SERIAL PRIMARY KEY,`  
    `name_th VARCHAR(50) NOT NULL,`  
    `default_shelf_life_days INT DEFAULT 3,`  
    `storage_type VARCHAR(20) DEFAULT 'chilled',`  
    `icon_url TEXT`  
`);`

`-- 3. Quick Item Presets Table (รายการวัตถุดิบยอดนิยมสำหรับ One-Tap Add)`  
`CREATE TABLE item_presets (`  
    `preset_id SERIAL PRIMARY KEY,`  
    `category_id INT REFERENCES categories(category_id),`  
    `item_name VARCHAR(100) NOT NULL,`  
    `default_unit VARCHAR(20) DEFAULT 'ชิ้น',`  
    `default_shelf_life_days INT DEFAULT 3,`  
    `popularity_score INT DEFAULT 0`  
`);`

`-- 4. Inventory Items Table (วัตถุดิบในตู้เย็น)`  
`CREATE TABLE inventory_items (`  
    `item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,`  
    `item_name VARCHAR(100) NOT NULL,`  
    `category_id INT REFERENCES categories(category_id),`  
    `quantity DECIMAL(10,2) DEFAULT 1.0,`  
    `unit VARCHAR(20) DEFAULT 'ชิ้น',`  
    `purchase_date DATE DEFAULT CURRENT_DATE,`  
    `expiry_date DATE NOT NULL,`  
    `storage_location VARCHAR(20) DEFAULT 'chilled', -- chilled, frozen, room`  
    `status VARCHAR(20) DEFAULT 'active', -- active, consumed, wasted`  
    `estimated_price DECIMAL(10,2) DEFAULT 0.0,`  
    `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`  
`);`

`CREATE INDEX idx_inventory_user_status_expiry ON inventory_items(user_id, status, expiry_date);`

`-- 5. Recipe History Table (Optional Feature Log)`  
`CREATE TABLE recipe_suggestions (`  
    `suggestion_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `user_id UUID REFERENCES users(user_id),`  
    `recipe_name VARCHAR(150),`  
    `ingredients_used JSONB,`  
    `instructions TEXT,`  
    `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`  
`);`

## **4\. IMPLEMENTATION ROADMAP (12-WEEK PLAN)**

### **Phase 1: High-Speed Manual Core & UI (Weeks 1 \- 3\)**

> * **Week 1:** System Design, DB Schema Setup, Quick Preset Data Collection.  
> * **Week 2:** Fast CRUD APIs (Manual Add, Quick Presets, Swipe-to-Update Status).  
> * **Week 3:** Frontend Development for Virtual Fridge, One-Tap Add UI, and Fast Status Toggles.

### **Phase 2: Expiry Calculation Engine & Alerts (Weeks 4 \- 5\)**

> * **Week 4:** Expiry Engine Logic (Automatic shelf-life assignment per category).  
> * **Week 5:** LINE Messaging API Setup & Cron Job Scheduler for Daily Expiry Push Notifications.

### **Phase 3: Optional AI Modules (Weeks 6 \- 8\)**

> * **Week 6:** On-Demand Smart Recipe Matcher (Gemini 1.5 Flash Integration).  
> * **Week 7:** Optional Receipt OCR Scanner Development (Google Cloud Vision / Gemini Multimodal).  
> * **Week 8:** OCR Verification UI & Bulk Import Review Screen.

### **Phase 4: Analytics & UX Speed Optimization (Weeks 9 \- 10\)**

> * **Week 9:** Food Waste & Money Saved Analytics Dashboard.  
> * **Week 10:** Performance Tuning (Ensuring manual entry latency \< 300ms).

### **Phase 5: Beta Testing & Public Launch (Weeks 11 \- 12\)**

> * **Week 11:** Closed Beta Testing with core users (Focus on Manual Input Usability).  
> * **Week 12:** Final Bug Fixes, Optimization & Public Launch.

## **5\. RISK MANAGEMENT & MITIGATION STRATEGIES**

| ความเสี่ยง (Risk) | ระดับผลกระทบ | แนวทางการป้องกันและแก้ไข (Mitigation Strategy)   |
| :---- | :---: | :---- |
| **1\. ผู้ใช้รู้สึกขี้เกียจกรอกข้อมูลเอง** | High | \- ใช้ปุ่ม One-Tap Quick Presets สำหรับวัตถุดิบยอดฮิต \- กำหนดวันหมดอายุอัตโนมัติ ไม่ต้องเปิดปฏิทินกดเลือกเอง |
| **2\. ผู้ใช้ลืมอัปเดตสถานะเมื่อนำของไปกินแล้ว** | High | \- ออกแบบระบบ Swipe-Action ปัดขวา \= กินแล้ว ปัดซ้าย \= ทิ้ง \- มีการแจ้งเตือนสั้นๆ สรุปตอนเย็นกดยืนยันปุ่มเดียว |
| **3\. ต้นทุนค่า AI API สูงเกินไป** | Low | \- การถอย AI เป็น Option ช่วยควบคุมค่าใช้จ่าย API ได้ 100% เพราะเรียกใช้เฉพาะเมื่อผู้ใช้กดปุ่มเท่านั้น |

## **6\. KEY PERFORMANCE INDICATORS (KPIs)**

> 1. **Input Speed & Efficiency:** เวลาเฉลี่ยในการเพิ่มวัตถุดิบ 1 ชิ้นด้วยตนเอง \< 3–5 วินาที  
> 2. **User Engagement & Retention:** 30-Day Retention Rate ≥ 40% (สูงกว่าเดิมเนื่องจากใช้งานสะดวกขึ้น)  
> 3. **Action Completion Rate:** อัตราส่วนรายการวัตถุดิบที่ได้รับการอัปเดตสถานะ (Consumed หรือ Wasted) ≥ 80%

## **7\. NEXT ACTION ITEMS**

> 1. รวบรวมรายการวัตถุดิบยอดฮิต 30–50 รายการ พร้อมกำหนดวันหมดอายุมาตรฐาน (Shelf Life Defaults) สำหรับสร้าง Presets Table  
> 2. ออกแบบ Wireframe หน้าตาตู้เย็นเวอร์ชัน Manual First (ปุ่ม Quick Add และ Swipe Gesture)  
> 3. เริ่มต้นพัฒนา Database Schema และ Core CRUD API ใน Phase 1