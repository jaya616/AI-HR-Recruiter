# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Recruiter Voice Agent (Hirebot360) is a React-based web application that conducts AI-powered voice interviews for job candidates. The application uses Google's Gemini AI for question generation and response evaluation, browser speech APIs for voice interaction, and features a landing page with a live demo.

## Development Commands

### Frontend (React)
- `npm start` - Start development server on http://localhost:3000
- `npm test` - Run tests in watch mode
- `npm run build` - Build production bundle to /build folder

### Backend (Express)
The backend server must be run separately:
- Navigate to `/server/` directory
- Run: `node server.js` - Starts Express API server on port 4000
- The frontend proxies API requests to `http://localhost:4000` (configured in package.json)

**Important**: Both frontend and backend must run simultaneously for full functionality.

## Architecture

### Frontend Structure
- **src/App.js** - Root component that conditionally renders LandingPage or AIRecruiterDemo
- **src/LandingPage.jsx** - Marketing/landing page with feature showcase, stats, testimonials, and CTA to launch demo
- **src/AIRecruiterDemo.jsx** - Main interview application (large file, ~25k+ tokens)
  - Manages interview lifecycle: config → interview → report stages
  - Integrates Web Speech API for voice recognition and synthesis
  - Contains embedded question dataset (~300+ questions for 25+ job roles)
  - Handles real-time conversation, scoring, and analytics generation
- **src/dataset.jsx** - Exported question database (separate module for potential reuse)

### Backend Structure
- **server/server.js** - Express API server with single endpoint:
  - `POST /api/generate-questions` - Calls Gemini API to generate interview questions
  - Accepts: jobTitle, difficulty, numQuestions, language
  - Returns: JSON array of questions
  - Handles Gemini response parsing and error recovery

### API Integration
- Uses Google Gemini 1.5 Flash model via REST API
- Requires `GEMINI_API_KEY` environment variable in `/server/.env`
- Frontend proxies `/api/*` requests to backend via package.json proxy setting

### Data Flow
1. User configures interview on LandingPage/AIRecruiterDemo config stage
2. Frontend calls `/api/generate-questions` with job parameters
3. Backend constructs prompt, queries Gemini API, parses JSON response
4. Frontend receives questions and begins voice-based interview
5. User responses evaluated client-side with keyword matching + AI analysis
6. Final report generated with scores across multiple categories

### Voice Features
- **Speech Recognition**: Uses browser's `webkitSpeechRecognition` or `SpeechRecognition` API
- **Speech Synthesis**: Uses `SpeechSynthesisUtterance` for text-to-speech
- **Multi-language Support**: Configurable voice language/accent (English US/UK/AU/IN, Spanish, French, German, Japanese, Korean, etc.)
- Voice can be toggled on/off for text-only mode

### Question Database
- 300+ questions covering 25+ job roles embedded in AIRecruiterDemo.jsx
- Categories: Python Developer, Data Scientist, ML Engineer, Web Developer, Java Developer, DevOps, UI/UX Designer, Product Manager, Marketing, Sales, HR, Business Analyst, QA Engineer, Cloud Engineer, etc.
- Each question has: title, question text, keywords for evaluation, difficulty level (Easy/Medium/Hard)
- Questions can be filtered by job role and difficulty

### Styling
- Uses Tailwind CSS (configured in tailwind.config.js)
- Gradient-heavy design with purple/pink/cyan color scheme
- Glassmorphism effects (backdrop-blur, transparency)
- Responsive design with mobile breakpoints
- Lucide React icons throughout

## Environment Variables

Create `/server/.env` file with:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

The backend logs whether the API key loaded successfully on startup.

## Key Technical Considerations

### AIRecruiterDemo.jsx Size
The main interview component is very large (25k+ tokens). When making edits:
- Use targeted edits rather than full rewrites
- Consider extracting components if adding significant new features
- Question dataset could be moved to separate module (already exists in dataset.jsx but not fully utilized)

### Browser Compatibility
- Speech APIs require modern browsers (Chrome, Edge, Safari)
- Speech recognition particularly Chrome-dependent (webkitSpeechRecognition)
- Graceful degradation: voice toggle allows text-only mode

### Gemini API Response Handling
Backend includes robust error handling for Gemini responses:
- Strips markdown code fences (```json```)
- Fallbacks to empty array on parse failure
- Logs raw responses for debugging

### Interview Scoring Logic
Client-side scoring evaluates responses based on:
- Keyword matching from question database
- Response length and completeness
- Technical accuracy (via AI analysis if enhanced)
- Communication clarity
- Categories: Technical Skills, Communication, Problem Solving, Cultural Fit, Overall

## Development Workflow

1. Ensure both frontend and backend are running
2. Frontend auto-reloads on file changes
3. Backend requires manual restart after code changes
4. Test voice features in supported browser (Chrome recommended)
5. API calls visible in browser DevTools Network tab and server console

## Testing Notes

- Test files use React Testing Library
- Voice features cannot be easily unit tested (require browser APIs)
- Focus testing on data flow, state management, and UI interactions
- Mock API calls when testing without backend running
