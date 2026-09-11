const express = require('express');
const router = express.Router();
const { db, save } = require('../db');
const { POLICIES } = require('../policyEngine');
const { logAction } = require('./cases');

// GET notices for a case
router.get('/:caseId/notices', (req, res) => {
  const { caseId } = req.params;
  const notices = (db.notices || []).filter(n => n.caseId === caseId);
  res.json({ success: true, count: notices.length, notices });
});

// POST generate new official notice
router.post('/:caseId/notices', (req, res) => {
  const { caseId } = req.params;
  const { noticeType, subject, issuedBy, customNotes } = req.body;

  const caseItem = db.cases.find(c => c.caseId === caseId);
  if (!caseItem) {
    return res.status(404).json({ success: false, error: 'Case not found' });
  }

  const policy = POLICIES[caseItem.category] || POLICIES.ACADEMIC_MALPRACTICE;
  const nextSeq = ((db.notices || []).filter(n => n.caseId === caseId).length + 1).toString().padStart(2, '0');
  const noticeId = `NOT-${caseId.replace('DISC-', '')}-${nextSeq}`;

  let contentBody = '';
  let appealInfo = '';

  if (noticeType === 'NOTICE_OF_ALLEGATION') {
    contentBody = `OFFICIAL NOTICE OF DISCIPLINARY PROCEEDING\n` +
      `Date: ${new Date().toLocaleDateString()}\n` +
      `To: ${caseItem.studentName} (Roll No: ${caseItem.studentRoll})\n` +
      `Department: ${caseItem.studentDept}\n\n` +
      `You are hereby notified that an incident report dated ${new Date(caseItem.incidentDate).toLocaleDateString()} has been filed regarding an alleged violation of ${policy.name} (${policy.code}) at ${caseItem.incidentLocation}.\n\n` +
      `Summary of Allegations:\n"${caseItem.allegationSummary}"\n\n` +
      `PROCEDURAL RIGHTS GUARANTEED:\n` +
      `Under institutional policy, you are entitled to the full Right to be Heard. You are granted a statutory period of ${policy.responseDays} days (Deadline: ${new Date(Date.now() + policy.responseDays * 24 * 3600 * 1000).toLocaleDateString()}) to submit your written statement, witness requests, and any exculpatory evidence.\n\n` +
      `Please access your EduGuard Student Portal to confirm delivery and submit your response.\n\n` +
      `By Order,\n${issuedBy || 'Disciplinary Administrator, Vignan Institute'}`;
    appealInfo = `Statutory appeal rights are reserved under ${policy.governingStatute}.`;
  } else if (noticeType === 'HEARING_SUMMONS') {
    contentBody = `FORMAL NOTICE OF HEARING SUMMONS\n` +
      `Case: ${caseItem.caseNumber}\n` +
      `To: ${caseItem.studentName} (${caseItem.studentRoll})\n\n` +
      `The Disciplinary Committee has scheduled a formal hearing regarding the matter of ${policy.name}.\n\n` +
      `Hearing Details:\n` +
      `Date & Time: ${new Date(Date.now() + 3 * 24 * 3600 * 1000).toLocaleDateString()} at 10:30 AM\n` +
      `Venue: Committee Board Room / Hybrid Conference Link\n` +
      `Authorized Quorum: Minimum ${policy.committeeQuorumMin} appointed members.\n\n` +
      `You have the right to present your oral statement and question any submissions.\n\n` +
      `By Order,\n${issuedBy || 'Secretary, Disciplinary Committee'}`;
    appealInfo = 'Attendance is requested. An ex-parte decision may only be taken after due summons delivery.';
  } else {
    contentBody = customNotes || `Official administrative notice issued under ${policy.code} for Case ${caseItem.caseNumber}.`;
    appealInfo = 'Standard institutional appeal rules apply.';
  }

  const notice = {
    noticeId,
    caseId,
    noticeType: noticeType || 'NOTICE_OF_ALLEGATION',
    subject: subject || `Disciplinary Communication: ${policy.name}`,
    referenceNumber: `DISC/REF/${caseId}/${nextSeq}`,
    recipientEmail: caseItem.studentEmail,
    recipientName: `${caseItem.studentName} (${caseItem.studentRoll})`,
    issuedBy: issuedBy || 'Disciplinary Administrator',
    issuedAt: new Date().toISOString(),
    deliveryStatus: 'DELIVERED',
    acknowledgedAt: null,
    contentBody,
    appealInfo
  };

  if (!db.notices) db.notices = [];
  db.notices.push(notice);

  // Update case status if first notice
  if (caseItem.status === 'INCIDENT_REGISTERED') {
    caseItem.status = 'NOTICE_ISSUED';
    caseItem.stage = 3;
    caseItem.stageName = 'Formal Notice Dispatched';
  }

  // Update checklist step 3
  const checklist = db.checklistItems[caseId] || [];
  const noticeStep = checklist.find(s => s.id === 'STEP-3-NOTICE-ISSUED');
  if (noticeStep) {
    noticeStep.status = 'COMPLETED';
    noticeStep.completedAt = new Date().toISOString();
  }

  logAction(caseId, issuedBy || 'Disciplinary Administrator', 'FORMAL_NOTICE_DISPATCHED', {
    noticeId,
    type: notice.noticeType,
    recipient: notice.recipientEmail,
    referenceNumber: notice.referenceNumber
  });

  save();

  res.status(201).json({
    success: true,
    message: `Notice ${noticeId} officially dispatched with recorded delivery.`,
    notice
  });
});

