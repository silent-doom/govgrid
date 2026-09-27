# 🏛️ GovGrid — AI-Powered DPI Accountability Engine

> **Theme:** AI for Digital Public Infrastructure & Governance  
> **Tagline:** Bridging citizen grievances with public budget execution using AI and geospatial intelligence.

---

## 🧠 What It Does

GovGrid is an end-to-end accountability platform that:

1. **Ingests citizen grievances** via WhatsApp (text, voice, image) in any regional language
2. **Parses government tender PDFs** to extract budget allocations and geo-coordinates
3. **Reconciles** complaint clusters against active tenders — surfacing **unfunded liabilities** and **capital leakage**
4. **Presents** findings on a geospatial dashboard for District Magistrates and administrators

---

## 🏗️ Architecture

```
WhatsApp/Twilio → FastAPI (Cloud Run) → Gemini 3.7 Flash → BigQuery GIS → Streamlit Dashboard
                                      ↑
                State e-Tender PDFs → GCS → Gemini Long-Context
```

### Google Cloud Services Used
| Service | Purpose |
|---|---|
| **Vertex AI (Gemini 3.7 Flash)** | Multimodal grievance parsing + PDF tender extraction |
| **GCP Speech-to-Text V2** | Vernacular audio → English transcription |
| **BigQuery GIS** | `ST_DISTANCE` spatial clustering of complaints (500m radius) |
| **Google Cloud Storage** | Landing zone for images and government PDFs |
| **Google Maps Platform** | Text address → Lat/Lng geocoding |
| **Cloud Run** | Containerized FastAPI backend (deployed, scalable) |

---

## 🗂️ Project Structure

```
govgrid/
├── backend/
│   ├── main.py
│   ├── config.py
│   ├── routers/
│   │   ├── grievances.py
│   │   └── tenders.py
│   ├── services/
│   │   ├── gemini_service.py
│   │   ├── speech_service.py
│   │   ├── geocoding_service.py
│   │   ├── bigquery_service.py
│   │   └── gcs_service.py
│   ├── models/
│   │   ├── grievance.py
│   │   └── tender.py
│   └── utils/
│       └── prompts.py
├── dashboard/
│   ├── app.py
│   └── components/
│       ├── map_view.py
│       ├── alerts.py
│       └── sidebar.py
├── scripts/
│   ├── setup_bigquery.py
│   └── seed_mock_data.py
├── data/sample_tenders/
├── infra/bigquery_schema.json
├── tests/
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── .env.example
```

---

## ⚡ Quick Start

```bash
# 1. Configure
cp .env.example .env  # fill in GCP keys

# 2. Install
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# 3. Setup BigQuery
python scripts/setup_bigquery.py
python scripts/seed_mock_data.py  # load demo data

# 4. Run backend
cd backend && uvicorn main:app --reload --port 8000

# 5. Run dashboard
cd dashboard && streamlit run app.py
```

---

## 🚀 Deploy to Cloud Run

```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT/govgrid-backend ./backend
gcloud run deploy govgrid-backend \
  --image gcr.io/YOUR_PROJECT/govgrid-backend \
  --platform managed --region asia-south1 --allow-unauthenticated
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/grievance` | Submit complaint (text/audio/image) |
| `POST` | `/ingest-tender` | Process government tender PDF |
| `GET` | `/clusters` | Fetch complaint clusters |
| `GET` | `/reconciliation` | Unfunded liabilities + capital leakage |
| `GET` | `/health` | Health check |

---

## 📊 Dashboard Views

- 🔴 **Red dots** — Citizen complaint clusters (sized by severity)
- 🟢 **Green polygons** — Areas covered by active tenders
- 🚨 **Unfunded Liabilities** — Red dots with no green polygon
- ⚠️ **Capital Leakage** — Green polygon + ongoing complaints
