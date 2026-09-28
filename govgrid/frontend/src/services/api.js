/**
 * GovGrid DPI API Service
 * Connects frontend to the FastAPI backend running on port 8000.
 * Queries live BigQuery GIS datasets (eventflow-e3c91.govgrid_dpi).
 */

const API_BASE = 'http://127.0.0.1:8000';

export async function fetchReconciliation() {
  try {
    const res = await fetch(`${API_BASE}/query/reconciliation`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend API /query/reconciliation offline, using fallback:', err);
    return null;
  }
}

export async function fetchDistrictSummary() {
  try {
    const res = await fetch(`${API_BASE}/query/summary`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend API /query/summary offline, using fallback:', err);
    return null;
  }
}

export async function fetchLiveGrievances(limit = 150) {
  try {
    const res = await fetch(`${API_BASE}/grievance/?limit=${limit}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.grievances || [];
  } catch (err) {
    console.warn('Backend API /grievance/ offline, using fallback:', err);
    return null;
  }
}

export async function fetchLiveTenders(statusFilter = null) {
  try {
    const url = statusFilter ? `${API_BASE}/tender/list?status_filter=${statusFilter}` : `${API_BASE}/tender/list`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.tenders || [];
  } catch (err) {
    console.warn('Backend API /tender/list offline, using fallback:', err);
    return null;
  }
}

export async function fetchClusters(minComplaints = 1) {
  try {
    const res = await fetch(`${API_BASE}/query/clusters?min_complaints=${minComplaints}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.clusters || [];
  } catch (err) {
    console.warn('Backend API /query/clusters offline, using fallback:', err);
    return null;
  }
}
