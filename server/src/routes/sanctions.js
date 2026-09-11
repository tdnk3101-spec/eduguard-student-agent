const express = require('express');
const router = express.Router();
const { db, save } = require('../db');
const { logAction } = require('./cases');

// GET sanction tracking for a case
router.get('/:caseId/sanctions', (req, res) => {
  const { caseId } = req.params;
  const sanction = (db.sanctions || []).find(s => s.caseId === caseId);
  if (!sanction) {
    return res.status(404).json({ success: false, error: 'No active sanction tracker for this case' });
  }
  res.json({ success: true, sanction });
});

// PATCH update sanction progress or milestone
router.patch('/:caseId/sanctions/:sanctionId', (req, res) => {
  const { caseId, sanctionId } = req.params;
  const { milestoneIndex, verifiedBy, hoursAdded, status, completionNotes } = req.body;

  const sanction = (db.sanctions || []).find(s => s.caseId === caseId);
  if (!sanction) {
    return res.status(404).json({ success: false, error: 'Sanction not found' });
  }

  if (typeof milestoneIndex === 'number' && sanction.milestones[milestoneIndex]) {
    sanction.milestones[milestoneIndex].completed = true;
    sanction.milestones[milestoneIndex].verifiedBy = verifiedBy || 'Department Authority';
    sanction.milestones[milestoneIndex].completedAt = new Date().toISOString();
  }

  if (hoursAdded) {
    sanction.hoursCompleted = Math.min(sanction.totalHoursRequired, (sanction.hoursCompleted || 0) + Number(hoursAdded));
  }

  // Check if all milestones completed
  const allMilestonesDone = sanction.milestones.every(m => m.completed);
  const hoursDone = sanction.totalHoursRequired === 0 || sanction.hoursCompleted >= sanction.totalHoursRequired;

  if (status) {
    sanction.status = status;
  } else if (allMilestonesDone && hoursDone) {
    sanction.status = 'COMPLIANCE_VERIFIED';
    sanction.completedAt = new Date().toISOString();

    // Mark step 8 in checklist as completed
    const checklist = db.checklistItems[caseId] || [];
    const step8 = checklist.find(s => s.id === 'STEP-8-SANCTION-COMPLIANCE');
    if (step8) {
      step8.status = 'COMPLETED';
      step8.completedAt = new Date().toISOString();
    }
  }

  logAction(caseId, verifiedBy || 'Compliance Supervisor', 'SANCTION_PROGRESS_UPDATED', {
    sanctionId,
    status: sanction.status,
    hoursCompleted: sanction.hoursCompleted,
    totalHours: sanction.totalHoursRequired,
    notes: completionNotes || 'Milestone verification logged'
  });

  save();

  res.json({
    success: true,
    message: 'Sanction compliance progress updated and sealed in ledger.',
    sanction
  });
});

module.exports = router;
