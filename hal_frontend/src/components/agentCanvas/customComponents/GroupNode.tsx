import {Handle, HandleType, Node, NodeProps, Position} from "@xyflow/react";


export function GroupNode({data}:NodeProps< Node<{
    type:HandleType,
    position: Position,
    backgroundColor: string,
    label:string}, "group">>) {
    return (
        <div>
            <Handle type={data.type} position={data.position} />
            <div className={`relative float-right -top-6 w-full text-right ${data.backgroundColor} rounded-tl-lg`}>
                <label className={"p-2 text-zinc-500"}>{data.label.toUpperCase()}</label>
            </div>
        </div>
    );
}