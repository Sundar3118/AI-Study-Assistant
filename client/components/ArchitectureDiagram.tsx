import React, { useState } from 'react';
import {
  ArrowRight,
  Code,
  Server,
  Cpu,
  Database,
  Monitor,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  FileJson,
} from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<number>(0);

  const steps = [
    {
      id: 0,
      title: '1. React Frontend (Client)',
      icon: <Monitor size={24} className="text-primary" />,
      badge: 'client/components/QuestionForm.tsx',
      summary: 'Collects subject choice and question text from student form input.',
      details: [
        'User picks a subject (Java, Python, DBMS, OS, Networks) and types a question.',
        'React state (`subject`, `question`) tracks the input.',
        'On submit, React invokes `askStudyQuestion(subject, question)` in `client/services/api.ts`.',
        'Demonstrates client-side state handling, form validation, and clean error feedback.',
      ],
      codeSnippet: `// client/services/api.ts
const response = await fetch('/api/study/ask', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ subject, question })
});`,
    },
    {
      id: 1,
      title: '2. Express REST API Route',
      icon: <Server size={24} className="text-info" />,
      badge: 'server/routes/studyRoutes.ts',
      summary: 'Express endpoint validates request body and coordinates prompt & persistence.',
      details: [
        'Endpoint `POST /api/study/ask` receives the JSON payload.',
        'Validates that `subject` is valid and `question` is at least 3 characters.',
        'Passes data to the dedicated backend prompt builder (never direct from React!).',
        'Demonstrates HTTP status codes (201 Created, 400 Bad Request, 500 Error).',
      ],
      codeSnippet: `// server/routes/studyRoutes.ts
studyRouter.post('/ask', async (req, res) => {
  const { subject, question } = req.body;
  if (!question) return res.status(400).json({ error: 'Question required' });
  const answer = await generateStudyResponse(subject, question);
  const saved = await StudyRepository.create({ subject, question, ...answer });
  res.status(201).json({ success: true, data: saved });
});`,
    },
    {
      id: 2,
      title: '3. Prompt Builder Function',
      icon: <FileJson size={24} className="text-warning" />,
      badge: 'server/services/promptBuilder.ts',
      summary: 'Separates AI prompt engineering from routes and client code.',
      details: [
        'Crafts an explicit instruction template tailored to college undergraduate learning.',
        'Enforces 3 discrete sections: Simple Explanation, Concrete Example, Short Summary.',
        'Separation of concerns: Prompt logic can be updated without changing frontend or DB schema.',
      ],
      codeSnippet: `// server/services/promptBuilder.ts
export function buildStudyPrompt({ subject, question }) {
  return \`You are a helpful college study assistant.
Explain the following \${subject} topic simply: \${question}
Requirements:
1. EXPLANATION: Beginner-friendly explanation.
2. EXAMPLE: Code snippet or concrete scenario.
3. SUMMARY: 2-3 sentence key takeaway for exams.\`;
}`,
    },
    {
      id: 3,
      title: '4. Gemini LLM Generation',
      icon: <Cpu size={24} className="text-danger" />,
      badge: 'server/services/llmService.ts',
      summary: 'Server-side LLM call using @google/genai with structured responseSchema.',
      details: [
        'Calls `ai.models.generateContent` with `gemini-3.8-flash`.',
        'API key is kept 100% secure on server (`process.env.GEMINI_API_KEY`).',
        'Enforces JSON Schema output (`explanation`, `example`, `summary`).',
        'Demonstrates safe, server-only AI integration without leaking credentials.',
      ],
      codeSnippet: `// server/services/llmService.ts
const response = await ai.models.generateContent({
  model: 'gemini-3.8-flash',
  contents: prompt,
  config: {
    responseMimeType: 'application/json',
    responseSchema: { ... } // Strict JSON schema
  }
});
const answer = JSON.parse(response.text);`,
    },
    {
      id: 4,
      title: '5. MongoDB Persistence',
      icon: <Database size={24} className="text-success" />,
      badge: 'server/models/StudyItem.ts',
      summary: 'Stores question and structured answer with Mongoose Schema.',
      details: [
        'Mongoose Schema validates data types, enums, and auto-generates `createdAt` timestamps.',
        'Persists to MongoDB Atlas or local MongoDB instance.',
        'Features an in-memory repository fallback so the app runs smoothly anywhere.',
        'Demonstrates MERN / MEAN database modeling and CRUD operations.',
      ],
      codeSnippet: `// server/models/StudyItem.ts
const studyItemSchema = new mongoose.Schema({
  subject: { type: String, required: true, enum: [...] },
  question: { type: String, required: true },
  explanation: { type: String, required: true },
  example: { type: String, required: true },
  summary: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});`,
    },
    {
      id: 5,
      title: '6. Response Rendered in React',
      icon: <CheckCircle size={24} className="text-primary" />,
      badge: 'client/components/AnswerCard.tsx',
      summary: 'React receives the saved MongoDB document and updates the UI instantly.',
      details: [
        'Frontend receives HTTP 201 response with complete document including `_id`.',
        'Renders explanation, copyable code example, and exam summary card.',
        'Updates history count in navigation bar.',
        'Demonstrates full-stack round-trip completion!',
      ],
      codeSnippet: `// client/App.tsx
const handleAsk = async (subject, question) => {
  const newAnswer = await askStudyQuestion(subject, question);
  setLatestAnswer(newAnswer);
  setHistory((prev) => [newAnswer, ...prev]);
};`,
    },
  ];

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-header bg-dark text-white py-3">
        <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
          <Cpu size={20} className="text-primary" />
          Full-Stack Architecture & Data Flow
        </h5>
        <small className="opacity-75">
          Step-by-step breakdown of how React, Express, Gemini LLM, and MongoDB connect together.
        </small>
      </div>

      <div className="card-body p-4">
        {/* Visual Pipeline Bar */}
        <div className="row g-2 mb-4 text-center">
          {steps.map((step, idx) => (
            <div key={step.id} className="col-6 col-md-2">
              <button
                type="button"
                className={`btn w-100 p-2 h-100 d-flex flex-column align-items-center justify-content-center text-decoration-none border ${
                  selectedStep === idx
                    ? 'btn-primary text-white border-primary shadow-sm'
                    : 'btn-light text-secondary border-secondary-subtle'
                }`}
                onClick={() => setSelectedStep(idx)}
              >
                <div className="mb-1">{step.icon}</div>
                <div className="small fw-bold lh-sm text-truncate w-100">
                  Step {idx + 1}
                </div>
                <div
                  className="font-monospace opacity-75"
                  style={{ fontSize: '0.65rem' }}
                >
                  {step.title.split(' ')[1]}
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Selected Step Explanation Card */}
        <div className="p-4 bg-light rounded border border-primary-subtle">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
              {steps[selectedStep].icon}
              {steps[selectedStep].title}
            </h5>
            <span className="badge bg-secondary font-monospace">
              {steps[selectedStep].badge}
            </span>
          </div>

          <p className="lead fs-6 text-dark mb-3">
            {steps[selectedStep].summary}
          </p>

          <div className="row g-3">
            <div className="col-12 col-lg-6">
              <h6 className="fw-bold text-secondary text-uppercase small">
                Key Technical Concepts:
              </h6>
              <ul className="list-group list-group-flush bg-transparent">
                {steps[selectedStep].details.map((point, pIdx) => (
                  <li
                    key={pIdx}
                    className="list-group-item bg-transparent px-0 py-1 text-secondary small d-flex gap-2 align-items-start"
                  >
                    <CheckCircle
                      size={15}
                      className="text-success mt-1 flex-shrink-0"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-12 col-lg-6">
              <h6 className="fw-bold text-secondary text-uppercase small">
                Code Snippet:
              </h6>
              <div className="bg-dark text-light p-3 rounded font-monospace small overflow-auto" style={{ maxHeight: '220px' }}>
                <pre className="mb-0 text-white" style={{ fontSize: '0.8rem' }}>
                  {steps[selectedStep].codeSnippet}
                </pre>
              </div>
            </div>
          </div>

          {/* Navigation between steps */}
          <div className="d-flex justify-content-between mt-4 pt-3 border-top">
            <button
              className="btn btn-outline-secondary btn-sm"
              disabled={selectedStep === 0}
              onClick={() => setSelectedStep((s) => Math.max(0, s - 1))}
            >
              ← Previous Step
            </button>
            <span className="text-muted small align-self-center">
              Step {selectedStep + 1} of {steps.length}
            </span>
            <button
              className="btn btn-primary btn-sm"
              disabled={selectedStep === steps.length - 1}
              onClick={() => setSelectedStep((s) => Math.min(steps.length - 1, s + 1))}
            >
              Next Step →
            </button>
          </div>
        </div>

        {/* Why this architecture? */}
        <div className="mt-4 p-3 bg-white rounded border">
          <h6 className="fw-bold text-dark d-flex align-items-center gap-2 mb-2">
            <ShieldCheck size={18} className="text-success" />
            Why keep the LLM call and Prompt on the Express Backend?
          </h6>
          <p className="text-muted small mb-0">
            In standard production full-stack architectures, API keys (like <code>GEMINI_API_KEY</code>) must <strong>never</strong> be bundled in frontend browser code. Furthermore, keeping prompt engineering in <code>server/services/promptBuilder.ts</code> enables you to sanitize user inputs, apply rate limits, update prompt rules on the fly, and persist results straight to MongoDB before returning data to the client.
          </p>
        </div>
      </div>
    </div>
  );
};
