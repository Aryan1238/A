# PrepPilot 🚀
### AI Resume Analyzer & Mock Interview Coach
> **College Mini Project** &bull; Full-Stack MERN Application with Google Gemini AI Integration

---

## 1. Project Overview

**PrepPilot** is an end-to-end web application developed to help university students and job seekers prepare for technical placement drives. The platform leverages **Google Gemini AI** to deliver two critical capabilities:

1. **AI Resume ATS Auditor**: Parses uploaded PDF resumes in memory using `pdf-parse`, compares extracted text against target job descriptions, computes an ATS match score (0–100), detects matched & missing keywords, provides section-by-section critiques, and delivers **5 concrete improvement suggestions**. Candidates can also export the report as a formatted PDF.
2. **Interactive Mock Interview Coach**: Conducts real-time, 5-question technical rounds based on selected job roles (e.g., Full Stack Engineer, Frontend Developer, Data Scientist) and difficulty tiers (Beginner, Intermediate, Advanced). Evaluates typed answers with instant scoring (/10), constructive critiques, and ideal model answer outlines.
3. **Analytics Dashboard**: Tracks performance over time using **Recharts** visualizations, displays recent activity, and enables record management with permanent deletion.

The application is engineered strictly using the **Model-View-Controller (MVC)** architectural pattern with modular services, complete UML Mermaid diagrams, automated Jest test suites, and mock fallbacks for offline academic viva presentations.

---

## 2. Technology Stack

| Layer | Technologies & Libraries |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Axios, Recharts, Lucide React, html2pdf.js |
| **Backend** | Node.js, Express.js (MVC Pattern), Mongoose, Multer (Memory Storage), pdf-parse, CORS, Morgan |
| **Database** | MongoDB with Mongoose ODM (Data indexing, validation, pre-save hooks) |
| **Authentication** | JSON Web Tokens (JWT Bearer tokens) + bcryptjs password hashing (10 salt rounds) |
| **Generative AI** | Google Gemini API (`@google/generative-ai`, `gemini-1.5-flash`), Strict RFC8259 JSON prompt enforcement |
| **Testing** | Jest + Supertest (mocked Gemini service, automated auth and analysis endpoint suites) |

---

## 3. Directory Structure

```
preppilot/
├── package.json                   # Root workspace scripts
├── README.md                      # Complete setup, endpoint table & viva guide
├── docs/
│   ├── api.md                     # Postman-style REST API documentation
│   └── diagrams.md                # 5 Mermaid UML diagrams (Architecture, Activity, Use Case, ER, Sequence)
├── server/
│   ├── package.json               # Backend dependencies & test scripts
│   ├── .env.example               # Environment variables template
│   ├── .env                       # Active backend environment configuration
│   ├── server.js                  # Entry point (MongoDB connection & HTTP listener)
│   ├── src/
│   │   ├── app.js                 # Express app, middleware & route mounting
│   │   ├── config/
│   │   │   └── db.js              # MongoDB Mongoose connection handler
│   │   ├── models/
│   │   │   ├── user.model.js      # User schema with bcrypt pre-save hashing
│   │   │   ├── analysis.model.js  # ATS score, keywords & section feedback schema
│   │   │   └── interview.model.js # 5-question interview schema & evaluations
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js # JWT Bearer token authentication guard
│   │   │   ├── upload.middleware.js # Multer in-memory PDF filter (5MB limit)
│   │   │   ├── rateLimiter.middleware.js # express-rate-limit for AI endpoints
│   │   │   └── error.middleware.js# Centralized error & 404 handler
│   │   ├── controllers/
│   │   │   ├── auth.controller.js # Register, login, getMe, logout
│   │   │   ├── analysis.controller.js # Upload, extract text, call Gemini, save
│   │   │   ├── interview.controller.js# Start session, submit answer, reports
│   │   │   └── dashboard.controller.js# Aggregated metrics & Recharts timeline
│   │   ├── routes/
│   │   │   ├── auth.routes.js     # /api/auth/*
│   │   │   ├── analysis.routes.js # /api/analysis/*
│   │   │   ├── interview.routes.js# /api/interview/*
│   │   │   └── dashboard.routes.js# /api/dashboard/*
│   │   ├── services/
│   │   │   ├── gemini.service.js  # Gemini prompt engineering & mock fallback
│   │   │   └── pdf.service.js     # Robust PDF text extraction via pdf-parse
│   │   └── utils/
│   │       ├── jsonParser.js      # Resilient AI JSON cleaner & parser
│   │       └── responseHandler.js # Standard { success, message, data } envelope
│   ├── scripts/
│   │   └── seed.js                # Seeds demo student user & sample records
│   └── tests/
│       ├── setup.js               # Jest environment setup with MongoDB
│       ├── auth.test.js           # Tests for registration, login, JWT
│       └── analysis.test.js       # Tests for resume upload with Gemini mocked
└── client/
    ├── package.json               # Frontend dependencies & build scripts
    ├── vite.config.js             # Vite configuration with /api reverse proxy
    ├── tailwind.config.js         # Tailwind CSS styling tokens & dark mode
    ├── postcss.config.js          # PostCSS configuration
    ├── index.html                 # Single-page application entry HTML
    ├── .env.example               # Frontend environment template
    ├── .env                       # Frontend environment configuration
    └── src/
        ├── main.jsx               # React DOM root render
        ├── App.jsx                # Router, providers & protected route layout
        ├── index.css              # Tailwind directives & print styles
        ├── context/
        │   ├── AuthContext.jsx    # Global JWT auth state & user session
        │   └── ThemeContext.jsx   # Dark / light mode state
        ├── services/
        │   ├── api.js             # Axios instance with request/response interceptors
        │   ├── auth.service.js    # Auth HTTP requests
        │   ├── analysis.service.js# Resume analysis HTTP requests
        │   ├── interview.service.js# Interview sessions HTTP requests
        │   └── dashboard.service.js# Dashboard stats HTTP requests
        ├── components/
        │   ├── common/            # Navbar, Footer, ProtectedRoute, ScoreBadge, Modal, Alert, Loader
        │   ├── dashboard/         # StatCard, ScoreChart (Recharts), Recent tables
        │   ├── resume/            # FileUploadZone, KeywordBadgeGroup, SectionFeedback, SuggestionsCard
        │   └── interview/         # InterviewSetupCard, QuestionCard, AnswerFeedbackCard
        ├── pages/
        │   ├── LandingPage.jsx    # Hero, feature showcase, college mini project specs
        │   ├── LoginPage.jsx      # Login form with 1-click Demo Account autofill
        │   ├── RegisterPage.jsx   # Registration form with client validation
        │   ├── DashboardPage.jsx  # KPI metrics, score chart & history tables
        │   ├── AnalyzeResumePage.jsx# PDF upload & Job Description input
        │   ├── AnalysisResultPage.jsx# ATS score meter, suggestions & PDF download
        │   ├── MockInterviewPage.jsx# 5-question progressive AI interview session
        │   ├── InterviewReportPage.jsx# Final interview report with ideal answers
        │   ├── HistoryPage.jsx    # Searchable archive with delete modal
        │   └── NotFoundPage.jsx   # 404 page
        └── utils/
            ├── formatDate.js      # Human-readable date formatter
            └── exportPdf.js       # Client-side html2pdf generator
```

