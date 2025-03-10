import pool from "@/app/database/db";
import {getWSServer} from "@/server/websocket.js";
import {WebSocket} from "ws";


export async function GET() {
    try {
        const result = await pool.query('SELECT * FROM configuration')
        console.log("configuration list call")

        const ws = getWSServer()
        if (ws){
              getWSServer().clients.forEach((client:WebSocket) => {
                if (client.readyState === client.OPEN) {
                    client.send('Messaggio inviato dall\'API route! '+ result.rows.toString());
                }
            });
        }
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
    const { name } = body;

    // e.g. Insert new user into your DB
    const newUser = { id: Date.now(), name };

    return new Response(JSON.stringify(newUser), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
    });
}