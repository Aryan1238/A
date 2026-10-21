/**
 * PrepPilot - Candidate Dashboard Page
 * Displays summary KPIs, Recharts score trend chart, and recent activity with deletion.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardMetrics } from '../services/dashboard.service';
import { deleteAnalysisById } from '../services/analysis.service';
import { deleteInterviewById } from '../services/interview.service';
import StatCard from '../components/dashboard/StatCard';
import ScoreChart from '../components/dashboard/ScoreChart';
import RecentAnalysesTable from '../components/dashboard/RecentAnalysesTable';
import RecentInterviewsTable from '../components/dashboard/RecentInterviewsTable';
import Modal from '../components/common/Modal';
import Alert from '../components/common/Alert';
import { SkeletonCard } from '../components/common/Loader';
import {
  FileText,
  Mic,
  TrendingUp,
  Award,
  PlusCircle,
  PlayCircle,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Deletion modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    type: null, // 'analysis' | 'interview'
    title: ''
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getDashboardMetrics();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      setError('Failed to load dashboard metrics. Ensure backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleOpenDelete = (id, type, title = 'record') => {
    setDeleteModal({
      isOpen: true,
      id,
      type,
      title
    });
  };

  const handleConfirmDelete = async () => {
    const { id, type } = deleteModal;
    setDeleteModal({ isOpen: false, id: null, type: null, title: '' });

    try {
      if (type === 'analysis') {
        await deleteAnalysisById(id);
        setSuccessMessage('Resume analysis record removed.');
      } else if (type === 'interview') {
        await deleteInterviewById(id);
        setSuccessMessage('Mock interview record removed.');
      }
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete record.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Welcome Banner & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Placement Readiness Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Candidate'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor your resume match scores and sharpen technical interview answers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/analyze"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Analyze Resume</span>
          </Link>
          <Link
            to="/interview"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Mock Interview</span>
          </Link>
        </div>
      </div>

      {error && <Alert type="error" message={error} onDismiss={() => setError(null)} />}
      {successMessage && <Alert type="success" message={successMessage} onDismiss={() => setSuccessMessage(null)} />}

      {/* KPI Metric Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Analyses"
            value={stats?.totalAnalyses || 0}
            subtitle="Resumes audited with Gemini"
            icon={FileText}
            color="blue"
          />
          <StatCard
            title="Average ATS Score"
            value={stats?.averageAtsScore ? `${stats.averageAtsScore}%` : 'N/A'}
            subtitle="Overall keyword match benchmark"
            icon={TrendingUp}
            color="indigo"
          />
          <StatCard
            title="Mock Interviews"
            value={stats?.totalInterviews || 0}
            subtitle="Completed practice rounds"
            icon={Mic}
            color="emerald"
          />
          <StatCard
            title="Interview Rating"
            value={stats?.averageInterviewScore ? `${stats.averageInterviewScore}/10` : 'N/A'}
            subtitle="Mean technical clarity score"
            icon={Award}
            color="purple"
          />
        </div>
      )}

      {/* Recharts Performance Timeline Graph */}
      {!loading && (
        <ScoreChart data={stats?.scoreHistory || []} />
      )}

      {/* Recent History Tables */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentAnalysesTable
            analyses={stats?.recentAnalyses || []}
            onDelete={(id) => handleOpenDelete(id, 'analysis', 'resume analysis')}
          />
          <RecentInterviewsTable
            interviews={stats?.recentInterviews || []}
            onDelete={(id) => handleOpenDelete(id, 'interview', 'mock interview')}
          />
        </div>
      )}

      {/* Confirmation Modal for Record Deletion */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, type: null, title: '' })}
        title="Confirm Record Deletion"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-xs font-semibold">
              Are you sure you want to delete this {deleteModal.title}? This action cannot be undone.
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
              Delete Permanently
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardPage;
