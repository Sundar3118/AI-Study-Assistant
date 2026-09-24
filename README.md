# AI Study Assistant 🎓

A beginner-friendly full-stack web application designed for computer science college students. This project demonstrates the core engineering flow connecting a modern frontend to an Express backend, structuring an LLM prompt, and saving data in MongoDB.

```text
React (Client)  --->  API Request (fetch)  --->  Express (Server)  --->  LLM API (Gemini)  --->  MongoDB (Mongoose)  --->  React (UI)
```

---

## 🛠️ Tech Stack

- **Frontend**: React + Vite + Bootstrap 5
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose ODM) with built-in in-memory fallback
- **AI / LLM**: Google Gemini 3.8 Flash (`@google/genai` SDK)
- **Language**: JavaScript / TypeScript

---

## 🚀 Key Features

1. **Subject Selection**: Choose from core CS subjects:
   - Java (OOP, JVM, Memory Management)
   - Python (Data Structures, Decorators, GIL)
   - DBMS (SQL, ACID properties, Normalization)
   - Operating Systems (Processes, Threads, Deadlocks, Virtual Memory)
   - Computer Networks (TCP/IP, OSI Model, Routing, Handshakes)
2. **Student Doubt Input**: Clean text area with character counts and popular sample exam questions for instant testing.
3. **Dedicated Backend Prompt Builder**: Constructs an undergraduate-level educational prompt on the Express server (`server/services/promptBuilder.ts`).
4. **Structured LLM Response**: Gemini returns 3 distinct sections:
   - **Simple Explanation**: Concept explained without excessive jargon.
   - **Concrete Example**: Real-world code snippet or step-by-step scenario.
   - **Short Summary**: 2-3 sentence exam takeaway.
5. **MongoDB Persistence**: Every question and generated answer is saved using a Mongoose schema.
6. **History & Revision Page**: Filter by subject, search questions by keyword, and review past notes.
7. **Delete Questions**: Remove outdated or duplicate questions from MongoDB via `DELETE /api/study/:id`.
8. **Interactive Architecture Visualizer**: Step-by-step visual interactive diagram demonstrating the data flow.

---

## 📁 Project Directory Structure

```text
ai-study-assistant/
├── client/                     # Frontend client layer
│   ├── components/
│   │   ├── Navbar.tsx          # Navigation bar with storage indicator
│   │   ├── QuestionForm.tsx    # Subject selector & question form
│   │   ├── AnswerCard.tsx      # Explanation, Example & Summary display
│   │   ├── HistoryList.tsx     # Past Q&A list with search & delete
│   │   ├── ArchitectureDiagram.tsx # Visual flowchart of the full-stack pipeline
│   │   └── DocsView.tsx        # In-app REST API docs & Mongoose schema
│   └── services/
│       └── api.ts              # Fetch wrappers for /api/study endpoints
├── server/                     # Backend server layer
│   ├── db/
│   │   └── mongo.ts            # Mongoose connection & storage repository
│   ├── models/
│   │   └── StudyItem.ts        # Mongoose Schema & validation
│   ├── routes/
│   │   └── studyRoutes.ts      # REST endpoints (POST, GET, DELETE)
│   ├── services/
│   │   ├── promptBuilder.ts    # Server-side prompt engineering function
│   │   └── llmService.ts       # Gemini API call with structured JSON schema
│   └── app.ts                  # Express application configuration & middleware
├── server.ts                   # Production server entrypoint
├── .env.example                # Example environment variables
└── README.md                   # Full documentation & setup guide
```

---

## ⚙️ Setup Instructions

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd ai-study-assistant
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set your variables in `.env`:
```env
# Required for AI generation
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Optional: MongoDB connection string (Local or MongoDB Atlas)
# If left blank, the app will automatically run using the built-in in-memory store
MONGODB_URI="mongodb://localhost:27017/ai_study_assistant"

PORT=3000
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Production Build
```bash
npm run build
npm start
```

---

## 🗄️ MongoDB Schema

File: `server/models/StudyItem.ts`

```javascript
import mongoose from 'mongoose';

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

export const StudyItem = mongoose.model('StudyItem', studyItemSchema);
```

---

## 📡 REST API Documentation

### 1. Ask a Question
- **URL**: `POST /api/study/ask`
- **Body**:
  ```json
  {
    "subject": "Java",
    "question": "What is the difference between Abstract Class and Interface?"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Study query processed and saved to database successfully.",
    "data": {
      "_id": "65fc8e12ab99...",
      "subject": "Java",
      "question": "What is the difference between Abstract Class and Interface?",
      "explanation": "An abstract class allows you to define...",
      "example": "// Example code snippet in Java...",
      "summary": "Use abstract classes for code reuse among related classes; use interfaces for contract definitions.",
      "createdAt": "2026-09-24T00:55:00.000Z"
    }
  }
  ```

### 2. Get Study History
- **URL**: `GET /api/study/history`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "count": 5,
    "data": [ ...list of StudyItem documents sorted newest first... ]
  }
  ```

### 3. Delete a Question
- **URL**: `DELETE /api/study/:id`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Study item deleted successfully from database.",
    "id": "65fc8e12ab99..."
  }
  ```

---

## 🧠 Why is the Prompt Builder on the Backend?

Instead of calling the AI directly from the React component:
1. **Security**: The `GEMINI_API_KEY` is kept safe on the server and is never leaked to browser network inspection.
2. **Standardization**: The backend controls the educational tone, formatting rules, and strict JSON schema.
3. **Reliable Persistence**: The server can save the output directly into MongoDB in the same request before returning it to the client.
