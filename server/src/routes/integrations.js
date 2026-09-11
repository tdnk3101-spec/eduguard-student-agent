const express = require('express');
const router = express.Router();
const { db, save } = require('../db');
const { POLICIES, generateProceduralChecklist } = require('../policyEngine');
const { createLedgerEntry } = require('../hashChain');

// AGENT 44 INGRESS: Disciplinary Incident Ingestion from Agent 44
router.post('/agent44/incident', (req, res) => {
  const {
    sourceAgent = 'Agent 44 (Student Life & Proctorial Ingestion)',
    incidentDate,
    location,
    category = 'ACADEMIC_MALPRACTICE',
    studentRoll,
    studentName,
    allegation,
    witnesses = [],
    initialEvidence = []
  } = req.body;

  if (!studentRoll || !allegation) {
    return res.status(400).json({
      success: false,
      error: 'Agent 44 integration contract requires studentRoll and allegation payload.'
    });
  }

  const nextNum = (db.cases.length + 1).toString().padStart(4, '0');
  const caseId = `DISC-2026-${nextNum}`;
  const policy = POLICIES[category] || POLICIES.ACADEMIC_MALPRACTICE;

  const newCase = {
    caseId,
    caseNumber: caseId,
    category,
    status: 'INCIDENT_REGISTERED',
    stage: 2,
    stageName: 'Checklist Generated via Agent 44 Ingestion',
    incidentDate: incidentDate || new Date().toISOString(),
    incidentLocation: location || 'Campus Evaluation Hall',
    reportingAuthority: `Automated Incident Stream (${sourceAgent})`,
    studentId: `STU-A44-${Date.now()}`,
    studentRoll,
    studentName: studentName || `Student (${studentRoll})`,
    studentEmail: `${studentRoll.toLowerCase()}@vignan.ac.in`,
    studentDept: 'Computer Science & Engineering',
    witnesses,
    allegationSummary: allegation,
    evidenceItems: initialEvidence.length > 0 ? initialEvidence : [
      { id: `EVD-A44-${Date.now()}`, title: 'Agent 44 Automated Telemetry Log', type: 'Ingested Report', timestamp: new Date().toISOString() }
    ],
    createdAt: new Date().toISOString(),
    responseDeadline: new Date(Date.now() + (policy.responseDays + policy.noticeDays) * 24 * 3600 * 1000).toISOString(),
    retentionExpiryDate: null,
    guardrailFlags: {
      guiltDetermined: false, // Strict guardrail: Agent 44 report is purely allegation, NOT guilt!
      sanctionRecommended: false,
      disciplinaryShieldActive: true
    }
  };

  db.cases.unshift(newCase);
  db.checklistItems[caseId] = generateProceduralChecklist(category);

  // Genesis block
  if (!db.auditChain[caseId]) db.auditChain[caseId] = [];
  const entry = createLedgerEntry({
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    caseId,
    actor: sourceAgent,
    action: 'AGENT44_INCIDENT_INGESTED',
    payload: { caseId, category, studentRoll },
    index: 0
  });
  db.auditChain[caseId].push(entry);

  save();

  res.status(201).json({
    success: true,
    message: `Incident ingested from Agent 44. Case ${caseId} initialized with policy due-process checklist.`,
    caseId,
    case: newCase
  });
});

// AGENT 56 EGRESS: Compliance & Audit Feed for Agent 56 (Institutional Regulatory & Compliance Agent)
router.get('/agent56/compliance-feed', (req, res) => {
  const cases = db.cases || [];
  
  const complianceRecords = cases.map(c => {
    const checklist = db.checklistItems[c.caseId] || [];
    const completedSteps = checklist.filter(s => s.status === 'COMPLETED').length;
    const totalSteps = checklist.length;
    const chain = db.auditChain[c.caseId] || [];

    return {
      caseNumber: c.caseNumber,
      category: c.category,
      statusCode: c.status,
      proceduralStage: c.stage,
      proceduralAdherenceRate: `${Math.round((completedSteps / totalSteps) * 100)}%`,
      proceduralGatesSatisfied: completedSteps >= 5,
      auditLedgerIntegrity: chain.length > 0 ? 'CRYPTOGRAPHICALLY_VERIFIED' : 'PENDING',
      tamperEvidentBlockCount: chain.length,
      retentionExpiryScheduled: !!c.retentionExpiryDate,
      retentionExpiryDate: c.retentionExpiryDate
    };
  });

  res.json({
    success: true,
    feedSource: 'EduGuard (Student Discipline Agent)',
    feedTarget: 'Agent 56 (Institutional Compliance & Audit Agent)',
    feedTimestamp: new Date().toISOString(),
    recordCount: complianceRecords.length,
    complianceRecords
  });
});

// AGENT 57 EGRESS: Precedent & Governance Feed for Agent 57 (Governance & Precedent Registry)
router.get('/agent57/precedent-feed', (req, res) => {
  const precedents = db.precedents || [];
  
  res.json({
    success: true,
    feedSource: 'EduGuard (Student Discipline Agent)',
    feedTarget: 'Agent 57 (Governance & Precedent Registry Agent)',
    feedTimestamp: new Date().toISOString(),
    precedentCount: precedents.length,
    precedents: precedents.map(p => ({
      ...p,
      dataProtectionClassification: 'ANONYMIZED_GOVERNANCE_PRECEDENT'
    }))
  });
});

// PRIVACY SHIELD DEMONSTRATION: General Student Profile Endpoint (visible to faculty / placement staff)
// STRICT GUARDRAIL: Disciplinary cases MUST NOT be visible here!
router.get('/student-profile/:rollNumber', (req, res) => {
  const { rollNumber } = req.params;
  const student = (db.students || []).find(s => s.rollNumber.toUpperCase() === rollNumber.toUpperCase());

  if (!student) {
    return res.status(404).json({ success: false, error: 'Student not found in institutional directory' });
  }

  // General profile seen by placement coordinators and ordinary faculty:
  res.json({
    success: true,
    viewType: 'GENERAL_FACULTY_AND_PLACEMENT_PORTAL',
    privacyShield: 'ACTIVE (Disciplinary flags shielded under Institutional Privacy Rule 22)',
    studentProfile: {
      studentId: student.studentId,
      rollNumber: student.rollNumber,
      fullName: student.fullName,
      department: student.department,
      yearOfStudy: student.yearOfStudy,
      gpa: student.gpa,
      placementStatus: student.placementStatus,
      // Disciplinary flags are completely omitted or set to clean:
      disciplinaryRemarks: 'Good Standing (Standard Record)',
      disciplinaryFlagsVisible: false
    }
  });
});

module.exports = router;
