import {v4 as uuidv4} from "uuid";
import redis from "@/server/lib/redis"
import prismaClient from "@/server/lib/prisma";

export async function GET() {
    try {
        const result = await prismaClient.llm.findMany();
        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }catch(error){
        console.log(error)
    }

}

export async function POST(request: Request) {
    // Parse the request body
    const body = await request.json();
    const {
        agent_uuid,
        llm_name,
        config,
        llm_uuid
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
        const id_llm  = await prismaClient.llm.findFirst({
            where: {
                name: llm_name,
            },
            select: {
                id: true
            }
        })
       if (!llm_uuid) {
           result = await prismaClient.agent_llm.create({
              data: {
                  id_agent: id_agent!.id,
                  id_llm: id_llm!.id,
                  config: config,
                  uuid: uuidv4()
              }
           })
        }else{
           result = await prismaClient.agent_llm.update({
               where: {
                   id_agent_id_llm:{
                       id_agent: id_agent!.id,
                       id_llm: id_llm!.id,
                   },
                   uuid: llm_uuid
               },
               data: {
                   config: config,
               }
           })
       }

        try {
            await redis.publishClient!.publish('info', 'llm update '+ llm_name);
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
        llm_uuid,
        agent_uuid,
        llm_name
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
        const id_llm  = await prismaClient.llm.findFirst({
            where: {
                name: llm_name,
            },
            select: {
                id: true
            }
        })
        const result = await prismaClient.agent_llm.delete({
            where: {
                id_agent_id_llm:{
                    id_agent: id_agent!.id,
                    id_llm: id_llm!.id,
                },
                uuid: llm_uuid,
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