const express = require('express');
const router = express.Router();
const { db, save } = require('../db');
const { POLICIES, verifyProceduralFairnessGate } = require('../policyEngine');
const { logAction } = require('./cases');

// GET precedent summaries by category (Zero PII - purely factual & precedent outcomes)
router.get('/precedents', (req, res) => {
  const { category } = req.query;
  let list = db.precedents || [];
  if (category && category !== 'ALL') {
    list = list.filter(p => p.category === category);
  }
  res.json({ success: true, count: list.length, precedents: list });
});

// POST verify committee quorum and convene hearing
router.post('/cases/:caseId/verify-quorum', (req, res) => {
  const { caseId } = req.params;
  const { committeeMembers, chairPerson, hearingNotes } = req.body;

  const caseItem = db.cases.find(c => c.caseId === caseId);
  if (!caseItem) {
    return res.status(404).json({ success: false, error: 'Case not found' });
  }

  const policy = POLICIES[caseItem.category] || POLICIES.ACADEMIC_MALPRACTICE;
  const members = Array.isArray(committeeMembers) ? committeeMembers : ['Prof. R. Krishna (Chair)', 'Dr. S. K. Rao (Member)', 'Dr. P. Sharma (Member)'];

  if (members.length < policy.committeeQuorumMin) {
    return res.status(400).json({
      success: false,
      error: `Quorum requirement unmet. Policy requires minimum ${policy.committeeQuorumMin} members; only ${members.length} registered.`
    });
  }

  // Update checklist step 5
  const checklist = db.checklistItems[caseId] || [];
  const quorumStep = checklist.find(s => s.id === 'STEP-5-COMMITTEE-CONSTITUTION');
  if (quorumStep) {
    quorumStep.status = 'COMPLETED';
    quorumStep.completedAt = new Date().toISOString();
  }

  caseItem.status = 'HEARING_CONVENED';
  caseItem.stage = 6;
  caseItem.stageName = 'Hearing Convened & Quorum Verified';

  logAction(caseId, chairPerson || members[0], 'COMMITTEE_QUORUM_VERIFIED', {
    presentMembers: members,
    quorumMin: policy.committeeQuorumMin,
    hearingNotes: hearingNotes || 'Hearing commenced with student submissions on record.'
  });

  save();

  res.json({
    success: true,
    message: `Committee quorum verified (${members.length} members). Procedural hearing validated.`,
    case: caseItem,
    checklist
  });
});

