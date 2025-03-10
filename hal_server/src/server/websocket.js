import {WebSocketServer} from 'ws'
let wsServer = null;

export function initWebSocket() {
    // Integriamo il WebSocket Server sullo stesso server HTTP

    wsServer = new WebSocketServer( {port: process.env.WS_PORT, path:"/ws"});

    wsServer.on('connection', (ws) => {
        console.log('Nuovo client connesso');

        ws.on('message', (message) => {
            console.log(`Messaggio ricevuto: ${JSON.parse(message)}`);
            // Esempio: invio di un echo del messaggio
            ws.send(`Echo: ${message}`);
        });

        ws.on('close', () => {
            console.log('Client disconnesso');
        });
    });
    return wsServer;
}



export function setWSServer(server) {
    console.log(`> Setting WS server`)
    wsServer = server;
}

export function getWSServer() {
    console.log(`> Getting WS server`);
    return wsServer;
}