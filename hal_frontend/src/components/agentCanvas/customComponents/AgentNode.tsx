import {Handle, NodeTypes, Position} from "@xyflow/react";
import {BotIcon} from "lucide-react";


export function AgentNode({data}:NodeTypes) {

    return (
        <div  className={"bg-zinc-300 p-2 rounded-lg shadow-sm border-1 min-w-40"}>
            <Handle type="target" position={Position.Left} />
            <div className={" flex flex-col"}>
                <BotIcon className={"self-end"}/>
                <label>{data.label}</label>
            </div>
            <Handle type="source" position={Position.Bottom} id={"s1"}   />
            <Handle type="source" position={Position.Right}  id={"s2"} />
        </div>
    );
}