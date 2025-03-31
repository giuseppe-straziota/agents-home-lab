import pool from "@/server/database/db";
import {v4 as uuidv4} from 'uuid';
import redis from "@/server/lib/redis";

export async function GET() {
    try {

        const result_agents = await pool.query('SELECT * from agent where deleted = false  order by active DESC, name ASC');
        const result_llm = await pool.query('SELECT  a.name , a.uuid as agent_uuid, l.name as llm_name, al.uuid as llm_uuid , al.config as llm_config  FROM agent a  join agent_llm al ON al.id_agent = a.id join llm l on al.id_llm = l.id ')
        const result_tool = await pool.query('SELECT a.name , a.uuid as agent_uuid, t.name as tool_name, at.config as tool_config, at.uuid as tool_uuid FROM agent a join agent_tool at on at.id_agent = a.id join tool t on t.id = at.id_tool ')
        const agents: {[key :string]: {llms: [], tools: []}} = {}
        result_agents.rows.forEach((row) => {
            agents[row.uuid] = {
                llms: result_llm.rows.filter(llm=> llm.agent_uuid == row.uuid),
                tools: result_tool.rows.filter(tool=> tool.agent_uuid == row.uuid),
                name: row.name,
                active: row.active,
                description: row.description,
            }
        })
         console.log("agent list result_agents", agents)

        return new Response(JSON.stringify(agents), {
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
    const { name, agent_uuid, active, description } = body;
    console.log('post agent call', body)
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