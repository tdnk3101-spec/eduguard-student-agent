const express = require('express');
const router = express.Router();
const { db, save } = require('../db');
const { POLICIES, generateProceduralChecklist, calculateExpiryDate } = require('../policyEngine');
const { createLedgerEntry, verifyChainIntegrity } = require('../hashChain');

// Helper to record audit action
function logAction(caseId, actor, action, payload) {
  if (!db.auditChain[caseId]) {
    db.auditChain[caseId] = [];
  }
  const chain = db.auditChain[caseId];
  const prevHash = chain.length > 0 ? chain[chain.length - 1].hash : '0000000000000000000000000000000000000000000000000000000000000000';
  const entry = createLedgerEntry({
    previousHash: prevHash,
    caseId,
    actor,
    action,
    payload,
    index: chain.length
  });
  chain.push(entry);
  save();
  return entry;
}

// GET all cases
router.get('/', (req, res) => {
  const { category, status, search } = req.query;
  let results = [...(db.cases || [])];

  if (category && category !== 'ALL') {
    results = results.filter(c => c.category === category);
  }
  if (status && status !== 'ALL') {
    results = results.filter(c => c.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(c => 
      c.caseNumber.toLowerCase().includes(q) ||
      c.studentName.toLowerCase().includes(q) ||
      c.studentRoll.toLowerCase().includes(q) ||
      c.allegationSummary.toLowerCase().includes(q)
    );
  }

  // Sort by createdAt desc
  results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ success: true, count: results.length, cases: results });
});

// GET single case by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const caseItem = (db.cases || []).find(c => c.caseId === id || c.caseNumber === id);

  if (!caseItem) {
    return res.status(404).json({ success: false, error: 'Case not found' });
  }

  const checklist = db.checklistItems[caseItem.caseId] || [];
  const notices = (db.notices || []).filter(n => n.caseId === caseItem.caseId);
  const submissions = (db.submissions || []).filter(s => s.caseId === caseItem.caseId);
  const decision = (db.decisions || []).find(d => d.caseId === caseItem.caseId) || null;
  const sanction = (db.sanctions || []).find(s => s.caseId === caseItem.caseId) || null;
  const appeals = (db.appeals || []).filter(a => a.caseId === caseItem.caseId);
  const witnessStatements = (db.witnessStatements || []).filter(w => w.caseId === caseItem.caseId);
  const chain = db.auditChain[caseItem.caseId] || [];
  const policy = POLICIES[caseItem.category] || null;

  res.json({
    success: true,
    case: caseItem,
    policy,
    checklist,
    notices,
    submissions,
    decision,
    sanction,
    appeals,
    witnessStatements,
    auditChainSummary: {
      blockCount: chain.length,
      latestHash: chain.length > 0 ? chain[chain.length - 1].hash : null
    }
  });
});

// POST create new incident (Incident Intake Stage 1)
router.post('/', (req, res) => {
  const {
    category,
    incidentDate,
    incidentLocation,
    reportingAuthority,
    studentRoll,
    studentName,
    studentEmail,
    studentDept,
    witnesses,
    allegationSummary,
    evidenceItems
  } = req.body;

  if (!category || !allegationSummary || !studentRoll || !studentName) {
    return res.status(400).json({ success: false, error: 'Missing required incident fields.' });
  }

  // Generate unique case number DISC-2026-XXXX
  const nextNum = (db.cases.length + 1).toString().padStart(4, '0');
  const caseId = `DISC-2026-${nextNum}`;
  const policy = POLICIES[category] || POLICIES.ACADEMIC_MALPRACTICE;

  const newCase = {
    caseId,
    caseNumber: caseId,
    category,
    status: 'INCIDENT_REGISTERED',
    stage: 2,
    stageName: 'Procedural Checklist Active',
    incidentDate: incidentDate || new Date().toISOString(),
    incidentLocation: incidentLocation || 'Campus Premises',
    reportingAuthority: reportingAuthority || 'Proctorial Officer',
    studentId: `STU-GEN-${Date.now()}`,
    studentRoll,
    studentName,
    studentEmail: studentEmail || `${studentRoll.toLowerCase()}@vignan.ac.in`,
    studentDept: studentDept || 'Undergraduate Engineering',
    witnesses: Array.isArray(witnesses) ? witnesses : (witnesses ? [witnesses] : []),
    allegationSummary,
    evidenceItems: Array.isArray(evidenceItems) ? evidenceItems : [
      { id: `EVD-${Date.now()}`, title: 'Initial Incident Report Form', type: 'Official Submission', timestamp: new Date().toISOString() }
    ],
    createdAt: new Date().toISOString(),
    responseDeadline: new Date(Date.now() + (policy.responseDays + policy.noticeDays) * 24 * 3600 * 1000).toISOString(),
    retentionExpiryDate: null,
    guardrailFlags: {
      guiltDetermined: false,
      sanctionRecommended: false,
      disciplinaryShieldActive: true
    }
  };

  db.cases.unshift(newCase);

  // Initialize checklist based on policy
  const checklist = generateProceduralChecklist(category);
  db.checklistItems[caseId] = checklist;

  // Initialize Genesis block in cryptographic hash chain
  logAction(caseId, reportingAuthority || 'Authorized Reporting Officer', 'INCIDENT_INTAKE_REGISTERED', {
    caseId,
    category,
    studentRoll,
    statute: policy.governingStatute,
    noticeDays: policy.noticeDays,
    responseDays: policy.responseDays
  });

  save();

  res.status(201).json({
    success: true,
    message: `Case ${caseId} officially created with policy checklist generated.`,
    case: newCase,
    checklist
  });
});

