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
import { FileText, Lock, Upload, ShieldCheck, Search, File, CloudUpload } from "lucide-react"
import { cn } from "@/lib/utils"

const mockDocuments = [
    {
        id: "1",
        name: "Mortgage Agreement",
        type: "PDF",
        size: "2.1 MB",
        date: "May 20, 2024",
        category: "Property",
        color: "bg-red-100 text-red-700 hover:bg-red-100/80",
    },
    {
        id: "2",
        name: "Birth Certificate - John",
        type: "Passport",
        size: "1.5 MB",
        date: "Apr 15, 2024",
        category: "Personal",
        color: "bg-amber-100 text-amber-700 hover:bg-amber-100/80",
    },
    {
        id: "3",
        name: "Last Will & Testament",
        type: "DOCX",
        size: "800 KB",
        date: "Mar 02, 2024",
        category: "Legal",
        color: "bg-blue-100 text-blue-700 hover:bg-blue-100/80",
    },
    {
        id: "4",
        name: "Car Title - Honda Civic",
        type: "Deed",
        size: "1.2 MB",
        date: "Feb 28, 2024",
        category: "Property",
        color: "bg-green-100 text-green-700 hover:bg-green-100/80",
    },
    {
        id: "5",
        name: "Passport - Jane Doe",
        type: "Passport",
        size: "4.5 MB",
        date: "Jan 10, 2024",
        category: "Personal",
        color: "bg-amber-100 text-amber-700 hover:bg-amber-100/80",
    },
    {
        id: "6",
        name: "Home Insurance Policy",
        type: "PDF",
        size: "3.0 MB",
        date: "Dec 05, 2023",
        category: "Insurance",
        color: "bg-red-100 text-red-700 hover:bg-red-100/80",
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
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Upload className="mr-2 h-4 w-4" /> Upload Document
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[800px]">
                            <DialogHeader>
                                <DialogTitle>Upload New Document</DialogTitle>
                                <DialogDescription>
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
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select document type" />
                                            </SelectTrigger>
                                            <SelectContent>
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
                                    <Textarea id="description" placeholder="Add a short description... (optional)" className="h-24" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>File Upload</Label>
                                        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 cursor-pointer transition-colors h-[150px]">
                                            <CloudUpload className="h-8 w-8 text-muted-foreground mb-2" />
                                            <p className="text-sm font-medium text-blue-600">Click to upload <span className="text-muted-foreground">or drag and drop</span></p>
                                            <p className="text-xs text-muted-foreground mt-1">PDF, PNG, JPG, DOCX (MAX. 10MB)</p>
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Associated Family Members (optional)</Label>
                                        <div className="border rounded-md p-2 h-[150px] overflow-y-auto space-y-1">
                                            {["John Miller", "Jane Miller", "Sam Miller", "Emily Miller"].map((member) => (
                                                <div key={member} className="flex items-center gap-2 px-2 py-1 hover:bg-muted rounded cursor-pointer">
                                                    <div className="h-4 w-4 rounded border" />
                                                    <span className="text-sm">{member}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline">Cancel</Button>
                                <Button className="bg-blue-600 hover:bg-blue-700">Upload</Button>
                            </DialogFooter>
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
                    <Link href={`/dashboard/vault/${doc.id}`} key={doc.id}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-gray-500" />
                                </div>
                                <Lock className="h-4 w-4 text-gray-400" />
                            </CardHeader>
                            <CardContent className="pt-4">
                                <h3 className="font-semibold text-base mb-2 truncate">{doc.name}</h3>
                                <Badge variant="secondary" className={cn("mb-4 font-normal", doc.color)}>
                                    {doc.type}
                                </Badge>
                                <div className="text-xs text-muted-foreground">
                                    {doc.date} • {doc.size}
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
