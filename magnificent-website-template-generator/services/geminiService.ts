import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GeneratedTemplate } from '../types';

// API Key handling as per strict instructions: Assume process.env.API_KEY is available.
const API_KEY = process.env.API_KEY;

// It's good practice to check for the API key, but problem implies it's always set.
// If it could be missing, a check here would be wise:
if (!API_KEY) {
  // This error will be caught by the App component's error handling.
  console.error("Gemini API Key (process.env.API_KEY) is not set. Template generation will fail.");
  // throw new Error("Gemini API Key is not configured. Please ensure the API_KEY environment variable is set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! }); // Use non-null assertion as per problem spec that API_KEY is available
const MODEL_NAME = "gemini-2.5-flash-preview-04-17";

export async function generateWebsiteTemplate(description: string): Promise<GeneratedTemplate> {
  if (!API_KEY) { // Redundant if throwing above, but good safeguard if console.error is used.
    throw new Error("Gemini API Key is not available. Cannot generate template.");
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
        // Default thinkingConfig is fine for quality. If speed is paramount & model supports, can adjust.
        // temperature: 0.7, // Adjust for creativity vs. predictability if needed
      },
    });

    let jsonStr = response.text.trim();
    // Remove markdown fences if present (e.g., ```json ... ```)
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
        // Customize error messages for known issues if possible
        if (error.message.includes("API key not valid")) {
             throw new Error("The Gemini API key is invalid or not authorized. Please check your API key configuration.");
        }
        throw new Error(`Gemini API error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI to generate the template.");
  }
}
