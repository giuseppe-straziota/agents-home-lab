import {dbInteraction} from "../tools/databaseCRUD.js";
import OpenAI from "openai";


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Initialize conversation history with a system prompt
let conversationHistory = [
    { role: "system", content: "You are a helpful assistant." },
];

// Define our tool: dbInteraction
const tools = [
    {
        type: "function",
        name: "dbInteraction",
        description: "Fetch data from a given table in the database.",
        parameters: {
            type: "object",
            properties: {
                tableName: {
                    type: "string",
                    description: "Name of the table to query.",
                },
            },
            required: ["tableName"],
            additionalProperties: false,
        },
        strict: true,
    },
];


// Handler for function calls returned by OpenAI
async function handleFunctionCall(toolCall) {
    const { name, arguments: argsJson } = toolCall;
    let args;
    try {
        args = JSON.parse(argsJson);
    } catch (error) {
        console.error("Error parsing function call arguments:", error);
        return "";
    }
    if (name === "dbInteraction") {
        const result = await dbInteraction(args.tableName);
        return JSON.stringify(result);
    }
    return "";
}

/**
 * sendMessage:
 * - Accepts a new user message.
 * - Appends it to the conversation history.
 * - Sends the conversation to OpenAI with defined tools.
 * - If the response includes a function call, executes it,
 *   appends the function output to the conversation,
 *   and re-sends the conversation to get a final answer.
 * - Returns the final assistant output.
 */
async function sendMessage(newMessage) {
    // Append the new user message
    conversationHistory.push({ role: "user", content: newMessage });

    // Send the conversation with tools to OpenAI
    let response = await openai.responses.create({
        model: "gpt-4o",
        input: conversationHistory,
        tools: tools,
    });

    // Check for function calls in the response output.
    // Here we assume response.output is an array of output items.
    // If a function call is detected, execute it and append its output.
    if (Array.isArray(response.output)) {
        for (const item of response.output) {
            if (item.type === "function_call") {
                // Execute the function call
                const functionResult = await handleFunctionCall(item);
                // Append the function call and its output to the conversation
                conversationHistory.push(item);
                conversationHistory.push({
                    role: "function",
                    name: item.name,
                    content: functionResult,
                });
                // Re-call the API with the updated conversation history
                response = await openai.responses.create({
                    model: "gpt-4o",
                    input: conversationHistory,
                    tools: tools,
                });
            }
        }
    }

    // Append the final assistant response to the conversation history
    // (Assuming the final text is in response.output_text)
    conversationHistory.push({ role: "assistant", content: response.output_text });

    // Return the assistant's final output
    return response.output_text;
}

module.exports = {
    sendMessage,
};


export function openAi(){

    return "openai"
}