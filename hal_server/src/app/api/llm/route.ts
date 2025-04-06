import pool from "@/server/lib/db";
import {v4 as uuidv4} from "uuid";
import redis from "@/server/lib/redis"
import {QueryResultRow} from "pg";

export async function GET() {
    try {
        const result:QueryResultRow = await pool.query('SELECT * FROM llm')
        console.log("llm list call")
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
    console.log('llm post call');
    const {
        agent_uuid,
        llm_name,
        config,
        llm_uuid
    } = body;
    try {
        // const result =await map[fn_name](table)
       let result;

       if (!llm_uuid) {
           const id_agent:QueryResultRow = await pool.query('SELECT id FROM agent WHERE uuid = $1', [agent_uuid]);
           const id_llm:QueryResultRow = await pool.query('SELECT id FROM llm WHERE name = $1', [llm_name]);
           console.log([id_agent.rows[0].id, id_llm.rows[0].id, config])
           result = await pool.query(
               'INSERT INTO agent_llm (id_agent,id_llm, uuid, config) VALUES ($1,$2, $3,$4) ', [id_agent.rows[0].id, id_llm.rows[0].id, uuidv4(), config])
        }else{
           result = await  pool.query('UPDATE agent_llm SET config = $1 WHERE uuid = $2',[config,llm_uuid]
           )
       }

        try {
            await redis.pubSubClient!.publish('info', 'llm update '+ llm_name);
        } catch (error) {
            console.error('Error publishing message:', error);
        }

        console.log('route llm called',result);
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
    console.log('api delete llm');
    const {
        llm_uuid,
    } = body;
    try {
        // const result =await map[fn_name](table)
        const result = await pool.query('DELETE FROM agent_llm WHERE uuid = $1', [llm_uuid]);
        return new Response(JSON.stringify({rows:result}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }catch(error){
        console.log(error)
    }
}