/**
 * EduGuard Policy and Procedural Fairness Engine
 * Enforces institutional guidelines, procedural checklists, and gate checks.
 * STRICT GUARDRAIL: Does not determine guilt or recommend sanctions.
 */

const POLICIES = {
  ACADEMIC_MALPRACTICE: {
    id: 'ACADEMIC_MALPRACTICE',
    code: 'POL-ACAD-01',
    name: 'Academic Dishonesty & Malpractice',
    description: 'Plagiarism in projects, copying during internal exams, unauthorized unauthorized collaboration, or falsification of academic records.',
    noticeDays: 3,
    responseDays: 5,
    hearingMandatory: true,
    committeeQuorumMin: 3,
    decisionAuthority: 'Dean of Academic Affairs & Standing Academic Integrity Committee',
    allowableSanctions: [
      'Written Warning / Formal Reprimand',
      'Mandatory Academic Integrity Remediation Module',
      'Zero Marks in Relevant Component / Coursework',
      'Course Grade Reduction / Course Drop',
      'One Semester Academic Suspension'
    ],
    appealDays: 14,
    retentionYears: 2,
    governingStatute: 'Vignan Institutional Statute Sec 14(B) - Academic Integrity'
  },
  CAMPUS_MISCONDUCT: {
    id: 'CAMPUS_MISCONDUCT',
    code: 'POL-CAMP-02',
    name: 'Hostel & Campus Misconduct',
    description: 'Damage to institutional property, unruly hostel behavior, defiance of proctorial directives, or noise disturbance.',
    noticeDays: 2,
    responseDays: 3,
    hearingMandatory: false,
    committeeQuorumMin: 2,
    decisionAuthority: 'Chief Warden & Dean of Student Welfare',
    allowableSanctions: [
      'Formal Reprimand to Guardian & Student',
      'Restitution / Financial Repair Surcharge',
      'Mandatory Campus Community Service (10 - 40 Hours)',
      'Hostel Eviction (Temporary or Permanent)'
    ],
    appealDays: 10,
    retentionYears: 1,
    governingStatute: 'Vignan Campus Code of Conduct 2024 Reg 8'
  },
  ANTI_RAGGING_HARASSMENT: {
    id: 'ANTI_RAGGING_HARASSMENT',
    code: 'POL-RAGG-03',
    name: 'Harassment & Anti-Ragging Violations',
    description: 'Any act of physical, mental, or cyber ragging, intimidation, bullying, or derogatory conduct towards peers.',
    noticeDays: 1, // Urgent 24-hour response requirement
    responseDays: 2,
    hearingMandatory: true,
    committeeQuorumMin: 4,
    decisionAuthority: 'University Anti-Ragging Cell & Vice Chancellor',
    allowableSanctions: [
      'Suspension from Attending Classes & Academic Privileges',
      'Debarring from Appearing in Any Evaluation / Examination',
      'Withholding / Withdrawing Scholarship / Fellowship',
      'Rustication from the Institution for 1 to 4 Semesters',
      'Expulsion from the Institution & Consequent Debarment'
    ],
    appealDays: 7,
    retentionYears: 5,
    governingStatute: 'UGC Regulations on Curbing the Menace of Ragging (Sec 6)'
  },
  EXAMINATION_INFRACTION: {
    id: 'EXAMINATION_INFRACTION',
    code: 'POL-EXAM-04',
    name: 'Semester Examination Malpractice',
    description: 'Possession of unauthorized electronic or paper material in university exam hall, impersonation, or exam sheet tampering.',
    noticeDays: 2,
    responseDays: 4,
    hearingMandatory: true,
    committeeQuorumMin: 3,
    decisionAuthority: 'Examination Malpractice Committee & Controller of Examinations',
    allowableSanctions: [
      'Cancellation of Examination Paper in Subject',
      'Cancellation of All Semester Examinations',
      'Debarment from University Examinations for 1 Year',
      'Debarment from University Examinations for 2 Years'
    ],
    appealDays: 14,
    retentionYears: 3,
    governingStatute: 'Vignan Examination Ordinance Sec 22'
  },
  SUBSTANCE_ABUSE_VIOLATION: {
    id: 'SUBSTANCE_ABUSE_VIOLATION',
    code: 'POL-SUBST-05',
    name: 'Substance Abuse & Campus Prohibitions',
    description: 'Possession, distribution, or consumption of prohibited substances or alcohol on campus or hostel premises.',
    noticeDays: 2,
    responseDays: 3,
    hearingMandatory: true,
    committeeQuorumMin: 3,
    decisionAuthority: 'Proctorial Board, Dean of Student Affairs & Medical Officer',
    allowableSanctions: [
      'Mandatory De-addiction / Psychological Counseling (8 sessions)',
      'Community Welfare Service (30 Hours)',
      'Suspension of Hostel Residence for 1 Semester',
      'Academic Suspension for 1 Semester'
    ],
    appealDays: 10,
    retentionYears: 3,
    governingStatute: 'Vignan Health & Campus Wellness Code Reg 4'
  }
};

/**
 * Generate policy-mandated procedural checklist for a case
 */
