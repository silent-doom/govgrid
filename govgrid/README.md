# 🏛️ GovGrid — AI-Powered DPI Public Budget Reconciliation Engine

> **Digital Public Infrastructure (DPI) × Geospatial Intelligence × Google Vertex AI**  
> *Bridging citizen ground-truth grievances with government public capital execution via Google Cloud BigQuery GIS and Vertex AI.*  
> **Built for "Build with AI: Code for Communities (Season 2)" — Track 1: AI for DPI & Governance**

[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-10b981.svg?style=flat&logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-059669.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/React-19-10b981.svg?style=flat&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0+-047857.svg?style=flat&logo=vite)](https://vitejs.dev)
[![Google Cloud BigQuery GIS](https://img.shields.io/badge/BigQuery%20GIS-ST__DWithin-10b981.svg?style=flat&logo=googlecloud)](https://cloud.google.com/bigquery)
[![Vertex AI Gemini](https://img.shields.io/badge/Vertex%20AI-Gemini%202.5-059669.svg?style=flat&logo=google)](https://cloud.google.com/vertex-ai)
[![Google Cloud Run Ready](https://img.shields.io/badge/Cloud%20Run-Serverless-4285F4.svg?style=flat&logo=googlecloud)](https://cloud.google.com/run)
[![License: MIT](https://img.shields.io/badge/License-MIT-slate.svg?style=flat)](LICENSE)

---

## 🏆 Hackathon Alignment & Rubric Architecture

GovGrid is specifically architected for the **Build with AI: Code for Communities (Season 2)** Hackathon under **Track 1: AI for Digital Public Infrastructure & Governance**:

| Evaluation Pillar | Weight | How GovGrid Excels |
| :--- | :---: | :--- |
| **AI & Technical Execution** | **25%** | Utilizes **Google Vertex AI Gemini 2.5 Flash** for forensic discrepancy reasoning, **Chirp 2 Speech-to-Text** for Indian vernacular dialect transcription, and **BigQuery GIS** (`ST_DWithin` & `ST_GeogPoint`) for spatial cross-matching. |
| **Deployability & Scalability** | **25%** | Production-ready multi-stage `Dockerfile`, `docker-compose.yml`, and 1-click **Google Cloud Run** deployment script (`scripts/deploy_cloud_run.sh`) with auto-scaling (0-10 instances). |
| **Problem-Solution Fit** | **20%** | Solves the pervasive "ghost project" and capital leakage problem in Indian municipalities (BBMP, NDMC, AP Municipalities) by stopping unverified escrow tranches. |
| **Accessibility & Inclusivity** | **15%** | Full vernacular language switching for **English**, **Kannada (ಕನ್ನಡ)**, **Telugu (తెలుగు)**, and **Hindi (हिन्दी)**. Seamless WhatsApp voice note ingestion for non-literate and rural citizens. |
| **Impact & Social Good** | **10%** | Protects public tax funds, enforces contractor accountability under GFR Rule 175, and accelerates critical infrastructure repairs for underserved wards. |
| **Presentation & UX** | **5%** | High-contrast Stitch enterprise UI (WCAG AAA contrast), in-app **Judging Guide Modal**, and interactive **WhatsApp Voice Inflow Simulator**. |

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

3. **Vernacular & WhatsApp Voice Inflow Ingestion**  
   * Ingests citizen reports in regional languages via WhatsApp voice notes.
   * Transcribes via Google Cloud Speech-to-Text (Chirp 2) and extracts structured GIS damage parameters with Vertex AI Gemini.
   * 4-Language UI switcher supporting English, ಕನ್ನಡ, తెలుగు, and हिन्दी.

4. **Live Public Data Ingestion Pipelines**  
   * **OpenStreetMap (OSM) Overpass API**: Live extraction of civic nodes (stormwater drainage, secondary roads, potable water points, clinics) across Bengaluru, Anantapur, and Delhi.
   * **World Bank Open Data API**: Automated ingestion of sanitation and water infrastructure baseline health metrics.
   * **CPGRAMS & GeM Records**: Live batch synchronization of contracts and grievance clusters into BigQuery.

---

## 🏗️ Architecture & Google Cloud AI Stack

```
[ Citizen WhatsApp Voice Note / Audio ] ──> [ Google Cloud Speech-to-Text (Chirp 2) ]
                                                            │
                                                     (Transcript)
                                                            ▼
[ GeM / PFMS Tenders (PDFs & Ledgers) ] ──> [ Vertex AI Gemini 2.5 Flash ] ──> Structured Geocoded Event
                                                            │
                                                            ▼
                                             [ BigQuery GIS Spatial Engine ]
                                          ST_DWithin(buffer, point, 500m)
                                                            │
                                                            ▼
                                              [ Capital Leakage Alert ]
                                            Escrow Freeze / Contractor Summons
                                                            │
                                                            ▼
                                              [ GovGrid Executive UI ]
                                        (React 19 + Vite + Stitch Design)
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
pip install -r backend/requirements.txt

# Create BigQuery dataset and spatial tables
python scripts/setup_bigquery.py

# Ingest live public data (OSM Overpass + World Bank API)
python scripts/ingest_to_bigquery.py
```

### 4. Local Development

```bash
# Backend (Terminal 1)
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Frontend (Terminal 2)
cd frontend
npm install
npm run dev
```

* Executive Interface: **`http://localhost:5173`**
* Interactive API Docs: **`http://localhost:8000/docs`**

---

## 🐳 Containerized & Cloud Run Deployment

### Option A: Docker Compose (Local 1-Command Startup)

```bash
docker compose up --build
```
Access the combined app at **`http://localhost:8080`**.

### Option B: Deploy to Google Cloud Run (Production)

Deploy directly to Google Cloud Run with autoscaling:

```bash
chmod +x scripts/deploy_cloud_run.sh
./scripts/deploy_cloud_run.sh
```

---

## 🧪 Interactive Hackathon Judging Tour

Judges can evaluate the full application in 60 seconds:
1. Click the **"Judging Guide"** trophy button in the header bar for an architectural deep-dive.
2. Switch languages via the **Language Selector** (`English`, `ಕನ್ನಡ`, `తెలుగు`, `हिन्दी`) to test Vernacular Inclusivity.
3. Navigate to **Citizen Voices** (`/voices`) and click **"Simulate WhatsApp Voice Inflow"** to trigger a real-time multimodal audio processing run.
4. Go to **Tender Audits** (`/audits`) to inspect forensic dossiers, freeze escrow disbursements, and issue statutory contractor summons.

---

## 📜 License

GovGrid is licensed under the [MIT License](LICENSE).  
Built for public transparency, digital public infrastructure integrity, and citizen empowerment.
