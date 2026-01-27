import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertTriangle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const DATA = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 5800 },
  { name: 'Apr', revenue: 2780, expenses: 3908 },
  { name: 'May', revenue: 1890, expenses: 4800 },
  { name: 'Jun', revenue: 2390, expenses: 3800 },
  { name: 'Jul', revenue: 3490, expenses: 4300 },
];

const Insights: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">Business Insights</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">Last 7 Months</span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Profit</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">₦ 124k</span>
            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded flex items-center">
              <ArrowUpRight className="w-3 h-3" /> 12%
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Expenses</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">₦ 86k</span>
            <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-1.5 py-0.5 rounded flex items-center">
              <ArrowDownRight className="w-3 h-3" /> 4%
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 transition-colors">Revenue vs Expenses</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DATA} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#374151' : '#f0f0f0'} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: theme === 'dark' ? '#9ca3af' : '#6b7280'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: theme === 'dark' ? '#9ca3af' : '#6b7280'}} />
              <Tooltip 
                cursor={{fill: theme === 'dark' ? '#1f2937' : '#f9fafb'}}
                contentStyle={{
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    color: theme === 'dark' ? '#f3f4f6' : '#111827'
                }} 
              />
              <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}}/>
              <Bar dataKey="revenue" name="Revenue" fill="#166534" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#eab308" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Analysis */}
      <div>
        <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2 transition-colors">
          <TrendingUp className="w-5 h-5 text-green-700 dark:text-green-500" />
          AI Analysis
        </h3>
        <div className="space-y-3">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800 transition-colors">
            <h4 className="text-sm font-bold text-green-900 dark:text-green-300 mb-1">Strong Revenue Growth</h4>
            <p className="text-xs text-green-800 dark:text-green-400 leading-relaxed">
              Your revenue has grown by 15% month-over-month. Consider reinvesting profits into marketing to sustain this trend.
            </p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800 flex gap-3 transition-colors">
            <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0" />
            <div>
               <h4 className="text-sm font-bold text-orange-900 dark:text-orange-300 mb-1">High Expense Alert</h4>
               <p className="text-xs text-orange-800 dark:text-orange-400 leading-relaxed">
                 Expenses in March spiked unusually. Review your supplier costs for that period.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;