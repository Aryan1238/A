/**
 * PrepPilot - 404 Not Found Page
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center max-w-md w-full shadow-xl space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
          404
        </h1>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
          Page Not Found
        </h2>
        <p className="text-xs text-slate-400">
          The requested route does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
