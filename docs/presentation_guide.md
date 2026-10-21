# PrepPilot — 10-Minute Presentation & Viva Defense Guide 🎓

> **College Mini Project Presentation & Viva Defense Reference**  
> **Presenter:** Aryan Mishra  
> **Project:** PrepPilot (AI Resume Analyzer & Mock Interview Coach)  
> **Interactive Slide Deck:** Open [`docs/slides.html`](slides.html) or visit [`https://aryan1238.github.io/A/slides.html`](https://aryan1238.github.io/A/slides.html)

---

## ⏱️ 10-Minute Minute-by-Minute Presentation Timeline

| Slide | Topic | Target Time | Key Goal |
| :---: | :--- | :---: | :--- |
| **01** | Title & Introduction | `00:00 - 01:00` (1 min) | Introduce self, project name, MERN + Gemini stack, live URLs |
| **02** | Problem Statement | `01:00 - 02:00` (1 min) | 75% ATS rejection rate, placement anxiety, commercial paywalls |
| **03** | Proposed Solution | `02:00 - 03:00` (1 min) | Dual-core platform: Resume ATS Auditor + Mock Interview Coach |
| **04** | System Architecture | `03:00 - 04:30` (1.5 min) | Explain MVC, GitHub Pages client, Render backend, Atlas DB |
| **05** | Core Feature 1: Resume ATS Analyzer | `04:30 - 06:00` (1.5 min) | In-memory upload (`pdf-parse`), structured Gemini prompt, PDF report |
| **06** | Core Feature 2: Mock Interview Coach | `06:00 - 07:30` (1.5 min) | Role & difficulty tiers, 5-question round, /10 scoring, model answers |
| **07** | Database & Production Security | `07:30 - 08:30` (1 min) | Mongoose schemas, bcrypt (10 rounds), JWT auth, rate limiting |
| **08** | Cloud Deployment & Testing | `08:30 - 09:30` (1 min) | Show live links, GitHub Actions CI/CD, 11/11 Jest tests passed |
| **09** | Future Scope & Roadmap | `09:30 - 10:00` (0.5 min) | Voice-to-text audio interview, College TPO portal, code runner |
| **10** | Conclusion & Viva Q&A | `10:00+` | Thank the committee, invite questions |

---

## 🗣️ Exact Slide-by-Slide Speaking Script

### Slide 1: Title & Overview (00:00 – 01:00)
- **English Script:**  
  *"Good morning respected teachers and external examiners. My name is Aryan Mishra, and today I am presenting my mini project: **PrepPilot — an AI-Powered Resume ATS Analyzer and Interactive Mock Interview Coach**.*  
  *PrepPilot is engineered as a full-stack production application using the MERN stack—React with Vite on the frontend, Node.js with Express on the backend, MongoDB Atlas for the database, and Google Gemini 1.5 Flash as our generative AI engine. The entire application is deployed live with zero cloud costs using GitHub Pages and Render."*
- **Hinglish Summary (if needed):**  
  *"Good morning sir. Mera naam Aryan Mishra hai. Aaj main apna project PrepPilot present kar raha hoon jo students ko placement drive ke liye AI ke through prepare karta hai."*

---

### Slide 2: Problem Statement (01:00 – 02:00)
- **English Script:**  
  *"During campus recruitment, students face three primary roadblocks:*  
  *1. **The ATS Filter:** Industry studies show that over 75% of resumes are discarded by Applicant Tracking Systems before a human recruiter even sees them, mainly due to missing technical keywords or unparsed formatting.*  
  *2. **Lack of Realistic Mock Viva Practice:** Students understand theory but freeze during technical interview rounds because colleges rarely have the bandwidth to conduct one-on-one mock interviews.*  
  *3. **Commercial Gatekeeping:** Existing platforms like LeetCode Premium or Interviewing.io charge upwards of $35 to $150 a month, which is unaffordable for most college students.*  
  *PrepPilot was built to democratize placement readiness with a free, intelligent solution."*

---

### Slide 3: Proposed Solution (02:00 – 03:00)
- **English Script:**  
  *"PrepPilot addresses this with a dual-core AI architecture:*  
  *First, our **AI Resume ATS Auditor**: students upload their PDF resume and paste the job description. The system parses the document, computes an ATS match score from 0 to 100, detects missing keywords, highlights strengths and weaknesses, and gives 5 actionable improvement suggestions.*  
  *Second, our **Interactive Mock Interview Coach**: candidates choose a role like Full Stack, Frontend, or Data Science, select a difficulty tier, and take a 5-question sequential technical interview. Each answer is scored out of 10 with instant critiques and model answers."*

---

### Slide 4: Full-Stack System Architecture (03:00 – 04:30)
- **English Script:**  
  *"Architecturally, PrepPilot follows the strict **Model-View-Controller (MVC)** design pattern:*  
  *• **Presentation Layer:** React 18 built with Vite and Tailwind CSS. We use `HashRouter` for zero-configuration client-side routing on GitHub Pages.*  
  *• **API & Controller Layer:** Express.js REST API hosted as a cloud web service on Render, with CORS origin validation and trust proxy enabled for rate limiting.*  
  *• **Database Layer:** MongoDB Atlas replica set managed via Mongoose ODM.*  
  *• **AI Engine:** Google Gemini 1.5 Flash integrated via `@google/generative-ai`, enforcing strict RFC8259 JSON outputs.*  
  *All private routes are secured using stateless JWT Bearer token authentication."*

---

### Slide 5: Feature 1 — Resume ATS Analyzer (04:30 – 06:00)
- **English Script:**  
  *"Looking closer at the Resume Analyzer pipeline:*  
  *1. File upload is handled in-memory using `multer.memoryStorage()`. No files are written to the server's disk, preventing disk leaks and ensuring high candidate privacy.*  
  *2. `pdf-parse` extracts raw text from the in-memory buffer.*  
  *3. The backend constructs a prompt instructing Gemini to compare the candidate's skills against the JD, outputting an ATS score, matched keywords, missing keywords, section-wise feedback, and 5 improvements.*  
  *4. The candidate can also download a professionally formatted PDF report with a single click using `html2pdf.js`."*

---

### Slide 6: Feature 2 — Mock Interview Coach (06:00 – 07:30)
- **English Script:**  
  *"The second core feature is the Mock Interview Coach:*  
  *• The candidate selects their target domain—such as Full Stack, Frontend, Backend, or Data Science—and difficulty.*  
  *• Gemini generates 5 relevant technical questions dynamically.*  
  *• The user types their answer under simulated interview conditions.*  
  *• Upon submission, Gemini evaluates the response out of 10, provides constructive feedback on what was missing, and presents an ideal industry model answer.*  
  *All completed sessions are saved to MongoDB, and performance trends are visualized on the user's dashboard using interactive Recharts graphs."*

---

### Slide 7: Database Design & Production Security (07:30 – 08:30)
- **English Script:**  
  *"For security and data integrity:*  
  *• **Passwords:** Hashed using `bcryptjs` with 10 salt rounds inside a Mongoose pre-save hook. Plaintext passwords never touch our database.*  
  *• **JWT Protection:** Authorization headers are validated by custom middleware. Tokens expire in 7 days.*  
  *• **Rate Limiting:** `express-rate-limit` protects all `/api/` endpoints to mitigate brute force and API quota exhaustion.*  
  *• **Resilient Reconnection:** The backend includes a background retry loop to seamlessly handle cloud cold starts and DNS propagation."*

---

### Slide 8: Live Cloud Deployment & Testing (08:30 – 09:30)
- **English Script:**  
  *"Quality assurance and DevOps:*  
  *• We wrote 11 automated test cases using Jest and Supertest, covering authentication and resume analysis. All 11 tests pass with 100% success.*  
  *• The frontend is deployed to **GitHub Pages** with an automated GitHub Actions CI/CD workflow.*  
  *• The backend is hosted on **Render** as a cloud web service connected to **MongoDB Atlas**.*  
  *The entire application is live right now at `https://aryan1238.github.io/A/`."*

---

### Slide 9: Future Scope & Roadmap (09:30 – 10:00)
- **English Script:**  
  *"Looking ahead, the roadmap for PrepPilot includes:*  
  *1. **Voice-to-Text Mock Interviews:** Adding speech recognition with Whisper/Web Speech API to assess vocal clarity, tone, and filler words.*  
  *2. **College TPO Placement Dashboard:** Allowing placement officers to view batch analytics, identifying which skills our university batch is lacking.*  
  *3. **In-Browser Code Sandbox:** Live code execution for algorithmic DSA coding questions."*

---

### Slide 10: Conclusion & Viva Q&A (10:00+)
- **English Script:**  
  *"In conclusion, PrepPilot demonstrates a practical, full-stack, AI-driven application that solves an urgent real-world problem for graduating university students.*  
  *The live application, source code, Postman API documentation, and 5 UML diagrams are publicly available on GitHub.*  
  *Thank you for your time. I am now open to your questions."*

---

## 🎯 Top 10 Anticipated Viva Questions & Model Answers

### Q1: Why did you choose Google Gemini over OpenAI GPT-4?
> **Answer:**  
> "Two key reasons:  
> 1. **Academic & Performance Feasibility:** Google Gemini 1.5 Flash provides a generous free tier (15 requests/minute) with high token processing limits, making it ideal for university deployment without requiring paid API credits.  
> 2. **Speed & Structured JSON Support:** Gemini 1.5 Flash has extremely low latency (<1.5 seconds) and natively respects RFC8259 structured JSON prompts, ensuring reliable parsing without hallucinations."

### Q2: Why did you use in-memory storage for PDF uploads instead of saving to disk?
> **Answer:**  
> "We used `multer.memoryStorage()` for three reasons:  
> 1. **Zero Disk Footprint:** Cloud containers like Render have ephemeral filesystems; saving files to disk could cause storage exhaustion or leak student PII.  
> 2. **Speed:** Extracting text directly from the in-memory RAM buffer via `pdf-parse` is significantly faster than writing to disk and reading it back.  
> 3. **Stateless Privacy:** Once text extraction completes, the buffer is garbage collected, ensuring complete candidate privacy."

### Q3: How is user authentication implemented and secured?
> **Answer:**  
> "Authentication is stateless using JSON Web Tokens (JWT) and bcrypt:  
> 1. When registering, passwords are automatically hashed with 10 salt rounds via a Mongoose pre-save hook. Plaintext passwords are never stored.  
> 2. On login, `bcrypt.compare()` verifies the credential. A signed JWT containing the user's ID is returned with a 7-day expiration.  
> 3. For protected routes, an Axios request interceptor attaches the token as `Authorization: Bearer <token>`. Express middleware decodes and verifies the token before controller execution."

### Q4: Why did you use HashRouter instead of BrowserRouter on GitHub Pages?
> **Answer:**  
> "GitHub Pages is a static file web host. When using standard `BrowserRouter`, navigating to `/dashboard` or refreshing the page causes GitHub Pages to look for a physical file named `dashboard/index.html` and return a 404 error.  
> `HashRouter` puts the route inside the URL fragment (`/#/dashboard`). The browser never sends the hash fragment to the server, so GitHub Pages always serves `index.html`, allowing React Router to handle client-side routing flawlessly."

### Q5: What is CORS and how did you configure it between GitHub Pages and Render?
> **Answer:**  
> "CORS (Cross-Origin Resource Sharing) is a browser security mechanism that blocks web pages from making AJAX requests to a different domain.  
> Since our frontend is on `https://aryan1238.github.io` and our backend is on `https://preppilot-api-dk3o.onrender.com`, the browser sends a preflight `OPTIONS` request. In `server/src/app.js`, our CORS middleware validates that the requesting origin matches `https://aryan1238.github.io` (origin only, without path) and responds with `Access-Control-Allow-Origin` and allowed methods `GET, POST, PUT, DELETE, OPTIONS`."

### Q6: How does the backend handle rate limiting?
> **Answer:**  
> "We use `express-rate-limit`. Behind Render, we configured `app.set('trust proxy', 1)` so that Express reads the true client IP from the `X-Forwarded-For` header instead of Render's load balancer IP. This restricts individual client IPs to 100 requests per 15 minutes, protecting our backend and Gemini API from DDoS and cost spikes."

### Q7: What was the cause of the duplicate artifact error in GitHub Actions and how did you fix it?
> **Answer:**  
> "Initially, our deployment workflow had building, artifact uploading (`upload-pages-artifact`), and deployment (`deploy-pages`) in a single job. When a deploy step re-ran or failed, the job repeated the upload, creating two artifacts with the name `github-pages` under the same run ID.  
> We fixed it by refactoring into GitHub's official **two-job architecture**:  
> 1. A `build` job that builds the site and uploads the artifact once.  
> 2. A `deploy` job with `needs: build` that performs the deployment. If re-run, only the deploy job re-executes, never creating duplicate artifacts."

### Q8: What are your MongoDB collections and how are they indexed?
> **Answer:**  
> "We have three Mongoose models:  
> 1. `User`: `name`, `email` (indexed with `{ unique: true }` for $O(1)$ lookups), `passwordHash`.  
> 2. `Analysis`: `user` (ref: 'User'), `atsScore`, `matchedKeywords`, `missingKeywords`, `suggestions`, `createdAt`.  
> 3. `Interview`: `user` (ref: 'User'), `role`, `difficulty`, `questions` array with answers, scores, and feedback.  
> Foreign key references use MongoDB ObjectIds to maintain relational integrity in a NoSQL document database."

### Q9: How do your automated tests run without consuming Gemini API tokens?
> **Answer:**  
> "In `server/tests/analysis.test.js`, we use Jest's `jest.mock()` to mock the `gemini.service.js` module. The mock returns a deterministic, realistic ATS analysis payload. This allows our continuous integration tests to execute in under 2 seconds, verifying HTTP status codes, validation, and database storage without making real network calls to Google's API."

### Q10: How does the application handle offline situations if Gemini API is down?
> **Answer:**  
> "In `gemini.service.js`, we implemented an **intelligent mock fallback**. If the Gemini API key is missing, invalid, or reaches quota limits, the service catches the error and generates a contextual, realistic ATS analysis or interview question based on the candidate's input. This guarantees that during college viva evaluations or live demos, the application never crashes."
