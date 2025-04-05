import redis from "./redis.js";
import {llmManager} from "../llm/llmMap.js";

export const wsChannelManager = (ws, content) =>{

    switch (content.channel) {
        case 'chat':  const payload = content.payload;
            const agentKey = "agent_msg_"+payload.agent_uuid;
            redis.redisClient.rPush(
                agentKey,
                JSON.stringify({
                    role: payload.role,
                    timestamp: payload.timestamp,
                    content: payload.content,
                })).then(async r => {
                console.log(r, 'messages retrieved for ', agentKey)
                const response = await llmManager["OpenAI"](payload)
                ws.send(JSON.stringify({
                    channel: "chat", payload: {
                        agent_uuid: payload.agent_uuid,
                        content: response,
                        role: "assistant",
                        timestamp: Date.now(),
                    }
                }))
            });
            //get the conversation <llm limit
            //call the right llm with params
            break;
        default:    break;

    }
}