// GET audit chain for a case
router.get('/:id/audit-chain', (req, res) => {
  const { id } = req.params;
  const chain = db.auditChain[id] || [];
  const verification = verifyChainIntegrity(chain);

  res.json({
    success: true,
    caseId: id,
    blocks: chain,
    verification
  });
});

// GET verify integrity endpoint
router.get('/:id/verify-integrity', (req, res) => {
  const { id } = req.params;
  const chain = db.auditChain[id] || [];
  const verification = verifyChainIntegrity(chain);

  res.json({
    success: true,
    caseId: id,
    blockCount: chain.length,
    verification
  });
});

// POST close case
router.post('/:id/close', (req, res) => {
  const { id } = req.params;
  const { closedBy, notes } = req.body;

  const caseItem = db.cases.find(c => c.caseId === id);
  if (!caseItem) {
    return res.status(404).json({ success: false, error: 'Case not found' });
  }

  const policy = POLICIES[caseItem.category] || POLICIES.ACADEMIC_MALPRACTICE;
  const expiryDate = calculateExpiryDate(policy.retentionYears);

  caseItem.status = 'CLOSED_RETENTION_ACTIVE';
  caseItem.stage = 9;
  caseItem.stageName = 'Case Closed (Retention Countdown Active)';
  caseItem.closedAt = new Date().toISOString();
  caseItem.retentionExpiryDate = expiryDate;

  // Complete checklist
  const checklist = db.checklistItems[id] || [];
  const closureStep = checklist.find(s => s.id === 'STEP-9-CASE-CLOSURE-RETENTION');
  if (closureStep) {
    closureStep.status = 'COMPLETED';
    closureStep.completedAt = new Date().toISOString();
  }

  logAction(id, closedBy || 'Disciplinary Administrator', 'CASE_OFFICIALLY_CLOSED', {
    closedAt: caseItem.closedAt,
    retentionExpiryDate: expiryDate,
    retentionYears: policy.retentionYears,
    notes: notes || 'All procedural requirements and sanctions completed satisfactorily.'
  });

  save();

  res.json({
    success: true,
    message: `Case ${id} closed. Record retention countdown activated (${policy.retentionYears} years).`,
    case: caseItem,
    retentionExpiryDate: expiryDate
  });
});

// POST add evidence item to case file
router.post('/:id/evidence', (req, res) => {
  const { id } = req.params;
  const { title, type, description, uploadedBy } = req.body;

  const caseItem = db.cases.find(c => c.caseId === id);
  if (!caseItem) {
    return res.status(404).json({ success: false, error: 'Case not found' });
  }

  const evidenceItem = {
    id: `EVD-${Date.now()}`,
    title: title || 'Supplementary Evidentiary Document',
    type: type || 'Document Attachment',
    description: description || 'Admitted into evidentiary case record.',
    timestamp: new Date().toISOString(),
    admittedBy: uploadedBy || 'Authorized Proctorial Officer'
  };

  if (!caseItem.evidenceItems) caseItem.evidenceItems = [];
  caseItem.evidenceItems.push(evidenceItem);

  logAction(id, uploadedBy || 'Proctorial Officer', 'EVIDENCE_ADMITTED_TO_RECORD', {
    evidenceId: evidenceItem.id,
    title: evidenceItem.title,
    type: evidenceItem.type
  });

  save();

  res.status(201).json({
    success: true,
    message: 'Evidence document officially admitted into tamper-evident case file.',
    evidenceItem
  });
});

