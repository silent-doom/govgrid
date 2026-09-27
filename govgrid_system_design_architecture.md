# GovGrid: System Design & Architecture
**Theme:** AI for Digital Public Infrastructure and Governance
**Core Objective:** End-to-End DPI Accountability Engine bridging citizen grievances with public budget execution.

## 1. Architectural Diagram
*(Note: You can render this Mermaid.js diagram natively in most markdown viewers, GitHub, or Notion)*

```mermaid
graph TD
    %% Citizen Ingestion Layer
    subgraph Citizen Input
        W[WhatsApp Bot / Twilio] -->|Voice/Text/Image| Gateway[API Gateway / Cloud Run]
    end

    %% Govt Document Ingestion Layer
    subgraph Government Data
        GovPortals[State E-Tender Portals] -->|PDFs/CSV| GCS[Google Cloud Storage]
    end

    %% AI Processing Layer (Google Cloud)
    subgraph Google Cloud AI Processing
        Gateway -->|Audio| STT[GCP Speech-to-Text]
        STT -->|Transcribed Text| GeminiFlash[Vertex AI: Gemini 3.7 Flash]
        Gateway -->|Images| GeminiFlash
        GCS -->|Tender PDFs| DocumentAI[Vertex AI: Gemini Long-Context]
    end

    %% Data Transformation & Storage
    subgraph Database & Reconciliation
        GeminiFlash -->|Structured JSON: Grievance| BQ[(BigQuery GIS)]
        DocumentAI -->|Structured JSON: Budget| BQ
        BQ -->|Spatial Clustering & SQL Joins| ReconciliationEngine[Reconciliation Logic]
    end

    %% Executive Presentation
    subgraph Dashboard
        ReconciliationEngine --> Streamlit[Streamlit / Gradio Web App]
        Streamlit -->|Heatmaps & Alerts| Admin[District Magistrate / Admin]
    end

    %% Styling
    style GeminiFlash fill:#4285F4,stroke:#fff,stroke-width:2px,color:#fff
    style DocumentAI fill:#4285F4,stroke:#fff,stroke-width:2px,color:#fff
    style BQ fill:#34A853,stroke:#fff,stroke-width:2px,color:#fff
    style GCS fill:#FBBC05,stroke:#fff,stroke-width:2px,color:#fff
    style STT fill:#EA4335,stroke:#fff,stroke-width:2px,color:#fff
```

## 2. Google Cloud Services Mapping (Hackathon Scoring Focus)
To score maximum points in the **25% AI/Technical Execution** rubric, emphasize these native GCP integrations in your code and pitch:

*   **Vertex AI (Gemini 3.7 Flash):** The core reasoning engine. Used for two distinct multimodal tasks:
    1.  *Grievance Parsing:* Analyzing uploaded pothole/infrastructure photos to estimate severity (P1-P4) and parsing translated text into structured JSON.
    2.  *Document Parsing:* Ingesting 50-page unstructured government PDF tenders to extract budget allocations, timelines, and geo-coordinates.
*   **Google Cloud Speech-to-Text (V2):** Handles the vernacular audio messages (JanVani layer), translating regional dialects into English text for Gemini to process.
*   **BigQuery (with BigQuery GIS):** This is your spatial deduplication engine. Instead of a standard SQL DB, use BigQuery's `ST_DISTANCE` functions to cluster 100 citizen complaints from the same 500-meter radius into a single "Infrastructure Deficit Zone."
*   **Google Cloud Storage (GCS):** The landing zone for user-uploaded images and scraped government PDFs.
*   **Google Maps Platform (Geocoding API):** Converts raw text like "Behind the main post office, Anantapur" into exact Lat/Lng coordinates for BigQuery mapping.
*   **Google Cloud Run:** Containerize your Python backend (FastAPI/Flask) and deploy here for a live, scalable URL (satisfies the "Deployed link" submission requirement).