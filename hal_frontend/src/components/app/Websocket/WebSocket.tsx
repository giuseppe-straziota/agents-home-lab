import { toast } from "sonner";
import { useEffect } from "react";
import WSContext from "./WebsocketContext";
import {useDispatch} from "react-redux";
import {setLastAgentMsgAct} from "@/components/agentCanvas/data/agents_actions.ts";


const WebSocketCmp = ({ children }: { children: React.ReactNode}) =>{
    const dispatch = useDispatch();
    const socket = new WebSocket("ws://localhost:3006/ws");

    const sendWSMessage = (message: string | ArrayBufferLike | Blob | ArrayBufferView): void=> {
        console.log("sendMessage", message);
        socket.send(message);
    };

    useEffect(() => {

        socket.onopen = function(event) {
            // Handle connection open
            console.log("onopen", event);
            sendWSMessage(JSON.stringify({test: Date.now()}));
            toast("websocket message sended");
        };

        socket.onmessage = function(event) {
            // Handle received message
            console.log("onmessage", event);
            toast(event.data);
            const eventParsed = JSON.parse(event.data);
            if (eventParsed.channel === "chat"){
                dispatch(setLastAgentMsgAct(eventParsed.payload));
            }
        };

        socket.onclose = function(event) {
            // Handle connection close
            console.log("onclose", event);
        };

        return ()=>{
            console.log("closed");
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    return (
        <WSContext.Provider value={ {sendWSMessage} }>
            {children}
        </WSContext.Provider>
    );
};

export default WebSocketCmp;

