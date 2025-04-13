
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendHorizonal } from "lucide-react";
import {useContext, useEffect, useRef, useState} from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import WSContext from "@/components/app/Websocket/WebsocketContext";
import {useDispatch, useSelector} from "react-redux";
import {AgentsModel, RootState} from "typesafe-actions";
import {Message} from "@/store/types";
import {loadAgentMsgAsync, setProcessingAct} from "@/components/agentCanvas/data/agents_actions.ts";
import MarkdownPreview from "@uiw/react-markdown-preview";
import {Label} from "@radix-ui/react-dropdown-menu";

export default function Console() {
    const dispatch = useDispatch();
    const {sendWSMessage}  = useContext(WSContext);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const selectedAgentUuid: string = useSelector<RootState, string>((state: RootState) => state.agents.selected);
    const selectedAgentMsg: Message[] = useSelector<RootState, Message[]>((state: RootState) => state.agents.selectedMsg);
    const lastAgentMsg: Message = useSelector<RootState, Message>((state: RootState) => state.agents.lastAgentMsg);
    const listOfAgents: AgentsModel = useSelector<RootState, AgentsModel>((state: RootState) => state.agents.list);
    const [disableSendMsg, setDisableSendMsg] = useState<boolean>(false);
    const [waiting, setWaiting] = useState<boolean>(false);
    const viewportRef = useRef<HTMLDivElement>(null);

    const sendMessage = () => {
        if (input.trim() === "" ) return;
        const message: Message = {
            agent_uuid:selectedAgentUuid,
            content: input,
            role: "user",
            timestamp: Date.now(),
        };
        setMessages([...messages, message]);
        sendWSMessage(JSON.stringify({channel:"chat",payload:message}));
        setInput("");
        dispatch(setProcessingAct("chat"));
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
        if (!selectedAgentUuid) return;
        dispatch(loadAgentMsgAsync.request({agent_uuid:selectedAgentUuid}));
        scrollToBottom();
        setWaiting(false);
        const agent =listOfAgents
            .find((agent)=> agent.uuid === selectedAgentUuid);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        agent && setDisableSendMsg(!agent!.active);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAgentUuid]);

    useEffect(() => {
        const agent =listOfAgents
            .find((agent)=> agent.uuid === selectedAgentUuid);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        agent && setDisableSendMsg(!agent!.active);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listOfAgents]);

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
        <div className=" h-full flex flex-col    bg-zinc-900">
            <ScrollArea className="grow h-30 pb-1"  viewportRef={viewportRef}>
                {messages.map((msg) => (
                        <div key={msg.timestamp} className={cn(getMsgPosition(msg.role),"flex w-full flex-col pl-5 pr-15 ")  }>
                        {msg.role !== "user" && <Badge  className={"bg-zinc-500 border-1 border-zinc-400"}>
                          <Label className={"mb-1"}> {msg.role}</Label>
                        </Badge>}
                           {/*<Label className=" text-zinc-400 p-3 text-left "> {msg.content}</Label>*/}
                            <MarkdownPreview style={{background:"oklch(0.21 0.006 285.885)"}} source={msg.content}  className="bg-zinc-900 text-zinc-400 p-3 text-left " />
                        </div>
                ))}
                {waiting && <div className="loader ml-15 my-2"/>}
            </ScrollArea>
            <div className="flex flex-row text-zinc-300 pb-2 pl-2">
                <Input className={"bg-zinc-800"}
                    value={input}
                    disabled={disableSendMsg}
                    onChange={(e) => {
                        setInput(e.target.value);
                    }}
                    placeholder={disableSendMsg?"The agent is not available...":"Send a message..."}
                />
                <Button
                    disabled={disableSendMsg}
                    onClick={sendMessage} className="mx-2 hover:bg-zinc-800">
                    <SendHorizonal className="w-4 h-4" />
                </Button>
            </div>
        </div>

    );
}
