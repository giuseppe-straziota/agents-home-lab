import {Bot, BotOff} from "lucide-react";
import {AgentsModel} from "typesafe-actions";
import {AgentRequest, Message} from "@/store/types";

export {loadAgents, upsertAgent, deleteAgent,loadAgentMsg};

function loadAgents(): Promise<AgentsModel>  {
    return new Promise((resolve) => {
        fetch("/api/agents", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((agents) => {
                resolve(Object.keys(agents).map((agent_uuid: string) => {
                    const agent = agents[agent_uuid];
                    return {
                        name: agent.name,
                        active: agent.active,
                        icon: agent.active?Bot:BotOff,
                        llms: agent.llms,
                        tools: agent.tools,
                        uuid: agent_uuid,
                        description: agent.description,
                    };
                }) as AgentsModel);
            });
    });
}
function loadAgentMsg(agent_uuid:string): Promise<Message[]>  {
    return new Promise((resolve) => {
        fetch("/api/agent?agentUuid="+agent_uuid, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((response) => {
                resolve(response.messages as Message[]);
            });
    });
}
function upsertAgent(data: AgentRequest): Promise<AgentsModel>  {
    return new Promise((resolve) => {
        fetch("/api/agent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                agent_uuid: data.agent_uuid,
                name:data.name,
                active: data.active,
                description: data.description
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                resolve([{
                    name: data.name,
                    description: data.description,
                    active: data.active,
                    icon: data.active?Bot:BotOff,
                    llms: data.llms,
                    tools: data.tools,
                }] as AgentsModel);
            });
    });
}

function deleteAgent(data: {agent_uuid:string}): Promise<AgentsModel>  {
    return new Promise((resolve) => {
        fetch("/api/agent", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                agent_uuid: data.agent_uuid
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                resolve([{
                    name: data.name,
                    active: data.active,
                    icon: data.active?Bot:BotOff,
                    llms: data.llms,
                    tools: data.tools,
                }] as AgentsModel);
            });
    });
}

