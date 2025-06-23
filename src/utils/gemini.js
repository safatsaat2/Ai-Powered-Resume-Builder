const API_KEY = "AIzaSyD88w5JnSxXvhEfdFqQUDANgMBfQywiSkk";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

// Helper function for API calls with retry
async function callGeminiAPI(prompt, retries = 3, delay = 1000) {
  const payload = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }]
  };

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response structure from Gemini API');
      }
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(res => setTimeout(res, delay * (i + 1)));
    }
  }
}

// Enhanced prompt engineering for better results
const PROMPT_TEMPLATES = {
  summary: (name, skills) => `Write a professional 3-sentence summary for ${name || "a candidate"} with these skills: ${skills || "various skills"}. 
  Focus on achievements and use power verbs. Write in third person without pronouns.`,
  
  experience: (position, company, skills) => `Write 4-5 professional bullet points for a ${position || "position"} at ${company || "a company"}. 
  Skills: ${skills || "various skills"}. Each point should start with an action verb and include quantifiable results where possible.`,
  
  improve: (section, content) => `Improve this resume ${section} section: ${content}. 
  Make it more concise and impactful. Use professional tone and focus on achievements. 
  Keep it under 150 words.${section === 'experience' ? ' Use bullet points.' : ''}`
};

// Main generation functions
export async function generateSummary(name, skills) {
  try {
    return await callGeminiAPI(PROMPT_TEMPLATES.summary(name, skills));
  } catch (error) {
    console.error("Summary generation failed:", error);
    return `Experienced professional with skills in ${skills || "various areas"}.`;
  }
}
export async function generateSection(name, skills) {
  try {
    return await callGeminiAPI(PROMPT_TEMPLATES.summary(name, skills));
  } catch (error) {
    console.error("Summary generation failed:", error);
    return `Experienced professional with skills in ${skills || "various areas"}.`;
  }
}

export async function generateExperience(position, company, skills) {
  try {
    return await callGeminiAPI(PROMPT_TEMPLATES.experience(position, company, skills));
  } catch (error) {
    console.error("Experience generation failed:", error);
    return `• Performed key responsibilities at ${company || "company"}\n• Developed skills in ${skills || "relevant areas"}`;
  }
}

export async function improveResumeSection(section, content) {
  try {
    if (!content || content.trim().length < 10) {
      throw new Error("Content too short to improve");
    }
    return await callGeminiAPI(PROMPT_TEMPLATES.improve(section, content));
  } catch (error) {
    console.error(`Failed to improve ${section}:`, error);
    return content; // Return original if improvement fails
  }
}

// Additional utility functions
export async function generateSkills(keywords) {
  try {
    const prompt = `Convert these keywords into professional resume skills: ${keywords}. 
    Group them into 3-4 categories with relevant sub-skills.`;
    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error("Skills generation failed:", error);
    return keywords.split(',').join(', ');
  }
}

export async function generateAchievements(role, industry) {
  try {
    const prompt = `Suggest 5 measurable achievements for a ${role} in ${industry} industry. 
    Format each as "Achieved [X] by doing [Y] resulting in [Z]"`;
    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error("Achievements generation failed:", error);
    return `• Delivered significant results in ${role} role\n• Contributed to key projects in ${industry} industry`;
  }
}

// Rate limiting utility
let lastRequestTime = 0;
const REQUEST_DELAY = 500; // 0.5 second between requests

async function rateLimitedCall(prompt) {
  const now = Date.now();
  const timeSinceLast = now - lastRequestTime;
  
  if (timeSinceLast < REQUEST_DELAY) {
    await new Promise(res => setTimeout(res, REQUEST_DELAY - timeSinceLast));
  }
  
  lastRequestTime = Date.now();
  return callGeminiAPI(prompt);
}