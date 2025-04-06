import {Node, Position} from "@xyflow/react";
import {Agent} from "@/store/types";

interface Edge {
    id: string;
    source: string;
    type: string;
    target: string;
}

export const createAgentStructure =  ( structure: Node[], agent: Agent) => {
    structure.push( {
        id: "agent",
        type: "agentNode",
        sourcePosition: Position.Bottom,
        targetPosition: Position.Left,
        data: { label: agent.name },
        position: { x: 250, y: 0 },
    });
    structure.push( {
        id: "group_trigger",
        type: "groupNode",
        data: {
            label: "trigger",
            backgroundColor: "bg-purple-400/20",
            type: "source",
            position: Position.Right,
        },
        resizing: true,
        position: { x: 0, y: 0 },
        style: {
            backgroundColor: "rgba(255, 0, 255, 0.2)",
            height: 100,
            width: 170,
            borderBottomRightRadius: 5,
            borderBottomLeftRadius: 5
        },
    });
    structure.push( {
        id: "chat",
        expandParent:true,
        resizing: true,
        parentId: "group_trigger",
        data: { label: "chat" },
        position: { x: 20, y: 30 },
        extent: "parent",
        type: "basicNode"
    });
    if (agent.llms.length > 0) {
        structure.push( {
            id: "group_llms",
            type: "groupNode",
            data: {
                label: "llms",
                backgroundColor:"bg-green-800/20",
                type: "target",
                position: Position.Left,},
            resizing: true,
            position: { x: 500, y: 0 },
            style: {
                backgroundColor: "rgba(48,89,47,0.3)",
                height: 50*agent.llms.length + 50,
                width: 170,
                borderBottomRightRadius: 5,
                borderBottomLeftRadius: 5
            },
        });
        agent.llms.forEach((llm, index:number) => {
            structure.push( {
                id: llm.llm_uuid as unknown as string,
                data: { label: llm.llm_name, type:"llms" ,name: llm.llm_name, uuid: llm.llm_uuid,...llm.llm_config},
                position: { x: 20, y: 20*(index+1)},
                parentId: "group_llms",
                extent: "parent",
                type: "basicNode",
                expandParent:true,
                resizing: true,
            });
        });
    }
    if (agent.tools.length > 0) {
        structure.push({
            id: "group_tools",
            type: "groupNode",
            targetPosition: Position.Top,
            data: { label: "tools",backgroundColor: "bg-orange-500/20",
                type: "target",
                position: Position.Left, },
            resizing: true,
            position: { x: 300, y: 200 },
            style: {
                backgroundColor: "rgba(248,146,103,0.3)",
                height: 50*agent.tools.length + 50,
                width: 170,
                borderBottomRightRadius: 5,
                borderBottomLeftRadius: 5
            },
        });
        agent.tools.forEach((tool, index: number) => {
            structure.push( {
                id: tool.tool_uuid as unknown as string,
                expandParent:true,
                resizing: true,
                data: { label: tool.tool_config!.tool_name, type:"tools", name: tool.tool_name},
                position: { x: 20, y: 20+(50*index) },
                parentId: "group_tools",
                extent: "parent",
                type: "basicNode"
            });
        });
    }

};

export const getEdges  = ()=>{
    return   [
        {
            id: "agent_chat",
            source: "group_trigger",
            type: "smoothstep",
            target: "agent",
        },
        {
            id: "agent_tool",
            sourceHandle: "s1",
            source: "agent",
            type: "smoothstep",
            target: "group_tools",
        },
        {
            id: "agent_llm",
            sourceHandle: "s2",
            source: "agent",
            type: "smoothstep",
            target: "group_llms",
        }
    ] as Edge[]  ;
};