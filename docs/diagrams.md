# PrepPilot — System Diagrams & Visual Documentation

This document contains all architectural, structural, and behavioral diagrams for the **PrepPilot** college mini project. All diagrams are authored in GitHub Flavored Markdown-compatible Mermaid syntax.

---

## 1. System Architecture Diagram

This diagram illustrates the overall system topology, detailing how the React frontend, Node/Express backend, MongoDB database, file processing engine, and Google Gemini Generative AI communicate.

```mermaid
flowchart TD
    subgraph ClientLayer["Frontend Layer (React 18 + Vite)"]
        UI["Tailwind CSS Web Application"]
        Router["React Router v6"]
        AxiosClient["Axios HTTP Client with JWT Interceptors"]
        State["Auth Context & Theme State"]
        ChartUI["Recharts Analytics Visualizer"]
        PDFGen["Client-Side PDF Generator (html2pdf)"]
    end

    subgraph Gateway["HTTP REST API Gateway"]
        CORS["CORS & Morgan Logging Middleware"]
        RateLimiter["Express Rate Limiter Middleware"]
        AuthMid["JWT Verification Middleware (Bearer Token)"]
        UploadMid["Multer PDF Storage (5MB Limit)"]
    end

    subgraph ControllerLayer["Backend Controllers (Express MVC)"]
        AuthCtrl["Auth Controller"]
        AnalysisCtrl["Analysis Controller"]
        InterviewCtrl["Interview Controller"]
        DashboardCtrl["Dashboard Controller"]
        ErrHandler["Centralized Error Handler"]
    end

    subgraph ServiceLayer["Business Logic & Services"]
        PDFService["PDF Parse Service (Text Extraction)"]
        GeminiService["Gemini AI Service (@google/generative-ai)"]
        JSONSanitizer["Resilient JSON Sanitizer & Parser"]
    end

    subgraph DataStorage["Data Persistence Layer"]
        MongoDB[("MongoDB Database")]
        UserModel[("User Collection")]
        AnalysisModel[("Analysis Collection")]
        InterviewModel[("Interview Collection")]
    end

    subgraph ExternalCloud["Cloud AI Engine"]
        GeminiAPI["Google Gemini 1.5 Flash API"]
    end

    %% Client internal flow
    UI --> Router
    Router --> State
    State --> AxiosClient
    UI --> ChartUI
    UI --> PDFGen

    %% Client to Gateway
    AxiosClient -- "JSON / Multipart HTTP Requests" --> Gateway
    CORS --> RateLimiter
    RateLimiter --> AuthMid
    RateLimiter --> UploadMid

    %% Gateway to Controllers
    AuthMid --> AuthCtrl
    AuthMid --> AnalysisCtrl
    AuthMid --> InterviewCtrl
    AuthMid --> DashboardCtrl
    UploadMid --> AnalysisCtrl

    %% Controllers to Services & Models
    AuthCtrl --> UserModel
    AnalysisCtrl --> PDFService
    AnalysisCtrl --> GeminiService
    AnalysisCtrl --> AnalysisModel
    InterviewCtrl --> GeminiService
    InterviewCtrl --> InterviewModel
    DashboardCtrl --> AnalysisModel
    DashboardCtrl --> InterviewModel

    %% Services
    GeminiService --> JSONSanitizer
    GeminiService -- "HTTPS REST (Structured Prompt)" --> GeminiAPI
    GeminiAPI -- "Raw JSON String" --> GeminiService

    %% Models to MongoDB
    UserModel --> MongoDB
    AnalysisModel --> MongoDB
    InterviewModel --> MongoDB

    %% Error Handling
    ControllerLayer -.-> ErrHandler
    ErrHandler -- "Standardized JSON Error Response" --> AxiosClient
```

---

## 2. Activity Flowchart (User Journey)

This flowchart models the end-to-end lifecycle of a candidate using PrepPilot: from registration to resume audit and mock interview coaching.

