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
Interactive Swagger docs: **`http://localhost:8000/docs`**

### 5. Launch the Frontend

```bash
cd frontend
npm install
npm run dev
```
Executive Interface: **`http://localhost:5173`**

---

## 📜 License

GovGrid is licensed under the [MIT License](LICENSE).
Built for public transparency, digital public infrastructure integrity, and citizen empowerment.
