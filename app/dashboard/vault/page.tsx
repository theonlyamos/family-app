"use client"

import { useState } from "react"
import Link from "next/link"
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
import { FileText, Lock, Upload, ShieldCheck, Search, File, CloudUpload, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

const mockDocuments = [
    {
        id: "1",
        name: "Mortgage Agreement",
        type: "PDF",
        size: "2.1 MB",
        date: "May 20, 2024",
        category: "Property",
        variant: "rose" as const,
    },
    {
        id: "2",
        name: "Birth Certificate - John",
        type: "Passport",
        size: "1.5 MB",
        date: "Apr 15, 2024",
        category: "Personal",
        variant: "gold" as const,
    },
    {
        id: "3",
        name: "Last Will & Testament",
        type: "DOCX",
        size: "800 KB",
        date: "Mar 02, 2024",
        category: "Legal",
        variant: "blue" as const,
    },
    {
        id: "4",
        name: "Car Title - Honda Civic",
        type: "Deed",
        size: "1.2 MB",
        date: "Feb 28, 2024",
        category: "Property",
        variant: "sage" as const,
    },
    {
        id: "5",
        name: "Passport - Jane Doe",
        type: "Passport",
        size: "4.5 MB",
        date: "Jan 10, 2024",
        category: "Personal",
        variant: "gold" as const,
    },
    {
        id: "6",
        name: "Home Insurance Policy",
        type: "PDF",
        size: "3.0 MB",
        date: "Dec 05, 2023",
        category: "Insurance",
        variant: "terracotta" as const,
    },
]

export default function VaultPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterType, setFilterType] = useState("All Document Types")

    const filteredDocuments = mockDocuments.filter((doc) => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter =
            filterType === "All Document Types" || doc.category === filterType || doc.type === filterType
        return matchesSearch && matchesFilter
    })

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
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="shadow-md hover:shadow-lg transition-shadow">
                                <Plus className="mr-2 h-4 w-4" /> Upload
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[800px] rounded-2xl">
                            <DialogHeader>
                                <DialogTitle className="font-display text-xl">Upload New Document</DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                    Fill in the details below to securely upload your document.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="title">Document Title</Label>
                                        <Input id="title" placeholder="e.g., Mortgage Agreement" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="type">Document Type</Label>
                                        <Select>
                                            <SelectTrigger className="rounded-xl">
                                                <SelectValue placeholder="Select document type" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="legal">Legal</SelectItem>
                                                <SelectItem value="insurance">Insurance</SelectItem>
                                                <SelectItem value="property">Property</SelectItem>
                                                <SelectItem value="personal">Personal</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" placeholder="Add a short description... (optional)" className="h-24 rounded-xl" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>File Upload</Label>
                                        <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 cursor-pointer transition-all duration-200 h-[150px]">
                                            <CloudUpload className="h-8 w-8 text-muted-foreground mb-2" />
                                            <p className="text-sm font-medium text-primary">Click to upload <span className="text-muted-foreground">or drag and drop</span></p>
                                            <p className="text-xs text-muted-foreground mt-1">PDF, PNG, JPG, DOCX (MAX. 10MB)</p>
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Associated Family Members (optional)</Label>
                                        <div className="border border-border rounded-xl p-2 h-[150px] overflow-y-auto space-y-1 bg-card">
                                            {["John Miller", "Jane Miller", "Sam Miller", "Emily Miller"].map((member) => (
                                                <div key={member} className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-lg cursor-pointer transition-colors">
                                                    <div className="h-4 w-4 rounded border border-border" />
                                                    <span className="text-sm">{member}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" className="rounded-xl">Cancel</Button>
                                <Button className="rounded-xl">Upload Document</Button>
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
                    <Link href={`/dashboard/vault/${doc.id}`} key={doc.id}>
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
                                <Badge variant={doc.variant} className="mb-4 font-normal">
                                    {doc.type}
                                </Badge>
                                <div className="text-xs text-muted-foreground flex items-center gap-2">
                                    <span>{doc.date}</span>
                                    <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                    <span>{doc.size}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Empty State (when no documents match) */}
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
