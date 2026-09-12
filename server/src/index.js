const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { seedDatabase } = require('./seed');
const { POLICIES } = require('./policyEngine');

const casesRouter = require('./routes/cases');
const checklistRouter = require('./routes/checklist');
const noticesRouter = require('./routes/notices');
const committeeRouter = require('./routes/committee');
const sanctionsRouter = require('./routes/sanctions');
const governanceRouter = require('./routes/governance');
const integrationsRouter = require('./routes/integrations');
const chatRouter = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Seed initial database state
seedDatabase();

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    agent: 'EduGuard — Student Discipline Agent',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Policies dictionary endpoint
app.get('/api/policies', (req, res) => {
  res.json({
    success: true,
    policies: POLICIES
  });
});

// Mount modular API routers
app.use('/api/cases', casesRouter);
app.use('/api/cases', checklistRouter);
app.use('/api/cases', noticesRouter);
app.use('/api/committee', committeeRouter);
app.use('/api', committeeRouter); // For /api/precedents
app.use('/api/cases', sanctionsRouter);
app.use('/api/reports', governanceRouter);
app.use('/api/integrations', integrationsRouter);
app.use('/api/chat', chatRouter);

// Serve static client build if it exists (production mode)
const clientDist = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(clientDist, 'index.html'));
    }
    next();
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🛡️  EduGuard — Student Discipline Agent`);
  console.log(`🚀  API Backend Server running on http://localhost:${PORT}`);
  console.log(`🔒  Guardrails: Guilt Neutrality & Tamper-Evident Ledger Active`);
  console.log(`=======================================================`);
});
