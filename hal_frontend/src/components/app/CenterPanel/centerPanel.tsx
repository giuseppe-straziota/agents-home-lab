
import {CornerDownLeft, Paperclip} from "lucide-react";
import AgentCanvas from "@/components/agentCanvas/AgentCanvas.tsx";
import {ChatMessageList} from "@/components/ui/chat/chat-message-list.tsx";
import {ChatBubble, ChatBubbleAvatar, ChatBubbleMessage} from "@/components/ui/chat/chat-bubble.tsx";
import {ChatInput} from "@/components/ui/chat/chat-input.tsx";
import {Button} from "@/components/ui/button.tsx";


export default function CenterPanel() {
    return (
            <div className="grow w-200 bg-gray-100  p-3">
                <AgentCanvas/>
                <div>
                    <ChatMessageList>
                        <ChatBubble variant='sent'>
                            <ChatBubbleAvatar fallback='US'/>
                            <ChatBubbleMessage variant='sent'>
                                Hello, how has your day been? I hope you are doing well.
                            </ChatBubbleMessage>
                        </ChatBubble>

                        <ChatBubble variant='received'>
                            <ChatBubbleAvatar fallback='AI'/>
                            <ChatBubbleMessage variant='received'>
                                Hi, I am doing well, thank you for asking. How can I help you today?
                            </ChatBubbleMessage>
                        </ChatBubble>

                        <ChatBubble variant='received'>
                            <ChatBubbleAvatar fallback='AI'/>
                            <ChatBubbleMessage isLoading/>
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
                                <Paperclip className="size-4"/>
                                <span className="sr-only">Attach file</span>
                            </Button>

                            <Button
                                size="sm"
                                className="ml-auto gap-1.5"
                            >
                                Send Message
                                <CornerDownLeft className="size-3.5"/>
                            </Button>
                        </div>
                    </form>
                </div>


            </div>
    )
}

