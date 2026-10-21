/**
 * PrepPilot - Resume Analysis Result Page
 * Displays full ATS score gauge, matched/missing keywords, section feedback, and PDF export.
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAnalysisById } from '../services/analysis.service';
import { CircularScoreMeter } from '../components/common/ScoreBadge';
import KeywordBadgeGroup from '../components/resume/KeywordBadgeGroup';
import SectionFeedbackAccordion from '../components/resume/SectionFeedbackAccordion';
import SuggestionsCard from '../components/resume/SuggestionsCard';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import { exportElementToPdf } from '../utils/exportPdf';
import { formatDate } from '../../src/utils/formatDate';
import {
  Download,
  ArrowLeft,
  Mic,
  CheckCircle,
  AlertTriangle,
  FileText,
  Calendar,
  Sparkles
} from 'lucide-react';

const AnalysisResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const res = await getAnalysisById(id);
        if (res.success && res.data) {
          setAnalysis(res.data);
        } else {
          throw new Error('Analysis not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load analysis report.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  const handleDownloadPdf = async () => {
    setExporting(true);
    const sanitizedTitle = (analysis?.jobTitle || 'Resume').replace(/[^a-zA-Z0-9]/g, '_');
    await exportElementToPdf('analysis-report-container', `PrepPilot_ATS_Report_${sanitizedTitle}.pdf`);
    setExporting(false);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader size="lg" text="Loading detailed ATS evaluation report..." />
      </div>
    );
  }

  if (error || !analysis) {
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
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 no-print">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            to="/interview"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
          >
            <Mic className="w-4 h-4" />
            <span>Practice Mock Interview</span>
          </Link>

          <button
            onClick={handleDownloadPdf}
            disabled={exporting}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 disabled:opacity-50 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{exporting ? 'Generating PDF...' : 'Download PDF Report'}</span>
          </button>
        </div>
      </div>

      {/* Main Report Container (Target for html2pdf export) */}
      <div id="analysis-report-container" className="space-y-8 bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Header Metadata & Gauge */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-8 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Google Gemini ATS Audit Report</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {analysis.jobTitle}
            </h1>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                {analysis.resumeFileName || 'Candidate_Resume.pdf'}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(analysis.createdAt)}
              </span>
            </div>
          </div>

          {/* Circular Score Gauge */}
          <div className="flex-shrink-0">
            <CircularScoreMeter
              score={analysis.atsScore}
              max={100}
              label="ATS Match"
              size={170}
            />
          </div>
        </div>

        {/* Keywords Breakdown */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Keyword Relevancy Screening
          </h2>
          <KeywordBadgeGroup
            matched={analysis.matchedKeywords || []}
            missing={analysis.missingKeywords || []}
          />
        </section>

        {/* Strengths & Weaknesses Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Key Profile Strengths
              </h3>
            </div>
            <ul className="space-y-2">
              {(analysis.strengths || []).map((s, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5"></span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Identified Profile Gaps
              </h3>
            </div>
            <ul className="space-y-2">
              {(analysis.weaknesses || []).map((w, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5"></span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Section-Wise Critique */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Section-by-Section Quality Audit
          </h2>
          <SectionFeedbackAccordion feedback={analysis.sectionFeedback || {}} />
        </section>

        {/* 5 Actionable Suggestions */}
        <section>
          <SuggestionsCard suggestions={analysis.suggestions || []} />
        </section>
      </div>
    </div>
  );
};

export default AnalysisResultPage;
