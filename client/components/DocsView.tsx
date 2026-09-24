import React, { useState } from 'react';
import { Database, FileCode, Terminal, BookOpen, Copy, Check } from 'lucide-react';

export const DocsView: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const curlAsk = `curl -X POST http://localhost:3000/api/study/ask \\
  -H "Content-Type: application/json" \\
  -d '{
    "subject": "Java",
    "question": "What is Polymorphism?"
  }'`;

  const curlHistory = `curl -X GET http://localhost:3000/api/study/history`;

  const curlDelete = `curl -X DELETE http://localhost:3000/api/study/<DOCUMENT_ID>`;

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-header bg-dark text-white py-3">
        <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
          <FileCode size={20} className="text-info" />
          API Documentation & MongoDB Schema
        </h5>
        <small className="opacity-75">
          Reference guide for REST routes, Mongoose schema, and terminal cURL commands.
        </small>
      </div>

      <div className="card-body p-4">
        {/* Section 1: REST Endpoints */}
        <div className="mb-5">
          <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">
            1. REST API Endpoints
          </h5>

          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Method</th>
                  <th>Endpoint</th>
                  <th>Request Body</th>
                  <th>Status Codes</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span className="badge bg-primary px-2 py-1">POST</span>
                  </td>
                  <td>
                    <code>/api/study/ask</code>
                  </td>
                  <td>
                    <pre className="mb-0 small bg-light p-1 rounded">
                      {`{
  "subject": "Java" | "Python" | "DBMS" | ...,
  "question": "string (min 3 chars)"
}`}
                    </pre>
                  </td>
                  <td>
                    <span className="badge bg-success me-1">201</span>
                    <span className="badge bg-warning text-dark me-1">400</span>
                    <span className="badge bg-danger">500</span>
                  </td>
                  <td>
                    Sends question to Express, queries Gemini LLM via prompt builder, saves structured answer in MongoDB, and returns saved document.
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="badge bg-success px-2 py-1">GET</span>
                  </td>
                  <td>
                    <code>/api/study/history</code>
                  </td>
                  <td>
                    <em>None</em>
                  </td>
                  <td>
                    <span className="badge bg-success me-1">200</span>
                    <span className="badge bg-danger">500</span>
                  </td>
                  <td>
                    Retrieves all saved Q&A documents from MongoDB sorted by <code>createdAt: -1</code> (newest first).
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="badge bg-danger px-2 py-1">DELETE</span>
                  </td>
                  <td>
                    <code>/api/study/:id</code>
                  </td>
                  <td>
                    <em>None (URL param: id)</em>
                  </td>
                  <td>
                    <span className="badge bg-success me-1">200</span>
                    <span className="badge bg-warning text-dark me-1">404</span>
                    <span className="badge bg-danger">500</span>
                  </td>
                  <td>
                    Deletes a specific study question document from MongoDB by its unique <code>_id</code>.
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="badge bg-info text-dark px-2 py-1">GET</span>
                  </td>
                  <td>
                    <code>/api/study/info</code>
                  </td>
                  <td>
                    <em>None</em>
                  </td>
                  <td>
                    <span className="badge bg-success">200</span>
                  </td>
                  <td>
                    Returns project metadata, endpoint list, and database connection mode.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: MongoDB Mongoose Schema */}
        <div className="mb-5">
          <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
            <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
              <Database size={19} className="text-success" />
              2. MongoDB Schema (Mongoose)
            </h5>
            <span className="badge bg-secondary font-monospace">server/models/StudyItem.ts</span>
          </div>

          <div className="bg-dark text-light p-3 rounded font-monospace small position-relative">
            <pre className="mb-0 text-white" style={{ fontSize: '0.83rem' }}>
{`import mongoose from 'mongoose';

const studyItemSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    enum: ['Java', 'Python', 'DBMS', 'Operating Systems', 'Computer Networks', 'Other']
  },
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
    minlength: [3, 'Question must be at least 3 characters long']
  },
  explanation: {
    type: String,
    required: [true, 'Explanation is required']
  },
  example: {
    type: String,
    required: [true, 'Example is required']
  },
  summary: {
    type: String,
    required: [true, 'Summary is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export const StudyItem = mongoose.models.StudyItem || mongoose.model('StudyItem', studyItemSchema);`}
            </pre>
          </div>
        </div>

        {/* Section 3: Testing with cURL */}
        <div>
          <h5 className="fw-bold text-dark border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
            <Terminal size={19} className="text-primary" />
            3. Test Endpoints in Terminal / Postman
          </h5>

          <div className="row g-3">
            <div className="col-12 col-lg-6">
              <div className="card h-100 border">
                <div className="card-header bg-light py-2 d-flex justify-content-between align-items-center">
                  <span className="fw-bold small">Ask Question (POST)</span>
                  <button
                    className="btn btn-sm btn-link p-0 text-decoration-none"
                    onClick={() => copyToClipboard(curlAsk, 'ask')}
                  >
                    {copiedCode === 'ask' ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="card-body bg-dark text-light p-2 font-monospace small">
                  <pre className="mb-0 text-white" style={{ fontSize: '0.78rem' }}>{curlAsk}</pre>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="card h-100 border">
                <div className="card-header bg-light py-2 d-flex justify-content-between align-items-center">
                  <span className="fw-bold small">Get History & Delete (GET / DELETE)</span>
                  <button
                    className="btn btn-sm btn-link p-0 text-decoration-none"
                    onClick={() => copyToClipboard(curlHistory, 'history')}
                  >
                    {copiedCode === 'history' ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="card-body bg-dark text-light p-2 font-monospace small">
                  <pre className="mb-0 text-white" style={{ fontSize: '0.78rem' }}>{curlHistory + '\n\n' + curlDelete}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
