/**
 * PrepPilot - Recent Analyses Table Component
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowUpRight, Trash2 } from 'lucide-react';
import { ScoreBadge } from '../common/ScoreBadge';
import { formatDate } from '../../utils/formatDate';

const RecentAnalysesTable = ({ analyses = [], onDelete }) => {
  if (!analyses || analyses.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center">
        <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          No resumes analyzed yet
        </p>
        <Link
          to="/analyze"
          className="inline-block mt-3 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          Analyze your first resume &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Recent Resume Analyses
        </h3>
        <Link
          to="/history"
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {analyses.map((item) => (
          <div
            key={item._id}
            className="py-3.5 flex items-center justify-between gap-3 group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <Link
                  to={`/result/${item._id}`}
                  className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 truncate block"
                >
                  {item.jobTitle}
                </Link>
                <span className="text-xs text-slate-400">
                  {formatDate(item.createdAt)} &bull; {item.resumeFileName || 'Resume.pdf'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <ScoreBadge score={item.atsScore} max={100} size="sm" />
              <Link
                to={`/result/${item._id}`}
                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="View Full Report"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              {onDelete && (
                <button
                  onClick={() => onDelete(item._id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentAnalysesTable;
