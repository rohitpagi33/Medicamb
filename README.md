# MediCamb – Intelligent Medicine Recognition & Healthcare Assistant

🧠 MediCamb is an AI-powered healthcare assistant that allows users to upload photos of medicines to identify them and retrieve detailed medical information like ingredients, usage, and side effects. It also features an AI chatbot for general medical queries and health advice.

🚧 This project is a work in progress.

---

## Features

- Medicine photo upload and image recognition
- OCR and AI label scanning
- Medicine details: ingredients, uses, side effects
- AI chatbot for medical advice using Gemini
- Responsive, mobile-first design
- Real-time backend with MongoDB
- Planned support for multilingual responses

---

## Tech Stack

Frontend: ReactJS + TailwindCSS  
Backend: Node.js + Express  
AI Chatbot: gemini 
Image Recognition: TensorFlow.js
Database: MongoDB  
Hosting: Vercel
Data Sources: WHO medicine datasets / OpenFDA

---

## Folder Structure

/medicamb  
├── medicamb/           
├── backend/              
├── ai-models/            
├── database/           
└── README.md  

---

## How It Works

1. User uploads an image of a medicine.
2. The app extracts text using OCR and identifies the medicine.
3. The backend matches it with known data and returns:
   - Name
   - Ingredients
   - Usage instructions
   - Side effects
4. Users can also chat with the built-in AI bot for health-related queries.

---

## Setup Guide

## Clone the project
git clone https://github.com/rohitpagi33/medicamb.git
cd medicamb

## Install frontend

cd medicamb
npm install
npm run dev

## Install backend

cd ..
cd backend
npm install
npm run dev

## Note:
### - Use your own Gemini Key in `.env`
### - Set MongoDB URI in `.env` as well

---

## Project Timeline

Week 1-2: Collect datasets and plan UI  
Week 3: Build OCR + AI model pipeline  
Week 4: Develop backend APIs for medicine info  
Week 5: Integrate OpenAI chatbot  
Week 6: Connect frontend with backend  
Week 7: Mobile optimization and testing  
Week 8: Final deployment and documentation

---

## Contact

Name: Rohit Pagi 
Email: merohitpagi@gmail.com

---

## License

This project is licensed under the MIT License.

---

## Disclaimer

MediCamb is an academic project and does not replace professional medical advice. Always consult a qualified healthcare provider before making medical decisions.
