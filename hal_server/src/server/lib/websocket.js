import {WebSocketServer} from 'ws'
import {wsChannelManager} from "../lib/utils.js";

let wsServer;

export class GlobalWS {

         constructor(){
             console.log("GlobalWS constructor called");
            if (!wsServer) {
                console.log("creation of a new Websocket server");
                wsServer = new WebSocketServer( {port: 3006, path:"/ws"});
                wsServer.on('connection', (ws) => {
                    console.log('New client connected');

                    ws.on('message', (message) => {
                        const content = JSON.parse(message);
                        wsChannelManager(ws, content);
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






