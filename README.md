# 🏛️ GovGrid — AI-Powered DPI Public Budget Reconciliation Engine

> **Digital Public Infrastructure (DPI) × Spatial Intelligence × Vertex AI**  
> *Bridging citizen ground-truth grievances with government public capital execution via Google Cloud BigQuery GIS and Vertex AI.*

[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-10b981.svg?style=flat&logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-059669.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/React-19-10b981.svg?style=flat&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0+-047857.svg?style=flat&logo=vite)](https://vitejs.dev)
[![Google Cloud BigQuery GIS](https://img.shields.io/badge/BigQuery%20GIS-ST__DWithin-10b981.svg?style=flat&logo=googlecloud)](https://cloud.google.com/bigquery)
[![Vertex AI Gemini](https://img.shields.io/badge/Vertex%20AI-Gemini%202.5-059669.svg?style=flat&logo=google)](https://cloud.google.com/vertex-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-slate.svg?style=flat)](LICENSE)

---

## 📌 The Problem: The DPI Accountability Gap

Governments across developing democracies disburse billions in capital outlays through e-procurement portals (e.g., GeM, PFMS) for civil infrastructure: arterial drainage, rural borewells, roads, and municipal clinics. Simultaneously, millions of citizen distress calls flood local grievance registries (e.g., CPGRAMS, WhatsApp IVR, Jan-Vani).

**The Breakdown:**
* **Data Silos**: Procurement records exist as static PDF tenders and accounting ledgers; citizen complaints exist as unstructured vernacular voice notes and geo-tagged incident photos.
* **Phantom Progress & Ghost Projects**: Contractors submit 100% milestone completion certificates and claim public escrow tranches for roads or pipelines that remain physically unbuilt or inundated on the ground.
* **Delayed Administrative Oversight**: District Magistrates and Municipal Commissioners lack real-time geospatial cross-matching to reconcile public expenditure against ground-level distress.

---

## 💡 The Solution: GovGrid

**GovGrid** is an institutional-grade Digital Public Infrastructure (DPI) reconciliation system. It performs real-time geospatial joins between sanctioned public contract buffers and citizen grievance clusters, surfacing capital leakage and ghost works before escrow payments disburse.

### Key Capabilities

1. **BigQuery GIS Geospatial Cross-Matching Engine**  
   * Native `GEOGRAPHY` points (`ST_GeogPoint(lng, lat)`) for citizen distress signals and buffer polygons for public worksites.
   * Automated spatial cross-matching using `ST_DWithin(tender_geom, complaint_geom, 500)` to detect persistent civic failures within actively funded or completed worksites.

2. **Vertex AI Gemini Forensic Audit Intelligence**  
   * Synthesizes contractor billing milestones against citizen multi-modal reports (vernacular voice notes, transcripts, and damage severity scores).
   * Generates actionable statutory recommendations:
     * **Escrow Payment Freezes** under General Financial Rules (GFR) Rule 175.
     * **Statutory Vigilance Summons** issued directly to delinquent contractors.
     * **Emergency Fund Diversions** under State Disaster Mitigation Fund (SDMF) Head #12.

3. **Live Public Data Ingestion Pipelines**  
   * **OpenStreetMap (OSM) Overpass API**: Live extraction of civic nodes (stormwater drainage, secondary roads, potable water points, clinics) across Bengaluru, Anantapur, and Delhi.
   * **World Bank Open Data API**: Automated ingestion of sanitation and water infrastructure baseline health metrics.
   * **CPGRAMS & GeM Records**: Live batch synchronization of contracts and grievance clusters into BigQuery.

4. **Solid Institutional Executive Interface (Google Stitch Design System)**  
   * **Strict Enterprise Palette**: Matte Obsidian (`#0c1017` / `#161d2a`), Forest Emerald (`#10b981`), Ochre Amber (`#fbbf24`), and Crimson Rose (`#f87171`). Solid fills only — zero distracting gradients, zero emojis.
   * **Guaranteed High-Contrast Dark & Light Mode**: Comprehensive dual-theme support engineered to meet WCAG AAA contrast requirements across all devices.
   * **Mobile-First Responsive Layout**: Native mobile drawer, sticky bottom navigation app bar, and responsive touch-first data dossiers.

---

## 🏛️ System Architecture

```
   CITIZEN GROUND TRUTH                              GOVERNMENT PROCUREMENT
   WhatsApp Voice / CPGRAMS / IVR                    GeM / PFMS / State Portals
            │                                                    │
            ▼                                                    ▼
   Vernacular Audio & Images                         Tender PDFs & Milestone Ledger
            │                                                    │
            ▼                                                    ▼
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │                           INGESTION & ENRICHMENT                             │
  │   • Vertex AI Gemini: Speech Transcription & Severity Scoring (1-10)         │
  │   • Geocoding Engine: Extracted Street Address → WGS84 Coordinates           │
  │   • OSM Overpass + World Bank API: Infrastructure Baseline Telemetry         │
  └──────────────────────────────────────┬───────────────────────────────────────┘
                                         │
                                         ▼
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │                    GOOGLE CLOUD BIGQUERY GIS (govgrid_dpi)                   │
  │   • grievances: id, ST_GeogPoint, category, severity, damage_assessment      │
  │   • tenders: tender_id, polygon_buffer, budget_inr, contractor, completion  │
  │                                                                              │
  │   SQL SPATIAL JOIN:                                                          │
  │   SELECT * FROM tenders t JOIN grievances g                                  │
  │   ON ST_DWithin(t.geography_buffer, g.geography_point, 500)                  │
  └──────────────────────────────────────┬───────────────────────────────────────┘
                                         │
                                         ▼
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │                      FASTAPI AUDIT & RECONCILIATION ENGINE                   │
  │   • Classifies Discrepancies:                                                │
  │     - GHOST PROJECT ALERT: 100% billed, 0% physical ground reality           │
  │     - CRITICAL CAPITAL LEAKAGE: Severe recurring distress in funded buffer   │
  │     - UNFUNDED PUBLIC DEFICIT: Mass distress in unsanctioned corridor        │
  └──────────────────────────────────────┬───────────────────────────────────────┘
                                         │
                                         ▼
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │                   GOVGRID EXECUTIVE STITCH WEB APPLICATION                   │
  │   • Executive Briefing: Daily top 3 spatial discrepancies & action triggers  │
  │   • Tender Audits: Full forensic dossiers, side-by-side matrices & PDF export│
  │   • Citizen Voices: Interactive vernacular voice player & translation quotes │
  │   • Ward Spatial Command: GIS Leaflet command map with live layer toggles    │
  │   • Analytics: Sector breakdown & capital reconciliation telemetry           │
  └──────────────────────────────────────────────────────────────────────────────┘
```

---

## 📂 Repository Structure

```
govgrid/
├── backend/                             # FastAPI Backend Service
│   ├── main.py                          # Application entry point & CORS
│   ├── config.py                        # GCP Project & BigQuery configuration
│   ├── routers/
│   │   ├── grievances.py                # Grievance ingestion & listing endpoints
│   │   ├── tenders.py                   # Tender contracts & discrepancy queries
│   │   └── reconciliation.py            # BigQuery GIS spatial cross-matching
│   ├── services/
│   │   ├── bigquery_service.py          # BigQuery GIS client & spatial queries
│   │   ├── data_ingestion_service.py    # OSM Overpass + World Bank data pipelines
│   │   ├── gemini_service.py            # Vertex AI Gemini multimodal auditor
│   │   └── speech_service.py            # GCP Speech-to-Text vernacular pipeline
│   └── models/
│       ├── grievance.py                 # Pydantic schemas for grievances
│       └── tender.py                    # Pydantic schemas for tenders & audits
│
├── frontend/                            # React 19 + Vite Frontend Application
│   ├── src/
│   │   ├── App.jsx                      # App router & live API state bridge
│   │   ├── ThemeContext.jsx             # Dark / Light theme provider & local storage
│   │   ├── index.css                    # Solid Institutional Design System (v3.0)
│   │   ├── components/
│   │   │   ├── MapView.jsx              # Leaflet GIS vector map with ESRI tiles
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── StitchHeader.jsx         # Executive header with jurisdiction selector
│   │   │   └── MobileNav.jsx            # Fixed mobile app navigation bar
│   │   ├── pages/
│   │   │   ├── ExecutiveBriefing.jsx    # Commissioner morning executive briefing
│   │   │   ├── TenderAudits.jsx         # Detailed audit dossiers & side-by-side comparison
│   │   │   ├── CitizenVoices.jsx        # Vernacular voice note player & quote feed
│   │   │   ├── WardMap.jsx              # Full-screen geospatial command console
│   │   │   └── Analytics.jsx            # Recharts capital reconciliation charts
│   │   └── services/
│   │       └── api.js                   # Axios client for FastAPI backend
│   ├── index.html                       # HTML shell & Google Fonts (Inter, Space Grotesk)
│   ├── vite.config.js                   # Vite bundler configuration
│   └── package.json
│
├── scripts/
│   ├── setup_bigquery.py                # Provisions dataset & native GEOGRAPHY tables
│   ├── ingest_to_bigquery.py            # Loads real public OSM & World Bank datasets
│   └── seed_mock_data.py                # Populates baseline demo cases
│
├── data/
│   ├── sample_tenders/                  # GeM public procurement tender mock files
│   └── ingested/                        # Cached JSON dumps from OSM & World Bank
│
├── Dockerfile                           # Production container for Cloud Run
├── docker-compose.yml                   # Local multi-service orchestration
├── requirements.txt                     # Python backend dependencies
└── README.md                            # Comprehensive system documentation
```

---

## ⚡ Quick Start

### 1. Prerequisites
* **Python 3.11+**
* **Node.js 18+ & npm**
* **Google Cloud SDK (`gcloud`)** authenticated with active project (e.g., `eventflow-e3c91`)

```bash
gcloud auth application-default login
gcloud config set project eventflow-e3c91
```

### 2. Environment Setup

```bash
# Clone the repository
git clone https://github.com/silent-doom/govgrid.git
cd govgrid

# Backend environment setup
cd govgrid
cp .env.example .env
```

Edit `.env`:
```ini
GCP_PROJECT_ID=eventflow-e3c91
BIGQUERY_DATASET=govgrid_dpi
BIGQUERY_LOCATION=asia-south1
PORT=8000
```

### 3. Initialize BigQuery GIS Dataset

```bash
# Install Python dependencies
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create BigQuery dataset and spatial tables
python scripts/setup_bigquery.py

# Ingest live public data (OSM Overpass + World Bank API)
python scripts/ingest_to_bigquery.py
```

### 4. Start the Backend API

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
Backend API interactive Swagger docs will be accessible at:  
👉 **`http://localhost:8000/docs`**

### 5. Launch the Frontend

In a separate terminal window:

```bash
cd govgrid/frontend
npm install
npm run dev
```
GovGrid Executive Interface will be live at:  
👉 **`http://localhost:5173`**

---

## 🔍 Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Healthcheck & BigQuery connection status |
| `GET` | `/api/grievances?district={district}` | Fetches geocoded citizen complaints with severity |
| `POST` | `/api/grievances` | Ingests new citizen grievance (vernacular audio/text) |
| `GET` | `/api/tenders?district={district}` | Sanctioned public tenders with spatial buffer metadata |
| `GET` | `/api/reconciliation?district={district}` | Runs BigQuery `ST_DWithin` spatial cross-matching query |
| `POST` | `/api/actions/freeze-payment` | Issues legal escrow payment freeze directive |
| `POST` | `/api/actions/summon-contractor` | Dispatches statutory Municipal Vigilance Bench summons |
| `POST` | `/api/actions/emergency-sanction` | Authorizes SDMF Head #12 rapid repair funding |

---

## 🎨 Design System & Theme Governance

GovGrid uses a custom design system created to meet government compliance, accessibility, and high visual standards:
* **Zero Gradients**: Solid, structural fills only for institutional clarity.
* **Palette**:
  * **Matte Obsidian** (`#0c1017` / `#161d2a`): High-performance dark mode foundation.
  * **Forest Emerald** (`#10b981` / `#059669`): Verified clean worksites & certified funds.
  * **Ochre Amber** (`#fbbf24` / `#d97706`): Unfunded liabilities, contractor delays & warnings.
  * **Crimson Rose** (`#f87171` / `#dc2626`): Citizen ground distress, ghost projects & payment freezes.
* **Zero Emojis**: Official SVG iconography powered by `lucide-react`.
* **High Contrast**: WCAG AAA compliant contrast for all text in both Dark and Light modes.

---

## 📜 License

GovGrid is licensed under the [MIT License](LICENSE).
Built for public transparency, digital public infrastructure integrity, and citizen empowerment.
