import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, MessageSquare, User, Briefcase, Clock, Star, TrendingUp, Award, CheckCircle, AlertCircle, Volume2, VolumeX, Database, Play, StopCircle, Download, BarChart3, Brain, Target, Users, Zap, FileText, Settings, X, Key, Upload, Trash2 } from 'lucide-react';
import './index.css';
import './App.css';

const AIRecruiterDemo = () => {
  const [stage, setStage] = useState('config');
  const [candidateName, setCandidateName] = useState('Sarah Johnson');
  const [jobTitle, setJobTitle] = useState('Python Developer');
  const [language, setLanguage] = useState('en-US');
  const [personality, setPersonality] = useState('friendly');
  const [difficulty, setDifficulty] = useState('All');
  const [numQuestions, setNumQuestions] = useState(5);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [conversation, setConversation] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [report, setReport] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: string }

  // API Settings
  const [showSettings, setShowSettings] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [geminiModel, setGeminiModel] = useState('gemini-1.5-pro');
  const [testingConnection, setTestingConnection] = useState(false);
  const [availableModels, setAvailableModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);

  // CV Upload
  const [uploadedCV, setUploadedCV] = useState(null);
  const [cvText, setCvText] = useState('');
  const [uploadingCV, setUploadingCV] = useState(false);

  const speechRef = useRef(null);
  const recognitionRef = useRef(null);
  const conversationEndRef = useRef(null);

  // Complete dataset
