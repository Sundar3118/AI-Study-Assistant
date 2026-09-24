/**
 * MongoDB Schema for AI Study Assistant
 * 
 * Demonstrates:
 * - Mongoose Schema Definition
 * - Data validation (required fields, enum restriction, minlength)
 * - Timestamps for sorting history
 */

import mongoose from 'mongoose';

export interface IStudyItem {
  _id?: string;
  subject: 'Java' | 'Python' | 'DBMS' | 'Operating Systems' | 'Computer Networks' | 'Other';
  question: string;
  explanation: string;
  example: string;
  summary: string;
  createdAt?: Date;
}

export const studyItemSchema = new mongoose.Schema<IStudyItem>(
  {
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      enum: {
        values: ['Java', 'Python', 'DBMS', 'Operating Systems', 'Computer Networks', 'Other'],
        message: '{VALUE} is not a supported subject',
      },
    },
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
      minlength: [3, 'Question must be at least 3 characters long'],
    },
    explanation: {
      type: String,
      required: [true, 'Explanation is required'],
    },
    example: {
      type: String,
      required: [true, 'Example is required'],
    },
    summary: {
      type: String,
      required: [true, 'Summary is required'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation of model in hot-reload environments
export const StudyItem =
  (mongoose.models && mongoose.models.StudyItem) ||
  mongoose.model<IStudyItem>('StudyItem', studyItemSchema);