```mermaid
flowchart TD
    Start([User visits PrepPilot]) --> CheckAuth{Is User Authenticated?}

    CheckAuth -- No --> AuthChoice{Action?}
    AuthChoice -- Register --> RegForm["Fill Name, Email, Password"]
    RegForm --> DoRegister["Submit to /api/auth/register"]
    DoRegister --> AuthSuccess["Receive JWT & Store in LocalStorage"]

    AuthChoice -- Login --> LoginForm["Fill Email & Password"]
    LoginForm --> DoLogin["Submit to /api/auth/login"]
    DoLogin --> AuthSuccess

    CheckAuth -- Yes --> Dashboard["Access PrepPilot Dashboard"]
    AuthSuccess --> Dashboard

    Dashboard --> UserAction{Select Feature}

    %% Resume Analysis Flow
    UserAction -- "Analyze Resume" --> UploadPage["Navigate to Resume Analyzer"]
    UploadPage --> UploadInput["Upload PDF Resume (max 5MB) & Paste Job Description"]
    UploadInput --> ValidateFile{Is valid PDF <= 5MB?}
    ValidateFile -- No --> ShowUploadErr["Display File Error Toast"] --> UploadInput
    ValidateFile -- Yes --> PostResume["Send POST /api/analysis/upload"]
    PostResume --> ServerExtract["Server extracts text via pdf-parse"]
    ServerExtract --> CallGeminiResume["Gemini calculates ATS Score & Generates Suggestions"]
    CallGeminiResume --> SaveAnalysis["Save record to MongoDB Analysis collection"]
    SaveAnalysis --> ViewReport["Display Visual ATS Score, Keywords & Section Critiques"]
    ViewReport --> DownloadPDFChoice{Download PDF Report?}
    DownloadPDFChoice -- Yes --> ExportPDF["Generate Formatted PDF using html2pdf"]
    DownloadPDFChoice -- No --> BackToDash["Return to Dashboard"]

    %% Mock Interview Flow
    UserAction -- "Mock Interview" --> InterviewSetup["Select Role & Difficulty"]
    InterviewSetup --> StartInterview["Send POST /api/interview/start"]
    StartInterview --> GeminiGenQuestions["Gemini generates 5 tailored interview questions"]
    GeminiGenQuestions --> SaveInterview["Initialize Interview document in MongoDB"]
    SaveInterview --> ShowQ["Display Question N (1 of 5)"]
    ShowQ --> AnswerQ["User types detailed response & submits"]
    AnswerQ --> EvaluateAnswer["Gemini evaluates response (Score 0-10, Feedback, Ideal Outline)"]
    EvaluateAnswer --> ShowFeedback["Show Score, Constructive Critique & Ideal Outline"]
    ShowFeedback --> CheckLastQ{Was this Question 5?}
    CheckLastQ -- No --> NextQ["Advance to Question N+1"] --> ShowQ
    CheckLastQ -- Yes --> CalcFinal["Aggregate Cumulative Score & Overall Performance"]
    CalcFinal --> ShowFinalReport["Display Comprehensive Interview Report"]
    ShowFinalReport --> BackToDash

    %% History & Stats
    UserAction -- "View History / Stats" --> ViewHistory["View Recharts Score Trends & Logs"]
    ViewHistory --> ManageRecords{Action on Record?}
    ManageRecords -- Delete --> DeleteRecord["Send DELETE request & remove from DB"] --> ViewHistory
    ManageRecords -- Open Details --> ViewReport
```

---

## 3. Use Case Diagram

This diagram displays the primary functional use cases supported by PrepPilot for job-seeking candidates and administrative/system services.

```mermaid
flowchart LR
    Candidate(("Candidate / Student"))
    SystemWorker(("PrepPilot Background Service"))
    GeminiAI(("Google Gemini AI"))

    subgraph PrepPilotSystem["PrepPilot Platform Boundary"]
        UC1["Register / Login (JWT Authentication)"]
        UC2["View Analytics Dashboard & Recharts Trends"]
        UC3["Upload Resume (PDF validation <= 5MB)"]
        UC4["Extract Resume Text from PDF"]
        UC5["Calculate ATS Match Score & Keyword Gaps"]
        UC6["Review Section-wise Recommendations"]
        UC7["Download Comprehensive Analysis Report (PDF)"]
        UC8["Configure Mock Interview (Role & Difficulty)"]
        UC9["Generate Targeted Technical Questions"]
        UC10["Answer Questions & Receive Live Score / Critique"]
        UC11["Review Cumulative Interview Performance Report"]
        UC12["Manage & Delete History Records"]
    end

    %% Candidate Connections
    Candidate --> UC1
    Candidate --> UC2
    Candidate --> UC3
    Candidate --> UC6
    Candidate --> UC7
    Candidate --> UC8
    Candidate --> UC10
    Candidate --> UC11
    Candidate --> UC12

    %% System Connections
    UC3 -.->|includes| UC4
    UC4 --> SystemWorker
    SystemWorker --> UC5
    UC5 <--> GeminiAI

    UC8 -.->|includes| UC9
    UC9 <--> GeminiAI

    UC10 <--> GeminiAI
```

---

## 4. Entity-Relationship (ER) Diagram

