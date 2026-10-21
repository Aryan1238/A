/**
 * PrepPilot - Resume Analysis Model
 * Persists ATS scoring, keyword extraction, section critiques, and improvement suggestions.
 */

const mongoose = require('mongoose');

const sectionFeedbackSchema = new mongoose.Schema(
  {
    summary: { type: String, default: '' },
    skills: { type: String, default: '' },
    projects: { type: String, default: '' },
    education: { type: String, default: '' }
  },
  { _id: false }
);

const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true
    },
    jobDescription: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true
    },
    resumeFileName: {
      type: String,
      default: 'resume.pdf'
    },
    resumeRawText: {
      type: String,
      default: ''
    },
    atsScore: {
      type: Number,
      required: true,
      min: [0, 'Score cannot be less than 0'],
      max: [100, 'Score cannot exceed 100']
    },
    matchedKeywords: {
      type: [String],
      default: []
    },
    missingKeywords: {
      type: [String],
      default: []
    },
    strengths: {
      type: [String],
      default: []
    },
    weaknesses: {
      type: [String],
      default: []
    },
    sectionFeedback: {
      type: sectionFeedbackSchema,
      default: () => ({})
    },
    suggestions: {
      type: [String],
      validate: [
        (val) => !val || val.length <= 10,
        'Cannot have more than 10 suggestions'
      ],
      default: []
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: false
  }
);

const Analysis = mongoose.model('Analysis', analysisSchema);
module.exports = Analysis;
