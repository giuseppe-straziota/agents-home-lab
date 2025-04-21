import {fnMap} from "../tools/toolMap.js";
import redis from "../lib/redis.js";
import {getOpenAIClient} from "../lib/openaiClient.js";
import prismaClient from "../lib/prisma.js";

// Handler for function calls returned by OpenAI
async function handleFunctionCall(toolCall, tools) {
    const {name, arguments: argsJson} = toolCall;
    let args;
    try {
        args = JSON.parse(argsJson);
    } catch (error) {
        console.error("Error parsing function call arguments:", error);
        return "";
    }
    const def_tool = tools.find(tool => tool.tool_config.tool_name === name);
    await redis.publishClient.publish('processing', def_tool.tool_uuid);
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

    try {

        const agent_info = {}
        const conversationHistory = [];
        const agent_key = 'agent_msg_' + message.agent_uuid;
        let tools = [];
        let agent = {}
        let llm = {}
        try {
            agent = JSON.parse(await redis.redisClient.get('agent_cfg_' + message.agent_uuid));

            const redis_max_msg_send = await prismaClient.configuration.findFirst({
                where: {
                    name: 'redis_max_msg_send',
                }
            });
            const messageHistory = await redis.redisClient.lRange(agent_key, Number.parseInt(redis_max_msg_send.value) * -1, -1);

            llm = agent.llms.find(llm => llm.llm_name === 'OpenAI');
            agent_info.systemPrompt = llm.llm_config.prompt;
            agent_info.model = llm.llm_config.model;
            conversationHistory.push({role: "system", content: agent_info.systemPrompt});
            messageHistory.forEach((msg, index) => {
                    const message = JSON.parse(msg);
                    //Remove from the last messages sent as history the one that is a function_call_output
                    // because it is the first one in the list, and there is no call_id that is related to it.
                    if (!(index === 0 && message.type === "function_call_output")) {
                        delete message['timestamp']; //used by the application but not present into type message defined by openai
                        conversationHistory.push(message)
                    }
                }
            );
            tools = agent.tools.map(tool => {
                return {
                    type: "function",
                    name: tool.tool_config.tool_name,
                    description: tool.tool_config.description,
                    strict: true,
                    parameters: tool.tool_config.parameters ? tool.tool_config.parameters :
                        {
                            type: "object",
                            properties: {},
                            additionalProperties: false,
                            required: []
                        },
                    additionalProperties: false,
                }
            })
        } catch (error) {
            console.error('Error retrieving agent info', error);
        }

        // console.log("openai obj",{
        //     model: agent_info.model,
        //     input: conversationHistory,
        //     tools: tools,
        // })
        await redis.publishClient.publish('processing', llm.llm_uuid);
        // Send the conversation with tools to OpenAI
        let response = await getOpenAIClient().responses.create({
            model: agent_info.model,
            input: conversationHistory,
            tools: tools,
            tool_choice: "auto",
            temperature: 1.
        });

        // Check for function calls in the response output.
        // Here we assume response.output is an array of output items.
        // If a function call is detected, execute it and append its output.
        let functionResult = "no response"
        if (Array.isArray(response.output)) {
            for (const item of response.output) {
                if (item.type === "function_call") {

                    // Execute the function call
                    functionResult = await handleFunctionCall(item, agent.tools);
                    // Append the function call and its output to the conversation
                    conversationHistory.push(item);
                    await redis.redisClient.rPush(agent_key, JSON.stringify(item))

                    conversationHistory.push(
                        {
                            type: "function_call_output",
                            call_id: item.call_id,
                            output: functionResult.toString()
                        }
                    );
                    await redis.redisClient.rPush(agent_key, JSON.stringify({
                        type: "function_call_output",
                        call_id: item.call_id,
                        output: functionResult.toString()
                    }))

                    await redis.publishClient.publish('processing', llm.llm_uuid);
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

        //console.log('response', response)
        let responseToUser = "I got your request but I haven't a response from the api"
        if (response.output[0].content) {
            responseToUser = response.output[0].content[0].text;
        }
        conversationHistory.push({role: "assistant", content: responseToUser});
        await redis.redisClient.rPush(agent_key, JSON.stringify({role: "assistant", content: responseToUser}))
        // Return the assistant's final output
        //console.log('response', conversationHistory);
        return responseToUser;

    } catch (e) {
        console.log('error', e)
        return "something went wrong, please try again";
    }

}

export default sendOpenAiMessage;
