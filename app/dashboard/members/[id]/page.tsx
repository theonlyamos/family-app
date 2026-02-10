"use client"

import { useCallback, useMemo, useEffect } from "react"
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
    BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useParams } from "next/navigation"
import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    ChevronRight,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Briefcase,
    User,
    Users,
    Heart,
    FileText,
    Clock,
    Edit,
    Trash2,
    MessageSquare,
    Copy,
    Plus,
    Camera,
    Activity,
    GraduationCap,
    Home,
} from "lucide-react"

type MemberDoc = Doc<"members">

// Copy to clipboard function
function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
}

// Mini Family Tree Component using React Flow
function MiniFamilyTree({
    member,
    father,
    mother,
    spouse,
    children,
    siblings,
}: {
    member: MemberDoc
    father: MemberDoc | undefined
    mother: MemberDoc | undefined
    spouse: MemberDoc | undefined
    children: MemberDoc[]
    siblings: MemberDoc[]
}) {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([] as Node[])
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([] as Edge[])

    useEffect(() => {
        const newNodes: Node[] = []
        const newEdges: Edge[] = []
        let yPos = 0

        // Parents at top
        const parents: MemberDoc[] = []
        if (father) parents.push(father)
        if (mother) parents.push(mother)

        if (parents.length > 0) {
            parents.forEach((parent, index) => {
                const xOffset = parents.length === 1 ? 0 : (index === 0 ? -100 : 100)
                const parentLabel = parent.gender === 'male' ? 'Father' : 'Mother'
                newNodes.push({
                    id: `parent-${parent._id}`,
                    position: { x: 250 + xOffset, y: yPos },
                    data: {
                        label: `${parentLabel}: ${parent.firstName}`,
                    },
                    style: {
                        background: 'oklch(0.70 0.10 85)',
                        border: '1px solid oklch(0.60 0.08 85)',
                        borderRadius: '12px',
                        padding: '10px',
                        width: 160,
                        fontSize: '11px',
                        fontWeight: 500,
                    }
                })
            })
            yPos += 120
        }

        // Siblings and current member row
        const siblingNodes: Node[] = []
        const allSiblings = [...siblings]
        const memberIndex = Math.floor(allSiblings.length / 2)

        // Add siblings before current member
        allSiblings.slice(0, memberIndex).forEach((sibling, idx) => {
            const siblingLabel = sibling.gender === 'male' ? 'Brother' : sibling.gender === 'female' ? 'Sister' : 'Sibling'
            siblingNodes.push({
                id: `sibling-${sibling._id}`,
                position: { x: 50 + (idx * 160), y: yPos },
                data: {
                    label: `${siblingLabel}: ${sibling.firstName}`,
                },
                style: {
                    background: 'oklch(0.60 0.08 30)',
                    border: '1px solid oklch(0.50 0.06 30)',
                    borderRadius: '12px',
                    padding: '10px',
                    width: 140,
                    fontSize: '11px',
                    fontWeight: 500,
                }
            })
        })

        // Current member (center)
        newNodes.push({
            id: `member-${member._id}`,
            position: { x: 250, y: yPos },
            data: {
                label: `You: ${member.firstName}`,
            },
            style: {
                background: 'oklch(0.52 0.08 145)',
                border: '2px solid oklch(0.42 0.06 145)',
                borderRadius: '12px',
                padding: '10px',
                width: 150,
                fontSize: '12px',
                fontWeight: 600,
                color: 'white',
            }
        })

        // Add siblings after current member
        allSiblings.slice(memberIndex).forEach((sibling, idx) => {
            const siblingLabel = sibling.gender === 'male' ? 'Brother' : sibling.gender === 'female' ? 'Sister' : 'Sibling'
            siblingNodes.push({
                id: `sibling-${sibling._id}`,
                position: { x: 420 + (idx * 160), y: yPos },
                data: {
                    label: `${siblingLabel}: ${sibling.firstName}`,
                },
                style: {
                    background: 'oklch(0.60 0.08 30)',
                    border: '1px solid oklch(0.50 0.06 30)',
                    borderRadius: '12px',
                    padding: '10px',
                    width: 140,
                    fontSize: '11px',
                    fontWeight: 500,
                }
            })
        })

        newNodes.push(...siblingNodes)
        yPos += 120

        // Spouse
        if (spouse) {
            const spouseLabel = spouse.gender === 'male' ? 'Husband' : spouse.gender === 'female' ? 'Wife' : 'Spouse'
            newNodes.push({
                id: `spouse-${spouse._id}`,
                position: { x: 420, y: yPos - 120 },
                data: {
                    label: `${spouseLabel}: ${spouse.firstName}`,
                },
                style: {
                    background: 'oklch(0.65 0.12 45)',
                    border: '1px solid oklch(0.55 0.10 45)',
                    borderRadius: '12px',
                    padding: '10px',
                    width: 150,
                    fontSize: '11px',
                    fontWeight: 500,
                }
            })
            newEdges.push({
                id: `e-spouse`,
                source: `member-${member._id}`,
                target: `spouse-${spouse._id}`,
                animated: true,
                style: { stroke: 'oklch(0.65 0.12 45)', strokeWidth: 2 },
            })
        }

        // Children at bottom
        if (children.length > 0) {
            yPos += 20
            children.forEach((child, index) => {
                const xOffset = children.length === 1 ? 0 : ((index - (children.length - 1) / 2) * 160)
                const childLabel = child.gender === 'male' ? 'Son' : child.gender === 'female' ? 'Daughter' : 'Child'
                newNodes.push({
                    id: `child-${child._id}`,
                    position: { x: 250 + xOffset, y: yPos },
                    data: {
                        label: `${childLabel}: ${child.firstName}`,
                    },
                    style: {
                        background: 'oklch(0.45 0.06 180)',
                        border: '1px solid oklch(0.35 0.04 180)',
                        borderRadius: '12px',
                        padding: '10px',
                        width: 150,
                        fontSize: '11px',
                        fontWeight: 500,
                        color: 'white',
                    }
                })
                newEdges.push({
                    id: `e-child-${child._id}`,
                    source: `member-${member._id}`,
                    target: `child-${child._id}`,
                    style: { stroke: 'oklch(0.45 0.06 180)', strokeWidth: 2 },
                })
            })
        }

        // Connect parents to member
        parents.forEach((parent) => {
            newEdges.push({
                id: `e-parent-${parent._id}`,
                source: `parent-${parent._id}`,
                target: `member-${member._id}`,
                style: { stroke: 'oklch(0.70 0.10 85)', strokeWidth: 2 },
            })
        })

        // Connect siblings to member
        siblings.forEach((sibling) => {
            newEdges.push({
                id: `e-sibling-${sibling._id}`,
                source: `member-${member._id}`,
                target: `sibling-${sibling._id}`,
                style: { stroke: 'oklch(0.60 0.08 30)', strokeWidth: 1, strokeDasharray: '5,5' },
            })
        })

        setNodes(newNodes)
        setEdges(newEdges)
    }, [member, father, mother, spouse, children, siblings, setNodes, setEdges])

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    )

    const onNodeClick = (_: any, node: Node) => {
        // Navigate to the member page if it's not the current member
        const nodeId = node.id
        const memberId = nodeId.split('-').slice(1).join('-')
        if (memberId !== member._id) {
            window.location.href = `/dashboard/members/${memberId}`
        }
    }

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            fitView
            attributionPosition="bottom-left"
        >
            <Controls className="!bg-card !border-border !shadow-md !rounded-xl" />
            <MiniMap
                className="!bg-card !border-border !shadow-md !rounded-xl"
                maskColor="oklch(0 0 0 / 0.1)"
            />
            <Background
                variant={BackgroundVariant.Dots}
                gap={20}
                size={1}
                color="oklch(0.8 0.01 75)"
            />
        </ReactFlow>
    )
}

