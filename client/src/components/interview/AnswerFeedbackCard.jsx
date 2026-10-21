/**
 * PrepPilot - Answer Feedback Card Component
 * Displays question score out of 10, feedback, and ideal-answer outline with next-step button.
 */

import React from 'react';
import { ScoreBadge } from '../common/ScoreBadge';
import { ArrowRight, CheckCircle2, Award, Sparkles, BookOpen } from 'lucide-react';

const AnswerFeedbackCard = ({
  evaluation = {},
  isCompleted = false,
  nextQuestion = null,
  onNextQuestion,
  onViewReport
}) => {
  const { score = 0, feedback = '', idealAnswer = '' } = evaluation;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header Evaluation Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Answer Evaluation
            </h3>
            <p className="text-xs text-slate-400">
              Evaluated by Google Gemini Model
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Question Score:
          </span>
          <ScoreBadge score={score} max={10} size="lg" />
        </div>
      </div>

      {/* Constructive AI Feedback */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Interviewer Feedback</span>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
          {feedback}
        </p>
      </div>

      {/* Ideal Answer Outline */}
      <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Ideal Answer Outline (Key Concepts)</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200/90 leading-relaxed font-normal">
          {idealAnswer}
        </p>
      </div>

      {/* Next Step CTA */}
      <div className="pt-2">
        {!isCompleted ? (
          <button
            onClick={onNextQuestion}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <span>Proceed to Next Question</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onViewReport}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <Award className="w-5 h-5" />
            <span>Interview Complete &mdash; View Final Report</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default AnswerFeedbackCard;
