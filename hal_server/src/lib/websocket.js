import {WebSocketServer} from 'ws'

export const GlobalWS = (()=>{
    let wsServer;
    return class GlobalWS {
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
            }
            return wsServer;
        }
    }
})()






