import React from 'react';
import { TOOLS } from '../constants';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Tools: React.FC = () => {
  return (
    <div className="p-6">
       <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">Business Tools</h1>
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
         {TOOLS.map((tool) => (
            <Link 
                to={`/chat?context=${tool.id}`} 
                key={tool.id} 
                className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 hover:border-green-500 dark:hover:border-green-500 transition-all active:scale-[0.99]"
            >
                <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-2xl shadow-inner dark:shadow-none">
                    {tool.icon}
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">{tool.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{tool.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600" />
            </Link>
         ))}
       </div>
    </div>
  );
};

export default Tools;