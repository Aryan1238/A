/**
 * PrepPilot - History Page
 * Searchable, filterable list of all past resume audits and mock interview sessions.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllAnalyses, deleteAnalysisById } from '../services/analysis.service';
import { getAllInterviews, deleteInterviewById } from '../services/interview.service';
import { ScoreBadge } from '../components/common/ScoreBadge';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import Modal from '../components/common/Modal';
import { formatDate } from '../utils/formatDate';
import {
  FileText,
  Mic,
  Search,
  ArrowUpRight,
  Trash2,
  Calendar,
  AlertTriangle
} from 'lucide-react';

const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState('analyses'); // 'analyses' | 'interviews'
  const [analyses, setAnalyses] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Deletion modal
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    type: null,
    title: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analysesRes, interviewsRes] = await Promise.all([
        getAllAnalyses(),
        getAllInterviews()
      ]);

      if (analysesRes.success) setAnalyses(analysesRes.data || []);
      if (interviewsRes.success) setInterviews(interviewsRes.data || []);
    } catch (err) {
      setError('Failed to load past session history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDelete = (id, type, title) => {
    setDeleteModal({ isOpen: true, id, type, title });
  };

  const handleConfirmDelete = async () => {
    const { id, type } = deleteModal;
    setDeleteModal({ isOpen: false, id: null, type: null, title: '' });

    try {
      if (type === 'analysis') {
        await deleteAnalysisById(id);
        setSuccessMessage('Resume analysis record removed.');
      } else {
        await deleteInterviewById(id);
        setSuccessMessage('Mock interview session removed.');
      }
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete record.');
    }
  };

  const filteredAnalyses = analyses.filter((a) =>
    (a.jobTitle || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInterviews = interviews.filter((i) =>
    (i.role || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Session History & Archive
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review past evaluations, inspect recommendations, or clean up obsolete records.
        </p>
      </div>

      {error && <Alert type="error" message={error} onDismiss={() => setError(null)} />}
      {successMessage && <Alert type="success" message={successMessage} onDismiss={() => setSuccessMessage(null)} />}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start">
          <button
            onClick={() => setActiveTab('analyses')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'analyses'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resumes ({analyses.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('interviews')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'interviews'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Interviews ({interviews.length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-16">
          <Loader size="md" text="Loading session records..." />
        </div>
      ) : activeTab === 'analyses' ? (
        /* Resume Analyses List */
        filteredAnalyses.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
            <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No resume analyses found.
            </p>
            <Link
              to="/analyze"
              className="inline-block mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Analyze a new resume &rarr;
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800 shadow-sm overflow-hidden">
            {filteredAnalyses.map((item) => (
              <div
                key={item._id}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <Link
                      to={`/result/${item._id}`}
                      className="text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate block"
                    >
                      {item.jobTitle}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.createdAt)}
                      </span>
                      <span>&bull;</span>
                      <span className="truncate max-w-[150px]">{item.resumeFileName || 'resume.pdf'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <ScoreBadge score={item.atsScore} max={100} size="md" />
                  <Link
                    to={`/result/${item._id}`}
                    className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="View Full Report"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleOpenDelete(item._id, 'analysis', item.jobTitle)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Mock Interviews List */
        filteredInterviews.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
            <Mic className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No mock interviews found.
            </p>
            <Link
              to="/interview"
              className="inline-block mt-3 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Start an AI interview &rarr;
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800 shadow-sm overflow-hidden">
            {filteredInterviews.map((item) => (
              <div
                key={item._id}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <Link
                      to={`/interview/${item._id}`}
                      className="text-sm font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 truncate block"
                    >
                      {item.role}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.createdAt)}
                      </span>
                      <span>&bull;</span>
                      <span className="capitalize">{item.difficulty} Level</span>
                      <span>&bull;</span>
                      <span className="capitalize">{item.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <ScoreBadge score={item.totalScore ?? 'N/A'} max={10} size="md" />
                  <Link
                    to={`/interview/${item._id}`}
                    className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="View Full Report"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleOpenDelete(item._id, 'interview', item.role)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, type: null, title: '' })}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-xs font-semibold">
              Delete "{deleteModal.title}"? This cannot be undone.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteModal({ isOpen: false, id: null, type: null, title: '' })}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HistoryPage;
