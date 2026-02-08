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

export interface PricingData {
  itemName: string;
  costs: { name: string; amount: number }[];
  totalCost: number;
  markupPercentage: number;
  recommendedPrice: number;
  profitAmount: number;
  currency: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStructured?: boolean; // If true, render as an advice card
  structuredData?: AdviceCardData;
  isPricing?: boolean; // New: If true, render pricing card
  pricingData?: PricingData; // New: Data for pricing
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
  pitfalls: string[]; // New: List of common mistakes to avoid
  nextStep: string;
  confidence: 'High' | 'Medium' | 'Low';
}

export interface ChartData {
  name: string;
  revenue: number;
  expenses: number;
}

export interface Tool {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}