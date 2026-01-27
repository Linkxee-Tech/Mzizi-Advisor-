import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10", showText = true }) => {
  return (
    <div className="flex items-center gap-3 select-none">
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Brain/Tree Canopy Outline */}
        <path d="M50 15 C30 15 15 30 15 50 C15 60 20 68 30 72 L30 85" stroke="#166534" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M50 15 C70 15 85 30 85 50 C85 60 80 68 70 72 L70 85" stroke="#166534" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        
        {/* Circuit Nodes (Brain) */}
        <circle cx="35" cy="35" r="3" fill="#CA8A04" />
        <circle cx="65" cy="35" r="3" fill="#CA8A04" />
        <circle cx="50" cy="25" r="3" fill="#CA8A04" />
        <circle cx="25" cy="50" r="3" fill="#CA8A04" />
        <circle cx="75" cy="50" r="3" fill="#CA8A04" />
        
        {/* Circuit Lines (Brain Connections) */}
        <path d="M35 35 L50 25 L65 35" stroke="#166534" strokeWidth="3" />
        <path d="M35 35 L25 50" stroke="#166534" strokeWidth="3" />
        <path d="M65 35 L75 50" stroke="#166534" strokeWidth="3" />
        <path d="M50 25 L50 50" stroke="#166534" strokeWidth="3" />
        
        {/* Roots (Bottom) */}
        <path d="M50 50 L50 85" stroke="#166534" strokeWidth="4" />
        <path d="M50 60 L30 85" stroke="#166534" strokeWidth="4" />
        <path d="M50 60 L70 85" stroke="#166534" strokeWidth="4" />
        <path d="M50 70 L20 90" stroke="#166534" strokeWidth="3" />
        <path d="M50 70 L80 90" stroke="#166534" strokeWidth="3" />
        
        {/* Root Nodes */}
        <circle cx="20" cy="90" r="3" fill="#CA8A04" />
        <circle cx="80" cy="90" r="3" fill="#CA8A04" />
        <circle cx="50" cy="85" r="3" fill="#CA8A04" />
      </svg>
      
      {showText && (
        <div className="flex flex-col justify-center">
            <span className="font-bold text-xl tracking-tight leading-none text-green-900">
                MZIZI <span className="text-yellow-600">A</span>DVISOR
            </span>
        </div>
      )}
    </div>
  );
};

export default Logo;