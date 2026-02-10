"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Download, Eye, Pencil, Trash2, FileText, Lock } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function DocumentDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as Id<"documents">

    const doc = useQuery(api.documents.getById, { id })
    const members = useQuery(api.members.list)

    const updateDocument = useMutation(api.documents.update)
    const deleteDocument = useMutation(api.documents.remove)

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editName, setEditName] = useState("")
    const [editDescription, setEditDescription] = useState("")

    const fileUrl = useQuery(api.documents.getFileUrl,
        doc?.storageId ? { storageId: doc.storageId } : "skip"
    )

    if (doc === undefined) {
        return (
            <div className="space-y-8 animate-fade-in-up">
                <div className="space-y-1">
                    <h1 className="text-4xl font-display font-medium tracking-tight">Loading...</h1>
                </div>
            </div>
        )
    }

    if (doc === null) {
        return (
            <div className="space-y-8 animate-fade-in-up">
                <div className="text-center py-16">
                    <h1 className="text-2xl font-display font-medium">Document not found</h1>
                    <p className="text-muted-foreground mt-2">The document you're looking for doesn't exist.</p>
                    <Button asChild className="mt-4"><Link href="/dashboard/documents">Back to Documents</Link></Button>
                </div>
            </div>
        )
    }

    const associatedMembers = (members ?? []).filter(m =>
        doc.associatedMemberIds?.includes(m._id)
    )

    const handleEditOpen = () => {
        setEditName(doc.name)
        setEditDescription(doc.description || "")
        setIsEditOpen(true)
    }

    const handleEditSubmit = async () => {
        await updateDocument({
            id,
            name: editName,
            description: editDescription,
        })
        setIsEditOpen(false)
    }

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
            await deleteDocument({ id })
            router.push("/dashboard/documents")
        }
    }

    const handleDownload = () => {
        if (!fileUrl) return
        const link = document.createElement("a")
        link.href = fileUrl
        link.download = doc.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handlePreview = () => {
        if (!fileUrl) return
        window.open(fileUrl, "_blank")
    }

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm text-muted-foreground animate-fade-in-up">
                <Link href="/dashboard/documents" className="hover:text-primary transition-colors cursor-pointer">
                    Documents
                </Link>
                <ChevronRight className="h-4 w-4 mx-2" />
                <span className="hover:text-primary cursor-pointer transition-colors">{doc.category}</span>
                <ChevronRight className="h-4 w-4 mx-2" />
                <span className="text-foreground font-medium">{doc.name}</span>
            </nav>

            <Card>
                <CardContent className="p-8 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-3xl md:text-4xl font-display font-medium tracking-tight">
                                    {doc.name}
                                </h1>
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[oklch(0.94_0.02_145)]">
                                    <Lock className="h-3.5 w-3.5 text-primary" />
                                    <span className="text-xs font-medium text-primary">Encrypted</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="blue" className="font-normal">
                                    {doc.category}
                                </Badge>
                                <span className="text-sm text-muted-foreground">• {doc.type} Document</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="rounded-xl"
                                disabled={!fileUrl}
                                onClick={handlePreview}
                            >
                                <Eye className="mr-2 h-4 w-4" /> Preview
                            </Button>
                            <Button
                                className="rounded-xl shadow-md hover:shadow-lg transition-shadow"
                                disabled={!fileUrl}
                                onClick={handleDownload}
                            >
                                <Download className="mr-2 h-4 w-4" /> Download
                            </Button>
                        </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-muted/50">
                        <div className="space-y-1.5">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">File Size</p>
                            <p className="font-medium">{doc.size}</p>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">File Type</p>
                            <p className="font-medium">{doc.type}</p>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Upload Date</p>
                            <p className="font-medium">
                                {new Date(doc._creationTime).toLocaleDateString("en-US", {
                                    year: "numeric", month: "long", day: "numeric"
                                })}
                            </p>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Category</p>
                            <p className="font-medium">{doc.category}</p>
                        </div>
                    </div>

                    {/* Description */}
                    {doc.description && (
                        <div className="space-y-3">
                            <h3 className="font-display text-lg font-medium">Description</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {doc.description}
                            </p>
                        </div>
                    )}

                    {/* Associated Members */}
                    {associatedMembers.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="font-display text-lg font-medium">Associated Members</h3>
                            <div className="grid gap-3">
                                {associatedMembers.map((member) => (
                                    <Link href={`/dashboard/members/${member._id}`} key={member._id}>
                                        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                                            <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                                                <AvatarImage src={member.avatarUrl} />
                                                <AvatarFallback className="bg-primary/10 text-primary">{member.firstName[0]}{member.lastName[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <p className="font-medium">{member.firstName} {member.lastName}</p>
                                                <p className="text-sm text-muted-foreground">{member.occupation || "Family member"}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>

                {/* Footer Actions */}
                <div className="bg-muted/30 p-4 flex justify-end gap-3 border-t rounded-b-2xl">
                    <Button variant="outline" className="rounded-xl" onClick={handleEditOpen}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit Details
                    </Button>
                    <Button
                        variant="destructive"
                        className="bg-[oklch(0.94_0.03_15)] text-[oklch(0.50_0.12_15)] hover:bg-[oklch(0.92_0.05_15)] border-none shadow-none rounded-xl"
                        onClick={handleDelete}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                </div>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Document Details</DialogTitle>
                        <DialogDescription>
                            Update the name and description of this document.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleEditSubmit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
