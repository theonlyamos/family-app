"use client"

import { useCallback, useMemo, useEffect } from 'react';
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    type Connection,
    type Edge,
    type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";

// Color palette for generations
const colors = {
    default: { bg: 'oklch(0.94 0.02 145)', border: 'oklch(0.88 0.02 145)' },
    spouse: { bg: 'oklch(0.94 0.06 45)', border: 'oklch(0.88 0.06 45)' },
    child: { bg: 'oklch(0.94 0.02 250)', border: 'oklch(0.88 0.02 250)' },
};

// Builds ReactFlow nodes & edges dynamically from members data
function buildGraph(members: { _id: string; firstName: string; lastName: string; fatherId?: string; motherId?: string; spouseId?: string }[]) {
    if (members.length === 0) return { nodes: [], edges: [] };

    const memberMap = new Map(members.map(m => [m._id, m]));

    // Determine "root" members (those who have no parents in the data set)
    const roots = members.filter(m => !m.fatherId && !m.motherId);
    const children = members.filter(m => m.fatherId || m.motherId);

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const positioned = new Set<string>();

    // Position root members in top row
    const xSpacing = 220;
    const ySpacing = 180;
    let col = 0;

    for (const root of roots) {
        if (positioned.has(root._id)) continue;

        nodes.push({
            id: root._id,
            position: { x: col * xSpacing, y: 0 },
            data: { label: `${root.firstName} ${root.lastName}` },
            style: {
                background: colors.default.bg,
                border: `1px solid ${colors.default.border}`,
                borderRadius: '12px',
                padding: '10px 20px',
                fontWeight: 500,
            },
        });
        positioned.add(root._id);
        col++;

        // If this root has a spouse that is also in the dataset, place next to them
        if (root.spouseId && memberMap.has(root.spouseId) && !positioned.has(root.spouseId)) {
            const spouse = memberMap.get(root.spouseId)!;
            nodes.push({
                id: spouse._id,
                position: { x: col * xSpacing, y: 0 },
                data: { label: `${spouse.firstName} ${spouse.lastName}` },
                style: {
                    background: colors.spouse.bg,
                    border: `1px solid ${colors.spouse.border}`,
                    borderRadius: '12px',
                    padding: '10px 20px',
                    fontWeight: 500,
                },
            });
            positioned.add(spouse._id);

            // Add spouse edge
            edges.push({
                id: `spouse-${root._id}-${spouse._id}`,
                source: root._id,
                target: spouse._id,
                animated: true,
                label: '♥',
                style: { stroke: 'oklch(0.52 0.08 45)', strokeWidth: 2 },
            });
            col++;
        }
    }

    // Position children in the next row
    let childCol = 0;
    for (const child of children) {
        if (positioned.has(child._id)) continue;

        nodes.push({
            id: child._id,
            position: { x: childCol * xSpacing, y: ySpacing },
            data: { label: `${child.firstName} ${child.lastName}` },
            style: {
                background: colors.child.bg,
                border: `1px solid ${colors.child.border}`,
                borderRadius: '12px',
                padding: '10px 20px',
                fontWeight: 500,
            },
        });
        positioned.add(child._id);

        // Add parent edges
        if (child.fatherId && memberMap.has(child.fatherId)) {
            edges.push({
                id: `parent-${child.fatherId}-${child._id}`,
                source: child.fatherId,
                target: child._id,
                style: { stroke: 'oklch(0.52 0.08 145)', strokeWidth: 2 },
            });
        }
        if (child.motherId && memberMap.has(child.motherId)) {
            edges.push({
                id: `parent-${child.motherId}-${child._id}`,
                source: child.motherId,
                target: child._id,
                style: { stroke: 'oklch(0.52 0.08 145)', strokeWidth: 2 },
            });
        }
        childCol++;
    }

    // Handle any members not yet positioned (no relationships)
    for (const member of members) {
        if (!positioned.has(member._id)) {
            nodes.push({
                id: member._id,
                position: { x: col * xSpacing, y: 0 },
                data: { label: `${member.firstName} ${member.lastName}` },
                style: {
                    background: colors.default.bg,
                    border: `1px solid ${colors.default.border}`,
                    borderRadius: '12px',
                    padding: '10px 20px',
                    fontWeight: 500,
                },
            });
            positioned.add(member._id);
            col++;
        }
    }

    return { nodes, edges };
}

function RelationshipsContent({ members }: { members: { _id: string; firstName: string; lastName: string; fatherId?: string; motherId?: string; spouseId?: string }[] }) {
    const { nodes: initialNodes, edges: initialEdges } = useMemo(() => buildGraph(members), [members]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    useEffect(() => {
        setNodes(initialNodes);
        setEdges(initialEdges);
    }, [initialNodes, initialEdges, setNodes, setEdges]);

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
                <span className="text-muted-foreground">Roles:</span>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded" style={{ background: colors.default.bg, border: `1px solid ${colors.default.border}` }}></span>
                    <span>Parent / Root</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded" style={{ background: colors.spouse.bg, border: `1px solid ${colors.spouse.border}` }}></span>
                    <span>Spouse</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded" style={{ background: colors.child.bg, border: `1px solid ${colors.child.border}` }}></span>
                    <span>Children</span>
                </div>
            </div>
        </div>
    );
}

export default function RelationshipsPage() {
    const members = useQuery(api.members.list);

    if (members === undefined) {
        return (
            <div className="space-y-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-display font-medium tracking-tight">Family Tree</h1>
                    <p className="text-muted-foreground">Loading family data...</p>
                </div>
            </div>
        );
    }

    return <RelationshipsContent members={members} />;
}
