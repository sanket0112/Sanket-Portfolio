const { GoogleGenerativeAI } = require('@google/generative-ai');
const { loadKnowledgeBase } = require('./knowledgeLoader');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

let genAI;
let model;
let isGeminiKeyValid = false;
let geminiAuthErrorMessage = '';

// ──────────────────────────────────────────────
// GEMINI INITIALISATION
// ──────────────────────────────────────────────
const initGemini = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') return null;

    try {
        genAI = new GoogleGenerativeAI(apiKey);
        const knowledgeContext = loadKnowledgeBase();

        const systemInstruction = `
You are Patel Sanket (ZeroKai) himself. You are speaking directly to a visitor on your portfolio website.
You are an AI/ML Engineer Student and Full-Stack Developer.

Here is your biography, educational, and professional background context:
==================================================
${knowledgeContext}
==================================================

INSTRUCTIONS:
1. Speak in the FIRST PERSON at all times. Use "I", "me", "my", "myself". Do NOT refer to yourself as "Sanket" or "he/him" in the third person.
   - CORRECT: "I am currently pursuing my Diploma in IT."
   - INCORRECT: "Sanket is currently pursuing his Diploma in IT."
2. Sound professional, friendly, helpful, and confident (but never arrogant).
3. If a user asks about details or facts that are NOT documented in the provided files, respond EXACTLY with:
   "I don't have enough information about that. Please contact Sanket directly for more details."
4. Never invent or hallucinate facts about yourself.
5. Keep responses concise and direct, unless the user asks for detail.
6. Answer casual greetings in a welcoming, helpful first-person tone.
7. Use clean Markdown formatting (bullet points, bold, links) for readability.
8. Never reveal API keys or secret environment variables.
`;

        model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction,
        });

        return model;
    } catch (error) {
        console.error('Error initializing Gemini model:', error);
        return null;
    }
};

// ──────────────────────────────────────────────
// STARTUP VERIFICATION
// ──────────────────────────────────────────────
const verifyGeminiConnection = async () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        console.log('Gemini API Key Loaded: NO');
        console.warn('\x1b[33m%s\x1b[0m', 'WARNING: GEMINI_API_KEY is missing or set to placeholder. The chatbot will fall back to local RAG.');
        isGeminiKeyValid = false;
        geminiAuthErrorMessage = 'Gemini API key is missing or set to placeholder.';
        return;
    }
    console.log('Gemini API Key Loaded: YES');

    try {
        const testGenAI = new GoogleGenerativeAI(apiKey);
        const testModel = testGenAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        await testModel.generateContent('Hello');
        console.log('✓ Gemini Connection Successful');
        isGeminiKeyValid = true;
        initGemini();
    } catch (error) {
        console.log('✗ Gemini Authentication Failed');
        console.log(`Reason: ${error.message}`);
        isGeminiKeyValid = false;
        geminiAuthErrorMessage = error.message;
    }
};

// Run asynchronously on startup without blocking the server
verifyGeminiConnection();

// ──────────────────────────────────────────────
// MAIN ENTRY POINT
// ──────────────────────────────────────────────
const generateChatResponse = async (userMessage, chatHistory = []) => {
    // ── Try Gemini first ──────────────────────
    if (isGeminiKeyValid) {
        if (!genAI || !model) {
            const reloaded = initGemini();
            if (!reloaded) {
                // Gemini init failed at runtime – fall through to local RAG
                console.warn('Gemini model reload failed; falling back to local RAG.');
                return getLocalRagResponse(userMessage);
            }
        }

        try {
            const formattedHistory = chatHistory.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }],
            }));

            const chat = model.startChat({ history: formattedHistory });
            const result = await chat.sendMessage(userMessage);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Gemini generation error:', error);

            // If the key became invalid at runtime, mark it and fall through
            const msg = error.message || '';
            if (
                msg.includes('API_KEY_INVALID') ||
                msg.includes('API key not valid') ||
                msg.includes('invalid api key')
            ) {
                console.warn('Gemini key became invalid at runtime; switching to local RAG.');
                isGeminiKeyValid = false;
            }
            // For any Gemini runtime error, gracefully fall back to local RAG
            return getLocalRagResponse(userMessage);
        }
    }

    // ── Gemini unavailable – use local RAG ────
    return getLocalRagResponse(userMessage);
};

