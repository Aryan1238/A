/**
 * PrepPilot - Mock Interview Final Report Page
 * Comprehensive performance breakdown across all 5 interview questions.
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getInterviewReport } from '../services/interview.service';
import { CircularScoreMeter, ScoreBadge } from '../components/common/ScoreBadge';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import { formatDate } from '../utils/formatDate';
import {
  ArrowLeft,
  Award,
  Mic,
  Calendar,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Printer,
  RotateCcw
} from 'lucide-react';

const InterviewReportPage = () => {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const res = await getInterviewReport(id);
        if (res.success && res.data) {
          setInterview(res.data);
        } else {
          throw new Error('Interview record not found.');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load report.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader size="lg" text="Loading final interview report..." />
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <Alert type="error" message={error || 'Report not found.'} />
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 no-print">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/interview"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake / New Role</span>
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Main Report Body */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        {/* Score & Summary Banner */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-8 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>Interview Session Report &bull; {interview.difficulty} Level</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {interview.role}
            </h1>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(interview.createdAt)}
              </span>
              <span>&bull;</span>
              <span className="capitalize">{interview.status}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed pt-1">
              {interview.finalFeedback ||
                'Solid performance across the mock interview session. Review each question below for model answer outlines.'}
            </p>
          </div>

          <div className="flex-shrink-0">
            <CircularScoreMeter
              score={interview.totalScore}
              max={10}
              label="Overall Score"
              size={170}
            />
          </div>
        </div>

        {/* Question-by-Question Detailed Breakdown */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Question-by-Question Performance (5 Rounds)
          </h2>

          <div className="space-y-6">
            {(interview.questions || []).map((q, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-4"
              >
                {/* Question Header & Score */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">
                      Q{q.questionNumber || idx + 1}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {q.category || 'Technical'}
                    </span>
                  </div>

                  <ScoreBadge score={q.score ?? 'N/A'} max={10} size="md" />
                </div>

                {/* Prompt */}
                <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
                  {q.questionText}
                </h3>

                {/* Candidate Answer */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Your Response
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    {q.userAnswer || <span className="italic text-slate-400">No response recorded</span>}
                  </p>
                </div>

                {/* AI Critique */}
                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800 dark:text-blue-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>AI Feedback</span>
                  </div>
                  <p className="text-xs text-blue-950 dark:text-blue-200 leading-relaxed">
                    {q.feedback || 'Evaluated for conceptual precision.'}
                  </p>
                </div>

                {/* Ideal Answer Outline */}
                {q.idealAnswer && (
                  <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                      <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                      <span>Ideal Answer Outline</span>
                    </div>
                    <p className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
                      {q.idealAnswer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewReportPage;
