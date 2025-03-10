
import {useEffect} from "react";
import {loadAgentAsync} from "@/components/agentCanvas/data/agents_actions.ts";
import {useDispatch} from "react-redux";
import {loadSettingsAsync} from "@/data/actions.ts";

const WebSocketCmp = ({ children }: { children: React.ReactNode}) =>{

    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(loadAgentAsync.request());
        dispatch(loadSettingsAsync.request());

        const socket = new WebSocket('ws://localhost:3006/ws');

        socket.onopen = function(event) {
            // Handle connection open
            console.log('onopen');
            sendMessage(JSON.stringify({test: Date.now()}))
        };

        socket.onmessage = function(event) {
            // Handle received message
            console.log('onmessage')
        };

        socket.onclose = function(event) {
            // Handle connection close
            console.log('onclose')
        };

        function sendMessage(message: any) {
            console.log('sendMessage', message)
            socket.send(message);
        }
    },[]);

    return (
        <> {children}
        </>
    )
}

export default WebSocketCmp;

