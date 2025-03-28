import {WebSocketServer} from 'ws'
let wsServer;

export class GlobalWS {

         constructor(){
            console.log("GlobalWS constructor", wsServer);
            if (!wsServer) {
                wsServer = new WebSocketServer( {port:   3006, path:"/ws"});
                wsServer.on('connection', (ws) => {
                    console.log('Nuovo client connesso');

                    ws.on('message', (message) => {
                        console.log(`Messaggio ricevuto: ${JSON.parse(message)}`);
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

        }

        getInstance() {
        if (!wsServer) {
            throw new Error("WebSocket server not initialized");
        }
        return wsServer;
    }

}






