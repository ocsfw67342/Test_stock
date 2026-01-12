import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  colorClass?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, subValue, icon, colorClass = "bg-slate-800" }) => {
  return (
    <div className={`${colorClass} rounded-xl p-6 border border-slate-700/50 shadow-lg`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
          {subValue && (
            <p className="text-emerald-400 text-xs mt-2 font-medium bg-emerald-400/10 inline-block px-2 py-1 rounded">
              {subValue}
            </p>
          )}
        </div>
        <div className="p-3 bg-slate-700/30 rounded-lg text-slate-300">
          {icon}
        </div>
      </div>
    </div>
  );
};