
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GeneratedTemplate } from '../types';

// This placeholder will be replaced by the GitHub Action
const API_KEY = "__GEMINI_API_KEY_PLACEHOLDER__";

let ai: GoogleGenAI | null = null;

if (API_KEY && API_KEY !== "__GEMINI_API_KEY_PLACEHOLDER__") {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (e) {
    console.error("Failed to initialize GoogleGenAI, likely due to an invalid API key format:", e);
    // The app should still load, but generation will fail.
    // An error will be thrown by generateWebsiteTemplate if ai is null.
  }
} else {
  if (API_KEY === "__GEMINI_API_KEY_PLACEHOLDER__") {
    console.warn("Gemini API Key placeholder was not replaced. Template generation will not work. Ensure the GitHub Action ran correctly and the GEMINI_API_KEY secret is set.");
  } else { // API_KEY is undefined or empty
    console.error("Gemini API Key is not configured. Template generation will not work. Ensure the GEMINI_API_KEY secret is set for the GitHub Action.");
  }
}

const MODEL_NAME = "gemini-2.5-flash-preview-04-17";

export async function generateWebsiteTemplate(description: string): Promise<GeneratedTemplate> {
  if (!ai) {
    throw new Error("Gemini API client is not initialized. This is likely due to a missing or invalid API key. Please check the deployment configuration and API key.");
  }

  const prompt = `
    You are an AI Web Design Architect, renowned for creating stunning, modern, and highly functional website templates.
    Your task is to generate a complete, single-page HTML template and its corresponding CSS styles based on the user's description.

    Key Requirements for the Generated Template:
    1.  HTML Structure: Semantic, well-organized, and responsive. It must include a <meta name="viewport" content="width=device-width, initial-scale=1.0"> tag.
    2.  CSS Styling: 
        *   Self-contained within the HTML file via a <style> tag in the <head>.
        *   Plain CSS. Do NOT use external CSS frameworks (Bootstrap, Tailwind CSS, etc.) in the generated CSS.
        *   Aesthetically pleasing, with a professional look and feel. Consider modern design trends, color palettes, and typography.
        *   Ensure good readability and accessibility (e.g., sufficient color contrast).
    3.  Responsiveness: The template must adapt gracefully to different screen sizes (desktop, tablet, mobile). Use media queries as needed.
    4.  Magnificence: The design should be visually impressive and aligned with the user's description, aiming for a "wow" factor.

    Output Format:
    Provide the output *strictly* as a JSON object with three string keys: "name", "html", and "css".
    -   "name": A concise, catchy, and descriptive name for the template (e.g., "Modern Artist Portfolio", "Tech Startup Landing Page", "Minimalist Blog Design").
    -   "html": The full HTML code as a string. This HTML must include the <style> tag in its <head> containing all the generated CSS.
    -   "css": The full CSS code as a string. This should be the exact same CSS that is embedded in the HTML's <style> tag, provided separately for user convenience (e.g., for saving as a separate style.css file).

    User Description: "${description}"

    Example JSON Output:
    {
      "name": "Sleek Corporate Landing Page",
      "html": "<!DOCTYPE html>\\n<html lang=\\"en\\">\\n<head>\\n  <meta charset=\\"UTF-8\\">\\n  <meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\">\\n  <title>Sleek Corporate</title>\\n  <style>\\n    body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333; line-height: 1.6; }\\n    .container { max-width: 1100px; margin: auto; overflow: auto; padding: 0 20px; }\\n    header { background: #333; color: #fff; padding: 1rem 0; text-align: center; }\\n    header h1 { margin: 0; }\\n    /* ... more CSS rules ... */\\n    @media(max-width: 768px) { .container { padding: 0 10px; } }\\n  </style>\\n</head>\\n<body>\\n  <header>\\n    <div class=\\"container\\">\\n      <h1>Welcome to Our Company</h1>\\n    </div>\\n  </header>\\n  <main>\\n    <div class=\\"container\\">\\n      <p>Your content goes here. This is a sleek corporate landing page design.</p>\\n    </div>\\n  </main>\\n  <footer>\\n    <p class=\\"container\\" style=\\"text-align: center; padding: 1rem 0; background: #333; color: #fff; margin-top: 2rem;\\">&copy; 2024 Your Company</p>\\n  </footer>\\n</body>\\n</html>",
      "css": "body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333; line-height: 1.6; }\\n.container { max-width: 1100px; margin: auto; overflow: auto; padding: 0 20px; }\\nheader { background: #333; color: #fff; padding: 1rem 0; text-align: center; }\\nheader h1 { margin: 0; }\\n/* ... more CSS rules ... */\\n@media(max-width: 768px) { .container { padding: 0 10px; } }"
    }
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr);

    if (parsedData && typeof parsedData.html === 'string' && typeof parsedData.css === 'string' && typeof parsedData.name === 'string') {
      return {
        name: parsedData.name,
        html: parsedData.html,
        css: parsedData.css,
        description: description 
      };
    } else {
      console.error("Generated data from AI is not in the expected JSON format:", parsedData);
      throw new Error("Failed to parse template data from AI. The response format was unexpected. Please try a different prompt or check the AI model status.");
    }

  } catch (error) {
    console.error("Error generating website template with Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes("API key not valid") || error.message.includes("invalid API key")) {
             throw new Error("The Gemini API key is invalid or not authorized. Please verify the API key used for deployment.");
        }
        if (error.message.toLowerCase().includes("quota")) {
            throw new Error("The Gemini API request failed due to quota limits. Please check your API quota.");
        }
        throw new Error(`Gemini API error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI to generate the template.");
  }
}
