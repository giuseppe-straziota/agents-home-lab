import {WebSocketServer} from 'ws'
import redis from "../lib/redis.js"

let wsServer;

export class GlobalWS {

         constructor(){
             console.log("call to new GlobalWS constructor");
            if (!wsServer) {
                console.log("creation on a new Websocket server");
                wsServer = new WebSocketServer( {port:   3006, path:"/ws"});
                wsServer.on('connection', (ws) => {
                    console.log('New client connectiono');

                    ws.on('message', (message) => {
                        const content = JSON.parse(message);
                        console.log('Messaggio ricevuto:', content);
                        if (content.channel === 'chat') {
                            //ws.send(`Echo: ${content.payload}`);
                            const payload = content.payload;
                            redis.redisClient.rPush(
                                payload.agent_uuid,
                                JSON.stringify({
                                    sender: "user",
                                    timestamp: payload.timestamp,
                                    content: payload.content,
                                })).then(r => {
                                console.log(r, 'messages retrived for ', payload.agent_uuid)
                            });

                        }

                    });

                    ws.on('close', () => {
                        console.log('Client disconnected');
                    });
                });
                wsServer.on('error', (err) => {
                    console.log('Client error', err);
                })
            }

        }

        getInstance() {
        if (!wsServer) {
            throw new Error("WebSocket server not initialized");
        }
        return wsServer;
    }

}






