import './App.css'
import Layout from "@/components/app/layout.tsx";
import {ChatBubble, ChatBubbleAvatar, ChatBubbleMessage} from './components/ui/chat/chat-bubble';
import {ChatMessageList} from "@/components/ui/chat/chat-message-list.tsx";
import { ChatInput } from './components/ui/chat/chat-input';
import {Button} from "@/components/ui/button.tsx";
import {CornerDownLeft, Paperclip} from "lucide-react";
import { useSelector} from "react-redux";
import AgentCanvas from "@/components/agentCanvas/AgentCanvas.tsx";
import WebSocketCmp from "@/components/app/WebSocket.tsx"
import {useEffect, useState} from "react";
import { RootState } from 'MyTypes';


function App() {
    const [configuration, setConfiguration] = useState([]);
    const settings = useSelector((state: RootState)=> state.settings.list);
    useEffect(() => {
        setConfiguration(settings);
    }, [settings]);

  return (
            <WebSocketCmp>
        <Layout>
                <div className="grid-rows-4 " >
                    {
                        configuration.map((conf: { value: string, name: string }) =>
                            <div className="bg-gray-400" key={conf.name}>{conf.name}:{conf.value}</div>)

                    }
                    <AgentCanvas />
                    <ChatMessageList>
                        <ChatBubble variant='sent'>
                            <ChatBubbleAvatar fallback='US' />
                            <ChatBubbleMessage variant='sent'>
                                Hello, how has your day been? I hope you are doing well.
                            </ChatBubbleMessage>
                        </ChatBubble>

                        <ChatBubble variant='received'>
                            <ChatBubbleAvatar fallback='AI' />
                            <ChatBubbleMessage variant='received'>
                                Hi, I am doing well, thank you for asking. How can I help you today?
                            </ChatBubbleMessage>
                        </ChatBubble>

                        <ChatBubble variant='received'>
                            <ChatBubbleAvatar fallback='AI' />
                            <ChatBubbleMessage isLoading />
                        </ChatBubble>
                    </ChatMessageList>
                    <form
                        className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
                    >
                        <ChatInput
                            placeholder="Type your message here..."
                            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
                        />
                        <div className="flex items-center p-3 pt-0">
                            <Button variant="ghost" size="icon">
                                <Paperclip className="size-4" />
                                <span className="sr-only">Attach file</span>
                            </Button>

                            <Button
                                size="sm"
                                className="ml-auto gap-1.5"
                            >
                                Send Message
                                <CornerDownLeft className="size-3.5" />
                            </Button>
                        </div>
                    </form>

                </div>
            </Layout>
</WebSocketCmp>

  )
}

export default App
