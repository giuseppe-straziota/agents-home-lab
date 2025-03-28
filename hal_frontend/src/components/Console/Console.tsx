
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendHorizonal } from "lucide-react";
import { useContext, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge"
import WSContext from "@/components/app/Websocket/WebsocketContext";

export default function Console() {
    const {sendWSMessage}  = useContext(WSContext)
    const [messages, setMessages] = useState([
        { id: 1, text: "Ciao, come posso aiutarti?", sender: "bot" },
        { id: 2, text: "Vorrei sapere qualcosa su...", sender: "user" },
    ]);
    const [input, setInput] = useState("");

    const sendMessage = () => {
        if (input.trim() === "") return;
        setMessages([...messages, { id: Date.now(), text: input, sender: "user" }]);
        sendWSMessage(JSON.stringify({text: input.trim(), agent:"alfred"}));
        setInput("");
    };

    function getCardPosition(role: string) {
        if (role==='user'){
            return 'items-end';
        }
        return 'items-start '
    }

    return (
        <div className="flex-none flex flex-col  grow bg-zinc-800">
            <ScrollArea className="grow h-40 h-30 pb-2">
                {messages.map((msg) => (
                    <div key={msg.id} className={cn(getCardPosition(msg.sender),'flex gap-3 my-3 w-full flex-col px-5 ')  }>
                        {msg.sender !== 'user' && <Badge>{msg.sender}</Badge>}
                        <div className="bg-muted rounded-xl p-3 shadow-sm">
                            {msg.text}
                        </div>
                    </div>
                ))}
            </ScrollArea>
            <div className="flex flex-row text-zinc-300 pb-2 pl-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Scrivi un messaggio..."
                />
                <Button onClick={sendMessage} className="mx-2">
                    <SendHorizonal className="w-4 h-4" />
                </Button>
            </div>
        </div>

    );
}
