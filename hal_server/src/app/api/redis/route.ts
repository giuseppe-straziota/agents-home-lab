import redis from "../../../server/lib/redis"

export async function GET() {
    try {
        const result = await redis!.redisClient.get('redis_conn_timestamp')
        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }catch(error){
        console.log(error)
    }

}