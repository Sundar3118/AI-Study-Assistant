/**
 * Frontend API Service
 * 
 * Demonstrates:
 * - Simple native fetch wrapper for backend REST endpoints
 * - Clean error handling and response unwrapping
 */

export interface StudyItem {
  _id: string;
  subject: 'Java' | 'Python' | 'DBMS' | 'Operating Systems' | 'Computer Networks' | 'Other';
  question: string;
  explanation: string;
  example: string;
  summary: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  storage?: {
    mode: string;
    isConnected: boolean;
    hasMongoUri: boolean;
  };
}

const BASE_URL = '/api/study';

export async function askStudyQuestion(subject: string, question: string): Promise<StudyItem> {
  const response = await fetch(`${BASE_URL}/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subject, question }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to get answer from study assistant backend.');
  }

  return data.data;
}

export async function getStudyHistory(): Promise<{ items: StudyItem[]; storage?: any }> {
  const response = await fetch(`${BASE_URL}/history`);
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to load study history.');
  }

  return {
    items: data.data || [],
    storage: data.storage,
  };
}

export async function deleteStudyItem(id: string): Promise<boolean> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to delete study record.');
  }

  return true;
}

export async function getStudyBackendInfo(): Promise<any> {
  try {
    const response = await fetch(`${BASE_URL}/info`);
    return await response.json();
  } catch (err) {
    console.error('Failed to get backend info:', err);
    return null;
  }
}
