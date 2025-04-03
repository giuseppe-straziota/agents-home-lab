import pool from "@/server/lib/db";
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
            try {
                const key = "agent_cfg_"+row.uuid;
                redis.redisClient!.set(key,JSON.stringify(agents[row.uuid])).
                    then((data)=>{
                        console.log('agent configuration ',data ,row.uuid);
                })
            } catch (error) {
                console.error('Error publishing message:', error);
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
