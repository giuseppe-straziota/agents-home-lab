import {Node, NodeProps} from "@xyflow/react";

export function BasicNode({data}: NodeProps<Node<{ label: string, processing: boolean }, "label">>) {
    return (
        <div className={"bg-zinc-300 p-2 flex flex-row rounded-lg shadow-sm border-1"}>
            {data.processing &&
             <span className="absolute left-1 top-1 flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-sky-500"> </span>
            </span>
            }
            <label className={"text-zinc-800"}>{data.label}</label>
        </div>
    );
}