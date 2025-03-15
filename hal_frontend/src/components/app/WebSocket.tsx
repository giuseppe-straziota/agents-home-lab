
import {useEffect} from "react";

const WebSocketCmp = ({ children }: { children: React.ReactNode}) =>{

    const socket = new WebSocket('ws://localhost:3006/ws');

    function sendMessage(message:  string | ArrayBufferLike | Blob | ArrayBufferView) {
        console.log('sendMessage', message)
        socket.send(message);
    }

    useEffect(() => {

        socket.onopen = function(event) {
            // Handle connection open
            console.log('onopen', event);
            sendMessage(JSON.stringify({test: Date.now()}))
        };

        socket.onmessage = function(event) {
            // Handle received message
            console.log('onmessage', event)
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
        <div>
            {children}
        </div>
    )
}

export default WebSocketCmp;

