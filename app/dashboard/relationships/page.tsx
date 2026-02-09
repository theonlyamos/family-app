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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";

const initialNodes = [
    { 
        id: '1', 
        position: { x: 250, y: 0 }, 
        data: { label: 'Grandfather' },
        style: { 
            background: 'oklch(0.94 0.02 145)', 
            border: '1px solid oklch(0.88 0.02 145)',
            borderRadius: '12px',
            padding: '10px 20px',
            fontWeight: 500
        }
    },
    { 
        id: '2', 
        position: { x: 450, y: 0 }, 
        data: { label: 'Grandmother' },
        style: { 
            background: 'oklch(0.94 0.02 145)', 
            border: '1px solid oklch(0.88 0.02 145)',
            borderRadius: '12px',
            padding: '10px 20px',
            fontWeight: 500
        }
    },
    { 
        id: '3', 
        position: { x: 350, y: 150 }, 
        data: { label: 'Father' },
        style: { 
            background: 'oklch(0.94 0.06 45)', 
            border: '1px solid oklch(0.88 0.06 45)',
            borderRadius: '12px',
            padding: '10px 20px',
            fontWeight: 500
        }
    },
    { 
        id: '4', 
        position: { x: 100, y: 150 }, 
        data: { label: 'Mother' },
        style: { 
            background: 'oklch(0.95 0.04 85)', 
            border: '1px solid oklch(0.89 0.04 85)',
            borderRadius: '12px',
            padding: '10px 20px',
            fontWeight: 500
        }
    },
    { 
        id: '5', 
        position: { x: 200, y: 300 }, 
        data: { label: 'Son' },
        style: { 
            background: 'oklch(0.94 0.02 250)', 
            border: '1px solid oklch(0.88 0.02 250)',
            borderRadius: '12px',
            padding: '10px 20px',
            fontWeight: 500
        }
    },
    { 
        id: '6', 
        position: { x: 400, y: 300 }, 
        data: { label: 'Daughter' },
        style: { 
            background: 'oklch(0.94 0.03 15)', 
            border: '1px solid oklch(0.88 0.03 15)',
            borderRadius: '12px',
            padding: '10px 20px',
            fontWeight: 500
        }
    },
];

const initialEdges = [
    { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: 'oklch(0.52 0.08 145)', strokeWidth: 2 } },
    { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: 'oklch(0.52 0.08 145)', strokeWidth: 2 } },
    { id: 'e3-5', source: '3', target: '5', style: { stroke: 'oklch(0.52 0.08 145)', strokeWidth: 2 } },
    { id: 'e4-5', source: '4', target: '5', style: { stroke: 'oklch(0.52 0.08 145)', strokeWidth: 2 } },
    { id: 'e3-6', source: '3', target: '6', style: { stroke: 'oklch(0.52 0.08 145)', strokeWidth: 2 } },
    { id: 'e4-6', source: '4', target: '6', style: { stroke: 'oklch(0.52 0.08 145)', strokeWidth: 2 } },
];

export default function RelationshipsPage() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-display font-medium tracking-tight">Family Tree</h1>
                    <p className="text-muted-foreground">Visualize your family's relationships and connections</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="rounded-lg">
                        <ZoomIn className="h-4 w-4 mr-1" /> Zoom In
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-lg">
                        <ZoomOut className="h-4 w-4 mr-1" /> Zoom Out
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-lg">
                        <Maximize className="h-4 w-4 mr-1" /> Fit
                    </Button>
                </div>
            </div>

            {/* Instructions Card */}
            <Card className="bg-[oklch(0.94_0.02_145)] border-[oklch(0.88_0.02_145)]">
                <CardContent className="flex items-center gap-4 p-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-medium text-foreground">Interactive Family Tree</h3>
                        <p className="text-sm text-muted-foreground">
                            Drag nodes to rearrange, click to edit, or create new connections by dragging between nodes.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Family Tree Diagram */}
            <Card className="overflow-hidden">
                <div className="h-[calc(100vh-20rem)] w-full">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        fitView
                    >
                        <Controls className="!bg-card !border-border !shadow-md !rounded-xl" />
                        <MiniMap 
                            className="!bg-card !border-border !shadow-md !rounded-xl"
                            maskColor="oklch(0 0 0 / 0.1)"
                        />
                        <Background 
                            gap={20} 
                            size={1} 
                            color="oklch(0.8 0.01 75)"
                        />
                    </ReactFlow>
                </div>
            </Card>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="text-muted-foreground">Generations:</span>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-[oklch(0.94_0.02_145)] border border-[oklch(0.88_0.02_145)]"></span>
                    <span>Grandparents</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-[oklch(0.94_0.06_45)] border border-[oklch(0.88_0.06_45)]"></span>
                    <span>Parents</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-[oklch(0.94_0.02_250)] border border-[oklch(0.88_0.02_250)]"></span>
                    <span>Children</span>
                </div>
            </div>
        </div>
    );
}