const fullDataset = [
    // # Python Developer (10 qs)
    {title: "Python Developer", q: "Explain the difference between Python lists and tuples", keywords: "list, tuple, mutable, immutable, memory", diff: "Medium"},
    {title: "Python Developer", q: "What are Python decorators and how do you use them?", keywords: "decorator, function, wrapper, @, modify", diff: "Medium"},
    {title: "Python Developer", q: "How do you handle exceptions in Python?", keywords: "try, except, finally, raise, error", diff: "Easy"},
    {title: "Python Developer", q: "Explain the concept of generators in Python", keywords: "yield, iterator, memory, lazy, efficient", diff: "Hard"},
    {title: "Python Developer", q: "What is the difference between __init__ and __new__ methods?", keywords: "constructor, instance, object, initialization", diff: "Hard"},
    {title: "Python Developer", q: "How does garbage collection work in Python?", keywords: "reference, counting, memory, cleanup, cycle", diff: "Medium"},
    {title: "Python Developer", q: "Explain multithreading vs multiprocessing in Python", keywords: "thread, process, GIL, parallel, concurrent", diff: "Hard"},
    {title: "Python Developer", q: "What are Python's *args and **kwargs?", keywords: "arguments, variable, parameters, unpacking", diff: "Easy"},
    {title: "Python Developer", q: "How do you optimize Python code for performance?", keywords: "profiling, bottleneck, algorithm, data structure, caching", diff: "Medium"},
    {title: "Python Developer", q: "Explain context managers and the with statement", keywords: "context, resource, cleanup, __enter__, __exit__", diff: "Medium"},
    
    // # Data Analyst (10 qs)
    {title: "Data Analyst", q: "Explain the difference between INNER JOIN and LEFT JOIN in SQL", keywords: "inner, left, join, rows, matching, null", diff: "Easy"},
    {title: "Data Analyst", q: "What is normalization in databases and why is it important?", keywords: "normalization, redundancy, tables, integrity, dependency", diff: "Medium"},
    {title: "Data Analyst", q: "How would you handle missing data in a dataset?", keywords: "missing, null, imputation, drop, mean, median", diff: "Easy"},
    {title: "Data Analyst", q: "Explain the difference between correlation and causation", keywords: "correlation, causation, relationship, statistical, confounding", diff: "Medium"},
    {title: "Data Analyst", q: "What is the purpose of data visualization and which tools do you use?", keywords: "visualization, charts, tableau, powerbi, matplotlib, insights", diff: "Easy"},
    {title: "Data Analyst", q: "How do you identify and handle outliers in data?", keywords: "outliers, IQR, standard deviation, detection, remove", diff: "Medium"},
    {title: "Data Analyst", q: "Explain the ETL process", keywords: "extract, transform, load, pipeline, data warehouse", diff: "Medium"},
    {title: "Data Analyst", q: "What are window functions in SQL and when would you use them?", keywords: "window, partition, rank, row_number, aggregate", diff: "Hard"},
    {title: "Data Analyst", q: "How do you ensure data quality in your analysis?", keywords: "validation, consistency, accuracy, completeness, integrity", diff: "Medium"},
    {title: "Data Analyst", q: "Describe a time when you had to present complex data findings to non-technical stakeholders", keywords: "communication, visualization, simplify, storytelling, insights", diff: "Easy"},
    
    // # Data Scientist (10 qs)
    {title: "Data Scientist", q: "Explain the bias-variance tradeoff", keywords: "bias, variance, tradeoff, overfitting, underfitting, model", diff: "Hard"},
    {title: "Data Scientist", q: "What is the difference between supervised and unsupervised learning?", keywords: "supervised, unsupervised, labeled, clustering, classification", diff: "Easy"},
    {title: "Data Scientist", q: "How do you evaluate a machine learning model?", keywords: "accuracy, precision, recall, F1, confusion matrix, ROC", diff: "Medium"},
    {title: "Data Scientist", q: "Explain cross-validation and why it is important", keywords: "cross-validation, k-fold, overfitting, generalization, testing", diff: "Medium"},
    {title: "Data Scientist", q: "What is regularization and when would you use it?", keywords: "regularization, L1, L2, overfitting, penalty, ridge, lasso", diff: "Hard"},
    {title: "Data Scientist", q: "Describe the Random Forest algorithm", keywords: "random forest, trees, ensemble, bagging, feature importance", diff: "Medium"},
    {title: "Data Scientist", q: "How do you handle imbalanced datasets?", keywords: "imbalanced, SMOTE, undersampling, oversampling, class weight", diff: "Hard"},
    {title: "Data Scientist", q: "Explain dimensionality reduction techniques", keywords: "PCA, t-SNE, dimensionality, features, curse, compression", diff: "Hard"},
    {title: "Data Scientist", q: "What is the difference between bagging and boosting?", keywords: "bagging, boosting, ensemble, parallel, sequential, weak learners", diff: "Hard"},
    {title: "Data Scientist", q: "How do you deploy a machine learning model to production?", keywords: "deployment, API, docker, monitoring, pipeline, serving", diff: "Medium"},
    
    // # Machine Learning Engineer (10 qs)
    {title: "Machine Learning Engineer", q: "Explain the architecture of a neural network", keywords: "neural, layers, activation, weights, forward, backward", diff: "Medium"},
    {title: "Machine Learning Engineer", q: "What is gradient descent and how does it work?", keywords: "gradient, descent, optimization, learning rate, convergence", diff: "Medium"},
    {title: "Machine Learning Engineer", q: "How do you optimize hyperparameters?", keywords: "hyperparameter, grid search, random search, bayesian, tuning", diff: "Medium"},
    {title: "Machine Learning Engineer", q: "Explain transfer learning and its benefits", keywords: "transfer, pretrained, fine-tuning, features, weights", diff: "Hard"},
    {title: "Machine Learning Engineer", q: "What is the difference between batch and online learning?", keywords: "batch, online, streaming, incremental, real-time", diff: "Medium"},
    {title: "Machine Learning Engineer", q: "How do you handle feature engineering?", keywords: "feature, engineering, selection, extraction, transformation", diff: "Medium"},
    {title: "Machine Learning Engineer", q: "Explain the concept of attention mechanism in deep learning", keywords: "attention, transformer, weights, context, sequence", diff: "Hard"},
    {title: "Machine Learning Engineer", q: "What are the challenges in deploying ML models at scale?", keywords: "scalability, latency, monitoring, versioning, infrastructure", diff: "Hard"},
    {title: "Machine Learning Engineer", q: "How do you prevent overfitting in neural networks?", keywords: "overfitting, dropout, regularization, early stopping, validation", diff: "Medium"},
    {title: "Machine Learning Engineer", q: "Explain the difference between CNNs and RNNs", keywords: "CNN, RNN, convolutional, recurrent, image, sequence", diff: "Hard"},
    
    // # Web Developer (10 qs)
    {title: "Web Developer", q: "Explain the difference between HTML, CSS, and JavaScript", keywords: "HTML, CSS, JavaScript, structure, styling, behavior", diff: "Easy"},
    {title: "Web Developer", q: "What is responsive web design?", keywords: "responsive, mobile, breakpoints, media queries, flexible", diff: "Easy"},
    {title: "Web Developer", q: "Explain the concept of REST APIs", keywords: "REST, API, HTTP, GET, POST, PUT, DELETE, stateless", diff: "Medium"},
    {title: "Web Developer", q: "What is the difference between == and === in JavaScript?", keywords: "equality, strict, type, coercion, comparison", diff: "Easy"},
    {title: "Web Developer", q: "How do you optimize website performance?", keywords: "performance, caching, minification, compression, lazy loading", diff: "Medium"},
    {title: "Web Developer", q: "Explain the concept of promises in JavaScript", keywords: "promise, async, await, callback, asynchronous", diff: "Medium"},
    {title: "Web Developer", q: "What is CORS and why is it important?", keywords: "CORS, cross-origin, security, browser, headers", diff: "Medium"},
    {title: "Web Developer", q: "Describe the MVC architecture pattern", keywords: "MVC, model, view, controller, separation, architecture", diff: "Medium"},
    {title: "Web Developer", q: "How do you ensure web accessibility?", keywords: "accessibility, ARIA, semantic, screen reader, WCAG", diff: "Medium"},
    {title: "Web Developer", q: "What are web components and how do you use them?", keywords: "web components, custom elements, shadow DOM, reusable", diff: "Hard"},
    
    // # Java Developer (10 qs)
    {title: "Java Developer", q: "Explain the concept of Object-Oriented Programming", keywords: "OOP, encapsulation, inheritance, polymorphism, abstraction", diff: "Easy"},
    {title: "Java Developer", q: "What is the difference between abstract class and interface?", keywords: "abstract, interface, implementation, multiple inheritance", diff: "Medium"},
    {title: "Java Developer", q: "Explain the Java memory model", keywords: "heap, stack, garbage collection, memory, JVM", diff: "Hard"},
    {title: "Java Developer", q: "What are Java streams and how do you use them?", keywords: "streams, lambda, functional, filter, map, collect", diff: "Medium"},
    {title: "Java Developer", q: "Explain exception handling in Java", keywords: "exception, try, catch, finally, throw, checked, unchecked", diff: "Easy"},
    {title: "Java Developer", q: "What is the difference between ArrayList and LinkedList?", keywords: "ArrayList, LinkedList, performance, insertion, retrieval", diff: "Medium"},
    {title: "Java Developer", q: "Explain multithreading in Java", keywords: "thread, concurrent, synchronized, executor, parallel", diff: "Hard"},
    {title: "Java Developer", q: "What is the Spring Framework and why is it used?", keywords: "Spring, dependency injection, IoC, framework, enterprise", diff: "Medium"},
    {title: "Java Developer", q: "Explain the SOLID principles", keywords: "SOLID, single responsibility, open-closed, Liskov, interface, dependency", diff: "Hard"},
    {title: "Java Developer", q: "What is JUnit and how do you write unit tests?", keywords: "JUnit, testing, assertions, mock, test-driven", diff: "Medium"},
    
    // # DevOps Engineer (10 qs)
    {title: "DevOps Engineer", q: "Explain the CI/CD pipeline", keywords: "CI, CD, continuous, integration, deployment, automation", diff: "Medium"},
    {title: "DevOps Engineer", q: "What is Docker and how does it work?", keywords: "Docker, container, image, isolation, lightweight", diff: "Medium"},
    {title: "DevOps Engineer", q: "Explain the difference between Docker and Kubernetes", keywords: "Docker, Kubernetes, orchestration, container, scaling", diff: "Medium"},
    {title: "DevOps Engineer", q: "What is Infrastructure as Code?", keywords: "IaC, Terraform, Ansible, automation, configuration", diff: "Medium"},
    {title: "DevOps Engineer", q: "How do you monitor applications in production?", keywords: "monitoring, Prometheus, Grafana, logs, metrics, alerts", diff: "Medium"},
    {title: "DevOps Engineer", q: "Explain the concept of microservices", keywords: "microservices, architecture, distributed, independent, scalable", diff: "Hard"},
    {title: "DevOps Engineer", q: "What is blue-green deployment?", keywords: "blue-green, deployment, zero-downtime, rollback, production", diff: "Medium"},
    {title: "DevOps Engineer", q: "How do you ensure security in DevOps?", keywords: "DevSecOps, security, scanning, vulnerability, compliance", diff: "Hard"},
    {title: "DevOps Engineer", q: "Explain the concept of service mesh", keywords: "service mesh, Istio, microservices, communication, observability", diff: "Hard"},
    {title: "DevOps Engineer", q: "What is GitOps and how does it work?", keywords: "GitOps, Git, declarative, automation, infrastructure", diff: "Medium"},
    
    // # Marketing Executive (10 qs)
    {title: "Marketing Executive", q: "What strategies would you use to increase brand awareness?", keywords: "brand, awareness, social media, campaigns, SEO, content", diff: "Easy"},
    {title: "Marketing Executive", q: "Explain the concept of SEO", keywords: "SEO, search engine, keywords, ranking, optimization", diff: "Easy"},
    {title: "Marketing Executive", q: "How do you handle a failed marketing campaign?", keywords: "learn, analyze, feedback, pivot, metrics, improvement", diff: "Medium"},
    {title: "Marketing Executive", q: "What is the difference between B2B and B2C marketing?", keywords: "B2B, B2C, business, consumer, strategy, decision", diff: "Easy"},
    {title: "Marketing Executive", q: "How do you measure marketing ROI?", keywords: "ROI, metrics, conversion, revenue, cost, analytics", diff: "Medium"},
    {title: "Marketing Executive", q: "Explain the marketing funnel", keywords: "funnel, awareness, consideration, conversion, retention", diff: "Medium"},
    {title: "Marketing Executive", q: "What is content marketing and why is it important?", keywords: "content, marketing, value, engagement, audience, storytelling", diff: "Easy"},
    {title: "Marketing Executive", q: "How do you segment your target audience?", keywords: "segmentation, demographics, psychographics, behavior, targeting", diff: "Medium"},
    {title: "Marketing Executive", q: "Describe your experience with email marketing campaigns", keywords: "email, campaign, open rate, click-through, personalization", diff: "Easy"},
    {title: "Marketing Executive", q: "How do you stay updated with marketing trends?", keywords: "trends, learning, research, industry, networking, tools", diff: "Easy"},
    
    // # Sales Executive (10 qs)
    {title: "Sales Executive", q: "How do you qualify a lead?", keywords: "lead, qualification, BANT, budget, authority, need, timeline", diff: "Medium"},
    {title: "Sales Executive", q: "Describe your sales process from prospecting to closing", keywords: "prospecting, pitch, objections, negotiation, closing, follow-up", diff: "Medium"},
    {title: "Sales Executive", q: "How do you handle customer objections?", keywords: "objections, listen, empathy, solutions, value, concerns", diff: "Medium"},
    {title: "Sales Executive", q: "What CRM tools have you used?", keywords: "CRM, Salesforce, HubSpot, tracking, pipeline, customer", diff: "Easy"},
    {title: "Sales Executive", q: "How do you maintain relationships with existing clients?", keywords: "relationship, retention, communication, value, upsell, cross-sell", diff: "Easy"},
    {title: "Sales Executive", q: "Describe a time when you exceeded your sales targets", keywords: "targets, achievement, strategy, persistence, results, metrics", diff: "Medium"},
    {title: "Sales Executive", q: "How do you prioritize your sales activities?", keywords: "prioritization, time management, high-value, pipeline, productivity", diff: "Medium"},
    {title: "Sales Executive", q: "What is consultative selling?", keywords: "consultative, needs, solutions, advisor, relationship, trust", diff: "Medium"},
    {title: "Sales Executive", q: "How do you recover from a lost deal?", keywords: "resilience, learn, feedback, improvement, move forward", diff: "Easy"},
    {title: "Sales Executive", q: "Explain the importance of active listening in sales", keywords: "listening, understanding, needs, qs, rapport, empathy", diff: "Easy"},
    
    // # HR Executive (10 qs)
    {title: "HR Executive", q: "How do you handle employee conflicts?", keywords: "conflict, mediation, communication, resolution, fair, neutral", diff: "Medium"},
    {title: "HR Executive", q: "Explain the recruitment process you follow", keywords: "recruitment, sourcing, screening, interview, selection, onboarding", diff: "Easy"},
    {title: "HR Executive", q: "What is employee engagement and why is it important?", keywords: "engagement, motivation, retention, productivity, culture, satisfaction", diff: "Medium"},
    {title: "HR Executive", q: "How do you ensure diversity and inclusion in the workplace?", keywords: "diversity, inclusion, equity, policies, culture, awareness", diff: "Medium"},
    {title: "HR Executive", q: "Describe your experience with performance management", keywords: "performance, appraisal, feedback, goals, development, review", diff: "Medium"},
    {title: "HR Executive", q: "How do you handle employee terminations?", keywords: "termination, documentation, legal, dignity, communication, exit", diff: "Hard"},
    {title: "HR Executive", q: "What is your approach to employee training and development?", keywords: "training, development, skills, learning, growth, programs", diff: "Medium"},
    {title: "HR Executive", q: "How do you maintain confidentiality in HR?", keywords: "confidentiality, trust, privacy, sensitive, ethics, policies", diff: "Easy"},
    {title: "HR Executive", q: "Explain the importance of employer branding", keywords: "employer brand, reputation, talent, attraction, culture, value", diff: "Medium"},
    {title: "HR Executive", q: "How do you manage employee benefits and compensation?", keywords: "benefits, compensation, competitive, fair, packages, satisfaction", diff: "Medium"},
    
    // # UI/UX Designer (10 qs)
    {title: "UI/UX Designer", q: "Explain the difference between UI and UX design", keywords: "UI, UX, interface, experience, visual, usability", diff: "Easy"},
    {title: "UI/UX Designer", q: "What is your design process?", keywords: "research, wireframe, prototype, testing, iteration, feedback", diff: "Medium"},
    {title: "UI/UX Designer", q: "How do you conduct user research?", keywords: "research, interview, survey, persona, observation, data", diff: "Medium"},
    {title: "UI/UX Designer", q: "What design tools do you use?", keywords: "Figma, Sketch, Adobe XD, prototyping, collaboration", diff: "Easy"},
    {title: "UI/UX Designer", q: "Explain the concept of information architecture", keywords: "information architecture, structure, navigation, hierarchy, organization", diff: "Medium"},
    {title: "UI/UX Designer", q: "How do you ensure your designs are accessible?", keywords: "accessibility, WCAG, inclusive, contrast, keyboard, screen reader", diff: "Medium"},
    {title: "UI/UX Designer", q: "What is A/B testing and how do you use it?", keywords: "A/B testing, experiment, variants, data, optimization, conversion", diff: "Medium"},
    {title: "UI/UX Designer", q: "Describe a challenging design problem you solved", keywords: "problem, solution, user needs, constraints, iteration, impact", diff: "Hard"},
    {title: "UI/UX Designer", q: "How do you handle design feedback?", keywords: "feedback, open-minded, rationale, collaboration, improvement", diff: "Easy"},
    {title: "UI/UX Designer", q: "Explain the importance of design systems", keywords: "design system, consistency, components, scalability, efficiency", diff: "Medium"},
    
    // # Project Manager (10 qs)
    {title: "Project Manager", q: "What project management methodologies do you use?", keywords: "Agile, Scrum, Waterfall, Kanban, methodology, framework", diff: "Easy"},
    {title: "Project Manager", q: "How do you handle scope creep?", keywords: "scope creep, change management, documentation, stakeholder, baseline", diff: "Medium"},
    {title: "Project Manager", q: "Explain the critical path method", keywords: "critical path, dependencies, timeline, project schedule, duration", diff: "Hard"},
    {title: "Project Manager", q: "How do you manage project risks?", keywords: "risk, identification, assessment, mitigation, contingency, monitoring", diff: "Medium"},
    {title: "Project Manager", q: "What tools do you use for project management?", keywords: "Jira, Trello, Asana, MS Project, tools, tracking", diff: "Easy"},
    {title: "Project Manager", q: "How do you communicate with stakeholders?", keywords: "communication, stakeholder, updates, transparency, meetings, reports", diff: "Medium"},
    {title: "Project Manager", q: "Describe a time when a project failed and what you learned", keywords: "failure, lessons, reflection, improvement, accountability", diff: "Hard"},
    {title: "Project Manager", q: "How do you motivate your team?", keywords: "motivation, leadership, recognition, empowerment, support, goals", diff: "Medium"},
    {title: "Project Manager", q: "What is the project management triangle?", keywords: "triangle, scope, time, cost, quality, constraints, balance", diff: "Medium"},
    {title: "Project Manager", q: "How do you manage remote or distributed teams?", keywords: "remote, communication, tools, timezone, collaboration, trust", diff: "Medium"},
    
    // # Business Analyst (10 qs)
    {title: "Business Analyst", q: "What is requirements gathering and how do you do it?", keywords: "requirements, stakeholder, elicitation, documentation, analysis", diff: "Medium"},
    {title: "Business Analyst", q: "Explain the difference between functional and non-functional requirements", keywords: "functional, non-functional, performance, usability, requirements", diff: "Medium"},
    {title: "Business Analyst", q: "What is SWOT analysis?", keywords: "SWOT, strengths, weaknesses, opportunities, threats, strategic", diff: "Easy"},
    {title: "Business Analyst", q: "How do you create use cases?", keywords: "use case, actor, scenario, flow, documentation, interaction", diff: "Medium"},
    {title: "Business Analyst", q: "What tools do you use for business analysis?", keywords: "tools, Visio, Excel, JIRA, documentation, modeling", diff: "Easy"},
    {title: "Business Analyst", q: "How do you handle conflicting stakeholder requirements?", keywords: "conflict, prioritization, negotiation, compromise, consensus", diff: "Hard"},
    {title: "Business Analyst", q: "Explain the concept of process mapping", keywords: "process, mapping, flowchart, workflow, improvement, optimization", diff: "Medium"},
    {title: "Business Analyst", q: "What is gap analysis?", keywords: "gap, current state, future state, analysis, improvement", diff: "Medium"},
    {title: "Business Analyst", q: "How do you validate requirements?", keywords: "validation, review, stakeholder, testing, acceptance, criteria", diff: "Medium"},
    {title: "Business Analyst", q: "Describe your experience with Agile BA practices", keywords: "Agile, user stories, backlog, sprint, iterative, collaboration", diff: "Medium"},
    
    // # QA Engineer (10 qs)
    {title: "QA Engineer", q: "What is the difference between manual and automation testing?", keywords: "manual, automation, testing, efficiency, repetitive, exploratory", diff: "Easy"},
    {title: "QA Engineer", q: "Explain the software testing life cycle", keywords: "STLC, planning, design, execution, reporting, closure", diff: "Medium"},
    {title: "QA Engineer", q: "What automation tools have you used?", keywords: "Selenium, Cypress, Playwright, JUnit, TestNG, automation", diff: "Easy"},
    {title: "QA Engineer", q: "How do you write test cases?", keywords: "test case, scenario, steps, expected, actual, coverage", diff: "Easy"},
    {title: "QA Engineer", q: "What is regression testing?", keywords: "regression, testing, changes, existing, functionality, bugs", diff: "Easy"},
    {title: "QA Engineer", q: "Explain the difference between smoke and sanity testing", keywords: "smoke, sanity, testing, build, critical, functionality", diff: "Medium"},
    {title: "QA Engineer", q: "How do you prioritize testing activities?", keywords: "prioritization, risk, critical, impact, resources, time", diff: "Medium"},
    {title: "QA Engineer", q: "What is API testing and how do you perform it?", keywords: "API, testing, Postman, REST, endpoints, validation", diff: "Medium"},
    {title: "QA Engineer", q: "How do you report and track bugs?", keywords: "bug, report, JIRA, severity, priority, reproduction, tracking", diff: "Easy"},
    {title: "QA Engineer", q: "Explain performance testing and its types", keywords: "performance, load, stress, scalability, response time, testing", diff: "Hard"},
    
    // # Digital Marketing Specialist (10 qs)
    {title: "Digital Marketing Specialist", q: "What is PPC advertising and how does it work?", keywords: "PPC, pay-per-click, ads, Google Ads, bidding, keywords", diff: "Easy"},
    {title: "Digital Marketing Specialist", q: "How do you measure the success of a digital campaign?", keywords: "KPI, metrics, ROI, conversion, engagement, analytics", diff: "Medium"},
    {title: "Digital Marketing Specialist", q: "Explain Google Analytics and how you use it", keywords: "Google Analytics, traffic, behavior, conversion, tracking, insights", diff: "Medium"},
    {title: "Digital Marketing Specialist", q: "What is remarketing and how does it work?", keywords: "remarketing, retargeting, cookies, pixel, ads, conversion", diff: "Medium"},
    {title: "Digital Marketing Specialist", q: "How do you optimize landing pages for conversions?", keywords: "landing page, CRO, A/B testing, CTA, optimization, conversion", diff: "Medium"},
    {title: "Digital Marketing Specialist", q: "What is marketing automation?", keywords: "automation, workflow, email, nurturing, CRM, personalization", diff: "Medium"},
    {title: "Digital Marketing Specialist", q: "Explain social media advertising strategies", keywords: "social media, Facebook, Instagram, targeting, engagement, ads", diff: "Easy"},
    {title: "Digital Marketing Specialist", q: "How do you conduct keyword research for SEO?", keywords: "keyword, research, SEO, search volume, competition, intent", diff: "Medium"},
    {title: "Digital Marketing Specialist", q: "What is influencer marketing?", keywords: "influencer, collaboration, reach, authenticity, social proof", diff: "Easy"},
    {title: "Digital Marketing Specialist", q: "How do you stay updated with digital marketing trends?", keywords: "trends, learning, blogs, webinars, testing, industry", diff: "Easy"},
    
    // # Content Writer (10 qs)
    {title: "Content Writer", q: "What is your content creation process?", keywords: "research, outline, draft, editing, proofreading, publishing", diff: "Easy"},
    {title: "Content Writer", q: "How do you write SEO-friendly content?", keywords: "SEO, keywords, meta, readability, structure, optimization", diff: "Medium"},
    {title: "Content Writer", q: "Explain the importance of storytelling in content", keywords: "storytelling, narrative, engagement, emotion, connection, audience", diff: "Medium"},
    {title: "Content Writer", q: "How do you adapt your writing style for different audiences?", keywords: "audience, tone, voice, adaptation, demographics, purpose", diff: "Medium"},
    {title: "Content Writer", q: "What tools do you use for content writing?", keywords: "Grammarly, Hemingway, WordPress, Google Docs, tools", diff: "Easy"},
    {title: "Content Writer", q: "How do you handle writer's block?", keywords: "creativity, break, research, inspiration, brainstorming", diff: "Easy"},
    {title: "Content Writer", q: "What is content strategy?", keywords: "strategy, planning, goals, audience, calendar, distribution", diff: "Medium"},
    {title: "Content Writer", q: "How do you measure content performance?", keywords: "analytics, engagement, traffic, conversion, metrics, ROI", diff: "Medium"},
    {title: "Content Writer", q: "Describe your experience with different content formats", keywords: "blog, article, social, email, video script, whitepaper", diff: "Easy"},
    {title: "Content Writer", q: "How do you ensure content originality and avoid plagiarism?", keywords: "originality, plagiarism, research, citation, tools, ethics", diff: "Easy"},
    
    // # Graphic Designer (10 qs)
    {title: "Graphic Designer", q: "What design software do you use?", keywords: "Adobe, Photoshop, Illustrator, InDesign, Figma, software", diff: "Easy"},
    {title: "Graphic Designer", q: "Explain the principles of design", keywords: "balance, contrast, hierarchy, alignment, proximity, repetition", diff: "Medium"},
    {title: "Graphic Designer", q: "What is your design process from concept to final delivery?", keywords: "brief, research, sketches, iterations, feedback, delivery", diff: "Medium"},
    {title: "Graphic Designer", q: "How do you choose color palettes for a project?", keywords: "color, psychology, brand, contrast, harmony, mood", diff: "Medium"},
    {title: "Graphic Designer", q: "What is typography and why is it important?", keywords: "typography, fonts, readability, hierarchy, design, communication", diff: "Easy"},
    {title: "Graphic Designer", q: "How do you handle design revisions and client feedback?", keywords: "feedback, revisions, communication, flexibility, professional", diff: "Easy"},
    {title: "Graphic Designer", q: "Explain the difference between raster and vector graphics", keywords: "raster, vector, pixels, scalability, resolution, formats", diff: "Medium"},
    {title: "Graphic Designer", q: "How do you stay inspired and updated with design trends?", keywords: "inspiration, trends, Behance, Dribbble, learning, experimentation", diff: "Easy"},
    {title: "Graphic Designer", q: "What is brand identity and how do you create it?", keywords: "brand, identity, logo, guidelines, consistency, visual", diff: "Medium"},
    {title: "Graphic Designer", q: "Describe a challenging design project you completed", keywords: "challenge, solution, creativity, constraints, outcome, learning", diff: "Medium"},
    
    // # Cloud Engineer (10 qs)
    {title: "Cloud Engineer", q: "What cloud platforms have you worked with?", keywords: "AWS, Azure, GCP, cloud, platform, experience", diff: "Easy"},
    {title: "Cloud Engineer", q: "Explain the difference between IaaS, PaaS, and SaaS", keywords: "IaaS, PaaS, SaaS, infrastructure, platform, software, service", diff: "Medium"},
    {title: "Cloud Engineer", q: "How do you ensure cloud security?", keywords: "security, IAM, encryption, compliance, monitoring, best practices", diff: "Hard"},
    {title: "Cloud Engineer", q: "What is auto-scaling and how does it work?", keywords: "auto-scaling, elasticity, load, resources, automatic, efficiency", diff: "Medium"},
    {title: "Cloud Engineer", q: "Explain serverless computing", keywords: "serverless, Lambda, functions, event-driven, managed, scalable", diff: "Medium"},
    {title: "Cloud Engineer", q: "How do you optimize cloud costs?", keywords: "cost, optimization, reserved, spot, monitoring, rightsizing", diff: "Medium"},
    {title: "Cloud Engineer", q: "What is a VPC and why is it important?", keywords: "VPC, virtual, network, isolation, subnets, security", diff: "Medium"},
    {title: "Cloud Engineer", q: "Explain cloud storage options", keywords: "storage, S3, block, object, file, database, archive", diff: "Medium"},
    {title: "Cloud Engineer", q: "How do you implement disaster recovery in the cloud?", keywords: "disaster recovery, backup, replication, RTO, RPO, failover", diff: "Hard"},
    {title: "Cloud Engineer", q: "What is cloud migration and what are the challenges?", keywords: "migration, strategy, lift-and-shift, refactor, challenges, planning", diff: "Hard"},
    
    // # Database Administrator (10 qs)
    {title: "Database Administrator", q: "What database systems have you worked with?", keywords: "MySQL, PostgreSQL, Oracle, SQL Server, MongoDB, database", diff: "Easy"},
    {title: "Database Administrator", q: "How do you optimize database performance?", keywords: "optimization, indexing, query, tuning, performance, monitoring", diff: "Hard"},
    {title: "Database Administrator", q: "Explain database backup and recovery strategies", keywords: "backup, recovery, full, incremental, differential, restoration", diff: "Medium"},
    {title: "Database Administrator", q: "What is database replication?", keywords: "replication, master, slave, synchronization, availability, copies", diff: "Medium"},
    {title: "Database Administrator", q: "How do you ensure database security?", keywords: "security, permissions, encryption, auditing, access control, compliance", diff: "Medium"},
    {title: "Database Administrator", q: "Explain ACID properties in databases", keywords: "ACID, atomicity, consistency, isolation, durability, transactions", diff: "Hard"},
    {title: "Database Administrator", q: "What is database sharding?", keywords: "sharding, partitioning, horizontal, scalability, distributed", diff: "Hard"},
    {title: "Database Administrator", q: "How do you monitor database health?", keywords: "monitoring, performance, metrics, logs, alerts, tools", diff: "Medium"},
    {title: "Database Administrator", q: "What is the difference between clustered and non-clustered indexes?", keywords: "clustered, non-clustered, index, performance, physical, logical", diff: "Medium"},
    {title: "Database Administrator", q: "How do you handle database migrations?", keywords: "migration, planning, testing, downtime, rollback, validation", diff: "Hard"},
    
    // # Network Engineer (10 qs)
    {title: "Network Engineer", q: "Explain the OSI model", keywords: "OSI, layers, physical, data link, network, transport, application", diff: "Medium"},
    {title: "Network Engineer", q: "What is the difference between TCP and UDP?", keywords: "TCP, UDP, protocol, reliable, connectionless, transport", diff: "Medium"},
    {title: "Network Engineer", q: "How do you troubleshoot network connectivity issues?", keywords: "troubleshooting, ping, traceroute, logs, tools, methodology", diff: "Medium"},
    {title: "Network Engineer", q: "What is subnetting and why is it used?", keywords: "subnetting, IP, network, segmentation, CIDR, efficiency", diff: "Hard"},
    {title: "Network Engineer", q: "Explain VPN and its types", keywords: "VPN, virtual, private, tunneling, site-to-site, remote access", diff: "Medium"},
    {title: "Network Engineer", q: "What is DNS and how does it work?", keywords: "DNS, domain, name, resolution, IP, records", diff: "Easy"},
    {title: "Network Engineer", q: "How do you secure a network?", keywords: "security, firewall, IDS, IPS, encryption, policies, access", diff: "Hard"},
    {title: "Network Engineer", q: "What is VLAN and why is it important?", keywords: "VLAN, virtual, LAN, segmentation, broadcast, isolation", diff: "Medium"},
    {title: "Network Engineer", q: "Explain routing protocols", keywords: "routing, protocol, OSPF, BGP, RIP, dynamic, static", diff: "Hard"},
    {title: "Network Engineer", q: "What tools do you use for network monitoring?", keywords: "monitoring, Wireshark, Nagios, PRTG, tools, analysis", diff: "Easy"},

    // # Financial Analyst (10 qs)
    {title: "Financial Analyst", q: "What financial modeling techniques do you use?", keywords: "modeling, DCF, valuation, forecasting, Excel, financial", diff: "Hard"},
    {title: "Financial Analyst", q: "Explain financial statements and their importance", keywords: "financial statements, balance sheet, income, cash flow, analysis", diff: "Medium"},
    {title: "Financial Analyst", q: "How do you perform variance analysis?", keywords: "variance, analysis, budget, actual, deviation, investigation", diff: "Medium"},
    {title: "Financial Analyst", q: "What is NPV and how do you calculate it?", keywords: "NPV, net present value, cash flows, discount, investment", diff: "Hard"},
    {title: "Financial Analyst", q: "How do you assess investment opportunities?", keywords: "investment, ROI, risk, return, analysis, due diligence", diff: "Medium"},
    {title: "Financial Analyst", q: "Explain ratio analysis", keywords: "ratio, liquidity, profitability, leverage, efficiency, financial", diff: "Medium"},
    {title: "Financial Analyst", q: "What tools do you use for financial analysis?", keywords: "Excel, Bloomberg, SAP, financial, tools, software", diff: "Easy"},
    {title: "Financial Analyst", q: "How do you create financial forecasts?", keywords: "forecast, projection, assumptions, historical, trends, analysis", diff: "Medium"},
    {title: "Financial Analyst", q: "What is working capital management?", keywords: "working capital, current assets, liabilities, liquidity, operations", diff: "Medium"},
    {title: "Financial Analyst", q: "How do you stay updated with financial regulations?", keywords: "regulations, compliance, updates, research, standards, learning", diff: "Easy"},
    
    // # Product Manager (10 qs)
    {title: "Product Manager", q: "How do you prioritize product features?", keywords: "prioritization, roadmap, value, impact, resources, framework", diff: "Medium"},
    {title: "Product Manager", q: "Explain the product development lifecycle", keywords: "lifecycle, ideation, development, launch, iteration, feedback", diff: "Medium"},
    {title: "Product Manager", q: "How do you gather and analyze user feedback?", keywords: "feedback, user research, surveys, interviews, data, insights", diff: "Medium"},
    {title: "Product Manager", q: "What is a product roadmap and how do you create one?", keywords: "roadmap, strategy, timeline, features, stakeholder, vision", diff: "Medium"},
    {title: "Product Manager", q: "How do you define product success metrics?", keywords: "metrics, KPI, success, measurement, goals, analytics", diff: "Medium"},
    {title: "Product Manager", q: "Explain the concept of MVP", keywords: "MVP, minimum viable product, testing, iteration, validation", diff: "Easy"},
    {title: "Product Manager", q: "How do you work with engineering and design teams?", keywords: "collaboration, communication, cross-functional, alignment, agile", diff: "Medium"},
    {title: "Product Manager", q: "What frameworks do you use for product management?", keywords: "framework, OKR, RICE, Kano, prioritization, strategy", diff: "Hard"},
    {title: "Product Manager", q: "How do you handle competing stakeholder demands?", keywords: "stakeholder, negotiation, trade-offs, communication, alignment", diff: "Hard"},
    {title: "Product Manager", q: "Describe a product you launched and its impact", keywords: "launch, product, impact, metrics, success, learnings", diff: "Medium"},
    
    // # SEO Specialist (10 qs)
    {title: "SEO Specialist", q: "What is on-page SEO?", keywords: "on-page, SEO, meta tags, content, keywords, optimization", diff: "Easy"},
    {title: "SEO Specialist", q: "Explain off-page SEO strategies", keywords: "off-page, backlinks, link building, authority, domain, social", diff: "Medium"},
    {title: "SEO Specialist", q: "How do you conduct an SEO audit?", keywords: "audit, technical, content, analysis, tools, recommendations", diff: "Medium"},
    {title: "SEO Specialist", q: "What are Google algorithm updates and how do you adapt?", keywords: "algorithm, updates, Penguin, Panda, adapt, best practices", diff: "Medium"},
    {title: "SEO Specialist", q: "How do you perform keyword research?", keywords: "keyword, research, volume, competition, intent, tools", diff: "Easy"},
    {title: "SEO Specialist", q: "What is technical SEO?", keywords: "technical, site speed, crawling, indexing, schema, structure", diff: "Hard"},
    {title: "SEO Specialist", q: "How do you measure SEO success?", keywords: "metrics, traffic, ranking, conversion, analytics, ROI", diff: "Medium"},
    {title: "SEO Specialist", q: "What tools do you use for SEO?", keywords: "tools, Google Analytics, Search Console, Ahrefs, SEMrush", diff: "Easy"},
    {title: "SEO Specialist", q: "Explain the importance of mobile SEO", keywords: "mobile, responsive, mobile-first, indexing, user experience", diff: "Medium"},
    {title: "SEO Specialist", q: "How do you optimize content for voice search?", keywords: "voice search, conversational, featured snippets, qs, natural", diff: "Hard"},
    
    // # Social Media Manager (10 qs)
    {title: "Social Media Manager", q: "What social media platforms do you specialize in?", keywords: "platforms, Facebook, Instagram, Twitter, LinkedIn, TikTok", diff: "Easy"},
    {title: "Social Media Manager", q: "How do you create a social media strategy?", keywords: "strategy, goals, audience, content, calendar, metrics", diff: "Medium"},
    {title: "Social Media Manager", q: "How do you handle negative comments or a social media crisis?", keywords: "crisis, response, professional, empathy, resolution, reputation", diff: "Medium"},
    {title: "Social Media Manager", q: "What metrics do you track for social media success?", keywords: "metrics, engagement, reach, impressions, conversion, ROI", diff: "Medium"},
    {title: "Social Media Manager", q: "How do you increase social media engagement?", keywords: "engagement, content, community, interaction, timing, hashtags", diff: "Easy"},
    {title: "Social Media Manager", q: "What tools do you use for social media management?", keywords: "tools, Hootsuite, Buffer, Sprout Social, scheduling, analytics", diff: "Easy"},
    {title: "Social Media Manager", q: "How do you stay updated with social media trends?", keywords: "trends, research, platforms, learning, experimentation, industry", diff: "Easy"},
    {title: "Social Media Manager", q: "Explain the concept of social listening", keywords: "social listening, monitoring, sentiment, brand, feedback, insights", diff: "Medium"},
    {title: "Social Media Manager", q: "How do you create engaging visual content?", keywords: "visual, content, design, video, images, storytelling, Canva", diff: "Easy"},
    {title: "Social Media Manager", q: "Describe a successful social media campaign you managed", keywords: "campaign, strategy, results, engagement, metrics, success", diff: "Medium"},
    
    // # Blockchain Developer (10 qs)
    {title: "Blockchain Developer", q: "Explain how blockchain technology works", keywords: "blockchain, distributed, ledger, blocks, consensus, immutable", diff: "Medium"},
    {title: "Blockchain Developer", q: "What is a smart contract?", keywords: "smart contract, Ethereum, Solidity, automated, decentralized, code", diff: "Medium"},
    {title: "Blockchain Developer", q: "What consensus mechanisms are you familiar with?", keywords: "consensus, proof of work, proof of stake, Byzantine, validation", diff: "Hard"},
    {title: "Blockchain Developer", q: "How do you ensure security in blockchain applications?", keywords: "security, cryptography, auditing, vulnerabilities, best practices", diff: "Hard"},
    {title: "Blockchain Developer", q: "What is the difference between public and private blockchains?", keywords: "public, private, permissionless, permissioned, access, use case", diff: "Medium"},
    {title: "Blockchain Developer", q: "Explain cryptocurrency and tokens", keywords: "cryptocurrency, tokens, Bitcoin, Ethereum, ERC-20, utility", diff: "Easy"},
    {title: "Blockchain Developer", q: "What development tools do you use?", keywords: "tools, Truffle, Hardhat, Remix, Web3, development", diff: "Easy"},
    {title: "Blockchain Developer", q: "How do you handle scalability in blockchain?", keywords: "scalability, layer 2, sharding, throughput, performance", diff: "Hard"},
    {title: "Blockchain Developer", q: "What are NFTs and how do they work?", keywords: "NFT, non-fungible, token, unique, digital, ownership", diff: "Medium"},
    {title: "Blockchain Developer", q: "Describe a blockchain project you worked on", keywords: "project, implementation, challenges, technology, outcome, experience", diff: "Medium"},
    
    // # Customer Support Executive (10 qs)
    {title: "Customer Support Executive", q: "How do you handle difficult customers?", keywords: "difficult, patience, empathy, resolution, professional, calm", diff: "Medium"},
    {title: "Customer Support Executive", q: "What is your approach to resolving customer complaints?", keywords: "complaint, listen, understand, solution, follow-up, satisfaction", diff: "Easy"},
    {title: "Customer Support Executive", q: "How do you prioritize multiple customer requests?", keywords: "prioritization, urgency, impact, organization, time management", diff: "Medium"},
    {title: "Customer Support Executive", q: "What customer support tools have you used?", keywords: "tools, Zendesk, Freshdesk, CRM, ticketing, helpdesk", diff: "Easy"},
    {title: "Customer Support Executive", q: "How do you measure customer satisfaction?", keywords: "satisfaction, CSAT, NPS, feedback, surveys, metrics", diff: "Medium"},
    {title: "Customer Support Executive", q: "Describe a time when you exceeded customer expectations", keywords: "exceed, exceptional, service, satisfaction, example, impact", diff: "Easy"},
    {title: "Customer Support Executive", q: "How do you stay calm under pressure?", keywords: "pressure, composure, stress management, focus, techniques", diff: "Easy"},
    {title: "Customer Support Executive", q: "What is your communication style with customers?", keywords: "communication, clear, friendly, professional, empathy, listening", diff: "Easy"},
    {title: "Customer Support Executive", q: "How do you handle escalations?", keywords: "escalation, procedure, supervisor, resolution, documentation", diff: "Medium"},
    {title: "Customer Support Executive", q: "Why is customer retention important?", keywords: "retention, loyalty, lifetime value, satisfaction, business, growth", diff: "Easy"},
    
    // # Operations Manager (10 qs)
    {title: "Operations Manager", q: "How do you improve operational efficiency?", keywords: "efficiency, process, optimization, lean, continuous improvement", diff: "Medium"},
    {title: "Operations Manager", q: "What is your experience with supply chain management?", keywords: "supply chain, logistics, inventory, procurement, vendors", diff: "Medium"},
    {title: "Operations Manager", q: "How do you manage operational budgets?", keywords: "budget, cost control, forecasting, variance, resources", diff: "Medium"},
    {title: "Operations Manager", q: "Explain Six Sigma or Lean methodologies", keywords: "Six Sigma, Lean, DMAIC, waste, quality, improvement", diff: "Hard"},
    {title: "Operations Manager", q: "How do you handle operational crises?", keywords: "crisis, contingency, decision-making, communication, resolution", diff: "Hard"},
    {title: "Operations Manager", q: "What KPIs do you track for operations?", keywords: "KPI, metrics, performance, efficiency, productivity, quality", diff: "Medium"},
    {title: "Operations Manager", q: "How do you manage and motivate your team?", keywords: "leadership, motivation, team, communication, development, culture", diff: "Easy"},
    {title: "Operations Manager", q: "What tools do you use for operations management?", keywords: "tools, ERP, project management, analytics, automation", diff: "Easy"},
    {title: "Operations Manager", q: "How do you ensure quality control?", keywords: "quality, control, standards, inspection, testing, compliance", diff: "Medium"},
    {title: "Operations Manager", q: "Describe a process improvement initiative you led", keywords: "improvement, initiative, process, results, implementation, impact", diff: "Medium"},
    
    // # E-commerce Manager (10 qs)
    {title: "E-commerce Manager", q: "What e-commerce platforms have you worked with?", keywords: "platform, Shopify, WooCommerce, Magento, Amazon, e-commerce", diff: "Easy"},
    {title: "E-commerce Manager", q: "How do you optimize conversion rates?", keywords: "conversion, optimization, CRO, testing, UX, funnel", diff: "Medium"},
    {title: "E-commerce Manager", q: "Explain your approach to inventory management", keywords: "inventory, stock, management, forecasting, SKU, supply", diff: "Medium"},
    {title: "E-commerce Manager", q: "How do you handle customer acquisition and retention?", keywords: "acquisition, retention, marketing, loyalty, CAC, LTV", diff: "Medium"},
    {title: "E-commerce Manager", q: "What metrics do you track for e-commerce success?", keywords: "metrics, revenue, conversion, AOV, cart abandonment, ROI", diff: "Medium"},
    {title: "E-commerce Manager", q: "How do you improve user experience on e-commerce sites?", keywords: "UX, navigation, checkout, mobile, speed, personalization", diff: "Medium"},
    {title: "E-commerce Manager", q: "What is your strategy for product listings and descriptions?", keywords: "product, listing, SEO, description, images, optimization", diff: "Easy"},
    {title: "E-commerce Manager", q: "How do you manage payment gateways and security?", keywords: "payment, gateway, security, PCI, fraud, encryption", diff: "Medium"},
    {title: "E-commerce Manager", q: "Explain your email marketing strategy for e-commerce", keywords: "email, marketing, automation, segmentation, campaigns, retention", diff: "Medium"},
    {title: "E-commerce Manager", q: "How do you analyze and use customer data?", keywords: "data, analytics, customer behavior, insights, personalization", diff: "Hard"},
    
    // AI Researcher (10 questions)
    {title: "AI Researcher", q: "What areas of AI research are you most interested in?", keywords: "research, NLP, computer vision, reinforcement learning, GANs", dif: "Easy"},
    {title: "AI Researcher", q: "Explain your experience with neural network architectures", keywords: "neural networks, CNN, RNN, transformer, architecture, deep learning", dif: "Hard"},
    {title: "AI Researcher", q: "How do you approach a new research problem?", keywords: "research, literature review, hypothesis, experimentation, methodology", dif: "Medium"},
    {title: "AI Researcher", q: "What machine learning frameworks do you use?", keywords: "TensorFlow, PyTorch, frameworks, implementation, experimentation", dif: "Easy"},
    {title: "AI Researcher", q: "How do you evaluate research results?", keywords: "evaluation, metrics, benchmarks, statistical significance, validation", dif: "Hard"},
    {title: "AI Researcher", q: "Explain the concept of few-shot learning", keywords: "few-shot, learning, meta-learning, limited data, generalization", dif: "Hard"},
    {title: "AI Researcher", q: "What are the ethical considerations in AI research?", keywords: "ethics, bias, fairness, privacy, accountability, responsible AI", dif: "Medium"},
    {title: "AI Researcher", q: "How do you stay current with AI research developments?", keywords: "papers, conferences, arXiv, collaboration, reading, community", dif: "Easy"},
    {title: "AI Researcher", q: "Describe a research paper you recently published or read", keywords: "research, paper, methodology, results, contribution, insights", dif: "Medium"},
    {title: "AI Researcher", q: "What is the future direction of AI research?", keywords: "future, AGI, interpretability, efficiency, multimodal, trends", dif: "Hard"},
    
    // Copywriter (10 questions)
    {title: "Copywriter", q: "What is your copywriting process?", keywords: "process, research, brief, drafting, revision, testing", dif: "Easy"},
    {title: "Copywriter", q: "How do you write persuasive copy?", keywords: "persuasive, benefits, emotional, call-to-action, urgency, value", dif: "Medium"},
    {title: "Copywriter", q: "Explain the difference between B2B and B2C copywriting", keywords: "B2B, B2C, tone, audience, decision-making, messaging", dif: "Medium"},
    {title: "Copywriter", q: "How do you write compelling headlines?", keywords: "headline, attention, curiosity, benefit, clarity, testing", dif: "Easy"},
    {title: "Copywriter", q: "What is direct response copywriting?", keywords: "direct response, action, conversion, measurable, sales, urgency", dif: "Medium"},
    {title: "Copywriter", q: "How do you adapt copy for different channels?", keywords: "channels, adaptation, email, social, web, format, audience", dif: "Medium"},
    {title: "Copywriter", q: "What copywriting frameworks do you use?", keywords: "framework, AIDA, PAS, FAB, structure, formula", dif: "Medium"},
    {title: "Copywriter", q: "How do you incorporate SEO into copywriting?", keywords: "SEO, keywords, natural, readability, optimization, search", dif: "Medium"},
    {title: "Copywriter", q: "Describe a successful copy campaign you created", keywords: "campaign, copy, results, strategy, conversion, success", dif: "Easy"},
    {title: "Copywriter", q: "How do you test and optimize copy performance?", keywords: "testing, A/B, optimization, metrics, iteration, improvement", dif: "Medium"},
];

  const jobRoles = [...new Set(fullDataset.map(q => q.title))].sort();

  const languages = {
  // 🌍 English Accents
  'en-US': { name: '🇺🇸 English (US)', code: 'en-US' },
  'en-GB': { name: '🇬🇧 English (UK)', code: 'en-GB' },
  'en-AU': { name: '🇦🇺 English (Australia)', code: 'en-AU' },
  'en-IN': { name: '🇮🇳 English (India)', code: 'en-IN' },
  'en-CA': { name: '🇨🇦 English (Canada)', code: 'en-CA' },
  'en-ZA': { name: '🇿🇦 English (South Africa)', code: 'en-ZA' },

  // 🌎 Other Major Languages
  'es-ES': { name: '🇪🇸 Spanish', code: 'es-ES' },
  'fr-FR': { name: '🇫🇷 French', code: 'fr-FR' },
  'de-DE': { name: '🇩🇪 German', code: 'de-DE' },
  'it-IT': { name: '🇮🇹 Italian', code: 'it-IT' },
  'ja-JP': { name: '🇯🇵 Japanese', code: 'ja-JP' },
  'ko-KR': { name: '🇰🇷 Korean', code: 'ko-KR' },

  // 🇮🇳 Hindi Variants
  'en-IN-hindi-accent': { name: '🇮🇳 English (Hindi Accent)', code: 'en-IN' } // English words with Indian tone
};

  const personalities = {
    'professional': { name: 'Professional', rate: 0.9, pitch: 0.8, color: 'from-blue-500 to-blue-600' },
    'friendly': { name: 'Friendly', rate: 1.0, pitch: 1.1, color: 'from-green-500 to-green-600' },
    'energetic': { name: 'Energetic', rate: 1.2, pitch: 1.3, color: 'from-orange-500 to-orange-600' },
    'calm': { name: 'Calm', rate: 0.8, pitch: 0.9, color: 'from-purple-500 to-purple-600' }
  };

  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechRef.current = window.speechSynthesis;
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; // Keep listening even during pauses
      recognitionRef.current.interimResults = true; // Get interim results while speaking
    }

    return () => {
      if (speechRef.current) speechRef.current.cancel();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  useEffect(() => {
    if (stage === 'interview' && timer < 900) {
      const interval = setInterval(() => setTimer(t => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [stage, timer]);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  // Load API settings from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('geminiApiKey');
    const savedModel = localStorage.getItem('geminiModel');
    if (savedApiKey) setGeminiApiKey(savedApiKey);
    if (savedModel) setGeminiModel(savedModel);
  }, []);

  // Save API settings to localStorage (with validation)
  const saveApiSettings = async () => {
    if (!geminiApiKey) {
      setNotification({
        type: 'error',
        message: '❌ Please enter an API key first'
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    // Test the connection first before saving
    setTestingConnection(true);
    try {
      const res = await fetch("http://localhost:4000/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: "Test",
          difficulty: "Easy",
          numQuestions: 1,
          language: "English",
          apiKey: geminiApiKey,
          modelName: geminiModel
        }),
      });

      const data = await res.json();

      if (data.questions && data.questions.length > 0) {
        // Success - save the settings
        localStorage.setItem('geminiApiKey', geminiApiKey);
        localStorage.setItem('geminiModel', geminiModel);
        setNotification({
          type: 'success',
          message: '✓ API settings validated and saved successfully!'
        });
        setTimeout(() => setNotification(null), 3000);
        setShowSettings(false);
      } else {
        // Failed validation
        const errorMsg = data.error || 'Invalid API key or model. Please check your settings.';
        setNotification({
          type: 'error',
          message: `❌ ${errorMsg}`
        });
        setTimeout(() => setNotification(null), 5000);
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: '❌ Could not validate settings. Make sure the backend server is running.'
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setTestingConnection(false);
    }
  };

  // List available models
  const listAvailableModels = async () => {
    if (!geminiApiKey) {
      setNotification({
        type: 'error',
        message: '❌ Please enter an API key first'
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setLoadingModels(true);
    try {
      const res = await fetch("http://localhost:4000/api/list-models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: geminiApiKey }),
      });

      const data = await res.json();

      if (data.models && data.models.length > 0) {
        setAvailableModels(data.models);
        setNotification({
          type: 'success',
          message: `✓ Found ${data.models.length} available model(s)!`
        });
        setTimeout(() => setNotification(null), 3000);
      } else if (data.error) {
        setNotification({
          type: 'error',
          message: `❌ ${data.error}`
        });
        setTimeout(() => setNotification(null), 5000);
      } else {
        setNotification({
          type: 'error',
          message: '❌ No models found for this API key'
        });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: '❌ Could not reach backend server'
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setLoadingModels(false);
    }
  };

  // Test API connection
  const testConnection = async () => {
    if (!geminiApiKey) {
      setNotification({
        type: 'error',
        message: '❌ Please enter an API key first'
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setTestingConnection(true);
    try {
      const res = await fetch("http://localhost:4000/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: "Test",
          difficulty: "Easy",
          numQuestions: 1,
          language: "English",
          apiKey: geminiApiKey,
          modelName: geminiModel
        }),
      });

      const data = await res.json();

      if (data.questions && data.questions.length > 0) {
        setNotification({
          type: 'success',
          message: `✓ Connection successful! Model "${geminiModel}" is working.`
        });
      } else if (data.error) {
        setNotification({
          type: 'error',
          message: `❌ ${data.error}`
        });
      } else {
        setNotification({
          type: 'error',
          message: '❌ Connection failed. Check your API key and model name.'
        });
      }
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      setNotification({
        type: 'error',
        message: '❌ Could not reach backend server'
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setTestingConnection(false);
    }
  };

  const speak = (text) => {
    if (!voiceEnabled || !speechRef.current) return;
    speechRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Safety check for language
    const langConfig = languages[language] || languages['en-US'];
    const personalityConfig = personalities[personality] || personalities['friendly'];

    utterance.lang = langConfig.code;
    utterance.rate = personalityConfig.rate;
    utterance.pitch = personalityConfig.pitch;
    utterance.volume = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    speechRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (speechRef.current) {
      speechRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      alert('🎤 Speech recognition not supported. Please type your response.');
      return;
    }

    recognitionRef.current.lang = languages[language].code;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setUserInput('');
    };

    recognitionRef.current.onresult = (event) => {
      // Accumulate all final results
      let finalTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        }
      }

      // Update input with accumulated transcript
      if (finalTranscript) {
        setUserInput(prev => (prev + ' ' + finalTranscript).trim());
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      alert('🎤 Could not recognize speech. Please try typing instead.');
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

const [loadingHF, setLoadingHF] = useState(false);
const [aiQuestions, setAiQuestions] = useState([]);

// ------------------- CV Upload Handler -------------------
  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingCV(true);
    setUploadedCV(file);

    try {
      // For text files, read directly
      if (file.type === 'text/plain') {
        const text = await file.text();
        setCvText(text);
        setNotification({
          type: 'success',
          message: `✓ CV uploaded successfully: ${file.name}`
        });
        setTimeout(() => setNotification(null), 3000);
      } else {
        // For PDF/DOCX, send to backend for parsing
        const formData = new FormData();
        formData.append('cv', file);

        const res = await fetch("http://localhost:4000/api/parse-cv", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.text) {
          setCvText(data.text);
          setNotification({
            type: 'success',
            message: `✓ CV parsed successfully: ${file.name}`
          });
          setTimeout(() => setNotification(null), 3000);
        } else {
          throw new Error('Failed to parse CV');
        }
      }
    } catch (error) {
      console.error("Error uploading CV:", error);
      setNotification({
        type: 'error',
        message: '❌ Failed to upload CV. Please try again or use a .txt file.'
      });
      setTimeout(() => setNotification(null), 4000);
      setUploadedCV(null);
      setCvText('');
    } finally {
      setUploadingCV(false);
    }
  };

  const removeCVUpload = () => {
    setUploadedCV(null);
    setCvText('');
    setNotification({
      type: 'success',
      message: '✓ CV removed'
    });
    setTimeout(() => setNotification(null), 2000);
  };

// ------------------- Gemini Fetch -------------------
  const fetchFromGemini = async () => {
    setLoadingHF(true);
    try {
      const res = await fetch("http://localhost:4000/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle,
          difficulty,
          numQuestions,
          language,
          apiKey: geminiApiKey,
          modelName: geminiModel,
          cvText: cvText || null
        }),
      });

      const data = await res.json();
      const questions = data.questions || [];
      setAiQuestions(questions);

      // Check if all API keys failed
      if (data.allKeysFailed) {
        setNotification({
          type: 'error',
          message: `⚠️ All API keys failed. Will use local question dataset instead.`
        });
        setTimeout(() => setNotification(null), 5000);
      } else if (questions.length > 0) {
        const keyInfo = data.usedKey ? ` (Key ${data.usedKey})` : '';
        setNotification({
          type: 'success',
          message: `✓ Successfully generated ${questions.length} AI question${questions.length > 1 ? 's' : ''} from Gemini${keyInfo}!`
        });
        setTimeout(() => setNotification(null), 4000);
      } else {
        setNotification({
          type: 'error',
          message: '⚠️ Gemini returned no questions. Will use local dataset.'
        });
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (error) {
      console.error("Error reaching backend:", error);
      setNotification({
        type: 'error',
        message: '❌ Could not reach AI backend. Make sure the server is running on port 4000.'
      });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setLoadingHF(false);
    }
  };
const startInterview = async () => {
  try {
    setStage("loading");

    let questions = [];

    // Check if user already generated questions via "Use Gemini" button
    if (aiQuestions.length > 0) {
      console.log("✅ Using pre-generated Gemini questions");
      questions = aiQuestions;
    } else {
      // Otherwise, fetch new questions from Gemini
      console.log("🔄 Fetching new questions from Gemini...");
      const res = await fetch("http://localhost:4000/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle,
          difficulty,
          numQuestions,
          language,
          apiKey: geminiApiKey,
          modelName: geminiModel,
          cvText: cvText || null
        }),
      });

      const data = await res.json();
      questions = data.questions || [];
    }

    // Fallback to local questions if Gemini fails
    let finalQuestions = [];
    if (!questions.length) {
      alert("⚠️ AI service unavailable — using fallback local questions.");
      let filtered = fullDataset.filter(q => q.title === jobTitle);
      if (difficulty !== "All") {
        filtered = filtered.filter(q => q.diff === difficulty);
      }
      finalQuestions = filtered.slice(0, numQuestions);
    } else {
      // Format Gemini questions to match expected structure
      finalQuestions = questions.map(q => ({
        title: jobTitle,
        q: q.q,
        keywords: q.keywords || '',
        diff: q.diff || difficulty
      }));
    }

    setSelectedQuestions(finalQuestions);

    // Get first question
    const firstQuestion = finalQuestions.length > 0 ? finalQuestions[0] : null;
    const firstQuestionText = firstQuestion ? firstQuestion.q : "No questions available";

    const greeting = `Hello ${candidateName}! Thank you for applying for the ${jobTitle} position. Let's begin your interview.`;
    const firstQuestionPrompt = `Question 1: ${firstQuestionText}`;

    setConversation([
      { role: "assistant", content: greeting, time: new Date() },
      { role: "assistant", content: firstQuestionPrompt, time: new Date() }
    ]);
    setStage("interview");
    setTimer(0);
    setCurrentQuestion(1); // Set to 1 since we're already asking the first question

    // Speak greeting and first question
    setTimeout(() => {
      speak(greeting);
      setTimeout(() => speak(firstQuestionPrompt), 3000);
    }, 500);
  } catch (error) {
    console.error("❌ Error starting interview:", error);
    alert("Could not reach AI backend. Please make sure the server is running on port 4000.");
  }
};
  // Text-to-speech function for AI questions
  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // you can change to 'en-GB' or 'en-IN' for accent
    utterance.rate = 1;
    utterance.pitch = 1;
    setIsSpeaking(true);

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

const handleUserResponse = () => {
  if (!userInput.trim()) return;
  stopSpeaking();
  const newConv = [...conversation, { role: "user", content: userInput, time: new Date() }];
  setConversation(newConv);

  setTimeout(() => {
    let response = "";

    // 🧠 Safety checks to avoid "undefined.q"
    const hasQuestions = Array.isArray(selectedQuestions) && selectedQuestions.length > 0;

    if (!hasQuestions) {
      response = "⚠️ No valid questions available. Please try regenerating using Gemini.";
    } else if (currentQuestion < numQuestions) {
      // Ask next question (currentQuestion is already the index of the next question to ask)
      const nextQuestion = hasQuestions ? selectedQuestions[currentQuestion] : null;
      const questionNumber = currentQuestion + 1; // Display number (1-indexed)
      response = `Thank you. Question ${questionNumber}: ${nextQuestion?.q || "Question not found."}`;
      setCurrentQuestion(prev => prev + 1);
    } else {
      // All questions answered
      response = "Thank you for all your answers. Let me prepare your evaluation report.";
      setTimeout(() => generateReport(newConv), 3000);
    }

    setConversation(prev => [...prev, { role: "assistant", content: response, time: new Date() }]);
    speak(response);
  }, 1000);

  setUserInput("");
};
  const generateReport = (conv) => {
    const userResponses = conv.filter(m => m.role === 'user').slice(1);
    let techScore = 0, commScore = 0, expScore = 0, fitScore = 0, enthScore = 0;

    userResponses.forEach((resp, idx) => {
      const text = resp.content.toLowerCase();
      const q = selectedQuestions[idx];
      if (q && q.keywords) {
        // Split comma-separated keywords into array
        const keywordArray = q.keywords.split(',').map(kw => kw.trim().toLowerCase());
        const matched = keywordArray.filter(kw => text.includes(kw)).length;
        techScore += (matched / keywordArray.length) * 100;
      }
      const wordCount = text.split(' ').length;
      commScore += Math.min(100, (wordCount / 50) * 100);
      const expWords = ['year', 'project', 'built', 'developed', 'experience', 'worked'];
      expScore += expWords.filter(w => text.includes(w)).length * 20;
      const posWords = ['enjoy', 'love', 'passionate', 'team', 'learning', 'growth'];
      fitScore += posWords.filter(w => text.includes(w)).length * 20;
      enthScore += (text.includes('!') || wordCount > 100) ? 20 : 10;
    });

    const avgTech = techScore / userResponses.length || 0;
    const avgComm = Math.min(100, commScore / userResponses.length || 0);
    const avgExp = Math.min(100, expScore / userResponses.length || 0);
    const avgFit = Math.min(100, fitScore / userResponses.length || 0);
    const avgEnth = Math.min(100, enthScore / userResponses.length || 0);
    const overall = (avgTech * 0.35 + avgComm * 0.25 + avgExp * 0.20 + avgFit * 0.15 + avgEnth * 0.05);

    let recommendation = 'Strong Hire';
    if (overall < 40) recommendation = 'Not Recommended';
    else if (overall < 60) recommendation = 'Maybe - Need More Assessment';
    else if (overall < 75) recommendation = 'Good Candidate';

    const scores = {
      'Technical Accuracy': Math.round(avgTech),
      'Communication': Math.round(avgComm),
      'Experience': Math.round(avgExp),
      'Cultural Fit': Math.round(avgFit),
      'Enthusiasm': Math.round(avgEnth)
    };

    const strengths = Object.keys(scores).filter(k => scores[k] >= 70);
    const improvements = Object.keys(scores).filter(k => scores[k] < 50);

    const newReport = {
      overall: Math.round(overall),
      recommendation,
      scores,
      strengths: strengths.length ? strengths : ['Needs assessment'],
      improvements: improvements.length ? improvements : ['No major concerns'],
      duration: Math.round(timer / 60),
      conversation: conv,
      questions: selectedQuestions
    };

    setReport(newReport);
    setStage('report');
    const reportSummary = `Interview complete. Your overall score is ${newReport.overall} percent. ${newReport.recommendation}.`;
    setTimeout(() => speak(reportSummary), 1000);
  };

  const downloadReport = () => {
    const reportData = {
      candidate: candidateName,
      position: jobTitle,
      date: new Date().toISOString(),
      ...report
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview_report_${candidateName.replace(' ', '_')}_${Date.now()}.json`;
    a.click();
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const ScoreCircle = ({ score, label, icon: Icon, color }) => (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="transform -rotate-90 w-24 h-24">
          <circle cx="48" cy="48" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
          <circle
            cx="48" cy="48" r="40"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 40}`}
            strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-800">{score}</span>
        </div>
      </div>
      <Icon className="w-5 h-5 mt-2 text-gray-600" />
      <p className="text-sm text-gray-600 mt-1 text-center">{label}</p>
    </div>
  );

  if (stage === 'config') {
    const roleQuestionCount = fullDataset.filter(q => q.title === jobTitle).length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
        {/* Toast Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 max-w-md animate-slideIn ${
            notification.type === 'success'
              ? 'bg-green-500'
              : 'bg-red-500'
          } text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
              {/* Close Button */}
              <button
                onClick={() => setShowSettings(false)}
                className="absolute top-3 right-3 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                API Settings
              </h2>

              <div className="space-y-4">
                {/* API Key Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Key className="inline w-4 h-4 mr-2" />
                    Gemini API Key
                  </label>
                  <input
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder="Enter your API key"
                    className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">
                    Get key from{' '}
                    <a
                      href="https://makersuite.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline"
                    >
                      Google AI Studio
                    </a>
                  </p>
                </div>

                {/* Model Selector */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Brain className="inline w-4 h-4 mr-2" />
                    Model
                  </label>
                  <input
                    type="text"
                    value={geminiModel}
                    onChange={(e) => setGeminiModel(e.target.value)}
                    placeholder="e.g., gemini-1.5-pro"
                    className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">
                    Currently selected: <span className="font-mono font-semibold text-purple-600">{geminiModel}</span>
                  </p>
                </div>

                {/* Show Available Models Button */}
                <div>
                  <button
                    onClick={listAvailableModels}
                    disabled={!geminiApiKey || loadingModels}
                    className="w-full px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:scale-[1.02] transition-all shadow-md disabled:opacity-50 disabled:hover:scale-100 text-sm"
                  >
                    {loadingModels ? 'Loading...' : '🔍 Show Available Models'}
                  </button>
                </div>

                {/* Available Models Display */}
                {availableModels.length > 0 && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3">
                    <h3 className="font-bold text-sm text-purple-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Available ({availableModels.length})
                    </h3>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {availableModels.map((model, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-2 rounded cursor-pointer hover:bg-purple-50 transition-colors"
                          onClick={() => setGeminiModel(model.name)}
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-mono text-xs font-semibold text-purple-900 truncate">{model.name}</p>
                            {geminiModel === model.name && (
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 ml-2" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      💡 Click to select
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={testConnection}
                    disabled={testingConnection || !geminiApiKey}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:scale-[1.02] transition-all shadow-md disabled:opacity-50 disabled:hover:scale-100 text-sm"
                  >
                    {testingConnection ? 'Testing...' : 'Test'}
                  </button>
                  <button
                    onClick={saveApiSettings}
                    disabled={!geminiApiKey || testingConnection}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:scale-[1.02] transition-all shadow-md disabled:opacity-50 disabled:hover:scale-100 text-sm"
                  >
                    {testingConnection ? 'Validating...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-5xl mx-auto">
          <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 mb-6 relative">
            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(true)}
              className="absolute top-4 right-4 p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:scale-110 transition-all shadow-lg"
              title="API Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full mb-4">
                <h1 className="text-4xl font-bold">🎙️ AI Voice Agent - HeirBot360</h1>
              </div>
              <p className="text-gray-700 text-lg">Professional AI-powered interview platform</p>
              <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full flex items-center space-x-2 shadow-md">
                  <Volume2 className="w-5 h-5" />
                  <span className="font-semibold">Voice Enabled</span>
                </div>
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full flex items-center space-x-2 shadow-md">
                  <Database className="w-5 h-5" />
                  <span className="font-semibold">{jobRoles.length} Job Roles</span>
                </div>
                <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full flex items-center space-x-2 shadow-md">
                  <Brain className="w-5 h-5" />
                  <span className="font-semibold">AI-Powered Scoring</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <User className="inline w-5 h-5 mr-2 text-purple-600" />
                    Candidate Name
                  </label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Enter candidate name"
                  />
                </div>

                {/* CV Upload Section */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <Upload className="inline w-5 h-5 mr-2 text-purple-600" />
                    Upload CV (Optional)
                  </label>
                  {!uploadedCV ? (
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleCVUpload}
                        disabled={uploadingCV}
                        className="hidden"
                        id="cv-upload"
                      />
                      <label
                        htmlFor="cv-upload"
                        className={`w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all ${
                          uploadingCV ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {uploadingCV ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span>
                            <span className="text-gray-600">Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 mr-2 text-purple-600" />
                            <span className="text-gray-600">Click to upload CV (PDF, DOC, DOCX, TXT)</span>
                          </>
                        )}
                      </label>
                    </div>
                  ) : (
                    <div className="w-full px-4 py-3 border-2 border-green-300 bg-green-50 rounded-xl flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-green-600" />
                        <span className="text-green-700 font-medium">{uploadedCV.name}</span>
                      </div>
                      <button
                        onClick={removeCVUpload}
                        className="p-1 hover:bg-red-100 rounded-full transition-all"
                        title="Remove CV"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Upload your CV to get personalized interview questions based on your experience
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <Briefcase className="inline w-5 h-5 mr-2 text-purple-600" />
                    Job Title ({roleQuestionCount} questions)
                  </label>
                  <select
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    {jobRoles.map(role => {
                      const count = fullDataset.filter(q => q.title === role).length;
                      return <option key={role} value={role}>{role} ({count})</option>
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    🌍 Choose Language Accent
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(languages).map(([code, lang]) => (
                      <button
                        key={code}
                        onClick={() => setLanguage(code)}
                        className={`px-3 py-2.5 rounded-xl font-medium transition-all text-sm ${language === code
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    🎭 Voice Personality
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(personalities).map(([key, pers]) => (
                      <button
                        key={key}
                        onClick={() => setPersonality(key)}
                        className={`px-4 py-3 rounded-xl font-medium transition-all ${personality === key
                          ? `bg-gradient-to-r ${pers.color} text-white shadow-lg`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {pers.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <Target className="inline w-5 h-5 mr-2 text-purple-600" />
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="All">All Levels</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <FileText className="inline w-5 h-5 mr-2 text-purple-600" />
                    Number of Questions: {numQuestions}
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="10"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>3 (Quick)</span>
                    <span>10 (Comprehensive)</span>
                  </div>
                </div>

                {/* Interview Summary Card */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4">
                  <h3 className="font-bold text-sm text-purple-900 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Interview Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Estimated Duration:</span>
                      <span className="font-semibold text-purple-900">{numQuestions * 2}-{numQuestions * 3} min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Questions:</span>
                      <span className="font-semibold text-purple-900">{numQuestions} {difficulty !== 'All' ? difficulty : 'Mixed'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Voice:</span>
                      <span className="font-semibold text-purple-900">{voiceEnabled ? 'Enabled' : 'Disabled'}</span>
                    </div>
                    {uploadedCV && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">CV:</span>
                        <span className="font-semibold text-green-700 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Uploaded
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-4">
              {/* Primary Action - Start Interview */}
              <button
                onClick={startInterview}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Play className="w-6 h-6" />
                Start Interview
              </button>

              {/* Optional Preview Button */}
              <div className="flex items-center gap-3">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="text-xs text-gray-500 font-medium">OPTIONAL</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              <button
                onClick={fetchFromGemini}
                disabled={loadingHF}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:scale-[1.02] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Brain className="w-5 h-5" />
                {loadingHF ? "Generating Preview..." : "Preview Gemini Questions 🤖"}
              </button>
              <p className="text-xs text-center text-gray-600 -mt-2">
                Preview AI-generated questions before starting (not required)
              </p>
            </div>
            {aiQuestions.length > 0 && (
  <div className="mt-6 bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300 p-6 rounded-xl shadow-lg">
    <h3 className="font-bold mb-4 text-purple-900 text-lg flex items-center gap-2">
      <CheckCircle className="w-5 h-5 text-green-600" />
      ✅ AI Generated Questions ({aiQuestions.length})
    </h3>
    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
      {aiQuestions.map((q, i) => (
        <div key={i} className="bg-white border border-purple-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <p className="text-gray-800 font-semibold mb-2 flex items-start gap-2">
            <span className="bg-purple-600 text-white px-2 py-1 rounded text-sm flex-shrink-0">{i + 1}</span>
            <span className="flex-1">{typeof q === 'string' ? q : q.q}</span>
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {q.diff && (
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                q.diff === 'Easy' ? 'bg-green-500' :
                q.diff === 'Medium' ? 'bg-yellow-500' :
                'bg-red-500'
              } text-white`}>
                {q.diff}
              </span>
            )}
            {q.keywords && (
              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                🔑 {q.keywords}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
    <p className="mt-4 text-purple-900 text-sm italic flex items-center gap-2">
      💡 Click "Start Interview" to begin with these questions
    </p>
  </div>
)}
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'interview') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{candidateName}</h2>
                <p className="text-gray-600">{jobTitle}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 px-4 py-2 rounded-xl flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-blue-600">{formatTime(timer)}</span>
                </div>
                <div className="bg-purple-100 px-4 py-2 rounded-xl flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  <span className="font-bold text-purple-600">{currentQuestion}/{numQuestions}</span>
                </div>
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`p-3 rounded-xl transition-all ${voiceEnabled ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                >
                  {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-6 max-h-96 overflow-y-auto">
              {conversation.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-4 flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                >
                  {/* 💬 Message bubble */}
                  <div
                    className={`max-w-[80%] rounded-2xl px-6 py-4 ${msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-800 shadow-lg border-2 border-purple-100'
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {msg.role === 'user' ? (
                        <User className="w-5 h-5" />
                      ) : (
                        <Award className="w-5 h-5" />
                      )}
                      <span className="font-bold text-sm">
                        {msg.role === 'user' ? 'Candidate' : 'AI Recruiter'}
                      </span>
                    </div>
                    <p className="leading-relaxed">{msg.content}</p>
                  </div>

                  {/* 🔁 Repeat Question Button (always visible under AI messages) */}
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => speakText(msg.content)}
                      disabled={isSpeaking} // only disables when voice is playing
                      className={`mt-3 ml-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all border
      ${isSpeaking
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300'
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 border-blue-500'
                        }`}
                    >
                      🔁 Repeat Question
                    </button>
                  )}

                </div>
              ))}

              <div ref={conversationEndRef} />
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex gap-3">
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isSpeaking}
                  className={`p-4 rounded-xl font-bold transition-all shadow-lg ${isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : isSpeaking
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                    }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-6 h-6" />
                      <span className="ml-2 text-sm">Stop Recording</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-6 h-6" />
                      <span className="ml-2 text-sm">Start Recording</span>
                    </>
                  )}
                </button>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleUserResponse()}
                  placeholder={isListening ? "🎤 Listening..." : "Type your response or use the microphone..."}
                  className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  disabled={isSpeaking || isListening}
                />
                <button
                  onClick={handleUserResponse}
                  disabled={!userInput.trim() || isSpeaking || isListening}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
              {isListening && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-6 py-3 rounded-full animate-pulse">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
                    <span className="font-bold">Recording in progress...</span>
                  </div>
                </div>
              )}
              {isSpeaking && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-6 py-3 rounded-full">
                    <Volume2 className="w-5 h-5 animate-pulse" />
                    <span className="font-bold">AI Recruiter is speaking...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center mt-6 px-4">
            {/* End Interview Button - Left */}
            <button
              onClick={() => {
                stopSpeaking?.();
                setStage('report');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold shadow hover:from-red-600 hover:to-pink-700 transition-all"
            >
              🏁 End Interview
            </button>

            {/* Back Button - Right */}
            <button
              onClick={() => {
                setStage('config');
                setConversation([]);
                setCurrentQuestion(0);
                setTimer(0);
                stopSpeaking?.();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 rounded-xl font-semibold shadow hover:from-gray-300 hover:to-gray-400 transition-all"
            >
              ⬅ Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'report') {
    const getScoreColor = (score) => {
      if (score >= 80) return '#10b981';
      if (score >= 60) return '#f59e0b';
      return '#ef4444';
    };

    const getRecommendationColor = () => {
      if (report.overall >= 75) return 'from-green-500 to-green-600';
      if (report.overall >= 60) return 'from-yellow-500 to-yellow-600';
      return 'from-red-500 to-red-600';
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full mb-4">
                <h1 className="text-4xl font-bold">📊 Interview Report</h1>
              </div>
              <p className="text-gray-600 text-lg">Comprehensive Candidate Evaluation</p>
            </div>

            {/* Candidate Info */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-3 rounded-xl shadow">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Candidate</p>
                    <p className="font-bold text-gray-800">{candidateName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white p-3 rounded-xl shadow">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Position</p>
                    <p className="font-bold text-gray-800">{jobTitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white p-3 rounded-xl shadow">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-bold text-gray-800">{report.duration} minutes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Score Card */}
            <div className="mb-8">
              <div className={`bg-gradient-to-r ${getRecommendationColor()} rounded-3xl p-8 text-white text-center shadow-2xl`}>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Award className="w-16 h-16" />
                  <div>
                    <p className="text-6xl font-bold">{report.overall}%</p>
                    <p className="text-xl opacity-90">Overall Score</p>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-2xl px-6 py-4 inline-block">
                  <p className="text-2xl font-bold">{report.recommendation}</p>
                </div>
              </div>
            </div>

            {/* Category Scores - Circular Progress */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <BarChart3 className="w-7 h-7 text-purple-600" />
                Category Breakdown
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <ScoreCircle
                  score={report.scores['Technical Accuracy']}
                  label="Technical"
                  icon={Brain}
                  color="#8b5cf6"
                />
                <ScoreCircle
                  score={report.scores['Communication']}
                  label="Communication"
                  icon={MessageSquare}
                  color="#3b82f6"
                />
                <ScoreCircle
                  score={report.scores['Experience']}
                  label="Experience"
                  icon={Briefcase}
                  color="#10b981"
                />
                <ScoreCircle
                  score={report.scores['Cultural Fit']}
                  label="Cultural Fit"
                  icon={Users}
                  color="#f59e0b"
                />
                <ScoreCircle
                  score={report.scores['Enthusiasm']}
                  label="Enthusiasm"
                  icon={Zap}
                  color="#ef4444"
                />
              </div>
            </div>

            {/* Detailed Bar Charts */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Detailed Analysis</h3>
              <div className="space-y-4">
                {Object.entries(report.scores).map(([category, score]) => (
                  <div key={category} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-700">{category}</span>
                      <span className="font-bold text-xl" style={{ color: getScoreColor(score) }}>
                        {score}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${score}%`,
                          background: `linear-gradient(90deg, ${getScoreColor(score)}, ${getScoreColor(score)}dd)`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  Key Strengths
                </h3>
                <ul className="space-y-3">
                  {report.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-bold">{idx + 1}</span>
                      </div>
                      <span className="text-green-900 font-medium">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-200">
                <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-3">
                  {report.improvements.map((improvement, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-bold">{idx + 1}</span>
                      </div>
                      <span className="text-orange-900 font-medium">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={downloadReport}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Report
              </button>
              <button
                onClick={() => {
                  setStage('config');
                  setConversation([]);
                  setReport(null);
                  setTimer(0);
                  setCurrentQuestion(0);
                  stopSpeaking();
                }}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                New Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AIRecruiterDemo;