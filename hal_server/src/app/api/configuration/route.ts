import pool from "@/server/lib/db";
import redis from "@/server/lib/redis";


export async function GET() {
    try {
        const result = await pool.query('SELECT * FROM configuration')
        console.log("configuration list call")
        return new Response(JSON.stringify(result.rows), {
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
    for (const key of Object.keys(body)) {
        await pool.query('UPDATE configuration SET value = $1 where name = $2', [String(body[key]), key])
    }
    try {
        await redis.pubSubClient!.publish('info', 'configuration update with success');
    } catch (error) {
        console.error('Error publishing message:', error);
    }
    return new Response(JSON.stringify({message: 'update done'}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}