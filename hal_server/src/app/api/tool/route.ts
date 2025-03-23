import pool from "@/server/database/db";
import {map} from "@/server/tools/toolMap";

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
    const { tool_name, table, fn_name, action } = body;
    try {
        // @ts-expect-error todo
        const result =await map[fn_name](table)
        console.log(result);
        return new Response(JSON.stringify({rows:result}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }catch(error){
        console.log(error)
    }
}