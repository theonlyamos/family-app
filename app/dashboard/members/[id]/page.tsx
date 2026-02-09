"use client"

import { useState, useRef, useCallback, useMemo } from "react"
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
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    ChevronRight,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Briefcase,
    BookOpen,
    User,
    Users,
    Heart,
    Shield,
    FileText,
    Clock,
    Edit,
    Trash2,
    MessageSquare,
    Copy,
    Plus,
    X,
    Camera,
    ArrowLeft,
    Activity,
    GraduationCap,
    Home,
} from "lucide-react"
// Member type definition
interface Member {
    id: string;
    first_name: string;
    last_name: string;
    aliases?: string[];
    date_of_birth?: string;
    place_of_birth?: string;
    place_of_residence?: string;
    phone_numbers?: string[];
    email_addresses?: string[];
    education?: string;
    occupation?: string;
    gender?: string;
    bio?: string;
    father?: string;
    mother?: string;
    spouse?: string;
    children?: string[];
    siblings?: string[];
    role: "admin" | "member" | "viewer";
    created_at: string;
    avatar_url?: string;
}

// Mock data - in production this would come from an API
const mockMembers: Member[] = [
    {
        id: "1",
        first_name: "John",
        last_name: "Miller",
        aliases: ["Johnny", "J.R."],
        date_of_birth: "1985-03-15",
        place_of_birth: "Chicago, Illinois",
        place_of_residence: "Seattle, Washington",
        phone_numbers: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
        email_addresses: ["john@millerfamily.com", "john.work@email.com"],
        education: "Bachelor's in Computer Science, University of Washington",
        occupation: "Senior Software Engineer at Microsoft",
        gender: "male",
        bio: "John is the head of the family. He loves hiking, photography, and spending time with his kids.",
        father: "",
        mother: "",
        spouse: "2",
        children: ["3", "4"],
        siblings: [],
        role: "admin",
        created_at: "2023-01-15T10:00:00Z",
    },
    {
        id: "2",
        first_name: "Jane",
        last_name: "Miller",
        aliases: ["Janie"],
        date_of_birth: "1987-07-22",
        place_of_birth: "Portland, Oregon",
        place_of_residence: "Seattle, Washington",
        phone_numbers: ["+1 (555) 123-4568"],
        email_addresses: ["jane@millerfamily.com"],
        education: "Master's in Education, Stanford University",
        occupation: "Elementary School Teacher",
        gender: "female",
        bio: "Jane is a dedicated teacher and loving mother. She enjoys gardening and yoga.",
        father: "",
        mother: "",
        spouse: "1",
        children: ["3", "4"],
        siblings: [],
        role: "member",
        created_at: "2023-01-15T10:00:00Z",
    },
    {
        id: "3",
        first_name: "Sam",
        last_name: "Miller",
        date_of_birth: "2010-11-08",
        place_of_birth: "Seattle, Washington",
        place_of_residence: "Seattle, Washington",
        phone_numbers: [],
        email_addresses: ["sam@millerfamily.com"],
        education: "8th Grade",
        occupation: "Student",
        gender: "male",
        bio: "Sam loves soccer and video games. He's on the school soccer team.",
        father: "1",
        mother: "2",
        spouse: "",
        children: [],
        siblings: ["4"],
        role: "member",
        created_at: "2023-01-15T10:00:00Z",
    },
    {
        id: "4",
        first_name: "Emily",
        last_name: "Miller",
        aliases: ["Emmy"],
        date_of_birth: "2013-04-12",
        place_of_birth: "Seattle, Washington",
        place_of_residence: "Seattle, Washington",
        phone_numbers: [],
        email_addresses: ["emily@millerfamily.com"],
        education: "5th Grade",
        occupation: "Student",
        gender: "female",
        bio: "Emily loves art, dancing, and playing with her friends.",
        father: "1",
        mother: "2",
        spouse: "",
        children: [],
        siblings: ["3"],
        role: "member",
        created_at: "2023-01-15T10:00:00Z",
    },
]

// Mock documents data
const mockDocuments = [
    { id: "1", name: "Birth Certificate", type: "PDF", date: "2024-01-15", category: "Personal" },
    { id: "2", name: "Medical Records", type: "PDF", date: "2024-02-20", category: "Medical" },
    { id: "3", name: "School Transcript", type: "DOCX", date: "2024-03-10", category: "Personal" },
]

