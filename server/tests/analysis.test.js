/**
 * PrepPilot - AI Resume Analysis Test Suite
 * Tests resume upload, ATS parsing, and retrieval with mocked Gemini AI service.
 */

const request = require('supertest');
const app = require('../src/app');
require('./setup');

// Mock Gemini AI and PDF text extraction services
jest.mock('../src/services/gemini.service', () => ({
  analyzeResumeWithGemini: jest.fn().mockResolvedValue({
    atsScore: 88,
    matchedKeywords: ['React', 'Node.js', 'Express', 'MongoDB'],
    missingKeywords: ['Docker', 'AWS'],
    strengths: ['Great full-stack foundation', 'Good project descriptions'],
    weaknesses: ['Missing cloud infrastructure keywords'],
    sectionFeedback: {
      summary: 'Solid summary statement.',
      skills: 'Good frontend and backend categories.',
      projects: 'Strong projects.',
      education: 'Clear education section.'
    },
    suggestions: [
      'Add Docker containerization experience.',
      'Quantify project outcomes.',
      'Include AWS deployment details.',
      'Highlight automated testing experience.',
      'Add link to GitHub portfolio.'
    ]
  }),
  generateInterviewQuestions: jest.fn(),
  evaluateInterviewAnswer: jest.fn()
}));

jest.mock('../src/services/pdf.service', () => ({
  extractTextFromPDF: jest.fn().mockResolvedValue(
    'Jane Candidate. Full Stack Developer skilled in React, Node.js, Express, MongoDB. Built several web applications.'
  )
}));

describe('Resume Analysis Endpoints (Gemini Mocked)', () => {
  let authToken;

  beforeEach(async () => {
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Candidate',
        email: 'test@candidate.com',
        password: 'Password123'
      });

    authToken = regRes.body.data.token;
  });

  describe('POST /api/analysis/upload', () => {
    it('should upload a resume and return AI ATS evaluation results', async () => {
      const res = await request(app)
        .post('/api/analysis/upload')
        .set('Authorization', `Bearer ${authToken}`)
        .field('jobTitle', 'Full Stack Developer')
        .field('jobDescription', 'Looking for a full stack developer with experience in React and Node.js to build scalable web applications.')
        .attach('resume', Buffer.from('%PDF-1.4 Mock PDF Content'), 'test_resume.pdf');

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('atsScore', 88);
      expect(res.body.data.matchedKeywords).toContain('React');
      expect(res.body.data.missingKeywords).toContain('Docker');
      expect(res.body.data.suggestions.length).toBe(5);
    });

    it('should reject request when no resume file is attached', async () => {
      const res = await request(app)
        .post('/api/analysis/upload')
        .set('Authorization', `Bearer ${authToken}`)
        .field('jobTitle', 'Full Stack Developer')
        .field('jobDescription', 'Looking for a developer with React and Node experience.');

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/analysis', () => {
    it('should retrieve list of previous analyses for user', async () => {
      // 1. Upload one analysis
      await request(app)
        .post('/api/analysis/upload')
        .set('Authorization', `Bearer ${authToken}`)
        .field('jobTitle', 'React Developer')
        .field('jobDescription', 'Senior frontend react developer with solid component design.')
        .attach('resume', Buffer.from('%PDF-1.4 Mock PDF Content'), 'resume.pdf');

      // 2. Fetch list
      const res = await request(app)
        .get('/api/analysis')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].jobTitle).toBe('React Developer');
    });
  });

  describe('GET /api/dashboard/stats', () => {
    it('should return aggregated dashboard metrics', async () => {
      const res = await request(app)
        .get('/api/dashboard/stats')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalAnalyses');
      expect(res.body.data).toHaveProperty('averageAtsScore');
      expect(res.body.data).toHaveProperty('scoreHistory');
    });
  });
});
