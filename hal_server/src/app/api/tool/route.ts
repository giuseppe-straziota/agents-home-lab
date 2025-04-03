import pool from "@/server/lib/db";
import {v4 as uuidv4} from "uuid";
import redis from "@/server/lib/redis"

export async function GET() {
    try {
        const result = await pool.query('SELECT * FROM tool')
        console.log("tool list call")
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
    console.log('api post tool call');
    const {
        agent_uuid,
        fn_name,
        config,
        tool_uuid
    } = body;
    try {
        // const result =await map[fn_name](table)
       let result;

       if (!tool_uuid) {
           const id_agent = await pool.query('SELECT id FROM agent WHERE uuid = $1', [agent_uuid]);
           const id_tool = await pool.query('SELECT id FROM tool WHERE name = $1', [fn_name]);
           result = await pool.query(
               'INSERT INTO agent_tool (id_agent,id_tool, uuid, config) VALUES ($1,$2, $3,$4) ', [id_agent.rows[0].id, id_tool.rows[0].id, uuidv4(), config])
        }else{
           result = await  pool.query('UPDATE agent_tool SET config = $1 WHERE uuid = $2',[config,tool_uuid]
           )
       }

        try {
            await redis.pubSubClient!.publish('info', 'tool update '+ config.tool_name);
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
    // Parse the request body
    const body = await request.json();
    console.log('delete tool api');
    const {
        tool_uuid,
    } = body;
    try {
        // const result =await map[fn_name](table)
        const result = await pool.query('DELETE FROM agent_tool WHERE uuid = $1', [tool_uuid]);
        return new Response(JSON.stringify({rows:result}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }catch(error){
        console.log(error)
    }
}