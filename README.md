  # 🚀 ResumePulse AI | Intelligent Career Co-Pilot

![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue)
![GenAI](https://img.shields.io/badge/AI-Google_Gemini-orange)

**ResumePulse AI** is an end-to-end career intelligence platform. By combining your Resume, Job Description, and Personal Bio, the system uses Generative AI to provide a 360-degree evaluation—ranging from compatibility scoring to custom interview coaching and automated resume engineering.

---

## 🔗 Live Demo
* **Frontend (Vercel):** [Add link here]
* **Backend (Render):** [Add link here]

---

## ✨ Key Features

* **3-Point Analysis:** Synchronized evaluation of Resume, Job Description, and Self-Description for maximum accuracy.
* **Match Scoring:** Instant compatibility percentage with a breakdown of "Missing Skills" you need to bridge.
* **Smart Preparation Plan:** A custom roadmap to help you upskill specifically for the target role.
* **AI Interview Coach:** Generates tailored **Technical** and **Behavioral** questions based on your unique profile.
* **AI Resume Export:** Generate and download a professionally optimized, AI-enhanced resume as a PDF using `Puppeteer`.
* **PDF Intelligence:** Deep parsing of existing documents using `pdf-parse` and `pdf2json`.

---

## 🛠️ Technical Architecture

### Frontend
- **React 19** (Vite) & **React Router 7**
- **SASS** (Professional Modular Styling)
- **Axios** (Secure API Communication)

### Backend
- **Node.js & Express 5**
- **MongoDB & Mongoose** (Cloud Database)
- **Google Gemini AI** (Analysis & Generation Engine)
- **Puppeteer** (Server-side PDF Generation)
- **Multer** (Secure File Handling)
- **Zod** (Strict Data Validation)

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* MongoDB Atlas Account
* Google Gemini API Key

### Installation

1. **Clone the Repo**
   ```bash
   git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
   cd project-2-ResumeBuilder-with-GenAI
   ```


```bash
cd Backend
npm install
# Create a .env file and add:
# PORT, MONGO_URI, JWT_SECRET, GEMINI_API_KEY
npm start
```

```bash
cd ../Frontend
npm install
npm run dev
```

## 🛡️ License
Distributed under the MIT License. See LICENSE for more information.
[MIT](LICENSE)

Developed with ❤️ by [Anas](https://github.com/JustenAnas)