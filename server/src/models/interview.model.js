/**
 * PrepPilot - Mock Interview Model
 * Stores interactive multi-turn interview sessions, question lists, scores, and evaluations.
 */

const mongoose = require('mongoose');

const questionItemSchema = new mongoose.Schema(
  {
    questionNumber: {
      type: Number,
      required: true
    },
    questionText: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: 'Technical'
    },
    userAnswer: {
      type: String,
      default: ''
    },
    score: {
      type: Number,
      min: 0,
      max: 10,
      default: null
    },
    feedback: {
      type: String,
      default: ''
    },
    idealAnswer: {
      type: String,
      default: ''
    },
    answeredAt: {
      type: Date,
      default: null
    }
  },
  { _id: true }
);

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    role: {
      type: String,
      required: [true, 'Interview target role is required'],
      trim: true
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate'
    },
    questions: {
      type: [questionItemSchema],
      validate: [
        (val) => val && val.length === 5,
        'An interview must contain exactly 5 questions'
      ]
    },
    currentQuestionIndex: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed'],
      default: 'in_progress'
    },
    totalScore: {
      type: Number,
      default: 0
    },
    finalFeedback: {
      type: String,
      default: ''
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

const Interview = mongoose.model('Interview', interviewSchema);
module.exports = Interview;
