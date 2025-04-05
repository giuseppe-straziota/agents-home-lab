import redis from "@/server/lib/redis";
import pool from "@/server/lib/db";
import {v4 as uuidv4} from "uuid";

export async function GET(request: Request) {
    try {
        const params = new URLSearchParams(new URL(request.url).searchParams);
        const agentUuid: string = "agent_msg_"+params.get('agentUuid') || ""
        try {
            const redis_max_stored = await pool.query('SELECT value FROM configuration where name = $1',['redis_max_stored'] );

            console.log("agent list result_agent messages", agentUuid,redis_max_stored.rows[0].value)
            const result = await redis.redisClient!.lRange(agentUuid, Number.parseInt(redis_max_stored.rows[0].value)*-1, -1);
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
    console.log('post agent call')
    let result;
    if (!agent_uuid){
        result = await pool.query('INSERT INTO agent (name,active, uuid, description) VALUES ($1,$2, $3, $4)  RETURNING uuid', [name, active, uuidv4(), description])
    }else{
        result = await pool.query('UPDATE agent SET name = $1 ,active = $2, description = $3 WHERE uuid = $4' , [name, active, description,agent_uuid])
    }
    try {
        await redis.pubSubClient!.publish('info', 'agents update'+ name);
    } catch (error) {
        console.error('Error publishing message:', error);
    }
    console.log('post agent result', result.rows)
    return new Response(JSON.stringify({name: name, id: result.rows[0]?result.rows[0].id:agent_uuid}), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
    });

}

export async function DELETE(request: Request) {
    const body = await request.json();
    const { agent_uuid } = body;
    if (agent_uuid){
        console.log('delete agent call', agent_uuid);
        await pool.query('UPDATE agent SET deleted = true  WHERE uuid = $1' , [agent_uuid])
    }
    return new Response(JSON.stringify(body), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
    });
}

