"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Download, Eye, Pencil, Trash2, FileText } from "lucide-react"

export default function DocumentDetailsPage() {
    const params = useParams()
    const id = params.id

    return (
        <div className="space-y-6">
            {/* Breadcrumbs */}
            <div className="flex items-center text-sm text-muted-foreground">
                <Link href="/dashboard/vault" className="hover:text-foreground">
                    Documents
                </Link>
                <ChevronRight className="h-4 w-4 mx-2" />
                <span className="hover:text-foreground cursor-pointer">Legal</span>
                <ChevronRight className="h-4 w-4 mx-2" />
                <span className="text-foreground font-medium">Marriage Certificate</span>
            </div>

            <Card>
                <CardContent className="p-6 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">
                                John & Jane - Marriage Certificate
                            </h1>
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100/80 border-none">
                                Legal
                            </Badge>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline">
                                <Eye className="mr-2 h-4 w-4" /> Preview
                            </Button>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Download className="mr-2 h-4 w-4" /> Download
                            </Button>
                        </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-b">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">File Size</p>
                            <p className="font-medium">2.4 MB</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">File Type</p>
                            <p className="font-medium">PDF</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Upload Date</p>
                            <p className="font-medium">August 15, 2023</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Uploaded By</p>
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src="/avatars/jane.png" />
                                    <AvatarFallback className="bg-orange-100 text-orange-600 text-xs">JA</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">Jane Anderson</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">Description</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Official marriage certificate for John and Jane Anderson, issued by the City of Springfield. Document includes the date of marriage, location, officiating party, and witness signatures. Scanned from the original document for digital safekeeping and easy access.
                        </p>
                    </div>

                    {/* Associated Members */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Associated Members</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src="/avatars/john.png" />
                                    <AvatarFallback>JA</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">John Anderson</p>
                                    <p className="text-sm text-muted-foreground">Spouse</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src="/avatars/jane.png" />
                                    <AvatarFallback>JA</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">Jane Anderson</p>
                                    <p className="text-sm text-muted-foreground">Spouse</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>

                {/* Footer Actions */}
                <div className="bg-muted/30 p-4 flex justify-end gap-2 border-t rounded-b-lg">
                    <Button variant="outline" className="bg-white">
                        <Pencil className="mr-2 h-4 w-4" /> Edit Details
                    </Button>
                    <Button variant="destructive" className="bg-red-50 text-red-600 hover:bg-red-100 border-none shadow-none">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                </div>
            </Card>
        </div>
    )
}
