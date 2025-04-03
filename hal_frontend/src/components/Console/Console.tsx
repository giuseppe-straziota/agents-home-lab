
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendHorizonal } from "lucide-react";
import {useContext, useEffect, useRef, useState} from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import WSContext from "@/components/app/Websocket/WebsocketContext";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "typesafe-actions";
import { Label } from "../ui/label";
import {Message} from "@/store/types";
import {loadAgentMsgAsync} from "@/components/agentCanvas/data/agents_actions.ts";

export default function Console() {
    const dispatch = useDispatch();
    const {sendWSMessage}  = useContext(WSContext);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const selectedAgentUuid: string = useSelector<RootState, string>((state: RootState) => state.agents.selected);
    const selectedAgentMsg: Message[] = useSelector<RootState, Message[]>((state: RootState) => state.agents.selectedMsg);
    const lastAgentMsg: Message = useSelector<RootState, Message>((state: RootState) => state.agents.lastAgentMsg);
    const [waiting, setWaiting] = useState<boolean>(false);
    const viewportRef = useRef<HTMLDivElement>(null);

    const sendMessage = () => {
        if (input.trim() === "" ) return;
        const message: Message = {
            agent_uuid:selectedAgentUuid,
            content: input,
            sender: "user",
            timestamp: Date.now(),
        };
        setMessages([...messages, message]);
        sendWSMessage(JSON.stringify({channel:"chat",payload:message}));
        setInput("");
        setWaiting(true);
        scrollToBottom();
    };

    function scrollToBottom() {
        setTimeout(() => {
            if (viewportRef !== null && viewportRef.current !== null) {
                if (viewportRef.current &&
                    viewportRef.current.childNodes[0] &&
                    viewportRef.current.childNodes[0].lastChild){
                    // @ts-expect-error childnode error
                    viewportRef.current.childNodes[0].lastChild!.scrollIntoView({"behavior":"smooth"});
                }
            }
        }, 1000);
    }

    function getMsgPosition(role: string) {
        if (role==="user"){
            return "items-end";
        }
        return "items-start ";
    }


    useEffect(() => {
        console.log("selectedAgentUuid changed", selectedAgentUuid);
        if (!selectedAgentUuid) return;
        dispatch(loadAgentMsgAsync.request({agent_uuid:selectedAgentUuid}));
        scrollToBottom();
        setWaiting(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAgentUuid]);

    useEffect(() => {
        setMessages([...selectedAgentMsg]);
        scrollToBottom();
    }, [selectedAgentMsg]);

    useEffect(() => {
        messages.push(lastAgentMsg);
        setMessages([...messages]);
        setWaiting(false);
        scrollToBottom();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastAgentMsg]);

    return (
        <div className="flex-none flex flex-col  grow bg-zinc-900">
            <ScrollArea className="grow h-30 pb-1"  viewportRef={viewportRef}>
                {messages.map((msg) => (
                        <div key={msg.timestamp} className={cn(getMsgPosition(msg.sender),"flex w-full flex-col pl-5 pr-15 ")  }>
                        {msg.sender !== "user" && <Badge className={"bg-zinc-500 border-1 border-zinc-400"}>{msg.sender}</Badge>}
                           <Label className=" text-zinc-400 p-3  "> {msg.content}</Label>
                        </div>
                ))}
                {waiting && <div className="loader ml-15 my-2"/>}
            </ScrollArea>
            <div className="flex flex-row text-zinc-300 pb-2 pl-2">
                <Input className={"bg-zinc-800"}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Scrivi un messaggio..."
                />
                <Button onClick={sendMessage} className="mx-2 hover:bg-zinc-800">
                    <SendHorizonal className="w-4 h-4" />
                </Button>
            </div>
        </div>

    );
}
