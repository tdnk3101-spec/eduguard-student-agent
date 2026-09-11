import React from 'react';
import { CheckCircle, Clock, AlertTriangle, Lock, FileText, Scale } from './Icons';

export function StatusBadge({ status }) {
  switch (status) {
    case 'INCIDENT_REGISTERED':
      return (
        <span className="badge badge-blue">
          <FileText size={12} /> Registered
        </span>
      );
    case 'NOTICE_ISSUED':
      return (
        <span className="badge badge-amber">
          <Clock size={12} /> Notice Dispatched
        </span>
      );
    case 'RESPONSE_RECEIVED':
      return (
        <span className="badge badge-purple">
          <CheckCircle size={12} /> Response Recorded
        </span>
      );
    case 'HEARING_CONVENED':
      return (
        <span className="badge badge-purple">
          <Scale size={12} /> Hearing Convened
        </span>
      );
    case 'SANCTION_IN_PROGRESS':
      return (
        <span className="badge badge-amber">
          <Clock size={12} /> Sanction In Progress
        </span>
      );
    case 'COMPLIANCE_VERIFIED':
      return (
        <span className="badge badge-green">
          <CheckCircle size={12} /> Compliance Verified
        </span>
      );
    case 'CLOSED_RETENTION_ACTIVE':
      return (
        <span className="badge badge-slate">
          <Lock size={12} /> Closed (Retention Active)
        </span>
      );
    case 'DISMISSED_EXONERATED':
      return (
        <span className="badge badge-green">
          <CheckCircle size={12} /> Exonerated / Dismissed
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="badge badge-green">
          <CheckCircle size={12} /> Completed
        </span>
      );
    case 'PENDING':
      return (
        <span className="badge badge-slate">
          <Clock size={12} /> Pending
        </span>
      );
    default:
      return (
        <span className="badge badge-slate">
          {status}
        </span>
      );
  }
}

export function CategoryBadge({ category }) {
  switch (category) {
    case 'ACADEMIC_MALPRACTICE':
      return <span className="badge badge-blue">Academic Malpractice</span>;
    case 'CAMPUS_MISCONDUCT':
      return <span className="badge badge-amber">Campus Misconduct</span>;
    case 'ANTI_RAGGING_HARASSMENT':
      return <span className="badge badge-red">Anti-Ragging / Harassment</span>;
    case 'EXAMINATION_INFRACTION':
      return <span className="badge badge-purple">Examination Malpractice</span>;
    case 'SUBSTANCE_ABUSE_VIOLATION':
      return <span className="badge badge-red">Substance Abuse</span>;
    default:
      return <span className="badge badge-slate">{category}</span>;
  }
}
