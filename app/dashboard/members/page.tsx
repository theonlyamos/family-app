"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
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

// Form data type for the member dialog
interface MemberFormData {
    firstName: string;
    middleName: string;
    lastName: string;
    aliases: string[];
    dateOfBirth: string;
    placeOfBirth: string;
    placeOfResidence: string;
    phoneNumbers: string[];
    emailAddresses: string[];
    education: string;
    occupation: string;
    gender: string;
    bio: string;
    fatherId: string;
    motherId: string;
    spouseId: string;
    avatarUrl: string;
}

const emptyForm: MemberFormData = {
    firstName: "", middleName: "", lastName: "", aliases: [], dateOfBirth: "", placeOfBirth: "", placeOfResidence: "",
    phoneNumbers: [], emailAddresses: [], education: "", occupation: "", gender: "", bio: "",
    fatherId: "", motherId: "", spouseId: "", avatarUrl: "",
}

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

function RelationshipSelector({ label, value, onChange, members, multiple = false }: { label: string; value: string; onChange: (value: string) => void; members: Doc<"members">[]; multiple?: boolean }) {
    const [searchQuery, setSearchQuery] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const selectedMember = value ? members.find(m => m._id === value) : null
    const filteredMembers = members.filter(member =>
        member._id !== value &&
        (member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const selectMember = (memberId: string) => {
        onChange(memberId)
        setSearchQuery("")
        setIsOpen(false)
        inputRef.current?.focus()
    }

    const clearMember = () => {
        onChange("")
    }

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            {selectedMember && (
                <div className="flex flex-wrap gap-2 mb-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[oklch(0.94_0.02_145)] rounded-full text-sm">
                        <Avatar className="h-5 w-5"><AvatarFallback className="bg-primary/10 text-primary text-[10px]">{selectedMember.firstName[0]}{selectedMember.lastName[0]}</AvatarFallback></Avatar>
                        <span>{selectedMember.firstName} {selectedMember.lastName}</span>
                        <button type="button" onClick={clearMember} className="hover:bg-primary/20 rounded-full p-0.5 transition-colors cursor-pointer"><X className="h-3 w-3" /></button>
                    </div>
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
                                    <div key={member._id} onClick={() => selectMember(member._id)} className="flex items-center gap-3 px-3 py-2 hover:bg-muted cursor-pointer transition-colors">
                                        <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/10 text-primary text-xs">{member.firstName[0]}{member.lastName[0]}</AvatarFallback></Avatar>
                                        <span className="text-sm">{member.firstName} {member.lastName}</span>
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

    const members = useQuery(api.members.list)
    const createMember = useMutation(api.members.create)
    const updateMember = useMutation(api.members.update)

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingMemberId, setEditingMemberId] = useState<Id<"members"> | null>(null)
    const [formData, setFormData] = useState<MemberFormData>(emptyForm)

    // Handle edit mode from URL params
    useEffect(() => {
        if (editMemberId && members) {
            const memberToEdit = members.find(m => m._id === editMemberId)
            if (memberToEdit) {
                setEditingMemberId(memberToEdit._id)
                setFormData({
                    firstName: memberToEdit.firstName,
                    middleName: memberToEdit.middleName || "",
                    lastName: memberToEdit.lastName,
                    aliases: memberToEdit.aliases || [],
                    dateOfBirth: memberToEdit.dateOfBirth || "",
                    placeOfBirth: memberToEdit.placeOfBirth || "",
                    placeOfResidence: memberToEdit.placeOfResidence || "",
                    phoneNumbers: memberToEdit.phoneNumbers || [],
                    emailAddresses: memberToEdit.emailAddresses || [],
                    education: memberToEdit.education || "",
                    occupation: memberToEdit.occupation || "",
                    gender: memberToEdit.gender || "",
                    bio: memberToEdit.bio || "",
                    fatherId: memberToEdit.fatherId || "",
                    motherId: memberToEdit.motherId || "",
                    spouseId: memberToEdit.spouseId || "",
                    avatarUrl: memberToEdit.avatarUrl || "",
                })
                setIsDialogOpen(true)
            }
        }
    }, [editMemberId, members])

    const resetForm = () => {
        setFormData(emptyForm)
        setEditingMemberId(null)
        if (editMemberId) {
            router.replace('/dashboard/members', { scroll: false })
        }
    }

    const openAddModal = () => { resetForm(); setIsDialogOpen(true) }
    const openEditModal = (member: Doc<"members">) => {
        setEditingMemberId(member._id)
        setFormData({
            firstName: member.firstName,
            middleName: member.middleName || "",
            lastName: member.lastName,
            aliases: member.aliases || [],
            dateOfBirth: member.dateOfBirth || "",
            placeOfBirth: member.placeOfBirth || "",
            placeOfResidence: member.placeOfResidence || "",
            phoneNumbers: member.phoneNumbers || [],
            emailAddresses: member.emailAddresses || [],
            education: member.education || "",
            occupation: member.occupation || "",
            gender: member.gender || "",
            bio: member.bio || "",
            fatherId: member.fatherId || "",
            motherId: member.motherId || "",
            spouseId: member.spouseId || "",
            avatarUrl: member.avatarUrl || "",
        })
        setIsDialogOpen(true)
    }

    const handleSave = async () => {
        if (!formData.firstName || !formData.lastName) return
        const cleanedAliases = formData.aliases.filter(a => a.trim() !== "")
        const cleanedPhones = formData.phoneNumbers.filter(p => p.trim() !== "")
        const cleanedEmails = formData.emailAddresses.filter(e => e.trim() !== "")

        if (editingMemberId) {
            await updateMember({
                id: editingMemberId,
                firstName: formData.firstName,
                ...(formData.middleName && { middleName: formData.middleName }),
                lastName: formData.lastName,
                ...(cleanedAliases.length > 0 && { aliases: cleanedAliases }),
                ...(formData.dateOfBirth && { dateOfBirth: formData.dateOfBirth }),
                ...(formData.placeOfBirth && { placeOfBirth: formData.placeOfBirth }),
                ...(formData.placeOfResidence && { placeOfResidence: formData.placeOfResidence }),
                ...(cleanedPhones.length > 0 && { phoneNumbers: cleanedPhones }),
                ...(cleanedEmails.length > 0 && { emailAddresses: cleanedEmails }),
                ...(formData.education && { education: formData.education }),
                ...(formData.occupation && { occupation: formData.occupation }),
                ...(formData.gender && { gender: formData.gender }),
                ...(formData.bio && { bio: formData.bio }),
                ...(formData.avatarUrl && { avatarUrl: formData.avatarUrl }),
                ...(formData.fatherId && { fatherId: formData.fatherId as Id<"members"> }),
                ...(formData.motherId && { motherId: formData.motherId as Id<"members"> }),
                ...(formData.spouseId && { spouseId: formData.spouseId as Id<"members"> }),
            })
        } else {
            await createMember({
                firstName: formData.firstName,
                ...(formData.middleName && { middleName: formData.middleName }),
                lastName: formData.lastName,
                ...(cleanedAliases.length > 0 && { aliases: cleanedAliases }),
                ...(formData.dateOfBirth && { dateOfBirth: formData.dateOfBirth }),
                ...(formData.placeOfBirth && { placeOfBirth: formData.placeOfBirth }),
                ...(formData.placeOfResidence && { placeOfResidence: formData.placeOfResidence }),
                ...(cleanedPhones.length > 0 && { phoneNumbers: cleanedPhones }),
                ...(cleanedEmails.length > 0 && { emailAddresses: cleanedEmails }),
                ...(formData.education && { education: formData.education }),
                ...(formData.occupation && { occupation: formData.occupation }),
                ...(formData.gender && { gender: formData.gender }),
                ...(formData.bio && { bio: formData.bio }),
                ...(formData.avatarUrl && { avatarUrl: formData.avatarUrl }),
                ...(formData.fatherId && { fatherId: formData.fatherId as Id<"members"> }),
                ...(formData.motherId && { motherId: formData.motherId as Id<"members"> }),
                ...(formData.spouseId && { spouseId: formData.spouseId as Id<"members"> }),
            })
        }
        resetForm()
        setIsDialogOpen(false)
    }

    if (members === undefined) {
        return (
            <div className="space-y-8">
                <div className="space-y-1">
                    <h1 className="text-4xl font-display font-medium tracking-tight">Family Members</h1>
                    <p className="text-muted-foreground">Loading members...</p>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                    {[1, 2, 3].map(i => (
                        <Card key={i} className="animate-pulse"><CardContent className="p-6"><div className="h-8 bg-muted rounded" /></CardContent></Card>
                    ))}
                </div>
            </div>
        )
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
                                {editingMemberId ? 'Edit Member' : 'Add New Family Member'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingMemberId ? 'Update the member information below.' : 'Create a profile for your family member. All fields are optional except name.'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            {/* Avatar Upload */}
                            <div className="flex justify-center">
                                <div className="relative">
                                    <Avatar className="h-24 w-24 ring-4 ring-primary/20 cursor-pointer hover:ring-primary/40 transition-all">
                                        <AvatarImage src={formData.avatarUrl} />
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
                                                    const MAX_SIZE = 5 * 1024 * 1024
                                                    if (file.size > MAX_SIZE) {
                                                        alert('File size must be less than 5MB')
                                                        return
                                                    }
                                                    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
                                                    if (!validTypes.includes(file.type)) {
                                                        alert('File must be an image (JPEG, PNG, WebP, or GIF)')
                                                        return
                                                    }
                                                    const reader = new FileReader()
                                                    reader.onloadend = () => {
                                                        setFormData({ ...formData, avatarUrl: reader.result as string })
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
                                    <Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Middle Name</Label>
                                    <Input value={formData.middleName} onChange={(e) => setFormData({ ...formData, middleName: e.target.value })} className="rounded-xl" placeholder="Optional" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Last Name *</Label>
                                    <Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="rounded-xl" />
                                </div>
                            </div>

                            {/* Aliases */}
                            <DynamicListInput label="Aliases / Nicknames" items={formData.aliases || []} onChange={(aliases) => setFormData({ ...formData, aliases })} placeholder="e.g., Johnny, J.R." />

                            {/* DOB & Gender */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Date of Birth</Label>
                                    <Input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} className="rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Gender</Label>
                                    <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
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
                                <Input value={formData.placeOfBirth} onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })} className="rounded-xl" placeholder="e.g., Springfield, Illinois" />
                            </div>
                            <div className="space-y-2">
                                <Label>Current Place of Residence</Label>
                                <Input value={formData.placeOfResidence} onChange={(e) => setFormData({ ...formData, placeOfResidence: e.target.value })} className="rounded-xl" placeholder="e.g., Chicago, Illinois" />
                            </div>

                            {/* Contact */}
                            <DynamicListInput label="Phone Numbers" items={formData.phoneNumbers || []} onChange={(phoneNumbers) => setFormData({ ...formData, phoneNumbers })} placeholder="+1 (555) 000-0000" />
                            <DynamicListInput label="Email Addresses" items={formData.emailAddresses || []} onChange={(emailAddresses) => setFormData({ ...formData, emailAddresses })} placeholder="email@example.com" />

                            {/* Professional */}
                            <div className="space-y-2">
                                <Label>Education</Label>
                                <Input value={formData.education} onChange={(e) => setFormData({ ...formData, education: e.target.value })} className="rounded-xl" placeholder="e.g., Bachelor's in Computer Science" />
                            </div>
                            <div className="space-y-2">
                                <Label>Occupation</Label>
                                <Input value={formData.occupation} onChange={(e) => setFormData({ ...formData, occupation: e.target.value })} className="rounded-xl" placeholder="e.g., Software Engineer" />
                            </div>

                            {/* Bio */}
                            <div className="space-y-2">
                                <Label>Bio / Notes</Label>
                                <Textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="rounded-xl min-h-[100px]" placeholder="Add any additional information..." />
                            </div>

                            {/* Relationships */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <RelationshipSelector label="Father" value={formData.fatherId} onChange={(fatherId) => setFormData({ ...formData, fatherId })} members={members.filter(m => m.gender === 'male')} />
                                <RelationshipSelector label="Mother" value={formData.motherId} onChange={(motherId) => setFormData({ ...formData, motherId })} members={members.filter(m => m.gender === 'female')} />
                                <RelationshipSelector label="Spouse / Partner" value={formData.spouseId} onChange={(spouseId) => setFormData({ ...formData, spouseId })} members={members} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" className="rounded-xl" onClick={() => { resetForm(); setIsDialogOpen(false) }}>Cancel</Button>
                            <Button className="rounded-xl" disabled={!formData.firstName || !formData.lastName} onClick={handleSave}>
                                {editingMemberId ? 'Save Changes' : 'Save Member'}
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
                    <CardContent><div className="text-3xl font-display font-medium">0</div></CardContent>
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
                                <TableRow key={member._id} className="cursor-pointer transition-colors">
                                    <TableCell className="pl-6">
                                        <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                                            <AvatarImage src={member.avatarUrl} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-medium">{member.firstName[0]}{member.lastName[0]}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{member.firstName} {member.lastName}</span>
                                            <span className="text-xs text-muted-foreground md:hidden">{member.emailAddresses?.[0] || "No email"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground hidden md:table-cell">{member.emailAddresses?.[0] || "No email"}</TableCell>
                                    <TableCell>
                                        <Badge variant="default" className="capitalize">member</Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-xl"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl">
                                                <DropdownMenuItem className="cursor-pointer rounded-lg" asChild><Link href={`/dashboard/members/${member._id}`}><Eye className="mr-2 h-4 w-4" /> View Profile</Link></DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer rounded-lg" onClick={() => openEditModal(member)}><Pencil className="mr-2 h-4 w-4" /> Edit member</DropdownMenuItem>
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
