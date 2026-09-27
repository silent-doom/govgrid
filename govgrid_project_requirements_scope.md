# GovGrid: Product Requirements Document (PRD)

## 1. Hackathon MVP Scope (48-Hour Constraint)
Do not build a massive, multi-page web app. Focus on the data flow.
*   **Mock Ingestion:** A simple FastAPI endpoint or Twilio webhook simulating a WhatsApp message (accepts a text string, optional audio file, and optional image).
*   **Mock Government Data:** 3-5 sample PDF documents of actual Indian municipal tenders (downloaded from a state gazette) placed in a local folder or GCS bucket.
*   **Single Dashboard View:** A Streamlit app containing:
    *   A map showing red dots (citizen complaints).
    *   Green polygons showing areas covered by an active tender.
    *   A glaring alert section: "High Priority Unfunded Liabilities" (red dots with no green polygon) and "Potential Capital Leakage" (green polygon with active tender, but still receiving severe citizen complaints).

## 2. Core Functional Requirements
*   **FR-1 (Multimodal Translation):** The system must accept an image and a regional language text/voice input, outputting a standardized English summary and severity score.
*   **FR-2 (Geospatial Clustering):** The system must group individual complaints into clusters if they fall within a 500m radius of each other.
*   **FR-3 (Tender Extraction):** The system must read a PDF and return structured JSON containing: `Project_Name`, `Allocated_Budget_INR`, `Target_Location`, `Expected_Completion_Date`.
*   **FR-4 (Reconciliation):** The system must query the database to cross-reference complaint clusters against active tender locations.

## 3. Data Schemas (Target JSON Outputs for Gemini)

**Prompt Gemini to strictly output this JSON for Grievances:**
```json
{
  "complaint_id": "UUID",
  "category": "Roads | Water | Electricity | Sanitation",
  "severity_score": "1-10",
  "extracted_location": "String location name",
  "lat": "Float",
  "lng": "Float",
  "damage_assessment": "Short description based on image reasoning"
}
```

**Prompt Gemini to strictly output this JSON for Tenders:**
```json
{
  "tender_id": "String (Extracted from PDF)",
  "department": "String",
  "budget_inr": "Integer",
  "work_description": "String",
  "target_lat": "Float",
  "target_lng": "Float",
  "status": "Active | Completed | Pending"
}
```