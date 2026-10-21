#!/usr/bin/env python3
"""
PrepPilot - Presentation PPTX Generator
Generates a 10-slide 16:9 widescreen PowerPoint presentation (.pptx)
Theme: Cyberpunk Red & Obsidian Black with glassmorphism cards.
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    # 16:9 widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    blank_layout = prs.slide_layouts[6]

    # Color Palette: Red & Black
    BG_COLOR = RGBColor(10, 10, 14)       # Deep obsidian black
    CARD_BG = RGBColor(22, 22, 30)        # Dark card surface
    CARD_BORDER = RGBColor(185, 28, 28)   # Crimson red border
    RED_ACCENT = RGBColor(239, 68, 68)    # Neon red
    RED_LIGHT = RGBColor(252, 165, 165)   # Light red
    TEXT_WHITE = RGBColor(255, 255, 255)  # Pure white
    TEXT_MUTED = RGBColor(148, 163, 184)  # Slate light gray
    BADGE_BG = RGBColor(69, 10, 10)       # Dark red badge

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_COLOR
        bg.line.fill.background()
        return bg

    def add_header(slide, tag, title):
        # Category Tag
        tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.4))
        tf_tag = tag_box.text_frame
        tf_tag.word_wrap = True
        p_tag = tf_tag.paragraphs[0]
        p_tag.text = tag.upper()
        p_tag.font.size = Pt(11)
        p_tag.font.bold = True
        p_tag.font.color.rgb = RED_ACCENT
        p_tag.font.name = "Arial"

        # Main Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.85), Inches(11.7), Inches(0.8))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title
        p_title.font.size = Pt(28)
        p_title.font.bold = True
        p_title.font.color.rgb = TEXT_WHITE
        p_title.font.name = "Arial"

    def add_card(slide, left, top, width, height, title, items, subtitle=""):
        # Card background rectangle
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = CARD_BG
        shape.line.color.rgb = CARD_BORDER
        shape.line.width = Pt(1.5)

        tb = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.15), width - Inches(0.4), height - Inches(0.3))
        tf = tb.text_frame
        tf.word_wrap = True

        # Card Title
        p_head = tf.paragraphs[0]
        p_head.text = title
        p_head.font.size = Pt(16)
        p_head.font.bold = True
        p_head.font.color.rgb = TEXT_WHITE
        p_head.font.name = "Arial"

        if subtitle:
            p_sub = tf.add_paragraph()
            p_sub.text = subtitle
            p_sub.font.size = Pt(10)
            p_sub.font.bold = True
            p_sub.font.color.rgb = RED_LIGHT
            p_sub.space_after = Pt(8)

        for item in items:
            p_item = tf.add_paragraph()
            p_item.text = f"•  {item}"
            p_item.font.size = Pt(11)
            p_item.font.color.rgb = TEXT_MUTED
            p_item.space_after = Pt(4)

    # -------------------------------------------------------------------------
    # SLIDE 1: TITLE SLIDE
    # -------------------------------------------------------------------------
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)

    # Project badge
    badge = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.5), Inches(1.0), Inches(4.333), Inches(0.45))
    badge.fill.solid()
    badge.fill.fore_color.rgb = BADGE_BG
    badge.line.color.rgb = RED_ACCENT
    tf_b = badge.text_frame
    p_b = tf_b.paragraphs[0]
    p_b.text = "COLLEGE MINI PROJECT  •  MERN + GEMINI AI"
    p_b.font.size = Pt(10)
    p_b.font.bold = True
    p_b.font.color.rgb = RED_LIGHT
    p_b.alignment = PP_ALIGN.CENTER

    # Main Title
    tb1 = s1.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.333), Inches(1.8))
    tf1 = tb1.text_frame
    tf1.word_wrap = True
    p1 = tf1.paragraphs[0]
    p1.text = "PrepPilot 🚀"
    p1.font.size = Pt(56)
    p1.font.bold = True
    p1.font.color.rgb = RED_ACCENT
    p1.alignment = PP_ALIGN.CENTER

    p1_sub = tf1.add_paragraph()
    p1_sub.text = "AI-Powered Resume ATS Analyzer & Interactive Mock Interview Coach"
    p1_sub.font.size = Pt(20)
    p1_sub.font.color.rgb = TEXT_WHITE
    p1_sub.alignment = PP_ALIGN.CENTER

    # 4 Tech Pills
    pills = [
        ("Frontend", "React 18 + Vite\nTailwind CSS"),
        ("Backend", "Node.js + Express\nRESTful MVC Pattern"),
        ("Database", "MongoDB Atlas\nCloud Replica Set"),
        ("AI Engine", "Google Gemini 1.5\nRFC8259 JSON Prompts")
    ]
    for i, (p_title, p_desc) in enumerate(pills):
        px = Inches(1.0 + i * 2.9)
        card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, px, Inches(4.0), Inches(2.6), Inches(1.5))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CARD_BORDER
        tf_c = card.text_frame
        tf_c.word_wrap = True
        pt = tf_c.paragraphs[0]
        pt.text = p_title.upper()
        pt.font.size = Pt(10)
        pt.font.bold = True
        pt.font.color.rgb = RED_LIGHT
        pd = tf_c.add_paragraph()
        pd.text = p_desc
        pd.font.size = Pt(12)
        pd.font.bold = True
        pd.font.color.rgb = TEXT_WHITE

    # Presenter Footer
    foot = s1.shapes.add_textbox(Inches(1.0), Inches(6.0), Inches(11.333), Inches(0.8))
    tff = foot.text_frame
    pf = tff.paragraphs[0]
    pf.text = "Presented by: Aryan Mishra   |   Deployment: GitHub Pages + Render   |   Duration: 10 Minutes"
    pf.font.size = Pt(13)
    pf.font.color.rgb = TEXT_MUTED
    pf.alignment = PP_ALIGN.CENTER

    # -------------------------------------------------------------------------
    # SLIDE 2: PROBLEM STATEMENT
    # -------------------------------------------------------------------------
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, "01 / The Placement Challenge", "Why University Placement Candidates Struggle")

    add_card(s2, Inches(0.8), Inches(2.0), Inches(3.6), Inches(3.8),
             "75% ATS Rejection",
             ["Over 75% of candidate resumes are filtered out automatically before human review.",
              "Causes: Missing tech keywords, unstructured formatting, or mismatched job descriptions.",
              "Students have zero visibility into why their resumes fail automated screenings."],
             "THE ATS 'BLACK HOLE'")

    add_card(s2, Inches(4.8), Inches(2.0), Inches(3.6), Inches(3.8),
             "Zero Mock Practice",
             ["Students study theory but freeze during high-stakes technical interview viva rounds.",
              "Colleges lack bandwidth to provide 1-on-1 personalized viva evaluations.",
              "Traditional interview prep is passive (watching YouTube) rather than active typing/thinking."],
             "PLACEMENT ANXIETY")

    add_card(s2, Inches(8.8), Inches(2.0), Inches(3.6), Inches(3.8),
             "Commercial Paywalls",
             ["Existing mock interview platforms (LeetCode Premium, Interviewing.io) cost $35–$150/mo.",
              "Unaffordable for average college students preparing for campus placements.",
              "Free alternatives offer generic non-actionable advice."],
             "EXPENSIVE TOOLS")

    # Banner
    b2 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.1), Inches(11.7), Inches(0.8))
    b2.fill.solid()
    b2.fill.fore_color.rgb = BADGE_BG
    b2.line.color.rgb = RED_ACCENT
    tf_b2 = b2.text_frame
    p_b2 = tf_b2.paragraphs[0]
    p_b2.text = "🎯 Project Objective: Deliver an accessible, free, production-grade AI platform that diagnoses resumes and simulates authentic technical interviews with instant feedback."
    p_b2.font.size = Pt(11)
    p_b2.font.color.rgb = TEXT_WHITE

    # -------------------------------------------------------------------------
    # SLIDE 3: PROPOSED SOLUTION
    # -------------------------------------------------------------------------
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, "02 / The PrepPilot Solution", "Dual-Core AI Placement Preparation Platform")

    add_card(s3, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.6),
             "Engine 1: Resume ATS Auditor",
             ["In-Memory PDF Parsing: Multer intercepts upload in RAM; zero disk footprint.",
              "pdf-parse extracts raw text, stripping non-printable characters cleanly.",
              "Gemini 1.5 Flash evaluates resume against target Job Description.",
              "Computes ATS Match Score (0–100%) based on skill relevance.",
              "Detailed Matrix: Identifies Matched Keywords vs Missing Keywords.",
              "Actionable Feedback: Section-wise analysis (Skills, Experience, Projects).",
              "5 Concrete Improvement Steps + 1-Click PDF Report Export."],
             "INSTANT RESUME DIAGNOSTICS")

    add_card(s3, Inches(6.8), Inches(2.0), Inches(5.6), Inches(4.6),
             "Engine 2: Mock Interview Coach",
             ["Targeted Domain Selection: Full Stack, Frontend, Backend, Data Science.",
              "Difficulty Tiers: Beginner, Intermediate, and Advanced rounds.",
              "Dynamic 5-Question Rounds: AI constructs relevant technical questions.",
              "Active Candidate Answers: Timed input simulates live viva pressure.",
              "Instant Scoring: Evaluates each answer numerically out of 10 points.",
              "Constructive Critique: Highlights identified strengths & gaps.",
              "Ideal Model Answers: Shows industry-standard responses for learning."],
             "REAL-TIME VIVA SIMULATION")

    # -------------------------------------------------------------------------
    # SLIDE 4: SYSTEM ARCHITECTURE
    # -------------------------------------------------------------------------
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, "03 / Engineering Design", "Full-Stack MVC System Architecture & Data Flow")

    arch_blocks = [
        ("Presentation Layer", "React 18 + Vite SPA", ["GitHub Pages CDN hosting", "HashRouter client routing", "Tailwind CSS dark theme", "Axios client interceptors"]),
        ("API Controller Layer", "Express.js REST API", ["Hosted on Render Web Service", "MVC routes & controllers", "Trust proxy for rate limits", "CORS origin restriction"]),
        ("Persistence Layer", "MongoDB Atlas", ["Cloud Mongoose ODM", "User, Analysis, Interview", "Unique indexing & hooks", "Background reconnect loop"]),
        ("AI Intelligence Layer", "Google Gemini 1.5", ["gemini-1.5-flash model", "Strict JSON schema outputs", "Deterministic ATS prompt", "Offline mock fallback"])
    ]
    for i, (layer, tech, pts) in enumerate(arch_blocks):
        add_card(s4, Inches(0.8 + i * 2.95), Inches(2.0), Inches(2.8), Inches(4.8), tech, pts, layer.upper())

    # -------------------------------------------------------------------------
    # SLIDE 5: FEATURE 1 DEEP DIVE (RESUME ANALYZER)
    # -------------------------------------------------------------------------
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, "04 / Deep Dive — Core Feature 1", "AI Resume ATS Auditor: Pipeline & Output Metrics")

    add_card(s5, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.7),
             "Text Extraction & Prompt Pipeline",
             ["Upload Guard: Multer memory storage (5MB max limit, PDF MIME only).",
              "Buffer Processing: pdf-parse reads binary buffer directly in RAM.",
              "Text Sanitization: Strips non-ASCII, extra whitespaces, and page artifacts.",
              "Prompt Engineering: Strict system prompt enforces RFC8259 JSON format.",
              "Temperature Tuning: Low temperature (0.2) for deterministic ATS evaluation.",
              "Resilient Parsing: jsonParser.js cleans markdown code blocks (```json) before JSON.parse().",
              "Database Save: Persists analysis record linked to candidate's ObjectId."],
             "BACKEND PIPELINE (POST /api/analysis/upload)")

    add_card(s5, Inches(6.8), Inches(2.0), Inches(5.6), Inches(4.7),
             "Evaluated Report Dimensions",
             ["ATS Match Score: 0 – 100% numerical match against job description.",
              "Matched Keywords: Technical competencies found in both resume & JD.",
              "Missing Keywords: Critical technologies missing from candidate resume.",
              "Section-wise Feedback: Specific critiques for Summary, Skills, Projects, Education.",
              "5 Concrete Improvement Steps: Actionable bullet points to improve score.",
              "PDF Report Download: Client generates downloadable PDF via html2pdf.js.",
              "Historical Dashboard: Visualized over time on candidate's dashboard."],
             "CANDIDATE OUTPUT SCHEMA")

    # -------------------------------------------------------------------------
    # SLIDE 6: FEATURE 2 DEEP DIVE (MOCK INTERVIEW)
    # -------------------------------------------------------------------------
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, "05 / Deep Dive — Core Feature 2", "Interactive Mock Interview Coach: Round Workflow")

    add_card(s6, Inches(0.8), Inches(2.0), Inches(3.6), Inches(4.7),
             "1. Initialization",
             ["Candidate picks technical role:",
              "  • Full Stack MERN",
              "  • Frontend (React/JS)",
              "  • Backend (Node/Express)",
              "  • Data Science / ML",
              "Selects Difficulty: Beginner, Intermediate, Advanced.",
              "Gemini generates tailored 5-question sequential syllabus.",
              "Initializes session in MongoDB."],
             "STEP 1: CONFIGURATION")

    add_card(s6, Inches(4.8), Inches(2.0), Inches(3.6), Inches(4.7),
             "2. Dynamic Q&A",
             ["5 Sequential Questions served one at a time.",
              "Timed answer input simulates live viva conditions.",
              "Covers theory, system design, and algorithmic thinking.",
              "Prevents skipping without answering.",
              "Real-time round progress counter."],
             "STEP 2: SIMULATED VIVA")

    add_card(s6, Inches(8.8), Inches(2.0), Inches(3.6), Inches(4.7),
             "3. Evaluation",
             ["Per-Answer Scoring: /10 numerical rating per question.",
              "Constructive Feedback: What was good vs what was missing.",
              "Model Answer Outline: Ideal technical industry answer.",
              "Cumulative Performance: Computes average score.",
              "Saved to MongoDB for performance tracking."],
             "STEP 3: INSTANT GRADING")

    # -------------------------------------------------------------------------
    # SLIDE 7: DATABASE & PRODUCTION SECURITY
    # -------------------------------------------------------------------------
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, "06 / Security & Data Integrity", "MongoDB Schemas & Defensive Production Security")

    add_card(s7, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.7),
             "Mongoose Database Schemas",
             ["User Schema: name, email (unique index), passwordHash, createdAt.",
              "Analysis Schema: user (ref: 'User'), resumeText, jobDescription, atsScore, matchedKeywords[], missingKeywords[], feedback, suggestions[].",
              "Interview Schema: user (ref: 'User'), role, difficulty, questions[{ question, answer, score, feedback, idealAnswer }], averageScore, completedAt.",
              "Relational Integrity: MongoDB ObjectIds link candidates to their history.",
              "Connection Resilience: Custom background retry loop auto-reconnects on DNS propagation or cloud wake-ups."],
             "PERSISTENCE & SCHEMAS")

    add_card(s7, Inches(6.8), Inches(2.0), Inches(5.6), Inches(4.7),
             "Production Security Measures",
             ["Password Hashing: bcryptjs with 10 salt rounds in pre-save hook; plaintext passwords never touch database.",
              "Stateless JWT Auth: Signed with 7-day expiration; validated on all protected endpoints via auth.middleware.js.",
              "CORS Whitelisting: Express only permits requests from frontend origin (https://aryan1238.github.io).",
              "Trust Proxy & Rate Limiting: app.set('trust proxy', 1) reads genuine client IP behind Render; limits to 100 req/15m.",
              "Secret Isolation: All credentials (.env) excluded from Git via .gitignore."],
             "APPLICATION DEFENSE")

    # -------------------------------------------------------------------------
    # SLIDE 8: TESTING & DEPLOYMENT
    # -------------------------------------------------------------------------
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8)
    add_header(s8, "07 / Verification & DevOps", "Automated Testing & Multi-Cloud Deployment Architecture")

    add_card(s8, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.7),
             "Automated Test Suite (Jest + Supertest)",
             ["11 Automated Tests across 2 complete suites:",
              "  • auth.test.js: Registration, duplicate email rejection (409), short password validation (400), login verification, JWT token checks.",
              "  • analysis.test.js: Upload validation, missing file handling, previous analyses fetching, dashboard aggregation metrics.",
              "Deterministic Mocking: Jest mocks Gemini service to verify end-to-end flows without spending API quota.",
              "Execution Speed: Full suite runs in under 2.0 seconds.",
              "CI/CD Integration: npm test runs before deployment."],
             "QUALITY ASSURANCE (11/11 PASSING)")

    add_card(s8, Inches(6.8), Inches(2.0), Inches(5.6), Inches(4.7),
             "Zero-Cost Production Multi-Cloud Hosting",
             ["Frontend Hosting: GitHub Pages CDN",
              "  • URL: https://aryan1238.github.io/A/",
              "  • Automated GitHub Actions CI/CD (deploy.yml)",
              "  • Separated build and deploy jobs prevent duplicate artifact collisions.",
              "Backend Hosting: Render Web Service (Node.js)",
              "  • URL: https://preppilot-api-dk3o.onrender.com",
              "  • Root endpoint & /api/health monitoring.",
              "Database: MongoDB Atlas Cloud Replica Set (Oregon)",
              "  • 0.0.0.0/0 IP whitelist + SCRAM-SHA-256 auth."],
             "LIVE DEPLOYED CLOUD ARCHITECTURE")

    # -------------------------------------------------------------------------
    # SLIDE 9: FUTURE SCOPE
    # -------------------------------------------------------------------------
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9)
    add_header(s9, "08 / Scalability & Evolution", "Future Scope & Platform Roadmap")

    add_card(s9, Inches(0.8), Inches(2.0), Inches(3.6), Inches(4.7),
             "Voice-to-Text Rounds",
             ["Integration with Web Speech API & OpenAI Whisper.",
              "Real-time vocal interview simulation.",
              "Analyzes speech metrics: pace (words/min), pause duration, and filler word frequency (e.g. 'um', 'like').",
              "Assesses candidate communication confidence."],
             "FEATURE 1: SPEECH RECOGNITION")

    add_card(s9, Inches(4.8), Inches(2.0), Inches(3.6), Inches(4.7),
             "College TPO Portal",
             ["Dedicated admin role for Training & Placement Officers.",
              "Batch-wide analytics: average ATS score distribution across branches.",
              "Identifies recurring skill deficiencies across college batches.",
              "Enables targeted campus training seminars."],
             "FEATURE 2: INSTITUTIONAL DASHBOARD")

    add_card(s9, Inches(8.8), Inches(2.0), Inches(3.6), Inches(4.7),
             "Live Code Runner",
             ["In-browser Monaco code editor (VS Code web engine).",
              "Sandboxed code execution via WebAssembly / Judge0 API.",
              "Evaluates algorithmic DSA questions against hidden test cases.",
              "Full technical coding interview round support."],
             "FEATURE 3: CODE EXECUTION SANDBOX")

    # -------------------------------------------------------------------------
    # SLIDE 10: CONCLUSION & VIVA Q&A
    # -------------------------------------------------------------------------
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10)
    add_header(s10, "09 / Viva Defense & Conclusion", "Summary of Achievements & Ready for Q&A")

    # Big Summary Card
    add_card(s10, Inches(0.8), Inches(2.0), Inches(11.7), Inches(2.4),
             "Key Project Milestones Achieved",
             ["Successfully developed & deployed full-stack MERN application with Google Gemini 1.5 Flash.",
              "Built in-memory PDF resume text extraction and ATS gap scoring without storing candidate files to disk.",
              "Implemented interactive 5-question mock interview coach with per-answer evaluation and model answers.",
              "Enforced production security: bcrypt password hashing, stateless JWT auth, CORS isolation, rate limiting.",
              "Verified with 11 automated Jest tests and deployed live to GitHub Pages, Render, and MongoDB Atlas."],
             "PROJECT SUMMARY")

    # 3 Info Pillars
    add_card(s10, Inches(0.8), Inches(4.7), Inches(3.6), Inches(2.1),
             "Live Web Application",
             ["https://aryan1238.github.io/A/",
              "Deployed on GitHub Pages",
              "HashRouter client routing"],
             "FRONTEND")

    add_card(s10, Inches(4.8), Inches(4.7), Inches(3.6), Inches(2.1),
             "Backend Cloud API",
             ["https://preppilot-api-dk3o.onrender.com",
              "Render Web Service (Node.js)",
              "Health: /api/health (200 OK)"],
             "BACKEND")

    add_card(s10, Inches(8.8), Inches(4.7), Inches(3.6), Inches(2.1),
             "Source Repository",
             ["https://github.com/Aryan1238/A",
              "Complete Postman API docs",
              "5 UML Mermaid diagrams"],
             "GITHUB")

    output_path = "docs/PrepPilot_Presentation.pptx"
    prs.save(output_path)
    print(f"✅ Successfully created PowerPoint presentation at {output_path}")

if __name__ == "__main__":
    create_presentation()
