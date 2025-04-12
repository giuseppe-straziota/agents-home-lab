 import prismaClient from "@/server/lib/prisma.js";


export async function GET() {
    try {
        const items = await prismaClient.agent.findMany({
            select: {
                name: true,
                uuid: true,
                agent_llm: {
                    select: {
                        uuid: true,
                        config: true,
                        llm: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        const agents = await prismaClient.$queryRaw`SELECT a.name , a.uuid as agent_uuid, t.name as tool_name, at.config as tool_config, at.uuid as tool_uuid FROM agent a join agent_tool at on at.id_agent = a.id join tool t on t.id = at.id_tool`;
        return new Response(JSON.stringify({items:items, agents:agents}), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({error:error}), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
