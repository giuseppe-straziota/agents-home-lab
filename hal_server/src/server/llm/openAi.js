
import {fnMap} from "../tools/toolMap.js";
import redis from "../lib/redis.js";
import pool from "../lib/db.js";
import {getOpenAIClient} from "../lib/openai.js";


// Define our tool: dbInteraction
// const tools = [
//     {
//         type: "function",
//         name: "retrieveAllDataByTableName",
//         description: "Fetch data from a given table in the database.",
//         parameters: {
//             type: "object",
//             properties: {
//                 tableName: {
//                     type: "string",
//                     description: "Name of the table to query.",
//                 },
//             },
//             required: ["tableName"],
//             additionalProperties: false,
//         },
//         strict: true,
//     },
// ];


// Handler for function calls returned by OpenAI
async function handleFunctionCall(toolCall, tools) {
    const { name, arguments: argsJson } = toolCall;
    let args;
    try {
        args = JSON.parse(argsJson);
    } catch (error) {
        console.error("Error parsing function call arguments:", error);
        return "";
    }
    const def_tool = tools.find(tool => tool.tool_config.tool_name === name);
    const result = await fnMap[def_tool.tool_name](args, def_tool);
    return JSON.stringify(result);
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
    const conversationHistory = [];
    const agent_key = 'agent_msg_'+message.agent_uuid;
    let tools = [];
    let agent = {}
    try {
        agent = JSON.parse( await redis.redisClient.get('agent_cfg_'+message.agent_uuid));

        const redis_max_msg_send = await pool.query('SELECT value FROM configuration where name = $1',['redis_max_msg_send'] );
        const messageHistory = await redis.redisClient.lRange(agent_key, Number.parseInt(redis_max_msg_send.rows[0].value)*-1, -1);
        console.log('send message openao', message, agent)

        const llm = agent.llms.find(llm => llm.llm_name === 'OpenAI');
        agent_info.systemPrompt = llm.llm_config.prompt;
        agent_info.model = llm.llm_config.model;
        conversationHistory.push({ role: "system", content: agent_info.systemPrompt });
        messageHistory.forEach((msg)=> {
            const message = JSON.parse(msg);
            delete message['timestamp'];
            conversationHistory.push(message)
            }
        );
        tools = agent.tools.map(tool =>{
            return {
                type: "function",
                name: tool.tool_config.tool_name,
                description: tool.tool_config.description,
                strict: true,
                parameters: tool.tool_config.parameters ? tool.tool_config.parameters :
                    {type: "object",
                    properties: {},
                    additionalProperties: false,
                    required: []},
                additionalProperties: false,
        }})
    } catch (error) {
        console.error('Error retrieving agent info', error);
    }

    console.log("openai obh",{
        model: agent_info.model,
        input: conversationHistory,
        tools: tools,
    })
    // Send the conversation with tools to OpenAI
    let response = await getOpenAIClient().responses.create({
        model: agent_info.model,
        input: conversationHistory,
        tools: tools,
        tool_choice: "auto",
        temperature: 1.
    });
    // let response = {
    //     "id": "resp_67ccd3a9da748190baa7f1570fe91ac604becb25c45c1d41",
    //     "object": "response",
    //     "created_at": 1741476777,
    //     "status": "completed",
    //     "error": null,
    //     "incomplete_details": null,
    //     "instructions": null,
    //     "max_output_tokens": null,
    //     "model": "gpt-4o-2024-08-06",
    //     "output": [
    //             {
    //                 "type": "function_call",
    //                 "id": "fc_67ca09c6bedc8190a7abfec07b1a1332096610f474011cc0",
    //                 "call_id": "call_unLAR8MvFNptuiZK6K6HCy5k",
    //                 "name": "Pantry stock",
    //                 "arguments": "{\"tableName\":\"item\"}",
    //                 "status": "completed"
    //             }
    //            ,
    //         {
    //             "type": "message",
    //             "id": "msg_67ccd3acc8d48190a77525dc6de64b4104becb25c45c1d41",
    //             "status": "completed",
    //             "role": "assistant",
    //             "content": [
    //                 {
    //                     "type": "output_text",
    //                     "text": "I got the message but I don't know the response",
    //                     "annotations": []
    //                 }
    //             ]
    //         }
    //     ],
    //     "parallel_tool_calls": true,
    //     "previous_response_id": null,
    //     "reasoning": {
    //         "effort": null,
    //         "generate_summary": null
    //     },
    //     "store": true,
    //     "temperature": 1.0,
    //     "text": {
    //         "format": {
    //             "type": "text"
    //         }
    //     },
    //     "tool_choice": "auto",
    //     "tools": [],
    //     "top_p": 1.0,
    //     "truncation": "disabled",
    //     "usage": {
    //         "input_tokens": 328,
    //         "input_tokens_details": {
    //             "cached_tokens": 0
    //         },
    //         "output_tokens": 52,
    //         "output_tokens_details": {
    //             "reasoning_tokens": 0
    //         },
    //         "total_tokens": 380
    //     },
    //     "user": null,
    //     "metadata": {}
    // }


    // Check for function calls in the response output.
    // Here we assume response.output is an array of output items.
    // If a function call is detected, execute it and append its output.
    let functionResult = "no response"
    console.log('response', response)
    if (Array.isArray(response.output)) {
        for (const item of response.output) {
            if (item.type === "function_call") {

                // Execute the function call
                functionResult = await handleFunctionCall(item,agent.tools);
                // Append the function call and its output to the conversation
                conversationHistory.push(item);
                await redis.redisClient.rPush( agent_key, JSON.stringify(item))

                conversationHistory.push(
                    {
                        type: "function_call_output",
                        call_id: item.call_id,
                        output: functionResult.toString()
                    }
                    );
                await redis.redisClient.rPush(  agent_key, JSON.stringify({
                    type: "function_call_output",
                    call_id: item.call_id,
                    output: functionResult.toString()
                }))

                console.log('functionvalues', functionResult)
                // Re-call the API with the updated conversation history
                response = await getOpenAIClient().responses.create({
                    model: agent_info.model,
                    input: conversationHistory,
                    tools: tools,
                    tool_choice: "auto",
                    temperature: 1.
                });
            }
        }
    }

    // Append the final assistant response to the conversation history
    // conversationHistory.push({ role: "assistant", content: response.output[0].content[0].text });
    conversationHistory.push({ role: "assistant", content: response.output[0].content[0].text});
    await redis.redisClient.rPush(  agent_key, JSON.stringify({ role: "assistant", content: response.output[0].content[0].text}))
    // Return the assistant's final output
    console.log('response', conversationHistory);
    return response.output[0].content[0].text;

}

export default sendOpenAiMessage;
