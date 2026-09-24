import React, { useState } from 'react';
import { Send, Sparkles, AlertCircle, HelpCircle, Terminal } from 'lucide-react';

interface QuestionFormProps {
  onSubmit: (subject: string, question: string) => Promise<void>;
  isLoading: boolean;
}

const SAMPLE_QUESTIONS: Record<string, string[]> = {
  Java: [
    'What is the difference between Abstract Class and Interface in Java?',
    'Explain Java Garbage Collection and how the JVM manages memory.',
    'What is the difference between == and .equals() in Java?',
  ],
  Python: [
    'What is the difference between list, tuple, and set in Python?',
    'Explain Python decorators and how they wrap functions.',
    'What is the Global Interpreter Lock (GIL) and how does it affect multi-threading?',
  ],
  DBMS: [
    'Explain ACID properties in DBMS with a real-world bank transfer example.',
    'What is the difference between Primary Key, Foreign Key, and Unique Key?',
    'Explain 1NF, 2NF, and 3NF database normalization with a sample table.',
  ],
  'Operating Systems': [
    'What is the difference between a process and a thread?',
    'Explain Deadlock conditions (Coffman conditions) and how to prevent it.',
    'What is Virtual Memory and Paging in Operating Systems?',
  ],
  'Computer Networks': [
    'Explain the TCP 3-Way Handshake step-by-step with an analogy.',
    'What is the difference between TCP and UDP, and when should you use each?',
    'What happens under the hood when you type https://google.com in a browser?',
  ],
};

export const QuestionForm: React.FC<QuestionFormProps> = ({ onSubmit, isLoading }) => {
  const [subject, setSubject] = useState<string>('Java');
  const [question, setQuestion] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!question.trim()) {
      setError('Please type a question or select a sample question below.');
      return;
    }

    if (question.trim().length < 3) {
      setError('Question must be at least 3 characters long.');
      return;
    }

    try {
      // Step simulator for student visualization
      setActiveStep(1); // 1: Sending to Express
      setTimeout(() => setActiveStep(2), 1200); // 2: Gemini LLM
      setTimeout(() => setActiveStep(3), 2400); // 3: Saving to MongoDB

      await onSubmit(subject, question.trim());
      setActiveStep(0);
      setQuestion(''); // Clear input on success
    } catch (err: any) {
      setActiveStep(0);
      setError(err.message || 'Failed to get answer. Please check your backend connection.');
    }
  };

  const handleSelectSample = (sampleText: string) => {
    setQuestion(sampleText);
    setError(null);
  };

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-header bg-primary text-white py-3">
        <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
          <Sparkles size={19} />
          Ask Your CS Doubt
        </h5>
        <small className="opacity-75">
          Select a subject, ask any conceptual or coding question, and receive a structured explanation.
        </small>
      </div>

      <div className="card-body p-4">
        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2" role="alert">
            <AlertCircle size={18} />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Subject Dropdown & Quick Badges */}
          <div className="mb-3">
            <label htmlFor="subjectSelect" className="form-label fw-bold text-secondary small text-uppercase">
              1. Select Subject:
            </label>
            <select
              id="subjectSelect"
              className="form-select form-select-lg mb-2 shadow-none border-primary-subtle"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isLoading}
            >
              <option value="Java">☕ Java (OOP, JVM, Collections)</option>
              <option value="Python">🐍 Python (Data structures, Decorators, GIL)</option>
              <option value="DBMS">🗄️ DBMS (SQL, ACID, Normalization, Transactions)</option>
              <option value="Operating Systems">⚙️ Operating Systems (Processes, Threads, Memory, Deadlocks)</option>
              <option value="Computer Networks">🌐 Computer Networks (OSI, TCP/IP, Routing, Protocols)</option>
              <option value="Other">💡 Other CS Topics</option>
            </select>

            {/* Quick Pills */}
            <div className="d-flex flex-wrap gap-2 pt-1">
              {['Java', 'Python', 'DBMS', 'Operating Systems', 'Computer Networks'].map((subj) => (
                <button
                  key={subj}
                  type="button"
                  className={`btn btn-sm ${
                    subject === subj ? 'btn-primary' : 'btn-outline-secondary'
                  } rounded-pill py-1 px-3`}
                  onClick={() => setSubject(subj)}
                  disabled={isLoading}
                >
                  {subj}
                </button>
              ))}
            </div>
          </div>

          {/* Question Textarea */}
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label htmlFor="questionText" className="form-label fw-bold text-secondary small text-uppercase mb-0">
                2. Your Question / Topic:
              </label>
              <span className="text-muted small">
                {question.length} characters
              </span>
            </div>
            <textarea
              id="questionText"
              className="form-control shadow-none border-secondary-subtle"
              rows={4}
              placeholder={`e.g. What is the difference between Abstract Class and Interface in ${subject}?`}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={isLoading}
            ></textarea>
          </div>

          {/* Sample Questions Chips */}
          {SAMPLE_QUESTIONS[subject] && (
            <div className="mb-4 p-3 bg-light rounded border">
              <div className="d-flex align-items-center gap-1 text-muted small fw-bold mb-2">
                <HelpCircle size={14} />
                <span>Try these common exam / interview questions:</span>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {SAMPLE_QUESTIONS[subject].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="btn btn-sm btn-white bg-white border text-start text-dark text-wrap hover-shadow"
                    style={{ fontSize: '0.82rem' }}
                    onClick={() => handleSelectSample(sample)}
                    disabled={isLoading}
                  >
                    👉 {sample}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Progress Indicators if Loading */}
          {isLoading && (
            <div className="alert alert-info py-2 px-3 mb-3 border-info">
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                <strong className="text-dark">Processing Full-Stack Flow...</strong>
              </div>
              <div className="d-flex flex-wrap gap-2 small text-secondary">
                <span className={`badge ${activeStep >= 1 ? 'bg-primary' : 'bg-secondary'}`}>
                  1. React ➔ Express POST
                </span>
                <span className={`badge ${activeStep >= 2 ? 'bg-primary' : 'bg-secondary'}`}>
                  2. Prompt Builder ➔ Gemini LLM
                </span>
                <span className={`badge ${activeStep >= 3 ? 'bg-primary' : 'bg-secondary'}`}>
                  3. Saving to MongoDB
                </span>
                <span className={`badge ${activeStep >= 3 ? 'bg-success' : 'bg-secondary'}`}>
                  4. Returning to React
                </span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="d-grid d-md-flex justify-content-md-end gap-2">
            <button
              type="submit"
              className="btn btn-primary btn-lg px-4 d-flex align-items-center justify-content-center gap-2 shadow-sm"
              disabled={isLoading || !question.trim()}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                  <span>Generating Study Material...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Ask Assistant</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="card-footer bg-light border-top py-2 px-4 d-flex align-items-center gap-2 text-muted small">
        <Terminal size={14} />
        <span>Sends request to <code>POST /api/study/ask</code> ➔ Gemini 3.8 Flash ➔ MongoDB</span>
      </div>
    </div>
  );
};
