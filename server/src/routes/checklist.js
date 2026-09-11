const express = require('express');
const router = express.Router();
const { db, save } = require('../db');
const { verifyProceduralFairnessGate } = require('../policyEngine');
const { logAction } = require('./cases');

// GET checklist for a case
router.get('/:caseId/checklist', (req, res) => {
  const { caseId } = req.params;
  const checklist = db.checklistItems[caseId];

  if (!checklist) {
    return res.status(404).json({ success: false, error: 'Checklist not found for this case' });
  }

  const caseItem = db.cases.find(c => c.caseId === caseId);
  const gateEvaluation = verifyProceduralFairnessGate(checklist, caseItem ? caseItem.category : 'ACADEMIC_MALPRACTICE');

  res.json({
    success: true,
    caseId,
    checklist,
    gateEvaluation
  });
});

// GET gate-check status
router.get('/:caseId/checklist/gate-check', (req, res) => {
  const { caseId } = req.params;
  const checklist = db.checklistItems[caseId];
  const caseItem = db.cases.find(c => c.caseId === caseId);

  if (!checklist || !caseItem) {
    return res.status(404).json({ success: false, error: 'Case or checklist not found' });
  }

  const gateEvaluation = verifyProceduralFairnessGate(checklist, caseItem.category);
  res.json({
    success: true,
    caseId,
    ...gateEvaluation
  });
});

// PATCH update a checklist step
router.patch('/:caseId/checklist/:stepId', (req, res) => {
  const { caseId, stepId } = req.params;
  const { status, actor, notes } = req.body;

  const checklist = db.checklistItems[caseId];
  if (!checklist) {
    return res.status(404).json({ success: false, error: 'Checklist not found' });
  }

  const step = checklist.find(s => s.id === stepId || s.stepNumber === parseInt(stepId));
  if (!step) {
    return res.status(404).json({ success: false, error: 'Checklist step not found' });
  }

  step.status = status || 'COMPLETED';
  step.completedAt = step.status === 'COMPLETED' ? new Date().toISOString() : null;

  logAction(caseId, actor || 'Authorized Administrator', 'CHECKLIST_STEP_UPDATED', {
    stepId: step.id,
    stepName: step.name,
    newStatus: step.status,
    notes: notes || 'Procedural compliance verified'
  });

  save();

  res.json({
    success: true,
    message: `Step ${step.name} updated to ${step.status}`,
    step,
    checklist
  });
});

module.exports = router;
