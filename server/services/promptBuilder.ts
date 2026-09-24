/**
 * Prompt Builder Service
 * 
 * Demonstrates:
 * - Server-side prompt engineering
 * - Separating prompt logic from routes and React UI
 * - Enforcing structured output (explanation, example, summary)
 */

export interface PromptTemplateOptions {
  subject: string;
  question: string;
}

/**
 * Builds a beginner-friendly structured prompt for the LLM.
 * Directs the AI to explain the topic simply to a college student
 * and return three clearly defined sections.
 */
export function buildStudyPrompt({ subject, question }: PromptTemplateOptions): string {
  return `You are a helpful and patient college study assistant.
Explain the following computer science topic to an undergraduate student using simple language, clear analogies, and practical examples.

Subject: ${subject}
Topic / Question: ${question}

Requirements:
1. EXPLANATION: Write a simple, beginner-friendly explanation without heavy technical jargon. Use intuitive analogies where helpful.
2. EXAMPLE: Provide a concrete, real-world example (clean code snippet for programming subjects like Java or Python, or a step-by-step practical scenario for DBMS, Operating Systems, or Computer Networks).
3. SUMMARY: Provide a concise 2 to 3 sentence recap highlighting the key takeaway for exam revision or interview prep.

Output format requirement:
Respond in clear JSON format with three exact string keys:
- "explanation": the simple explanation
- "example": the practical code or scenario example
- "summary": the short 2-3 sentence summary`;
}
