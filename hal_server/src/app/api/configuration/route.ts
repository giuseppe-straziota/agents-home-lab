import redis from "@/server/lib/redis";
import prismaClient from "@/server/lib/prisma.js";


export async function GET() {
    try {
        const result = await prismaClient.configuration.findMany({});
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
    for (const key of Object.keys(body)) {
        await prismaClient.configuration.update({
           where: {
               name: key,
           } ,
            data: {
               value: String(body[key])
            }
        });
    }
    try {
        await redis.publishClient!.publish('info', 'configuration update with success');
    } catch (error) {
        console.error('Error publishing message:', error);
    }
    return new Response(JSON.stringify({message: 'update done'}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}