/**
 * PrepPilot - Mock Interview Setup Component
 * Allows user to configure target role and difficulty level.
 */

import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Award } from 'lucide-react';

const InterviewSetupCard = ({ onStart, loading }) => {
  const [role, setRole] = useState('Full Stack Software Engineer');
  const [customRole, setCustomRole] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate');

  const rolePresets = [
    'Full Stack Software Engineer',
    'Frontend React Developer',
    'Backend Node.js Developer',
    'Data Scientist / ML Engineer',
    'DevOps / Cloud Engineer',
    'Custom'
  ];

  const difficulties = [
    { level: 'Beginner', desc: 'Core fundamentals & syntax', icon: Zap },
    { level: 'Intermediate', desc: 'Real-world scenarios & design', icon: ShieldCheck },
    { level: 'Advanced', desc: 'Architecture & high-scale tradeoffs', icon: Award }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalRole = role === 'Custom' ? customRole.trim() : role;
    if (!finalRole) return;
    onStart(finalRole, difficulty);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Configure Your Mock Interview
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Gemini AI will synthesize 5 tailored questions and evaluate your answers live.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Target Job Role
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
            {rolePresets.map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setRole(r)}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all text-left ${
                  role === r
                    ? 'border-blue-600 bg-blue-50/70 text-blue-700 dark:bg-blue-900/40 dark:border-blue-500 dark:text-blue-300 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {role === 'Custom' && (
            <input
              type="text"
              required
              placeholder="e.g. Embedded Firmware Engineer"
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            />
          )}
        </div>

        {/* Difficulty Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Interview Difficulty Level
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {difficulties.map((diff) => {
              const Icon = diff.icon;
              const isSelected = difficulty === diff.level;
              return (
                <button
                  type="button"
                  key={diff.level}
                  onClick={() => setDifficulty(diff.level)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-900/30 dark:border-blue-500 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {diff.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {diff.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Launch Button */}
        <button
          type="submit"
          disabled={loading || (role === 'Custom' && !customRole.trim())}
          className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
        >
          {loading ? (
            <span>Generating 5 Interview Questions with AI...</span>
          ) : (
            <>
              <span>Begin Mock Interview</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InterviewSetupCard;
