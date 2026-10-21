# PrepPilot REST API Documentation (Postman-style)

**Base URL**: `http://localhost:5000/api`  
**Authentication Scheme**: HTTP Bearer Token (`Authorization: Bearer <JWT_ACCESS_TOKEN>`)  
**Standard Response Format**:
```json
{
  "success": true,
  "message": "Human readable status message",
  "data": {}
}
```
**Standard Error Format**:
```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 Register User
- **Method**: `POST`
- **Path**: `/api/auth/register`
- **Auth Required**: No
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePassword123!"
}
```
- **Success Response** (`201 Created`):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "671618a8b1c2d3e4f5a6b7c8",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "createdAt": "2026-10-21T09:00:00.000Z"
    }
  }
}
```
- **Error Responses**:
  - `400 Bad Request`: Validation error (missing fields, invalid email format, password < 6 chars)
  - `409 Conflict`: Email already registered

---

### 1.2 Login User
- **Method**: `POST`
- **Path**: `/api/auth/login`
- **Auth Required**: No
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "email": "jane@example.com",
  "password": "SecurePassword123!"
}
```
- **Success Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "671618a8b1c2d3e4f5a6b7c8",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
}
```
- **Error Responses**:
  - `401 Unauthorized`: Invalid email or password

---

### 1.3 Get Current User Profile
- **Method**: `GET`
- **Path**: `/api/auth/me`
- **Auth Required**: Yes (`Bearer <token>`)
- **Success Response** (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "671618a8b1c2d3e4f5a6b7c8",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "createdAt": "2026-10-21T09:00:00.000Z"
  }
}
```
- **Error Responses**:
  - `401 Unauthorized`: No token provided or token expired

---

### 1.4 Logout User
- **Method**: `POST`
- **Path**: `/api/auth/logout`
- **Auth Required**: No (Client clears stored token)
- **Success Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 2. Resume Analyzer Endpoints (`/api/analysis`)

### 2.1 Upload & Analyze Resume
- **Method**: `POST`
- **Path**: `/api/analysis/upload`
- **Auth Required**: Yes (`Bearer <token>`)
- **Headers**: `Content-Type: multipart/form-data`
- **Form Fields**:
  - `resume`: Binary PDF file (Max 5MB)
  - `jobTitle`: String (e.g. `"Full Stack Software Engineer"`)
  - `jobDescription`: String (Target role responsibilities and qualifications)
- **Success Response** (`201 Created`):
```json
{
  "success": true,
  "message": "Resume analyzed successfully",
  "data": {
    "_id": "671619c9a8b7c6d5e4f3a2b1",
    "jobTitle": "Full Stack Software Engineer",
    "resumeFileName": "JaneDoe_Resume.pdf",
    "atsScore": 84,
    "matchedKeywords": ["React", "Node.js", "Express", "MongoDB", "Git", "REST APIs"],
    "missingKeywords": ["Docker", "Kubernetes", "GraphQL", "AWS"],
    "strengths": [
      "Demonstrated experience building end-to-end MERN stack web applications",
      "Strong command of frontend state management and API integration"
    ],
    "weaknesses": [
      "No direct mention of containerization tools (Docker/Kubernetes)",
      "Lack of quantified metrics in project impact descriptions"
    ],
    "sectionFeedback": {
      "summary": "Clear and focused, but could highlight leadership and quantifiable achievements.",
      "skills": "Well-categorized frontend and backend skills. Recommend adding cloud tooling.",
      "projects": "Strong technical stack, but needs metrics (e.g., 'reduced load time by 30%').",
      "education": "Concise and well placed."
    },
    "suggestions": [
      "Add containerization experience with Docker under the technical skills section.",
      "Quantify your accomplishments in the e-commerce project with percentages or user numbers.",
      "Incorporate mentions of AWS or cloud deployment architectures.",
      "Add a dedicated section for unit testing and CI/CD pipelines.",
      "Rephrase bullet points using the STAR (Situation, Task, Action, Result) methodology."
    ],
    "createdAt": "2026-10-21T09:15:00.000Z"
  }
}
```
- **Error Responses**:
  - `400 Bad Request`: Missing file, non-PDF file, file > 5MB, or missing job title/description
  - `429 Too Many Requests`: Rate limit exceeded on AI endpoint

---

