

import AgentCanvas from "@/components/agentCanvas/agentCanvas.tsx";

import {Separator} from "@/components/ui/separator.tsx";
import Console from "@/components/Console/Console.tsx";


export default function CenterPanel() {
    return (
            <div className="grow w-200 bg-sky-50 p-3">
                <AgentCanvas/>
                <Separator className={'my-4 bg-purple-200'}/>
                <Console />


            </div>
    )
}

