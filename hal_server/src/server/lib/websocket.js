import {WebSocketServer} from 'ws'
import {map} from "../tools/toolMap.js";
let wsServer;
export const GlobalWS = (()=>{

    return class GlobalWS {
        constructor(){
            console.log("GlobalWS constructor", wsServer);
            if (!wsServer) {
                wsServer = new WebSocketServer( {port:   3006, path:"/ws"});
                wsServer.on('connection', (ws) => {
                    console.log('Nuovo client connesso');

                    ws.on('message', (message) => {
                        console.log(`Messaggio ricevuto: ${JSON.parse(message)}`);
                        // @ts-expect-error todo
                        map['readFromTable']('category').then((data)=>{
                            console.log(data);
                        })
                        ws.send(`Echo: ${message}`);
                    });

                    ws.on('close', () => {
                        console.log('Client disconnesso');
                    });
                });
                wsServer.on('error', (err) => {
                    console.log('Client error', err);
                })
            }
            return wsServer;
        }
    }
})()