This diagram details the schema attributes, primary/foreign keys, and data relationships between `User`, `Analysis`, and `Interview` entities in MongoDB.

```mermaid
erDiagram
    USER ||--o{ ANALYSIS : "creates and owns"
    USER ||--o{ INTERVIEW : "conducts and logs"

    USER {
        ObjectId _id PK "Unique User Identifier"
        string name "Candidate Full Name"
        string email UK "Unique Email Address"
        string passwordHash "Bcrypt Hashed Password"
        date createdAt "Account Creation Timestamp"
    }

    ANALYSIS {
        ObjectId _id PK "Unique Analysis Record ID"
        ObjectId user FK "Reference to USER._id"
        string jobTitle "Target Designation"
        string jobDescription "Target Job Description Text"
        string resumeFileName "Original Uploaded PDF File Name"
        string resumeRawText "Extracted Plain Text from PDF"
        number atsScore "Calculated ATS Score (0-100)"
        string_array matchedKeywords "Matched Key Skills"
        string_array missingKeywords "Missing Key Skills"
        string_array strengths "Candidate Key Strengths"
        string_array weaknesses "Identified Profile Gaps"
        object sectionFeedback "Feedback on Summary, Skills, Projects, Education"
        string_array suggestions "5 Concrete Actionable Improvements"
        date createdAt "Timestamp of Analysis"
    }

    INTERVIEW {
        ObjectId _id PK "Unique Interview Session ID"
        ObjectId user FK "Reference to USER._id"
        string role "Target Job Role"
        string difficulty "Beginner | Intermediate | Advanced"
        question_array questions "Array of 5 Question Subdocuments"
        number currentQuestionIndex "Active Question Pointer (0-4)"
        string status "in_progress | completed"
        number totalScore "Cumulative or Average Score out of 50"
        string finalFeedback "Overall AI Interview Summary"
        date createdAt "Session Creation Timestamp"
    }

    QUESTION_SUBDOCUMENT {
        number questionNumber "1 to 5"
        string questionText "AI Generated Interview Question"
        string category "Technical | Conceptual | Behavioral"
        string userAnswer "Candidate typed response"
        number score "Question Score (0-10)"
        string feedback "Constructive Strengths & Critiques"
        string idealAnswer "Model Answer Outline"
        date answeredAt "Submission Timestamp"
    }

    INTERVIEW ||--|{ QUESTION_SUBDOCUMENT : "contains 5"
```

---

## 5. Sequence Diagram: Resume Analysis Workflow

This sequence diagram illustrates the precise runtime interaction for the **Resume Analysis** feature: from the candidate uploading a PDF to Gemini extracting insights and MongoDB persisting the record.

```mermaid
sequenceDiagram
    autonumber
    actor Candidate as Student / Candidate
    participant Browser as React Frontend (Axios)
    participant Server as Express Server (MVC)
    participant Multer as Multer Middleware
    participant PDFEngine as PDF-Parse Service
    participant Gemini as Gemini AI Service
    participant GeminiAPI as Google Gemini 1.5 Flash
    participant Database as MongoDB (Mongoose)

    Candidate->>Browser: Selects PDF resume & pastes Job Description
    Candidate->>Browser: Clicks "Analyze Resume" button
    Browser->>Browser: Validate file format (application/pdf) & size (<= 5MB)
    Browser->>Server: POST /api/analysis/upload (multipart/form-data with JWT)

    Server->>Multer: Process memory buffer
    alt File invalid or > 5MB
        Multer-->>Server: Error (Invalid file type or size exceeded)
        Server-->>Browser: 400 Bad Request { success: false, message: ... }
        Browser-->>Candidate: Show error banner
    else File valid
        Multer-->>Server: In-memory Buffer received
        Server->>PDFEngine: extractTextFromPDF(fileBuffer)
        PDFEngine-->>Server: Extracted raw text string

        Server->>Gemini: analyzeResume(rawText, jobDescription, jobTitle)
        Gemini->>GeminiAPI: Prompt with strict RFC8259 JSON schema enforcement
        GeminiAPI-->>Gemini: Raw LLM response string

        Gemini->>Gemini: cleanAndParseJson(rawResponse)
        Gemini-->>Server: Sanitized analysis object (ATS score, keywords, feedback, suggestions)

        Server->>Database: Analysis.create({ user, jobTitle, atsScore, ... })
        Database-->>Server: Persisted Analysis document

        Server-->>Browser: 201 Created { success: true, data: analysisDoc }
        Browser->>Browser: Update dashboard state & cache result
        Browser-->>Candidate: Render animated ATS Score Gauge, Keyword Badges & Suggestions
    end
```
