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


// PERSONAS, CURRENCIES, TOOLS have been moved to the backend