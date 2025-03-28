import {GlobalWS} from "@/server/lib/websocket";

export async function GET() {
    try {
        const socket = new GlobalWS();
        let exist = false
        if (socket.getInstance()) {
            exist = true
        }
        return new Response(JSON.stringify({exist: exist}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }catch(error){
        console.log(error)
    }

}