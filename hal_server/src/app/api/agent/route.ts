import redis from "@/server/lib/redis";
import {v4 as uuidv4} from "uuid";
import prismaClient from "@/server/lib/prisma.js";

export async function GET(request: Request) {
    try {
        const params = new URLSearchParams(new URL(request.url).searchParams);
        const agentUuid: string = "agent_msg_"+params.get('agentUuid') || ""
        try {
            const redis_max_stored = await prismaClient.configuration.findUnique({
                where: {
                    name: 'redis_max_stored',
                }
            });
            const result = await redis.redisClient!.lRange(agentUuid, Number.parseInt(redis_max_stored!.value!)*-1, -1);
                return new Response(JSON.stringify({messages:
                        result
                            .map(msg=>JSON.parse(msg))
                            .filter(msg=> msg.role==='user' || msg.role === 'assistant')
                            }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
        } catch (error) {
            console.error('Error publishing message:', error);
            return new Response(JSON.stringify(agentUuid), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }catch(error){
        console.log(error)
        return new Response(JSON.stringify(''), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

}


export async function POST(request: Request) {
    // Parse the request body
    const body = await request.json();
    const { name, agent_uuid, active, description } = body;

    const result = await prismaClient.agent.upsert({
        where: {
            uuid: agent_uuid,
            name: name
        },
        update: {
            name: name,
            active: active,
            description: description,
        },
        create: {
            name: name,
            active: active,
            uuid: uuidv4(),
            description: description,
        },
    })
    try {
        await redis.publishClient!.publish('info', 'agents update'+ name);
    } catch (error) {
        console.error('Error publishing message:', error);
    }
    return new Response(JSON.stringify({name: name, id:  result.id }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
    });

}

export async function DELETE(request: Request) {
    const body = await request.json();
    const { agent_uuid } = body;
    if (agent_uuid){
        await prismaClient.agent.delete({
            where: {
                uuid: agent_uuid
            }
        })
        //remove keys from redis
        await redis.redisClient!.del('agent_cfg_'+agent_uuid);
        await redis.redisClient!.del('agent_msg_'+agent_uuid);
    }
    return new Response(JSON.stringify(body), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
    });
}

