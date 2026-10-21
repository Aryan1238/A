/**
 * PrepPilot - Gemini AI Service
 * Integrates Google Gemini API via @google/generative-ai with strict JSON schema prompts.
 * Includes intelligent mock fallback for zero-downtime college viva presentations.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { cleanAndParseJson } = require('../utils/jsonParser');

/**
 * Get active Gemini generative model instance
 */
function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    return null;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.3,
      topP: 0.8,
      topK: 40
    }
  });
}

/**
 * Analyzes resume against job description using Gemini AI
 */
async function analyzeResumeWithGemini(resumeText, jobDescription, jobTitle) {
  const model = getGeminiModel();

  if (!model) {
    console.warn('⚠️ [Gemini Service]: No GEMINI_API_KEY provided in .env. Using intelligent mock analysis for viva demo.');
    return generateMockAnalysis(resumeText, jobDescription, jobTitle);
  }

  const prompt = `
You are an expert Application Tracking System (ATS) auditor and senior technical recruiter.
Evaluate the candidate's resume text against the target job title and job description.

Target Job Title: "${jobTitle}"

Target Job Description:
"""
${jobDescription}
"""

Candidate Resume Text:
"""
${resumeText.slice(0, 8000)}
"""

INSTRUCTIONS:
1. Calculate a realistic, rigorous ATS match score between 0 and 100 based on keyword density, relevancy, and experience alignment.
2. Extract matched skills/technologies found in both.
3. Identify crucial missing skills/technologies from the job description not in the resume.
4. Highlight candidate strengths and weaknesses.
5. Provide concise, targeted section-wise feedback for: summary, skills, projects, and education.
6. Provide EXACTLY 5 concrete, actionable improvement recommendations.
7. Return ONLY a single valid RFC8259 JSON object with no markdown wrapping, no chatter, and no backticks.

REQUIRED JSON FORMAT:
{
  "atsScore": 82,
  "matchedKeywords": ["React", "Node.js", "Express", "REST API", "Git"],
  "missingKeywords": ["Docker", "Kubernetes", "AWS", "CI/CD"],
  "strengths": [
    "Solid demonstrated hands-on experience with modern JavaScript and full-stack web architectures.",
    "Clear separation of technical projects with relevant tooling listed."
  ],
  "weaknesses": [
    "Lacks mentions of containerization and automated testing.",
    "Project bullet points lack quantifiable business metrics."
  ],
  "sectionFeedback": {
    "summary": "Clear career intent, but would benefit from mentioning target years of experience or core domain expertise.",
    "skills": "Well organized into frontend/backend, but missing modern cloud and deployment tooling.",
    "projects": "Strong technical depth; recommend adding metrics (e.g., 'improved performance by 25%').",
    "education": "Concise and well placed."
  },
  "suggestions": [
    "Incorporate containerization tools like Docker into your skills and project deployment descriptions.",
    "Add quantitative results (percentages, latency improvements, user counts) to project bullet points.",
    "Highlight experience with automated testing tools such as Jest or Cypress.",
    "Align resume headline directly with the target job title: '${jobTitle}'.",
    "Include a dedicated section for Cloud / DevOps practices (e.g. AWS, GitHub Actions)."
  ]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    const parsed = cleanAndParseJson(responseText);

    // Validate and enforce schema shape
    return {
      atsScore: Math.min(100, Math.max(0, Math.round(Number(parsed.atsScore) || 75))),
      matchedKeywords: Array.isArray(parsed.matchedKeywords) ? parsed.matchedKeywords : [],
      missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [],
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
      sectionFeedback: {
        summary: parsed.sectionFeedback?.summary || 'Review and focus your professional summary.',
        skills: parsed.sectionFeedback?.skills || 'Highlight core technologies relevant to the role.',
        projects: parsed.sectionFeedback?.projects || 'Add quantified impact to your project bullet points.',
        education: parsed.sectionFeedback?.education || 'Ensure degree details and graduation year are clear.'
      },
      suggestions: Array.isArray(parsed.suggestions) && parsed.suggestions.length > 0
        ? parsed.suggestions.slice(0, 5)
        : [
            'Tailor your project descriptions to match keywords from the job description.',
            'Include measurable metrics and business outcomes in your project bullet points.',
            'Highlight required frameworks and tools prominently under your technical skills section.',
            'Add links to your active GitHub repositories or live project demos.',
            'Refine your resume summary to directly mirror the core qualifications of this role.'
          ]
    };
  } catch (error) {
    console.error(`⚠️ [Gemini Service Error]: ${error.message}. Falling back to mock analysis.`);
    return generateMockAnalysis(resumeText, jobDescription, jobTitle);
  }
}

/**
 * Generates 5 interview questions for a given role and difficulty using Gemini
 */
async function generateInterviewQuestions(role, difficulty) {
  const model = getGeminiModel();

  if (!model) {
    console.warn('⚠️ [Gemini Service]: Using mock interview questions for viva demo.');
    return generateMockQuestions(role, difficulty);
  }

  const prompt = `
You are an expert technical interviewer hiring for the position: "${role}" at "${difficulty}" difficulty level.
Generate EXACTLY 5 tailored, realistic interview questions for this candidate.
Mix technical fundamentals, practical scenario/problem solving, and behavioral or architectural considerations.

INSTRUCTIONS:
1. Return ONLY a single valid RFC8259 JSON array containing exactly 5 objects.
2. No conversational preamble, no markdown fences, no backticks.

REQUIRED JSON FORMAT:
[
  {
    "questionNumber": 1,
    "category": "Core Fundamentals",
    "questionText": "Question 1 text goes here"
  },
  {
    "questionNumber": 2,
    "category": "Practical Implementation",
    "questionText": "Question 2 text goes here"
  },
  {
    "questionNumber": 3,
    "category": "Architecture & Design",
    "questionText": "Question 3 text goes here"
  },
  {
    "questionNumber": 4,
    "category": "Troubleshooting & Optimization",
    "questionText": "Question 4 text goes here"
  },
  {
    "questionNumber": 5,
    "category": "Behavioral & Collaboration",
    "questionText": "Question 5 text goes here"
  }
]
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    const parsed = cleanAndParseJson(responseText);

    if (Array.isArray(parsed) && parsed.length >= 5) {
      return parsed.slice(0, 5).map((q, idx) => ({
        questionNumber: idx + 1,
        category: q.category || 'Technical',
        questionText: q.questionText || `Question ${idx + 1}`
      }));
    }

    throw new Error('Gemini did not return an array of 5 questions');
  } catch (error) {
    console.error(`⚠️ [Gemini Service Error]: ${error.message}. Falling back to mock questions.`);
    return generateMockQuestions(role, difficulty);
  }
}

