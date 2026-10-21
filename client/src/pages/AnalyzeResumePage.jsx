/**
 * PrepPilot - Analyze Resume Page
 * Uploads candidate resume PDF, pastes target job description, and requests AI evaluation.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadResumeAnalysis } from '../services/analysis.service';
import FileUploadZone from '../components/resume/FileUploadZone';
import Alert from '../components/common/Alert';
import { Sparkles, FileSearch, ArrowRight, Wand2 } from 'lucide-react';

const AnalyzeResumePage = () => {
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSampleJD = () => {
    setJobTitle('Full Stack Software Engineer');
    setJobDescription(
      `We are hiring a Full Stack Software Engineer to build high-performance web applications.
Responsibilities:
- Build modular frontend applications using React, Tailwind CSS, and state management.
- Design scalable backend microservices using Node.js, Express, and REST APIs.
- Work with MongoDB database schemas, aggregation pipelines, and indexing.
- Deploy applications using Docker, Kubernetes, and AWS Cloud infrastructure.
- Write unit and integration tests using Jest and Cypress.
Requirements:
- Bachelor's in Computer Science or related degree.
- Proficiency in JavaScript/TypeScript, Git version control, and CI/CD pipelines.`
    );
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError('Please select or drag a PDF resume file to continue.');
      return;
    }

    if (!jobTitle.trim()) {
      setError('Target job title is required.');
      return;
    }

    if (!jobDescription.trim() || jobDescription.trim().length < 20) {
      setError('Please enter a detailed job description (at least 20 characters).');
      return;
    }

    setLoading(true);

    try {
      const response = await uploadResumeAnalysis(file, jobTitle.trim(), jobDescription.trim());
      if (response.success && response.data?._id) {
        navigate(`/result/${response.data._id}`);
      } else {
        throw new Error(response.message || 'Analysis could not be generated.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Error during resume analysis. Please verify your PDF has selectable text.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Application Tracking System (ATS) Scanner</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Resume Matcher & Optimizer
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Upload your resume PDF and paste a job description. Google Gemini will audit keyword overlap, compute your match score, and pinpoint profile gaps.
        </p>
      </div>

      {error && <Alert type="error" message={error} onDismiss={() => setError(null)} />}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Step 1: File Upload */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            1. Upload Resume PDF (Max 5MB)
          </label>
          <FileUploadZone
            file={file}
            onFileSelected={(f) => setFile(f)}
            onFileRemoved={() => setFile(null)}
          />
        </div>

        {/* Step 2: Job Title */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            2. Target Job Title
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Full Stack Developer, Frontend Engineer, Data Analyst"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
        </div>

        {/* Step 3: Job Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              3. Target Job Description
            </label>
            <button
              type="button"
              onClick={handleSampleJD}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Load Sample JD (Viva Demo)</span>
            </button>
          </div>
          <textarea
            rows={8}
            required
            placeholder="Paste the target job description, responsibilities, and required qualifications here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={loading}
            className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white leading-relaxed resize-y"
          />
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading || !file || !jobTitle.trim() || !jobDescription.trim()}
          className="w-full py-4 px-6 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Gemini AI is extracting text & auditing ATS compatibility...</span>
            </div>
          ) : (
            <>
              <FileSearch className="w-5 h-5" />
              <span>Analyze Resume with Gemini AI</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AnalyzeResumePage;
