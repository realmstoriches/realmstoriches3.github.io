import { GoogleGenAI } from "@google/genai";

const APP_CONTAINER_ID = 'ai-website-generator-app';
const appContainer = document.getElementById(APP_CONTAINER_ID);

if (!appContainer) {
  console.error(`AI Website Generator container ('#${APP_CONTAINER_ID}') not found. The app will not initialize.`);
} else {
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    showError("API_KEY is not set. Please configure it in your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const promptInput = appContainer.querySelector('#prompt-input');
  const generateButton = appContainer.querySelector('#generate-button');
  const loadingIndicator = appContainer.querySelector('#loading-indicator');
  const outputSection = appContainer.querySelector('#output-section');
  const previewFrame = appContainer.querySelector('#preview-frame');
  const htmlCodeElement = appContainer.querySelector('#html-code');
  const cssCodeElement = appContainer.querySelector('#css-code');
  const jsCodeElement = appContainer.querySelector('#js-code');
  const errorMessageElement = appContainer.querySelector('#error-message');

  const tabButtons = appContainer.querySelectorAll('.tab-button');
  const tabPanels = appContainer.querySelectorAll('.tab-panel');
  const copyButtons = appContainer.querySelectorAll('.copy-button');

  function showError(message) {
    if (errorMessageElement) {
      errorMessageElement.textContent = message;
      errorMessageElement.style.display = 'block';
    }
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }
    console.error(`AI App Error: ${message}`);
  }

  function clearError() {
    if (errorMessageElement) {
      errorMessageElement.textContent = '';
      errorMessageElement.style.display = 'none';
    }
  }

  if (generateButton) {
    generateButton.addEventListener('click', async () => {
      if (!API_KEY) {
        showError("API_KEY is not configured. Cannot proceed.");
        return;
      }
      if (!promptInput) {
        showError("Prompt input element not found.");
        return;
      }

      const userPrompt = promptInput.value.trim();
      if (!userPrompt) {
        showError('Please enter a description for your website.');
        return;
      }

      clearError();
      if (loadingIndicator) loadingIndicator.style.display = 'flex';
      if (outputSection) outputSection.style.display = 'none';
      generateButton.disabled = true;

      try {
        const fullPrompt = `
You are an expert web developer. Your task is to generate a complete, single-page website template based on the user's request.
The website should be modern, responsive, and adhere to web best practices.
Output the result as a VALID JSON object with three keys: "html", "css", and "javascript".
The "html" value should be a string containing the full HTML structure for the body of the page (content that goes inside <body>).
The "css" value should be a string containing all necessary CSS rules.
The "javascript" value should be a string containing any JavaScript for interactivity; if no JS is needed, provide an empty string or a simple console log.

User request: "${userPrompt}"

Constraints for the generated code:
1.  HTML (for body content):
    *   Use semantic HTML5 tags where appropriate (e.g., <header>, <nav>, <main>, <article>, <section>, <footer>).
    *   Ensure generated HTML is well-formed.
    *   Do NOT include <html>, <head>, or <body> tags in the "html" field. Only include the content that would go INSIDE the <body> tag.
    *   Do NOT include <link rel="stylesheet" ...> or <script src="..."> tags in the "html" field. These will be handled by the application.
2.  CSS:
    *   All CSS rules should be in the "css" string.
    *   Aim for a clean, modern aesthetic unless specified otherwise by the user.
    *   Ensure CSS is responsive (e.g., using media queries).
3.  JavaScript:
    *   All JavaScript code should be in the "javascript" string.
    *   If JavaScript is not strictly necessary for the user's request, provide minimal or no JS.
    *   Avoid using external libraries unless specifically requested and ensure they can be linked via CDN in the HTML if needed (though this generator doesn't auto-add CDN links).

Example of user request: "A simple landing page for a new coffee shop with a hero image, a short 'About Us' section, and a contact form."

Remember to ONLY output the JSON object. Do not include any other text or explanations before or after the JSON.
The JSON should look like:
{
  "html": "<header>...</header><main>...</main><footer>...</footer>",
  "css": "body { font-family: sans-serif; } ...",
  "javascript": "console.log('Page loaded'); ..."
}
`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-preview-04-17',
          contents: fullPrompt,
          config: {
            responseMimeType: "application/json",
          }
        });
        
        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
          jsonStr = match[2].trim();
        }

        let parsedData;
        try {
          parsedData = JSON.parse(jsonStr);
        } catch (e) {
          console.error("Failed to parse JSON response:", e);
          console.error("Received string for parsing:", jsonStr);
          showError(`Failed to parse AI response. The AI may not have returned valid JSON. Raw response preview: ${jsonStr.substring(0,500)}...`);
          return;
        }

        if (!parsedData || typeof parsedData.html !== 'string' || typeof parsedData.css !== 'string' || typeof parsedData.javascript !== 'string') {
          showError('Invalid data structure received from AI. Expected html, css, and javascript fields.');
          console.error('Invalid data structure:', parsedData);
          return;
        }

        if (htmlCodeElement) htmlCodeElement.textContent = parsedData.html;
        if (cssCodeElement) cssCodeElement.textContent = parsedData.css;
        if (jsCodeElement) jsCodeElement.textContent = parsedData.javascript;

        if (previewFrame) {
          const previewDoc = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Preview</title>
              <style>
                  body { 
                        margin: 0; 
                        padding: 1rem;
                        /* --- FIX: Replaced non-working CSS variables with actual hex codes --- */
                        background-color: #1a1a1a; /* Default dark BG */
                        color: #f0f0f0; /* Default light text */
                        font-family: sans-serif;
                        }
                        ${parsedData.css}
              </style>
            </head>
            <body>
              ${parsedData.html}
              <script>
                ${parsedData.javascript}
              </script>
            </body>
            </html>
          `;
          previewFrame.srcdoc = previewDoc;
        }

        if (outputSection) outputSection.style.display = 'block';
        switchTab('html');

      } catch (error) {
        console.error('Error generating website:', error);
        let errorMsg = 'An error occurred while generating the website.';
        if (error instanceof Error) {
            errorMsg += ` Details: ${error.message}`;
        }
        showError(errorMsg);
      } finally {
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        if (generateButton) generateButton.disabled = false;
      }
    });
  } else {
    console.warn("Generate button not found. App functionality might be limited.");
  }

  function switchTab(tabName) {
    tabButtons.forEach(button => {
      if (button.getAttribute('data-tab') === tabName) {
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
      } else {
        button.classList.remove('active');
        button.setAttribute('aria-selected', 'false');
      }
    });
    tabPanels.forEach(panel => {
      const panelElement = panel;
      if (panelElement.id === `${tabName}-code-panel`) {
        panelElement.style.display = 'block';
      } else {
        panelElement.style.display = 'none';
      }
    });
  }

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.getAttribute('data-tab');
      if (tabName) {
        switchTab(tabName);
      }
    });
  });

  copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const targetId = button.getAttribute('data-target');
      if (!targetId) return;

      const codeElement = appContainer.querySelector(`#${targetId}`);
      if (!codeElement) return;

      try {
        await navigator.clipboard.writeText(codeElement.textContent || '');
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
        showError('Failed to copy text to clipboard. Your browser might not support this feature or permission was denied.');
      }
    });
  });

  if (tabButtons.length > 0 && tabButtons[0].getAttribute('data-tab')) {
   switchTab(tabButtons[0].getAttribute('data-tab'));
  } else if (tabButtons.length > 0) { 
    switchTab('html');
  }
} // End of if (appContainer)
