
import React from 'react';
import { TrendingUpIcon } from './Icons';

type AnalyticsData = Record<string, number>;

interface DashboardProps {
  data: AnalyticsData;
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const processDataForChart = () => {
    const chartData: { label: string; value: number }[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const label = date.toLocaleDateString('en-US', { weekday: 'short' });
      chartData.push({ label, value: data[dateString] || 0 });
    }
    return chartData;
  };

  const chartData = processDataForChart();
  const maxValue = Math.max(...chartData.map(d => d.value), 1); // Avoid division by zero
  const totalThisWeek = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-6 sm:p-8 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 h-full">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <TrendingUpIcon className="text-indigo-600 dark:text-indigo-400 mr-3 h-6 w-6" />
        Your Weekly Activity
      </h2>
      
      {totalThisWeek === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Your analysis activity will be shown here.</p>
      ) : (
        <>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Total analyses this week: <span className="font-bold text-gray-700 dark:text-gray-200">{totalThisWeek}</span></p>
            <div className="h-48 flex items-end justify-between space-x-2">
            {chartData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center group">
                    <div className="relative w-full h-full flex items-end">
                        <div
                            className="w-full bg-indigo-500 dark:bg-indigo-600 rounded-t-md hover:bg-indigo-400 dark:hover:bg-indigo-500 transition-all"
                            style={{ height: `${(item.value / maxValue) * 100}%` }}
                        >
                          <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                              {item.value}
                          </span>
                        </div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.label}</span>
                </div>
            ))}
            </div>
        </>
      )}
    </div>
  );
};
