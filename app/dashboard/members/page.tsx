"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
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
import { Plus, MoreHorizontal, Mail, X, Users, Shield, Activity, UserPlus, Camera, Heart, User, Pencil, Eye } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface Member {
    id: string;
    first_name: string;
    middle_name?: string;
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

function DynamicListInput({ items, onChange, placeholder, label }: { items: string[]; onChange: (items: string[]) => void; placeholder?: string; label: string }) {
    const addItem = () => onChange([...items, ""])
    const removeItem = (index: number) => onChange(items.filter((_, i) => i !== index))
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
                    <Input value={item} onChange={(e) => updateItem(index, e.target.value)} placeholder={placeholder} className="rounded-xl flex-1" />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)} className="rounded-xl shrink-0"><X className="h-4 w-4" /></Button>
                </div>
            ))}
            <Button type="button" variant="outline" onClick={addItem} className="w-full rounded-xl"><Plus className="h-4 w-4 mr-2" /> Add {label}</Button>
        </div>
    )
}

function RelationshipSelector({ label, value, onChange, members, multiple = false }: { label: string; value: string | string[]; onChange: (value: string | string[]) => void; members: Member[]; multiple?: boolean }) {
    const [searchQuery, setSearchQuery] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const selectedIds = multiple ? (value as string[]) : value ? [value as string] : []
    const selectedIdSet = new Set(selectedIds)
    const selectedMembers = members.filter(m => selectedIdSet.has(m.id))
    const filteredMembers = members.filter(member =>
        !selectedIdSet.has(member.id) &&
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
        if (multiple) onChange(selectedIds.filter(id => id !== memberId))
        else onChange("")
    }

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            {selectedMembers.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedMembers.map((member) => (
                        <div key={member.id} className="flex items-center gap-2 px-3 py-1.5 bg-[oklch(0.94_0.02_145)] rounded-full text-sm">
                            <Avatar className="h-5 w-5"><AvatarFallback className="bg-primary/10 text-primary text-[10px]">{member.first_name[0]}{member.last_name[0]}</AvatarFallback></Avatar>
                            <span>{member.first_name} {member.last_name}</span>
                            <button type="button" onClick={() => removeMember(member.id)} className="hover:bg-primary/20 rounded-full p-0.5 transition-colors cursor-pointer"><X className="h-3 w-3" /></button>
                        </div>
                    ))}
                </div>
            )}
            <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input ref={inputRef} value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setIsOpen(true) }} onFocus={() => setIsOpen(true)} placeholder={`Search for ${label.toLowerCase()}...`} className="rounded-xl pl-10" />
                {isOpen && (searchQuery || filteredMembers.length > 0) && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-xl shadow-lg max-h-[200px] overflow-y-auto">
                            {filteredMembers.length === 0 ? (
                                <div className="px-3 py-2 text-sm text-muted-foreground">{searchQuery ? "No members found" : "Type to search..."}</div>
                            ) : (
                                filteredMembers.map((member) => (
                                    <div key={member.id} onClick={() => addMember(member.id)} className="flex items-center gap-3 px-3 py-2 hover:bg-muted cursor-pointer transition-colors">
                                        <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/10 text-primary text-xs">{member.first_name[0]}{member.last_name[0]}</AvatarFallback></Avatar>
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

function MembersPageContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const editMemberId = searchParams.get('edit')

    const [members, setMembers] = useState<Member[]>(mockMembers)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingMember, setEditingMember] = useState<Member | null>(null)
    const [formData, setFormData] = useState<Partial<Member>>({
        first_name: "", middle_name: "", last_name: "", aliases: [], date_of_birth: "", place_of_birth: "", place_of_residence: "",
        phone_numbers: [], email_addresses: [], education: "", occupation: "", gender: "", bio: "",
        father: "", mother: "", spouse: "", role: "member", avatar_url: "",
    })

    // Handle edit mode from URL params
    useEffect(() => {
        if (editMemberId) {
            const memberToEdit = members.find(m => m.id === editMemberId)
            if (memberToEdit) {
                setEditingMember(memberToEdit)
                setFormData({ ...memberToEdit })
                setIsDialogOpen(true)
            }
        }
    }, [editMemberId, members])

    const resetForm = () => {
        setFormData({
            first_name: "", middle_name: "", last_name: "", aliases: [], date_of_birth: "", place_of_birth: "", place_of_residence: "",
            phone_numbers: [], email_addresses: [], education: "", occupation: "", gender: "", bio: "",
            father: "", mother: "", spouse: "", role: "member", avatar_url: "",
        })
        setEditingMember(null)
        // Clear edit param from URL if present
        if (editMemberId) {
            router.replace('/dashboard/members', { scroll: false })
        }
    }

    const openAddModal = () => { resetForm(); setIsDialogOpen(true) }
    const openEditModal = (member: Member) => {
        setEditingMember(member)
        setFormData({ ...member })
        setIsDialogOpen(true)
    }

    const handleSave = () => {
        if (!formData.first_name || !formData.last_name) return
        if (editingMember) {
            setMembers(members.map(m => m.id === editingMember.id ? { ...m, ...formData } as Member : m))
        } else {
            const newMember: Member = {
                id: crypto.randomUUID(),
                first_name: formData.first_name,
                middle_name: formData.middle_name,
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
                father: formData.father,
                mother: formData.mother,
                spouse: formData.spouse,
                role: formData.role || "member",
                created_at: new Date().toISOString(),
                avatar_url: formData.avatar_url,
            }
            setMembers([...members, newMember])
        }
        resetForm()
        setIsDialogOpen(false)
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-display font-medium tracking-tight">Family Members</h1>
                    <p className="text-muted-foreground">Manage family members and their access permissions</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    if (!open) resetForm()
                    setIsDialogOpen(open)
                }}>
                    <DialogTrigger asChild>
                        <Button onClick={openAddModal} className="shadow-md hover:shadow-lg transition-shadow"><UserPlus className="mr-2 h-4 w-4" /> Add Member</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="font-display text-2xl flex items-center gap-2">
                                <UserPlus className="h-6 w-6 text-primary" />
                                {editingMember ? 'Edit Member' : 'Add New Family Member'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingMember ? 'Update the member information below.' : 'Create a profile for your family member. All fields are optional except name.'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            {/* Avatar Upload */}
                            <div className="flex justify-center">
                                <div className="relative">
                                    <Avatar className="h-24 w-24 ring-4 ring-primary/20 cursor-pointer hover:ring-primary/40 transition-all">
                                        <AvatarImage src={formData.avatar_url} />
                                        <AvatarFallback className="bg-muted text-muted-foreground">
                                            <Camera className="h-8 w-8" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-primary/90 transition-colors">
                                        <Plus className="h-5 w-5 text-primary-foreground" />
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp,image/gif"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) {
                                                    // Validate file size (max 5MB)
                                                    const MAX_SIZE = 5 * 1024 * 1024
                                                    if (file.size > MAX_SIZE) {
                                                        alert('File size must be less than 5MB')
                                                        return
                                                    }
                                                    // Validate file type
                                                    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
                                                    if (!validTypes.includes(file.type)) {
                                                        alert('File must be an image (JPEG, PNG, WebP, or GIF)')
                                                        return
                                                    }
                                                    const reader = new FileReader()
                                                    reader.onloadend = () => {
                                                        setFormData({...formData, avatar_url: reader.result as string})
                                                    }
                                                    reader.onerror = () => {
                                                        alert('Failed to read file. Please try again.')
                                                    }
                                                    reader.readAsDataURL(file)
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Name */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>First Name *</Label>
                                    <Input value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} className="rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Middle Name</Label>
                                    <Input value={formData.middle_name} onChange={(e) => setFormData({...formData, middle_name: e.target.value})} className="rounded-xl" placeholder="Optional" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Last Name *</Label>
                                    <Input value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} className="rounded-xl" />
                                </div>
                            </div>

                            {/* Aliases */}
                            <DynamicListInput label="Aliases / Nicknames" items={formData.aliases || []} onChange={(aliases) => setFormData({...formData, aliases})} placeholder="e.g., Johnny, J.R." />

                            {/* DOB & Gender */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Date of Birth</Label>
                                    <Input type="date" value={formData.date_of_birth} onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})} className="rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Gender</Label>
                                    <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                                        <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select gender" /></SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Birthplace & Residence */}
                            <div className="space-y-2">
                                <Label>Place of Birth</Label>
                                <Input value={formData.place_of_birth} onChange={(e) => setFormData({...formData, place_of_birth: e.target.value})} className="rounded-xl" placeholder="e.g., Springfield, Illinois" />
                            </div>
                            <div className="space-y-2">
                                <Label>Current Place of Residence</Label>
                                <Input value={formData.place_of_residence} onChange={(e) => setFormData({...formData, place_of_residence: e.target.value})} className="rounded-xl" placeholder="e.g., Chicago, Illinois" />
                            </div>

                            {/* Contact */}
                            <DynamicListInput label="Phone Numbers" items={formData.phone_numbers || []} onChange={(phone_numbers) => setFormData({...formData, phone_numbers})} placeholder="+1 (555) 000-0000" />
                            <DynamicListInput label="Email Addresses" items={formData.email_addresses || []} onChange={(email_addresses) => setFormData({...formData, email_addresses})} placeholder="email@example.com" />

                            {/* Professional */}
                            <div className="space-y-2">
                                <Label>Education</Label>
                                <Input value={formData.education} onChange={(e) => setFormData({...formData, education: e.target.value})} className="rounded-xl" placeholder="e.g., Bachelor's in Computer Science" />
                            </div>
                            <div className="space-y-2">
                                <Label>Occupation</Label>
                                <Input value={formData.occupation} onChange={(e) => setFormData({...formData, occupation: e.target.value})} className="rounded-xl" placeholder="e.g., Software Engineer" />
                            </div>

                            {/* Bio */}
                            <div className="space-y-2">
                                <Label>Bio / Notes</Label>
                                <Textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="rounded-xl min-h-[100px]" placeholder="Add any additional information..." />
                            </div>

                            {/* Relationships */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <RelationshipSelector label="Father" value={formData.father || ""} onChange={(father) => setFormData({...formData, father: father as string})} members={members.filter(m => m.gender === 'male')} />
                                <RelationshipSelector label="Mother" value={formData.mother || ""} onChange={(mother) => setFormData({...formData, mother: mother as string})} members={members.filter(m => m.gender === 'female')} />
                                <RelationshipSelector label="Spouse / Partner" value={formData.spouse || ""} onChange={(spouse) => setFormData({...formData, spouse: spouse as string})} members={members} />
                            </div>

                            {/* Role */}
                            <div className="space-y-2">
                                <Label>Access Role</Label>
                                <Select value={formData.role} onValueChange={(value: "admin" | "member" | "viewer") => setFormData({...formData, role: value})}>
                                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select role" /></SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="admin"><div className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /><span>Admin - Full access</span></div></SelectItem>
                                        <SelectItem value="member"><div className="flex items-center gap-2"><User className="h-4 w-4 text-primary" /><span>Member - Can view and edit</span></div></SelectItem>
                                        <SelectItem value="viewer"><div className="flex items-center gap-2"><Heart className="h-4 w-4 text-primary" /><span>Viewer - View-only</span></div></SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" className="rounded-xl" onClick={() => { resetForm(); setIsDialogOpen(false) }}>Cancel</Button>
                            <Button className="rounded-xl" disabled={!formData.first_name || !formData.last_name} onClick={handleSave}>
                                {editingMember ? 'Save Changes' : 'Save Member'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="animate-fade-in-up">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Members</CardTitle>
                        <div className="w-10 h-10 rounded-xl bg-[oklch(0.94_0.02_145)] text-[oklch(0.35_0.06_145)] flex items-center justify-center"><Users className="h-5 w-5" /></div>
                    </CardHeader>
                    <CardContent><div className="text-3xl font-display font-medium">{members.length}</div></CardContent>
                </Card>
                <Card className="animate-fade-in-up animation-delay-100">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Admins</CardTitle>
                        <div className="w-10 h-10 rounded-xl bg-[oklch(0.94_0.06_45)] text-[oklch(0.45_0.12_45)] flex items-center justify-center"><Shield className="h-5 w-5" /></div>
                    </CardHeader>
                    <CardContent><div className="text-3xl font-display font-medium">{members.filter(m => m.role === "admin").length}</div></CardContent>
                </Card>
                <Card className="animate-fade-in-up animation-delay-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
                        <div className="w-10 h-10 rounded-xl bg-[oklch(0.95_0.04_85)] text-[oklch(0.40_0.08_85)] flex items-center justify-center"><Activity className="h-5 w-5" /></div>
                    </CardHeader>
                    <CardContent><div className="text-3xl font-display font-medium">{members.length}</div></CardContent>
                </Card>
            </div>

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
                                            <AvatarFallback className="bg-primary/10 text-primary font-medium">{member.first_name[0]}{member.last_name[0]}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{member.first_name} {member.last_name}</span>
                                            <span className="text-xs text-muted-foreground md:hidden">{member.email_addresses?.[0] || "No email"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground hidden md:table-cell">{member.email_addresses?.[0] || "No email"}</TableCell>
                                    <TableCell>
                                        <Badge variant={member.role === "admin" ? "sage" : member.role === "viewer" ? "secondary" : "default"} className="capitalize">{member.role}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-xl"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl">
                                                <DropdownMenuItem className="cursor-pointer rounded-lg" asChild><Link href={`/dashboard/members/${member.id}`}><Eye className="mr-2 h-4 w-4" /> View Profile</Link></DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer rounded-lg" asChild><Link href={`/dashboard/members?edit=${member.id}`}><Pencil className="mr-2 h-4 w-4" /> Edit member</Link></DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer rounded-lg"><Mail className="mr-2 h-4 w-4" /> Send email</DropdownMenuItem>
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

export default function MembersPage() {
    return (
        <Suspense fallback={<div className="p-8">Loading...</div>}>
            <MembersPageContent />
        </Suspense>
    )
}
