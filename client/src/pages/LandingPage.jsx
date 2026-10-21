/**
 * PrepPilot - Landing Page
 * Modern, clean homepage highlighting AI Resume ATS Auditor and Mock Interview Coach.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Mic,
  BarChart3,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Code2,
  Compass
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: FileText,
      title: 'AI Resume ATS Auditor',
      description:
        'Upload your PDF resume and paste target job descriptions. Gemini extracts text, scores ATS compatibility (0-100), detects missing keywords, and offers 5 concrete improvements.',
      color: 'blue'
    },
    {
      icon: Mic,
      title: 'Interactive Mock Interview Coach',
      description:
        'Pick your role and difficulty. Answer 5 progressive technical and scenario-based questions with instant AI scoring (0-10), feedback, and model answer outlines.',
      color: 'emerald'
    },
    {
      icon: BarChart3,
      title: 'Performance Dashboard & Export',
      description:
        'Track score progression over time with interactive Recharts line charts, review historical logs, and download polished PDF analysis reports for job applications.',
      color: 'purple'
    }
  ];

  const highlights = [
    'Google Gemini AI integration via @google/generative-ai',
    'Strict JSON schema outputs with resilient client/server validation',
    'Multer memory storage with 5MB PDF validation',
    'Full MVC architecture (Models, Views, Controllers, Routes, Services)',
    'JWT Authentication & bcrypt password encryption',
    'Built-in mock fallback for reliable offline viva presentations'
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold mb-6 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>College Mini Project &bull; Full-Stack AI Placement Coach</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-tight">
          Ace Placement Drives with{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AI Resume Analysis
          </span>{' '}
          & Mock Interviews.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          <strong>PrepPilot</strong> equips students and graduates with instant ATS match scores, missing keyword detection, and live role-specific mock interviews powered by Google Gemini AI.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <span>Go to Candidate Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>Get Started for Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <span>Log in (Demo Account)</span>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Core Features Cards */}
      <section className="py-12 bg-white/50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Built for Campus Placements & Technical Interviews
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Everything you need to calibrate your profile and practice technical rounds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* College Project Architecture Highlight */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-4 border border-blue-400/20">
              <Code2 className="w-3.5 h-3.5" />
              <span>Full-Stack Architecture &bull; Viva Ready</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              Clean, modular, and easy to explain in your viva exam.
            </h2>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Designed following clean MVC principles with complete Postman API documentation, automated Jest tests, and 5 standard Mermaid UML diagrams.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
