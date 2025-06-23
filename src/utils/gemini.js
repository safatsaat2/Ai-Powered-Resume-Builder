import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyD88w5JnSxXvhEfdFqQUDANgMBfQywiSkk"; 
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateSummary(prompt) {
  try {
    // Use gemini-pro model (free)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Could not generate content. Please try again later.";
  }
}

// More specialized generators
export async function generateExperience(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(
    `Write a professional work experience section for a resume based on: ${prompt}. 
    Use bullet points and focus on achievements.`
  );
  return (await result.response).text();
}

export async function improveResumeSection(section, content) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(
    `Improve this ${section} for a professional resume: ${content}. 
    Make it more impactful and concise.`
  );
  return (await result.response).text();
}