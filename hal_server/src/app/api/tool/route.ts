import pool from "@/server/database/db";
import {map} from "@/server/tools/toolMap";
import {v4 as uuidv4} from "uuid";

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
    console.log(body);
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

        console.log(result);
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
    console.log(body);
    const {
        tool_uuid,
    } = body;
    try {
        // const result =await map[fn_name](table)
        const result = await pool.query('DELETE FROM agent_tool WHERE uuid = $1', [tool_uuid]);
        console.log(result);
        return new Response(JSON.stringify({rows:result}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }catch(error){
        console.log(error)
    }
}