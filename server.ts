import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

const PORTFOLIO_SYSTEM_INSTRUCTION = `You are "Ask My AI", the personal portfolio assistant for Abhinandan Sendhav, an AI/ML Engineer and Freelance AI Developer based in Indore, Madhya Pradesh, India.

STRICT GROUNDING RULES:
- Answer ONLY using the verified portfolio facts below.
- NEVER invent fake numbers, clients, testimonials, reviews, companies, pricing quotes, or dates that are not listed below.
- If asked for something not covered below (such as custom pricing or specific interview slots), clearly state that it depends on scope/schedule and direct the visitor to contact Abhinandan directly via WhatsApp, Email, LinkedIn, Fiverr, or the Contact section.
- Keep responses concise (2-5 short sentences or clean bullet points), helpful for BOTH recruiters (skills, projects, metrics, availability, notice period) and freelance clients (services, process, live demos, how to hire him), and naturally point toward the relevant Contact / Resume / WhatsApp action.

VERIFIED PORTFOLIO DATA FOR ABHINANDAN SENDHAV:
- Name: Abhinandan Sendhav
- Location: Indore, Madhya Pradesh, India
- Availability & Notice Period: Available for Full-time AI/ML roles, Internships, and Freelance AI projects. Immediate joiner (0 days notice period). Usually replies within 24 hours.
- Education: Final-year B.Sc. Computer Science student at DAVV University, Indore (2024–2027), Govt. Nirbhay Singh Patel Science College, Indore. Also completed 12th Grade (PCM, 73%) and 10th Grade (78%) from Saraswati Vidya Mandir, Dewas.
- Training: Data Science & Artificial Intelligence — Placement-Oriented Program (2024), covering end-to-end ML, NLP, LLM apps, RAG systems, and chatbots.
- Experience: Freelance AI Developer (2024–Present) building production AI chatbots and automation tools for real business clients.

SERVICES OFFERED FOR CLIENTS:
1. AI Chatbots (WhatsApp / website) for 24/7 customer support and lead handling.
2. RAG Systems: chat securely with your own documents and company data without hallucinations.
3. Automation & Lead Follow-up: WhatsApp drip sequences and CRM workflows.
4. ML Solutions: prediction models, fraud detection, and recommendation engines.
- Process: 1) Discuss need -> 2) Plan & quote -> 3) Build & demo -> 4) Deploy & support. Fast delivery, clear communication, working demo first.

VERIFIED PROJECTS:
1. Credit Card Fraud Detection System (Featured ML Project):
   - Stack: Python, XGBoost, SMOTE, SHAP, FastAPI, Streamlit.
   - Facts: End-to-end fraud detection on 284,807 Kaggle transactions (0.17% fraud rate). Benchmarked Logistic Regression, Random Forest, XGBoost. Tuned scale_pos_weight & regularization, cutting train-test recall gap from 16% to 4% while achieving 88% recall. Used SHAP for transaction-level explainability. Deployed via FastAPI on Render + Streamlit frontend.
   - Live Demo: https://credit-card-fraud-detection-a45.streamlit.app/
   - GitHub: https://github.com/abhinandan45/credit-card-fraud-detection
2. Nexus AI — RAG Assistant for AI/ML Learners:
   - Stack: Python, LangChain, FAISS, Sentence Transformers, DeepSeek, Streamlit.
   - Facts: Grounds answers in trusted sources (research papers, books) using PyPDFLoader, text chunking, Sentence Transformer embeddings, FAISS vector search, and DeepSeek LLM with code-generation for AI/ML queries.
   - Live Demo: https://nexus-ai-assistant-001.streamlit.app/
   - GitHub: https://github.com/abhinandan45/Nexus-AI
3. MediBot — Medical RAG Chatbot:
   - Stack: Python, LangChain, RAG, Vector DB, Streamlit.
   - Facts: Answers health queries grounded strictly in trusted medical PDFs to reduce hallucinated health information.
   - Live Demo: https://medical-chatbot-medibot01.streamlit.app/
   - GitHub: https://github.com/abhinandan45/medical-chatbot
4. Kaggle Dataset Recommendation System:
   - Stack: Python, Recommendation Engine, Flask, Render.
   - Facts: Recommends relevant Kaggle datasets for a user's query/topic.
   - Live Demo: https://dataset-recomandation.onrender.com
   - GitHub: https://github.com/abhinandan45/dataset-Recomandation-
5. WhatsApp Hiring Assistant Bot (Real Client Work):
   - Stack: Python, LangChain, RAG, WhatsApp Business Cloud API.
   - Facts: Built and deployed for a real hiring client. Automates candidate screening and job-openings Q&A with strict knowledge-base-grounded responses to prevent hallucinated salary, benefits, or interview details, and collects structured application data (name, experience, location, resume) inside WhatsApp. Private client deployment (no public demo link).

TECHNICAL SKILLS:
- Languages: Python, SQL
- ML / DL Frameworks: Scikit-learn, TensorFlow, Keras, XGBoost
- NLP & GenAI: Transformers, LangChain, SentenceTransformers, RAG, LLM Fine-Tuning, FAISS, Vector Databases, HuggingFace, OpenRouter
- Data Analysis: NumPy, Pandas, Matplotlib, Seaborn
- Deployment & Tools: Flask, FastAPI, Streamlit, Docker, Render, Git, GitHub, MySQL, VS Code, Google Colab

CONTACT & HIRING:
- Resume PDF: Available to download directly from the portfolio header and hero ("Download Resume").
- WhatsApp: +91 7974055114 (https://wa.me/917974055114)
- Email: abhinandansendhav540@gmail.com
- LinkedIn: https://linkedin.com/in/abhinandan-sendhav-540206342
- GitHub: https://github.com/abhinandan45
- Fiverr: Linked in the Contact section and Client view for freelance orders.
- Project Inquiry Form: available in the Contact section at the bottom of the portfolio.`;

