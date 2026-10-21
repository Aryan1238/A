/**
 * PrepPilot - Score Badge & Meter Component
 */

import React from 'react';

export const ScoreBadge = ({ score, max = 100, size = 'md' }) => {
  const percentage = (score / max) * 100;

  let colorClasses = 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200 dark:border-rose-800';
  if (percentage >= 80) {
    colorClasses = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
  } else if (percentage >= 60) {
    colorClasses = 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-amber-800';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3.5 py-1.5'
  };

  return (
    <span className={`inline-flex items-center gap-1 font-bold rounded-full border ${colorClasses} ${sizeClasses[size] || sizeClasses.md}`}>
      <span>{score}</span>
      <span className="text-[10px] opacity-70">/{max}</span>
    </span>
  );
};

export const CircularScoreMeter = ({ score, max = 100, label = 'ATS Score', size = 160 }) => {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, (score / max) * 100));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let strokeColor = '#f43f5e'; // rose-500
  if (percentage >= 80) {
    strokeColor = '#10b981'; // emerald-500
  } else if (percentage >= 60) {
    strokeColor = '#f59e0b'; // amber-500
  }

  return (
    <div className="flex flex-col items-center justify-center relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="text-slate-100 dark:text-slate-800 stroke-current"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-extrabold tracking-tight text-slate-800 dark:text-white">
          {score}
        </span>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
          {label}
        </span>
      </div>
    </div>
  );
};

export default ScoreBadge;