---

## 4. REST API Endpoint Table

All responses follow the standard JSON envelope: `{ success: boolean, message: string, data?: any, errors?: any }`.

| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new candidate (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Bearer Token | Fetch current authenticated candidate profile |
| `POST` | `/api/auth/logout` | Public | Clear client-side session |
| `POST` | `/api/analysis/upload`| Bearer Token | Upload PDF resume (max 5MB) + JD -> Gemini ATS Score (Rate limited) |
| `GET` | `/api/analysis` | Bearer Token | Get all past resume analyses for logged-in user |
| `GET` | `/api/analysis/:id` | Bearer Token | Get full analysis report by ID |
| `DELETE`| `/api/analysis/:id` | Bearer Token | Delete specific resume analysis record |
| `POST` | `/api/interview/start`| Bearer Token | Generate 5 questions for role & difficulty (Rate limited) |
| `POST` | `/api/interview/:id/answer`| Bearer Token | Submit answer for current question -> Get score /10 & critique |
| `GET` | `/api/interview` | Bearer Token | List all past interview sessions for user |
| `GET` | `/api/interview/:id`| Bearer Token | Get full interview report with all questions and model answers |
| `DELETE`| `/api/interview/:id`| Bearer Token | Delete interview record |
| `GET` | `/api/dashboard/stats`| Bearer Token | Get KPIs, Recharts score history, and recent activities |
| `GET` | `/api/health` | Public | System status check & uptime |

---

## 5. Getting Started & Setup Guide

### 5.1 Prerequisites
- **Node.js**: v18.0 or higher (Tested on v26.3.0)
- **MongoDB**: Local MongoDB community edition (`brew services start mongodb-community` on macOS) or MongoDB Atlas connection string.

### 5.2 Server Configuration & Seeding
1. Open a terminal and navigate to `/server`:
   ```bash
   cd server
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Configure environment variables in `server/.env`:
   ```ini
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://127.0.0.1:27017/preppilot
   JWT_SECRET=preppilot_super_secret_jwt_key_for_college_project_2026
   JWT_EXPIRES_IN=7d
   # Optional: Add your free Google Gemini API key from https://aistudio.google.com/
   # If left empty, PrepPilot automatically runs in realistic AI Mock Fallback mode for viva demo!
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-1.5-flash
   CLIENT_URL=http://localhost:5173
   ```
4. Run the database seed script to populate demo records:
   ```bash
   npm run seed
   ```
   *Demo User Credentials:*
   - **Email**: `demo@preppilot.com`
   - **Password**: `password123`

5. Start the backend API server:
   ```bash
   npm start
   # Or using nodemon: npm run dev
   ```
   *The server will be running at `http://localhost:5000`.*

### 5.3 Client Setup & Launch
1. Open a second terminal and navigate to `/client`:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.
5. Click **"Log in"** and select **"Autofill"** to immediately sign into the seeded demo account, or register a new candidate account.

---

## 6. Running Automated Tests

PrepPilot includes automated integration tests covering the authentication lifecycle and AI resume analysis with the Gemini API mocked:

```bash
cd server
npm test
```

Expected output:
```
PASS tests/auth.test.js
PASS tests/analysis.test.js
Test Suites: 2 passed, 2 total
Tests:       11 passed, 11 total
```

---

## 7. Viva / External Examiner Q&A Guide

Prepare for your college project viva with these 8 core architectural questions:

### Q1: What architectural pattern does the backend follow, and why?
**Answer**: PrepPilot follows the **MVC (Model-View-Controller)** pattern with a dedicated **Service Layer**.
- **Routes** (`routes/`): Define endpoints, HTTP methods, and mount middlewares.
- **Middlewares** (`middleware/`): Handle cross-cutting concerns (JWT token verification, Multer file upload validation, rate limiting, and centralized error catching).
- **Controllers** (`controllers/`): Handle the request/response lifecycle, parse request parameters, call services, and return standardized JSON payloads.
- **Services** (`services/`): Encapsulate external integrations like Google Gemini AI (`gemini.service.js`) and PDF parsing (`pdf.service.js`).
- **Models** (`models/`): Mongoose schemas defining database document shape, validation rules, and pre-save hooks.

### Q2: How does the application ensure secure authentication?
**Answer**: We use **Stateless JWT (JSON Web Tokens)** paired with **bcryptjs** password hashing:
1. When registering or updating a password, a Mongoose pre-save hook automatically hashes passwords using `bcrypt.genSalt(10)` and `bcrypt.hash()`. Passwords are never stored in plain text.
2. Upon login, `bcrypt.compare()` verifies the candidate password.
3. If valid, the server signs a JWT payload (`{ id: user._id }`) using a secure `JWT_SECRET` with a 7-day expiration.
4. Protected routes require `Authorization: Bearer <token>`, verified by `auth.middleware.js`. The User's password hash is automatically stripped before sending JSON responses (`userSchema.methods.toJSON`).

### Q3: How is file upload handled and protected?
**Answer**: We use **Multer** configured with `memoryStorage()`:
1. Rather than writing files to local disk, the PDF file is held temporarily in memory as a binary `Buffer`.
2. A file filter verifies that the MIME type is `application/pdf` and the file extension is `.pdf`.
3. A strict `limits: { fileSize: 5 * 1024 * 1024 }` enforces a 5MB limit. Any violations trigger a standard 400 Bad Request error.
4. The memory buffer is passed directly to `pdf-parse`, ensuring zero orphaned files on the server disk.

### Q4: How do you prompt Gemini to guarantee structured JSON output?
**Answer**:
1. We construct a prompt explicitly mandating an RFC8259 JSON structure without conversational preamble or markdown code fences (` ```json `).
2. We set `temperature: 0.3` to reduce hallucination and ensure deterministic scoring.
3. In `jsonParser.js`, we implement defensive parsing: we strip markdown backticks, locate outermost matching braces `{ ... }`, clean trailing commas, and validate required schema keys before database persistence.
4. If the Gemini API key is missing or an API rate limit occurs, our `gemini.service.js` has a built-in mock generator fallback so presentations and viva demonstrations never crash!

### Q5: Why choose MongoDB over a Relational Database (SQL)?
**Answer**:
1. The analysis output (matched keywords, missing keywords, section feedback, 5 suggestions) is inherently semi-structured JSON.
2. In MongoDB, an entire analysis or 5-question interview session can be stored within a single document, eliminating complex multi-table `JOIN` queries.
3. Mongoose schemas still enforce validation, default values, and references (`ref: 'User'`) while providing horizontal scalability.

### Q6: How does Rate Limiting work on AI routes?
**Answer**: Using `express-rate-limit`, we configure a separate limiter for AI endpoints (`aiRouteLimiter` allowing 40 requests per 15 minutes). This prevents denial-of-service (DoS) attacks and prevents malicious or runaway API quota consumption.

### Q7: How is the Score Over Time chart generated?
**Answer**: The `/api/dashboard/stats` endpoint queries the candidate's `Analysis` and `Interview` collections, extracts the completion dates and scores, scales interview scores to 100 for consistent visual comparison, sorts them chronologically, and renders an interactive SVG multi-line chart using **Recharts** (`<ResponsiveContainer>`, `<LineChart>`, `<Tooltip>`).

### Q8: How does the client download the analysis as a PDF?
**Answer**: Using `html2pdf.js`, the client captures the rendered DOM element (`#analysis-report-container`), rasterizes it via `html2canvas`, and creates an A4 portrait PDF document using `jsPDF`. If the library encounters an issue, it gracefully falls back to the native `window.print()` dialog.
