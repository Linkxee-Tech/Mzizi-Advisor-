import { BusinessProfile, AdviceCardData, PricingData } from "../types";

const API_BASE_URL = 'http://localhost:5000/api';

export const generateAdvisorResponse = async (
  prompt: string,
  profile: BusinessProfile,
  history: { role: string; parts: { text: string }[] }[] = []
): Promise<{ text: string; structured?: AdviceCardData; pricing?: PricingData }> => {

  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        profile,
        history
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "I'm having trouble connecting to the network. Please check your connection and try again." };
  }
};