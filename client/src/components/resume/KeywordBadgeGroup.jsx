/**
 * PrepPilot - Keyword Badge Group
 * Visually categorizes matched vs missing keywords for ATS screening.
 */

import React from 'react';
import { Check, X, AlertTriangle } from 'lucide-react';

const KeywordBadgeGroup = ({ matched = [], missing = [] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Matched Keywords */}
      <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
              Matched Keywords
            </h4>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
            {matched.length} Detected
          </span>
        </div>

        {matched.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {matched.map((kw, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800"
              >
                <Check className="w-3 h-3 text-emerald-600" />
                {kw}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">
            No direct keyword overlap found with the target job description.
          </p>
        )}
      </div>

      {/* Missing Keywords */}
      <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <h4 className="text-sm font-bold text-rose-900 dark:text-rose-300">
              Missing Target Keywords
            </h4>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300">
            {missing.length} Missing
          </span>
        </div>

        {missing.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {missing.map((kw, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-rose-100/70 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
              >
                <X className="w-3 h-3 text-rose-600" />
                {kw}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            Great job! No major target keywords are missing.
          </p>
        )}
      </div>
    </div>
  );
};

export default KeywordBadgeGroup;
