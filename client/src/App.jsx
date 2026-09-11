import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { CaseDetail } from './pages/CaseDetail';
import { CommitteeDesk } from './pages/CommitteeDesk';
import { StudentPortal } from './pages/StudentPortal';
import { GovernanceReport } from './pages/GovernanceReport';
import { HashChainModal } from './components/HashChainModal';
import { NoticeModal } from './components/NoticeModal';
import { AgentSandboxModal } from './components/AgentSandboxModal';
import { IncidentIntakeModal } from './components/IncidentIntakeModal';
import { Shield } from './components/Icons';

export default function App() {
  const [activeRole, setActiveRole] = useState('admin');
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState(null);

  // Modals state
  const [hashChainCaseId, setHashChainCaseId] = useState(null);
  const [activeNotice, setActiveNotice] = useState(null);
  const [showSandbox, setShowSandbox] = useState(false);
  const [showIntake, setShowIntake] = useState(false);

  // Handlers
  function handleSelectCase(caseId) {
    setSelectedCaseId(caseId);
    setCurrentView('case-detail');
  }

  function handleBackToDashboard() {
    setSelectedCaseId(null);
    setCurrentView('dashboard');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <Navbar
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenIntake={() => setShowIntake(true)}
        onOpenSandbox={() => setShowSandbox(true)}
      />

      {/* Main Content Area */}
      <main className="app-container" style={{ flex: 1, padding: '1.75rem 1.5rem 3rem' }}>
        {currentView === 'dashboard' && (
          <Dashboard
            onSelectCase={handleSelectCase}
            onOpenIntake={() => setShowIntake(true)}
            onOpenSandbox={() => setShowSandbox(true)}
            onOpenHashChain={(cid) => setHashChainCaseId(cid)}
          />
        )}

        {currentView === 'case-detail' && selectedCaseId && (
          <CaseDetail
            caseId={selectedCaseId}
            onBack={handleBackToDashboard}
            onOpenHashChain={(cid) => setHashChainCaseId(cid)}
            onOpenNotice={(notice) => setActiveNotice(notice)}
            activeRole={activeRole}
          />
        )}

        {currentView === 'committee' && (
          <CommitteeDesk
            onSelectCase={handleSelectCase}
          />
        )}

        {currentView === 'student' && (
          <StudentPortal
            onOpenNotice={(notice) => setActiveNotice(notice)}
            onSelectCase={handleSelectCase}
          />
        )}

        {currentView === 'governance' && (
          <GovernanceReport />
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: '#0a2540', color: '#94a3b8', padding: '2rem 1.5rem', borderTop: '1px solid #1e3a8a', fontSize: '0.8rem' }}>
        <div className="app-container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              background: '#2563eb',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield size={18} />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.9rem' }}>
                EduGuard — Student Discipline Agent
              </div>
              <div>Autonomous Policy & Due-Process Management System • Vignan's Institute</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.75rem' }}>
            <span>NAAC A+</span>
            <span>•</span>
            <span>NIRF Ranked</span>
            <span>•</span>
            <span>NBA Accredited</span>
            <span>•</span>
            <span>UGC Autonomous</span>
            <span>•</span>
            <span style={{ color: '#60a5fa' }}>Agentic AI Day 2026</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {hashChainCaseId && (
        <HashChainModal
          caseId={hashChainCaseId}
          onClose={() => setHashChainCaseId(null)}
        />
      )}

      {activeNotice && (
        <NoticeModal
          notice={activeNotice}
          onClose={() => setActiveNotice(null)}
          onAcknowledgeSuccess={() => {}}
          isStudentView={activeRole === 'student'}
        />
      )}

      {showSandbox && (
        <AgentSandboxModal
          onClose={() => setShowSandbox(false)}
          onCaseCreated={() => {}}
        />
      )}

      {showIntake && (
        <IncidentIntakeModal
          onClose={() => setShowIntake(false)}
          onSuccess={(newCase) => {
            handleSelectCase(newCase.caseId);
          }}
        />
      )}
    </div>
  );
}
