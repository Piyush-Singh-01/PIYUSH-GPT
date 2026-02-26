// src/config/gemini.js

import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

// Load API key from .env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Use stable & fast model
const MODEL_NAME = "gemini-2.5-flash";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Send prompt to Gemini and get response
 * @param {string} prompt
 * @returns {Promise<string>}
 */
const runChat = async (prompt) => {
  try {
    if (!prompt) return "Please enter a message.";

    // Get model
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
    });

    // Create chat session
    const chat = model.startChat({
      generationConfig: {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
      history: [],
    });

    // Send message
    const result = await chat.sendMessage(prompt);

    // Extract response text
    const response = result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    return "Something went wrong. Please try again!";
  }
};

export default runChat;