// ──────────────────────────────────────────────
// LOCAL RAG ENGINE
// Reads every .md file in /knowledge, scores each
// section against the user's query by keyword
// overlap, then builds a first-person answer from
// the top-matching sections.
// ──────────────────────────────────────────────

/**
 * Load every .md file as separate documents with metadata.
 * Returns: Array<{ title: string, filename: string, content: string }>
 */
const loadKnowledgeDocs = () => {
    const knowledgeDir = path.join(__dirname, 'knowledge');
    if (!fs.existsSync(knowledgeDir)) return [];

    const docs = [];
    const files = fs.readdirSync(knowledgeDir).filter(f => f.endsWith('.md'));

    for (const file of files) {
        try {
            const raw = fs.readFileSync(path.join(knowledgeDir, file), 'utf8');
            const parsed = matter(raw);
            docs.push({
                filename: file.replace('.md', ''),
                title: parsed.data.title || file.replace('.md', ''),
                content: parsed.content.trim(),
            });
        } catch (e) {
            console.error(`Error reading knowledge file ${file}:`, e.message);
        }
    }
    return docs;
};

// Common English stop-words to ignore during scoring
const STOP_WORDS = new Set([
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
    'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his',
    'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'boy',
    'did', 'she', 'use', 'way', 'will', 'with', 'that', 'this', 'have',
    'from', 'they', 'been', 'more', 'when', 'what', 'your', 'said', 'each',
    'tell', 'does', 'like', 'then', 'than', 'some', 'time', 'very', 'just',
    'into', 'also', 'well', 'much', 'make', 'here', 'come', 'made', 'over',
    'such', 'give', 'most', 'know', 'take', 'good', 'live', 'need', 'only',
    'both', 'back', 'after', 'any', 'could', 'about',
]);

// Synonym map: expand query token → additional tokens to score with
const SYNONYMS = {
    certification:  ['certifications', 'certificates', 'certificate', 'certified'],
    certifications: ['certificates', 'certificate', 'certification'],
    certificate:    ['certifications', 'certificates'],
    internship:     ['intern', 'internship', 'experience'],
    intern:         ['internship', 'experience'],
    job:            ['internship', 'experience', 'work'],
    employment:     ['internship', 'experience', 'work'],
    achievement:    ['achievements', 'award', 'prize', 'won'],
    achievements:   ['achievement', 'award', 'prize'],
    award:          ['achievements', 'achievement'],
    hobby:          ['hobbies', 'interest', 'leisure', 'passion'],
    hobbies:        ['hobby', 'interest', 'passion'],
};

/**
 * Tokenise a string into meaningful lowercase words (stop-words removed).
 */
const tokenise = str => {
    const raw = str
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2 && !STOP_WORDS.has(w));

    // Expand with synonyms
    const expanded = new Set(raw);
    for (const t of raw) {
        if (SYNONYMS[t]) SYNONYMS[t].forEach(s => expanded.add(s));
    }
    return [...expanded];
};

/**
 * Compute a simple TF-overlap score between query tokens and a document's tokens.
 */
const scoreDocument = (queryTokens, doc) => {
    const docTokens = new Set(tokenise(doc.content + ' ' + doc.title));
    let hits = 0;
    for (const t of queryTokens) {
        if (docTokens.has(t)) hits++;
    }
    return hits;
};

/**
 * Keyword → file routing hints to boost scoring for clear intent matches.
 * Maps obvious keywords to the filename (without .md) they primarily live in.
 */