### 2.2 List All Analyses for User
- **Method**: `GET`
- **Path**: `/api/analysis`
- **Auth Required**: Yes (`Bearer <token>`)
- **Success Response** (`200 OK`):
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "671619c9a8b7c6d5e4f3a2b1",
      "jobTitle": "Full Stack Software Engineer",
      "atsScore": 84,
      "matchedKeywords": ["React", "Node.js"],
      "missingKeywords": ["Docker"],
      "createdAt": "2026-10-21T09:15:00.000Z"
    }
  ]
}
```

---

### 2.3 Get Analysis by ID
- **Method**: `GET`
- **Path**: `/api/analysis/:id`
- **Auth Required**: Yes (`Bearer <token>`)
- **Success Response** (`200 OK`): Full analysis object with sections, feedback, and keywords.
- **Error Responses**:
  - `404 Not Found`: Record does not exist or belongs to another user

---

### 2.4 Delete Analysis by ID
- **Method**: `DELETE`
- **Path**: `/api/analysis/:id`
- **Auth Required**: Yes (`Bearer <token>`)
- **Success Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Analysis record deleted successfully"
}
```

---

## 3. Mock Interview Endpoints (`/api/interview`)

### 3.1 Start Mock Interview Session
- **Method**: `POST`
- **Path**: `/api/interview/start`
- **Auth Required**: Yes (`Bearer <token>`)
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "role": "Frontend Developer",
  "difficulty": "Intermediate"
}
```
- **Success Response** (`201 Created`):
```json
{
  "success": true,
  "message": "Interview session initialized with 5 questions",
  "data": {
    "interviewId": "671620d1e2f3a4b5c6d7e8f9",
    "role": "Frontend Developer",
    "difficulty": "Intermediate",
    "totalQuestions": 5,
    "currentQuestionIndex": 0,
    "currentQuestion": {
      "questionNumber": 1,
      "category": "Technical",
      "questionText": "Explain the virtual DOM in React and how reconciliation optimizes DOM updates."
    }
  }
}
```

---

### 3.2 Submit Question Answer
- **Method**: `POST`
- **Path**: `/api/interview/:id/answer`
- **Auth Required**: Yes (`Bearer <token>`)
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "userAnswer": "The virtual DOM is an in-memory lightweight representation of the actual DOM. When state changes, React creates a new VDOM tree and diffs it with the previous one. Only changed nodes are batched and applied to the real DOM."
}
```
- **Success Response** (`200 OK`):
```json
{
  "success": true,
  "data": {
    "evaluation": {
      "questionNumber": 1,
      "score": 9,
      "feedback": "Great concise explanation highlighting in-memory tree representation, diffing algorithm, and batch DOM mutations.",
      "idealAnswer": "Key points to cover: 1) What VDOM is (JS object tree), 2) Reconciliation diffing algorithm (O(n) heuristic), 3) Keys in lists, 4) Batching updates for performance."
    },
    "isCompleted": false,
    "nextQuestion": {
      "questionNumber": 2,
      "category": "Performance",
      "questionText": "How would you optimize performance in a React application dealing with large lists?"
    }
  }
}
```
*Note: When `isCompleted` is `true`, `nextQuestion` is `null` and `finalSummary` contains the total score and interview critique.*

---

### 3.3 List Past Interviews
- **Method**: `GET`
- **Path**: `/api/interview`
- **Auth Required**: Yes (`Bearer <token>`)
- **Success Response** (`200 OK`): Array of user's past interviews with status, role, score, and timestamps.

---

### 3.4 Get Interview Details / Final Report
- **Method**: `GET`
- **Path**: `/api/interview/:id`
- **Auth Required**: Yes (`Bearer <token>`)
- **Success Response** (`200 OK`): Full interview session document including all 5 questions, user answers, individual scores, feedback, ideal answer outlines, and total score.

---

### 3.5 Delete Interview
- **Method**: `DELETE`
- **Path**: `/api/interview/:id`
- **Auth Required**: Yes (`Bearer <token>`)
- **Success Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Interview session deleted successfully"
}
```

---

## 4. Dashboard Endpoints (`/api/dashboard`)

### 4.1 Get Dashboard Statistics
- **Method**: `GET`
- **Path**: `/api/dashboard/stats`
- **Auth Required**: Yes (`Bearer <token>`)
- **Success Response** (`200 OK`):
```json
{
  "success": true,
  "data": {
    "totalAnalyses": 4,
    "averageAtsScore": 79.5,
    "totalInterviews": 3,
    "averageInterviewScore": 8.2,
    "scoreHistory": [
      { "date": "2026-10-18", "type": "Resume ATS", "score": 72, "label": "Full Stack Dev" },
      { "date": "2026-10-19", "type": "Interview", "score": 7.5, "label": "React Dev" },
      { "date": "2026-10-21", "type": "Resume ATS", "score": 84, "label": "Full Stack Dev" }
    ],
    "recentAnalyses": [],
    "recentInterviews": []
  }
}
```
