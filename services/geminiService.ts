// Fix: Implemented geminiService with Gemini API calls.
import { GoogleGenAI, Chat, Type } from "@google/genai";
import type { Student } from '../types';
import { RateLimiter } from '../utils/validation';
import { SCHOOL_NAME, SCHOOL_LOCATION, API_RATE_LIMIT, ERROR_MESSAGES } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// Create a rate limiter for API calls
const rateLimiter = new RateLimiter(API_RATE_LIMIT.MAX_CALLS, API_RATE_LIMIT.TIME_WINDOW_MS);

let chat: Chat | null = null;

function getChatSession(): Chat {
  if (!chat) {
    chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are an administrative agent for ${SCHOOL_NAME}, a private primary school in ${SCHOOL_LOCATION}.
Your role is to assist the school administration with various tasks.
When interacting in a chat, be helpful, concise, and professional.
When asked to generate content like emails or announcements, adopt the appropriate tone.
You have access to school data, but do not mention that you are a language model or that you are accessing a database.
Just provide the information or perform the task as requested.
The current date is ${new Date().toDateString()}.
The school's name is ${SCHOOL_NAME}.
The school's location is ${SCHOOL_LOCATION}.`,
      },
    });
  }
  return chat;
}

/**
 * Sends a message to the AI chat and returns the response
 * @param message - The user's message to send to the AI
 * @returns Promise resolving to the AI's response text
 * @throws Error if rate limit is exceeded or if there's a connection issue
 */
export const sendMessageToChat = async (message: string): Promise<string> => {
  // Check rate limit
  if (!rateLimiter.canMakeCall()) {
    throw new Error(ERROR_MESSAGES.RATE_LIMIT_EXCEEDED);
  }

  try {
    rateLimiter.recordCall();
    const chatSession = getChatSession();
    const response = await chatSession.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error sending message to chat:", error);
    // Throw a more user-friendly error to be caught by the component
    throw new Error("I'm having trouble connecting to my services right now. Please check your internet connection and try again in a moment.");
  }
};

/**
 * Gets the appropriate system instruction based on the tool type
 * @param tool - The type of content generation tool
 * @returns The system instruction string for the AI model
 */
const getToolSystemInstruction = (tool: 'EmailDrafter' | 'AnnouncementCreator' | 'ActivityPlanner'): string => {
    switch(tool) {
        case 'EmailDrafter':
            return 'You are an expert communications assistant for a school. Your task is to draft a professional, clear, and concise email based on the user\'s request. The tone should be appropriate for the target audience (parents, staff, etc.). Format the output with a subject line and body.';
        case 'AnnouncementCreator':
            return 'You are a creative assistant for a school. Your task is to create an engaging and informative announcement based on the user\'s request. The announcement should be suitable for newsletters, notice boards, or social media. Use clear headings and bullet points where appropriate.';
        case 'ActivityPlanner':
            return 'You are an experienced event and activity planner for a school. Your task is to generate creative ideas and a structured plan for a school activity based on the user\'s request. Provide a clear outline, suggest necessary resources, and consider the target age group.';
        default:
            return 'You are a helpful assistant.';
    }
}

/**
 * Generates content using AI based on the prompt and tool type
 * @param prompt - The user's prompt describing what to generate
 * @param tool - The type of tool/content to generate
 * @returns Promise resolving to the generated content
 * @throws Error if content generation fails
 */
export const generateContent = async (
  prompt: string,
  tool: 'EmailDrafter' | 'AnnouncementCreator' | 'ActivityPlanner'
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: getToolSystemInstruction(tool),
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    // Throw a more user-friendly error to be caught by the component
    throw new Error("Sorry, I couldn't generate the content. There might be an issue with the service. Please try again later.");
  }
};


/**
 * Uses AI to search through student data based on a natural language query
 * @param query - Natural language search query (e.g., "students with low attendance")
 * @param students - Array of student objects to search through
 * @returns Promise resolving to array of matching students with reasons
 * @throws Error if AI search fails
 * @example
 * const results = await findStudentsWithAI("students in the debate club", students);
 */
export const findStudentsWithAI = async (
    query: string,
    students: Student[]
): Promise<{ studentId: string; reason: string }[]> => {
    const systemInstruction = `You are a data analyst for a school. Your task is to search through the provided JSON data of students to find ones that match the user's query.
    Analyze all aspects of the student data, including performance, attendance, clubs, medical information, and transport.
    Return a JSON array of objects, where each object contains the "studentId" of a matching student and a brief "reason" (less than 15 words) explaining why they matched the query.
    Only return students who are a strong match for the query. If no students match, return an empty array.
    `;
    const prompt = `User Query: "${query}"\n\nStudent JSON Data: ${JSON.stringify(students.map(s => ({
        ...s, 
        // a little cleanup for the model, remove derived fields
        guardianName: undefined,
        guardianContact: undefined,
        matchReason: undefined
    })))}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            studentId: { type: Type.STRING },
                            reason: { type: Type.STRING }
                        },
                        required: ["studentId", "reason"],
                    }
                }
            }
        });

        const jsonString = response.text;
        const result = JSON.parse(jsonString);
        return result;

    } catch (error) {
        console.error("Error with AI student search:", error);
        throw new Error("The AI search failed. This could be due to a connection issue or an invalid query. Please try again.");
    }
};