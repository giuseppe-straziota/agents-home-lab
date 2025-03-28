import { toast } from "sonner"
import { useEffect } from "react";
import WSContext from "./WebsocketContext";


const WebSocketCmp = ({ children }: { children: React.ReactNode}) =>{

    const socket = new WebSocket('ws://localhost:3006/ws');

    const sendWSMessage = (message: string | ArrayBufferLike | Blob | ArrayBufferView): void=> {
        console.log('sendMessage', message)
        socket.send(message);
    }

    useEffect(() => {

        socket.onopen = function(event) {
            // Handle connection open
            console.log('onopen', event);
            sendWSMessage(JSON.stringify({test: Date.now()}))
            toast("websocket message sended")
        };

        socket.onmessage = function(event) {
            // Handle received message
            console.log('onmessage', event)
            toast(event.data)
        };

        socket.onclose = function(event) {
            // Handle connection close
            console.log('onclose', event)
        };

        return ()=>{
            console.log('closed')
        }
    },[]);

    return (
        <WSContext.Provider value={ {sendWSMessage} }>
            {children}
        </WSContext.Provider>
    )
}

export default WebSocketCmp;

