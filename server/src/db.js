const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'eduguard.json');
const SQLITE_FILE = path.join(DATA_DIR, 'eduguard.db');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize SQLite database instance
let sqlite;
try {
  sqlite = new DatabaseSync(SQLITE_FILE);
  console.log(`[Database] SQLite connected: ${SQLITE_FILE}`);
  initSqliteTables();
} catch (err) {
  console.error('[Database] Failed to initialize SQLite, falling back to memory:', err.message);
  sqlite = new DatabaseSync(':memory:');
  initSqliteTables();
}

function initSqliteTables() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS cases (
      caseId TEXT PRIMARY KEY,
      caseNumber TEXT,
      studentName TEXT,
      studentRoll TEXT,
      studentDept TEXT,
      category TEXT,
      severity TEXT,
      status TEXT,
      stage TEXT,
      allegationSummary TEXT,
      data JSON,
      createdAt TEXT,
      updatedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS checklist_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      caseId TEXT,
      stepId TEXT,
      stepNumber INTEGER,
      title TEXT,
      status TEXT,
      isGate INTEGER,
      data JSON
    );

    CREATE TABLE IF NOT EXISTS notices (
      noticeId TEXT PRIMARY KEY,
      caseId TEXT,
      caseNumber TEXT,
      noticeType TEXT,
      recipientRoll TEXT,
      delivered INTEGER,
      acknowledged INTEGER,
      data JSON
    );

    CREATE TABLE IF NOT EXISTS submissions (
      submissionId TEXT PRIMARY KEY,
      caseId TEXT,
      studentRoll TEXT,
      submittedAt TEXT,
      data JSON
    );

    CREATE TABLE IF NOT EXISTS decisions (
      decisionId TEXT PRIMARY KEY,
      caseId TEXT,
      findingSummary TEXT,
      policyRangeCompliant INTEGER,
      decisionTimestamp TEXT,
      data JSON
    );

    CREATE TABLE IF NOT EXISTS sanctions (
      sanctionId TEXT PRIMARY KEY,
      caseId TEXT,
      caseNumber TEXT,
      studentRoll TEXT,
      status TEXT,
      data JSON
    );

    CREATE TABLE IF NOT EXISTS audit_chain (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      caseId TEXT,
      blockIndex INTEGER,
      timestamp TEXT,
      actor TEXT,
      action TEXT,
      hash TEXT,
      data JSON
    );

    CREATE TABLE IF NOT EXISTS precedents (
      precedentId TEXT PRIMARY KEY,
      category TEXT,
      incidentSummary TEXT,
      finalSanction TEXT,
      data JSON
    );

    CREATE TABLE IF NOT EXISTS students (
      studentId TEXT PRIMARY KEY,
      rollNumber TEXT UNIQUE,
      fullName TEXT,
      email TEXT,
      department TEXT,
      data JSON
    );

    CREATE TABLE IF NOT EXISTS appeals (
      appealId TEXT PRIMARY KEY,
      caseId TEXT,
      studentRoll TEXT,
      status TEXT,
      data JSON
    );
  `);
}

let dbState = {
  cases: [],
  checklistItems: {}, // caseId -> array of steps
  notices: [],
  submissions: [],
  decisions: [],
  sanctions: [],
  auditChain: {}, // caseId -> array of ledger blocks
  precedents: [],
  students: [],
  appeals: []
};

function syncStateToSqlite() {
  try {
    sqlite.exec('BEGIN TRANSACTION;');

    // 1. Cases
    const insertCase = sqlite.prepare(`
      INSERT OR REPLACE INTO cases (caseId, caseNumber, studentName, studentRoll, studentDept, category, severity, status, stage, allegationSummary, data, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const c of dbState.cases || []) {
      insertCase.run(
        c.caseId || '',
        c.caseNumber || '',
        c.studentName || '',
        c.studentRoll || '',
        c.studentDept || '',
        c.category || '',
        c.severity || '',
        c.status || '',
        c.stage || '',
        c.allegationSummary || '',
        JSON.stringify(c),
        c.createdAt || new Date().toISOString(),
        c.updatedAt || new Date().toISOString()
      );
    }

    // 2. Checklist items
    sqlite.exec('DELETE FROM checklist_items;');
    const insertChecklist = sqlite.prepare(`
      INSERT INTO checklist_items (caseId, stepId, stepNumber, title, status, isGate, data)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    for (const [caseId, steps] of Object.entries(dbState.checklistItems || {})) {
      if (Array.isArray(steps)) {
        for (const s of steps) {
          insertChecklist.run(
            caseId,
            s.stepId || '',
            s.stepNumber || 0,
            s.title || '',
            s.status || '',
            s.isGate ? 1 : 0,
            JSON.stringify(s)
          );
        }
      }
    }

    // 3. Notices
    const insertNotice = sqlite.prepare(`
      INSERT OR REPLACE INTO notices (noticeId, caseId, caseNumber, noticeType, recipientRoll, delivered, acknowledged, data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const n of dbState.notices || []) {
      insertNotice.run(
        n.noticeId || '',
        n.caseId || '',
        n.caseNumber || '',
        n.noticeType || '',
        n.recipientRoll || '',
        n.delivered ? 1 : 0,
        n.acknowledged ? 1 : 0,
        JSON.stringify(n)
      );
    }

    // 4. Submissions
    const insertSub = sqlite.prepare(`
      INSERT OR REPLACE INTO submissions (submissionId, caseId, studentRoll, submittedAt, data)
      VALUES (?, ?, ?, ?, ?)
    `);
    for (const s of dbState.submissions || []) {
      insertSub.run(
        s.submissionId || '',
        s.caseId || '',
        s.studentRoll || '',
        s.submittedAt || '',
        JSON.stringify(s)
      );
    }

    // 5. Decisions
    const insertDec = sqlite.prepare(`
      INSERT OR REPLACE INTO decisions (decisionId, caseId, findingSummary, policyRangeCompliant, decisionTimestamp, data)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    for (const d of dbState.decisions || []) {
      insertDec.run(
        d.decisionId || '',
        d.caseId || '',
        d.findingSummary || '',
        d.policyRangeCompliant ? 1 : 0,
        d.decisionTimestamp || '',
        JSON.stringify(d)
      );
    }

    // 6. Sanctions
    const insertSanc = sqlite.prepare(`
      INSERT OR REPLACE INTO sanctions (sanctionId, caseId, caseNumber, studentRoll, status, data)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    for (const s of dbState.sanctions || []) {
      insertSanc.run(
        s.sanctionId || '',
        s.caseId || '',
        s.caseNumber || '',
        s.studentRoll || '',
        s.status || '',
        JSON.stringify(s)
      );
    }

    // 7. Audit Chain
    sqlite.exec('DELETE FROM audit_chain;');
    const insertAudit = sqlite.prepare(`
      INSERT INTO audit_chain (caseId, blockIndex, timestamp, actor, action, hash, data)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    for (const [caseId, blocks] of Object.entries(dbState.auditChain || {})) {
      if (Array.isArray(blocks)) {
        for (const b of blocks) {
          insertAudit.run(
            caseId,
            b.index || 0,
            b.timestamp || '',
            b.actor || '',
            b.action || '',
            b.hash || '',
            JSON.stringify(b)
          );
        }
      }
    }

    // 8. Precedents
    const insertPrec = sqlite.prepare(`
      INSERT OR REPLACE INTO precedents (precedentId, category, incidentSummary, finalSanction, data)
      VALUES (?, ?, ?, ?, ?)
    `);
    for (const p of dbState.precedents || []) {
      insertPrec.run(
        p.precedentId || '',
        p.category || '',
        p.incidentSummary || '',
        p.finalSanction || '',
        JSON.stringify(p)
      );
    }

    // 9. Students
    const insertStu = sqlite.prepare(`
      INSERT OR REPLACE INTO students (studentId, rollNumber, fullName, email, department, data)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    for (const st of dbState.students || []) {
      insertStu.run(
        st.studentId || '',
        st.rollNumber || '',
        st.fullName || '',
        st.email || '',
        st.department || '',
        JSON.stringify(st)
      );
    }

    // 10. Appeals
    if (dbState.appeals && Array.isArray(dbState.appeals)) {
      const insertApp = sqlite.prepare(`
        INSERT OR REPLACE INTO appeals (appealId, caseId, studentRoll, status, data)
        VALUES (?, ?, ?, ?, ?)
      `);
      for (const a of dbState.appeals) {
        insertApp.run(
          a.appealId || '',
          a.caseId || '',
          a.studentRoll || '',
          a.status || '',
          JSON.stringify(a)
        );
      }
    }

    sqlite.exec('COMMIT;');
  } catch (err) {
    try { sqlite.exec('ROLLBACK;'); } catch (_) {}
    console.error('[Database] Error syncing to SQLite:', err.message);
  }
}

function loadDatabase() {
  try {
    // Check if SQLite already has populated cases
    const caseCountRow = sqlite.prepare('SELECT COUNT(*) as count FROM cases;').get();
    if (caseCountRow && caseCountRow.count > 0) {
      console.log(`[Database] Loading ${caseCountRow.count} cases from SQLite database`);
      
      const casesRows = sqlite.prepare('SELECT data FROM cases;').all();
      dbState.cases = casesRows.map(r => JSON.parse(r.data));

      const checklistRows = sqlite.prepare('SELECT caseId, data FROM checklist_items;').all();
      dbState.checklistItems = {};
      for (const row of checklistRows) {
        if (!dbState.checklistItems[row.caseId]) dbState.checklistItems[row.caseId] = [];
        dbState.checklistItems[row.caseId].push(JSON.parse(row.data));
      }

      const noticeRows = sqlite.prepare('SELECT data FROM notices;').all();
      dbState.notices = noticeRows.map(r => JSON.parse(r.data));

      const subRows = sqlite.prepare('SELECT data FROM submissions;').all();
      dbState.submissions = subRows.map(r => JSON.parse(r.data));

      const decRows = sqlite.prepare('SELECT data FROM decisions;').all();
      dbState.decisions = decRows.map(r => JSON.parse(r.data));

      const sancRows = sqlite.prepare('SELECT data FROM sanctions;').all();
      dbState.sanctions = sancRows.map(r => JSON.parse(r.data));

      const auditRows = sqlite.prepare('SELECT caseId, data FROM audit_chain;').all();
      dbState.auditChain = {};
      for (const row of auditRows) {
        if (!dbState.auditChain[row.caseId]) dbState.auditChain[row.caseId] = [];
        dbState.auditChain[row.caseId].push(JSON.parse(row.data));
      }

      const precRows = sqlite.prepare('SELECT data FROM precedents;').all();
      dbState.precedents = precRows.map(r => JSON.parse(r.data));

      const stuRows = sqlite.prepare('SELECT data FROM students;').all();
      dbState.students = stuRows.map(r => JSON.parse(r.data));

      const appealRows = sqlite.prepare('SELECT data FROM appeals;').all();
      dbState.appeals = appealRows.map(r => JSON.parse(r.data));

      return;
    }

    // Fallback: If SQLite is empty, check JSON backup
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf8');
      dbState = JSON.parse(content);
      if (!dbState.appeals) dbState.appeals = [];
      console.log('[Database] Migrated existing JSON database state into SQLite tables');
      syncStateToSqlite();
    }
  } catch (err) {
    console.error('[Database] Error reading database, starting fresh:', err.message);
  }
}

function saveDatabase() {
  try {
    // 1. Persist to SQLite
    syncStateToSqlite();

    // 2. Persist to JSON backup
    fs.writeFileSync(DB_FILE, JSON.stringify(dbState, null, 2), 'utf8');
  } catch (err) {
    console.error('[Database] Error persisting database:', err.message);
  }
}

// Initial load
loadDatabase();

module.exports = {
  get db() {
    return dbState;
  },
  sqlite,
  save: saveDatabase,
  reload: loadDatabase
};
