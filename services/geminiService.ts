import { GoogleGenAI, Type } from "@google/genai";
import { BusinessProfile, AdviceCardData } from "../types";

const apiKey = process.env.API_KEY || '';

// Fallback mock for when API key is missing in demo env
const MOCK_ADVICE: AdviceCardData = {
  keyInsight: "Your pricing is likely too low for your premium ingredients.",
  actions: [
    { text: "Calculate total cost of ingredients per unit", completed: false },
    { text: "Add 20% margin for labor and overhead", completed: false },
    { text: "Compare prices with the bakery down the street", completed: false }
  ],
  nextStep: "Adjust price of your best-seller tomorrow.",
  confidence: "High"
};

export const generateAdvisorResponse = async (
  prompt: string,
  profile: BusinessProfile,
  history: { role: string; parts: { text: string }[] }[] = []
): Promise<{ text: string; structured?: AdviceCardData }> => {
  
  if (!apiKey) {
    console.warn("No API Key provided. Returning mock response.");
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { 
      text: "I've analyzed your request. Here is what I suggest:", 
      structured: MOCK_ADVICE 
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    You are Mzizi, an expert AI Business Advisor for African SMEs.
    User Profile:
    - Name: ${profile.ownerName}
    - Business: ${profile.businessName} (${profile.businessType})
    - Location: ${profile.country}
    - Scale: ${profile.teamSize} employees, ${profile.revenueRange} annual revenue
    - Key Strength: ${profile.primaryStrength}
    - Strategic Goals: ${profile.goals.join(", ")}
    
    Tone: Trustworthy, Friendly, Simple, Authoritative. No jargon.
    
    If the user asks for specific business advice (pricing, marketing, strategy), you MUST return a structured JSON response.
    If the user engages in small talk, return a plain text response.
    
    For structured advice, the JSON schema is:
    {
      "keyInsight": "One sentence summary of the core insight",
      "actions": ["Action 1", "Action 2", "Action 3"],
      "nextStep": "The immediate next thing to do",
      "confidence": "High" | "Medium" | "Low",
      "isAdvice": true
    }

    Keep answers concise. Use local context (e.g. ${profile.currency}) where appropriate.
  `;

  try {
    // Construct the full conversation history including the new prompt
    // The API expects 'model' role, our internal type is 'model', so it matches.
    const contents = [
      ...history,
      { role: 'user', parts: [{ text: prompt }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents, // Pass the full history here
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json", // Force JSON for easier parsing of the mixed intent
        responseSchema: {
           type: Type.OBJECT,
           properties: {
             text: { type: Type.STRING, description: "The conversational part of the response or the full response if no advice is needed." },
             isAdvice: { type: Type.BOOLEAN, description: "True if providing specific business advice" },
             adviceData: {
               type: Type.OBJECT,
               properties: {
                  keyInsight: { type: Type.STRING },
                  actions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  nextStep: { type: Type.STRING },
                  confidence: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
               },
               nullable: true
             }
           }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response");

    const parsed = JSON.parse(jsonText);

    if (parsed.isAdvice && parsed.adviceData) {
        return {
            text: parsed.text || "Here is a plan for you:",
            structured: {
                keyInsight: parsed.adviceData.keyInsight,
                actions: parsed.adviceData.actions.map((a: string) => ({ text: a, completed: false })),
                nextStep: parsed.adviceData.nextStep,
                confidence: parsed.adviceData.confidence
            }
        };
    }

    return { text: parsed.text };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "I'm having trouble connecting to the network. Please check your connection and try again." };
  }
};