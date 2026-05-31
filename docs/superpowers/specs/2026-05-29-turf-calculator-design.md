# Turf Calculator - Product Design Specification

**Project Name:** TurfCalculator (working title)
**Date:** 2026-05-29
**Status:** Draft (pending review)
**Target Market:** English-speaking global primary (US/CA/UK/AU/NZ) + 13 additional languages for traffic expansion
**Monetization:** Google AdSense via organic SEO traffic
**Tech Stack:** Pure static HTML/CSS/JS → GitHub → Cloudflare Pages
**Domain:** To be purchased after development is complete (recommended: Cloudflare Registrar for cost-price registration; keyword-rich domain preferred for SEO)

---

## 1. Executive Summary

A free, fast, zero-friction lawn/turf calculator tool matrix website targeting DIY homeowners who need to calculate sod quantities, grass seed amounts, fertilizer rates, and general lawn care planning.

### Core Value Proposition
> "Get accurate answers in 30 seconds — no signup, no email, no hassle"

### Competitive Positioning

| Competitor | Strength | Weakness | Our Edge |
|------------|----------|----------|----------|
| **sodcalculator.com** | Brand domain, satellite maps, state guides | Requires email, multi-step, slow, lead-gen focused | Simpler, faster, no data collection |
| **Omni Calculator (omnicalculator.com)** | 3000+ calculators, high authority, expert-backed | Generic template, not lawn-specialized | Lawn-focused depth, better UX for this niche |
| **Home Depot/Lowes calculators** | Retailer trust, product integration | Cluttered, push purchases, retailer-locked | Neutral, unbiased, tool-first |

---

## 2. Site Architecture

### 2.1 URL Structure — Multi-Language (i18n)

**Strategy: Subdirectory approach** (`/en/`, `/es/`, `/fr/`, etc.)
- ✅ All languages share one domain → domain authority accumulates together
- ✅ Google recommends subdirectories for multilingual sites
- ✅ Cloudflare Pages handles subdirectory routing natively
- ✅ Single SSL certificate, single Search Console property
- ❌ Subdomains (`es.domain.com`) split domain authority — avoid
- ❌ Separate domains (`domain.es`) = extra cost + split authority — avoid

```
/ (Auto-redirect based on browser Accept-Language, or show language picker)
│
├── /en/                          ← English (DEFAULT, primary market)
│   ├── /en/sod-calculator
│   ├── /en/lawn-area-calculator
│   ├── /en/grass-seed-calculator
│   ├── /en/grass-type-guide
│   ├── /en/fertilizer-calculator
│   ├── /en/lawn-water-calculator
│   ├── /en/soil-calculator
│   ├── /en/area-converter
│   │   ├── /en/sq-ft-to-sq-m
│   │   ├── /en/acres-to-square-feet
│   │   └── ...
│   ├── /en/lawn-care-calendar
│   └── /en/about
│   └── /en/404.html                  ← Custom 404 page
│
├── /es/                          ← Spanish (Phase 2)
│   ├── /es/calculadora-de-cesped
│   ├── /es/calculadora-de-area
│   ├── /es/guia-de-tipos-de-cesped
│   ├── /es/calculadora-de-fertilizante
│   ├── /es/calculadora-de-semilla
│   ├── /es/calculadora-de-riego
│   ├── /es/calculadora-de-tierra
│   ├── /es/convertidor-de-area
│   ├── /es/calendario-de-cuidado
│   └── /es/acerca-de
│
├── /fr/                          ← French (Phase 2)
│   ├── /fr/calculateur-de-gazon
│   ├── /fr/calculateur-de-surface
│   ├── /fr/guide-des-types-de-gazon
│   ├── /fr/calculateur-d-engrais
│   ├── /fr/calculateur-de-semence
│   ├── /fr/calculateur-d-arrosage
│   ├── /fr/calculateur-de-terre
│   ├── /fr/convertisseur-de-surface
│   ├── /fr/calendrier-d-entretien
│   └── /fr/a-propos
│
├── /de/                          ← German (Phase 3)
├── /pt/                          ← Portuguese (Phase 3)
├── /it/                          ← Italian (Phase 3)
├── /nl/                          ← Dutch (Phase 3)
├── /sv/                          ← Swedish (Phase 4)
├── /pl/                          ← Polish (Phase 4)
├── /tr/                          ← Turkish (Phase 4)
├── /ar/                          ← Arabic (Phase 4, RTL)
├── /ja/                          ← Japanese (Phase 5)
├── /ko/                          ← Korean (Phase 5)
└── /zh/                          ← Chinese (Phase 5)
```

**URL Localization Rules:**
- Slugs are translated to the target language (NOT kept in English)
  - ✅ `/es/calculadora-de-cesped` — Google ranks localized URLs higher
  - ❌ `/es/sod-calculator` — English slug in Spanish page = missed SEO opportunity
- Each page has an `hreflang` tag pointing to all other language versions
- Canonical URL always points to the current language version (not to /en/)

### 2.2 Language Selection & Auto-Detection

**First visit:**
1. Check `Accept-Language` HTTP header from browser
2. If we support that language → redirect to `/xx/` version
3. If not supported → fall back to `/en/`
4. Store preference in `localStorage` (no cookies needed)
5. Show a brief language picker banner at top: "Available in: 🇪🇸 Español | 🇫🇷 Français"

**Subsequent visits:**
- Use stored `localStorage` preference
- Language switcher always visible in header/footer

**Language switcher UI:**
```
Mobile:
┌──────────────────────────┐
│ 🌐 EN ▾                  │  ← Tap to open dropdown
└──────────────────────────┘
     ↓
┌──────────────────────────┐
│ ✓ English                │
│   Español                │
│   Français               │
│   Deutsch                │
│   Português              │
│   More...                │
└──────────────────────────┘

Desktop:
┌──────────────────────────────┐
│ 🌐 English ▾                 │  ← In header, right side
└──────────────────────────────┘
```

### 2.3 Internal Linking Strategy
- Every calculator page links to 2-3 related tools ("Need to calculate area first? Try...")
- Area Calculator → Sod Calculator (pass area value via URL param)
- Grass Seed Calculator → Sod Calculator (seed vs sod comparison)
- Fertilizer Calculator → Lawn Water Calculator (fertilizer + watering schedule)
- Grass Type Guide → Grass Seed Calculator (grass type → seed amount)
- Sod Calculator → Soil Calculator (sod → soil preparation)
- All pages link back to homepage
- **Internal links ALWAYS stay within the same language** (`/es/` pages only link to `/es/` pages)
- Cross-language links ONLY via the language switcher (not inline)

### 2.4 Homepage Design

**Purpose:** SEO landing page + tool directory + instant sod calculation

**Layout:**
```
┌──────────────────────────────────────────────┐
│  🌱 TurfCalculator                           │
│  Free lawn & turf calculators                │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │  🎯 How much sod do you need?        │   │
│  │                                      │   │
│  │  Length [50] ft    Width [30] ft     │   │  ← Embedded sod calculator
│  │                                      │   │
│  │  You need 165 rolls (4 pallets)      │   │
│  │  Est. $495 – $1,320                  │   │
│  │                                      │   │
│  │  [→ Full Sod Calculator]             │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  ── More Calculators ──                     │
│                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ 📐 Area  │ │ 🌾 Seed  │ │ 💧 Fert  │    │  ← Tool cards grid
│  │ Calc     │ │ Calc     │ │ Calc     │    │
│  └──────────┘ └──────────┘ └──────────┘    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ 🌍 Water │ │ 🪴 Soil  │ │ 📏 Conv  │    │
│  │ Calc     │ │ Calc     │ │ erter    │    │
│  └──────────┘ └──────────┘ └──────────┘    │
│  ┌──────────┐ ┌──────────┐                  │
│  │ 🌿 Grass │ │ 📅 Care  │                  │
│  │ Guide    │ │ Calendar │                  │
│  └──────────┘ └──────────┘                  │
│                                              │
│  ── Popular Questions ──                    │
│  • How many square feet in a pallet of sod? │
│  • How much does a roll of sod cost?        │
│  • Best grass type for full sun?            │
│                                              │
└──────────────────────────────────────────────┘
```

**Key features:**
- Embedded sod calculator (same as /sod-calculator but simplified) — user can calculate immediately
- 9 tool cards in 3-column grid (2-column on mobile)
- Popular questions section with links to FAQ pages
- SEO-optimized H1: "Free Sod & Lawn Calculators"
- No ads on homepage (clean first impression)

### 2.5 Cross-Tool Data Passing (URL Parameters)

When users move between tools, relevant data passes via URL query parameters:

| Source Tool | Target Tool | URL Format | Example |
|-------------|-------------|------------|---------|
| Area Calculator | Sod Calculator | `/sod-calculator?area={value}&unit={unit}` | `/sod-calculator?area=1500&unit=sqft` |
| Area Calculator | Grass Seed Calculator | `/grass-seed-calculator?area={value}&unit={unit}` | `/grass-seed-calculator?area=1500&unit=sqft` |
| Area Calculator | Fertilizer Calculator | `/fertilizer-calculator?area={value}&unit={unit}` | `/fertilizer-calculator?area=1500&unit=sqft` |
| Area Calculator | Soil Calculator | `/soil-calculator?area={value}&unit={unit}` | `/soil-calculator?area=1500&unit=sqft` |
| Area Calculator | Water Calculator | `/lawn-water-calculator?area={value}&unit={unit}` | `/lawn-water-calculator?area=1500&unit=sqft` |
| Grass Type Guide | Grass Seed Calculator | `/grass-seed-calculator?area={value}&grass={type}` | `/grass-seed-calculator?area=1500&grass=tall-fescue` |
| Sod Calculator | Soil Calculator | `/soil-calculator?area={value}&unit={unit}` | `/soil-calculator?area=1650&unit=sqft` |

**Implementation:**
- Target tool reads URL params on page load via `URLSearchParams`
- Pre-fills the area/grass type fields with the passed values
- If no params: use default pre-filled values (1,000 sq ft)
- Language prefix preserved: `/es/calculadora-de-cesped?area=1500&unit=sqft`

---

## 3. Tool Specifications

### Tool 1: Sod Calculator (`/sod-calculator`)

**Purpose:** Calculate how many rolls/pallets of sod to purchase

**Target Keywords:**
- Primary: `sod calculator`, `turf calculator`, `how much sod do i need`
- Secondary: `sod roll calculator`, `pallet of sod coverage`, `how many rolls of sod`

**Input Fields:**

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| Length | Number | 50 | Pre-filled with example; ft or m (auto based on locale) |
| Width | Number | 30 | Pre-filled with example; ft or m (auto based on locale) |

**That's it. Two inputs. Result appears instantly.**

**All other settings use smart defaults (invisible to user):**
- Shape: Rectangle (covers 80%+ of use cases)
- Roll size: Standard 24"×60" = 10 sq ft
- Waste factor: 10% (mentioned in result: "includes 10% extra for cuts and shaping")
- Pallet size: 500 sq ft

**If user needs non-rectangle shapes or different roll sizes**, a small link below the result: "Need a different shape or roll size? →"

**Output Display:**

```
┌─────────────────────────────────────────┐
│                                          │
│     🎯 You need 165 rolls               │
│        (or 4 pallets)                   │
│                                          │
│     Est. cost: $495 – $1,320            │
│                                          │
│     Includes 10% extra for cuts         │
│     Based on 1,500 sq ft lawn           │
│                                          │
└─────────────────────────────────────────┘

Need a different shape or roll size? →
```

**Why this works:**
- User opens page → sees a result immediately (pre-filled 50×30)
- User changes 2 numbers → gets their answer
- Zero thinking required
- 95% of users never need to click "different shape or roll size"

**Industry Data Sources:**
- Standard sod roll: 24" × 60" = 10 sq ft (most common in US)
- Mini roll: 18" × 24" = 3 sq ft (some suppliers)
- Large roll: 24" × 81" = 13.5 sq ft (commercial)
- Pallet sizes: 450 sq ft (small), 500-600 sq ft (standard), 600-700 sq f (large)
- Price range: $0.30-$0.80/sq ft (varies by region, grass type, quantity)
- Waste factors: 5% (simple rectangle), 10% (normal), 15% (curves/obstacles), 20%+ (very irregular)

**SEO Content Below Calculator:**
- H2: "How to Calculate How Much Sod You Need"
- Step-by-step guide with formula explanation
- H2: "Sod Roll Sizes Explained" (table of standard sizes)
- H2: "FAQ" section with Schema FAQPage markup:
  - Q: How many square feet in a pallet of sod?
  - Q: How much does a roll of sod cost?
  - Q: Should I buy extra sod? How much?
  - Q: What is waste factor and why do I need it?
  - Q: How long can sod sit before installing?

---

### Tool 2: Lawn Area Calculator (`/lawn-area-calculator`)

**Purpose:** Calculate lawn area from dimensions for complex shapes

**Target Keywords:**
- `lawn area calculator`, `square footage calculator for lawn`
`calculate square feet of irregular lot`, `yard area calculator`

**Shapes Supported:**

| Shape | Inputs | Formula | Visual |
|-------|--------|---------|--------|
| Rectangle | Length, Width | L × W | Box icon |
| Square | Side | S² | Square icon |
| Circle | Diameter | π × (D/2)² | Circle icon |
| Oval/Ellipse | Major axis, Minor axis | π × a × b | Oval icon |
| Triangle | Base, Height | B × H / 2 | Triangle icon |
| Trapezoid | Parallel side a, b, Height | (a+b) × h / 2 | Trapezoid icon |

**Default: Single Rectangle (covers 80% of users)**

Most users just need length × width. Show this immediately:

```
┌──────────────────────────────────────┐
│  Length  [________]  ft              │
│  Width   [________]  ft              │
│                                      │
│  🎯 Your lawn: 1,500 sq ft          │
│                                      │
│  [+ Add another area]                │  ← Collapsed by default
│  [− Subtract area (pool, house)]     │  ← Collapsed by default
└──────────────────────────────────────┘
```

