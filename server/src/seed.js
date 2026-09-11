const { db, save } = require('./db');
const { POLICIES, generateProceduralChecklist, calculateExpiryDate } = require('./policyEngine');
const { createLedgerEntry } = require('./hashChain');

function seedDatabase() {
  // If cases already exist and populated, skip re-seeding
  if (db.cases && db.cases.length > 0) {
    return;
  }

  console.log('Seeding EduGuard Disciplinary Database with sample cases, policies, precedents, and hash chains...');

  db.students = [
    {
      studentId: 'STU-2026-1048',
      rollNumber: '22BCE1048',
      fullName: 'Rohan Sharma',
      email: 'rohan.22bce1048@vignan.ac.in',
      department: 'Computer Science & Engineering',
      yearOfStudy: '3rd Year',
      gpa: '8.72',
      placementStatus: 'Eligible (TCS, Microsoft, Cognizant)',
      disciplinaryShieldActive: true
    },
    {
      studentId: 'STU-2026-1092',
      rollNumber: '23ECE1092',
      fullName: 'Ananya Verma',
      email: 'ananya.23ece1092@vignan.ac.in',
      department: 'Electronics & Communication Engineering',
      yearOfStudy: '2nd Year',
      gpa: '9.10',
      placementStatus: 'Eligible',
      disciplinaryShieldActive: true
    },
    {
      studentId: 'STU-2026-1015',
      rollNumber: '21MECH1015',
      fullName: 'Vikram Patel',
      email: 'vikram.21mech1015@vignan.ac.in',
      department: 'Mechanical Engineering',
      yearOfStudy: '4th Year',
      gpa: '7.85',
      placementStatus: 'Eligible',
      disciplinaryShieldActive: true
    },
    {
      studentId: 'STU-2026-1120',
      rollNumber: '24CSE1120',
      fullName: 'Priya Sundaram',
      email: 'priya.24cse1120@vignan.ac.in',
      department: 'Computer Science & Engineering',
      yearOfStudy: '1st Year',
      gpa: '8.95',
      placementStatus: 'Eligible',
      disciplinaryShieldActive: true
    }
  ];

  db.precedents = [
    {
      precedentId: 'PREC-2024-0012',
      category: 'ACADEMIC_MALPRACTICE',
      incidentSummary: 'Submission of cloned open-source GitHub repository for Final Year Capstone Project without attribution.',
      factsConsidered: 'First-time offence; student admitted immediately upon enquiry; no commercial code compromised.',
      mitigatingFactors: ['First-time infraction', 'Cooperative demeanor', 'Voluntary admission before committee'],
      aggravatingFactors: ['Affects major degree evaluation milestone'],
      finalSanction: 'Zero Marks in Component & Mandatory Resubmission under Continuous Faculty Supervision',
      decisionAuthority: 'Standing Academic Integrity Committee',
      academicYear: '2023-2024'
    },
    {
      precedentId: 'PREC-2024-0038',
      category: 'ACADEMIC_MALPRACTICE',
      incidentSummary: 'Possession of micro-cheat sheet during Mid-Semester Database Systems examination.',
      factsConsidered: 'Sheet recovered prior to answering; invigilator reported immediately; invigilator statement corroborated.',
      mitigatingFactors: ['Unused notes', 'Apology tendered in writing'],
      aggravatingFactors: ['Attempted concealment in exam hall'],
      finalSanction: 'Cancellation of Subject Paper & Written Reprimand on Record',
      decisionAuthority: 'Standing Academic Integrity Committee',
      academicYear: '2023-2024'
    },
    {
      precedentId: 'PREC-2025-0004',
      category: 'CAMPUS_MISCONDUCT',
      incidentSummary: 'Damage to hostel common room LED display monitor during late-night recreational argument.',
      factsConsidered: 'Accidental breakage during physical scuffle; two hostel inmates involved.',
      mitigatingFactors: ['Students reported damage promptly to resident warden', 'Both offered joint restitution'],
      aggravatingFactors: ['Hostel curfew violation'],
      finalSanction: 'Full Financial Restitution (50% each) + 20 Hours Campus Library Community Service',
      decisionAuthority: 'Chief Warden & Dean of Student Welfare',
      academicYear: '2024-2025'
    },
    {
      precedentId: 'PREC-2025-0019',
      category: 'ANTI_RAGGING_HARASSMENT',
      incidentSummary: 'Coercive verbal demands and unauthorized night summoning of junior hostel residents.',
      factsConsidered: 'First-year students filed anonymous complaint via anti-ragging box; proctorial enquiry validated time logs.',
      mitigatingFactors: ['No physical assault or battery occurred'],
      aggravatingFactors: ['Hostel power dynamic exploitation', 'Repetitive over 3 consecutive nights'],
      finalSanction: 'Hostel Eviction with Immediate Effect + 1 Semester Suspension of Sports Privileges',
      decisionAuthority: 'University Anti-Ragging Cell',
      academicYear: '2024-2025'
    },
    {
      precedentId: 'PREC-2025-0027',
      category: 'EXAMINATION_INFRACTION',
      incidentSummary: 'Unauthorized programmable smart watch detected transmitting exam question photo during University End-Semester exam.',
      factsConsidered: 'Device confiscated during exam; photo sent via messaging app; external collusion suspected.',
      mitigatingFactors: ['None presented'],
      aggravatingFactors: ['High premeditation', 'Digital transmission across exam perimeter'],
      finalSanction: 'Cancellation of Entire Semester Results & 1-Year University Examination Debarment',
      decisionAuthority: 'Examination Malpractice Committee',
      academicYear: '2024-2025'
    }
  ];

  // Helper to build chain
  function buildChainForCase(caseId, events) {
    const chain = [];
    let prevHash = '0000000000000000000000000000000000000000000000000000000000000000';
    events.forEach((evt, idx) => {
      const entry = createLedgerEntry({
        previousHash: prevHash,
        caseId,
        actor: evt.actor,
        action: evt.action,
        payload: evt.payload,
        index: idx
      });
      chain.push(entry);
      prevHash = entry.hash;
    });
    return chain;
  }

  // CASE 1: Active - Notice issued, waiting for student response (Rohan Sharma)
  const case1Id = 'DISC-2026-0001';
  const case1Checklist = generateProceduralChecklist('ACADEMIC_MALPRACTICE');
  case1Checklist[2].status = 'COMPLETED';
  case1Checklist[2].completedAt = new Date(Date.now() - 24 * 3600 * 1000).toISOString(); // Notice issued yesterday

  db.cases.push({
    caseId: case1Id,
    caseNumber: 'DISC-2026-0001',
    category: 'ACADEMIC_MALPRACTICE',
    status: 'NOTICE_ISSUED',
    stage: 4,
    stageName: 'Student Response Window Active',
    incidentDate: '2026-09-08T14:30:00.000Z',
    incidentLocation: 'Computing Systems Laboratory - Block C, Lab 304',
    reportingAuthority: 'Dr. S. K. Narayanan (Associate Professor, Dept of CSE)',
    studentId: 'STU-2026-1048',
    studentRoll: '22BCE1048',
    studentName: 'Rohan Sharma',
    studentEmail: 'rohan.22bce1048@vignan.ac.in',
    studentDept: 'Computer Science & Engineering',
    witnesses: ['Lab Assistant M. Ramesh', 'Student Invigilator K. Swetha'],
    allegationSummary: 'During the internal laboratory practical evaluation for CS302 (Distributed Systems), student was observed referencing unauthorized digital notes on a hidden secondary terminal window.',
    evidenceItems: [
      { id: 'EVD-01', title: 'Invigilator Incident Form signed by Dr. S. K. Narayanan', type: 'PDF Document', timestamp: '2026-09-08T15:00:00Z' },
      { id: 'EVD-02', title: 'Network Terminal Session Log snippet displaying unauthorized SSH connection', type: 'System Log', timestamp: '2026-09-08T14:35:12Z' },
      { id: 'EVD-03', title: 'Screen capture photograph taken by lab proctor', type: 'Image File', timestamp: '2026-09-08T14:32:00Z' }
    ],
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    responseDeadline: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString(),
    retentionExpiryDate: null,
    guardrailFlags: {
      guiltDetermined: false,
      sanctionRecommended: false,
      disciplinaryShieldActive: true
    }
  });

  db.checklistItems[case1Id] = case1Checklist;

  db.notices.push({
    noticeId: 'NOT-2026-0001-01',
    caseId: case1Id,
    noticeType: 'NOTICE_OF_ALLEGATION',
    subject: 'Official Disciplinary Notice: Report of Academic Irregularity (CS302 Practical)',
    referenceNumber: 'DISC/NOTICE/2026/001',
    recipientEmail: 'rohan.22bce1048@vignan.ac.in',
    recipientName: 'Rohan Sharma (22BCE1048)',
    issuedBy: 'Disciplinary Administrator (Office of Academic Affairs)',
    issuedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    deliveryStatus: 'DELIVERED',
    acknowledgedAt: null,
    contentBody: `Dear Rohan Sharma,\n\nThis is an official communication from the Disciplinary Office of Vignan's Institute. A formal incident report has been registered regarding an alleged procedural irregularity during the CS302 Practical Examination on 08-Sept-2026.\n\nIn accordance with Vignan Institutional Statute Sec 14(B), you are entitled to procedural due process and the Right to be Heard. You are requested to review the allegation details and submit your written response along with any supporting explanations within 5 working days.\n\nPlease log into the EduGuard Student Portal to record your receipt and submit your statement.\n\nSd/-\nDisciplinary Office`,
    appealInfo: 'Appeals are governed by Statute Sec 14(B) following committee findings.'
  });

  db.auditChain[case1Id] = buildChainForCase(case1Id, [
    {
      actor: 'Dr. S. K. Narayanan (Reporting Faculty)',
      action: 'INCIDENT_INTAKE_REGISTERED',
      payload: { caseId: case1Id, category: 'ACADEMIC_MALPRACTICE', rollNumber: '22BCE1048' }
    },
    {
      actor: 'Disciplinary Administrator (Office of Academic Affairs)',
      action: 'POLICY_CLASSIFICATION_ASSIGNED',
      payload: { policyCode: 'POL-ACAD-01', jurisdiction: 'Standing Academic Integrity Committee' }
    },
    {
      actor: 'Disciplinary Administrator',
      action: 'FORMAL_NOTICE_DISPATCHED',
      payload: { noticeId: 'NOT-2026-0001-01', type: 'NOTICE_OF_ALLEGATION', recipient: 'rohan.22bce1048@vignan.ac.in' }
    }
  ]);

  // CASE 2: Hearing completed, ready for Committee Decision recording (Ananya Verma)
  const case2Id = 'DISC-2026-0002';
  const case2Checklist = generateProceduralChecklist('CAMPUS_MISCONDUCT');
  case2Checklist[2].status = 'COMPLETED'; // Notice issued
  case2Checklist[2].completedAt = new Date(Date.now() - 72 * 3600 * 1000).toISOString();
  case2Checklist[3].status = 'COMPLETED'; // Student response received
  case2Checklist[3].completedAt = new Date(Date.now() - 48 * 3600 * 1000).toISOString();
  case2Checklist[4].status = 'COMPLETED'; // Committee convened
  case2Checklist[4].completedAt = new Date(Date.now() - 12 * 3600 * 1000).toISOString();

  db.cases.push({
    caseId: case2Id,
    caseNumber: 'DISC-2026-0002',
    category: 'CAMPUS_MISCONDUCT',
    status: 'HEARING_CONVENED',
    stage: 6,
    stageName: 'Committee Deliberation & Decision Ready',
    incidentDate: '2026-09-04T22:15:00.000Z',
    incidentLocation: 'Girls Hostel Complex - Block B Common Courtyard',
    reportingAuthority: 'Resident Warden Mrs. Geetha Rao',
    studentId: 'STU-2026-1092',
    studentRoll: '23ECE1092',
    studentName: 'Ananya Verma',
    studentEmail: 'ananya.23ece1092@vignan.ac.in',
    studentDept: 'Electronics & Communication Engineering',
    witnesses: ['Security Guard K. Ramana', 'Hostel Prefect Divya K.'],
    allegationSummary: 'Unauthorized after-hours entry past gate closing (22:15 PM), refusal to present university identity card to security personnel, and minor verbal alteration at proctorial checkpoint.',
    evidenceItems: [
      { id: 'EVD-11', title: 'Gate Biometric and Turnstile Exception Log (22:18 PM)', type: 'Automated Gate Log', timestamp: '2026-09-04T22:18:00Z' },
      { id: 'EVD-12', title: 'Security Incident Statement signed by K. Ramana', type: 'Signed Incident Report', timestamp: '2026-09-04T22:45:00Z' }
    ],
    createdAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    responseDeadline: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    retentionExpiryDate: null,
    guardrailFlags: {
      guiltDetermined: false,
      sanctionRecommended: false,
      disciplinaryShieldActive: true
    }
  });

  db.checklistItems[case2Id] = case2Checklist;

  db.submissions.push({
    submissionId: 'SUB-2026-0002-01',
    caseId: case2Id,
    submittedBy: 'Ananya Verma (23ECE1092)',
    submittedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    statementText: 'I respectfully acknowledge arriving after the designated 21:30 PM curfew. Our department robotics team had an emergency test run in the Central Instrumentation Facility that stretched unexpectedly. I had informed my department mentor Dr. Murthy via email at 21:05 PM. When security stopped me, I was distressed and forgot my wallet with ID in the lab. I apologize sincerely for my impatient tone with Guard Ramana and request that the academic context be taken into consideration.',
    attachments: [
      { name: 'Dr_Murthy_Email_Confirmation.pdf', size: '240 KB' },
      { name: 'Robotics_Lab_Bench_Signout_Sheet.png', size: '1.2 MB' }
    ]
  });

  db.notices.push({
    noticeId: 'NOT-2026-0002-01',
    caseId: case2Id,
    noticeType: 'NOTICE_OF_ALLEGATION',
    subject: 'Procedural Notice: Hostel Code of Conduct Irregularity',
    referenceNumber: 'DISC/NOTICE/2026/002',
    recipientEmail: 'ananya.23ece1092@vignan.ac.in',
    recipientName: 'Ananya Verma (23ECE1092)',
    issuedBy: 'Hostel & Campus Disciplinary Sub-Committee',
    issuedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    deliveryStatus: 'ACKNOWLEDGED',
    acknowledgedAt: new Date(Date.now() - 60 * 3600 * 1000).toISOString(),
    contentBody: 'Official notice regarding hostel boundary timings on 04-Sept-2026. Right to reply invoked.',
    appealInfo: 'Appeals are open to the Chief Warden.'
  });

  db.auditChain[case2Id] = buildChainForCase(case2Id, [
    {
      actor: 'Resident Warden Mrs. Geetha Rao',
      action: 'INCIDENT_INTAKE_REGISTERED',
      payload: { caseId: case2Id, category: 'CAMPUS_MISCONDUCT', rollNumber: '23ECE1092' }
    },
    {
      actor: 'Disciplinary Administrator',
      action: 'POLICY_CLASSIFICATION_ASSIGNED',
      payload: { policyCode: 'POL-CAMP-02', authority: 'Hostel & Campus Disciplinary Sub-Committee' }
    },
    {
      actor: 'Disciplinary Administrator',
      action: 'FORMAL_NOTICE_DISPATCHED',
      payload: { noticeId: 'NOT-2026-0002-01', type: 'NOTICE_OF_ALLEGATION' }
    },
    {
      actor: 'Student Ananya Verma (23ECE1092)',
      action: 'NOTICE_RECEIPT_ACKNOWLEDGED',
      payload: { noticeId: 'NOT-2026-0002-01', timestamp: new Date(Date.now() - 60 * 3600 * 1000).toISOString() }
    },
    {
      actor: 'Student Ananya Verma (23ECE1092)',
      action: 'STATEMENT_AND_EVIDENCE_SUBMITTED',
      payload: { submissionId: 'SUB-2026-0002-01', attachmentCount: 2 }
    },
    {
      actor: 'Committee Chair (Prof. R. Krishna)',
      action: 'COMMITTEE_QUORUM_VERIFIED',
      payload: { presentMembers: ['Prof. R. Krishna', 'Dr. Geetha Rao', 'Warden K. Chandra'], quorumCount: 3 }
    }
  ]);

  // CASE 3: Sanction in progress (Vikram Patel)
  const case3Id = 'DISC-2026-0003';
  const case3Checklist = generateProceduralChecklist('CAMPUS_MISCONDUCT');
  case3Checklist.forEach((step, idx) => {
    if (idx <= 6) {
      step.status = 'COMPLETED';
      step.completedAt = new Date(Date.now() - (7 - idx) * 24 * 3600 * 1000).toISOString();
    }
  });

  db.cases.push({
    caseId: case3Id,
    caseNumber: 'DISC-2026-0003',
    category: 'CAMPUS_MISCONDUCT',
    status: 'SANCTION_IN_PROGRESS',
    stage: 8,
    stageName: 'Sanction Compliance Active',
    incidentDate: '2026-08-25T17:00:00.000Z',
    incidentLocation: 'Mechanical Workshop Grounds',
    reportingAuthority: 'Workshop Superintendent Er. B. Naidu',
    studentId: 'STU-2026-1015',
    studentRoll: '21MECH1015',
    studentName: 'Vikram Patel',
    studentEmail: 'vikram.21mech1015@vignan.ac.in',
    studentDept: 'Mechanical Engineering',
    witnesses: ['Tech Assistant V. Anand'],
    allegationSummary: 'Operating hydraulic press equipment without required PPE and leaving workshop safety enclosure unlatched.',
    evidenceItems: [
      { id: 'EVD-21', title: 'Safety Violation Notice #ME-882', type: 'Safety Inspection Report', timestamp: '2026-08-25T17:30:00Z' }
    ],
    createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
    responseDeadline: new Date(Date.now() - 11 * 24 * 3600 * 1000).toISOString(),
    retentionExpiryDate: null,
    guardrailFlags: {
      guiltDetermined: false,
      sanctionRecommended: false,
      disciplinaryShieldActive: true
    }
  });

  db.checklistItems[case3Id] = case3Checklist;

  db.decisions.push({
    decisionId: 'DEC-2026-0003-01',
    caseId: case3Id,
    committeeMembers: ['Er. B. Naidu (Superintendent)', 'Dr. M. K. Rao (Dean Student Welfare)'],
    findingSummary: 'The committee noted the student acknowledged the safety omission promptly and demonstrated regret. In accordance with Campus Code Reg 8, safety enforcement requires educational restitution.',
    sanctionImposed: 'Mandatory Campus Community Service (10 - 40 Hours)',
    sanctionDetails: '15 Hours of Community Service in Central Campus Workshop Safety Audit & Cataloging',
    appealRoute: 'Dean of Academic Administration, Vignan Institute',
    appealDeadline: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
    recordedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    recordedBy: 'Dr. M. K. Rao (Dean Student Welfare)'
  });

  db.sanctions.push({
    sanctionId: 'SANC-2026-0003-01',
    caseId: case3Id,
    title: '15 Hours Workshop Safety Audit Community Service',
    totalHoursRequired: 15,
    hoursCompleted: 9,
    status: 'IN_PROGRESS',
    assignedAuthority: 'Workshop Superintendent Er. B. Naidu',
    dueDate: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString(),
    milestones: [
      { title: 'Toolbox Safety Inventory (5h)', completed: true, verifiedBy: 'Er. B. Naidu' },
      { title: 'Safety Hazard Placard Replacement (4h)', completed: true, verifiedBy: 'Er. B. Naidu' },
      { title: 'First Aid Inspection & Log Documentation (6h)', completed: false, verifiedBy: null }
    ]
  });

  db.auditChain[case3Id] = buildChainForCase(case3Id, [
    { actor: 'Er. B. Naidu', action: 'INCIDENT_INTAKE_REGISTERED', payload: { caseId: case3Id } },
    { actor: 'Disciplinary Admin', action: 'NOTICE_OF_ALLEGATION_SERVED', payload: { student: '21MECH1015' } },
    { actor: 'Student Vikram Patel', action: 'WRITTEN_REPLY_RECORDED', payload: { replyLength: 180 } },
    { actor: 'Committee Chair', action: 'FORMAL_DECISION_RECORDED', payload: { sanction: 'Community Service (15 hrs)' } },
    { actor: 'Compliance Officer', action: 'SANCTION_TRACKER_INITIALIZED', payload: { totalHours: 15 } }
  ]);

  // CASE 4: Closed Case with Retention Countdown Active (Priya Sundaram)
  const case4Id = 'DISC-2026-0004';
  const case4Checklist = generateProceduralChecklist('EXAMINATION_INFRACTION');
  case4Checklist.forEach((step) => {
    step.status = 'COMPLETED';
    step.completedAt = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
  });

  db.cases.push({
    caseId: case4Id,
    caseNumber: 'DISC-2026-0004',
    category: 'EXAMINATION_INFRACTION',
    status: 'CLOSED_RETENTION_ACTIVE',
    stage: 9,
    stageName: 'Case Closed (Retention Countdown Active)',
    incidentDate: '2026-07-15T10:00:00.000Z',
    incidentLocation: 'Exam Hall E-201',
    reportingAuthority: 'Invigilator Prof. S. Ramesh',
    studentId: 'STU-2026-1120',
    studentRoll: '24CSE1120',
    studentName: 'Priya Sundaram',
    studentEmail: 'priya.24cse1120@vignan.ac.in',
    studentDept: 'Computer Science & Engineering',
    witnesses: ['Hall Superintendent Dr. Lakshmi'],
    allegationSummary: 'Inadvertent possession of blank scrap paper containing uncertified arithmetic formulas during Semester 1 Physics exam.',
    evidenceItems: [
      { id: 'EVD-31', title: 'Confiscated Scrap Paper Specimen', type: 'Physical Evidence Specimen', timestamp: '2026-07-15T10:15:00Z' }
    ],
    createdAt: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString(),
    closedAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    retentionExpiryDate: calculateExpiryDate(3, new Date(Date.now() - 30 * 24 * 3600 * 1000)),
    guardrailFlags: {
      guiltDetermined: false,
      sanctionRecommended: false,
      disciplinaryShieldActive: true
    }
  });

  db.checklistItems[case4Id] = case4Checklist;
  db.auditChain[case4Id] = buildChainForCase(case4Id, [
    { actor: 'Invigilator Prof. S. Ramesh', action: 'INCIDENT_INTAKE_REGISTERED', payload: { caseId: case4Id } },
    { actor: 'Disciplinary Administrator', action: 'FULL_PROCEDURAL_CYCLE_COMPLETED', payload: { status: 'CLOSED' } },
    { actor: 'Institutional Records Custodian', action: 'RECORD_RETENTION_TIMER_LOCKED', payload: { policyYears: 3 } }
  ]);

  save();
  console.log('Database seeded successfully with 4 realistic cases across lifecycle stages.');
}

module.exports = {
  seedDatabase
};