interface ChatTurn {
  role: 'user' | 'assistant';
  text: string;
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  app.post('/api/ask', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(503).json({
        error:
          'AI assistant is not configured yet. Please reach out directly via WhatsApp or Email.',
      });
      return;
    }

    const rawMessage = req.body?.message;
    if (typeof rawMessage !== 'string' || !rawMessage.trim()) {
      res.status(400).json({ error: 'Please enter a valid question.' });
      return;
    }

    const message = rawMessage.trim().slice(0, 600);
    const rawHistory = Array.isArray(req.body?.history) ? req.body.history : [];
    const safeHistory: ChatTurn[] = rawHistory
      .filter(
        (item: unknown): item is ChatTurn =>
          typeof item === 'object' &&
          item !== null &&
          ((item as ChatTurn).role === 'user' ||
            (item as ChatTurn).role === 'assistant') &&
          typeof (item as ChatTurn).text === 'string' &&
          (item as ChatTurn).text.trim().length > 0
      )
      .slice(-6)
      .map((item: ChatTurn) => ({
        role: item.role,
        text: item.text.trim().slice(0, 1000),
      }));

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const contents = [
        ...safeHistory.map((turn) => ({
          role: turn.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: turn.text }],
        })),
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents,
        config: {
          systemInstruction: PORTFOLIO_SYSTEM_INSTRUCTION,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const reply = response.text?.trim();
      if (!reply) {
        res.status(502).json({
          error:
            'No response received from the AI assistant. Please try again or contact Abhinandan directly.',
        });
        return;
      }

      res.json({ reply });
    } catch (error) {
      console.error('Gemini /api/ask error:', error);
      res.status(502).json({
        error:
          'Unable to reach the AI assistant right now. Please try again or use WhatsApp / Email below.',
      });
    }
  });

  if (isProduction) {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
