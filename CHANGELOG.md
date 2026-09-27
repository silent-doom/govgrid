# Changelog

All notable changes to the GovGrid Digital Public Infrastructure & Capital Reconciliation Engine are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-09-28

### Added
- **Google Stitch Civic Horizon Design Revamp**: Ingested and integrated design specifications and UI modules from Google Stitch (`civic_horizon/DESIGN.md` and Stitch MCP).
- **Executive Daily Briefing (`/` / `/briefing`)**: Commissioner morning brief featuring live CPGRAMS + GeM sync status, 3 top-level highlight metric pills (Citizen Reports, Capital Reconciled, Pending Attention Hotspots), Top 3 Spatial Priorities with interactive action triggers (Escrow Freeze, Emergency Fund Sanction, Penalty Notice Dispatches), Ward Spatial Vector Map with numbered pins, and Playable Kannada/Telugu Audio Waveform Player with verified translation quotes.
- **Citizen Voices Portal (`/voices` / `/jan-vani`)**: Direct ground-truth ledger with live category pill filters, simulated vernacular voice note ingestion engine, dual-column story cards feed with audio pills, and sticky Focused Detail Inspector displaying 800m unsanctioned gap previews, case estimates, and rapid repair sanctioning.
- **Tender Reconciliation & Audit Dossier (`/audits` / `/reconciliation`)**: Spatial discrepancy resolution hub with 2-option status selector ("Needs Attention" vs "Verified Clean"), side-by-side ground distress vs billing claim matrix, -78% phantom progress discrepancy meters, and Vertex AI forensic audit recommendations.
- **Ward Spatial Command Map (`/map`)**: Full-screen interactive Leaflet geospatial interface with buffer rings, distress cluster pins, sector filters, and dark/light canvas toggle.
- **Stitch Header (`StitchHeader.jsx`)**: Sticky civic header with district node selector, navigation tabs, unread notifications indicator, and Commissioner profile.

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
