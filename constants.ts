import { BusinessProfile, PersonaId } from './types';
import { LayoutDashboard, MessageSquare, Briefcase, User, TrendingUp } from 'lucide-react';

export const THEME = {
  colors: {
    primary: 'bg-green-800',
    primaryText: 'text-green-800',
    secondary: 'bg-yellow-500',
    secondaryText: 'text-yellow-600',
    accent: 'bg-blue-500',
    background: 'bg-gray-50',
  }
};

export const NAV_ITEMS = [
  { label: 'Home', icon: LayoutDashboard, path: '/' },
  { label: 'Advisor', icon: MessageSquare, path: '/chat' },
  { label: 'Tools', icon: Briefcase, path: '/tools' },
  { label: 'Insights', icon: TrendingUp, path: '/insights' },
  { label: 'Profile', icon: User, path: '/profile' },
];

export const PERSONAS: Record<PersonaId, BusinessProfile> = {
  ada: {
    id: 'ada',
    ownerName: 'Ada',
    businessName: "Ada's Bakery",
    businessType: 'Micro-bakery',
    country: 'Nigeria',
    currency: '₦',
    revenueRange: '< $1,000 / yr',
    teamSize: '1-2 People',
    primaryStrength: 'Product Quality',
    goals: ['Increase morning sales', 'Better packaging'],
  },
  musa: {
    id: 'musa',
    ownerName: 'Musa',
    businessName: 'Musa Farms',
    businessType: 'Agriculture (Maize)',
    country: 'Nigeria',
    currency: '₦',
    revenueRange: '$10,000 - $50,000 / yr',
    teamSize: '6-10 People',
    primaryStrength: 'Location',
    goals: ['Market access', 'Financing for tractor'],
  },
  aisha: {
    id: 'aisha',
    ownerName: 'Aisha',
    businessName: 'Aisha Retail',
    businessType: 'Retail Shop',
    country: 'Nigeria',
    currency: '₦',
    revenueRange: '$1,000 - $10,000 / yr',
    teamSize: '2-5 People',
    primaryStrength: 'Customer Service',
    goals: ['Bookkeeping', 'Loan readiness'],
  }
};

export const TOOLS = [
  { id: 'pricing', title: 'Pricing Advisor', desc: 'Calculate optimal prices', icon: '💰' },
  { id: 'marketing', title: 'Marketing Coach', desc: 'Grow your customer base', icon: '📢' },
  { id: 'finance', title: 'Bookkeeping', desc: 'Track profits & expenses', icon: '📒' },
  { id: 'compliance', title: 'Registration', desc: 'Legal & Tax guide', icon: '⚖️' },
  { id: 'loans', title: 'Loans & Grants', desc: 'Find funding options', icon: '🏦' },
];