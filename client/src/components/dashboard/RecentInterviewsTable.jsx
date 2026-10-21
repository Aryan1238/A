/**
 * PrepPilot - Recent Interviews Table Component
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, ArrowUpRight, Trash2 } from 'lucide-react';
import { ScoreBadge } from '../common/ScoreBadge';
import { formatDate } from '../../utils/formatDate';

const RecentInterviewsTable = ({ interviews = [], onDelete }) => {
  if (!interviews || interviews.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center">
        <Mic className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          No mock interviews completed yet
        </p>
        <Link
          to="/interview"
          className="inline-block mt-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          Launch your first mock interview &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Recent Mock Interviews
        </h3>
        <Link
          to="/history"
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {interviews.map((item) => (
          <div
            key={item._id}
            className="py-3.5 flex items-center justify-between gap-3 group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <Mic className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <Link
                  to={`/interview/${item._id}`}
                  className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 truncate block"
                >
                  {item.role}
                </Link>
                <span className="text-xs text-slate-400">
                  {formatDate(item.createdAt)} &bull; <span className="capitalize">{item.difficulty}</span> &bull; {item.status === 'completed' ? 'Completed' : 'In Progress'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {item.status === 'completed' ? (
                <ScoreBadge score={item.totalScore} max={10} size="sm" />
              ) : (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                  In Progress
                </span>
              )}
              <Link
                to={`/interview/${item._id}`}
                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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

export default RecentInterviewsTable;
