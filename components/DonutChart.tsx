import React from 'react';

interface DonutChartProps {
  real: number;
  fake: number;
  size?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({ real, fake, size = 120 }) => {
  const total = real + fake;
  if (total === 0) {
    return (
        <div style={{ width: size, height: size }} className="flex items-center justify-center bg-gray-100 dark:bg-slate-700 rounded-full">
            <span className="text-xs text-gray-500 dark:text-gray-400">No Data</span>
        </div>
    );
  }

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const fakeStrokeDashoffset = circumference * (1 - fake / total);

  return (
    <div style={{ width: size, height: size }} className="relative">
      <svg width={size} height={size} viewBox="0 0 120 120" className="-rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#e5e7eb" className="dark:stroke-slate-600" strokeWidth="16" />
        {real > 0 && (
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#22c55e"
            strokeWidth="16"
            strokeDasharray={circumference}
            strokeDashoffset={0}
          />
        )}
        {fake > 0 && (
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#ef4444"
            strokeWidth="16"
            strokeDasharray={circumference}
            strokeDashoffset={fakeStrokeDashoffset}
            strokeLinecap="round"
          />
        )}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">{total}</span>
      </div>
    </div>
  );
};