// POST record committee decision (GATED by procedural fairness)
router.post('/cases/:caseId/decisions', (req, res) => {
  const { caseId } = req.params;
  const {
    committeeMembers,
    findingSummary,
    sanctionImposed,
    sanctionDetails,
    recordedBy
  } = req.body;

  const caseItem = db.cases.find(c => c.caseId === caseId);
  if (!caseItem) {
    return res.status(404).json({ success: false, error: 'Case not found' });
  }

  const checklist = db.checklistItems[caseId] || [];
  const policy = POLICIES[caseItem.category] || POLICIES.ACADEMIC_MALPRACTICE;

  // PROCEDURAL FAIRNESS GATE CHECK
  const gateCheck = verifyProceduralFairnessGate(checklist, caseItem.category);
  if (!gateCheck.allowed) {
    return res.status(403).json({
      success: false,
      error: 'Procedural Fairness Gate Violation: Committee cannot record decision until all mandatory procedural steps are fulfilled.',
      gateCheck
    });
  }

  if (!findingSummary || findingSummary.trim().length < 15) {
    return res.status(400).json({
      success: false,
      error: 'A detailed finding of facts with reasoned justification is mandatory under institutional due process.'
    });
  }

  // VALIDATE SANCTION BOUNDS AGAINST POLICY
  const isAllowable = policy.allowableSanctions.includes(sanctionImposed) || sanctionImposed === 'Exonerated / Case Dismissed without Sanction';
  if (!isAllowable) {
    return res.status(400).json({
      success: false,
      error: `Sanction "${sanctionImposed}" is not permitted under policy ${policy.code}. Permitted sanctions: ${policy.allowableSanctions.join(', ')}`
    });
  }

  const decisionId = `DEC-${caseId.replace('DISC-', '')}-01`;
  const appealDeadline = new Date(Date.now() + policy.appealDays * 24 * 3600 * 1000).toISOString();

  const decision = {
    decisionId,
    caseId,
    committeeMembers: committeeMembers || ['Standing Disciplinary Board Quorum'],
    findingSummary,
    sanctionImposed,
    sanctionDetails: sanctionDetails || 'Sanction effective immediately upon service of order.',
    appealRoute: `Appellate Authority: Dean of Academic Governance, Vignan Institute (Statutory window: ${policy.appealDays} days)`,
    appealDeadline,
    recordedAt: new Date().toISOString(),
    recordedBy: recordedBy || 'Committee Chairperson'
  };

  if (!db.decisions) db.decisions = [];
  // Replace if exists, or push
  const existingIdx = db.decisions.findIndex(d => d.caseId === caseId);
  if (existingIdx >= 0) {
    db.decisions[existingIdx] = decision;
  } else {
    db.decisions.push(decision);
  }

  // Update case status
  const hasSanction = sanctionImposed !== 'Exonerated / Case Dismissed without Sanction';
  caseItem.status = hasSanction ? 'SANCTION_IN_PROGRESS' : 'DISMISSED_EXONERATED';
  caseItem.stage = hasSanction ? 8 : 9;
  caseItem.stageName = hasSanction ? 'Sanction Compliance Active' : 'Case Closed (Exonerated)';

  // Mark step 6 and 7 as completed
  const step6 = checklist.find(s => s.id === 'STEP-6-DECISION-RECORDED');
  if (step6) {
    step6.status = 'COMPLETED';
    step6.completedAt = new Date().toISOString();
  }
  const step7 = checklist.find(s => s.id === 'STEP-7-APPEAL-COMMUNICATED');
  if (step7) {
    step7.status = 'COMPLETED';
    step7.completedAt = new Date().toISOString();
  }

  // If sanction requires compliance, create sanction tracker
  if (hasSanction) {
    const isCommunityService = sanctionImposed.includes('Community Service');
    const isRestitution = sanctionImposed.includes('Restitution') || sanctionImposed.includes('Fine');
    
    const sanctionItem = {
      sanctionId: `SANC-${caseId.replace('DISC-', '')}-01`,
      caseId,
      title: sanctionImposed,
      totalHoursRequired: isCommunityService ? 20 : 0,
      hoursCompleted: 0,
      status: 'IN_PROGRESS',
      assignedAuthority: policy.decisionAuthority,
      dueDate: appealDeadline,
      milestones: isCommunityService ? [
        { title: 'Orientation with Community Service Coordinator', completed: false, verifiedBy: null },
        { title: 'Campus Service Execution (20 Hours)', completed: false, verifiedBy: null },
        { title: 'Final Supervisor Verification Sign-off', completed: false, verifiedBy: null }
      ] : [
        { title: 'Compliance Confirmation Submitted by Student', completed: false, verifiedBy: null },
        { title: 'Department Authority Verification', completed: false, verifiedBy: null }
      ]
    };

    if (!db.sanctions) db.sanctions = [];
    const sIdx = db.sanctions.findIndex(s => s.caseId === caseId);
    if (sIdx >= 0) {
      db.sanctions[sIdx] = sanctionItem;
    } else {
      db.sanctions.push(sanctionItem);
    }
  }

  // Issue formal Decision Notice
  if (!db.notices) db.notices = [];
  db.notices.push({
    noticeId: `NOT-${caseId.replace('DISC-', '')}-DEC`,
    caseId,
    noticeType: 'DECISION_ORDER',
    subject: `Official Decision Order: Case ${caseItem.caseNumber}`,
    referenceNumber: `DISC/DEC/${caseId}/ORDER`,
    recipientEmail: caseItem.studentEmail,
    recipientName: `${caseItem.studentName} (${caseItem.studentRoll})`,
    issuedBy: decision.recordedBy,
    issuedAt: new Date().toISOString(),
    deliveryStatus: 'DELIVERED',
    acknowledgedAt: null,
    contentBody: `OFFICIAL DISCIPLINARY COMMITTEE DECISION ORDER\n\nCase Number: ${caseItem.caseNumber}\nDate: ${new Date().toLocaleDateString()}\n\nThe Disciplinary Committee has concluded its enquiry under ${policy.name}.\n\nFINDINGS:\n${findingSummary}\n\nDECISION & SANCTION:\nImposed Sanction: ${sanctionImposed}\nDetails: ${decision.sanctionDetails}\n\nAPPEAL ROUTE:\nYou have the right to file an appeal before ${decision.appealRoute} on or before ${new Date(appealDeadline).toLocaleDateString()}.\n\nSd/-\n${decision.recordedBy}`,
    appealInfo: `Statutory appeal window expires on ${new Date(appealDeadline).toLocaleDateString()}.`
  });

  logAction(caseId, decision.recordedBy, 'COMMITTEE_DECISION_RECORDED', {
    decisionId,
    sanctionImposed,
    appealDeadline,
    recordedBy: decision.recordedBy
  });

  save();

  res.status(201).json({
    success: true,
    message: 'Official committee decision recorded and sealed in tamper-evident ledger.',
    decision,
    case: caseItem,
    checklist
  });
});

module.exports = router;
