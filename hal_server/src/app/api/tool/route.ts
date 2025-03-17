import pool from "@/database/db";
import {map} from "@/tools/toolMap";

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
    const { toolName, tableName } = body;
    try {
        // @ts-expect-error todo
        map[toolName](tableName).then((data)=>{
            console.log(data);
        })
    }catch(error){
        console.log(error)
    }
}