// POST add witness statement
router.post('/:id/witnesses', (req, res) => {
  const { id } = req.params;
  const { witnessName, witnessRole, statementText, recordedBy } = req.body;

  const caseItem = db.cases.find(c => c.caseId === id);
  if (!caseItem) {
    return res.status(404).json({ success: false, error: 'Case not found' });
  }

  if (!statementText || !witnessName) {
    return res.status(400).json({ success: false, error: 'Witness name and statement text are required.' });
  }

  const witnessRecord = {
    statementId: `WIT-${Date.now()}`,
    caseId: id,
    witnessName,
    witnessRole: witnessRole || 'Witness / Lab Proctor',
    statementText,
    recordedAt: new Date().toISOString(),
    recordedBy: recordedBy || 'Committee Secretary'
  };

  if (!db.witnessStatements) db.witnessStatements = [];
  db.witnessStatements.push(witnessRecord);

  logAction(id, recordedBy || 'Committee Secretary', 'WITNESS_STATEMENT_RECORDED', {
    statementId: witnessRecord.statementId,
    witnessName,
    witnessRole: witnessRecord.witnessRole
  });

  save();

  res.status(201).json({
    success: true,
    message: `Witness statement of ${witnessName} recorded and sealed into ledger.`,
    witnessRecord
  });
});

// POST submit formal appeal (Student right under statute)
router.post('/:id/appeals', (req, res) => {
  const { id } = req.params;
  const { groundsOfAppeal, appellantName, studentRoll } = req.body;

  const caseItem = db.cases.find(c => c.caseId === id);
  if (!caseItem) {
    return res.status(404).json({ success: false, error: 'Case not found' });
  }

  if (!groundsOfAppeal || groundsOfAppeal.trim().length < 15) {
    return res.status(400).json({ success: false, error: 'Detailed grounds of appeal are required.' });
  }

  const appealId = `APP-${id.replace('DISC-', '')}-01`;
  const appealRecord = {
    appealId,
    caseId: id,
    studentRoll: studentRoll || caseItem.studentRoll,
    appellantName: appellantName || `${caseItem.studentName} (${caseItem.studentRoll})`,
    groundsOfAppeal,
    filedAt: new Date().toISOString(),
    status: 'APPEAL_FILED_PENDING_REVIEW',
    appellateAuthority: 'Dean of Academic Governance / Appellate Tribunal',
    appellateDetermination: null
  };

  if (!db.appeals) db.appeals = [];
  db.appeals.push(appealRecord);

  caseItem.status = 'APPEAL_UNDER_REVIEW';

  logAction(id, appealRecord.appellantName, 'STATUTORY_APPEAL_FILED', {
    appealId,
    timestamp: appealRecord.filedAt,
    appellateAuthority: appealRecord.appellateAuthority
  });

  save();

  res.status(201).json({
    success: true,
    message: 'Statutory appeal successfully filed and transferred to Appellate Authority.',
    appealRecord
  });
});

// POST appellate determination
router.post('/:id/appeals/:appealId/decide', (req, res) => {
  const { id, appealId } = req.params;
  const { appellateDetermination, appellateOrder, decidedBy } = req.body;

  const appeal = (db.appeals || []).find(a => a.appealId === appealId);
  if (!appeal) {
    return res.status(404).json({ success: false, error: 'Appeal record not found' });
  }

  appeal.status = 'APPEAL_DECIDED';
  appeal.appellateDetermination = appellateDetermination || 'Sanction Upheld / Modified';
  appeal.appellateOrder = appellateOrder || 'The Appellate Authority has reviewed the record and affirmed due process compliance.';
  appeal.decidedAt = new Date().toISOString();
  appeal.decidedBy = decidedBy || 'Appellate Board (Dean of Governance)';

  const caseItem = db.cases.find(c => c.caseId === id);
  if (caseItem) {
    caseItem.status = 'APPEAL_CONCLUDED';
  }

  logAction(id, appeal.decidedBy, 'APPELLATE_ORDER_ENTERED', {
    appealId,
    determination: appeal.appellateDetermination,
    timestamp: appeal.decidedAt
  });

  save();

  res.json({
    success: true,
    message: 'Appellate determination recorded and sealed into case file.',
    appeal
  });
});

module.exports = router;
module.exports.logAction = logAction;
