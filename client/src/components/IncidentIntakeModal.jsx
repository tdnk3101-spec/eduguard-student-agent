import React, { useState } from 'react';
import { X, Plus, Shield, FileText, AlertTriangle, CheckCircle } from './Icons';
import { api } from '../api/client';

export function IncidentIntakeModal({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('ACADEMIC_MALPRACTICE');
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().slice(0, 16));
  const [incidentLocation, setIncidentLocation] = useState('Main Academic Block - Examination Hall B');
  const [reportingAuthority, setReportingAuthority] = useState('Prof. A. N. Murthy (Proctorial Board)');
  const [studentRoll, setStudentRoll] = useState('22BCE1048');
  const [studentName, setStudentName] = useState('Rohan Sharma');
  const [studentEmail, setStudentEmail] = useState('rohan.22bce1048@vignan.ac.in');
  const [studentDept, setStudentDept] = useState('Computer Science & Engineering');
  const [witnesses, setWitnesses] = useState('Lab Assistant K. Ramesh, Student Proctor Divya M.');
  const [allegationSummary, setAllegationSummary] = useState('');
  const [evidenceName, setEvidenceName] = useState('Invigilator_Confiscation_Report.pdf');

  function applyPreset(presetType) {
    if (presetType === 'exam') {
      setCategory('EXAMINATION_INFRACTION');
      setIncidentLocation('University Examination Center - Hall 102');
      setReportingAuthority('Hall Superintendent Dr. V. Narayana');
      setStudentRoll('24CSE1120');
      setStudentName('Priya Sundaram');
      setStudentEmail('priya.24cse1120@vignan.ac.in');
      setStudentDept('Computer Science & Engineering');
      setWitnesses('Invigilator M. Swetha, Hall Proctor K. Rao');
      setAllegationSummary('Observed referencing unauthorized handwritten formula notes concealed inside university-issued mathematical calculator lid during End-Semester Discrete Mathematics examination.');
      setEvidenceName('Confiscated_Calculator_Specimen_Form.pdf');
    } else if (presetType === 'hostel') {
      setCategory('CAMPUS_MISCONDUCT');
      setIncidentLocation('Hostel Complex 2 - South Wing Corridor');
      setReportingAuthority('Resident Warden Er. G. Prasad');
      setStudentRoll('21MECH1015');
      setStudentName('Vikram Patel');
      setStudentEmail('vikram.21mech1015@vignan.ac.in');
      setStudentDept('Mechanical Engineering');
      setWitnesses('Night Security Guard B. Ramana');
      setAllegationSummary('Non-compliance with hostel quiet hours curfew (23:30 PM), causing noise disturbance with high-wattage sound equipment, and refusal to comply with warden directive.');
      setEvidenceName('Warden_Night_Log_Sheet.pdf');
    } else if (presetType === 'academic') {
      setCategory('ACADEMIC_MALPRACTICE');
      setIncidentLocation('AI & Data Engineering Laboratory');
      setReportingAuthority('Dr. S. K. Narayanan (Course Coordinator)');
      setStudentRoll('22BCE1048');
      setStudentName('Rohan Sharma');
      setStudentEmail('rohan.22bce1048@vignan.ac.in');
      setStudentDept('Computer Science & Engineering');
      setWitnesses('Lab Assistant Ramesh, TA Divya');
      setAllegationSummary('Unattributed copy-paste of proprietary code repository for final evaluation lab submission without license attribution or original documentation.');
      setEvidenceName('Code_Similarity_Report_88pct.pdf');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!allegationSummary.trim()) {
      alert('Please enter a description of the reported incident.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.createCase({
        category,
        incidentDate: new Date(incidentDate).toISOString(),
        incidentLocation,
        reportingAuthority,
        studentRoll,
        studentName,
        studentEmail,
        studentDept,
        witnesses: witnesses.split(',').map(w => w.trim()).filter(Boolean),
        allegationSummary,
        evidenceItems: [
          {
            id: `EVD-${Date.now()}`,
            title: evidenceName || 'Initial Incident Intake Filing',
            type: 'Primary Evidence Document',
            timestamp: new Date().toISOString()
          }
        ]
      });

      if (onSuccess) onSuccess(res.case);
      onClose();
    } catch (err) {
      alert('Error creating case: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '820px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Plus size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#0a2540' }}>
                Stage 1 — Register Disciplinary Incident
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Assigns unique Case ID and generates statutory policy due-process checklist
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '0.35rem' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className="modal-body">
            {/* Quick Presets Bar */}
            <div style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              padding: '0.65rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8' }}>
                Quick Autofill Test Presets:
              </span>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                  onClick={() => applyPreset('exam')}
                >
                  Exam Malpractice
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                  onClick={() => applyPreset('hostel')}
                >
                  Hostel Misconduct
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                  onClick={() => applyPreset('academic')}
                >
                  Lab Code Copying
                </button>
              </div>
            </div>

            {/* Guardrail Reminder */}
            <div className="guardrail-box" style={{ marginBottom: '1.25rem' }}>
              <Shield size={18} style={{ color: '#16a34a' }} />
              <div style={{ fontSize: '0.78rem', color: '#065f46' }}>
                <strong>Due-Process Principle:</strong> This intake form records the allegation and establishes chain-of-custody. It is <strong>NOT</strong> a finding of guilt.
              </div>
            </div>

            {/* Policy Category Selection */}
            <div className="form-group">
              <label className="form-label">Offence Category (Selects Prescribed Institutional Policy)</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="ACADEMIC_MALPRACTICE">Academic Malpractice (POL-ACAD-01 • Notice: 3d • Quorum: 3)</option>
                <option value="CAMPUS_MISCONDUCT">Hostel & Campus Misconduct (POL-CAMP-02 • Notice: 2d • Quorum: 2)</option>
                <option value="ANTI_RAGGING_HARASSMENT">Harassment & Anti-Ragging (POL-RAGG-03 • Urgent 24h Notice • Quorum: 4)</option>
                <option value="EXAMINATION_INFRACTION">Semester Examination Infraction (POL-EXAM-04 • Notice: 2d • Quorum: 3)</option>
                <option value="SUBSTANCE_ABUSE_VIOLATION">Substance Abuse Violation (POL-SUBST-05 • Notice: 2d • Quorum: 3)</option>
              </select>
            </div>

            {/* Student Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Student Roll Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={studentRoll}
                  onChange={(e) => setStudentRoll(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  className="form-input"
                  value={studentDept}
                  onChange={(e) => setStudentDept(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Incident Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Date & Time of Incident</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Incident Location</label>
                <input
                  type="text"
                  className="form-input"
                  value={incidentLocation}
                  onChange={(e) => setIncidentLocation(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Reporting Faculty / Authority</label>
                <input
                  type="text"
                  className="form-input"
                  value={reportingAuthority}
                  onChange={(e) => setReportingAuthority(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Witnesses (Comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  value={witnesses}
                  onChange={(e) => setWitnesses(e.target.value)}
                />
              </div>
            </div>

            {/* Allegation Summary */}
            <div className="form-group">
              <label className="form-label">Incident Description & Specific Allegation</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Provide factual details of the observed irregularity or report..."
                value={allegationSummary}
                onChange={(e) => setAllegationSummary(e.target.value)}
                required
              />
            </div>

            {/* Initial Evidence */}
            <div className="form-group">
              <label className="form-label">Primary Evidence Document</label>
              <input
                type="text"
                className="form-input"
                value={evidenceName}
                onChange={(e) => setEvidenceName(e.target.value)}
                placeholder="e.g. Invigilator_Confiscation_Report.pdf"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Plus size={16} />
              <span>{loading ? 'Registering...' : 'Register Incident & Generate Case ID'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
