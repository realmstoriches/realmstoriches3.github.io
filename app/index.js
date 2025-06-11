export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'POST') {
      return new Response('Expected POST', { status: 405 });
    }

    try {
      const body = await request.json();
      const userPrompt = body.prompt;

      if (!userPrompt) {
        return new Response('Missing prompt in request body', { status: 400 });
      }

      // This is the "magic" - a detailed system instruction for Gemini
      const systemInstruction = `
        You are an expert web developer. Your task is to generate a complete, single-page website based on the user's prompt.
        You must generate the HTML, CSS, and JavaScript for the page.
        The CSS should be self-contained and not require external libraries unless specified.
        The JavaScript should also be self-contained.
        YOU MUST RETURN THE RESPONSE AS A VALID JSON OBJECT with the following three keys: "html", "css", "js".
        Do not include any other text or markdown formatting in your response. Just the raw JSON.
      `;

      const apiKey = env.GEMINI_API_KEY;
      const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

      const geminiPayload = {
        contents: [
          {
            parts: [
              { text: systemInstruction }, // Give it the rules first
              { text: `User Prompt: ${userPrompt}` }, // Then the user's request
            ],
          },
        ],
      };

      const geminiResponse = await fetch(geminiApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload),
      });

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        return new Response(`Google API Error: ${errorText}`, { status: 500 });
      }

      const geminiData = await geminiResponse.json();
      let responseText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

      // Clean the response to ensure it's valid JSON
      responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

      // Return the JSON with appropriate headers
      return new Response(responseText, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // IMPORTANT for calling from browser
        },
      });

    } catch (error) {
      return new Response(`Worker Error: ${error.message}`, { status: 500 });
    }
  },
};
