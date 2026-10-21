/**
 * PrepPilot - Resume Analysis Controller
 * Handles resume uploads, text extraction via pdf-parse, AI evaluation via Gemini, and history querying.
 */

const Analysis = require('../models/analysis.model');
const { extractTextFromPDF } = require('../services/pdf.service');
const { analyzeResumeWithGemini } = require('../services/gemini.service');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * @route   POST /api/analysis/upload
 * @desc    Upload PDF resume and evaluate against target job description
 * @access  Private
 */
const uploadAndAnalyze = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 'Please upload a PDF resume file.', 400);
    }

    const { jobTitle, jobDescription } = req.body;

    if (!jobTitle || jobTitle.trim() === '') {
      return sendError(res, 'Job title is required.', 400);
    }

    if (!jobDescription || jobDescription.trim().length < 20) {
      return sendError(res, 'Please provide a descriptive job description (at least 20 characters).', 400);
    }

    // 1. Extract plain text from PDF buffer
    let rawText = '';
    try {
      rawText = await extractTextFromPDF(req.file.buffer);
    } catch (parseErr) {
      return sendError(res, parseErr.message, 400);
    }

    // 2. Perform Gemini AI ATS Analysis
    const aiResult = await analyzeResumeWithGemini(rawText, jobDescription.trim(), jobTitle.trim());

    // 3. Persist Analysis Record to MongoDB
    const analysisRecord = await Analysis.create({
      user: req.user._id,
      jobTitle: jobTitle.trim(),
      jobDescription: jobDescription.trim(),
      resumeFileName: req.file.originalname || 'resume.pdf',
      resumeRawText: rawText.slice(0, 5000), // Store preview
      atsScore: aiResult.atsScore,
      matchedKeywords: aiResult.matchedKeywords,
      missingKeywords: aiResult.missingKeywords,
      strengths: aiResult.strengths,
      weaknesses: aiResult.weaknesses,
      sectionFeedback: aiResult.sectionFeedback,
      suggestions: aiResult.suggestions
    });

    return sendSuccess(
      res,
      analysisRecord,
      'Resume analyzed successfully against target job description.',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/analysis
 * @desc    Get all resume analyses for logged-in user
 * @access  Private
 */
const getAnalyses = async (req, res, next) => {
  try {
    const analyses = await Analysis.find({ user: req.user._id })
      .select('-resumeRawText -jobDescription')
      .sort({ createdAt: -1 });

    return sendSuccess(res, analyses, 'User resume analyses retrieved successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/analysis/:id
 * @desc    Get specific analysis report by ID
 * @access  Private
 */
const getAnalysisById = async (req, res, next) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!analysis) {
      return sendError(res, 'Analysis record not found.', 404);
    }

    return sendSuccess(res, analysis, 'Analysis details retrieved successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/analysis/:id
 * @desc    Delete analysis record
 * @access  Private
 */
const deleteAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!analysis) {
      return sendError(res, 'Analysis record not found.', 404);
    }

    return sendSuccess(res, null, 'Analysis record deleted successfully.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadAndAnalyze,
  getAnalyses,
  getAnalysisById,
  deleteAnalysis
};
