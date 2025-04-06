import {Node, NodeProps} from "@xyflow/react";

export function BasicNode({data}:NodeProps< Node<{label:string}, "label">>) {

    return (
        <div  className={"bg-zinc-300 p-2 rounded-lg shadow-sm border-1"}>
            <div>
                <label>{data.label}</label>
            </div>
        </div>
    );
}