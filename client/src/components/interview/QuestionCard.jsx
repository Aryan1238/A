/**
 * PrepPilot - Active Question Card Component
 * Displays the current single question, progress bar, category, and answer input.
 */

import React, { useState } from 'react';
import { Send, HelpCircle, CheckCircle2 } from 'lucide-react';

const QuestionCard = ({
  questionNumber = 1,
  totalQuestions = 5,
  category = 'Technical',
  questionText = '',
  onSubmitAnswer,
  loading
}) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim() || loading) return;
    onSubmitAnswer(answer.trim());
    setAnswer('');
  };

  const progressPercentage = (questionNumber / totalQuestions) * 100;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm max-w-3xl mx-auto space-y-6">
      {/* Header & Progress Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold">
            {category}
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Question Prompt */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
              {questionText}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Be as specific as possible. Mention definitions, mechanisms, and real-world examples.
            </p>
          </div>
        </div>
      </div>

      {/* Answer Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Your Response
          </label>
          <textarea
            rows={6}
            required
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your structured answer here... (Explain core concepts, edge cases, and architectural trade-offs)"
            disabled={loading}
            className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white leading-relaxed resize-y"
          />
          <div className="flex justify-between items-center text-xs text-slate-400 mt-1.5 px-1">
            <span>Minimum ~20-30 words recommended for accurate evaluation</span>
            <span>{answer.trim().split(/\s+/).filter(Boolean).length} words</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!answer.trim() || loading}
          className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
        >
          {loading ? (
            <span>Gemini AI is evaluating your response...</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Answer for AI Scoring</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default QuestionCard;
