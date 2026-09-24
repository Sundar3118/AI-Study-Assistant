/**
 * REST API Routes for AI Study Assistant
 * 
 * Demonstrates:
 * - Express Router setup
 * - HTTP Methods: POST, GET, DELETE
 * - Input validation & HTTP status codes (200, 201, 400, 404, 500)
 * - Clean orchestration: Route -> Prompt Builder -> LLM -> Database -> Client
 */

import { Router, Request, Response } from 'express';
import { generateStudyResponse } from '../services/llmService';
import { StudyRepository } from '../db/mongo';

export const studyRouter = Router();

const ALLOWED_SUBJECTS = [
  'Java',
  'Python',
  'DBMS',
  'Operating Systems',
  'Computer Networks',
  'Other',
];

/**
 * @route   POST /api/study/ask
 * @desc    Accepts a subject and question, queries the LLM, saves result to MongoDB, and returns answer
 * @access  Public
 */
studyRouter.post('/ask', async (req: Request, res: Response): Promise<void> => {
  try {
    const { subject, question } = req.body;

    // 1. Basic Input Validation
    if (!subject || typeof subject !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Please select a valid subject.',
      });
      return;
    }

    if (!question || typeof question !== 'string' || question.trim().length < 3) {
      res.status(400).json({
        success: false,
        error: 'Please enter a question with at least 3 characters.',
      });
      return;
    }

    // Check if subject is in recognized list
    const trimmedSubject = subject.trim();
    const trimmedQuestion = question.trim();

    // 2. Generate structured response using LLM service (prompt-builder is called inside)
    console.log(`[Express] Received query for subject "${trimmedSubject}": "${trimmedQuestion.slice(0, 50)}..."`);
    const answer = await generateStudyResponse(trimmedSubject, trimmedQuestion);

    // 3. Save question and structured answer in MongoDB repository
    const savedRecord = await StudyRepository.create({
      subject: trimmedSubject as any,
      question: trimmedQuestion,
      explanation: answer.explanation,
      example: answer.example,
      summary: answer.summary,
    });

    console.log(`[Express] Successfully saved to DB with ID: ${savedRecord._id}`);

    // 4. Return response to React frontend
    res.status(201).json({
      success: true,
      message: 'Study query processed and saved to database successfully.',
      data: savedRecord,
      storage: StudyRepository.getMode(),
    });
  } catch (error: any) {
    console.error('[Express] Error in /api/study/ask:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred while generating study material.',
    });
  }
});

/**
 * @route   GET /api/study/history
 * @desc    Retrieves all previously asked questions and answers
 * @access  Public
 */
studyRouter.get('/history', async (_req: Request, res: Response): Promise<void> => {
  try {
    const history = await StudyRepository.getAll();
    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
      storage: StudyRepository.getMode(),
    });
  } catch (error: any) {
    console.error('[Express] Error in /api/study/history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve study history from database.',
    });
  }
});

/**
 * @route   DELETE /api/study/:id
 * @desc    Deletes an old question from MongoDB by its ID
 * @access  Public
 */
studyRouter.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ success: false, error: 'Item ID is required.' });
      return;
    }

    const deleted = await StudyRepository.deleteById(id);
    if (!deleted) {
      res.status(404).json({
        success: false,
        error: `No study item found with ID: ${id}`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Study item deleted successfully from database.',
      id,
    });
  } catch (error: any) {
    console.error(`[Express] Error in DELETE /api/study/${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete study item from database.',
    });
  }
});

/**
 * @route   GET /api/study/info
 * @desc    Returns API schema documentation and database connection status
 * @access  Public
 */
studyRouter.get('/info', (_req: Request, res: Response): void => {
  res.status(200).json({
    project: 'AI Study Assistant',
    version: '1.0.0',
    description: 'A beginner-level full-stack MERN/Node project demonstrating React -> Express -> LLM -> MongoDB.',
    storage: StudyRepository.getMode(),
    endpoints: [
      {
        method: 'POST',
        path: '/api/study/ask',
        description: 'Send a subject and question, generates explanation via Gemini, saves to MongoDB.',
        body: { subject: 'Java | Python | DBMS | Operating Systems | Computer Networks', question: 'string' },
      },
      {
        method: 'GET',
        path: '/api/study/history',
        description: 'Get all saved Q&A items sorted by newest first.',
      },
      {
        method: 'DELETE',
        path: '/api/study/:id',
        description: 'Delete a study question and answer by its MongoDB _id.',
      },
    ],
    schema: {
      collection: 'studyitems',
      fields: {
        _id: 'ObjectId (Auto-generated)',
        subject: 'String (Enum: Java, Python, DBMS, Operating Systems, Computer Networks, Other)',
        question: 'String (Required, minlength: 3)',
        explanation: 'String (Beginner explanation)',
        example: 'String (Code snippet or scenario)',
        summary: 'String (2-3 sentence recap)',
        createdAt: 'Date (Timestamp)',
      },
    },
  });
});
