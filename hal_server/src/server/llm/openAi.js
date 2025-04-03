//import OpenAI from "openai";
import {fnMap} from "../tools/toolMap.js";
import redis from "../lib/redis.js";


// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });


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
        const result = await fnMap[name](args.tableName);
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
async function sendOpenAiMessage(message) {
    // Append the new user message
    const agent_info = {}
    try {
        const agent = JSON.parse( await redis.redisClient.get('agent_cfg_'+message.agent_uuid));
        console.log('send message openao', message, agent)
        const llm = agent.llms.find(llm => llm.llm_name === 'OpenAI');
        agent_info.systemPrompt = llm.llm_config.prompt;
        agent_info.model = llm.llm_config.model;
    } catch (error) {
        console.error('Error retrieving agent info', error);
    }
    const conversationHistory = [];
    conversationHistory.push({ role: "system", content: agent_info.systemPrompt });
    conversationHistory.push({ role: "user", content: message.content });

    // Send the conversation with tools to OpenAI
    // let response = await openai.responses.create({
    //     model: agent_info.model,
    //     input: conversationHistory,
    //     tools: tools,
    // });
    console.log("openai obh",{
        model: agent_info.model,
        input: conversationHistory,
        tools: tools,
    })
    let response = {
        "id": "resp_67ccd3a9da748190baa7f1570fe91ac604becb25c45c1d41",
        "object": "response",
        "created_at": 1741476777,
        "status": "completed",
        "error": null,
        "incomplete_details": null,
        "instructions": null,
        "max_output_tokens": null,
        "model": "gpt-4o-2024-08-06",
        "output": [
            {
                "type": "message",
                "id": "msg_67ccd3acc8d48190a77525dc6de64b4104becb25c45c1d41",
                "status": "completed",
                "role": "assistant",
                "content": [
                    {
                        "type": "output_text",
                        "text": "I got the message but I don't know the response",
                        "annotations": []
                    }
                ]
            }
        ],
        "parallel_tool_calls": true,
        "previous_response_id": null,
        "reasoning": {
            "effort": null,
            "generate_summary": null
        },
        "store": true,
        "temperature": 1.0,
        "text": {
            "format": {
                "type": "text"
            }
        },
        "tool_choice": "auto",
        "tools": [],
        "top_p": 1.0,
        "truncation": "disabled",
        "usage": {
            "input_tokens": 328,
            "input_tokens_details": {
                "cached_tokens": 0
            },
            "output_tokens": 52,
            "output_tokens_details": {
                "reasoning_tokens": 0
            },
            "total_tokens": 380
        },
        "user": null,
        "metadata": {}
    }


    // Check for function calls in the response output.
    // Here we assume response.output is an array of output items.
    // If a function call is detected, execute it and append its output.
    // if (Array.isArray(response.output)) {
    //     for (const item of response.output) {
    //         if (item.type === "function_call") {
    //             // Execute the function call
    //             const functionResult = await handleFunctionCall(item);
    //             // Append the function call and its output to the conversation
    //             conversationHistory.push(item);
    //             conversationHistory.push({
    //                 role: "function",
    //                 name: item.name,
    //                 content: functionResult,
    //             });
    //             // Re-call the API with the updated conversation history
    //             response = await openai.responses.create({
    //                 model: "gpt-4o",
    //                 input: conversationHistory,
    //                 tools: tools,
    //             });
    //         }
    //     }
    // }

    // Append the final assistant response to the conversation history
    // (Assuming the final text is in response.output_text)
    conversationHistory.push({ role: "assistant", content: response.output[0].content[0].text });

    // Return the assistant's final output
    console.log('response', conversationHistory);
    return response.output[0].content[0].text;

}

export default sendOpenAiMessage;