const ROUTING_HINTS = {
    project: 'projects',
    projects: 'projects',
    built: 'projects',
    build: 'projects',
    made: 'projects',
    portfolio: 'projects',
    'e-commerce': 'projects',
    ecommerce: 'projects',
    clone: 'projects',
    game: 'projects',

    skill: 'skills',
    skills: 'skills',
    technology: 'skills',
    technologies: 'skills',
    tech: 'skills',
    language: 'skills',
    framework: 'skills',
    stack: 'skills',
    python: 'skills',
    react: 'skills',
    node: 'skills',
    mongodb: 'skills',
    javascript: 'skills',

    intern: 'internship',
    internship: 'internship',
    experience: 'internship',
    work: 'internship',
    job: 'internship',
    ibm: 'internship',
    bharat: 'internship',

    education: 'education',
    study: 'education',
    college: 'education',
    school: 'education',
    cgpa: 'education',
    diploma: 'education',
    semester: 'education',
    grade: 'education',

    contact: 'contact',
    email: 'contact',
    phone: 'contact',
    hire: 'contact',
    linkedin: 'contact',
    reach: 'contact',
    message: 'contact',

    certification: 'certifications',
    certificate: 'certifications',
    course: 'certifications',
    udemy: 'certifications',
    coursera: 'certifications',

    achievement: 'achievements',
    award: 'achievements',
    prize: 'achievements',
    win: 'achievements',
    hackathon: 'achievements',

    hobby: 'personality',
    hobbies: 'personality',
    chess: 'personality',
    football: 'personality',
    anime: 'personality',
    coffee: 'personality',
    free: 'personality',
    interest: 'personality',

    goal: 'about',
    future: 'about',
    aim: 'about',
    dream: 'about',
    who: 'about',
    yourself: 'about',
    about: 'about',

    faq: 'faq',
    question: 'faq',
};

/**
 * Extract the most relevant paragraphs from a document.
 * Splits on double newlines and returns top N paragraphs by keyword overlap.
 */
const extractRelevantSections = (doc, queryTokens, maxSections = 4) => {
    const paragraphs = doc.content.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
    if (paragraphs.length <= maxSections) return doc.content;

    const scored = paragraphs.map(p => ({
        text: p,
        score: queryTokens.reduce((acc, t) => acc + (p.toLowerCase().includes(t) ? 1 : 0), 0),
    }));

    scored.sort((a, b) => b.score - a.score);

    // Always include the first paragraph (usually the intro/title context)
    const topParas = new Set([paragraphs[0]]);
    for (const p of scored) {
        if (topParas.size >= maxSections) break;
        topParas.add(p.text);
    }

    return [...topParas].join('\n\n');
};

/**
 * Convert raw Markdown content to a clean first-person response.
 * Preserves bullet points, bold, and headings.
 */
