import {
    applyNodeChanges,
    Background,
    Controls,
    MiniMap,
    Node,
    OnNodesChange,
    ReactFlow,
    useEdgesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {AgentNode} from "./customComponents/AgentNode.tsx";
import {GroupNode} from "./customComponents/GroupNode.tsx";
import {BasicNode} from "./customComponents/BasicNode.tsx";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";
import {useSelector} from "react-redux";
import {AgentsModel, RootState} from "typesafe-actions";
import {createAgentStructure, getEdges} from "@/components/agentCanvas/utils/structure.ts";
import {DynamicForm} from "@/components/agentCanvas/utils/dynamicForm.tsx";


export default function AgentCanvas(){
    const flowRef = useRef();
    const nodeTypes = useMemo(() => (
        {
            agentNode: AgentNode,
            groupNode: GroupNode,
            basicNode: BasicNode
        }
    ), []);
    const [openSheet, setOpenSheet] = useState<boolean>(false);
    const [nodes, setNodes] = useState<Node[]>([]);
    const onNodesChange: OnNodesChange = useCallback(
        (changes) =>
        {
            setNodes((nds) => applyNodeChanges(changes, nds))
            flowRef.current.fitView({
                padding: 0.1,
                includeHiddenNodes: false,
                minZoom: 0.1,
                maxZoom: 1,
                duration: 200,
                nodes: [{id: 'agent'},{id: 'group_tools'},{id: 'group_llms'},{id: 'group_trigger'}],
            })
        }, [setNodes],
    );
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const listOfAgents: AgentsModel = useSelector<RootState, AgentsModel>((state: RootState) => state.agents.list)
    const selectedAgent: string = useSelector<RootState, string>((state: RootState) => state.agents.selected)
    const [nodeSelected, setNodeSelected] = useState({});

    const getStructure = useCallback((): Node[] => {
    const structure = [] as Node[];
        listOfAgents
            .filter((agent)=> agent.uuid === selectedAgent)
            .map(createAgentStructure.bind(null, structure))

    return structure as Node[]
    },[listOfAgents, selectedAgent])


    useEffect(() => {
        setNodes(getStructure())
        setEdges(getEdges());
    }, [selectedAgent]);

    useEffect(() => {
        setNodes(getStructure())
    }, [listOfAgents]);

    return (
        <div className={'h-2/3'}>
            <ReactFlow onInit={(instance)=>{
                flowRef.current = instance
            }}
                fitView={true}

                onNodeClick={(event, node)=>{
                    console.log(event,node);
                    if (node.type !== 'groupNode') {
                        setOpenSheet(!openSheet)
                        setNodeSelected(node);
                    }
                }}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                attributionPosition="bottom-left"
                nodes={nodes} edges={edges}>
                <Background />
                <Controls />
                <MiniMap
                    nodeStrokeColor={(n) => {
                        if (n.type === 'input') return '#0041d0';
                        if (n.type === 'selectorNode') return '#c9f1dd';
                        if (n.type === 'agentNode') return '#addd4e';

                        return '#162318'
                    }}

                    nodeColor={(n) => {
                        //if (n.type === 'agentNode') return '#8091ed';
                        if (n.style) {
                            return n.style.backgroundColor as string;
                        }
                        return '#fdc4c4';
                    }}
                />
            </ReactFlow>
            <Sheet open={openSheet} onOpenChange={setOpenSheet} >
                <SheetContent >
                    <SheetHeader>
                        <SheetTitle>ttt</SheetTitle>
                        <SheetDescription>
                        </SheetDescription>
                    </SheetHeader>
                    <DynamicForm node={{value: nodeSelected}} />
                </SheetContent>
            </Sheet>
        </div>
    )
}