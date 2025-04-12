import {
    applyNodeChanges,
    Background,
    Controls, Edge,
    MiniMap,
    Node,
    OnNodesChange,
    ReactFlow, ReactFlowInstance,
    useEdgesState
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {AgentNode} from "./customComponents/AgentNode.tsx";
import {GroupNode} from "./customComponents/GroupNode.tsx";
import {BasicNode} from "./customComponents/BasicNode.tsx";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";
import {useSelector} from "react-redux";
import {AgentsModel, RootState} from "typesafe-actions";
import {createAgentStructure, getEdges} from "@/components/agentCanvas/utils/structure.ts";
import {DynamicFormTool} from "@/components/agentCanvas/utils/form/dynamicFormTool.tsx";
import {DynamicFormLlm} from "@/components/agentCanvas/utils/form/dynamicFormLlm.tsx";


export default function AgentFlow() {
    const flowRef = useRef<ReactFlowInstance<Node, Edge>>(undefined);
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
        (changes) => {
            setNodes((nds) => applyNodeChanges(changes, nds));

        }, [setNodes],
    );
    const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
    const listOfAgents: AgentsModel = useSelector<RootState, AgentsModel>((state: RootState) => state.agents.list);
    const selectedAgent: string = useSelector<RootState, string>((state: RootState) => state.agents.selected);
    const processingState: string = useSelector<RootState, string>((state: RootState) => state.agents.processingState);
    const [nodeSelected, setNodeSelected] = useState<Node>();
    const [processing, setProcessing] = useState<string | undefined>(undefined);

    const getStructure = useCallback((): Node[] => {
        const structure = [] as Node[];
        listOfAgents
            .filter((agent) => agent.uuid === selectedAgent)
            .map(createAgentStructure.bind(null, processing, structure));
        return structure as Node[];
    }, [listOfAgents, selectedAgent, processing]);

    useEffect(() => {
        setProcessing(processingState);
        setNodes(getStructure());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processingState]);

    useEffect(() => {
        setNodes(getStructure());
        setEdges(getEdges());
        if (flowRef.current) {
            flowRef.current.fitView({
                padding: 0.1,
                includeHiddenNodes: false,
                minZoom: 0.1,
                maxZoom: 1,
                duration: 200,
                nodes: [{id: "agent"}, {id: "group_tools"}, {id: "group_llms"}, {id: "group_trigger"}],
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAgent]);

    useEffect(() => {
        setNodes(getStructure());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listOfAgents,processing]);

    return (
        <div className={"h-full"}>
            <ReactFlow
                onInit={(instance) => {
                    flowRef.current = instance;
                }}
                fitView={true}
                onNodeClick={(event, node) => {
                    console.log(event, node);
                    if (node.type !== "groupNode" && !["chat", "agent"].includes(node.id)) {
                        setOpenSheet(!openSheet);
                        setNodeSelected(node);
                    }
                }}
                colorMode={"dark"}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                attributionPosition="bottom-left"
                nodes={nodes}
                edges={edges}>
                <Background/>
                <Controls position={"top-center"} orientation={"horizontal"}/>
                <MiniMap pannable={true} zoomable={true} zoomStep={1}
                         bgColor={"oklch(0.446 0.03 256.802)"}
                         nodeStrokeColor={(n) => {
                             if (n.type === "input") return "#0041d0";
                             if (n.type === "selectorNode") return "#c9f1dd";
                             if (n.type === "agentNode") return "#addd4e";
                             return "#162318";
                         }}
                         nodeColor={(n) => {
                             if (n.style) {
                                 return n.style.backgroundColor as string;
                             }
                             return "#fdc4c4";
                         }}
                />
            </ReactFlow>
            <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                <SheetContent className={"bg-zinc-800 mb-2 text-zinc-300  overflow-y-auto"}>
                    <SheetHeader>
                        <SheetTitle className={"text-zinc-300"}>Configure</SheetTitle>
                        <SheetDescription>
                        </SheetDescription>
                    </SheetHeader>
                    {nodeSelected && nodeSelected!.data.type === "tools" &&
                        <DynamicFormTool value={nodeSelected} setOpenSheet={setOpenSheet}/>}
                    {nodeSelected && nodeSelected!.data.type === "llms" &&
                        <DynamicFormLlm value={nodeSelected} setOpenSheet={setOpenSheet}/>}
                </SheetContent>
            </Sheet>
        </div>
    );
}