const buildFirstPersonAnswer = (userMessage, matchedSections) => {
    const intro = detectIntent(userMessage);

    // Remove YAML-like front matter artifacts and clean up
    const cleaned = matchedSections
        .replace(/^---[\s\S]*?---/m, '')
        .replace(/#{1,4}\s+/g, '') // strip leading # signs but keep text
        .trim();

    return `${intro}\n\n${cleaned}`;
};

// Greeting patterns – handled before RAG to avoid 0-score miss
const GREETING_PATTERN = /^\s*(hi|hello|hey|howdy|greetings|good\s+morning|good\s+afternoon|good\s+evening|sup|what'?s\s+up)\s*[!?.]*\s*$/i;

/**
 * Return true if the message is purely a greeting.
 */
const isGreeting = msg => GREETING_PATTERN.test(msg.trim());

/**
 * Generate a short, natural first-person intro based on the user's query intent.
 */
const detectIntent = (userMessage) => {
    const m = userMessage.toLowerCase();

    if (m.match(/\b(hi|hello|hey|greetings|howdy)\b/))
        return "Hey there! I'm Sanket Patel (ZeroKai), an AI/ML Engineer Student and Full-Stack Developer. Great to meet you!";
    if (m.match(/\b(project|built|made|build|portfolio|app|website|clone)\b/))
        return "Here are the projects I've built:";
    if (m.match(/\b(skill|technolog|stack|language|framework|use)\b/))
        return "Here's a look at my technical skill set:";
    if (m.match(/\b(intern|experience|ibm|bharat)\b/))
        return "Here's my professional experience:";
    if (m.match(/\b(education|study|college|cgpa|diploma|semester|grade)\b/))
        return "Here's my educational background:";
    if (m.match(/\b(contact|email|phone|hire|linkedin|reach|message)\b/))
        return "Here's how you can get in touch with me:";
    if (m.match(/\b(certif|course|udemy|coursera|nielit)\b/))
        return "Here are my certifications and completed courses:";
    if (m.match(/\b(achievement|award|prize|win|hackathon)\b/))
        return "Here are some of my achievements:";
    if (m.match(/\b(hobby|chess|football|anime|coffee|interest|free\s+time)\b/))
        return "When I'm not coding, here's what I enjoy:";
    if (m.match(/\b(goal|future|aim|dream)\b/))
        return "Looking ahead, here are my goals and aspirations:";
    if (m.match(/\b(who|yourself|introduce)\b/))
        return "Let me introduce myself:";

    return "Here's what I found that might answer your question:";
};

/**
 * Core RAG function: score all docs, pick best match(es), compose answer.
 */
const getLocalRagResponse = (userMessage) => {
    // Short-circuit for pure greetings – no need to search knowledge files
    if (isGreeting(userMessage)) {
        return [
            "Hey there! I'm **Sanket Patel** (ZeroKai) — an AI/ML Engineer Student and Full-Stack Developer based in India. 👋",
            "",
            "Feel free to ask me anything about:",
            "- 🛠️ **My projects** — MERN portfolio, e-commerce, clones, games",
            "- 💡 **My skills** — React, Node.js, Python, MongoDB, AI/ML",
            "- 🎓 **My education** — Diploma IT at GP Kheda",
            "- 💼 **My internship** — AI internship with Bharat Cares × IBM SkillsBuild",
            "- 📬 **Contact info** — email, phone, LinkedIn",
            "",
            "What would you like to know?",
        ].join('\n');
    }

    const docs = loadKnowledgeDocs();
    if (docs.length === 0) {
        return "I don't have enough information about that. Please contact Sanket directly for more details.";
    }

    const queryTokens = tokenise(userMessage);
    if (queryTokens.length === 0) {
        return "I don't have enough information about that. Please contact Sanket directly for more details.";
    }

    // Boost scores for docs that match routing hints
    const docScores = docs.map(doc => {
        let score = scoreDocument(queryTokens, doc);
        for (const token of queryTokens) {
            if (ROUTING_HINTS[token] === doc.filename) {
                score += 10; // strong boost — topic keywords always win
            }
        }
        return { doc, score };
    });

    // Sort descending
    docScores.sort((a, b) => b.score - a.score);

    const top = docScores[0];

    // If nothing remotely matched
    if (top.score === 0) {
        return "I don't have enough information about that. Please contact Sanket directly for more details.";
    }

    // Gather the best doc, plus optionally the second if it also has a good score
    const selectedDocs = [top];
    if (docScores[1] && docScores[1].score >= Math.max(2, top.score * 0.6)) {
        selectedDocs.push(docScores[1]);
    }

    // Extract the most relevant paragraphs from each selected doc
    const sections = selectedDocs
        .map(({ doc }) => extractRelevantSections(doc, queryTokens))
        .join('\n\n');

    return buildFirstPersonAnswer(userMessage, sections);
};

module.exports = { generateChatResponse };