/**
 * Evaluates candidate's answer for a question using Gemini
 */
async function evaluateInterviewAnswer(questionText, userAnswer, role, difficulty) {
  const model = getGeminiModel();

  if (!model) {
    return generateMockEvaluation(questionText, userAnswer);
  }

  const prompt = `
You are an expert interviewer evaluating a candidate for the position of "${role}" (${difficulty} level).

Question:
"${questionText}"

Candidate's Answer:
"${userAnswer}"

INSTRUCTIONS:
1. Score the answer from 0 to 10 (10 = comprehensive, accurate, well-structured; 0 = empty or completely irrelevant).
2. Provide concise, constructive feedback pointing out strengths and gaps.
3. Provide an ideal-answer outline highlighting 3 to 4 core points that should have been covered.
4. Return ONLY a single valid RFC8259 JSON object with no backticks, no markdown formatting.

REQUIRED JSON FORMAT:
{
  "score": 8,
  "feedback": "Strong explanation of the core concept. Good mention of edge cases, though missing performance trade-offs.",
  "idealAnswer": "Key points: 1) Definition and mechanism, 2) Trade-offs/performance implications, 3) Real-world example or best practice."
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    const parsed = cleanAndParseJson(responseText);

    return {
      score: Math.min(10, Math.max(0, Math.round(Number(parsed.score) || 6))),
      feedback: parsed.feedback || 'Good effort. Make sure to structure your response with concrete examples and trade-offs.',
      idealAnswer: parsed.idealAnswer || 'Key points: Core conceptual definition, practical implementation steps, and architectural trade-offs.'
    };
  } catch (error) {
    console.error(`⚠️ [Gemini Service Error]: ${error.message}. Falling back to mock evaluation.`);
    return generateMockEvaluation(questionText, userAnswer);
  }
}

/* =========================================================================
   MOCK GENERATORS (Ensures zero-downtime offline demonstrations during viva)
   ========================================================================= */

function generateMockAnalysis(resumeText, jobDescription, jobTitle) {
  // Simple keyword matching heuristic for mock
  const commonTech = [
    'React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'TypeScript',
    'HTML', 'CSS', 'Tailwind', 'Git', 'REST', 'API', 'Docker', 'AWS',
    'Python', 'SQL', 'Redux', 'GraphQL', 'Next.js', 'CI/CD', 'Testing'
  ];

  const resumeLower = (resumeText || '').toLowerCase();
  const jdLower = (jobDescription || '').toLowerCase();

  const matched = commonTech.filter(tech =>
    resumeLower.includes(tech.toLowerCase()) && jdLower.includes(tech.toLowerCase())
  );

  const missing = commonTech.filter(tech =>
    jdLower.includes(tech.toLowerCase()) && !resumeLower.includes(tech.toLowerCase())
  );

  // If few detected, provide sensible defaults
  const matchedKeywords = matched.length > 0 ? matched : ['JavaScript', 'React', 'Git', 'REST APIs'];
  const missingKeywords = missing.length > 0 ? missing : ['Docker', 'AWS Cloud', 'Unit Testing', 'CI/CD Pipelines'];

  const scoreBase = Math.min(92, Math.max(55, 60 + matchedKeywords.length * 4 - missingKeywords.length * 2));

  return {
    atsScore: scoreBase,
    matchedKeywords,
    missingKeywords,
    strengths: [
      `Demonstrated alignment with target ${jobTitle} requirements in core development skills.`,
      'Well-structured experience detailing hands-on project implementations.',
      'Strong foundational proficiency in modern web software engineering.'
    ],
    weaknesses: [
      `Resume shows limited coverage of target infrastructure requirements (${missingKeywords.slice(0, 2).join(', ')}).`,
      'Bullet points describe tasks rather than measurable business metrics and results.'
    ],
    sectionFeedback: {
      summary: `Tailor your professional headline directly to "${jobTitle}" and emphasize key years of practice.`,
      skills: `Prominently showcase ${matchedKeywords.slice(0, 3).join(', ')} and address gaps in ${missingKeywords.slice(0, 2).join(', ')}.`,
      projects: 'Enhance project bullets with metrics (e.g., latency reduction, user base, or uptime).',
      education: 'Ensure academic achievements, CGPA/percentages, and relevant coursework are clearly legible.'
    },
    suggestions: [
      `Incorporate the missing keywords (${missingKeywords.slice(0, 3).join(', ')}) into your skills and project descriptions.`,
      'Rewrite project bullets using the STAR (Situation, Task, Action, Result) framework.',
      'Add quantifiable achievements (e.g., "improved load time by 35%").',
      'Include direct links to deployed live demos or GitHub code repositories.',
      'Add a dedicated section for software testing (Jest, Cypress, or Integration tests).'
    ]
  };
}

function generateMockQuestions(role, difficulty) {
  const roleLower = (role || '').toLowerCase();

  if (roleLower.includes('frontend') || roleLower.includes('react')) {
    return [
      {
        questionNumber: 1,
        category: 'Core Fundamentals',
        questionText: 'How does React Virtual DOM reconciliation work, and what role do keys play in list rendering?'
      },
      {
        questionNumber: 2,
        category: 'State & Lifecycle',
        questionText: 'Explain the difference between useEffect, useMemo, and useCallback. When would using useCallback actually hurt performance?'
      },
      {
        questionNumber: 3,
        category: 'Performance & Optimization',
        questionText: 'How do you identify and fix unnecessary re-renders in a complex React dashboard?'
      },
      {
        questionNumber: 4,
        category: 'Architecture & State Management',
        questionText: 'Compare Context API with Redux or Zustand for enterprise applications. How do you avoid context render cascades?'
      },
      {
        questionNumber: 5,
        category: 'Behavioral & Problem Solving',
        questionText: 'Tell me about a challenging frontend bug or layout issue you debugged under a tight placement or project deadline.'
      }
    ];
  }

  // Default Full Stack / Software Engineer Questions
  return [
    {
      questionNumber: 1,
      category: 'Core Architecture',
      questionText: `What are the core architectural trade-offs between monolithic and microservice architectures for a ${role}?`
    },
    {
      questionNumber: 2,
      category: 'Database & Data Modeling',
      questionText: 'When would you choose a NoSQL database like MongoDB over a relational database like PostgreSQL for application data?'
    },
    {
      questionNumber: 3,
      category: 'API Design & Security',
      questionText: 'How do you secure REST APIs against common vulnerabilities like CSRF, XSS, and rate exhaustion?'
    },
    {
      questionNumber: 4,
      category: 'System Performance',
      questionText: 'Explain how you would design a caching layer with Redis to optimize database query bottlenecks.'
    },
    {
      questionNumber: 5,
      category: 'Behavioral & Leadership',
      questionText: 'Describe a situation where you had a technical disagreement with a team member. How did you arrive at a resolution?'
    }
  ];
}

function generateMockEvaluation(questionText, userAnswer) {
  const words = (userAnswer || '').trim().split(/\s+/).filter(Boolean).length;

  let score = 5;
  let feedback = 'Your answer covers the general idea, but lacks technical depth and concrete real-world examples.';

  if (words < 10) {
    score = 3;
    feedback = 'The response is too brief. In an interview, elaborate with definitions, use cases, and technical trade-offs.';
  } else if (words >= 40) {
    score = 8;
    feedback = 'Well-articulated response with solid technical terminology and logical structure.';
  } else if (words >= 20) {
    score = 6;
    feedback = 'Good foundational answer. Try adding an example from a project you built to make it memorable.';
  }

  return {
    score,
    feedback,
    idealAnswer: 'Key points to cover: 1) Clear conceptual definition, 2) Underlying mechanics and internal workings, 3) Concrete trade-offs or performance considerations, 4) Real-world project application.'
  };
}

module.exports = {
  analyzeResumeWithGemini,
  generateInterviewQuestions,
  evaluateInterviewAnswer
};
