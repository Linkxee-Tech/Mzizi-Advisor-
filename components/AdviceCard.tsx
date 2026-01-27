import React, { useState } from 'react';
import { AdviceCardData } from '../types';
import { CheckCircle2, ArrowRight, ShieldCheck, Share2, Download, Check } from 'lucide-react';

interface AdviceCardProps {
  data: AdviceCardData;
}

const AdviceCard: React.FC<AdviceCardProps> = ({ data }) => {
  const [saved, setSaved] = useState(false);

  const confidenceColor = 
    data.confidence === 'High' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800' :
    data.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800' :
    'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800';

  const handleSave = () => {
    setSaved(true);
    // In a real app, this would dispatch to a global store
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden my-2 animate-fade-in-up transition-colors duration-300">
      <div className="p-5 border-b border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{data.keyInsight}</h3>
          <span className={`text-xs font-bold px-2 py-1 rounded-full border ${confidenceColor} flex items-center gap-1 shrink-0`}>
             <ShieldCheck className="w-3 h-3" /> {data.confidence} Conf.
          </span>
        </div>
      </div>
      
      <div className="p-5 space-y-4">
        <div>
          <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-3">Recommended Actions</h4>
          <ul className="space-y-3">
            {data.actions.map((action, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-200">
                <div className="mt-0.5 min-w-[20px]">
                    <div className="w-5 h-5 rounded border-2 border-green-600 dark:border-green-500 flex items-center justify-center">
                        {action.completed && <div className="w-3 h-3 bg-green-600 dark:bg-green-500 rounded-sm" />}
                    </div>
                </div>
                <span className="text-sm leading-relaxed">{action.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
            <h4 className="text-blue-800 dark:text-blue-300 text-xs font-bold uppercase mb-1 flex items-center gap-1">
                <ArrowRight className="w-3 h-3" /> Next Best Step
            </h4>
            <p className="text-blue-900 dark:text-blue-100 text-sm font-medium">{data.nextStep}</p>
        </div>
      </div>

      <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 flex gap-2">
        <button 
          onClick={handleSave}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all ${
            saved 
              ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' 
              : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
          }`}
        >
            {saved ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            {saved ? 'Saved' : 'Save Plan'}
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-green-800 hover:bg-green-900 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg py-2 text-sm font-medium transition-colors">
            <Share2 className="w-4 h-4" /> Share
        </button>
      </div>
    </div>
  );
};

export default AdviceCard;