// openaiClientSingleton.js


import OpenAI from "openai";

let openaiClient = null;

/**
 * getOpenAIClient returns a singleton instance of the OpenAI client.
 * It creates the client if it doesn't exist yet, using the API key from
 * the environment variables.
 *
 * @returns {OpenAI} The singleton OpenAI client.
 */
export function getOpenAIClient() {
    if (!openaiClient) {
        openaiClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            // You can add additional configuration here if needed
        });
        console.log("OpenAI client initialized.");
    }
    return openaiClient;
}

