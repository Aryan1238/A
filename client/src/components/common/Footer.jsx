/**
 * PrepPilot - Footer Component
 * Clean academic project footer displaying stack details, quick links, and credit.
 */

import React from 'react';
import { Compass, Sparkles, Code2, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 py-8 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              PrepPilot
            </span>
            <span className="text-xs text-slate-400">
              — AI Resume Analyzer & Mock Interview Coach
            </span>
          </div>

          {/* Academic / Stack Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Google Gemini AI
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <Code2 className="w-3 h-3 text-blue-500" />
              MERN Stack (React + Node + Express + Mongo)
            </span>
          </div>

          {/* Copyright & College Mini Project Tag */}
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center md:text-right">
            College Mini Project &bull; Built with clean code for viva defense
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