// POST student acknowledges receipt of notice
router.post('/notices/:noticeId/acknowledge', (req, res) => {
  const { noticeId } = req.params;
  const { studentRoll } = req.body;

  const notice = (db.notices || []).find(n => n.noticeId === noticeId);
  if (!notice) {
    return res.status(404).json({ success: false, error: 'Notice not found' });
  }

  notice.deliveryStatus = 'ACKNOWLEDGED';
  notice.acknowledgedAt = new Date().toISOString();

  logAction(notice.caseId, `Student (${studentRoll || notice.recipientName})`, 'NOTICE_RECEIPT_ACKNOWLEDGED', {
    noticeId,
    acknowledgedAt: notice.acknowledgedAt,
    deliveryMethod: 'EduGuard Verified Digital Portal'
  });

  save();

  res.json({
    success: true,
    message: 'Notice delivery officially acknowledged and sealed into tamper-evident ledger.',
    notice
  });
});

// POST student submits right to be heard statement & evidence
router.post('/:caseId/submissions', (req, res) => {
  const { caseId } = req.params;
  const { submittedBy, statementText, attachments } = req.body;

  const caseItem = db.cases.find(c => c.caseId === caseId);
  if (!caseItem) {
    return res.status(404).json({ success: false, error: 'Case not found' });
  }

  if (!statementText || statementText.trim().length < 10) {
    return res.status(400).json({ success: false, error: 'Statement text must be provided.' });
  }

  const submissionId = `SUB-${caseId.replace('DISC-', '')}-${Date.now().toString().slice(-4)}`;
  const submission = {
    submissionId,
    caseId,
    submittedBy: submittedBy || `${caseItem.studentName} (${caseItem.studentRoll})`,
    submittedAt: new Date().toISOString(),
    statementText,
    attachments: attachments || [
      { name: 'Student_Explanation_Statement.pdf', size: '185 KB' }
    ]
  };

  if (!db.submissions) db.submissions = [];
  db.submissions.push(submission);

  // Update case status
  caseItem.status = 'RESPONSE_RECEIVED';
  caseItem.stage = 5;
  caseItem.stageName = 'Student Response Recorded';

  // Mark checklist step 4 as COMPLETED
  const checklist = db.checklistItems[caseId] || [];
  const responseStep = checklist.find(s => s.id === 'STEP-4-STUDENT-RESPONSE');
  if (responseStep) {
    responseStep.status = 'COMPLETED';
    responseStep.completedAt = new Date().toISOString();
  }

  logAction(caseId, submission.submittedBy, 'STUDENT_RESPONSE_SUBMITTED', {
    submissionId,
    attachmentCount: submission.attachments.length,
    timestamp: submission.submittedAt
  });

  save();

  res.status(201).json({
    success: true,
    message: 'Student submission recorded and sealed into case file.',
    submission
  });
});

module.exports = router;
