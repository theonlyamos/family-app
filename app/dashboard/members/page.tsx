"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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
import { Plus, MoreHorizontal, Mail, X, Users, Shield, Activity, UserPlus, Camera, Phone, MapPin, BookOpen, Briefcase, Heart, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Comprehensive Member type
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
    parents?: string[];
    spouse?: string;
    children?: string[];
    siblings?: string[];
    role: "admin" | "member" | "viewer";
    created_at: string;
    avatar_url?: string;
}

const mockMembers: Member[] = [
    {
        id: "1",
        first_name: "John",
        last_name: "Miller",
        email_addresses: ["john@millerfamily.com"],
        phone_numbers: ["+1 (555) 123-4567"],
        role: "admin",
        created_at: new Date().toISOString(),
    },
    {
        id: "2",
        first_name: "Jane",
        last_name: "Miller",
        email_addresses: ["jane@millerfamily.com"],
        phone_numbers: ["+1 (555) 123-4568"],
        role: "member",
        created_at: new Date().toISOString(),
    },
    {
        id: "3",
        first_name: "Sam",
        last_name: "Miller",
        email_addresses: ["sam@millerfamily.com"],
        role: "member",
        created_at: new Date().toISOString(),
    },
    {
        id: "4",
        first_name: "Emily",
        last_name: "Miller",
        email_addresses: ["emily@millerfamily.com"],
        role: "member",
        created_at: new Date().toISOString(),
    },
]

// Phone Input Component
function PhoneInput({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
    return (
        <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "+1 (555) 000-0000"}
            className="rounded-xl"
        />
    )
}

// Email Input Component
function EmailInput({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
    return (
        <Input
            type="email"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "email@example.com"}
            className="rounded-xl"
        />
    )
}

