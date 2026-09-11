const API_BASE = import.meta.env.VITE_API_BASE || '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `HTTP error! status: ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Policies
  getPolicies: () => request('/policies'),

  // Cases
  getCases: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.category) searchParams.append('category', params.category);
    if (params.status) searchParams.append('status', params.status);
    if (params.search) searchParams.append('search', params.search);
    const qs = searchParams.toString();
    return request(`/cases${qs ? `?${qs}` : ''}`);
  },

  getCaseById: (caseId) => request(`/cases/${caseId}`),

  createCase: (caseData) => request('/cases', {
    method: 'POST',
    body: JSON.stringify(caseData)
  }),

  closeCase: (caseId, closeData) => request(`/cases/${caseId}/close`, {
    method: 'POST',
    body: JSON.stringify(closeData)
  }),

  // Audit Chain & Cryptographic Integrity
  getAuditChain: (caseId) => request(`/cases/${caseId}/audit-chain`),
  verifyIntegrity: (caseId) => request(`/cases/${caseId}/verify-integrity`),

  // Procedural Checklist
  getChecklist: (caseId) => request(`/cases/${caseId}/checklist`),
  getGateCheck: (caseId) => request(`/cases/${caseId}/checklist/gate-check`),
  updateChecklistStep: (caseId, stepId, data) => request(`/cases/${caseId}/checklist/${stepId}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),

  // Notices
  getNotices: (caseId) => request(`/cases/${caseId}/notices`),
  createNotice: (caseId, noticeData) => request(`/cases/${caseId}/notices`, {
    method: 'POST',
    body: JSON.stringify(noticeData)
  }),
  acknowledgeNotice: (noticeId, studentRoll) => request(`/cases/notices/${noticeId}/acknowledge`, {
    method: 'POST',
    body: JSON.stringify({ studentRoll })
  }),

  // Student Submissions
  submitResponse: (caseId, submissionData) => request(`/cases/${caseId}/submissions`, {
    method: 'POST',
    body: JSON.stringify(submissionData)
  }),

  // Committee & Precedents
  getPrecedents: (category) => request(`/precedents${category ? `?category=${category}` : ''}`),
  verifyQuorum: (caseId, quorumData) => request(`/committee/cases/${caseId}/verify-quorum`, {
    method: 'POST',
    body: JSON.stringify(quorumData)
  }),
  recordDecision: (caseId, decisionData) => request(`/committee/cases/${caseId}/decisions`, {
    method: 'POST',
    body: JSON.stringify(decisionData)
  }),

  // Sanctions
  getSanction: (caseId) => request(`/cases/${caseId}/sanctions`),
  updateSanction: (caseId, sanctionId, updateData) => request(`/cases/${caseId}/sanctions/${sanctionId}`, {
    method: 'PATCH',
    body: JSON.stringify(updateData)
  }),

  // Evidence & Witnesses
  addEvidence: (caseId, evidenceData) => request(`/cases/${caseId}/evidence`, {
    method: 'POST',
    body: JSON.stringify(evidenceData)
  }),
  addWitness: (caseId, witnessData) => request(`/cases/${caseId}/witnesses`, {
    method: 'POST',
    body: JSON.stringify(witnessData)
  }),

  // Appeals
  fileAppeal: (caseId, appealData) => request(`/cases/${caseId}/appeals`, {
    method: 'POST',
    body: JSON.stringify(appealData)
  }),
  decideAppeal: (caseId, appealId, decisionData) => request(`/cases/${caseId}/appeals/${appealId}/decide`, {
    method: 'POST',
    body: JSON.stringify(decisionData)
  }),

  // Governance Anonymised Report
  getGovernanceReport: () => request('/reports/governance-anonymous'),

  // Multi-Agent Integrations
  ingestAgent44: (payload) => request('/integrations/agent44/incident', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getAgent56Feed: () => request('/integrations/agent56/compliance-feed'),
  getAgent57Feed: () => request('/integrations/agent57/precedent-feed'),
  getStudentProfilePrivacyCheck: (rollNumber) => request(`/integrations/student-profile/${rollNumber}`)
};
