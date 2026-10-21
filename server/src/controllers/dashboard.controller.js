/**
 * PrepPilot - Dashboard Analytics Controller
 * Aggregates statistics, scores over time for Recharts graphs, and recent records.
 */

const Analysis = require('../models/analysis.model');
const Interview = require('../models/interview.model');
const { sendSuccess } = require('../utils/responseHandler');

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get dashboard metrics, chart time-series data, and recent activity
 * @access  Private
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch user analyses & interviews
    const [analyses, interviews] = await Promise.all([
      Analysis.find({ user: userId }).sort({ createdAt: 1 }),
      Interview.find({ user: userId }).sort({ createdAt: 1 })
    ]);

    const totalAnalyses = analyses.length;
    const totalInterviews = interviews.length;

    // Average ATS Score
    const avgAtsScore = totalAnalyses > 0
      ? Number((analyses.reduce((acc, a) => acc + (a.atsScore || 0), 0) / totalAnalyses).toFixed(1))
      : 0;

    // Average Interview Score (out of 10)
    const completedInterviews = interviews.filter(i => i.status === 'completed');
    const avgInterviewScore = completedInterviews.length > 0
      ? Number((completedInterviews.reduce((acc, i) => acc + (i.totalScore || 0), 0) / completedInterviews.length).toFixed(1))
      : 0;

    // Prepare unified Score-over-Time timeline for Recharts
    const scoreHistory = [];

    analyses.forEach((a) => {
      scoreHistory.push({
        timestamp: new Date(a.createdAt).getTime(),
        date: new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        type: 'Resume ATS',
        atsScore: a.atsScore,
        interviewScore: null,
        title: a.jobTitle
      });
    });

    completedInterviews.forEach((i) => {
      scoreHistory.push({
        timestamp: new Date(i.createdAt).getTime(),
        date: new Date(i.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        type: 'Mock Interview',
        // Scaled to 100 for side-by-side or percentage comparison, plus raw score /10
        atsScore: null,
        interviewScore: i.totalScore * 10, // scaled out of 100 for clean chart layering
        rawInterviewScore: i.totalScore,
        title: `${i.role} (${i.difficulty})`
      });
    });

    // Sort timeline chronologically
    scoreHistory.sort((a, b) => a.timestamp - b.timestamp);

    return sendSuccess(res, {
      totalAnalyses,
      averageAtsScore: avgAtsScore,
      totalInterviews,
      averageInterviewScore: avgInterviewScore,
      scoreHistory,
      recentAnalyses: [...analyses].reverse().slice(0, 5),
      recentInterviews: [...interviews].reverse().slice(0, 5)
    }, 'Dashboard metrics retrieved successfully.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};
