import {v4 as uuidv4} from "uuid";
import redis from "@/server/lib/redis"
import prismaClient from "@/server/lib/prisma";

export async function GET() {
    try {
        const result = await prismaClient.tool.findMany({})
        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }catch(error){
        console.log(error)
    }

}

export async function POST(request: Request) {
    const body = await request.json();
    const {
        agent_uuid,
        fn_name,
        config,
        tool_uuid
    } = body;
    try {
       let result;
        const id_agent  = await prismaClient.agent.findFirst({
            where: {
                uuid: agent_uuid,
            },
            select: {
                id: true
            }
        })
        const id_tool  = await prismaClient.tool.findFirst({
            where: {
                name: fn_name,
            },
            select: {
                id: true
            }
        })
       if (!tool_uuid) {
           result = await prismaClient.agent_tool.create({
               data: {
                   id_agent: id_agent!.id,
                   id_tool: id_tool!.id,
                   config: config,
                   uuid: uuidv4()
               }
           })
       }else{
           result = await prismaClient.agent_tool.update({
              where: { id_agent_id_tool_uuid: {
                   id_agent: id_agent!.id,
                   id_tool: id_tool!.id,
                   uuid: tool_uuid
              }
               },
               data:{
                   config: config,
                }
               }
           )
       }

        try {
            await redis.publishClient!.publish('info', JSON.stringify({
                    content: 'tool update '+ config.tool_name,
                    timestamp: Date.now(),
                }
             ));
        } catch (error) {
            console.error('Error publishing message:', error);
        }

        return new Response(JSON.stringify({rows:result}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }catch(error){
        console.log(error)
    }
}


export async function DELETE(request: Request) {
    const body = await request.json();
    const {
        tool_uuid,
        agent_uuid,
        tool_name
    } = body;
    try {
        const id_agent  = await prismaClient.agent.findFirst({
            where: {
                uuid: agent_uuid,
            },
            select: {
                id: true
            }
        })
        const id_tool  = await prismaClient.tool.findFirst({
            where: {
                name: tool_name,
            },
            select: {
                id: true
            }
        })
        const result = await prismaClient.agent_tool.delete({
            where: { id_agent_id_tool_uuid: {
                    uuid: tool_uuid,
                    id_agent: id_agent!.id,
                    id_tool:id_tool!.id
                }
            }
        })
        return new Response(JSON.stringify({rows:result}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }catch(error){
        console.log(error)
    }
}