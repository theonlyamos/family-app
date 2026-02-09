"use client"

import { useCallback } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
    { id: '1', position: { x: 250, y: 0 }, data: { label: 'Grandfather' } },
    { id: '2', position: { x: 450, y: 0 }, data: { label: 'Grandmother' } },
    { id: '3', position: { x: 350, y: 100 }, data: { label: 'Father' } },
    { id: '4', position: { x: 150, y: 100 }, data: { label: 'Mother' } },
    { id: '5', position: { x: 250, y: 200 }, data: { label: 'Son' } },
    { id: '6', position: { x: 450, y: 200 }, data: { label: 'Daughter' } },
];

const initialEdges = [
    { id: 'e1-3', source: '1', target: '3', animated: true },
    { id: 'e2-3', source: '2', target: '3', animated: true },
    { id: 'e3-5', source: '3', target: '5' },
    { id: 'e4-5', source: '4', target: '5' },
    { id: 'e3-6', source: '3', target: '6' },
    { id: 'e4-6', source: '4', target: '6' },
];

export default function RelationshipsPage() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    return (
        <div className="h-[calc(100vh-10rem)] w-full border rounded-md">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Controls />
                <MiniMap />
                <Background gap={12} size={1} />
            </ReactFlow>
        </div>
    );
}