**Advanced: Multi-Zone Mode (for irregular yards)**

When user clicks "Add another area":
```
Zone 1: [Rectangle] 50ft × 30ft = 1,500 sq ft  [× Remove]
Zone 2: [Circle]   Diameter 20ft = 314 sq ft    [× Remove]

[− Subtract area (pool, house, driveway)]

TOTAL: 1,814 sq ft (168.5 sq m)

[→ Calculate how much sod I need]
```

**Output Options:**
- Auto-convert to: sq ft, sq m, sq yards, acres
- One-click transfer to Sod Calculator (URL parameter: `/sod-calculator?area=2189&unit=sqft`)
- Visual summary showing zone breakdown

**SEO Content:**
- H2: "How to Measure Your Yard for Sod"
- Tips for measuring irregular lots
- H2: "Common Lawn Sizes Reference Table"
  - Small city lot: ~3,000-5,000 sq ft
  - Suburban 1/4 acre: ~10,890 sq ft
  - 1/2 acre: ~21,780 sq ft
  - 1 acre: ~43,560 sq ft
- FAQ schema with measuring tips

---

### Tool 3: Grass Type Guide (`/grass-type-guide`)

**Purpose:** Interactive wizard to recommend grass types based on user conditions

**Target Keywords:**
- `best grass type for my area`, `grass selection guide`
`what kind of grass should I plant`, `lawn grass comparison`

**Data Structure:**

```javascript
const grassTypes = [
  {
    id: "bermuda",
    name: "Bermudagrass",
    season: "warm",
    regions: ["southeast", "southwest", "deep-south"],
    sunRequirement: "full", // full / partial / shade
    droughtTolerance: 5, // 1-5 scale
    footTrafficTolerance: 5,
    maintenanceLevel: "medium", // low / medium / high
    establishmentSpeed: "fast",
    color: "dark-green",
    pros: ["Excellent heat tolerance", "Durable under heavy use", "Fast spreading", "Drought resistant"],
    cons: ["Goes dormant (brown) in winter", "Requires full sun", "Aggressive invader into flower beds", "Frequent mowing needed"],
    bestFor: ["Sports lawns", "Full-sun yards", "High-traffic areas"],
    usdaZones: ["7", "8", "9", "10", "11"]
  },
  // ... (all grass types from Pennington research)
];
```

**Complete Grass Database (12 types):**

**Warm Season:**
1. Bermudagrass — Full sun, high traffic, fast spread, brown in winter
2. Zoysia Grass — Sun to light shade, durable, slow establish, good cold tolerance
3. Centipede Grass — Sun-partial shade, very low maintenance, acid soil tolerant
4. St. Augustine — Shade tolerant, coarse texture, salt tolerant, moderate maintenance
5. Bahiagrass — Deep south, low maintenance, drought tough, open turf habit

**Cool Season:**
6. Kentucky Bluegrass — Classic lush lawn, high maintenance, cold hardy, self-repairs
7. Tall Fescue — Adaptable, shade-tolerant, drought-resistant, low-maintenance option
8. Perennial Ryegrass — Quick germination, fine texture, often in mixes, less cold-hardy
9. Fine Fescue — Best for shade, very low maintenance, delicate blades
10. Kentucky 31 Tall Fescue — Economy option, tough, old reliable

**Blends/Mixes:**
11. Sun & Shade Mix — Versatile blend for mixed conditions
12. Regional Mixes — Northeast, Southern, Transition zone blends

**No wizard. No user input. Just show the information.**

This is a reference page, not an interactive tool. Users buying sod usually already know what grass type they want (their local supplier only carries 2-3 types). They just want to quickly compare options.

**Page Layout:**

```
┌──────────────────────────────────────────────────┐
│  Grass Types Compared                            │
│                                                  │
│  [Warm Season ▾]  [Cool Season]                  │  ← Simple toggle, default auto-detected
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │  🥇 Bermudagrass                         │   │
│  │  ☀️ Full sun  🏃 Durable  💧 Low water   │   │
│  │  ✅ Tough  ✅ Fast growing               │   │
│  │  ❌ Brown in winter                      │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │  🥈 Zoysia                               │   │
│  │  ☀️☀️ Sun  🏃 Durable  💧 Low water      │   │
│  │  ✅ Cold tolerant  ✅ Low maintenance    │   │
│  │  ❌ Slow to establish                    │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  ... (more grass types)                          │
│                                                  │
│  Detailed comparison table below ↓               │
└──────────────────────────────────────────────────┘
```

**Key principle: User reads, doesn't answer questions.**
- Auto-detect warm/cool season from browser locale
- Show relevant grass types immediately
- One toggle to switch between warm/cool season
- No steps, no wizard, no "what's your sunlight" questions
- Comparison table at bottom for detailed reference

**SEO Content:**
- Detailed individual pages for each grass type (or expandable sections)
- Comparison tables
- Regional planting calendars
- FAQ about grass selection

---

### Tool 4: Grass Seed Calculator (`/grass-seed-calculator`)

**Purpose:** How much grass seed to buy

**Target Keywords:** `grass seed calculator`, `how much grass seed do i need`, `grass seed per square foot`

**Input:**
| Field | Type | Default |
|-------|------|---------|
| Area | Number | 1,000 (sq ft, pre-filled) |
| Grass Type | Dropdown | Tall Fescue (most common) |

**Output:** Seed weight needed (lbs) + estimated bags

**Data:** Seed rates per 1000 sq ft by grass type (same as current Mode A data)

---

### Tool 5: Fertilizer Calculator (`/fertilizer-calculator`)

**Purpose:** How much lawn fertilizer to apply

**Target Keywords:** `lawn fertilizer calculator`, `how much fertilizer per square foot`, `fertilizer rate calculator`

**Input:**
| Field | Type | Default |
|-------|------|---------|
| Area | Number | 1,000 (sq ft, pre-filled) |
| Fertilizer Type | 3 buttons | [🌱 Regular] [🆕 Starter] [❄️ Winter] |

**Output:** Fertilizer amount (lbs) + how many bags + when to apply

**Data:** N recommendation rates by type (same as current Mode B data). No NPK input — too technical for most users.

---

### Tool 6: Lawn Water Calculator (`/lawn-water-calculator`)

**Purpose:** How much water your lawn needs

**Target Keywords:** `lawn water calculator`, `how much water does my lawn need`, `lawn watering schedule`

**Input:**
| Field | Type | Default |
|-------|------|---------|
| Area | Number | 1,000 (sq ft, pre-filled) |
| Grass Type | Dropdown | Tall Fescue |

**Output:** Gallons per week + minutes per watering session + how many times per week

**Data:** Water requirements by grass type (same as current Mode C data)

---

### Tool 7: Soil Calculator (`/soil-calculator`)

**Purpose:** Calculate topsoil, compost, sand, or fill material volume

**Target Keywords:**
- `topsoil calculator`, `soil calculator for lawn`
`how much topsoil do i need`, `cubic yards calculator`

**Input Fields:**

| Field | Type | Default |
|-------|------|---------|
| Area | Number | 1,000 (sq ft, pre-filled) |
| Depth | Number | 4 (inches, pre-filled — recommended for new lawns) |

**That's it.** Material type defaults to topsoil (most common). No compaction factor. No material type selector.

**Output:**
- Volume in cubic yards, cubic feet, and cubic meters
- Bag equivalents (common bag sizes)
- Tip: "4-6 inches recommended for new lawns"

---

### Tool 8: Area Converter (`/area-converter`)

**Purpose:** Convert between area units; SEO long-tail keyword capture machine

**Target Keywords (each pair is a target):**
- `sq ft to sq m`, `square feet to square meters`
- `acres to square feet`, `acre to sq ft converter`
- `sq yards to sq ft`, `square yards to square feet`
- `hectares to acres`, `hectare to acre`
- `sq ft to acres`, `square feet to acres`
- `sq m to sq ft`, `square meters to square feet`
- `acres to hectares`, `acre to hectare converter`
- `sq mi to acres`, `square miles to acres`
- ...and more

**Implementation Strategy:**
- Main page: Universal bidirectional converter
- Individual pages for high-volume keyword pairs (e.g., `/sq-ft-to-sq-m`, `/acres-to-square-feet`)
- These are auto-generated from a template with canonical tags pointing to main page

**Sub-pages to generate (top 20 by search volume):**

| # | URL Slug | Conversion | Est. Monthly Search Volume |
|---|----------|-----------|---------------------------|
| 1 | /sq-ft-to-sq-m | Square Feet → Square Meters | 9,000 |
| 2 | /sq-m-to-sq-ft | Square Meters → Square Feet | 6,500 |
| 3 | /acres-to-square-feet | Acres → Square Feet | 5,400 |
| 4 | /square-feet-to-acres | Square Feet → Acres | 4,200 |
| 5 | /sq-ft-to-sq-yd | Square Feet → Square Yards | 2,800 |
| 6 | /hectares-to-acres | Hectares → Acres | 2,500 |
| 7 | /acres-to-hectares | Acres → Hectares | 2,200 |
| 8 | /sq-yd-to-sq-ft | Square Yards → Square Feet | 1,800 |
| 9 | /sq-m-to-acres | Square Meters → Acres | 1,500 |
| 10 | /acres-to-sq-m | Acres → Square Meters | 1,300 |
| 11 | /sq-ft-to-acres | Square Feet → Acres (alt) | 1,200 |
| 12 | /hectares-to-sq-m | Hectares → Square Meters | 1,000 |
| 13 | /sq-m-to-hectares | Square Meters → Hectares | 900 |
| 14 | /sq-ft-to-sq-in | Square Feet → Square Inches | 800 |
| 15 | /sq-in-to-sq-ft | Square Inches → Square Feet | 700 |
| 16 | /sq-mi-to-acres | Square Miles → Acres | 600 |
| 17 | /acres-to-sq-mi | Acres → Square Miles | 500 |
| 18 | /sq-m-to-sq-yd | Square Meters → Square Yards | 450 |
| 19 | /sq-yd-to-sq-m | Square Yards → Square Meters | 400 |
| 20 | /sq-ft-to-sq-cm | Square Feet → Square Centimeters | 350 |

Total sub-pages: 20 per language × 14 languages = 280 pages
Each sub-page: bidirectional converter + SEO content + FAQ schema
Template-based generation: one template, swap units and conversion factor

**Supported Units:**

| Unit | Symbol | In Square Feet | In Square Meters |
|------|--------|---------------|------------------|
| Square Inch | in² | 0.00694 | 0.000645 |
| Square Foot | ft² | 1 | 0.092903 |
| Square Yard | yd² | 9 | 0.836127 |
| Square Meter | m² | 10.76391 | 1 |
| Are | a | 1076.391 | 100 |
| Centiare | ca | 10.76391 | 1 |
| Acre | ac | 43,560 | 4,046.86 |
| Hectare | ha | 107,639 | 10,000 |
| Square Mile | mi² | 27,878,400 | 2,589,988 |

**UX:**
- Real-time conversion as user types
- Swap button to flip direction
- Copy result button
- Common conversions quick-reference table below

---

### Tool 9: Lawn Care Calendar (`/lawn-care-calendar`)

**Purpose:** Month-by-month lawn care task schedule based on USDA zone and grass type

**Target Keywords:**
- `lawn care schedule`, `when to fertilize lawn`
`lawn care calendar by month`, `monthly lawn care tasks`

**Input:**

| Field | Options |
|-------|---------|
| Grass Type | Warm Season / Cool Season (auto-detected from browser locale, user can override) |
| (Auto-detected) Region | Based on browser locale — no user action needed |

**UX: User opens the page and immediately sees their calendar.**
- Region and grass season type auto-detected from browser locale
- User can override with a single toggle: "Warm Season / Cool Season"
- No map, no zone selector, no manual input required

**Data Structure (example for Zone 7, Cool Season):**

```javascript
const calendarData = {
  zone: 7,
  seasonType: "cool",
  months: {
    january: {
      phase: "Dormant",
      color: "#94a3b8",
      tasks: [
        { task: "Service lawn mower (sharpen blade, change oil)", priority: "medium" },
        { task: "Plan lawn care goals for the year", priority: "low" },
        { task: "Avoid walking on frozen grass", priority: "high" }
      ],
      tips: "Good time to order seeds and supplies at winter prices."
    },
    february: {
      phase: "Pre-Season",
      color: "#fbbf24",
      tasks: [
        { task: "Test soil pH and nutrient levels", priority: "high" },
        { task: "Apply pre-emergent herbicide (mid-late month)", priority: "high" },
        { task: "Rake debris and clear the lawn", priority: "medium" },
        { task: "Overseed thin areas if weather permits", priority: "low" }
      ],
      tips: "Pre-emergent timing is critical — apply before soil temps reach 55°F."
    }
    // ... all 12 months
  }
};
```

**Visual Output:**
- 12-month calendar grid view
- Color-coded phases: Dormant (gray), Pre-Season (yellow), Active Growth (green), Transition (orange), Preparation (brown)
- Click any month for detailed task list
- Task badges: 🔴 Critical / 🟡 Recommended / 🟢 Optional

**Seasonal Summary Cards:**

| Season | Cool Season Tasks | Warm Season Tasks |
|--------|-------------------|-------------------|
| **Spring** | First fertilization, overseed, start mowing | Green-up, first mowing, weed control |
| **Summer** | Water deeply, raise mowing height, watch for disease | Peak growth, regular mowing, monitor for grubs |
| **Fall** | Aerate, overseed, fall fertilization (MOST IMPORTANT) | Reduce mowing, prepare for dormancy |
| **Winter** | Dormancy, equipment maintenance | Dormant/brown, no major tasks |

### Tool 10: Custom 404 Page (`/404.html`)

