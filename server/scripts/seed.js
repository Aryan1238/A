/**
 * PrepPilot - Database Seed Script
 * Pre-populates the database with a demo student account, sample resume analyses,
 * and realistic completed mock interviews. Perfect for viva evaluation!
 *
 * Usage: npm run seed
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../src/models/user.model');
const Analysis = require('../src/models/analysis.model');
const Interview = require('../src/models/interview.model');

async function seedDatabase() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/preppilot';

  console.log('🌱 Starting PrepPilot database seed...');
  console.log(`📡 Target MongoDB URI: ${mongoUri}`);

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      directConnection: true,
      family: 4
    });
    console.log('✅ Connected to MongoDB.');
  } catch (err) {
    console.warn(`⚠️ Standard MongoDB connection failed: ${err.message}`);
    console.log('🔄 Attempting MongoMemoryServer fallback for local seed test...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      await mongoose.connect(mongod.getUri());
      console.log('✅ Connected to in-memory MongoDB.');
    } catch (memErr) {
      console.error('❌ Could not connect to any MongoDB instance:', memErr.message);
      process.exit(1);
    }
  }

  try {
    // 1. Clear existing demo user & records
    const demoEmail = 'demo@preppilot.com';
    const existingUser = await User.findOne({ email: demoEmail });

    if (existingUser) {
      await Promise.all([
        Analysis.deleteMany({ user: existingUser._id }),
        Interview.deleteMany({ user: existingUser._id }),
        User.deleteOne({ _id: existingUser._id })
      ]);
      console.log('🧹 Purged existing demo user records.');
    }

    // 2. Create Demo User
    const demoUser = await User.create({
      name: 'Alex Rivera (Demo Student)',
      email: demoEmail,
      passwordHash: 'password123'
    });
    console.log(`👤 Created Demo User: ${demoUser.name} <${demoUser.email}>`);

    // 3. Create Sample Resume Analyses
    const sampleAnalyses = [
      {
        user: demoUser._id,
        jobTitle: 'Full Stack Software Engineer',
        jobDescription: 'Seeking a Full Stack Engineer proficient in React, Node.js, Express, MongoDB, and Docker. Experience with microservices, REST APIs, and AWS deployment required.',
        resumeFileName: 'AlexRivera_FullStack_Resume.pdf',
        resumeRawText: 'Alex Rivera - Full Stack Developer. Experience with React, Node.js, Express, MongoDB, Git, HTML/CSS. Built multiple full-stack applications with user authentication and payment workflows.',
        atsScore: 86,
        matchedKeywords: ['React', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'Git', 'JavaScript'],
        missingKeywords: ['Docker', 'AWS', 'Microservices', 'Kubernetes'],
        strengths: [
          'Strong full-stack foundation across the MERN stack with verified project implementations.',
          'Clear presentation of API design and backend architecture principles.',
          'Solid command of modern ECMAScript standards and clean component architecture.'
        ],
        weaknesses: [
          'No mention of Docker containerization or CI/CD pipelines required by modern engineering teams.',
          'Lack of cloud infrastructure exposure (AWS/GCP/Azure) mentioned in target requirements.'
        ],
        sectionFeedback: {
          summary: 'Engaging summary, but should explicitly state your years of hands-on experience and career focus.',
          skills: 'Frontend and backend are well separated. Recommend creating a dedicated DevOps/Cloud category.',
          projects: 'Strong technical scope; augment bullet points with quantifiable performance improvements.',
          education: 'Concise B.Tech in Computer Science details clearly presented.'
        },
        suggestions: [
          'Add Docker containerization experience to skills and describe how your web apps are deployed.',
          'Quantify accomplishments (e.g., "reduced query latency by 40% with database indexing").',
          'Highlight unit and integration testing experience (Jest, Supertest, React Testing Library).',
          'Align resume title directly with the target job posting ("Full Stack Software Engineer").',
          'Include links to GitHub repository commits and live demo deployments.'
        ],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        user: demoUser._id,
        jobTitle: 'Frontend React Developer',
        jobDescription: 'Frontend Developer wanted with in-depth knowledge of React, Tailwind CSS, TypeScript, Next.js, and client-side performance optimization.',
        resumeFileName: 'AlexRivera_Frontend_Resume.pdf',
        resumeRawText: 'Alex Rivera - Frontend Specialist. Built responsive single page apps using React, Tailwind CSS, Vite, Redux Toolkit, and RESTful integrations.',
        atsScore: 92,
        matchedKeywords: ['React', 'Tailwind CSS', 'TypeScript', 'Next.js', 'Vite', 'Redux Toolkit', 'Responsive Design'],
        missingKeywords: ['Webpack', 'GraphQL', 'Storybook'],
        strengths: [
          'Exceptional keyword match for modern frontend development tooling.',
          'Demonstrated expertise in responsive UI design and state management.',
          'High alignment with component modularity best practices.'
        ],
        weaknesses: [
          'Lacks mentions of GraphQL or modern data fetching libraries like TanStack Query.',
          'Limited details regarding automated UI testing with Cypress or Playwright.'
        ],
        sectionFeedback: {
          summary: 'Impactful summary highlighting frontend UI/UX proficiency.',
          skills: 'Excellent categorization of modern frontend libraries and CSS frameworks.',
          projects: 'Projects demonstrate real-world utility and modern UI/UX execution.',
          education: 'Degree and relevant coursework are properly formatted.'
        },
        suggestions: [
          'Incorporate experience with TanStack Query or GraphQL for advanced data handling.',
          'Add a bullet point demonstrating end-to-end component testing with Cypress or Jest.',
          'Mention Lighthouse accessibility and SEO scores achieved on your projects.',
          'Highlight experience with atomic design patterns and reusable UI component libraries.',
          'Quantify page load speed improvements achieved using Vite and code-splitting.'
        ],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      }
    ];

    await Analysis.insertMany(sampleAnalyses);
    console.log(`📄 Seeded ${sampleAnalyses.length} sample Resume Analysis records.`);

    // 4. Create Sample Completed Mock Interviews
    const sampleInterviews = [
      {
        user: demoUser._id,
        role: 'Frontend Developer',
        difficulty: 'Intermediate',
        status: 'completed',
        totalScore: 8.4,
        finalFeedback: 'Outstanding demonstration of React fundamentals, state management, and performance concepts. Answers were structured and demonstrated practical insight.',
        questions: [
          {
            questionNumber: 1,
            category: 'Core Fundamentals',
            questionText: 'How does React Virtual DOM reconciliation work, and what role do keys play in list rendering?',
            userAnswer: 'The Virtual DOM is an in-memory lightweight representation of the actual DOM. React compares the old and new VDOM trees using a diffing algorithm. Keys give elements a stable identity so React knows which items were added, changed, or removed without re-rendering the whole list.',
            score: 9,
            feedback: 'Excellent response! Accurately explains tree diffing heuristics and why stable keys prevent unnecessary re-renders.',
            idealAnswer: 'Key points: 1) In-memory JavaScript object representation, 2) Heuristic diffing algorithm (O(n) complexity), 3) Keys identify identical elements across renders, 4) Batching DOM writes for performance.',
            answeredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          },
          {
            questionNumber: 2,
            category: 'Hooks & State',
            questionText: 'Explain the difference between useEffect, useMemo, and useCallback. When would using useCallback actually hurt performance?',
            userAnswer: 'useEffect runs side effects after render. useMemo caches the result of an expensive calculation. useCallback memoizes the callback function reference between renders. Using useCallback on trivial inline handlers adds overhead because creating the wrapper hook has memory and comparison cost.',
            score: 8,
            feedback: 'Great answer highlighting the overhead cost of memoization on simple functions.',
            idealAnswer: 'Key points: 1) Side effects vs memoized values vs function references, 2) Dependency array mechanics, 3) useCallback overhead when passed to non-memoized child components.',
            answeredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          },
          {
            questionNumber: 3,
            category: 'Performance',
            questionText: 'How do you identify and fix unnecessary re-renders in a complex React dashboard?',
            userAnswer: 'I use React DevTools Profiler to record render flamegraphs. To fix them, I lift state appropriately, use React.memo on heavy children, and break down monolithic context providers into smaller slices.',
            score: 9,
            feedback: 'Very practical and industry-aligned troubleshooting approach.',
            idealAnswer: 'Key points: 1) React Profiler tool, 2) React.memo for pure components, 3) Splitting contexts, 4) Code splitting with React.lazy and Suspense.',
            answeredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          },
          {
            questionNumber: 4,
            category: 'CSS & Layout',
            questionText: 'What are the benefits of utility-first CSS frameworks like Tailwind compared to traditional component-based CSS modules?',
            userAnswer: 'Tailwind avoids naming fatigue, keeps CSS bundle size small through PurgeCSS/content scanning, and prevents styling regressions since classes are scoped right to elements.',
            score: 8,
            feedback: 'Clear, concise points on production bundle size and developer velocity.',
            idealAnswer: 'Key points: 1) No context-switching between files, 2) Predictable constraint-based design tokens, 3) Automatic purging of unused CSS.',
            answeredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          },
          {
            questionNumber: 5,
            category: 'Behavioral',
            questionText: 'Describe a situation where you had to fix a layout or responsiveness issue right before a deadline.',
            userAnswer: 'During our college project demo prep, our mobile navigation broke on iOS Safari due to safe-area-inset and 100vh calculation differences. I used dynamic dvh viewport units and tested on device emulators to fix it within an hour.',
            score: 8,
            feedback: 'Good problem-action-result narrative showcasing quick debugging under pressure.',
            idealAnswer: 'Key points: STAR format: Situation, Task, Action taken (using dvh/modern CSS), and Result (successful smooth presentation).',
            answeredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          }
        ],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];

    await Interview.insertMany(sampleInterviews);
    console.log(`🎤 Seeded ${sampleInterviews.length} sample Mock Interview records.`);

    console.log('====================================================');
    console.log('🎉 PrepPilot database seeded successfully!');
    console.log('🔑 Demo User Credentials:');
    console.log(`   Email:    demo@preppilot.com`);
    console.log(`   Password: password123`);
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
