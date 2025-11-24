"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
import { FileText, Lock, Upload, ShieldCheck, Search, Loader2 } from "lucide-react"
import { uploadDocument } from "@/app/actions/documents"
import { toast } from "sonner"
import { format } from "date-fns"
import { MultiSelect } from "@/components/ui/multi-select"
import { FileUpload } from "@/components/ui/file-upload"

interface DocumentsClientPageProps {
    documents: any[]
    members: any[]
}

export default function DocumentsClientPage({ documents, members }: DocumentsClientPageProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterType, setFilterType] = useState("All Document Types")
    const [isPending, startTransition] = useTransition()
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Form State
    const [selectedMembers, setSelectedMembers] = useState<string[]>([])
    const [description, setDescription] = useState("")
    const [files, setFiles] = useState<File[]>([])

    const filteredDocuments = documents.filter((doc) => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = filterType === "All Document Types" || doc.type.includes(filterType.toLowerCase())
        return matchesSearch && matchesFilter
    })

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (files.length === 0) {
            toast.error("Please select a file to upload")
            return
        }

        const formData = new FormData()
        formData.append("file", files[0])
        formData.append("description", description)
        formData.append("memberIds", JSON.stringify(selectedMembers))

        startTransition(async () => {
            try {
                await uploadDocument(formData)
                toast.success("Document uploaded successfully!")
                setIsDialogOpen(false)
                // Reset form
                setSelectedMembers([])
                setDescription("")
                setFiles([])
            } catch (error) {
                toast.error("Failed to upload document.")
                console.error(error)
            }
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative w-full sm:w-[300px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search documents..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="All Document Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All Document Types">All Document Types</SelectItem>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="image">Image</SelectItem>
                        </SelectContent>
                    </Select>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Upload className="mr-2 h-4 w-4" /> Upload Document
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Upload New Document</DialogTitle>
                                <DialogDescription>
                                    Select a file to upload to the secure vault.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleUpload}>
                                <div className="grid gap-6 py-4">
                                    <div className="grid gap-2">
                                        <Label>File <span className="text-red-500">*</span></Label>
                                        <FileUpload
                                            value={files}
                                            onChange={setFiles}
                                            multiple={false}
                                            maxSize={50}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Optional description of the document"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Associated Members</Label>
                                        <MultiSelect
                                            options={members.map(m => ({
                                                label: `${m.firstName} ${m.lastName}`,
                                                value: m.id
                                            }))}
                                            selected={selectedMembers}
                                            onChange={setSelectedMembers}
                                            placeholder="Select members..."
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isPending}>
                                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card className="bg-blue-50/50 border-blue-100">
                <CardContent className="flex items-center gap-4 p-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-blue-900">
                        Security Status: All documents are end-to-end encrypted
                    </span>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredDocuments.map((doc) => (
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" key={doc.id}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-gray-500" />
                                </div>
                                <Lock className="h-4 w-4 text-gray-400" />
                            </CardHeader>
                            <CardContent className="pt-4">
                                <h3 className="font-semibold text-base mb-2 truncate">{doc.name}</h3>
                                <Badge variant="secondary" className="mb-4 font-normal">
                                    {doc.type.split('/')[1] || doc.type}
                                </Badge>
                                <div className="text-xs text-muted-foreground">
                                    {format(new Date(doc.createdAt), "MMM d, yyyy")} • {(doc.size / 1024).toFixed(1)} KB
                                </div>
                            </CardContent>
                        </Card>
                    </a>
                ))}
            </div>
        </div>
    )
}