**Purpose:** Guide lost users to the right tool instead of bouncing

**Layout:**
```
┌──────────────────────────────────────────┐
│  🤔 Page Not Found                       │
│                                          │
│  Looking for a calculator?               │
│                                          │
│  [🌱 Sod Calculator]                    │
│  [📐 Area Calculator]                   │
│  [🌾 Grass Seed Calculator]             │
│  [💧 Fertilizer Calculator]             │
│  [🌍 Area Converter]                    │
│                                          │
│  [🏠 Go to Homepage]                    │
└──────────────────────────────────────────┘
```

- Shows top 5 most popular tools as large buttons
- "Go to Homepage" link
- Same styling as rest of site
- Auto-detect language from URL path (/es/xxx → show Spanish 404)

---

## 4. Technical Architecture

### Stack

```
┌─────────────────────────────────────┐
│           Cloudflare Pages          │
│  (CDN + SSL + Automatic HTTPS +     │
│   Global Edge Network)              │
├─────────────────────────────────────┤
│  Static HTML + CSS + JavaScript     │
│  (Build-time i18n via Node.js       │
│   script: templates + JSON → HTML)  │
│                                     │
│  Optional: Tailwind CSS via CDN     │
│  Optional: Lightweight chart lib    │
├─────────────────────────────────────┤
│  GitHub Repository                  │
│  (Auto-deploy on push to main)      │
└─────────────────────────────────────┘
```

### File Structure

```
turf-calculator/
├── src/                              ← Source files (pre-build)
│   ├── templates/                    ← HTML templates with {{i18n_key}} placeholders
│   │   ├── sod-calculator.html
│   │   ├── lawn-area-calculator.html
│   │   ├── grass-type-guide.html
│   │   ├── fertilizer-calculator.html
│   │   ├── grass-seed-calculator.html
│   │   ├── lawn-water-calculator.html
│   │   ├── soil-calculator.html
│   │   ├── area-converter.html
│   │   ├── lawn-care-calendar.html
│   │   ├── about.html
│   │   └── index.html
│   ├── i18n/                         ← Translation files (JSON)
│   │   ├── en.json                   ← Source of truth
│   │   ├── es.json
│   │   ├── fr.json
│   │   └── ...
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── app.js                    ← Shared utilities + locale config
│   │   ├── sod-calculator.js         ← Tool 1 logic (pure math, no text)
│   │   ├── area-calculator.js        ← Tool 2 logic
│   │   ├── grass-guide.js            ← Tool 3 logic & locale-aware data
│   │   ├── fertilizer-calculator.js  ← Tool 4 logic
│   │   ├── grass-seed-calculator.js  ← Tool 4 logic
│   │   ├── lawn-water-calculator.js  ← Tool 6 logic
│   │   ├── soil-calculator.js        ← Tool 5 logic
│   │   ├── area-converter.js         ← Tool 6 logic
│   │   └── lawn-calendar.js          ← Tool 7 logic & locale-aware data
│   ├── build.js                      ← Node.js build script (template + i18n → HTML)
│   └── assets/
│       └── favicon.ico
│
├── dist/                             ← Build output (deployed to Cloudflare)
│   ├── en/                           ← English pages
│   │   ├── index.html
│   │   ├── sod-calculator.html
│   │   ├── ...
│   │   └── 404.html
│   ├── es/                           ← Spanish pages
│   │   ├── index.html
│   │   ├── calculadora-de-cesped.html
│   │   └── ...
│   ├── fr/                           ← French pages
│   │   └── ...
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── ...
│   ├── sitemap.xml                   ← Auto-generated (all languages + hreflang)
│   ├── robots.txt
│   └── _redirects                    ← Root → /en/, language routing
│
├── package.json                      ← Build dependencies (Node.js)
└── README.md
```

### Performance Targets
- Lighthouse Performance: >95
- LCP (Largest Contentful Paint): <1.5s
- FID (First Input Delay): <100ms
- CLS (Cumulative Layout Shift): <0.1
- Total page weight: <200KB (per tool page)

### SEO Technical Requirements

**On-Page SEO (every page):**
- Unique `<title>` tag (60 chars optimal)
- Meta description (150-160 chars)
- H1 exactly one per page
- Semantic HTML5 (`<main>`, `<article>`, `<section>`)

**Structured Data (Schema.org JSON-LD):**
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Sod Calculator",
  "description": "...",
  "url": "https://domain.com/sod-calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```
Plus `FAQPage` schema on every tool page.

**Meta Tags Example (sod-calculator):**
```
Title: Free Sod Calculator - How Much Sod Do I Need? (2026)
Description: Calculate exact sod rolls and pallets needed for your lawn.
Free sod calculator with waste factor support. Works for any shape.
Get results in 30 seconds. No signup required.
Canonical: https://domain.com/sod-calculator
OG tags for social sharing
```

**Sitemap & Robots:**
- XML sitemap listing all pages
- robots.txt allowing all crawlers
- Canonical tags on all pages
- hreflang tags on all pages (all 14 languages, per §11.6)

---

## 5. UX/UI Design Principles — Mobile-First & Multi-Device Adaptation

> **Core Philosophy: Design for the user standing in their yard with a phone in hand, not sitting at a desk.**
> 70%+ of our traffic will come from mobile devices. Every design decision starts from the smallest screen.

---

### 5.1 Target Device Matrix & Breakpoints

**Primary Test Devices (must look perfect on all of these):**

