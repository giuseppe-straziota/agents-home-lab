

import AgentFlow from "@/components/agentCanvas/agentFlow.tsx";

import Console from "@/components/Console/Console.tsx";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";


export default function CenterPanel() {
    return (
            <div className=" grow w-200 bg-zinc-900 p-3 h-full">
                <ResizablePanelGroup direction="vertical" >
                    <ResizablePanel  minSize={40}><AgentFlow/></ResizablePanel>
                    <ResizableHandle withHandle/>
                    <ResizablePanel > <Console /></ResizablePanel>
                </ResizablePanelGroup>
            </div>
    );
}

