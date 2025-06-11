export default {
  async fetch(request, env, ctx) {
    //
    // This is the main function that runs every time a request hits your worker.
    // `env` is the object that contains your secrets, like env.GEMINI_API_KEY.
    //

    // Only allow POST requests, as we'll be sending data from the frontend.
    if (request.method !== 'POST') {
      return new Response('Expected POST request', { status: 405 });
    }

    // A good practice is to handle CORS preflight requests.
    // This is necessary for your frontend to be able to call the worker.
    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    }

    try {
      // 1. Get the user's prompt from the request body
      const body = await request.json();
      const userPrompt = body.prompt;

      if (!userPrompt) {
        return new Response('No prompt provided in the request body.', { status: 400 });
      }

      // 2. Get the API key from our secret environment
      const apiKey = env.GEMINI_API_KEY;
      if (!apiKey) {
        return new Response('GEMINI_API_KEY secret is not set.', { status: 500 });
      }

      // 3. Prepare the request to the Google Gemini API
      const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

      const geminiPayload = {
        contents: [
          {
            parts: [
              {
                text: userPrompt,
              },
            ],
          },
        ],
      };

      // 4. Call the Gemini API
      const geminiResponse = await fetch(geminiApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(geminiPayload),
      });

      if (!geminiResponse.ok) {
        // If Google's API returned an error, forward that error information
        const errorText = await geminiResponse.text();
        return new Response(`Google API Error: ${errorText}`, { status: geminiResponse.status });
      }

      // 5. Extract the text from the Gemini response and send it back to the frontend
      const geminiData = await geminiResponse.json();
      
      // The response structure can be complex, let's safely navigate it.
      const responseText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || 'No content found in response.';

      // Return the response with CORS headers
      return new Response(responseText, {
        headers: corsHeaders,
      });

    } catch (error) {
      // Handle any other errors, like JSON parsing failures
      return new Response(`Worker Error: ${error.message}`, { status: 500 });
    }
  },
};

// CORS (Cross-Origin Resource Sharing) headers are required to allow your website
// to make requests to the worker's URL from a different domain.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Or specify your domain for better security: 'https://your-website.com'
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function handleOptions(request) {
  if (
    request.headers.get('Origin') !== null &&
    request.headers.get('Access-Control-Request-Method') !== null &&
    request.headers.get('Access-Control-Request-Headers') !== null
  ) {
    // Handle CORS preflight requests.
    return new Response(null, {
      headers: corsHeaders,
    });
  } else {
    // Handle non-CORS preflight OPTIONS requests.
    return new Response(null, {
      headers: {
        Allow: 'POST, OPTIONS',
      },
    });
  }
}
