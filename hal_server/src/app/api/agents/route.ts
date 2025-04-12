import redis from "@/server/lib/redis";
import prismaClient from "@/server/lib/prisma.js";

export interface LlmConfig { description:string, model:string,prompt:string }
export interface ToolConfig {
    action: string,
    description: string,
    fields: string[] | Array<{ value: string; uuid: string;}>,
    table:string,
    tool_name:string,
    parameters?: string
}


export interface ConfType  {
    agent_uuid: string,
    name: string,
    llm_config?: LlmConfig,
    llm_name?: string,
    llm_uuid?: string,
    tool_config?: ToolConfig,
    tool_name?: string,
    tool_uuid?: string,
}


export interface Agent  {
    name:string,
    active: boolean,
    llms: Array<ConfType>,
    tools: Array<ConfType>,
    uuid: string,
    description: string
}

export async function GET() {
    try {

        const result_agents = await prismaClient.agent.findMany({
            where: {
                deleted: false            },
            orderBy: [
                {active: 'desc'},
                {name: 'asc'}
            ]
        });

        const result_tool: Array<ConfType> = await prismaClient.$queryRaw`SELECT a.name , a.uuid as agent_uuid, t.name as tool_name, at.config as tool_config, at.uuid as tool_uuid FROM agent a join agent_tool at on at.id_agent = a.id join tool t on t.id = at.id_tool`;
        const result_llm: Array<ConfType> = await prismaClient.$queryRaw`SELECT  a.name , a.uuid as agent_uuid, l.name as llm_name, al.uuid as llm_uuid , al.config as llm_config  FROM agent a  join agent_llm al ON al.id_agent = a.id join llm l on al.id_llm = l.id`;

        const agents: { [key:string] : Agent } = {};
        result_agents.forEach((row ) => {
            agents[row.uuid  ] = {
                llms: result_llm.filter((llm: { agent_uuid: string; })=> llm.agent_uuid == row.uuid),
                tools: result_tool.filter((tool: { agent_uuid: string; })=> tool.agent_uuid == row.uuid),
                name: row.name,
                active: row.active,
                description: row.description!,
            }
            try {
                const key = "agent_cfg_"+row.uuid;
                redis.redisClient!.set(key,JSON.stringify(agents[row.uuid])).
                    then((data)=>{
                        console.log('agent configuration ',data ,row.uuid);
                })
            } catch (error) {
                console.error('Error publishing message:', error);
            }
        })
         console.log("agent list result_agents", agents)

        return new Response(JSON.stringify(agents), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }catch(error){
        console.log(error)
    }

}
