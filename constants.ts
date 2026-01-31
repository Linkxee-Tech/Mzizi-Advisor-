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
  { label: 'Insights', icon: TrendingUp, path: '/insights' },
  { label: 'Profile', icon: User, path: '/profile' },
];

export const CURRENCIES = [
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'DZD', symbol: 'DA', name: 'Algerian Dinar' },
  { code: 'AOA', symbol: 'Kz', name: 'Angolan Kwanza' },
  { code: 'BWP', symbol: 'P', name: 'Botswana Pula' },
  { code: 'BIF', symbol: 'FBu', name: 'Burundian Franc' },
  { code: 'CVE', symbol: 'Esc', name: 'Cabo Verdean Escudo' },
  { code: 'XAF', symbol: 'FCFA', name: 'Central African CFA' },
  { code: 'XOF', symbol: 'CFA', name: 'West African CFA' },
  { code: 'KMF', symbol: 'CF', name: 'Comorian Franc' },
  { code: 'CDF', symbol: 'FC', name: 'Congolese Franc' },
  { code: 'DJF', symbol: 'Fdj', name: 'Djiboutian Franc' },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
  { code: 'ERN', symbol: 'Nfk', name: 'Eritrean Nakfa' },
  { code: 'SZL', symbol: 'L', name: 'Swazi Lilangeni' },
  { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr' },
  { code: 'GMD', symbol: 'D', name: 'Gambian Dalasi' },
  { code: 'GNF', symbol: 'FG', name: 'Guinean Franc' },
  { code: 'LSL', symbol: 'L', name: 'Lesotho Loti' },
  { code: 'LRD', symbol: '$', name: 'Liberian Dollar' },
  { code: 'LYD', symbol: 'LD', name: 'Libyan Dinar' },
  { code: 'MGA', symbol: 'Ar', name: 'Malagasy Ariary' },
  { code: 'MWK', symbol: 'MK', name: 'Malawian Kwacha' },
  { code: 'MRU', symbol: 'UM', name: 'Mauritanian Ouguiya' },
  { code: 'MUR', symbol: '₨', name: 'Mauritian Rupee' },
  { code: 'MAD', symbol: 'DH', name: 'Moroccan Dirham' },
  { code: 'MZN', symbol: 'MT', name: 'Mozambican Metical' },
  { code: 'NAD', symbol: '$', name: 'Namibian Dollar' },
  { code: 'RWF', symbol: 'RF', name: 'Rwandan Franc' },
  { code: 'STN', symbol: 'Db', name: 'Sao Tome Dobra' },
  { code: 'SCR', symbol: '₨', name: 'Seychellois Rupee' },
  { code: 'SLE', symbol: 'Le', name: 'Sierra Leonean Leone' },
  { code: 'SOS', symbol: 'Sh', name: 'Somali Shilling' },
  { code: 'SSP', symbol: '£', name: 'South Sudanese Pound' },
  { code: 'SDG', symbol: '£', name: 'Sudanese Pound' },
  { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling' },
  { code: 'TND', symbol: 'DT', name: 'Tunisian Dinar' },
  { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling' },
  { code: 'ZMW', symbol: 'ZK', name: 'Zambian Kwacha' },
  { code: 'ZWG', symbol: 'ZiG', name: 'Zimbabwe Gold' },
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