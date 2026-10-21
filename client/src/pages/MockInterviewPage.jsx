/**
 * PrepPilot - Interactive Mock Interview Page
 * Guides candidate through role setup, 5 progressive questions, instant AI scoring, and report completion.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  startInterviewSession,
  submitInterviewAnswer
} from '../services/interview.service';
import InterviewSetupCard from '../components/interview/InterviewSetupCard';
import QuestionCard from '../components/interview/QuestionCard';
import AnswerFeedbackCard from '../components/interview/AnswerFeedbackCard';
import Alert from '../components/common/Alert';
import { Mic, Sparkles } from 'lucide-react';

const MockInterviewPage = () => {
  const navigate = useNavigate();

  // Phase: 'SETUP' | 'QUESTION' | 'FEEDBACK'
  const [phase, setPhase] = useState('SETUP');

  // Interview state
  const [interviewId, setInterviewId] = useState(null);
  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5);

  // Answer Evaluation state
  const [lastEvaluation, setLastEvaluation] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [nextQuestionPending, setNextQuestionPending] = useState(null);

  // Status indicators
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * 1. Start new interview session
   */
  const handleStartInterview = async (selectedRole, selectedDifficulty) => {
    setLoading(true);
    setError(null);

    try {
      const res = await startInterviewSession(selectedRole, selectedDifficulty);
      if (res.success && res.data) {
        setInterviewId(res.data.interviewId);
        setRole(res.data.role);
        setDifficulty(res.data.difficulty);
        setTotalQuestions(res.data.totalQuestions || 5);
        setQuestionNumber(1);
        setCurrentQuestion(res.data.currentQuestion);
        setPhase('QUESTION');
      } else {
        throw new Error(res.message || 'Could not start interview session.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to start interview. Check connection or try another role.'
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * 2. Submit candidate's answer for evaluation
   */
  const handleSubmitAnswer = async (userAnswer) => {
    setLoading(true);
    setError(null);

    try {
      const res = await submitInterviewAnswer(interviewId, userAnswer);
      if (res.success && res.data) {
        setLastEvaluation(res.data.evaluation);
        setIsCompleted(res.data.isCompleted);
        setNextQuestionPending(res.data.nextQuestion);
        setPhase('FEEDBACK');
      } else {
        throw new Error(res.message || 'Answer evaluation failed.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Error submitting answer for evaluation.'
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * 3. Advance to the next question
   */
  const handleNextQuestion = () => {
    if (nextQuestionPending) {
      setCurrentQuestion(nextQuestionPending);
      setQuestionNumber((prev) => prev + 1);
      setNextQuestionPending(null);
      setPhase('QUESTION');
    }
  };

  /**
   * 4. Navigate to final complete report
   */
  const handleViewFinalReport = () => {
    if (interviewId) {
      navigate(`/interview/${interviewId}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-1">
          <Mic className="w-3.5 h-3.5" />
          <span>Interactive AI Technical Interviewer</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Mock Interview Coach
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Practice one question at a time, receive constructive critique, and review model answer outlines.
        </p>
      </div>

      {error && <Alert type="error" message={error} onDismiss={() => setError(null)} />}

      {/* PHASE 1: CONFIGURATION */}
      {phase === 'SETUP' && (
        <InterviewSetupCard
          onStart={handleStartInterview}
          loading={loading}
        />
      )}

      {/* PHASE 2: ACTIVE QUESTION INPUT */}
      {phase === 'QUESTION' && currentQuestion && (
        <QuestionCard
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          category={currentQuestion.category || 'Technical'}
          questionText={currentQuestion.questionText}
          onSubmitAnswer={handleSubmitAnswer}
          loading={loading}
        />
      )}

      {/* PHASE 3: LIVE FEEDBACK & IDEAL ANSWER */}
      {phase === 'FEEDBACK' && lastEvaluation && (
        <AnswerFeedbackCard
          evaluation={lastEvaluation}
          isCompleted={isCompleted}
          nextQuestion={nextQuestionPending}
          onNextQuestion={handleNextQuestion}
          onViewReport={handleViewFinalReport}
        />
      )}
    </div>
  );
};

export default MockInterviewPage;
