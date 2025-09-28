// Fix: Implemented geminiService with Gemini API calls.
import { GoogleGenAI, Chat, Type } from "@google/genai";
import type { Student } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

let chat: Chat | null = null;

function getChatSession(): Chat {
  if (!chat) {
    chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are an administrative agent for The Stoneridge School, a private primary school in Uganda.
Your role is to assist the school administration with various tasks.
When interacting in a chat, be helpful, concise, and professional.
When asked to generate content like emails or announcements, adopt the appropriate tone.
You have access to school data, but do not mention that you are a language model or that you are accessing a database.
Just provide the information or perform the task as requested.
The current date is ${new Date().toDateString()}.
The school's name is The Stoneridge School.
The school's location is in Kampala, Uganda.`,
      },
    });
  }
  return chat;
}

export const sendMessageToChat = async (message: string): Promise<string> => {
  try {
    const chatSession = getChatSession();
    const response = await chatSession.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error sending message to chat:", error);
    // Throw a more user-friendly error to be caught by the component
    throw new Error("I'm having trouble connecting to my services right now. Please check your internet connection and try again in a moment.");
  }
};

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