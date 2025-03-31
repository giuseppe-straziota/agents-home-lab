import pool from "@/server/database/db";
import {v4 as uuidv4} from 'uuid';
import redis from "@/server/lib/redis";

export async function GET(request: Request) {
    try {
        const params = new URLSearchParams(new URL(request.url).searchParams);
        const parameters: string = params.get('agentUuid') || ""
        console.log("agent list result_agent messages", parameters)
        try {
            const result = await redis.redisClient!.lRange(parameters, -50, -1);
                return new Response(JSON.stringify({messages:result.map(msg=>JSON.parse(msg))}), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
        } catch (error) {
            console.error('Error publishing message:', error);
            return new Response(JSON.stringify(parameters), {
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