function generateProceduralChecklist(policyKey) {
  const policy = POLICIES[policyKey] || POLICIES.ACADEMIC_MALPRACTICE;

  return [
    {
      id: 'STEP-1-INCIDENT-REGISTERED',
      stepNumber: 1,
      name: 'Incident Report Registered',
      description: 'Capture incident details, date, location, persons involved, and assign unique case ID.',
      mandatory: true,
      status: 'COMPLETED',
      completedAt: new Date().toISOString(),
      gateRequirement: 'Initial filing mandatory to initiate any proceeding'
    },
    {
      id: 'STEP-2-POLICY-CLASSIFIED',
      stepNumber: 2,
      name: 'Offence Category & Jurisdiction Identified',
      description: `Classified under ${policy.name} (${policy.code}). Decision authority: ${policy.decisionAuthority}.`,
      mandatory: true,
      status: 'COMPLETED',
      completedAt: new Date().toISOString(),
      gateRequirement: 'Procedure binds committee to statutory timeline'
    },
    {
      id: 'STEP-3-NOTICE-ISSUED',
      stepNumber: 3,
      name: 'Notice of Allegation Dispatched',
      description: `Formal notice issued with ${policy.noticeDays}-day dispatch window and recorded delivery.`,
      mandatory: true,
      status: 'PENDING',
      completedAt: null,
      gateRequirement: 'Student must receive official notice before any further action'
    },
    {
      id: 'STEP-4-STUDENT-RESPONSE',
      stepNumber: 4,
      name: 'Right to be Heard (Response Window)',
      description: `Student afforded ${policy.responseDays} days to submit written response, statements, and witness list.`,
      mandatory: true,
      status: 'PENDING',
      completedAt: null,
      gateRequirement: 'Mandatory due-process gate: Committee cannot meet without hearing response or expiry of window'
    },
    {
      id: 'STEP-5-COMMITTEE-CONSTITUTION',
      stepNumber: 5,
      name: 'Committee Constitution & Hearing Convened',
      description: `Quorum of min ${policy.committeeQuorumMin} authorized members convened${policy.hearingMandatory ? ' for mandatory formal hearing' : ''}.`,
      mandatory: policy.hearingMandatory,
      status: 'PENDING',
      completedAt: null,
      gateRequirement: 'Quorum verification required before deliberation'
    },
    {
      id: 'STEP-6-DECISION-RECORDED',
      stepNumber: 6,
      name: 'Findings & Sanction Recorded with Reasoned Order',
      description: 'Authorized decision recorded with findings of fact, evidence references, and sanction within policy limits.',
      mandatory: true,
      status: 'PENDING',
      completedAt: null,
      gateRequirement: 'GATE LOCKED: Cannot record decision until Steps 3, 4, and 5 are completed!'
    },
    {
      id: 'STEP-7-APPEAL-COMMUNICATED',
      stepNumber: 7,
      name: 'Decision Order & Appeal Route Communicated',
      description: `Formal order served with ${policy.appealDays}-day statutory appeal window to the Appellate Authority.`,
      mandatory: true,
      status: 'PENDING',
      completedAt: null,
      gateRequirement: 'Notice of appeal route is a mandatory constitutional right'
    },
    {
      id: 'STEP-8-SANCTION-COMPLIANCE',
      stepNumber: 8,
      name: 'Sanction Compliance & Verification',
      description: 'Track fulfillment of assigned requirements (community service, fines, suspension period).',
      mandatory: false, // Activated if sanction is imposed
      status: 'PENDING',
      completedAt: null,
      gateRequirement: 'Closure requires authority verification of completion proof'
    },
    {
      id: 'STEP-9-CASE-CLOSURE-RETENTION',
      stepNumber: 9,
      name: 'Case Closure & Record Expiry Scheduled',
      description: `Case marked closed. Expungement timer initialized for ${policy.retentionYears} years retention.`,
      mandatory: true,
      status: 'PENDING',
      completedAt: null,
      gateRequirement: 'Case file archived and scheduled for automatic purging under policy'
    }
  ];
}

/**
 * Procedural Fairness Gatekeeper:
 * Evaluates whether a case is legally ready for committee decision recording.
 */
function verifyProceduralFairnessGate(checklist, policyKey) {
  const missingSteps = [];

  const noticeStep = checklist.find(s => s.id === 'STEP-3-NOTICE-ISSUED');
  if (!noticeStep || noticeStep.status !== 'COMPLETED') {
    missingSteps.push({
      stepId: 'STEP-3-NOTICE-ISSUED',
      name: 'Notice of Allegation Dispatched',
      reason: 'Formal notice has not been officially issued to the student.'
    });
  }

  const responseStep = checklist.find(s => s.id === 'STEP-4-STUDENT-RESPONSE');
  if (!responseStep || responseStep.status !== 'COMPLETED') {
    missingSteps.push({
      stepId: 'STEP-4-STUDENT-RESPONSE',
      name: 'Student Right to be Heard',
      reason: 'Student response window is still pending or statement has not been recorded.'
    });
  }

  const hearingStep = checklist.find(s => s.id === 'STEP-5-COMMITTEE-CONSTITUTION');
  const policy = POLICIES[policyKey] || POLICIES.ACADEMIC_MALPRACTICE;
  if (policy.hearingMandatory && (!hearingStep || hearingStep.status !== 'COMPLETED')) {
    missingSteps.push({
      stepId: 'STEP-5-COMMITTEE-CONSTITUTION',
      name: 'Committee Constitution & Hearing Convened',
      reason: `Quorum of min ${policy.committeeQuorumMin} authorized members has not been verified.`
    });
  }

  return {
    allowed: missingSteps.length === 0,
    missingSteps,
    message: missingSteps.length === 0 
      ? 'All mandatory procedural gates completed. Committee is authorized to record decision.'
      : `Procedural fairness violation: ${missingSteps.length} mandatory step(s) pending before a decision can be recorded.`
  };
}

/**
 * Calculate record expungement date
 */
function calculateExpiryDate(retentionYears, fromDate = new Date()) {
  const expiry = new Date(fromDate);
  expiry.setFullYear(expiry.getFullYear() + retentionYears);
  return expiry.toISOString();
}

module.exports = {
  POLICIES,
  generateProceduralChecklist,
  verifyProceduralFairnessGate,
  calculateExpiryDate
};
