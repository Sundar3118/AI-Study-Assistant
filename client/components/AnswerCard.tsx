import React, { useState } from 'react';
import { Lightbulb, Code, BookCheck, Copy, Check, Trash2, Calendar, Tag } from 'lucide-react';
import { StudyItem } from '../services/api';

interface AnswerCardProps {
  item: StudyItem;
  onDelete?: (id: string) => void;
  isNew?: boolean;
}

export const AnswerCard: React.FC<AnswerCardProps> = ({ item, onDelete, isNew }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyExample = () => {
    navigator.clipboard.writeText(item.example);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Java':
        return 'danger';
      case 'Python':
        return 'primary';
      case 'DBMS':
        return 'success';
      case 'Operating Systems':
        return 'warning text-dark';
      case 'Computer Networks':
        return 'info text-dark';
      default:
        return 'secondary';
    }
  };

  const formattedDate = item.createdAt
    ? new Date(item.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        month: 'short',
        day: 'numeric',
      })
    : 'Just now';

  return (
    <div
      className={`card shadow-sm border-0 mb-4 ${
        isNew ? 'border border-2 border-primary' : ''
      }`}
    >
      {/* Card Header */}
      <div className="card-header bg-white py-3 border-bottom d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div className="d-flex align-items-center gap-2">
          <span className={`badge bg-${getSubjectColor(item.subject)} px-3 py-2 fs-6`}>
            <Tag size={14} className="me-1 d-inline" />
            {item.subject}
          </span>
          {isNew && (
            <span className="badge bg-success bg-opacity-25 text-success border border-success">
              Newly Generated
            </span>
          )}
        </div>

        <div className="d-flex align-items-center gap-3 text-muted small">
          <span className="d-flex align-items-center gap-1">
            <Calendar size={14} />
            {formattedDate}
          </span>
          {onDelete && (
            <button
              className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
              onClick={() => onDelete(item._id)}
              title="Delete from MongoDB"
            >
              <Trash2 size={14} />
              <span className="d-none d-sm-inline">Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body p-4">
        {/* Question Title */}
        <div className="mb-4">
          <h5 className="card-title text-dark fw-bold mb-1">
            Q: {item.question}
          </h5>
          <small className="text-muted font-monospace">
            ID: <span className="user-select-all">{item._id}</span>
          </small>
        </div>

        {/* Section 1: Simple Explanation */}
        <div className="mb-4">
          <div className="d-flex align-items-center gap-2 mb-2">
            <div className="p-1 rounded bg-warning bg-opacity-25 text-warning-emphasis">
              <Lightbulb size={18} />
            </div>
            <h6 className="fw-bold mb-0 text-dark">1. Simple Explanation</h6>
          </div>
          <div className="p-3 bg-light rounded border text-secondary leading-relaxed">
            {item.explanation.split('\n').map((para, idx) => (
              <p key={idx} className={idx === item.explanation.split('\n').length - 1 ? 'mb-0' : 'mb-2'}>
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* Section 2: Example */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center gap-2">
              <div className="p-1 rounded bg-primary bg-opacity-25 text-primary">
                <Code size={18} />
              </div>
              <h6 className="fw-bold mb-0 text-dark">2. Concrete Example</h6>
            </div>
            <button
              className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 py-0 px-2"
              onClick={handleCopyExample}
              title="Copy snippet"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-success" />
                  <span className="text-success small">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span className="small">Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="bg-dark text-light p-3 rounded font-monospace small position-relative overflow-auto border border-secondary" style={{ maxHeight: '350px' }}>
            <pre className="mb-0 text-white" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace' }}>
              {item.example}
            </pre>
          </div>
        </div>

        {/* Section 3: Short Summary */}
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <div className="p-1 rounded bg-success bg-opacity-25 text-success">
              <BookCheck size={18} />
            </div>
            <h6 className="fw-bold mb-0 text-dark">3. Short Summary (Quick Takeaway)</h6>
          </div>
          <div className="alert alert-success border-success-subtle mb-0 py-2 px-3">
            <p className="mb-0 fw-medium text-success-emphasis">{item.summary}</p>
          </div>
        </div>
      </div>

      {/* Card Footer: Student note */}
      <div className="card-footer bg-light border-top text-muted small py-2 px-4 d-flex justify-content-between align-items-center">
        <span>✅ Stored in MongoDB collection <code>studyitems</code></span>
        <span className="badge bg-secondary-subtle text-secondary">Structured LLM Output</span>
      </div>
    </div>
  );
};
