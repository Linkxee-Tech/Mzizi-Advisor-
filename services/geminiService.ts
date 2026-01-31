import { GoogleGenAI, Type } from "@google/genai";
import { BusinessProfile, AdviceCardData, PricingData } from "../types";

const apiKey = process.env.API_KEY || '';

// Fallback mock
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
): Promise<{ text: string; structured?: AdviceCardData; pricing?: PricingData }> => {
  
  if (!apiKey) {
    console.warn("No API Key provided. Returning mock response.");
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { 
      text: "I've analyzed your request. Here is what I suggest:", 
      structured: MOCK_ADVICE 
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    You are Mzizi, an expert AI Business Advisor for African SMEs.
    
    USER PROFILE:
    - Name: ${profile.ownerName}
    - Business: ${profile.businessName} (${profile.businessType})
    - Country: ${profile.country}
    - Currency: ${profile.currency}
    - Goals: ${profile.goals.join(", ")}
    
    CORE RULES:
    1. **Registration & Compliance:** If the user asks about registration, you MUST provide steps specific to **${profile.country}**.
       - Nigeria: Mention CAC (Corporate Affairs Commission), TIN (Tax ID).
       - Kenya: Mention eCitizen, BRS (Business Registration Service).
       - South Africa: Mention CIPC (Companies and Intellectual Property Commission).
       - Ghana: Mention RGD (Registrar General's Department).
       - General: If country unknown, provide general best practices but warn to check local laws.
       - Format this as a structured 'Advice Card' with checklist actions.

    2. **Pricing:** If the user asks about pricing or calculation:
       - Attempt to calculate a price based on their inputs.
       - If they haven't provided costs, ask for them.
       - If they HAVE provided costs/numbers, return a **Pricing Data** JSON.
       - Assume a healthy margin (20-40%) if not specified.

    3. **Tone:** Trustworthy, Friendly, Simple, Authoritative. No jargon.

    RESPONSE FORMAT:
    You must respond in JSON.
    
    Schema:
    {
      "text": "Conversational text",
      "type": "ADVICE" | "PRICING" | "TEXT",
      "adviceData": { ...AdviceCardData Schema... },
      "pricingData": {
         "itemName": "Name of product",
         "costs": [{"name": "Item", "amount": 100}],
         "totalCost": 100,
         "markupPercentage": 20,
         "recommendedPrice": 120,
         "profitAmount": 20,
         "currency": "${profile.currency}"
      }
    }
  `;

  try {
    const contents = [
      ...history,
      { role: 'user', parts: [{ text: prompt }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
           type: Type.OBJECT,
           properties: {
             text: { type: Type.STRING },
             type: { type: Type.STRING, enum: ["ADVICE", "PRICING", "TEXT"] },
             adviceData: {
               type: Type.OBJECT,
               properties: {
                  keyInsight: { type: Type.STRING },
                  actions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  nextStep: { type: Type.STRING },
                  confidence: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
               },
               nullable: true
             },
             pricingData: {
                type: Type.OBJECT,
                properties: {
                    itemName: { type: Type.STRING },
                    costs: { 
                        type: Type.ARRAY, 
                        items: { 
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                amount: { type: Type.NUMBER }
                            }
                        } 
                    },
                    totalCost: { type: Type.NUMBER },
                    markupPercentage: { type: Type.NUMBER },
                    recommendedPrice: { type: Type.NUMBER },
                    profitAmount: { type: Type.NUMBER },
                    currency: { type: Type.STRING }
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

    let result: { text: string; structured?: AdviceCardData; pricing?: PricingData } = {
        text: parsed.text || "Here is the information you requested."
    };

    if (parsed.type === 'ADVICE' && parsed.adviceData) {
        result.structured = {
            keyInsight: parsed.adviceData.keyInsight,
            actions: parsed.adviceData.actions.map((a: string) => ({ text: a, completed: false })),
            nextStep: parsed.adviceData.nextStep,
            confidence: parsed.adviceData.confidence
        };
    } else if (parsed.type === 'PRICING' && parsed.pricingData) {
        result.pricing = parsed.pricingData;
    }

    return result;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "I'm having trouble connecting to the network. Please check your connection and try again." };
  }
};