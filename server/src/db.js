const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'eduguard.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
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
  students: []
};

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf8');
      dbState = JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading DB_FILE, starting with fresh state:', err.message);
  }
}

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbState, null, 2), 'utf8');
  } catch (err) {
    console.error('Error persisting database:', err.message);
  }
}

// Initial load
loadDatabase();

module.exports = {
  get db() {
    return dbState;
  },
  save: saveDatabase,
  reload: loadDatabase
};