// Mock activities
const mockActivities = [
    { id: "1", action: "Updated profile information", date: "2024-03-15T10:30:00Z", type: "update" },
    { id: "2", action: "Uploaded new document: Birth Certificate", date: "2024-03-10T14:20:00Z", type: "upload" },
    { id: "3", action: "Attended Family Dinner event", date: "2024-03-01T18:00:00Z", type: "event" },
]

// Searchable Relationship Selector (reused from main page)
function SearchableMemberSelector({
    selectedMembers,
    onChange,
    label,
    placeholder = "Search for family members...",
    allMembers
}: {
    selectedMembers: string[]
    onChange: (memberIds: string[]) => void
    label: string
    placeholder?: string
    allMembers: Member[]
}) {
    const [searchQuery, setSearchQuery] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const selectedMemberObjects = allMembers.filter(m => selectedMembers.includes(m.id))

    const filteredMembers = allMembers.filter(member =>
        !selectedMembers.includes(member.id) &&
        (member.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         member.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const addMember = (memberId: string) => {
        onChange([...selectedMembers, memberId])
        setSearchQuery("")
        inputRef.current?.focus()
    }

    const removeMember = (memberId: string) => {
        onChange(selectedMembers.filter(id => id !== memberId))
    }

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            {selectedMemberObjects.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedMemberObjects.map((member) => (
                        <div key={member.id} className="flex items-center gap-2 px-3 py-1.5 bg-[oklch(0.94_0.02_145)] rounded-full text-sm">
                            <Avatar className="h-5 w-5">
                                <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                                    {member.first_name[0]}{member.last_name[0]}
                                </AvatarFallback>
                            </Avatar>
                            <span>{member.first_name} {member.last_name}</span>
                            <button type="button" onClick={() => removeMember(member.id)} className="hover:bg-primary/20 rounded-full p-0.5 transition-colors cursor-pointer">
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    ref={inputRef}
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setIsOpen(true) }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="rounded-xl pl-10"
                />
                {isOpen && (searchQuery || filteredMembers.length > 0) && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-xl shadow-lg max-h-[200px] overflow-y-auto">
                            {filteredMembers.length === 0 ? (
                                <div className="px-3 py-2 text-sm text-muted-foreground">{searchQuery ? "No members found" : "Type to search..."}</div>
                            ) : (
                                filteredMembers.map((member) => (
                                    <div key={member.id} onClick={() => addMember(member.id)} className="flex items-center gap-3 px-3 py-2 hover:bg-muted cursor-pointer transition-colors">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-primary/10 text-primary text-xs">{member.first_name[0]}{member.last_name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-sm font-medium block">{member.first_name} {member.last_name}</span>
                                            <span className="text-xs text-muted-foreground truncate block">{member.email_addresses?.[0] || "No email"}</span>
                                        </div>
                                        <Plus className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

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
    allMembers
}: {
    member: Member
    father: Member | undefined
    mother: Member | undefined
    spouse: Member | undefined
    children: Member[]
    siblings: Member[]
    allMembers: Member[]
}) {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([] as Node[])
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([] as Edge[])

    // Generate nodes and edges based on family relationships
    useMemo(() => {
        const newNodes: Node[] = []
        const newEdges: Edge[] = []
        let yPos = 0
        
        // Parents at top
        const parents: Member[] = []
        if (father) parents.push(father)
        if (mother) parents.push(mother)

        if (parents.length > 0) {
            parents.forEach((parent, index) => {
                const xOffset = parents.length === 1 ? 0 : (index === 0 ? -100 : 100)
                const parentLabel = parent.gender === 'male' ? 'Father' : 'Mother'
                newNodes.push({
                    id: `parent-${parent.id}`,
                    position: { x: 250 + xOffset, y: yPos },
                    data: {
                        label: `${parentLabel}: ${parent.first_name}`,
                        member: parent,
                        type: 'parent'
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
                id: `sibling-${sibling.id}`,
                position: { x: 50 + (idx * 160), y: yPos },
                data: { 
                    label: `${siblingLabel}: ${sibling.first_name}`,
                    member: sibling,
                    type: 'sibling'
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
            id: `member-${member.id}`,
            position: { x: 250, y: yPos },
            data: { 
                label: `You: ${member.first_name}`,
                member: member,
                type: 'self'
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
                id: `sibling-${sibling.id}`,
                position: { x: 420 + (idx * 160), y: yPos },
                data: { 
                    label: `${siblingLabel}: ${sibling.first_name}`,
                    member: sibling,
                    type: 'sibling'
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
                id: `spouse-${spouse.id}`,
                position: { x: 420, y: yPos - 120 },
                data: { 
                    label: `${spouseLabel}: ${spouse.first_name}`,
                    member: spouse,
                    type: 'spouse'
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
            // Marriage connection
            newEdges.push({
                id: `e-spouse`,
                source: `member-${member.id}`,
                target: `spouse-${spouse.id}`,
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
                    id: `child-${child.id}`,
                    position: { x: 250 + xOffset, y: yPos },
                    data: { 
                        label: `${childLabel}: ${child.first_name}`,
                        member: child,
                        type: 'child'
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
                // Connection from member to child
                newEdges.push({
                    id: `e-child-${child.id}`,
                    source: `member-${member.id}`,
                    target: `child-${child.id}`,
                    style: { stroke: 'oklch(0.45 0.06 180)', strokeWidth: 2 },
                })
            })
        }

        // Connect parents to member
        parents.forEach((parent) => {
            newEdges.push({
                id: `e-parent-${parent.id}`,
                source: `parent-${parent.id}`,
                target: `member-${member.id}`,
                style: { stroke: 'oklch(0.70 0.10 85)', strokeWidth: 2 },
            })
        })

        // Connect siblings to member
        siblings.forEach((sibling) => {
            newEdges.push({
                id: `e-sibling-${sibling.id}`,
                source: `member-${member.id}`,
                target: `sibling-${sibling.id}`,
                style: { stroke: 'oklch(0.60 0.08 30)', strokeWidth: 1, strokeDasharray: '5,5' },
            })
        })

        setNodes(newNodes)
        setEdges(newEdges)
    }, [member, father, mother, spouse, children, siblings])

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    )

    const onNodeClick = (_: any, node: Node) => {
        const memberData = node.data.member as Member
        if (memberData.id !== member.id) {
            window.location.href = `/dashboard/members/${memberData.id}`
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
    const memberId = params.id as string
    
    // Get member from mock data
    const member = mockMembers.find(m => m.id === memberId) || mockMembers[0]
    
    // Get related members
    const father = mockMembers.find(m => m.id === member.father)
    const mother = mockMembers.find(m => m.id === member.mother)
    const spouse = mockMembers.find(m => m.id === member.spouse)
    const children = mockMembers.filter(m => member.children?.includes(m.id))
    const siblings = mockMembers.filter(m => member.siblings?.includes(m.id))

    // Edit modal state
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editForm, setEditForm] = useState<Partial<Member>>({ ...member })

    const handleSaveEdit = () => {
        // In a real app, this would update the database
        setIsEditOpen(false)
    }

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <nav className="flex items-center text-sm text-muted-foreground">
                <Link href="/dashboard/members" className="hover:text-primary transition-colors cursor-pointer">Members</Link>
                <ChevronRight className="h-4 w-4 mx-2" />
                <span className="text-foreground font-medium">{member.first_name} {member.last_name}</span>
            </nav>

            {/* Header Card */}
            <Card className="animate-fade-in-up">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Avatar */}
                        <div className="relative mx-auto md:mx-0">
                            <Avatar className="h-32 w-32 ring-4 ring-primary/20">
                                <AvatarImage src={member.avatar_url} />
                                <AvatarFallback className="bg-primary/10 text-primary text-4xl font-medium">
                                    {member.first_name[0]}{member.last_name[0]}
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
                                        {member.first_name} {member.last_name}
                                    </h1>
                                    <Badge variant={member.role === "admin" ? "sage" : member.role === "viewer" ? "secondary" : "default"} className="capitalize w-fit mx-auto md:mx-0">
                                        {member.role}
                                    </Badge>
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
                                <Button variant="outline" className="rounded-xl" onClick={() => setIsEditOpen(true)}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                                </Button>
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
                                {member.date_of_birth && (
                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Date of Birth</p>
                                            <p className="font-medium">{new Date(member.date_of_birth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                )}
                                {member.place_of_birth && (
                                    <div className="flex items-start gap-3">
                                        <Home className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Place of Birth</p>
                                            <p className="font-medium">{member.place_of_birth}</p>
                                        </div>
                                    </div>
                                )}
                                {member.place_of_residence && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Current Residence</p>
                                            <p className="font-medium">{member.place_of_residence}</p>
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
                                {member.email_addresses && member.email_addresses.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground">Email Addresses</p>
                                        {member.email_addresses.map((email, idx) => (
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
                                {member.phone_numbers && member.phone_numbers.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground">Phone Numbers</p>
                                        {member.phone_numbers.map((phone, idx) => (
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
                                    allMembers={mockMembers}
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
                                        parent && <Link key={parent.id} href={`/dashboard/members/${parent.id}`}>
                                            <div className="flex items-center gap-3 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors cursor-pointer">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarFallback className="bg-primary/10 text-primary">{parent.first_name[0]}{parent.last_name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{parent.first_name} {parent.last_name}</p>
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
                                <Link href={`/dashboard/members/${spouse.id}`}>
                                    <div className="flex items-center gap-3 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors cursor-pointer max-w-md">
                                        <Avatar className="h-12 w-12">
                                            <AvatarFallback className="bg-primary/10 text-primary">{spouse.first_name[0]}{spouse.last_name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{spouse.first_name} {spouse.last_name}</p>
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
                                        <Link key={child.id} href={`/dashboard/members/${child.id}`}>
                                            <div className="flex items-center gap-3 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors cursor-pointer">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarFallback className="bg-primary/10 text-primary">{child.first_name[0]}{child.last_name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{child.first_name} {child.last_name}</p>
                                                    {child.date_of_birth && (
                                                        <p className="text-sm text-muted-foreground">
                                                            {new Date().getFullYear() - new Date(child.date_of_birth).getFullYear()} years old
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
                                        <Link key={sibling.id} href={`/dashboard/members/${sibling.id}`}>
                                            <div className="flex items-center gap-3 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors cursor-pointer">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarFallback className="bg-primary/10 text-primary">{sibling.first_name[0]}{sibling.last_name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{sibling.first_name} {sibling.last_name}</p>
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
                                Associated Documents ({mockDocuments.length})
                            </CardTitle>
                            <Button variant="outline" size="sm" className="rounded-xl">
                                <Plus className="mr-2 h-4 w-4" /> Add Document
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                {mockDocuments.map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between p-4 bg-muted rounded-xl">
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
                                            <span className="text-sm text-muted-foreground">{doc.date}</span>
                                            <Button variant="ghost" size="sm" className="rounded-lg">View</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
                            <div className="space-y-4">
                                {mockActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <Clock className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">{activity.action}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                {' • '}
                                                {new Date(activity.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Edit Modal */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-display text-2xl">Edit Profile</DialogTitle>
                        <DialogDescription>Update member information below.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>First Name</Label>
                                <Input value={editForm.first_name} onChange={(e) => setEditForm({...editForm, first_name: e.target.value})} className="rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name</Label>
                                <Input value={editForm.last_name} onChange={(e) => setEditForm({...editForm, last_name: e.target.value})} className="rounded-xl" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Date of Birth</Label>
                            <Input type="date" value={editForm.date_of_birth} onChange={(e) => setEditForm({...editForm, date_of_birth: e.target.value})} className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label>Place of Residence</Label>
                            <Input value={editForm.place_of_residence} onChange={(e) => setEditForm({...editForm, place_of_residence: e.target.value})} className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label>Education</Label>
                            <Input value={editForm.education} onChange={(e) => setEditForm({...editForm, education: e.target.value})} className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label>Occupation</Label>
                            <Input value={editForm.occupation} onChange={(e) => setEditForm({...editForm, occupation: e.target.value})} className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label>Bio</Label>
                            <Textarea value={editForm.bio} onChange={(e) => setEditForm({...editForm, bio: e.target.value})} className="rounded-xl min-h-[100px]" />
                        </div>
                        <SearchableMemberSelector
                            label="Father"
                            selectedMembers={editForm.father ? [editForm.father] : []}
                            onChange={(ids) => setEditForm({...editForm, father: ids[0] || ""})}
                            allMembers={mockMembers.filter(m => m.gender === 'male')}
                        />
                        <SearchableMemberSelector
                            label="Mother"
                            selectedMembers={editForm.mother ? [editForm.mother] : []}
                            onChange={(ids) => setEditForm({...editForm, mother: ids[0] || ""})}
                            allMembers={mockMembers.filter(m => m.gender === 'female')}
                        />
                        <SearchableMemberSelector
                            label="Children"
                            selectedMembers={editForm.children || []}
                            onChange={(ids) => setEditForm({...editForm, children: ids})}
                            allMembers={mockMembers}
                        />
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select value={editForm.role} onValueChange={(value: "admin" | "member" | "viewer") => setEditForm({...editForm, role: value})}>
                                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="member">Member</SelectItem>
                                    <SelectItem value="viewer">Viewer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="rounded-xl" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button className="rounded-xl" onClick={handleSaveEdit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