export default function MemberDetailsPage() {
    const params = useParams()
    const memberId = params.id as Id<"members">

    const member = useQuery(api.members.getById, { id: memberId })
    const allMembers = useQuery(api.members.list)
    const memberDocuments = useQuery(api.documents.listByMemberId, { memberId })
    const memberActivities = useQuery(api.activities.listByMemberId, { memberId })

    if (member === undefined || allMembers === undefined) {
        return (
            <div className="space-y-6 animate-fade-in-up">
                <div className="space-y-1">
                    <h1 className="text-4xl font-display font-medium tracking-tight">Loading...</h1>
                    <p className="text-muted-foreground">Fetching member details...</p>
                </div>
            </div>
        )
    }

    if (member === null) {
        return (
            <div className="space-y-6 animate-fade-in-up">
                <div className="text-center py-16">
                    <h1 className="text-2xl font-display font-medium">Member not found</h1>
                    <p className="text-muted-foreground mt-2">The member you're looking for doesn't exist.</p>
                    <Button asChild className="mt-4"><Link href="/dashboard/members">Back to Members</Link></Button>
                </div>
            </div>
        )
    }

    // Get related members
    const father = member.fatherId ? allMembers.find(m => m._id === member.fatherId) : undefined
    const mother = member.motherId ? allMembers.find(m => m._id === member.motherId) : undefined
    const spouse = member.spouseId ? allMembers.find(m => m._id === member.spouseId) : undefined
    const children = allMembers.filter(m => m.fatherId === member._id || m.motherId === member._id)
    const siblings = allMembers.filter(m =>
        m._id !== member._id &&
        ((member.fatherId && m.fatherId === member.fatherId) || (member.motherId && m.motherId === member.motherId))
    )

    // Associated documents (those mentioning this member)
    // Associated documents logic moved to useQuery above

    // Format relative time
    const formatRelativeTime = (creationTime: number): string => {
        const diff = Date.now() - creationTime
        const minutes = Math.floor(diff / 60000)
        if (minutes < 60) return `${minutes}m ago`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours}h ago`
        const days = Math.floor(hours / 24)
        return `${days}d ago`
    }

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <nav className="flex items-center text-sm text-muted-foreground">
                <Link href="/dashboard/members" className="hover:text-primary transition-colors cursor-pointer">Members</Link>
                <ChevronRight className="h-4 w-4 mx-2" />
                <span className="text-foreground font-medium">{member.firstName} {member.lastName}</span>
            </nav>

            {/* Header Card */}
            <Card className="animate-fade-in-up">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Avatar */}
                        <div className="relative mx-auto md:mx-0">
                            <Avatar className="h-32 w-32 ring-4 ring-primary/20">
                                <AvatarImage src={member.avatarUrl} />
                                <AvatarFallback className="bg-primary/10 text-primary text-4xl font-medium">
                                    {member.firstName[0]}{member.lastName[0]}
                                </AvatarFallback>
                            </Avatar>
                            <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors cursor-pointer">
                                <Camera className="h-5 w-5 text-primary-foreground" />
                            </button>
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="space-y-2">
                                <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
                                    <h1 className="text-3xl md:text-4xl font-display font-medium tracking-tight">
                                        {[member.firstName, member.middleName, member.lastName].filter(Boolean).join(' ')}
                                    </h1>
                                </div>
                                {member.aliases && member.aliases.length > 0 && (
                                    <p className="text-muted-foreground">Also known as: {member.aliases.join(", ")}</p>
                                )}
                                {member.occupation && (
                                    <p className="text-muted-foreground flex items-center gap-2 justify-center md:justify-start">
                                        <Briefcase className="h-4 w-4" />
                                        {member.occupation}
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 mt-4 justify-center md:justify-start">
                                <Link href={`/dashboard/members?edit=${member._id}`}>
                                    <Button variant="outline" className="rounded-xl">
                                        <Edit className="mr-2 h-4 w-4" /> Edit Profile
                                    </Button>
                                </Link>
                                <Button variant="outline" className="rounded-xl">
                                    <MessageSquare className="mr-2 h-4 w-4" /> Message
                                </Button>
                                <Button variant="destructive" className="rounded-xl bg-[oklch(0.94_0.03_15)] text-[oklch(0.50_0.12_15)] hover:bg-[oklch(0.92_0.05_15)] border-none">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="animate-fade-in-up animation-delay-100">
                <TabsList className="grid w-full grid-cols-5 rounded-xl mb-6">
                    <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
                    <TabsTrigger value="family" className="rounded-lg">Family</TabsTrigger>
                    <TabsTrigger value="professional" className="rounded-lg">Professional</TabsTrigger>
                    <TabsTrigger value="documents" className="rounded-lg">Documents</TabsTrigger>
                    <TabsTrigger value="activity" className="rounded-lg">Activity</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6 mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-display text-lg flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    Basic Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {member.dateOfBirth && (
                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Date of Birth</p>
                                            <p className="font-medium">{new Date(member.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                )}
                                {member.placeOfBirth && (
                                    <div className="flex items-start gap-3">
                                        <Home className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Place of Birth</p>
                                            <p className="font-medium">{member.placeOfBirth}</p>
                                        </div>
                                    </div>
                                )}
                                {member.placeOfResidence && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Current Residence</p>
                                            <p className="font-medium">{member.placeOfResidence}</p>
                                        </div>
                                    </div>
                                )}
                                {member.gender && (
                                    <div className="flex items-start gap-3">
                                        <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Gender</p>
                                            <p className="font-medium capitalize">{member.gender}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Contact Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-display text-lg flex items-center gap-2">
                                    <Phone className="h-5 w-5 text-primary" />
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {member.emailAddresses && member.emailAddresses.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground">Email Addresses</p>
                                        {member.emailAddresses.map((email, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">{email}</span>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => copyToClipboard(email)}>
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {member.phoneNumbers && member.phoneNumbers.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground">Phone Numbers</p>
                                        {member.phoneNumbers.map((phone, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">{phone}</span>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => copyToClipboard(phone)}>
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Bio */}
                    {member.bio && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-display text-lg">Bio</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">{member.bio}</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Family Tab */}
                <TabsContent value="family" className="space-y-6 mt-0">
                    {/* React Flow Mini Family Tree */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-display text-lg flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                Family Tree
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px] w-full border rounded-xl overflow-hidden bg-[oklch(0.98_0.005_85)]">
                                <MiniFamilyTree
                                    member={member}
                                    father={father}
                                    mother={mother}
                                    spouse={spouse}
                                    children={children}
                                    siblings={siblings}
                                />
                            </div>
                            <div className="flex justify-center gap-6 mt-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded" style={{ background: 'oklch(0.52 0.08 145)' }} />
                                    <span>You</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded" style={{ background: 'oklch(0.65 0.12 45)' }} />
                                    <span>Spouse</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded" style={{ background: 'oklch(0.70 0.10 85)' }} />
                                    <span>Parents</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded" style={{ background: 'oklch(0.45 0.06 180)' }} />
                                    <span>Children</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded" style={{ background: 'oklch(0.60 0.08 30)' }} />
                                    <span>Siblings</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Parents */}
                    {(father || mother) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-display text-lg flex items-center gap-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    Parents
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[father, mother].filter(Boolean).map((parent) => (
                                        parent && <Link key={parent._id} href={`/dashboard/members/${parent._id}`}>
                                            <div className="flex items-center gap-3 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors cursor-pointer">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarFallback className="bg-primary/10 text-primary">{parent.firstName[0]}{parent.lastName[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{parent.firstName} {parent.lastName}</p>
                                                    <p className="text-sm text-muted-foreground">{parent.occupation || "Family Member"}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Spouse */}
                    {spouse && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-display text-lg flex items-center gap-2">
                                    <Heart className="h-5 w-5 text-primary" />
                                    Spouse / Partner
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Link href={`/dashboard/members/${spouse._id}`}>
                                    <div className="flex items-center gap-3 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors cursor-pointer max-w-md">
                                        <Avatar className="h-12 w-12">
                                            <AvatarFallback className="bg-primary/10 text-primary">{spouse.firstName[0]}{spouse.lastName[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{spouse.firstName} {spouse.lastName}</p>
                                            <p className="text-sm text-muted-foreground">{spouse.occupation || "Family Member"}</p>
                                        </div>
                                    </div>
                                </Link>
                            </CardContent>
                        </Card>
                    )}

                    {/* Children */}
                    {children.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-display text-lg flex items-center gap-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    Children ({children.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {children.map((child) => (
                                        <Link key={child._id} href={`/dashboard/members/${child._id}`}>
                                            <div className="flex items-center gap-3 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors cursor-pointer">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarFallback className="bg-primary/10 text-primary">{child.firstName[0]}{child.lastName[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{child.firstName} {child.lastName}</p>
                                                    {child.dateOfBirth && (
                                                        <p className="text-sm text-muted-foreground">
                                                            {new Date().getFullYear() - new Date(child.dateOfBirth).getFullYear()} years old
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Siblings */}
                    {siblings.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-display text-lg flex items-center gap-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    Siblings ({siblings.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {siblings.map((sibling) => (
                                        <Link key={sibling._id} href={`/dashboard/members/${sibling._id}`}>
                                            <div className="flex items-center gap-3 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors cursor-pointer">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarFallback className="bg-primary/10 text-primary">{sibling.firstName[0]}{sibling.lastName[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{sibling.firstName} {sibling.lastName}</p>
                                                    <p className="text-sm text-muted-foreground">{sibling.occupation || "Family Member"}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Professional Tab */}
                <TabsContent value="professional" className="space-y-6 mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-display text-lg flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5 text-primary" />
                                    Education
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {member.education ? (
                                    <p className="text-muted-foreground">{member.education}</p>
                                ) : (
                                    <p className="text-muted-foreground italic">No education information provided</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="font-display text-lg flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-primary" />
                                    Occupation
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {member.occupation ? (
                                    <p className="text-muted-foreground">{member.occupation}</p>
                                ) : (
                                    <p className="text-muted-foreground italic">No occupation information provided</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents" className="space-y-6 mt-0">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="font-display text-lg flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Associated Documents ({(memberDocuments ?? []).length})
                            </CardTitle>
                            <Button variant="outline" size="sm" className="rounded-xl">
                                <Plus className="mr-2 h-4 w-4" /> Add Document
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {(memberDocuments ?? []).length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">No documents associated with this member.</p>
                            ) : (
                                <div className="grid gap-4">
                                    {(memberDocuments ?? []).map((doc) => (
                                        <Link key={doc._id} href={`/dashboard/vault/${doc._id}`}>
                                            <div className="flex items-center justify-between p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                        <FileText className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{doc.name}</p>
                                                        <p className="text-sm text-muted-foreground">{doc.category} • {doc.type}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-muted-foreground">
                                                        {new Date(doc._creationTime).toLocaleDateString()}
                                                    </span>
                                                    <Button variant="ghost" size="sm" className="rounded-lg">View</Button>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Activity Tab */}
                <TabsContent value="activity" className="space-y-6 mt-0">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-display text-lg flex items-center gap-2">
                                <Activity className="h-5 w-5 text-primary" />
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {(memberActivities ?? []).length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">No recent activity.</p>
                            ) : (
                                <div className="space-y-4">
                                    {(memberActivities ?? []).map((activity) => (
                                        <div key={activity._id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <Clock className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{activity.action}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatRelativeTime(activity._creationTime)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
