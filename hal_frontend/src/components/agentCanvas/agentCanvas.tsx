
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    Node
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {useEffect} from "react";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";
const initialNodes = [
    {
        id: 'prompts',
        sourcePosition: 'right',
        type: 'group',
        data: { label: 'prompts' },
        position: { x: 0, y: 80 },
    },
    {
        id: 'tools',
        sourcePosition: 'right',
        type: 'group',
        data: { label: 'tools' },
        position: { x: 0, y: 80 },
    },
    {
        id: 'LLM',
        sourcePosition: 'right',
        type: 'group',
        data: { label: 'LLM' },
        position: { x: 0, y: 80 },
    },
    {
        id: 'horizontal-2',
        type: 'default',
        sourcePosition: 'bottom',
        targetPosition: 'top',
        data: { label: 'Alfred' },
        position: { x: 250, y: 0 },
    },
    {
        id: 'horizontal-3',
        sourcePosition: 'top',
        targetPosition: 'bottom',
        data: { label: 'Node 3' },
        position: { x: 250, y: 160 },
    },
    {
        id: 'horizontal-4',
        sourcePosition: 'right',
        targetPosition: 'left',
        data: { label: 'Node 4' },
        position: { x: 500, y: 0 },
    },
    {
        id: 'horizontal-5',
        sourcePosition: 'top',
        targetPosition: 'bottom',
        data: { label: 'Node 5' },
        position: { x: 500, y: 100 },
    },
    {
        id: 'horizontal-6',
        sourcePosition: 'bottom',
        targetPosition: 'top',
        data: { label: 'Node 6' },
        position: { x: 500, y: 230 },
    },
    {
        id: 'horizontal-7',
        sourcePosition: 'right',
        targetPosition: 'left',
        data: { label: 'Node 7' },
        position: { x: 750, y: 50 },
    },
    {
        id: 'horizontal-8',
        sourcePosition: 'right',
        targetPosition: 'left',
        data: { label: 'Node 8' },
        position: { x: 750, y: 300 },
    },
] as Node[];

const initialEdges = [
    {
        id: 'horizontal-e1-2',
        source: 'prompts',
        type: 'smoothstep',
        target: 'horizontal-2',
        animated: true,
    },
    {
        id: 'horizontal-e1-3',
        source: 'horizontal-3',
        type: 'smoothstep',
        target: 'horizontal-2',
        animated: true,
    },
    {
        id: 'horizontal-e1-4',
        source: 'horizontal-2',
        type: 'smoothstep',
        target: 'horizontal-4',
        label: 'edge label',
    },
    {
        id: 'horizontal-e3-5',
        source: 'horizontal-3',
        type: 'smoothstep',
        target: 'horizontal-5',
        animated: true,
    },
    {
        id: 'horizontal-e3-6',
        source: 'horizontal-3',
        type: 'smoothstep',
        target: 'horizontal-6',
        animated: true,
    },
    {
        id: 'horizontal-e5-7',
        source: 'horizontal-5',
        type: 'smoothstep',
        target: 'horizontal-7',
        animated: true,
    },
    {
        id: 'horizontal-e6-8',
        source: 'horizontal-6',
        type: 'smoothstep',
        target: 'horizontal-8',
        animated: true,
    },
];
export default function AgentCanvas(){
    const [nodes, _, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    useEffect(() => {
        console.log(_, setEdges)
    }, []);

    return (
        <div className={'h-2/3'}>
            <ReactFlow
                fitView
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                attributionPosition="bottom-left"
                nodes={nodes} edges={edges}>
                <Background />
                <Controls />
                <MiniMap
                    nodeStrokeColor={(n) => {
                        if (n.type === 'input') return '#0041d0';
                        if (n.type === 'selectorNode') return '#c9f1dd';
                        if (n.type === 'output') return '#ff0072';
                        return '#23ef3e'
                    }}

                    nodeColor={(n) => {
                        if (n.type === 'selectorNode') return '#081c87';
                        return '#f8c0c0';
                    }}
                />
            </ReactFlow>
            <Sheet open={false}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>ttt</SheetTitle>
                        <SheetDescription>
                              form
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </div>
    )
}