import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { SplashScreen } from './components/SplashScreen';
import { IntroPage } from './pages/IntroPage';
import { Dashboard } from './pages/Dashboard';
import { CaseDetail } from './pages/CaseDetail';
import { CommitteeDesk } from './pages/CommitteeDesk';
import { StudentPortal } from './pages/StudentPortal';
import { GovernanceReport } from './pages/GovernanceReport';
import { HashChainModal } from './components/HashChainModal';
import { NoticeModal } from './components/NoticeModal';
import { AgentSandboxModal } from './components/AgentSandboxModal';
import { IncidentIntakeModal } from './components/IncidentIntakeModal';
import { AgentLogo } from './components/AgentLogo';
import { AgentChatbot } from './components/AgentChatbot';
import { AuthDashboard } from './pages/AuthDashboard';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeRole, setActiveRole] = useState('admin');
  const [currentView, setCurrentView] = useState('intro');
  const [selectedCaseId, setSelectedCaseId] = useState(null);

  // Authentication State
  const [currentUser, setCurrentUser] = useState({
    name: 'Dr. K. V. Rao',
    role: 'admin',
    id: 'FAC-EMP-1042',
    dept: 'Office of Student Affairs'
  });
  const [showAuthModal, setShowAuthModal] = useState(false);

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
    setCurrentView('dashboard');
  }

  function handleReplaySplash() {
    setShowSplash(true);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* 1. Opening Flash Screen for Agent 47 with Zoom Transition */}
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}

      {/* 2. Main Dashboard with Zooming Spatial Entrance */}
      <div
        className={!showSplash ? 'animate-zoom-in' : ''}
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          width: '100%'
        }}
      >
        {/* Navigation Bar with New Shield Crest Logo */}
        <Navbar
          activeRole={activeRole}
          setActiveRole={setActiveRole}
          currentView={currentView}
          setCurrentView={setCurrentView}
          currentUser={currentUser}
          onOpenAuth={() => setShowAuthModal(true)}
          onLogout={() => setCurrentUser(null)}
          onOpenIntake={() => setShowIntake(true)}
          onOpenSandbox={() => setShowSandbox(true)}
          onReplaySplash={handleReplaySplash}
        />

        {/* Main Content Area */}
        <main className="app-container" style={{ flex: 1, padding: '1.75rem 1.5rem 3.5rem' }}>
          {currentView === 'intro' && (
            <IntroPage
              onNavigateToWorkspace={() => setCurrentView('dashboard')}
              onOpenIntake={() => setShowIntake(true)}
              onOpenSandbox={() => setShowSandbox(true)}
              onSelectRole={(role) => {
                setActiveRole(role);
                if (role === 'student') setCurrentView('student');
                else if (role === 'committee') setCurrentView('committee');
                else if (role === 'governance') setCurrentView('governance');
                else setCurrentView('dashboard');
              }}
            />
          )}

          {currentView === 'dashboard' && (
            <Dashboard
              selectedCaseId={selectedCaseId}
              onSelectCase={(cid) => handleSelectCase(cid)}
              onOpenIntake={() => setShowIntake(true)}
              onOpenSandbox={() => setShowSandbox(true)}
              onOpenHashChain={(cid) => setHashChainCaseId(cid)}
              onOpenNotice={(notice) => setActiveNotice(notice)}
              activeRole={activeRole}
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

          {currentView === 'auth' && (
            <AuthDashboard
              currentUser={currentUser}
              onLoginSuccess={(user) => {
                setCurrentUser(user);
                setActiveRole(user.role);
              }}
              onLogout={() => setCurrentUser(null)}
              onNavigateToRole={(role) => {
                setActiveRole(role);
                if (role === 'student') setCurrentView('student');
                else if (role === 'committee') setCurrentView('committee');
                else if (role === 'governance') setCurrentView('governance');
                else setCurrentView('dashboard');
              }}
            />
          )}
        </main>

        {/* Global Institutional Footer with New Crest Logo */}
        <footer style={{ background: '#0a1a2f', color: '#94a3b8', padding: '2.5rem 1.5rem', borderTop: '1px solid #1e293b', fontSize: '0.8rem' }}>
          <div className="app-container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', padding: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <AgentLogo size={36} showText={true} glowing={false} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.75rem' }}>
              <span>Consumes Agent 44</span>
              <span>•</span>
              <span>Feeds Agents 56, 57</span>
              <span>•</span>
              <span>NAAC A+ Accredited</span>
              <span>•</span>
              <span>NIRF Ranked</span>
              <span>•</span>
              <span>UGC Autonomous</span>
              <span>•</span>
              <span style={{ color: '#60a5fa', fontWeight: 600 }}>Agentic AI Day 2026</span>
            </div>
          </div>
        </footer>
      </div>

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
          onCaseCreated={(newCase) => {
            handleSelectCase(newCase.caseId);
          }}
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

      {/* Floating Agent 47 AI Advisor Chatbot */}
      <AgentChatbot
        activeRole={activeRole}
        onNavigate={(view) => setCurrentView(view)}
        onOpenIntake={() => setShowIntake(true)}
        onOpenSandbox={() => setShowSandbox(true)}
      />

      {/* Institutional Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentRole={activeRole}
        onRoleChange={(r) => setActiveRole(r)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setActiveRole(user.role);
          if (user.role === 'student') setCurrentView('student');
          else if (user.role === 'committee') setCurrentView('committee');
          else if (user.role === 'governance') setCurrentView('governance');
          else setCurrentView('dashboard');
        }}
      />
    </div>
  );
}
