/**
 * PrepPilot - Alert Banner Component
 */

import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const Alert = ({ type = 'error', message, onDismiss }) => {
  if (!message) return null;

  const typeConfig = {
    error: {
      bg: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900',
      text: 'text-red-800 dark:text-red-300',
      icon: AlertCircle
    },
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900',
      text: 'text-emerald-800 dark:text-emerald-300',
      icon: CheckCircle2
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
      text: 'text-amber-800 dark:text-amber-300',
      icon: AlertTriangle
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900',
      text: 'text-blue-800 dark:text-blue-300',
      icon: Info
    }
  };

  const config = typeConfig[type] || typeConfig.error;
  const Icon = config.icon;

  return (
    <div className={`flex items-start justify-between gap-3 p-4 rounded-xl border ${config.bg} ${config.text} text-sm transition-all`}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <span className="font-medium">{message}</span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