| Device | Viewport | Category | Usage Context | Priority |
|--------|----------|----------|---------------|----------|
| iPhone SE (3rd gen) | 375×667 | Small phone | Budget Android users, compact phones | **P0 — Must work perfectly** |
| iPhone 14/15 (standard) | 390×844 | Standard phone | Most common US smartphone | **P0 — Must work perfectly** |
| iPhone 14/15 Pro Max | 430×932 | Large phone | Power users, phablet users | **P0 — Must work perfectly** |
| Samsung Galaxy S23 | 360×780 | Android standard | Huge Android market share | **P0 — Must work perfectly** |
| Samsung Galaxy S23 Ultra | 412×915 | Large Android | Android power users | **P0 — Must work perfectly** |
| iPad Mini (8.3") | 768×1025 | Tablet portrait | Tablet users, casual browsing | **P1 — Good experience** |
| iPad Air/Pro (11") | 820×1180 | Tablet portrait | Homeowners planning at kitchen table | **P1 — Good experience** |
| iPad Pro 12.9" landscape | 1024×1366 | Tablet landscape | Side-by-side reference | **P1 — Good experience** |
| Laptop 1366×768 | 1366×768 | HD laptop | Common Windows laptop resolution | **P2 — Good experience** |
| Laptop 1920×1080 | 1920×1080 | Full HD desktop | Most common desktop monitor | **P2 — Good experience** |
| Desktop 2560×1440 | 2560×1440 | 2K QHD | Designer/pro monitors, gaming displays | **P1 — Enhanced layout** |
| Desktop 3440×1440 | 3440×1440 | Ultrawide 21:9 | Productivity setups, enthusiast users | **P1 — Enhanced layout** |
| Desktop 3840×2160 | 3840×2160 | 4K UHD | High-end monitors, future-proofing | **P1 — Enhanced layout** |
| Desktop 5120×2880 | 5120×2880 | 5K | Apple Pro Display, pro creative setups | **P2 — Acceptable** |

**CSS Breakpoint System (mobile-first, covering ALL target resolutions):**

```css
/* ===== Base: 320px+ (all phones) ===== */
/* Default styles target smallest screen first */

/* ===== SM: ≥480px ===== */
/* Large phones landscape / small phones */
@media (min-width: 480px) { }

/* ===== MD: ≥640px ===== */
/* Tablets portrait / large phones */
@media (min-width: 640px) { }

/* ===== LG: ≥768px ===== */
/* Tablets landscape / small laptops */
@media (min-width: 768px) { }

/* ===== XL: ≥1024px ===== */
/* Standard desktops / laptops */
@media (min-width: 1024px) { }

/* ===== 2XL: ≥1280px ===== */
/* Large desktops / small 1440p displays */
@media (min-width: 1280px) { }

/* ===== 3XL: ≥1536px ===== */
/* 1536-1600px range (MacBook Air/Pro Retina, many 16" laptops) */
@media (min-width: 1536px) { }

/* ===== 4XL: ≥1920px ===== */
/* Full HD 1080p standard desktop monitors */
@media (min-width: 1920px) { }

/* ===== 5XL: ≥2560px ===== */
/* 2K QHD displays (2560×1440), common on mid-high-end monitors */
@media (min-width: 2560px) { }

/* ===== 6XL: ≥3840px ===== */
/* 4K UHD displays (3840×2160) */
@media (min-width: 3840px) { }
```

**Breakpoint Naming Rationale:**
- Each step is ~300-500px apart to avoid "dead zones" where layout breaks between breakpoints
- 1536px is critical — this is the CSS pixel width of MacBook Pro/Air Retina displays (physical 3072×1920 or 2560×1600 @2x)
- 2560px covers the fast-growing 2K monitor market
- 3840px covers 4K — increasingly common even among non-pro users

---

### 5.2 User Scenarios & Context Analysis

#### Scenario A: In the Yard (Mobile Portrait)
**User:** Homeowner standing in their yard at a garden center or home improvement store
**Device:** Phone, one-handed, bright sunlight
**Need:** Quick answer — "How many rolls do I need?"
**Design Response:**
- High contrast mode (sunlight readable)
- Large touch targets (minimum 48px, ideally 56px)
- Minimal scrolling to reach result
- Number pad input type (not full keyboard)
- Result displayed prominently near top after calculation
- No horizontal scrolling ever

#### Scenario B: At the Store Aisle (Mobile Portrait)
**User:** Comparing sod options in store aisle
**Device:** Phone, possibly with gloves or dirty hands
**Need:** Compare prices per sq ft, check if current deal is good
**Design Response:**
- Swipe-friendly comparison cards
- Price calculator front-and-center
- Quick-toggle between roll sizes
- Offline-capable core calculator (service worker optional Phase 2)

#### Scenario C: Planning at Kitchen Table (Tablet)
**User:** Couple planning lawn project together
**Device:** iPad or Android tablet, shared viewing
**Need:** Explore multiple tools, compare grass types, read guides
**Design Response:**
- Two-column layouts where appropriate
- Larger tap targets for less precise tablet touches
- Wizard steps visible as progress indicator
- Print-friendly result sheets (CSS print media)

#### Scenario D: Researching at Desk (Desktop)
**User:** Doing research before buying, comparing multiple scenarios
**Device:** Laptop or desktop, mouse + keyboard
**Need:** Run multiple calculations quickly, switch between tools
**Design Response:**
- Keyboard shortcuts (Tab between fields, Enter to calculate)
- Hover states with additional info tooltips
- Sidebar navigation always visible
- Multiple calculators can be open in tabs
- Copy-to-clipboard on results
- Sticky header with quick tool switching

#### Scenario E: Low-Bandwidth / Rural Area
**User:** Rural homeowner with slow cellular data
**Device:** Any phone on 3G or weak 4G
**Need:** Page must load fast regardless of connection
**Design Response:**
- Total page weight <150KB per tool page (excluding fonts)
- No external JS frameworks — vanilla JS only
- Critical CSS inline in `<head>`
- Images (if any): WebP format, lazy loaded
- Cloudflare CDN edge caching
- Font: System font stack first, web font optional enhancement

---

### 5.3 Component-Level Responsive Behavior

#### 5.3.1 Navigation

**Mobile (<768px):**
```
┌──────────────────────────┐
│ ☰    TurfCalc     [≡]   │  ← Hamburger left, logo center, tool menu right
├──────────────────────────┤
│                          │
│   (page content)         │
│                          │
├──────────────────────────┤
│  🏠  🧮📐🌱💧🌍📅  │  ← Bottom nav bar (fixed), icons only
└──────────────────────────┘
```
- Fixed bottom tab bar with 5-7 most-used tools (icon + short label)
- Hamburger menu reveals full sitemap
- Sticky bottom bar with safe-area insets for notch/home-indicator
- Bottom nav shows 5 most-used tools (Sod Calc, Area Calc, Seed Calc, Fertilizer, Soil Calc). Remaining 4 tools (Grass Guide, Water Calc, Area Converter, Calendar) accessible via "More" menu or hamburger.

**Tablet (≥768px):**
```
┌─────────────────────────────────────┐
│ 🌱 TurfCalc          [About] [☰]   │  ← Full logo + text, hamburger still available
├──────────┬──────────────────────────┤
│ Tools    │                          │
│ ─────    │   (page content)         │
│ Sod Calc │   wider content area     │
│ Area     │                          │
│ Grass    │                          │
│ Fert     │                          │
│ Soil     │                          │
│ Convert  │                          │
│ Calendar │                          │
└──────────┴──────────────────────────┘
```
- Left sidebar navigation (collapsible to icons-only)
- Content area: max-width 720px centered

**Desktop (≥1024px):**
```
┌──────────────────────────────────────────────────┐
│ 🌱 TurfCalculator                    [About]      │
├────────────┬─────────────────────────────────────┤
│            │                                     │
│  All Tools │        (page content)               │
│            │        max-width: 800px             │
│  Sod       │        centered                     │
│  Area      │                                     │
│  Grass     │                                     │
│  Fertilizer│                                     │
│  Soil      │                                     │
│  Converter │                                     │
│  Calendar  │                                     │
│            │           [Ad space - sidebar]      │
└────────────┴─────────────────────────────────────┘
```
- Full sidebar with section labels
- Optional right rail for ads (desktop only, never on mobile/tablet)
- Content never exceeds 800px width for readability

#### 5.3.2 Calculator Input Fields

**All screen sizes — non-negotiable rules:**

| Rule | Spec | Rationale |
|------|------|-----------|
| Input height | min 48px (mobile), 44px (desktop) | Touch-friendly, WCAG 2.5cm target |
| Font size | 16px minimum | Prevents iOS auto-zoom on focus |
| Label position | Above input (always) | Prevents mis-taps on small screens |
| Spacing between fields | 16px vertical gap | Prevents accidental adjacent taps |
| Input width | 100% of container (with padding) | No cramped inputs on any device |
| Border | 2px solid, visible focus ring | Clear field boundaries |
| Number inputs | `type="tel"` or `inputmode="decimal"` | Triggers numeric keypad on mobile |
| Select/dropdown | Native select on mobile (reliable) | Custom dropdowns fail on some Android browsers |

**Input field HTML pattern:**
```html
<div class="field-group">
  <label for="length">Length</label>
  <div class="input-wrapper">
    <input id="length" type="text" inputmode="decimal"
           placeholder="0" autocomplete="off"
           aria-describedby="length-help">
    <span class="unit-suffix">ft</span>
  </div>
  <small id="length-help">Measure the longest side</small>
</div>
```

**Unit selector — responsive behavior:**

Mobile:
```
┌────────────────────────────┐
│ Length   [________]  [ft ▾]│  ← Unit inline with input
└────────────────────────────┘
```

Desktop:
```
┌──────────────────────────────────────┐
│ Length                                │
│ [____________]  ft  /  m  /  yd       │  ← Unit toggle pills below
└──────────────────────────────────────┘
```

#### 5.3.3 Shape Selector

**Mobile (<640px):**
- Vertical scrollable card list (one shape per row)
- Each row: icon + name + chevron
- Selected state: green border-left accent + light green background
- Tap to select, expand to show dimension inputs
- Only selected shape's inputs are visible (save vertical space)

**Tablet/Desktop (≥640px):**
- Grid of shape cards (2-col tablet, 3-col desktop)
- Click to select with visual highlight
- All shapes visible at once for quick comparison
- Selected shape shows inputs immediately below grid

#### 5.3.4 Slider Controls (Waste Factor etc.)

**Critical mobile consideration:**
- Slider thumb size: minimum 44×44px touch area (visual thumb can be smaller but hit area must be 44px)
- Track height: 8px (thick enough to see and grab)
- Active/inactive track color contrast ratio >3:1
- Value label: follows thumb or displays prominently above slider
- Step markers: labeled ticks at key positions (5%, 10%, 15%, 20%)
- Works with both touch drag AND tap-on-track-to-jump

**HTML pattern:**
```html
<div class="slider-field">
  <label>Waste Factor</label>
  <div class="slider-track">
    <input type="range" min="5" max="25" step="5" value="10"
           aria-valuemin="5" aria-valuemax="25" aria-valuenow="10">
    <div class="slider-labels">
      <span>Simple</span>
      <span>Normal</span>
      <span>Complex</span>
      <span>Very Complex</span>
    </div>
  </div>
  <output class="slider-value">10%</output>
</div>
```

#### 5.3.5 Results Display

**Mobile (<640px):**
```
┌──────────────────────────────┐
│  ✅ RESULTS                  │
│  ──────────────────────────  │
│  ┌──────┐  ┌──────┐         │
│  │ 275  │  │  6   │  ← Big numbers, card layout
│  │rolls │  │pallet│         │
│  └──────┘  └──────┘         │
│                              │
│  Est. $825 – $2,200          │
│                              │
│  [Share]  [Print]  [Reset]   │  ← Action buttons, full width
└──────────────────────────────┘
```
- Results appear ABOVE fold (user shouldn't scroll to see answer)
- Key numbers in extra-large font (32-40px)
- Card-style result blocks with subtle shadows
- Always-visible "Recalculate" / "Start Over" button
- Share button (copies URL with params to clipboard)

**Desktop (≥1024px):**
```
┌─────────────────────────────────────────────┐
│  ✅ YOUR RESULTS                             │
│  ─────────────────────────────────────────  │
│                                              │
│  Total Area (with waste):   2,750 sq ft     │
│  ─────────────────────────────────────────  │
│                                              │
│  ┌─────────┐  ┌─────────┐  ┌──────────┐    │
│  │ 275     │  │ 5-6     │  │ $825      │    │
│  │Rolls    │  │Pallets  │  │- $2,200   │    │
│  └─────────┘  └─────────┘  └──────────┘    │
│                                              │
│  💡 Tip: Buy 1 extra roll for patching      │
│                                              │
│  [📋 Copy Results]  [🖨️ Print]  [↻ Reset]  │
└─────────────────────────────────────────────┘
```
- Side-by-side metric cards
- More detail visible without scrolling
- Tooltip explanations on hover for each metric

#### 5.3.6 Tab Interfaces (Fertilizer Calculator modes)

**Mobile:**
- Full-width tab buttons (segmented control style)
- Selected tab: filled background, others outline
- Content area below switches without page jump
- Scroll position preserved when switching tabs

**Desktop:**
- Tabs can be horizontal or vertical sidebar style
- Tab content can optionally show in multi-column layout

#### 5.3.7 Tables (Grass comparison, seed rates, etc.)

**Mobile (<640px):**
- **Card transform**: Each table row becomes a card
- Label-value pairs within each card (no horizontal scrolling EVER)
- Sortable headers become dropdown filters
- Example:

```
┌──────────────────────────────┐
│  🌿 Bermudagrass            │
│  ─────────────────────────  │
│  Season    Warm Season      │
│  Sun       Full Sun         │
│  Drought   ★★★★★           │
│  Traffic   ★★★★★           │
│  Maintain  Medium           │
│  [View Details →]           │
└──────────────────────────────┘
```

**Tablet (≥640px):**
- Horizontal table with horizontal scroll if needed (but avoid)
- Sticky first column for row labels
- Zebra striping for readability

**Desktop (≥1024px):**
- Full table with all columns visible
- Column sorting (click header)
- Hover row highlight
- Optional: column visibility toggle

#### 5.3.8 FAQ Accordion

**All screens:**
- Single-expand accordion (one open at a time on mobile)
- Desktop: allow multiple expanded for easy scanning
- Chevron rotates on expand (smooth CSS transition)
- Each item has generous padding (16px all sides on mobile)
- Touch target: entire row is tappable

#### 5.3.9 Wizard Steps (Grass Type Guide)

**Mobile (<640px):**
```
Step 2 of 4 ████████░░░░░ 50%
┌──────────────────────────┐
│                          │
│   How much sun?          │
│                          │
│  ┌──────────────────┐   │
│  │ ☀️ Full Sun (>6h)│   │  ← Full-width cards
│  └──────────────────┘   │
│  ┌──────────────────┐   │
│  │ ⛅ Partial (4-6h)│   │
│  └──────────────────┘   │
│  ┌──────────────────┐   │
│  │ 🌳 Shady (<4h)   │   │
│  └──────────────────┘   │
│                          │
│  [← Back]  [Next →]     │  ← Full-width buttons
└──────────────────────────┘
```
- One question per screen (vertical flow)
- Progress bar fixed at top (sticky)
- Back/Next buttons fixed at bottom (sticky)
- Safe area padding for home indicator
- Results appear on final step (no separate page load)

**Tablet (≥768px):**
- May show 2-step view (current + preview next)
- Wider option cards

**Desktop (≥1024px):**
- Optional: sidebar wizard (steps on left, content on right)
- Or: multi-column step display

---

### 5.4 Typography Scale (Responsive)

```css
:root {
  --font-base: system-ui, -apple-system, 'Segoe UI', Roboto,
               'Helvetica Neue', Arial, sans-serif;
}

/* Mobile-first type scale */
html { font-size: 16px; }        /* Base: 16px */

h1 { font-size: 1.5rem; }        /* 24px → mobile */
h2 { font-size: 1.25rem; }       /* 20px → mobile */
h3 { font-size: 1.125rem; }      /* 18px → mobile */
body { font-size: 1rem; line-height: 1.6; } /* 16px body */
small, .help-text { font-size: 0.875rem; }   /* 14px */

@media (min-width: 768px) {
  h1 { font-size: 2rem; }        /* 32px → tablet+ */
  h2 { font-size: 1.5rem; }      /* 24px → tablet+ */
}

@media (min-width: 1024px) {
  h1 { font-size: 2.25rem; }     /* 36px → desktop */
}
```

**Line length (readability):**
- Body text: max 70ch (about 600px) — prevents eye strain on wide screens
- Calculator inputs: fill available width
- Results numbers: as large as context allows

---

### 5.5 Color & Contrast (Accessibility + Sunlight Readability)

**Color Palette:**

| Token | Hex | Usage | Contrast (on white) |
|-------|-----|-------|---------------------|
| --color-primary | #15803d | Primary actions, active states | 4.8:1 ✓ AA |
| --color-primary-light | #22c55e | Success states, highlights | 2.5:1 ✗ (use on dark bg only) |
| --color-primary-bg | #f0fdf4 | Light green backgrounds | N/A (bg) |
| --color-text | #1a1a2e | Body text | 15.2:1 ✓ AAA |
| --color-text-secondary | #64748b | Secondary text, help | 4.6:1 ✓ AA |
| --color-border | #e2e8f0 | Input borders, dividers | 1.6:1 ✗ (decorative only) |
| --color-surface | #ffffff | Card backgrounds, inputs | N/A |
| --color-bg | #f8fafc | Page background | N/A |
| --color-accent | #0369a1 | Links, info callouts | 4.6:1 ✓ AA |
| --color-warning | #b45309 | Tips, cautions | 3.1:1 ✓ AA |
| --color-error | #dc2626 | Errors | 5.4:1 ✓ AAA |

**Sunlight Mode Considerations:**
- Text colors use dark values (#1a1a2e, not #333) for outdoor readability
- Borders are visibly distinct (2px, not 1px)
- Buttons have sufficient color contrast even in direct sun
- Avoid relying solely on color to convey information (always pair with icons/text)

---

### 5.6 Spacing System (Responsive)

```css
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
}

/* Component spacing scales up on larger screens */
.section-padding {
  padding: var(--space-6) var(--space-4);    /* mobile: 24px 16px */
}
@media (min-width: 768px) {
  .section-padding {
    padding: var(--space-10) var(--space-8);  /* tablet: 40px 32px */
  }
}
@media (min-width: 1024px) {
  .section-padding {
    padding: var(--space-12) var(--space-10); /* desktop: 48px 40px */
  }
}
```

---

### 5.7 Interaction Patterns

#### Touch Interactions (Mobile/Tablet)
- **Tap feedback**: Visual press state (scale 0.98 or darken) within 100ms
- **Swipe**: Horizontal card carousels for related tools, grass type cards
- **Pull-down not needed**: Static content site, no infinite scroll
- **Long-press**: Not used (confusing for mainstream users)
- **Double-tap**: Not used (reserved for zoom on mobile browsers)

#### Keyboard Interactions (Desktop)
- **Tab order**: Logical flow through all interactive elements
- **Enter/Space**: Activates buttons, selects radio options
- **Arrow keys**: Navigate slider controls, radio groups
- **Escape**: Closes modals/menus
- **Skip link**: Hidden "Jump to content" link for screen readers

#### Gesture Map

| Component | Touch | Mouse | Keyboard |
|-----------|-------|-------|----------|
| Button | Tap | Click | Enter/Space |
| Input field | Tap to focus | Click to focus | Tab to focus, type |
| Slider | Drag thumb, tap track | Drag, click track | Arrow keys adjust |
| Select/Dropdown | Tap native select | Click native select | Arrow keys, Enter |
| Accordion FAQ | Tap row | Click row | Enter/Space toggle |
| Tab bar | Tap icon | Click icon | Arrow keys navigate |
| Card link | Tap anywhere | Click | Enter when focused |
| Shape selector | Tap card | Click card | Arrow keys + Enter |

---

### 5.8 Browser Compatibility Matrix

| Browser | Platform | Min Version | Market Share | Testing Priority | Known Issues |
|---------|----------|-------------|--------------|------------------|--------------|
| **Chrome** | Android Mobile | 120+ | ~65% mobile global | **P0 — Test every build** | None expected |
| **Safari** | iOS Mobile | 17+ | ~25% mobile US | **P0 — Test every build** | `inputmode` support good; `-webkit-appearance` for selects |
| **Samsung Internet** | Android Mobile | 23+ | ~5% mobile global | **P1 — Test before release** | Based on Chromium, generally compatible |
| **Firefox** | Android Mobile | 120+ | ~1% mobile | **P2 — Spot check** | Generally standards-compliant |
| **Chrome** | Desktop (Win/Mac/Linux) | 120+ | ~65-70% desktop global | **P0 — Test every build** | None expected; most common reference browser |
| **Safari** | Desktop (macOS) | 17+ | ~14% desktop US | **P0 — Test every build** | Flexbox gaps, `position: sticky` in flex containers, print differences, `input[type=number]` spinner styling |
| **Edge** | Desktop (Windows) | 120+ | ~5-10% desktop (varies by region) | **P0 — Test every build** | Chromium-based = mostly same as Chrome; but PDF viewer, print behavior, Windows-specific features differ |
| **Firefox** | Desktop (Win/Mac/Linux) | 120+ | ~3% desktop global | **P1 — Test before release** | Print styles, some newer CSS features timing differs |
| **Brave / Vivaldi / Opera** | Desktop (Chromium-based) | Latest | ~2-3% combined | **P2 — Spot check before major releases** | Chromium-based; usually fine; ad-blockers may affect our AdSense display |
| **Internet Explorer** | Desktop (Windows) | N/A | <0.5% (effectively dead) | **NOT supported** | Do not waste time; show upgrade banner if detected via conditional comment |

**Desktop-Specific Browser Testing Checklist:**

| Test Area | Chrome | Safari Mac | Edge Win | Firefox | Notes |
|-----------|--------|------------|----------|---------|-------|
| Calculator input + live results | ✅ | ✅ | ✅ | ✅ | Core flow must work identically |
| Sidebar navigation sticky behavior | ✅ | ⚠️ Test carefully | ✅ | ✅ | Safari known issue with sticky in flex |
| Bottom nav bar on narrow desktop window | ✅ | ✅ | ✅ | ✅ | Resize window to 600px width |
| Print to PDF (calculator page) | ✅ | ⚠️ May differ | ⚠️ Edge PDF viewer | ⚠️ | Compare output across all 4 |
| 125%/150% browser zoom | ✅ | ✅ | ✅ | ✅ | Windows default is often 125% |
| 4K resolution (3840px CSS width) | ✅ | ✅ | ✅ | ✅ | Content must not stretch ugly |
| Ultrawide (2560px+, 21:9 aspect) | ✅ | ✅ | ✅ | ✅ | Edge nav, background treatment |
| Dark mode (if OS dark mode active) | ✅ | ✅ | ✅ | ✅ | Must remain readable; full dark mode = Phase 2 |
| High Contrast Mode (Windows) | ✅ | N/A | ✅ | ✅ | See §5.10.1.7 forced-colors handling |
| Keyboard-only navigation (Tab/Shift+Tab/Enter) | ✅ | ✅ | ✅ | ✅ | Full keyboard accessibility |
| Chinese/Japanese IME input in number fields | ✅ | ✅ | ✅ | ✅ | No layout shift during composition |
| Touch on touchscreen laptop/2-in-1 | ✅ | ✅ | ✅ | ✅ | Touch targets still work without mouse |

**CSS Feature Policy (safe to use):**
- ✅ CSS Grid, Flexbox (all target browsers)
- ✅ CSS Custom Properties (variables)
- ✅ `clamp()` for fluid typography
- ✅ `aspect-ratio`
- ✅ `:has()` selector (for parent selection)
- ✅ `@media (prefers-color-scheme)` (future dark mode)
- ✅ `@media (prefers-reduced-motion)`
- ✅ `scroll-behavior: smooth`
- ✅ `@media (forced-colors)` (Windows High Contrast)
- ✅ `@media (min-aspect-ratio:)` (ultrawide detection)
- ❌ NO CSS Container Queries (Safari 17 partial, avoid for now)
- ❌ NO CSS Nesting (Safari support incomplete at time of build)
- ❌ NO `view-transition` API (Safari unsupported)

**JavaScript Feature Policy:**
- ✅ ES2020+ features (optional chaining `?.`, nullish coalescing `??`)
- ✅ `Intl.NumberFormat` (locale-aware number formatting)
- ✅ `URLSearchParams` (reading/writing URL params for cross-tool data pass)
- ✅ `IntersectionObserver` (lazy loading, scroll animations)
- ✅ `matchMedia` (responsive JS behavior)
- ✅ `ResizeObserver` (dynamic component sizing if needed)
- ✅ `Clipboard API` (copy results to clipboard)
- ❌ NO framework dependencies (React, Vue, etc.)
- ❌ NO polyfills (keep it simple, target modern browsers only)

---

### 5.9 Layout Grid System

**Not using a framework grid — custom lightweight system:**

```css
.container {
  width: 100%;
  margin-inline: auto;
  padding-inline: var(--space-4);  /* 16px mobile */
  max-width: 100%;
}

@media (min-width: 640px) {
  .container { padding-inline: var(--space-6); }  /* 24px */
}

@media (min-width: 768px) {
  .container { max-width: 720px; padding-inline: var(--space-8); }
}

@media (min-width: 1024px) {
  .container { max-width: 1200px; padding-inline: var(--space-8); }  /* 32px */
}

/* Two-column for tool pages on desktop */
.tool-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}
@media (min-width: 768px) {
  .tool-grid { grid-template-columns: 1fr 1fr; }
}
/* But calculator inputs ALWAYS single column on all screens */
.calculator-inputs {
  grid-template-columns: 1fr !important;  /* Never stack inputs horizontally */
}

/* ===== Desktop layout structure scales with resolution ===== */

/* Standard desktop (1024-1439): sidebar + single content column */
@media (min-width: 1024px) and (max-width: 1439px) {
  .page-layout {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: var(--space-8);
    max-width: 1100px;
  }
}

/* Full HD / 1440p (1440-1919): wider sidebar + content + optional right rail */
@media (min-width: 1440px) and (max-width: 1919px) {
  .page-layout {
    display: grid;
    grid-template-columns: 260px 1fr 240px;
    gap: var(--space-10);
    max-width: 1300px;
  }
  .right-rail { display: block; } /* Show related tools / ad area */
}

/* 2K QHD (1920-2559): full three-column with breathing room */
@media (min-width: 1920px) and (max-width: 2559px) {
  .page-layout {
    display: grid;
    grid-template-columns: 280px 1fr 280px;
    gap: var(--space-12);
    max-width: 1500px;
  }
}

/* Ultrawide / 4K (2560+): centered content, no forced multi-column stretch */
@media (min-width: 2560px) {
  .page-layout {
    display: block;           /* Drop grid, go back to centered single block */
    max-width: 1000px;        /* Hard cap — see §5.10.1 for details */
    margin-inline: auto;
    padding-inline: var(--space-16);
  }
  .sidebar { display: none; }       /* Hide sidebars, use other nav */
  .right-rail { display: none; }    /* Hide right rail */
  .edge-nav { display: flex; }      /* Show floating edge navigation */
}
```

**Key Layout Rules:**
1. **Calculator input fields = NEVER side-by-side on any screen** (single column always). Users enter data sequentially.
2. **Results CAN be multi-column on desktop** (metric cards side by side)
3. **Navigation collapses responsively** (bottom bar → sidebar → full sidebar)
4. **Content max-width: 1000px absolute cap** for readability on ultra-wide screens (see §5.10.1)
5. **No horizontal scrolling** — ever, on any viewport, for any reason
6. **On 4K/ultrawide: content does NOT stretch to fill screen** — whitespace is intentional and good

---

### 5.10.1 Desktop High-Resolution Display Adaptation (2K / 4K / Ultrawide)

> **The problem:** A calculator page stretched edge-to-edge on a 3840px-wide 4K monitor is unreadable — text lines become 200+ characters long, input fields span half the screen, and the result numbers look lost in empty space.
>
> **Our solution:** Content-aware max-widths with progressive enhancement at each resolution tier.

#### 5.10.1.1 Resolution Tier Behavior

| Tier | Viewport Range | Typical Hardware | Layout Behavior |
|------|---------------|------------------|-----------------|
| **Standard HD** | 1024–1439px | Old monitors, small laptops | Single column content, sidebar nav |
| **Full HD** | 1440–1919px | Most common 1080p/1440p monitors | Sidebar + content, results 2-col |
| **2K QHD** | 1920–2559px | 2560×1440 gaming/pro monitors | Wider spacing, 3-col results, ad rail appears |
| **Ultrawide** | 2560–3839px | 21:9 ultrawide monitors (3440×1440) | Centered content with generous margins, optional 2-column tool layout |
| **4K UHD** | 3840–5119px | 4K monitors (3840×2160) | Max content width locked, extra whitespace used for visual breathing room |
| **5K+** | 5120px+ | Apple Pro Display XDR (5120×2880) | Same as 4K but with larger base font size via `clamp()` |

#### 5.10.1.2 Content Width Strategy

```css
/* ===== Content container scales progressively ===== */
.tool-page {
  width: 100%;
  margin-inline: auto;
  padding-inline: var(--space-4);    /* 16px on mobile */
}

@media (min-width: 640px)  { .tool-page { padding-inline: var(--space-6); } }   /* 24px */
@media (min-width: 768px)  { .tool-page { max-width: 720px; } }                   /* Tablet: contained */
@media (min-width: 1024px) { .tool-page { max-width: 800px; padding-inline: var(--space-8); } } /* Desktop std */
@media (min-width: 1536px) { .tool-page { max-width: 860px; } }                   /* Retina laptop: slightly wider */
@media (min-width: 1920px) { .tool-page { max-width: 900px; } }                   /* FHD: comfortable reading */
@media (min-width: 2560px) { .tool-page { max-width: 960px; } }                   /* 2K: still readable line length */

/* On 4K+, STOP growing content width — use whitespace instead */
@media (min-width: 3840px) {
  .tool-page {
    max-width: 1000px;            /* Hard cap — never exceed ~80 chars per line */
    padding-inline: var(--space-16); /* Extra side margins for visual balance */
  }
  /* Body text uses fluid scaling to stay readable on huge screens */
  body { font-size: clamp(16px, 1vw + 10px, 20px); }
}
```

**Line Length Rule (non-negotiable on all screens):**
```
Body text (paragraphs, guides):  max 75 characters (~600px at 16px)
Calculator labels:               full container width (short text)
Results numbers:                 as large as context allows
Code/data tables:                horizontal scroll if needed
```

#### 5.10.1.3 Layout Modes by Resolution

**1024–1439px (Standard Desktop):**
```
┌───────────────────────────────────────┐
│ [Header]                              │
├──────────┬────────────────────────────┤
│ Sidebar  │  ┌────────────────────┐    │
│ (240px)  │  │                    │    │
│          │  │  Calculator        │    │
│ Tools    │  │  (max-w: 800px)    │    │
│          │  │                    │    │
│          │  └────────────────────┘    │
└──────────┴────────────────────────────┘
```

**1440–1919px (Full HD / 1440p):**
```
┌─────────────────────────────────────────────────┐
│ [Header]                                        │
├──────────┬──────────────────────┬───────────────┤
│ Sidebar  │  Calculator          │  (optional)   │
│ (260px)  │  (max-w: 900px)     │  Related      │
│          │                      │  Tools / Ad   │
│          │                      │  (240px)      │
└──────────┴──────────────────────┴───────────────┘
```

**1920–2559px (2K QHD):**
```
┌──────────────────────────────────────────────────────────────┐
│ [Header]                                                     │
├──────────┬───────────────────────────┬──────────────────────┤
│ Sidebar  │  Calculator               │  Right Rail           │
│ (280px)  │  (max-w: 960px)          │                       │
│          │                           │  • Related tools grid │
│          │  Results: [card][card]    │  • FAQ preview         │
│          │  [card]                   │  • Ad unit             │
│          │                           │  • Trust signals       │
└──────────┴───────────────────────────┴──────────────────────┘
```

**2560–3839px (Ultrawide / 2K+):**
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Header - centered, max-width 1400px]                                        │
│                                                                              │
│  [large whitespace]  ┌─────────────────────────┐  [large whitespace]        │
│                     │                         │                            │
│                     │  Calculator             │                            │
│                     │  (max-w: 960px)         │                            │
│                     │  centered on screen     │                            │
│                     │                         │                            │
│                     └─────────────────────────┘                            │
│                                                                              │
│  Optional: floating quick-nav pills on far left/right edges                  │
│  ("Sod Calc" "Area" "Grass" "Fert" — always accessible)                     │
└──────────────────────────────────────────────────────────────────────────────┘
```

**3840px+ (4K UHD):**
```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│  [═══  very large margin  ═══]  ┌───────────────────────┐  [═══ large margin ═══]    │
│                               │                       │                             │
│                               │  Calculator           │                             │
│                               │  (max-w: 1000px CAP)  │                             │
│                               │                       │                             │
│                               │  Base font: ~18-20px  │  ← Fluid scaled up          │
│                               │  Input height: 56px   │  ← Larger touch/mouse target│
│                               │  Result numbers: 48px │  ← Prominent & readable     │
│                               │                       │                             │
│                               └───────────────────────┘                             │
│                                                                                  │
│  Background: subtle gradient or pattern to avoid "floating in void" feeling     │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

#### 5.10.1.4 HiDPI / Retina Display Handling

| Display Type | Device Pixel Ratio | CSS px → Physical px | Our Handling |
|--------------|-------------------|---------------------|-------------|
| Standard | 1x | 1:1 | Default rendering |
| Retina (MacBook/iPhone) | 2x | 1 CSS px = 2 physical px | SVG icons render crisp; borders stay 1CSSpx (=2physicalpx sharp) |
| Retina 3x (iPhone Pro Max) | 3x | 1 CSS px = 3 physical px | Same as 2x — vector assets only |
| Some Android 4K screens | 1.25x-1.5x | Fractional | `round()` subpixel positioning via browser |

**Rules for crisp rendering on all DPI levels:**

```css
/* 1. Use relative units for everything possible */
.calculator-input {
  border-width: 1px;              /* Browser rounds to device pixel correctly */
  border-radius: 8px;             /* Smooth on all DPR */
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);  /* GPU-composited, always smooth */
}

/* 2. Icons = SVG inline or background-image SVG (never PNG/JPG) */
.icon-sod::before {
  content: '';
  display: inline-block;
  width: 1.25em;
  height: 1.25em;
  background-image: url("data:image/svg+xml,...");  /* Inline SVG data URI */
  background-size: contain;
  background-repeat: no-repeat;
}

/* 3. No bitmap images on tool pages — zero risk of blur */
/* If images added later (blog etc.): */
img {
  image-rendering: auto;          /* Default: browser chooses best */
  /* For < 2x screens: */          /* image-rendering: -webkit-optimize-contrast; */
  /* For >= 2x screens provide 2x srcset */
}

/* 4. Border technique for hairline-sharp lines on HiDPI */
.hairline-border {
  border: 0.5px solid #e2e8f0;    /* Subpixel border, renders 1 physical px on 2x */
  /* Fallback for browsers that don't support 0.5px: */
  @supports not (border: 0.5px solid black) {
    border: 1px solid #e2e8f0;
  }
}
```

**Font rendering on high-DPI:**
```css
body {
  -webkit-font-smoothing: antialiased;   /* macOS/iOS: smooth font rendering */
  -moz-osx-font-smoothing: grayscale;    /* Firefox on Mac */
  text-rendering: optimizeLegibility;     /* Better kerning/ligatures */
}
/* On 4K+ where fonts render larger, this makes a visible difference */
```

#### 5.10.1.5 Ultrawide Monitor (21:9 / 32:9) Special Handling

**Problem:** On 3440×1440 ultrawide, a standard centered layout leaves ~1200px of dead space on each side.

**Solution options (prioritized):**

1. **Floating edge navigation (recommended):**
   - Small pill-shaped quick-links fixed to left and right screen edges
   - Shows tool names vertically or as icons
   - Always visible, doesn't compete with main content
   - Disappears on smaller screens (only shows ≥2560px wide)

2. **Split-panel mode (optional enhancement):**
   - Left panel: calculator inputs
   - Right panel: results + related tools + guide content
   - Only activates when viewport ≥2560px AND user is on a calculator page
   - Controlled by CSS only (no JS toggle needed)

3. **Background treatment:**
   - Plain white looks stark on ultrawide
   - Add subtle off-white gradient: `background: linear-gradient(to right, #f8fafc, #ffffff 30%, #ffffff 70%, #f8fafc)`
   - Or extremely faint pattern/texture that gives visual grounding without distraction

**Ultrawide detection (CSS-only):**
```css
/* Aspect ratio based detection for ultrawide */
@media (min-aspect-ratio: 21/9) and (min-width: 2560px) {
  body {
    background: linear-gradient(
      to right,
      var(--color-bg) 0%,
      #ffffff 20%,
      #ffffff 80%,
      var(--color-bg) 100%
    );
  }
  .quick-nav-edge {
    display: flex;  /* Show edge navigation pills */
  }
}
```

#### 5.10.1.6 Multi-Monitor Edge Cases

| Scenario | Issue | Solution |
|----------|-------|----------|
| Window dragged between 1080p→4K monitors | Layout may jump abruptly at breakpoint boundary | Use `clamp()` for fluid transitions where possible; avoid hard layout shifts at breakpoints |
| Browser window not maximized on 4K | User may have small window on big screen | All layouts must work at ANY width from 320px up — responsive down, not just up |
| Split-screen (half 4K = 1920px each) | Effectively a FHD view | Handled naturally by our 1920px breakpoint |
| Zoomed-in browser (Ctrl/Cmd +) on any resolution | Emulates lower effective resolution | Test at 110%, 125%, 150% zoom levels — nothing should break |
| Windows display scaling (125%, 150%, 175%) | Changes reported CSS resolution | Test on Windows at each common scale factor; our flexible max-widths handle this natively |

**Required zoom/scale testing matrix:**

| Resolution | 100% | 125% | 150% | 175% |
|-----------|------|------|------|------|
| 1920×1080 (FHD) | ✅ Required | ✅ Required (common Win default) | ✅ Test | ✅ Spot check |
| 2560×1440 (2K) | ✅ Required | ✅ Test | ✅ Test | ✅ Spot check |
| 3840×2160 (4K) | ✅ Required | ✅ Required (Win default) | ✅ Test | ✅ Spot check |
| 1366×768 (laptop) | ✅ Required | ✅ Test (Win tablets often 150%) | N/A | N/A |

#### 5.10.1.7 Cross-Browser Desktop-Specific Issues

| Browser | Known Desktop Issue | Fix/Workaround |
|---------|---------------------|----------------|
| **Safari Desktop** | `position: sticky` on sidebar can be buggy inside `display: flex` containers | Use wrapper div approach; test sticky sidebar specifically |
| **Safari Desktop** | `input type="number"` shows spinner arrows that look different than Chrome | Hide spinners with CSS or accept minor visual difference |
| **Firefox Desktop** | Print styles may not hide elements identically to Chrome | Test print preview in both browsers |
| **Edge (Chromium)** | Generally same as Chrome, but PDF viewer handles print differently | Verify print stylesheet works in Edge's "Print to PDF" |
| **Chrome + Chinese IME** | Composition input (typing CJK) can cause layout shift during composition | Ensure input fields have fixed height (no auto-expand) |
| **Any browser + Windows High Contrast Mode** | May override our colors entirely | Test with Windows HCM on; ensure structure remains usable without color |

**Windows High Contrast Mode compatibility:**
```css
@media (forced-colors: active) {
  /* Windows High Contrast Mode — respect user's system colors */
  .calculator-input,
  .result-card,
  button {
    border: 1px solid currentColor;  /* Forced visible borders */
    background: Canvas;              /* System background */
    color: ButtonText;               /* System text color */
  }
  .slider-thumb {
    forced-color-adjust: none;       /* Let system handle slider appearance */
  }
  /* All functionality preserved, just using system colors */
}
```

---

### 5.11 Form Validation & Error States (Cross-Device)

**Validation timing:**
- On blur (when user leaves field) — show inline error
- On change (sliders, selects) — live update, no error delay
- On submit (if form has action button) — validate all fields

**Error display:**
```
Mobile:
┌──────────────────────────────┐
│ Length                       │
│ [________]  ft               │
│ ⚠️ Please enter a number     │  ← Red text below field
│    greater than 0             │     (always visible, no tooltip)
└──────────────────────────────┘

Desktop (additionally):
┌──────────────────────────────┐
│ Length          ft           │
│ [✗ __________]              │  ← Red border + icon inside input
│ ⚠️ Please enter a number     │
│    greater than 0             │
└──────────────────────────────┘
```

**Error messages must be:**
- Specific (not just "Invalid input")
- Constructive (tell user what to do)
- Brief (one line when possible)
- Visible without scrolling
- Announced to screen readers (`aria-live="polite"`)

---

### 5.11 Loading & Empty States

**Loading State:**
- Since we're static JS, "loading" only applies to:
  - Initial page render (show skeleton or just render quickly)
  - External font loading (system fonts shown instantly, swap when web font loads — `font-display: swap`)
- **No spinners for calculations** — results are instant (client-side math)

**Empty State (before user enters data):**
```
┌──────────────────────────────┐
│  📐 Enter your dimensions    │  ← Placeholder illustration/icon
│  above to see results        │
│                              │
│  Example: 50 ft × 30 ft      │  ← Tappable example that fills fields
└──────────────────────────────┘
```

**Zero/Edge Case Results:**
- Area = 0: "Enter dimensions greater than zero"
- Very large area (>100,000 sq ft): "Large area detected — consider professional installation quote"
- Negative numbers: rejected at input level (prevent entirely)

---

### 5.12 Print Stylesheet

```css
@media print {
  /* Hide: nav, ads, footer, unrelated tools, CTAs */
  nav, .bottom-nav, .ad-unit, footer,
  .related-tools, .share-buttons { display: none !important; }

  /* Show: calculator inputs + results */
  .calculator-inputs, .results-panel {
    display: block !important;
    break-inside: avoid;
  }

  /* Ensure readable on paper */
  body { font-size: 12pt; color: black; background: white; }
  a { text-decoration: underline; }
  .result-number { font-size: 24pt; font-weight: bold; }

  /* Show URLs after links */
  a[href]::after { content: " (" attr(href) ")"; font-size: 10pt; }
}
```

**Use case:** User wants to print results and take to garden center.

---

### 5.13 Trust Signals (Placement Varies by Screen)

**Mobile:**
- Compact banner below H1: "✅ Free · 🔒 No signup · 📊 Industry-standard formulas"
- Full disclaimer at very bottom of page

**Desktop:**
- Same banner, plus trust badges in sidebar or top-right corner
- "Data sources" section more prominent (sidebar widget)

---

### 5.14 Performance Budget (Per Page)

| Metric | Budget | Rationale |
|--------|--------|-----------|
| Total HTML | <15KB | Semantic, minimal markup |
| Critical CSS | <20KB | Inline in `<head>` for fast first paint |
| Non-critical CSS | <15KB | Loaded async, deferred |
| JavaScript (per tool) | <30KB | Vanilla JS, no framework |
| Total transfer | <150KB | Fast on 3G (<2s on 4G) |
| DOM nodes | <500 | Keep it lean |
| Web Fonts | 0KB (optional) | System font stack primary; web font enhancement only |
| Images | 0 (tool pages) | SVG icons only, CSS-drawn illustrations |
| Third-party scripts | 0 (until AdSense) | No analytics until phase 3 |

**Performance testing required on:**
- Chrome DevTools Lighthouse (Mobile simulation) — target 95+
- WebPageTest — real device emulation
- Actual physical iPhone SE (slowest target device)
- Chrome on Android with network throttling (Fast 3G)

---

## 6. Monetization Strategy

### 6.1 Phase Approach: Traffic First, Ads Later

**Principle: Build traffic and trust first, monetize later.**

Launching with ads on a new site with zero traffic earns nothing and hurts user experience. Instead:
1. **Month 1-6**: Zero ads. Focus 100% on content quality, SEO, and user experience.
2. **Month 6+**: Apply for AdSense once traffic thresholds are met.
3. **Ongoing**: Gradually optimize ad placements based on revenue data.

### 6.2 Google AdSense (Primary Revenue — Activated After Traffic Threshold)

**AdSense Prerequisites:**
- Site must be operational for several months
- Sufficient original content (calculators + educational content + FAQ)
- Consistent traffic (Google doesn't publish exact threshold, but 500+ daily sessions is a reasonable target)
- Complete legal pages (Privacy Policy, About, Contact)
- No policy violations

**Ad Placements (when activated — non-intrusive):**
1. **Banner above footer** (on all pages) — 728x90 leaderboard
2. **In-content after educational section** (on tool pages) — responsive
3. **Sidebar on desktop** (homepage only) — 300x250 rectangle
4. **Between FAQ items** (optional, sparingly)

**Rules:**
- NO ads above the fold near calculator inputs
- NO ads that interfere with calculation
- Maximum 3 ad units per page
- Clearly labeled as "Advertisement"
- Ads disabled for users who choose "Essential Only" cookies

**Revenue Projections (Conservative, post-AdSense activation):**

| Metric | Year 1 (ads active ~6 months) | Year 2 | Year 3 |
|--------|-------------------------------|--------|--------|
| Monthly Sessions | 5,000 | 20,000 | 60,000 |
| Pageviews/Session | 2.5 | 3.0 | 3.5 |
| Monthly Pageviews | 12,500 | 60,000 | 210,000 |
| RPM (lawn niche) | $1.50 | $2.00 | $3.00 |
| Monthly Revenue | $19 | $120 | $630 |
| Annual Revenue | $114 | $1,440 | $7,560 |

*Note: With 14 languages, multiply these figures by ~2-3x once all languages rank.*

### 6.3 Alternative/Additional Income (Future — After AdSense Established)
- Affiliate links to Home Depot/Lowes (sod, seed, tools) — optional, requires disclosure
- Sponsored content from lawn care brands — unlikely at small scale
- Amazon Associates (lawn care books, tools) — low effort, low revenue

---

## 7. Content & SEO Strategy

### Keyword Mapping

| Page | Primary Keyword | Monthly Search Vol (est.) | Difficulty |
|------|----------------|--------------------------|------------|
| /sod-calculator | sod calculator | 6,600 | Medium-High |
| /sod-calculator | how much sod do i need | 2,400 | Low |
| /lawn-area-calculator | lawn area calculator | 1,900 | Low-Medium |
| /grass-type-guide | best grass type for my lawn | 1,200 | Medium |
| /fertilizer-calculator | lawn fertilizer calculator | 800 | Low |
| /grass-seed-calculator | grass seed calculator | 1,200 | Low |
| /lawn-water-calculator | lawn water calculator | 600 | Low |
| /soil-calculator | topsoil calculator | 3,100 | Medium |
| /area-converter | sq ft to sq m | 9,000 | Low |
| /area-converter | acres to square feet | 5,400 | Low |
| /lawn-care-calendar | lawn care schedule | 1,600 | Medium |

### Content Marketing (Phase 2, post-launch)
- "How to Lay Sod: Complete Beginner's Guide"
- "10 Mistakes When Buying Sod"
- "Sod vs Seed: Which is Better for Your Lawn?"
- "When is the Best Time to Plant Sod?"
- Each article = additional SEO entry point + internal links

### Link Building Strategy
- Submit to calculator directories
- Guest posts on gardening/DIY blogs
- HARO (Help A Reporter Out) responses for home/garden topics
- Create shareable infographics (e.g., "Grass Type Comparison Chart")

---

## 8. Roadmap

### Phase 1: Full Development (Week 1-4)
- [ ] All 9 tools developed (sod calculator, area calculator, grass seed calculator, grass guide, fertilizer calculator, lawn water calculator, soil calculator, area converter, lawn care calendar)
- [ ] Multi-language support for all 14 languages (AI-generated translations)
- [ ] Full responsive design (mobile → 4K desktop)
- [ ] Legal pages (Privacy Policy, Terms, Disclaimer, Cookie Policy, About)
- [ ] Cookie consent banner
- [ ] SEO foundation (meta tags, schema markup, hreflang, sitemap)
- [ ] Build system (Node.js template + i18n → static HTML)
- [ ] Deploy to Cloudflare Pages
- [ ] Domain purchase and setup (after development complete)

### Phase 2: Launch & Index (Month 1-2)
- [ ] Submit sitemap to Google Search Console
- [ ] Submit to Bing Webmaster Tools
- [ ] Google Analytics 4 setup
- [ ] Monitor indexing progress
- [ ] Fix any crawl errors
- [ ] Verify all language versions indexed correctly
- [ ] Performance audit (Lighthouse 95+ target)

### Phase 3: Growth (Month 3-6)
- [ ] Monitor rankings in GSC across all languages
- [ ] Publish 5-10 blog articles (English first, then translate)
- [ ] Build backlinks (calculator directories, gardening forums)
- [ ] Optimize pages with highest bounce rate
- [ ] A/B test calculator UX improvements
- [ ] User feedback collection (simple feedback button)

### Phase 4: Monetization (Month 6-9)
- [ ] Verify traffic thresholds met for AdSense
- [ ] Apply for Google AdSense
- [ ] Implement ad placements (per §6 guidelines)
- [ ] Enable analytics tracking for ad optimization
- [ ] Monitor ad revenue and optimize placements

### Phase 5: Scale (Month 9-12+)
- [ ] Expand content library (more blog articles)
- [ ] Optimize highest-earning pages and languages
- [ ] Explore affiliate partnerships (Home Depot, Lowes, etc.)
- [ ] Consider additional tools based on user demand
- [ ] Review and refresh translations if needed

---

## 9. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Can't rank for main keywords | Medium | High | Focus on long-tail keywords first; build content depth |
| Seasonal traffic drops (winter) | High | Medium | Evergreen content; indoor lawn care topics; southern hemisphere |
| AdSense rejection | Low | High | Follow policies strictly; quality content; wait for traffic threshold |
| Competitor copies our features | Medium | Low | First-mover advantage in niche; continuous improvement |
| Algorithm update hurts rankings | Medium | High | Diversify traffic sources; don't rely on single page |
| Data accuracy complaints | Low | Medium | Cite sources; show ranges not exact values; disclaimers |

---

## 10. Success Metrics

### Technical KPIs
- [ ] Lighthouse score >95 on all pages
- [ ] Page load <1.5s on 3G mobile
- [ ] Zero console errors
- [ ] Valid HTML/CSS
- [ ] All pages indexed by Google within 30 days

### Business KPIs (6-month targets)
- [ ] 5,000+ monthly sessions
- [ ] 10+ keywords on page 1-3
- [ ] AdSense account approved
- [ ] >$50 total revenue (proof of concept)

### Business KPIs (12-month targets)
- [ ] 20,000+ monthly sessions
- [ ] 50+ keywords ranking
- [ ] >$100/month revenue consistency

---

## 11. Multi-Language (i18n) Strategy

> **Why multi-language?** English is our primary market and revenue driver. However, English accounts for only ~25% of global internet users, and English SEO competition is fierce. Additional languages serve as **low-competition traffic expansion** — each language opens a new SEO market where calculator tools rarely exist in local languages. The math is universal; only labels and content need translation.

---

### 11.1 Language Priority & Market Analysis

| Phase | Language | Code | Internet Users (M) | Key Markets | AdSense CPC | Competition | Rationale |
|-------|----------|------|---------------------|-------------|-------------|-------------|-----------|
| **1 (Launch)** | English | `en` | 1,500+ | US, UK, CA, AU, NZ | $1-5 | High | Primary market, highest revenue per visitor |
| **2** | Spanish | `es` | 500+ | US Hispanics, Mexico, Spain, Colombia, Argentina | $0.30-1.50 | Low-Med | 2nd most native speakers globally; US Hispanic market = high CPC |
| **2** | French | `fr` | 300+ | France, Canada (Quebec), Belgium, Switzerland | $0.50-2.00 | Low-Med | High CPC in France/Canada; Quebec = unique lawn market |
| **3** | German | `de` | 200+ | Germany, Austria, Switzerland | $0.80-3.00 | Medium | Highest CPC in EU; Germans love gardening (highest per-capita spend) |
| **3** | Portuguese | `pt` | 290+ | Brazil, Portugal | $0.15-0.80 | Low | Huge Brazilian market; lower CPC but massive volume potential |
| **3** | Italian | `it` | 130+ | Italy, Switzerland | $0.40-1.50 | Low-Med | Mediterranean climate = different grass types = unique SEO keywords |
| **3** | Dutch | `nl` | 30+ | Netherlands, Belgium | $0.60-2.50 | Low | Small but wealthy market; very high CPC; Dutch love their lawns |
| **4** | Swedish | `sv` | 15+ | Sweden | $0.80-3.00 | Very Low | Tiny but extremely high CPC; Nordic gardening culture |
| **4** | Polish | `pl` | 40+ | Poland | $0.20-0.80 | Very Low | Large Eastern European market; growing gardening sector |
| **4** | Turkish | `tr` | 80+ | Turkey | $0.10-0.50 | Very Low | Large population; Mediterranean climate = different grass types |
| **4** | Arabic | `ar` | 250+ | Saudi Arabia, UAE, Egypt | $0.15-1.00 | Very Low | **RTL language** — requires special layout; Gulf states = high CPC |
| **5** | Japanese | `ja` | 120+ | Japan | $0.50-3.00 | Medium | High CPC; unique turf culture (golf courses, zen gardens) |
| **5** | Korean | `ko` | 50+ | South Korea | $0.30-2.00 | Low | High CPC; strong gardening trend |
| **5** | Chinese (Simplified) | `zh` | 1,000+ | China, Singapore | $0.05-0.30 | High | Massive volume but low CPC; Great Firewall considerations |

**Revenue multiplier estimate:**
- English only: 1x baseline
- +Spanish +French: ~1.8x (these two add the most incremental revenue)
- +German +Portuguese +Italian +Dutch: ~2.5x
- +All 14 languages: ~3.5x

---

### 11.2 Technical Implementation — Static i18n Architecture

**Core Principle: One HTML file per language per page. No client-side translation switching.**

Why? Because Google needs to crawl each language version as a separate URL with fully rendered content. Client-side JS translation (like `i18next`) hides content from crawlers and kills SEO.

```
File Structure:
turf-calculator/
├── en/                              ← English (source of truth)
│   ├── index.html
│   ├── sod-calculator.html
│   ├── lawn-area-calculator.html
│   ├── grass-type-guide.html
│   ├── fertilizer-calculator.html
│   ├── soil-calculator.html
│   ├── area-converter.html
│   ├── lawn-care-calendar.html
│   └── about.html
│
├── es/                              ← Spanish
│   ├── index.html
│   ├── calculadora-de-cesped.html
│   ├── calculadora-de-area.html
│   ├── guia-de-tipos-de-cesped.html
│   ├── calculadora-de-fertilizante.html
│   ├── calculadora-de-tierra.html
│   ├── convertidor-de-area.html
│   ├── calendario-de-cuidado.html
│   └── acerca-de.html
│
├── fr/                              ← French
│   └── ... (same pattern)
│
├── js/                              ← Shared JS (language-agnostic logic)
│   ├── app.js                       ← Language detection, switcher, shared utils
│   ├── sod-calculator.js            ← Pure math, no text
│   ├── area-calculator.js
│   ├── grass-guide.js               ← Data-driven, locale-aware
│   ├── fertilizer-calculator.js
│   ├── soil-calculator.js
│   ├── area-converter.js
│   └── lawn-calendar.js
│
├── css/
│   └── styles.css                   ← Shared styles
│
├── i18n/                            ← Translation files (JSON)
│   ├── en.json                      ← Source of truth for English
│   ├── es.json
│   ├── fr.json
│   ├── de.json
│   └── ...
│
├── sitemap.xml                      ← Combined sitemap with all languages
├── robots.txt
└── _redirects                        ← Cloudflare redirects for root → /en/
```

**Build Process (simple Node.js script):**

```
1. Read /i18n/en.json (source of truth)
2. Read /i18n/es.json (Spanish translations)
3. For each page template:
   a. Generate /en/page-slug.html with English text
   b. Generate /es/calculadora-de-cesped.html with Spanish text
   c. ... repeat for each language
4. Inject hreflang tags into each generated page
5. Generate combined sitemap.xml with all language URLs
6. Output to /dist/ folder
7. Cloudflare Pages deploys from /dist/
```

This is a **build-time translation** approach — the output is pure static HTML, zero client-side translation overhead.

---

### 11.3 Translation File Structure

```json
// i18n/en.json
{
  "site": {
    "title": "TurfCalculator",
    "description": "Free lawn and turf calculators for homeowners"
  },
  "nav": {
    "home": "Home",
    "sod_calculator": "Sod Calculator",
    "area_calculator": "Lawn Area Calculator",
    "grass_guide": "Grass Type Guide",
    "fertilizer_calculator": "Fertilizer Calculator",
    "grass_seed_calculator": "Grass Seed Calculator",
    "lawn_water_calculator": "Lawn Water Calculator",
    "soil_calculator": "Soil Calculator",
    "area_converter": "Area Converter",
    "lawn_calendar": "Lawn Care Calendar",
    "about": "About",
    "language": "Language"
  },
  "sod_calculator": {
    "h1": "Sod Calculator",
    "meta_title": "Free Sod Calculator - How Much Sod Do I Need?",
    "meta_description": "Calculate exactly how many rolls and pallets of sod you need. Free sod calculator with waste factor support. No signup required.",
    "area_label": "Lawn Area",
    "area_placeholder": "Enter area",
    "shape_label": "Lawn Shape",
    "shape_rectangle": "Rectangle",
    "shape_circle": "Circle",
    "shape_triangle": "Triangle",
    "shape_l_shape": "L-Shape",
    "length_label": "Length",
    "width_label": "Width",
    "diameter_label": "Diameter",
    "unit_ft": "ft",
    "unit_m": "m",
    "unit_sqft": "sq ft",
    "unit_sqm": "sq m",
    "waste_factor_label": "Waste Factor",
    "waste_simple": "Simple (5%)",
    "waste_normal": "Normal (10%)",
    "waste_complex": "Complex (15%)",
    "waste_very_complex": "Very Complex (20%)",
    "roll_size_label": "Sod Roll Size",
    "roll_standard": "Standard (24\"×60\" = 10 sq ft)",
    "roll_mini": "Mini (18\"×24\" = 3 sq ft)",
    "roll_large": "Large (24\"×81\" = 13.5 sq ft)",
    "roll_custom": "Custom Size",
    "results_title": "Results",
    "rolls_needed": "Rolls Needed",
    "pallets_needed": "Pallets Needed",
    "estimated_cost": "Estimated Cost",
    "tip_extra": "Tip: Buy 1 extra roll for future patching repairs",
    "faq": [
      {
        "q": "How many square feet in a pallet of sod?",
        "a": "A standard pallet covers 500-600 square feet, containing 50-60 rolls of 10 sq ft each."
      },
      {
        "q": "Should I buy extra sod?",
        "a": "Yes, always add 5-15% extra for waste from cutting around curves, trees, and borders."
      }
    ]
  },
  "grass_seed_calculator": {
    "h1": "Grass Seed Calculator",
    "meta_title": "Grass Seed Calculator - How Much Seed Do I Need?",
    "meta_description": "Calculate how much grass seed you need for your lawn. Free seed calculator with rates for all grass types. No signup required.",
    "area_label": "Lawn Area",
    "grass_type_label": "Grass Type",
    "results_seed_needed": "Seed Needed",
    "results_bags": "Bags Needed"
  },
  "lawn_water_calculator": {
    "h1": "Lawn Water Calculator",
    "meta_title": "Lawn Water Calculator - How Much Water Does My Lawn Need?",
    "meta_description": "Calculate how much water your lawn needs per week. Free watering calculator based on grass type and area. No signup required.",
    "area_label": "Lawn Area",
    "grass_type_label": "Grass Type",
    "results_weekly_water": "Weekly Water Need",
    "results_minutes_per_session": "Minutes Per Session"
  }
}
```

```json
// i18n/es.json
{
  "site": {
    "title": "TurfCalculator",
    "description": "Calculadoras gratuitas de césped y turba para propietarios"
  },
  "nav": {
    "home": "Inicio",
    "sod_calculator": "Calculadora de Césped",
    "area_calculator": "Calculadora de Área",
    "grass_guide": "Guía de Tipos de Césped",
    "fertilizer_calculator": "Calculadora de Fertilizante",
    "grass_seed_calculator": "Calculadora de Semilla",
    "lawn_water_calculator": "Calculadora de Riego",
    "soil_calculator": "Calculadora de Tierra",
    "area_converter": "Convertidor de Área",
    "lawn_calendar": "Calendario de Cuidado",
    "about": "Acerca de",
    "language": "Idioma"
  },
  "sod_calculator": {
    "h1": "Calculadora de Césped",
    "meta_title": "Calculadora de Césped Gratis - ¿Cuánto Césped Necesito?",
    "meta_description": "Calcule exactamente cuántos rollos y paletas de césped necesita. Calculadora gratuita con factor de desperdicio. Sin registro.",
    "area_label": "Área del Césped",
    "shape_rectangle": "Rectángulo",
    "shape_circle": "Círculo",
    "shape_triangle": "Triángulo",
    "shape_l_shape": "Forma de L",
    "length_label": "Largo",
    "width_label": "Ancho",
    "diameter_label": "Diámetro",
    "unit_ft": "pies",
    "unit_m": "m",
    "unit_sqft": "pies²",
    "unit_sqm": "m²",
    "waste_factor_label": "Factor de Desperdicio",
    "waste_simple": "Simple (5%)",
    "waste_normal": "Normal (10%)",
    "waste_complex": "Complejo (15%)",
    "waste_very_complex": "Muy Complejo (20%)",
    "results_title": "Resultados",
    "rolls_needed": "Rollos Necesarios",
    "pallets_needed": "Paletas Necesarias",
    "estimated_cost": "Costo Estimado",
    "faq": [
      {
        "q": "¿Cuántos pies cuadrados tiene una paleta de césped?",
        "a": "Una paleta estándar cubre 500-600 pies cuadrados, conteniendo 50-60 rollos de 10 pies² cada uno."
      }
    ]
  }
}
```

---

### 11.4 Locale-Aware Calculator Behavior

Calculators don't just translate text — they must adapt to local conventions:

| Feature | English (US) | Spanish | French | German | Portuguese | Arabic |
|---------|-------------|---------|--------|--------|------------|--------|
| **Number format** | 1,500.00 | 1.500,00 | 1 500,00 | 1.500,00 | 1.500,00 | ١٬٥٠٠٫٠٠ |
| **Decimal separator** | `.` (period) | `,` (comma) | `,` (comma) | `,` (comma) | `,` (comma) | `٫` (Arabic) |
| **Thousands separator** | `,` (comma) | `.` (period) | ` ` (space) | `.` (period) | `.` (period) | `٬` (Arabic) |
| **Currency** | USD ($) | USD/EUR | EUR (€) | EUR (€) | BRL (R$) | SAR (﷼) |
| **Default area unit** | sq ft | m² (Latin America) / sq ft (US Hispanic) | m² | m² | m² | m² |
| **Temperature** | °F | °C | °C | °C | °C | °C |
| **Grass types** | US-centric | Warm-season focus | Different species | Cool-season focus | Tropical species | Desert/tropical |
| **Text direction** | LTR | LTR | LTR | LTR | LTR | **RTL** |
| **Date format** | MM/DD/YYYY | DD/MM/YYYY | DD/MM/YYYY | DD.MM.YYYY | DD/MM/YYYY | DD/MM/YYYY |

**Implementation:**

```javascript
// js/app.js — locale configuration
const LOCALES = {
  en: {
    code: 'en',
    dir: 'ltr',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    currency: 'USD',
    currencySymbol: '$',
    defaultAreaUnit: 'sqft',
    temperatureUnit: 'F',
    numberFormat: new Intl.NumberFormat('en-US'),
    currencyFormat: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
  },
  es: {
    code: 'es',
    dir: 'ltr',
    decimalSeparator: ',',
    thousandsSeparator: '.',
    currency: 'EUR',
    currencySymbol: '€',
    defaultAreaUnit: 'sqm',
    temperatureUnit: 'C',
    numberFormat: new Intl.NumberFormat('es-ES'),
    currencyFormat: new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })
  },
  ar: {
    code: 'ar',
    dir: 'rtl',
    decimalSeparator: '٫',
    thousandsSeparator: '٬',
    currency: 'SAR',
    currencySymbol: '﷼',
    defaultAreaUnit: 'sqm',
    temperatureUnit: 'C',
    numberFormat: new Intl.NumberFormat('ar-SA'),
    currencyFormat: new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' })
  }
  // ... other locales
};
```

---

### 11.5 RTL (Right-to-Left) Language Support — Arabic

**CSS for RTL:**

```css
/* Base: LTR (default) */
body { direction: ltr; text-align: left; }

/* RTL override */
html[dir="rtl"] body { direction: rtl; text-align: right; }

/* Flip layout elements */
html[dir="rtl"] .sidebar { order: 1; }    /* Sidebar moves to right */
html[dir="rtl"] .content { order: 0; }    /* Content moves to left */
html[dir="rtl"] .icon-arrow-right { transform: scaleX(-1); }  /* Arrows flip */

/* Use logical properties throughout (future-proof) */
.field-group {
  margin-inline-start: 0;     /* NOT margin-left */
  padding-inline-end: 1rem;   /* NOT padding-right */
  border-inline-start: 3px solid green;  /* NOT border-left */
}

/* Flexbox auto-handles RTL */
.nav-items { display: flex; }
html[dir="rtl"] .nav-items { flex-direction: row-reverse; }
```

**HTML for RTL pages:**
```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ...
</head>
```

**RTL-specific testing:**
- All calculator inputs must work with RTL text direction
- Number input fields: numbers always render LTR within RTL context (Arabic numerals or Western numerals)
- Navigation sidebar flips to right side
- Icons with directional meaning (arrows, chevrons) must be mirrored
- Tables: first column stays on the right in RTL

---

### 11.6 SEO for Multi-Language — hreflang Implementation

**Every page must include hreflang tags for ALL language versions:**

```html
<!-- On /en/sod-calculator.html -->
<link rel="alternate" hreflang="en" href="https://domain.com/en/sod-calculator">
<link rel="alternate" hreflang="es" href="https://domain.com/es/calculadora-de-cesped">
<link rel="alternate" hreflang="fr" href="https://domain.com/fr/calculateur-de-gazon">
<link rel="alternate" hreflang="de" href="https://domain.com/de/rasenrechner">
<link rel="alternate" hreflang="pt" href="https://domain.com/pt/calculadora-de-grama">
<link rel="alternate" hreflang="x-default" href="https://domain.com/en/sod-calculator">
```

**`x-default`** points to English as the fallback for unsupported languages.

**Sitemap structure (combined, all languages):**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://domain.com/en/sod-calculator</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://domain.com/en/sod-calculator"/>
    <xhtml:link rel="alternate" hreflang="es" href="https://domain.com/es/calculadora-de-cesped"/>
    <xhtml:link rel="alternate" hreflang="fr" href="https://domain.com/fr/calculateur-de-gazon"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://domain.com/en/sod-calculator"/>
    <lastmod>2026-05-29</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- ... repeat for each page × each language -->
</urlset>
```

---

### 11.7 Localization Beyond Translation — Regional Adaptation

**Critical: A Spanish calculator for Mexico ≠ a Spanish calculator for Spain**

| Aspect | US English | Latin America Spanish | European Spanish | German |
|--------|-----------|----------------------|------------------|--------|
| Default area unit | sq ft | m² | m² | m² |
| Grass types available | Bermuda, Zoysia, KBG, etc. | Bermuda, San Agustín, Zoysia | Different species entirely | Rasenschmiele, Deutsches Weidelgras |
| Sod roll sizes | 24"×60" (10 sq ft) | Different sizes by country | Roll sizes differ | Different standard sizes |
| Price ranges | $0.30-0.80/sq ft | Different pricing | €/m² pricing | €/m² pricing |
| Lawn care calendar | USDA zones | Different climate zones | Mediterranean/Atlantic | Continental |
| Fertilizer brands | Scotts, Pennington | Different brands | Different brands | Different brands |
| Measurement terms | "Roll", "Pallet" | "Rollo", "Tarima" | "Rollo", "Paleta" | "Rolle", "Palette" |

**Implementation approach:**
- Each language has its own grass type database (`grass-guide.js` reads locale-specific data)
- Calculator defaults change based on locale (m² vs sq ft, € vs $)
- Lawn care calendar uses region-appropriate climate zones (not just USDA)
- FAQ answers reference locally relevant products and practices

---

### 11.8 Translation Workflow

**All translations are AI-generated at build time. No professional translators needed.**

**Process:**
1. English content written as source of truth in `i18n/en.json`
2. AI (Claude/GPT) generates all other language JSON files from English source
3. Build script validates all translations are complete (no missing keys)
4. Native speaker review is optional but recommended for high-priority languages (Spanish, French, German)
5. Any translation issues found by users can be reported via a simple feedback button

**AI Translation Quality Guidelines:**
- SEO meta tags (title, description) must be optimized for local search terms, not just literal translation
- Calculator labels must use locally standard terminology (e.g., "Rollos" not "Tubos" for sod rolls in Spanish)
- FAQ answers should sound natural in the target language
- Technical terms (grass species names, measurement units) must be regionally accurate
- Number formatting must match locale conventions (see §11.4)

**Ongoing maintenance:**
- When English content updates, re-run AI translation for affected keys
- Build script warns about missing translations (falls back to English)
- User feedback button on each page: "Found a translation error? Let us know"
- Translation files include `last_updated` timestamps per key for tracking

---

### 11.9 Multi-Language Roadmap Integration

**All 14 languages launch simultaneously with Phase 1 (per §8 Roadmap).**

| Language | Code | Launch | Key Market |
|----------|------|--------|------------|
| English | `en` | Phase 1 (Day 1) | US, UK, CA, AU, NZ — **Primary market** |
| Spanish | `es` | Phase 1 (Day 1) | US Hispanics, Mexico, Spain, Colombia |
| French | `fr` | Phase 1 (Day 1) | France, Canada (Quebec), Belgium |
| German | `de` | Phase 1 (Day 1) | Germany, Austria, Switzerland |
| Portuguese | `pt` | Phase 1 (Day 1) | Brazil, Portugal |
| Italian | `it` | Phase 1 (Day 1) | Italy, Switzerland |
| Dutch | `nl` | Phase 1 (Day 1) | Netherlands, Belgium |
| Swedish | `sv` | Phase 1 (Day 1) | Sweden |
| Polish | `pl` | Phase 1 (Day 1) | Poland |
| Turkish | `tr` | Phase 1 (Day 1) | Turkey |
| Arabic | `ar` | Phase 1 (Day 1) | Saudi Arabia, UAE, Egypt |
| Japanese | `ja` | Phase 1 (Day 1) | Japan |
| Korean | `ko` | Phase 1 (Day 1) | South Korea |
| Chinese | `zh` | Phase 1 (Day 1) | China, Singapore |

**All translations AI-generated at build time. Zero incremental cost per language.**

**Each language adds:**
- ~7-10 pages of translated content
- ~200-300 new SEO keyword targets
- A new market with its own AdSense revenue stream
- Estimated 30-60% incremental traffic per major language

**Post-launch optimization priority:**
1. English — invest most effort in content depth and backlinks
2. Spanish + French — second priority for content expansion
3. German + Portuguese — third priority
4. All others — monitor rankings, optimize as needed

---

### 11.10 Multi-Language KPI Targets

**All 14 languages live from Day 1. KPIs reflect cumulative growth across all languages.**

| Metric | 3 Months | 6 Months | 12 Months | 24 Months |
|--------|----------|----------|-----------|-----------|
| Monthly Sessions | 3,000 | 10,000 | 30,000 | 80,000+ |
| Pages Indexed | ~100 | ~120 | ~150 | ~200+ |
| Keyword Rankings | 30+ | 80+ | 150+ | 300+ |
| Monthly Revenue | $0 (no ads yet) | $20-50 | $200-400 | $1,500+ |
| Languages with >500 sessions/mo | 1-2 (EN) | 3-5 | 7-10 | 14 |

---

## 12. Legal & Compliance

### 12.1 Required Legal Pages

| Page | URL | Required By | Priority |
|------|-----|-------------|----------|
| Privacy Policy | /en/privacy-policy | AdSense, GDPR, CCPA | **Mandatory before any traffic** |
| Terms of Service | /en/terms | Legal protection | **Mandatory before launch** |
| Disclaimer | /en/disclaimer | Liability protection | **Mandatory before launch** |
| Cookie Policy | /en/cookie-policy | GDPR (EU users), ePrivacy | **Mandatory before EU traffic** |
| About | /en/about | AdSense, trust | **Mandatory before launch** |

Each legal page must exist in every supported language (/es/privacy-policy, /fr/politique-de-confidentialite, etc.)

### 12.2 Privacy Policy — Key Provisions

Must cover:
- **Data collection**: We collect NO personal data. No accounts, no emails, no names.
- **Calculator data**: All calculations happen client-side in the browser. We never see your inputs or results.
- **Analytics**: Google Analytics 4 (anonymized IP, no personally identifiable info)
- **Advertising**: Google AdSense may use cookies for personalized ads (when ads are enabled)
- **Third-party services**: Cloudflare (CDN/hosting), Google Analytics, Google AdSense (future)
- **Cookies used**:
  - `_ga`, `_gid` (Google Analytics — anonymized)
  - Language preference (localStorage, not cookie)
  - AdSense cookies (future, when ads enabled)
- **GDPR compliance**: No personal data collected; no consent needed for core functionality; cookie consent banner for analytics/ads
- **CCPA compliance**: No personal information sold; no data shared with third parties beyond analytics/ads
- **Data retention**: No user data stored on our servers
- **Contact**: Email address for privacy inquiries

### 12.3 Disclaimer — Critical for Calculator Site

**Must appear on every calculator page (footer or below results):**

> "This calculator provides estimates based on industry-standard formulas and data. Actual sod, seed, and material requirements may vary based on site conditions, supplier specifications, and installation methods. Always verify quantities with your local supplier before purchasing. TurfCalculator is not responsible for over- or under-purchasing resulting from these calculations."

**Additional disclaimers:**
- Price estimates are ranges only, not quotes
- Grass type recommendations are general guidance, not professional advice
- Lawn care calendar is based on typical conditions; local climate may vary
- Results should not replace consultation with a lawn care professional

### 12.4 Cookie Consent (GDPR/ePrivacy)

**Implementation:**
- Simple cookie consent banner on first visit
- Options: "Accept All" / "Essential Only" / "Customize"
- Essential: language preference (localStorage), calculator functionality
- Analytics: Google Analytics (off by default until consent)
- Marketing: AdSense (off by default until consent, future)
- Consent stored in localStorage
- Banner does NOT block calculator usage (users can dismiss and still use tools)
- Must be shown to EU/EEA/UK visitors (detect via browser locale or IP geolocation)

**Banner design:**
```
┌──────────────────────────────────────────────┐
│ 🍪 We use essential cookies to make our      │
│ calculators work and optional analytics      │
│ cookies to improve the site.                 │
│                                              │
│ [Essential Only]  [Accept All]  [Customize]  │
└──────────────────────────────────────────────┘
```

### 12.5 AdSense Compliance (Future — When Ads Enabled)

When AdSense is activated (after sufficient traffic and content):
- Privacy policy must disclose AdSense use and Google's cookie practices
- Ad placements must follow AdSense policies:
  - No more than 3 ad units per page
  - No ads that could be confused with calculator content
  - Clear labeling "Advertisement" or "Sponsored"
  - No incentivized clicks
- Site must have sufficient original content (not just calculators)
- About page with site information required
- Contact information must be accessible

### 12.6 Accessibility (WCAG 2.1 AA)

Not legally required in all jurisdictions, but:
- AdSense/Google prefers accessible sites
- Good accessibility = better SEO
- Target: WCAG 2.1 Level AA compliance

**Key requirements:**
- Color contrast ratio ≥ 4.5:1 for text (already specified in §5.5)
- All interactive elements keyboard accessible (already specified in §5.7)
- Screen reader compatible (aria labels on all calculator inputs/outputs)
- Focus indicators visible on all interactive elements
- Form inputs have associated labels
- Error messages announced to screen readers (aria-live)
- Skip navigation link
- No information conveyed by color alone
