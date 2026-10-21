/**
 * PrepPilot - Mock Interview Controller
 * Manages interactive interview sessions, progressive question evaluations, and final reports.
 */

const Interview = require('../models/interview.model');
const {
  generateInterviewQuestions,
  evaluateInterviewAnswer
} = require('../services/gemini.service');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * @route   POST /api/interview/start
 * @desc    Initialize a 5-question mock interview session
 * @access  Private
 */
const startInterview = async (req, res, next) => {
  try {
    const { role, difficulty } = req.body;

    if (!role || role.trim() === '') {
      return sendError(res, 'Target job role is required to start interview.', 400);
    }

    const validDifficulties = ['Beginner', 'Intermediate', 'Advanced'];
    const chosenDifficulty = validDifficulties.includes(difficulty)
      ? difficulty
      : 'Intermediate';

    // 1. Generate 5 targeted questions via Gemini
    const questions = await generateInterviewQuestions(role.trim(), chosenDifficulty);

    // 2. Persist initial session
    const interview = await Interview.create({
      user: req.user._id,
      role: role.trim(),
      difficulty: chosenDifficulty,
      questions: questions.map((q, idx) => ({
        questionNumber: idx + 1,
        category: q.category || 'Technical',
        questionText: q.questionText,
        userAnswer: '',
        score: null,
        feedback: '',
        idealAnswer: ''
      })),
      currentQuestionIndex: 0,
      status: 'in_progress',
      totalScore: 0
    });

    const firstQuestion = interview.questions[0];

    return sendSuccess(
      res,
      {
        interviewId: interview._id,
        role: interview.role,
        difficulty: interview.difficulty,
        totalQuestions: interview.questions.length,
        currentQuestionIndex: 0,
        currentQuestion: {
          questionNumber: firstQuestion.questionNumber,
          category: firstQuestion.category,
          questionText: firstQuestion.questionText
        }
      },
      'Mock interview session started successfully.',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/interview/:id/answer
 * @desc    Submit answer for current question and receive immediate score/critique
 * @access  Private
 */
const submitAnswer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userAnswer } = req.body;

    if (!userAnswer || userAnswer.trim() === '') {
      return sendError(res, 'Please provide an answer before submitting.', 400);
    }

    const interview = await Interview.findOne({ _id: id, user: req.user._id });

    if (!interview) {
      return sendError(res, 'Interview session not found.', 404);
    }

    if (interview.status === 'completed') {
      return sendError(res, 'This interview session is already completed.', 400);
    }

    const currentIndex = interview.currentQuestionIndex;
    const currentQ = interview.questions[currentIndex];

    // 1. Evaluate answer via Gemini
    const evaluation = await evaluateInterviewAnswer(
      currentQ.questionText,
      userAnswer.trim(),
      interview.role,
      interview.difficulty
    );

    // 2. Update current question details
    currentQ.userAnswer = userAnswer.trim();
    currentQ.score = evaluation.score;
    currentQ.feedback = evaluation.feedback;
    currentQ.idealAnswer = evaluation.idealAnswer;
    currentQ.answeredAt = new Date();

    const isLastQuestion = currentIndex >= interview.questions.length - 1;

    if (isLastQuestion) {
      // Calculate overall score (average out of 10)
      const totalScoreSum = interview.questions.reduce((acc, q) => acc + (q.score || 0), 0);
      const avgScore = Number((totalScoreSum / interview.questions.length).toFixed(1));

      interview.status = 'completed';
      interview.totalScore = avgScore;

      // Generate brief overall summary
      if (avgScore >= 8) {
        interview.finalFeedback = `Outstanding performance for a ${interview.difficulty} ${interview.role}. Your responses showed technical clarity, depth, and structured communication.`;
      } else if (avgScore >= 6) {
        interview.finalFeedback = `Good overall demonstration of core knowledge. Review the ideal answers to enhance technical specificity and address edge cases.`;
      } else {
        interview.finalFeedback = `Foundational understanding is present, but responses were either too brief or missed critical technical concepts. Focus on practicing detailed structured explanations.`;
      }

      await interview.save();

      return sendSuccess(
        res,
        {
          isCompleted: true,
          evaluation: {
            questionNumber: currentQ.questionNumber,
            score: evaluation.score,
            feedback: evaluation.feedback,
            idealAnswer: evaluation.idealAnswer
          },
          finalSummary: {
            interviewId: interview._id,
            totalScore: interview.totalScore,
            finalFeedback: interview.finalFeedback,
            completedAt: new Date()
          },
          nextQuestion: null
        },
        'Interview completed! Final report generated.'
      );
    } else {
      interview.currentQuestionIndex = currentIndex + 1;
      await interview.save();

      const nextQ = interview.questions[interview.currentQuestionIndex];

      return sendSuccess(
        res,
        {
          isCompleted: false,
          evaluation: {
            questionNumber: currentQ.questionNumber,
            score: evaluation.score,
            feedback: evaluation.feedback,
            idealAnswer: evaluation.idealAnswer
          },
          currentQuestionIndex: interview.currentQuestionIndex,
          nextQuestion: {
            questionNumber: nextQ.questionNumber,
            category: nextQ.category,
            questionText: nextQ.questionText
          }
        },
        'Answer evaluated. Moving to next question.'
      );
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/interview
 * @desc    Get all interview sessions for the logged-in user
 * @access  Private
 */
const getInterviews = async (req, res, next) => {
  try {
    const interviews = await Interview.find({ user: req.user._id })
      .select('role difficulty status totalScore createdAt questions')
      .sort({ createdAt: -1 });

    return sendSuccess(res, interviews, 'Interview history retrieved successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/interview/:id
 * @desc    Get complete interview details / report
 * @access  Private
 */
const getInterviewById = async (req, res, next) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!interview) {
      return sendError(res, 'Interview record not found.', 404);
    }

    return sendSuccess(res, interview, 'Interview report retrieved successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/interview/:id
 * @desc    Delete an interview session
 * @access  Private
 */
const deleteInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!interview) {
      return sendError(res, 'Interview record not found.', 404);
    }

    return sendSuccess(res, null, 'Interview record deleted successfully.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startInterview,
  submitAnswer,
  getInterviews,
  getInterviewById,
  deleteInterview
};
