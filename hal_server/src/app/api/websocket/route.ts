import {GlobalWS} from "@/lib/websocket";

export async function GET() {
    try {
        const socket = new GlobalWS();
        let exist = false
        if (socket) {
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