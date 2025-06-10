
import { GoogleGenAI } from "@google/genai";
import { type UserPreferences } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY for Gemini is not defined. Please set process.env.API_KEY.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = "gemini-2.5-flash-preview-04-17";

export const generateWebsiteTemplate = async (preferences: UserPreferences): Promise<string> => {
  const sectionsArray = preferences.sections.split(',').map(s => s.trim()).filter(s => s);
  const sectionsPrompt = sectionsArray.length > 0 
    ? `The website must include the following sections: ${sectionsArray.join(', ')}.`
    : "The website should have a common landing page structure (e.g., Hero, About, Services, Contact).";

  const prompt = `
    You are an expert web developer specializing in creating modern, responsive HTML templates using Tailwind CSS.
    Your task is to generate a complete, single HTML file for a website based on the following user preferences:

    1.  **Type of Website:** ${preferences.websiteType}
    2.  **Main Topic/Purpose:** ${preferences.topic}
    3.  **Key Sections:** ${sectionsPrompt}
    4.  **Color Scheme Preference:** ${preferences.colorScheme}. Apply this scheme thoughtfully throughout the site using Tailwind color utilities (e.g., bg-blue-600, text-gray-100). Prioritize good contrast and readability.
    5.  **Specific Requests:** ${preferences.specificRequests || "None. Ensure a clean, professional design."}

    **Output Requirements:**
    *   The output MUST be a single, complete HTML document.
    *   Start with \`<!DOCTYPE html>\` and end with \`</html>\`.
    *   Include a \`<head>\` section with a \`<title>\` relevant to the topic, and necessary meta tags (charset, viewport).
    *   **Crucially, include the Tailwind CSS CDN script in the <head>: \`<script src="https://cdn.tailwindcss.com"></script>\`**.
    *   All styling MUST be done using Tailwind CSS classes directly within the HTML elements. **It is strictly forbidden to use inline \`style\` attributes or \`<style>\` blocks.** The HTML must be pure, with all styling achieved through Tailwind classes applied to elements.
    *   Use semantic HTML5 elements where appropriate (e.g., \`<header>\`, \`<nav>\`, \`<main>\`, \`<section>\`, \`<footer>\`, \`<article>\`).
    *   Ensure the design is responsive and looks good on various screen sizes. Use Tailwind's responsive prefixes (sm:, md:, lg:).
    *   Use placeholder images from \`https://picsum.photos/width/height\` if images are needed (e.g., \`https://picsum.photos/600/400\`).
    *   Generate meaningful placeholder text (Lorem Ipsum is acceptable if specific content is not implied by the topic).
    *   The HTML should be well-formatted and readable.

    Provide ONLY the HTML code as your response. Do not include any explanatory text, comments, or markdown formatting before or after the HTML code itself.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      // No thinkingConfig for higher quality generation unless speed is paramount
    });
    
    const rawHtml = response.text;
    let sanitizedHtml = "";

    if (rawHtml && typeof rawHtml === 'string') {
        // Remove any <style> tags and their content
        sanitizedHtml = rawHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
        // Attempt to remove any stray HTML comments that might be outside the main document structure.
        // This is a simple regex and might not cover all edge cases of malformed comments.
        sanitizedHtml = sanitizedHtml.replace(/<!--[\s\S]*?-->/g, ''); 
    } else {
        console.error("Gemini response was not a string or was empty/null:", rawHtml);
        throw new Error("The AI returned an empty or invalid response. Please try again.");
    }
    
    // Trim leading/trailing whitespace which might include newlines or other characters before <!DOCTYPE html>
    const trimmedHtml = sanitizedHtml.trim();

    if (!trimmedHtml.toLowerCase().startsWith('<!doctype html>')) {
        console.error("Gemini response, after sanitization and trimming, does not start with <!DOCTYPE html>:", trimmedHtml);
        throw new Error("The AI failed to generate a valid HTML document. The response might be incomplete, malformed, or not HTML after sanitization. Please try again with clearer instructions or check the AI's status.");
    }
    
    return trimmedHtml;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes('API_KEY_INVALID')) {
        throw new Error("The provided API key is invalid. Please check your environment configuration.");
    }
    // Re-throw the original error if it's one of our custom ones, or wrap others.
    if (error instanceof Error && (error.message.startsWith("The AI returned an empty") || error.message.startsWith("The AI failed to generate a valid HTML document"))) {
        throw error;
    }
    throw new Error(`Failed to generate website template using Gemini API. ${error instanceof Error ? error.message : String(error)}`);
  }
};
