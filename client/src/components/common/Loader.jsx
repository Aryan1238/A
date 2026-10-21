/**
 * PrepPilot - Loading Indicators & Skeletons
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10'
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 gap-3">
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} animate-spin text-blue-600 dark:text-blue-400`} />
      {text && (
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
};

export const SkeletonCard = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm animate-pulse space-y-4">
    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
  </div>
);

export default Loader;
