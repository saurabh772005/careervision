
const API_KEY = import.meta.env.VITE_API_KEY || '';
const BASE_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";

if (!API_KEY) {
  console.error("CRITICAL: API_KEY is missing. AI features will not work.");
}

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: { text: string }[];
    };
  }[];
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

async function callGeminiAPI(prompt: string, retries = 2): Promise<string> {
  if (!API_KEY) throw new Error("API Key is missing.");

  const payload = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  for (let i = 0; i <= retries; i++) {
    try {
      console.log(`Calling Gemini API (Attempt ${i + 1})...`);
      const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Handle specific error codes
        if (response.status === 404) {
          throw new Error(`Model not found (404). Check API URL: ${BASE_URL}`);
        }
        if (response.status === 429) {
          console.warn("Rate limit exceeded. Retrying...");
          await new Promise(res => setTimeout(res, 2000 * (i + 1))); // Exponential backoff
          continue;
        }

        throw new Error(`API Error ${response.status}: ${errorData.error?.message || response.statusText}`);
      }

      const data: GeminiResponse = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) throw new Error("Empty response from Gemini API.");

      return text;
    } catch (error: any) {
      console.error("Gemini API Request Failed:", error);
      if (i === retries) throw error;
    }
  }
  throw new Error("Failed to connect to Gemini API after multiple attempts.");
}


// --- Exported Functions (Refactored) ---

export async function generateFullCareerReportAI(profile: any) {
  const prompt = `
    You are an expert Career Counsellor and AI Analyst. 
    Analyze the following student profile and generate a detailed career report in Strict JSON format.
    
    Student Profile:
    ${JSON.stringify(profile, null, 2)}
    
    Output strictly in this JSON format:
    {
      "matchScore": number (0-100),
      "topRoles": ["Role 1", "Role 2", "Role 3"],
      "skillsGap": ["Skill 1", "Skill 2"],
      "marketTrends": "Brief analysis of current market demand for these roles",
      "salaryRange": "Expected salary range in INR",
      "roadmap": [
        { "phase": "Month 1-2", "focus": "Topic", "resources": ["Resource 1"] },
        { "phase": "Month 3-4", "focus": "Topic", "resources": ["Resource 2"] }
      ]
    }
    Do not include markdown formatting (like \`\`\`json). Just the raw JSON string.
  `;

  try {
    const text = await callGeminiAPI(prompt);
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("AI Report Error:", error);
    throw error;
  }
}

export async function chatWithCareerMentor(history: { role: 'user' | 'model'; parts: { text: string }[] }[], message: string) {
  // Note: For simple REST API, we construct the prompt with history manually or just send the latest message 
  // if we don't want to manage full multi-turn state complexity in one go. 
  // To keep it simple and robust for this refactor, we'll append history to the prompt.

  const conversationHistory = history.map(h => `${h.role === 'user' ? 'Student' : 'Mentor'}: ${h.parts[0].text}`).join('\n');

  const prompt = `
    You are an empathetic, expert Career Counsellor for Indian students.
    
    Conversation History:
    ${conversationHistory}
    
    Student: ${message}
    Mentor (You):
  `;

  return await callGeminiAPI(prompt);
}

export async function simulateCareerPath(profile: any) {
  // Note: The previous signature was (currentRole, targetRole), but usage in component passed 'profile'.
  // Adjusted to match component usage likely. Or I should check component usage.
  // Wait, looking at previous file content... simulateCareerPath(currentRole, targetRole).
  // But checking CareerSimulator.tsx... line 39: await simulateCareerPath(profile);
  // So the component passes an object! The previous implementation had (currentRole, targetRole) signature but was called with profile? 
  // No, let's look at CareerSimulator.tsx again.
  // "const data = await simulateCareerPath(profile);"
  // But definition was "export async function simulateCareerPath(currentRole: string, targetRole: string)"
  // This implies the previous code was actually broken/mismatched types? 
  // I will support BOTH or just the object since that's what is being passed.
  // Let's support the object 'profile' as it contains 'branch' etc.

  const prompt = `
    Simulate a realistic career path based on this profile: ${JSON.stringify(profile)}
    
    Output strictly in this JSON format:
    {
      "overallRecommendation": "Summary string",
      "rankedPaths": [
         {
            "pathId": "career-path-1",
            "fitScore": 85,
            "projectedInitialSalary": 500000,
            "year5Salary": 1200000,
            "personalizedAdvice": "Advice string"
         }
      ]
    }
    Do not include markdown formatting.
  `;

  try {
    const text = await callGeminiAPI(prompt);
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Simulation Error:", error);
    throw error;
  }
}

export async function validateCourseAI(course: any, userProfile: any) {
  const prompt = `
    Analyze if this course is a good fit for the student.
    Course: ${JSON.stringify(course)}
    Student Profile: ${JSON.stringify(userProfile)}

    Output strictly in this JSON format:
    {
      "fitScore": number (0-100),
      "aiRecommendation": "2-3 sentences on why it fits or not",
      "pros": ["Pro 1", "Pro 2"],
      "cons": ["Con 1", "Con 2"],
      "roiEstimate": {
        "expectedSalaryIncrease": number (percentage),
        "breakEvenMonths": number
      }
    }
    No markdown.
  `;

  try {
    const text = await callGeminiAPI(prompt);
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Course Validation Error:", error);
    throw error;
  }
}

export async function getCareerRecommendationsAI(profile: any) {
  const prompt = `
    Analyze this student profile and suggest top 3 career paths in the Indian tech market.
    Profile: ${JSON.stringify(profile)}

    Output strictly in this JSON format:
    {
      "summary": "Brief encouraging summary of their potential",
      "recommendations": [
        {
          "title": "Job Title",
          "fitReason": "Why this fits their profile",
          "marketDemand": "High/Medium/Low",
          "averageSalary": "e.g. 8-12 LPA"
        }
      ]
    }
    No markdown.
  `;

  try {
    const text = await callGeminiAPI(prompt);
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Recommendation Error:", error);
    throw error;
  }
}

export async function generateRoadmapAI(role: string, skills: string, hours: number, weeks: number) {
  const prompt = `
    Create a ${weeks}-week study roadmap for becoming a "${role}".
    Current Skills: ${skills}.
    Weekly Commitment: ${hours} hours.

    Output strictly in this JSON format:
    {
      "roadmap": {
        "targetRole": "${role}",
        "totalWeeks": ${weeks},
        "phases": [
          {
            "title": "Phase Name",
            "projectIdea": "Capstone Project Idea",
            "weeks": [
              {
                "week": "Week 1",
                "topics": ["Topic 1", "Topic 2"],
                "resource": "Recommended course/doc"
              }
            ]
          }
        ]
      }
    }
    No markdown.
  `;

  try {
    const text = await callGeminiAPI(prompt);
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Roadmap Error:", error);
    throw error;
  }
}

export async function validateGeminiConnection() {
  try {
    console.log("Validating Gemini Connection...");
    await callGeminiAPI("Hello, are you online?");
    console.log("Gemini Connection Validated.");
    return true;
  } catch (e) {
    console.error("Gemini Connection Failed:", e);
    return false;
  }
}
