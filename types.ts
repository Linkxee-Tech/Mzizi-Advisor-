export type PersonaId = 'ada' | 'musa' | 'aisha';

export interface BusinessProfile {
  id: string;
  email?: string; // Added email field
  ownerName: string;
  businessName: string;
  businessType: string;
  country: string;
  currency: string;
  revenueRange: string;
  teamSize: string;
  primaryStrength: string;
  goals: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStructured?: boolean; // If true, render as an advice card
  structuredData?: AdviceCardData;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  lastModified: number;
}

export interface AdviceCardData {
  keyInsight: string;
  actions: {
    text: string;
    completed: boolean;
  }[];
  nextStep: string;
  confidence: 'High' | 'Medium' | 'Low';
}

export interface ChartData {
  name: string;
  revenue: number;
  expenses: number;
}