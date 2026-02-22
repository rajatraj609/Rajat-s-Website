import { GoogleGenAI, Chat } from "@google/genai";
import { Experience, Certification, Skill } from '../types';

let aiInstance: GoogleGenAI | null = null;

const getAI = (): GoogleGenAI => {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is missing from environment variables.');
    }
    aiInstance = new GoogleGenAI({ apiKey: apiKey || '' });
  }
  return aiInstance;
};

// Generate system instruction dynamically based on current state
export const generateSystemInstruction = (
  aboutMe: string,
  experiences: Experience[],
  certifications: Certification[],
  skills: Skill[]
): string => {
  return `
You are an AI assistant for Rajat's personal portfolio website.
Your role is to answer questions about Rajat's professional background, skills, and certifications in a professional yet friendly manner.

Here is the context about Rajat:
Bio: "${aboutMe}"

Experience:
${experiences.map(e => `- ${e.role} at ${e.company} (${e.period}): ${e.description.join(' ')}`).join('\n')}

Certifications:
${certifications.map(c => `- ${c.name} issued by ${c.issuer} (${c.issuedDate})`).join('\n')}

Skills:
${skills.map(s => `- ${s.category}: ${s.items.join(', ')}`).join('\n')}

Rules:
1. Keep answers concise (under 100 words) unless asked for details.
2. If asked about contact info, refer them to the contact section or email rajat@example.com.
3. Be enthusiastic about Rajat's work.
4. If you don't know the answer based on this context, say you don't have that information but suggest contacting him directly.
`;
};

export const createChatSession = (systemInstruction: string): Chat => {
  const ai = getAI();
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
    }
  });
};