// Dynamic List Input
function DynamicListInput({ 
    items, 
    onChange, 
    placeholder,
    label 
}: { 
    items: string[]; 
    onChange: (items: string[]) => void; 
    placeholder?: string;
    label: string;
}) {
    const addItem = () => {
        onChange([...items, ""])
    }

    const removeItem = (index: number) => {
        onChange(items.filter((_, i) => i !== index))
    }

    const updateItem = (index: number, value: string) => {
        const newItems = [...items]
        newItems[index] = value
        onChange(newItems)
    }

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            {items.map((item, index) => (
                <div key={index} className="flex gap-2">
                    <Input
                        value={item}
                        onChange={(e) => updateItem(index, e.target.value)}
                        placeholder={placeholder}
                        className="rounded-xl flex-1"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        className="rounded-xl shrink-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                onClick={addItem}
                className="w-full rounded-xl"
            >
                <Plus className="h-4 w-4 mr-2" /> Add {label}
            </Button>
        </div>
    )
}

// Searchable Relationship Selector
function RelationshipSelector({ 
    label, 
    value, 
    onChange, 
    members,
    multiple = false 
}: { 
    label: string; 
    value: string | string[]; 
    onChange: (value: string | string[]) => void; 
    members: Member[];
    multiple?: boolean;
}) {
    const [searchQuery, setSearchQuery] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    
    const selectedIds = multiple ? (value as string[]) : value ? [value as string] : []
    
    const selectedMembers = members.filter(m => selectedIds.includes(m.id))
    
    const filteredMembers = members.filter(member => 
        !selectedIds.includes(member.id) &&
        (member.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         member.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const addMember = (memberId: string) => {
        if (multiple) {
            onChange([...selectedIds, memberId])
            setSearchQuery("")
        } else {
            onChange(memberId)
            setSearchQuery("")
            setIsOpen(false)
        }
        inputRef.current?.focus()
    }

    const removeMember = (memberId: string) => {
        if (multiple) {
            onChange(selectedIds.filter(id => id !== memberId))
        } else {
            onChange("")
        }
    }

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            
            {/* Selected Members Chips */}
            {selectedMembers.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedMembers.map((member) => (
                        <div 
                            key={member.id}
                            className="flex items-center gap-2 px-3 py-1.5 bg-[oklch(0.94_0.02_145)] rounded-full text-sm"
                        >
                            <Avatar className="h-5 w-5">
                                <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                                    {member.first_name[0]}{member.last_name[0]}
                                </AvatarFallback>
                            </Avatar>
                            <span>{member.first_name} {member.last_name}</span>
                            <button
                                type="button"
                                onClick={() => removeMember(member.id)}
                                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Search Input */}
            <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    ref={inputRef}
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setIsOpen(true)
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={multiple ? "Search and add members..." : "Search for a member..."}
                    className="rounded-xl pl-10"
                />
                
                {/* Dropdown Results */}
                {isOpen && (searchQuery || filteredMembers.length > 0) && (
                    <>
                        <div 
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-xl shadow-lg max-h-[200px] overflow-y-auto">
                            {filteredMembers.length === 0 ? (
                                <div className="px-3 py-2 text-sm text-muted-foreground">
                                    {searchQuery ? "No members found" : "Type to search..."}
                                </div>
                            ) : (
                                filteredMembers.map((member) => (
                                    <div
                                        key={member.id}
                                        onClick={() => addMember(member.id)}
                                        className="flex items-center gap-3 px-3 py-2 hover:bg-muted cursor-pointer transition-colors"
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                {member.first_name[0]}{member.last_name[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm">{member.first_name} {member.last_name}</span>
                                        <Plus className="h-4 w-4 ml-auto text-muted-foreground" />
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

export default function MembersPage() {
    const [members, setMembers] = useState<Member[]>(mockMembers)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Form state
    const [formData, setFormData] = useState<Partial<Member>>({
        first_name: "",
        last_name: "",
        aliases: [],
        date_of_birth: "",
        place_of_birth: "",
        place_of_residence: "",
        phone_numbers: [],
        email_addresses: [],
        education: "",
        occupation: "",
        gender: "",
        bio: "",
        parents: [],
        spouse: "",
        children: [],
        siblings: [],
        role: "member",
    })

    const resetForm = () => {
        setFormData({
            first_name: "",
            last_name: "",
            aliases: [],
            date_of_birth: "",
            place_of_birth: "",
            place_of_residence: "",
            phone_numbers: [],
            email_addresses: [],
            education: "",
            occupation: "",
            gender: "",
            bio: "",
            parents: [],
            spouse: "",
            children: [],
            siblings: [],
            role: "member",
        })
    }

    const handleSave = () => {
        if (!formData.first_name || !formData.last_name) return
        
        const newMember: Member = {
            id: (members.length + 1).toString(),
            first_name: formData.first_name,
            last_name: formData.last_name,
            aliases: formData.aliases?.filter(a => a.trim() !== ""),
            date_of_birth: formData.date_of_birth,
            place_of_birth: formData.place_of_birth,
            place_of_residence: formData.place_of_residence,
            phone_numbers: formData.phone_numbers?.filter(p => p.trim() !== ""),
            email_addresses: formData.email_addresses?.filter(e => e.trim() !== ""),
            education: formData.education,
            occupation: formData.occupation,
            gender: formData.gender,
            bio: formData.bio,
            parents: formData.parents,
            spouse: formData.spouse,
            children: formData.children,
            siblings: formData.siblings,
            role: formData.role || "member",
            created_at: new Date().toISOString(),
        }
        
        setMembers([...members, newMember])
        resetForm()
        setIsDialogOpen(false)
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-display font-medium tracking-tight">Family Members</h1>
                    <p className="text-muted-foreground">Manage family members and their access permissions</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="shadow-md hover:shadow-lg transition-shadow">
                            <UserPlus className="mr-2 h-4 w-4" /> Add Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[800px] max-h-[90vh] p-0 rounded-2xl">
                        <DialogHeader className="px-6 pt-6 pb-2">
                            <DialogTitle className="font-display text-2xl flex items-center gap-2">
                                <UserPlus className="h-6 w-6 text-primary" />
                                Add New Family Member
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Create a comprehensive profile for your family member. All fields are optional except name.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="max-h-[calc(90vh-180px)] overflow-y-auto">
                            <Tabs defaultValue="basic" className="px-6 pb-6">
                                <TabsList className="grid w-full grid-cols-4 rounded-xl mb-4">
                                    <TabsTrigger value="basic" className="rounded-lg">Basic Info</TabsTrigger>
                                    <TabsTrigger value="contact" className="rounded-lg">Contact</TabsTrigger>
                                    <TabsTrigger value="professional" className="rounded-lg">Professional</TabsTrigger>
                                    <TabsTrigger value="relationships" className="rounded-lg">Relationships</TabsTrigger>
                                </TabsList>

                                <TabsContent value="basic" className="space-y-4 mt-0">
                                    {/* Avatar Upload */}
                                    <div className="flex justify-center pb-4">
                                        <div className="relative">
                                            <Avatar className="h-24 w-24 ring-4 ring-primary/20 cursor-pointer hover:ring-primary/40 transition-all">
                                                <AvatarFallback className="bg-muted text-muted-foreground">
                                                    <Camera className="h-8 w-8" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md">
                                                <Plus className="h-5 w-5 text-primary-foreground" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Name Fields */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name *</Label>
                                            <Input 
                                                id="firstName" 
                                                placeholder="e.g., John"
                                                value={formData.first_name}
                                                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                                className="rounded-xl" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name *</Label>
                                            <Input 
                                                id="lastName" 
                                                placeholder="e.g., Miller"
                                                value={formData.last_name}
                                                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                                className="rounded-xl" 
                                            />
                                        </div>
                                    </div>

                                    {/* Aliases */}
                                    <DynamicListInput
                                        label="Aliases / Nicknames"
                                        items={formData.aliases || []}
                                        onChange={(aliases) => setFormData({...formData, aliases})}
                                        placeholder="e.g., Johnny, J.R."
                                    />

                                    {/* Birth Information */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                            <Input 
                                                id="dateOfBirth" 
                                                type="date"
                                                value={formData.date_of_birth}
                                                onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                                                className="rounded-xl" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="gender">Gender</Label>
                                            <Select 
                                                value={formData.gender} 
                                                onValueChange={(value) => setFormData({...formData, gender: value})}
                                            >
                                                <SelectTrigger className="rounded-xl">
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    <SelectItem value="male">Male</SelectItem>
                                                    <SelectItem value="female">Female</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="placeOfBirth">Place of Birth</Label>
                                        <Input 
                                            id="placeOfBirth" 
                                            placeholder="e.g., Springfield, Illinois"
                                            value={formData.place_of_birth}
                                            onChange={(e) => setFormData({...formData, place_of_birth: e.target.value})}
                                            className="rounded-xl" 
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="placeOfResidence">Current Place of Residence</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input 
                                                id="placeOfResidence" 
                                                placeholder="e.g., Chicago, Illinois"
                                                value={formData.place_of_residence}
                                                onChange={(e) => setFormData({...formData, place_of_residence: e.target.value})}
                                                className="rounded-xl pl-10" 
                                            />
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Bio / Notes</Label>
                                        <Textarea 
                                            id="bio"
                                            placeholder="Add any additional information about this family member..."
                                            value={formData.bio}
                                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                            className="rounded-xl min-h-[100px]"
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="contact" className="space-y-4 mt-0">
                                    {/* Phone Numbers */}
                                    <DynamicListInput
                                        label="Phone Numbers"
                                        items={formData.phone_numbers || []}
                                        onChange={(phone_numbers) => setFormData({...formData, phone_numbers})}
                                        placeholder="+1 (555) 000-0000"
                                    />

                                    {/* Email Addresses */}
                                    <DynamicListInput
                                        label="Email Addresses"
                                        items={formData.email_addresses || []}
                                        onChange={(email_addresses) => setFormData({...formData, email_addresses})}
                                        placeholder="email@example.com"
                                    />
                                </TabsContent>

                                <TabsContent value="professional" className="space-y-4 mt-0">
                                    <div className="space-y-2">
                                        <Label htmlFor="education">Education</Label>
                                        <div className="relative">
                                            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input 
                                                id="education" 
                                                placeholder="e.g., Bachelor's in Computer Science, Stanford University"
                                                value={formData.education}
                                                onChange={(e) => setFormData({...formData, education: e.target.value})}
                                                className="rounded-xl pl-10" 
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="occupation">Current Occupation</Label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input 
                                                id="occupation" 
                                                placeholder="e.g., Software Engineer at Google"
                                                value={formData.occupation}
                                                onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                                                className="rounded-xl pl-10" 
                                            />
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="relationships" className="space-y-4 mt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <RelationshipSelector
                                            label="Parents"
                                            value={formData.parents || []}
                                            onChange={(parents) => setFormData({...formData, parents: parents as string[]})}
                                            members={members}
                                            multiple
                                        />

                                        <RelationshipSelector
                                            label="Spouse / Partner"
                                            value={formData.spouse || ""}
                                            onChange={(spouse) => setFormData({...formData, spouse: spouse as string})}
                                            members={members}
                                        />

                                        <RelationshipSelector
                                            label="Children"
                                            value={formData.children || []}
                                            onChange={(children) => setFormData({...formData, children: children as string[]})}
                                            members={members}
                                            multiple
                                        />

                                        <RelationshipSelector
                                            label="Siblings"
                                            value={formData.siblings || []}
                                            onChange={(siblings) => setFormData({...formData, siblings: siblings as string[]})}
                                            members={members}
                                            multiple
                                        />
                                    </div>
                                </TabsContent>

                                {/* Role Selection - Always visible */}
                                <div className="pt-4 border-t mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Access Role</Label>
                                        <Select 
                                            value={formData.role} 
                                            onValueChange={(value: "admin" | "member" | "viewer") => setFormData({...formData, role: value})}
                                        >
                                            <SelectTrigger className="rounded-xl">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="admin">
                                                    <div className="flex items-center gap-2">
                                                        <Shield className="h-4 w-4 text-primary" />
                                                        <span>Admin - Full access to all features</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="member">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-primary" />
                                                        <span>Member - Can view and edit content</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="viewer">
                                                    <div className="flex items-center gap-2">
                                                        <Heart className="h-4 w-4 text-primary" />
                                                        <span>Viewer - View-only access</span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </Tabs>
                        </div>

                        <DialogFooter className="px-6 pb-6 pt-2 border-t">
                            <Button 
                                variant="outline" 
                                className="rounded-xl" 
                                onClick={() => {
                                    resetForm()
                                    setIsDialogOpen(false)
                                }}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                className="rounded-xl"
                                disabled={!formData.first_name || !formData.last_name}
                                onClick={handleSave}
                            >
                                Save Member
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="animate-fade-in-up">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Members</CardTitle>
                        <div className="w-10 h-10 rounded-xl bg-[oklch(0.94_0.02_145)] text-[oklch(0.35_0.06_145)] flex items-center justify-center">
                            <Users className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-display font-medium">{members.length}</div>
                    </CardContent>
                </Card>
                <Card className="animate-fade-in-up animation-delay-100">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Admins</CardTitle>
                        <div className="w-10 h-10 rounded-xl bg-[oklch(0.94_0.06_45)] text-[oklch(0.45_0.12_45)] flex items-center justify-center">
                            <Shield className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-display font-medium">
                            {members.filter(m => m.role === "admin").length}
                        </div>
                    </CardContent>
                </Card>
                <Card className="animate-fade-in-up animation-delay-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
                        <div className="w-10 h-10 rounded-xl bg-[oklch(0.95_0.04_85)] text-[oklch(0.40_0.08_85)] flex items-center justify-center">
                            <Activity className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-display font-medium">{members.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Table */}
            <Card className="animate-fade-in-up animation-delay-300">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[80px] pl-6">Avatar</TableHead>
                                <TableHead className="font-medium">Name</TableHead>
                                <TableHead className="font-medium">Email</TableHead>
                                <TableHead className="font-medium">Role</TableHead>
                                <TableHead className="text-right pr-6 font-medium">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.map((member) => (
                                <TableRow key={member.id} className="cursor-pointer transition-colors">
                                    <TableCell className="pl-6">
                                        <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                                            <AvatarImage src={member.avatar_url} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                                {member.first_name[0]}{member.last_name[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{member.first_name} {member.last_name}</span>
                                            <span className="text-xs text-muted-foreground md:hidden">
                                                {member.email_addresses?.[0] || "No email"}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground hidden md:table-cell">
                                        {member.email_addresses?.[0] || "No email"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={member.role === "admin" ? "sage" : member.role === "viewer" ? "secondary" : "default"} className="capitalize">
                                            {member.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-xl">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl">
                                                <DropdownMenuItem className="cursor-pointer rounded-lg">
                                                    <Mail className="mr-2 h-4 w-4" /> Send email
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer rounded-lg">
                                                    View profile
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer rounded-lg">
                                                    Edit member
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
