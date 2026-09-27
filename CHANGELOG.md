# Changelog

All notable changes to the GovGrid Digital Public Infrastructure & Capital Reconciliation Engine are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-09-27

### Added
- **Multi-Page Application Architecture**: React Router DOM (`/`, `/grievances`, `/tenders`, `/reconciliation`, `/jan-vani`, `/analytics`, `/pipeline`, `/architecture`).
- **Command Center & GIS Mapping**: Interactive Leaflet geospatial map displaying citizen distress points alongside GeM tender buffer polygons, layer toggles, and live priority feed.
- **Citizen Grievance Ledger**: Searchable, filterable ledger with source provenance tags, Indic language indicators, and severity scoring.
- **GeM Procurement Intelligence**: Procurement tracker with contractor milestone progress, expenditure vs. physical completion indicators, and capital leakage detection.
- **AI Discrepancy & Reconciliation Matrix**: Cross-matching citizen distress signals with public works tenders via spatial joins, producing Gemini 1.5 Pro audit dossiers.
- **Jan-Vani Multimodal Portal**: Voice note and WhatsApp complaint ingestion simulator with transcription, sentiment analysis, and reverse geocoding.
- **DPI Capital & Spatial Analytics**: Recharts data visualizations showing ward-level budget allocations vs. distress severity, category distribution, and contractor reliability.
- **BigQuery GIS Telemetry Pipeline**: Pipeline status dashboard displaying CPGRAMS, GeM, IoT sensors, and BigQuery spatial schemas.
- **High-Integrity Design System**: Deep Matte Obsidian palette (`#0c1017`, `#141b24`, `#10b981`, `#f59e0b`, `#ef4444`, `#84cc16`), typography (Space Grotesk, Inter, JetBrains Mono), and pure SVG Lucide icons with zero emojis and no gradients.

### Fixed
- **Metric Header Alignment**: Resolved badge overlap bug where `URGENT` and `AUDIT` badges occluded card titles in `MetricsBar.jsx`.
- **Map Tile Reliability**: Migrated from rate-limited tiles to Esri World Dark Gray Canvas basemap.
- **Geospatial Coordinate Guards**: Hardened coordinate normalization between tender radius buffers and point coordinates to prevent Leaflet runtime exceptions.
