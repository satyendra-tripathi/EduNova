import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config({ path: "./config/config.env" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const sendToGeminiAI = async (action, data, count = 1) => {
  try {
    let prompt = "";

    if (action === "explain") {
      prompt = `Explain this topic in simple Hindi + English step by step:\n${data.topic}\nMode: ${data.mode}`;
    } else if (action === "quiz") {
      prompt = `Create ${count} quiz questions on this topic:\n${data}`;
    } else if (action === "reason") {
      prompt = `Explain reasoning step by step:\n${data}`;
    } else if (action === "ai-quiz") {
      const { subject, topic, difficulty, questionType } = data;
      prompt = `
        Generate a quiz with ${count} questions based on:
        Subject: ${subject}
        Topic: ${topic}
        Difficulty: ${difficulty}
        Question Type: ${questionType}

        Requirements:
        1. Return ONLY a valid JSON object with a key "questions" containing an array of objects.
        2. Each question object MUST have:
           - "question": string
           - "options": array of exactly 4 strings
           - "correctAnswer": string (must match one of the options exactly)
           - "explanation": string (brief explanation)
        3. Do NOT include any markdown formatting or extra text.
      `;
    } else if (action === "evaluate") {
      const { question, answer, maxMarks } = data;
      prompt = `
        Evaluate this student's long answer based on the provided question.

        Question: ${question}
        Student Answer: ${answer}
        Max Marks: ${maxMarks || 5}

        Requirements:
        1. Evaluate answer quality, conceptual accuracy, and grammar.
        2. Provide constructive feedback and list specific mistakes.
        3. Suggest an improved version of the answer.
        4. Detect difficulty level (Easy/Medium/Hard).
        5. Provide a confidence score (0-100).
        6. Identify keyword coverage.
        7. Check for potential plagiarism (Low/Medium/High).

        Return ONLY a valid JSON object with this exact structure:
        {
          "score": number,
          "maxMarks": number,
          "feedback": "string",
          "mistakes": ["string"],
          "improvedAnswer": "string",
          "difficulty": "Easy/Medium/Hard",
          "confidenceScore": number,
          "keywordCoverage": ["string"],
          "grammarScore": number,
          "conceptAccuracy": number,
          "plagiarismWarning": "string"
        }
        Do NOT include any markdown formatting or extra text.
      `;
    }

    if (action === "ai-quiz" || action === "evaluate") {
      // Try Gemini first
      const models = ["gemini-1.5-flash", "gemini-pro", "gemini-2.0-flash"];
      for (const modelName of models) {
        try {
          console.log(`Trying Gemini model: ${modelName} for action: ${action}`);
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(prompt);
          const text = result.response.text();
          const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleanText);
          
          if (action === "ai-quiz") {
            const questions = Array.isArray(parsed) ? parsed : (parsed.questions || []);
            if (questions.length > 0) return questions;
          } else {
            return parsed;
          }
        } catch (err) {
          console.warn(`Gemini ${modelName} failed for ${action}:`, err.message);
        }
      }
      
      // Fallback to Groq
      console.log(`All Gemini models failed, falling back to Groq for ${action}...`);
      return await fetchFromGroq(prompt, true, action);
    }

    return await fetchFromGroq(prompt, false, action);

  } catch (error) {
    console.error("AI utility critical Error:", error);
    return action === "ai-quiz" ? [] : "⚠️ AI failed";
  }
};

async function fetchFromGroq(prompt, isJson, action) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: isJson 
            ? `You are a helpful assistant that returns ONLY valid JSON. ${action === "evaluate" ? "Return an evaluation object." : "Return an object with a 'questions' key."}` 
            : "You are an expert AI Tutor like ChatGPT."
        },
        { role: "user", content: prompt },
      ],
      response_format: isJson ? { type: "json_object" } : undefined,
    });

    const content = response.choices[0]?.message?.content || "";
    if (isJson) {
      try {
        const parsed = JSON.parse(content);
        if (action === "ai-quiz") {
          return Array.isArray(parsed) ? parsed : (parsed.questions || []);
        }
        return parsed;
      } catch (e) {
        console.error("Groq JSON Parse Error:", e, "Content:", content);
        return action === "ai-quiz" ? [] : null;
      }
    }
    return content || "No response";
  } catch (err) {
    console.error("Groq API Error:", err.message);
    return isJson ? (action === "ai-quiz" ? [] : null) : "⚠️ Groq failed";
  }
}