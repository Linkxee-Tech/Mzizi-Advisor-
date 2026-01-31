import React from 'react';
import { PricingData } from '../types';
import { TrendingUp, DollarSign, Tag } from 'lucide-react';

interface PricingCardProps {
  data: PricingData;
}

const PricingCard: React.FC<PricingCardProps> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden my-2 animate-fade-in-up transition-colors duration-300 max-w-md">
      <div className="p-4 border-b border-gray-50 dark:border-gray-700 bg-green-50/50 dark:bg-green-900/20 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm flex items-center gap-2">
           <Tag className="w-4 h-4 text-green-600" /> Pricing Calculator
        </h3>
        <span className="text-xs font-mono bg-white dark:bg-gray-700 px-2 py-1 rounded text-gray-500 dark:text-gray-300">
            {data.itemName}
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Costs List */}
        <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Cost Breakdown</p>
            {data.costs.map((cost, idx) => (
                <div key={idx} className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>{cost.name}</span>
                    <span>{data.currency} {cost.amount.toLocaleString()}</span>
                </div>
            ))}
            <div className="flex justify-between text-sm font-bold text-gray-800 dark:text-gray-100 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                <span>Total Cost</span>
                <span>{data.currency} {data.totalCost.toLocaleString()}</span>
            </div>
        </div>

        {/* Markup Visual */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">Profit Margin</span>
                <span className="text-xs font-bold text-green-600 dark:text-green-400">+{data.markupPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${Math.min(data.markupPercentage, 100)}%` }}
                />
            </div>
            <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Profit per unit</span>
                <span className="text-sm font-bold text-green-700 dark:text-green-400">
                    + {data.currency} {data.profitAmount.toLocaleString()}
                </span>
            </div>
        </div>
      </div>

      {/* Final Price */}
      <div className="bg-green-800 dark:bg-green-700 p-4 text-white flex justify-between items-center">
        <span className="text-sm font-medium opacity-90">Recommended Price</span>
        <div className="flex items-center gap-1 text-2xl font-bold">
            <span className="text-sm opacity-60 mt-1">{data.currency}</span>
            {data.recommendedPrice.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default PricingCard;