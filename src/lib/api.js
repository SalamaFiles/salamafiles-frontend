const BASE = 'http://localhost:5000/api';

export async function fetchReports() {
  const res = await fetch(`${BASE}/reports`);
  if (!res.ok) throw new Error('Failed to fetch reports');
  return res.json();
}
export async function fetchStaff() {
  const res = await fetch('http://localhost:5000/api/user');
  return res.json();
}

export async function assignReport(reportId, staffId) {
  await fetch(`http://localhost:5000/api/reports/${reportId}/assign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ staffId })
  });
  
}

export async function resolveReport(id) {
  await fetch(`http://localhost:5000/api/reports/${id}/resolve`, {
    method: 'POST'
  });
}

export async function escalateReport(id) {
  await fetch(`http://localhost:5000/api/reports/${id}/escalate`, {
    method: 'POST'
  });
}