const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { POLICIES } = require('../policyEngine');

// Intelligent Agent 47 Knowledge Engine
function generateAgentResponse(message, role = 'admin', activeCaseId = null) {
  const query = message.toLowerCase().trim();
  const cases = db.cases || [];
  const precedents = db.precedents || [];

  // 1. Due Process & Checklist inquiries
  if (query.includes('due process') || query.includes('checklist') || query.includes('procedural') || query.includes('requirement')) {
    return {
      text: `### 🛡️ Agent 47 Mandatory Due Process Protocol\n\nUnder University Disciplinary Policy **Section IV (Procedural Fairness)**, every inquiry must adhere to a strict 5-stage gating checklist before sanctions can be considered:\n\n1. **Formal Notice (Stage 1)**: Must be issued within **48 hours** of intake with specific allegations and evidence citations.\n2. **Statutory Response Window (Stage 2)**: The student is guaranteed a minimum **7-day response window** before any committee hearing.\n3. **Evidence Inspection (Stage 3)**: Student & advisor have full access to witness transcripts, logs, and unredacted materials.\n4. **Impartial Committee Constitution (Stage 4)**: Must include at least 1 independent faculty member with zero conflict of interest.\n5. **Right of Appeal (Stage 5)**: A mandatory **14-calendar-day window** to appeal the verdict to the Vice-Chancellor.\n\n*Note: Our Guilt-Neutrality Guardrail strictly prevents committee verdicts until all 5 steps are digitally signed in the audit ledger.*`,
      suggestions: ['Check active case status', 'What is the sanction range?', 'Explain Guilt-Neutrality']
    };
  }

  // 2. Sanction ranges & Penalties
  if (query.includes('sanction') || query.includes('penalty') || query.includes('punishment') || query.includes('range')) {
    return {
      text: `### ⚖️ Institutional Sanction Tier Matrix\n\nSanction ranges are pre-gated by offense category to prevent arbitrary penalties:\n\n- **Minor (Category 1)**: Warning letter, formal reprimand, restorative campus service (max 10 hours), educational reflection module.\n- **Moderate (Category 2)**: Disciplinary probation (1 semester), course grade cap/reduction, restitution for property, community service (up to 30 hours).\n- **Major (Category 3)**: Suspension for 1–2 academic semesters, hostel de-boarding, academic transcript annotation.\n- **Critical (Category 4)**: Permanent expulsion, immediate campus ban, referral to external statutory authorities.\n\n⚠️ *Sanctions exceeding policy bounds are automatically blocked by the Agent 47 Gating Guardrail.*`,
      suggestions: ['What are the rules for plagiarism?', 'How does precedent matching work?', 'Check appeal deadline']
    };
  }

  // 3. Academic Integrity / Plagiarism
  if (query.includes('plagiarism') || query.includes('cheat') || query.includes('academic integrity') || query.includes('exam')) {
    const policy = POLICIES['ACADEMIC_INTEGRITY'];
    return {
      text: `### 📖 Academic Integrity Code (Policy AC-2024)\n\n**Definition**: Unauthorized assistance, plagiarism (>20% similarity), unauthorized GenAI usage on unpermitted assignments, or tampering with grade records.\n\n**Standard Due Process Checklist**:\n- Course instructor must submit original turnitin/similarity report or proctor logs.\n- Student gets 7 days to provide drafting history, source notes, or rebuttal.\n- First-time offenders typically receive Grade 'F' in assignment + warning.\n- Repeat offenses mandate Academic Probation or 1-semester suspension.\n\n*Currently, ${cases.filter(c => c.category === 'ACADEMIC_INTEGRITY').length} active cases are registered under Academic Integrity.*`,
      suggestions: ['Show Academic Integrity cases', 'What is the notice requirement?', 'File new incident']
    };
  }

  // 4. Guilt-Neutrality Guardrail
  if (query.includes('guilt') || query.includes('neutral') || query.includes('bias') || query.includes('guardrail')) {
    return {
      text: `### 🔒 Guilt-Neutrality Guardrail Specification\n\nAgent 47 operates under an absolute **non-convicting constitutional architecture**:\n\n1. **Zero Automated Guilt Determinations**: The AI never generates verdicts, labels a respondent as "guilty", or recommends expulsion without human adjudication.\n2. **Procedural Assistance Only**: The system compiles case files, highlights procedural statutory timelines, and searches historical precedents.\n3. **Neutral Tone Enforcement**: All auto-generated statutory notices use strictly objective, non-accusatory language ("allegation under inquiry" instead of "violation committed").\n4. **Immutable Audit Ledger**: Every action is cryptographically signed using SHA-256 hash chains.`,
      suggestions: ['How does the SHA-256 ledger work?', 'What is the student response window?', 'Multi-Agent contracts']
    };
  }

  // 5. Multi-Agent System (Agent 44, Agent 56, Agent 57)
  if (query.includes('agent 44') || query.includes('agent 56') || query.includes('agent 57') || query.includes('integration') || query.includes('contract') || query.includes('multi-agent')) {
    return {
      text: `### 🤖 Agent 47 Institutional Ecosystem Handshake\n\nAgent 47 serves as the central due-process gateway in the university multi-agent topology:\n\n- **Ingress from Agent 44 (Campus Incident Reporter)**: Ingests structured JSON incident reports with timestamp, geofence, evidence hashes, and witness identifiers.\n- **Agent 47 (Core Processor)**: Classifies policy, spins up procedural checklist, enforces notice windows, and prepares impartial case files.\n- **Egress to Agent 56 (Academic Registrar Agent)**: Dispatches official academic hold notices (e.g. course registration block, semester suspension flag).\n- **Egress to Agent 57 (Campus Security & Hostel Access)**: Dispatches automated NFC card access revocations if hostel suspension is ordered.\n\n*You can test these contracts live in the **Agent Sandbox** tab!*`,
      suggestions: ['Open Agent Sandbox', 'How do notices work?', 'Show case statistics']
    };
  }

  // 6. SHA-256 Ledger & Audit Chain
  if (query.includes('sha-256') || query.includes('hash') || query.includes('ledger') || query.includes('tamper') || query.includes('chain')) {
    return {
      text: `### ⛓️ Tamper-Evident SHA-256 Cryptographic Chain\n\nEvery event in EduGuard (intake, notice dispatch, student response, evidence upload, committee vote) is serialized into an immutable block:\n\n- **Current Block Hash**: \`SHA-256(BlockIndex + PreviousHash + Timestamp + ActionPayload)\`\n- **Chain Validation**: If any historical record is altered in the database, the cryptographic hash linkage breaks instantly and flags a red integrity violation.\n- **Legal Admissibility**: Ensures complete chain-of-custody compliance for external accreditation (NAAC/UGC) and judicial review.`,
      suggestions: ['Verify hash chain', 'What is due process?', 'Show active cases']
    };
  }

  // 7. Case status or active caseload
  if (query.includes('case') || query.includes('active') || query.includes('status') || query.includes('rohan') || query.includes('stats')) {
    const total = cases.length;
    const pending = cases.filter(c => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length;
    const resolved = cases.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;

    return {
      text: `### 📊 Live Caseload Overview\n\n- **Total Registered Cases**: ${total}\n- **In-Progress / Under Inquiry**: ${pending}\n- **Formally Resolved**: ${resolved}\n- **Precedent Corpus**: ${precedents.length} verified historical precedents\n\n*Featured Benchmark Case: **CASE-2024-001 (Rohan Sharma - 22BCE1048)** is currently under committee review for unpermitted GenAI usage with a 7-day notice delivered.*`,
      suggestions: ['Open Case Workspace', 'View Committee Desk', 'Show student notice']
    };
  }

  // 8. Default intelligent response
  return {
    text: `### 🤖 Agent 47 AI Due-Process Assistant\n\nI am your autonomous institutional policy advisor for student disciplinary proceedings. I can assist you with:\n\n- **Policy Gating**: Check offence categories, sanction limits, and mandatory procedural milestones.\n- **Statutory Due Process**: Verify 7-day notice requirements, rights to representation, and 14-day appeal deadlines.\n- **Precedent Matching**: Find historical committee rulings to ensure consistent, non-arbitrary decisions.\n- **Multi-Agent Integrations**: Explain Ingress from Agent 44 and Egress to Agents 56 & 57.\n\nWhat case or policy question can I help you resolve?`,
    suggestions: [
      'What are mandatory due-process requirements?',
      'What is the sanction range for cheating?',
      'Explain the Guilt-Neutrality Guardrail',
      'How does Agent 47 integrate with Agent 44 and 56?'
    ]
  };
}

// POST /api/chat - Process user queries with Agent 47 intelligence
router.post('/', (req, res) => {
  const { message, role = 'admin', caseId = null } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message string is required' });
  }

  const response = generateAgentResponse(message, role, caseId);
  return res.json({
    success: true,
    reply: response.text,
    suggestions: response.suggestions,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
