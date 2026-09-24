import React from 'react';
import { BookOpen, History, Layers, FileCode, CheckCircle2, Database } from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'history' | 'architecture' | 'docs';
  setCurrentTab: (tab: 'home' | 'history' | 'architecture' | 'docs') => void;
  historyCount: number;
  storageInfo?: { mode: string; isConnected: boolean; hasMongoUri: boolean };
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  historyCount,
  storageInfo,
}) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top border-bottom border-secondary">
      <div className="container">
        {/* Brand */}
        <button
          className="navbar-brand btn btn-link text-decoration-none text-white d-flex align-items-center gap-2 p-0"
          onClick={() => setCurrentTab('home')}
        >
          <div className="bg-primary text-white rounded p-1 d-flex align-items-center justify-content-center">
            <BookOpen size={20} />
          </div>
          <div>
            <span className="fw-bold">AI Study Assistant</span>
            <span className="badge bg-secondary ms-2 text-uppercase font-monospace" style={{ fontSize: '0.65rem' }}>
              Full-Stack MERN + LLM
            </span>
          </div>
        </button>

        {/* Mobile toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#studyNavbar"
          aria-controls="studyNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="studyNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link text-decoration-none ${
                  currentTab === 'home' ? 'active text-primary fw-semibold' : 'text-light'
                }`}
                onClick={() => setCurrentTab('home')}
              >
                <BookOpen size={16} className="me-1 d-inline" />
                Ask Assistant
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-link btn btn-link text-decoration-none position-relative ${
                  currentTab === 'history' ? 'active text-primary fw-semibold' : 'text-light'
                }`}
                onClick={() => setCurrentTab('history')}
              >
                <History size={16} className="me-1 d-inline" />
                History
                {historyCount > 0 && (
                  <span className="badge rounded-pill bg-danger ms-1" style={{ fontSize: '0.7rem' }}>
                    {historyCount}
                  </span>
                )}
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-link btn btn-link text-decoration-none ${
                  currentTab === 'architecture' ? 'active text-primary fw-semibold' : 'text-light'
                }`}
                onClick={() => setCurrentTab('architecture')}
              >
                <Layers size={16} className="me-1 d-inline" />
                Full-Stack Flow
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-link btn btn-link text-decoration-none ${
                  currentTab === 'docs' ? 'active text-primary fw-semibold' : 'text-light'
                }`}
                onClick={() => setCurrentTab('docs')}
              >
                <FileCode size={16} className="me-1 d-inline" />
                API & DB Schema
              </button>
            </li>
          </ul>

          {/* Database / Storage Status indicator */}
          <div className="d-flex align-items-center gap-2 text-light">
            <div
              className={`badge d-flex align-items-center gap-1 py-2 px-3 ${
                storageInfo?.isConnected
                  ? 'bg-success bg-opacity-25 text-success border border-success'
                  : 'bg-info bg-opacity-25 text-info border border-info'
              }`}
              title={
                storageInfo?.isConnected
                  ? 'Connected to real MongoDB database'
                  : 'Running with in-memory Mongoose fallback store'
              }
            >
              <Database size={13} />
              <span>{storageInfo?.mode || 'MongoDB / Mongoose'}</span>
              <CheckCircle2 size={12} className="text-success ms-1" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
