# FoodRush — Food Delivery & Greater Noida Restaurant Directory

FoodRush is a complete, modern, fully responsive food delivery platform inspired by the usability and functionality of platforms like Swiggy and Zomato, featuring its own original brand identity, custom design system, and full-stack architecture.

---

## 🌟 Key Features

### 1. Storefront & Discovery
- **Live Browser GPS Detection:** Real browser satellite coordinates via `navigator.geolocation.getCurrentPosition` with reverse-geocoding mapping to nearest Greater Noida & Delhi NCR localities.
- **Dedicated Greater Noida Directory:**
  - **Appitito** (UP 16 KP 3, Alpha 1 Commercial Belt)
  - **Banzara Bliss** (Sector Alpha 2 Commercial Market)
  - **Barbeque Nation** (2nd Floor, MSX Mall, Sector Alpha 2) — With distinct dine-in buffet table reservations and home-delivery meal boxes!
  - **Burger King** (Food Court, 2nd Floor, Omaxe Connaught Place Mall, Sector Beta 2)
  - Plus **Bikanervala** (Pari Chowk), **Paratha Gali & Chai Tapri** (Knowledge Park III), **The Yellow Chilli** (Venice Mall), **Nirula's**, **Karim's Historic Delhi**, **Carnatic Cafe**, and **Cyber Hub Social**.
- **Swiggy-Style Real-Time Search Suggestions:** Dropdown search overlay with instant dish results with direct `+ Add` to cart, restaurant cards, and quick locality chips.
- **Circular "What's on your mind?" Carousel:** Instant filtering for Chole Bhature, Biryani, Wood-Fired Pizza, Burgers, Campus Parathas, and Podi Dosa.
- **Locality & Region Filters:** 1-tap switching between Alpha 1, Alpha 2, Beta 2, Knowledge Park III, Pari Chowk, Noida, Delhi, and Gurugram.
- **Google Maps Directions:** Direct search-based Google Maps link for each restaurant.

### 2. Shopping Cart & Server-Side Pricing
- Single-restaurant cart validation with gentle switch prompt modal.
- Customizable dishes (Neapolitan Thin Crust, Artisan Cheese Burst, spicy add-ons, extra dips).
- Active promo coupons (`RUSH50`, `WELCOME100`, `ALPHA20`, `FREEDEL`) with server-side validation.
- Subtotal, 5% GST, and delivery fee recalculation on the backend to prevent price tampering.

### 3. Checkout & Multi-Channel Payment Sandbox
- Address manager (Home, Work, Campus/Other) with landmarks and courier instructions.
- Official Razorpay Sandbox Protocol supporting UPI (Google Pay / PhonePe / Paytm / QR), Credit/Debit Cards, Net Banking, and Cash on Delivery (COD).

### 4. Live Order Tracking Lifecycle
- Stages: `Pending` → `Confirmed` → `Food Being Prepared` → `Packed for Pickup` → `Out for Delivery` → `Delivered`.
- Interactive route visualization with animated courier bike moving along the path.
- Courier partner card (Ramesh Kumar, Electric Bike `UP 16 BR 4092`, direct call button).
- Interactive simulation control panel to test order state progression.

### 5. Dedicated Business Portals
- **Restaurant Owner Portal (`/owner`):** Live kitchen dispatch queue, dish availability toggle (In Stock / Out of Stock), and pricing updates.
- **Admin Command Center (`/admin`):** Platform GMV, 15% commissions, restaurant partner verification toggles (`verified` / `unverified`), and ordering mode configuration.

---

## 🛠️ Technology Stack
- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide React, Canvas Confetti.
- **Backend:** Node.js, Express.js, REST API architecture.
- **Database:** In-memory reactive store initialized with seed data + Mongoose schemas ready for MongoDB.
- **Testing:** Comprehensive automated test suite in `tests/foodrush.test.ts`.

---

## 🚀 Getting Started

### 1. Installation
\`\`\`bash
npm install
\`\`\`

### 2. Environment Setup
Copy the example environment configuration:
\`\`\`bash
cp .env.example .env
\`\`\`

### 3. Development Server
Start the full-stack server running on port 3000:
\`\`\`bash
npm run dev
\`\`\`

### 4. Running Automated Tests
Run the test suite verifying restaurant slugs, locality filters, coupon math, and order state transitions:
\`\`\`bash
npm test
\`\`\`

### 5. Production Build
\`\`\`bash
npm run build
npm start
\`\`\`

---

## 🔐 Demo Accounts (1-Tap Autofill in Login Modal)

| Role | Email | Password |
|---|---|---|
| **Customer** | `alex@foodrush.io` | `FoodRush123!` |
| **Restaurant Owner** | `owner@appitito.com` | `Owner123!` |
| **Operations Admin** | `admin@foodrush.io` | `Admin123!` |

---

## 📍 Verified Greater Noida Restaurant Details

1. **Appitito**
   - **Locality:** Sector Alpha 1, UP 16 KP 3 Commercial Belt, Greater Noida
   - **Cuisine:** Continental, Italian, Fast Food, Shakes
   - **Hours:** 11:00 AM - 11:30 PM
   - **Maps Link:** `https://www.google.com/maps/search/?api=1&query=Appitito+Alpha+1+Greater+Noida`
   - **Status:** Verified Partner

2. **Banzara Bliss**
   - **Locality:** Shop 14, Commercial Market, Sector Alpha 2, Greater Noida
   - **Cuisine:** North Indian, Mughlai, Biryani, Tandoori
   - **Hours:** 12:00 PM - 11:00 PM
   - **Maps Link:** `https://www.google.com/maps/search/?api=1&query=Banzara+Bliss+Alpha+2+Greater+Noida`
   - **Status:** Verified Partner

3. **Barbeque Nation**
   - **Locality:** 2nd Floor, MSX Mall, Sector Alpha 2, Greater Noida
   - **Cuisine:** Barbecue, Kebabs, North Indian, Meal Boxes, Desserts
   - **Dining Modes:** Dine-in Buffet Reservations (via official portal) & Barbeque in a Box Delivery (via FoodRush)
   - **Maps Link:** `https://www.google.com/maps/search/?api=1&query=Barbeque+Nation+Alpha+2+Greater+Noida`
   - **Status:** Verified Partner

4. **Burger King**
   - **Locality:** Food Court, 2nd Floor, Omaxe Connaught Place Mall, Sector Beta 2, Greater Noida
   - **Cuisine:** Flame-Grilled Whoppers, Burgers, Peri-Peri Fries, Shakes
   - **Hours:** 11:00 AM - 11:00 PM
   - **Maps Link:** `https://www.google.com/maps/search/?api=1&query=Burger+King+Omaxe+Mall+Beta+2+Greater+Noida`
   - **Status:** Verified Partner
