/**
 * Database Connection & Storage Manager
 * 
 * Demonstrates:
 * - Connecting to MongoDB using Mongoose
 * - Graceful fallback to in-memory store if MONGODB_URI is not provided
 * - Unified repository interface for CRUD operations
 */

import mongoose from 'mongoose';
import { IStudyItem, StudyItem } from '../models/StudyItem';

let isConnected = false;
let dbMode: 'MongoDB' | 'In-Memory (Dev Fallback)' = 'In-Memory (Dev Fallback)';

// In-memory collection fallback (allows app to run instantly without external MongoDB daemon)
const memoryStore: (IStudyItem & { _id: string; createdAt: Date })[] = [
  {
    _id: 'sample-doc-1',
    subject: 'DBMS',
    question: 'What is ACID properties in DBMS with a real-world banking example?',
    explanation:
      'ACID stands for Atomicity, Consistency, Isolation, and Durability. These are four crucial properties that guarantee database transactions are processed reliably.',
    example:
      'Think of transferring $100 from Account A to Account B:\n- Atomicity: Either both deducting from A and adding to B happen, or neither does.\n- Consistency: Total money in the bank remains the same before and after.\n- Isolation: If two people transfer simultaneously, neither sees a half-finished state.\n- Durability: Once you get a "Success" receipt, a power failure won\'t erase the transfer.',
    summary:
      'ACID ensures safe, reliable transactions in relational databases so data is never corrupted or partially applied.',
    createdAt: new Date(Date.now() - 3600000 * 2),
  },
  {
    _id: 'sample-doc-2',
    subject: 'Python',
    question: 'What is the difference between list and tuple in Python?',
    explanation:
      'Lists and tuples are both ordered collections used to store items, but the fundamental difference is mutability. Lists can be modified after creation, whereas tuples are immutable (read-only).',
    example:
      '# List (mutable - use square brackets [])\nfruits = ["apple", "banana"]\nfruits.append("orange") # Works fine!\n\n# Tuple (immutable - use parentheses ())\ncoordinates = (10, 20)\n# coordinates[0] = 50 -> Raises TypeError!',
    summary:
      'Use lists when you need dynamic data that changes, and tuples for fixed data like coordinates or dictionary keys.',
    createdAt: new Date(Date.now() - 3600000 * 5),
  },
];

/**
 * Initializes database connection if MONGODB_URI is set.
 */
export async function connectDB(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.log('ℹ️ MONGODB_URI not provided. Running with in-memory database store.');
    dbMode = 'In-Memory (Dev Fallback)';
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    dbMode = 'MongoDB';
    console.log('✅ Successfully connected to MongoDB:', mongoUri.replace(/\/\/.*@/, '//<credentials>@'));
  } catch (error) {
    console.warn('⚠️ Could not connect to MongoDB, falling back to in-memory store:', (error as Error).message);
    isConnected = false;
    dbMode = 'In-Memory (Dev Fallback)';
  }
}

/**
 * Repository interface for Study Items
 */
export const StudyRepository = {
  getMode() {
    return {
      mode: dbMode,
      isConnected,
      hasMongoUri: Boolean(process.env.MONGODB_URI),
    };
  },

  async getAll(): Promise<IStudyItem[]> {
    if (isConnected) {
      return await StudyItem.find().sort({ createdAt: -1 }).lean();
    }
    // Return sorted in-memory docs
    return [...memoryStore].sort(
      (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  },

  async create(item: Omit<IStudyItem, '_id' | 'createdAt'>): Promise<IStudyItem> {
    if (isConnected) {
      const doc = await StudyItem.create(item);
      return doc.toObject();
    }

    const newDoc = {
      ...item,
      _id: 'doc_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };
    memoryStore.unshift(newDoc);
    return newDoc;
  },

  async deleteById(id: string): Promise<boolean> {
    if (isConnected) {
      const result = await StudyItem.findByIdAndDelete(id);
      return Boolean(result);
    }

    const index = memoryStore.findIndex((item) => item._id === id);
    if (index !== -1) {
      memoryStore.splice(index, 1);
      return true;
    }
    return false;
  },
};
