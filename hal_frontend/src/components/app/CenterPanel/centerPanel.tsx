

import AgentCanvas from "@/components/agentCanvas/agentCanvas.tsx";

import {Separator} from "@/components/ui/separator.tsx";
import Console from "@/components/Console/Console.tsx";


export default function CenterPanel() {
    return (
            <div className="flex flex-col grow w-200 bg-zinc-900 p-3 h-full">
                <AgentCanvas/>
                <Separator className={'my-4 bg-purple-200 flex-none '}/>
                <Console />
            </div>
    )
}

