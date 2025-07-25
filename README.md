
<p align="center">
  <img src="https://raw.githubusercontent.com/rohitpagi33/medicamb/main/medicamb/public/vite.svg" width="120" alt="MediCamb Logo" />
</p>

<h1 align="center">MediCamb</h1>
<p align="center"><b>Intelligent Medicine Recognition & Healthcare Assistant</b></p>

<p align="center">
  <em>AI-powered healthcare assistant for medicine identification, information, and medical advice.</em>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#how-it-works">How It Works</a> •
  <a href="#setup">Setup</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#timeline">Timeline</a> •
  <a href="#license">License</a>
</p>

---

## 🚀 Overview

MediCamb is an AI-powered healthcare assistant that enables users to upload medicine photos for instant identification and detailed information (ingredients, usage, side effects). It also features a conversational AI chatbot for general medical queries and health advice.

> **Note:** This project is under active development.

---

## ✨ Features

- 📸 **Medicine Photo Upload & Recognition**
- 🔎 **OCR & AI Label Scanning**
- 💊 **Medicine Details:** Ingredients, Uses, Side Effects
- 🤖 **AI Chatbot (Gemini) for Medical Advice**
- 📱 **Responsive, Mobile-First Design**
- ⚡ **Real-Time Backend (MongoDB)**
- 🌐 **Planned: Multilingual Support**

---

## 🛠️ Tech Stack

- **Frontend:** ReactJS, TailwindCSS
- **Backend:** Node.js, Express
- **AI Chatbot:** Gemini
- **Image Recognition:** TensorFlow.js
- **Database:** MongoDB
- **Hosting:** Vercel
- **Data Sources:** WHO Medicine Datasets, OpenFDA

---

## 🗂️ Project Structure

```
medicamb/
├── medicamb/        # Frontend (React)
├── backend/         # Backend (Node.js/Express)
├── ai-models/       # (Planned) AI/ML Models
├── database/        # (Planned) Database Scripts
└── README.md
```

---

## ⚙️ How It Works

1. **Upload:** User uploads a photo of a medicine.
2. **OCR & Recognition:** App extracts text and identifies the medicine.
3. **Data Match:** Backend matches with known data and returns:
    - Name
    - Ingredients
    - Usage Instructions
    - Side Effects
4. **Chatbot:** Users can chat with the built-in AI bot for health-related queries.

---

## 🏁 Setup

### 1. Clone the Repository

```sh
git clone https://github.com/rohitpagi33/medicamb.git
cd medicamb
```

### 2. Frontend Setup

```sh
cd medicamb
npm install
npm run dev
```

### 3. Backend Setup

```sh
cd ../backend
npm install
npm run dev
```

### 4. Environment Variables

- Add your **Gemini API Key** to `.env`
- Set your **MongoDB URI** in `.env`

---

## 📅 Timeline

| Week | Milestone                                 |
|------|-------------------------------------------|
| 1-2  | Collect datasets, plan UI                 |
| 3    | Build OCR + AI model pipeline             |
| 4    | Develop backend APIs for medicine info    |
| 5    | Integrate AI chatbot                      |
| 6    | Connect frontend with backend             |
| 7    | Mobile optimization, testing              |
| 8    | Final deployment, documentation           |

---

## 📬 Contact

- **Name:** Rohit Pagi
- **Email:** [merohitpagi@gmail.com](mailto:merohitpagi@gmail.com)

---

## 📝 License

This project is licensed under the MIT License.

---

## ⚠️ Disclaimer

MediCamb is an academic project and does not replace professional medical advice. Always consult a qualified healthcare provider before making medical decisions.
