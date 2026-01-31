import React, { useState } from 'react';
import { BusinessProfile } from '../types';
import { THEME, TOOLS } from '../constants';
import { TrendingUp, AlertCircle, CheckCircle, Search, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

interface DashboardProps {
  profile: BusinessProfile;
}

const MOCK_DATA = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 600 },
  { name: 'Thu', value: 450 },
  { name: 'Fri', value: 700 },
  { name: 'Sat', value: 800 },
  { name: 'Sun', value: 650 },
];

const Dashboard: React.FC<DashboardProps> = ({ profile }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [askInput, setAskInput] = useState('');

  const handleQuickAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (askInput.trim()) {
        // Navigate to chat with the prompt in query params
        navigate(`/chat?prompt=${encodeURIComponent(askInput)}`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Good morning, {profile.ownerName} ☀️</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{profile.businessName} • {profile.businessType}</p>
        </div>
      </div>

      {/* Ask Advisor Widget (New Feature) */}
      <div className="bg-white dark:bg-gray-800 p-1 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
         <form onSubmit={handleQuickAsk} className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            <input 
                type="text"
                value={askInput}
                onChange={(e) => setAskInput(e.target.value)}
                placeholder="Ask Mzizi: How can I sell more this week?"
                className="w-full pl-12 pr-12 py-4 rounded-xl bg-transparent outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400"
            />
            <button 
                type="submit"
                disabled={!askInput.trim()}
                className="absolute right-2 p-2 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ArrowRight className="w-4 h-4" />
            </button>
         </form>
      </div>

      {/* Snapshot Card */}
      <div className={`${THEME.colors.primary} rounded-2xl p-6 text-white shadow-lg relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full translate-x-10 -translate-y-10" />
        <div className="relative z-10">
            <h2 className="text-sm font-medium opacity-90 mb-1">Estimated Revenue (This Week)</h2>
            <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold">{profile.currency} 42,500</span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded text-white flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +12%
                </span>
            </div>
            
            <div className="h-24 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MOCK_DATA}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="value" stroke="#ffffff" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Recommended Actions */}
      <div>
        <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Recommended for you</h3>
            <Link to="/insights" className="text-green-700 dark:text-green-400 text-sm font-medium">View all</Link>
        </div>
        
        <div className="space-y-3">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border-l-4 border-yellow-500 shadow-sm flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">Update Produce Prices</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Market rates for flour increased by 5% yesterday.</p>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border-l-4 border-blue-500 shadow-sm flex gap-3">
                <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />
                <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">Restock Inventory</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Packaging materials are running low.</p>
                </div>
            </div>
        </div>
      </div>

      {/* Quick Tools Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Business Tools</h3>
            <Link to="/tools" className="text-green-700 dark:text-green-400 text-sm font-medium">View all</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TOOLS.slice(0, 4).map((tool) => (
                <Link to={`/chat?context=${tool.id}`} key={tool.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-colors flex flex-col items-start gap-2">
                    <span className="text-2xl">{tool.icon}</span>
                    <div>
                        <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">{tool.title}</h4>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">{tool.desc}</p>
                    </div>
                </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;