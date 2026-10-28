# BizFlow ERP — Business Management System (ERP Lite)
> **Tagline:** Run Your Business Smarter.  
> **Target Audience:** Retail shops, wholesalers, distributors, furniture shops, small manufacturers, and multi-branch trading businesses in Nepal and India.

---

## 1. Visual & Architectural Alignment
BizFlow ERP faithfully reproduces the premium SaaS enterprise aesthetic from the design reference:
- **Header & Sidebar:** Clean white container canvas, subtle `border-slate-200`, deep blue accent branding, branch switcher (`Main Branch / STORE ID: #4456`), active routes, and staff footer.
- **Top KPI Cards:** 4 high-density metric cards (Total Sales, Total Orders, Avg Order Value, Net Profit) with percentage trend badges and comparisons.
- **Financial Performance:** Interactive 30-Day / 3-Month / 1-Year Revenue vs. Expenses area chart with real-time hover markers.
- **Live Sales:** Real-time activity feed highlighting recent POS receipts, customer registrations, and payments.
- **Top Selling Products:** Tabular layout with category color accents, stock progress bars, units sold, and profit margins.

---

## 2. Core Business Workflows & Inventory Rules

1. **Transactional Stock Integrity:**
   - **Sales:** Automatically decrement inventory only when confirmed/paid.
   - **Purchases:** Purchase orders **never** increase stock on creation. Stock is only incremented when goods are physically received and verified via `Receive Goods`.
   - **Adjustments:** Mandatory audit reason logged to the traceable stock ledger.
2. **Localization & Financial Compliance:**
   - Dual-currency toggle: **NPR (रू)** (13% VAT, PAN/VAT formatting) and **INR (₹)** (18% GST, GSTIN formatting).
   - Commercial printable Tax Invoice with VAT registration, line-item details, and payment terms.
   - Separate accounting for gross revenue, discounts, VAT/taxes, COGS, and operating expenses.

---

## 3. Technology Stack

### Frontend:
- **React 19** + **TypeScript** + **Vite 8**
- **Tailwind CSS v4**
- **Lucide React** icons
- **Recharts** for analytics & area visualizations

### Backend (Standalone in `/backend`):
- **Python 3.11+** + **FastAPI**
- **Pydantic v2** validation
- **SQLAlchemy 2.0 ORM** with Decimal monetary types
- **PostgreSQL 15** + **Alembic** migrations
- **Docker Compose** containerization

---

## 4. Setup & Running Instructions

### Running the Frontend:
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Running on http://localhost:3000
```

### Running the Backend with Docker:
```bash
# Start PostgreSQL database and FastAPI backend
docker-compose up -d

# Check API health
curl http://localhost:8000/
# Interactive Swagger Documentation: http://localhost:8000/docs
```

### Running Backend Manually (Python Virtualenv):
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

## 5. Demo Accounts & Role Matrix
Use the role switcher at the bottom of the sidebar or in the top bar to test role-based access:
- **Aldi Dwi Kurniawan / Store Manager:** Operational sales, inventory adjustments, POs, and daily invoices.
- **Dhiraj Babu / Owner:** Full access, financial reporting, system settings, branch setup.
- **Pooja Sharma / Cashier:** Point of sale, order checkout, customer creation.
- **Rohan Shrestha / Inventory Staff:** Products, stock adjustments, purchase order receipts.
- **Gita Adhikari / Accountant:** Payment recording, P&L reports, expense management.

---

## 6. Production Deployment Checklist
- [x] Traceable stock ledger prevents duplicate updates.
- [x] Monetary values represented with precise 2-decimal currencies.
- [x] Print stylesheets configured for counter thermal & A4 invoices.
- [x] Client-side search and ⌘K quick command launcher.
- [x] Demo data reset button to restore fresh state at any time.
