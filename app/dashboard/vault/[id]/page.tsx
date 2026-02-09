"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Download, Eye, Pencil, Trash2, FileText, Lock } from "lucide-react"

export default function DocumentDetailsPage() {
    const params = useParams()
    const id = params.id

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm text-muted-foreground animate-fade-in-up">
                <Link href="/dashboard/vault" className="hover:text-primary transition-colors">
                    Documents
                </Link>
                <ChevronRight className="h-4 w-4 mx-2" />
                <span className="hover:text-primary cursor-pointer transition-colors">Legal</span>
                <ChevronRight className="h-4 w-4 mx-2" />
                <span className="text-foreground font-medium">Marriage Certificate</span>
            </nav>

            <Card>
                <CardContent className="p-8 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-3xl md:text-4xl font-display font-medium tracking-tight">
                                    Marriage Certificate
                                </h1>
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[oklch(0.94_0.02_145)]">
                                    <Lock className="h-3.5 w-3.5 text-primary" />
                                    <span className="text-xs font-medium text-primary">Encrypted</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="blue" className="font-normal">
                                    Legal
                                </Badge>
                                <span className="text-sm text-muted-foreground">• PDF Document</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="rounded-xl">
                                <Eye className="mr-2 h-4 w-4" /> Preview
                            </Button>
                            <Button className="rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                <Download className="mr-2 h-4 w-4" /> Download
                            </Button>
                        </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-muted/50">
                        <div className="space-y-1.5">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">File Size</p>
                            <p className="font-medium">2.4 MB</p>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">File Type</p>
                            <p className="font-medium">PDF</p>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Upload Date</p>
                            <p className="font-medium">August 15, 2023</p>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Uploaded By</p>
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6 ring-2 ring-primary/20">
                                    <AvatarImage src="/avatars/jane.png" />
                                    <AvatarFallback className="bg-[oklch(0.94_0.06_45)] text-[oklch(0.45_0.12_45)] text-xs">JA</AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-sm">Jane Anderson</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                        <h3 className="font-display text-lg font-medium">Description</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Official marriage certificate for John and Jane Anderson, issued by the City of Springfield. 
                            Document includes the date of marriage, location, officiating party, and witness signatures. 
                            Scanned from the original document for digital safekeeping and easy access.
                        </p>
                    </div>

                    {/* Associated Members */}
                    <div className="space-y-4">
                        <h3 className="font-display text-lg font-medium">Associated Members</h3>
                        <div className="grid gap-3">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                                <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                                    <AvatarImage src="/avatars/john.png" />
                                    <AvatarFallback className="bg-primary/10 text-primary">JA</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-medium">John Anderson</p>
                                    <p className="text-sm text-muted-foreground">Spouse</p>
                                </div>
                                <Badge variant="sage">Primary</Badge>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                                <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                                    <AvatarImage src="/avatars/jane.png" />
                                    <AvatarFallback className="bg-primary/10 text-primary">JA</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-medium">Jane Anderson</p>
                                    <p className="text-sm text-muted-foreground">Spouse</p>
                                </div>
                                <Badge variant="sage">Primary</Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>

                {/* Footer Actions */}
                <div className="bg-muted/30 p-4 flex justify-end gap-3 border-t rounded-b-2xl">
                    <Button variant="outline" className="rounded-xl">
                        <Pencil className="mr-2 h-4 w-4" /> Edit Details
                    </Button>
                    <Button variant="destructive" className="bg-[oklch(0.94_0.03_15)] text-[oklch(0.50_0.12_15)] hover:bg-[oklch(0.92_0.05_15)] border-none shadow-none rounded-xl">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                </div>
            </Card>
        </div>
    )
}
