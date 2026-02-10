"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FileText, Lock, Upload, ShieldCheck, Search, CloudUpload, Plus, X, User } from "lucide-react"

// Define valid variants for Badge component
type ValidBadgeVariant = "default" | "secondary" | "destructive" | "outline" | "ghost" | "link" | "sage" | "terracotta" | "gold" | "blue" | "rose" | null | undefined

const getCategoryVariant = (category: string): ValidBadgeVariant => {
    switch (category) {
        case "Finance": return "gold"
        case "Health": return "rose"
        case "Legal": return "blue"
        case "Personal": return "sage"
        default: return "secondary"
    }
}

// Searchable Member Selector Component
function SearchableMemberSelector({
    selectedMembers,
    onChange,
    label,
    placeholder = "Search for family members...",
    members,
}: {
    selectedMembers: string[]
    onChange: (memberIds: string[]) => void
    label: string
    placeholder?: string
    members: Doc<"members">[]
}) {
    const [searchQuery, setSearchQuery] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const selectedMemberObjects = members.filter(m => selectedMembers.includes(m._id))

    const filteredMembers = members.filter(member =>
        !selectedMembers.includes(member._id) &&
        (member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()))
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

            {/* Selected Members Chips */}
            {selectedMemberObjects.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedMemberObjects.map((member) => (
                        <div
                            key={member._id}
                            className="flex items-center gap-2 px-3 py-1.5 bg-[oklch(0.94_0.02_145)] rounded-full text-sm"
                        >
                            <Avatar className="h-5 w-5">
                                <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                                    {member.firstName[0]}{member.lastName[0]}
                                </AvatarFallback>
                            </Avatar>
                            <span>{member.firstName} {member.lastName}</span>
                            <button
                                type="button"
                                onClick={() => removeMember(member._id)}
                                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors cursor-pointer"
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
                    placeholder={placeholder}
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
                                        key={member._id}
                                        onClick={() => addMember(member._id)}
                                        className="flex items-center gap-3 px-3 py-2 hover:bg-muted cursor-pointer transition-colors"
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                {member.firstName[0]}{member.lastName[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-sm font-medium block">{member.firstName} {member.lastName}</span>
                                            <span className="text-xs text-muted-foreground truncate block">{member.emailAddresses?.[0] || ""}</span>
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

export default function VaultPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterType, setFilterType] = useState("All Document Types")
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)

    const documents = useQuery(api.documents.list)
    const members = useQuery(api.members.list)

    // Upload form state
    const [uploadForm, setUploadForm] = useState({
        title: "",
        type: "",
        category: "",
        description: "",
        associatedMembers: [] as string[]
    })

    const filteredDocuments = (documents ?? []).filter((doc) => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter =
            filterType === "All Document Types" || doc.category === filterType || doc.type === filterType
        return matchesSearch && matchesFilter
    })

    const handleUpload = () => {
        // Handle upload logic here — file storage integration pending
        console.log("Uploading document:", uploadForm)
        setIsUploadDialogOpen(false)
        setUploadForm({
            title: "",
            type: "",
            category: "",
            description: "",
            associatedMembers: []
        })
    }

    if (documents === undefined) {
        return (
            <div className="space-y-8">
                <div className="space-y-1">
                    <h1 className="text-4xl font-display font-medium tracking-tight">Documents</h1>
                    <p className="text-muted-foreground">Loading documents...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-display font-medium tracking-tight">Documents</h1>
                    <p className="text-muted-foreground">Securely store and manage your family's important documents</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative w-full sm:w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search documents..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-full sm:w-[180px] rounded-xl">
                            <SelectValue placeholder="All Document Types" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="All Document Types">All Document Types</SelectItem>
                            <SelectItem value="Legal">Legal</SelectItem>
                            <SelectItem value="Insurance">Insurance</SelectItem>
                            <SelectItem value="Property">Property</SelectItem>
                            <SelectItem value="Personal">Personal</SelectItem>
                            <SelectItem value="Financial">Financial</SelectItem>
                            <SelectItem value="Medical">Medical</SelectItem>
                        </SelectContent>
                    </Select>
                    <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="shadow-md hover:shadow-lg transition-shadow">
                                <Plus className="mr-2 h-4 w-4" /> Upload
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto rounded-2xl">
                            <DialogHeader>
                                <DialogTitle className="font-display text-2xl">Upload New Document</DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                    Fill in the details below to securely upload your document.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6 py-4">
                                {/* Document Title & Category */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Document Title</Label>
                                        <Input
                                            id="title"
                                            placeholder="e.g., Mortgage Agreement"
                                            value={uploadForm.title}
                                            onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                                            className="rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select
                                            value={uploadForm.category}
                                            onValueChange={(value) => setUploadForm({ ...uploadForm, category: value })}
                                        >
                                            <SelectTrigger className="rounded-xl">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="Legal">Legal</SelectItem>
                                                <SelectItem value="Insurance">Insurance</SelectItem>
                                                <SelectItem value="Property">Property</SelectItem>
                                                <SelectItem value="Personal">Personal</SelectItem>
                                                <SelectItem value="Financial">Financial</SelectItem>
                                                <SelectItem value="Medical">Medical</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Document Type */}
                                <div className="space-y-2">
                                    <Label htmlFor="type">Document Type</Label>
                                    <Select
                                        value={uploadForm.type}
                                        onValueChange={(value) => setUploadForm({ ...uploadForm, type: value })}
                                    >
                                        <SelectTrigger className="rounded-xl">
                                            <SelectValue placeholder="Select document type" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="PDF">PDF</SelectItem>
                                            <SelectItem value="DOCX">Word Document</SelectItem>
                                            <SelectItem value="Passport">Passport</SelectItem>
                                            <SelectItem value="Deed">Deed</SelectItem>
                                            <SelectItem value="Image">Image</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Add a short description... (optional)"
                                        value={uploadForm.description}
                                        onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                                        className="h-24 rounded-xl"
                                    />
                                </div>

                                {/* File Upload & Associated Members */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>File Upload</Label>
                                        <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 cursor-pointer transition-all duration-200 h-[200px]">
                                            <CloudUpload className="h-8 w-8 text-muted-foreground mb-2" />
                                            <p className="text-sm font-medium text-primary">Click to upload <span className="text-muted-foreground">or drag and drop</span></p>
                                            <p className="text-xs text-muted-foreground mt-1">PDF, PNG, JPG, DOCX (MAX. 10MB)</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <SearchableMemberSelector
                                            label="Associated Family Members"
                                            selectedMembers={uploadForm.associatedMembers}
                                            onChange={(memberIds) => setUploadForm({ ...uploadForm, associatedMembers: memberIds })}
                                            placeholder="Search and add members..."
                                            members={members ?? []}
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    className="rounded-xl"
                                    onClick={() => {
                                        setIsUploadDialogOpen(false)
                                        setUploadForm({
                                            title: "",
                                            type: "",
                                            category: "",
                                            description: "",
                                            associatedMembers: []
                                        })
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="rounded-xl"
                                    disabled={!uploadForm.title}
                                    onClick={handleUpload}
                                >
                                    <Upload className="mr-2 h-4 w-4" /> Upload Document
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Security Banner */}
            <Card className="bg-[oklch(0.94_0.02_145)] border-[oklch(0.88_0.02_145)] animate-fade-in-up">
                <CardContent className="flex items-center gap-4 p-5">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-medium text-foreground mb-0.5">Security Status: Protected</h3>
                        <p className="text-sm text-muted-foreground">
                            All documents are end-to-end encrypted and securely stored
                        </p>
                    </div>
                    <Badge variant="sage" className="hidden sm:flex">Encrypted</Badge>
                </CardContent>
            </Card>

            {/* Documents Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredDocuments.map((doc, index) => (
                    <Link href={`/dashboard/vault/${doc._id}`} key={doc._id}>
                        <Card
                            className="cursor-pointer h-full group animate-fade-in-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-200">
                                    <FileText className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                                </div>
                                <Lock className="h-4 w-4 text-muted-foreground/50" />
                            </CardHeader>
                            <CardContent className="pt-4">
                                <h3 className="font-medium text-base mb-3 truncate">{doc.name}</h3>
                                <Badge variant={getCategoryVariant(doc.category)} className="font-normal w-fit">
                                    {doc.category}
                                </Badge>
                                <div className="text-xs text-muted-foreground flex items-center gap-2">
                                    <span>{doc.category}</span>
                                    <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                    <span>{doc.size}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Empty State */}
            {filteredDocuments.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-display text-lg font-medium mb-2">No documents found</h3>
                    <p className="text-muted-foreground text-sm max-w-sm">
                        Try adjusting your search or filter to find what you're looking for.
                    </p>
                </div>
            )}
        </div>
    )
}
